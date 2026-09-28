# 19 — SaaS platform architecture: tenancy, configuration, capabilities, vertical packs and templates

**Source:** `docs/SAAS_ARCHITECTURE_CHANGE.md` (code **SAAS**), recorded as `D-227`–`D-256` in `DECISIONS.md`.
**Companion file:** `20-root-admin.md` (the Configurable Root Admin platform — separate portal and codebase).
**Authority:** SAAS decides the *architecture*; BP/MEET/PR1/PR2 decide what *a store* must do (`00-conventions.md`
§1, §2). This file never changes a BP business rule; it changes who the rule applies to and how it is switched on.

Read this file before any task in modules **M30–M35**, before any task that adds a store-facing screen, API or
setting, and before changing anything in `frontend/`, `backend/` or `root-admin/`.

---

## 1. What changed, in one table

| Before (plan v1, 2026-09-27) | After (SAAS, 2026-09-28) |
|---|---|
| One business: Tradex, an electronics retailer | One **platform**; Tradex is store #1 (`store:tradex`, pack `VP-electronics`) |
| Requirements hard-coded to electronics (serials, compatibility, refurbished grades) | Requirements belong to a **vertical pack**; the code is generic |
| One storefront design | Many **templates**; the store's template is configuration |
| Settings scattered per module | One **configuration model** with a schema, layers and versions (`§3`) |
| Admin = the store's ERP settings screen (P-E15) | Two admins: **store admin** (P-E15, inside one store) and **Configurable Root Admin** (P-R01–P-R12, separate platform) |
| `D-045`: "Later; prepare boundaries without building SaaS" | **Superseded by `D-227`.** SaaS is Phase 1 architecture |
| Single-tenant data model | Every store-scoped row carries `store_id` (`§10`) |

**The one sentence that must survive every session:** *there is exactly one store codebase; a store's category,
features, terminology, look and behaviour come from a compiled configuration artefact, and store users must never
be able to tell that any of this exists.*

## 2. The two platforms (SAAS §3 S04, S23 · `D-228`)

```
┌──────────────────────────────────────────┐        ┌──────────────────────────────────────────────┐
│ ROOT ADMIN PLATFORM    (root-admin/)     │        │ STORE PLATFORM      (frontend/ + backend/)   │
│ separate codebase · portal · hostname    │        │ one codebase, many stores                    │
│ separate auth realm · separate database  │        │                                              │
│                                          │        │  storefront   workspace   vendor portal      │
│  P-R01…P-R12  ·  M34                     │        │  P-S*          P-E*        P-V*              │
│  packs · templates · capabilities        │        │  M01–M27 (business modules, unchanged)       │
│  store registry · configurator · deploy  │        │  M30 tenancy · M31 config · M32 packs        │
│                                          │        │  M33 templates · M35 deploy agent            │
└───────────────┬──────────────────────────┘        └───────────────▲──────────────────────────────┘
                │                                                   │
                │ compile + publish (one-way, immutable, versioned) │
                └──────────► config artefact (object storage + on-disk copy) ────┘
```

Hard separation rules (tested by `TS-SAAS-SEP`):

| # | Rule | Why |
|---|---|---|
| SEP-1 | The store runtime **never** connects to the root admin database, and never calls a root admin API on the request path | One-way dependency; a root admin outage cannot take stores down |
| SEP-2 | The root admin **never** imports store business code; it reads store data only through a read-only reporting replica or a published store API with a platform credential | Codebase separation (S04) |
| SEP-3 | No shared session, cookie domain, token issuer or user table between the two platforms | `D-245` |
| SEP-4 | The only artefacts crossing the boundary are: the **config artefact** (root → store) and **deployment/health callbacks** (store → root, out of band) | Auditable, versioned, replayable |
| SEP-5 | `root-admin/` has its own dependency manifest, build, tests and deploy pipeline | S04 |
| SEP-6 | Nothing in `frontend/` or `backend/` may `import`/`require` anything under `root-admin/`, and vice versa. Enforced by a lint rule and a CI check | `TS-SAAS-SEP-01` |

## 3. Configuration model (SAAS §3 S12 · `D-230`, `D-231`)

### 3.1 Layers — lowest priority first

| Layer | Name | Lives in | Who writes it | In the artefact? |
|---|---|---|---|---|
| **L0** | Platform defaults | Store codebase (`backend/platform/config/defaults/`), versioned with the release | Engineering | yes (baked at compile) |
| **L1** | Vertical pack defaults | Root admin DB (`E-vertical_pack_version`) | Pack author (root admin) | yes |
| **L2** | Template defaults | Root admin DB (`E-template_version`) | Template author (root admin) | yes |
| **L3** | Store configuration | Root admin DB (`E-store_config_version`) | Configurable Root Admin | yes — **authoritative** |
| **L4** | Store-editable settings | Store DB (`E-store_setting`) | Store owner / representative admin, only for keys marked `store_editable` and not `locked` | no — layered at runtime from an in-memory snapshot |
| **L5** | Environment override | Environment variables / secret store | Operations only | applied at boot, never from user input |

Resolution = `L5 ?? L4 ?? L3 ?? L2 ?? L1 ?? L0`, evaluated **once** per configuration version, not per request.

### 3.2 Configuration schema (`CFG-*`)

Every configuration key is declared once, in code, in a typed schema registry (`backend/platform/config/schema/`).
A key that is not in the schema cannot be stored, compiled or read — the compiler rejects it.

Each key declares:

| Field | Meaning |
|---|---|
| `key` | `CFG-<section>.<name>`, e.g. `CFG-catalog.variant_axes`, `CFG-checkout.guest_allowed` |
| `type` | `bool` · `int` · `money` · `enum` · `string` · `locale_string` · `list<T>` · `map<K,V>` · `asset_ref` · `color` · `duration` |
| `default` | L0 value (never `null` unless the key is optional) |
| `scope` | `platform` · `pack` · `template` · `store` |
| `editable_by` | `root_only` · `store_editable` · `store_editable_unless_locked` |
| `lockable` | whether the root admin may lock it against store edits (`§9` rule INV-4) |
| `requires_capability` | the key only has meaning when that capability is on |
| `validation` | range / regex / referential rule; run by the compiler **and** by the writing API |
| `restart_impact` | `hot` (swap at reload) · `warm` (reload + cache flush) · `cold` (requires redeploy, e.g. tenancy isolation mode) |
| `pii` | whether the value may contain personal data (affects logs and exports) |
| `doc` | one-line plain-language description, reused by the root admin UI and by the store admin UI where the key is store-editable |

Sections (initial): `identity`, `branding`, `theme`, `locale`, `catalog`, `variants`, `inventory`, `pricing`,
`tax`, `checkout`, `payments`, `fulfilment`, `returns`, `customers`, `b2b`, `vendor`, `support`, `notifications`,
`automation`, `reporting`, `search`, `seo`, `security`, `tenancy`, `integrations`, `workspace`, `storefront`,
`terminology`, `capabilities`.

### 3.3 Where configuration is stored (S12)

All of L1–L3 lives in the **root admin database** — that is the database-driven configuration the brief requires.
L4 lives in the store database. Nothing is configured by editing a file by hand: the on-disk artefact of `§4` is
**generated**, never edited (`BR-M31-07`).

### 3.4 Versioning

`E-store_config_version` is immutable and append-only: `store_id`, `version` (monotonic int), `pack_version_id`,
`template_version_id`, `values` (only the keys that differ from the layers below), `compiled_checksum`,
`published_at`, `published_by`, `notes`, `supersedes`. Rollback = publish an earlier version; no destructive edit
ever exists. Draft edits live in `E-store_config_draft` and never affect a running store.

## 4. Runtime configuration and performance (SAAS §3 S13–S15 · `D-231`, `D-232`, `D-248`)

### 4.1 The rule

> **No configuration value may cause a database query, a file read, a JSON parse or a network call on the request
> path.** (`BR-M31-01`)

Configuration is read from a single pre-built, immutable, in-process object. Building that object happens at boot
or during a reload, never while serving a request.

### 4.2 The config artefact (S14 — "a configurable file on disk")

The root admin compiles L0–L3 into an immutable artefact set, stores it in object storage, and the store runtime
keeps a local copy on disk so a cold boot needs neither the network nor a database:

```
config/generated/<store_key>/
├── current                      # pointer file: {"version": 42, "checksum": "sha256:…"}
└── v42/
    ├── manifest.json            # store id/key, version, built_at, pack + pack version, template + template version,
    │                            #   locales, schema hash, platform release the artefact was built for
    ├── config.json              # every CFG-* key resolved to its L3 value (flat map, sorted, no comments)
    ├── capabilities.json        # effective capability set + the stable bit index used by the runtime bitset
    ├── navigation.json          # storefront, workspace and vendor navigation trees, already gated
    ├── catalog-schema.json      # category tree, attribute schemas, variant axes, units of measure, identity model
    ├── terminology.<locale>.json# every TT-* token resolved for that locale
    ├── theme.json               # design tokens as data (for emails, PDFs, the mobile app in Phase 2)
    ├── theme.css                # compiled CSS custom properties; hashed filename; immutable cache headers
    ├── assets.json              # URLs + checksums of logo variants, favicon, OG image, template assets
    └── checksum.sha256          # over every file above
```

Rules: artefacts are **immutable** (a change is always a new version); every file is checksummed and the runtime
refuses an artefact whose checksum, schema hash or platform release does not match (`BR-M31-04`, fail closed, keep
serving the previous version); artefacts are retained for at least the last 20 versions per store so rollback is
instant.

### 4.3 The loader

1. **Boot:** read `current` → load `v<N>` from disk (fall back to object storage if missing) → verify checksum and
   schema hash → parse once → build the immutable `StoreConfig` object (frozen maps, capability bitset, pre-resolved
   terminology map, pre-resolved navigation trees) → register it in the process-wide `StoreRegistry`.
2. **Per request:** resolve host → `store_id` via a preloaded `host → store` map (`O(1)`), attach the frozen
   `StoreConfig` to the request context. Zero I/O.
3. **Access API:** `cfg.get(CFG_KEY)` → map lookup; `cfg.can(CAP_KEY)` → bitset test; `cfg.t(TT_TOKEN)` → map
   lookup. No string parsing, no reflection, no lazy DB fallback — a missing key is a programming error caught by
   the compiler and by `TS-SAAS-CFG-02`.
4. **Memory:** one shared frozen object per store per process. Budget ≤ 5 MB per store. A runtime hosting more than
   200 stores uses an LRU of compiled configs with the busiest stores pinned; eviction never happens mid-request.

### 4.4 Reload and invalidation (S15 · `D-232`)

| Step | Actor | Behaviour |
|---|---|---|
| 1 | Root admin | Publishes config version N+1 → writes the artefact → records `E-config_publication` |
| 2 | Root admin | Emits `config.published{store_id, version, checksum}` through the outbox (at-least-once, idempotent) |
| 3 | Store runtime | Receives the event (pub/sub) **or**, as a fallback, polls the single `current` pointer at most every 30 s. Polling reads one small object; it is never on the request path |
| 4 | Store runtime | Downloads + verifies + parses + builds the new object **off the request path** |
| 5 | Store runtime | Atomic pointer swap. In-flight requests finish on the old object; new requests get the new one |
| 6 | Store runtime | Reports `config.applied{store_id, version, instance, at}` back to the root admin (out of band, SEP-4) |
| 7 | Failure | Keep the previous object, open an `E-exception_case`, alert, and mark the store "config drift" in the root admin until resolved |

`restart_impact = cold` keys (e.g. `CFG-tenancy.isolation`, `CFG-tenancy.database`) are refused by the hot-reload
path; the root admin schedules a deployment instead (`20 §5`).

L4 store-editable settings use the same mechanism at a smaller scale: the settings service writes the store DB,
bumps `E-store_setting_version`, and broadcasts an in-cluster invalidation; instances rebuild only the L4 overlay.
A store-settings write is a rare admin action, not a request-path operation.

### 4.5 Performance budget (`D-248`) — these are acceptance criteria, not aspirations

| Budget | Target | Verified by |
|---|---|---|
| Database queries for configuration per request | **0** | `TS-SAAS-PERF-01` (query recorder around a full page render) |
| File reads / JSON parses for configuration per request | **0** | `TS-SAAS-PERF-01` |
| `cfg.get` / `cfg.can` / `cfg.t` | `O(1)`, ≤ 1 µs p99 in a microbenchmark | `TS-SAAS-PERF-02` |
| Host → store resolution | `O(1)` map lookup, no I/O | `TS-SAAS-PERF-01` |
| Artefact load at boot (1 MB artefact) | ≤ 200 ms | `TS-SAAS-PERF-03` |
| Reload propagation to all instances | ≤ 30 s p95, ≤ 120 s p100 | `TS-SAAS-PERF-04` |
| Added latency vs a hard-coded single-store build | ≤ 2 ms p95 on the storefront category page | `TS-SAAS-PERF-05` |
| `theme.css` | static, hashed filename, `Cache-Control: public, max-age=31536000, immutable` | `TS-SAAS-PERF-06` |
| Memory per store per process | ≤ 5 MB | `TS-SAAS-PERF-03` |

These sit **on top of** the existing BP §20.1 targets (`D-034`); the SaaS layer may not consume more than the
budget above out of them.

## 5. Capabilities and feature gating (SAAS §3 S10 · `D-236`)

### 5.1 Model

