# 01 — Technical stack

**Purpose.** The complete list of technologies the sources require or imply for Tradex, with the status of each
choice, where it is used (modules `M##`, pages `P-*`), why (cited), the alternatives the sources list, and the
constraints the sources place on it. A future session must not introduce a language, framework, library, service or
infrastructure component that is not listed here; if one is needed, record a decision in `DECISIONS.md` first.

**Sources used.** BP §1.2, §2.2, §3.3, §5.1–5.3, §6, §7.2–7.4, §8.1, §8.4, §9.1, §10.2–10.6, §11, §12.2–12.3, §13,
§14, §15, §16, §17, §18.2, §19, §20, §21.2–21.3, §23.2, §24.2–24.3, §28, §32 (S01–S21) · PR1 §3, §6, §10, §13, §14 ·
PR2 §3, §8, §9, §10, §12 · MEET (16:34, 16:37, 17:11, 17:49, 18:04) · MK `assets/tradex.css`, `assets/tradex.js`,
`erp-admin.html`, `erp-automation.html`, `erp-catalog.html`, `erp-inventory.html`, `erp-fulfilment.html`,
`erp-reports.html`, `store-login.html`, `store-account.html`, `store-checkout.html`, `vendor-account.html`,
`vendor-products.html`, `index.html`.

**Status legend.** Evidence labels (`DOCUMENTED`, `PROPOSED`, `MOCKUP`, `MOCKUP-ONLY`, `CONDITIONAL`, `LATER`,
`REQUIRES_DECISION`) are defined in `00-conventions.md` §2. The **Status** column of every technology uses:

| Status | Meaning |
|---|---|
| `DECIDED (D-###)` | Recorded as DECIDED in `DECISIONS.md` |
| `PROPOSED` / `PROPOSED (D-###)` | Named by BP/PR2 as a proposal, or a `PROPOSED-DEFAULT` decision. The BP is itself a "Proposed blueprint for review; not a signed scope" (BP header), so even its firm requirements stay PROPOSED until scope sign-off (BP §31.2) |
| `REQUIRES_DECISION (D-###)` | The sources do not name the technology, or name options without choosing. Implementation of the item stops until the decision is recorded |

Companion file: `02-architecture.md` (how these technologies fit together). Repository locations follow
`00-conventions.md` §11.

---

## 0. Reading rules

1. **D-001 (operational core) is OPEN.** Every backend language, framework, database engine, queue, cache and
   native-feature choice below is `REQUIRES_DECISION (D-001)` even where BP names a "preferred candidate". BP §15.4
   says the preferred stack applies only "subject to those tests" (the proof scenarios of BP §15.3).
2. **"Implied by platform"** marks a technology that is not named in the sources but is an unavoidable property of a
   named option (e.g. Next.js runs on Node.js and React). It carries the same status as the option that implies it.
3. **The mockup is not production code.** `*.html` + `assets/tradex.css` + `assets/tradex.js` are plain HTML, CSS
   custom properties and vanilla JavaScript with no external libraries (MK). Its tokens are the approved-for-review
   visual direction (D-049); its scripts, sample data and chart helpers are prototype code (`00-conventions.md` §1.1).
4. **Provider names in the mockup are samples** (e.g. the payment, courier, email/SMS, accounting products shown in
   `erp-admin.html#integrations`). They map to D-012, D-013, D-015, D-011 and are not requirements.
5. **Pin versions.** Every selected component gets a tested, supported, pinned version recorded in §31 before use
   (BP §15.4, S13). "Latest" is never a permanent production target.

## 1. Binding stack rules (apply to every section)

| # | Rule | Source |
|---|---|---|
| 1 | Choose **one** operational core. Do not implement ERPNext, Odoo and a new custom inventory service simultaneously | BP §1.2; PR2 §8 |
| 2 | Evaluation order: inspect/retain existing backend → prove ERPNext/Frappe + custom Next.js storefront → compare Odoo on the same scenarios → custom modular backend only if the others fail critical requirements or have worse TCO | BP §1.2; PR2 §8 |
| 3 | Score candidates on the BP §15.3 weights (inventory/serial/reservation 25 %, workflow fit 20 %, storefront/API flexibility 15 %, operating cost/licensing 15 %, maintainability/team 15 %, migration/integration 10 %) using the ten proof scenarios; a critical failure (e.g. cannot prevent overselling) overrides a high score | BP §15.3 |
| 4 | Pin tested supported versions and verify security updates; do not treat today's "latest" as a permanent target | BP §15.4, S13 |
| 5 | Platform configuration before custom code; custom extension before core fork; never edit vendor core | BP §15.4, §15.6 |
| 6 | One codebase per real application boundary; no microservice per database table; separate a module only when independent scaling, ownership, reliability or release needs justify the cost | BP §15.6 |
| 7 | One stock ledger and one price authority | BP §15.6 |
| 8 | Use the ERP's queue before adding another broker | BP §15.6 |
| 9 | Roles and a small approval matrix before a general workflow designer | BP §15.6 |
| 10 | Curated recommendations before a recommendation model | BP §15.6 |
| 11 | A supported managed environment or simple deployment before a container orchestration platform | BP §15.6 |
| 12 | Scale after measuring a bottleneck | BP §15.6, §28.5 |
| 13 | Mobile app in Phase 2 only, reusing the Phase 1 web core and business APIs | BP §15.6, §28.4 |
| 14 | No model-training infrastructure for a chatbot; no LLM in Phase 1; no GPU purchase in Phase 1 | BP §15.6, §28.3; MEET 18:04 |
| 15 | No Kubernetes, Kafka, separate service for every module, or active-active multi-region deployment unless evidence justifies the cost | BP §5.3; PR2 §9 |
| 16 | Database: only what the selected ERP release supports; do not introduce PostgreSQL "by preference" into an unsupported ERP setup | BP §15.4 |
| 17 | Custom fallback: Django/Python **or** NestJS/TypeScript with PostgreSQL — "Select one stack, not both" | BP §15.5 |
| 18 | Final stack and third-party services are selected after requirements and technical discovery; do not commit to vendors before cost and fit are validated | PR1 §13; MEET 17:11; BP §2.2 |
| 19 | Do not store card details; use the provider's hosted/approved payment collection | BP §10.6; PR1 §14 |
| 20 | One payment provider and one primary shipping provider at launch unless operational coverage requires more | BP §10.6, §15.4 |

## 2. Stack at a glance

| Area | Technology (as far as the sources specify) | Status | Governing decisions | § |
|---|---|---|---|---|
| Storefront frontend | Next.js + TypeScript, server-rendered public pages | PROPOSED (D-003) | D-003 | 3 |
| Staff workspace & vendor portal frontends | Not specified (native ERP screens "where they fit") | REQUIRES_DECISION | D-004, D-101 | 3 |
| Frontend deployables & hostnames | Not specified | REQUIRES_DECISION | D-102 | 3 |
| Design system | Tokens/components from `assets/tradex.css`; implementation technology not specified | PROPOSED (tokens, pending D-049) · REQUIRES_DECISION (D-103) | D-049, D-051, D-103 | 4 |
| Backend language & framework | Follows the operational core | REQUIRES_DECISION | D-001, D-002 | 5 |
| Operational core / ERP | Legacy / ERPNext-Frappe (preferred candidate) / Odoo / custom | REQUIRES_DECISION | D-001, D-009 | 6 |
| Database | ERPNext-supported (usually MariaDB) · PostgreSQL if custom | REQUIRES_DECISION | D-001, D-002 | 7 |
| Money representation | Fixed decimal or integer minor units, never floating point | REQUIRES_DECISION | D-104, D-059 | 8 |
| API | Narrow HTTP/JSON business endpoints + signed webhooks | PROPOSED · conventions REQUIRES_DECISION | D-079, D-080 | 9 |
| Authentication | Methods, session/token mechanism, MFA method, rate limits | REQUIRES_DECISION | D-040, D-083, D-084, D-039, D-015 | 10 |
| Authorization | Core's role/permission system + server-side record/field checks | REQUIRES_DECISION (D-001) | D-001, D-024, D-025 | 10 |
| Files & media | Public/private object storage + CDN; optimised variants; scanning | REQUIRES_DECISION | D-033, D-113, D-112, D-057 | 14 |
| Search | Native/database search first | PROPOSED (D-032) | D-032 | 15 |
| Caching | Five layers (`19` §25.4); public HTML at the CDN edge, **guest class only**, surrogate-key purge | DECIDED (D-105) · provider REQUIRES_DECISION (D-033) | D-105, D-033 | 16 |
| Jobs, queue, outbox | ERP's workers/queue (Frappe workers + Redis if ERPNext); durable outbox table | REQUIRES_DECISION | D-001, D-002, D-078 | 17 |
| Notifications | Email/SMS/OTP provider; WhatsApp BSP or Cloud API | REQUIRES_DECISION | D-015, D-014, D-058 | 18 |
| Payments | One provider, hosted collection, signed webhooks, reconciliation | REQUIRES_DECISION | D-012, D-020, D-062, D-064 | 19 |
| Shipping / accounting / legacy | One primary courier; retain accounting authority; legacy per audit | REQUIRES_DECISION / PROPOSED (D-011) | D-013, D-011, D-037, D-009 | 20 |
| Documents, printing, scanning | Invoice/packing/label rendering; barcode/serial scanning | REQUIRES_DECISION | D-111, D-055, D-110 | 21 |
| Admin & audit | Native vs custom P-E15; audit tamper-resistance | REQUIRES_DECISION | D-004, D-114, D-077 | 22 |
| Repository | One git repository, layout `00-conventions.md` §11 | DECIDED (D-054) | D-054, D-115 | 23 |
| Hosting & deployment | May remain on AWS; managed or simple deployment | REQUIRES_DECISION | D-005, D-109 | 23 |
| Environments, CI, flags | Production + staging (+ development); CI; feature flags | PROPOSED · tools REQUIRES_DECISION | D-077 | 23 |
| Secrets, TLS, backups | Required capabilities; tools not named | REQUIRES_DECISION | D-107, D-108, D-034, D-036 | 23 |
| Observability | Structured logs, error capture, uptime, job health | REQUIRES_DECISION (tools) | D-052 | 24 |
| Testing | Layers documented; tools not | REQUIRES_DECISION | D-053, D-051 | 25 |
| Analytics & RUM | Funnel, search metrics, Core Web Vitals field data | REQUIRES_DECISION | D-106 | 26 |
| Data migration tooling | Repeatable validated import scripts/templates | REQUIRES_DECISION (D-001) | D-038, D-039, D-076 | 27 |
| Mobile app / AI | Phase 2 / Phase 3 | LATER | D-085, D-086 | 28 |

---

## 3. Frontend languages and framework

