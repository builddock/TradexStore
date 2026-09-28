# 20 — Configurable Root Admin platform (separate portal, separate codebase)

**Source:** `docs/SAAS_ARCHITECTURE_CHANGE.md` §1 "Configurable Root Admin" and §3 S04–S11 · decisions `D-228`,
`D-244`–`D-247`, `D-249`, `D-250`, `D-253`.
**Companion file:** `19-saas-platform.md` (tenancy, configuration, capabilities, packs, templates).
**Module:** `M34` (platform) and `M35` (provisioning & deployment). **Stages:** `1R.1`, `1R.2`, `1R.3`.
**Mockup:** `root-admin-mockup/` — internal only, deliberately **not linked** from any client-facing page
(`D-249`).

---

## 1. Purpose and boundary

The Configurable Root Admin is the control plane. It is where a store is created, given an e-commerce category,
given a template, branded, feature-configured and deployed. It is **not** part of any store, and no store user
ever reaches it (`19 §9`).

| Property | Value | Decision |
|---|---|---|
| Codebase | `root-admin/` — its own dependency manifest, build, tests, pipeline | `D-228`, SEP-5 |
| Portal | Its own hostname, not a path under a store; no shared cookie domain | `D-228`, SEP-3 |
| Database | Its own database; holds the authoritative store configuration | `D-230` |
| Users | `E-platform_user`, a realm with no relationship to store users; MFA mandatory for all | `D-245` |
| Network | Reachable only from allow-listed networks / an identity-aware proxy; never from a store runtime | `D-228` |
| Dependency direction | Root admin → (artefact) → store. Never the reverse on the request path | SEP-1 |
| Stack | The same language/framework family selected for the store backend (`D-002`) and workspace UI (`D-101`), so there is one toolchain — but a separate application | `D-244` |
| Published mockup | `root-admin-mockup/`, `noindex`, no inbound links from `index.html` or any `store-*`/`erp-*`/`vendor-*` page | `D-249` |

## 2. Codebase layout

```
root-admin/
├── app/                 ← portal UI: P-R01…P-R12
│   ├── shell/           ← navigation, platform search, notifications, user menu
│   └── screens/
├── api/                 ← API-M34-*, API-M35-* (platform API; not exposed to stores)
├── domain/
│   ├── stores/          ← registry, lifecycle, domains, environments
│   ├── config/          ← draft → validate → version → compile → publish
│   ├── packs/           ← vertical pack authoring & versioning
│   ├── templates/       ← template registry, versions, compatibility, previews
│   ├── capabilities/    ← capability catalogue mirror + per-pack defaults + overrides
│   ├── terminology/     ← token registry, sets, overrides
│   └── branding/        ← asset upload, validation, variant generation, contrast checks
├── compiler/            ← the artefact builder (19 §4.2) + determinism tests
├── deploy/              ← M35 provisioning & deployment step machines
├── platform-ops/        ← read-replica reporting, fleet health, support access (break-glass)
├── migrations/
└── tests/
```

The **compiler is the heart of this codebase**. Everything else is CRUD around it.

## 3. Platform roles and permissions (`D-245`, `D-246`)

| Role | May |
|---|---|
| `R-root_owner` | Everything, including platform user management, pack/template retirement, store decommission (two-person), support-access approval |
| `R-root_operator` | Create/configure/deploy stores, publish config, manage domains, run migrations; **not** platform user management or decommission |
| `R-root_author` | Author and publish vertical packs, templates, capability defaults and terminology sets; no store access |
| `R-root_support` | Read-only across stores; may *request* time-boxed support access to one store with a recorded reason |
| `R-root_readonly` | Read-only; fleet health and audit |

Rules: MFA mandatory for every platform user (`D-245`); no platform role grants implicit access to store *data* —
support access is a separate, time-boxed, owner-notified, fully audited grant (`D-246`, `§7`); every mutating
action writes `E-platform_audit_event` with actor, target store, before/after and reason (`BR-M34-01`);
two-person approval is required for store decommission, pack retirement and payout-affecting configuration.

## 4. The store configurator — the seven abilities from the brief

SAAS §1 lists seven things the root admin must do. Each maps to a screen and a step of the create-store wizard
(`P-R04`), and each is also reachable afterwards from the store detail screen (`P-R05`).