A **capability** (`CAP-<UPPER_SNAKE>`) is one switchable unit of product behaviour. It is declared once in the
capability registry (`backend/platform/capabilities/registry.*`) with: id, area (module M##), plain-language name,
description, `depends_on` (other capabilities), `conflicts_with`, `default_state` per pack, `lockable`,
`data_retaining` (whether turning it off hides data that still exists), and the `CFG-*` keys it governs.

A capability is **not** a permission. Permissions (`07-auth-roles-permissions.md`) decide *who* inside a store may
do something; capabilities decide *whether the store has the thing at all*.

### 5.2 Enforcement points — all six are mandatory (`BR-M31-02`)

| # | Point | Behaviour when the capability is off |
|---|---|---|
| 1 | Navigation / routing | The entry does not exist in `navigation.json`; the route is not registered |
| 2 | API | The endpoint returns **404** (not 403) and is absent from the store's generated API surface. 403 would disclose the feature's existence (`§9` INV-3) |
| 3 | Service layer | Guard clause throws `CapabilityDisabled`; defence in depth for internal callers and jobs |
| 4 | UI components | The component is not rendered and its bundle is not loaded (code-split per capability group) |
| 5 | Jobs / automations | Not registered with the scheduler; queued messages for a disabled capability are dead-lettered with a reason |
| 6 | Data & exports | Rows for a disabled capability are excluded from exports, search indexes, reports and notifications |

Disabling a capability **never deletes data** (`BR-M31-03`). Re-enabling restores visibility. Disabling a
`data_retaining` capability requires an explicit acknowledgement in the root admin.

### 5.3 Capability catalogue — everything that can be granted or withheld per store (`D-273`)

This is the full list of switchable behaviour. **Every feature a client might buy, or might not, is here** —
including the communication channels (WhatsApp, email, SMS, web chat, push), the automations, the integrations
and the store's own API access. If a behaviour is not in this catalogue it cannot be switched, which is the point:
a feature that is not a capability is a feature nobody can grant, withhold or price.

**The `Build` column is not the same as the switch.** Listing a capability says the platform's *control model*
knows about it; it does not mean it is built, and it never overrides source fidelity (`00-conventions.md` §2):

| Build value | Meaning |
|---|---|
| `1A`, `1B` | In scope for that stage; the task tracker has the work |
| `LATER` | Phase 2/3 (`D-085`, `D-046`); listed so the switch exists when it arrives |
| `CANDIDATE (D-###)` | The platform can express it, but **it is not built until that decision approves it**. A store cannot be granted a capability whose build status is `CANDIDATE` while the decision is open — the compiler refuses it (`BR-M31-17`) |

Defaults shown in brackets are for `VP-electronics` (the Tradex store). Every capability additionally carries a
**control state** per store — not available / available and locked / delegated to the store's administrator
(`§5.4.3`).

#### A. Catalogue and products (M04, M21, M22)

| Capability | What the store gets | Build |
|---|---|---|
| `CAP-ATTRIBUTE_SCHEMAS` [on] · `CAP-BRANDS` [on] · `CAP-VARIANTS` [on] · `CAP-VARIANT_MATRIX` [off] | Typed product attributes, brands, variants and two-axis variant grids | 1A |
| `CAP-SERIAL_TRACKING` [on] · `CAP-BATCH_LOT` [off] · `CAP-EXPIRY_DATES` [off] · `CAP-UNIQUE_ITEMS` [off] | The four item-identity models | 1A |
| `CAP-CONDITION_GRADES` [on] · `CAP-COMPATIBILITY` [on] · `CAP-BUNDLES` [`D-072`] | Condition grading, "fits your device", bundle products | 1A / CANDIDATE |
| `CAP-DIGITAL_PRODUCTS` · `CAP-SERVICE_ITEMS` · `CAP-MADE_TO_ORDER` · `CAP-RENTAL_ITEMS` · `CAP-SUBSCRIPTION_PLANS` · `CAP-WEIGHT_PRICED_ITEMS` [all off] | The non-physical and non-standard product kinds | 1A contracts, per-pack build |
| `CAP-SIZE_GUIDE` · `CAP-PRODUCT_MEDIA_360` · `CAP-PRODUCT_VIDEO` · `CAP-PRODUCT_DOCUMENTS` [off] | Size guides, 360° spins, video, datasheets and manuals | 1A / CANDIDATE (`D-113`) |
| `CAP-CATALOG_IMPORT` [1B] · `CAP-MEDIA_IMPORT` [1B] · `CAP-SUPPLIER_FEEDS` [1B] | Validated bulk import and supplier catalogue feeds | 1B |
| `CAP-CATALOG_REVIEW` [on] · `CAP-CATALOG_VERSIONS` [on] | A review step before a product or a sensitive edit goes live, and the version history behind it | 1A |
| `CAP-PERSONALISATION` · `CAP-PRODUCT_CONFIGURATOR` · `CAP-PRODUCTION_LEAD_TIME` [off] | Made-to-order configuration and lead times | per-pack |
| `CAP-LICENCE_KEYS` · `CAP-DOWNLOAD_LIMITS` [off] | Digital fulfilment artefacts | per-pack |
| `CAP-PROVENANCE` · `CAP-AUTHENTICATION_RECORD` · `CAP-HIGH_VALUE_CONTROLS` [off] | Provenance and authentication for high-value goods | per-pack |
| `CAP-COMPLIANCE_ATTRIBUTES` · `CAP-RESTRICTED_DELIVERY` · `CAP-DOCUMENT_CAPTURE` · `CAP-PRESCRIPTION_GATE` [off] | Regulated-goods handling | per-pack |

#### B. Pricing and promotions (M05)

| Capability | What the store gets | Build |
|---|---|---|
| `CAP-PRICE_LISTS` [on] · `CAP-QUANTITY_TIERS` [on] · `CAP-MARGIN_FLOORS` [on] · `CAP-QUOTES` [on] | Core pricing, quantity breaks, margin protection, quotations | 1A |
| `CAP-PROMOTIONS` · `CAP-COUPONS` [`D-043`] | Campaign pricing and discount codes | CANDIDATE (`D-043`) |
| `CAP-LOCATION_PRICING` [`D-044`] · `CAP-CONTRACT_PRICING` [off] · `CAP-UNIT_PRICE_DISPLAY` [off] | Price by location, negotiated contract prices, price-per-unit display | CANDIDATE / per-pack |
| `CAP-COST_SIGNALS` [on] · `CAP-PRICE_CHANGE_APPROVAL` [on] | Supplier cost-change signals and the approval gate before a live price moves | 1A |

#### C. Inventory and stock (M06)

`CAP-MULTI_LOCATION` [on] · `CAP-BINS` [on] · `CAP-RESERVATIONS` [on] · `CAP-TRANSFERS` [on] ·
`CAP-CYCLE_COUNTS` [on] · `CAP-STOCK_ADJUSTMENTS` [on] · `CAP-SUPPLIER_AVAILABILITY` [on] ·
`CAP-SAFETY_BUFFER` [on] · `CAP-COLD_CHAIN` [off] · `CAP-SHELF_LIFE_RULES` [off] ·
`CAP-AVAILABILITY_CALENDAR` [off] · `CAP-CAPACITY_SLOTS` [off] — all 1A except the per-pack ones.

#### D. Purchasing and suppliers (M07)

`CAP-PURCHASE_ORDERS` [on] · `CAP-GOODS_RECEIPT` [on] · `CAP-QC_INSPECTION` [on] · `CAP-SUPPLIER_BILLS` [on] ·
`CAP-REORDER_RULES` [on] · `CAP-LANDED_COST` [`D-056`] · `CAP-SUPPLIER_PRICE_LISTS` [on] — 1A.

#### E. Customers, accounts and trade (M08)

`CAP-CUSTOMER_ACCOUNTS` [on] · `CAP-GUEST_CHECKOUT` [`D-021`] · `CAP-CUSTOMER_SEGMENTS` [on] ·
`CAP-BUSINESS_ACCOUNTS` [on] · `CAP-DEALER_APPLICATIONS` [on] · `CAP-ACCOUNT_MEMBERS` [on] ·
`CAP-CREDIT_TERMS` [`D-019`] · `CAP-REORDER_LISTS` [off] · `CAP-CUSTOMER_TAGS` [`D-145`] ·
`CAP-CUSTOMER_MERGE` [`D-133`] · `CAP-PRIVACY_REQUESTS` [on, `D-060`] — 1A, some CANDIDATE.

#### F. Storefront, browsing and content (M09, M27)

| Capability | What the store gets | Build |
|---|---|---|
| `CAP-CURATED_COLLECTIONS` [on] · `CAP-STORE_LOCATOR` [on] · `CAP-HELP_CENTRE` [on] | Merchandised collections, branch finder, help and policy pages | 1A |
| `CAP-COMPARE` · `CAP-WISHLIST` [`D-042`] · `CAP-REVIEWS` [`D-041`] · `CAP-PRODUCT_QA` [`D-065`] · `CAP-STOCK_ALERTS` [`D-141`] | The engagement features a client may or may not want | CANDIDATE |
| `CAP-RECENTLY_VIEWED` · `CAP-RECOMMENDATIONS` [off] | Browsing history rails and "related items" | CANDIDATE (`D-142`) |
| `CAP-AGE_GATE` [off] · `CAP-B2B_ONLY_STOREFRONT` [off] | Age confirmation; a storefront only signed-in trade buyers can see | CANDIDATE |
| `CAP-CMS_PAGES` · `CAP-BLOG` · `CAP-BANNERS` · `CAP-ANNOUNCEMENT_BAR` [off] | Editable content pages, articles, promotional banners and a site-wide notice | CANDIDATE (`D-274`) |
| `CAP-SEO_TOOLS` [on] · `CAP-STRUCTURED_DATA` [on] · `CAP-SITEMAP` [on] · `CAP-REDIRECT_MANAGER` [on] | SEO control, rich results, sitemaps, redirect map | 1A |
| `CAP-MULTI_LOCALE` [off] · `CAP-MULTI_CURRENCY` [off] · `CAP-RTL_LAYOUT` [off] | Several languages, several currencies, right-to-left layouts | CANDIDATE (`D-050`) |

#### G. Cart, checkout and orders (M10)

`CAP-CART_SERVER_SIDE` [`D-129`] · `CAP-SAVE_FOR_LATER` [on] · `CAP-ASSISTED_ORDERS` [on] ·
`CAP-PARTIAL_DISPATCH` [`D-029`] · `CAP-BACKORDERS` [`D-073`] · `CAP-PREORDERS` [off] ·
`CAP-SCHEDULED_DELIVERY_SLOTS` [off] · `CAP-MIN_ORDER_VALUE` [off] · `CAP-ORDER_NOTES` [`D-134`] ·
`CAP-GIFT_MESSAGE` [off] · `CAP-ORDER_EDITING` [off] — 1A and CANDIDATE.

#### H. Payments and refunds (M11)

`CAP-ONLINE_PAYMENTS` [on] · `CAP-COD` [`D-020`] · `CAP-EMI` [`D-062`] · `CAP-BANK_TRANSFER` [on] ·
`CAP-PART_PAYMENT` [off] · `CAP-DEPOSITS` [off] · `CAP-WALLET_CREDIT` [off] · `CAP-GIFT_CARDS` [off] ·
`CAP-STORE_CREDIT_REFUNDS` [off] · `CAP-SETTLEMENT_IMPORT` [on, `D-064`] · `CAP-REFUND_APPROVALS` [on] — 1A
and CANDIDATE.

#### I. Delivery and fulfilment (M12)

`CAP-COURIER_SHIPPING` [on] · `CAP-STORE_PICKUP` [`D-061`] · `CAP-LOCAL_DELIVERY` [off] ·
`CAP-FREIGHT_BULKY` [off] · `CAP-DIGITAL_DELIVERY` [off] · `CAP-SERVICE_APPOINTMENTS` [off] ·
`CAP-RENTAL_LOGISTICS` [off] · `CAP-PICK_WAVES` [`D-132`] · `CAP-PACKING_SLIPS` [on] ·
`CAP-SHIPPING_LABELS` [on] · `CAP-TRACKING_PAGE` [on] · `CAP-DELIVERY_PROOF` [off] ·
`CAP-SHIPPING_RULES` [`D-162`] · `CAP-SERVICE_AREAS` [off] — 1A and per-pack.

#### J. Returns, exchanges and warranty (M13)

`CAP-RETURNS` [on] · `CAP-EXCHANGES` [off] · `CAP-WARRANTY_CASES` [on] · `CAP-SUPPLIER_RMA` [on] ·
`CAP-NON_RETURNABLE_CLASSES` [off] · `CAP-REVERSE_PICKUP` [on] · `CAP-RETURN_CONDITION_CHECK` [off] — 1A.

#### K. Vendor and supplier portal (M14)

`CAP-VENDOR_PORTAL` [1B] · `CAP-VENDOR_SUBMISSIONS` [1B] · `CAP-VENDOR_AVAILABILITY_FEED` [1B] ·
`CAP-VENDOR_STATEMENTS` [1B] · `CAP-VENDOR_PERFORMANCE` [1B] · `CAP-VENDOR_MESSAGING` [1B] ·
`CAP-SUPPLIER_FULFILMENT` [`D-073`] · `CAP-VENDOR_API_KEYS` [1B] · `CAP-MARKETPLACE` [LATER, M15].

#### L. Communications and messaging (M16, M20) — **the channels a client is granted or not**

This is the area the platform is most often asked to price per client, so every channel and every level within a
channel is its own capability. Turning a channel on additionally requires a **verified provider binding**
(`§5.6`) — a store cannot be "given WhatsApp" and then silently fail to send.

| Capability | What the store gets | Build |
|---|---|---|
| `CAP-EMAIL_TRANSACTIONAL` [on] | Order, delivery, account, return and support emails | 1A |
| `CAP-EMAIL_CUSTOM_SENDER` [on] | Sending from the client's own domain, with SPF, DKIM and DMARC verification | 1A |
| `CAP-EMAIL_MARKETING` [off] | Newsletters and campaigns, with consent, preference centre and unsubscribe | CANDIDATE (`D-275`) |
| `CAP-SMS_TRANSACTIONAL` [`D-015`] | Order and delivery updates by SMS | 1A |
| `CAP-SMS_OTP` [`D-040`] | One-time codes by SMS for sign-in and verification | 1A |
| `CAP-SMS_MARKETING` [off] | Promotional SMS, consent-gated | CANDIDATE (`D-275`) |
| `CAP-WHATSAPP_CLICK_TO_CHAT` [on] | A "message us on WhatsApp" entry point on the storefront and in emails | 1A |
| `CAP-WHATSAPP_NOTIFICATIONS` [on] | Order and delivery updates on WhatsApp using approved templates | 1A |
| `CAP-WHATSAPP_ASSISTED_ORDERS` [on] | Staff turn a WhatsApp conversation into a basket and a payment link | 1A |
| `CAP-WHATSAPP_GUIDED_ORDERING` [1B] | The guided ordering conversation (Level 2) | 1B |
| `CAP-WHATSAPP_SHARED_INBOX` [1B] | A staff shared inbox with assignment, notes and SLA timers | 1B |
| `CAP-WEB_CHAT` [off] | A live chat widget on the storefront, with staff replies in the workspace | CANDIDATE (`D-276`) |
| `CAP-WEB_CHAT_AUTO_ANSWERS` [off] | Approved answers and guided help before a person joins | CANDIDATE (`D-276`) |
| `CAP-WEB_CHAT_HANDOFF` [off] | Hand a web chat to a person, or continue it on WhatsApp | CANDIDATE (`D-276`) |
| `CAP-PUSH_WEB` [off] | Browser push notifications, consent-gated | CANDIDATE (`D-275`) |
| `CAP-PUSH_MOBILE` [LATER] | Mobile app push | LATER (Phase 2) |
| `CAP-IN_APP_MESSAGES` [off] | Messages in the customer's account area | CANDIDATE (`D-275`) |
| `CAP-CONTACT_FORMS` [on] · `CAP-CALLBACK_REQUESTS` [on] | Enquiry forms and call-back requests into the support queue | 1A |
| `CAP-SUPPORT_TICKETS` [on] · `CAP-SUPPORT_SLA_TIMERS` [1B] | Ticketing, ownership, escalation and response targets | 1A / 1B |
| `CAP-MESSAGE_TEMPLATES` [on] | Versioned, approved message templates per channel and language | 1A |
| `CAP-NOTIFICATION_PREFERENCES` [on] | Customers choose which channels they hear from | 1A |
| `CAP-CONSENT_CAPTURE` [on] | Consent recorded per channel and purpose, with proof and withdrawal | 1A |
| `CAP-FREQUENCY_CAPS` [on] · `CAP-QUIET_HOURS` [off] | Limits on how often and when a customer may be messaged | 1A / CANDIDATE |
| `CAP-STAFF_NOTIFICATIONS` [on] · `CAP-OWNER_DIGEST` [on, `D-063`] | In-workspace alerts and the scheduled owner summary | 1A |

#### M. Marketing and engagement (M09, M05, M20)

| Capability | What the store gets | Build |
|---|---|---|
| `CAP-ABANDONED_CART_RECOVERY` [off] | Reminders for baskets left behind, on the channels the store has | CANDIDATE (`D-275`) |
| `CAP-BACK_IN_STOCK_ALERTS` [`D-141`] · `CAP-PRICE_DROP_ALERTS` [`D-141`] | "Tell me when it is back" and "tell me if it gets cheaper" | CANDIDATE |
| `CAP-REVIEW_REQUESTS` [off] | Ask for a review after delivery | CANDIDATE (`D-041`) |
| `CAP-LOYALTY_POINTS` · `CAP-REFERRALS` · `CAP-GIFT_CARDS` [off] | Loyalty, referral and gift-card programmes | CANDIDATE (`D-275`) |
| `CAP-CAMPAIGN_SEGMENTS` [off] | Build an audience from customer data for a campaign | CANDIDATE (`D-275`) |
| `CAP-ANALYTICS_TAGS` [off] | Marketing and analytics tags, consent-gated and named in the privacy notice | CANDIDATE (`D-277`) |
| `CAP-SOCIAL_LINKS` [on] | Social profile links in the storefront | 1A |

#### N. Automation, approvals and exceptions (M17) — **each automation is its own switch**

The rule engine is one capability; **every individual automation is another**, so a client can be given exactly
the automations they are paying for. The catalogue mirrors BP §12.2 A01–A38 (`D-078` selects the launch set).

| Capability | What the store gets |
|---|---|
| `CAP-AUTOMATION_RULES` [on] | The per-module rule engine, its run log and its manual override |
| `CAP-AUTO_STOCK_SYNC` · `CAP-AUTO_REORDER_SUGGESTIONS` · `CAP-AUTO_LOW_STOCK_ALERT` · `CAP-AUTO_SUPPLIER_FRESHNESS` | Inventory and purchasing automations |
| `CAP-AUTO_PAYMENT_RECONCILIATION` · `CAP-AUTO_SETTLEMENT_IMPORT` · `CAP-AUTO_REFUND_STATUS` | Money automations |
| `CAP-AUTO_ORDER_ACKNOWLEDGEMENT` · `CAP-AUTO_DISPATCH_UPDATES` · `CAP-AUTO_DELIVERY_UPDATES` · `CAP-AUTO_RETURN_ACKNOWLEDGEMENT` | Customer status messages, on whichever channels the store has |
| `CAP-AUTO_RESERVATION_EXPIRY` · `CAP-AUTO_PRICE_CHANGE_REVIEW` · `CAP-AUTO_CATALOG_PUBLISH_CHECKS` | Operational guards |
| `CAP-AUTO_EXCEPTION_ESCALATION` · `CAP-AUTO_OWNER_DIGEST` · `CAP-AUTO_SCHEDULED_REPORTS` · `CAP-AUTO_ACCOUNTING_EXPORT` | Oversight and finance automations |
| `CAP-APPROVAL_WORKFLOWS` [on] · `CAP-APPROVAL_THRESHOLDS` [on] · `CAP-DELEGATION` [on] · `CAP-EXCEPTION_QUEUES` [on] | Approvals, limits, cover during absence, exception work queues |
| `CAP-AUTOMATION_VALUE_TRACKING` [on, `D-193`] | Hours and money saved per rule, from the job log |

An automation whose capability is off is **never registered with the scheduler**, so it cannot run, cannot appear
in a report and cannot send a message (`§5.2` point 5).

#### O. Reporting, analytics and finance (M18, M19)

`CAP-STANDARD_REPORTS` [on] · `CAP-SAVED_VIEWS` [on] · `CAP-SCHEDULED_REPORTS` [on] · `CAP-DATA_EXPORTS` [on] ·
`CAP-OWNER_DASHBOARD` [on] · `CAP-CUSTOM_REPORT_REQUESTS` [on] · `CAP-ACCOUNTING_EXPORT` [on, `D-011`] ·
`CAP-ACCOUNTING_API` [`D-011`] · `CAP-DAY_CLOSE` [on] · `CAP-TAX_INVOICES` [on, `D-037`] ·
`CAP-EINVOICING` [`D-037`] · `CAP-EWAY_BILL` [`D-037`] — 1A and CANDIDATE.

#### P. Integrations and extensibility (M23)

| Capability | What the store gets | Build |
|---|---|---|
| `CAP-STORE_API` [off] | The client's own API keys and scopes, so their systems can read and write their store | CANDIDATE (`D-278`) |
| `CAP-WEBHOOKS` [off] | Outbound webhooks to the client's systems, signed and retried | CANDIDATE (`D-278`) |
| `CAP-PAYMENT_PROVIDER` [on, `D-012`] · `CAP-SHIPPING_PROVIDER` [on, `D-013`] | The provider adapters the store actually uses |
| `CAP-POS_INTEGRATION` [`D-009`] · `CAP-LEGACY_ERP_BRIDGE` [`D-009`] | Bridges to systems the client keeps |
| `CAP-GSTIN_VERIFICATION` [`D-067`] · `CAP-ADDRESS_LOOKUP` [off] | Registration checks and PIN/address lookup |
| `CAP-IMPORT_MAPPING_PROFILES` [1B] | Reusable import templates shaped by the store's own catalogue schema |

#### Q. Access, security and privacy (M02, M26)

`CAP-PASSWORD_SIGN_IN` [`D-040`] · `CAP-OTP_SIGN_IN` [`D-040`] · `CAP-SSO_GOOGLE` [off] · `CAP-SSO_APPLE` [off] ·
`CAP-MFA_STAFF` [on] · `CAP-MFA_CUSTOMERS` [off] · `CAP-ACCESS_REVIEWS` [on] · `CAP-AUDIT_VIEWER` [on] ·
`CAP-DATA_RETENTION_RULES` [on, `D-036`] · `CAP-PRIVACY_REQUESTS` [on, `D-060`] · `CAP-IP_ALLOWLIST_STAFF` [off] —
1A and CANDIDATE.

#### R. Platform and presentation (M30–M33)

`CAP-CUSTOM_DOMAIN` [on] · `CAP-STORE_EDITABLE_THEME` [off] · `CAP-CONTEXTUAL_HELP` [on, `D-224`] ·
`CAP-GUIDED_WORKFLOWS` [on, `D-224`] · `CAP-STAGING_ENVIRONMENT` [off] · `CAP-SELF_SERVICE_FEATURES` [on,
`D-258`] — the last one is the switch that decides whether a store sees a Features screen at all.

---

**Where each capability is enforced** — the screen, tab, section, endpoint and entity it governs — is in
**`21-feature-map.md`**. That file is what an implementer reads before building a screen; this catalogue is what
an operator reads before granting one.

The catalogue is **data**. Adding a capability is a declaration in the store codebase plus a root admin
migration — never a new codebase (S01). `TS-SAAS-CAP-01` asserts every capability has all six enforcement points
wired; `TS-SAAS-CAP-02` that no store-facing route or component exists without a declared capability; and
`TS-SAAS-CAP-12` that no capability whose build status is `CANDIDATE` with an open decision can be granted to a
store.

### 5.4 Surfaces, modules and the two-level control model (`D-257`, `D-258`)

Capabilities alone are too fine-grained for the way a store is actually sold and operated. Above them sit two
coarser controls the Configurable Root Admin owns, and below the root admin sits a delegated control the store's
own administrator owns.

#### 5.4.1 Surfaces

A **surface** is one of the three applications a store can have:

| Surface | What it is | Turning it off means |
|---|---|---|
| `storefront` | The public customer-facing site (P-S*) | The store has no public site; its hosts serve nothing but a neutral response. Used for back-office-only, catalogue-only and invitation-only B2B stores |
| `workspace` | The staff ERP workspace (P-E*) | Staff work somewhere else; only integrations and the storefront run. Rare, but it must be expressible |
| `vendor` | The supplier/vendor portal (P-V*) | No vendor sign-in, no vendor routes, no vendor bundle, no vendor records in staff screens |

Each surface is `enabled` or `disabled` per store (`CFG-<surface>.enabled`). A disabled surface is **absent**, not
restricted: its routes are not registered, its hostnames do not resolve to it, its bundles are not built for that
store, and nothing anywhere mentions it (`§9` INV-1, INV-3).

#### 5.4.2 Modules

A **module** (`MOD-<slug>`) is a whole area of product behaviour that a store either has or does not. Modules are
the unit an operator actually reasons about when configuring a store ("this store does not do purchasing"), and
each one groups the capabilities of `§5.3`.

**Modules have two origins** (`D-265`):

| Origin | Declared in | Example | Can it add behaviour? |
|---|---|---|---|
| **Platform module** | The store codebase, shipped with the release | `MOD-inventory`, `MOD-orders` | No — it groups capabilities that already exist |
| **Category module** | A vertical pack (`§6.1`), as data | `MOD-rental` in `VP-rental`, `MOD-appointments` in `VP-services`, `MOD-subscriptions` in `VP-subscriptions` | No — it groups and configures capabilities that already exist in the codebase |

This is the line that keeps the whole architecture honest, so it is stated plainly:

> A category may define its **own modules**, because different kinds of business are organised differently and an
> operator configuring a rental business should see a "Rentals" module rather than six unrelated switches. A
> category may **not** invent behaviour. A module — platform or category — is a named, ordered grouping of
> capabilities that already exist in the store codebase, plus their defaults, control states and wording.
>
> If a category needs behaviour no capability provides, that is a **new capability in the codebase**: one change,
> in one place, available to every category afterwards (`§6.7`). It is never a fork, and it is never a pack that
> smuggles in code (`BR-M32-01`).

The sixteen platform modules:

| Module | Surfaces | Contains (examples) | Owning M## |
|---|---|---|---|
| `MOD-catalogue` | storefront, workspace, vendor | attribute schemas, variants, media, condition grades, compatibility, import | M04, M21, M22 |
| `MOD-pricing` | storefront, workspace | price lists, tiers, promotions, quotes, margin floors | M05 |
| `MOD-inventory` | storefront, workspace, vendor | stock ledger, reservations, identity model, transfers, counts | M06 |
| `MOD-purchasing` | workspace, vendor | reorder rules, purchase orders, receiving, QC, supplier bills | M07 |
| `MOD-customers` | storefront, workspace | consumers, business accounts, dealer applications, segments, consent | M08 |
| `MOD-storefront` | storefront | home, listing, product, compare, wishlist, reviews, help centre | M09, M27 |
| `MOD-orders` | storefront, workspace | cart, checkout, order state machine, cancellations, assisted orders | M10 |
| `MOD-payments` | storefront, workspace | providers, COD, EMI, refunds, reconciliation | M11 |
| `MOD-fulfilment` | workspace | release, pick, pack, dispatch, courier, tracking, pickup, digital delivery | M12 |
| `MOD-returns` | storefront, workspace, vendor | returns, exchanges, warranty, supplier RMA | M13 |
| `MOD-vendor` | workspace, vendor | vendor onboarding, submissions, availability, statements, performance | M14 |
| `MOD-support` | storefront, workspace | help centre, WhatsApp, shared inbox, tickets | M16, M20 |
| `MOD-automation` | workspace | rules, exception queues, approvals, delegation, owner digest | M17 |
| `MOD-reporting` | workspace | report catalogue, exports, scheduled reports | M18 |
| `MOD-finance` | workspace | invoice references, accounting export, day close | M19 |
| `MOD-administration` | workspace | store users, roles, store-owned settings, audit viewer | M02, M24 |

Category modules seen in the packs of `§6.2`, all composed from existing capabilities:

| Category module | Declared by | Groups |
|---|---|---|
| `MOD-rental` | `VP-rental` | `CAP-RENTAL_ITEMS`, `CAP-RENTAL_LOGISTICS`, `CAP-DEPOSITS`, `CAP-AVAILABILITY_CALENDAR` |
| `MOD-appointments` | `VP-services` | `CAP-SERVICE_ITEMS`, `CAP-SERVICE_APPOINTMENTS`, `CAP-CAPACITY_SLOTS`, `CAP-SERVICE_AREAS` |
| `MOD-subscriptions` | `VP-subscriptions`, `VP-pet_supplies` | `CAP-SUBSCRIPTION_PLANS`, `CAP-BILLING_CYCLES`, `CAP-PAUSE_RESUME`, `CAP-PART_PAYMENT` |
| `MOD-perishables` | `VP-grocery`, `VP-seafood`, `VP-fresh_perishable` | `CAP-BATCH_LOT`, `CAP-EXPIRY_DATES`, `CAP-SHELF_LIFE_RULES`, `CAP-COLD_CHAIN`, `CAP-WEIGHT_PRICED_ITEMS` |
| `MOD-made_to_order` | `VP-made_to_order`, `VP-handmade` | `CAP-MADE_TO_ORDER`, `CAP-PERSONALISATION`, `CAP-PRODUCTION_LEAD_TIME`, `CAP-DEPOSITS` |
| `MOD-digital_delivery` | `VP-digital`, `VP-books_media` | `CAP-DIGITAL_PRODUCTS`, `CAP-DIGITAL_DELIVERY`, `CAP-LICENCE_KEYS`, `CAP-DOWNLOAD_LIMITS` |
| `MOD-trade` | `VP-wholesale_b2b`, `VP-industrial_hardware`, `VP-office_supplies` | `CAP-BUSINESS_ACCOUNTS`, `CAP-QUANTITY_TIERS`, `CAP-QUOTES`, `CAP-CREDIT_TERMS`, `CAP-CONTRACT_PRICING` |
| `MOD-authentication_provenance` | `VP-luxury_collectibles`, `VP-antiques`, `VP-jewellery` | `CAP-UNIQUE_ITEMS`, `CAP-PROVENANCE`, `CAP-AUTHENTICATION_RECORD`, `CAP-SERIAL_TRACKING` |

A category module is presented to the operator exactly like a platform module — same three control states, same
delegation, same run-out rule. Where it is declared is an authoring detail the operator never needs to think
about, and the store never sees either way.

Rules:

- **`MOD-administration` cannot be disabled.** A store must always be able to manage its own people and see its
  own audit trail; disabling it would leave a store nobody can operate.
- A module is disabled ⇒ **every capability inside it is off**, whatever the capability's own state says. The
  compiler resolves module state first, then capability state (`effective = module AND capability`).
- A module's dependencies are declared and validated: `MOD-fulfilment` without `MOD-orders` is a compile error,
  as is `MOD-returns` without `MOD-orders`, or `MOD-vendor` without `MOD-purchasing` when supplier purchase
  orders are enabled.
- Disabling a module **hides, never deletes** (`BR-M31-03`). Re-enabling restores every record untouched.
- A category module may not contain a capability that does not exist in the running platform release; the
  compiler rejects the pack with the missing capability named (`BR-M32-05`).
- A capability may appear in more than one module only if exactly one of them is marked as its **owner** for
  control purposes; otherwise two modules could contradict each other. The compiler enforces single ownership.

#### 5.4.3 The control state — who may switch what (`D-258`)

Every module and every capability carries, per store, one of three control states set by the root admin:

| Control state | The store has it? | The store's administrator can change it? | What the store's own admin screen shows |
|---|---|---|---|
| `off_locked` | No | No | **Nothing.** No switch, no greyed row, no mention |
| `on_locked` | Yes | No | The feature simply works. **No switch at all** |
| `delegated` | Yes or no — the store decides | **Yes** | A plain-language switch in the store's Features screen |

`delegated` is the state the brief's second requirement needs: the root admin decides *which* features a store's
ERP administrator is allowed to manage, and the store's administrator then turns those, and only those, on and
off for their own business. The current on/off value of a delegated item lives in the store database
(`E-store_feature_state`, layer L4), never in the root admin's published configuration — so a store changing its
own feature does **not** require a deployment.

Invariants (`BR-M31-09`…`BR-M31-13`, tested by `TS-SAAS-CAP-07`…`TS-SAAS-CAP-11`):

| # | Invariant |
|---|---|
| CTL-1 | A store can never enable anything that is not `delegated`. A write attempt to an `off_locked` or `on_locked` item is answered exactly as an unknown item would be — no error naming it, no hint that it exists elsewhere |
| CTL-2 | A capability may only be `delegated` if the module that contains it is `on_locked` or `delegated`, and if every capability it depends on is at least as available as it is. The compiler rejects any other combination rather than resolving it silently |
| CTL-3 | Turning a delegated item off hides its data and its surfaces; nothing is deleted, and turning it back on restores the previous state exactly |
| CTL-4 | Turning a delegated item off while work is in flight never strands that work — see the run-out rule in `§23.3` |
| CTL-5 | Every change is audited on the side that made it: root-admin changes in `E-platform_audit_event`, store-admin changes in the store's own `E-audit_event`, each with actor, before, after and time |
| CTL-6 | Changing the control state of an item the store has already switched does not silently discard the store's value: moving `delegated → on_locked` keeps it on, `delegated → off_locked` turns it off and records that the platform did so, and moving back to `delegated` restores the store's last value |
| CTL-7 | The store's Features screen is built from the delegated set only, grouped in business language, and never displays a module id, capability id or configuration key |

#### 5.4.4 Resolution order at runtime

```
surface enabled?            no ──► the whole application does not exist for this store
      │ yes
module control state        off_locked ──► everything in the module is off
      │ on_locked / delegated
module store value (L4)     off (only possible when delegated) ──► everything in the module is off
      │ on
capability control state    off_locked ──► off
      │ on_locked / delegated
capability store value (L4) off (only possible when delegated) ──► off
      │ on
                            ──► ON: routes registered, UI rendered, jobs scheduled, data exported
```

All of it resolves to the same immutable bitset the runtime already uses (`§4.3`), rebuilt when either the
published configuration or the store's own feature state changes. There is still **no database read on the
request path** (`BR-M31-01`).

### 5.5 Bundles — the reusable building blocks a category is assembled from (`D-266`)

Authoring a category from scratch, capability by capability, is slow and produces inconsistent results: the third
person to add a perishable-goods category will not make the same forty decisions as the first. A **bundle**
(`BND-<slug>`) is a named, versioned, reusable package of configuration that the root admin assembles once and
then applies to any category.

**What a bundle contains** — the same kinds of content as a pack, but a fragment rather than a whole:

| Part | Contents |
|---|---|
| Modules | Module definitions it contributes (`§5.4.2`) |
| Capabilities | Which capabilities it turns on, and their default control state (`off_locked` / `on_locked` / `delegated`) |
| Configuration | `CFG-*` defaults the bundle implies |
| Catalog schema | Attribute definitions, units, variant axes and facets it needs |
| Terminology | Values for the `TT-*` tokens it introduces or changes |
| Profiles | Storefront, workspace and vendor profile fragments (screens, tabs, columns, blocks) |
| Seeds | Seed-set fragments (policy classes, saved views, help content) |
| Templates | Template compatibility it requires or recommends |
| Validation | Rules it adds — for example, "requires an identity model of `batch_lot_expiry`" |

**The starting library** (each one is data, authored and versioned in the root admin):

| Bundle | What it gives a category |
|---|---|
| `BND-serialised_goods` | Serial numbers, condition grades, inspection records, warranty by unit |
| `BND-variant_matrix` | Two-axis variants, size systems, size guide, exchange-led returns |
| `BND-perishables` | Batch and lot, expiry, shelf-life rules, cold chain, weight pricing, delivery slots |
| `BND-unique_items` | One-of-a-kind stock, provenance, authentication record, no variants |
| `BND-trade_b2b` | Business accounts and members, quantity tiers, contract pricing, quotes, credit terms |
| `BND-bulky_freight` | Freight delivery, dimensional attributes, lead times, assembly services |
| `BND-digital_delivery` | Digital products, licence keys, downloads, no shipping |
| `BND-appointments` | Service items, appointments, capacity slots, service areas |
| `BND-rental` | Rental periods, availability calendar, deposits, return condition |
| `BND-subscriptions` | Plans, billing cycles, pause and resume, renewal notices |
| `BND-made_to_order` | Configured items, personalisation, production lead times, deposits |
| `BND-supplier_network` | Vendor portal, submissions, availability feeds, supplier fulfilment |
| `BND-regulated_goods` | Age gate, compliance attributes, restricted delivery, document capture |
| `BND-marketplace_basics` | Curated collections, reviews, wishlist, comparison, stock alerts |

**How a category is assembled** (`§6.9`):

```
category = base profile
         + bundles (in the order chosen)
         + category-specific overrides
```

Composition rules, enforced by the compiler so that assembly is predictable rather than clever:

| # | Rule |
|---|---|
| BC-1 | Bundles apply in the order the author chose; a later bundle may override an earlier one, and the resulting value's origin is shown in the authoring screen |
| BC-2 | A **conflict** — two bundles demanding incompatible values, such as two different item identity models — is an error, never silently resolved. The author is shown both origins and must choose explicitly |
| BC-3 | Category-specific overrides always win over every bundle, and are listed separately so it is obvious what the category changed |
| BC-4 | A bundle version is immutable once published. A category pins the bundle versions it was assembled from, and a bundle update never changes a category until the category is re-assembled and republished as a new version |
| BC-5 | A bundle may only reference capabilities that exist in the running platform release; otherwise it is rejected with the missing capability named |
| BC-6 | Applying a bundle is reversible during authoring: removing it withdraws exactly what it contributed, leaving overrides and other bundles intact |
| BC-7 | The assembled result is a normal pack version. Nothing about bundles reaches the store runtime — the runtime only ever sees the compiled artefact (`§4.2`) |

Bundles are also how the platform grows safely: a new capability added to the codebase is wired into a bundle
once, and every category that uses that bundle gains it at its next version — rather than fourteen categories
each being edited by hand and drifting apart.

### 5.6 Channels, providers and credentials — what "give this client WhatsApp" actually means (`D-274`)

A communication capability is necessary but not sufficient. Switching on `CAP-WHATSAPP_NOTIFICATIONS` without a
verified sender, approved templates and a consent basis produces a store that looks configured and silently fails
— the worst possible outcome. The model therefore has five layers, and publication is blocked unless all five are
satisfied:

```
1  Capability        Is this store allowed the channel at all?              (root admin, §5.3)
2  Channel binding   Which provider account does this store use?            (per store; never shared by default)
3  Sender identity   Which number / domain / sender id, and is it verified? (SPF·DKIM·DMARC, or WhatsApp number)
4  Templates         Approved, versioned message templates per language     (provider approval where required)
5  Consent & limits  Consent per channel and purpose, preferences, caps     (per customer, provable, withdrawable)
```

| Rule | Detail |
|---|---|
| CH-1 | A channel capability that is on **without** a verified binding, a verified sender and the templates its enabled automations need is a **publish error**, listing exactly what is missing (`BR-M31-18`) |
| CH-2 | Provider accounts are **per store** by default (`D-272`). A shared platform account is a documented option with its own risks — shared sender reputation, shared rate limits, shared suspension — and requires the client's explicit agreement |
| CH-3 | Credentials live in the store's own secret scope, encrypted with its own key, and never appear in a configuration artefact (`BR-M31-08`) |
| CH-4 | Consent is enforced **in the messaging service**, not in each caller. A send without a consent basis is refused and recorded, whoever asked for it (`BR-M20-01`) |
| CH-5 | Frequency caps and quiet hours apply across every channel together, so a customer cannot be messaged five times by five features |
| CH-6 | Delivery status is recorded per message; repeated failure opens an exception case and can suspend the channel rather than silently burning the sender's reputation |
| CH-7 | Turning a channel off stops sends immediately, leaves the history intact, and removes the channel from customer preference screens and from every template editor |
| CH-8 | A template is versioned and, where the provider requires approval, carries its approval state. An automation cannot be enabled if the template it needs is missing or unapproved |
| CH-9 | Every channel has its own per-store rate limit and cost meter (`§20`), so one store's campaign cannot exhaust another's throughput or budget |

Channels recognised by the model: `email`, `sms`, `whatsapp`, `web_chat`, `push_web`, `push_mobile`, `in_app`,
`voice_callback`. Adding a channel is a platform change (one adapter, one set of contracts), after which every
store can be granted it — not a per-client build.

## 6. Vertical packs — the e-commerce categories (SAAS §3 S02, S06, S16–S18, S22 · `D-237`, `D-241`)

### 6.1 What a pack is

A **vertical pack** (`VP-<slug>`) is a versioned bundle of *configuration and seed content* — never code — that
turns the generic store into a category-specific store. A pack is authored and stored in the root admin.

| Section of a pack | Contents |
|---|---|
| Identity | `pack_id`, semantic `version`, display name **used only inside the root admin**, description, status (`draft`/`published`/`deprecated`) |
| Capability defaults | Default on/off for every `CAP-*`, and which of them the root admin may not override for this pack |
| Configuration defaults | L1 values for any `CFG-*` key |
| Catalog schema | Category tree, attribute definitions and their types/units, required attributes, variant axes, search facets |
| Item identity model | `none` · `serial` · `batch_lot` · `batch_lot_expiry` · `unique_item` — drives M06 and M13 behaviour |
| Units & quantity | Unit-of-measure set, decimal quantities allowed?, weight/volume pricing, minimum order quantity rules |
| Pricing model | Which pricing features apply (tiering, per-kg, rental rates, subscription terms, quote-only) |
| Fulfilment model | Shipping modes, packaging rules, cold-chain, lead-time model, service/appointment model |
| Returns model | Default policy classes and non-returnable classes |
| Terminology set | Values for every `TT-*` token (`§11`) |
| Workspace profile | Which P-E screens, tabs, columns, saved views and KPI tiles appear (S17) |
| Vendor profile | Which P-V screens, tabs and submission fields appear (S18) |
| Storefront profile | Which P-S sections, badges, filters and product-page blocks appear (S16) |
| Seed sets | `S-VP-<slug>-##`: categories, attributes, units, policy classes, saved views, help content, sample-free reference data |
| Compatible templates | Template ids the pack is designed for, and a default |
| Validation | Rules the compiler runs (e.g. `CAP-EXPIRY_DATES` requires identity model `batch_lot_expiry`) |

### 6.2 Pack catalogue (SAAS §1 list) — ids and Phase-1 build status

`D-241`: **Phase 1 builds one pack, `VP-electronics`** (the existing Tradex requirements), plus the *pack
authoring mechanism* and one deliberately different second pack, `VP-fashion_apparel`, built in Stage 1R.2 purely
to prove that a second category needs **no code change** (SAAS §1 "Fashion & Apparel" worked example). The rest are
pack content added later by the pack authoring process (`D-255` prioritises them commercially); none of them
requires a new codebase, which is the requirement the architecture must satisfy (S22).

| Pack id | Category from SAAS §1 | Distinctive drivers the pack must express | Phase |
|---|---|---|---|
| `VP-electronics` | Electronics / the current customised TradeX system | serials, condition grades, compatibility, refurbished inspection, dealer tiers | **1A** |
| `VP-fashion_apparel` | Fashion & Apparel | size/colour variant matrix, size guide, seasons, high return/exchange rate | **1R.2** |
| `VP-grocery` | Groceries / Grocery & Supermarket | batch+expiry, weight pricing, delivery slots, minimum order value | later |
| `VP-seafood` | Fish | cold chain, catch/pack date, weight pricing, very short shelf life | later |
| `VP-furniture` | Furniture / Home & Furniture | bulky freight, lead times, made-to-order options, room/dimension attributes | later |
| `VP-footwear` | Footwear | size systems per region, width variants, pair units | later |
| `VP-antiques` | Antiques | unique items (quantity 1), provenance, condition narrative, no variants | later |
| `VP-beauty` | Beauty & Cosmetics | batch+expiry, shade variants, ingredient/compliance attributes | later |
| `VP-health_wellness` | Health & Wellness | regulated-item flags, expiry, dosage attributes, prescription gate | later |
| `VP-jewellery` | Jewelry & Watches | metal/stone attributes, hallmark, weight-based pricing, high-value handling, serials | later |
| `VP-automotive` | Automotive | vehicle-fitment compatibility, core/exchange parts, OEM references | later |
| `VP-sports_fitness` | Sports & Fitness | size variants, bulky items, assembly services | later |
| `VP-books_media` | Books & Media | ISBN/identifier lookup, editions, digital + physical mix | later |
| `VP-toys_kids` | Toys & Kids | age grading, safety certifications, seasonality | later |
| `VP-pet_supplies` | Pet Supplies | subscriptions, weight packs, expiry | later |
| `VP-industrial_hardware` | Industrial & Hardware | technical specs, bulk packs, B2B pricing, datasheets | later |
| `VP-construction` | Construction & Building Materials | bulk units (m³, tonne), freight, quotation-led B2B | later |
| `VP-agriculture` | Agriculture & Gardening | seasonality, live plants, batch/lot, regulated chemicals, bulk units | later |
| `VP-office_supplies` | Office & Business Supplies | B2B accounts, contract pricing, reorder lists | later |
| `VP-digital` | Digital Products | no stock, licence keys/downloads, instant delivery, no shipping | later |
| `VP-services` | Services | appointments, capacity, no inventory, service areas | later |
| `VP-handmade` | Handmade & Crafts | made-to-order, personalisation options, small-batch stock | later |
| `VP-luxury_collectibles` | Luxury & Collectibles | unique items, authentication, serials, high-value fraud controls | later |
| `VP-fresh_perishable` | Fresh / Perishable Products | shelf-life rules, cold chain, slot delivery, waste tracking | later |
| `VP-wholesale_b2b` | Wholesale / B2B Products | account-only access, tiered/contract pricing, quotes, credit terms | later |
| `VP-subscriptions` | Subscription Products | plans, billing cycles, pauses, renewals | later |
| `VP-rental` | Rental Products | rental periods, availability calendar, deposits, return condition | later |
| `VP-made_to_order` | Custom / Made-to-Order Products | configurators, quotes, production lead times, deposits | later |
| `VP-multi_category` | Multiple product categories combined in one store | composition of several pack profiles under one store (`§6.7`) | later |

### 6.3 Category-specific storefront (S16)

The pack's storefront profile drives: category/facet structure, product-page block order and which blocks exist
(variant picker vs weight selector vs rental calendar vs appointment picker), badges (condition grade, freshness,
handmade, licensed), listing card fields, comparison behaviour, checkout steps (delivery slot, appointment,
licence agreement), and the home-page section set. All of it is data in `navigation.json` + `catalog-schema.json` +
capabilities — **no branching on the pack id anywhere in the code** (`BR-M32-02`; `TS-SAAS-PACK-03` greps for
pack-id conditionals and fails the build).

### 6.4 Category-specific workspace (S17)

The pack's workspace profile drives which P-E screens exist, which tabs and columns are in each, which saved views
and KPI tiles are seeded, which exception queues run, and the wording of every label (`§11`). A grocery store's
Inventory screen shows batch/expiry columns and a shelf-life queue; an antiques store's shows unique-item records
and no quantity column; an electronics store shows serials and inspection — same screen, same code.

### 6.5 Category-specific vendor portal (S18)

The pack's vendor profile drives the submission form fields (which attributes a vendor must supply), the
availability-feed columns, which fulfilment tasks exist, and the vendor terminology. Vendor users see only their
store's profile.

### 6.6 Pack lifecycle (S22 · `D-247`)

Add: author a pack version in the root admin → validate against the schema + capability registry → publish →
becomes selectable. Update: publish a new pack **version**; existing stores stay on their pinned version until the
root admin migrates them, with a diff preview of what would change and which stores are affected. Remove:
`deprecate` (not selectable for new stores, existing stores unaffected) then `retire` (only when zero stores use
it). **No store is ever changed by a pack update it has not been migrated to** (`BR-M32-04`).

### 6.7 Combined-category stores

`VP-multi_category` is a pack whose profile is a *composition*: a list of member pack profiles plus a merge policy
(union of capabilities, per-branch category trees, per-category identity models). The compiler resolves the
composition at build time so the runtime still sees one flat configuration. Conflicts (e.g. two packs demanding
different identity models for the same category) are compile errors, not runtime surprises.

### 6.9 Authoring a category: the completeness gate (`D-267`)

"Cover all things" is only meaningful if the system can prove it. Every category version is therefore checked
against a **completeness matrix** before it can be published: every dimension below must be either answered or
explicitly marked as inherited from the base profile. A dimension left unanswered blocks publication, so a
half-configured category can never reach a store.

| # | Dimension | Answered by |
|---|---|---|
| 1 | Identity, name and description used inside the root admin | Category header |
| 2 | Bundles applied, in order, with their versions | Assembly (`§5.5`) |
| 3 | Surfaces the category expects (`storefront`, `workspace`, `vendor`) | Category defaults |
| 4 | Every module: present or absent, and its default control state | Module matrix |
| 5 | Every capability the present modules contain: default state and control state | Capability matrix |
| 6 | Which modules and capabilities are **delegated** to the store's administrator by default | Delegation defaults (`§5.4.3`) |
| 7 | Item identity model | Pack section |
| 8 | Units of measure, decimal quantities, minimum order rules | Pack section |
| 9 | Category tree and attribute definitions with types, units and requiredness | Catalog schema |
| 10 | Variant axes and search facets | Catalog schema |
| 11 | Pricing model (fixed, weight, tiered, rental, subscription, quote-only) | Pack section |
| 12 | Fulfilment models and packing rules | Pack section |
| 13 | Return, exchange and non-returnable policy classes | Pack section |
| 14 | Tax and compliance attributes the category needs | Pack section |
| 15 | Storefront profile: sections, product blocks, badges, listing fields, checkout steps | Profiles |
| 16 | Workspace profile: screens, tabs, columns, saved views, KPI tiles, exception queues | Profiles |
| 17 | Vendor profile: submission fields, availability columns, fulfilment tasks | Profiles |
| 18 | Terminology: **every** `TT-*` token used by the enabled capabilities, in every language the category supports | Terminology set |
| 19 | Seed sets: what a new store of this category starts with | Seeds |
| 20 | Compatible templates and the default | Template compatibility |
| 21 | Validation rules the category adds | Validation |
| 22 | Notification and document templates the enabled capabilities require | Seeds |
| 23 | Help content for every workspace screen the profile shows | Seeds |
| 24 | Reports the category expects | Workspace profile |
| 25 | Automation rules available and their defaults | Pack section |

The gate is mechanical, not a review checklist: publication calls the validator, the validator walks the enabled
capability set and reports every dimension with no answer, every token with no value, every attribute with no
type, every screen with no help content, and every capability whose dependency is missing. The authoring screen
shows the same report live, so an author always knows exactly what is left (`T-1R.2-M34-12`).

## 7. Templates and theming (SAAS §3 S07–S09, S19–S21 · `D-238`, `D-240`, `D-242`)

### 7.1 What a template is

A **template** (`TPL-<slug>`) is a versioned, selectable **presentation layer** for the storefront: page layouts,
component variants, section arrangements, typography scale, spacing rhythm, imagery treatment and motion. It is
part of the one store codebase (`frontend/storefront/templates/<slug>/`), not a separate application, and it is
selected per store by configuration.

A template declares: `template_id`, `version`, compatible pack ids (or `any`), required capabilities, the token
contract it consumes, its layout set per `P-S` page, its component variant set, its asset bundle, preview images,
and its accessibility conformance statement.

### 7.2 What a template may and may not do (`BR-M33-01`)

| May | May not |
|---|---|
| Change layout, order, density, component variants, imagery, typography, motion | Change business rules, pricing, tax, stock, checkout logic or validation |
| Add presentational-only sections | Add or remove capabilities |
| Consume theme tokens and terminology | Hard-code a brand name, colour or copy string |
| Provide its own accessibility-conformant components | Ship below WCAG 2.2 AA (`D-051`) |
| Hide a section when its capability is off | Reveal a capability that is off |

Every template renders from the **same** data contracts, so a store can switch template without a data migration.

### 7.3 Templates shipped in Phase 1 (`D-242`)

Two, deliberately different, because "the templates must not make every client website look identical" (S19) is
only provable with more than one:

| Template | Character | Default for |
|---|---|---|
| `TPL-forge` | Dense, specification-led, comparison-first, technical imagery — the current mockup direction | `VP-electronics` |
| `TPL-aurora` | Editorial, image-led, generous whitespace, lookbook and collection sections | `VP-fashion_apparel`, general retail |

Both consume the same token contract, so a store may use either with either pack where compatibility allows.

### 7.4 Branding, colours and logo (S08, S09, S21 · `D-240`)

Branding is configuration, compiled to tokens, never code:

| Config key group | Contents |
|---|---|
| `CFG-branding.*` | store display name, legal name, tagline, logo (light/dark/mark/favicon/OG), contact identity |
| `CFG-theme.color.*` | brand primary/secondary/accent, surface and text ramps, semantic colours (success/warning/danger/info); the compiler **derives** the full ramp from the brand colours and validates every foreground/background pair against WCAG 2.2 AA contrast — a failing palette is a publish error, not a warning |
| `CFG-theme.typography.*` | font families (from an approved, self-hosted set), scale ratio, weights |
| `CFG-theme.shape.*` | radius scale, border weight, shadow level, density (comfortable/compact) |
| `CFG-theme.motion.*` | motion level, respecting `prefers-reduced-motion` unconditionally |

The compiler emits `theme.css` (CSS custom properties only — no per-store JavaScript) and `theme.json`. Logos are
uploaded in the root admin, validated (format, dimensions, transparency, file size), converted to the required
variants, stored per store in object storage and referenced by `assets.json`.

### 7.5 Template lifecycle (S20 · `D-247`)

Identical in shape to the pack lifecycle (`§6.6`): versioned; add by publishing a new template version; update by
publishing a version and migrating stores explicitly with a preview; remove by deprecating then retiring when
unused. A store pins `template_id` + `template_version`. Assignment to categories is a compatibility list on the
template plus a default on the pack. **Adding or removing a template never touches a store's data and never
requires a store-specific codebase** (S20) — verified by `TS-SAAS-TPL-02`.

## 8. The store experience contract (S24)

Everything a store user sees is produced from exactly five inputs, and nothing else:

1. the store's **configuration** (`config.json`),
2. its **capability set** (`capabilities.json`),
3. its **pack profile** (`catalog-schema.json`, `navigation.json`),
4. its **terminology** (`terminology.<locale>.json`),
5. its **theme and template** (`theme.css`, template id/version).

If a screen, string, email, PDF, export or error message cannot be traced to those five inputs, it is a bug
(`TS-SAAS-EXP-01`). There is no "default Tradex behaviour" left anywhere in the store codebase: the electronics
behaviour is `VP-electronics`, like any other pack.

## 9. The invisibility rule (SAAS §3 S03 · `D-229`) — non-negotiable

Store users are: the store owner, the representative admin, store staff, vendors/suppliers, dealers and customers.
None of them may learn that the platform is multi-store or multi-category.

| # | Rule | Check |
|---|---|---|
| INV-1 | No store-facing UI ever shows: another store, a store count, the list of supported categories, the list of available templates, pack or template ids, capability ids, `CFG-*` keys, or any root-admin concept | `TS-SAAS-ISO-01` (crawl every store-facing page with a forbidden-vocabulary list) |
| INV-2 | Store-facing API responses contain only the store's **effective** configuration — never the catalogue of what is possible, never other stores' data, never a "disabled features" list | `TS-SAAS-ISO-02` |
| INV-3 | A request for a disabled capability or another store's resource returns **404**, never 403 and never a message naming the feature | `TS-SAAS-ISO-03` |
| INV-4 | The store admin screen (P-E15) shows only `store_editable`, unlocked keys. A locked or root-only key is **absent**, not disabled-and-visible — a greyed control discloses that someone else controls it | `TS-SAAS-ISO-04` |
| INV-5 | Vocabulary ban in store-facing strings, URLs, HTML classes, HTML comments, `data-*` attributes, source maps, cookie names, headers and log lines the user can see: *SaaS, tenant, multi-tenant, store type, vertical, pack, template, capability, root admin, platform admin, provisioning, other stores* | `TS-SAAS-ISO-01`, lint rule `no-saas-vocabulary` |
| INV-6 | Error pages, maintenance pages and unknown-host pages are store-branded (or, for an unknown host, entirely neutral) and never name the platform | `TS-SAAS-ISO-05` |
| INV-7 | Emails, invoices, PDFs, WhatsApp templates, webhooks and data exports carry only the store's identity | `TS-SAAS-ISO-06` |
| INV-8 | No link, redirect, sitemap entry, robots rule or DNS record points from a store to the root admin portal | `TS-SAAS-ISO-07` |
| INV-9 | Platform staff access to a store is time-boxed, purpose-recorded, owner-notified and fully audited (`D-246`); there is no silent impersonation | `TS-SAAS-ISO-08`, `20 §7` |
| INV-10 | Response headers, `Server`, `X-Powered-By`, HTML generator meta and JS bundle names carry no platform identity | `TS-SAAS-ISO-01` |

The *user-facing* consequence of INV-5 is that the store admin's own settings screen is written in the store's
language: "Your store details", "Delivery options", "Returns window" — never "capabilities" or "configuration
keys".

## 10. Tenancy and isolation (`D-233`, `D-234`)

### 10.1 Data isolation — separated per client by default (`D-272`)

**Every client's data is physically separated from every other client's.** A store does not share a database,
a storage bucket, a search index, a cache namespace or an encryption key with any other store. This is the
default and the normal case, not an upgrade.

| Resource | Per store, by default | Why |
|---|---|---|
| **Database** | Its own database (its own credentials, its own backup, its own restore) | Contractual separation; a client can be backed up, restored, exported or moved without touching anyone else |
| **Object storage (images, documents, media)** | Its own bucket or container, with its own credentials and its own lifecycle rules; a dedicated prefix only where the provider does not support per-tenant containers | The same reason, plus per-client retention and residency |
| **Search index** | Its own index | A shared index is one forgotten filter away from a leak |
| **Cache** | Its own namespace or logical database | Same |
| **Secrets and integration credentials** | Its own scope, encrypted with its own key | A leaked credential from one client grants nothing anywhere else |
| **Message and job payloads** | Carry `store_id` and run in that store's context; a dedicated queue in topologies T3 and T4 | Fair share and traceability |
| **Logs, traces and metrics** | Tagged with `store_id`; separable per client on request | Investigation without exposure |

**`store_id` remains mandatory on every store-scoped row anyway.** Separate databases and a mandatory tenant
scope are not alternatives — they are two independent layers, and the plan keeps both:

1. Physical separation means a mistake in one store's code path cannot reach another store's data.
2. The mandatory scope means a mistake in operations — a wrong connection string, a restore into the wrong
   place, a future consolidation — still cannot silently mix two clients' rows.

Removing either one to save effort is a false economy; the second layer costs one index column
(`BR-M30-01`, `BR-M30-10`).

A single shared database for several stores (`CFG-tenancy.isolation = shared`) remains **defined and supported**
for internal, demonstration and explicitly agreed low-cost cases, but it is never the default and never applies
to a client without their written agreement. Where it is used, all six controls below apply in full.

The controls that apply in **every** topology:

1. every store-scoped table has `store_id` in its primary key or a mandatory index prefix;
2. every unique constraint is prefixed by `store_id`;
3. the data-access layer refuses a query that has not set a tenant context (`BR-M30-02`) — an unscoped query is an
   error at development time, not a leak at runtime;
4. row-level security policies in the database wherever the operational core supports them (defence in depth);
5. object storage keys are prefixed `store/<store_id>/…`, with per-store signed URLs;
6. secrets and integration credentials are encrypted per store with a per-store key.

What a separated database changes operationally, and how it is handled:

| Consequence | Handling |
|---|---|
| Schema migrations must run on **every** store database | A fleet migration runner: resumable, per-store status, canary first then batches, refusing to start if any database is at an unexpected version. Drift between databases is detected and alarmed, never discovered during an incident (`T-1A.1-M30-08`) |
| More connections | One connection pooler in front of the databases, with per-store pool ceilings, so hundreds of stores do not become hundreds of idle pools (`§25.6`) |
| Provisioning is heavier | Creating a store creates its database, storage container, index and cache namespace as part of the provisioning step, with compensating rollback (`20` §5 step 4) |
| Backup and restore | **Simpler**, not harder: a single-store restore becomes a direct restore of that store's database (`§18`) |
| Cross-store reporting | Not possible by query, which is the intended outcome. Platform-level counts come from the root admin's own registry and from reported metrics, never from reading client data |

Topologies (`§10.3`) set how far the separation goes: `dedicated_db` (default) · `dedicated_runtime` ·
`standalone` · `shared` (exception only). All are `restart_impact = cold`.

Because `D-001` (operational core) is still open, this model is expressed core-agnostically, and Stage 0 gains two
proof scenarios — `TS-PROOF-11` (isolation and cross-store leakage under the candidate core) and `TS-PROOF-12`
(config artefact load and per-request cost) — so the core is chosen knowing whether it can carry multi-store
(`D-252`). If a candidate fails `TS-PROOF-11`, that is a fit-scorecard failure, not a reason to change `D-233`.

### 10.2 Request-time store resolution (`D-234`)

`Host` header → `host → store` map preloaded at boot and refreshed by the same publish mechanism as configuration.
Supports the platform subdomain (`<store_key>.<platform-domain>`) and verified custom domains (`CAP-CUSTOM_DOMAIN`),
with ACME certificate issuance and renewal driven by the root admin. Unknown host → a neutral 404 that names
nothing (INV-6). The store context is immutable for the lifetime of the request and is carried explicitly into
every job, message and outbound call (never inferred from ambient state) (`BR-M30-03`).

### 10.3 Deployment topologies — one codebase, four placements (`D-269`)

The same store platform must run on a shared server hosting many stores **and** on a server dedicated to one
client. That is a placement decision, not a product decision: **there is no topology fork in the code**, and a
store's behaviour is identical in all four.

| # | Topology | What it is | Typical reason |
|---|---|---|---|
| **T1** | **Shared platform** (exception only) | One runtime, many stores, **one shared database** | Internal, demonstration, or a client who has explicitly agreed to it. Never a silent default |
| **T2** | **Separated client, shared server** (**default**) | One runtime serving many stores, but **each client has its own database, storage container, index and cache namespace** | The normal case: one server runs several e-commerce sites, and no client's data is mixed with another's |
| **T3** | **Dedicated runtime** | This store's own processes and hosts, managed by the same central root admin | Performance isolation, a client's own scaling profile, a separate release cadence |
| **T4** | **Standalone install** | The whole store platform runs on the client's own server or cloud account | The client requires the system on their infrastructure, their region, or their network |

Set by `CFG-tenancy.isolation` (`dedicated_db` **default** · `dedicated_runtime` · `standalone` · `shared`
by exception) and `CFG-tenancy.mode` (`multi` · `single`). Both are `restart_impact = cold`: changing them is a scheduled
deployment, never a hot configuration change.

#### What changes per topology, and what never changes

| Concern | T1 | T2 | T3 | T4 |
|---|---|---|---|---|
| Store codebase | identical | identical | identical | identical |
| Configuration artefact format and loader | identical | identical | identical | identical |
| Tenant scoping in code (`store_id` everywhere) | required | required | required | **still required** — see below |
| Object storage, search index, cache namespace | shared, prefixed | **own** | own | own |
| Database | shared | **own** | own | own |
| Runtime processes | shared | shared | own | own |
| Host resolution | many hosts → many stores | as T1 | own host pool | every host → the one store |
| Where the root admin runs | central | central | central | central; the install is remote |
| Artefact delivery | object storage, internal | internal | internal | **signed artefact over HTTPS or an exported file** (`§10.5`) |
| Works if the root admin is unreachable | yes | yes | yes | **yes, indefinitely** |
| Backup, certificates, monitoring | platform | platform | platform | platform-managed or client-operated, agreed per contract |

**`store_id` stays mandatory even in single-store mode.** Dropping it in T4 would mean two code paths, two sets of
tests and a migration if the client ever becomes multi-store. In `single` mode the runtime binds every host to the
one store and the registry has exactly one entry; every query is scoped exactly as it is in T1. The cost is one
index column; the benefit is that a standalone install and a shared one are the same system, proven by the same
tests (`BR-M30-10`).

### 10.4 Standalone and disconnected operation (`D-270`, `D-271`)

A standalone install is the case that breaks naive designs, so it is specified rather than assumed.

| Concern | Rule |
|---|---|
| **Connectivity** | A standalone install needs **no** connection to the root admin to serve traffic — that already follows from SEP-1 and from booting off the on-disk artefact (`§4.3`). Connectivity is needed only to receive a new configuration or a new release |
| **Artefact delivery** | Two supported paths: **pull** (the install fetches its own artefact from a signed, store-scoped endpoint on a schedule or on notification) and **file** (an operator exports the artefact and applies it by hand or by pipeline). Both use the identical artefact; there is no special "offline format" |
| **Signing** | Every artefact is **signed** as well as checksummed. A checksum proves the bytes are intact; a signature proves they came from this platform. An install refuses an artefact whose signature does not verify against the pinned platform key, and key rotation is a documented procedure (`BR-M31-15`) |
| **Binding** | The manifest names the store and its permitted hosts. An artefact built for one store cannot configure another install, whoever obtains the file (`BR-M31-16`) |
| **Releases** | The platform publishes store-platform releases; a standalone install pulls or is pushed the release on an agreed cadence. **Version skew is bounded**: an install may run at most one minor release behind before it is flagged, and the two-schema acceptance window of `§17.2` is what makes a skewed fleet safe |
| **Support access** | The same grant model (`D-246`). The install records the access in the store's own audit trail whether or not the platform is reachable, and uploads it when it is |
| **Health** | A standalone install reports `config.applied` and health when it can. A silent install is "unknown", not "healthy", and the operator sees the last contact time |
| **Backup and certificates** | Who operates them is a contract decision recorded per store; the runbooks cover both cases |
| **Data residency** | T4 satisfies `D-256` by construction |

The commercial side of client-hosted code — entitlement, licence term, what happens at the end of a contract — is
`D-254` (`LATER`) and is deliberately not invented here. What the architecture guarantees today is that an
artefact is bound to one store and signed, so a copied install cannot quietly become a second live store.

### 10.5 Background work, jobs and integrations

Every job payload, outbox row, integration event, scheduled task and message carries `store_id`. The worker sets
the tenant context from the payload before executing and clears it after (`BR-M30-04`). Cross-store batch jobs are
forbidden in the store codebase; platform-wide work belongs to the root admin against a read replica (SEP-2).

## 11. Terminology (`D-239`)

Category-specific wording is configuration, not translation strings scattered in components.

- A **terminology token** `TT-<slug>` names a concept: `TT-product`, `TT-product_plural`, `TT-sku`, `TT-variant`,
  `TT-category`, `TT-brand`, `TT-serial`, `TT-batch`, `TT-condition`, `TT-vendor`, `TT-dealer`, `TT-branch`,
  `TT-warehouse`, `TT-order`, `TT-shipment`, `TT-return`, `TT-warranty`, `TT-unit`, `TT-collection`, … (full list
  in the token registry).
- A pack supplies a **terminology set** for every token, per locale. A store may override individual tokens
  (`CFG-terminology.overrides`) when the root admin allows it.
- Tokens resolve at compile time into `terminology.<locale>.json`; the runtime does a map lookup (`cfg.t`).
- Every store-facing string in the UI, emails, PDFs, exports and API error messages uses tokens or interpolates
  them. `TS-SAAS-TERM-01` fails the build on a hard-coded concept word ("product", "SKU", "serial", "vendor", …)
  in a store-facing template.
- Pluralisation, gender and case are part of the token definition, not of the call site.
- This mechanism is also the hook for `D-050` (languages) and `D-006` (buyer terminology) — both become store
  configuration instead of code-wide renames.

## 12. New modules (registered in `00-conventions.md` §6)

| ID | Module | Lives in | Owns |
|---|---|---|---|
| **M30** | Tenancy & store context | `backend/platform/tenancy/` | store registry (runtime side), host resolution, tenant context, data-access guard, per-store storage & secrets, store lifecycle states |
| **M31** | Configuration & capability runtime | `backend/platform/config/` | `CFG-*` schema registry, capability registry, artefact loader, immutable snapshot, reload/invalidation, L4 store settings service, config performance budget |
| **M32** | Vertical packs (runtime) | `backend/platform/packs/` | pack profile consumption: catalog schema, identity models, units, workspace/vendor/storefront profiles, pack seeds |
| **M33** | Templates & theming (runtime) | `frontend/storefront/templates/`, `frontend/design-system/theme/` | template registry & resolution, token contract, compiled theme consumption, template-safe component contracts |
| **M34** | Root Admin platform | `root-admin/` | everything in `20-root-admin.md`: portal P-R01–P-R12, pack/template/capability authoring, store registry, configurator, compiler, publisher, platform users & audit |
| **M35** | Store provisioning & deployment | `root-admin/deploy/` + `backend/platform/bootstrap/` | provisioning pipeline, store bootstrap & seeding, domain/TLS, config publication, health callbacks, rollback, decommission |

`M34` is the only module whose code lives outside `frontend/`+`backend/`; `M35` is deliberately split across the
boundary and communicates only through the two artefacts of SEP-4.

## 13. New entities (registered in `00-conventions.md` §7.3; detail in `03-database.md` §11)

**Root admin database (M34/M35):** `E-platform_user`, `E-platform_role`, `E-platform_role_assignment`,
`E-platform_audit_event`, `E-platform_support_access`, `E-store_registration`, `E-store_environment`,
`E-store_domain`, `E-store_config_draft`, `E-store_config_version`, `E-config_publication`, `E-config_artifact`,
`E-vertical_pack`, `E-vertical_pack_version`, `E-capability_definition`, `E-capability_default`,
`E-store_capability_override`, `E-template`, `E-template_version`, `E-template_compatibility`,
`E-brand_asset`, `E-terminology_set`, `E-terminology_token`, `E-terminology_override`, `E-deployment`,
`E-deployment_step`, `E-pack_migration`, `E-platform_notification`.

**Store database (M30/M31/M35):** `E-store` (the store's own identity record), `E-store_setting` (L4),
`E-store_setting_version`, `E-config_state` (applied version, checksum, applied_at, instance reports),
`E-store_bootstrap_run`. Plus: **every existing store-scoped entity gains `store_id`** — the full list is every
entity in `00-conventions.md` §7/§7.1/§7.2 except the root-admin set above.

## 14. Business rules

| ID | Rule |
|---|---|
| BR-M30-01 | A store-scoped row may never be created, read, updated or deleted without an explicit store context |
| BR-M30-02 | The data-access layer rejects (at development time) any query against a store-scoped table without a tenant filter |
| BR-M30-03 | Store context is set once per request/job from an explicit source (host, job payload, token claim) and is immutable thereafter |
| BR-M30-04 | Every asynchronous unit of work carries `store_id`; a worker without it fails the job rather than guessing |
| BR-M30-05 | A store in state `suspended`/`archived` serves a store-branded notice and accepts no writes; data is retained per `D-036` |
| BR-M31-01 | No configuration read performs I/O on the request path (`§4.1`) |
| BR-M31-02 | Every capability is enforced at all six points of `§5.2` |
| BR-M31-03 | Disabling a capability hides but never deletes data |
| BR-M31-04 | A config artefact is applied only if checksum, schema hash and platform release all validate; otherwise the previous version keeps serving and an exception case is opened |
| BR-M31-05 | Config versions are immutable and append-only; rollback is republication of an earlier version |
| BR-M31-06 | A store may write only `store_editable`, unlocked keys, and only through the settings API, which re-validates against the schema |
| BR-M31-07 | The generated artefact is never hand-edited; a runtime that detects an artefact whose checksum does not match refuses it (BR-M31-04) |
| BR-M31-08 | Secrets are never written into the config artefact; they are referenced and resolved from the secret store at boot |
| BR-M30-06 | A disabled surface is absent for that store: no route, no bundle, no hostname binding, no mention |
| BR-M30-07 | Store quotas and rate limits are enforced per store and never disclose another store's existence |
| BR-M30-08 | Every list and detail endpoint declares a maximum query count and is tested against it; N+1 access is a defect, not a performance note |
| BR-M30-09 | Every cache key contains the store; a key without it is both a leak and a correctness bug |
| BR-M30-10 | `store_id` scoping is mandatory in every topology, including a single-store standalone install; there is no unscoped code path |
| BR-M31-15 | Every artefact is signed as well as checksummed; an install refuses an artefact whose signature does not verify against the pinned platform key |
| BR-M31-16 | An artefact's manifest binds it to one store and its permitted hosts; it cannot configure any other install |
| BR-M31-17 | A capability whose build status is `CANDIDATE` with an open gating decision cannot be granted to a store; the compiler refuses the configuration and names the decision |
| BR-M31-18 | A communication channel switched on without a verified binding, a verified sender identity and the templates its enabled automations need is a publish error listing exactly what is missing |
| BR-M20-01 | A message is never sent without a consent basis for that channel and purpose; the check is in the messaging service, not in the caller |
| BR-M20-02 | Frequency caps and quiet hours apply across all channels together, so a customer cannot be messaged separately by each feature |
| BR-M20-03 | One business event produces one message however many times the job is retried, enforced by a unique message key |
| BR-M20-04 | Repeated delivery failure suspends the channel and opens an exception case rather than continuing to send |
| BR-M20-05 | Message logs and run logs carry no personal data beyond a subject reference, and no message body after the retention window |
| BR-M31-09 | Effective state = surface AND module control AND module store value AND capability control AND capability store value; module state is resolved before capability state |
| BR-M31-10 | A store may change only items whose control state is `delegated`; a write to any other item behaves exactly as a write to an unknown item |
| BR-M31-11 | A capability may be `delegated` only if its module is `on_locked` or `delegated` and every capability it depends on is at least as available; other combinations are rejected by the compiler |
| BR-M31-12 | Changing an item's control state never silently discards the store's own value (CTL-6) |
| BR-M31-13 | Switching a module or capability off follows the run-out rule: existing records stay completable by staff, no new ones can be created, customer-facing surfaces disappear immediately |
| BR-M31-14 | A platform release containing a breaking configuration-schema change migrates every stored configuration and rebuilds every artefact before the store platform is deployed; a release whose artefacts cannot all be rebuilt does not ship |
| BR-M32-01 | Pack content is data; a pack may not ship executable code |
| BR-M32-05 | A category module or bundle may only reference capabilities that exist in the running platform release; the compiler rejects it with the missing capability named |
| BR-M32-06 | Bundles compose deterministically: declared order, explicit conflict, category overrides last, immutable published versions, reversible during authoring (BC-1…BC-7) |
| BR-M32-02 | No code branches on a pack id; behaviour comes from capabilities, schema and configuration |
| BR-M32-03 | A pack version is immutable once published |
| BR-M32-04 | A store is never moved to a new pack version without an explicit, previewed migration |
| BR-M33-01 | A template may change presentation only (`§7.2`) |
| BR-M33-02 | Templates consume the token contract; no template hard-codes a colour, brand name or copy string |
| BR-M33-03 | Switching a store's template requires no data migration |
| BR-M34-01 | Root admin actions that create, configure, publish, deploy, suspend or access a store are audited with actor, target store, before/after and reason |
| BR-M34-02 | Publishing a configuration requires validation to pass; a failed validation cannot be overridden, only fixed |
| BR-M34-03 | Configuration drafts use optimistic concurrency; a stale save is rejected with the current version and a diff, never merged silently |
| BR-M34-04 | Promotion between environments copies published configuration values only — never domains, secrets, store-owned settings, delegated feature states, users or business data |
| BR-M35-01 | Provisioning and deployment are idempotent and resumable step machines; a retried step never double-creates |
| BR-M35-02 | A store goes live only after its smoke test passes; a failed deployment rolls back to the previous config version and leaves the store serving |
| BR-M35-03 | Decommissioning a store is a two-person action with a retention period before destruction |
| BR-M35-04 | A migration affecting more than one store runs as a canary followed by batches, never all stores at once |
| BR-M35-05 | Restoring one store never restores in place over a shared database; it runs through scratch-restore, store-scoped export and key-preserving import under that store's tenant context |

## 15. Testing (suites registered in `16-testing.md` §18)

| Suite | Covers |
|---|---|
| `TS-SAAS-SEP` | Codebase/runtime separation SEP-1…SEP-6 |
| `TS-SAAS-CFG` | Schema validity, layer resolution, compile determinism, immutability, rollback, L4 overlay, secrets exclusion |
| `TS-SAAS-CAP` | Capability registry completeness, all six enforcement points, dependency/conflict resolution, no-delete-on-disable, surface/module/capability resolution order, the three control states, delegation invariants CTL-1…CTL-7, the run-out rule |
| `TS-SAAS-PACK` | Pack validation, seeds, identity models, workspace/vendor/storefront profiles, no pack-id branching, composition, version migration |
| `TS-SAAS-TPL` | Template contract, token consumption, add/update/remove lifecycle, template switch without data change, a11y per template |
| `TS-SAAS-TERM` | Token coverage, no hard-coded concept words, pluralisation, locale fallback |
| `TS-SAAS-ISO` | Invisibility rules INV-1…INV-10 and cross-store data isolation (the leak suite) |
| `TS-SAAS-PERF` | The `§4.5` budget table |
| `TS-SAAS-DEPLOY` | Provisioning/deployment idempotency, resume, rollback, smoke test, decommission, canary batching, draft concurrency, environment promotion, single-store restore |
| `TS-SAAS-REL` | Schema-change classes, migrate-and-rebuild release procedure, two-schema acceptance window, rollback eligibility (`§17`) |
| `TS-SAAS-EDGE` | Every row of `§23` as an executable case |
| `TS-SAAS-CHAN` | Channel model: publish blocked without a verified binding/sender/template; consent, caps and quiet hours enforced centrally; idempotent send; delivery tracking and suspension; switching a channel off stops sends and hides it everywhere |
| `TS-SAAS-AUTO` | Each automation is independently grantable; a disabled automation is never scheduled; idempotent execution; failure opens an exception case; pause without deployment |
| `TS-SAAS-EXP` | Store experience contract `§8` |
| `TS-PROOF-11`, `TS-PROOF-12` | Stage 0 proof: isolation and configuration cost on each candidate core (`D-252`) |

Two stores are present in every integration and E2E run: `VP-electronics`/`TPL-forge` and
`VP-fashion_apparel`/`TPL-aurora`. A test that passes with one store and fails with two is the exact failure this
architecture exists to prevent, so the second store is not optional (`16 §18.2`).

## 16. What this means for the existing plan (module-by-module)

| Existing module | Change required |
|---|---|
| M01 Foundation | Repo layout gains `root-admin/`; backend skeleton gains the platform packages; config loader is the L5 layer only |
| M02 Identity | `store_id` on users, roles, sessions, audit; a user belongs to exactly one store (platform users are a different table in a different database); permission checks run **after** capability checks |
| M03 Organisation | Company/branch/location are *inside* a store; `store_id` added |
| M04 Catalog | Category tree and attribute schemas come from the pack; identity model (serial/batch/unique) becomes configuration; condition grades and compatibility become capabilities |
| M05 Pricing | Tiering, promotions, location pricing, per-unit-of-measure pricing become capabilities; money rules unchanged (BP §8.1) |
| M06 Inventory | Identity model drives serial vs batch vs unique; cold chain and shelf life are capabilities; ATP unchanged |
| M07 Purchasing | QC/inspection, landed cost, reorder rules become capabilities |
| M08 Customers | B2B accounts, dealer applications, credit terms become capabilities; buyer terminology becomes tokens (`D-006`) |
| M09 Storefront | Pages render through the **template** using pack profiles; every string is a token; theme from `theme.css` |
| M10 Orders | Checkout steps are configuration (slots, appointments, licences); order state machine unchanged (BP §10.1) |
| M11 Payments | Provider set, COD, EMI, deposits become configuration/capabilities; idempotency unchanged (BP §10.2–10.3) |
| M12 Fulfilment | Shipping mode set becomes configuration; digital/service/rental modes are capabilities |
| M13 Returns | Policy classes from the pack; exchanges and non-returnable classes are capabilities |
| M14 Vendor | Vendor portal itself is a capability; submission fields come from the pack profile |
| M16 Support | Channels and levels become capabilities; templates carry store identity only |
| M17 Automation | Automation rules are store-scoped; the rule set available is capability-gated |
| M18 Reporting | Every report is store-scoped; report set comes from the pack profile |
| M19 Finance | Tax/invoice configuration is store-level; compliance rules per store jurisdiction |
| M20 Notifications | Templates are store-scoped and token-driven; sender identity is the store's |
| M21 Search | Index is partitioned by store; facets come from the pack schema |
| M22 Files | Object storage prefixed per store; asset variants per store |
| M23 Integrations | Credentials per store, encrypted per store; the adapter set is capability-gated |
| M24 Administration | **Split**: P-E15 is the *store* admin (store-editable keys only, `§9` INV-4); platform administration moves to M34 |
| M25 Migration | Migration runs per store; the Tradex migration becomes "migrate legacy data into store `tradex`" |
| M26 Security/ops | Per-store backup/restore granularity, per-store rate limits, cross-store leak testing |
| M27 SEO | Sitemaps, robots, canonical hosts and redirects per store; `noindex` for non-production stores |
| M28/M29 | Unchanged (`LATER`); the mobile app will consume `theme.json` and the same config contracts |

## 17. Configuration schema evolution and platform releases (`D-259`)

The single most dangerous property of a compiled-configuration design is that a published artefact was built
against a **schema** that ships with the code. If a release changes that schema, every store's artefact is stale.
The rule that keeps this safe:

### 17.1 Change classes

| Class | Examples | Effect on published artefacts |
|---|---|---|
| **Additive** | new optional key with a default; new capability defaulting to off; new terminology token with a pack-supplied value | Compatible. Existing artefacts keep serving; the new key takes its default until a store is republished |
| **Widening** | new enum value; relaxed validation; new optional section | Compatible |
| **Breaking** | removing a key; changing a type; tightening validation; renaming; changing the meaning of a value; changing the artefact file set | **Incompatible.** Every store's configuration must be migrated and every artefact rebuilt |

### 17.2 The release procedure for a breaking change (`BR-M31-14`)

1. Deploy the new platform release to the **root admin only**.
2. Run the configuration migration against the root admin database: it rewrites stored values for every store and
   every retained version, and fails the release if any store cannot be migrated.
3. **Rebuild** every store's current artefact against the new schema. Because compilation is deterministic
   (`§4.2`), a rebuild that should change nothing produces output identical except the schema hash — which is the
   proof that the migration did not change behaviour by accident. Any store whose rebuild differs unexpectedly
   stops the release.
4. Deploy the new store-platform release.
5. Publish the rebuilt artefacts.
6. Verify every instance reports the new version (`§4.4` step 6) before the release is called done.

During the rollout window a store runtime accepts artefacts built for **its own schema version and the one
immediately before it**, so a rolling deploy never has an instance that refuses everything. Outside that window it
fails closed as `BR-M31-04` requires. A release whose artefacts cannot all be rebuilt does not ship.

### 17.3 Rollback across a schema change

Rolling back to a version built on an older schema is refused by the loader (schema hash mismatch). The supported
path is to roll back the **platform release**, which restores the older schema, and then republish. The root admin
shows which retained versions are rollback-eligible for the running release, so an operator is never offered a
version that would fail.

## 18. Per-store backup, restore, export and deletion (`D-260`)

A shared database makes "restore one store" a real problem. Hand-waving it would be the difference between a plan
and a working system, so the mechanism is defined here.

| Operation | Mechanism |
|---|---|
| **Backup** | Per-store database backup with point-in-time recovery (`D-108`), per-store media container backup, plus the immutable artefact store. Retention and residency can differ per client because the resources are separate |
| **Restore one store — separated database (default)** | A direct restore of that store's own database to the chosen point in time. No other client is involved, which is one of the main reasons separation is the default. Media is restored from that store's own container |
| **Restore one store — shared database (exception topology only)** | Never in place. (1) Restore the cluster to a scratch instance at the chosen point in time; (2) run the store-scoped logical export for that `store_id` only; (3) load it back under the same `store_id` through an idempotent, key-preserving import; (4) reconcile control totals. The import runs under that store's tenant context like everything else |
| **Restore everything** | Ordinary cluster restore; every store returns to the same point in time. Artefacts are unaffected because they are immutable and content-addressed |
| **Export a store** | A complete, documented, machine-readable export of the store's business data, its store-owned settings and feature states, its published configuration artefact and its media. Produced on request for portability, end of contract, or a legal request. Personal data handling follows `D-036`/`D-122` |
| **Delete a store** | Two-person, retention period, then destruction with evidence (`BR-M35-03`). **Backups still contain the data until they age out** — this is stated to the owner rather than hidden, and the backup retention becomes the real deletion deadline |

Rehearsal is mandatory, not optional: a single-store restore is rehearsed and timed before launch, and the measured
time becomes the store-level recovery-time figure quoted to clients (`T-1A.17-M26-09`).

## 19. Money, currency, units and time across stores (`D-261`)

One database now holds rows belonging to stores in different jurisdictions. That changes three things.

| Rule | Detail |
|---|---|
| **MON-1** | A store has exactly one selling currency in Phase 1 (`CAP-MULTI_CURRENCY` off). Changing it after the store has orders is refused — it is a new store, not a setting (`§23`) |
| **MON-2** | Money is stored as an integer in the currency's **minor unit together with its currency code**. A bare integer is not enough once one table holds INR (2 decimal places), JPY (0) and KWD (3). Every money value therefore carries its currency; the kernel type enforces it |
| **MON-3** | **No query may sum, average, compare or rank money across stores.** Cross-store money aggregation is meaningless without an explicit conversion and a recorded rate, and Phase 1 does not do it. The repository layer refuses an aggregate over money without a store filter, in the same way it refuses any unscoped query (`BR-M30-02`) |
| **MON-4** | Rounding and tax arithmetic follow BP §8.1 unchanged, applied per currency at the documented step. Floating point remains forbidden |
| **UOM-1** | Units of measure and whether decimal quantities are allowed come from the pack (`§6.1`). Quantity precision is part of the schema, not decided per record |
| **TIME-1** | Every store has a business-day timezone (`D-124` becomes a per-store value). Storage is UTC; day close, cut-off times, scheduled reports, digests and "today" in every screen use the store's timezone |
| **NUM-1** | Document numbers, sequences and fiscal series are per store (`03` §11.1). A shared sequence would leak one store's volume to another |

## 20. Quotas, rate limits and noisy-neighbour control (`D-262`)

One store must not be able to degrade another. Limits are set per store, default from the platform, and are
visible to the operator but invisible to the store except as an ordinary "too many requests" response that names
nothing (`§9` INV-1).

| Limit | Why |
|---|---|
| API requests per minute, per store and per client | Abuse and runaway integrations |
| Authentication, checkout and payment attempts | Fraud and card testing (BP §19.1) |
| Background-job concurrency per store | One store's bulk import must not starve the queue for everyone |
| Outbound messages per hour (email, SMS, WhatsApp) | Cost, provider reputation, and consent rules (`D-058`) |
| Storage and media size | Cost and backup time |
| Import rows and export size per run | Memory and lock duration |
| Search queries per minute | Index protection |

Rules: a store approaching a limit raises an operator alert before it starts failing; raising a limit is an
audited configuration change; and a limit is never enforced in a way that discloses another store's existence or
the platform's shape.

## 21. Environments and promotion (`D-263`)

A store may exist twice: once in `staging`, once in `production`, with the same store key.

- The configuration draft is per store **per environment**. Editing staging never touches production.
- **Promotion** copies the values of a *published* staging version into the production **draft**, then goes
  through the ordinary validate → compile → diff → publish path. It is never a direct write to production.
- Promotion deliberately does **not** copy: domains and certificates, integration credentials and secrets,
  store-owned settings (layer L4), the store's delegated feature choices, users, or any business data.
- Staging stores are always `noindex`, always use test provider credentials, and are visibly marked inside the
  workspace so staff cannot mistake one for the other.
- A production store may be created directly, without a staging twin; staging is a tool, not a gate.

## 22. Observability, incidents and blast radius (`D-264`)

| Rule | Detail |
|---|---|
| **OBS-1** | Every log line, trace span, metric and captured error carries `store_id`, and carries no personal data and no secret (BP §19.1, §20.3) |
| **OBS-2** | Dashboards and error budgets exist per store as well as per service; an alert names the affected store or states that it is platform-wide |
| **OBS-3** | Incident severity includes the number of stores affected. "One store's checkout is failing" and "every store's checkout is failing" are not the same incident |
| **BLAST-1** | A configuration publish affects exactly one store |
| **BLAST-2** | A pack or template update affects only stores explicitly migrated, and a migration touching more than one store runs as a **canary first**: one store, verified against its smoke test, then the rest in batches. Never all at once |
| **BLAST-3** | **A root admin outage does not take a single store down.** Stores serve from their in-memory snapshot and their on-disk artefact; only publishing, deploying and configuring stop. This is an availability property of the one-way dependency (`§2` SEP-1) and it is tested, not assumed (`TS-SAAS-DEPLOY-08`) |
| **BLAST-4** | A platform release follows `§17.2`; a store-platform release rolls out per instance with the two-schema acceptance window |

## 23. Edge cases and combination rules

The combinations that are easy to get wrong, and the behaviour the implementation must produce. Each is a test
case, not a guideline.

### 23.1 Configuration and publishing

| # | Situation | Defined behaviour |
|---|---|---|
| E-01 | Two operators edit the same store draft | Optimistic concurrency on the draft: the second save is rejected with the current version and a diff of what changed. No silent last-write-wins |
| E-02 | Publish requested while a deployment is already running for that store | Refused. One deployment per store at a time; the operator is shown the running run |
| E-03 | The same configuration is published twice (retry, double click, replayed request) | Idempotent on the request key: one version, one artefact, one event (`D-079`) |
| E-04 | An instance starts while a publish is in progress | It loads the `current` pointer, which only moves after the artefact is complete and verified. It never sees a half-written artefact |
| E-05 | Two instances apply different versions for a few seconds | Allowed and expected during propagation. In-flight requests finish on the version they started with (`§4.4`); the drift alarm fires only outside the propagation budget |
| E-06 | Version numbers arrive out of order (a delayed event) | Versions are monotonic per store; an instance never moves backwards on an event, only on an explicit rollback publication |
| E-07 | The artefact store is unavailable at boot | The instance boots from its on-disk copy. If that is missing or corrupt it refuses to serve that store and reports it, rather than serving a default configuration |
| E-08 | Rollback to a version built on an older schema | Refused by the loader; the root admin only offers rollback-eligible versions (`§17.3`) |

### 23.2 Packs, templates and migrations

| # | Situation | Defined behaviour |
|---|---|---|
| E-09 | A pack update removes an attribute that a store's products use | The migration preview lists it and the migration is refused until the operator chooses: keep the attribute as store-local, or export and remove it. Never silently dropped |
| E-10 | A pack update changes the item identity model (serial → batch) after stock exists | Refused. Identity model is fixed once stock movements exist; changing it is a data migration project, not a configuration change |
| E-11 | A pack update changes variant axes after products exist | Refused if products would become ambiguous; allowed additively (a new axis with a default value) with a preview |
| E-12 | A template is retired while a store uses it | Retirement is blocked while any store uses it (`§6.6`); deprecation is the only available step |
| E-13 | A template update changes a layout the store has content for | Templates hold no content, so nothing is lost; the preview shows the new arrangement before publishing |
| E-14 | Pack and template are both updated in one publish | Allowed; the diff shows both, and the smoke test covers both. If either fails, the whole publish rolls back |
| E-15 | A pack is migrated for many stores at once | Canary first, then batches (`BLAST-2`) |

### 23.3 Modules, capabilities and delegation

| # | Situation | Defined behaviour |
|---|---|---|
| E-16 | A capability is switched off while work is in flight (open returns, unshipped orders, pending approvals) | **Run-out rule:** existing records stay reachable and completable by staff, no new ones can be created, and the customer-facing surface disappears immediately. The operator is told how many open records exist before confirming |
| E-17 | A module is switched off with open work inside it | Same run-out rule, applied to every capability in the module, plus a blocking confirmation listing the open work |
| E-18 | A store switches off a delegated capability that another enabled capability depends on | Refused with a plain-language explanation naming the other feature in the store's own words. Dependencies are resolved before the switch is offered |
| E-19 | The root admin moves an item `delegated → off_locked` while the store had it on | The item turns off, the store's value is preserved, and the store's audit records that the change came from the platform (CTL-6) |
| E-20 | The root admin moves an item `off_locked → delegated` | It appears in the store's Features screen in its last known state, or off if it has never been on |
| E-21 | A job is queued for a capability that has since been switched off | Dead-lettered with a reason, never silently executed (`§5.2` point 5) |
| E-22 | `MOD-administration` is set to `off_locked` | Rejected by validation — a store must always be able to manage its own people and audit (`§5.4.2`) |
| E-23 | A surface is disabled while users of it are signed in | Their sessions stop resolving for that surface at the next request; they get the neutral response, not an error naming the surface |

### 23.4 Store lifecycle

| # | Situation | Defined behaviour |
|---|---|---|
| E-24 | A store is suspended with paid, undispatched orders | Storefront shows the store-branded notice; staff keep read access and can still dispatch and refund, because abandoning a paid customer is not an acceptable outcome. New orders are refused |
| E-25 | A webhook (payment, courier) arrives for a suspended store | Accepted, recorded and processed for reconciliation; it is money that already moved. It never creates a new order |
| E-26 | A webhook arrives for an archived or destroyed store | Acknowledged and recorded as unmatched, never applied. Alerts the operator so the provider account can be closed |
| E-27 | A store changes currency or jurisdiction after it has orders | Refused. Historic money and tax cannot be reinterpreted; this is a new store |
| E-28 | A custom domain is claimed by two stores | The registry enforces global uniqueness of verified hosts; the second claim fails verification with a neutral message |
| E-29 | A store key collides with an existing one | Rejected at creation; keys are globally unique and permanent |
| E-30 | A store is decommissioned with open refunds or an unreconciled settlement | Blocked until finance confirms; the danger-zone check lists what is open |

### 23.5 Data, search and integrations

| # | Situation | Defined behaviour |
|---|---|---|
| E-31 | A search query is issued while a store's schema is being migrated | The index is versioned per store; queries continue against the current index until the new one is built and swapped |
| E-32 | Two stores use the same integration provider account by mistake | Credentials are per store and encrypted per store; the platform warns when the same account fingerprint appears in two stores, because settlement and webhooks would become ambiguous |
| E-33 | A locale is removed while customers have it as a preference | Those customers fall back to the store's default locale; no record is deleted |
| E-34 | A domain is removed while emails already sent contain links to it | The host keeps resolving to a redirect for a retention period rather than breaking every link already in an inbox |
| E-35 | A vendor user exists in a store whose vendor module is switched off | The user cannot sign in to a surface that does not exist; the account and its history are retained and reappear if the module is switched back on |

## 24. Definition of done and the quality gates

The brief asks for a system that works correctly the first time. No plan can guarantee defect-free code — that
would be untrue and the estimate built on it would be wrong. What a plan **can** do is remove ambiguity, make
every requirement testable, and define gates that a change cannot pass while broken. That is what this section
fixes.

### 24.1 A task is `COMPLETED` only when all of these hold

| # | Gate |
|---|---|
| 1 | Every acceptance criterion in the task block is demonstrably met, with the evidence recorded in the block |
| 2 | Unit tests exist for every business rule the task adds, including its failure paths, not only its happy path |
| 3 | Integration/service tests cover the task's services against a real database, **with the two-store fixture** |
| 4 | Every API endpoint the task adds has a contract test: shape, status codes, error envelope, pagination, idempotency, and the 404-not-403 rule for a disabled capability |
| 5 | Every migration runs forward on an empty database and on a populated one, and its rollback is tested |
| 6 | Every UI component the task adds has a component test covering loading, empty, error and permission-denied states |
| 7 | Every user-visible flow the task completes has an end-to-end test on its surface |
| 8 | Accessibility checks pass for every screen the task touches (WCAG 2.2 AA, `D-051`) |
| 9 | The performance budget of `§4.5` still holds — the CI budget job is green |
| 10 | The isolation suite is green, including the mutation check (removing a tenant filter must break a test) |
| 11 | Security checks for the task's area pass (`16` §5 security suites) |
| 12 | Lint and boundary checks pass: import boundary, no pack-id branching, no hard-coded concept word, no hard-coded visual value, no banned vocabulary, migration `store_id` check |
| 13 | Terminology coverage is complete for every locale the affected stores enable |
| 14 | Documentation the task names exists: runbook, handover page, or help content |
| 15 | `python3 plan/tools/status.py --check` reports zero issues and `TASKS.md` + `STATE.md` are updated |

A gate that cannot run in the environment is **not** a pass: the task stays `IN_PROGRESS` and the reason is
recorded (`14-continuation-protocol.md` step 16, unchanged).

### 24.2 What CI runs on every change

Unit · integration (two stores) · API contract · database and migration · UI component · end-to-end per surface ·
accessibility · performance budget · security · isolation and leak · determinism of the compiler · idempotency and
resume of the deployment machine · rollback · terminology coverage · lint and boundary checks. A red gate blocks
the merge. There is no "fix it later" path, because the cost of a tenancy or configuration defect found after two
stores are live is an order of magnitude higher than the cost of the gate.

### 24.3 What is measured, and what is not

Branch coverage is measured on business-rule code and on the platform layer, and reported per module; a number is
set from the first real measurement rather than invented here. Mutation testing is used where it actually proves
something — the tenant filter and the capability guards — rather than everywhere. Coverage is a signal, not a
target to game: a task with 100 % coverage and no failure-path assertions fails gate 2.

## 25. Performance architecture — the storefront, the workspace and the vendor portal (`D-268`)

`§4.5` guarantees that the configuration layer costs nothing. That is necessary but not sufficient: it says the
SaaS machinery is free, not that the applications are fast. This section sets the engineering rules that make
all three surfaces fast, and the budgets that keep them fast.

> The two are deliberately separate. If a page is slow, the first question is which budget it broke — the
> configuration budget (`§4.5`) or the application budget (`§25.2`) — because the fixes are completely different.

### 25.1 Where slowness actually comes from

Multi-store systems are rarely slow because of tenancy. In order of real-world impact:

| Cause | Where it bites | Prevented by |
|---|---|---|
| N+1 queries in list and detail screens | Workspace and vendor lists, storefront product pages | `§25.3` query-count tests |
| Unbounded or `OFFSET`-paginated lists | Order, product and stock screens once data grows | Keyset pagination, bounded result sets |
| Missing or wrongly ordered indexes | Everything, suddenly, at a certain data size | `store_id`-leading index rule, index review on every migration |
| Rendering the whole page as client-side JavaScript | Storefront first paint | Server-rendered HTML with hydrated islands |
| Synchronous heavy work in a request | Imports, exports, reports, bulk actions | Everything heavy is a job |
| Chatty APIs from the workspace | Every staff screen | Screen-shaped endpoints, not entity-shaped ones |
| Cache keys that forget the store or the buyer context | Correctness *and* speed | Mandatory cache-key composition |
| One store's bulk work starving the queue | Every other store | Per-store fair share (`§20`) |
| Images and fonts | Storefront LCP and CLS | Responsive images, explicit dimensions, self-hosted preloaded fonts |

### 25.2 Budgets, per surface — measured in CI, not aspirations

| Surface | Metric | Budget |
|---|---|---|
| Storefront | LCP p75, mid-range mobile on a throttled connection | ≤ 2.0 s |
| Storefront | INP p75 | ≤ 200 ms |
| Storefront | CLS | ≤ 0.1 |
| Storefront | HTML time to first byte p95 | ≤ 200 ms cached · ≤ 500 ms uncached |
| Storefront | JavaScript shipped on a product page | ≤ 150 KB compressed |
| Storefront | Database queries per page render | ≤ 12, asserted per route |
| Workspace | Interactive on a list screen p75 | ≤ 1.5 s |
| Workspace | List query p95, 50 rows with filters | ≤ 300 ms |
| Workspace | Action round trip p95 (save, approve, dispatch) | ≤ 500 ms |
| Workspace | Database queries per list screen | ≤ 8, asserted per screen |
| Vendor portal | Same as workspace | Same |
| API | p95 ≤ 500 ms · p99 ≤ 1 s (BP §20.1, `D-034`) | |
| Search | p95 ≤ 200 ms | |
| Configuration layer | `§4.5` in full | 0 queries, 0 I/O |

Budgets are asserted on realistic data volumes (`D-010`), not on an empty database, and with **two stores
present**. A pull request that breaks a budget fails, in the same way a failing test fails.

### 25.3 Data-access rules (`BR-M30-08`)

1. **No N+1, ever.** Every list and detail endpoint has a declared maximum query count, asserted by a query
   recorder in its test. This single rule prevents most ERP slowness.
2. **Keyset pagination** on every table that grows — orders, stock movements, audit, messages. `OFFSET` is
   forbidden beyond the first few pages because it degrades exactly when a store becomes successful.
3. **Every query path has an index whose leading column is `store_id`**, followed by the query's own selectivity.
   A migration that adds a query path without its index does not pass review.
4. **Bounded results.** No endpoint returns an unbounded set; every list has a maximum page size and every export
   is a job.
5. **Read models for hot paths.** The storefront product and category projections, and the workspace order list,
   are maintained projections rather than an eight-table join per request, invalidated on publish and on write.
6. **Statement timeouts and a per-request query budget.** A request that exceeds its budget fails loudly in
   development and is logged with its query plan in production, rather than quietly taking two seconds.
7. **No long transactions on the request path**, and no transaction held across an external call.
8. **Everything heavy is asynchronous**: imports, exports, reports, bulk actions, media processing, index
   rebuilds. A request either returns quickly or returns a job.
9. **Partition by `store_id`** on any table that passes the agreed size threshold, with per-store statistics so
   the planner does not choose a plan tuned to the largest store for the smallest one.

### 25.4 Caching — five layers, each with a defined key and invalidation

| Layer | Contents | Key includes | Invalidated by |
|---|---|---|---|
| 1. In-process snapshot | Configuration, capabilities, terminology, navigation, catalog schema | store | Publish (`§4.4`) |
| 2. CDN / edge | Static assets, `theme.css`, images | content hash | Never — filenames are immutable |
| 3. CDN / edge | Public storefront HTML | store + route + buyer-context class + config version | Publish, catalog publish, price publish |
| 4. Shared cache | Read models, projections, search results, serviceability | **store** + entity + version | Write to the underlying entity |
| 5. Per request | Memoised lookups inside one request | request | End of request |

Rules: **every cache key contains the store** (`BR-M30-09`) — a key that forgets it is both a leak and a
correctness bug; private or buyer-specific data never enters a shared cache; stampede protection on every
expensive rebuild; and cached HTML is only ever public content, never a signed-in page.

### 25.5 Rendering

- **Storefront:** server-rendered HTML streamed for first paint, with interactivity hydrated only where it is
  needed (add to basket, variant picker, filters). A product page never boots a full client application to show
  text and a price. Images carry explicit dimensions and responsive sources; fonts are self-hosted, preloaded and
  swap-safe.
- **Workspace and vendor portal:** an application shell with per-screen data loading, virtualised tables for long
  lists, and screen-shaped endpoints so one screen is one round trip rather than nine. Optimistic updates only
  where a failure is safely reversible.
- **Both:** capability-gated code splitting, so a store that does not have a feature never downloads it
  (`§5.2` point 4) — which makes disabling a feature a performance win as well as a correctness one.

### 25.6 What multi-store costs, and how it is kept at zero

| Concern | Answer |
|---|---|
| Memory per store per process | Bounded (`§4.5`); cold stores evicted by LRU, hot stores pinned, never evicted mid-request |
| Build explosion | **One build per template**, not one per store. Themes are CSS custom properties, so a single CSS bundle serves every store and only the small `theme.css` differs |
| Query cost of scoping | One extra leading index column. Measured on each candidate core in `TS-PROOF-11` |
| Cross-store noise | Per-store quotas and fair-share scheduling (`§20`) |
| Search | Per-store index, or a single index with the store filter enforced at the index layer — never at the application layer, where it can be forgotten |
| Connection pool | A pooler in front of the separated databases with per-store ceilings and a shared upper bound, so one runtime can serve many clients without one idle pool per client |
| Migration time | Scales with the number of stores, so the fleet runner batches and runs in parallel with a concurrency cap, canary first; a release plans for it rather than discovering it |
| Cross-store queries | Impossible by construction, which is the point. Platform counts come from the root admin registry and reported metrics, never from client data |

### 25.7 Technology properties the chosen core must have (`D-001`, `D-002`, `D-003`)

This does not pre-empt the platform decisions; it states what the proof must show:

- Connection pooling and prepared statements, without a per-request connection.
- A data-access layer that can express a bounded, index-using query — not one that generates a query per row.
- A durable background-job runtime (already required by `M17`).
- Server-side rendering with streaming for the storefront, and code splitting for all three surfaces.
- The ability to hold an immutable object in process memory for the process lifetime across its worker model.
- Stage 0 gains **`TS-PROOF-13`**: a realistic workspace order-list screen and a storefront product page, on
  seeded data at the agreed volumes, with two stores, measured against `§25.2` on every candidate core
  (`T-0-M09-06`). A core that cannot meet the budgets is not chosen, however well it scores elsewhere.

### 25.8 Keeping it fast after launch

Budgets run in CI on every change; synthetic checks run per store per environment; real-user measurement is
collected per store and reviewed against the budgets; a regression fails the build rather than being noticed a
month later by a customer. The load test uses the agreed growth scenario (`D-207`) with at least two stores and
the realistic traffic mix, not a synthetic benchmark.

## 26. Implementation contracts — how to build a capability, a channel and an automation

`§5` says what the control model *is*. This section says what a developer, or an AI session, actually writes. It
exists because "enforce the capability at six points" is not an instruction anyone can follow without knowing
what the six pieces look like. Each contract is a checklist that the corresponding test asserts.

### 26.1 Adding a capability — the nine artefacts

Every capability needs all nine. `TS-SAAS-CAP-01` fails if any is missing, so a half-wired capability cannot
reach a store.

| # | Artefact | Where | What it contains |
|---|---|---|---|
| 1 | **Declaration** | `backend/platform/capabilities/registry/<area>.*` | id, area, owning module, plain-language name and description, `depends_on`, `conflicts_with`, `data_retaining`, default per pack, lockable, the `CFG-*` keys it governs, build status |
| 2 | **Route registration** | The module's route table | Routes registered only when the capability resolves on; otherwise the path does not exist |
| 3 | **API guard** | The endpoint definition | Declares its capability; the framework answers **404** when off, before authentication, and the endpoint is absent from the store's generated API surface |
| 4 | **Service guard** | The service entry point | `requireCapability(CAP_X)` — defence in depth for internal callers, jobs and imports; throws `CapabilityDisabled` |
| 5 | **UI gating** | The screen or component | Component not rendered *and* not in the shipped bundle: the capability is a code-splitting boundary, not a runtime `if` |
| 6 | **Job registration** | The scheduler wiring | Jobs registered only when on; queued messages for a disabled capability are dead-lettered with a reason |
| 7 | **Data-out filters** | Export, search index, report and notification builders | Rows and fields excluded when off — never merely hidden in the UI |
| 8 | **Terminology** | The token registry | Every user-visible word the capability introduces, for every locale the packs using it support |
| 9 | **Tests** | Beside the code | On-path, off-path (404 and absent bundle), dependency resolution, conflict rejection, and disable→re-enable leaves data unchanged |

**The order matters.** Write the declaration first, then the tests, then the rest: a capability whose declaration
is written last always ends up with one of the six enforcement points missing.

Anti-patterns that the lint rules reject:

| Anti-pattern | Why it is wrong |
|---|---|
| `if (store.pack === "VP-fashion_apparel")` | Behaviour must come from capabilities and schema, never a pack id (`BR-M32-02`) |
| `if (!cap.can(X)) return 403` | Discloses that the feature exists. It is 404 (`§9` INV-3) |
| `if (!cap.can(X)) { /* render disabled button */ }` | A greyed control tells the store somebody else is in charge (`§9` INV-4) |
| Capability checked only in the UI | The API, jobs and exports are the paths that actually leak |
| Deleting rows when a capability is switched off | Disabling hides; it never deletes (`BR-M31-03`) |
| Reading the capability from the database per request | Zero request-path I/O for configuration (`BR-M31-01`) |

### 26.2 Adding a communication channel — the adapter contract

A channel is one adapter plus its bindings; adding one makes it available to **every** store, not one.

```
interface ChannelAdapter {
  id                 // "whatsapp" | "email" | "sms" | "web_chat" | "push_web" | ...
  capabilities       // the CAP-* ids this adapter serves
  verifySender()     // proves the store owns the number/domain; returns a verification state + evidence
  templateContract() // fields, variables, length and approval rules the provider imposes
  send(message)      // idempotent on the message key; never called without a consent basis
  parseDeliveryStatus(payload)   // provider callback -> delivered | failed | read, with a reason code
  parseInbound(payload)          // inbound message -> conversation + message (for two-way channels)
  limits()           // provider throughput, message size, window rules
}
```

Rules the adapter may **not** implement itself, because they must be identical on every channel and are therefore
enforced once, in the messaging service (`BR-M20-01`…`BR-M20-05`):

| Rule | Enforced centrally |
|---|---|
| Consent basis per channel **and** purpose, with proof and withdrawal | `ConsentService` |
| Customer notification preferences | `PreferenceService` |
| Frequency caps and quiet hours, **across all channels together** | `MessagingPolicy` |
| Idempotency — one business event produces one message, however many times it is retried | `Outbox` + message key |
| Template resolution, versioning and approval state | `TemplateService` |
| Per-store rate limit and cost metering | `QuotaService` (`§20`) |
| Delivery-status recording, retry with backoff, and channel suspension on repeated failure | `DeliveryTracker` |
| Personal data redaction in logs | `MessagingLogger` |

So `send()` is genuinely just "hand these bytes to this provider". Everything that can harm a customer or a
sender reputation lives above it, in one place, tested once.

### 26.3 Adding an automation — the rule contract

```
interface AutomationRule {
  id                 // CAP-AUTO_*
  trigger            // event | schedule | threshold
  scope              // always store-scoped; the store context comes from the job payload (BR-M30-04)
  guard(ctx)         // capability + configuration + data preconditions; false means "not applicable", not an error
  preview(ctx)       // what it would do, for the owner to review before it is enabled
  execute(ctx)       // idempotent; every effect is a recorded action, never a silent write
  onFailure(ctx,err) // opens an exception case with owner, severity and the data needed to fix it
  valueEstimate()    // minutes saved per case, for D-193 value tracking
}
```

| Rule | Detail |
|---|---|
| AUT-1 | Every automation is its own capability, so it can be granted per store (`§5.3` N) |
| AUT-2 | An automation that sends a message requires its channel **and** its template; the compiler blocks a configuration where it is enabled and they are not (`CH-1`) |
| AUT-3 | `execute()` is idempotent on the triggering event; a retried job produces one outcome, not two (BP §12.3) |
| AUT-4 | Every run is logged with input, decision, outcome and duration — an automation nobody can audit is an automation nobody can trust |
| AUT-5 | Every automation can be paused by the owner without a deployment, and the pause is audited |
| AUT-6 | Failure opens an exception case with a named owner; it never retries silently forever |

### 26.4 Adding a configuration key

Declare it in the schema (`§3.2`) with all eleven fields — including `editable_by`, `lockable` and the
plain-language `doc` string that both admin screens display. Then: a default at L0, validation used by both the
compiler and the write path, a test for a valid and an invalid value, and terminology for any word it introduces.
A key that is not in the schema cannot be stored, compiled or read, so there is no shortcut.

### 26.5 Adding a screen or a field

| Step | Requirement |
|---|---|
| 1 | Which capability owns it? Look it up in `21-feature-map.md`. If there is no row, either it belongs to an existing capability — add the row — or it needs a new declaration. Nothing store-facing exists without a capability (`TS-SAAS-CAP-02`) |
| 2 | Which pack profile decides whether it appears, and in what order? (`§6.3`–`§6.5`) |
| 3 | Every label, heading, column name, status and empty-state sentence is a terminology token (`§11`) |
| 4 | Every colour, font, radius and spacing comes from the theme contract (`§7.4`) |
| 5 | Declared maximum query count, and keyset pagination if it lists a growing table (`§25.3`) |
| 6 | Loading, empty, error and permission-denied states, and an accessibility pass (`§24.1` gate 6 and 8) |
| 7 | Help content for the workspace, because the completeness gate requires it (`§6.9` dimension 23) |

### 26.6 The order to build things in

For any new area of behaviour: **declaration → schema keys → terminology tokens → data model with `store_id` →
service with its guard → API with its capability and contract test → jobs → UI → exports and reports → help
content → pack profile entries → seed content**. Every step after the first is cheap; doing them out of order is
what produces a feature that works for one store and leaks for another.

## 27. Decision index for this file

Decided (all recorded in `DECISIONS.md`, 2026-09-28): `D-227` direction · `D-228` two platforms · `D-229`
invisibility · `D-230` DB-driven config · `D-231` artefact · `D-232` invalidation · `D-233` isolation · `D-234`
store resolution · `D-235` deployment model · `D-236` capabilities · `D-237` packs · `D-238` templates · `D-239`
terminology · `D-240` branding/theme · `D-241` Phase-1 packs · `D-242` Phase-1 templates · `D-243` store-editable
subset · `D-244` root admin stack · `D-245` root admin auth · `D-246` support access · `D-247` pack/template
lifecycle · `D-248` performance budget · `D-249` mockup location · `D-250` bootstrap content · `D-251` Tradex
becomes a store · `D-252` Phase-0 proof additions · `D-253` root admin screens.

Added 2026-09-28 (second pass, after the production-readiness review): `D-257` surfaces and modules · `D-258`
two-level control and delegation to the store administrator · `D-259` configuration-schema evolution and release
procedure · `D-260` per-store backup, restore, export and deletion · `D-261` money, currency, units and time
across stores · `D-262` quotas and rate limits · `D-263` environments and promotion · `D-264` observability and
blast radius.

Open but **not blocking Phase 1**: `D-254` commercial/billing model (`LATER`) · `D-255` pack build order after
Phase 1 · `D-256` per-store data residency. Superseded: `D-045`.