| Technology | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **TypeScript** (storefront) | PROPOSED (D-003) | PROPOSED | M09, M27; P-S01–P-S13 + store shell; `frontend/storefront/` | "Next.js with TypeScript and a small reusable component system" (BP §15.4) | None listed for the storefront language | Pinned, tested version (BP §15.4) |
| **Next.js** (storefront framework) | PROPOSED (D-003) | PROPOSED | M09, M27, M21 (search UI), M10 (cart/checkout UI); P-S01–P-S13 | Custom web UI, server-rendered public pages, reusable APIs for Phase 2 mobile (BP §15.4); preferred candidate with ERPNext (BP §1.2; PR2 §8) | Odoo "native/custom storefront" (BP §15.2 option 3); Shopify headless (BP §15.1–15.2 — not an option in D-001, see §30 note) | "subject to those tests" (BP §15.4); self-hosting deployment/cache considerations (S13); pin versions and verify security updates (BP §15.4); limit third-party scripts (BP §6.1) |
| **React** | PROPOSED (D-003) — implied by platform | PROPOSED | Same as Next.js | Next.js is a React framework | — | Version follows the pinned Next.js release |
| **Node.js runtime** (Next.js server) | REQUIRES_DECISION (D-003 version; D-005/D-109 hosting) — implied by platform | REQUIRES_DECISION | Storefront server-side rendering | Required to self-host Next.js (S13) | Managed hosting vs self-hosting not specified (D-005, D-109) | Pinned supported LTS-type release (BP §15.4 pinning rule) |
| **Rendering: server-rendered public pages** | PROPOSED | DOCUMENTED | P-S01–P-S05, P-S13, public part of P-S11 | "server-rendered public pages" (BP §15.4); "Server-render or otherwise optimise public product/category pages" (PR2 §3); crawlable pages (BP §6.8) | "or otherwise optimise" (PR2 §3) | Personalised data never cached under a shared URL (BP §16.5, §8.4); mechanism D-105 |
| **Private pages** (cart, checkout, account, orders, returns, dealer area) | PROPOSED | DOCUMENTED | P-S06–P-S10, private part of P-S11, P-S12 | Isolation of private price, stock reservation, account, order, invoice data (BP §16.5; PR2 §3) | — | Not publicly cached; session per D-083; CSRF per BP §19.1 |
| **Custom ERP staff workspace screens** — framework | REQUIRES_DECISION (D-101; which screens: D-004) | REQUIRES_DECISION | P-E01–P-E15 (only those decided "custom" under D-004) + workspace shell; `frontend/workspace/` | Mockup shows custom UI for all 15 P-E screens; BP §30.1 "Reuse native ERP screens where they fit. Build custom staff UI only where it materially improves a frequent task" | Native ERP screens (BP §30.1); same stack as storefront (only framework named anywhere: BP §15.4) | One coherent visual direction with the storefront (BP §6.7 step 4); desktop/laptop browsers in Phase 1 (BP §6, §23.4) |
| **Vendor portal** — framework | REQUIRES_DECISION (D-101) | REQUIRES_DECISION | M14; P-V01–P-V04 + vendor shell; `frontend/vendor-portal/` | Restricted vendor workspace (BP §11.2; PR1 §3 "Vendor Experience") | Not listed; BP §15.2 notes "custom B2B/portal work" as an ERPNext risk | Own-records-only data (BP §3.1); Phase 1B (BP §5.1, D-048) |
| **Deployable topology & hostnames** for the three frontends | REQUIRES_DECISION (D-102) | REQUIRES_DECISION | `frontend/storefront`, `frontend/workspace`, `frontend/vendor-portal` | Folders fix application boundaries (00-conventions §11; BP §15.6 "one codebase per real application boundary"); deployment unit not specified | MK `erp-admin.html#system` shows sample hostnames `www · erp · vendors` (sample only) | Cookie/session scoping (D-083), CORS (BP §19.1) and CDN configuration depend on it |
| **Internationalisation** | REQUIRES_DECISION (D-050) | REQUIRES_DECISION | M09; all P-S | Languages question BP §26.7 Q63 | — | — |
| Mockup technology (HTML + CSS custom properties + vanilla JS) | Reference only | MOCKUP | repo root `*.html`, `assets/` | UI source of truth for screens/fields/states (00-conventions §1.1) | — | Not deployed as the product; do not modify during implementation (00-conventions §11) |

## 4. Component and design system

Location: `frontend/design-system/` (00-conventions §11). Shared by storefront, workspace and vendor portal because the
mockup uses one stylesheet for all three apps (`assets/tradex.css` header) and BP §6.7 requires one coherent
visual direction for the e-commerce and ERP web applications.

| Technology / asset | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Design tokens** from `assets/tradex.css :root` | PROPOSED — pending sign-off (D-049) | MOCKUP | All P-S, P-E, P-V | Approve design tokens and reusable components (BP §6.7 step 7); tokens are the approved-for-review direction (00-conventions §1.1) | — | Original visual identity, not a copy of Amazon/Flipkart (BP §1.3; PR2 §3); brand name/logo per D-049 |
| Token groups (as in MK): ink/neutrals `--ink-*`, text `--tx-1…4`, lines `--line*`, backgrounds `--bg*`, `--surface`; brand `--brand*`, `--accent*`, vendor accent `--vendor*`; semantic `--ok/--warn/--bad/--info` (+ `-tx`, `-50`); product condition `--c-new`, `--c-openbox`, `--c-refurb`, `--c-used`; chart roles `--series-1…3`, `--st-good/warning/serious/critical`, `--grid`, `--axis`; shape `--r-xs…--r-xl`, shadows `--sh-1…3`, focus `--ring`; `--font`, `--container` | PROPOSED (D-049) | MOCKUP | All apps | Condition clarity (BP §6.1); consistency between dealer and consumer pages (BP §6.1) | — | Status must not rely on colour alone (BP §6.7); condition colour always paired with a text label |
| **Component inventory** (MK `tradex.css` sections): buttons; badges/pills/chips; cards & surfaces; forms; tabs; tables; progress/meters/steppers/timelines; overlays (modal, drawer, toast, dropdown, tooltip); charts; product art/photos; store shell (header, category bar, mega menu, footer, help widget, compare tray, PIN modal); workspace shell (sidebar, top bar, global search, notifications, user menu) used by both ERP and vendor portal | PROPOSED (D-049) | MOCKUP | All apps | "small reusable component system" (BP §15.4) | — | Loading, empty, error and accessibility states required for every Phase 1 UI item (BP §22.5); prototype toolbar/annotation styles (`.protobar`, `data-anno`) and the hub page are **not** product components (00-conventions §1.1) |
| **Styling technology & component packaging** (how tokens/components are implemented and shared across three apps) | REQUIRES_DECISION (D-103) | REQUIRES_DECISION | `frontend/design-system/` | Not specified in any source | Not listed | Must work with D-003 and D-101 choices |
| **Font: Inter** (SIL Open Font License, self-hosted woff2 in MK) | REQUIRES_DECISION (D-049 brand typography; D-103 hosting) | MOCKUP | All apps | Used by the mockup (`assets/fonts/`) | — | Limit third-party requests (BP §6.1); licence recorded in handover licensing inventory (BP §24.2) |
| **Icon set** (inline SVG stroke icons defined in `tradex.js`) | REQUIRES_DECISION (D-103) | MOCKUP | All apps | Used by the mockup | — | Accessible names on icon-only buttons (BP §6.7) |
| **Chart rendering** for dashboards/reports | REQUIRES_DECISION (D-103) | MOCKUP | P-E01, P-E12, P-E13, P-E14, P-V01 | MK draws charts with prototype SVG helpers; `00-conventions.md` §1.1 classes them as prototype code | — | Each chart needs a table equivalent for accessibility (MK `tableTwin` pattern); data freshness labels (BP §14.4) |
| **Accessibility target WCAG 2.2 AA** | PROPOSED (D-051 scope) | DOCUMENTED | All P-* | BP §6.7, S20 | — | Keyboard order, focus visibility, labels, error summaries, image descriptions, non-colour status (BP §6.7); T30 |

## 5. Backend languages and framework

All backend code lives in `backend/`; internal structure depends on D-001/D-002 (00-conventions §11).

| Technology | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Frappe custom extension app** (language: Python — implied by platform) | REQUIRES_DECISION (D-001) | PROPOSED | M02–M08, M10–M26 backend; `backend/` | "Supported ERPNext/Frappe release with custom extension app — reuse operational workflows without editing vendor core" (BP §15.4); preferred candidate (BP §1.2) | Legacy backend, Odoo, custom (BP §1.2, §15.2) | Custom code only in a maintained extension app (BP §1.2); upgrade regression tests for extensions (BP §24.3) |
| **Odoo modules** (language: Python — implied by platform) | REQUIRES_DECISION (D-001) | PROPOSED | Same | Compared on the same scenarios if expertise, licensing and module fit are better (BP §1.2, §15.2) | As above | Edition/licensing/customisation and partner costs (BP §15.2); written licensing quotation before scoring (BP §15.2 note) |
| **Existing legacy backend** (technology unknown) | REQUIRES_DECISION (D-001, D-009) | DOCUMENTED | Same | "Current inventory is managed through an existing backend … hosted on Amazon AWS" (MEET 16:37); retain if it passes proof (BP §1.2) | As above | Not inspected (BP §2.2); must reserve stock atomically across channels (BP §9.1, §26.2 Q14) |
| **Django / Python** (custom fallback) | REQUIRES_DECISION (D-001 = custom → D-002) | PROPOSED | Same | "one modular backend in the team's strongest supported stack—such as Django/Python or NestJS/TypeScript" (BP §15.5) | NestJS/TypeScript | "Select one stack, not both" (BP §15.5); separate cost and risk estimate (BP §15.5); integrate with existing accounting, no general ledger (BP §15.5) |
| **NestJS / TypeScript** (custom fallback) | REQUIRES_DECISION (D-001 = custom → D-002) | PROPOSED | Same | BP §15.5 | Django/Python | As above |
| **Internal module structure** (catalog, pricing, inventory, orders, payments, approvals as internal modules with explicit interfaces) | PROPOSED | DOCUMENTED | `backend/` | BP §15.5; "Modular monolith" (BP §33); "A separate frontend does not require a distributed microservice backend" (BP §16.1) | — | No microservices (BP §5.3, §15.6); see `02-architecture.md` §5 |

## 6. Operational core / ERP platform

| Candidate | Status | Evidence | Used in | Why (source) | Main risks (BP §15.2) | Constraints (source) |
|---|---|---|---|---|---|---|
| (1) Retain existing backend + new storefront | REQUIRES_DECISION (D-001) | DOCUMENTED | M02–M08, M10–M26 | Preserves proven workflows/data; may reduce migration (BP §15.2) | Poor APIs, unclear ownership, weak security, sync limitations | Must own stock, reservations, order transitions, permissions, integrations at acceptable cost (BP §1.2); if it stays the stock authority the new app must not keep a competing quantity (BP §9.1) |
| (2) **ERPNext/Frappe** + custom extension app + custom Next.js storefront | REQUIRES_DECISION (D-001) — "preferred candidate to evaluate, not a final procurement decision" | PROPOSED | Same | Reuse operational modules; UI control; extension model (BP §1.2, §15.2, §15.4; PR2 §8) | Framework expertise, custom B2B/portal work, upgrade testing | Supported release pinned; no vendor-core edits (BP §15.4) |
| (3) **Odoo** + native/custom storefront | REQUIRES_DECISION (D-001) | PROPOSED | Same | Broad module ecosystem and pricing workflows (BP §15.2); pricelists support customer, location and volume contexts (S12) | Edition/licensing/customisation and partner costs | Compared on the same ten scenarios (BP §1.2, §15.3) |
| (4) **Custom modular backend** | REQUIRES_DECISION (D-001, D-002) | PROPOSED | Same | Maximum control over unique workflows (BP §15.2) | Highest burden for correctness, maintenance and finance logic | Only if (1)–(3) fail critical requirements or have worse TCO (BP §1.2) |

**Native capabilities to prove (not assume).** "A feature name in ERP documentation does not prove it fits this
business" (BP §1.2).