| # | Brief requirement | Screen / step | What happens |
|---|---|---|---|
| 1 | **Create/configure a store** | `P-R04` step 1 · `P-R05` | Store key, display name, legal entity, country/jurisdiction, currency, locales, timezone, contact identity, environment (`staging`/`production`), isolation mode. Creates `E-store_registration` in state `draft` |
| 2 | **Select the e-commerce type/category** | `P-R04` step 2 · `P-R06` | Pick a published `E-vertical_pack_version`. The wizard shows what the pack turns on (categories, item identity model, units, storefront/workspace/vendor profiles) in plain language, and which template defaults it brings |
| 3 | **Select the UI/site template** | `P-R04` step 3 · `P-R07` | Pick a published `E-template_version` from those compatible with the pack. Live preview with the store's branding applied |
| 4 | **Configure colours and visual settings** | `P-R04` step 4 · `P-R05` → Branding | Brand colours (with automatic ramp derivation and WCAG 2.2 AA contrast validation — failures block publish), typography, shape, density, motion |
| 5 | **Upload the store logo** | `P-R04` step 4 · `P-R05` → Branding | Logo light/dark/mark, favicon, OG image. Validated (format, size, dimensions, transparency), variants generated, stored per store |
| 6 | **Configure features and behaviour** | `P-R04` step 5 · `P-R05` → Features / Channels &amp; integrations / Settings / Terminology | Three levels (`19` §5.4): **surfaces** (storefront, workspace, vendor portal) on or off; **modules** on or off, platform-defined and category-defined alike; **capabilities** within them. For every module and capability, the control state — the store does not have it, the store has it and cannot change it, or **the store's own administrator may manage it** (`D-258`). Dependencies resolve with an explanation, conflicts and invalid delegations are blocked, and switching something off shows the open work it affects. Plus `CFG-*` values, which keys the store may edit, and terminology overrides |
| 7 | **Deploy the store** | `P-R04` step 6 · `P-R10` | Validate → compile → preview diff → provision → publish artefact → bootstrap & seed → smoke test → go live. Idempotent and resumable (`§5`) |

Wizard rules: every step is saved into `E-store_config_draft` and can be left and resumed; nothing reaches a
running store until **Publish**; the final step shows a plain-language summary of everything that will exist in
the new store, plus the exact artefact that will be produced.

## 5. Provisioning and deployment pipeline (M35 · `D-235`, `D-250`)

An idempotent, resumable step machine (`E-deployment` + `E-deployment_step`). Each step is retried with caps,
records its own evidence, and is safe to re-run (`BR-M35-01`).

Topology note (`D-269`, `D-272`): the pipeline is identical for all four placements. What differs is what step 4
provisions — for the default separated-client topology it creates the store's **own database, storage container,
search index and cache namespace**; for a standalone client-hosted install it drives the remote install, and the
artefact is delivered **signed**, by pull or by file (`19` §10.4).

| # | Step | Detail | Failure behaviour |
|---|---|---|---|
| 1 | `validate` | Config draft against the `CFG-*` schema, capability dependencies/conflicts, pack rules, template compatibility, contrast, required assets, domain availability | Blocks; cannot be overridden (`BR-M34-02`) |
| 2 | `compile` | Build the artefact set (`19 §4.2`), deterministic — the same inputs always produce a byte-identical artefact (`TS-SAAS-CFG-05`) | Blocks |
| 3 | `diff` | Human-readable diff vs the store's current live version: capabilities turned on/off, settings changed, terminology changed, theme changed, schema changes affecting existing data | Requires acknowledgement for destructive-looking changes |
| 4 | `provision` | (first deployment only) create the store record and storage prefix, allocate database/schema per isolation mode, create the secret scope, register the hostname, request TLS | Rolls back allocations |
| 5 | `publish` | Write the immutable artefact to object storage, record `E-config_publication`, emit `config.published` | Retried; artefact is content-addressed so retries are harmless |
| 6 | `bootstrap` | (first deployment only) apply pack seed sets `S-VP-*`, create the store's first owner user and send the invitation, create default roles, locations, policy classes, saved views and help content (`D-250`) | Resumable per seed set; partial state is detected and completed, never duplicated |
| 7 | `apply` | Wait for runtime instances to report `config.applied` for the new version | Times out → drift alarm; previous version keeps serving |
| 8 | `smoke` | Automated store-facing checks: home, category, product, search, add-to-cart, sign-in page, workspace sign-in, health, theme.css served, no forbidden vocabulary (`TS-SAAS-ISO-01` subset) | Fails → automatic rollback to the previous config version (`BR-M35-02`) |
| 9 | `golive` | Flip the store state to `live`, enable indexing if configured, notify the root admin operator and the store owner | — |

Store lifecycle states: `draft` → `provisioned` → `live` ⇄ `suspended` → `archived` → (retention) → `destroyed`.
Suspension serves a store-branded notice and blocks writes (`BR-M30-05`). Decommission is two-person with a
retention period (`BR-M35-03`).

