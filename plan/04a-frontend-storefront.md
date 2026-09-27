# 04a — Frontend plan: customer storefront (P-S01…P-S13), store shell and shared design system

**Purpose.** Implementation plan for the customer-facing web storefront in `frontend/storefront/` (pages P-S01…P-S13
and the store shell) and for the shared design tokens and components in `frontend/design-system/`. A future session
implements a page from its section in §4 by following the listed components, fields, actions → API IDs, states,
permissions and decisions. Backend behaviour lives in `05-backend.md` (BR-*), contracts in `06-api.md` (API-*),
data in `03-database.md` (E-*); this file does not redefine them.

**Sources used.** BP §2.1, §3.1, §4, §5.1–5.3, §6.1–6.8, §7.2, §7.5, §8.1–8.4, §9.1–9.7, §10.1–10.6, §11.1,
§12.2 (A04, A06, A14, A15, A22, A23, A27, A28, A29, A32), §13.1–13.4, §15.4, §15.6, §16.5, §17.4–17.6, §18.1–18.2,
§19.1–19.3, §20.1, §22.5, §23.1 (T01–T36), §26.4, §26.7, §29.1–29.6 · PR1 §2, §4, §6, §8 · PR2 §3, §6 ·
MEET (16:37, 17:07, 17:11) · MK `store-home.html`, `store-listing.html`, `store-product.html`,
`store-refurbished.html`, `store-compare.html`, `store-cart.html`, `store-checkout.html`, `store-order.html`,
`store-account.html`, `store-returns.html`, `store-dealer.html`, `store-login.html`, `store-help.html`,
`assets/tradex.js` (store shell), `assets/tradex.css` (tokens, components) · plan files `00-conventions.md`,
`DECISIONS.md`, `01-tech-stack.md` §3–4, `02-architecture.md` §4, §8–10, §22.3, `03-database.md`,
`05-backend.md`, `06-api.md`.

**Status legend.** Evidence labels and status values exactly as `00-conventions.md` §2–§3. Companion files:
`04b-frontend-workspace-1.md`, `04c-frontend-workspace-2-vendor.md` (staff and vendor UIs),
`07-auth-roles-permissions.md` (permission matrix), `08-ecommerce.md`, `16-testing.md`.

---

## 0. Reading rules for this file