| Native capability | Candidate | Tradex use | Source | Proof scenario (BP §15.3) |
|---|---|---|---|---|
| Serial and Batch traceability | ERPNext | M06 E-serial_unit / E-serial_event; P-E08 | S05; BP §9.4 | 1, 2, 7 |
| Stock Reservation | ERPNext | M06 E-reservation; M10 pending order | S19 ("to evaluate against cross-channel/serial requirements") | 4 |
| Workflows (approvals) | ERPNext | M17 E-approval_request; P-E14 | S06 ("not proof every proposed approval is native") | 6 |
| REST API and Background Jobs | Frappe | M23 adapters; M17 jobs | S08 ("secure custom business endpoints remain necessary") | 5, 8 |
| Pricelists (customer, location, volume) | Odoo | M05 | S12 (verify in demonstration) | 3 |

## 7. Database

| Technology | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **One authoritative operational database** | PROPOSED | DOCUMENTED | All backend modules | "Authoritative operational database" (BP §16.1); "Central database" (PR1 §3); one source of truth (PR1 §3) | — | A second website does not automatically require a second database (BP §3.3); no multi-tenant SaaS control plane (BP §3.3) |
| **MariaDB** (engine/version supported by the selected ERPNext release) | REQUIRES_DECISION (D-001) | PROPOSED | Same (if D-001 = ERPNext) | "ERPNext-supported database/version, usually MariaDB in the evaluated deployment" (BP §15.4) | — | "Follow exact release compatibility; do not introduce PostgreSQL by preference into an unsupported ERP setup" (BP §15.4) |
| **PostgreSQL** | REQUIRES_DECISION (D-001 = custom; D-002) | PROPOSED | Same (if D-001 = custom) | Custom fallback "with PostgreSQL" (BP §15.5) | — | Only in the custom path (BP §15.5), never inside ERPNext by preference (BP §15.4) |
| Database of the selected Odoo release | REQUIRES_DECISION (D-001) | REQUIRES_DECISION | Same (if D-001 = Odoo) | Sources do not name it | — | Follow the release's supported configuration (BP §15.4 principle) |
| Existing legacy database | REQUIRES_DECISION (D-001, D-009) | DOCUMENTED | Same (if D-001 = legacy) | Existing backend (MEET 16:37) | — | Schema/export inspected in audit (BP §21.1) |
| Read replica / report store | LATER (trigger) | LATER | M18 | Only when "Reports materially affect transactional workload" (BP §28.5) | — | Avoid a premature data warehouse (BP §28.5) |

## 8. Database-related technology

Detail of entities and physical mapping: `03-database.md`. Physical names/types depend on D-001 (BP §17.2 note).

| Concern | Technology / mechanism | Status | Evidence | Used in | Why (source) | Constraints (source) |
|---|---|---|---|---|---|---|
| **Schema migrations** | Platform-native migration mechanism of the selected core (D-001); for custom stack the stack's migration tool (D-002) | REQUIRES_DECISION (D-001, D-002) | DOCUMENTED (need) | `backend/`; every release | "Version-controlled code, migrations, CI" (BP §15.4); database migration plan per release (BP §20.5) | Prefer reversible migrations and backward-compatible changes (BP §20.5); a software rollback does not roll back business transactions (BP §20.5) |
| **Transactions & locking** | Documented ERP transaction mechanisms and locks | REQUIRES_DECISION (D-001) | DOCUMENTED | M06, M10, M11, M13 | Pending order + reservation succeed or fail together (BP §16.3, §10.2 step 2); only one of two buyers gets the last unit (BP §10.3) | No direct table updates that bypass validations (BP §16.3); never hold a DB transaction open while waiting for the customer or payment network (BP §10.2) |
| **Optimistic concurrency** | Version field on records edited concurrently; expected version on approval decisions | PROPOSED | DOCUMENTED | M04, M05, M14, M17 | "optimistic concurrency version where useful" (BP §17.3); review submission "expected version" (BP §17.4) | — |
| **Idempotency records** | Stored key + request fingerprint + result (E-idempotency_record) | PROPOSED | DOCUMENTED | M10, M11, M13, M07 | BP §10.3, §17.5; S01; PR2 §6 | Same key + different basket is rejected (BP §10.3); transport D-079 |
| **Transactional outbox** | Durable pending-operation table written in the business transaction (E-outbox_operation) | PROPOSED | DOCUMENTED | M17 and all modules with external effects | BP §16.3 | Enqueue-after-commit alone can lose work unless a durable scanner closes the gap (BP §16.3) |
| **Money representation** | Fixed decimal **or** integer minor units | REQUIRES_DECISION (D-104) | DOCUMENTED (constraint) | M05, M10, M11, M13, M19, API (D-080) | "Store money using fixed decimal or integer minor units, not floating point" (BP §8.1) | Never floating point (BP §8.1); preserve final price and rule version on each order line (BP §8.1); refunds use original allocated line discount and tax (BP §8.4); currency INR assumption (D-059) |
| **Common record fields** | `created_at`, `updated_at`, responsible actor, entity/company scope, source channel, external reference, concurrency version | PROPOSED | DOCUMENTED | All entities | BP §17.3 | Map to native fields where the core has them (BP §17.2) |
| **Immutable internal identifiers** | Internal identifier separate from display SKU / supplier code / manufacturer serial | PROPOSED | DOCUMENTED | M04, M06 | BP §7.1–7.2, §9.4 | Identifier format in `03-database.md` / D-001 |
| **Event dates** | Order, payment, invoice, dispatch and settlement dates stored separately | PROPOSED | DOCUMENTED | M10, M11, M12, M18, M19 | BP §14.4 | Date/time wire format D-080 |
| **Non-production data masking** | Masked extracts; no production personal data in development fixtures | REQUIRES_DECISION (D-077 environment process) | DOCUMENTED | M01, M26 | BP §19.3 | MK shows staging holding a "masked copy" (sample) |

## 9. API technology

Endpoint catalogue: `06-api.md`. Architecture: `02-architecture.md` §7.

| Technology / convention | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **HTTP + JSON business endpoints** (controlled commerce API) | PROPOSED | DOCUMENTED | M04, M05, M08, M10, M11, M13, M14, M16; consumers P-S*, P-V*, WhatsApp flow, Phase 2 app | Illustrative `/v1/...` surface and JSON request (BP §17.4–17.5); explicit narrow endpoints in the extension app (BP §15.4) | — | "business contracts, not direct ERP CRUD permissions" (BP §17.4); never accept client `is_admin`, `dealer_approved`, `unit_price`, `stock_quantity`, `seller_id`, `refund_approved` as authoritative (BP §17.4) |
| Routes, versioning, pagination, error envelope, date/money formats, contract documentation format | REQUIRES_DECISION (D-080) | REQUIRES_DECISION | All APIs | "Exact routes depend on the chosen framework" (BP §17.4); API contracts are a handover item (BP §24.2) | — | Reusable by the Phase 2 mobile app (BP §15.4, §28.4) |
| **Idempotency key transport** | REQUIRES_DECISION (D-079) | REQUIRES_DECISION | Order placement, cancellations, returns, receipts, refunds, payments | "Put idempotency in the agreed header/contract; do not use a random new key on every network retry" (BP §17.5) | MK `erp-automation.html` shows an `X-Idempotency-Key` header (sample only) | Conflicting reuse rejected (BP §10.3) |
| **Webhook receivers** (payment, shipping, WhatsApp) | PROPOSED | DOCUMENTED | M11, M12, M16, M23 | `POST /v1/webhooks/payment-provider` "Raw-body signature, event deduplication"; shipping "Provider authentication and transition mapping" (BP §17.4); WhatsApp inbound webhooks (BP §13.3) | — | Duplicates and non-guaranteed order handled (BP §10.2, S09) |
| Platform generic REST API (e.g. Frappe REST, S08) | Not exposed to storefront/vendors | DOCUMENTED | Internal/integration use only, per D-001 | "Avoid exposing arbitrary ERP document writes" (BP §15.4); S08 limitation "secure custom business endpoints remain necessary" | — | Integration accounts get narrow machine-to-machine scope only (BP §3.1) |
| Rate limits on APIs | REQUIRES_DECISION (D-084) | DOCUMENTED (need) | Auth, checkout, vendor feeds | "apply rate limits" (BP §19.1) | — | Do not make normal shopping unnecessarily difficult (BP §19.1) |
| CORS policy | REQUIRES_DECISION (D-102 hostnames, D-083) | DOCUMENTED (need) | All browser-called APIs | "handle CORS deliberately" (BP §19.1) | — | — |

## 10. Authentication and authorization

Detail: `07-auth-roles-permissions.md`. Architecture: `02-architecture.md` §8–9.

| Technology / mechanism | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Customer / dealer sign-in methods** | REQUIRES_DECISION (D-040) | MOCKUP | M02, M08; P-S12, P-S09, P-S11 | MK shows mobile one-time code and email + password; optional 2-step and authenticator app (`store-login.html`, `store-account.html`) | Phone OTP and/or email + password (D-040) | Supported mechanisms, secure session handling (BP §19.1); dealer pricing requires verified business-account membership (BP §6.5) |
| **Staff sign-in + MFA for privileged accounts** | MFA PROPOSED (required); method REQUIRES_DECISION (D-040) | DOCUMENTED | M02, M24; all P-E; P-E15 | MFA for privileged accounts (BP §18.2, §20.1); individually attributable accounts (BP §20.1); no shared admin passwords (BP §18.2) | MK samples: authenticator app, security key, SMS OTP marked "weaker" | Privileged access tested in access review and login tests (BP §20.1) |
| **Vendor user sign-in + MFA** | REQUIRES_DECISION (D-040) | MOCKUP | M14; P-V01–P-V04 | MK `vendor-account.html` shows an MFA-required policy, session timeout and password policy (sample values) | — | Applicant has no live catalog/stock write access (BP §3.1) |
| **Session / token mechanism** (storefront, portal, staff, APIs, integration accounts, vendor feed API keys) | REQUIRES_DECISION (D-083) | DOCUMENTED (need) | M02; all apps and APIs | "secure session handling; CSRF for cookie-authenticated mutations" (BP §19.1) | MK shows vendor "API key scoped to availability only" (sample) | Dealer sign-out makes private prices and cached responses inaccessible (BP §8.4); Phase 2 app must reuse the same APIs (BP §28.4) |
| **CSRF protection** | PROPOSED | DOCUMENTED | Cookie-authenticated mutations | BP §19.1 | — | Mechanism follows D-083 |
| **Rate limiting / lockout / abuse protection** | REQUIRES_DECISION (D-084) | DOCUMENTED (need) | P-S12, P-S07, APIs | BP §19.1 | MK sample: pause after failed attempts | Must not make normal shopping unnecessarily difficult (BP §19.1) |
| **OTP delivery** (SMS) | REQUIRES_DECISION (D-015) | DOCUMENTED (need) | P-S12, staff/vendor MFA if SMS chosen | Email/SMS provider to select (PR1 §13) | — | Never log OTPs/tokens (BP §19.1) |
| **Password storage & migration** | Platform-supported mechanism (D-001); migration REQUIRES_DECISION (D-039) | DOCUMENTED | M02, M25 | "Authenticate users using supported mechanisms" (BP §19.1); "No plaintext passwords" (BP §21.2) | Compatible secure migration or reset (BP §21.2) | — |
| **Guest order access** | REQUIRES_DECISION (D-021) | DOCUMENTED | P-S07, P-S08 | Secure order-access link or verification flow (BP §6.5) | Link vs verification flow | — |
| **WhatsApp identity linking** | REQUIRES_DECISION (D-014 provider; method via D-040) | DOCUMENTED | M16; P-E05 | Secure verification before linking; never merge on matching names (BP §13.4) | — | Verify order access before revealing addresses/invoices/serials/payment info (BP §13.4) |
| **RBAC / permission engine** | REQUIRES_DECISION (D-001): selected core's role/permission system + server-side checks | DOCUMENTED | M02 (E-role, E-permission, E-role_permission, E-user_role_assignment) | RBAC and least privilege (BP §18.2; PR1 §14; PR2 §9) | — | Authorisation enforced on the server for every business operation (BP §19.1); permission caches only with safe invalidation (BP §16.2) |
| **Record-level scope & sensitive-field restrictions** | PROPOSED | DOCUMENTED | All modules | BP §18.2; PR2 §9; OWASP object/property-level authorisation (BP §19.1, S14) | — | T02, T10, T11, T13, T22, T23 |
| **Approvals, thresholds, delegation, emergency access** | Mechanism REQUIRES_DECISION (D-001: native workflow S06 vs custom); values D-024, D-025 | DOCUMENTED | M17, M24; P-E14, P-E15 | BP §12.6, §18.1–18.2 | ERPNext Workflows (S06) | Small approval matrix, not a general workflow designer (BP §15.6); separation of duties where feasible (BP §18.2) |
| IP allow-list for production admin | MOCKUP-ONLY → D-040 | MOCKUP-ONLY | P-E15 | MK `erp-admin.html#system` ("Admin MFA + IP allow-list") | — | Not in any document |