**Redeployment** (config change on a live store) runs steps 1, 2, 3, 5, 7, 8 only — no store downtime, because
the runtime hot-swaps the configuration (`19 §4.4`). Changes to `restart_impact = cold` keys additionally schedule
a rolling restart.

## 6. Screens P-R01–P-R12 (`D-253`; mockup in `root-admin-mockup/`)

| ID | Screen | Mockup file | Contents |
|---|---|---|---|
| P-R01 | Platform sign-in | `ra-login.html` | Email + password + mandatory MFA, device trust, recovery, lockout; neutral branding, no store identity |
| P-R02 | Platform dashboard | `ra-dashboard.html` | Fleet KPIs (stores by state, deployments today, config drift, failed smoke tests, artefact build time), attention queue, recent deployments, recent audit, platform health |
| P-R03 | Stores | `ra-stores.html` | Registry list/table: store, category (pack + version), template, state, environment, domain, config version, last deployment, owner contact; filters, saved views, bulk actions (publish, suspend, migrate pack/template) |
| P-R04 | Create store (wizard) | `ra-store-new.html` | The six steps of `§4`: 1 Store details · 2 E-commerce category · 3 Template · 4 Branding & colours · 5 Features & behaviour · 6 Review & deploy |
| P-R05 | Store detail & configuration | `ra-store.html` | Tabs: Overview · Category & schema · Template · Branding · **Features (surfaces, modules, capabilities and their control state)** · **Channels &amp; integrations (WhatsApp, email, SMS, web chat, push, automations, provider bindings and sender verification)** · Settings (`CFG-*` by section, with lock switches) · Terminology · Domains & TLS · **Environments & hosting (topology, separated resources, promotion, release)** · Config versions (diff, rollback) · Deployments · Store users · Support access · Audit · Danger zone (suspend/archive/decommission/export) |
| P-R06 | E-commerce categories (vertical packs) | `ra-packs.html` | Pack catalogue, versions, what each pack turns on, capability default matrix, seed sets, compatible templates, stores using it, lifecycle actions (publish/deprecate/retire), migration planner with impact preview |
| P-R07 | Templates | `ra-templates.html` | Template catalogue with previews, versions, pack compatibility, token contract, required capabilities, a11y statement, stores using it, add/update/deprecate/retire, per-store migration with preview |
| P-R08 | Capabilities & feature matrix | `ra-capabilities.html` | The capability registry: id, area, description, dependencies, conflicts, per-pack defaults, per-store overrides, and a cross-store matrix view showing which stores have what |
| P-R09 | Terminology | `ra-terminology.html` | Token registry, per-pack terminology sets per locale, per-store overrides, coverage report (missing tokens), preview of a screen with the chosen set applied |
| P-R10 | Deployments & publications | `ra-deployments.html` | Deployment runs with their step machines, live progress, logs, evidence, rollback; publication history per store; artefact inspector (manifest, checksum, size, build time) |
| P-R11 | Platform users, roles & audit | `ra-admin.html` | Platform users, MFA state, roles, invitations, sessions; the full `E-platform_audit_event` viewer with filters and export; support-access grants and their recordings |
| P-R12 | Platform settings & health | `ra-settings.html` | Global defaults, object storage & CDN, secret scopes, artefact retention and signing keys, DNS/TLS provider, notification routing, fleet health (runtime instances, remote installs, applied config versions, drift, schema version per store database), maintenance windows, platform release and rebuild status |
| P-R13 | Bundles | `ra-bundles.html` | The reusable building blocks a category is assembled from (`19` §5.5): bundle library, what each contributes, versions, which categories use it, composition conflicts, lifecycle |

Shell (all screens): left navigation, environment switcher (`staging`/`production`), platform search (store,
domain, pack, template, capability, deployment), notifications, user menu with the active MFA state, and a
persistent banner whenever a support-access grant is active.

## 7. Support access to a store (`D-246`)

No platform role reads store data implicitly. Access is a grant: `E-platform_support_access` with requester,
store, reason, scope (read-only or act-as, and which areas), requested duration (max 8 h), approver
(`R-root_owner`), store-owner notification, start/end, and a complete action log written to **both** the platform
audit and the store's own audit trail (so the store owner can see it in P-E15). Expiry is automatic. Acting as a
store user is always attributed to the platform user in the store audit — never anonymised, never silent
(INV-9).

## 8. API surface (catalogued in `06-api.md` §40)