| # | Rule | Source |
|---|---|---|
| 1 | **Routes are not specified.** Every P-S route is `REQUIRES_DECISION (D-163)`; the mockup file name is the page identifier. Legacy-URL mapping is D-076; hostnames are D-102 | 00-conventions §8; BP §6.8 |
| 2 | Mockup query parameters (`?id=`, `?cat=`, `?q=`, `?brand=`, `?deals=1`, `?placed=1`, `?state=`, `?step=`, `?as=`, `?view=` …), `#hash` tab deep links and on-page **state switchers** ("Page state", "View", "Load", "State", "Support right now" open/after-hours toggle, application-status toggle) are **prototype aids**, not product features (§1.11) | 00-conventions §1.1 |
| 3 | The **prototype toolbar** (View-as Guest/Consumer/Dealer, Phase notes, All screens), `data-anno` phase pins, "Try:" demo links, "Restore sample cart (prototype)" and "Prototype: any 6 digits work…" hints are **not built** | 00-conventions §1.1 |
| 4 | Mockup **sample values are not requirements** (prices, names, IDs, 7/10-day windows, "42-point", ₹999 free delivery, 15-min reservation, ₹50,000 COD limit, ₹10,000 dealer minimum, EMI banks, store hours, 4-hour partner confirmation, 30-day cart retention, provider names Razorpay/Delhivery). Each maps to the decision cited where it appears | 00-conventions §1.1 |
| 5 | API IDs come from `06-api.md`. Where `06-api.md` cites a merged decision this file cites the surviving ID: D-140 → **D-129**, D-143 → **D-121**, D-144 → **D-131**, D-148 → **D-137**, D-120 → **D-104** | DECISIONS.md (MERGED rows) |
| 6 | **Global prerequisite decisions** are not repeated on every line: D-003 (framework, PROPOSED-DEFAULT), **D-049 (UI sign-off, OPEN)**, D-103 (design-system technology, OPEN), D-102 (deployables/hostnames), D-083 (session/token), D-080 (API conventions), D-079 (idempotency transport), D-051 (accessibility scope, PROPOSED-DEFAULT), D-050 (languages). Every page therefore carries `REQUIRES_DECISION (D-049 · global)`; the "core status" given per page is the status once the global blockers are decided | DECISIONS.md; 06-api §1.15 status rule |
| 7 | Every UI item ships with loading, empty, error, desktop/laptop viewport and accessibility states (BP §22.5). Phase 1 acceptance is on agreed desktop/laptop browsers; dedicated mobile layouts, touch flows and mobile performance are Phase 2 (M28, D-085). The mockup is responsive (tablet/phone patterns in §2.5, added 27 Sep 2026 at the user's request); whether they become Phase 1 acceptance criteria is D-223 | BP §5.1, §6, §6.7 step 8, §23.1 (T29 is Phase 2); MEET 17:07 (web before app), 17:11 (UI quality, mobile responsiveness noted as a shortcoming) |
| 8 | Conditional and mockup-only features are built only behind their decision (feature flag per D-077); when disabled the UI element is **absent**, not greyed out (API returns `FEATURE_DISABLED`) | BP §5.2; 06-api §1.7; 02-architecture §4.2 rule 12 |
| 9 | Page sections (§4.x) use a fixed template: header table → UI sections (in mockup order) → components → forms & fields → actions (action → API → result) → tables/filters/search/pagination → modals/drawers → validation → states (loading/empty/error) → permissions → API dependencies → backend/database dependencies → related pages → conditional/mockup-only items → status | Brief |

---

## 1. Application structure — `frontend/storefront/`

### 1.1 Framework, rendering and deployment

| Item | Plan | Label | Source / decision |
|---|---|---|---|
| Framework & language | Next.js + TypeScript (React implied), pinned tested versions recorded in `01-tech-stack.md` §31 | PROPOSED | BP §15.4 "Proposed choice… subject to those tests"; D-003 (PROPOSED-DEFAULT) |
| Public pages | Server-rendered (or otherwise optimised) and cacheable: P-S01, P-S02, P-S03, P-S04, P-S13, public part of P-S11, P-S05 (indexing per D-163) | DOCUMENTED | BP §15.4 "server-rendered public pages"; PR2 §3; BP §6.8 |
| Private pages | Never cached under a shared URL; responses `private, no-store`: P-S06, P-S07, P-S08, P-S09, P-S10, dealer part of P-S11, P-S12 form posts | DOCUMENTED | BP §16.5, §8.4; PR2 §3; 06-api §1.11 |
| Private data inside public pages | Dealer prices/tiers, saved delivery PIN, signed-in dealer home modules are rendered as private islands fetched with the session, never baked into shared HTML | DOCUMENTED · mechanism REQUIRES_DECISION (D-105) | BP §8.4 "Shared page cache", T22 |
| Cache invalidation of public content | After approved catalog/price/stock changes; carry version/timestamp so stale data is detectable | DOCUMENTED · mechanism REQUIRES_DECISION (D-105) | BP §16.5; BR-M04-20; BR-M06-18 |
| Deployable & hostname | Separate app or shared deployable with workspace/vendor portal | REQUIRES_DECISION (D-102) | 01-tech-stack §3 |
| Hosting/runtime | Node.js runtime implied by Next.js; hosting and packaging not chosen | REQUIRES_DECISION (D-005, D-109) | 01-tech-stack §3 |
| Mobile app | Not in Phase 1; Phase 2 app reuses the same business APIs | LATER | BP §15.6, §28.4; D-085 |

### 1.2 Logical structure of `frontend/storefront/` (physical folder layout follows D-003)

| Area | Responsibility | Source |
|---|---|---|
| Page modules | One module per P-S01…P-S13 (sections in §4); tab/step sub-views are part of their page | 00-conventions §8 |
| Store shell | Header, top strip, category bar, mega menu, footer, help/chat widget, WhatsApp button, compare tray, PIN modal, toasts (§2) bound to data; presentational parts come from `frontend/design-system/` | MK `assets/tradex.js`; 02-architecture §4.5 |
| Commerce components | App-level composites (price block, product card, buy box, cart line, order summary, shipment tracker, RMA progress…) listed in §3.3 | MK store pages |
| API client | Typed calls to the controlled commerce API only (`API-M##-##`); never generic ERP endpoints; attaches the session artefact (D-083), CSRF token for cookie-authenticated mutations, and one idempotency key per user intent reused on retries for place order, payment attempt, cancellation, return request (D-079) | BP §15.4, §17.4, §17.5, §19.1; 06-api §1.1, §1.5 |
| Buyer-context provider | Holds `buyer_context` from API-M02-01; exposes guest / consumer / dealer (+member role) / verified-guest / checkout-link contexts to pages (§1.5) | BP §8.4; 06-api API-M02-01 |
| Form & validation layer | Client-side format checks that mirror server rules for fast feedback; the server response is authoritative and its `details.fields[]` errors are always rendered | BP §19.1; 06-api §1.7 |
| Feature gating | Conditional / mockup-only features wrapped by decision flags (§1.13) | BP §20.5 feature flags; D-077 |
| Content & i18n | UI strings externalised; languages per D-050; policy/FAQ text comes from API (API-M04-04, API-M16-01), not hard-coded | BP §13.4, §26.7 Q63 |
| Instrumentation | Funnel and search measures (product-to-cart, checkout completion, zero-result searches) through the tool chosen in D-106; no third-party script without that decision | BP §4, §6.1; D-106 |
| Tests | Unit/component tests next to code; cross-app E2E and accessibility suites in `tests/` (tools D-053) | 00-conventions §11; BP §23.2 |

### 1.3 Rendering class per page (detail of caching in `02-architecture.md` §4.2)

| Page | Class | Indexable | Access |
|---|---|---|---|
| P-S01 Home | Public SSR + private islands (dealer modules, continue shopping) | Yes | Public |
| P-S02 Category & search | Public SSR + private islands (dealer price/tier hints) | Category pages yes; filter/search URLs controlled (D-163) | Public |
| P-S03 Product detail | Public SSR + private islands (dealer price/tiers, PIN estimate) | Yes; structured data shows real availability (BR-M27-03) | Public |
| P-S04 Certified refurbished | Public SSR + private island (dealer prices) | Yes | Public |
| P-S05 Compare | Public shell, client-assembled from public product data + private offers | REQUIRES_DECISION (D-163) | Public (CONDITIONAL D-042) |
| P-S06 Cart | Private | No | Session / guest cart (D-129) |
| P-S07 Checkout | Private | No | Session; guest per D-021; checkout link (LNK) |
| P-S08 Order confirmation & tracking | Private | No | Owner / org member / verified guest (GAT) |
| P-S09 My account | Private (guest sees a public sign-in prompt) | No | Authenticated |
| P-S10 Returns & warranty | Private (policy text public) | No | Authenticated or verified guest |
| P-S11 Dealer zone | Landing public SSR; dealer workspace private | Landing only; private dealer versions never indexed | Mixed |
| P-S12 Sign in · register · apply | Public form shell; posts private | No | Public, rate-limited (D-084) |
| P-S13 Help & policies | Public SSR (chat lookups private) | Yes | Public |

### 1.4 Data-access rules (apply to every page)

| # | Rule | Source |
|---|---|---|
| 1 | Prices, discounts, tiers, taxes, shipping and totals are always taken from API responses (API-M04-03, API-M21-01, API-M05-01, API-M10-01/06/07); the UI never computes a payable amount and never sends `unit_price`, segment, `dealer_approved`, `stock_quantity` | BP §8.1, §8.4, §17.4; T10; BR-M05-01, BR-M05-08 |
| 2 | Stock/delivery messages are a projection and are shown with their `as_of` time where the API returns it; checkout revalidates with the stock authority | BP §9.1, §16.5; MEET 16:37 (inventory synchronised with the site); BR-M06-18, BR-M21-03 |
| 3 | Supplier-held stock is labelled as partner/supplier stock with its lead time, never as company stock | BP §9.7; BR-M06-14 |
| 4 | Money/stock/external-effect operations (place order, payment attempt, cancellation, return request) send an idempotency key created once per user intent; buttons disable while in flight; a replayed response is rendered as the original result | BP §10.3, §17.5; T06; 06-api §1.5 |
| 5 | Private responses are never stored in shared caches; on sign-out all client-held private data (dealer prices, quotes, orders, addresses) is discarded and pages refetch as guest | BP §8.4; T22; BR-M02-13 |
| 6 | Card data never touches the storefront; payment uses the provider's hosted/approved collection | BP §10.6; BR-M11-10; D-012 |
| 7 | Uploads go through API-M22-01 (type/size limits, malware scan for risky types); private documents are viewed only through API-M22-02 | BP §19.1; D-033, D-112, D-113 |
| 8 | Out-of-scope or unknown objects are shown as "not found" without disclosing existence | BP §23.1 T11, T23; 06-api §1.3 |
| 9 | A product reference passed to chat/WhatsApp is a reference, not a trusted price | BP §13.2; BR-M16-03 |

### 1.5 Buyer context handling (guest / consumer / dealer)

Context comes only from API-M02-01 `buyer_context` and from context-aware responses; client state or URL
parameters never select a price context (BP §8.4 "Guest modifies customer type in request"; BR-M02-13; T10).

| Context | How it is established | Prices shown | Tax display | Notable UI differences | Source |
|---|---|---|---|---|---|
| Guest (R-guest) | No session | Public price list | Consumer convention (mockup: incl. GST) — D-016 | "Business buyer? Sign in / Apply" callouts; no wishlist/orders/returns without sign-in or verification; checkout per D-021 | BP §3.1; MK `.only-guest` blocks |
| Verified guest (GAT) | Order number + phone + OTP, or secure link (API-M10-10/11) | Order snapshot only | As on order | Access limited to one order: read, pay, cancel lines, request return, download invoice; address masked | BP §6.5, §13.4; 06-api §4.14; D-021 |
| Checkout-link holder (LNK) | Secure checkout link (API-M10-22) for a staff/WhatsApp draft | Recomputed on open | Per buyer | Enters P-S07 with the draft; same controls as web checkout | BP §13.2, §29.5; D-151 |
| Consumer (R-consumer) | Customer session | Public price list (+ eligible promotions D-043) | D-016 | Account, wishlist (D-042), invoices, devices; optional GST invoice at checkout | BP §3.1; terminology D-006 |
| Dealer applicant (pending / rejected) | Customer session with an E-dealer_application, no active membership | Public prices | Consumer convention | Application status shown on P-S11/P-S12; "you can still buy at public prices" | BP §6.3 Dealer account, §8.3; BR-M08-01 |
| Dealer member — active (R-dealer) | Active E-business_account_member of an approved E-business_account | Contract → dealer list → tiers (BP §8.1 steps 2–3) | Mockup: ex-GST + GST shown separately — D-016 | Dealer tag on prices, tier tables and hints, quick order, quotes, business invoices; consumer coupons, EMI and COD hidden per rules (D-017, D-062, D-020); prepaid by default (D-019) | BP §3.1, §8.1–8.3; T02, T03 |
| Dealer member role (owner / buyer / accounts — mockup samples) | `member_role` from membership | Accounts role may not see price list (sample) | — | Visibility of price list, orders, invoices, team, order limits per D-066 | BP §8.3; D-066 |
| Dealer — suspended / approval expired | Account state | Falls back to public prices; dealer features paused | Consumer convention | Suspension banner with reason and required action; history stays accessible | BP §6.3 Dealer account; BR-M08-05 |
| Vendor applicant (R-vendor_applicant) | Public vendor application on P-S12 (1B) | n/a | n/a | Storefront account ≠ vendor tools; vendor portal login is separate | BP §3.1, §11.1; D-047, D-102 |

Context-change rules: (1) sign-in, sign-out, membership approval/suspension and switching delivery location
trigger a refetch of every context-dependent block; (2) if the cart/checkout context changes (membership lost,
non-eligible business or location), the quote is recalculated and the change is shown as an explicit notice before
payment (BP §6.5 "reprice with explicit notice"; `CONTEXT_INELIGIBLE`; BR-M05-12); (3) staff "view as dealer" is not a
storefront function (D-149).

### 1.6 Global states

| State | Treatment | Source |
|---|---|---|
| Loading — public SSR | Critical content (title, price for public context, availability message) rendered on the server; secondary rails stream/load later with skeletons (`.skel`) | BP §6.3 Home "Slow connection"; BP §20.1 LCP (D-034) |
| Loading — private islands | Placeholder of the same size (no layout shift, CLS target D-034) until context-priced data arrives | BP §20.1 |
| Loading — mutations | Button shows busy label and is disabled; no optimistic updates for money/stock/order state | BP §6.3 Checkout "duplicate submission"; §10.3 |
| Slow connection / partial failure | Page remains usable with core content; failing secondary modules are hidden, never block purchase paths | BP §6.3 Home |
| Stale data | Availability shows "as of" time; cart/checkout show "re-checked at {time}"; changed items are listed explicitly | BP §16.5; MK:store-cart.html "changed since you last visited" |
| Empty | `.empty` pattern: icon, heading, one-line reason, next action (continue shopping, clear filters, browse) | MK `tradex.css` Empty state; BP §22.5 |
| Session expired / unauthenticated | Private page → P-S12 sign-in with return path; verified-guest token expired → re-verify (API-M10-10/11) | BP §19.1; D-083, D-021 |
| Not found / no access | Same neutral "not found" state; no hint whether the object exists | T11, T23 |
| Feature disabled | Conditional element not rendered | 06-api `FEATURE_DISABLED`; D-077 |
| Rate limited | "Paused for your security — try again in …" with the server's retry-after; no attempt counter guessing | BP §19.1; D-084; MK:store-login.html, store-order.html lockout copy |
| Outside support hours | Chat/WhatsApp/phone show after-hours state; guided help and order tracking still available | BP §6.3 Help; D-074 |
| Unrecoverable error | Error panel with correlation id from the error envelope, retry, and a support route (chat/WhatsApp with reference) | 06-api §1.7; D-080 |

**API error code → UI treatment** (codes from `06-api.md` §1.7; envelope per D-080):

| Code | UI treatment | Pages |
|---|---|---|
| `VALIDATION_FAILED` | Inline field errors + error summary at the top of the form with links to fields | All forms |
| `UNAUTHENTICATED` / `FORBIDDEN` / `NOT_FOUND` | Sign-in redirect / neutral not-found | Private pages |
| `RATE_LIMITED` | Pause message with retry time | P-S12, P-S08, P-S07, P-S09, P-S10, shell chat |
| `CODE_INVALID` / `CHALLENGE_EXPIRED` | OTP box error, attempts remaining if returned, resend after cooldown | P-S12, P-S07, P-S08, P-S09, P-S10 |
| `STOCK_UNAVAILABLE` | Line-level accurate message with available quantity; dealer shortage options (reduce / quote / remove) | P-S06, P-S07, P-S11, P-S03 |
| `PRICE_CHANGED` | "Price changed — please confirm" modal (`m-price`) with accept / remove item; never silent | P-S07 (and P-S06 notice) |
| `QUOTE_EXPIRED` / `RESERVATION_EXPIRED` | Expired banner with "Re-check & reserve again"; place-order disabled until re-checked | P-S07 |
| `NOT_SERVICEABLE` | PIN error with alternatives (another address, store pickup if D-061, WhatsApp help) | Shell m-pin, P-S03, P-S06, P-S07, P-S09, P-S13, P-S12 |
| `CONTEXT_INELIGIBLE` | Reprice notice ("Dealer pricing paused — prices updated") | P-S06, P-S07, P-S11 |
| `CHECKOUT_BLOCKED_PRICE_LIST` | "Your price list needs renewal — contact your account manager"; no zero price | P-S06, P-S07, P-S11 |
| `COUPON_INVALID` | Inline coupon message (invalid / expired / not applicable) | P-S06 |
| `POLICY_INELIGIBLE` | Per-line "not eligible" reason and alternative route (warranty, cancel instead) | P-S10, P-S08 |
| `POLICY_ACK_REQUIRED` | Acknowledgement checkbox error | P-S07 |
| `ORDER_LIMIT_EXCEEDED` | "Above your order limit — needs owner approval" (D-066) | P-S07, P-S11 |
| `STATE_TRANSITION_INVALID` | Refresh the record and explain ("Already dispatched — request a return after delivery") | P-S08, P-S10, P-S11 |
| `IDEMPOTENCY_CONFLICT` | "This checkout was already submitted" → open the existing order | P-S07 |
| `STOCK_AUTHORITY_UNAVAILABLE` | "We can't confirm stock right now — nothing was charged"; retry | P-S07 |
| `PROVIDER_PENDING` | Pending state (payment verification pending, refund pending) — never a false success | P-S07, P-S08 |
| `PROVIDER_UNAVAILABLE` | Provider-down message with fallback (manual GSTIN review note, try another payment method) | P-S07, P-S12, P-S03 |
| `METHOD_NOT_AVAILABLE` | Payment method tab marked unavailable with reason | P-S07 |
| `LINK_EXPIRED` (API-M10-22) | Expired checkout-link state with WhatsApp/support route | P-S07 |
| `NOT_ISSUED_YET` (API-M19-02) | "GST invoice is issued at dispatch" | P-S08, P-S09 |
| `SERIAL_MISMATCH` (API-M08-15) | Mismatch message; nothing linked | P-S09 m-register |
| `CONSENT_MISSING` / `WINDOW_CLOSED_TEMPLATE_REQUIRED` | Consent prompt / "we'll reply on WhatsApp when you message us" | P-S09 wishlist alerts, shell chat |
| `NOT_VERIFIED_PURCHASER` | "Only verified purchasers can review" | P-S03 (D-041) |

### 1.7 Accessibility (D-051 — target WCAG 2.2 AA, test scope to agree)

| Requirement | Implementation in storefront | Source |
|---|---|---|
| Keyboard order & focus visibility | Logical DOM order; visible focus ring from token `--ring`; skip-to-content link in shell; mega menu, dropdowns, tabs, compare tray and chat operable by keyboard; Esc closes modals/drawers/dropdowns (MK behaviour) | BP §6.7; T30 |
| Labels | Every input has a visible label (MK uses `<label for>`); icon-only buttons have accessible names (MK aria-labels: "Save to wishlist", "Decrease quantity", "Remove photo"); OTP boxes labelled per digit; dual price slider labelled min/max | BP §6.7 |
| Error summaries | Forms show an error summary + inline errors; focus moves to the summary on submit failure | BP §6.7 |
| Non-colour status | Condition badges always carry text; status pills carry text; RMA/stepper progress has text labels and an accessible "Step n of 7" name (MK `aria-label`) | BP §6.1, §6.7; MK `tradex.css` "always text + colour" |
| Image descriptions | Product photos use the product title; unit photos describe the unit and any defect shown | BP §6.7 |
| Dynamic updates | Toasts, cart count, reservation timer milestones, price-change notices and payment-status changes announced through polite live regions; timers do not announce every second | BP §6.7 |
| Modals & drawers | Focus trapped inside, returned to the trigger on close, labelled by their heading | BP §6.7 |
| Tables | Header cells for compare, price list, invoices, sessions, consent tables | BP §6.7 |
| Time limits | Reservation countdown and OTP resend show remaining time; expiry never loses entered data | WCAG 2.2 AA (D-051) |
| Acceptance | T30 (keyboard-only user completes key flow) plus the agreed D-051 scope on P-S02→P-S03→P-S06→P-S07→P-S08, P-S10, P-S12 | BP §23.1 |

### 1.8 Performance and third-party scripts

Targets are proposals (LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75) — D-034. Optimised image variants per D-113 with
lazy loading below the fold (MK uses `loading="lazy"`); fonts self-hosted per D-103/D-049; no third-party script
(analytics, chat, payment SDK) is added without its decision (D-106, D-012, D-014) (BP §6.1 "limit third-party
scripts", §20.1). Large reports/imports must not degrade checkout (T35).

### 1.9 SEO (M27)

| Item | Plan | Source |
|---|---|---|
| Crawlable pages & titles | Server-rendered P-S01–P-S04, P-S13, P-S11 landing; meaningful `<title>` per page (MK sets `document.title` per product/category) | BP §6.8; BR-M27-01 |
| Canonical URLs & filter URLs | Canonical per product/category; filter/sort/search URLs noindex or canonicalised per D-163 | BP §6.8 "controlled treatment of filter URLs" |
| XML sitemap | Generated from API-M27-02 (public URLs only, no dealer variants) | BR-M27-01, BR-M27-02 |
| Structured product data | Price/availability only from the public offer; unavailable products marked accurately | BP §6.8; BR-M27-03 |
| Redirects | Legacy/archived URLs resolved through API-M27-01 → redirect or useful unavailable page | BP §6.8, §21.2; T32; D-076 |
| Private versions | Dealer-context HTML never indexable, never cached publicly | BP §6.8; BR-M27-02 |

### 1.10 Formatting, language and time

Currency INR under D-059; amount formatting and rounding follow D-104 (MK `en-IN` grouping is a sample
presentation); dates/times shown in the business timezone per D-124 (MK shows IST); tax labels (CGST/SGST/IGST
split, place of supply) come from API responses (D-016, D-037); UI languages per D-050 (MK profile offers
English/Kannada/Hindi as message-language samples).

### 1.11 URL scheme and prototype aids (all production routes `REQUIRES_DECISION (D-163)`)

| Mockup page | Prototype query parameters / hashes | Meaning in prototype | Production treatment |
|---|---|---|---|
| all store pages | `?as=` / `?view=` guest·consumer·dealer | Forces the View-as context | Not built — context comes from session (§1.5) |
| store-listing.html | `?cat=`, `?q=`, `?brand=`, `?deals=1`, `?layout=list`, `?exact=1` | Category / search / brand / deals modes, list layout, no spelling correction | Mode + filter parameters are part of D-163 (indexability per BP §6.8) |
| store-product.html | `?id=`, `?state=normal·oos·price·confirm`, `#specs`/`#inspection`/`#reviews`/`#qa`, `#m-ask` | Product id; state switcher; tab deep link | Product URL per D-163; states come from data; tab deep links optional (D-163) |
| store-refurbished.html | `?cat=`, `#shop`, `#grades` | Pre-selects category chip; anchors | D-163 |
| store-compare.html | `?example=cameras·mixed` | Loads example sets | Not built; selection per D-042 |
| store-cart.html | `?empty=1` | Shows empty state | Not built |
| store-checkout.html | `?step=`, `?state=failed·price·expired`, `#address` | Step and failure simulation | Steps are client state; failures come from API |
| store-order.html | `?placed=1`, `?pay=pending`, `?ship=delivered`, `?id=`, `#order` | Confirmation vs tracking view, states | Order URL per D-163; states from API-M10-07 / API-M11-02 |
| store-account.html | `#overview`…`#privacy`, `#m-address`, `#d-rma` | Tab/modal deep links | Tab deep links kept (MK "Deep-linkable account sections") — form per D-163 |
| store-returns.html | `?order=`, `?item=`, `?type=warranty`, `#step-N`, `#done`, `#requests` | Pre-selection, wizard step | Pre-selection by order/line id per D-163 |
| store-dealer.html | `#overview`, `#pricelist`, `#bulk`, `#quotes`, `#reorder`, `#invoices`, `#team` | Tab deep links | D-163 |
| store-login.html | `#signin`, `#register`, `#dealer`, `#vendor`, `?done=dealer·vendor` | Tab; show completion state | Tabs D-163; completion from API response |
| store-help.html | `#faq`, `#grades`, `#warranty`, `#shipping`, `#returns`, `#terms`, `#privacy`, `#grievance`, `#stores`, `?hours=closed` | Anchors; after-hours simulation | Anchors per D-163; hours state from API-M16-02 / D-074 |

### 1.12 Client-held state

| State | Where the mockup keeps it | Production | Decision |
|---|---|---|---|
| Cart lines, saved-for-later, stock adjustments | `localStorage` (`tx-cart`, `tx-saved`, `tx-cartAdj`) | Server cart (API-M10-01…05) or client basket + quotes — must persist across refreshes and survive payment interruption | D-129; BR-M10-18 |
| Coupon | `localStorage` | Sent with the quote request (API-M05-01 `coupon_codes`) | D-043 |
| Compare selection (max 4 in MK) | `localStorage` `tx-compare` | Client-held list of product ids; limit per D-042 | D-042 |
| Wishlist | `localStorage` `tx-fav` | Server wishlist (API-M08-16…18), signed-in only | D-042 |
| Recently viewed | `localStorage` `tx-recent` ("stored on this device") | Only if D-164 approves; consent per D-037/D-106 | D-164 |
| Delivery PIN | Header label | Signed-in: default address (API-M08-05); guest: session-scoped PIN | D-083, D-163 |
| View-as, annotation toggle, toolbar hidden | `localStorage` | Not built | 00-conventions §1.1 |

### 1.13 Conditional and mockup-only feature register (storefront)

| Feature | Label | Decision | Pages | APIs |
|---|---|---|---|---|
| Guest checkout & guest order access | CONDITIONAL ("policy to confirm") | D-021 | P-S07, P-S08, P-S09, P-S10, shell chat | API-M10-10, -11, -12 |
| Wishlist & product comparison | CONDITIONAL | D-042 | P-S02, P-S03, P-S05, P-S09, shell | API-M08-16…19 |
| Reviews & ratings (incl. rating filter/sort) | CONDITIONAL | D-041 | P-S02, P-S03, P-S05, P-S09 | API-M04-07…09 |
| Coupons / promotions / deals | CONDITIONAL | D-043 (+ D-142 deals content) | P-S01, P-S02, P-S06, P-S07 | API-M05-01, API-M09-01 |
| Cash on delivery | CONDITIONAL | D-020 | P-S03, P-S07, P-S10, P-S13, shell m-pin | API-M12-01, API-M11-01 |
| Store pickup, availability by branch, reserve-to-view | CONDITIONAL ("if supported") | D-061, D-029 | P-S01, P-S02, P-S03, P-S04, P-S07, P-S13 | API-M06-01, API-M12-01 |
| EMI plans, bank/UPI offer cards, saved cards | MOCKUP-ONLY | D-062 (EMI depends on D-012) | P-S01, P-S03, P-S07, shell footer | API-M11-01 |
| Product Q&A | MOCKUP-ONLY | D-065 | P-S03 | API-M04-11, -12 |
| Alerts (back-in-stock, price-drop, saved search), "Request this product", "Report a spec issue", newsletter, share links | MOCKUP-ONLY | D-141 | P-S02, P-S03, P-S04, P-S06, P-S09, shell footer | API-M20-06/07, API-M16-11, API-M04-14, API-M08-11, API-M08-19 |
| Compatibility suggestions | CONDITIONAL (A32 P1/C) | D-071 | P-S03, P-S06 | API-M04-05 |
| Bundles / frequently bought together | CONDITIONAL | D-072 (+ D-164 for suggestion source) | P-S03 | API-M04-06, API-M10-02 |
| Supplier-held (partner) stock offers | CONDITIONAL | D-073, D-028, D-007 | P-S02, P-S03, P-S06, P-S07, P-S08 | API-M04-03 |
| Dealer quotes, quick order, bulk upload (upload 1B) | REQUIRES_DECISION | D-121 | P-S01, P-S11 | API-M05-03, -06, -07, -09 |
| Customer 2-step verification | MOCKUP-ONLY for customers | D-040 | P-S09, P-S12 | API-M02-05, -12…14 |
| Register in-store purchase (device) | MOCKUP-ONLY | D-133 | P-S09 | API-M08-15 |
| Recently viewed / continue shopping / similar / complete your setup | MOCKUP-ONLY | D-164 | P-S01, P-S02, P-S03, P-S05, P-S06 | API-M21-01 |
| Delivery OTP handover, express delivery, shipping fees | MOCKUP (values samples) | D-162 | P-S03, P-S07, P-S08, P-S09, P-S13 | API-M12-01 |
| Digital licence (ESD) items | MOCKUP-ONLY | D-167 | P-S09, P-S10 | — |
| Vendor application tab (Sell with Tradex) | DOCUMENTED, phase 1B | D-047, D-048 | P-S12, shell | API-M14-01 |
| WhatsApp Level 2 guided ordering | CONDITIONAL in 1A, M in 1B | D-014, D-048 | P-S01, shell | API-M10-22 |

### 1.14 Phase, requirement and test mapping

| Page | Phase | Requirements (BP §2.1) | Acceptance tests (BP §23.1) |
|---|---|---|---|
| Shell | 1A (vendor link 1B) | R01, R02, R11, R14 | T22, T23, T24, T30 |
| P-S01 | 1A | R01, R03, R04, R07, R08, R11, R14, R19 | T01, T02, T22 |
| P-S02 | 1A | R01, R03, R04, R07, R08, R19 | T01, T02, T22, T36 |
| P-S03 | 1A | R01, R03, R04, R07, R08, R11, R14, R19 | T01, T02, T03, T10, T14, T22, T32, T33 |
| P-S04 | 1A | R01, R08, R19 | T01 |
| P-S05 | 1A (C) | R01, R07 | T01 |
| P-S06 | 1A | R03, R04, R08 | T02, T03, T04, T10, T22 |
| P-S07 | 1A | R03, R08, R11 | T04, T06, T09, T10, T30 |
| P-S08 | 1A | R08, R11, R19 | T07, T08, T09, T23, T33, T34 |
| P-S09 | 1A | R19, R11 | T23, T25, T33 |
| P-S10 | 1A | R19 | T17, T33, T34 |
| P-S11 | 1A (bulk upload 1B) | R03, R04 | T02, T03, T10, T22 |
| P-S12 | 1A (vendor tab 1B) | R03, R05 | T10, T11 (vendor scope after approval) |
| P-S13 | 1A (L2 WhatsApp 1B) | R11, R14, R19 | T23, T24 |
| All | Phase 2 | R02, R12 (mobile layouts, app) | T29 (not a Phase 1 gate) |

---
## 2. Store shell (S-SHELL — `assets/tradex.js` `buildStoreShell`, `initChat`)

Present on every P-S page. Presentational parts live in `frontend/design-system/` (02-architecture §4.5); data
binding lives in `frontend/storefront/`. Phase 1A (vendor link 1B). Evidence: MOCKUP (MK:assets/tradex.js store
shell) consistent with BP §6.2 information architecture. Status: `REQUIRES_DECISION (D-049 · global)`; core
`NOT_STARTED`.

### 2.1 Shell elements

| Element | Content and behaviour | API | Visibility by context | Evidence · decisions |
|---|---|---|---|---|
| Top strip | Service message (mockup: free-delivery threshold and dispatch cut-off — samples); links: Dealer / business pricing (hidden for dealers) → P-S11; Sell with Tradex → P-S12#vendor; Track order → P-S08; Help → P-S13; WhatsApp number (click-to-chat) | — (content) | All; dealer link hidden for R-dealer | MOCKUP · message values D-162; content source D-142; vendor link 1B (D-047, D-048); number D-014 |
| Logo | Brand mark → P-S01 | — | All | MOCKUP · brand name/logo D-049 |
| Deliver-to | Label: guest "Enter PIN code"; signed-in "Deliver to {name} · {city PIN}" from default address; dealer "Deliver to {business}"; opens PIN modal (§2.3) | API-M08-05, API-M12-01 | All | MOCKUP; BP §6.5 · D-013 |
| Search form | Scope select ("All" + top-level categories), text input (model/SKU oriented placeholder), submit → P-S02 search mode; suggestions dropdown (§2.4) | API-M21-02, API-M04-01 | All | DOCUMENTED BP §6.1 "Search first", §6.4 · D-032 |
| Account action | Two-line label: guest "Hello, sign in / Account & lists" → P-S12; consumer "Hello, {first} / Account & lists" → P-S09; dealer "Hello, {first} / Business account" → P-S11 | API-M02-01 | All | MOCKUP |
| Returns & Orders | → P-S09#orders | — | Signed-in only (`.only-signed`) | MOCKUP |
| Wishlist | Heart icon → P-S09#wishlist | — | Signed-in (guest → sign-in prompt) | CONDITIONAL D-042 |
| Cart | Icon + count badge (sum of quantities) → P-S06 | API-M10-01 | All | MOCKUP · D-129 |
| Sign out | From account menu/P-S09 | API-M02-06 | Signed-in | DOCUMENTED BP §8.4 (T22) |
| Category bar | "All categories" (mega toggle); top categories from the published category tree; Refurbished → P-S04; Deals → P-S02 deals mode; Dealer zone → P-S11; active state for current category | API-M04-01 | All | DOCUMENTED BP §6.2 · deals D-043/D-142 |
| Mega menu | Left: full category list with icons; right: merchandised columns (e.g. "Business laptops", "Under ₹40,000", "Used & refurbished") and a promo tile ("Build your PC") | API-M04-01 (+ curated links API-M09-01) | All | MOCKUP · curated columns/promo D-142 |
| Footer | Logo + tagline; newsletter email + Subscribe; contact line (WhatsApp, email); columns Shop / Business (dealer pricing, bulk/quick order, apply as dealer, sell with Tradex, vendor portal login) / Help (track, returns, warranty, grades, shipping, contact) / Visit a store (store list); bottom: Terms, Privacy, Grievance officer links; accepted payment marks | API-M08-11 (subscribe), API-M03-01 (stores) | All | MOCKUP · newsletter MOCKUP-ONLY D-141; legal pages D-037; payment marks D-012/D-062; vendor portal host D-102 |
| Help / chat widget | "Help" floating button opens chat box (§2.2) | API-M16-01, -02, -03, -06, -07, API-M10-10, -11 | All | DOCUMENTED BP §13.1 (guided FAQ + order status, no LLM), §6.3 Help · R11 |
| WhatsApp button | Floating WhatsApp button and in-page WhatsApp buttons open click-to-chat with the page reference (product SKU/unit, order number, cart reference, RMA) — Level 1 | — (deep link) | All | DOCUMENTED BP §13.1 Level 1 (1A) · number/provider D-014 |
| Compare tray | Appears when ≥1 product selected; "N of 4 selected", thumbnails, Clear, Compare now → P-S05; limit message when exceeded | — (client state) | All | CONDITIONAL D-042 (limit value D-042) |
| PIN modal `m-pin` | §2.3 | API-M12-01, API-M08-05 | All | MOCKUP |
| Toast region | Short confirmations ("Added to cart", "Saved to wishlist") in a polite live region | — | All | MOCKUP |
| Prototype toolbar | View-as, Phase notes, All screens | — | — | **Not built** (00-conventions §1.1) |

### 2.2 Help / chat widget (deterministic guided flow)

| Item | Plan | Source |
|---|---|---|
| Header | Title, typical reply time and hours from API-M16-02 `hours` (mockup "5 min · 9 AM–9 PM" are samples) | D-074 |
| Opening menu | Guided options from API-M16-02 nodes; mockup nodes: Track my order · Product question · Returns & warranty · Dealer pricing · Talk to a person | BP §13.1; MK |
| Track my order | Explains order number + phone + one-time code; either opens P-S08 lookup or verifies inline (API-M10-10 → API-M10-11); no order details before verification | BP §13.2 "Verify order access", §13.4; A15 (P1B); T23 |
| Product question | Approved answer text; compatibility questions are confirmed by a specialist (handoff) — never guessed | BP §13.4 "Escalate… uncertain compatibility"; BR-M16-10 |
| Returns & warranty | Approved policy summary (API-M16-01) + links: Start a return (P-S10), Warranty policy (P-S13#warranty) | BP §13.4 "versioned approved content" |
| Dealer pricing | Summary + Apply as dealer (P-S12#dealer) / Talk to a person | MK |
| Explain condition grades | Approved grade summary + Browse refurbished (P-S04) | D-023 |
| Talk to a person | Creates a web-chat conversation with context (page, product, order, quote) → queue position/reference (API-M16-03); option "Continue on WhatsApp" with the reference | BP §6.3 Help "human handoff"; T24 |
| Free text | Sent to the conversation (API-M16-07); bot never invents an answer — acknowledges and hands off | BP §13.1, §13.4; BR-M16-12, BR-M16-13 |
| Message refresh | Polling or push per D-146 (API-M16-06) | D-146 |
| States | Outside hours → "Leave a message", reference shown, guided help still works; bot cannot resolve → handoff with context; verification failed → no disclosure, retry/lockout per D-084 | BP §6.3 Help; T23, T24 |

### 2.3 PIN / delivery-location modal (`m-pin`)

Explanatory copy: delivery dates, serviceability and COD eligibility depend on the PIN; prices are the same everywhere
unless a location price list applies (D-044). Fields: PIN (6 digits, first digit 1–9 — mockup regex; server
authoritative). Signed-in users see saved addresses (API-M08-05) to pick from. Apply → API-M12-01 → updates the
header label and every visible delivery estimate; errors: invalid format (inline), `NOT_SERVICEABLE` (with store
pickup alternative if D-061), `PROVIDER_UNAVAILABLE` ("can't check delivery right now"). Guest PIN persistence is
session-scoped (D-083). Sources: BP §6.5, §8.4 "Location changes"; D-013, D-020, D-044, D-061.

### 2.4 Search suggestions

On typing: query suggestions with the matched fragment highlighted, product suggestions (title, condition, **public**
price hint only), popular searches as chips (API-M21-02). Enter/submit → P-S02 search mode with the query and scope.
Suggestions never show dealer prices (BR-M21-06). Empty/zero-suggestion: dropdown hidden. Errors: suggestions silently
hidden; submit still works. Sources: BP §6.4; MK shell "Suggestions"; D-032; E-search_synonym.

---


### 2.5 Responsive layouts (MOCKUP since 2026-09-27 · Phase 1 scope D-223)

The mockup storefront works on desktop, tablet and phone. Desktop behaviour above is unchanged; the rows below
describe what changes at smaller widths. If D-223 keeps the BP split, these layouts may still ship but are not Phase 1
acceptance criteria; if it moves mobile web into Phase 1, they are the specification (task T-1A.9-M09-12).

| # | Area | Tablet (761–980 px) | Phone (≤ 760 px; ≤ 420 px small) | MK reference |
|---|---|---|---|---|
| 1 | Breakpoints | desktop ≥ 981 · tablet 761–980 · phone ≤ 760 · small phone ≤ 420 | — | `assets/tradex.css` "Responsive" |
| 2 | Prototype toolbar | Collapses into "Prototype menu" ≤ 1360 px (store) | Brand + menu only | review aid, not built |
| 3 | Category bar | Priority hiding at 1420/1240/1100 px (`data-p`, less-used links move into "All categories"); ≤ 980: swipeable pills, "All categories" opens the menu drawer, mega menu disabled | same | `buildStoreShell` |
| 4 | Header | Menu (☰) button; account/orders/wishlist/cart icon-only; delivery chip hidden | Row 1 menu · logo · account · cart; row 2 full-width search; row 3 "Deliver to <PIN>" (`.s-mdeliver`) | `.s-burger`, `.s-mdeliver` |
| 5 | Menu drawer `#s-drawer` | Slide-in dialog: signed-in user or sign-in, delivery PIN, quick links (orders, wishlist, dealer zone, help), category accordions with the same sub-links as the mega menu, other links | same | `initStoreDrawer`; dialog with focus trap, Esc, focus return, `aria-expanded` |
| 6 | Bottom tab bar | — | Fixed bar: Home · Categories (opens drawer) · Deals (guest/consumer) or Dealer (dealer) · Account · Cart (count) | `.s-tabbar`; fixed UI above it uses `--s-bottom` (60 px; product buy bar 68 px; cart 126 px) |
| 7 | Modals | Centred | Bottom sheets (max 92 vh, sticky head/foot) | shared CSS |
| 8 | Off-canvas panels | `TX.openSheet(id)` panels: dialog, focus trap, Esc, backdrop, scroll lock; close automatically when the window grows past 980 px | same | listing filters, account menu |
| 9 | Help widget, compare tray, toasts | — | Sit above the bottom bar; help button icon-only; compare slots hidden ≤ 420 px | shared CSS |
| 10 | P-S01 Home | Hero one column, promo tiles stack | Hero/promo text over image, trust strip and category tiles 2–3 per row, brand row swipeable | `store-home.html` |
| 11 | P-S02 Listing | "Filters" button (active-filter count) opens the filter panel with a "Show N results" footer | Product grid 2 per row, compact cards (dealer tag and delivery line shortened, flags wrap) | `store-listing.html` |
| 12 | P-S03 Product | Gallery above details | Swipeable thumbnails; sticky buy bar (price, Add to cart, Buy now); spec names 36 % | `store-product.html` `#m-buybar` |
| 13 | P-S05 Compare | Table scrolls sideways with the spec-name column pinned; hint line | same | `store-compare.html` |
| 14 | P-S06 Cart | Lines stack | Sticky bar with total + Checkout; saved-for-later rows wrap | `store-cart.html` `.m-cobar` |
| 15 | P-S07 Checkout | Payment method tabs become a horizontal row; summary below the steps | Steps stack; stepper shows labels for the current step only; review items as thumbnail + name + meta with quantity and total on a second line; Place order full width | `store-checkout.html` |
| 16 | P-S08 Order | — | Shipment tracker vertical; status tiles and lookup form stack | `store-order.html` |
| 17 | P-S09 Account | — | "Account menu" button (shows the current section) opens the section menu as a panel; tables scroll inside cards | `store-account.html` |
| 18 | P-S04, P-S10–P-S13 | Two-column layouts stack | Forms one column; request stepper and tables scroll sideways | respective pages |
| 19 | Tables (all store pages) | Scroll sideways inside their card with minimum widths by column count (480/640/800/960 px) and per-cell minimums, so text is never squeezed | same | shared CSS |
| 20 | Images and banners | Keep aspect ratio; crops follow the frame | same | shared CSS |

## 3. Design system — `frontend/design-system/`

### 3.1 Scope and rules

| Rule | Source |
|---|---|
| One coherent visual direction for storefront, ERP workspace and vendor portal; tokens and components extracted from `assets/tradex.css` are the approved-for-review direction pending **D-049**; implementation technology (styling approach, packaging, icons, font hosting) is **D-103** | BP §6.7 steps 4 & 7; 00-conventions §1.1; 01-tech-stack §4 |
| The design system holds **generic** tokens and components used by more than one app; commerce-specific composites stay app-level in `frontend/storefront/` unless also used by workspace/vendor (§3.3 column "Layer") | 02-architecture §4.5; BP §15.4 "small reusable component system" |
| Condition colours are always paired with text; status never by colour alone | BP §6.1, §6.7; MK `.cond` "always text + colour" |
| Money and quantities use tabular numerals; tax basis label always adjacent to a price | BP §6.1 "Transparent purchase"; D-016 |
| Every component defines loading, empty, error, disabled and focus states and keyboard behaviour | BP §22.5; D-051 |
| Honest merchandising: no component renders fabricated ratings, scarcity, countdowns or discounts; ratings only with real data | BP §6.1, §6.4; BR-M04-18 |
| Not product components: prototype toolbar (`.protobar`), annotation pins (`data-anno`), hub page styles | 00-conventions §1.1 |

### 3.2 Design tokens (from `assets/tradex.css :root`; values pending D-049)

| Group | Tokens | Used for |
|---|---|---|
| Ink / neutrals | `--ink-950…600`, `--tx-1…4`, `--line`, `--line-2`, `--bg`, `--bg-2`, `--surface` | Text, borders, surfaces |
| Brand | `--brand`, `--brand-600/700/800`, `--brand-50/100/200`, `--accent`, `--accent-600`, `--accent-50`, `--vendor`, `--vendor-50` | Primary actions, accent CTAs, dealer/vendor accent (dealer price tag uses vendor teal in MK) |
| Semantic | `--ok/--warn/--bad/--info` with `-tx` and `-50` variants | Status, callouts, validation |
| Product condition | `--c-new`, `--c-openbox`, `--c-refurb`, `--c-used` | Condition badges (with text) |
| Chart roles | `--series-1…3`, `--st-good/warning/serious/critical`, `--grid`, `--axis` | ERP/vendor charts (not used on storefront) |
| Shape & depth | `--r-xs`, `--r-sm`, `--r`, `--r-lg`, `--r-xl`, `--sh-1…3` | Radius, shadows |
| Focus | `--ring` | Visible focus (D-051) |
| Type & layout | `--font` (Inter, SIL OFL, self-hosted in MK — D-049/D-103), `--container` | Typography, max width |

### 3.3 Component inventory

Layer: **DS** = `frontend/design-system/` (shared); **App** = `frontend/storefront/` (commerce composite);
**DS+App** = presentational part in DS, data binding in the app.

| # | Component | Layer | Used on pages | Source in mockup | Notes / decisions |
|---|---|---|---|---|---|
| 1 | Icon set (stroke SVG) | DS | All | `tradex.js` `I` map | D-103; icon-only buttons need names |
| 2 | Button (primary, accent, soft, ghost, dark, danger, ok, WhatsApp; xs/sm/lg; block; icon; group) | DS | All | `tradex.css` Buttons | Busy/disabled state for mutations |
| 3 | Link button | DS | All | `.link-btn` | — |
| 4 | Segmented control | DS | P-S02 layout, P-S07 address type, P-S09 order filter, P-S10, P-S11, P-S12 | `.seg` | Prototype state switchers use the same style but are not built |
| 5 | Badge (neutral, ok, warn, bad, info, brand, accent, dark, vendor, outline, dot, square) | DS | All | `.badge` | — |
| 6 | Condition badge (new, open box, refurbished, used; filled/outline) | DS | All product displays | `.cond`, `TX.condBadge` | Labels from E-condition_grade; rubric D-023 |
| 7 | Status pill | DS | P-S01, P-S08, P-S09, P-S10, P-S11, P-S13 | `.status` | Text + dot |
| 8 | Chip (filter, toggle, removable) | DS | P-S02, P-S04, P-S05, P-S12, P-S13, shell | `.chip` | — |
| 9 | Card, panel, section head | DS | All | `.card`, `.panel`, `.section-head` | — |
| 10 | Callout (info, ok, warn, bad, brand) | DS | All | `.callout` | Used for every documented state banner |
| 11 | Form field (label, required marker, hint, error, ok) + form grid | DS | P-S07, P-S09, P-S10, P-S11, P-S12, P-S13, P-S02 | `.field`, `.req`, `.form-grid`, `is-error`, `is-ok` | Error summary pattern added (BP §6.7) |
| 12 | Input, select, textarea, input group (addon "+91", "₹"), input with icon | DS | Same | `.input`, `.select`, `.textarea`, `.input-group`, `.input-icon` | — |
| 13 | Checkbox/radio (`.check`), option card (`.opt`), switch | DS | P-S07, P-S09, P-S10, P-S12 | `.check`, `.opt`, `.switch` | — |
| 14 | Quantity stepper | DS | P-S03, P-S06, P-S11 | `.qty` | min/max from API; labelled buttons |
| 15 | OTP code input (6 boxes, auto-advance, paste) | DS | P-S12, P-S07, P-S08, P-S09, P-S10 (also vendor terms OTP) | `#otp` | Length per D-040 |
| 16 | Dropzone / file tile (uploaded, error, remove) | DS | P-S10, P-S11 (1B), P-S12, P-S13 | `.dropzone`, `.photo` | Limits D-112/D-113 |
| 17 | Dual range slider | DS | P-S02 | `.range2` | Labelled min/max |
| 18 | Tabs (+count badge) and tab panels, deep-linkable | DS | P-S03, P-S09, P-S10, P-S11, P-S12 | `.tabs`, `.tab-panel` | Deep-link form D-163 |
| 19 | Table (wrap, compact, toolbar, row actions, cell main/sub), pager | DS | P-S02 pager, P-S04, P-S05, P-S09, P-S11, P-S13 | `.table`, `.table-toolbar`, `.pager` | Page size per D-080 |
| 20 | Key-value list | DS | P-S01, P-S03, P-S04, P-S09, P-S10, P-S12, P-S13 | `.kv` | — |
| 21 | Spec table (grouped rows, "Not specified" marker) | DS | P-S03 | `.spec-table` | Missing values marked, never guessed |
| 22 | Meter (ok, warn, bad, thin) | DS | P-S03, P-S04, P-S09 | `.meter` | Always with numeric text |
| 23 | Stepper | DS | P-S07, P-S10, P-S11, P-S12 | `.stepper` | Current step announced |
| 24 | Timeline | DS | P-S04, P-S09 drawer | `.timeline` | — |
| 25 | Avatar / initials | DS | P-S03 reviews, P-S09, P-S11, P-S13 | `.avatar` | — |
| 26 | Stars & rating pill | DS | P-S02, P-S03, P-S05 | `.stars`, `.rating-pill` | Only with real data (D-041) |
| 27 | Empty state | DS | All | `.empty` | — |
| 28 | Skeleton | DS | All | `.skel` | — |
| 29 | Modal | DS | Shell, P-S03, P-S07, P-S08, P-S09, P-S11, P-S12 | `.modal` | Focus trap, Esc |
| 30 | Drawer | DS | P-S09 | `.drawer` | — |
| 31 | Toast | DS | All | `.toast` | Live region |
| 32 | Dropdown menu | DS | Shell | `.dd` | — |
| 33 | Tooltip | DS | P-S03 spec missing, P-S05 | `data-tip` | Also keyboard-accessible |
| 34 | Breadcrumbs | DS | P-S02…P-S13 | `.crumbs` | — |
| 35 | Accordion (details/summary) | DS | P-S04, P-S11, P-S13 | `<details>` | — |
| 36 | Product photo frame (lazy, alt, aspect) | DS | All | `.ph`, `TX.ph` | Variants D-113, CDN D-033 |
| 37 | Store shell layout (top strip, header, search + suggest panel, category bar, mega menu, footer) | DS+App | All P-S | `.s-topstrip`, `.s-header`, `.s-search`, `.s-suggest`, `.s-catbar`, `.s-mega`, `.s-footer` | §2 |
| 38 | Help widget & chat box (bot/me/system messages, quick replies) | DS+App | All P-S | `.helpfab`, `.chatbox`, `.msg`, `.quick` | §2.2 |
| 39 | Compare tray | DS+App | All P-S | `.compare-tray` | D-042 |
| 40 | Hero, promo tile, trust strip, category tile, brand row, deal timer | App | P-S01, P-S04, P-S11 | `.hero`, `.promo`, `.trust-strip`, `.cat-tile`, `.brand-row`, `.deal-timer` | Content D-142; timer only for real end times (D-043) |
| 41 | Price block (consumer: price, reference price, % off, tax basis; dealer: dealer tag, ex-GST price, tier line; sizes md/lg; quote-lock line) | App | P-S01–P-S07, P-S11 | `.price`, `TX.priceHTML` | D-016, D-166; values from API only |
| 42 | Stock / availability message (in stock, low, partner stock, out; as-of) | App | P-S02, P-S03, P-S04, P-S05, P-S06, P-S11 | `TX.stockHTML` | BP §9.7; "Only N left" only from real ATP |
| 43 | Product card (flags, wishlist, image, brand, title, key specs, rating, price, stock/delivery/warranty meta, compare checkbox, Add; list and out-of-stock variants) | App | P-S01, P-S02, P-S03, P-S04, P-S05, P-S06, P-S09 | `.pcard`, `TX.cardHTML` | BP §6.4 card content |
| 44 | Product grid (4/5 columns, list layout) | App | Same | `.pgrid` | — |
| 45 | Filter sidebar (groups, counts, more/less, zero-count disabled, notes), active-filter chips, sort select, quick chips | App | P-S02 (P-S04 simplified) | `#fbox`, `.fgroup`, `.active-chips` | Filters from category schema (BP §6.4) |
| 46 | Search head (correction notice, synonyms, did-you-mean), exact-SKU card, no-results panel | App | P-S02 | `.srch-head`, `.exact`, `.noresults` | BP §6.4 |
| 47 | Gallery (thumbnails, main, unit-photo caption) | App | P-S03, P-S04 | `.gal`, `#u-thumbs` | Actual unit photos (BP §6.6) |
| 48 | Grade box (condition + plain-language meaning) | App | P-S03 | `.grade-box` | D-023 |
| 49 | Offer selector (other offers for model) | App | P-S03 | `.offers` | Each offer a separate stock position |
| 50 | Dealer tier table + "your price at N" calculator | App | P-S03, P-S11 | `.tier-table`, `#tier-now` | D-018 |
| 51 | Buy box (price, stock, delivery, PIN check, quantity, add/buy, WhatsApp, seller line, returns line, branch availability) | App | P-S03 | `.buybox` | — |
| 52 | Delivery / PIN checker result lines | App | P-S03, P-S06, P-S07, P-S09, P-S13, shell | `#pin-res` | API-M12-01 |
| 53 | Inspection report summary & full checklist | App | P-S03, P-S04 | `inspectionHTML`, `.chk-row`, `.defect` | D-023; API-M06-02 |
| 54 | Policy card (warranty / returns / authenticity) | App | P-S03 | `.pol-card` | Policy versions shown |
| 55 | Frequently-bought-together selector | App | P-S03 | `.fbt` | D-072 / D-164 |
| 56 | Compatibility row (verified / check before buying) | App | P-S03, P-S06 | `.acc-row` | D-071 |
| 57 | Q&A item, review item, rating distribution | App | P-S03 | `.qa`, `.review`, `.dist` | D-065, D-041 |
| 58 | Compare table (highlight differences, hide identical rows, add slot) | App | P-S05 | `#cmp`, `.add-slot` | D-042 |
| 59 | Cart line with notices (price change, shortage, partner shipment, tier explanation) | App | P-S06 | `.line`, `.note` | BP §6.3 Cart states |
| 60 | Saved-for-later list | App | P-S06 | `.saved-row` | MOCKUP-ONLY (D-129) |
| 61 | Order summary (consumer and dealer variants, GST split) | App | P-S06, P-S07, P-S08 | `.sum-rows` | Values from quote/order |
| 62 | Coupon field / applied chip | App | P-S06 | `.coupon-chip` | D-043 |
| 63 | Shipment split preview | App | P-S06, P-S07 | `.ship`, `.ship-box` | D-029 |
| 64 | Checkout step section (numbered, summary line, Change) | App | P-S07 | `#s-address`… | — |
| 65 | Payment method tabs & panels | App | P-S07 | `#pay-tabs`, `.pay-panel` | D-012, D-020, D-062 |
| 66 | Reservation timer | App | P-S07, P-S08 | `#timer` | D-026, D-161 |
| 67 | Order state group (order / payment / fulfilment / returns) | App | P-S08, P-S09 | `.machines`, `.o-states` | BP §10.1; labels D-165 |
| 68 | Shipment tracker (steps with times) | App | P-S08 | `.track` | Canonical states BP §10.5 |
| 69 | Order line with serials and line actions | App | P-S08 | `.oline` | Masked serials |
| 70 | Order card (account list) | App | P-S09 | `.ocard` | — |
| 71 | RMA progress bar + request card | App | P-S09, P-S10 | `.rma-steps`, `.req-card`, `.rbar` | BP §10.1 RMA states |
| 72 | Wizard (step panels + summary aside), request-type card, method card | App | P-S10 | `.step-panel`, `.tcard` | — |
| 73 | Address card and address form | App | P-S07, P-S09 | `.opt` address, `m-address` | API-M08-05…08 |
| 74 | Consent table row, session table row | App | P-S09 | Privacy/Profile tables | BR-M08-06 |
| 75 | Store card (address, hours, open status, capability badges) | App | P-S01, P-S13 | Store cards | API-M03-01; D-061 |
| 76 | Help channel card with hours state | App | P-S13 | `#contact` | D-074 |
| 77 | Application status card (+ stepper), GSTIN verification card | App | P-S11, P-S12 | `.status-card`, `.verify-card` | D-067 |
| 78 | Quick-order parser preview table | App | P-S11 | `#qo-rows` | D-121 |
| 79 | Member / role table and role-permission table | App | P-S11 | Team tab | D-066 |
| 80 | Charts | DS | Not used on storefront | `TX.charts` (prototype code) | D-103 |

### 3.4 Content rules for commerce components

| Rule | Where | Source |
|---|---|---|
| Price always shows its tax basis ("incl. GST" / "+ GST") from the API `tax_basis` | Price block, cart, checkout, compare | D-016; BP §6.4 |
| Reference price (MRP) and "% off" only from an approved reference-price source | Price block, cart, checkout, deals | BP §6.1 "no fake discounts"; D-166 |
| Warranty text always names the provider (manufacturer vs seller) | Card meta, buy box, policy card, cart line, compare | BP §6.1, §6.6; BR-M04-14 |
| Condition always with its plain-language meaning available ("How we grade") | Grade box, cards (tooltip/list layout) | BP §6.1, §6.6 |
| Scarcity text ("Only N left") only from real ATP; countdowns only for real promotion/reservation end times; no "people waiting"-type social proof unless decided | Cards, buy box, deal timer, listing | BP §6.1; D-043, D-141 |
| Supplier/partner identity and internal references shown to customers only as decided | Buy box, cart, order, inspection report | D-165; BP §11.2 |

---

## 4. Page specifications

### 4.1 P-S01 — Home

| Field | Value |
|---|---|
| Mockup | `store-home.html` |
| Purpose | Search-first entry, category access, curated collections and trust information; signed-in dealer shortcuts (BP §6.3 Home; PR2 §3 "Home / discovery") |
| Route | NOT SPECIFIED — D-163 (no query parameters) |
| Evidence | DOCUMENTED (BP §6.3, BR-M09-02) · MOCKUP (sections) |
| Modules | M09, M04, M05, M21, M03 |
| Phase · requirements | 1A · R01, R03, R04, R07, R08, R11, R14, R19 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Hero campaign | Campaign headline + copy, CTA "Shop refurbished laptops" (→ P-S04), "How we grade" (→ P-S13#grades), hero stats | MOCKUP · content D-142; stated warranty/returns/EMI/inspection values are samples (D-022, D-023, D-062) |
| 2 | Side promos | Curated collection promo (→ P-S02 category); "Dealer pricing & bulk tiers" promo (hidden for dealers → P-S11); dealer-only "Quick order by SKU" promo (→ P-S11#bulk) | MOCKUP · D-142; quick order D-121 |
| 3 | Trust strip | Condition grades/inspection report, warranty provider, returns, secure payments, dispatch | DOCUMENTED BP §6.3 "trust information" · values D-022, D-023, D-012, D-162 |
| 4 | Dealer: Reorder your usual items | Dealer-only rail: items from recent orders with last-ordered date/quantity, dealer price (ex-GST), quick-add button (mockup "Add 10") | MOCKUP; BP §3.1 dealer "repeat orders" · private |
| 5 | Dealer: Your business account | Price list name + validity, payment terms (prepaid), GSTIN verified state, open orders; privacy callout; "Go to dealer zone" | MOCKUP; BP §8.3 · private |
| 6 | Shop by category | Category tiles (image, name, product count) + "View all categories" | DOCUMENTED BP §6.2; R07 |
| 7 | Deals of the day | Product rail with "Ends in" countdown, "See all deals" (→ P-S02 deals mode) | CONDITIONAL D-043 · content D-142 · countdown only for a real promotion end (BP §6.1) |
| 8 | Certified refurbished | Grade meanings (open box, A, B, used), "Full grading standard" link, refurbished rail, "Explore refurbished" | DOCUMENTED BP §6.6; R19 · rubric D-023 |
| 9 | Build or upgrade your PC | Category landing tiles + components rail | MOCKUP · D-142 |
| 10 | Dealer application CTA | "Buying for a shop or company?" — Apply (→ P-S12#dealer), Learn more (→ P-S11); hidden for dealers | DOCUMENTED BP §8.3 |
| 11 | Cameras & lenses | Promo tile + rail | MOCKUP · D-142; EMI copy D-062 |
| 12 | Continue shopping | Signed-in only: recently viewed / related to searches | MOCKUP-ONLY D-164 |
| 13 | WhatsApp ordering explainer | 3 steps (share need → we confirm live price → pay via secure checkout link) + "Chat on WhatsApp" | DOCUMENTED BP §13.1–13.2, §29.5 (Level 1 at 1A, guided Level 2 1B) · D-014, D-048 |
| 14 | Top brands | Brand chips → P-S02 brand mode | MOCKUP |
| 15 | Visit a Tradex store | Store cards: name, hours, open/closing status, capability note; "pick up in store (where enabled)" | MOCKUP; BP §9.5 · D-061; stock counts on cards are samples |

**Components.** Hero/promo tile (40), trust strip (40), product card & grid (43–44), category tile (40), deal timer
(40), condition badge (6), key-value list (20), callout (10), brand row (40), store card (75), price block (41).

**Forms & fields.** None on the page (search is in the shell).

**Actions**

| Action | API | Result |
|---|---|---|
| Load home modules | API-M09-01 (+ API-M04-01 categories, API-M21-01 rails) | Collections, deals, tiles, brands; dealer modules when verified member |
| Product card "Add" / dealer quick-add | API-M10-02 | Line added; cart count updates; capped-quantity notice on `STOCK_UNAVAILABLE` |
| Wishlist heart | API-M08-17 | Saved (signed-in; guest → sign-in prompt) — D-042 |
| Compare checkbox | — (client) | Compare tray updates (max per D-042) |
| Load dealer business summary | API-M08-24 | Account summary block |
| Load stores | API-M03-01 | Store cards |
| Chat on WhatsApp | — | Click-to-chat link with home reference (D-014) |

**Tables / filters / search / pagination.** None. **Modals / drawers.** Shell only (m-pin).

**Validation.** None.

**States**

| Type | Behaviour | Source |
|---|---|---|
| Loading | Search, category tiles and trust strip server-rendered; rails and dealer blocks load with skeletons | BP §6.3 "Slow connection" |
| Empty | "No promotions" → deals section hidden (BP §6.3); empty collection → section hidden; dealer with no history → reorder rail hidden; no customer-facing stores → section hidden | BP §6.3 |
| Error | API-M09-01 failure → page still shows search, categories, trust strip and help; failing rails are hidden | BP §6.3 |
| Signed-in dealer | Dealer promos, reorder rail, business summary; dealer application CTA hidden; prices ex-GST with dealer tag | BP §6.3 "signed-in dealer" |

**Permissions**

| Role | Sees |
|---|---|
| R-guest | Public prices; dealer promo and application CTA |
| R-consumer | Public prices; continue-shopping rail (if D-164) |
| R-dealer (active member) | Dealer prices/tier hints, reorder rail, business account summary (visibility per D-066); no dealer application CTA |
| Suspended / expired dealer | Public prices + suspension notice link to P-S11 |

**API dependencies.** API-M09-01, API-M04-01, API-M21-01, API-M08-24, API-M10-02, API-M08-17, API-M03-01, API-M02-01.

**Backend / database.** BR-M09-01…04, BR-M04-18, BR-M05-15, BR-M05-16, BR-M02-13, BR-M21-06 · E-merch_collection,
E-category, E-brand, E-product, E-offer, E-promotion, E-location, E-business_account, E-sales_order.

**Related pages.** P-S02, P-S03, P-S04, P-S11, P-S12, P-S13.

**Conditional / mockup-only.** Deals (D-043), curated content & collections (D-142), EMI copy (D-062), continue
shopping (D-164), wishlist/compare (D-042), store pickup note (D-061), quick order (D-121), WhatsApp Level 2 (D-014, D-048).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core: search/categories/trust/stores `NOT_STARTED`; curated
collections, deals, hero `REQUIRES_DECISION (D-142)`.

---

### 4.2 P-S02 — Category & search results

| Field | Value |
|---|---|
| Mockup | `store-listing.html` |
| Purpose | Browse a category or search results with category-specific filters, sort, count and pagination; product cards with condition, price (tax basis), warranty, stock/delivery (BP §6.3, §6.4; PR2 §3) |
| Route | NOT SPECIFIED — D-163. Prototype parameters: `?cat=` (category mode), `?q=` (search mode), `?brand=` (brand mode), `?deals=1` (deals mode), `?layout=list`, `?exact=1` (no spelling correction); "Try:" demo links are prototype aids |
| Evidence | DOCUMENTED (BP §6.3, §6.4; T36) · MOCKUP |
| Modules | M21, M04, M05, M09, M27 |
| Phase · requirements | 1A · R01, R03, R04, R07, R08, R19 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Breadcrumbs | Home › category / "Search results" / "Deals" / Brands › brand | MOCKUP |
| 2 | Search head (search mode) | "Showing results for", result count, spelling-correction notice with "Search instead for {original}", synonyms matched (e.g. SSD ↔ solid state drive), "Did you mean" chips | DOCUMENTED BP §6.4 (spelling variants, abbreviations, synonyms) · D-032 |
| 3 | Title bar | Title, result count, context line ("New, open-box, refurbished & used"; deals honesty note), tax-basis badge (dealer: "Dealer prices · excl. GST"; others "Prices include GST"), "Save search & alert me" | DOCUMENTED BP §6.4 · D-016; alerts MOCKUP-ONLY D-141 |
| 4 | Popular filters | Quick filter chips per category (mockup: grade, open box, brand, RAM, storage, price ceiling, pick up today) | MOCKUP · chip set from category config (D-142) |
| 5 | Filter sidebar | Filters header with active count + Clear all; groups from the category attribute template with counts; zero-count options disabled with reason; "+N more"; collapsible; price range (dual slider + min/max; dealer: ex-GST); customer rating (4★+, 3★+, any; "only verified-purchase reviews count"); warranty provider (manufacturer / Tradex seller); availability (in stock, store pickup today, partner warehouse) with explanatory notes; "Include out-of-stock items" switch; non-category modes show a Category facet + tip "Pick a category to see its own filters" | DOCUMENTED BP §6.4 ("Filters depend on category"), §6.3 "unavailable filters"; R07; T36 · rating D-041; pickup D-061; partner stock D-073 |
| 6 | Toolbar | Active filter chips (removable) + Clear all / "No filters applied"; Sort (relevance, price ↑, price ↓, newest, customer rating, biggest discount); grid/list layout toggle | DOCUMENTED BP §6.3 "sort" · rating sort D-041; discount sort D-166 |
| 7 | Context callouts | Dealer: tier rules ("tiers apply in the cart at 5+/10+ of the same SKU; consumer coupons don't stack") + Quick order link; Guest: "Business buyer? … Sign in / Apply as dealer" | DOCUMENTED BP §6.4 "Dealer cards can show quantity tier hints without exposing private pricing to guests" · tier values D-018, stacking D-017/D-043 |
| 8 | Refurbished explainer strip | Shown when refurbished/used items are in results: count, grade meanings, seller-warranty statement, "How we grade" | DOCUMENTED BP §6.6 · D-023 |
| 9 | Exact SKU match card | When the query equals a SKU/model: product card with "View product" | DOCUMENTED BP §6.4 "exact model/SKU matches" |
| 10 | Results | Product cards (grid 4-col or list with spec badges and condition note); unavailable items sorted last with "Notify me" instead of Add; restock line | DOCUMENTED BP §6.3 "unavailable products" · Notify me D-141; restock date / "people waiting" — see gaps (§7) |
| 11 | Filtered-to-zero state | "No products match all these filters" + Clear all filters (+ note when out-of-stock items are hidden) | DOCUMENTED BP §6.3 |
| 12 | Pager | "Showing x–y of N", page buttons with ellipsis, previous/next, per-page select (mockup 12/24/48) | DOCUMENTED BP §6.3 "pagination" · page sizes D-080 |
| 13 | Recently viewed | "Stored on this device only · prices and stock are live" + Clear history | MOCKUP-ONLY D-164 |
| 14 | No-results page (search mode, zero hits) | Heading with the query; what was searched; tips list; category chips; popular searches; sourcing panel "Can't find it? We can source it." (model/part number, mobile, "Request this product", "Ask on WhatsApp"); "Popular right now" rail | DOCUMENTED BP §6.3 "No results"; BP §4 zero-result measure · sourcing request MOCKUP-ONLY D-141; popular rail D-142/D-164 |

**Components.** Filter sidebar & chips (45), search head/exact/no-results (46), product card & grid (43–44), price
block (41), stock message (42), dual range slider (17), pager (19), callout (10), empty (27), skeleton (28).

**Forms & fields**

| Field | Type | Required | Validation (source) |
|---|---|---|---|
| Attribute filters | Checkbox set per attribute | No | Values only from the category schema (BP §6.4; BR-M04-04) |
| Price min / max | Number inputs + dual slider | No | Integers ≥ 0, min ≤ max (swap if reversed — MK); bounds from facet data |
| Rating | Radio (4+, 3+, any) | No | D-041 |
| Include out-of-stock | Switch | No | — |
| Sort | Select | No | Allowed values from API-M21-01 |
| Per page | Select | No | D-080 |
| Sourcing: model or part number | Text | Yes (MK prefilled with query) | Non-empty (D-141) |
| Sourcing: mobile | Tel with +91 addon | Yes | 10 digits (D-059 locale); consent to be contacted per D-058 |

**Actions**

| Action | API | Result |
|---|---|---|
| Load results / change filter, sort, page | API-M21-01 (`q`, `category_id`, `filters[]`, `condition[]`, `brand[]`, price, `in_stock_only`, `sort`, `page`, `page_size`) | Items, facets with counts, total, spelling/synonym info, zero-result suggestions |
| Load category schema & facets labels | API-M04-01 | Filterable attributes |
| Add to cart (card) | API-M10-02 | Added / capped notice |
| Wishlist heart | API-M08-17 | Saved (D-042) |
| Compare checkbox | — (client) | Tray updates (D-042) |
| Notify me (unavailable item) / Save search & alert me | API-M20-07 (`back_in_stock` / `saved_search`) | Subscription created (D-141; consent) |
| Request this product | API-M16-11 (`sourcing_request`) | Ticket reference shown (D-141, D-074) |
| "Search instead for {original}" | API-M21-01 without correction — flag missing (§7 gap G-02) | Uncorrected results |
| Did-you-mean / popular chips | API-M21-01 | New search |
| Exact match "View product" | — | → P-S03 |
| Clear recently viewed | — (client) | History cleared (D-164) |

**Tables / filters / search / pagination.** Filters, facets and counts from API-M21-01 (intersected with context);
sort values as above; page-based pagination (cursor vs page per D-080); URL reflects mode, filters, sort and page per
D-163 so views are shareable and crawl rules can be applied (BP §6.8).

**Modals / drawers.** None (shell only).

**Validation.** Client checks above; the server ignores filters not in the category schema (BR-M21-04).

**States**

| Type | Behaviour | Source |
|---|---|---|
| Loading | First page server-rendered (category & search); filter changes keep sidebar and show card skeletons; count updates after response | BP §6.3; D-105 |
| Empty | No results (search) → no-results page; filtered to zero → reset state; unavailable filter options → disabled with count 0 | BP §6.3 |
| Error | Search failure → error panel with retry, category chips and help link; facet failure → results without sidebar counts | BP §22.5 |
| Unavailable products | Marked out of stock, sorted last, "Notify me"; hidden when the switch is off | BP §6.3 |
| Stale data | Stock message carries `as_of`; checkout revalidates | BP §16.5 |

**Permissions**

| Role | Sees |
|---|---|
| R-guest / R-consumer | Public price incl. tax basis per D-016; guest sees dealer sign-in callout |
| R-dealer | Private dealer price ex-GST + tier hint; dealer callout; responses `private` and noindex (BP §6.8) |

**API dependencies.** API-M21-01, API-M04-01, API-M10-02, API-M08-17, API-M20-07, API-M16-11, API-M04-03 (tier
hints if not in search projection), API-M02-01.

**Backend / database.** BR-M21-01…06, BR-M04-01, BR-M04-04, BR-M04-18, BR-M06-14, BR-M06-18, BR-M05-15,
BR-M27-01, BR-M27-02 · E-product, E-sku, E-sku_attribute_value, E-offer, E-category, E-category_attribute,
E-attribute_definition, E-stock_position (projection), E-search_synonym, E-condition_grade, E-warranty_policy,
E-alert_subscription.

**Related pages.** P-S01, P-S03, P-S04, P-S05, P-S11 (quick order), P-S12.

**Conditional / mockup-only.** Rating filter/sort (D-041), wishlist/compare (D-042), alerts & sourcing (D-141),
pickup availability filter (D-061), partner stock (D-073), deals mode (D-043/D-142), biggest-discount sort (D-166),
recently viewed (D-164).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `NOT_STARTED` (search engine D-032 is PROPOSED-DEFAULT:
native/database search first).

---

### 4.3 P-S03 — Product detail (incl. unit inspection report)

| Field | Value |
|---|---|
| Mockup | `store-product.html` |
| Purpose | Images, model, condition, specifications, context price, warranty provider, delivery estimate, returns, availability; for unique refurbished/used/open-box units the inspection report of the exact unit (BP §6.3 Product detail, §6.6; PR2 §3; T01) |
| Route | NOT SPECIFIED — D-163. Prototype parameters: `?id=` (product), `?state=normal·oos·price·confirm` (state switcher), `#specs`, `#inspection`, `#reviews`, `#qa`, `#m-ask` |
| Evidence | DOCUMENTED (BP §6.3, §6.6, §7.2; T01, T02) · MOCKUP |
| Modules | M04, M05, M06, M12, M09, M16, M27 |
| Phase · requirements | 1A · R01, R03, R04, R07, R08, R11, R14, R19 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Not-found state | Unknown/archived product: "We couldn't find that product", browse/search buttons, popular rail; archived URLs redirect via API-M27-01 | DOCUMENTED T32; BR-M27-03, BR-M27-04 |
| 2 | Breadcrumbs | Home › category › brand › title | MOCKUP |
| 3 | State banners | (a) Variant unavailable — selected variant out of stock, closest available variant shown, restock info, Notify me; (b) Price changed since last visit — old/new price disclosed, re-checked at checkout; (c) Supplier confirmation needed — partner-held stock, feed age, confirmation window, automatic refund if not confirmed | DOCUMENTED BP §6.3 Product detail states; §8.1 step 8; §9.7 · D-073, D-028, D-141; "since last visit" needs viewed-price history (§7 gap G-05) |
| 4 | Gallery | Thumbnails, main image, condition badge, promo badge; caption "Actual photos of unit {unit} · {date}" for unit-specific offers; Wishlist, Compare, Share (copy link) | DOCUMENTED BP §6.6 "link actual photographs" · D-042 |
| 5 | Product info | "Visit the {brand} store" link; title; rating + "N verified ratings" (→ reviews tab); "N answered questions" (→ Q&A); identifiers (SKU, model, unit ID) | DOCUMENTED BP §7.2 · ratings D-041 (only real data, BP §6.4); Q&A D-065 |
| 6 | Grade box | Condition badge + plain-language meaning + "How we grade" | DOCUMENTED BP §6.1, §6.6 · D-023 |
| 7 | Price | Context price block (consumer incl. tax; dealer ex-tax with dealer tag); EMI teaser (not for dealers) | DOCUMENTED BP §6.3; D-016 · EMI MOCKUP-ONLY D-062 |
| 8 | Dealer tier table | Only for dealers: quantity bands, unit ex-GST, incl. GST, saving per unit; validity date; all-units note; "Your price at N units" calculator with next-tier hint | DOCUMENTED BP §8.1–8.2; T03 · D-018 |
| 9 | Guest dealer callout | "Business buyer? Sign in for dealer pricing" | DOCUMENTED BP §6.4 |
| 10 | Other offers for this model | Offer buttons per condition/configuration with price and availability ("Selected", "In stock", "Few left", "Out of stock · notify me"); each offer a separate stock position | DOCUMENTED BP §7.1 (offer), §6.1 condition clarity · Notify me D-141 |
| 11 | About this item | Key specification bullets incl. warranty provider; "See all specifications" | DOCUMENTED BP §6.3 |
| 12 | Bank / UPI offer cards | Bank card discount, UPI code offer (hidden for dealers) | MOCKUP-ONLY D-062 |
| 13 | Buy box | Context price (dealer tier progress); stock message (+ unit location for unit offers); partner-stock callout; delivery date to PIN (+ free delivery wording) and dispatch cut-off; PIN check form with result (serviceable, city, date, express, charge, COD eligibility with reasons); quantity stepper with availability note; Add to cart; Buy now; "Ask about this product" (WhatsApp modal); secure-checkout note; sold-by / ships-from line; returns line; Availability by store (per branch: count/"not in stock", pickup time, "transfer on request", updated time) | DOCUMENTED BP §6.1 "Transparent purchase", §6.5 (serviceability before payment), §9.1 (projection) · D-013, D-020 (COD), D-162 (charges/cut-off), D-073 (partner), D-008 (seller of record), D-165 (partner name), D-029/D-061 (branch availability, pickup) |
| 14 | Inspection report card | Only for refurbished/used/open-box units: unit ID, masked serial, grade, inspection date & inspector, source, report version/standard; battery health meter + grade threshold or shutter count; checklist summary per group (passed / advisory / failed); known defects with photo references; included in the box; OS/licence status; data-wipe method + certificate link; "All N checks" (→ tab), "Report PDF" | DOCUMENTED BP §6.6, §7.2, §7.5; T01; BR-M06-22 · rubric/checklist D-023; inspector identity D-165 |
| 15 | Policy row | Warranty card (period, provider, covers, how to claim, policy version, "not a manufacturer warranty" warning for seller warranty); Returns card (window, rules, serial check, exclusions, policy version, full policy link); Authenticity & invoice card (sourced from, invoice/GSTIN, add GSTIN at checkout) | DOCUMENTED BP §6.1, §6.6, §7.5 ("Warranty durations and return windows are separate"), §19.2 · D-022, D-037; source disclosure D-165 |
| 16 | Frequently bought together | Selectable items (this item fixed) with condition, price, warranty; total; "Add N to cart"; "each keeps its own stock, warranty and return policy" | CONDITIONAL D-072 (bundles) / D-164 (suggestion source) |
| 17 | Tabs | **Specifications** (grouped by category template; missing values "Not specified by manufacturer"; side panels "Specifications by category", "Spotted an error? Report a spec issue") · **Description** · **Inspection report** (full checklist or "Not applicable for new sealed items"; Download PDF) · **Warranty & returns** (tables + "Start a return or warranty claim") · **Q&A** (search, Ask a question, answers with specialist attribution, Helpful, See all) · **Reviews** (average, distribution, verified-only note, Write a review, filter chips All/5★/Critical/With photos/condition, sort, review cards with verified badge and Tradex response, Helpful, Report) | DOCUMENTED BP §6.3, §7.2; BR-M04-04 · spec report D-141; Q&A D-065; reviews D-041 |
| 18 | Compatible accessories & upgrades | Curated rows: product, "Verified compatible" / "Check before buying" with note, price, Add; model note (e.g. soldered memory) | CONDITIONAL BP §7.5, A32 (P1/C) · D-071 |
| 19 | Similar products | Same category, closest price; "Open compare" | MOCKUP-ONLY D-164 |

**Components.** Gallery (47), grade box (48), price block (41), tier table (50), offer selector (49), buy box (51),
PIN checker (52), quantity stepper (14), inspection report (53), policy cards (54), FBT (55), tabs (18), spec table
(21), Q&A/review items (57), compatibility row (56), product card (43), modal (29), callout (10), meter (22).

**Forms & fields**

| Field | Type | Required | Validation (source) |
|---|---|---|---|
| PIN code (buy box) | Numeric text, 6 chars | Yes to check | `^[1-9]\d{5}$` (MK); serviceability from API-M12-01 (BP §6.5) |
| Quantity | Integer stepper | Yes | ≥ 1; capped at available with message (MK "Only N available right now"); unit-specific offers allocate one unit per quantity (D-031) |
| FBT item selection | Checkboxes | No | Main item fixed |
| Q&A search | Text | No | D-065 |
| Ask a question (`m-ask`) | Textarea + "Notify me by email when answered" checkbox | Question yes | Non-empty, length limit (API-M04-12); guidance "don't include phone numbers or order details" — D-065 |
| WhatsApp message (`m-wa`) | Pre-filled text: title, SKU, condition, unit, price seen, link | — | Price seen is informational only (BP §13.2) |

**Actions**

| Action | API | Result |
|---|---|---|
| Load product | API-M04-02 | Product, variants, specs, condition, warranty/returns refs, SEO canonical; 404 → not-found state |
| Load offers (context price, tiers, availability, delivery for PIN) | API-M04-03 (`sku_id`, `quantity`, `pin`) | Offers list; `private, no-store` for dealers (T22) |
| Check PIN | API-M12-01 | Serviceable, options, ETA, charge ref, COD eligibility |
| Change quantity (dealer) | API-M04-03 (`quantity`) | Tier applied / next tier hint (T03) |
| Add to cart | API-M10-02 | Added; `STOCK_UNAVAILABLE` → capped quantity message |
| Buy now | API-M10-02 → navigate to P-S07 | Checkout with the item |
| Add FBT items | API-M10-02 (multiple items) | Items added; separate shipments note |
| Wishlist / Compare / Share | API-M08-17 / client / clipboard | Saved / tray / link copied |
| Notify me (out-of-stock offer, variant banner) | API-M20-07 | Alert subscription (D-141) |
| Load store availability | API-M06-01 | Branch rows (D-029, D-061) |
| Load/download unit report, erasure certificate | API-M06-02 (`format=json·pdf`, `document=inspection·erasure_certificate`) | Report data / PDF |
| Load policies | API-M04-04 | Warranty/return/grade text with versions |
| Report a spec issue | API-M04-14 | Report reference (D-141) |
| Q&A list / ask | API-M04-11 / API-M04-12 | List / "appears after review" (D-065) |
| Reviews list / write / helpful / report | API-M04-07 / API-M04-08 / API-M04-09 | List / pending moderation / recorded (D-041) |
| Compatible items | API-M04-05 | Curated list (D-071) |
| Frequently bought together | API-M04-06 (if bundles, D-072) or rail source per D-164 | Items |
| Similar products | API-M21-01 (same category) | Rail (D-164) |
| Ask on WhatsApp | — | Click-to-chat with product/unit reference (BP §13.1; D-014) |
| Start a return | — | → P-S10 |

**Tables / filters / search / pagination.** Tier table; spec table; review filter chips + sort and Q&A search with
"See all" pagination (API list params, D-080).

**Modals / drawers.** `m-wa` (Ask about this product on WhatsApp — pre-filled reference, chat hours, "chat alone
doesn't create an order; price re-confirmed before you pay"); `m-ask` (Ask a question — D-065).

**Validation.** PIN format; quantity bounds; question non-empty; server authoritative for price and stock.

**States**

| Type | Behaviour | Source |
|---|---|---|
| Loading | Title, gallery, specs server-rendered; context price/tiers/PIN estimate load as private islands with placeholders | BP §16.5 |
| Variant unavailable | Banner + closest available variant + Notify me; offer button shows "Out of stock · notify me" | BP §6.3 |
| Price changed | Informational banner; checkout re-checks | BP §6.3, §8.1 |
| Supplier confirmation needed | Banner + buy-box callout; lead time disclosed; hidden immediate-delivery promise when stale | BP §6.3, §9.7; T14; D-028 |
| Out of stock (all offers) | Add/Buy disabled; Notify me; structured data shows unavailable | BP §6.8 |
| Empty | No reviews → rating hidden (BP §6.4 "rating only when real data exists"); no Q&A → prompt; no compatible items / FBT / similar → section hidden; new sealed item → inspection tab "Not applicable" | MK; BP §6.4 |
| Error | Offer load failure → product info shown, purchase disabled with retry; PIN service unavailable → message; `NOT_SERVICEABLE` → alternatives | BP §22.5 |
| Not found / archived | Not-found state or redirect (T32) | BP §6.8 |

**Permissions**

| Role | Sees / can do |
|---|---|
| R-guest | Public price; dealer sign-in callout; can add to cart; cannot review, ask (D-065 may allow with email), wishlist (sign-in prompt) |
| R-consumer | Public price, EMI/bank offer cards if D-062, wishlist, alerts; review only as verified purchaser (D-041) |
| R-dealer | Dealer price ex-GST, tier table/calculator; no EMI/bank offers; COD shown per D-020 rules (MK: dealer orders prepaid) |

**API dependencies.** API-M04-02, -03, -04, -05, -06, -07, -08, -09, -11, -12, -14; API-M06-01, API-M06-02;
API-M08-17; API-M10-02; API-M12-01; API-M20-07; API-M21-01; API-M27-01; API-M02-01.

**Backend / database.** BR-M04-02, -13, -14, -15, -16, -17, -18, -19; BR-M05-04, -11, -15, -16, -19; BR-M06-07,
-14, -18, -20, -22; BR-M12-13; BR-M16-01, -03; BR-M27-01, -03 · E-product, E-sku, E-sku_attribute_value, E-offer,
E-media_asset, E-condition_grade, E-warranty_policy, E-return_policy, E-serial_unit, E-inspection, E-stock_position,
E-supplier_availability, E-location, E-compatibility_link, E-bundle_component, E-product_review, E-product_question,
E-alert_subscription, E-wishlist_item.

**Related pages.** P-S02, P-S04, P-S05, P-S06, P-S07, P-S10, P-S13, shell chat/WhatsApp.

**Conditional / mockup-only.** EMI & bank/UPI offers (D-062), Q&A (D-065), reviews (D-041), wishlist/compare
(D-042), alerts & spec report (D-141), compatibility (D-071), bundles/FBT (D-072, D-164), similar products (D-164),
branch availability & pickup (D-029, D-061), partner stock (D-073), COD eligibility (D-020), delivery charges/cut-off
(D-162), MRP/discount (D-166).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `NOT_STARTED`; sub-features as listed above.

---
### 4.4 P-S04 — Certified refurbished landing

| Field | Value |
|---|---|
| Mockup | `store-refurbished.html` |
| Purpose | Trust-first landing for refurbished, open-box and used goods: process, grade comparison, unit-level evidence, shop grid with condition filters (BP §6.6; R19) |
| Route | NOT SPECIFIED — D-163. Prototype: `?cat=` (pre-select category chip), `?view=`, anchors `#shop`, `#grades`, `#process`, `#unit` |
| Evidence | DOCUMENTED (BP §6.1, §6.6, §7.2) · MOCKUP |
| Modules | M09, M04, M06, M21 |
| Phase · requirements | 1A · R01, R08, R19 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Breadcrumbs | Home › Certified refurbished | MOCKUP |
| 2 | Hero | Headline, copy, "Shop refurbished" (→ #shop), "Compare grades" (→ #grades), stats (inspection, data wipe, warranty, returns) | MOCKUP · values D-023, D-022; content D-142 |
| 3 | Trust strip | Inspection of every unit, secure data wipe with certificate, real unit photos, seller warranty, returns | DOCUMENTED BP §6.6, §7.5 · values samples |
| 4 | How refurbishment works | Six steps: source (ownership proof, serial check), inspection, secure data wipe, grading (second check for high value), unit photography, warranty registered to serial; callout on units never listed | DOCUMENTED BP §6.6, §7.2 (refurbished/serial fields), §7.5 (data erasure) · rubric D-023; statistics in copy must be measured (BP §6.1) |
| 5 | Which grade is right for you? | Comparison table: looks, screen, battery health, functional check, box & accessories, warranty, returns, typical saving vs new; "Full grading standard" link | DOCUMENTED BP §6.6 ("cosmetic condition, functional checks, battery expectations, included accessories, and warranty") · D-023, D-022; "typical saving" needs a source (D-166) |
| 6 | Every unit is unique | Unit showcase: unit photo gallery with defect close-ups and captions; unit history timeline (received, inspected, data wiped, graded, listed) with masked serial; unit title, price, stock count of graded units, delivery date; inspection summary (checks passed, battery health, SSD health, findings, noted marks with photo refs); key-values (in the box, software/licence, data wipe certificate, inspected by, warranty policy); "Add this unit to cart", "Full listing", wishlist; "Other units of this model" (unit id, grade, battery, marks, price); no-silent-swap notice | DOCUMENTED BP §6.6 ("link actual photographs and inspection results to the serialised unit"), §9.4 (reserve specific serial), §10.4 ("Flag substitution rather than silently sending") · D-031; history timeline API gap G-06; staff identity D-165 |
| 7 | Shop refurbished, open-box & used | Count + tax basis; sort (recommended, price ↑/↓, biggest saving); category chips; condition chips (grade A, grade B, open box, used); "In stock only (hide partner stock)"; product grid; empty state ("No units match…" + Clear filters + Alert me); "Show all" | DOCUMENTED BP §6.4 · alert D-141; partner stock D-073; saving sort D-166 |
| 8 | Promise blocks | Seller warranty, returns, "what you see is what you get" | DOCUMENTED BP §6.6 · values D-022 |
| 9 | Refurbished FAQ | Accordion of approved answers + "More answers" (→ P-S13#faq) | DOCUMENTED BP §13.4 (versioned approved content) |
| 10 | Longer device life | Honest sustainability copy (no unmeasured claims) | DOCUMENTED BP §6.1 "Honest merchandising" · content D-142; recycling rules D-037 |
| 11 | Final CTA | "Shop refurbished laptops" (pre-selects laptops), "How we grade" | MOCKUP |

**Components.** Hero/trust strip (40), timeline (24), gallery (47), inspection summary (53), meter (22), key-value
(20), table (19), chips (8), product card/grid (43–44), accordion (35), empty (27).

**Forms & fields.** Sort select; category chip (single); condition chips (multi); in-stock-only checkbox — no free
text. Validation: allowed values only.

**Actions**

| Action | API | Result |
|---|---|---|
| Load curated sections / showcase unit | API-M09-01 (curated) + API-M04-03 (unit offers with `unit_ref`) + API-M06-02 (unit report) | Showcase and other units |
| Load grade rubric & policies | API-M04-04 (`grade_rubric`, `warranty`, `returns`) | Versioned rubric text |
| Shop grid filter/sort/show all | API-M21-01 (`condition[]` ≠ new, `category_id`, `in_stock_only`, sort, page) | Items |
| Add this unit to cart | API-M10-02 (`offer_id` of the unit offer) | Added; unit reserved only at checkout (D-161) |
| Wishlist | API-M08-17 | Saved (D-042) |
| Alert me (empty grid) | API-M20-07 (`refurb_match`) | Subscription (D-141) |
| FAQ | API-M16-01 (`category=refurbished`) | Answers |

**Tables / filters / search / pagination.** Grade comparison table; chip filters; "Show all" expands (page size per
D-080). **Modals / drawers.** None.

**States**

| Type | Behaviour |
|---|---|
| Loading | Hero, process, grade table server-rendered; showcase and grid load with skeletons |
| Empty | Grid empty → "No units match these filters" + Clear + Alert me; no showcase unit available → showcase hidden |
| Error | Grid load failure → retry panel; showcase failure → section hidden |
| Unit sold meanwhile | Add fails with `STOCK_UNAVAILABLE` → show the next unit's own photos/report before adding (MK "never a silent swap") |

**Permissions.** Guest/consumer: public prices; dealer: ex-GST tier prices ("Approved dealers can order refurbished
units by SKU at tier prices, or request a quote for a matched lot" → P-S11, D-121).

**API dependencies.** API-M09-01, API-M04-01, API-M04-03, API-M04-04, API-M06-02, API-M21-01, API-M10-02,
API-M08-17, API-M20-07, API-M16-01.

**Backend / database.** BR-M04-13, BR-M04-14, BR-M04-15, BR-M04-18, BR-M06-07, BR-M06-16, BR-M06-22, BR-M12-05 ·
E-condition_grade, E-serial_unit, E-inspection, E-media_asset, E-warranty_policy, E-return_policy, E-offer,
E-merch_collection, E-approved_answer.

**Related pages.** P-S03, P-S02, P-S13#grades, P-S11.

**Conditional / mockup-only.** Grade rubric and checklist content (D-023), content blocks (D-142), alerts (D-141),
reserve-to-view in store (FAQ copy — D-061), "typical saving" (D-166).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `REQUIRES_DECISION (D-023)`.

---

### 4.5 P-S05 — Compare products

| Field | Value |
|---|---|
| Mockup | `store-compare.html` |
| Purpose | Side-by-side relevant specifications, condition, warranty, delivery and price (BP §6.3 Comparison) |
| Route | NOT SPECIFIED — D-163. Prototype: `?example=cameras·mixed` and the "Load" switcher (Your selection / Example: cameras / Example: different categories) are not built |
| Evidence | CONDITIONAL (BP §5.2 "Wishlist and basic product comparison — C") · MOCKUP |
| Modules | M09, M04, M05 |
| Phase · requirements | 1A (C) · R01, R07 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Breadcrumbs & title | Category or "Mixed categories"; "N of 4 products · category · tax basis · stock & prices are live" | MOCKUP · max count D-042 |
| 2 | Different-categories warning | "You're comparing products from different categories…"; only shared details comparable; category specs "Not applicable"; "Compare only {category}" | DOCUMENTED BP §6.3 state "Different categories" |
| 3 | View options | "Highlight differences" (default on), "Hide identical rows", legend; Share, Print, Clear all | MOCKUP · share link MOCKUP-ONLY D-042/D-141 (§7 gap G-08) |
| 4 | Compare table header | Per product: remove, image, brand, title link, rating, Add to cart; add slot (select a similar product, "Add to comparison", "browse the category") | MOCKUP · rating D-041 |
| 5 | Offer group | Price (lowest-price marker), condition + note, warranty provider + "Longest cover" marker, stock & delivery (to current PIN; partner note), returns window, inspection report link / "New · sealed", customer rating | DOCUMENTED BP §6.1 transparent purchase · D-016, D-022, D-073 |
| 6 | Specifications group | Rows from the shared category template; missing values "Not specified" with tooltip; "Lightest" marker; mixed categories → shared rows + "Not applicable" | DOCUMENTED BP §6.3 "missing specification"; BP §7.1 schema |
| 7 | Buy row | Add to cart, View details per product | MOCKUP |
| 8 | Too-few state | "Nothing to compare yet" / "Add one more product to compare" + Browse category (+ prototype "Restore example" not built) | DOCUMENTED BP §6.3 |
| 9 | Often compared with these | Product rail with Compare checkboxes (up to 4) | MOCKUP-ONLY D-164 |

**Components.** Compare table (58), price block (41), condition badge (6), stock message (42), product card (43),
switch (13), callout (10), empty (27).

**Forms & fields.** Add-product select (products of the same category; required before "Add to comparison" — toast
"Choose a product first"); switches (highlight, hide identical). Validation: max products per D-042 (MK 4).

**Actions**

| Action | API | Result |
|---|---|---|
| Load products & specs | API-M04-02 (each product) | Spec rows |
| Load context prices/availability | API-M04-03 (each product, current PIN) | Offer rows |
| Add-slot candidates / suggestions | API-M21-01 (`category_id`) | Options / rail |
| Add to cart | API-M10-02 | Added |
| Remove / Clear all / Compare only category | — (client) | Selection updated |
| Share | — (gap G-08) | Link (D-042) |
| Print | — (browser) | Print view |

**Tables / filters / search / pagination.** Compare table with row groups (Offer, Specifications, Buy); no filters or
pagination. **Modals / drawers.** None. **Validation.** At least 2 products to show the table; maximum per D-042;
add-slot requires a selection.

**States.** Loading: skeleton columns; Empty: too-few state; Error: failed product → column shows "Unavailable" with
remove; product no longer published → removed with notice; Mixed categories: warning.

**Permissions.** Guest/consumer: public prices; dealer: private prices (page response private when dealer).

**API dependencies.** API-M04-02, API-M04-03, API-M21-01, API-M10-02.

**Backend / database.** BR-M04-01, BR-M04-04, BR-M05-15 · E-product, E-sku_attribute_value, E-category_attribute,
E-offer.

**Related pages.** P-S02, P-S03, shell compare tray.

**Conditional / mockup-only.** Whole page CONDITIONAL (D-042); share link (D-042/D-141); rating rows (D-041);
suggestion rail (D-164); mobile horizontal scrolling is Phase 2 (BP §6.3).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `REQUIRES_DECISION (D-042)`.

---

### 4.6 P-S06 — Cart

| Field | Value |
|---|---|
| Mockup | `store-cart.html` |
| Purpose | Items, condition, quantity, context prices, discount explanation, delivery estimate; disclose changes since items were added (BP §6.3 Cart; PR2 §3 "line-level quantity changes, availability revalidation, discount visibility and clear totals") |
| Route | NOT SPECIFIED — D-163. Prototype: `?empty=1` and the "View" switcher (Your cart / Empty cart) are not built |
| Evidence | DOCUMENTED (BP §6.3, §6.5, §8.1, §8.4) · MOCKUP |
| Modules | M10, M05, M12 |
| Phase · requirements | 1A · R03, R04, R08 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Header | Breadcrumbs; "Shopping cart (N items)"; "Prices and stock re-checked against live inventory at {time}" + tax basis | DOCUMENTED BP §6.3, §16.5 |
| 2 | Changes banner | "N items changed since you last visited" with per-line reason (quantity reduced, price changed) | DOCUMENTED BP §6.3 "Changed price, stock shortage" |
| 3 | Line list header | Line and shipment count; price column label (dealer "excl. GST") | MOCKUP · split D-029 |
| 4 | Cart lines | Image, brand, title, condition badge + key specs; meta: unit reserved at checkout + inspection report (unit offers), sold by / ships from, warranty + provider, stock + delivery date; actions: quantity stepper, Remove, Save for later, Compare; price column: line total; consumer "each incl. GST", reference price and % off; dealer "unit × qty · excl. GST", GST amount | DOCUMENTED BP §6.3 (items, condition, quantity, prices) · save for later MOCKUP-ONLY (D-129); reference price D-166; seller/partner disclosure D-165 |
| 5 | Line notices | Price changed since added (old → new, "you pay the new price"); quantity reduced to available with reason + Notify me; partner-warehouse line ships separately, confirmed after payment or cancelled and refunded; dealer tier explanation (tier applied, saving, units to next tier, stock sufficiency) | DOCUMENTED BP §6.3, §8.1 step 8, §8.4 "Quantity changes after quote", §9.7; BR-M05-07, BR-M05-11 · D-073, D-141 |
| 6 | Line list footer | Empty cart; subtotal (dealer "+ GST") | MOCKUP |
| 7 | Saved for later | "Not reserved" list with Move to cart / Remove; empty text | MOCKUP-ONLY (D-129); price-drop alert copy D-141 |
| 8 | Complete your setup | Accessories verified compatible with cart items | CONDITIONAL D-071 / MOCKUP-ONLY D-164 |
| 9 | Order summary | Consumer: price at reference price, discount, coupon, delivery, total, "includes GST (CGST + SGST)", "You save"; Dealer: subtotal excl. GST, quantity-tier savings, taxable value, delivery, GST with CGST/SGST split and state, total payable; business invoice panel (business name, GSTIN verified, ITC eligible, invoice email); dealer minimum order check | DOCUMENTED BP §6.3 "discount explanation", §6.5 "shipping charges and tax totals clear", §8.1 · D-016, D-166, D-162; minimum order D-160 |
| 10 | Coupon | Consumer: code input + Apply; applied chip (saving or amount still needed, rule label, "one per order") + remove; errors (empty, invalid, expired, "applied automatically at payment"); Dealer: "Consumer coupons can't be combined with dealer prices" | CONDITIONAL D-043 · stacking D-017 |
| 11 | Delivery estimate | PIN form + Check; shipments list (location, items, date; partner shipment confirmation) | DOCUMENTED BP §6.3 "delivery estimate", §6.5 · D-029, D-013 |
| 12 | Checkout CTA | "Proceed to secure checkout" (→ P-S07); guest: "checkout as a guest with phone OTP" + Sign in; signed-in context line (dealer: business, tier, prepaid) | DOCUMENTED BP §6.5 · guest D-021; prepaid D-019 |
| 13 | Reservation note | "Items in your cart aren't held"; stock reserved at checkout and re-checked before payment | DOCUMENTED BP §10.2 · timing D-161; duration D-026 |
| 14 | Trust card | Payment via provider (no card data), returns summary, GST invoice with serials, WhatsApp with cart reference | DOCUMENTED BP §10.6, §6.1 · D-012, D-022, D-014 |
| 15 | Empty cart | "Your cart is empty", persistence note, Continue shopping, Today's deals, Sign in (guest: items from another device); saved-for-later list; popular right now | DOCUMENTED BP §6.3 · retention D-129; popular D-142/D-164 |
| 16 | Recently viewed | Device-stored rail | MOCKUP-ONLY D-164 |

**Components.** Cart line & notices (59), saved list (60), order summary (61), coupon (62), shipment split (63),
PIN checker (52), quantity stepper (14), price block (41), product card (43), callout (10), empty (27).

**Forms & fields**

| Field | Type | Required | Validation (source) |
|---|---|---|---|
| Line quantity | Integer stepper | Yes | ≥ 1; capped at available (toast "Only N available — quantity capped"); tier recalculated (BR-M05-11) |
| Coupon code | Text (upper-case, not case-sensitive) | To apply | Non-empty; validity/eligibility/stacking server-side (`COUPON_INVALID`) — D-043 |
| Delivery PIN | Numeric 6 | To check | `^[1-9]\d{5}$` (MK) |

**Actions**

| Action | API | Result |
|---|---|---|
| Load cart with revalidation notices | API-M10-01 | Lines, notices, saved-for-later, quote ref (D-129) |
| Quote totals (coupon, PIN, context) | API-M05-01 (`cart:true`, `delivery.pin`, `coupon_codes`) | Totals, tier, promotions, notices, split shipment |
| Change quantity / save for later / move to cart | API-M10-03 | Updated cart; tier recalculated |
| Remove line / Empty cart | API-M10-04 / API-M10-05 | Updated / empty |
| Notify me (reduced line) | API-M20-07 | Alert (D-141) |
| Check PIN | API-M12-01 (+ API-M05-01 re-quote) | Shipments and dates |
| Default address PIN (signed-in) | API-M08-05 | Pre-filled PIN |
| Business invoice panel (dealer) | API-M02-01 / API-M08-24 | Business name, GSTIN verification state |
| Proceed to checkout | — | → P-S07 (reservation per D-161) |
| WhatsApp with cart reference | — | Click-to-chat (cart reference requires server cart, D-129) |

**Tables / filters / search / pagination.** None.

**Modals / drawers.** None.

**Validation.** Quantity bounds and coupon/PIN formats as above; every total, tier, promotion and stock result comes
from API-M10-01 / API-M05-01 (BR-M05-01).

**States**

| Type | Behaviour | Source |
|---|---|---|
| Loading | Lines and summary skeleton; summary recalculates after each change with busy indicator | BP §22.5 |
| Changed price | Line notice + banner; new price applies | BP §6.3 |
| Stock shortage | Quantity reduced to available, notice kept until the buyer acts | BP §6.3; T04 |
| Minimum quantity failure | Line/order message and checkout disabled until met | BP §6.3; D-160 |
| Context change | Dealer membership lost/suspended → repriced with notice (`CONTEXT_INELIGIBLE`) | BP §6.5, §8.4 |
| Expired price list | Checkout blocked with message, never zero price (`CHECKOUT_BLOCKED_PRICE_LIST`) | BP §8.4 |
| Empty | Empty-cart state | BP §6.3 |
| Error | Cart API failure → retry; lines never silently dropped (persisted per BR-M10-18) | BP §6.5 |

**Permissions.** Guest (cart token per D-129) and consumer: consumer totals, coupons (D-043); dealer: ex-GST totals,
tier savings, GST split, business invoice panel, no consumer coupons; prepaid (D-019).

**API dependencies.** API-M10-01, -02, -03, -04, -05; API-M05-01; API-M12-01; API-M04-03; API-M08-05; API-M08-24;
API-M20-07; API-M02-01.

**Backend / database.** BR-M10-18, BR-M05-04, -05, -07, -09, -11, -12, -15, -19; BR-M06-14, BR-M06-18; BR-M12-13 ·
E-cart, E-cart_line (D-129), E-quote, E-quote_line, E-offer, E-promotion, E-promotion_code (D-043), E-price_list_item
(`minimum_order_qty`).

**Related pages.** P-S03, P-S07, P-S11 (quick order adds lines), P-S12.

**Conditional / mockup-only.** Save for later (D-129), coupons (D-043), complete-your-setup (D-071/D-164), recently
viewed (D-164), alerts (D-141), dealer minimum order (D-160), partner-stock lines (D-073).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `REQUIRES_DECISION (D-129)`.

---
### 4.7 P-S07 — Checkout

| Field | Value |
|---|---|
| Mockup | `store-checkout.html` |
| Purpose | Short checkout — address, delivery, payment, review — with serviceability validated before payment, clear shipping and tax totals, policy acknowledgement, duplicate-safe placement and server-verified payment (BP §6.3 Checkout, §6.5, §10.2; PR2 §3) |
| Route | NOT SPECIFIED — D-163. Prototype: `?step=address·delivery·payment·review`, `?state=failed·price·expired`, `#address`; the state switcher (Normal / Payment failed / Price changed / Reservation expired) is not built. Entry points: from P-S06, "Buy now" (P-S03), secure checkout link (API-M10-22) |
| Evidence | DOCUMENTED (BP §6.5, §10.2, §10.3, §17.5) · MOCKUP |
| Modules | M10, M11, M05, M12, M08, M06 |
| Phase · requirements | 1A · R03, R08, R11 (checkout link) |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Header | Breadcrumbs (Cart › Checkout), title, "Secure checkout" badge, reservation timer "Items reserved for mm:ss · {reservation ref}" (low-time emphasis) | DOCUMENTED BP §10.2 (reservation expiry) · timing D-161, duration D-026; showing reservation refs D-165 |
| 2 | State banner | Reservation expired: "Items may have been released… nothing has been charged" + "Re-check & reserve again" | DOCUMENTED BP §6.3 "expired reservation", §10.3 |
| 3 | Stepper | 1 Address · 2 Delivery · 3 Payment · 4 Review & place order; only completed steps clickable; each step collapses to a summary line with "Change" | DOCUMENTED BP §6.5 "short checkout with address, delivery, and payment steps" |
| 4 | Step 1 — Delivery address & billing | Guest contact block (mobile + OTP verify, email for confirmation and secure order-access link, "Have an account? Sign in"); saved addresses (radio cards); "Add a new address" inline form; GST invoice toggle (consumer: GSTIN + registered business name + "billing address same as GST registration"; dealer: locked verified business with place-of-supply note); serviceability callout (serviceable, dates, express availability, partner item estimate, COD availability); Continue to delivery | DOCUMENTED BP §6.5 (serviceability before payment, business billing), §8.3; §17.5 (address ownership) · guest D-021; GST/place of supply D-016, D-037; COD D-020 |
| 5 | Step 2 — Delivery method | Radio options: Standard (date, charge), Express (cut-off, fee), Store pickup (store list with readiness; disabled stores explained; hold period and ID note); split-shipment panel (2 parts, partner confirmation, "Ship available items now" vs "Ship everything together"); delivery instructions (optional); high-value delivery OTP note; Continue to payment | DOCUMENTED BP §6.3 Checkout "delivery"; §10.4 partial dispatch only if approved · pickup D-061; split D-029 (BR-M10-13); charges/OTP D-162 |
| 6 | Step 3 — Payment method | Failed-payment banner (reason, "no money was taken", reversal note, reservation remaining, Retry, "Pay by card instead", attempt ref); method tabs: UPI (UPI ID + Verify, app shortcuts, QR, offer note, approve-in-app instructions), Card (saved provider tokens or new card on the provider's hosted page; "we never see your card number"), Net banking (bank list + other banks, redirect note), EMI (plan table: bank, months, monthly, interest, total; no-cost note; not for dealers), Cash on delivery (eligibility reasons or pay-on-delivery with fee); "Review order"; "You won't be charged until you place the order" | DOCUMENTED BP §10.6 (hosted collection, no card storage), §6.3 "failed payment" · provider & modes D-012; EMI/offers/saved cards MOCKUP-ONLY D-062; COD D-020 |
| 7 | Step 4 — Review & place order | Price-change callout ("Review change" → m-price) or accepted note with quote version; review boxes Ship to / Billing / Delivery / Payment with Change; items list (condition, unit reserved, warranty, ship-from, qty × unit, line total) under reservation ref; policy acknowledgement checkbox listing warranty/return policy versions ("stored with your order"); "Place order & pay {total}" (disabled until acknowledged; disabled while price change unaccepted or reservation expired; hint text); duplicate-safe note | DOCUMENTED BP §6.3 "final total", §8.1 step 8, §17.5, §17.6 (order snapshot); T33; BR-M10-06 · D-154 quote validity |
| 8 | Order summary (aside) | Items with quantity badges; consumer rows (reference price, discount, coupon, payment-method offer, delivery, total, GST split) or dealer rows (subtotal excl. GST, delivery, CGST, SGST, total payable); reservation panel (reserved until / expired), "Prices & stock revalidated at {time}", "Payment verified server-side before confirmation" | DOCUMENTED BP §6.5 · D-016, D-166, D-043, D-062 |
| 9 | Processing overlay | "Processing your payment… don't refresh"; references (attempt, order draft, reservation) | DOCUMENTED BP §10.2 steps 3–4 · references shown D-165 |

**Components.** Stepper (23), checkout step section (64), address card/form (73), option cards (13), OTP input (15),
payment tabs (65), reservation timer (66), order summary (61), shipment split (63), modal (29), callout (10).

**Forms & fields**

| Field | Type | Required | Validation (source) |
|---|---|---|---|
| Guest mobile | Tel (+91) | Yes (guest) | 10 digits; verified by OTP (API-M02-02/03 `verify_phone`) — D-021, D-040 |
| Guest OTP | 6-digit code | Yes (guest) | Code length/attempts per D-040/D-084 |
| Guest email | Email | Yes in MK (guest) | Format; used for confirmation and order-access link — D-021 |
| Saved address | Radio | One required | Ownership checked server-side (BR-M08-13) |
| New address: full name | Text | Yes | Non-empty |
| New address: mobile | Tel (+91) | Yes | 10 digits |
| New address: PIN | Numeric 6 | Yes | `^[1-9]\d{5}$` (MK); serviceability checked (API-M12-01); city/state auto-fill is a UI aid |
| New address: city / district | Text | Yes | Non-empty |
| New address: flat/house/building | Text | Yes | Non-empty |
| New address: area/street | Text | Yes | Non-empty |
| New address: state | Select | Yes | From state list (D-059) |
| New address: landmark | Text | No | — |
| New address: type | Segmented Home/Office/Other | Yes | Allowed values (E-address.address_type) |
| GST invoice toggle | Checkbox | No (dealer: forced on, locked) | — |
| GSTIN | Text (upper-case, 15) | If GST invoice | Format regex from MK `^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$`; verified server-side (API-M08-23); state code drives CGST+SGST vs IGST note — D-016, D-037, D-067 |
| Registered business name | Text | If GST invoice | Non-empty; checked against verification result |
| Billing same as GST address | Checkbox | — | — |
| Delivery method | Radio | Yes | Options from API-M12-01 |
| Pickup store | Radio | If pickup | Enabled stores only — D-061 |
| Shipment preference | Radio (now / together) | If split | D-029 |
| Delivery instructions | Text | No | Length limit (D-080) |
| UPI ID | Text | If UPI collect | Pattern check is a hint; provider validates (D-012) |
| Saved card / new card | Radio | If card | Provider tokens only (D-012, D-062) |
| Bank | Radio/select | If net banking | Provider list (D-012) |
| EMI plan | Radio | If EMI | D-062 |
| Policy acknowledgement | Checkbox | Yes | `POLICY_ACK_REQUIRED` |

**Actions**

| Action | API | Result |
|---|---|---|
| Open from secure checkout link | API-M10-22 | Draft lines, customer context, recomputed quote, expiry; `LINK_EXPIRED` state |
| Send / verify guest OTP | API-M02-02 / API-M02-03 | Verification token for guest order (D-021) |
| Load saved addresses / add address | API-M08-05 / API-M08-06 | List / new address with `serviceable` |
| Check serviceability, delivery options, COD, pickup | API-M12-01 | Options, ETA, charge, `cod_eligible` |
| Verify GSTIN | API-M08-23 (`context=checkout`) | Status, legal name, state |
| Quote (address, method, coupon, billing) | API-M05-01; read version API-M05-02 | Totals, notices, `material_changes[]`, expiry |
| Place order | API-M10-06 (idempotency key per checkout intent, quote id/version, address, billing, delivery, shipment preference, policy acknowledgements) | Pending order + reservation expiry, or `PRICE_CHANGED` / `STOCK_UNAVAILABLE` / `QUOTE_EXPIRED` / `NOT_SERVICEABLE` / `CONTEXT_INELIGIBLE` / `ORDER_LIMIT_EXCEEDED` / `STOCK_AUTHORITY_UNAVAILABLE` |
| Pay (after order) / Retry / change method | API-M11-01 (Idem) → provider hosted page (D-012) | Attempt created or reused; `RESERVATION_EXPIRED` → re-check |
| Poll payment status after return | API-M11-02 (polling/push D-146) | Confirmed → P-S08 confirmation; pending → P-S08 pending; failed → failed banner |
| Accept new total / Remove item (m-price) | API-M05-01 (accept new quote version) / API-M10-04 | Place-order enabled |
| Re-check & reserve again | API-M05-01 + API-M10-06 (or reservation renewal per D-161) | New reservation or shortage message |
| Edit cart | — | → P-S06 |

**Tables / filters / search / pagination.** EMI plan table (D-062); items list.

**Modals / drawers.** `m-price` "Price changed — please confirm" (item, old → new price, reason, new order total,
"we never change a price silently"; Remove this item / Accept new total); processing overlay.

**Validation.** Client checks above; step 1 cannot continue with an unsaved invalid new address (MK toast "Fix the
address errors first"); place order requires acknowledgement and no pending price change; server re-validates
everything (BR-M10-05).

**States**

| Type | Behaviour | Source |
|---|---|---|
| Loading | Steps render immediately; quote/serviceability sections show busy state; place-order button busy + disabled | BP §22.5 |
| Failed payment | Banner with reason, no-double-charge note, retry with a new attempt for the same order | BP §6.3; §10.3 |
| Expired reservation | Banner; timer shows expired; place/pay disabled until re-checked | BP §6.3; T09 |
| Price changed | m-price modal; review blocked until accepted or item removed | BP §6.3, §8.1 step 8 |
| Duplicate submission | Button disabled; same idempotency key on retry returns the same order | BP §6.3, §10.3; T06 |
| Stock shortage at placement | Accurate per-line message; back to cart or remove line; dealer shortage alternatives | BP §10.3; T04; §29.2 |
| Not serviceable | Address step blocks with alternatives (other address, pickup) | BP §6.5 |
| Stock authority unavailable | "Can't confirm stock right now — nothing charged" + retry | BP §10.3 |
| Payment pending | Hand-off to P-S08 pending state (no false success) | BP §6.3 Confirmation |
| Empty cart | Redirect to P-S06 empty state (MK prototype never shows empty checkout) | MK |
| Guest not allowed (if D-021 = no guest checkout) | Sign-in/register required before step 1 | D-021 |

**Permissions**

| Role | Differences |
|---|---|
| Guest | Contact + OTP block; address entered at checkout; order access by link/OTP afterwards (D-021) |
| R-consumer | Saved addresses; optional GST invoice; coupons/offers per D-043/D-062; COD if eligible (D-020) |
| R-dealer | Business billing locked and verified; ex-GST totals with GST split; prepaid (D-019); consumer coupons, EMI and COD hidden per rules (D-017, D-062, D-020); per-order limit (D-066) |
| LNK holder | Draft lines fixed by staff/WhatsApp flow; price recomputed; same controls (BP §29.5) |

**API dependencies.** API-M10-22, API-M02-02, API-M02-03, API-M08-05, API-M08-06, API-M08-23, API-M12-01,
API-M05-01, API-M05-02, API-M10-04, API-M10-06, API-M11-01, API-M11-02, API-M06-01 (pickup stores), API-M04-04
(policy versions), API-M02-01.

**Backend / database.** BR-M10-02, -03, -04, -05, -06, -08, -13; BR-M11-01, -02, -10; BR-M12-13; BR-M05-04, -09,
-12; BR-M06-05, -06, -07; BR-M08-13 · E-sales_order, E-order_line, E-reservation, E-quote, E-quote_line, E-address,
E-payment_attempt, E-idempotency_record, E-verification_challenge (D-021/D-040), E-terms_acceptance.

**Related pages.** P-S06, P-S08, P-S12, P-S13 (policies), shell chat.

**Conditional / mockup-only.** Guest checkout (D-021), COD (D-020), store pickup (D-061), EMI / offers / saved cards
(D-062), split shipment choice (D-029), express delivery & delivery OTP (D-162), reservation timer timing (D-161),
checkout link reservation timing (D-151).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `REQUIRES_DECISION (D-012, D-021, D-161)`.

---

### 4.8 P-S08 — Order confirmation & tracking

| Field | Value |
|---|---|
| Mockup | `store-order.html` |
| Purpose | Order reference and next action after placement; current status with separate order/payment/fulfilment/return states, shipment breakdown, invoice access, cancellation and return entry; verified guest lookup (BP §6.3 Confirmation & Orders, §6.5, §10.1) |
| Route | NOT SPECIFIED — D-163. Prototype: `?placed=1` (confirmation view), `?pay=pending`, `?ship=delivered`, `?id=`, `#order`; the state switcher and "Track-order view / Confirmation view" link are not built |
| Evidence | DOCUMENTED (BP §6.3, §6.5, §10.1–10.5, §13.4) · MOCKUP |
| Modules | M10, M11, M12, M13, M19, M16 |
| Phase · requirements | 1A · R08, R11, R19 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Breadcrumbs | Home › Orders › Order confirmation / Track order | MOCKUP |
| 2a | Confirmation — payment verified | Success heading, order number, placed time, amount "verified by provider" (+ provider reference), where confirmation was sent (email/WhatsApp), delivery-OTP note; Track this order / Continue shopping | DOCUMENTED BP §6.3 Confirmation, §10.2 step 4 · notification channels D-058; references D-165; delivery OTP D-162 |
| 2b | Next steps | Per-shipment promises (picking & final unit check, partner confirmation deadline, dispatch time, delivery dates) | MOCKUP · partner deadline D-073; content D-165 |
| 2c | Guest account prompt | "Checked out as a guest? … create a password now (optional)" | MOCKUP · D-168, D-021 |
| 3 | Confirmation — verification pending | "We've received your order — payment verification in progress"; not confirmed yet; provider reports pending; automatic check countdown; items reserved until {time}; Check status now; Get help; callouts: don't pay again (second payment blocked), money debited → automatic outcome, we'll message you | DOCUMENTED BP §6.3 "Payment verification pending; avoid false success", §10.3 · D-146 (refresh), D-026 (hold), D-012 |
| 4 | Track lookup (not signed in / not verified) | Order number + mobile → Send OTP → 6-digit code → "Verify & show order"; status message (code sent to masked number, validity); other ways: signed-in orders, WhatsApp with order number, "Re-send my secure tracking link"; lockout note | DOCUMENTED BP §6.5 (secure link or verification), §13.4; T23 · D-021, D-084 |
| 5 | Order header | "Order {number}", placed date, channel, item count, buyer (+ business); invoice button (proforma before dispatch / GST invoice after); WhatsApp help with order reference | DOCUMENTED BP §6.3 "invoice access" · proforma D-055 (gap G-12) |
| 6 | State panel | Four separate statuses with detail: Order (awaiting payment / confirmed / partially fulfilled / fulfilled / cancelled…), Payment (pending at provider / captured · verified / refunded), Fulfilment (not started / picking / out for delivery / delivered · 1 pending), Returns & refunds (none / refund pending / return window open) | DOCUMENTED BP §10.1 ("separate state machines") · customer labels D-165; transitions D-150 |
| 7 | Shipment sections | Per fulfilment: header (ship-from, items, carrier & AWB, status badge, external courier tracking link); tracker (Confirmed/Partner confirmation → Picking → Packed → Dispatched → Out for delivery → Delivered; hold/cancelled markers with times); latest carrier event; handover evidence (delivery OTP, proof of delivery); lines (image, title, condition, qty × unit price, SKU; unit ID + inspection report; masked serial(s) after dispatch or "allocated at packing"; warranty provider; return window end date after delivery; cancellation-requested callout with refund amount/reference; actions Cancel item (not dispatched and payment verified), Return / replace (delivered), Warranty claim; hint when no action possible); footer (invoice issued at dispatch / invoice number + Download) | DOCUMENTED BP §6.3 Orders "shipment breakdown", "partial shipment", §10.4, §10.5 (canonical carrier states), §7.2; BR-M12-08 · carrier D-013; split D-029; rider/contact disclosure D-165 |
| 8 | Partner shipment | Pending partner confirmation with automatic cancel/refund if not confirmed; cancellable line | CONDITIONAL D-073, D-028, D-007 |
| 9 | Returns card | "Return, replace or claim warranty" with windows summary → P-S10 (primary once delivered) | DOCUMENTED BP §6.3 |
| 10 | Aside | Delivery address (masked phone), billing (consumer / GST invoice with GSTIN), payment (method, provider reference, captured/pending), totals (consumer or dealer variant), refund-pending line; help card (WhatsApp with order reference, call, Report a problem, support hours) | DOCUMENTED BP §13.4 (verify before revealing address/invoice) · D-074, D-165 |

**Components.** Status group (67), shipment tracker (68), order line (69), order summary (61), OTP input (15),
callout (10), modal (29), key-value (20).

**Forms & fields**

| Field | Type | Required | Validation (source) |
|---|---|---|---|
| Order number | Text (mono) | Yes | Format per D-123 (MK `TXO-\d{5}` is a sample) |
| Mobile number | Tel (+91) | Yes | 10 digits |
| One-time code | 6 digits | Yes | Attempts/lockout per D-084 (MK "After 5 wrong codes, lookup is paused for 30 minutes" is a sample) |
| Cancel reason (m-cancel) | Select | Yes | Reason list D-139 (MK list is a sample) |

**Actions**

| Action | API | Result |
|---|---|---|
| Load order | API-M10-07 | Order, lines, fulfilments, events, returns, refunds, invoices, `allowed_actions` (GAT scope for guests) |
| Poll / check payment status | API-M11-02 (D-146) | Confirmed / still pending / failed + next action |
| Retry payment (if `allowed_actions` has pay) | API-M11-01 | New/reused attempt (D-012) |
| Guest lookup: send code / verify | API-M10-10 / API-M10-11 | Challenge (always 202) / order-access token |
| Re-send secure tracking link | API-M10-12 | Generic 202 |
| Cancel item | API-M10-09 (Idem; `customer_request`) | Cancellation, released reservation, refund request; `STATE_TRANSITION_INVALID` if dispatched |
| Download invoice | API-M19-02 | PDF or `NOT_ISSUED_YET` |
| Return / replace, Warranty claim | — | → P-S10 with order/line |
| Inspection report | API-M06-02 | Unit report |
| Report a problem | API-M16-11 (`missing_late_order` / other) | Ticket reference (D-074) |
| WhatsApp help | — | Click-to-chat with order reference; details only after verification (BP §13.4) |
| Courier tracking | — | External carrier link from fulfilment `tracking_link` (D-013) |

**Tables / filters / search / pagination.** None.

**Modals / drawers.** `m-cancel` (item summary, reason, "only this line is cancelled — its reservation is released
and {amount} is refunded once to your original payment method; partner notified"; Keep item / Request cancellation) —
BP §10.3 partial cancellation, T34; `m-wa` (pre-filled order reference, verification notice, hours/after-hours).

**Validation.** Lookup fields as above; cancellation only when `allowed_actions` permits.

**States**

| Type | Behaviour | Source |
|---|---|---|
| Payment verification pending | Pending hero; actions limited ("available once payment is verified") | BP §6.3; BR-M10-09 |
| Payment failed after return | Message + retry (API-M11-01) or cancel | BP §6.3 |
| Partial shipment | Shipment 1 of 2 etc.; order "Partially fulfilled" | BP §6.3 |
| Cancellation requested | Line callout + refund pending line | BP §6.3 |
| Refund pending / delayed | Returns & refunds status "Refund pending" with reference | BP §6.3 |
| Delivery failed / returned to origin | Fulfilment status and message from canonical states (not shown in MK; D-150) | BP §10.5 |
| Late capture after hold expiry | Order "on hold" with explanation and support route (not shown in MK) | BP §29.6; D-026 |
| Not found / no access | Neutral not-found; lookup form | T23 |
| Loading | Skeleton for status panel and shipments | BP §22.5 |
| Error | Retry; lookup errors per OTP rules | §1.6 |

**Permissions**

| Role | Access |
|---|---|
| Guest | Lookup only; after verification GAT scope (read, pay, cancel lines, request return, download invoice); address masked (06-api §4.4) |
| R-consumer | Own orders |
| R-dealer | Organisation orders per member visibility (D-066); dealer totals ex-GST |

**API dependencies.** API-M10-07, API-M10-09, API-M10-10, API-M10-11, API-M10-12, API-M11-01, API-M11-02,
API-M19-02, API-M06-02, API-M16-11, API-M02-01.

**Backend / database.** BR-M10-01, -07, -08, -09; BR-M11-01, -02, -03, -04; BR-M12-01, -08, -09, -15; BR-M16-07,
BR-M16-15 · E-sales_order, E-order_line, E-payment_attempt, E-fulfilment, E-shipment_event, E-order_cancellation,
E-refund, E-invoice_reference, E-return_request, E-verification_challenge.

**Related pages.** P-S07, P-S09#orders, P-S10, P-S03 (inspection), P-S13, shell chat "Track my order".

**Conditional / mockup-only.** Guest access (D-021), partner shipment (D-073), delivery OTP & proof of delivery
(D-162), proforma invoice (D-055), guest-to-account prompt (D-168), live refresh (D-146).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `NOT_STARTED` for signed-in owners; guest lookup
`REQUIRES_DECISION (D-021)`.

---
### 4.9 P-S09 — My account

| Field | Value |
|---|---|
| Mockup | `store-account.html` |
| Purpose | Signed-in customer's orders, returns & warranty claims, wishlist, invoices & credit notes, registered devices, addresses, profile & security, privacy & message consent (BP §6.2 "Account and business access", §6.3 Orders, §13.3, §19.3; PR2 §3 "Account") |
| Route | NOT SPECIFIED — D-163. Prototype: `?view=`, tab hashes `#overview #orders #returns #wishlist #invoices #devices #addresses #profile #privacy`, modal/drawer hashes `#m-address`, `#d-rma` (MK "Deep-linkable account sections") |
| Evidence | DOCUMENTED (BP §6.3, §13.3, §19.2–19.3) · MOCKUP |
| Modules | M08, M02, M10, M13, M19, M20, M22 |
| Phase · requirements | 1A · R11, R19 |

**UI sections — guest view**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| G1 | Sign-in prompt | Benefits list; mobile number → Continue (→ P-S12#signin); Create an account; "Business? Apply for dealer pricing" | DOCUMENTED BP §6.5 (no forced account for browsing) · D-040 |
| G2 | Bought as a guest? | Order number + phone used at checkout → "Send code & view order" | DOCUMENTED BP §6.5 · D-021 |
| G3 | Quick links | Track an order (P-S08), Returns & warranty policy (P-S13), Business buyers (P-S11) | MOCKUP |

**UI sections — signed-in (tabs in mockup order)**

| # | Section / tab | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Header | Initials avatar, "Hello, {first}", customer since, email, masked mobile; badges (2-step on, order updates on WhatsApp); Help centre; dealer members see a callout: personal login/security/consent here, business orders/invoices/price lists/team in Dealer zone | MOCKUP · D-040, D-066 |
| 2 | Side navigation | Shopping: Overview, Orders (count), Returns & warranty (count), Wishlist (count) · Records: Invoices & credit notes, Devices & warranty · Settings: Addresses, Profile & security, Privacy & messages; help card (chat hours, WhatsApp, Help) | MOCKUP · D-042 (wishlist), D-074 (hours) |
| 3 | Overview | Attention tiles (open orders, returns & claims needing action, wishlist alerts, items under warranty); "Needs your attention" list sorted by urgency (e.g. photo required for RMA, payment being verified — don't pay again, return window closing, refund delayed at provider); Account & security summary (mobile/email verified, 2-step, default address, messages) + Manage; anti-fraud notice; Recent orders (compact with payment state and Track); dealer-application CTA (hidden for dealers) | MOCKUP; BP §6.3 Orders states · alerts D-042/D-141 |
| 4 | Orders | Explainer ("each shows its own status"); Track by order number; search (order no., product, serial); status filter (All / Open / Delivered / Cancelled / Returns & refunds with counts); time range (last 6 months / years); count; order cards: header (placed date, total, ship to, paid via, order number, Order details), state row (Order / Payment / Delivery [/ Returns / Warranty]), notes (payment pending, cancelled by the business with reason and refund reference, refund delayed), shipments (title, carrier/AWB or status, items with condition, qty, price, warranty, unit + inspection report link, non-returnable badge), actions (Track package, Invoice, Check payment status, Cancel order, Resend delivery OTP, See similar units, Receipt, View return, Credit note, Get help; per item Return or replace, Buy again, Write a review, Request warranty repair, Inspection report); empty "No orders match" + Clear filters; note on branch purchases linked by phone and older orders in the previous system; Load older orders | DOCUMENTED BP §6.3 Orders (current status, shipment breakdown, invoice access; partial shipment, cancellation requested, refund pending), §10.1 · reviews D-041; delivery OTP D-162; receipt/credit docs D-055; branch linking D-168/D-133; legacy orders D-038; digital items D-167 |
| 5 | Returns & warranty | "Start a new request" (→ P-S10); action-needed callout; RMA table (request id + type, item + order, status, 7-step progress Requested → Reviewed → Authorised → Pickup → Received → Inspected → Resolved, updated, action View/Upload/Track/Appeal); quarantine explainer + policy version link; RMA drawer | DOCUMENTED BP §10.1 RMA states, §10.5 (quarantine), §6.3 Returns · appeal D-169; step label "Pickup" maps to "in transit" (D-165) |
| 6 | Wishlist | Share; "Add available items to cart"; alert settings (price-drop, back-in-stock switches; channels Email / WhatsApp showing consent state; "Change message consent"); wishlist grid with per-item alert line (price dropped since saved, back-in-stock alert on, low stock, unchanged); comparison-price note | CONDITIONAL D-042 · alerts/share MOCKUP-ONLY D-141; consent BR-M08-06 |
| 7 | Invoices & credit notes | Explainer (tax invoices per shipment at dispatch; credit note per refund); financial year select; Download all (ZIP); table: document number, type (tax invoice / credit note / not yet issued / receipt only), for (order, shipment, RMA), date, taxable value, GST (CGST+SGST), total, PDF; seller GSTIN & place-of-supply footer; retention note; GSTIN-at-checkout callout; "Invoice looks wrong? … Request correction" | DOCUMENTED BP §6.3 "invoice access", §14.2 · D-055 (series/templates), D-037 (GST fields), D-036 (retention text) |
| 8 | Devices & warranty | "Register an in-store purchase"; table: device (condition, order/date), masked serial / unit id / replaced serial, warranty provider + duration, coverage meter (% left), status (Pending / Active / Claim open / Returned) with detail, action (Claim → P-S10 warranty, Open, warranty card); masked-serial note; replacement-history callout | DOCUMENTED BP §7.5 (serial validation, replacement history), R19 · register D-133; warranty card document gap G-14 |
| 9 | Addresses | "Add address"; cards: type label, default badge, GSTIN-on-invoice badge, name, lines, masked phone, serviceability line (delivery speed, COD, return pickup), limited-service warning; Edit, Remove (not for default), Set default; add tile; store pickup explainer | DOCUMENTED BP §6.5 (serviceability) · D-020, D-061; GSTIN per address entity gap EG-03 |
| 10 | Profile & security | Personal details (first name, last name, mobile [verified, Change], email [verified, Change], message language, GSTIN for invoices — disabled "add at checkout") + Save; Sign-in & security: password (strength, last changed, Change), 2-step verification switch, authenticator app Set up, backup codes (unused count, Regenerate), new sign-in alerts switch; "Where you're signed in" (device, approx. location, last active, current badge, Sign out; Sign out all other sessions); recent security activity + View full log | MOCKUP; BP §19.1 (secure session handling) · D-040, D-083, D-050; sign-in alert preference gap G-15 |
| 11 | Privacy & messages | Privacy notice version link; Communication preferences table (channel, purpose, choice + record: date, source, masked contact; allow switch; essential rows locked) + "Stop all marketing" + Consent history; Download your data (Request my data → request-received state; link validity; re-auth); Other rights: correct details, nominate someone, raise a grievance (→ P-S13#grievance); Delete account (what is deleted vs kept) + "Delete my account" | DOCUMENTED BP §13.3 (opt-in/opt-out records), §19.2 (rights process), §19.3 (deletion ≠ statutory records); T25 · D-037, D-060, D-036 |

**Components.** Tabs/side nav (18), order card (70), status group (67), RMA progress & drawer (71, 30), timeline (24),
product card (43), switch (13), table (19), meter (22), address card/form (73), consent/session rows (74), modal (29),
OTP input (15), callout (10), empty (27).

**Forms & fields**

| Form · field | Type | Required | Validation (source) |
|---|---|---|---|
| Guest lookup: order number, phone | Text, tel | Yes | As P-S08 (D-021, D-084) |
| Orders search / status / range | Text, segmented, select | No | API list params (D-080) |
| Address (`m-address`): full name | Text | Yes | Non-empty |
| Address: mobile | Tel (+91) | Yes | 10 digits |
| Address: PIN + Check | Numeric 6 | Yes | `^[1-9]\d{5}$`; serviceability result shown (API-M12-01) |
| Address: city / district | Text | No in MK | — |
| Address: house/flat, building, street | Text | Yes | Non-empty |
| Address: area, landmark | Text | No | — |
| Address: type | Segmented | Yes | Home/Office/Other |
| Address: make default | Checkbox | No | One default per owner (E-address) |
| Register purchase (`m-register`): store invoice number | Text | Yes | Must match a store sale; format D-055 |
| Register purchase: device serial | Text | Yes | Validated against the sale (API-M08-15); mismatch message (BR-M08-11) |
| Change mobile (`m-otp`): new mobile, code to current, code to new | Tel, 6-digit, 6-digit | Yes | Both codes (API-M08-04); lost-access route via support with photo ID (MK) |
| Profile: first name, last name, message language | Text, text, select | First name yes | Languages D-050 |
| Wishlist alert switches & channels | Switches, checkboxes | No | Channel requires consent (`CONSENT_MISSING`) |
| Consent switches | Switch per channel × purpose | No | Essential rows locked; changes recorded with notice version (API-M08-10) |
| Delete account confirmation | Code (after eligibility) | Yes | Re-auth + blockers (D-060) |

**Actions**

| Action | API | Result |
|---|---|---|
| Load profile / update | API-M08-02 / API-M08-03 | Profile saved (`expected_version`) |
| Change mobile/email | API-M02-02/03 (codes) → API-M08-04 | Contact changed; sign-in alert sent |
| Password change / reset link | API-M02-09 / API-M02-07 | Changed / link sent (D-040) |
| 2-step enrol, confirm, backup codes | API-M02-12, API-M02-13, API-M02-14 | MFA state (MOCKUP-ONLY for customers, D-040) |
| Sessions list / sign out one or all others | API-M02-10 / API-M02-11 | Sessions updated (D-083) |
| Security activity log | API-M02-15 | Events list |
| Orders list / detail | API-M10-08 / API-M10-07 | Cards / → P-S08 |
| Check payment status | API-M11-02 | Status |
| Cancel order (awaiting payment) | API-M10-09 (all lines) | Cancellation |
| Buy again / Add available wishlist items | API-M10-02 | Lines added |
| Invoice / credit note PDF | API-M19-02 | PDF |
| Invoices list / Download all | API-M19-01 / API-M19-03 → API-M18-05 | List / ZIP job then download |
| Request invoice correction / Contact support (RMA drawer) | API-M16-11 (`invoice_correction` / other) | Ticket reference (D-074) |
| Returns list / RMA detail / upload photo | API-M13-04 / API-M13-05 / API-M22-01 + API-M13-06 | Table / drawer / evidence added |
| Wishlist list / remove / share | API-M08-16 / API-M08-18 / API-M08-19 | D-042, D-141 |
| Alert settings | API-M20-06 / API-M20-07 | D-141 |
| Devices list / register purchase | API-M08-14 / API-M08-15 (+ API-M13-02) | Table / linked or `SERIAL_MISMATCH` |
| Addresses list / add / edit / set default / remove | API-M08-05 / -06 / -07 / -07 / -08 | Updated list |
| PIN check (address) | API-M12-01 | Serviceability line |
| Consents list & history / change / stop all marketing | API-M08-09 / API-M08-10 | Updated with record |
| Data requests list / request my data / nominate / delete account | API-M08-12 / API-M08-13 (`access_export`, `nomination`, `correction`, `deletion`) | Request with due date (D-037, D-060) |
| Guest "Send code & view order" | API-M10-10 → API-M10-11 | → P-S08 with GAT |
| Private file view (e.g. uploaded evidence) | API-M22-02 | Authorised view |

**Tables / filters / search / pagination.** Orders (search, status group, date range, "Load older orders" paging —
D-080); RMA table; invoices (financial-year filter); devices; sessions; consent table; consent history.

**Modals / drawers.** `m-address` (add/edit address), `m-register` (register in-store purchase — D-133), `m-otp`
(change mobile, codes to both numbers), `m-consent-log` (consent history: when, channel · purpose, change, source,
notice version), `m-delete` (blockers list: open orders, open requests, pending refunds; what is removed vs kept;
confirmation by code; cancellation window — D-060, D-036), `d-rma` (RMA drawer: title, type · order · item,
situation callout, 7-step timeline, "why inspection" note; Policy, Contact support).

**Validation.** As fields above; server authoritative; ownership enforced (BR-M08-13).

**States**

| Type | Behaviour | Source |
|---|---|---|
| Not signed in | Guest view only; no private data | BP §6.5 |
| Loading | Per-tab skeletons; tab switch keeps the side navigation | BP §22.5 |
| Empty | Orders: "No orders match" (+ first-time "no orders yet"); returns: none; wishlist: empty; invoices: none; devices: none; addresses: add tile only | BP §22.5 |
| Payment verification pending | Attention item + order note "don't pay again" | BP §6.3 |
| Refund pending / delayed | Note with reference and expectation | BP §6.3 Orders |
| Action needed on RMA | Attention item + Upload | BP §6.3 Returns |
| Deletion blocked | m-delete lists open items; Continue disabled | BP §19.3; D-060 |
| Error | Tab-level retry; code errors per §1.6 | §1.6 |

**Permissions**

| Role | Access |
|---|---|
| R-guest | Guest view (G1–G3) |
| R-consumer | All tabs for own records |
| R-dealer | Personal settings, security, consent, own devices; business orders, invoices, price list, team in P-S11 (split of personal vs business order lists per D-066) |

**API dependencies.** API-M02-02, -03, -06, -07, -09, -10, -11, -12, -13, -14, -15; API-M08-02, -03, -04, -05, -06, -07, -08, -09, -10, -12, -13, -14, -15, -16, -18, -19;
API-M10-02, API-M10-07, API-M10-08, API-M10-09, API-M10-10, API-M10-11; API-M11-02; API-M12-01; API-M13-02,
API-M13-04, API-M13-05, API-M13-06; API-M16-11; API-M18-05; API-M19-01, API-M19-02, API-M19-03; API-M20-06,
API-M20-07; API-M22-01, API-M22-02.

**Backend / database.** BR-M08-06, -07, -09, -10, -11, -13; BR-M02-09, -11, -13, -17; BR-M10-01; BR-M13-01, -08;
BR-M20-03 · E-customer, E-user_account, E-address, E-consent_record, E-data_request, E-wishlist_item,
E-alert_subscription, E-serial_unit, E-invoice_reference, E-return_request, E-sales_order, E-user_session (D-083),
E-verification_challenge, E-attachment.

**Related pages.** P-S08, P-S10, P-S11, P-S12, P-S13 (grievance, privacy), P-S03.

**Conditional / mockup-only.** Wishlist (D-042), alerts & share (D-141), customer 2-step (D-040), device
registration (D-133), data requests (D-037, D-060), write a review (D-041), delivery OTP resend (D-162), digital
licence items (D-167), branch-purchase auto-linking & guest-order linking (D-168), RMA appeal (D-169), legacy order
history (D-038).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core (orders, returns list, invoices, addresses, profile)
`NOT_STARTED`; wishlist `REQUIRES_DECISION (D-042)`; privacy requests `REQUIRES_DECISION (D-060)`; security
`REQUIRES_DECISION (D-040, D-083)`.

---

### 4.10 P-S10 — Return / warranty request

| Field | Value |
|---|---|
| Mockup | `store-returns.html` |
| Purpose | Guided request for return for refund, replacement, warranty repair or dead-on-arrival: eligible items, reason, serial verification and photos, pickup or store drop, refund destination, policy snapshot; list of own requests (BP §6.3 Returns, §10.5, §7.5) |
| Route | NOT SPECIFIED — D-163. Prototype: `?order=`, `?item=`, `?type=warranty`, `#step-1…5`, `#done`, `#requests`, `#new`, `?view=` |
| Evidence | DOCUMENTED (BP §6.3 Returns, §10.1, §10.5, §7.5; T17) · MOCKUP |
| Modules | M13, M12, M22, M10 |
| Phase · requirements | 1A · R19 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Header | Breadcrumbs; title; copy; "Returns policy {version}", "Warranty guide" links | DOCUMENTED BP §10.5 (policy version) · D-022 |
| 2 | Guest verification | Order number + phone → Send code; or Sign in (items not shown before verification) | DOCUMENTED BP §6.5, §13.4 · D-021 |
| 3 | Tabs | New request · My requests (count) | MOCKUP |
| 4 | Stepper | 1 Items · 2 Request & reason · 3 Verify & evidence · 4 Pickup & refund · 5 Review (visited steps clickable) | MOCKUP |
| 5 | Step 1 — Items | Find by order number or store invoice; items grouped by order (delivery date/address, window badge); each item: select, title, condition, price, qty, serial ending, allowed request types, eligibility badge + reason (Eligible; Warranty only — outside return window; Not eligible — non-returnable category; Not yet — not delivered; Cancel instead — not dispatched (link cancels); In progress — existing RMA; Action needed — open claim); note for store purchases / items bought elsewhere; selected count; Continue | DOCUMENTED BP §6.3 "Eligible items", "Outside policy", "warranty route"; A22 · D-022; digital licences D-167 |
| 6 | Step 2 — Request & reason | Request-type cards (Return for refund, Replacement, Warranty repair (RMA), Dead on arrival) each enabled only if allowed for all selected items, with the reason when not; warranty note (provider, who handles the claim); reason select (category-specific list), since-when select, description textarea with counter; self-help tip callout (approved content) | DOCUMENTED BP §10.5, §7.5 · request types & DOA window D-022; reason lists D-139 |
| 7 | Step 3 — Verify & evidence | Serial number field + Verify (match → "matches the unit sold…", warranty active until…; mismatch → explanation, "not an automatic rejection", upload label photo); Photos (serial-label photo required badge; limits; uploaded tiles with remove; unsupported-format error; add photo); Condition checklist (original box, accessories, no physical/liquid damage, gifts/bundle items, personal data removed — required for data-bearing devices, non-original parts removed); warning "Serial not verified — request will need manual review" | DOCUMENTED BP §7.5 "Customer-uploaded device serials require validation", §6.3 "serial mismatch", "photos if needed"; A37 (no automatic accusation); §7.5 data erasure · limits D-112/D-113 |
| 8 | Step 4 — Pickup & refund | Return method cards: free pickup from address + pickup slot; drop at store + store select (hours, distance); pickup-unavailable callout; packing guidance; refund destination: original payment method (only option for prepaid) or bank account (COD orders only) | DOCUMENTED BP §6.3 "pickup/return instructions", §10.5 · D-013 (reverse pickup), D-020 (COD refund), BR-M13-16 |
| 9 | Step 5 — Review | Summary (item, order, request, reason, serial status, photos, method, refund to); policy snapshot (version, effective date, order date, key rules, full policy link); confirmation checkbox (details correct + personal data removed); error callout; Submit request | DOCUMENTED BP §10.5 ("policy version"), BR-M13-13 |
| 10 | Summary aside | Selected item(s), request type, warranty, return-by date, money line (estimated refund / refund if no replacement / repair cost under warranty with "quote first" note), "What happens after pickup" (quarantine), help (WhatsApp, chat) | DOCUMENTED BP §10.5 quarantine · repair quote D-169 |
| 11 | Done state | Submitted time; RMA number; summary; notification channels; View my requests / Back to account; "What happens next" plain-word 7-step tracker with next-update time; why we inspect (4 steps); before-pickup checklist (client-only); serial-mismatch note | DOCUMENTED BP §10.1, §10.5 · D-058, D-165 |
| 12 | My requests | Filter All / Open / Closed; request cards (RMA id, "New" badge, status, product, type · order · date, Help, 7-step bar with labels, body: action needed + upload + evidence deadline; refund pending at provider; replacement dispatched + Track replacement; resolved with serial history; rejected after inspection + photos + appeal/collect; new request + Cancel request); empty | DOCUMENTED BP §10.1 RMA states, §6.3 · appeal/cancel/evidence deadline D-169 |

**Components.** Stepper (23), wizard & cards (72), upload tiles (16), checkbox list (13), key-value (20), RMA progress
& request card (71), callout (10), empty (27).

**Forms & fields**

| Field | Type | Required | Validation (source) |
|---|---|---|---|
| Guest order number / phone / code | Text / tel / 6-digit | Yes (guest) | As P-S08 (D-021) |
| Find order | Text (order no. or store invoice) | No | Order must belong to the caller |
| Items | Checkboxes | ≥ 1 | Only eligible lines selectable (API-M13-01) |
| Request type | Card choice | Yes | Allowed for all selected items |
| Reason | Select | Yes | List per category (D-139) |
| Since when | Select | No | — |
| Description | Textarea | Yes | Length limit (MK counter "/ 1000" sample) |
| Serial number | Text + Verify | Yes for serialised items | Checked against the sale (API-M13-02); mismatch allowed with manual review |
| Photos | File upload (multiple) | Serial-label photo when required | Type/size/count limits (MK "Up to 6 · JPG or PNG · max 10 MB" are samples — D-112, D-113); unsupported format error |
| Condition checklist | Checkboxes | Personal-data item required for data-bearing devices | BP §7.5 |
| Return method | Card choice | Yes | Pickup only if serviceable (API-M12-02) |
| Pickup slot | Select | If pickup | From API-M12-02 |
| Store | Select | If drop-off | Stores with returns capability (API-M03-01) |
| Refund destination | Radio | If refund possible | Original method; bank account only for COD (D-020) |
| Confirmation | Checkbox | Yes | Error callout if unchecked (MK) |

**Actions**

| Action | API | Result |
|---|---|---|
| Guest verify | API-M10-10 → API-M10-11 | GAT for the order |
| Load eligible items | API-M13-01 (`order_id` or `store_invoice_number`) | Per-line eligibility, request types, policy version, `cancellable_instead` |
| Cancel instead | API-M10-09 | Cancellation of undispatched lines |
| Verify serial | API-M13-02 | Match / mismatch message |
| Upload / remove photo | API-M22-01 / API-M22-03 | File ids |
| Pickup slots | API-M12-02 | Slots or `NOT_SERVICEABLE` |
| Stores for drop-off | API-M03-01 | Stores |
| Policy snapshot | API-M04-04 (+ order policy version from API-M13-01) | Rules text |
| Submit request | API-M13-03 (Idem) | RMA number, state, next steps, policy snapshot; `POLICY_INELIGIBLE` per line |
| My requests / detail | API-M13-04 / API-M13-05 | Cards / detail |
| Add evidence later | API-M22-01 + API-M13-06 | Evidence attached |
| Cancel request / appeal | — (gap G-10, G-11) | D-169 |
| Chat / WhatsApp help | API-M16-03 / — | Handoff with RMA context |

**Tables / filters / search / pagination.** Requests filter (open/closed; D-080 paging).

**Modals / drawers.** None (wizard in page).

**Validation.** Step gating (≥ 1 item before step 2; required fields per step); server re-checks eligibility against the
policy version stored on the order (BR-M13-02, BR-M13-13).

**States**

| Type | Behaviour | Source |
|---|---|---|
| Outside policy | Item disabled with reason; alternative route (warranty) offered | BP §6.3 |
| Serial mismatch | Explanation + photo route; request proceeds flagged for staff review | BP §6.3; A37 |
| Warranty route | Only warranty type enabled, provider shown | BP §6.3 |
| Not delivered / not dispatched | "Not yet" / "Cancel instead" | BP §10.5 |
| Pickup not serviceable | Callout → store drop-off | BP §10.5 |
| Submission error | Error summary; idempotent retry | BP §10.3 |
| Loading / empty / error | Items skeleton; "no eligible items in the period"; retry | BP §22.5 |

**Permissions.** R-consumer own orders; R-dealer organisation orders per D-066 (MK dealer FAQ mentions a bulk RMA
option — MOCKUP-ONLY, D-066/D-022); verified guest (GAT) for one order; staff create RMAs in P-E04, not here.

**API dependencies.** API-M13-01 … API-M13-06, API-M12-02, API-M03-01, API-M04-04, API-M22-01, API-M22-03,
API-M10-09, API-M10-10, API-M10-11, API-M16-03.

**Backend / database.** BR-M13-01, -02, -03, -05, -06, -07, -08, -09, -12, -13, -16; BR-M12-09 · E-return_request,
E-return_line, E-attachment, E-order_line, E-serial_unit, E-return_policy, E-warranty_policy, E-fulfilment (reverse
pickup).

**Related pages.** P-S08, P-S09#returns, P-S13#returns/#warranty, shell chat.

**Conditional / mockup-only.** DOA and windows (D-022), COD bank refund (D-020), reverse pickup provider (D-013),
digital licence exclusion (D-167), cancel/appeal/evidence deadline/repair quote (D-169).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `REQUIRES_DECISION (D-022)`.

---
### 4.11 P-S11 — Dealer zone (B2B)

| Field | Value |
|---|---|
| Mockup | `store-dealer.html` |
| Purpose | Public business-buyer landing and application status (no private prices); for verified dealer members: approved price list, quick order, quotes, reorder history, business invoices and statements, team members (BP §6.3 Dealer account, §8.1–8.3, §3.1; PR1 §4 Wholesale) |
| Route | NOT SPECIFIED — D-163. Prototype: `?view=`, tab hashes `#overview #pricelist #bulk #quotes #reorder #invoices #team`, application-status switcher (Pending / Approved / Rejected / Suspended) not built |
| Evidence | DOCUMENTED (BP §6.3, §8.1–8.4, §29.2; T02, T03, T22) · MOCKUP |
| Modules | M08, M05, M10, M19, M02 |
| Phase · requirements | 1A (file upload for quick order 1B) · R03, R04 |

**UI sections — landing (guest, consumer, applicant; hidden for active dealers)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| L1 | Hero | "Dealer pricing for shops, integrators & companies"; Apply (→ P-S12#dealer); "Approved dealer? Sign in"; stats | DOCUMENTED BP §8.3 · approval time and tier samples D-067, D-018 |
| L2 | What approved dealers get | Private price list, quantity tiers, quick order by SKU, GST invoices & statements (e-invoice IRN), team roles, quotes for large orders, one-click reorders, named account manager | DOCUMENTED BP §3.1 (dealer needs), §8.3 · quick order/quotes D-121; statements D-019; IRN D-037; roles D-066; account manager MOCKUP-ONLY (gap G-17) |
| L3 | How approval works | Apply → business verification (GSTIN active on the registration source, legal name/PAN match, documents, possible call) → decision with reason (tier) → private price list (prepaid by default, active until review date) | DOCUMENTED BP §8.3 "a typed identifier alone is not verification"; A27 · D-067, D-019 |
| L4 | How quantity tiers work | Rules (per SKU per line, all units; ex-GST display; recalculated on quantity change; return adjustments explained; promotions don't stack unless stated; quote for very large/mixed); privacy statement; illustrative example table (marked "Illustrative") | DOCUMENTED BP §8.2 (illustrative only), §8.4 · D-018, D-016, D-082, D-017 |
| L5 | Track your application | Real status from the applicant's application: Pending review (stepper Submitted → GSTIN verified → Documents review → Decision, expected date, "you can still buy at public prices"); Approved (tier, validity, Sign in, Invite a team member); Rejected (reason, reviewer, "Update & re-submit", data-retention note); Suspended (reason, what is paused, "Upload renewed licence"); Approval expired (not drawn in MK — required by BP §6.3) | DOCUMENTED BP §6.3 Dealer account states "Pending, rejected, suspended, approval expired"; BR-M08-05 · D-067, D-036 |
| L6 | FAQ | Who can apply; why GSTIN is verified; minimum order; credit; several people; returns for dealers; approval expiry | MOCKUP · D-160 (minimum — conflicts with cart), D-019, D-066, D-067 |
| L7 | Final CTA | Apply; business sales desk (WhatsApp, phone, hours) | MOCKUP · D-074 |

**UI sections — dealer member workspace (active dealer only)**

| # | Section / tab | Content | Evidence · decisions |
|---|---|---|---|
| D1 | Business header | Initials, business name, tier badge, GSTIN verified badge, payment terms, price-list validity, address, signed-in member & role; account manager card; Quick order; Request a quote | DOCUMENTED BP §8.3 · D-066, D-019; account manager gap G-17; quotes D-121 |
| D2 | Overview | KPI tiles (open orders, purchases this month ex-GST, saved vs retail this FY incl. tier savings, quotes waiting); open orders (items summary, payment state, dispatch/transport reference, Track; awaiting-payment bank-transfer order with hold expiry and "Pay now"); unpaid-hold release note; updates for your business (price-list revision preview, new quote-only lot, document renewal reminder); callouts: prices private, payment terms prepaid, stock confirmed at checkout | DOCUMENTED BP §8.3, §8.4 · KPIs gap G-16; bank transfer D-012/D-019; hold duration D-026; reservation timing D-161 |
| D3 | Price list | Toolbar (search SKU/brand/model, category, condition, in stock only, count, export XLSX); table: product · SKU · warranty, condition, stock, retail incl. GST, your price ex-GST, tier columns (5+/10+ in MK), qty stepper, Add; empty; footer (list name, basis, updated, validity); paging | DOCUMENTED BP §8.1–8.3; T02, T22 · tiers D-018; export D-152 |
| D4 | Quick order | Paste area ("SKU, quantity" per line; separators; line limit; duplicates merged) + Check prices & stock + Clear; file upload (CSV/XLSX, template download, row limit) — 1B; order preview table (#, product, qty, availability incl. partner stock and "only N available" with shortage option: ship available now / quote for all / remove line; tier badge; unit ex-GST; line total; error rows: unknown SKU, unreadable line, product name instead of SKU with suggestion); status badge (ready / to check / errors); totals (subtotal ex-GST, GST estimate, estimated total); Request quote for large quantities; Download errors; Add valid lines to cart | MOCKUP; BP §26.7 Q64, §29.2 ("reduced quantity, explicit backorder/quote, or rejection"); BR-M10-12 · D-121, D-073; upload D-048 (1B) |
| D5 | Quotes | Table: quote id, requested date, items, delivery, status (quoted + expiry, under review, expired, declined by the business with reason), quoted price vs tier, actions Accept / Decline / Message / Request again; Request a quote form | MOCKUP; BP §29.2 · D-121, D-154 (validity) |
| D6 | Reorder history | Filters (placed by member, period); table: order, placed by, items (thumbnails, SKU × qty), paid ex-GST, status, today's price with difference, Reorder, Edit in quick order | DOCUMENTED BP §3.1 "repeat orders" · member filter D-066 |
| D7 | Invoices & GST | Buyer GSTIN & place of supply; Statement; Export for GST reconciliation; table: document (+ credit-note badge), order/RMA, date, taxable value, CGST, SGST, total, e-invoice status (generated / retry pending), PDF; notes (accounts members see invoices without price list; corrections via credit note) | DOCUMENTED BP §3.1 "business invoices", §14.2 · D-055, D-037, D-019, D-066 |
| D8 | Team & roles | Invite member; members table (name/contact, "You" badge, role, limits, status, 2-step state, last order, Edit; pending invitation with Resend / Cancel; removed member); callouts (removal revokes access, owner 2-step, order approvals above buyer limit); role-permission table (see dealer prices, place orders, request/accept quotes, see all business orders, invoices & statements, start returns, invite/remove members, change GSTIN/address) | DOCUMENTED BP §8.3 "who may invite… who can see its invoices" · D-066 (roles and matrix are samples), D-040; owner approval flow gap G-18 |

**Components.** Hero/benefit cards (40), stepper (23), status card (77), table (19), quantity stepper (14), tier
columns (50), quick-order preview (78), member/role tables (79), modal (29), callout (10), empty (27).

**Forms & fields**

| Form · field | Type | Required | Validation (source) |
|---|---|---|---|
| Price list filters | Text, selects, checkbox | No | API list params |
| Price list row quantity | Integer | Yes to add | ≥ 1; tier computed server-side |
| Quick order paste | Textarea | Yes to check | One "SKU, qty" per line; qty integer > 0; max lines (MK 200) D-080; unknown SKU/unreadable lines reported per row (API-M05-03) |
| Quick order file | CSV/XLSX upload | — | 1B; columns SKU, Qty; row limit (MK 500) sample; D-112 |
| Shortage option per row | Select | If short | Ship available / quote all / remove (BP §29.2) |
| Quote: product or SKU | Text | Yes | — |
| Quote: quantity | Integer | Yes | > 0 |
| Quote: needed by | Date | No | Future date |
| Quote: target price / unit | Money (ex-GST) | No | ≥ 0 |
| Quote: delivery | Select (ship to address / collect from branch / warehouse) | Yes | Options from account addresses & collection locations (D-061) |
| Quote: notes | Textarea | No | Length limit |
| Invite: work email or mobile | Text | Yes | Email or 10-digit mobile |
| Invite: role | Segmented (Buyer / Accounts in MK) | Yes | D-066 |
| Invite: order limit per order | Money | Buyer only | ≥ 0 (D-066) |

**Actions**

| Action | API | Result |
|---|---|---|
| Application status (landing, L5) | API-M08-21 | Status, reasons, requested actions |
| Update & re-submit / upload renewed licence | API-M22-01 + API-M08-22 | Re-submitted (D-067) |
| Business overview | API-M08-24 | Account, terms, updates |
| Open orders / reorder history | API-M10-08 (org scope, `placed_by`) | Lists |
| Track order | — | → P-S08 |
| Pay now (bank transfer / pending order) | API-M11-01 (`bank_transfer`) | Instructions (D-012, D-019) |
| Price list | API-M05-04 | Rows (`private, no-store`) |
| Export price list | API-M05-05 → API-M18-05 | Watermarked file (D-152) |
| Add from price list / quick order / reorder | API-M10-02 | Lines added; cart shows changes before payment |
| Check prices & stock (quick order) | API-M05-03 (lines or `file_id`) | Per-row result, `error_report_link` |
| Request a quote / request again | API-M05-06 | Quote request (D-121) |
| Quotes list | API-M05-07 | Rows |
| Accept quote | API-M10-06 (with `quote_id`) → API-M11-01 | Order at quoted price; stock reserved on accept |
| Decline quote | API-M05-09 | Declined |
| Message about a quote | API-M16-03 (`context.quote_id`) | Conversation |
| Quote detail | API-M05-02 | Quote version |
| Invoices / PDF | API-M19-01 / API-M19-02 | List / PDF |
| Statement / GST reconciliation export | API-M19-04 / API-M19-05 | Statement / export job (D-019, D-037) |
| Members | API-M08-25 | Members |
| Invite / edit / remove member | API-M08-26 / API-M08-27 | Invitation / updated (D-066) |
| Resend / cancel invitation | API-M02-18 / API-M02-19 | Updated |

**Tables / filters / search / pagination.** Price list (search, category, condition, in-stock; paging D-080); quick
order preview; quotes; reorder history (member, period); invoices; members; role-permission matrix (static content per
D-066).

**Modals / drawers.** `m-invite` (work email or mobile, role, order limit per order, expiry note, "never share your
login"; Send invitation).

**Validation.** As fields; server recomputes every price and tier (T10).

**States**

| Type | Behaviour | Source |
|---|---|---|
| Pending / rejected / suspended / approval expired | Landing status panels; dealer workspace hidden or paused; public prices apply | BP §6.3 |
| Price list expired | Workspace banner; checkout blocked with defined message (never zero) | BP §8.4 |
| Shortage in quick order | Row warning + options | BP §29.2 |
| Empty | No quotes / orders / invoices / pending invitations → empty rows with next action | BP §22.5 |
| Loading / error | Tab skeletons; tab retry; private responses never cached | BP §16.5 |
| Signed out | All private dealer data discarded; landing shown | T22 |

**Permissions**

| Role | Access |
|---|---|
| R-guest | Landing only (L1–L4, L6–L7); status tracker prompts sign-in |
| R-consumer / applicant | Landing + own application status (L5) |
| R-dealer owner (sample role) | All tabs; invite/remove members; approve over-limit orders (D-066) |
| R-dealer buyer (sample role) | Price list, quick order, own orders, request quotes; order limit (D-066) |
| R-dealer accounts (sample role) | Invoices & statements only; no price list (D-066) |
| Staff | Not via storefront; staff preview is P-E10 "view as dealer" (D-149) |

**API dependencies.** API-M08-21, API-M08-22, API-M08-24, API-M08-25, API-M08-26, API-M08-27, API-M02-18,
API-M02-19, API-M05-02, API-M05-03, API-M05-04, API-M05-05, API-M05-06, API-M05-07, API-M05-09, API-M10-02,
API-M10-06, API-M10-07, API-M10-08, API-M11-01, API-M16-03, API-M18-05, API-M19-01, API-M19-02, API-M19-04,
API-M19-05, API-M22-01, API-M02-01.

**Backend / database.** BR-M08-01…05; BR-M05-04, -06, -09, -11, -15, -16, -17, -18; BR-M10-12; BR-M02-13 ·
E-business_account, E-business_account_member, E-dealer_application, E-price_list, E-price_list_item,
E-quantity_tier, E-quote, E-quote_line, E-invitation, E-invoice_reference, E-sales_order, E-export_job.

**Related pages.** P-S01 (dealer modules), P-S02/P-S03 (dealer prices), P-S06, P-S07, P-S08, P-S09, P-S12.

**Conditional / mockup-only.** Quick order & quotes (D-121), bulk upload (1B, D-048), member roles & limits (D-066),
statements/credit (D-019), GST exports & e-invoice (D-037), export watermark (D-152), account manager (gap G-17),
minimum order (D-160), bulk RMA (D-022).

**Status.** `REQUIRES_DECISION (D-049 · global)`; landing & application status `NOT_STARTED`; dealer workspace
`REQUIRES_DECISION (D-066)`; quick order/quotes `REQUIRES_DECISION (D-121)`.

---

### 4.12 P-S12 — Sign in · register · dealer & vendor application

| Field | Value |
|---|---|
| Mockup | `store-login.html` |
| Purpose | Customer sign-in (one-time code or email + password), account creation with separate consent, dealer (B2B) application, public vendor application (BP §3.1, §8.3, §11.1, §13.3, §19.1; T10) |
| Route | NOT SPECIFIED — D-163. Prototype: `#signin #register #dealer #vendor`, `?done=dealer·vendor`, `?view=`; "any 6 digits work except 000000" hint is not built |
| Evidence | DOCUMENTED (BP §8.3, §11.1, §13.3, §19.1) · MOCKUP |
| Modules | M02, M08, M14, M22 |
| Phase · requirements | 1A (vendor tab 1B) · R03, R05 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Split layout | Left art panel (image, kicker, heading, copy, bullet list, footer facts — per tab, content samples); right form panel with title/subtitle per tab | MOCKUP · content D-142 |
| 2 | Tabs | Sign in · Create account · Apply as dealer · Sell with Tradex | MOCKUP |
| 3 | Sign in — mobile code | Mobile (+91) → "Send 6-digit code"; code step: sent-to masked number + Change, resend countdown → "Resend code", six digit boxes (auto-advance, backspace), error with attempts left and pause, "Verify & sign in", "Keep me signed in on this device" | MOCKUP ("Phone OTP sign-in with rate limits"); BP §19.1 · D-040, D-084, D-083, D-015 |
| 4 | Sign in — email & password | Email, password (show/hide), Forgot password? (m-forgot), generic error with attempts left before pause, keep signed in, Sign in; "if 2-step is on we'll also send a code" | MOCKUP · D-040, D-084 |
| 5 | Side notes | Guest checkout callout (continue to cart, track an order); approved-dealer note; supplier/vendor → vendor portal login ("store accounts can't access vendor tools"); terms/privacy notice; "we will never ask for your OTP" | DOCUMENTED BP §6.5 · D-021, D-102 |
| 6 | Create account | First name, last name, mobile (verified by code), email (for invoices), password optional with strength meter; contact preferences: service updates on WhatsApp, marketing (unticked by default); terms + privacy notice acceptance (versions); Create account; "Buying for a business? Apply as a dealer" | MOCKUP ("separate, unticked marketing consent"); BP §13.3 · D-040, D-058 |
| 7 | Apply as dealer | Callout (dealer prices only after approval; GSTIN verified, not trusted); 1 Business details (GSTIN + Verify with result card: legal name, status, constitution, state, registration date; invalid-format and cancelled-registration errors; legal name; trade name; PAN with match hint; trade type; expected monthly purchases; in business since; categories chips); 2 Address (registered address from registration record; deliver to registered address; delivery PIN with serviceability; or collect from branch); 3 Contact person (name, designation, mobile — becomes the owner login, email); 4 Documents (registration certificate, trade licence with quality error + Replace, optional shop-front photo; types/size); "bank details aren't needed — prepaid"; dealer terms acceptance; Submit application; "save and finish later" | DOCUMENTED BP §8.3; A27 · D-067 (required set, verification), D-066 (owner login), D-019, D-112; drafts gap G-19 |
| 8 | Dealer — submitted | Application number, time; "Pending review" + stepper (Submitted, GSTIN verified, Document review, Decision); document-attention callout; next steps (notification, public prices until approved); Check status in Dealer zone; Continue shopping | DOCUMENTED BP §6.3 Dealer "Pending" · D-058 |
| 9 | Sell with Tradex (1B) | Callout (applying ≠ selling; nothing published before review); 1 Model cards: Supply stock (purchase orders), Supplier-fulfilment pilot, Marketplace seller (Phase 2 waitlist — hides the form, button "Join the waitlist"); 2 Business information (legal name, business type, GSTIN + active badge, PAN, warehouse/dispatch location, years in business, categories, approx. active SKUs, data-sharing method); 3 Contact (person, mobile, work email); 4 Documents (registration certificate, PAN, refurbishment & data-wipe process — required for refurbishers, brand authorisation optional); bank details only after approval with second-person check; supplier terms acceptance; Submit application; vendor portal login link | DOCUMENTED BP §3.2, §11.1 ("Public registration creates an applicant"), §11.5 (maker-checker) · D-047, D-048, D-007, D-046 (marketplace LATER), D-057 (data formats), D-068 |
| 10 | Vendor — submitted | Application number; "Under review — you're not a seller yet"; stepper (Received, Verification, Commercial review, Decision); next steps; Back to store; Contact us | DOCUMENTED BP §11.1 |

**Components.** Tabs (18), segmented control (4), OTP input (15), form fields (11–13), chips (8), GSTIN verify card
(77), upload tiles (16), stepper (23), status card (77), modal (29), callout (10).

**Forms & fields**

| Form · field | Type | Required | Validation (source) |
|---|---|---|---|
| Sign-in mobile | Tel (+91) | Yes | 10 digits; response never reveals whether an account exists (06-api API-M02-02) |
| One-time code | 6 boxes | Yes | All digits; attempts/lockout D-084 |
| Keep me signed in | Checkbox | No | Duration D-083 (MK "30 days" sample) |
| Email / password | Email, password | Yes | Generic invalid-credentials error; lockout D-084 |
| Forgot password (`m-forgot`) | Email or mobile | Yes | Generic response (API-M02-07) |
| Register: first name, mobile, terms acceptance | Text, tel (verified), checkbox | Yes | Mobile verified via API-M02-02/03 (`register`) |
| Register: last name, email, password | Text, email, password | No | Email format; password policy D-040 (MK "at least 10 characters, not a common password" sample); duplicate email → message (see §9 inconsistency I-06) |
| Register: service & marketing preferences | Checkboxes | No | Marketing unticked by default (BR-M08-06) |
| Dealer: GSTIN | Text (15, upper-case) | Yes | Format regex (MK); verified by API-M08-23; cancelled/inactive → blocking error |
| Dealer: legal name, PAN, trade type, expected monthly purchases | Text, text, select, select | Yes | PAN consistent with GSTIN (MK hint); option lists D-067 |
| Dealer: trade name, in business since, categories | Text, year, chips | No | Categories from API-M04-01 |
| Dealer: delivery PIN / collect from | Numeric 6 / select | One | Serviceability (API-M12-01); collection locations D-061 |
| Dealer: contact name, mobile, email | Text, tel, email | Yes | Formats |
| Dealer: designation | Text | No | — |
| Dealer: documents | Uploads | Per D-067 | Type/size/quality (D-112, D-113); errors shown per file |
| Dealer terms acceptance | Checkbox | Yes | Terms version recorded (E-terms_acceptance) |
| Vendor: model | Card choice | Yes | Marketplace = waitlist only (D-046) |
| Vendor: legal name, business type, GSTIN, PAN, dispatch location, contact person, mobile, work email | Text/select | Yes | Formats; GSTIN verified (API-M08-23 `vendor_application`) |
| Vendor: years, categories, approx. SKUs, data-sharing method | Select/chips | No | D-057 |
| Vendor: documents | Uploads | Refurbishers: process document required | D-068, D-112 |
| Supplier terms acceptance | Checkbox | Yes | Version recorded |

**Actions**

| Action | API | Result |
|---|---|---|
| Send code / verify & sign in | API-M02-02 (`sign_in`) / API-M02-03 | Session (D-083) → return path or P-S09 |
| Password sign-in / second factor | API-M02-04 / API-M02-05 | Session or MFA challenge (D-040) |
| Forgot password | API-M02-07 | Generic confirmation |
| Register (verify mobile, create) | API-M02-02/03 (`register`) → API-M08-01 | Account + session; consent records |
| Verify GSTIN (dealer / vendor) | API-M08-23 | Verification result (never treated as approval) |
| Upload documents | API-M22-01 | File ids (private) |
| Submit dealer application | API-M08-20 | Application `pending_review` |
| Dealer application status | API-M08-21 | Status panel / P-S11 |
| Submit vendor application / join waitlist | API-M14-01 | Applicant `under_review` / waitlist (D-047, D-046) |
| Serviceability for delivery PIN | API-M12-01 | Result line |

**Tables / filters / search / pagination.** None. **Modals / drawers.** `m-forgot`.

**Validation.** Formats above; server authoritative; no account-existence disclosure on sign-in/reset (BR-M02-09).

**States**

| Type | Behaviour | Source |
|---|---|---|
| Code sent / resend cooldown / wrong code / paused | Per D-084 | BP §19.1 |
| Invalid credentials | Generic message | BP §19.1 |
| GSTIN invalid / inactive / provider unavailable | Error card / "can't verify right now — we'll verify during review" | BP §8.3; `PROVIDER_UNAVAILABLE` |
| Document rejected on upload | Per-file error + Replace | BP §19.1 |
| Submitted | Status card (dealer / vendor) | BP §6.3, §11.1 |
| Already signed in | Redirect away from sign-in; dealer/vendor tabs still available | MOCKUP |
| Loading / error | Button busy; error summary | BP §22.5 |

**Permissions.** Public (rate-limited). Dealer application needs a customer account per D-040 (API-M08-20: CUS or PUB
creating an account). Vendor applicant becomes R-vendor_applicant (portal access per D-047/D-102).

**API dependencies.** API-M02-02, API-M02-03, API-M02-04, API-M02-05, API-M02-07, API-M08-01, API-M08-20,
API-M08-21, API-M08-23, API-M14-01, API-M22-01, API-M12-01, API-M04-01.

**Backend / database.** BR-M02-09, -10, -11, -16; BR-M08-01, -02, -06; BR-M14-01, BR-M14-02, BR-M14-08, BR-M14-09 ·
E-user_account, E-customer, E-consent_record, E-terms_acceptance, E-verification_challenge, E-dealer_application,
E-vendor_application, E-attachment, E-user_session.

**Related pages.** P-S09, P-S11, P-S06/P-S07 (return path), vendor portal P-V01.

**Conditional / mockup-only.** Authentication methods & customer 2-step (D-040), password migration/reset (D-039),
guest note (D-021), vendor tab (1B; D-047, D-048), supplier-fulfilment pilot (D-007), marketplace waitlist (D-046),
application drafts (gap G-19).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `REQUIRES_DECISION (D-040)`; dealer tab `REQUIRES_DECISION
(D-067)`; vendor tab `REQUIRES_DECISION (D-047)` (phase 1B).

---

### 4.13 P-S13 — Help centre & policies

| Field | Value |
|---|---|
| Mockup | `store-help.html` |
| Purpose | FAQ search, guided help and chat, WhatsApp, phone/email, support hours with after-hours state; versioned policies (grades, warranty, shipping, returns, terms, privacy), grievance officer and stores & hours (BP §6.3 Help, §13.1, §13.4, §19.2; PR2 §3 Support) |
| Route | NOT SPECIFIED — D-163. Prototype: anchors `#faq #contact #grades #warranty #shipping #returns #terms #privacy #grievance #stores`, `?hours=closed`, `?view=`; the "Support right now" Open/After-hours switcher is not built |
| Evidence | DOCUMENTED (BP §6.3 Help, §13.4, §19.2) · MOCKUP |
| Modules | M16, M04, M03, M12, M09 |
| Phase · requirements | 1A (Level 2 WhatsApp 1B) · R11, R14, R19 |

**UI sections (mockup order)**

| # | Section | Content | Evidence · decisions |
|---|---|---|---|
| 1 | Hero | Greeting (name if signed in), search box, Search, popular chips; "Support right now" panel (chat with a person status/wait, WhatsApp status, phone status, guided help & order tracking 24×7) | DOCUMENTED BP §6.3 Help "support hours", "outside hours" · D-074 |
| 2 | Topic cards | Orders & tracking, Payments & refunds, Returns, Warranty, Grades, Shipping, Dealer accounts (→ P-S11), Account & privacy | MOCKUP |
| 3 | FAQ | Meta line (approved content version, updated date; result count when searching); group filter (All / Orders / Payments / Returns / Refurbished); grouped accordions; empty "No answers for …" + Chat with us + Clear search | DOCUMENTED BP §13.4 "versioned approved content"; BP §4 search measures |
| 4 | Contact us | After-hours callout with reference; channel cards: Chat (hours, status, Start chat), WhatsApp (number, hours, status, Open WhatsApp), Phone (number, hours, status, Request a call-back), Email (address, reply time, Write to us); example handoff transcript (marked "Example"); anti-fraud note → grievance | DOCUMENTED BP §6.3 Help ("bot failure, human handoff"), §13.1, §13.4; T24 · D-074, D-014 |
| 5 | Policies & guides navigation | Sticky table of contents with active-section highlight | MOCKUP |
| 6 | Condition grades | Standard version/effective/approver; grade table (cosmetic, functional, battery health, accessories & box, warranty, returns) incl. "not sold" row; every unit also shows; keyboard & OS; data wipe; footnote | DOCUMENTED BP §6.6 · D-023 |
| 7 | Warranty explained | Manufacturer vs seller warranty cards; durations table by condition; not covered; how to claim (7 steps); Start a warranty claim (→ P-S10), See my devices (→ P-S09#devices) | DOCUMENTED BP §6.1, §6.6, §7.5 · D-022 |
| 8 | Shipping & delivery | Dispatch cut-off; zones table (delivery time, charges); PIN check; insured/OTP note; COD rules list; delivery failure & return-to-origin | DOCUMENTED BP §6.5, §10.5, §10.6 · D-162, D-020, D-013 |
| 9 | Returns & refunds | Version, effective, previous version, compare versions; table by condition (window, DOA, replacement, refund to); non-returnable list; refund timelines; quarantine callout; Start a return / My requests | DOCUMENTED BP §10.5, BR-M13-13 · D-022 |
| 10 | Terms of use (summary) | Version, effective, download full terms; seller details (name, company identifiers, registered office, contact); key terms list | DOCUMENTED BP §19.2 "Configurable seller/business details, clear prices, terms" · D-037, D-008 |
| 11 | Privacy notice (summary) | Version, effective, law referenced; what we collect & why; retention table; rights → P-S09#privacy; data sharing | DOCUMENTED BP §19.2–19.3 · D-036, D-037 |
| 12 | Grievance officer | Officer details (name, role, company, address, email, phone/hours, response commitments); national helpline; Raise a grievance form | DOCUMENTED BP §19.2 ("complaints"); MK anno "Consumer Protection (E-Commerce) Rules" · D-037 |
| 13 | Stores & hours | Store cards (name, address, phone, open/closed status, weekly hours, capability badges: pickup, returns, service desk, demo zone, dealer collection); warehouse "no walk-in"; holiday hours note | MOCKUP; BP §9.5 · D-061; hours content entity gap EG-05 |

**Components.** Search input (12), chips (8), help channel card (76), accordion (35), table (19), key-value (20),
store card (75), form fields (11), upload tiles (16), callout (10), empty (27), PIN checker (52).

**Forms & fields**

| Field | Type | Required | Validation (source) |
|---|---|---|---|
| Help search | Text | No | — (API-M16-01 `q`) |
| FAQ group | Segmented | No | Categories from API-M16-01 |
| PIN (shipping) | Numeric 6 | To check | 6 digits (MK) |
| Grievance: order / request number | Text | No | Format per D-123 |
| Grievance: about | Select (refund/return, warranty decision, delivery, privacy, staff conduct, other) | Yes | Categories D-037 |
| Grievance: what happened | Textarea | Yes | Length limit |
| Grievance: attachments | Upload | No | D-112 |
| Call-back request | Contact (signed-in number or entered) | Yes | Consent for call (D-058); hours D-074 |
| Write to us (email enquiry) | Form not drawn in MK | — | Gap G-20 |

**Actions**

| Action | API | Result |
|---|---|---|
| FAQ search & list | API-M16-01 | Answers (versioned); zero-result state |
| Support hours / guided help | API-M16-02 | Hours state, guided nodes |
| Start chat | API-M16-03 → shell chat | Conversation reference |
| Open WhatsApp | — | Click-to-chat (D-014) |
| Request a call-back / Write to us / Submit grievance | API-M16-11 (`callback` / `enquiry` / `grievance`) + API-M22-01 | Ticket / grievance reference (D-074, D-037) |
| Policies & versions (grades, warranty, returns, shipping, terms, privacy, grievance) | API-M04-04 | Text + previous versions |
| Download full terms | API-M04-04 (document) | File (D-111) |
| PIN check | API-M12-01 | Serviceability message |
| Stores & hours | API-M03-01 | Store cards |

**Tables / filters / search / pagination.** FAQ search + group filter; grade, warranty, shipping, returns, retention
tables (content from API).

**Modals / drawers.** None (chat opens the shell widget).

**Validation.** Grievance required fields; PIN format.

**States**

| Type | Behaviour | Source |
|---|---|---|
| Outside hours | Channel cards show closed/auto-reply; after-hours callout with reference; guided help available | BP §6.3 Help |
| Bot failure / human handoff | Chat hands over with context | BP §6.3; T24 |
| FAQ no results | "No answers for …" + Chat with us | MOCKUP |
| Loading / error | FAQ and policies server-rendered; channel status loads after; failure → static contact details | BP §22.5 |

**Permissions.** Public; greeting and call-back to registered number when signed in; order-specific help only after
verification (BP §13.4; T23).

**API dependencies.** API-M16-01, API-M16-02, API-M16-03, API-M16-11, API-M04-04, API-M12-01, API-M03-01,
API-M22-01, API-M02-01.

**Backend / database.** BR-M16-04, -06, -09, -10, -12, -13, -15; BR-M04-15; BR-M13-13 · E-approved_answer,
E-support_conversation, E-support_ticket, E-return_policy, E-warranty_policy, E-condition_grade,
E-configuration_version, E-location, E-attachment.

**Related pages.** P-S04, P-S09, P-S10, P-S11, P-S08, shell chat.

**Conditional / mockup-only.** Grievance officer & legal pages (D-037), support hours/SLA (D-074), shipping charges &
delivery OTP (D-162), COD rules (D-020), grade rubric (D-023), policies (D-022), store pickup/demo zone (D-061).

**Status.** `REQUIRES_DECISION (D-049 · global)`; core `REQUIRES_DECISION (D-037, D-074)`; policy content
`REQUIRES_DECISION (D-022, D-023, D-162)`.

---
## 5. Page ↔ API matrix

● = the page (or shell) calls the endpoint. Derived from the "Actions" tables in §2 and §4; it extends the
`06-api.md` §7.3 screen map with calls this plan identified (e.g. API-M08-24 on P-S06, API-M10-07 on P-S11,
API-M27-01 in storefront routing). API-M27-02 is used by server-side sitemap generation, not by a page.

| API | Method | Purpose | S01 | S02 | S03 | S04 | S05 | S06 | S07 | S08 | S09 | S10 | S11 | S12 | S13 | Shell |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| API-M02-01 | GET | Current principal and server-derived context | ● | ● | ● |  |  | ● | ● | ● |  |  | ● |  | ● | ● |
| API-M02-02 | POST | Request a one-time code |  |  |  |  |  |  | ● |  | ● |  |  | ● |  |  |
| API-M02-03 | POST | Verify code; sign in or return a verification token |  |  |  |  |  |  | ● |  | ● |  |  | ● |  |  |
| API-M02-04 | POST | Password sign-in (customer email+password; staff; vendor) |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |
| API-M02-05 | POST | Second factor during sign-in |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |
| API-M02-06 | DELETE | Sign out |  |  |  |  |  |  |  |  | ● |  |  |  |  | ● |
| API-M02-07 | POST | Request password reset link |  |  |  |  |  |  |  |  | ● |  |  | ● |  |  |
| API-M02-09 | PUT | Change own password |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M02-10 | GET | List own active sessions |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M02-11 | POST | Sign out one session or all others |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M02-12 | POST | Start MFA / 2-step enrolment |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M02-13 | POST | Confirm enrolment |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M02-14 | POST | Regenerate backup codes (old codes invalidated) |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M02-15 | GET | Own sign-in/security activity (vendor admin: organisation) |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M02-18 | POST | Resend an invitation |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M02-19 | DELETE | Cancel a pending invitation |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M03-01 | GET | Public store/branch information | ● |  |  |  |  |  |  |  |  | ● |  |  | ● | ● |
| API-M04-01 | GET | Public category tree with filterable attributes | ● | ● |  | ● |  |  |  |  |  |  |  | ● |  | ● |
| API-M04-02 | GET | Public product detail |  |  | ● |  | ● |  |  |  |  |  |  |  |  |  |
| API-M04-03 | GET | Offers for a product in the caller's authorised price context |  | ● | ● | ● | ● | ● |  |  |  |  |  |  |  |  |
| API-M04-04 | GET | Published policy documents with version history |  |  | ● | ● |  |  | ● |  |  | ● |  |  | ● |  |
| API-M04-05 | GET | Curated compatible accessories/upgrades |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |
| API-M04-06 | GET | Bundles containing this product with component stock |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |
| API-M04-07 | GET | Moderated reviews & rating summary |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |
| API-M04-08 | POST | Submit a review |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |
| API-M04-09 | POST | Mark helpful or report a review |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |
| API-M04-11 | GET | Published product Q&A |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |
| API-M04-12 | POST | Ask a question |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |
| API-M04-14 | POST | Customer reports a specification issue |  |  | ● |  |  |  |  |  |  |  |  |  |  |  |
| API-M05-01 | POST | Quote a basket (price, tier, promotions, shipping, tax) with version and expiry |  |  |  |  |  | ● | ● |  |  |  |  |  |  |  |
| API-M05-02 | GET | Read a quote version |  |  |  |  |  |  | ● |  |  |  | ● |  |  |  |
| API-M05-03 | POST | Validate pasted/uploaded SKU+qty lines: price, tier, availability, per-row errors |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M05-04 | GET | Dealer's private price list (retail vs your price vs tiers) |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M05-05 | POST | Export private price list (watermarked with account) |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M05-06 | POST | Dealer requests a negotiated quote (large quantity / sourcing) |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M05-07 | GET | List quote requests/quotes |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M05-09 | POST | Dealer declines a quote |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M06-01 | GET | Availability by branch for a product (customer view) |  |  | ● |  |  |  | ● |  |  |  |  |  |  |  |
| API-M06-02 | GET | Public inspection report for a serialised refurbished unit |  |  | ● | ● |  |  |  | ● |  |  |  |  |  |  |
| API-M08-01 | POST | Create a consumer account |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |
| API-M08-02 | GET | Own profile |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-03 | PATCH | Update name, language, invoice GSTIN |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-04 | POST | Change mobile (codes to current and new number) or email |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-05 | GET | Saved addresses |  |  |  |  |  | ● | ● |  | ● |  |  |  |  | ● |
| API-M08-06 | POST | Add an address |  |  |  |  |  |  | ● |  | ● |  |  |  |  |  |
| API-M08-07 | PATCH | Edit an address / set default |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-08 | DELETE | Remove an address |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-09 | GET | Consent state per channel & purpose with history |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-10 | POST | Grant/withdraw consent (incl. "stop all marketing") |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-11 | POST | Guest newsletter/restock email subscription |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |
| API-M08-12 | GET | Own data-rights requests and status |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-13 | POST | Request my data, account deletion, nomination or correction |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-14 | GET | Registered units and warranty status |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-15 | POST | Register an in-store purchase by invoice + serial |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-16 | GET | Wishlist with price-drop/back-in-stock state |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-17 | POST | Add to wishlist | ● | ● | ● | ● |  |  |  |  |  |  |  |  |  |  |
| API-M08-18 | DELETE | Remove from wishlist |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-19 | POST | Create a view-only share link |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M08-20 | POST | Submit a dealer (B2B) application |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |
| API-M08-21 | GET | Own application / account approval status |  |  |  |  |  |  |  |  |  |  | ● | ● |  |  |
| API-M08-22 | PATCH | Update & re-submit, or upload renewed licence |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M08-23 | POST | Verify a GSTIN against the registration source |  |  |  |  |  |  | ● |  |  |  |  | ● |  |  |
| API-M08-24 | GET | Business account overview | ● |  |  |  |  | ● |  |  |  |  | ● |  |  |  |
| API-M08-25 | GET | Members, roles, limits |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M08-26 | POST | Invite a member |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M08-27 | PATCH | Change member role/limits or deactivate |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M09-01 | GET | Home modules: curated collections, deals, category tiles, brands, refurbished trust block; dealer modules when signed-in dealer | ● |  |  | ● |  |  |  |  |  |  |  |  |  | ● |
| API-M10-01 | GET | Current cart with revalidated price/stock notices |  |  |  |  |  | ● |  |  |  |  |  |  |  | ● |
| API-M10-02 | POST | Add an offer (or quick-order lines) to the cart | ● | ● | ● | ● | ● | ● |  |  | ● |  | ● |  |  |  |
| API-M10-03 | PATCH | Change quantity or save for later / move to cart |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |
| API-M10-04 | DELETE | Remove a line |  |  |  |  |  | ● | ● |  |  |  |  |  |  |  |
| API-M10-05 | DELETE | Empty the cart |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |
| API-M10-06 | POST | Place pending order: revalidate and reserve atomically |  |  |  |  |  |  | ● |  |  |  | ● |  |  |  |
| API-M10-07 | GET | Read order with separate order/payment/fulfilment/return states |  |  |  |  |  |  |  | ● | ● |  | ● |  |  |  |
| API-M10-08 | GET | List orders (customer history, dealer reorder history, staff work queues) |  |  |  |  |  |  |  |  | ● |  | ● |  |  |  |
| API-M10-09 | POST | Cancel eligible lines (customer request or staff) |  |  |  |  |  |  |  | ● | ● | ● |  |  |  |  |
| API-M10-10 | POST | Guest order access: order number + phone → OTP |  |  |  |  |  |  |  | ● | ● | ● |  |  |  | ● |
| API-M10-11 | POST | Verify OTP → order-access token (GAT) |  |  |  |  |  |  |  | ● | ● | ● |  |  |  | ● |
| API-M10-12 | POST | Re-send the secure tracking link to the phone/email on the order |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |
| API-M10-22 | GET | Customer opens a secure checkout link |  |  |  |  |  |  | ● |  |  |  |  |  |  |  |
| API-M11-01 | POST | Create or reuse a payment attempt for a pending order (hosted provider flow) |  |  |  |  |  |  | ● | ● |  |  | ● |  |  |  |
| API-M11-02 | GET | Payment state for the confirmation page (server-verified) |  |  |  |  |  |  | ● | ● | ● |  |  |  |  |  |
| API-M12-01 | GET | PIN serviceability, delivery options & estimates, COD eligibility, pickup options |  |  | ● |  |  | ● | ● |  | ● |  |  | ● | ● | ● |
| API-M12-02 | GET | Reverse-pickup slots for a return |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |
| API-M13-01 | GET | Per-line eligibility and allowed request types |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |
| API-M13-02 | POST | Validate a customer-entered serial against the original sale |  |  |  |  |  |  |  |  | ● | ● |  |  |  |  |
| API-M13-03 | POST | Request a return/replacement/warranty/DOA (customer) or new RMA (staff) |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |
| API-M13-04 | GET | Own requests / staff RMA queue |  |  |  |  |  |  |  |  | ● | ● |  |  |  |  |
| API-M13-05 | GET | RMA detail (customer: plain-word states; staff: case, unit, inspection, decisions, warranty/supplier, timeline) |  |  |  |  |  |  |  |  | ● | ● |  |  |  |  |
| API-M13-06 | POST | Add photos/documents to a request |  |  |  |  |  |  |  |  | ● | ● |  |  |  |  |
| API-M14-01 | POST | Public vendor application (creates an applicant, not a seller) |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |
| API-M16-01 | GET | Search approved, versioned FAQ answers |  |  |  | ● |  |  |  |  |  |  |  |  | ● | ● |
| API-M16-02 | GET | Deterministic guided-help menu (track order, product question, returns, dealer pricing, talk to a person) |  |  |  |  |  |  |  |  |  |  |  |  | ● | ● |
| API-M16-03 | POST | Start a web-chat conversation / hand off to a person with context |  |  |  |  |  |  |  |  |  | ● | ● |  | ● | ● |
| API-M16-06 | GET | Messages (polling or live per D-146) |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |
| API-M16-07 | POST | Send a message (customer web chat; agent reply; approved answer; template outside window) |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |
| API-M16-11 | POST | Create a ticket: staff escalation from a conversation, or customer request (report problem, invoice correction, grievance, call-back, email enquiry, sourcing request) |  | ● |  |  |  |  |  | ● | ● |  |  |  | ● |  |
| API-M18-05 | GET | Secure, expiring, audited download |  |  |  |  |  |  |  |  | ● |  | ● |  |  |  |
| API-M19-01 | GET | Invoices & credit notes (own, business account, staff) |  |  |  |  |  |  |  |  | ● |  | ● |  |  |  |
| API-M19-02 | GET | Invoice/credit-note PDF (generated once, re-rendered read-only) |  |  |  |  |  |  |  | ● | ● |  | ● |  |  |  |
| API-M19-03 | POST | ZIP of invoices for a financial year |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M19-04 | GET | Statement of account for a period |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M19-05 | POST | Invoice export in a GST reconciliation layout for the dealer |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| API-M20-06 | GET | Own back-in-stock / price-drop / saved-search alerts |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M20-07 | POST | Create/update an alert (notify me, save search, refurbished match, price drop) |  | ● | ● | ● |  | ● |  |  | ● |  |  |  |  |  |
| API-M21-01 | GET | Search/browse the approved visible catalog | ● | ● | ● | ● | ● |  |  |  |  |  |  |  |  |  |
| API-M21-02 | GET | Type-ahead suggestions (queries, products, popular) |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |
| API-M22-01 | POST | Upload a file (product media, return photos, dealer/vendor documents, bills, labels, settlement files, import files) |  |  |  |  |  |  |  |  | ● | ● | ● | ● | ● |  |
| API-M22-02 | GET | Authorised download/view (private files watermarked & logged where sensitive) |  |  |  |  |  |  |  |  | ● |  |  |  |  |  |
| API-M22-03 | DELETE | Remove an unsubmitted upload |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |
| API-M27-01 | GET | Resolve a legacy/archived URL to its redirect target |  |  | ● |  |  |  |  |  |  |  |  |  |  | ● |
| API-M27-02 | GET | Crawlable public URLs with last-modified (no private dealer variants) |  |  |  |  |  |  |  |  |  |  |  |  |  | ● |

Per-page count: S01 8 · S02 8 · S03 20 · S04 10 · S05 4 · S06 12 · S07 16 · S08 11 · S09 48 · S10 15 · S11 28 ·
S12 13 · S13 9 · Shell 19 (112 distinct endpoints). Endpoints `REQUIRES_DECISION` in `06-api.md` keep that status
here (e.g. cart D-129, guest access D-021, payments D-012).

## 6. Page ↔ role visibility matrix

Legend: **F** full use · **P** partial (see note) · **V** view only · **—** no access / not shown. GAT = verified
guest with an order-access token; LNK = secure checkout-link holder. Dealer member sub-roles are mockup samples
pending D-066. Staff roles (R-catalog_staff … R-owner) have no storefront-specific rights; staff work in P-E pages
(staff "view as dealer" = D-149). R-supplier uses the vendor portal (P-V), not the storefront.

| Page / area | R-guest | GAT | LNK | R-consumer | Dealer owner | Dealer buyer | Dealer accounts | Applicant (dealer) | R-vendor_applicant | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Shell (search, categories, cart, help, WhatsApp) | F | F | F | F | F | F | P | F | F | Accounts member: cart/checkout per D-066; account label varies by context |
| P-S01 Home — public sections | F | F | F | F | F | F | F | F | F | Dealer sees private prices |
| P-S01 dealer modules (reorder, business summary) | — | — | — | — | F | P | P | — | — | Visibility per D-066 |
| P-S02 Listing | F | F | F | F | F | F | P | F | F | Accounts may not see price list (D-066) |
| P-S03 Product detail | F | F | F | F | F | F | P | F | F | Reviews writing: verified purchasers only (D-041) |
| P-S03 dealer tier table | — | — | — | — | F | F | — | — | — | T02, T22 |
| P-S04 Refurbished | F | F | F | F | F | F | P | F | F | — |
| P-S05 Compare (D-042) | F | F | F | F | F | F | P | F | F | — |
| P-S06 Cart | P | — | — | F | F | F | — | F | P | Guest cart per D-129 |
| P-S07 Checkout | P | — | F | F | F | P | — | F | P | Guest per D-021; buyer order limit D-066 |
| P-S08 Order (confirmation/tracking) | P | F | P | F | F | P | V | F | — | Guest: lookup only until verified; buyer own orders (sample) |
| P-S09 Account — guest prompt | F | — | — | — | — | — | — | — | — | — |
| P-S09 Account — personal tabs | — | — | — | F | F | F | F | F | — | Dealers: business records in P-S11 |
| P-S09 wishlist (D-042) | — | — | — | F | F | F | — | F | — | — |
| P-S10 Returns & warranty | P | F | — | F | F | P | — | F | — | GAT for the verified order; dealer bulk RMA MOCKUP-ONLY |
| P-S11 landing & application status | F | — | — | F | — | — | — | F | — | Hidden for active dealers |
| P-S11 overview / open orders | — | — | — | — | F | P | V | — | — | D-066 |
| P-S11 price list & export | — | — | — | — | F | F | — | — | — | Export D-152 |
| P-S11 quick order & quotes (D-121) | — | — | — | — | F | P | — | — | — | Buyer: request only (sample) |
| P-S11 reorder history | — | — | — | — | F | P | — | — | — | Buyer own orders (sample) |
| P-S11 invoices, statements, GST exports | — | — | — | — | F | P | F | — | — | Buyer own orders (sample) |
| P-S11 team & roles | — | — | — | — | F | V | — | — | — | Only owner invites/removes (sample) |
| P-S12 sign in / register | F | F | F | P | P | P | P | P | F | Signed-in users are redirected from sign-in |
| P-S12 dealer application | P | — | — | F | — | — | — | V | — | Account required per D-040 |
| P-S12 vendor application (1B) | F | — | — | F | — | — | — | — | V | D-047 |
| P-S13 Help & policies | F | F | F | F | F | F | F | F | F | Order-specific help after verification |

## 7. API gaps found

> **Resolved 2026-09-27:** every gap below is resolved in `06-api.md` §8 "Gap resolution" (new endpoint ID, existing endpoint, or rejected with reason). Use the API IDs from `06-api.md`; the local gap refs here are historical.

Operations the storefront needs that have no endpoint (or no field) in `06-api.md`. No IDs are invented; the owner
of `06-api.md` decides. Gap IDs `G-##` are local to this file.

| # | Screen · element | Needed operation / field | Source | Related decision |
|---|---|---|---|---|
| G-01 | P-S02 deals mode; shell "Deals"; P-S01 "See all deals" | Filter/listing of products on an approved promotion ("deals") in API-M21-01 | MK:store-listing.html `?deals=1`, store-home.html | D-043, D-142 |
| G-02 | P-S02 search head "Search instead for {original}" | Flag on API-M21-01 to disable spelling correction/synonyms for one request | MK:store-listing.html `&exact=1`; BP §6.4 | D-032 |
| G-03 | P-S02 unavailable card, P-S03 variant-unavailable banner | Expected restock date (and, only if approved, waiting count) in API-M04-03 / API-M21-01 | MK:store-listing.html "Restock expected 8 Oct · 3 people waiting", store-product.html | D-073 (disclosed lead time), D-141 |
| G-04 | P-S03 buy box, P-S07 COD tab, P-S13 shipping | COD ineligibility reasons (not only `cod_eligible`) in API-M12-01 | MK:store-product.html, store-checkout.html | D-020 |
| G-05 | P-S03 "Price updated since your last visit" | Source of the previously seen price (server history or device-held snapshot) | MK:store-product.html `state=price`; BP §6.3 "price changed" | D-164 |
| G-06 | P-S04 "Unit history" timeline | Public unit history events (received, inspected, wiped, graded, listed) with masked references — API-M06-02 returns inspection fields only | MK:store-refurbished.html#unit; BP §6.6 | D-165 |
| G-07 | P-S07 payment step | Customer-facing lists from the provider: saved card tokens, UPI VPA validation, EMI plans, net-banking banks | MK:store-checkout.html | D-012, D-062 |
| G-08 | P-S05 "Share" comparison link | Persist a comparison and return a share URL | MK:store-compare.html | D-042, D-141 |
| G-09 | P-S08 `m-cancel` reason select | Customer cancellation sub-reason (API-M10-09 allows only `customer_request` for customers) | MK:store-order.html | D-139 |
| G-10 | P-S10 "Cancel request" | Customer withdraws an open RMA | MK:store-returns.html#requests | D-169, D-150 |
| G-11 | P-S09/P-S10 "Appeal", "collect the item" | Appeal a rejected RMA decision; arrange collection of a rejected item | MK:store-account.html#returns, store-returns.html | D-169 |
| G-12 | P-S08 "Proforma invoice"; P-S09 "Receipt" for cancelled order | Proforma document before dispatch; payment receipt when no tax invoice exists | MK:store-order.html, store-account.html#orders | D-055, D-111 |
| G-13 | P-S09 "Resend delivery OTP"; P-S08 proof of delivery | Delivery-OTP resend and proof-of-delivery exposure | MK:store-account.html, store-order.html | D-162, D-013 |
| G-14 | P-S09 devices "Card" | Warranty card document download | MK:store-account.html#devices | D-022, D-111 |
| G-15 | P-S09 profile | Disable customer 2-step; new-sign-in alert preference | MK:store-account.html#profile | D-040 |
| G-16 | P-S11 overview KPI tiles | Dealer KPIs (purchases this month, saved vs retail, tier savings, quotes waiting) | MK:store-dealer.html#overview | D-049 (confirm in UI sign-off), D-121 |
| G-17 | P-S11 header, benefits | Business account's assigned account manager (name, branch, contact) | MK:store-dealer.html | D-066 |
| G-18 | P-S11 team "Order approvals" | Owner approval of a buyer's over-limit cart/order (request, notify, approve/decline) — API-M10-06 only returns `ORDER_LIMIT_EXCEEDED` | MK:store-dealer.html#team | D-066 |
| G-19 | P-S12 dealer form "save and finish later" | Save/resume a dealer application draft | MK:store-login.html#dealer | D-067 |
| G-20 | P-S13 "Write to us" | API exists (API-M16-11 `enquiry`) but the form fields are not in the mockup | MK:store-help.html#contact | D-074 |
| G-21 | P-S08 guest "Create account"; P-S09 "Branch purchases … linked automatically" | Link past guest orders / branch purchases to a newly created or existing account after verification | MK:store-order.html, store-account.html#orders; BP §13.4 (no merge on name match) | D-168, D-133 |
| G-22 | P-S09 `m-delete` | Deletion eligibility pre-check listing blockers (open orders, open RMAs, pending refunds) | MK:store-account.html m-delete; BP §19.3 | D-060 |
| G-23 | P-S09 orders "licence key revealed"; P-S10 non-returnable ESD | Digital licence key delivery/reveal | MK:store-account.html, store-returns.html | D-167 |
| G-24 | P-S07 reservation timer from step 1; P-S06 "reserved when you start checkout" | Reservation before a pending order exists (API-M10-06 reserves at placement) | MK:store-checkout.html, store-cart.html; BP §10.2 | D-161 |
| G-25 | P-S01 continue shopping, P-S02/P-S06 recently viewed, P-S03 similar, P-S05 often compared, P-S06 complete your setup, "popular right now" | Personalised/curated rail sources beyond API-M21-01 category search and API-M04-05 | MK store pages | D-164, D-142 |
| G-26 | Password-reset landing, invitation acceptance (dealer members) | Screens for API-M02-08, API-M02-16/17 have no mockup page | 06-api index ("no mockup screen") | D-040 (registry request §11) |
| G-27 | P-S13 "Download full terms (PDF)" | Downloadable policy document (API-M04-04 returns content) | MK:store-help.html#terms | D-037, D-111 |
| G-28 | P-S03/P-S04 FAQ "reserve it online and view it at a store (held 24 h)" | Reserve-to-view at a branch | MK:store-product.html#qa, store-refurbished.html FAQ | D-061 |

## 8. Entity gaps found

> **Resolved 2026-09-27:** every gap below is resolved in `03-database.md` "Entity gap resolution (2026-09-27)". Use the entity/column definitions from `03-database.md`.

Gap IDs `EG-##` are local to this file (not entity IDs).

| # | Needed data | Where shown | Current model | Source | Decision |
|---|---|---|---|---|---|
| EG-01 | Reference price (MRP) and its source per SKU/offer, used for "% off", "Discount on MRP", "You save", deals | P-S01–P-S07 price block, cart, checkout, deals | API-M04-03 returns `reference_price?`; no entity column | MK price block; BP §6.1 "no fake discounts" | D-166 |
| EG-02 | Reservation (hold) not yet linked to an order line (checkout-start hold) | P-S07 timer | E-reservation.order_line_id is mandatory ("holds outside orders are MOCKUP") | MK:store-checkout.html | D-161 |
| EG-03 | Address-level GSTIN/business name and delivery-window note ("GSTIN on invoice", "Weekdays 9–6 only") | P-S09 addresses | E-address has no GSTIN/window fields (E-customer.invoice_gstin only) | MK:store-account.html#addresses | D-037, D-049 |
| EG-04 | Order-level minimum order value (dealer and/or consumer) | P-S06 dealer summary | Only E-price_list_item.minimum_order_qty (per SKU) | MK:store-cart.html; BP §6.3 | D-160 |
| EG-05 | Public store details: weekly & holiday hours, public phone, customer-facing flag, service badges (service desk, demo zone, dealer collection) | Shell footer, P-S01, P-S13 stores, P-S10 drop-off | E-location has address and `capabilities` (stock_holding, online_dispatch, customer_pickup, branch_sale, returns_receiving) only; API-M03-01 promises "hours (content)" | MK:store-help.html#stores, store-home.html | D-061, D-142 |
| EG-06 | Account manager assignment on a business account | P-S11 | E-business_account has none | MK:store-dealer.html | D-066 |
| EG-07 | Dealer application `draft` and `needs_changes/resubmitted` states | P-S11 L5 "Update & re-submit", P-S12 drafts | E-dealer_application.state {submitted, under_review, approved, rejected, withdrawn} | MK:store-dealer.html, store-login.html; BP §6.3 | D-067 |
| EG-08 | Customer sign-in-alert preference | P-S09 profile | E-user_account has `mfa_enrolled`, `mfa_method` only | MK:store-account.html#profile | D-040 |
| EG-09 | Data-request type `nomination` | P-S09 privacy "Nominate someone" | E-data_request.request_type lacks `nomination` although API-M08-13 accepts it | MK:store-account.html#privacy | D-037, D-060 |
| EG-10 | Digital licence item and key reveal record | P-S09 orders, P-S10 | None | MK:store-account.html, store-returns.html | D-167 |
| EG-11 | Business-account order approval request (buyer over limit) | P-S11 team | E-business_account_member.order_limit only; E-approval_request is staff-oriented | MK:store-dealer.html#team | D-066 |

## 9. Source inconsistencies noted (for the orchestrator)

| # | Inconsistency | Where | Plan treatment |
|---|---|---|---|
| I-01 | Cart says dealer orders need a minimum order value; dealer FAQ says "No minimum order value" | MK:store-cart.html vs MK:store-dealer.html FAQ | D-160 |
| I-02 | Reservation timing: cart/checkout reserve "when you start checkout" (timer from address step); dealer zone says stock is "only reserved when you place the order"; quotes "reserved when you accept"; API-M10-06 reserves at placement (BP §10.2 "Confirm basket → reserve") | MK:store-cart.html, store-checkout.html, store-dealer.html; 06-api §4.3 | D-161 |
| I-03 | Unpaid hold durations differ across the mockup (15 min checkout, 30 min dealer unpaid, NEFT deadline, 24 h pickup/view holds, 3-day pickup hold) — all samples | MK store pages | D-026, D-061, D-162 |
| I-04 | Account page shows 2-step verification for customers (MOCKUP-ONLY) while BP requires MFA only for privileged accounts | MK:store-account.html; BP §18.2 | D-040 |
| I-05 | Help centre shows consumer COD "confirmed by one-time code before dispatch" and account COD pause after refusals — COD is CONDITIONAL and these rules are undocumented | MK:store-help.html#shipping | D-020 |
| I-06 | Registration shows "This email already has a Tradex account", while sign-in, reset and API-M02-02/07 avoid disclosing account existence | MK:store-login.html#register vs 06-api API-M02-02, API-M02-07, API-M08-01 (generic 409) | Treat as generic message per 06-api; confirm under D-084 / D-040 |
| I-07 | RMA progress uses "Pickup" as a step; BP §10.1 RMA state is "in transit" | MK:store-account.html, store-returns.html | Customer label mapping D-165 |
| I-08 | Mockup exposes internal references to customers (reservation ids, payment attempt keys, price-rule ids, supplier name/vendor code, technician names, rider phone) | MK:store-checkout.html, store-order.html, store-product.html, store-refurbished.html | D-165 |
| I-09 | 06-api §7.3 maps P-S11 without API-M10-07 and P-S06 without API-M08-24; this plan adds them (read-only uses) | 06-api §7.3 | §5 matrix |
| I-10 | 06-api maps "Frequently bought together" to API-M04-06 (bundles), but the mockup states it is "simply separate items added together" | MK:store-product.html#fbt-sec vs 06-api API-M04-06 | D-072 / D-164 |

## 10. Proposed new decisions

Reserved range for this file: D-160–D-169 (all proposed `OPEN`). None is decided here.

| ID | Question | Documented options / proposal (source) | Approver | Blocks |
|---|---|---|---|---|
| D-160 | **Minimum order rules**: are minimum quantities per SKU and/or a minimum order value applied (for dealers and/or consumers), and how is a "minimum quantity failure" shown? | BP §6.3 Cart state "minimum quantity failure"; `03-database.md` E-price_list_item.minimum_order_qty (per SKU); MK:store-cart.html dealer minimum order value (sample ₹10,000 excl. GST) vs MK:store-dealer.html FAQ "No minimum order value". Options: (a) per-SKU minimum only; (b) per-SKU + order-value minimum for dealers; (c) none | Owner / sales | P-S06 minimum state, P-S11 quick order, API-M05-01 notices, entity gap EG-04 |
| D-161 | **When is stock reserved in the web checkout**, and what does the countdown show? | BP §10.2 "Confirm basket → validate price and reserve stock → pending order and reservation expiry → create payment attempt"; 06-api API-M10-06 reserves at "Place order"; E-reservation requires an order line; MK:store-cart.html "reserved for 15 minutes when you start checkout", MK:store-checkout.html timer from step 1, MK:store-dealer.html "only reserved when you place the order". Options: (a) reserve at "Place order" (timer shown from payment step); (b) reserve at checkout entry (needs a pre-order hold — entity gap EG-02, API gap G-24); durations stay D-026 | Owner / technical lead | P-S06 note, P-S07 timer & expired state, API-M10-06 sequencing, E-reservation |
| D-162 | **Delivery options, shipping charges and delivery-handover rules shown to customers**: which methods (standard, express, pickup), charge rules (free-delivery threshold, zone fees, COD fee), dispatch cut-off messaging, insured/high-value handover with delivery OTP, pickup hold period | BP §6.1 "Show… shipping terms", §6.5 "Make shipping charges and tax totals clear before final confirmation", §8.1 step 5, §10.5; MK:store-checkout.html, store-help.html#shipping, store-product.html, shell top strip (all values samples). D-013 covers the provider, D-020 COD, D-061 pickup — not the charge/handover policy | Owner / operations / finance | Shell top strip, P-S03 delivery line, P-S06/P-S07 totals and methods, P-S08/P-S09 delivery OTP, P-S13 shipping table, API gap G-13 |
| D-163 | **Storefront URL and route scheme**: routes for P-S01…P-S13, product/category URL patterns, search and filter parameters and their indexability, tab/step deep links, canonical rules, guest order-access and checkout-link URLs | BP §6.8 (canonical URLs, controlled filter URLs, preserve valuable URLs); 00-conventions §8 "Routes are not specified"; D-076 covers only legacy mapping, D-102 hostnames; MK query parameters are prototype aids (§1.11) | Owner / technical lead | All P-S routing, M27 sitemap/canonicals (API-M27-02), redirects (API-M27-01), deep links from notifications (M20) |
| D-164 | **Discovery rails and device-held browsing history**: are "Recently viewed" (stored on device), "Continue shopping — related to your searches", "Similar products", "Often compared with", "Complete your setup" and "Popular right now" built, and from what source? | Not in BP/PR as features (MOCKUP-ONLY: MK:store-home.html, store-listing.html, store-product.html, store-compare.html, store-cart.html). BP §15.6 "Curated recommendations before a recommendation model"; A32 compatible accessories P1/C (D-071); consent for device storage/analytics D-037, D-106. Options: curated only / category-based only / not built | Owner / technical lead | P-S01 UI row 12, P-S02 UI row 13, P-S03 UI row 19, P-S05 UI row 9, P-S06 UI rows 8 and 16; API gaps G-05, G-25 |
| D-165 | **Customer-facing disclosure and status vocabulary**: which internal identifiers and third-party names are shown to customers (reservation ids, payment attempt/provider refs, price-rule ids, supplier/partner warehouse names, vendor codes, inspector/technician names, courier rider contact), and the plain-word labels mapping order/payment/fulfilment/refund/RMA states to customer text | BP §10.1 (separate states), §11.2 ("Share only the data needed"), §13.4 (verify before revealing), §6.7 step 7 ("approve… content rules"); D-150 (transitions); D-008 (seller of record); MK exposes such references (I-08) and uses its own labels ("Pickup" for in transit, I-07) | Owner / operations | P-S03, P-S04, P-S06, P-S07, P-S08, P-S09, P-S10 labels and references; API gap G-06 |
| D-166 | **Reference price (MRP) and discount display**: is a reference price shown, what is its source, which buyer contexts see it, how "% off", "Discount on MRP", "You save", "biggest discount" sort, "typical saving" and deals are computed | BP §6.1 "No… fake discounts"; §19.2 (clear prices, required labels — qualified review D-037); API-M04-03 `reference_price?`, `savings?`; MK price block strikethrough MRP, cart "Discount on MRP", listing "Discounts are against the manufacturer's printed MRP — no inflated reference prices" | Owner / finance / legal | Price block (design component 41), P-S01–P-S07, P-S04 grade table, sort value, entity gap EG-01 |
| D-167 | **Digital goods** (e.g. software licence keys): are they sold, how is the key delivered/revealed, and how do returns treat them? | MOCKUP-ONLY: MK:store-account.html#orders ("digital licence (ESD) · key revealed"), MK:store-returns.html ("Opened software — non-returnable"). BP §7.1: new business behaviour "may legitimately require development"; return exclusions part of D-022 | Owner | P-S09 order items, P-S10 eligibility, API gap G-23, entity gap EG-10 |
| D-168 | **Linking guest orders and branch purchases to a customer account**: after a guest creates an account, or when branch sales carry the customer's phone number, are past orders linked, by what verification, and automatically or on request? | MK:store-order.html (guest "create account"), MK:store-account.html#orders ("Branch purchases made with your phone number are linked automatically"); BP §6.5 guest access, §13.4 ("do not automatically merge records merely because names match"); related D-021, D-133 | Owner / technical lead | P-S08 guest prompt, P-S09 orders/devices, API gap G-21 |
| D-169 | **Customer self-service on RMAs**: can a customer cancel an open request, appeal a rejected decision (window), is a request closed when evidence is not supplied by a deadline, and must the customer approve a repair quote for non-covered damage? | MK:store-returns.html ("Cancel request", "appeal within 15 days", "Requests without evidence close after 14 days", "we'll send a quote first"), MK:store-account.html ("Appeal"); BP §10.1 RMA states include "rejected" only; BP §5.3 (no full repair-workshop ERP); related D-150 (transitions), D-022 (policy) — values are samples | Owner / support | P-S09 returns tab, P-S10 requests & summary, API gaps G-10, G-11 |

## 11. Registry additions requested

| Registry | Addition | Justification | Source | Label |
|---|---|---|---|---|
| Pages (00-conventions §8) | **P-S14 — Account access landings**: password-reset completion and invitation acceptance (dealer business members; also reused for vendor users if D-101/D-102 allow) | API-M02-08 and API-M02-16/17 exist with "no mockup screen"; dealer owners invite members (BP §8.3; MK:store-dealer.html m-invite) and password reset links are sent from MK:store-login.html m-forgot | BP §8.3; MK; 06-api index | MOCKUP (screens not drawn) · REQUIRES_DECISION (D-040) |
| Pages (00-conventions §8) | **P-S15 — Not-found / unavailable and error pages** (unknown or archived URLs → redirect or a useful unavailable page; generic error page with support route) | T32 "Correct redirect or deliberate useful unavailable page"; MK:store-product.html not-found state; BP §6.8 redirect mapping | BP §23.1 T32, §6.8 | DOCUMENTED |
| Entities | None requested unconditionally. If decisions approve them: pre-order reservation hold (D-161), reference price field (D-166), digital licence record (D-167), business-account order approval (D-066) — see §8 | — | — | CONDITIONAL |
| Roles | None. Dealer member sub-roles stay inside R-dealer per D-066 | 00-conventions §9 | BP §8.3 | — |