## 11. E-commerce components

| Component | Technology / placement | Status | Evidence | Used in | Why (source) | Constraints (source) |
|---|---|---|---|---|---|---|
| Storefront application | Next.js + TypeScript (§3) | PROPOSED (D-003) | PROPOSED | M09; P-S01–P-S13 | BP §15.4 | — |
| **Pricing engine** (one server-side calculation for all channels) | Custom/native module inside the operational core | REQUIRES_DECISION (D-001); policy PROPOSED (D-017) | DOCUMENTED | M05; P-S02, P-S03, P-S06, P-S07, P-S11, P-E02, P-E07 | "one server-side price calculation for website, staff orders, WhatsApp, and future app" (BP §8.1) | Precedence D-017; tiers D-018; tax display D-016; promotions D-043; location pricing D-044; never the largest discount by default (BP §8.1) |
| **Quote** with version and expiry | Core module | PROPOSED | DOCUMENTED | M05, M10 (E-quote, E-quote_line) | BP §8.1 step 7, §17.4 `POST /v1/quotes` | Revalidate at order/reservation (BP §8.1 step 8) |
| **Cart persistence** | Storage per D-001/D-083 | REQUIRES_DECISION (D-001, D-083) | DOCUMENTED | M10; P-S06, P-S07 | "Persist the cart safely across refreshes and allow recovery after payment interruption" (BP §6.5) | Cart is not a reservation (BP §9.2 "Reservation created" only at order) |
| **Pending order + reservation** | Core transaction (§8) | REQUIRES_DECISION (D-001) | DOCUMENTED | M06, M10 | BP §10.2, §16.3 | Reservation expiry and late capture D-026; serial reservation rule D-031 |
| **Serviceability check** | Shipping adapter (§20) | REQUIRES_DECISION (D-013) | DOCUMENTED | M12; P-S03, P-S07, store PIN modal | Validate PIN serviceability before payment (BP §6.5) | Manual fallback (BP §16.4) |
| SEO: crawlable pages, canonical URLs, XML sitemap, structured product data, redirect map, controlled filter URLs | Storefront (§3) | PROPOSED | DOCUMENTED | M27; P-S01–P-S04, P-S13 | BP §6.8 | Redirect mapping D-076; no indexing of private dealer versions (BP §6.8) |
| Guided help widget + WhatsApp click-to-chat | Storefront + M16 | PROPOSED | DOCUMENTED / MOCKUP | M16; store shell, P-S03, P-S13 | Guided FAQ and order-status flow without an LLM (BP §13.1); MK help widget "no AI in Phase 1" | Level 2 guided ordering in 1B (D-014) |
| Wishlist & comparison | Storefront + M08 | CONDITIONAL (D-042) | CONDITIONAL | P-S05, P-S09 | BP §5.2 | Must not block reliable checkout (BP §5.2) |
| Reviews & ratings | Storefront + moderation | CONDITIONAL (D-041) | CONDITIONAL | P-S03 | BP §5.2 | Moderation and verified purchase (BP §5.2); no fabricated ratings (BP §6.1) |
| Product Q&A | — | MOCKUP-ONLY (D-065) | MOCKUP-ONLY | P-S03 | MK only | Build only if D-065 approves |
| EMI plans, bank/UPI offer cards | — | MOCKUP-ONLY (D-062) | MOCKUP-ONLY | P-S03, P-S07 | MK only | Depends on D-012 |
| Shopify as commerce platform | Not selected | — | DOCUMENTED | — | "Shopify-style platforms were considered too constrained" (MEET 16:34); BP §15.2 still lists "Shopify + ERP integration" | Not an option in D-001 — see §30 note |

## 12. ERP

The ERP scope (BP §14.1) is implemented by native modules of the selected core where they pass proof, and by custom
modules otherwise (D-001). Staff screens are native or custom per D-004.

| ERP module (BP §14.1) | Plan modules | Staff pages | Technology source | Status |
|---|---|---|---|---|
| Master data | M03, M04, M05, M07 (E-supplier), M08 | P-E06, P-E07, P-E10, P-E15 (locations) | Native masters of the core or custom (D-001) | REQUIRES_DECISION (D-001, D-004) |
| Purchasing | M07 | P-E09 | Native purchasing workflow if retained/fits (BP §5.2 "Reuse existing workflow if retained") | REQUIRES_DECISION (D-001, D-004) |
| Inventory | M06 | P-E08 | Native stock ledger/serials/reservation to prove (S05, S19) | REQUIRES_DECISION (D-001, D-004) |
| Sales | M10, M05 | P-E02 | Core order module + custom commerce API | REQUIRES_DECISION (D-001, D-004) |
| Fulfilment | M12 | P-E03 | Core + shipping adapter (D-013) + scanning (D-110) + documents (D-111) | REQUIRES_DECISION (D-001, D-004) |
| Returns/warranty | M13 | P-E04 | Core + custom RMA logic | REQUIRES_DECISION (D-001, D-004) |
| Finance boundary | M11, M19 | P-E12 | Payment ledger + reconciliation + approved exports (D-011) | REQUIRES_DECISION (D-001, D-011) |
| Vendor management | M14 | P-E11 | Custom (BP §15.2 "custom B2B/portal work") | REQUIRES_DECISION (D-001, D-004) |
| Staff access | M02, M24 | P-E15 | Core identity/role system (§10) | REQUIRES_DECISION (D-001, D-004) |
| Reporting | M18 | P-E13, P-E01 | Operational reports and exports on the transactional database (§7) | REQUIRES_DECISION (D-001, D-004, D-075) |

## 13. Vendor and marketplace

| Technology / component | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| Vendor portal application | REQUIRES_DECISION (D-101, D-102) | DOCUMENTED | M14; P-V01–P-V04 | Controlled vendor workspace (BP §11.2; PR1 §3, §7; PR2 §5) | — | Phase 1B (BP §5.1; D-048); vendor model D-007 |
| Vendor-scoped API (submissions, availability, POs, tasks) | PROPOSED | DOCUMENTED | M14, M06 (E-supplier_availability) | `POST /v1/vendor/submissions` — vendor scope, no automatic publication (BP §17.4) | — | Own records only; no competitor costs or company margins (BP §3.1); T11–T14 |
| Supplier product/availability feeds: versioned CSV/XLSX template or documented supplier API | REQUIRES_DECISION (D-057) | DOCUMENTED | M04 (E-import_job, E-import_row), M06, M23; P-E06, P-V02, P-V03 | BP §7.4, §16.4 | MK shows API, CSV and SFTP feeds as samples (`erp-admin.html#integrations`) | Staging, validation, row-level errors, retry without duplicates (BP §7.4, T26); freshness per supplier (D-028); a stock update never creates company inventory (BP §11.3) |
| Marketplace (seller agreements, commissions, settlements, payouts) | LATER (D-046) | LATER | M15 | BP §11.4–11.5; PR1 §7; PR2 §5 | — | Prerequisites of BP §11.4 decided first; no automated payout in first release (BP §5.3) |

## 14. File and image handling

| Technology / mechanism | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Object storage, separated public/private by data class** | REQUIRES_DECISION (D-033) | PROPOSED | M22 (E-media_asset, E-attachment); M04, M08, M13, M14, M16, M18, M19 | "Private/public object storage by data class" (BP §15.4); managed object storage is the media authority (BP §16.2) | Provider not specified (D-033); hosting may remain on AWS (D-005) | Private files served only through authorised access (BP §19.1); retention D-036 |
| **CDN for public product images** | REQUIRES_DECISION (D-033) | PROPOSED | P-S01–P-S05, P-S11 | BP §15.4, §16.2, §16.5 | — | Cache public content only (BP §16.5) |
| **Optimised image variants** | REQUIRES_DECISION (D-113) | DOCUMENTED | M22, M04 (A02); all product imagery | "generate optimised variants" (BP §21.2); "Optimise images" (BP §6.1); LCP target (BP §20.1) | — | Source images: restrict type and size (BP §7.4); MK sample "JPG · PNG · WebP ≤ 8 MB" |
| **Upload validation** (type, size, content) | PROPOSED; limits REQUIRES_DECISION (D-113, D-057) | DOCUMENTED | P-E06, P-V02, P-S10, P-S12, P-E05, P-E09 | "Validate inputs, restrict uploads" (BP §19.1) | — | MK sample limits (500 rows / 20 MB per vendor upload) are not requirements |
| **Malware scanning of risky attachments** | REQUIRES_DECISION (D-112) | DOCUMENTED | M22; uploads listed above | "scan risky attachments" (BP §19.1) | — | — |
| **SSRF-restricted image fetch** for imports | PROPOSED | DOCUMENTED / MOCKUP | M04 A02, M23 | "restrict sources, size, file type, and network destinations; imported URLs must not access internal infrastructure" (BP §7.4); "Restrict outbound requests for imports" (BP §19.1) | — | MK: allow-listed HTTPS domains; private IPs, localhost, metadata addresses and redirects to non-allow-listed hosts refused |
| Image/content rights confirmation | REQUIRES_DECISION (D-057) | DOCUMENTED | M04, M14 | BP §7.4, R20 | Authorised manufacturer/supplier feeds or client-owned content | No scraping of Amazon/Flipkart listings (BP §7.4) |
| **Export files** (CSV/XLSX/PDF) | Generation REQUIRES_DECISION (D-111) | DOCUMENTED | M18 (E-export_job); P-E13 | BP §14.4 | — | Row limits, secure download expiry, audit history, spreadsheet formula-injection neutralisation (BP §14.4) |

## 15. Search