| Group | Endpoints (summary) |
|---|---|
| `API-M34-01…09` Stores | list, get, create, update draft, lifecycle transition (suspend/resume/archive), decommission request, owner invitation, store users (read-only via replica), store health |
| `API-M34-10…19` Configuration | get draft, patch draft, validate, compile (dry run), diff vs live, publish, list versions, get version, rollback |
| `API-M34-20…27` Packs | list, get, create version, validate, publish, deprecate, retire, migration plan + execute |
| `API-M34-28…35` Templates | list, get, create version, validate, publish, deprecate, retire, assign/migrate store |
| `API-M34-36…41` Capabilities | registry list, per-pack defaults get/set, per-store overrides get/set, dependency resolution preview, cross-store matrix |
| `API-M34-42…47` Terminology | token registry, set get/put, store overrides get/put, coverage report, preview |
| `API-M34-65…72` Bundles | list, get, create version, validate, publish, deprecate, retire, apply to a category |
| `API-M34-73` Environments | promote a published staging version into the production draft |
| `API-M34-74…80` Channels, integrations &amp; automation grants | channel bindings, sender verification, template requirements, integration bindings, automation grants, publish-check report |
| `API-M34-48…53` Branding | asset upload (signed), validate, variant generation status, palette derivation, contrast report, delete |
| `API-M34-54…60` Platform users & audit | users CRUD, roles, invitations, MFA reset, sessions, audit query, audit export |
| `API-M34-61…64` Support access | request, approve, revoke, list grants |
| `API-M35-01…08` Deployment | start, get run, step detail, retry step, cancel, rollback, smoke report, history |
| `API-M35-09…14` Domains & TLS | add domain, verify, certificate status, renew, set primary, remove |
| `API-M35-15…18` Fleet | instance registry, applied-version report intake (`config.applied` callback), drift report, artefact retention job status |

Conventions follow `D-080`/`D-079` exactly as the store API does (same header contract, error envelope,
pagination, money and date formats) — one convention, two applications. The platform API is **never** exposed on
a store hostname and carries its own authentication realm.

## 9. Entities

Listed in `19 §13`; schema detail in `03-database.md` §11. Notable shapes:

- `E-store_registration` — the authoritative store record: key, display name, legal entity, jurisdiction,
  currency, locales, timezone, isolation mode, environment, state, pack version, template version, current config
  version, owner contact, created/updated audit.
- `E-store_config_draft` — mutable working copy (one per store per environment), with `updated_by`, `updated_at`,
  and a validation report.
- `E-store_config_version` — immutable published configuration (`19 §3.4`).
- `E-config_artifact` — content-addressed artefact metadata: checksum, size, file list, build duration, compiler
  version, platform release, storage URI.
- `E-deployment` / `E-deployment_step` — the step machine of `§5` with evidence per step.
- `E-vertical_pack_version` / `E-template_version` — immutable published content with a validation report and a
  usage count.
- `E-platform_support_access` — `§7`.

## 10. The Tradex store on this platform (`D-251`)

Everything the existing plan says about Tradex becomes the configuration of one store:

| Item | Value |
|---|---|
| Store key | `tradex` |
| Pack | `VP-electronics` (authored from BP/MEET/PR1/PR2 + the mockup) |
| Template | `TPL-forge` (the existing mockup design direction, pending `D-049`) |
| Branding | Tradex brand assets from `D-049` |
| Capabilities | the `[on]` / decision-linked defaults of `19 §5.3` |
| Terminology | English (India); `TT-product` = "product", `TT-serial` = "serial number", `TT-dealer` per `D-006` |
| Data | the Phase 1 migration (M25) loads legacy data **into store `tradex`** |

Every existing client decision (`D-001`…`D-226`) keeps its meaning; those that are store policy (return windows,
thresholds, payment provider, tax convention, …) become **store configuration values** for `tradex` rather than
global constants. Those that are platform engineering decisions (stack, hosting, API conventions, observability)
stay platform-wide.

## 11. Mockup (`D-249`, `D-253`)

`root-admin-mockup/` holds a clickable HTML prototype of P-R01–P-R12 with its own `assets/` (no dependency on the
store mockup's `assets/tradex.*`), its own visual identity (deliberately different from any store template so the
two are never confused), and `<meta name="robots" content="noindex,nofollow">` on every page.

Rules:
- **No page in the client-facing mockup links to it** — not `index.html`, not the prototype toolbar, not
  `credits.html`, not any `store-*`, `erp-*` or `vendor-*` page. Verified by `TS-SAAS-ISO-07` and by a link check
  before every mockup change.
- It is reachable only by typing the folder path. The repository root is published by GitHub Pages
  (`00-conventions.md` §11), so the folder is publicly reachable by URL even though nothing links to it — see
  `STATE.md` Known issues; `D-115` decides whether to move it out of the published site.
- Sample values in it (store names, colours, counts) are **not requirements** — the same rule as the store mockup
  (`00-conventions.md` §1.1).