| Technology / mechanism | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Native/database search** over the approved catalog projection | PROPOSED (D-032) | PROPOSED | M21; store header search, P-S02, P-S01 | "Native/database search first" (BP §15.4, §6.4) | Dedicated search service "only if tests require it" (BP §15.4) | Only approved visible catalog (BP §17.4); search is discovery, not transaction authority (BP §16.5) |
| Exact model/SKU match, spelling variants, abbreviations, **curated synonyms**, structured fields | PROPOSED | DOCUMENTED | M21, M04 (E-attribute_definition searchable flag) | BP §6.4, §7.2 | — | Start with curated synonyms; "useful relevance, not AI search" (BP §5.2) |
| Category-specific filters from attribute schema | PROPOSED | DOCUMENTED | M04, M21; P-S02 | BP §6.4, §7.2 (filterable flag), T36 | — | No irrelevant filters across categories (BP §6.4) |
| Staff/vendor global search (orders, SKUs, serials, customers, POs) | PROPOSED (D-032 approach) | MOCKUP | Workspace shell (P-E*), vendor shell (P-V*) | MK `tradex.js` workspace shell | — | Results filtered by permission and record scope (BP §18.2) |
| **Dedicated search engine** | LATER (trigger) | LATER | M21 | Only when native search fails agreed relevance/latency at real catalog size (BP §28.5) | — | Avoid extra indexing/sync infrastructure before the trigger (BP §28.5) |

## 16. Caching

| Technology / mechanism | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| CDN cache for public images | REQUIRES_DECISION (D-033) | PROPOSED | M22; P-S* | BP §15.4, §16.2 | — | — |
| **Public page/content cache and invalidation** | DECIDED (D-105) — CDN edge, guest class only, surrogate-key purge, safety TTL | DOCUMENTED | M09, M21, M04 publish, A04; P-S01–P-S05 | "Cache public product content and images aggressively where appropriate … Invalidate affected public projections after approved changes. Carry a version/update timestamp" (BP §16.5); Next.js cache considerations (S13); PR2 §3 | — | Stock browse propagation proposal ≤60 s (BP §20.1, D-034) |
| **Private response isolation** | PROPOSED | DOCUMENTED | P-S02, P-S03 (dealer price), P-S06–P-S11 | "Never cache a personalised response under a shared public URL without correct isolation" (BP §16.5); "private price response must be isolated" (BP §8.4) | — | T22; dealer sign-out removes access (BP §8.4) |
| **Redis** | REQUIRES_DECISION (D-001 = ERPNext) | PROPOSED | M17 queue (and platform use) | "Frappe-supported workers and Redis-based queue infrastructure" (BP §15.4) | — | Part of the core's supported layout (BP §16.6); no additional broker (BP §15.6) |
| Application cache (custom path) | REQUIRES_DECISION (D-002) | PROPOSED | Custom backend | "a modest cache only where needed" (BP §15.5) | — | Scale after measuring (BP §15.6) |
| Permission caching | PROPOSED | DOCUMENTED | M02 | "Cached checks only with safe invalidation" (BP §16.2) | — | — |

## 17. Background jobs, queues, scheduler and outbox

| Technology / mechanism | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Frappe workers + Redis-based queue** | REQUIRES_DECISION (D-001 = ERPNext) | PROPOSED | M17 and all async work | "Reuse existing operational job tools" (BP §15.4, S08) | — | "Use the ERP's queue before adding another broker" (BP §15.6) |
| Background worker (custom path) | REQUIRES_DECISION (D-002) | PROPOSED | Same | BP §15.5 | — | One worker technology within the one selected stack |
| Platform job mechanism (Odoo / legacy) | REQUIRES_DECISION (D-001) | REQUIRES_DECISION | Same | Not named in sources | — | Must meet BP §16.3 durability |
| **Transactional outbox / durable pending-operation table** | PROPOSED | DOCUMENTED | M17 (E-outbox_operation, E-job_attempt); M11, M12, M19, M20, M23 | BP §16.3; PR2 §6 "Durable pending operations for external calls, with retry, backoff and reconciliation" | "or equivalent durable pending-operation table" (BP §16.3) | Worker claims records, saves external references, retries with backoff, routes persistent failures to a queue (BP §16.3) |
| **Scheduled jobs** (A06 reservation expiry, A10 settlement import, A16 fulfilment chase, A17 low stock, A19 owner digest, A21 stale supplier stock, A36 margin leakage, reconciliation) | REQUIRES_DECISION (D-001 platform scheduler; selection D-078) | DOCUMENTED | M06, M07, M11, M12, M14, M17 | BP §12.2 | — | Each automation completes the BP §12.3 template (trigger, idempotency, failure behaviour, disable/rollback) |
| Retry/backoff/timeout parameters | REQUIRES_DECISION (D-078 per automation; per-integration contract BP §16.4) | DOCUMENTED (need) | M17, M23 | BP §12.3, §16.3, §16.4 | MK sample: 1 m → 2 m → 4 m + jitter, max 5 | Retry cap then one actionable exception (A38) |
| Rule disable / automation pause | PROPOSED | DOCUMENTED / MOCKUP | M17; P-E14 | "Disable/rollback" field (BP §12.3); "stop affected checkout or automation if integrity is uncertain" (BP §20.4) | — | MK distinguishes non-critical pause vs incident mode (consistent with BP §20.4) |
| Separate background service | LATER (trigger) | LATER | M17 | "Heavy jobs need independent capacity or isolation" (BP §28.5) | — | Avoid service sprawl before the trigger (BP §28.5) |

## 18. Notifications

| Technology / component | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Email provider** | REQUIRES_DECISION (D-015) | DOCUMENTED (need) | M20, M02 (account emails), M17 digest, M18 scheduled reports | "Email / SMS provider" to select (PR1 §13); notifications "as agreed during discovery" (PR1 §6) | MK sample names only | Sender-domain authentication shown in MK (sample) → D-015 |
| **SMS / OTP provider** | REQUIRES_DECISION (D-015) | DOCUMENTED (need) | M20, M02 | PR1 §13; BP §25.3 "SMS/OTP/email" usage costs | MK sample (with Indian SMS template registration) | Applicability of telecom template registration → D-015/D-037 |
| **WhatsApp Business Platform** (BSP or Cloud API) | REQUIRES_DECISION (D-014) | DOCUMENTED | M16, M20; P-E05, store shell | BP §13.1–13.3 | "provider or Cloud API selection" (BP §13.3) | Opt-in/opt-out, approved templates outside the customer service window, escalation path, delivery status (BP §13.3, S10, S11); number eligibility/coexistence (BP §13.3) |
| Notification events, templates, channels, frequency caps | REQUIRES_DECISION (D-058) | DOCUMENTED | M20 (E-notification, E-message_template), M08 (E-consent_record) | A14 (BP §12.2); BP §13.3 | — | Consent enforced before sending (T25) |
| In-app staff/vendor notifications | PROPOSED | MOCKUP | Workspace and vendor shells (bell menu) | MK `tradex.js` shells | — | Routine notifications stay in staff queues; owner receives digest + urgent exceptions only (BP §12.5) |
| Owner digest | REQUIRES_DECISION (D-063) | DOCUMENTED | M17; P-E01 | A19 (BP §12.2) | — | Freshness labels and drill-down evidence (A19) |
| Mobile push notifications | LATER (D-085) | LATER | M28 | BP §28.4 "notifications"; MK planned integration "Mobile app push notifications · 2" | — | Same consent and frequency caps (MK) |

## 19. Payment components

| Technology / component | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Payment provider** (one at launch) | REQUIRES_DECISION (D-012) | DOCUMENTED | M11, M23; P-S07, P-S08, P-E12 | BP §10.6, §15.4; PR1 §13 | Razorpay cited only as evidence of webhook patterns (S09); MK sample provider name | Confirm onboarding, payment modes, settlement reports, refunds, disputes, sandbox before committing (BP §10.6) |
| **Hosted/approved payment collection** | PROPOSED | DOCUMENTED | P-S07 | "Do not store card details. Use the provider's hosted/approved payment collection method" (BP §10.6) | — | No client-only success (BP §10.2 step 4, §16.4) |
| **Signed webhook verification + event dedup + out-of-order handling** | PROPOSED | DOCUMENTED | M11 (E-payment_event, E-payment_attempt) | BP §10.2, §17.4, S09 | — | T07, T08; a failed event after capture never downgrades (BP §10.3) |
| **Provider status query / reconciliation** | PROPOSED | DOCUMENTED | M11; P-E12 | BP §10.2 steps 4 and 8; §16.4 "status query" | — | Captured-but-unconfirmed payments monitored (BP §20.3) |
| **Refund API with query-before-retry** | PROPOSED | DOCUMENTED | M11, M13 (E-refund) | BP §10.3 | — | T18, T19; refunded ≤ refundable captured (BP §17.6) |
| Settlement report import & matching | REQUIRES_DECISION (D-064) | DOCUMENTED | M11 (E-settlement_record); P-E12 | A10 (BP §12.2) | — | P1/C (BP §12.2) |
| Payment modes (UPI, cards, net banking, EMI, COD) | REQUIRES_DECISION (D-012; EMI D-062; COD D-020) | MOCKUP | P-S07 | MK `store-checkout.html` | — | COD is CONDITIONAL: eligibility, collection reconciliation, RTO handling, abuse controls (BP §10.6) |
| Dealer credit terms | PROPOSED (D-019: prepaid default) | DOCUMENTED | M08, M11 | BP §8.3 | — | Credit only if explicitly enabled (BP §8.3) |
| Split/marketplace settlements | LATER (D-046) | LATER | M15 | BP §11.4 item 2 | — | — |

## 20. Shipping, accounting and legacy integrations

Adapter contract rules: `02-architecture.md` §19 (BP §16.4).

| Integration | Status | Evidence | Used in | Why (source) | Fallback / alternatives (source) | Constraints (source) |
|---|---|---|---|---|---|---|
| **Shipping/courier provider** (serviceability, booking, label, tracking) | REQUIRES_DECISION (D-013) | DOCUMENTED | M12, M23; P-E03, P-S03, P-S07, P-S08 | BP §10.4, §10.6, §16.4 | "Controlled manual booking with reference capture" (BP §16.4); MK sample "second courier 1B" | Booking deduplication and timeout check (A13); canonical status mapping preserving raw events (BP §10.5); T20 |
| **Accounting export / API** | PROPOSED (D-011: retain current authority) | DOCUMENTED | M19 (E-accounting_export, E-invoice_reference); P-E12 | BP §14.2; A26 | "Signed-off file export and control totals" (BP §16.4) | One mapping per approved document/version (BP §17.6); T27; e-invoicing/e-way bill only where applicable (D-037); series/templates D-055 |
| **Legacy ERP/POS interface** | REQUIRES_DECISION (D-009) | DOCUMENTED | M23, M25, M06 | BP §16.4, §21.3 | "Segregated allocation or supervised entry; not uncontrolled dual-write" (BP §16.4) | No independent live stock ledgers in both systems indefinitely (BP §21.3); branch offline process D-030 |

## 21. Document generation, printing and scanning

| Technology / mechanism | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Invoice, credit note, packing slip rendering** | REQUIRES_DECISION (D-111; templates/series D-055) | DOCUMENTED | M12, M19; P-E03, P-S08, P-S09 | "print the appropriate invoice/packing label" (BP §10.4); A12 approved templates (BP §12.2) | Native print formats of the selected core (D-001) | Correct tax/invoice source and serial verification (A12); invoice issuer D-008 |
| **Shipping labels** | REQUIRES_DECISION (D-013 source; D-111 printing) | DOCUMENTED | M12; P-E03 | A13 "Book shipment and labels" (BP §12.2) | Manual booking fallback (BP §16.4) | — |
| **Report/export file generation** (CSV, XLSX, PDF summary) | REQUIRES_DECISION (D-111) | DOCUMENTED / MOCKUP | M18; P-E13, P-E01 digest | BP §14.4; MK `erp-reports.html` formats | — | Formula-injection neutralisation, row limits, expiring downloads (BP §14.4) |
| **Barcode / serial scanning** (receipt, QC, pick, pack, count, returns) | REQUIRES_DECISION (D-110) | DOCUMENTED | M06, M07, M12, M13; P-E03, P-E04, P-E08, P-E09 | "Staff scan location/SKU/serial" (BP §10.4); A03 (BP §12.2); serials at receipt (BP §9.4) | MK shows "Scanner connected", "Open scan station", sample handheld device names | Staff mobile optimisation or a staff app is not implied and needs its own scope (BP §28.4) |

## 22. Admin system

| Technology / component | Status | Evidence | Used in | Why (source) | Constraints (source) |
|---|---|---|---|---|---|
| Staff administration UI (users, roles, thresholds, delegation, locations, integrations, audit, system) | REQUIRES_DECISION (D-004 native vs custom; D-101) | MOCKUP | M24, M02, M03, M17, M23, M26; P-E15 | BP §30.1 "Administration: Users, roles, approval thresholds, integrations, templates, audit logs"; PR1 §11 | "System configuration controls reserved for authorized administrators" (PR1 §11) |
| Configuration versioning | PROPOSED | DOCUMENTED | M24 (E-configuration_version) | BP §17.3 "configuration version" | Changes audited (BP §20.1) |
| **Feature flags** | REQUIRES_DECISION (D-077) | DOCUMENTED | M01, M24; P-E15 system tab | "Use feature flags for selected integrations or customer groups" (BP §20.5) | MK sample flags (WhatsApp pilot, dealer quick order, marketplace off, COD off) are samples |
| Integration settings and secrets | REQUIRES_DECISION (D-107) | DOCUMENTED / MOCKUP | M23, M24 (E-integration_setting); P-E15 | Secrets management, rotation (BP §16.6, §19.1) | MK: write-only secrets, rotation needs a second approver (sample design) |
| **Audit log with tamper-resistance** | REQUIRES_DECISION (D-114) | DOCUMENTED | M02 (E-audit_event); P-E15 audit tab | "Keep privileged audit evidence tamper-resistant according to the selected platform's capabilities" (BP §19.1); before/after, restricted access, retention (BP §17.3) | MK: append-only, hash-chained, viewing the log is itself logged (sample design) |

## 23. Deployment and infrastructure

| Technology / capability | Status | Evidence | Used in | Why (source) | Alternatives in sources | Constraints (source) |
|---|---|---|---|---|---|---|
| **Git repository `TradexStore`** (layout `00-conventions.md` §11) | DECIDED (D-054) | DOCUMENTED (D-054) | M01; whole project | D-054 | — | Mockup stays at root; GitHub Pages publication scope once code is added → D-115 (`02-architecture.md`) |
| **Hosting provider, region, capacity** | REQUIRES_DECISION (D-005) | DOCUMENTED | M01, M26 | "Hosting may remain on AWS if access, account ownership, cost, and operational fit are sound" (BP §16.6); existing site on AWS (MEET 16:37) | Not listed beyond AWS | Region/capacity after customer location, data, workload, budget, support are known (BP §16.6, §20.2; D-010) |
| **Runtime packaging & deployment method** | REQUIRES_DECISION (D-109) | DOCUMENTED (constraint) | M01; `infra/` | "Use a supported managed environment or simple deployment before a container orchestration platform" (BP §15.6); "the selected core's supported application/worker/database layout" (BP §16.6) | Supported managed environment vs simple deployment (BP §15.6) | No Kubernetes (BP §5.3; PR2 §9); Next.js self-hosting considerations (S13) |
| **Environments: production and staging, separated** | PROPOSED | DOCUMENTED | M01 | BP §16.6, §15.4; PR2 §9 | — | Separate environment credentials (BP §19.1) |
| Development environment | PROPOSED | DOCUMENTED | M01 | "Environment separation for development, staging and production" (PR1 §14) | — | No production personal data in development fixtures (BP §19.3) |
| Further environments, CI provider, release process | REQUIRES_DECISION (D-077) | DOCUMENTED (need) | M01; `infra/` | "Version-controlled code, migrations, CI, staging and production" (BP §15.4); reviewed code, automated critical tests, staging verification, release notes (BP §20.5) | — | Reproducible releases and rollback (BP §15.4) |
| **Secrets management** | REQUIRES_DECISION (D-107) | DOCUMENTED | M01, M23, M26 | BP §16.6; secret rotation, separate environment credentials (BP §19.1) | — | Never log secrets/tokens (BP §19.1) |
| **TLS / encryption in transit** | PROPOSED; certificate tooling REQUIRES_DECISION (D-107) | DOCUMENTED | All endpoints | BP §16.6, §19.1 | — | — |
| Storage encryption | PROPOSED; mechanism REQUIRES_DECISION (D-005, D-033, D-108) | DOCUMENTED | DB, object storage, backups | "appropriate storage encryption" (BP §19.1) | — | — |
| **Backups outside the primary runtime + restore rehearsal** | PROPOSED; method REQUIRES_DECISION (D-108) | DOCUMENTED | M26; DB, attachments/media | BP §16.6, §20.1; PR2 §9; T28 | — | RPO/RTO proposals D-034; backup retention D-036; restore evidence before launch (BP §23.4) |
| Domain/DNS ownership, hostnames | REQUIRES_DECISION (D-102, D-005) | DOCUMENTED | M01, M27 | Record domain ownership, billing contact, recovery access (BP §16.6, §24.2) | MK sample hostnames | Existing domain/SEO URLs (D-076) |
| Excluded infrastructure | Excluded | DOCUMENTED | — | Kubernetes, Kafka, microservice per module, active-active multi-region (BP §5.3; PR2 §9) | — | See §29 |

## 24. Observability

| Technology / capability | Status | Evidence | Used in | Why (source) | Constraints (source) |
|---|---|---|---|---|---|
| **Structured logs, error capture, uptime checks, job-health checks** | REQUIRES_DECISION (D-052) | DOCUMENTED | M26; all runtimes | BP §15.4 "Monitoring" row; PR1 §14; PR2 §9 | Tools not specified (D-052) |
| Metrics & alerts: application errors, latency, worker queue age, retries, provider failures, database health, storage capacity, stock projection lag, expired reservations, captured-but-unconfirmed payments, refund age, backup status | PROPOSED; thresholds REQUIRES_DECISION (D-052, D-034) | DOCUMENTED | M26, M17, M11, M06; P-E14, P-E15 system tab, workspace system-health card | BP §20.3 | Every alert has an owner; page only for urgent customer/revenue/stock risk (BP §20.3); MK thresholds are samples |
| Synthetic availability checks | REQUIRES_DECISION (D-052) | DOCUMENTED | M26 | Availability verification "Synthetic checks and incident accounting" (BP §20.1) | Target D-034 |
| Log content controls | PROPOSED | DOCUMENTED | All | No passwords, payment data, sensitive identity documents, complete chat content or tokens (BP §19.1) | Log retention D-036 |
| Real-user performance (Core Web Vitals field data) | REQUIRES_DECISION (D-106) | DOCUMENTED | M09; P-S* | BP §20.1 verification; PR2 §3 "Instrument page performance" | Limit third-party scripts (BP §6.1) |

## 25. Testing technologies

Test strategy: `16-testing.md`. Unit tests sit next to the code; cross-application suites in `tests/` (00-conventions §11).

| Test layer (BP §23.2; PR2 §12) | Tool | Status | Scope in Tradex | Constraints (source) |
|---|---|---|---|---|
| Unit | REQUIRES_DECISION (D-053) | DOCUMENTED (layer) | Pricing, permissions, transitions, money calculations, reservation rules | Prioritise money, inventory, access boundaries, recovery (BP §23.2) |
| Integration | REQUIRES_DECISION (D-053) | DOCUMENTED | ERP/provider interfaces, adapters, webhooks | Provider sandboxes (BP §10.6) |
| Concurrency | REQUIRES_DECISION (D-053) | DOCUMENTED | Last-unit reservation, duplicate commands | T04, T05, T06 |
| End-to-end critical journeys | REQUIRES_DECISION (D-053) | DOCUMENTED | Customer and staff journeys; BP T01–T36 | "a small set" (BP §23.2) |
| Desktop/laptop browser UI | REQUIRES_DECISION (D-053) | DOCUMENTED | P-S*, P-E*, P-V* on agreed browsers | Agreed browser list (BP §23.4) |
| Accessibility | REQUIRES_DECISION (D-053; scope D-051) | DOCUMENTED | Keyboard, focus, labels, errors | WCAG 2.2 AA target (BP §6.7); T30 |
| Load | REQUIRES_DECISION (D-053) | DOCUMENTED | Realistic mixtures incl. last-unit contention and bulk import during checkout | BP §20.2; T35; targets D-034 |
| Security (incl. OWASP API object/property-level authorisation) | REQUIRES_DECISION (D-053) | DOCUMENTED | T10, T11, T13, T22, T23 | S14 |
| Backup restore | REQUIRES_DECISION (D-053, D-108) | DOCUMENTED | T28 | Before launch and scheduled (BP §20.1) |
| Automation dry-runs on staging | PROPOSED | MOCKUP | M17 | MK `erp-automation.html` (enabling a rule needs a staging dry run) — consistent with BP §20.5 staging verification |
| Real mobile device / app tests | LATER (D-085) | LATER | T29 | Not a Phase 1 gate (BP §23.1) |

## 26. Analytics

| Capability | Status | Evidence | Used in | Why (source) | Constraints (source) |
|---|---|---|---|---|---|
| Funnel analytics (product-to-cart, checkout completion by device/customer type), anonymous search metrics (zero-result, search-to-product), Core Web Vitals field data | REQUIRES_DECISION (D-106) | DOCUMENTED | M09, M18 ("Customer funnel" report), M21, M26 | BP §4, §14.3, §20.1; PR1 §13 "Analytics and monitoring"; PR2 §3 | Exclude test traffic and duplicates (BP §4); limit third-party scripts (BP §6.1); personal-data rules D-037, D-036 |

## 27. Data migration tooling

| Capability | Status | Evidence | Used in | Why (source) | Constraints (source) |
|---|---|---|---|---|---|
| Repeatable import scripts/templates with validation and row-level error reports | REQUIRES_DECISION (D-001 tooling) | DOCUMENTED | M25; `backend/` (00-conventions §11) | PR2 §10 step 2; BP §21.3 | Trial import, full dry run, control totals (BP §21.3) |
| Opening stock/serials, open orders/POs, payment references, warranty records | REQUIRES_DECISION (D-038) | DOCUMENTED | M25, M06, M10, M11, M13 | BP §21.2 | Reconciled opening stock is the 1A exit gate (BP §5.1) |
| Password migration | REQUIRES_DECISION (D-039) | DOCUMENTED | M02, M25 | BP §21.2 | No plaintext |
| SEO redirect map | REQUIRES_DECISION (D-076) | DOCUMENTED | M27, M25 | BP §6.8, §21.2; T32 | — |

## 28. Future-phase technology (listed only)

| Technology | Status | Source | Constraint |
|---|---|---|---|
| E-commerce mobile app (platforms, native vs cross-platform) | LATER (D-085) | BP §5.1, §28.4; M28 | Reuse Phase 1 authentication, pricing, inventory, order, payment, support APIs (BP §28.4); no app folder in Phase 1 (00-conventions §11) |
| PWA features | LATER | BP §28.4 "Consider PWA features selectively" | No unsupported offline checkout (BP §28.4) |
| AI assistance (hosted model, retrieval, narrow tool APIs) | LATER (D-086) | BP §28.1–28.3; M29 | No unrestricted DB access; kill switch; logged tool calls (BP §28.2); no custom model training for company knowledge (BP §28.3) |

---

## 29. Technologies explicitly excluded or deferred

| Technology / approach | Status | Source | Condition to revisit |
|---|---|---|---|
| Kubernetes / container orchestration platform | Excluded (Phase 1) | BP §5.3, §15.6; PR2 §9 | Evidence justifies operating cost (PR2 §9) |
| Kafka or any additional message broker | Excluded | BP §5.3, §15.6; PR2 §9 | ERP's queue proven insufficient (BP §15.6) |
| Separate service for every module / microservice per table | Excluded | BP §5.3, §15.6; PR2 §9 | Independent scaling, ownership, reliability or release need (BP §15.6) |
| Active-active multi-region deployment | Excluded | BP §5.3, §28.5; PR2 §9 | Multi-region *recovery* only when business loss and service commitments justify cost (BP §28.5) |
| Running more than one operational core (ERPNext + Odoo + custom inventory) | Excluded | BP §1.2 | Never |
| PostgreSQL "by preference" inside ERPNext | Excluded | BP §15.4 | Only if supported by the selected release |
| Editing/forking vendor ERP core | Excluded | BP §15.4, §15.6 | — |
| Both Django and NestJS | Excluded | BP §15.5 | — |
| Multi-tenant SaaS control plane | Excluded | BP §3.3, §5.2 (R15) | Confirmed future businesses (D-045): separate ERP sites/deployments sharing code |
| General-purpose workflow builder/designer | Excluded (Phase 1) | BP §5.3, §15.6; MK `index.html` | PR1 §10 asks for "a rules/workflow engine so that important business rules can evolve"; BP (primary technical source) excludes a general-purpose builder and prefers roles + a small approval matrix. This plan follows BP: configurable parameters on deterministic rules (E-automation_rule, E-approval_threshold; D-078). Owner confirmation needed if PR1 wording is meant literally |
| Dedicated search engine | Deferred (trigger) | BP §6.4, §15.4, §28.5; D-032 | Native search fails agreed relevance/latency at real catalog size |
| AI search | Deferred | BP §5.2 | Phase 2/3 "Advanced search" |
| Read replica / report store / data warehouse / advanced BI | Deferred (trigger) | BP §14.1, §28.5 | Reports materially affect transactional workload |
| Separate background service | Deferred (trigger) | BP §28.5 | Heavy jobs need independent capacity/isolation |
| Recommendation model | Excluded | BP §15.6 | Curated compatibility first (A32, D-071) |
| LLM / conversational AI / website AI chatbot | Deferred (Phase 3) | BP §5.2, §13.1, §28; MEET 18:04; MK help widget | D-086 |
| Model-training infrastructure | Excluded | BP §15.6, §28.3 | — |
| Local LLM hosting / GPU purchase | Excluded (Phase 1) | BP §28.3; MEET 17:49 | Equal-quality, equal-availability cost comparison (BP §28.3) |
| Dynamic AI pricing | Excluded | BP §5.3 | — |
| Demand forecasting model (A30) | Deferred (P2) | BP §12.2, §28.5 | Clean sales/stockout/lead-time history |
| OCR purchase-invoice extraction (A31) | Deferred (P2) | BP §12.2 | — |
| Automated collection calls / telephony (A35) | Excluded | BP §5.3, §12.2, §13.5 | Provider/policy/legal review |
| Mobile app and mobile-specific optimisation | Deferred (Phase 2) | BP §5.1, §5.3, §28.4 | D-085 |
| Staff ERP mobile app | Not implied | BP §28.4 | Own approved scope |
| Mobile push notifications | Deferred (Phase 2) | BP §28.4; MK planned integrations | D-085 |
| Marketplace settlement / payout automation / split payments | Deferred (LATER) | BP §5.3, §11.4–11.5 | D-046 |
| Customer wallets, complex loyalty | Excluded | BP §5.3 | — |
| Cross-border checkout / multi-currency | Excluded | BP §5.3; D-059 | — |
| Automated lending/credit decisions | Excluded | BP §5.3 | Dealer credit only if explicitly enabled (D-019) |
| Autonomous purchasing | Excluded | BP §5.3, §9.3 | Later scope; A17 creates suggestions only |
| Full repair-workshop ERP | Excluded | BP §5.3, §14.1 | — |
| Full accounting replacement | Conditional | BP §5.2, §14.2 | Explicit approval + separate finance migration (D-011) |
| HR / payroll / attendance | Conditional (Phase 2/3) | BP §5.2, §14.1 | — |
| Shopify as the commerce platform | Not an option in D-001 | MEET 16:34; BP §15.2 | See §30 note |
| Scraping Amazon/Flipkart listings | Excluded | BP §7.4 | — |
| Storing card details | Excluded | BP §10.6 | — |
| Second payment or shipping provider at launch | Deferred | BP §10.6 | Operational coverage requires it |
| Uncontrolled dual-write with the legacy system | Excluded | BP §16.4, §21.3 | — |
| Direct table updates bypassing ERP validations | Excluded | BP §16.3 | — |
| Generic ERP CRUD exposed to storefront/vendors | Excluded | BP §15.4, §17.4 | — |
| Client-only (browser redirect) payment success | Excluded | BP §10.2, §16.4 | — |

## 30. Stack by decision outcome (D-001) — not a selection

The table shows what each area becomes for each D-001 option. It does **not** choose one. Items identical in all
columns (storefront per D-003, object storage/CDN per D-033, search per D-032, providers per D-012/D-013/D-014/D-015,
design system per D-049/D-103) are omitted.

| Area | (1) Retain legacy core | (2) ERPNext/Frappe + extension app | (3) Odoo | (4) Custom modular backend |
|---|---|---|---|---|
| Evaluation order (BP §1.2) | 1st: retain if it reliably owns stock, reservations, order transitions, permissions, integrations at acceptable cost | 2nd: preferred candidate to prove | 3rd: compare on the same scenarios | 4th: only if others fail critical requirements or have worse TCO |
| Appropriate when (BP §15.2) | Passes stock/payment/security proof and is maintainable | Standard ERP fits most workflows and team can support it | Local expertise and module fit are strong | Proven packaged/legacy mismatch with funded long-term team |
| Main risks (BP §15.2) | Poor APIs, unclear ownership, weak security, sync limitations | Framework expertise, custom B2B/portal work, upgrade testing | Edition/licensing/customisation, partner costs | Highest correctness, maintenance and finance-logic burden |
| Backend language/framework | Unknown until audit (D-009) | Frappe extension app (Python, implied) | Odoo modules (Python, implied) | Django/Python **or** NestJS/TypeScript (D-002) |
| Database | Existing DB (D-009) | ERPNext-supported DB/version, usually MariaDB (BP §15.4) | DB supported by the selected release (not named in sources) | PostgreSQL (BP §15.5) |
| Jobs / queue | Unknown; BP §16.3 durability still required | Frappe workers + Redis-based queue (BP §15.4, S08) | Platform job mechanism (verify; BP §15.6 rule 8) | "a background worker" (BP §15.5), tech per D-002 |
| Cache | Unknown | Redis present as queue infrastructure; page cache D-105 | Per platform; D-105 | "modest cache only where needed" (BP §15.5); D-105 |
| Commerce API placement | New controlled API over the legacy system's supported interface (BP §16.4) | Narrow endpoints in the extension app, same Frappe deployment possible (BP §15.4, §16.1) | Controlled narrow endpoints (BP §17.4) — mechanism per proof | Business endpoints over internal module interfaces (BP §15.5, §17.4) |
| Storefront | New storefront (BP §15.2) — D-003 | Custom Next.js (BP §1.2) | "native/custom storefront" (BP §15.2) — D-003 | Custom — D-003 |
| Staff UI (P-E) | Existing screens + custom per D-004 | Native ERPNext screens where they fit; custom per D-004 (BP §30.1) | Native Odoo screens where they fit; custom per D-004 | All P-E custom (no native screens) — D-101 |
| Vendor portal (P-V) | Custom (D-101) | Custom B2B/portal work (BP §15.2) | Per proof (D-101) | Custom (D-101) |
| Stock reservation & serials | Must reserve atomically across channels (BP §9.1, §26.2 Q14); else controlled online allocation or delayed checkout | Evaluate Stock Reservation (S19) and Serial and Batch (S05) | Evaluate on proof scenarios 1, 2, 4, 7 | Build in the inventory module (BP §15.5) |
| Approvals | Per audit | Evaluate Workflows (S06) | Per proof | Build: roles + small approval matrix (BP §15.6) |
| Pricing | Per audit | Evaluate native pricing; custom B2B work expected (BP §15.2) | Pricelists: customer, location, volume (S12) | Build (BP §15.5) |
| Accounting | Retain current authority (D-011) | Same; ERP accounting only if explicitly adopted (BP §14.2) | Same | Integrate with existing accounting; no new general ledger (BP §15.5) |
| Migration effort | May reduce migration (BP §15.2) | Full migration (BP §21.2) | Full migration | Full migration |
| Upgrade burden | Legacy maintenance | Upgrade regression tests for extensions (BP §24.3) | Edition upgrades and licensing | Own everything (BP §1.2) |
| Commercial evidence needed | Audit report (WP02) | Proof results (WP04) | Written licensing/hosting quotations (BP §15.2) | Separate cost and risk estimate (BP §15.5) |

**Selection procedure (all options):** run the ten proof scenarios of BP §15.3 with the weighted scorecard; record
evidence in WP04 (BP §22.2); record the result in D-001 (and D-002 if custom).

**Note — Shopify.** BP §15.1–15.2 list "Shopify + ERP integration" as a screening option and warn against rejecting
it on an inaccurate "cannot customise" assumption, but BP §1.2 (evaluation order), PR2 §8 and D-001 do not include
it, and MEET 16:34 records that Shopify-style platforms were considered too constrained. This plan follows D-001's
four options; the discrepancy is reported to the orchestrator.

## 31. Version pinning register (fill when decisions are recorded)

BP §15.4: pin tested supported versions and verify security updates. No component may be installed without a row.

| Component | Pinned version | Supported until (verified) | Security-update check date | Decision | Status |
|---|---|---|---|---|---|
| Operational core release (ERPNext/Frappe, Odoo, legacy, or custom framework) | — | — | — | D-001 / D-002 | REQUIRES_DECISION |
| Database engine | — | — | — | D-001 | REQUIRES_DECISION |
| Queue/cache infrastructure (e.g. Redis if ERPNext) | — | — | — | D-001 | REQUIRES_DECISION |
| Next.js | — | — | — | D-003 | REQUIRES_DECISION |
| Node.js runtime | — | — | — | D-003 | REQUIRES_DECISION |
| TypeScript | — | — | — | D-003 | REQUIRES_DECISION |
| Workspace / vendor-portal framework | — | — | — | D-101 | REQUIRES_DECISION |
| Design-system dependencies (styling, icons, charts) | — | — | — | D-103 | REQUIRES_DECISION |
| Test tools | — | — | — | D-053 | REQUIRES_DECISION |
| Observability agents/SDKs | — | — | — | D-052 | REQUIRES_DECISION |
| Provider SDKs/APIs (payment, courier, WhatsApp, email/SMS) — API version | — | — | — | D-012, D-013, D-014, D-015 | REQUIRES_DECISION |
| Runtime base (OS/images/managed platform version) | — | — | — | D-109 | REQUIRES_DECISION |

---

## 32. Proposed new decisions

These are gaps with no fitting existing decision. Do not implement the blocked item until the user decides.

| ID | Question | Documented options / proposal (source) | Approver | Blocks |
|---|---|---|---|---|
| D-101 | Which **frontend framework** builds the custom ERP staff workspace screens (`frontend/workspace/`) and the vendor portal (`frontend/vendor-portal/`)? | Only framework named anywhere is Next.js + TypeScript, for the storefront (BP §15.4). BP §30.1: reuse native ERP screens where they fit (D-004). BP §6.7: one coherent visual direction for e-commerce and ERP. MK: one shared stylesheet/shell for ERP and vendor apps. Options: (a) same stack as D-003 sharing `frontend/design-system/`; (b) native ERP screens for staff screens decided native under D-004. Not otherwise specified | Technical lead | Custom P-E screens, P-V01–P-V04, M14 frontend, §31 row |
| D-102 | Do `frontend/storefront`, `frontend/workspace` and `frontend/vendor-portal` **deploy as separate applications or one deployable**, and under which **hostnames**? | 00-conventions §11 leaves deployment open; BP §15.6 "one codebase per real application boundary"; BP §16.1 shows three separate logical apps; MK `erp-admin.html#system` sample hostnames `www · erp · vendors` (sample only) | Technical lead / owner | M01 scaffolding, D-083 cookie/session scope, CORS (BP §19.1), CDN setup, M27 canonical URLs |
| D-103 | **Design-system implementation technology**: styling approach for the `tradex.css` tokens, component packaging shared by three apps, icon set, chart rendering, font hosting/licensing | BP §15.4 "small reusable component system"; BP §6.7 step 7 approve tokens/components; 00-conventions §1.1 (tokens approved-for-review, chart helpers are prototype code); MK uses CSS custom properties, inline SVG icons, self-hosted Inter (SIL OFL), custom SVG charts. No library named | Technical lead / design | `frontend/design-system/`, all P-* build (after D-049) |
| D-104 | **Money representation and rounding**: fixed decimal vs integer minor units; precision; rounding points for tax, tier price and line-discount allocation | BP §8.1 "fixed decimal or integer minor units, not floating point"; BP §8.4 refunds use original allocated discount/tax; D-059 INR; native currency types of the selected core constrain the choice (D-001) | Technical lead / finance | M05, M10, M11, M13, M19, D-080 money format |
| D-105 | **Public storefront caching and invalidation mechanism**: what is cached (images only, data, full HTML), where (framework cache, CDN), how approved changes/stock events invalidate it, how private dealer prices are rendered without shared caching | BP §16.5 (cache public content, never cache personalised responses under a shared URL, invalidate after approved changes, version/timestamp); BP §8.4; BP §20.1 stock browse propagation ≤60 s proposal (D-034); S13; PR2 §3. Mechanism not specified | Technical lead | M09, M21, M04 publish, A04, T22 |
| D-106 | **Analytics and real-user measurement tooling** for funnel metrics, anonymous search metrics and Core Web Vitals field data | BP §4 (measures), §14.3 "Customer funnel", §20.1 (field data); PR1 §13 "Analytics and monitoring"; PR2 §3; constraint BP §6.1 "limit third-party scripts"; consent/personal data D-037, D-036. Tool not specified | Owner / technical lead | M09 instrumentation, M18 funnel report, M21 metrics |
| D-107 | **Secrets management and TLS certificate tooling**: secrets store, rotation cadence, who may rotate, certificate issuance/renewal | BP §16.6 (TLS, secrets management), §19.1 (secret rotation, separate environment credentials); MK sample: write-only secrets, rotation needs a second approver, certificate-expiry alert. Depends on D-005 | Technical lead | M01, M23, M24 integrations tab, M26 |
| D-108 | **Backup and restore method**: database backup/point-in-time capability, attachment/media backup, off-runtime location, encryption, schedule, rehearsal cadence | BP §16.6 (backups outside the primary runtime), §20.1 (RPO ≤1 h / RTO ≤4 h proposals — D-034; rehearsal before launch and scheduled), §19.3 (backups in retention matrix — D-036), T28 (data and attachments); PR2 §9. MK sample values are not requirements | Owner / operations / technical lead | M26, go-live checklist (BP §23.4) |
| D-109 | **Runtime packaging and deployment method** (managed platform vs simple server deployment; process supervision; how frontends, core application, workers and database are deployed) | BP §15.6 "supported managed environment or simple deployment before a container orchestration platform"; BP §16.6 "selected core's supported application/worker/database layout"; BP §5.3 no Kubernetes; S13 | Technical lead / operations | M01, `infra/`, §31 runtime row |
| D-110 | **Warehouse scanning input and devices**: barcode/label format for SKU, serial and bin; device type (e.g. keyboard-wedge scanners, handheld computers, camera); whether any staff screen needs a handheld layout | BP §10.4 (scan location/SKU/serial), §9.4 (serials at receipt), A03; MK "Scanner connected", "Open scan station", sample handheld device names; BP §28.4 staff mobile optimisation needs its own scope | Operations / technical lead | M06, M07, M12, M13; P-E03, P-E04, P-E08, P-E09 |
| D-111 | **Document generation and printing**: rendering of invoices, credit notes, packing slips and labels (PDF), printer type (document vs label printer), and export file generation (CSV/XLSX/PDF) | BP §10.4, A12, A13, §14.4; MK `erp-reports.html` formats; native print formats may exist in the selected core (D-001); templates/series D-055; label source D-013 | Technical lead / finance | M12, M18, M19; P-E03, P-E12, P-E13, P-S08, P-S09 |
| D-112 | **Attachment malware scanning**: which upload classes are "risky" and which scanning tool/service is used | BP §19.1 "restrict uploads, scan risky attachments". Upload classes: vendor submissions (P-V02), dealer/vendor verification documents (P-S12), return evidence (P-S10), supplier files (P-E06, P-E09), support attachments (P-E05). Tool not specified | Technical lead | M22, M14, M08, M13, M16 |
| D-113 | **Image processing and optimised variants**: pre-generated variants at upload/import vs on-request/CDN transformation; output formats and sizes; accepted source types and maximum size | BP §21.2 "generate optimised variants", §6.1 "Optimise images", §7.4 restrict size and file type, §20.1 LCP target; MK sample "JPG · PNG · WebP ≤ 8 MB" | Technical lead | M22, M04 import (A02), storefront image components |
| D-114 | **Audit-log tamper-resistance mechanism** | BP §19.1 "tamper-resistant according to the selected platform's capabilities"; BP §17.3 before/after, access restrictions, retention; MK `erp-admin.html#audit` sample: append-only, hash-chained, viewing the log is itself logged. Options: platform-native audit/version records with restricted deletion (D-001); append-only store; hash chaining (MK) | Technical lead / owner | M02 E-audit_event, M26, P-E15 audit tab |

(D-115 — GitHub Pages publication scope — is defined in `02-architecture.md` §27.)

## 33. Registry additions requested

None. All technologies map to existing modules (M01, M22, M23, M26 etc.) and entities in `00-conventions.md` §6–7.

---

## 34. SaaS platform additions (2026-09-28, `D-227`)

Architecture: `19-saas-platform.md`. Root admin: `20-root-admin.md`. Nothing below replaces a choice already
recorded here; it adds the technology needs the SaaS layer creates. Concrete products are still chosen by the
existing decisions (`D-001`, `D-002`, `D-003`, `D-005`, `D-033`, `D-052`, `D-053`, `D-101`, `D-107`, `D-109`).

| Need | Requirement on the stack | Decision |
|---|---|---|
| Mandatory tenant scoping | The operational core must support enforcing a store filter at the data-access layer (not by convention) and, preferably, row-level security | `D-001`, `D-233`; proved by `TS-PROOF-11` |
| Immutable in-process configuration | The runtime must be able to hold a frozen per-store object for the process lifetime and swap it atomically, across whatever worker/process model it uses | `D-001`, `D-231`; proved by `TS-PROOF-12` |
| Deterministic compilation | The compiler must produce byte-identical output for identical input (stable key order, no timestamps inside the payload, pinned formatting) | `D-231` |
| Event distribution | At-least-once publish/subscribe for `config.published`, reusing the existing outbox/job runtime rather than a new broker | `D-232`, existing M17 runtime |
| Object storage | Per-store prefixes, signed URLs, content-addressed artefacts, ≥ 20 retained versions per store | `D-033` |
| Local artefact cache | Writable per-host directory (`config/generated/`) so a cold boot needs neither network nor database | `D-231`, `D-109` |
| Certificates | Automated issuance and renewal (ACME) driven by the platform, for platform subdomains and verified custom domains | `D-107`, `D-234` |
| Secret management | Per-store scopes with per-store keys; the artefact carries references only | `D-107`, `BR-M31-08` |
| Second application | `root-admin/` builds and deploys independently, in the same language/framework family as the store backend — one toolchain, two applications | `D-244` |
| CSS custom properties | The storefront and workspace must theme entirely through CSS custom properties, so one compiled `theme.css` per store is enough | `D-240`, `D-003` |
| Test tooling | Query/I-O recorders for the zero-DB-query assertion, microbenchmarks for the accessor budget, and a two-store fixture in the integration and E2E harnesses | `D-053`, `D-248` |
| Lint/CI capability | Custom lint rules are needed for: import boundary, no pack-id branching, no hard-coded concept word, no banned vocabulary, no hard-coded visual value, migration `store_id` check | `D-053`, `D-077` |

**Not added:** no new database engine, no new broker, no service mesh, no per-store container image, no
general-purpose rules engine (BP §5.3/§15.6 still applies), and no second frontend framework.

---

## 35. Channel, automation and extensibility technology (2026-09-28, `D-273`, `D-274`)

Catalogue: `19-saas-platform.md` §5.3. Channel model: §5.6. Contracts: §26.2, §26.3. Data model: `03` §12.

| Need | Requirement on the stack | Decision |
|---|---|---|
| Email sending | A provider supporting a **per-store sending domain** with SPF, DKIM and DMARC, delivery webhooks, suppression lists and per-store reputation isolation | `D-015` |
| WhatsApp | A Business Solution Provider or the Cloud API, with template management and approval state readable through the API, inbound webhooks and a per-store number | `D-014` |
| SMS / OTP | A provider with per-store sender ids where the jurisdiction requires registration, and delivery receipts | `D-015` |
| Web chat | Only if `D-276` approves: a websocket or long-poll transport the chosen stack supports without a second runtime, plus staff presence | `D-276` |
| Web push | Only if `D-275` approves: standard Web Push with per-store VAPID keys | `D-275` |
| Template storage and rendering | Versioned templates with variables, per channel and locale, rendered server-side; no template engine that can execute arbitrary code from stored content | `D-058` |
| Idempotent dispatch | A unique message key per business event, enforced in the database, not in application memory | — |
| Delivery status intake | Signed provider webhooks, replay-safe, per store | `D-014`, `D-015` |
| Automation scheduling | The existing durable job runtime (`M17`); one automation is one registered handler, registered only when its capability is on | — |
| Store API and webhooks | Only if `D-278` approves: per-store API keys with capability-aware scopes, per-store rate limits, signed outbound webhooks with retry and auto-suspension | `D-278` |
| Analytics tags | Only if `D-277` approves: consent-gated, loaded after first paint so they cannot break the `19` §25.2 budgets, never injected as free-text script by a store user | `D-277` |

**Not added:** no second runtime for chat, no separate marketing-automation platform, no per-store message broker,
and no provider SDK that requires a shared, platform-wide account — that would defeat `D-272` separation.
