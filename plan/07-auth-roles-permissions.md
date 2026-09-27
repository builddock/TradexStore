# 07 — Authentication, roles and permissions

**Purpose.** Defines who can sign in, how, and what each identity may see and do — at page, API, record and field
level — so that every module enforces one consistent access model (BP §18.2 "least privilege, record-level scope,
sensitive-field restrictions, and MFA for privileged accounts"; BP §19.1 "Enforce authorisation on the server for
every business operation"). This file holds the **authoritative permission-key catalogue** referenced by
`E-permission.code` (`03-database.md` §2.1.3), `BR-M02-18` (`05-backend.md` §5.2) and `06-api.md` §1.3.

**Sources used.** BP §3.1, §5.2, §6.3–6.5, §8.3–8.4, §11.1–11.5, §12.5–12.6, §13.3–13.4, §14.4, §16.2, §17.3–17.6,
§18.1–18.2, §19.1–19.3, §20.1, §21.2, §23.1 · PR1 §7, §11, §14 · PR2 §2, §5, §9 · MEET ("role-based access and an
approval step before product data enters the live database"; vendor registration handled by a super admin) · MK:
`store-login.html`, `store-account.html`, `store-dealer.html`, `store-checkout.html`, `store-returns.html`,
`erp-admin.html`, `erp-customers.html`, `erp-inventory.html`, `erp-pricing.html`, `erp-reports.html`,
`vendor-account.html`, `vendor-availability.html`, `assets/tradex.js` (shells) · plan files `00-conventions.md`,
`02-architecture.md` §8–9, `03-database.md` §2.1, `05-backend.md` §5.2, `06-api.md` §1.2–1.4.

**Labels / status.** Evidence labels and status values per `00-conventions.md` §2–§3. Every item below is
`NOT_STARTED` unless marked `REQUIRES_DECISION (D-xxx)`. Physical mechanisms (native ERP role system vs custom
policy engine) depend on **D-001**; this file specifies the logical model every option must satisfy.

**Decisions most referenced.** D-021 guest access · D-024 thresholds · D-025 delegation · D-039 password migration ·
D-040 authentication methods · D-047 vendor onboarding route · D-066 business-account member roles · D-081 catalog
reviewers · D-083 session/token mechanism · D-084 rate limits · D-102 hostnames · D-114 audit tamper-resistance ·
D-137 vendor-organisation roles · D-149 "view as dealer" · D-152 export controls · D-153 masking/reveal ·
D-175 self-approval · D-179 approval deadlines · D-194 automation governance · D-196 SoD rule set · D-197 cost/margin
visibility · D-222 mockup job-title mapping (incl. "buyer", `00-conventions.md` §7.2) · new D-200, D-202, D-205 (end
of file); D-206–D-209 in `16-testing.md`.

---

## 1. Enforcement model

| # | Layer (BP §18.2; PR2 §9) | Rule | Enforced in | Source |
|---|---|---|---|---|
| L1 | Authentication | Every non-public operation needs an authenticated principal of the right type (customer, vendor, staff, integration, provider signature, order/link token) | M02 AuthService / SessionService | BP §19.1 · DOCUMENTED |
| L2 | Role permission (RBAC) | Principal's active role assignments grant **permission keys** (§5); one key per business operation, not per table | M02 AccessPolicy | BP §17.4 ("business contracts, not direct ERP CRUD permissions"), §18.1 · DOCUMENTED |
| L3 | Record scope (object level) | Key grants apply only inside the principal's scope: own · business account · vendor organisation · assigned location · assigned task · company (§6); out-of-scope objects answer `404` | AccessPolicy + every module query | BP §3.1, §18.2, §19.1 (S14), T11 · DOCUMENTED |
| L4 | Property level | Writable fields are an allow-list per key; protected fields (approval state, price, buyer type, seller, refund approval) are server-derived; sensitive fields masked in responses (§7) | Module services, response shaping | BP §17.4, §19.1, T10, T13 · DOCUMENTED |
| L5 | Authority & approvals | Actions above the principal's authority become approval requests (`202 APPROVAL_REQUIRED`); thresholds client-supplied | M17 ApprovalService | BP §12.5, §18.1 · DOCUMENTED · values REQUIRES_DECISION (D-024) |
| L6 | Separation of duties | Requester ≠ approver where feasible; maker ≠ checker for payout and other listed controls (§8) | M17 ApprovalService, M02 assignment guard | BP §18.2, §11.5 · DOCUMENTED |
| L7 | Strong authentication | Privileged principals operate only with MFA; step-up for listed sensitive actions (§3.11) | M02 MfaService | BP §18.2, §20.1 · DOCUMENTED · coverage REQUIRES_DECISION (D-200, D-202) |
| L8 | Audit | Every privileged/material action writes `E-audit_event` in the same transaction (§11) | M02 AuditService | BP §17.3, §19.1, §20.1 · DOCUMENTED |

UI rule: screens hide or disable what the server would refuse, but **hiding is never the control** (MK:erp-admin.html#roles "enforced on the server for every operation, not just hidden in the
UI"). `API-M02-01` returns `ui_permissions` as hints only.

---

## 2. Identity types (BP §3.1)

| # | Identity type | `E-user_account.account_type` | Roles (00-conventions §9) | Record scope | Linked entity | Phase | Label |
|---|---|---|---|---|---|---|---|
| ID-1 | Guest (anonymous) | none | R-guest | Public data; one order via order-access token; one draft via checkout-link token | E-verification_challenge (C), cart token (D-129) | 1A | DOCUMENTED BP §3.1, §6.5 · REQUIRES_DECISION (D-021) |
| ID-2 | Consumer | `customer` | R-consumer | Own records | E-customer | 1A | DOCUMENTED BP §3.1 · naming D-006 |
| ID-3 | Dealer business-account member | `customer` (+ active membership) | R-dealer (member sub-role D-066) | Own business account's prices and records | E-customer + E-business_account_member → E-business_account | 1A | DOCUMENTED BP §3.1, §6.5, §8.3 |
| ID-4 | Vendor applicant | `vendor` (if a login is created — D-047) | R-vendor_applicant | Own application only; no live catalog or stock write | E-vendor_application | 1B | DOCUMENTED BP §3.1, §11.1 · REQUIRES_DECISION (D-047) |
| ID-5 | Vendor user (approved supplier) | `vendor` | R-supplier (vendor-organisation role D-137) | Own vendor organisation; no competitor costs or company margins | E-vendor_user → E-supplier | 1B (admin-created accounts 1A-C, BP §5.2) | DOCUMENTED BP §3.1, §11.2 |
| ID-6 | Marketplace seller user | `vendor` | R-seller | Own offers and assigned customer data | (M15) | 2 | LATER (D-046) |
| ID-7 | Staff user | `staff` | R-catalog_staff, R-warehouse_staff, R-sales_support, R-branch_manager, R-finance, R-ops_admin, R-owner | By role (§6) | E-user_role_assignment | 1A | DOCUMENTED BP §3.1, §18 |
| ID-8 | Integration account | `integration` | R-integration | Named operations only; no interactive admin | E-api_credential (C) | 1A/1B | DOCUMENTED BP §3.1, §16.4 · mechanism D-083 |
| ID-9 | Provider callback | none (signature) | — (auth class `SIG`) | Its own events | E-payment_event, E-shipment_event, E-integration_event | 1A | DOCUMENTED BP §17.4 |
| ID-10 | Automation / system actor | none | — (`actor_type = automation/system`) | Rule's declared preconditions | E-automation_rule, E-job_attempt | 1A | DOCUMENTED BP §12.3 (audit: actor, input version, reason) |

Rules:
1. One individually attributable account per person; **no shared logins** (BP §18.2 "Do not create shared admin
   passwords"; §20.1 "individually attributable accounts"; MK:erp-admin.html "no shared logins"). DOCUMENTED.
2. Account types are separate principals: a store (customer) account cannot use vendor tools and vice versa
   (MK:store-login.html "Store accounts can't access vendor tools"); a staff member who buys uses a separate
   customer account (E-user_account.account_type is single-valued, `03-database.md` §2.1.1). MOCKUP.
3. A role may be assigned only to an account whose `account_type` equals `E-role.audience` (`03-database.md` §2.1.2).
4. Automation actors never hold interactive permissions; each automation declares its permitted actions in its
   BP §12.3 template ("Human boundary: what the automation cannot approve") and is audited (BR-M17-01).
5. A person may belong to more than one business account, or be a consumer and a dealer member at once, only as
   decided in **D-205** (active buyer-context selection) — REQUIRES_DECISION.

---

## 3. Authentication

### 3.1 Authentication per identity type

| Identity | Sign-in surface | Methods | MFA | Session / credential | Registration route | Status |
|---|---|---|---|---|---|---|
| Guest | none | — ; order access via secure link or order no. + phone + OTP (`GAT`); secure checkout link (`LNK`) | — | Token scoped to one order / one draft; lifetime D-021 | — | REQUIRES_DECISION (D-021, D-151) |
| Consumer | P-S12#signin; reset/invitation landings P-S14 | MK: mobile one-time code **or** email + password; password optional (MK "sign in with a code") | Optional 2-step shown (MK:store-account.html#profile) — MOCKUP-ONLY | D-083; "keep me signed in" (MK sample 30 days) → D-202 | P-S12#register (§3.2) | REQUIRES_DECISION (D-040, D-083, D-202) |
| Dealer member | Same as consumer (MK:store-login.html "Sign in with the phone or email registered to your business") | As consumer | Owner member "must use 2-step" (MK:store-dealer.html#team) | D-083 | Dealer application (§3.3) or member invitation (§3.4) | REQUIRES_DECISION (D-040, D-066, D-200) |
| Vendor applicant | None at application (MK: "you'll receive a vendor-portal invitation") vs applicant login (`06-api.md` API-M14-01) | D-040 | — | — | Public application P-S12#vendor or admin invitation (§3.5) | REQUIRES_DECISION (D-047) |
| Vendor user | P-V05 vendor-portal sign-in (no mockup screen; MK link "Vendor portal login") | D-040 | MK: required for every vendor user (sample "within 7 days") | D-083; MK sample idle 30 min / max 12 h → D-202 | Invitation by staff (API-M14-47) or vendor admin (API-M14-37) | REQUIRES_DECISION (D-040, D-137, D-200) |
| Staff | P-E16 workspace sign-in (no mockup screen) | D-040 | **Required for privileged accounts** (BP §18.2, §20.1); MK shows MFA for all staff | D-083 | Invitation only (§3.6) | MFA DOCUMENTED; method REQUIRES_DECISION (D-040, D-200) |
| Integration | None (machine) | Narrow credential per integration; vendor availability key "scoped to availability only" (MK:vendor-availability.html) | n/a | E-api_credential; rotation (BP §19.1) | Issued by admin (§3.7) | REQUIRES_DECISION (D-083) |
| Provider | Webhook endpoint | Raw-body signature / provider authentication | n/a | Per provider D-012/D-013/D-014/D-015 | — | per provider decision |

### 3.2 Consumer registration (MK:store-login.html#register; BP §6.5 "Do not force account creation purely for browsing")

| Step | Behaviour | API | Source · label |
|---|---|---|---|
| 1 | Enter first/last name, mobile; request code (purpose `register`) | API-M02-02 | MK · REQUIRES_DECISION (D-040, D-015) |
| 2 | Verify code → short-lived verification token | API-M02-03 | MK |
| 3 | Submit profile: email (for invoices), optional password (policy D-040), contact preferences — service updates vs **optional** marketing (consent per channel & purpose), acceptance of terms and privacy-notice **version** (version-change process D-188) | API-M08-01 → E-customer, E-user_account, E-consent_record, E-terms_acceptance | MK; BP §13.3, §19.2 · DOCUMENTED (consent) |
| 4 | Account active; session issued (D-083) | API-M08-01 response | — |
| Rule | Registration must not reveal whether an email already has an account. MK shows "This email already has a Tradex account" while MK m-forgot says "we don't reveal whether an account exists" — inconsistency → REQUIRES_DECISION (D-040); default contract is non-enumerating (`06-api.md` API-M02-02) | — | MK conflict |
| Rule | Guest checkout remains available if D-021 allows (MK "Continue as a guest — no account needed to buy") | — | BP §5.2 · D-021 |

### 3.3 Dealer application → business-account access (BP §8.3; MK:store-login.html#dealer, store-dealer.html)

| Step | Behaviour | API | Source · label |
|---|---|---|---|
| 1 | Applicant (signed in, or creating an account per D-040) submits business details, GSTIN, PAN, trade type, address, contact person, documents (private files, D-112), dealer-terms acceptance | API-M08-20, API-M22-01 | BP §8.3 · MOCKUP fields · REQUIRES_DECISION (D-067) |
| 2 | GSTIN verified against the registration source — "a typed identifier alone is not verification" | API-M08-23 | BP §8.3 · D-067 |
| 3 | Until approval the applicant buys at public prices (MK) — no dealer context | — | BP §6.5 |
| 4 | Staff review with documents (views logged), decide with reason: approve (assign price list & terms), reject, request info | API-M08-38…40 | BP §8.3; A27 "No automatic business approval on unchecked documents" |
| 5 | Approval atomically creates E-business_account + owner E-business_account_member + price-list assignment; the contact person's login becomes the owner member (MK) | API-M08-40 (TX) | `05-backend.md` M08 DB rule · MOCKUP |
| 6 | Dealer context applies only to **verified members of an approved account**; suspension/expiry pauses dealer prices, history stays | API-M02-01 (buyer_context) | BP §6.5, §6.3 Dealer account states · DOCUMENTED |

### 3.4 Business-account member invitation (BP §8.3 "Define who may invite additional employees"; MK:store-dealer.html#team)
Owner member (sub-role per D-066) invites by email/mobile with role and optional per-order limit (API-M08-26) →
invitee opens token (API-M02-16) → accepts with own credentials (API-M02-17; "Each person signs in with their own
phone or email", MK). Removing a member revokes access immediately; past orders stay with the business (MK).
Staff may invite on the account's behalf, logged (API-M08-26). Status: REQUIRES_DECISION (D-066).

### 3.5 Vendor onboarding (BP §11.1; PR2 §5; MEET "Vendor registration would be handled by a super admin")

| Route | Behaviour | API | Status |
|---|---|---|---|
| Public application | Creates an **applicant, not an activated seller** (BP §11.1); model choice (supply / pilot / marketplace waitlist — LATER); documents; supplier terms; no bank details until approval (MK) | API-M14-01 | REQUIRES_DECISION (D-047) |
| Admin invitation | Staff invites a vendor organisation | API-M14-47 | REQUIRES_DECISION (D-047) |
| Review & approval | Approval record: reviewer, decision, reasons, permitted categories, permitted locations, terms version, review date (BP §11.1) | API-M14-48…50 | REQUIRES_DECISION (D-047, D-028) |
| Portal access | After approval: invitation of the first vendor admin user; further users invited by the vendor admin (MK:vendor-account.html#users; "Only @domain addresses can be invited" is a sample) | API-M14-37 → API-M02-16/17 | REQUIRES_DECISION (D-137, D-040) |
| Applicant tracking | BP §3.1 "track application" — via applicant login (06-api) or status link/notifications only (MK) | API-M14-02 | REQUIRES_DECISION (D-047) |

### 3.6 Staff by invitation (MK:erp-admin.html m-invite; BP §18.2)
R-owner / R-ops_admin (R-branch_manager only for own team if delegated, BP §18.1 "Limited team scope if delegated";
MK shows a branch manager inviting a sales associate) invite with: full name, work email, mobile (OTP fallback),
role, location scope, optional access expiry (seasonal staff), MFA method (API-M02-21). Cannot grant above own
authority; privileged role → second approver and MFA before activation (API-M02-22, API-M02-17). Invitation
expiry value (MK "48 h") → D-040. Deactivation keeps history and revokes sessions (API-M02-24). DOCUMENTED /
MOCKUP.

### 3.7 Integration accounts (BP §3.1 "Narrow machine-to-machine operations; no interactive general administrator access")
- One credential per integration and environment ("separate environment credentials", BP §19.1); scoped to named
  operations (e.g. legacy POS events API-M23-01; vendor availability API-M14-19; vendor catalog batch API-M14-13).
- Rotation and reveal: vendor keys by vendor admin with step-up (API-M14-21/-22; D-202); provider secrets are
  write-only, rotated with a second approver (API-M24-05; BR-M24-02).
- Inbound credentials for R-integration are listed, issued, rotated and revoked through API-M02-35…37 (MFA, second
  approver; `integration.read` / `integration.secret.rotate`).
- Status: REQUIRES_DECISION (D-083, D-107).

### 3.8 Sign-in, sign-out, revocation

| Event | Behaviour | API | Source |
|---|---|---|---|
| Sign-in (code) | Request code → verify → session; generic responses; attempt cap | API-M02-02/03 | MK; BP §19.1 |
| Sign-in (password) | Generic `INVALID_CREDENTIALS`; lockout/pause after repeated failures (MK sample "3 attempts… pause 15 minutes" → D-084); MFA step if required | API-M02-04/05 | BP §19.1; D-084 |
| Sign-out | Session invalidated; **private prices and cached responses no longer accessible**; client purges private cached data | API-M02-06 | BP §8.4 "Dealer signs out" · T22 |
| Revoke own sessions | One or all others (MK "Where you're signed in") | API-M02-10/11 | MK · REQUIRES_DECISION (D-083) |
| Admin force sign-out | Bulk security actions | API-M02-23 | MK:erp-admin.html |
| Deactivation / removal | Staff deactivation, member removal, vendor user deactivation revoke sessions immediately; records kept | API-M02-24, API-M08-27, API-M14-38 | MK; BP §11.1 |
| Role change | Effective on the next request — permission caches invalidated safely | API-M02-22 | BP §16.2 "Cached checks only with safe invalidation" |
| Security events | Sign-in success/failure, lockout, MFA changes recorded; users can view own activity | API-M02-15 | MK:store-account.html, vendor-account.html |

### 3.9 Password handling

| Rule | Source · label |
|---|---|
| Store and verify passwords only with the selected platform's **supported mechanism**; never plaintext; algorithm/parameters are not chosen here | BP §19.1 "Authenticate users using supported mechanisms"; §21.2 "No plaintext passwords" · REQUIRES_DECISION (D-001, D-040) |
| Never log passwords, OTPs, reset tokens, session tokens or API keys (also not in audit before/after values) | BP §19.1 · DOCUMENTED |
| Reset: request never discloses account existence; single-use expiring token; completion revokes other sessions and sends an alert | MK:store-login.html m-forgot · MOCKUP (API-M02-07/08) |
| Change own password requires current password | MK:store-account.html#profile (API-M02-09) |
| Password policy (length, breached-password check — MK samples "at least 10 characters", vendor "12+ · breached-password check") | REQUIRES_DECISION (D-040) |
| Password optional for consumers who sign in by code | MK · REQUIRES_DECISION (D-040) |
| Migration from legacy: compatible secure migration **only when proven**, otherwise forced reset | BP §21.2 · REQUIRES_DECISION (D-039); BR-M25-05 |

### 3.10 Guest access and guest order access (BP §3.1, §5.2, §6.5, §13.4)

| Capability | Rule | API | Status |
|---|---|---|---|
| Browse, search, compare, public price | Always; no dealer prices, no private history | API-M21-01, API-M04-02/03 | DOCUMENTED |
| Cart | Guest cart token if server cart (D-129) | API-M10-01…05 | REQUIRES_DECISION (D-129) |
| Guest checkout | Allowed only if D-021 permits; phone verified by code at checkout (MK:store-checkout.html) | API-M02-02/03, API-M10-06 | REQUIRES_DECISION (D-021) |
| Order access | Secure order link sent after checkout (MK) **or** order number + phone → OTP → `GAT` token scoped to one order: read, pay, cancel lines, request return, download invoice (`06-api.md` §4.14) | API-M10-10/11/12 | REQUIRES_DECISION (D-021) |
| Disclosure | No address, invoice, serial or payment information without verification — web, chat and WhatsApp alike | API-M16-09 | DOCUMENTED BP §13.4 · T23 |
| Enumeration | Same response whether or not an order/phone pair matches | API-M10-10 | `06-api.md` §4.14 |
| Linking past guest or branch orders to an account | Only after verification; never by name match (BP §13.4) | — | REQUIRES_DECISION (D-168) |

### 3.11 Session / token handling, CSRF, CORS, step-up

| # | Requirement | Source · label |
|---|---|---|
| S1 | The backend authenticates and authorises; frontends only hold the session artefact | BP §19.1; `02-architecture.md` §8 · DOCUMENTED |
| S2 | Mechanism (cookie session vs token), storage, rotation, lifetimes: **D-083**; idle/absolute timeouts and "keep me signed in": **D-202** | REQUIRES_DECISION |
| S3 | Separate session per application surface (storefront / workspace / vendor portal); a session of one principal type is rejected by the other surfaces' endpoints (path families `/v1/me`, `/v1/vendor/…`, staff `/v1/…`, `06-api.md` §1.1) | BP §16.1 (three logical apps); `06-api.md` §1.1 · DOCUMENTED |
| S4 | Cookie-authenticated mutations are CSRF-protected | BP §19.1 · DOCUMENTED (mechanism D-083) |
| S5 | CORS configured deliberately: explicit allow-list of the application origins only | BP §19.1 · origins REQUIRES_DECISION (D-102) |
| S6 | Personalised responses `private, no-store`; never cached under a shared public URL | BP §8.4, §16.5; `06-api.md` §1.11 · T22 |
| S7 | Tokens (session, order-access, checkout-link, invitation, reset, API keys) are never logged and are stored as `PD-R`/`SEC` | BP §19.1; `03-database.md` §1.7 |
| S8 | Session list/revocation needs a stored session record only if D-083 requires it (E-user_session CONDITIONAL) | `00-conventions.md` §7.1 |
| S9 | Step-up (recent re-authentication) before: regenerate MFA backup codes (API-M02-14), account deletion request (API-M08-13), vendor API key reveal/rotation (API-M14-21/22 — MK "password + OTP"), privileged admin changes when D-202 so decides | `06-api.md`; MK · REQUIRES_DECISION (D-202) |
| S10 | Privileged staff sessions only after MFA; an un-enrolled privileged user cannot activate the role (`E-user_account.mfa_enrolled`) | BP §18.2; `03-database.md` §5.4 · DOCUMENTED |
| S11 | MOCKUP-ONLY "Admin MFA + IP allow-list" for production admin and vendor API-key IP allow-list (MK:erp-admin.html#system, vendor-availability.html m-api) — build only if decided | REQUIRES_DECISION (D-177) |

### 3.12 Rate limiting and abuse protection (BP §19.1 "Protect authentication and checkout from abuse without making normal shopping unnecessarily difficult")
All values (windows, caps, pause durations) are **REQUIRES_DECISION (D-084)**; MK values are samples.

| Protected operation | APIs | Response | Extra |
|---|---|---|---|
| Code request / verify | API-M02-02, -03 | `429 RATE_LIMITED`; resend cooldown | Per destination and per client |
| Password sign-in, MFA verify | API-M02-04, -05 | `429`; account pause after repeated failures | Security event + alert (MK "alert sent") |
| Password reset request / completion | API-M02-07, -08 | Generic `202`; `429` | No enumeration |
| Invitation token use | API-M02-16, -17 | `410` expired; `429` | Single-use |
| Guest order access | API-M10-10, -11, -12 | Generic `202`; `429` | No order enumeration |
| Checkout / order placement / payment attempt | API-M10-06, API-M11-01 | `429` | Idempotency protects retries (T06) |
| Public submissions (review feedback, questions, content reports, subscriptions, chat start, tickets) | API-M04-09, -12, -14, API-M08-11, API-M16-03, -11 | `429` | Conditional features (D-041, D-065, D-141) |
| Serial / device verification, GSTIN verification | API-M13-02, API-M08-15, API-M08-23 | `429` | Prevent serial/GSTIN probing |
| Vendor application | API-M14-01 | `429` | — |
| All other `PUB` endpoints | `06-api.md` §1.2 | `429` | "rate-limited (D-084)" |

### 3.13 Account and organisation states → access effect

| State | Effect | Source |
|---|---|---|
| Staff `deactivated` | Sessions revoked; cannot sign in; history kept | MK:erp-admin.html; PR1 §11 |
| Staff `access_expires_at` passed | Role assignment expires automatically (seasonal staff) | MK · `E-user_role_assignment.valid_until` |
| Business account `pending` / `rejected` | No dealer context; public prices | BP §6.3, §6.5 |
| Business account `suspended` / `approval expired` | Dealer prices and quick order paused; past orders and invoices remain visible | BP §6.3; MK:store-dealer.html |
| Member `removed` | Access revoked immediately; orders stay with the business | MK:store-dealer.html#team |
| Vendor `suspended` | Cannot submit live changes; offers paused per decision; history visible to authorised staff | BP §11.1 · D-189 |
| Vendor user `removed` | Sessions revoked; history kept | MK:vendor-account.html#users |
| Integration credential revoked/rotated | Old credential rejected immediately | BP §19.1 |

---

## 4. Roles

### 4.1 Role registry and BP §18.1 columns
Roles are exactly `00-conventions.md` §9. Column mapping of BP §18.1 (Staff / Manager / Finance / Owner-admin /
Vendor) follows `02-architecture.md` §9.1 (this plan's reading of BP §3.1 with §18.1):

| BP §18.1 column | Roles | Note |
|---|---|---|
| Staff | R-catalog_staff, R-warehouse_staff, R-sales_support | "Staff" cells name the function ("assigned catalog staff", "assigned warehouse", "support request") |
| Manager | R-branch_manager | Assigned branch; cross-branch visibility per D-029 |
| Finance | R-finance | Separation of duties |
| Owner/admin | R-owner; R-ops_admin **except sensitive finance changes** (BP §3.1 "Sensitive finance changes still restricted") | Refund override, payout approval, finance thresholds stay with R-owner/R-finance |
| Vendor | R-supplier (R-vendor_applicant has no live write access) | Vendor-organisation sub-roles D-137 |
| — | R-guest, R-consumer, R-dealer, R-integration | Customer and machine roles are outside BP §18.1 |
| — | R-seller | LATER (M15) — not implemented in Phase 1 |

### 4.2 Privileged roles (BP §18.2 "MFA for privileged accounts"; §18.1 "Edit permissions: Privileged role")
Plan proposal, pending **D-200**: privileged = R-owner, R-ops_admin, R-finance (MK:erp-admin.html "Privileged 3 —
Owner · Ops admin · Finance"), plus any assignment granting `admin.users.*`, `admin.roles.change`,
`integration.secret.rotate` or `threshold.change`. Privileged assignment requires MFA enrolment and a second
approver (MK; API-M02-22). `E-role.privileged` is seeded accordingly (S-03).

### 4.3 Mockup job-title labels → roles (D-222 — mapping proposed, not approved)
MK labels are sample job titles, **not roles** (`00-conventions.md` §12 row 9). No new role is created.

| MK label (source) | Maps to | Qualifier (not a role) | Open point |
|---|---|---|---|
| "Owner · Super admin" (erp-admin, tradex.js) | R-owner | — | — |
| "Operations admin" | R-ops_admin | — | — |
| "Branch manager · SP Road" | R-branch_manager | location scope = that branch | — |
| "Finance" | R-finance | — | — |
| "Warehouse", "Warehouse associate" | R-warehouse_staff | location scope | — |
| "Warehouse lead" | R-warehouse_staff | lead designation: may create pick waves, assign work, decide disposition (06-api API-M12-05/06, API-M13-11) | Whether "lead" is a designation or separate role → D-222 |
| "Warehouse · seasonal packer" | R-warehouse_staff | `access_expires_at` (temporary) | — |
| "+ Warehouse receiver (SP Road)" added to a branch manager | second assignment R-warehouse_staff | SoD conflict accepted with post-review (MK) | D-196 |
| "Catalog specialist" | R-catalog_staff | assigned categories | — |
| "Support executive" | R-sales_support | queue scope | — |
| "Sales associate — Branch POS & assisted orders" | R-sales_support | location scope | — |
| "Returns desk" / "returns desk lead" (06-api API-M13-07/08) | R-sales_support or R-warehouse_staff | assignment qualifier | D-222 |
| "Buyer" (BP §9.3, A17; 06-api "buyer roles") | R-ops_admin / R-branch_manager where assigned (plan proposal) | buyer designation | **D-222** (`00-conventions.md` §7.2) |
| "Designated reviewer" (BP §18.1) | R-branch_manager, R-finance (tax review), R-ops_admin, R-owner | reviewer designation | D-081 |
| "Rule owner" (BP §12.3 "Owner: operational role") | any staff role | designation on E-automation_rule | D-194 |
| "Tech partner (on-call)" (MK emergency-access sample) | none — access only through time-bounded emergency access | — | D-025, D-222 |
| "Vendor user" | R-supplier | vendor-organisation role | D-137 |
| "Dealer Gold / Standard" (MK) | R-dealer | price-list tier (E-price_list), **not** a role | D-018 |

Designations (`As` in §5) are stored as assignment data (reviewer lists, buyer flag, rule owner, task assignee,
inspector, counter), never as extra roles.

### 4.4 Dealer member sub-roles (D-066 — MK samples, MOCKUP)
Sub-roles live in `E-business_account_member.member_role` (not E-role). MK:store-dealer.html#team:

| Capability (MK) | Owner | Buyer | Accounts | Permission key |
|---|---|---|---|---|
| See dealer prices | Y | Y | — | `dealer.price_list.read` |
| Place orders & quick order | Y | Up to per-order limit (above → owner approval, MK) | — | `order.place`, `dealer.order`; owner approval `dealer.order.approve` (API-M08-46…48) |
| Request & accept quotes | Y | Request only | — | `dealer.quote_request` (D-121) |
| See all business orders | Y | Own only | Y | `order.read` (org) |
| Invoices & statements | Y | Own orders | Y | `invoice.read`, `business.statement.read` |
| Start returns / RMA | Y | Y | — | `return.self` |
| Invite / remove members | Y | — | — | `business.members.manage` |
| Change GSTIN / address | Re-verified (pauses dealer pricing until re-verification) | — | — | `business.account.change_request` (API-M08-50) |
All cells REQUIRES_DECISION (D-066). "Owners must use 2-step verification" → D-200.

### 4.5 Vendor-organisation roles (D-137 — MK samples, MOCKUP)
MK:vendor-account.html#users "Fixed vendor roles · always limited to [the vendor's] records":

| Capability (MK) | Admin | Catalog | Ops | Accounts | Permission key |
|---|---|---|---|---|---|
| Submit products & changes | Y | Y | — | — | `vendor.catalog.write` |
| Bulk upload & catalog API | Y | Y | — | — | `vendor.catalog.write` |
| Update availability · API key | Y | — | Y | — | `vendor.availability.update`, `vendor.api_key.manage` (Admin) |
| Confirm POs · send ASN | Y | — | Y | — | `vendor.po.respond` (D-131) |
| Pilot fulfilment tasks | Y | — | Y | — | `vendor.fulfilment_task` (D-007) |
| Respond to returns (RTV) | Y | View | Y | View | `vendor.rtv.respond` / `vendor.ops.read` |
| View statements | Y | — | — | Y | `vendor.finance.read` (D-011) |
| Request bank change | Checker | — | — | Maker | `vendor.payout_change` (D-068) |
| Accept terms | Y | — | — | — | `vendor.terms.accept` |
| Manage users | Y | — | — | — | `vendor.users.manage` |
All cells REQUIRES_DECISION (D-137). Every vendor role is additionally bounded by the vendor's approved scope —
permitted categories and locations (BP §11.1) — and suspension state.

---

## 5. Permission matrix

### 5.1 Legend and rules
Cell codes: `Y` allowed within the role's record scope (§6) · `R` read only · `Own` own records · `Org` own business
account / vendor organisation · `Loc` assigned locations (cross-branch read per D-029) · `As` only when assigned
(task, category, queue, reviewer/buyer/rule-owner designation) · `Rq` may request — creates a request/approval, does
not execute · `≤T` executes within the role's threshold/delegated policy, above it creates an approval request
(D-024) · `Ap` approves requests within its authority · `M`/`C` maker / checker (different persons) · `D:` decided by
the named decision · `—` denied. Keys are `E-permission.code` values (`03-database.md` §2.1.3); each maps to APIs in
§13. Roles absent from a sub-table are denied (`—`) for every row of it.

Abbreviations: GST R-guest · CON R-consumer · DLR R-dealer · VAP R-vendor_applicant · SUP R-supplier · INT
R-integration · CAT R-catalog_staff · WH R-warehouse_staff · SS R-sales_support · BM R-branch_manager · FIN
R-finance · OPS R-ops_admin · OWN R-owner. R-seller is LATER (M15) and has no Phase 1 permissions.

### 5.2 BP §18.1 authority matrix (verbatim cells → roles) — DOCUMENTED BP §18.1; exact thresholds D-024

| Key(s) | Action (BP §18.1) | CAT | WH | SS | BM | FIN | OPS | OWN | SUP | Enforced by |
|---|---|---|---|---|---|---|---|---|---|---|
| `catalog.product.draft` | Create product draft | As "assigned catalog staff" | — | — | Y | R "read if needed" | Y | Y | Own "own submission" (`vendor.catalog.write`) | BR-M04-06, BR-M14-05 |
| `catalog.product.publish` | Publish new product | — "no by default" (unless designated, D-081) | — | — | As "designated reviewer" (D-081) | As "tax review if required" | Y | Y | — | BR-M04-09 |
| `receiving.grn.record` | Record matching receipt | — | Loc/As "assigned warehouse" | — | Y·Loc | R | Y | Y | — "no company receipt" | BR-M07-11 |
| `inventory.adjustment.request` + `approval.decide` (stock_adjustment) | Adjust stock | — | Rq | — | ≤T "within threshold" | Ap "value review" | Ap ≤T (D-024) | Ap "high-value approval" | Own availability only (`vendor.availability.update`) | BR-M06-13 |
| `business.account.price_list_change` + `approval.decide` (dealer_tier_change) | Change dealer tier | — | — | Rq | ≤T "within delegated policy" | Ap "review if needed" | Y | Y | — | BR-M05-17 |
| `refund.request`, `refund.execute` | Initiate refund | — | — | Rq "support request" | ≤T "within policy" | Y "execute/approve as assigned" | — (sensitive finance, BP §3.1) | Y "override with audit" (reason) | Rq "request only" (supplier claims) | BR-M11-09 |
| `vendor.payout_change` + `finance.payout_change.check` | Change payout account | — | — | — | — "no unilateral change" | M/C "maker/checker" | — (sensitive finance) | Ap "controlled approval" | Rq "submit change" | BR-M14-09 |
| `export.create` (customer-data datasets) | Export customer data | D:D-152 "narrow approved scope" | D:D-152 | D:D-152 | Loc "scoped" | Y "finance purpose" | Y "governed permission" (D-152) | Y "governed permission" | As "assigned fulfilment only" | BR-M08-12, BR-M18-04 |
| `admin.roles.change`, `admin.users.assign` | Edit permissions | — | — | — | D:D-025 "limited team scope if delegated" | — | Y privileged (MFA; 2nd approver for privileged grants) | Y privileged | — | BR-M02-15 |

MK:erp-admin.html#roles adds three rows "for review" (MOCKUP; build per decision):

| Key | Action (MK) | CAT | WH | SS | BM | FIN | OPS | OWN | SUP | Decision |
|---|---|---|---|---|---|---|---|---|---|---|
| `cost.view` | View supplier cost & margin | As "only if assigned" (BP §3.1) | — | — | MK "own branch" vs MK:erp-pricing.html "Finance, Ops admin, Owner only" | Y | Y | Y | — "no competitor costs or company margins" (BP §3.1) | **D-197** |
| `automation.rule.state` | Pause an automation rule | — | — | — | "own team's rules" | "finance rules" | Y | Y | — | D-194 |
| `integration.secret.rotate` | Manage integrations & secrets | — | — | — | — | — | Y + second approver | Y + second approver | — | BR-M24-02 |

### 5.3 Customer-facing actions (GST · CON · DLR)

| Key | Action | GST | CON | DLR (member sub-role D-066) | Source · label |
|---|---|---|---|---|---|
| `public.*` (catalog, content, help, seo, auth, registration, order_access, invitation, feedback, vendor_application) | Unauthenticated operations | Y (rate-limited) | Y | Y | BP §3.1 Guest · DOCUMENTED |
| `pricing.quote` | Quote a basket in own context | Y (public context) | Y | Y (dealer context only as verified member) | BP §8.1, §6.5 · DOCUMENTED |
| `cart.own` | Own cart | Y (cart token) | Own | Own | BP §6.5 · D-129 |
| `order.place` | Place pending order | D:D-021 | Own | Org — ordering sub-role, per-order limit (D-066) | BP §6.5, §17.5 |
| `order.read` | Read orders | GAT one order | Own | Org per member visibility (D-066) | BP §3.1, §17.4 |
| `order.cancel` | Cancel eligible lines | GAT | Own | Org (D-066) | BP §17.4 |
| `payment.own` | Payment attempt / status | GAT, LNK | Own | Org | BP §10.2 |
| `return.self` | Eligibility, serial check, request, evidence, pickup slots | GAT | Own | Org (MK: owner/buyer yes, accounts no — D-066) | BP §17.4, §10.5 |
| `invoice.read` | Invoices / credit notes / archive | GAT (that order) | Own | Org with invoice visibility (D-066) | BP §3.1 "business invoices", §8.3 |
| `business.statement.read` | Statement, GST reconciliation export | — | — | Org with invoice visibility (D-066; D-019, D-037) | MK:store-dealer.html#invoices |
| `customer.self` | Profile, addresses, consents, data requests, devices, wishlist, alerts, own dealer application | — | Own | Own | MK:store-account.html; BP §13.3, §19.3 |
| `identity.self`, `notification.self` | Own sessions, MFA, security events | — | Own | Own | MK |
| `dealer.application.submit`, `dealer.gstin.verify` | Apply as dealer | D:D-040 (creates account) | Y | Y (re-verification) | BP §8.3 · D-067 |
| `dealer.price_list.read` | Private price list | — | — | Org, price-visibility sub-role (D-066) | BP §3.1, §8.3 |
| `dealer.price_list.export` | Export private price list | — | — | Org (D-152) | MK · D-152 |
| `dealer.order` | Quick/bulk order validation | — | — | Org (D-066, D-121) | MK · D-121 |
| `dealer.quote_request` | Request / decline quotes | — | — | Org (D-066, D-121) | MK · D-121 |
| `business.account.read` | Business account overview | — | — | Org | BP §8.3 |
| `business.members.read`, `business.members.manage` | View / invite / change / remove members | — | — | Org, owner sub-role (D-066) | BP §8.3 |
| `dealer.order.approve` | Approve / decline a buyer member's over-limit order (no stock reserved until the buyer places it) | — | — | Org, owner sub-role; approver ≠ requesting buyer (D-066) | MK:store-dealer.html#team "Order approvals" · MOCKUP · API-M08-47/48 |
| `business.account.change_request` | Change GSTIN, legal name or registered address — dealer pricing paused until re-verified | — | — | Org, owner sub-role (D-066, D-067) | BP §8.3 "a typed identifier alone is not verification"; MK:store-dealer.html#team "Re-verified" · API-M08-50 |
| `review.submit` | Submit review | — | Verified purchase | Verified purchase | BP §5.2 C · D-041 |
| `question.ask` | Ask product question | D:D-065 | Y | Y | MOCKUP-ONLY · D-065 |
| `support.conversation.own`, `support.ticket.create` | Chat, hand-off, limited ticket types | Y (rate-limited) | Own | Own | BP §13.1–13.4 |
| `link.checkout` | Open a secure checkout link | Link holder + verification | Link holder | Link holder | BP §13.2, §29.5 · D-151, D-021 |
| `file.upload`, `file.read` | Return evidence, application documents, own invoices | GAT | Own | Org | BP §19.1 |

### 5.4 Vendor and integration actions (VAP · SUP · INT)
SUP cells are further limited by vendor-organisation role (§4.5, D-137), permitted categories/locations (BP §11.1)
and suspension (BP §11.1). INT = integration credential bound to one vendor organisation or one legacy system.

| Key | Action | VAP | SUP | INT | Source · label |
|---|---|---|---|---|---|
| `vendor.self.read` | Account state, dashboard, profile, terms, messages | Own application state only (D-047) | Org | — | BP §11.2 · T11 |
| `vendor.catalog.read` | Own listings, submissions, schemas, batches | — | Org | — | BP §11.2 |
| `vendor.catalog.write` | Submit drafts/changes/batches; never publishes | — "no live catalog write" | Org (catalog/admin) | Org (catalog feed, if issued) | BP §3.1, §11.3 · T12, T13 |
| `vendor.ops.read` | Own availability, POs, RTVs, upload results | — | Org (ops/admin) | Org (availability) | BP §11.2 |
| `vendor.availability.update` | Declare supplier-held stock and lead time | — | Org (ops/admin) | Org (availability scope only, MK) | BP §9.7, §11.2 · D-028 |
| `vendor.api_key.manage` | Rotate / reveal own API key (step-up) | — | Org (admin) | — | MK · D-083, D-202 |
| `vendor.po.respond` | Confirm/reject PO lines, send ASN | — | Org (ops/admin) | — | MOCKUP-ONLY · D-131 |
| `vendor.fulfilment_task` | Pilot supplier-fulfilment tasks (minimal customer data) | — | Org (ops/admin) | — | BP §3.2, §11.2 · D-007, D-008 |
| `vendor.rtv.respond` | Respond to returns to vendor | — | Org (ops/admin) | — | BP §11.2 |
| `vendor.profile.manage` | Change requests, documents | Own application documents (D-047) | Org (admin) | — | BP §11.1 · D-068 |
| `vendor.users.manage` | Invite / change / deactivate own users | — | Org (admin) | — | MK · D-137 |
| `vendor.finance.read` | Supplier statements, queries | — | Org (accounts/admin) | — | BP §11.2 "if integrated" · D-011 |
| `vendor.terms.accept` | Accept a terms version | Applicant terms at application | Org (admin) | — | BP §11.1 · MOCKUP (OTP evidence) |
| `vendor.payout_change` | Submit / cancel payout-account change | — | Org M (accounts) / C (admin) | — | BP §11.5, §18.1 · D-068 |
| `search.workspace`, `notification.self`, `identity.self` | Own objects only | — | Org | — | BR-M21-07 |
| `workspace.counts` | Vendor-shell queue badges for own organisation | — | Org | — | MK:assets/tradex.js · MOCKUP · D-172 · API-M18-15 |
| `integration.legacy_events` | Submit branch POS / legacy stock events | — | — | Legacy credential only | BP §16.4 · D-009, D-030 |

### 5.5 Staff actions (CAT · WH · SS · BM · FIN · OPS · OWN)
Source label is DOCUMENTED unless marked; roles per `06-api.md` §3 unless the BP row above overrides (BP wins).
R-owner holds **read** access to operational queues for oversight and drill-down even where `06-api.md` omits it
(BP §3.1 "Policy, oversight, escalations"; §12.5 "drill-down evidence") — e.g. API-M12-03, API-M16-04, API-M06-24
(question raised in `04b-frontend-workspace-1.md` inconsistency 7).

| Key | Action | CAT | WH | SS | BM | FIN | OPS | OWN | Source |
|---|---|---|---|---|---|---|---|---|---|
| **Identity & admin (M02, M24)** | | | | | | | | | |
| `identity.self`, `notification.self`, `saved_view.self`, `support.agent.self`, `staff.suggest`, `emergency_access.request` | Own profile/MFA/sessions, bell, saved views, availability, change & automation requests, request emergency access | Y | Y | Y | Y | Y | Y | Y | MK shell(E); BP §25.5 |
| `admin.users.read` | List staff users | — | — | — | D:D-025 own team | — | Y | Y | BP §18.1; MK |
| `admin.users.invite` | Invite staff | — | — | — | D:D-025 own team, non-privileged | — | Y | Y | BP §18.1–18.2; MK |
| `admin.users.assign` | Change roles / location scope / expiry | — | — | — | D:D-025 own team, non-privileged | — | Y (privileged → 2nd) | Y | BP §18.1–18.2 |
| `admin.users.security_actions`, `admin.users.status` | Force sign-out, MFA reset, deactivate/reactivate | — | — | — | — | — | Y (reactivation → OWN Ap) | Y | MK:erp-admin.html |
| `admin.roles.read` | View roles, matrix, SoD rules | — | — | — | R | — | Y | Y | BP §18.1 |
| `admin.roles.change` | Create role draft / change permissions | — | — | — | — | — | Rq (activation → OWN Ap) | Y | BP §18.1; MK |
| `admin.access_review.start` / `admin.access_review.decide` | Periodic access review | — | — | — | As reviewer | — | Y / As | Y | BP §20.1, §24.3; MK |
| `audit.read` | Search audit log | — | — | — | Own-branch objects | Finance objects | Y | Y | BP §14.3, §17.3 |
| `sensitive.reveal` | Reveal masked PII / manufacturer serial with reason | — | D:D-153 | D:D-153 | D:D-153 | D:D-153 | D:D-153 | D:D-153 | BP §18.2; MK · D-153 |
| `config.read` / `config.change` | Versioned operational settings | R (permitted keys) / — | R / — | R / — | R / — | R / finance keys | Y / Y (approval) | Y / Y | BR-M24-01…03 |
| `integration.read` / `integration.manage` | Integration status, logs, tests | — | — | — | — | R payment/accounting | Y | Y | BP §16.4 |
| `integration.secret.rotate` | Rotate provider secret | — | — | — | — | — | Y + 2nd | Y + 2nd | BR-M24-02; MK |
| `system.status.read` / `system.restore_test` | Health summary / restore rehearsal | R summary | R summary | R summary | R summary | R summary | Y / Y | Y / Y | BP §20.1; MK |
| `staff.assignable.read` | Assignee/owner picker: staff eligible for a task type (names and roles only) | — | As (lead, D-222) | Y | Loc | As (finance queues) | Y | Y | BP §12.5 "assigned role/person", §13.4 owner · API-M02-34 |
| `workspace.counts` | Sidebar queue counts — only for queues the user can read | Y | Y | Y | Y | Y | Y | Y | MK:assets/tradex.js nav counts · MOCKUP · D-172 · API-M18-15 |
| `system.alerts.manage` | Change an alert's condition, route (page vs daily review) or owner | — | — | — | — | — | Y | Y | BP §20.3 "Assign an owner to every alert" · D-195, D-052 · API-M24-14 |
| `change.read` / `change.decide` | Change register: read (all staff: own requests) / decide with effort, cost, dates, baseline | Own / — | Own / — | Own / — | Own / — | Own / — | Y / — | Y / Y | BP §2.3, §25.5 · D-191 · API-M24-12/13 |
| `terms.read` / `terms.manage` | Terms & privacy-notice versions: read / create draft version (publication via approval, API-M17-03) | — | — | As (dealer-application reviewers) / — | As / — | As / — | Y / Y | Y / Y | BP §11.1 "terms version", §19.2 · D-188 · API-M14-57/58 |
| **Organisation (M03)** | | | | | | | | | |
| `org.locations.read`, `org.company.read` | Locations, company details | Loc | Loc | Loc | Loc | Y | Y | Y | BP §3.3 |
| `org.locations.manage` | Add/edit locations | — | — | — | — | — | Y | Y | BP §3.3 · D-037 |
| `org.bins.read` / `org.bins.manage` | Bins, labels | — | Loc / — | — | Loc / Loc | — | Y | Y | BP §9.5 |
| `org.company.edit` | Edit company | — | — | — | — | — | — | Y + 2nd | BR-M03-06 |
| **Catalog (M04, M21, M22)** | | | | | | | | | |
| `catalog.product.read` | Product list/editor (cost only with `cost.view`) | Y | — | R | R | R | Y | Y | BP §18.1 |
| `catalog.product.suspend` | Suspend / archive published product | — | — | — | — | — | Y | Y | BP §7.3 |
| `catalog.reference.read`, `catalog.category.read`, `catalog.import.read` | Reference data, categories, imports | Y | — | — | R | — | Y | Y | BP §7 |
| `catalog.category.manage` | Draft category / attribute template | As (template permission) | — | — | — | — | Y | Y | BP §7.1 · T36 |
| `catalog.brand.propose` | Propose brand | Y | — | — | — | — | Y | — | BR-M04-08 |
| `catalog.policy.version` | New warranty/return/grade policy version | — | — | — | — | — | Y | Y | BP §27.2 · D-022, D-023 |
| `catalog.tax.manage` | Create / version / deactivate a tax classification; review before active (maker ≠ approver) | — | — | — | — | Y (tax review) | Y | Y | BP §14.1 (taxes in master data), §7.2, §18.1 "Tax review if required" · D-037 · API-M04-40 |
| `catalog.import.run` | Upload, map, fix, retry, commit imports | Y | — | — | — | — | Y | — | BP §7.4 · T26 |
| `catalog.review.read` | Review queue | R | — | — | As reviewer | As (tax review) | Y | Y | BP §11.3 · D-081 |
| `review.moderate` / `question.answer` | Moderate reviews / answer questions | As / Y | — | — / Y | — | — | Y / — | — | BP §5.2 · D-041, D-065 |
| `search.synonyms.manage`, `media.url_import` | Curated synonyms; image URL import | Y | — | — | — | — | Y / — | — | BP §6.4, §7.4 · D-057 |
| `search.workspace` | Global workspace search (filtered by object authorisation) | Y | Y | Y | Y | Y | Y | Y | BR-M21-07 |
| `file.upload` / `file.read` | Purpose-bound uploads / private files | Y | Y | Y | Y | Y | Y | Y | BP §19.1 (purpose & object checks, §6) |
| **Pricing (M05)** | | | | | | | | | |
| `pricing.quote` | Assisted-order quotes | — | — | Y | Y | — | Y | Y | BP §8.1 |
| `pricing.price_list.read` | Price lists, tiers, change diffs | — | — | R | R | Y | Y | Y | BP §8 |
| `pricing.price_list.manage` | Create draft price list | — | — | — | — | — | Y | Y | BP §8 · D-044 |
| `pricing.price_list.change` | Propose price-list/tier change (editor ≠ approver) | — | — | Rq | ≤T (delegated policy) | Ap (review if needed) | Y (approval) | Ap | BP §18.1; MK |
| `pricing.simulate` | Price simulator | — | — | Y | Y | Y | Y | Y | MK:erp-pricing.html |
| `pricing.promotion.read` / `pricing.promotion.manage` | Promotions, coupons | — | — | — | R / — | R / — | Y / Y | Y / Y | D-043 |
| `pricing.controls.read` | Margin floors, authority matrix | — | — | — | R | Y | Y | Y | BP §8.4 · D-024 |
| `pricing.margin_floor.change` | Propose margin-floor change | — | — | — | — | Rq | Rq | Ap + 2nd | BP §8.4 · D-024 |
| `pricing.cost_signal` | Supplier cost signals → draft change | — | — | — | — | Y | Y | Y | BP §8.4 (needs `cost.view`) |
| `pricing.quote_request.manage` | Issue dealer quotes | — | — | ≤T | Y | — | Y | — | D-121 |
| **Inventory (M06)** | | | | | | | | | |
| `inventory.stock.read` | Stock positions & ATP (cost with `cost.view`) | R | Loc | R | Loc | R | Y | Y | BP §3.1, A18 · D-029 |
| `inventory.serial.read` | Serial units (manufacturer serial masked) | — | Loc | R | Loc | — | Y | R | BP §9.4 · D-153 |
| `inventory.serial.action` | Re-grade, repair, return to supplier, discrepancy case | — | Rq | — | Y·Loc | — | Y | — | BP §9.4 |
| `inventory.inspection.record` | Record inspection / erasure evidence | — | As inspector | — | — | — | — | — | BP §7.2, §7.5 · D-023 |
| `inventory.movements.read` | Stock ledger (value with `cost.view`) | — | Loc | — | Loc | Y | Y | Y | BP §9.6 |
| `inventory.transfer.read` / `inventory.transfer.request` | Transfers / request transfer | — | Loc / Y | — / Rq (order-driven) | Loc / Y | — | Y / Y | R / — | BP §9.5 · D-024 |
| `inventory.transfer.ship` / `inventory.transfer.receive` | Ship from source / receive at destination | — | Loc / Loc | — | Loc / Loc | — | Y / — | — | BP §9.5, §18.1 "record matching receipt" |
| `inventory.transfer.discrepancy` | Investigate shortage / record loss | — | — | — | Loc | — | Y | — | BP §9.5 · D-024 |
| `inventory.count.read` / `inventory.count.start` / `inventory.count.perform` | Counts | — / — / — | Loc / — / As counter | — | Loc / Loc / — | — | Y / Y / — | R / — / — | BP §9.6 · D-069 |
| `inventory.adjustment.read` | Adjustment queue (value with `cost.view`) | — | — | — | Loc | Y | Y | Y | BP §9.6 |
| `inventory.reservation.read` / `inventory.reservation.manage` | Holds; extend once with reason, release | — | — | R / own orders | Loc / Loc | — | Y / Y | R / — | BP §10.3 · D-026 |
| `inventory.supplier_feed.read` / `inventory.supplier_feed.manage` | Supplier feeds; request update, suspend, revert | Y / Y | — | — | R / — | — | Y / Y | — | BP §9.7 · D-028 |
| **Purchasing & receiving (M07)** — buyer designation D-222 | | | | | | | | | |
| `purchasing.read` | Suggestions, POs, suppliers | — | R·Loc (receiving) | — | As buyer | R | As buyer | R | BP §9.3 |
| `purchasing.manage` | Draft/submit POs, act on suggestions, reorder rules | — | — | — | As buyer (Loc) | — | As buyer | Ap (by value) | BP §9.3, A17 · D-024, D-070 |
| `receiving.grn.read` | GRN detail | — | Loc | — | Loc | R | R | R | BP §9.3 |
| `purchasing.bill.read` / `purchasing.bill.record` / `purchasing.bill.action` | Supplier bills, 3-way match, variances | — | — | — | As buyer (review) | Y / Y / Y | As buyer (review) | Ap (above threshold) | BP §9.3 "Finance or buyer review" · D-024 |
| `purchasing.supplier.manage` | Create / edit supplier records, terms, lead times, codes, status — bank details only via payout-account change (BP §11.5) | — | — | — | — | — | As buyer | Y | BP §5.2 "basic supplier records" (1A), §14.1 · D-222 · API-M07-22/23 |
| `supplier_rma.manage` | Returns to vendor | — | Rq | — | — | — | Y (buyer) | — | BP §11.2 · D-222 |
| **Customers (M08)** | | | | | | | | | |
| `customer.read` | Customer list / 360 (PII masked) | — | — | Y | Loc | R (finance purpose) | Y | Y | BP §3.1; MK · D-153 |
| `customer.note` / `customer.tag` / `customer.message.bulk` | Notes / tags / consented bulk message | — | — | Y / Y / — | Y / Y / — | — | Y / Y / Y | Y / Y / Y | MOCKUP-ONLY · D-134, D-145 |
| `business.account.invite` | Invite a business to open a dealer account | — | — | Y | Y | — | Y | — | MK |
| `business.account.status` | Suspend / reinstate business account | — | — | — | Y | — | Y | Ap (reinstatement) | BP §6.3 |
| `business.account.preview` | "View as dealer" (read-only) | — | — | Y | Y | — | Y | Y | MK · D-149 |
| `business.members.manage` (on behalf) | Invite/change members for an account (logged) | — | — | Y | Y | — | Y | — | BP §8.3 · D-066 |
| `dealer.application.review` / `dealer.application.decide` | Dealer applications | — | — | Y / — | Y / Y | Y / — | Y / Y | R / Y | BP §8.3 · D-067 |
| `customer.duplicates` / `customer.merge` | Duplicate review / merge | — | — | Y / — | — | — | Y / Y | — | MOCKUP-ONLY · D-133 |
| `privacy.data_request` | Process data-rights requests | — | — | — | — | — | Y | Y | BP §19.3 · D-036, D-060 |
| **Orders, payments, fulfilment, returns (M10–M13)** | | | | | | | | | |
| `order.read` (staff) | Orders queue/detail | — | — (fulfilment view only, MK) | Loc | Loc | R | Y | R | BP §17.4; MK record-scope note |
| `order.manage`, `order.hold`, `order.note` | Bulk actions, reallocate, holds, notes | — | — | Loc | Loc | hold (payment review) | Y | — | BP §10.1; MK · D-134 |
| `order.cancel` (staff) | Cancel lines on customer's behalf | — | — | Loc | Loc | — | Y | Y | BP §17.4 |
| `order.assisted` / `order.assisted.confirm` | Assisted-order drafts, checkout links / counter confirmation | — | — | Loc / Loc | Loc / Loc | — | Y / — | Y / — | BP §13.2, §29.5 · D-151 |
| `order.replacement` | Replacement order for an RMA | — | — | Y | Y | — | — | — | D-022 |
| `order.verification_flag` | Mark / unmark a production verification or test transaction (excluded from reports, metrics, accounting export); MFA | — | — | — | — | — | Y | Y | BP §4 "Exclude test traffic", §21.3 step 9 · D-209 · API-M10-26 |
| `payment.read` / `payment.reconcile` | Attempts, events / provider reconciliation | — | — | R·Loc / single order | — | Y / Y | R / Y | R / — | BP §10.2 |
| `refund.read` | Refund queue | — | — | own requests | — | Y | R | R | BP §10.1 |
| `payment.offline.record` | Counter / bank-transfer payment | — | — | Loc | Loc | Y (bank match) | — | — | D-012, D-009 |
| `finance.settlement`, `finance.reconciliation`, `finance.accounting_export` | Settlements, unmatched items, accounting export | — | — | — | — | Y | — | R | BP §10.6, §14.2 · D-011, D-064 |
| `finance.close` | Daily close sign-off | — | — | — | — | M (maker) / C (second finance user) | — | C (checker) | MK:erp-finance.html#close · BR-M11-17 |
| `fulfilment.read` | Fulfilment queue (label data only) | — | Loc | R | Loc | — | Y | R | BP §10.4 |
| `fulfilment.assign` | Waves, assign pickers/packers | — | As lead (D-222) | — | Loc | — | — | — | MK · D-132 |
| `fulfilment.execute` | Scan, pick exceptions, pack | — | As task | — | — | — | — | — | BP §10.4 |
| `fulfilment.documents` | Pick lists, labels, packing slips | — | Loc | Y (pick lists) | — | — | — | — | BP §10.4 · D-055 |
| `shipment.book` / `shipment.handover` / `shipment.sync` | Book courier, manifest & handover, sync | — | Loc / Loc / Y | — / — / Y | Loc / — / — | — | — / — / Y | — | BP §10.4–10.5 · D-013 |
| `fulfilment.exception`, `fulfilment.pickup` | Delivery exceptions; store pickup | — | Loc / — | Y / Loc | Loc / Loc | — | — | — | BP §10.5 · D-061 |
| `rma.read` | RMA queue/detail | — | Loc | Y | Loc | Y | Y | R | BP §10.5 |
| `rma.manage` | Create RMA, review, authorise, reject, reverse pickup | — | reverse pickup | Y (within policy) | Y (beyond policy) | — | Y (beyond policy) | — | BP §10.5 · D-022 |
| `rma.assign` | Assign RMAs | — | As lead (D-222) | — | Y | — | Y | — | MK |
| `rma.receive` | Receive into quarantine | — | Loc | — | — | — | — | — | BP §10.5 |
| `rma.decide` | Disposition (resale/repair/supplier) — refund decision is `refund.execute` | — | As lead (D-222) | — | Y | refund part | — | — | BP §10.5 (separate decisions) |
| `warranty.manage` | Warranty cases | — | — | Y | Y | — | Y | — | BP §7.5 |
| **Vendors (M14 staff side)** | | | | | | | | | |
| `vendor.admin.read` | Vendor list, applications, performance, policy | Y | — | — | — | — | Y | Y | BP §11 |
| `vendor.admin.onboard` | Invite, decide applications, change permitted scope | — | — | — | — | — | Y | Y | BP §11.1 · D-047 |
| `vendor.admin.status` | Suspend / reinstate | — | — | — | — | — | Y (suspend) | Ap (reinstate) | BP §11.1 |
| `vendor.admin.message` | Message a vendor | Y | — | — | — | — | Y | — | MK |
| `fulfilment_task.manage` | Staff management of supplier-fulfilment pilot tasks: list, create from a released line, reassign, cancel, record outcome | — | — | — | Loc | — | Y | R (list) | BP §3.2, §29.3 · D-007, D-181 · API-M14-63…65 |
| `finance.payout_change.check` | Verify payout change (maker-checker) | — | — | — | — | M/C | — | Ap | BP §11.5, §18.1 · D-068 |
| **Support & notifications (M16, M20)** | | | | | | | | | |
| `support.inbox`, `support.conversation.manage` | Shared inbox, assign, pause automation, verify order access | — | — | Y | Y | — | Y | R (inbox read) | BP §13.3–13.4 · D-146 |
| `support.ticket.manage` | Tickets (assignee scope) | As | As | Y | Y | As | Y | — | BP §13.4 |
| `support.answer.read` / `support.answer.draft` | Approved answers | — | — | Y / Y (draft) | Y / — | — | Y / Y | — | BP §13.4 |
| `messaging.template.read` / `messaging.template.manage` | Message templates | — | — | R / — | R / — | — | Y / Y | — | BP §13.3 · D-014 |
| `notification.send` | Customer message from approved template | — | delivery templates | Y | Y | — | Y | — | BP §12.2 A14 · D-058 |
| `notification.status.read` | Delivery status for an accessible entity | Y | Y | Y | Y | Y | Y | Y | BR-M20-02 |
| **Automation, approvals, delegation (M17)** | | | | | | | | | |
| `approval.read` / `approval.decide` | Approval queue / decide (§9) | per type | per type | per type | per type | per type | per type | Y | BP §18.1–18.2 · D-024 |
| `exception.read` / `exception.act` | Exception queues (team scope) | Y | Y | Y | Y | Y | Y | Y (owner-level) | BP §12.5 |
| `automation.read` / `automation.rule.change` | Rules, runs / propose rule version, dry run | As rule owner | As | As | As | R | Y | Y | BP §12.3 · D-077, D-078, D-194 |
| `automation.pause` | Pause non-critical automation / incident mode | — | — | — | — | — | Y | Y | BP §20.4 · D-194 |
| `job.read` / `job.act` | Job runs / manual retry, switch to manual | As rule owner | — | — | — | — | Y | Y / — | A38 |
| `threshold.read` / `threshold.change` | Approval thresholds | — | — | — | — | Y / Rq | Y / C (second approver) | Y / Y (2nd approver) | BP §18.1 · D-024 |
| `delegation.read` / `delegation.create` | Delegations (own authority only) | — | — | — | own / own | own / own | Y / own | Y / Y | BP §12.6 · D-025 |
| `emergency_access.review` | Grant (via approval) and post-event review | — | — | — | — | — | Y | Y | BP §18.2 · D-025 |
| `digest.read` / `digest.manage` | Owner digest | — | — | — | — | — | recipient | Y / Y | A19 · D-063 |
| **Reporting (M18)** | | | | | | | | | |
| `report.run` | Run permitted reports (restricted columns need `cost.view` / PII permission) | per report | per report | per report | Loc | Y (finance reports) | Y | Y | BP §14.3–14.4 · D-075 |
| `export.create`, `export.own` | Create export (per dataset) / own exports | per dataset | per dataset | per dataset | Loc | Y | Y | Y | BP §14.4 · D-152 |
| `report.schedule` | Schedules | — | — | — | — | Y | Y | Y | D-075 |
| `report.definition.manage` | Propose a new report definition version (finance approval via API-M17-03; proposer ≠ approver) | — | — | — | — | Y | Y | Y | BP §14.4, §22.5 "definitions and reconciled totals" · D-075 · API-M18-18 |
| `dashboard.owner` | Owner control centre | — | — | — | Loc | finance tiles | Y | Y | BP §12.5 |
| **Invoices (M19)** | | | | | | | | | |
| `invoice.read` (staff) | Invoices & credit notes | — | — | R | — | Y | — | R | BP §14.2 · D-055 |
| `template.document.read` / `template.document.manage` | Document templates (invoice, credit note, packing slip, label, inspection sheet, PO, warranty card): read / new version → approval → activation; fiscal templates FIN | — | — | — | — | Y / Y | Y / Y (non-fiscal) | Y / Y | BP §30.1 Administration "templates", A12 "approved invoice/packing templates" · D-055, D-111 · API-M19-11/12 |

---

## 6. Record-level scope rules (BP §3.1, §11.2, §18.2; OWASP object level S14)

### 6.1 Scope dimensions

| Scope | Resolved from (server-side, per request) | Applies to | Out-of-scope behaviour | Source |
|---|---|---|---|---|
| `own` | Session → E-user_account → E-customer (customer_id) / creator fields | Consumers, dealer members' personal data, own drafts, own exports, own sessions | `404 NOT_FOUND` | BP §3.1 "Own records only" |
| `org` (business account) | Active E-business_account_member (state `active`) of an E-business_account in state `approved`; member sub-role (D-066) narrows further (e.g. buyer sees own orders only) | Dealer prices, orders, invoices, statements, members | `404`; dealer context absent → public price | BP §3.1, §6.5, §17.6 |
| `org` (vendor) | Active E-vendor_user → E-supplier; supplier approved & not suspended for writes; permitted categories/locations from E-vendor_approval | Every `/v1/vendor/…` endpoint, vendor files, vendor search | `404` (T11 "without exposing data") | BP §3.1, §11.1–11.2, §19.1 |
| `loc` | `E-user_role_assignment.location_scope`; workspace location switcher only lists these (MK shell) | Warehouse staff, branch managers, sales/support at branches | `404`; lists filtered | BP §3.1 "Assigned locations and tasks", "Assigned branch" |
| cross-branch read | Company-wide availability read-only, reserved and in-transit shown separately (MK:erp-admin.html record-scope note) | Stock visibility for branch roles | Writes still `loc` | BP §9.5 "Decide whether each branch may see other branches' stock" · REQUIRES_DECISION (D-029) |
| `asg` (assigned) | Task/queue assignee, inspector, counter, reviewer (D-081), buyer (D-222), rule owner, approver of a type | Pick/pack tasks, counts, reviews, approvals, tickets | `404` or `403 AUTHORITY_EXCEEDED` for approvals | BP §3.1, §18.1 |
| `tok` | Order-access token (one order, listed scopes) / checkout-link token (one draft) / invitation / reset token | Guests, link holders | `401`/`410` | BP §6.5, §13.2 · D-021, D-151 |
| `co` | Company (`[CO]` fields); all locations | R-ops_admin, R-owner, R-finance (finance data) | — | BP §17.3 |

### 6.2 Rules
1. Scope is checked **after** loading the object and **before** any effect or response (object-level check), and
   list/search/export/report queries are intersected with scope before pagination (`06-api.md` §1.9; BR-M21-07).
2. Out-of-scope objects return `404` so existence is not disclosed (`06-api.md` §1.3; T11).
3. Suppliers receive only data needed for their role: supplier-fulfilment tasks show minimal customer data (MK
   "name, city, masked phone/PIN"); availability responses never include customer orders (BP §11.2). D-007.
4. Support sees customer phone/address only after the customer is verified in that conversation; never payment
   instrument details (MK:erp-admin.html record-scope note; BP §13.4).
5. Warehouse staff see tasks for their site and the shipping-label data needed to pack — no prices, no customer
   phone beyond the label (MK record-scope note). MOCKUP consistent with BP §3.1.
6. Finance sees payments, refunds and settlements for all locations; personal data only for a finance purpose
   (MK; BP §18.1 "Finance purpose").
7. Branch managers see orders, stock and customers of their assigned location; reports and the control centre are
   branch-scoped (BR-M18-09; API-M18-12).
8. Suspended/expired states (§3.13) are part of scope evaluation for writes.
9. Private files (documents, return evidence, bills, KYC) are authorised per purpose and owner (API-M22-02); URLs
   are never guessable public links (BP §19.1 "serve private files through authorised access").

---

## 7. Sensitive-field restrictions (BP §3.1, §14.4, §18.2, §19.1; D-153, D-130)

| Class (`03-database.md` §1.7) | Fields | Unmasked for | Others | Reveal / logging | Source · status |
|---|---|---|---|---|---|
| Supplier cost & margin | unit_cost, landed cost, margin, value impact, cost signals | R-finance, R-ops_admin, R-owner; R-catalog_staff only if assigned; R-branch_manager per D-197 | Hidden (columns omitted, not blanked); never to vendors or customers | Report/export columns require `cost.view` | BP §3.1, §14.4 · REQUIRES_DECISION (D-197) |
| Private dealer prices | price lists, contract prices, tiers for a business account | Members with price visibility (D-066); staff pricing roles | Never to guests, other businesses, public caches, search index, sitemap | Watermarked export (D-152) | BP §3.1, §8.4, §17.6 · T02, T22 |
| Customer personal data (PD1) | name, phone, email, addresses, individual GSTIN | Customer self; staff masked by default | Warehouse: label data only; vendors: assigned fulfilment minimum | `sensitive.reveal` with reason, time-limited, audited | BP §18.2, §19.2; MK:erp-customers.html · REQUIRES_DECISION (D-153) |
| Identity / KYC documents (PD2) | GST certificate, PAN, trade licence, vendor documents | Reviewers of the application; R-finance; R-owner (MK retention matrix "every view logged") | No access | Private file viewer, watermark, every view logged | BP §19.1; MK · D-112, D-153 |
| Bank / payout details (PD2) | supplier bank account, refund bank/UPI for COD | Masked everywhere; R-finance checker sees verification data | Vendor sees own masked account | Changes only via maker-checker | BP §11.5, §18.1 · D-068, D-130 |
| Manufacturer serial of a sold unit (PD-R) | full manufacturer serial | Masked by default for staff; customers see partly hidden serial (MK:store-account.html#devices) | — | Reveal with reason list (MK samples) | BP §13.4; MK:erp-inventory.html · D-153 |
| Payment instrument data | card data | Never stored or shown | — | — | BP §10.6 · DOCUMENTED |
| Secrets (SEC) | password hashes, API keys, provider secrets, tokens | Nobody (write-only) | — | Vendor key reveal with step-up (MK) | BP §19.1; BR-M24-02 · D-083, D-107 |
| Audit before/after values containing PD1/PD2 | — | Per `audit.read` scope; masked unless permitted | — | Viewing audit log logged (MOCKUP) | BP §17.3 · D-114 |
| Protected state fields on own records (BOPLA) | approval state, permitted categories, reviewer, price, buyer type, segment, seller, refund approval, MFA flags | Server only | Client values ignored or rejected | — | BP §17.4, §19.1 · T10, T13 |
| Count expected quantities | expected qty on a count sheet | Hidden from the assigned counter (blind count) | — | — | MK:erp-inventory.html#counts · MOCKUP (D-069) |

---

## 8. Separation of duties and maker-checker (BP §18.2, §11.5; MK:erp-admin.html#roles)

| # | Rule | Where enforced | Strictness | Source |
|---|---|---|---|---|
| SoD-1 | Requester cannot approve own request: discounts, refunds, write-offs/adjustments, price changes, transfers, POs | ApprovalService on API-M17-03/-04 (`403 SELF_APPROVAL_NOT_ALLOWED`) | Hard; any below-threshold self-approval tier only if D-175 allows | BP §18.2 "where separation is feasible"; MK "Enforced" · D-175 |
| SoD-2 | User administration separate from ordinary warehouse work — an assignment granting `admin.users.*` cannot coexist with R-warehouse_staff | Assignment guard API-M02-21/-22 | Hard | BP §18.2 |
| SoD-3 | Payout-account change: vendor maker ≠ vendor checker (MK), then Tradex finance maker ≠ checker; call-back on registered number (MK) | API-M14-43, approval `payout_account_change` | Hard | BP §11.5, §18.1 · D-068 |
| SoD-4 | Price-list editor cannot approve the same change | API-M05-13 → API-M17-03 | Hard | MK |
| SoD-5 | Refund bank/UPI release (COD, manual routes): check & release by a second finance user | API-M11-10 `check_release` | Hard | MK:erp-finance.html · BP §18.1 "Maker/checker" |
| SoD-6 | Daily finance close: maker ≠ checker | API-M11-21 | Hard | BR-M11-17 · MOCKUP |
| SoD-7 | Privileged role grant, role permission change, threshold change, secret rotation, company-detail change need a second approver | API-M02-22/-27, API-M17-19, API-M24-05, API-M03-09 | Hard | MK; BR-M03-06, BR-M24-02 |
| SoD-8 | Emergency access is never self-granted | API-M17-23 → API-M17-03 | Hard | BP §18.2; MK |
| SoD-9 | Delegate ≠ delegator; delegation cannot widen authority; delegation does not bypass SoD-1 | API-M17-21 | Hard | BP §12.6 |
| SoD-10 | Stock-count counter does not approve the resulting adjustment | API-M06-21 → API-M17-03 | Hard | BP §9.6, §18.2 |
| SoD-11 | Access-review reviewer does not confirm own access | API-M02-29 | Hard | BP §18.2 (principle) |
| SoD-12 | PO creator should not receive the goods — MK "Warn; small branches may combine, post-reviewed" | API-M07-09 | Warn + post-review | MK · REQUIRES_DECISION (D-196, D-222) |
| SoD-13 | Accepted SoD conflicts (e.g. branch manager + warehouse receiver during leave) require a named post-reviewer and period | API-M02-22 | Warn + post-review | MK · REQUIRES_DECISION (D-196) |

When a hard rule cannot be met because only one authorised person exists, the request escalates to the alternate
or owner (BP §18.2 "alternate approver, escalation rule") — it is never auto-approved.

---

## 9. Approval authority and thresholds (BP §18.1, §12.5; D-024)

All limits are client-supplied — **REQUIRES_DECISION (D-024)**; MK:erp-admin.html#thresholds values (e.g. "≤ ₹10,000",
"≤ 8 %") are placeholders and must not be seeded (`03-database.md` S-05). Until D-024 is decided, threshold records
stay `draft`; MK proposes routing such cases to the owner meanwhile — adopt only if confirmed under D-024.

| Approval type (`E-approval_request.approval_type`) | Requested by | Approver within threshold | Above threshold | Second approver / maker-checker | APIs | Source |
|---|---|---|---|---|---|---|
| `stock_adjustment`, `stock_write_off` | WH (request), counts | BM (loc), OPS | FIN value review; OWN high value | — | API-M06-23 → API-M17-03 | BP §9.6, §18.1 |
| `transfer` | WH, BM, SS (order-driven) | BM, OPS | per D-024 | — | API-M06-13 | MK |
| `discount_override`, `margin_override` | SS, BM (assisted orders) | BM ≤ own limit, OPS | OWN (margin floor — "below needs owner", MK) | — | API-M10-19, API-M05-* | BP §8.4, §29.2 |
| `price_change` (price list, tier) | SS (request), BM, OPS | BM within delegated policy; OPS | OWN (list-wide / below cost, MK) | editor ≠ approver | API-M05-13 | BP §18.1 |
| `dealer_tier_change` | SS | BM within delegated policy | OPS/OWN; FIN review if needed | — | API-M08-36 | BP §18.1 |
| `purchase_order` | buyer (D-222) | per value | OPS/OWN | — | API-M07-07 | BP §9.3; MK |
| `refund` (outside auto-policy) | SS | BM within policy; FIN executes | OWN override with audit | check & release (SoD-5) | API-M11-09/-10 | BP §18.1 |
| `payout_account_change` | Vendor accounts (maker) + admin (checker) | FIN maker-checker | OWN controlled approval | Yes | API-M14-43 | BP §11.5, §18.1 |
| `vendor_content` (new product, sensitive edit) | Vendor, catalog staff | Designated reviewer (D-081) | — | FIN tax review if required | API-M14-06 → API-M17-03 | BP §11.3, §18.1 |
| `privileged_role_grant` | OPS/OWN | — | OWN | Yes | API-M02-22 | MK; BP §18.1 |
| `threshold_change` | FIN, OWN | — | — | Yes | API-M17-19 | MK |
| `emergency_access` | Any staff | OWN or OPS (never self) | — | — | API-M17-23 | BP §18.2 |
| `data_export` (personal data beyond scope) | Staff | per D-152 | OWN governed permission | — | API-M18-03 | BP §18.1 · D-152 |

Every approval records why it was required, deadline, alternate approver, escalation rule and outcome; bulk review
keeps each item's decision (BP §18.2; BR-M17-06/07). Deadline, reminder and escalation values (MK "4 working hours",
"escalate once to the named alternate") → D-179. Which approval types go live in 1A vs 1B → D-192. Approval types needed but missing from the entity enum are listed under
Entity gaps (E-02).

---

## 10. Delegation and emergency access (BP §12.6, §18.2, §29.7; D-025)

| Rule | Source · label |
|---|---|
| Named alternate with explicit, scoped, time-bounded authority (E-delegation `alternate_approver`) | BP §12.6 · DOCUMENTED |
| Scope ⊆ delegator's own authority; owner-only rules are never silently converted into unrestricted access | BP §12.6 · DOCUMENTED |
| Non-delegable in MK: permission & role changes, payout/bank changes, list-wide price changes, integrations & secrets | MK:erp-admin.html#delegation · MOCKUP · D-025 |
| Ends automatically at `valid_until`; can be ended early; extension needs owner approval (API-M17-22) | MK · D-025 |
| Decisions under delegation are tagged in the audit log (`E-audit_event.delegation_id`) | MK; `03-database.md` §2.1.6 |
| Delegator keeps receiving the digest and urgent items (MK) | MK · D-063 |
| Emergency access: request with scope, duration, reason (API-M17-23) → approved by R-owner/R-ops_admin, never self → actions tagged → automatic expiry → post-event review (API-M17-24) | BP §18.2 "time-bounded authorisation and post-event review"; MK · D-025 |
| No shared admin passwords for routine or emergency work; external technical partners use emergency access only | BP §18.2 · D-222 |
| Maximum durations (MK "max 14 days", "4 hours") and post-review deadline (MK "2 working days") | REQUIRES_DECISION (D-025) |
| Acceptance: T31 "Owner unavailable for routine operations" | BP §23.1, §29.7 |

---

## 11. Privileged-action audit (BP §17.3, §18.2, §19.1, §20.1)

Every action below writes `E-audit_event` (actor, time, object, action, before/after or structured change, reason,
approval/delegation id, client context) **in the same transaction** as the change (`05-backend.md` §5.2).

| Area | Audited actions | Reason mandatory |
|---|---|---|
| Authentication | Sign-in success/failure, lockout, MFA enrol/reset/backup-code regeneration, password change/reset, session revocation, force sign-out | — |
| Access administration | Invite, role/scope/expiry change, deactivate/reactivate, role create/change, access-review decisions, SoD conflict acceptance | Yes (changes) |
| Authority | Threshold changes, delegation create/extend/end, emergency access request/grant/actions/review, approval decisions (each item in bulk) | Yes |
| Sensitive data | Field reveals, KYC/identity document views, customer data exports and downloads, audit-log searches/exports (MK "viewing the log is itself logged"), "view as dealer" (D-149), privacy request processing, customer merge | Yes |
| Configuration & integrations | Configuration versions, secret rotation, integration settings, automation enable/stop/incident pause, company/location changes | Yes |
| Material business changes | Stock adjustments/write-offs, price-list activation, margin overrides, refunds and overrides, payout-account changes, catalog publication/suspension, vendor/dealer approval & suspension | Yes for overrides |

Rules: audit is append-only; tamper-resistance per platform capability (BP §19.1) — mechanism **REQUIRES_DECISION
(D-114)** (MK hash chain is a sample); access limited by `audit.read` scope; retention D-036; passwords, tokens,
payment data and identity-document contents are never written into audit payloads (BP §19.1). Verification: BP §20.1
"Sample transaction reconstruction" (TS-ADM-05, `16-testing.md`).

---

## 12. Protected pages

### 12.1 Storefront (P-S) — guest / consumer / dealer differences (MK `only-dealer`, `hide-dealer`, `only-guest`, `only-signed` blocks)

| Page | GST | CON | DLR | Server-enforced difference | Source |
|---|---|---|---|---|---|
| P-S01 Home | Y | Y | Y | Dealer modules (quick order, reorder with tier prices ex-GST) only for verified members; guests/consumers see "Apply as dealer" block; "recently viewed" only signed in | MK:store-home.html; BP §6.3 "signed-in dealer" state · D-142 |
| P-S02 Listing | Y | Y | Y | Guests/consumers: public price (tax convention D-016); dealers: private price + tier hint; guest banner "sign in for dealer pricing"; consumer coupons do not stack with dealer prices (D-017) | BP §6.4 "without exposing private pricing to guests"; MK |
| P-S03 Product | Y | Y | Y | Dealer tier table only for members; EMI/bank offers hidden for dealers (MOCKUP-ONLY D-062); review submission only verified purchasers (D-041) | MK:store-product.html |
| P-S04 Refurbished | Y | Y | Y | Unit inspection reports public (API-M06-02) | BP §6.6 |
| P-S05 Compare | Y | Y | Y | Prices by context | D-042 |
| P-S06 Cart | Y (token, D-129) | Own | Own | Tier prices applied for dealers; member order limit (D-066) | BP §6.5; MK:store-cart.html |
| P-S07 Checkout | D-021 (phone OTP) | Own | Org (ordering sub-role) | Dealer billing GSTIN verified & locked; prepaid default (D-019); addresses must be the caller's | BP §6.5, §17.5; MK:store-checkout.html |
| P-S08 Order & tracking | GAT (link or OTP) | Own | Org | Unverified visitors see only the lookup form; no details without verification | BP §6.5, §13.4 |
| P-S09 My account | — (redirect to sign-in) | Own | Own (personal settings; business data in P-S11) | Profile, security, consents; business orders/invoices/team live in P-S11 | MK:store-account.html |
| P-S10 Returns | GAT (verify first; MK only-guest block) | Own | Org (D-066) | Serial checked against the original sale | BP §7.5, §10.5 |
| P-S11 Dealer zone | Public overview + apply CTA | Overview + own application status | Members: price list, quick order, quotes, reorder, invoices, team — per sub-role (D-066) | Suspended accounts: prices paused, history visible | MK:store-dealer.html; BP §6.3 |
| P-S12 Sign-in · register · apply | Y | Y | Y | Rate limits; no enumeration | MK:store-login.html |
| P-S13 Help & policies | Y | Y | Y | Chat order status only after verification (T23) | BP §13.4 |
| Store shell | Y | Y | Y | Account label/menu by context; PIN modal; chat widget verification rule | `assets/tradex.js` |

### 12.2 ERP workspace (P-E) — all require a staff session (`STF`)
If D-004 makes a screen native, the same keys are enforced through the core's permission system (`06-api.md` §1.1
rule 3).

| Page | Roles with access (scope) | Tab / section restrictions | Source |
|---|---|---|---|
| P-E01 Owner control centre | OWN, OPS (all); BM (branch); FIN (finance tiles) | Exceptions filtered to viewer's authority; owner-level items only for OWN | BP §12.5; API-M18-12 |
| P-E02 Orders | SS, BM (loc); OPS; FIN (payment review, holds); OWN read | Notes (D-134); payment tab read for SS; assisted-order discount within authority | BP §10.1; MK |
| P-E03 Pick · pack · dispatch | WH (loc/assigned), BM (loc), OPS; SS (pick lists, delivery exceptions) | Waves/assignment: WH lead or BM (D-222, D-132); no prices shown | BP §10.4; MK |
| P-E04 Returns, RMA & warranty | SS, WH (loc), BM, FIN (refunds tab), OPS; buyer (supplier tab, D-222) | Refund decision FIN only; disposition BM/WH lead | BP §10.5 |
| P-E05 Support & WhatsApp | SS, BM, OPS; assignees for tickets | PII masked until verification; templates manage OPS | BP §13.3–13.4 |
| P-E06 Catalog & imports | CAT (assigned categories), OPS, OWN; reviewers (review tab, D-081); BM/SS read products | Cost/margin only with `cost.view` (D-197); publish only reviewers | BP §7, §18.1 |
| P-E07 Pricing & dealer tiers | OPS, OWN, FIN; BM (within delegated policy); SS read + simulator + requests | Controls/margin tab: FIN, OPS, OWN, BM read; audit tab per `audit.read` | BP §8, §18.1 |
| P-E08 Inventory & serials | WH, BM (loc); OPS, OWN; FIN (movements, adjustments); SS read; CAT supplier tab | Manufacturer serial masked (reveal D-153); counts blind for counters | BP §9 |
| P-E09 Purchasing & receiving | buyer (D-222); WH (receive tab, loc); FIN (bills tab); OWN read/approve | Landed cost with `cost.view` | BP §9.3 |
| P-E10 Customers & dealers | SS, BM (loc), OPS, OWN; FIN read | PII masked, reveal logged; privacy tab OPS/OWN; duplicates SS/OPS; applications per §5.5 | BP §8.3, §19.3; MK |
| P-E11 Vendors & submissions | OPS, OWN, CAT, buyer (D-222), reviewers | Bank/KYC masked; decisions OPS/OWN | BP §11 |
| P-E12 Payments & reconciliation | FIN, OWN; OPS read; SS read (loc) and own refund requests | Close: maker/checker; export: FIN | BP §10.2–10.6, §14.2 |
| P-E13 Reports | Per report permission; BM branch-scoped | Restricted reports locked for roles without cost/PII permission (MK) | BP §14.3–14.4 |
| P-E14 Automation & exceptions | OPS, OWN, rule owners; approvals tab: approvers by type; exceptions: team scope | Kill switch: named reviewer | BP §12 |
| P-E15 Settings, roles & audit | OWN, OPS; BM (roles read, team scope if delegated); FIN (thresholds read/propose, finance integrations read) | Users/roles/secrets need MFA; privileged changes need second approver | BP §18; MK |
| Workspace shell | All staff | Location switcher lists assigned locations only; "New" menu filtered by keys; notifications own; delegation menu for delegators | `assets/tradex.js` |

### 12.3 Vendor portal (P-V) — require a vendor session (`VEN`) of an approved, non-suspended supplier for writes

| Page | Vendor roles (D-137) | Restrictions | Source |
|---|---|---|---|
| P-V01 Dashboard | All vendor users | Own KPIs only; no margins, no other vendors (T11) | MK:vendor-dashboard.html |
| P-V02 Products & submissions | Admin, Catalog | Permitted categories only; submissions never publish (T12); protected fields read-only (T13) | BP §11.2–11.3 |
| P-V03 Availability, POs, tasks, returns | Admin, Ops (Catalog/Accounts view returns) | Availability never becomes company stock; minimal customer data in tasks | BP §9.7, §11.2 |
| P-V04 Profile & statements | Admin (users, terms, change requests); Accounts (statements, bank change maker) | Bank change maker-checker; security policy set by Tradex | BP §11.1, §11.5 |
| Vendor shell | All vendor users | No location switcher; search own objects only | `assets/tradex.js` |
| R-vendor_applicant | Application status only (no P-V02/P-V03 writes) | BP §3.1 "No live catalog or stock write access" · D-047 | BP §3.1 |

### 12.4 Access pages without mockup screens (`00-conventions.md` §8)

| Page | Who | Rules | Source |
|---|---|---|---|
| P-S14 Account access landings (password-reset completion, invitation acceptance) | Token holder (`PUB` + token) | Single-use expiring token; no enumeration; member invitation binds to the inviting business account | §3.4, §3.9 · D-040, D-066 |
| P-S15 Not-found / unavailable / error pages | Everyone | Same response for "not found" and "not permitted" (§15 E14) | BP §6.8, T32 |
| P-E16 Staff sign-in, MFA, password reset, invitation acceptance | Staff (`PUB` → `STF`) | MFA enrolment before a privileged role is active; lockout per D-084; staff "My profile / Security & MFA" content per D-174 | §3.6, §3.11 · D-040, D-200 |
| P-V05 Vendor sign-in, invitation acceptance & security | Vendor users (`PUB` → `VEN`) | Invitation only after approval; MFA per D-200; store accounts cannot sign in here | §3.5 · D-040, D-047 |

---

## 13. Protected APIs (every endpoint of `06-api.md`)

Auth classes per `06-api.md` §1.2 (`PUB`, `CUS`, `GAT`, `LNK`, `STF`, `VEN`, `INT`, `SIG`). Roles holding each key: §5. Scope: §6. Guards: `RL` rate-limited (D-084) · `Idem` idempotency key required (D-079) · `MFA` privileged session with MFA · `StepUp` recent re-authentication (D-202) · `2nd` second approver / maker-checker · `SoD` requester ≠ approver · `Ver` expected_version · `Rsn` reason mandatory and audited · `NoEnum` no account/order enumeration · `Aud` audited · `Sig` signature verified on raw body · `Dec (D-xxx)` endpoint only active when the decision enables the feature. Endpoints serving several audiences (e.g. API-M10-07) apply the customer key for `CUS`/`GAT` callers and the staff key named in the key or guard cell for `STF` callers (`06-api.md` §1.1 rule 4). All 492 endpoints are listed (65 added by `06-api.md` §8 on 2026-09-27); coverage check: §13.24.


### 13.1 M02 — Identity, access & audit (42 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M02-01 | CUS/STF/VEN/GAT | `identity.self` | own | Returns server-derived context; `ui_permissions` are hints only |
| API-M02-02 | PUB/CUS/VEN | `public.auth` | public | RL; NoEnum; purpose-bound |
| API-M02-03 | PUB | `public.auth` | public | RL; attempt cap; purpose-bound token |
| API-M02-04 | PUB | `public.auth` | public | RL/lockout (D-084); NoEnum; MFA step for privileged (D-200) |
| API-M02-05 | PUB | `public.auth` | public | RL; bound to mfa_challenge_id |
| API-M02-06 | CUS/STF/VEN | `identity.self` | own | Invalidate session; purge private caches (T22) |
| API-M02-07 | PUB | `public.auth` | public | RL; NoEnum |
| API-M02-08 | PUB | `public.auth` | token | Single-use token; revoke other sessions |
| API-M02-09…13 | CUS/STF/VEN | `identity.self` | own | Current credential required (-09); Aud |
| API-M02-14 | CUS/STF/VEN | `identity.self` | own | StepUp (D-202); Aud |
| API-M02-15 | CUS/STF/VEN | `identity.self` | own | Vendor admin: org scope (D-137) |
| API-M02-16…17 | PUB | `public.invitation` | token | Single-use, expiring; privileged staff must enrol MFA before activation |
| API-M02-18…19 | CUS/STF/VEN | by invitation type (see guards) | org | Key by invitation type: admin.users.invite / business.members.manage / vendor.users.manage; staff on-behalf logged |
| API-M02-20 | STF | `admin.users.read` | company | BM: own team only if delegated (D-025) |
| API-M02-21 | STF | `admin.users.invite` | company | MFA; cannot grant above own authority; privileged role → 2nd |
| API-M02-22 | STF | `admin.users.assign` | company | MFA; Ver; Rsn; no self-elevation; privileged → 2nd (202) |
| API-M02-23 | STF | `admin.users.security_actions` | company | MFA; Rsn; reset_mfa needs identity-check evidence |
| API-M02-24 | STF | `admin.users.status` | company | MFA; Rsn; reactivation → R-owner approval (202) |
| API-M02-25 | STF | `admin.roles.read` | company | — |
| API-M02-26…27 | STF | `admin.roles.change` | company | MFA; Ver; Rsn; activation/privileged change → 2nd (202) |
| API-M02-28 | STF | `admin.access_review.start` | company | MFA |
| API-M02-29 | STF | `admin.access_review.decide` | assigned | Reviewer ≠ reviewed user; Rsn |
| API-M02-30 | STF | `audit.read` | company | FIN: finance objects; BM: own-branch objects; before/after masked (D-153); view logged (MOCKUP) |
| API-M02-31 | STF | `sensitive.reveal` | assigned | Rsn; time-limited; Aud (D-153) |
| API-M02-32 | CUS/VEN | `identity.self` | own | StepUp (D-202); never where MFA is mandatory (D-200); Dec (D-040) |
| API-M02-33 | STF/VEN | `identity.self` | own | Own non-security fields only; Dec (D-174) |
| API-M02-34 | STF | `staff.assignable.read` | loc | Names/roles only, no contact data; caller must hold an assign action for the task type |
| API-M02-35 | STF | `integration.read` | company | Credentials masked (SEC); Dec (D-083, D-107) |
| API-M02-36…37 | STF | `integration.secret.rotate` | company | MFA; 2nd approver; scope limited to named operations; revoke is immediate; Dec (D-083, D-107) |
| API-M02-38 | PUB | `public.invitation` | token | RL; expired token only; notifies inviter, never re-issues automatically; Dec (D-040) |
| API-M02-39 | STF | `admin.roles.change` | company | MFA; Rsn; named post-reviewer and cadence required; Dec (D-196) |
| API-M02-40 | STF | `admin.roles.change` / named post-reviewer | assigned | R-owner or the named post-reviewer (As); Rsn; Dec (D-196) |
| API-M02-41…42 | STF | `admin.access_review.start` / `admin.access_review.decide` (own items) | assigned | Reviewers (`admin.access_review.decide`) see only their assigned items |

### 13.2 M03 — Organisation & locations (11 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M03-01 | PUB | `public.content` | public | — |
| API-M03-02 | STF | `org.locations.read` | loc | Full list for OPS/OWN |
| API-M03-03…04 | STF | `org.locations.manage` | company | MFA; Rsn; deactivation guard BR-M03-05 |
| API-M03-05 | STF | `org.bins.read` | loc | — |
| API-M03-06 | STF | `org.bins.manage` | loc | Aud |
| API-M03-07 | STF | `org.bins.read` | loc | — |
| API-M03-08 | STF | `org.company.read` | company | — |
| API-M03-09 | STF | `org.company.edit` | company | MFA; 2nd (BR-M03-06) |
| API-M03-10…11 | STF | `identity.self` | own | Only companies/locations within the user's assignment; Dec (D-170) |

### 13.3 M04 — Catalog (41 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M04-01 | PUB | `public.catalog` | public | Approved visible catalog only |
| API-M04-02 | PUB/CUS | `public.catalog` | public | Approved visible catalog only |
| API-M04-03 | PUB/CUS | `public.catalog` | public | Price context derived server-side (T02, T10); `private, no-store` when personalised (T22) |
| API-M04-04 | PUB | `public.catalog` | public | Dec (D-022/D-023/D-037, D-071, D-072, D-041) |
| API-M04-05…06 | PUB/CUS | `public.catalog` | public | Dec (D-022/D-023/D-037, D-071, D-072, D-041) |
| API-M04-07 | PUB | `public.catalog` | public | Dec (D-022/D-023/D-037, D-071, D-072, D-041) |
| API-M04-08 | CUS | `review.submit` | own | Verified purchase; Dec (D-041); RL |
| API-M04-09 | PUB/CUS | `public.feedback` | public | RL; Dec (D-041) |
| API-M04-10 | STF | `review.moderate` | assigned | Aud; Dec (D-041) |
| API-M04-11 | PUB | `public.catalog` | public | Dec (D-065) |
| API-M04-12 | PUB/CUS | `question.ask` | own | RL; Dec (D-065) |
| API-M04-13 | STF | `question.answer` | company | Aud; Dec (D-065) |
| API-M04-14 | PUB/CUS | `public.feedback` | public | RL; Dec (D-141) |
| API-M04-15 | STF | `catalog.product.read` | company | Cost/margin columns only with `cost.view` (D-197) |
| API-M04-16 | STF | `catalog.product.draft` | assigned | CAT: assigned categories |
| API-M04-17 | STF | `catalog.product.read` | company | Cost/margin only with `cost.view` |
| API-M04-18 | STF | `catalog.product.draft` | assigned | Ver; never overwrites live (BR-M04-07) |
| API-M04-19 | STF | `catalog.product.draft` | assigned | CAT: own drafts; reviewer |
| API-M04-20 | STF | `catalog.product.draft` / `catalog.product.publish` / `catalog.product.suspend` (per action) | assigned | Per action: submit (`catalog.product.draft`), publish (`catalog.product.publish`, D-081), suspend/archive (`catalog.product.suspend`); SoD for publish; Aud |
| API-M04-21 | STF | `catalog.product.read` | company | — |
| API-M04-22 | STF/VEN | `catalog.reference.read` | company | Vendors get the subset via API-M14-12 |
| API-M04-23 | STF | `catalog.brand.propose` | company | Approval (BR-M04-08) |
| API-M04-24 | STF | `catalog.policy.version` | company | Rsn; Aud; Dec (D-022, D-023) |
| API-M04-25 | STF | `catalog.category.read` | company | — |
| API-M04-26 | STF | `catalog.category.manage` | company | Template permission |
| API-M04-27 | STF | `catalog.category.read` | company | — |
| API-M04-28…29 | STF | `catalog.category.manage` | company | Ver; review before publication |
| API-M04-30 | STF | `catalog.import.run` | company | Idem; upload restrictions (M22) |
| API-M04-31…32 | STF | `catalog.import.read` | company | — |
| API-M04-33…34 | STF | `catalog.import.run` | company | — |
| API-M04-35…36 | STF | `catalog.import.run` | company | Idem; commit creates drafts only (no publication) |
| API-M04-37…38 | STF | `catalog.import.read` | company | Error report: CSV neutralised (BP §14.4) |
| API-M04-39 | STF | `catalog.review.read` | assigned | Reviewers (D-081); CAT read |
| API-M04-40 | STF | `catalog.tax.manage` | company | New version needs review before active (maker ≠ approver); Rsn; Aud; Dec (D-037) |
| API-M04-41 | STF | `catalog.reference.read` | company | Dec (D-022, D-023) |

### 13.4 M05 — Pricing (24 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M05-01 | PUB/CUS/GAT/LNK/STF | `pricing.quote` | own | PUB/CUS/GAT/LNK/STF; context derived; quote bound to caller context; `no-store` |
| API-M05-02 | CUS/GAT/LNK/STF | `pricing.quote` | own | PUB/CUS/GAT/LNK/STF; context derived; quote bound to caller context; `no-store` |
| API-M05-03 | CUS | `dealer.order` | org | Member ordering permission (D-066); Dec (D-121) |
| API-M05-04 | CUS/STF | `dealer.price_list.read` | org | Member price visibility (D-066); `no-store` |
| API-M05-05 | CUS | `dealer.price_list.export` | org | Dec (D-152); watermark per D-152 |
| API-M05-06 | CUS | `dealer.quote_request` | org | Dec (D-121) |
| API-M05-07 | CUS/STF | `dealer.quote_request` | org | Staff read via `pricing.quote_request.manage`; Dec (D-121) |
| API-M05-08 | STF | `pricing.quote_request.manage` | company | Within authority (D-024); Dec (D-121) |
| API-M05-09 | CUS | `dealer.quote_request` | org | Dec (D-121) |
| API-M05-10…11 | STF | `pricing.price_list.read` | company | Cost/margin only with `cost.view` |
| API-M05-12 | STF | `pricing.price_list.manage` | company | Draft only; activation via approval; Dec (D-044) for location lists |
| API-M05-13 | STF | `pricing.price_list.change` | company | BM within delegated policy; SS request only; approval + SoD (editor ≠ approver); Ver; Rsn |
| API-M05-14 | STF | `pricing.price_list.read` | company | Requester or approvers |
| API-M05-15 | STF | `pricing.price_list.read` | company | Dec (D-018) |
| API-M05-16 | STF | `pricing.simulate` | company | Read-only; never persists |
| API-M05-17 | STF | `pricing.promotion.read` | company | Dec (D-043) |
| API-M05-18…19 | STF | `pricing.promotion.manage` | company | Approval; Dec (D-043) |
| API-M05-20 | STF | `pricing.controls.read` | company | Dec (D-024) |
| API-M05-21 | STF | `pricing.margin_floor.change` | company | Approval + 2nd; Dec (D-024) |
| API-M05-22 | STF | `pricing.cost_signal` | company | Requires `cost.view` |
| API-M05-23 | STF | `pricing.cost_signal` | company | Creates draft change only (BR-M05-14) |
| API-M05-24 | STF | `pricing.promotion.manage` | company | Rsn; Aud; Dec (D-043) |

### 13.5 M06 — Inventory (32 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M06-01 | PUB/CUS | `public.catalog` | public | Dec (D-029, D-061) for 01 |
| API-M06-02 | PUB | `public.catalog` | public | Dec (D-029, D-061) for 01 |
| API-M06-03…04 | STF | `inventory.stock.read` | loc | Cross-branch read-only per D-029; cost only with `cost.view` |
| API-M06-05…07 | STF | `inventory.serial.read` | loc | Manufacturer serial masked (D-153) |
| API-M06-08 | STF | `inventory.serial.action` | loc | WH: request; BM/OPS execute; Rsn |
| API-M06-09 | STF | `inventory.inspection.record` | assigned | Assigned inspector; Idem; Dec (D-023) |
| API-M06-10 | STF | `inventory.inspection.record` | assigned | Dec (D-147) |
| API-M06-11 | STF | `inventory.movements.read` | loc | Value columns only with `cost.view` |
| API-M06-12 | STF | `inventory.transfer.read` | loc | — |
| API-M06-13 | STF | `inventory.transfer.request` | loc | Approval by value (D-024) |
| API-M06-14 | STF | `inventory.transfer.read` | loc | — |
| API-M06-15 | STF | `inventory.transfer.ship` | loc | Source location; Idem |
| API-M06-16 | STF | `inventory.transfer.receive` | loc | Destination location; Idem |
| API-M06-17 | STF | `inventory.transfer.discrepancy` | loc | Loss → approval (D-024); Rsn |
| API-M06-18 | STF | `inventory.count.read` | loc | — |
| API-M06-19 | STF | `inventory.count.start` | loc | Dec (D-069) |
| API-M06-20 | STF | `inventory.count.perform` | assigned | Assigned counter; expected qty hidden (blind count, MOCKUP) |
| API-M06-21 | STF | `inventory.count.perform` | assigned | Idem; no stock change until approval |
| API-M06-22 | STF | `inventory.adjustment.read` | loc | Value only with `cost.view` |
| API-M06-23 | STF | `inventory.adjustment.request` | loc | Idem; Rsn; threshold routing (D-024); SoD |
| API-M06-24 | STF | `inventory.reservation.read` | loc | Dec (D-026) |
| API-M06-25 | STF | `inventory.reservation.manage` | loc | Extend once with Rsn; SS: own orders; Idem |
| API-M06-26 | STF | `inventory.supplier_feed.read` | company | Dec (D-028) |
| API-M06-27 | STF | `inventory.supplier_feed.manage` | company | Rsn |
| API-M06-28 | STF | `inventory.supplier_feed.read` | company | — |
| API-M06-29 | STF | `inventory.supplier_feed.manage` | assigned | Reviewer; Rsn |
| API-M06-30 | STF | `purchasing.manage` | loc | Dec (D-070, D-222) |
| API-M06-31 | STF | `inventory.serial.read` | loc | Manufacturer serial masked (D-153); Dec (D-111) |
| API-M06-32 | STF | `inventory.count.perform` | assigned | Assigned counter; Idem; freezes the bin; Dec (D-069) |

### 13.6 M07 — Purchasing & receiving (23 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M07-01 | STF | `purchasing.read` | loc | Dec (D-070, D-222) |
| API-M07-02 | STF | `purchasing.manage` | loc | Creates draft POs only (BR-M07-02) |
| API-M07-03 | STF | `purchasing.read` | loc | WH read for receiving (loc); FIN read |
| API-M07-04 | STF | `purchasing.manage` | loc | — |
| API-M07-05 | STF | `purchasing.read` | loc | — |
| API-M07-06 | STF | `purchasing.manage` | loc | Ver |
| API-M07-07 | STF | `purchasing.manage` | loc | Submit → approval by value (D-024); SoD; Idem |
| API-M07-08 | STF | `purchasing.read` | loc | — |
| API-M07-09 | STF | `receiving.grn.record` | loc | Idem; SoD warn PO creator ≠ receiver (D-196) |
| API-M07-10 | STF | `receiving.grn.read` | loc | Landed cost only with `cost.view` |
| API-M07-11…12 | STF | `receiving.grn.record` | loc | Dec (D-056) for landed cost |
| API-M07-13 | STF | `receiving.grn.record` | loc | Idem; posting TX-5 |
| API-M07-14 | STF | `purchasing.bill.read` | company | — |
| API-M07-15 | STF | `purchasing.bill.record` | company | Idem |
| API-M07-16 | STF | `purchasing.bill.read` | company | — |
| API-M07-17 | STF | `purchasing.bill.action` | company | Variance approval by threshold (D-024); SoD |
| API-M07-18…19 | STF | `purchasing.read` | company | — |
| API-M07-20 | STF | `receiving.grn.read` | loc | Landed cost only with `cost.view` (D-197) |
| API-M07-21 | STF | `purchasing.manage` | loc | Buyer designation (D-222); last cost only with `cost.view` (D-197) |
| API-M07-22…23 | STF | `purchasing.supplier.manage` | company | Buyer designation (D-222); bank details excluded — only via payout-account change (BP §11.5); Aud |

### 13.7 M08 — Customers & business accounts (50 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M08-01 | PUB | `public.registration` | public | Requires verification_token (API-M02-03); RL; Dec (D-040) |
| API-M08-02…10 | CUS | `customer.self` | own | Contact change: codes to old and new contact (-04) |
| API-M08-11 | PUB | `public.feedback` | public | RL; Dec (D-141) |
| API-M08-12 | CUS | `customer.self` | own | Dec (D-037, D-060) |
| API-M08-13 | CUS | `customer.self` | own | StepUp for deletion (D-202); Dec (D-060) |
| API-M08-14…19 | CUS | `customer.self` | own | -15 RL; -16…-19 Dec (D-042, D-141) |
| API-M08-20 | PUB/CUS | `dealer.application.submit` | own | PUB creating account per D-040; RL; Dec (D-067) |
| API-M08-21…22 | CUS | `customer.self` | own | Own application only |
| API-M08-23 | CUS/STF | `dealer.gstin.verify` | own | RL; staff re-run via `dealer.application.review` |
| API-M08-24 | CUS/STF | `business.account.read` | org | Member of this account; staff via `customer.read` |
| API-M08-25 | CUS/STF | `business.members.read` | org | Member team permission (D-066) |
| API-M08-26…27 | CUS/STF | `business.members.manage` | org | Owner member role (D-066); staff on behalf logged; cannot remove last owner |
| API-M08-28…29 | STF | `customer.read` | company | PII masked by default (D-153); BM: loc-related customers (D-029) |
| API-M08-30 | STF | `customer.note` | company | Dec (D-134) |
| API-M08-31 | STF | `customer.tag` | company | Dec (D-145) |
| API-M08-32 | STF | `customer.message.bulk` | company | Consent + template checks; Dec (D-145, D-058) |
| API-M08-33 | STF | `customer.read` | company | — |
| API-M08-34 | STF | `business.account.invite` | company | Aud |
| API-M08-35 | STF | `business.account.status` | company | Rsn; reinstatement approval |
| API-M08-36 | STF | `business.account.price_list_change` | company | BP §18.1 'Change dealer tier'; SS request; BM within delegated policy; approval; Dec (D-019) for credit terms |
| API-M08-37 | STF | `business.account.preview` | company | Read-only; Aud; Dec (D-149) |
| API-M08-38…39 | STF | `dealer.application.review` | company | Documents via private file access, views logged |
| API-M08-40 | STF | `dealer.application.decide` | company | Rsn; SoD; Dec (D-067) |
| API-M08-41…42 | STF | `customer.duplicates` | company | — |
| API-M08-43 | STF | `customer.merge` | company | Rsn; reversible; Dec (D-133) |
| API-M08-44…45 | STF | `privacy.data_request` | company | Rsn; Dec (D-036, D-037, D-060) |
| API-M08-46 | CUS | `dealer.order` | org | Buyer sub-role; no stock reserved; Dec (D-066) |
| API-M08-47 | CUS | `dealer.order.approve` (owner) / `dealer.order` (buyer, own) | org | Owner sub-role sees all; buyer sees own requests (`dealer.order`); Dec (D-066) |
| API-M08-48 | CUS | `dealer.order.approve` | org | Owner sub-role; approver ≠ requester; Rsn on decline; Dec (D-066) |
| API-M08-49 | CUS | `customer.self` | own | RL; linking only after verification, never by name match (BP §13.4); Dec (D-168) |
| API-M08-50 | CUS | `business.account.change_request` | org | Owner sub-role; dealer pricing paused until re-verified; staff on behalf via `dealer.application.review`; Dec (D-066, D-067) |

### 13.8 M09 — Storefront content (2 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M09-01 | PUB/CUS | `public.content` | public | Dealer modules only for verified members; `private` when personalised; Dec (D-142) |
| API-M09-02 | PUB/CUS | `public.catalog` | public | No private price unless verified member (`private, no-store`); Dec (D-164, D-142) |

### 13.9 M10 — Cart, checkout & orders (26 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M10-01…05 | PUB/CUS | `cart.own` | own | Guest cart token or customer; Dec (D-129) |
| API-M10-06 | CUS/PUB (guest per D-021)/LNK | `order.place` | own | CUS / guest per D-021 / LNK; Idem; member order limit (D-066); server-derived price/context (T10) |
| API-M10-07 | CUS/GAT/STF | `order.read` | own/org; staff loc | CUS own/org; GAT this order; staff role + loc; others 404 |
| API-M10-08 | CUS/STF | `order.read` | own/org; staff loc | CUS own; dealer org per member visibility (D-066); staff role + loc |
| API-M10-09 | CUS/GAT/STF | `order.cancel` | own/org; staff loc | CUS own/org; GAT; staff; Idem; refund via M11 rules |
| API-M10-10…12 | PUB | `public.order_access` | public | RL; NoEnum; Dec (D-021) |
| API-M10-13 | STF | `order.manage` | loc | Per-order results; each action individually authorised |
| API-M10-14 | STF | `order.hold` | loc | Rsn; owner; review date |
| API-M10-15 | STF | `order.hold` | loc | Hold owner or BM+ |
| API-M10-16 | STF | `order.note` | loc | Dec (D-134) |
| API-M10-17 | STF | `order.manage` | loc | Idem; Rsn |
| API-M10-18…19 | STF | `order.assisted` | loc | Staff discount within authority (D-024) else approval; chat prices not trusted |
| API-M10-20 | STF | `order.assisted` | loc | Idem; Dec (D-151, D-014) |
| API-M10-21 | STF | `order.assisted.confirm` | loc | Idem; Dec (D-009, D-012, D-030) |
| API-M10-22 | LNK | `link.checkout` | token | LNK token + customer verification (D-021/D-040); Dec (D-151) |
| API-M10-23 | STF | `order.replacement` | loc | Idem; Dec (D-022) |
| API-M10-24 | CUS | `order.read` | own | Own/org line only; StepUp (D-202); Aud; Dec (D-167) |
| API-M10-25 | CUS | `cart.own` | own | Reprice with explicit notice (BP §6.5); Dec (D-129) |
| API-M10-26 | STF | `order.verification_flag` | company | MFA; Rsn; Aud; flag excludes the order from reports/metrics/accounting export; Dec (D-209) |

### 13.10 M11 — Payments, refunds & reconciliation (22 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M11-01…02 | CUS/GAT/LNK | `payment.own` | own | CUS own/org; GAT; LNK; Idem (-01); server-verified status only |
| API-M11-03 | SIG | `webhook.payment` | provider | Sig (raw body); dedup; out-of-order safe; Dec (D-012) |
| API-M11-04…05 | STF | `payment.read` | company | SS: read, loc |
| API-M11-06 | STF | `payment.reconcile` | company | SS: single order; Idem |
| API-M11-07 | STF | `payment.read` | company | — |
| API-M11-08 | STF | `refund.read` | company | SS: own requests |
| API-M11-09 | STF | `refund.request` | loc | Idem; Rsn |
| API-M11-10 | STF | `refund.execute` | company | Idem; approve/submit within policy (D-024); check_release by a second finance user (M/C); OWN override with Rsn |
| API-M11-11 | STF | `refund.execute` | company | Query before any retry (T19) |
| API-M11-12 | STF | `refund.execute` | company | Idem; provider-status check first |
| API-M11-13 | STF | `finance.settlement` | company | Idem; Dec (D-064) |
| API-M11-14…15 | STF | `finance.settlement` | company | Dec (D-064) |
| API-M11-16…17 | STF | `finance.reconciliation` | company | Rsn on resolution |
| API-M11-18 | STF | `finance.reconciliation` | company | Dec (D-020) |
| API-M11-19 | STF | `payment.offline.record` | loc | Idem; bank-transfer match FIN; Dec (D-012, D-009) |
| API-M11-20 | STF | `finance.close` | company | — |
| API-M11-21 | STF | `finance.close` | company | Maker ≠ checker (BR-M11-17) |
| API-M11-22 | CUS/GAT/LNK | `payment.own` | own | GAT/LNK bound to that order; Dec (D-012, D-020, D-062, D-184) |

### 13.11 M12 — Fulfilment & shipping (21 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M12-01 | PUB/CUS | `public.catalog` | public | Dec (D-013, D-020, D-061) |
| API-M12-02 | CUS/GAT | `return.self` | own | CUS/GAT own RMA; Dec (D-013) |
| API-M12-03…04 | STF | `fulfilment.read` | loc | Customer data limited to shipping label (MK record-scope note) |
| API-M12-05 | STF | `fulfilment.assign` | loc | Dec (D-132) |
| API-M12-06 | STF | `fulfilment.assign` | loc | WH lead designation (D-222) |
| API-M12-07…08 | STF | `fulfilment.execute` | assigned | Assigned task; Dec (D-031) for -07 |
| API-M12-09 | STF | `fulfilment.execute` | assigned | Idem; Dec (D-147) |
| API-M12-10 | STF | `fulfilment.documents` | loc | Dec (D-055) |
| API-M12-11…13 | STF | `shipment.book` | loc | Idem (-11, -13); check carrier before re-booking (T20); Dec (D-013) |
| API-M12-14…15 | STF | `shipment.handover` | loc | Idem (-15); TX-4 |
| API-M12-16 | SIG | `webhook.shipping` | provider | Provider auth/Sig; dedup; raw status preserved; Dec (D-013) |
| API-M12-17 | STF | `shipment.sync` | loc | Idem; Dec (D-013) |
| API-M12-18 | STF | `fulfilment.exception` | loc | Rsn |
| API-M12-19 | STF | `fulfilment.pickup` | loc | Idem; collection verification; Dec (D-061) |
| API-M12-20 | CUS/GAT | `order.read` | own | RL; OTP goes only to the contact on the order; Dec (D-183, D-013) |
| API-M12-21 | STF | `fulfilment.read` | loc | Dec (D-147) |

### 13.12 M13 — Returns, RMA & warranty (18 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M13-01 | CUS/GAT/STF | `return.self` (customer) / `rma.read`, `rma.manage` (staff) | own; staff loc | CUS own/org; GAT; staff via `rma.manage`; Dec (D-022) |
| API-M13-02 | CUS/GAT/STF | `return.self` (customer) / `rma.read`, `rma.manage` (staff) | own; staff loc | CUS/GAT/STF; RL |
| API-M13-03 | CUS/GAT/STF | `return.self` (customer) / `rma.read`, `rma.manage` (staff) | own; staff loc | CUS own/org; GAT; staff creates RMA via `rma.manage`; Idem; Dec (D-022) |
| API-M13-04…05 | CUS/GAT/STF | `return.self` (customer) / `rma.read`, `rma.manage` (staff) | own; staff loc | Customer: plain-word states; staff read via `rma.read` (loc) |
| API-M13-06 | CUS/GAT/STF | `return.self` (customer) / `rma.read`, `rma.manage` (staff) | own; staff loc | Own RMA; uploads via M22 restrictions |
| API-M13-07 | STF | `rma.manage` | loc | Authorise beyond policy: BM/OPS; Rsn + policy clause |
| API-M13-08 | STF | `rma.assign` | loc | — |
| API-M13-09 | STF | `rma.manage` | loc | Idem; Dec (D-013) |
| API-M13-10 | STF | `rma.receive` | loc | Idem; TX-8 (quarantine) |
| API-M13-11 | STF | `rma.decide` | loc | Refund decision → `refund.execute` (FIN); disposition → BM / WH lead (D-222); separate decisions (BR-M13-04) |
| API-M13-12…13 | STF | `warranty.manage` | loc | — |
| API-M13-14…16 | STF | `supplier_rma.manage` | company | WH: request/read; buyer (D-222); share only needed data (BR-M13-15) |
| API-M13-17 | CUS/GAT | `return.self` | own; staff loc | Own/org RMA or GAT; Dec (D-169, D-150) |
| API-M13-18 | CUS | `customer.self` (customer) / `fulfilment.documents` (staff) | own; staff loc | Staff: `fulfilment.documents` (loc); serial partly masked for customers; Dec (D-022, D-111) |

### 13.13 M14 — Vendor portal & vendor management (69 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M14-01 | PUB | `public.vendor_application` | public | RL; creates applicant only; Dec (D-047) |
| API-M14-02…03 | VEN | `vendor.self.read` | org | Own org data only; no margins/other vendors (T11); Dec (D-142) announcements |
| API-M14-04…05 | VEN | `vendor.catalog.read` | org | — |
| API-M14-06 | VEN/INT | `vendor.catalog.write` | org | Permitted categories; no auto-publication (T12); INT vendor catalog credential allowed |
| API-M14-07…08 | VEN | `vendor.catalog.read` | org | — |
| API-M14-09…10 | VEN | `vendor.catalog.write` | org | Protected approval fields ignored/rejected (T13) |
| API-M14-11 | VEN | `vendor.self.read` | org | Messages on own submissions only |
| API-M14-12 | VEN | `vendor.catalog.read` | org | Permitted categories only |
| API-M14-13 | VEN/INT | `vendor.catalog.write` | org | Idem; INT allowed |
| API-M14-14…15 | VEN | `vendor.catalog.read` | org | — |
| API-M14-16…17 | VEN | `vendor.catalog.write` | org | Idem (-17) |
| API-M14-18 | VEN/INT | `vendor.ops.read` | org | INT allowed |
| API-M14-19 | VEN/INT | `vendor.availability.update` | org | Idem; INT vendor API key (availability scope only); never creates company stock; Dec (D-028) |
| API-M14-20 | VEN | `vendor.ops.read` | org | — |
| API-M14-21…22 | VEN | `vendor.api_key.manage` | org | StepUp (password + OTP per MK; D-202); Dec (D-083) |
| API-M14-23…24 | VEN | `vendor.ops.read` | org | — |
| API-M14-25…26 | VEN | `vendor.po.respond` | org | Idem (-26); Dec (D-131, D-037) |
| API-M14-27…30 | VEN | `vendor.fulfilment_task` | org | Minimal customer data (BP §11.2); Idem (-30); Dec (D-007, D-008) |
| API-M14-31 | VEN | `vendor.ops.read` | org | Catalog/Accounts view per D-137 |
| API-M14-32 | VEN | `vendor.rtv.respond` | org | — |
| API-M14-33 | VEN | `vendor.self.read` | org | Bank details masked |
| API-M14-34…35 | VEN | `vendor.profile.manage` | org | Changes via review; Dec (D-068) for -35 |
| API-M14-36…38 | VEN | `vendor.users.manage` | org | Dec (D-137) |
| API-M14-39…40 | VEN | `vendor.finance.read` | org | Dec (D-011) |
| API-M14-41 | VEN | `vendor.self.read` | org | — |
| API-M14-42 | VEN | `vendor.terms.accept` | org | OTP evidence (D-040) |
| API-M14-43…44 | VEN | `vendor.payout_change` | org | Vendor-side maker (accounts) + checker (admin) per MK; Tradex FIN maker-checker; Dec (D-068) |
| API-M14-45…46 | STF | `vendor.admin.read` | company | Bank/KYC masked; views logged |
| API-M14-47 | STF | `vendor.admin.onboard` | company | Dec (D-047) |
| API-M14-48…49 | STF | `vendor.admin.read` | company | Reviewers |
| API-M14-50 | STF | `vendor.admin.onboard` | company | Rsn; approval record (BR-M14-03); SoD; Dec (D-047, D-028) |
| API-M14-51 | STF | `vendor.admin.status` | company | Suspend: OPS; reinstatement: OWN approval; Rsn |
| API-M14-52 | STF | `vendor.admin.onboard` | company | Rsn; Aud |
| API-M14-53 | STF | `vendor.admin.message` | company | — |
| API-M14-54 | STF | `catalog.review.read` | assigned | Reviewers (D-081); decision via API-M17-03 |
| API-M14-55 | STF | `vendor.admin.read` | company | — |
| API-M14-56 | STF/VEN | `vendor.admin.read` | company | VEN read summary (`vendor.self.read`); Dec (D-081) |
| API-M14-57 | STF | `terms.read` | company | Dec (D-188) |
| API-M14-58 | STF | `terms.manage` | company | Draft only; publication via approval (API-M17-03); Aud; Dec (D-188) |
| API-M14-59 | VEN | `vendor.payout_change` | org | Account numbers masked; Dec (D-068) |
| API-M14-60 | VEN | `vendor.self.read` | org | Only about own listings/POs/RTVs |
| API-M14-61 | VEN | `vendor.api_key.manage` | org | Metadata only; key masked; Dec (D-083) |
| API-M14-62 | VEN | `vendor.fulfilment_task` | org | Minimal customer data (BP §11.2); Dec (D-007) |
| API-M14-63…65 | STF | `fulfilment_task.manage` | loc | Idem (-64); Rsn on cancel/reassign; Dec (D-007, D-181) |
| API-M14-66 | STF | `dealer.application.review` / `vendor.admin.onboard` (by document type) | company | Dealer documents: `dealer.application.review`; vendor documents: `vendor.admin.onboard`; document views logged; Dec (D-067, D-068) |
| API-M14-67 | VEN | `vendor.self.read` | own | R-vendor_applicant: own application only; Dec (D-047) |
| API-M14-68 | VEN | `vendor.profile.manage` | own | R-vendor_applicant: own application; no live catalog/stock write (BP §3.1); Dec (D-047) |
| API-M14-69 | VEN | `vendor.payout_change` | org | Vendor admin as checker ≠ maker; StepUp (OTP); then Tradex finance maker-checker; Dec (D-068) |

### 13.14 M16 — Support & WhatsApp (20 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M16-01…02 | PUB | `public.help` | public | — |
| API-M16-03 | PUB/CUS/GAT | `support.conversation.own` | own | PUB RL / CUS / GAT |
| API-M16-04 | STF | `support.inbox` | assigned | Queue/assignee scope; Dec (D-146) |
| API-M16-05…06 | CUS/GAT/STF | `support.conversation.own` (customer) / `support.inbox` (staff) | own; staff assigned | Customer: own conversation (`support.conversation.own`, limited fields); PII masked until verified (BP §13.4) |
| API-M16-07 | CUS/GAT/STF | `support.conversation.own` (customer) / `support.inbox` (staff) | own; staff assigned | Customer own conversation; staff assigned; templates outside window; Dec (D-014) |
| API-M16-08 | STF | `support.conversation.manage` | assigned | Link identity only after verification (BR-M16-08) |
| API-M16-09 | STF | `support.inbox` | assigned | Assigned agent; OTP to phone on the order (T23) |
| API-M16-10 | SIG | `webhook.whatsapp` | provider | Sig; dedup; Dec (D-014) |
| API-M16-11 | PUB/CUS/GAT/STF | `support.ticket.create` | own | CUS/GAT/PUB limited types RL; staff escalation; Dec (D-074, D-037, D-141) |
| API-M16-12…13 | STF | `support.ticket.manage` | assigned | Assignee scope |
| API-M16-14…15 | STF | `support.answer.read` | company | — |
| API-M16-16 | STF | `support.answer.draft` | company | Publication via approval (API-M17-03) |
| API-M16-17 | STF | `messaging.template.read` | company | — |
| API-M16-18 | STF | `messaging.template.manage` | company | Dec (D-014) |
| API-M16-19 | STF | `support.agent.self` | own | Dec (D-074) |
| API-M16-20 | PUB | `public.help` | public | Dec (D-074, D-037) |

### 13.15 M17 — Automation, exceptions, approvals & delegation (26 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M17-01…02 | STF | `approval.read` | assigned | Approvers of the type + requester |
| API-M17-03…04 | STF | `approval.decide` | assigned | Authority (type × value × delegation) (D-024, D-025); SoD (not requester); Ver; Rsn; bulk keeps per-item history |
| API-M17-05…06 | STF | `exception.read` | assigned | Team scope; OWN owner-level |
| API-M17-07 | STF | `exception.act` | assigned | Assignee / BM+; Rsn; maker-checker for call-back log |
| API-M17-08…09 | STF | `automation.read` | company | Rule owners; FIN read |
| API-M17-10 | STF | `automation.rule.state` | assigned | Named rule reviewer; Rsn; enabling needs completed template + dry run (MOCKUP) + approval; who may stop/enable D-194; Dec (D-078) |
| API-M17-11 | STF | `automation.rule.change` | company | Staging only, masked inputs; Dec (D-077) |
| API-M17-12 | STF | `automation.rule.change` | assigned | Rule owner; approval |
| API-M17-13 | STF | `staff.suggest` | company | Any staff |
| API-M17-14 | STF | `automation.pause` | company | MFA; Rsn; Aud (incident mode); D-194 |
| API-M17-15…16 | STF | `job.read` | company | Rule owners |
| API-M17-17 | STF | `job.act` | assigned | Rule owner / OPS; Idem; beyond-cap retry logged |
| API-M17-18 | STF | `threshold.read` | company | Dec (D-024) |
| API-M17-19 | STF | `threshold.change` | company | MFA; 2nd approver; effective date; Dec (D-024) |
| API-M17-20 | STF | `delegation.read` | company | Delegates: own delegations; Dec (D-025) |
| API-M17-21 | STF | `delegation.create` | own | Scope ⊆ delegator authority; owner-only items excluded; Dec (D-025) |
| API-M17-22 | STF | `delegation.create` | own | Extend: R-owner approval; Dec (D-025) |
| API-M17-23 | STF | `emergency_access.request` | own | Never self-granted; approval by OWN/OPS (API-M17-03); time-bounded; Dec (D-025) |
| API-M17-24 | STF | `emergency_access.review` | company | Post-event review; Dec (D-025) |
| API-M17-25 | STF | `digest.read` | assigned | Digest recipients; Dec (D-063) |
| API-M17-26 | STF | `digest.manage` | company | Dec (D-063) |

### 13.16 M18 — Reporting & exports (19 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M18-01…02 | STF | `report.run` | loc | Per-report permission; restricted columns (cost/margin/PII) need matching permission; BM branch-scoped; Dec (D-075) |
| API-M18-03 | STF | `export.create` | loc | Per-dataset permission; personal data → purpose + governed permission (D-152); Idem; Aud |
| API-M18-04 | STF | `export.own` | own | OWN/OPS see all |
| API-M18-05 | STF | `export.own` | own | Requester only; expiring; Aud; Dec (D-152) |
| API-M18-06 | STF | `report.schedule` | company | Dec (D-075) |
| API-M18-07 | STF | `report.schedule` | company | Recipients must hold the report permission; Dec (D-075) |
| API-M18-08…10 | STF | `report.schedule` | own | Schedule owner; OWN |
| API-M18-11 | STF | `staff.suggest` | company | Any staff |
| API-M18-12 | STF | `dashboard.owner` | company | BM branch-scoped; FIN finance tiles |
| API-M18-13…14 | STF | `saved_view.self` | own | Team-shared views visible to team |
| API-M18-15 | STF/VEN | `workspace.counts` | loc | Counts only for queues the caller can read; VEN own org; Dec (D-172) |
| API-M18-16 | STF | `report.run` | loc | Per-screen tile permission; restricted tiles need `cost.view`/PII permission; Dec (D-173) |
| API-M18-17 | STF | `report.run` | company | Per report; Dec (D-075) |
| API-M18-18 | STF | `report.definition.manage` | company | Proposal only; finance approval via API-M17-03 (proposer ≠ approver); Dec (D-075) |
| API-M18-19 | STF | `saved_view.self` | own | Owner of the view; team sharing within team scope |

### 13.17 M19 — Finance boundary & accounting export (12 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M19-01 | CUS/STF | `invoice.read` | own | CUS own; dealer member with invoice visibility (D-066); staff FIN / SS read; Dec (D-055) |
| API-M19-02 | CUS/GAT/STF | `invoice.read` | own | CUS own/org; GAT that order; staff; Dec (D-055) |
| API-M19-03 | CUS | `invoice.read` | own | CUS own/org |
| API-M19-04 | CUS/STF | `business.statement.read` | org | Member with invoice visibility (D-066); FIN; Dec (D-019, D-037) |
| API-M19-05 | CUS | `business.statement.read` | org | Member with invoice visibility (D-066); FIN; Dec (D-019, D-037) |
| API-M19-06 | STF | `finance.accounting_export` | company | Dec (D-011) |
| API-M19-07 | STF | `finance.accounting_export` | company | Idem (same keys); Dec (D-011) |
| API-M19-08 | STF | `finance.accounting_export` | company | Dec (D-011) |
| API-M19-09 | STF | `finance.accounting_export` | company | Dec (D-055, D-037) |
| API-M19-10 | CUS/GAT/STF | `invoice.read` | own/org; staff | CUS own/org; GAT that order; staff per `invoice.read`; Dec (D-055, D-111) |
| API-M19-11 | STF | `template.document.read` | company | Dec (D-055, D-111) |
| API-M19-12 | STF | `template.document.manage` | company | New version → approval → activation; fiscal templates FIN; Aud; Dec (D-055, D-111) |

### 13.18 M20 — Notifications (9 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M20-01…02 | STF/VEN | `notification.self` | own | STF/VEN own |
| API-M20-03 | STF | `notification.send` | loc | Approved templates + consent (T25); WH delivery templates only; Idem; Dec (D-058) |
| API-M20-04 | STF | `notification.status.read` | loc | Access to the entity required |
| API-M20-05 | SIG | `webhook.messaging` | provider | Sig; dedup; Dec (D-015) |
| API-M20-06 | CUS | `customer.self` | own | Dec (D-141) |
| API-M20-07 | PUB/CUS | `customer.self` | own | Dec (D-141) |
| API-M20-08…09 | CUS/STF/VEN | `notification.self` | own | Security-alert preference MOCKUP-ONLY (D-040) |

### 13.19 M21 — Search (4 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M21-01 | PUB/CUS | `public.catalog` | public | No private price in public results (BR-M21-06) |
| API-M21-02 | PUB | `public.catalog` | public | No private price in public results (BR-M21-06) |
| API-M21-03 | STF/VEN | `search.workspace` | loc | Results filtered by object-level authorisation (BR-M21-07); VEN own objects |
| API-M21-04 | STF | `search.synonyms.manage` | company | Aud |

### 13.20 M22 — Files & media (4 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M22-01 | CUS/GAT/STF/VEN | `file.upload` | own | Purpose-bound (return evidence, documents, media, bills, imports); type/size limits; malware scan (D-112); Dec (D-033) |
| API-M22-02 | CUS/GAT/VEN/STF | `file.read` | own | Owner or permitted per purpose; private files authorised; sensitive views watermarked + logged; Dec (D-033) |
| API-M22-03 | CUS/GAT/VEN/STF | `file.upload` | own | Uploader, unsubmitted only |
| API-M22-04 | STF | `media.url_import` | company | Allow-listed sources; SSRF-restricted; rights confirmed; Dec (D-057) |

### 13.21 M23 — Integrations & adapters (1 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M23-01 | INT | `integration.legacy_events` | provider | INT legacy POS credential; Idem; Dec (D-009, D-030) |

### 13.22 M24 — Administration & settings (14 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M24-01 | STF | `config.read` | company | Keys filtered by permission |
| API-M24-02 | STF | `config.change` | company | Approval where required; FIN finance keys; Rsn; effective date |
| API-M24-03 | STF | `integration.read` | company | Credentials masked; FIN payment/accounting |
| API-M24-04 | STF | `integration.manage` | company | — |
| API-M24-05 | STF | `integration.secret.rotate` | company | MFA; write-only; 2nd approver (BR-M24-02) |
| API-M24-06 | STF | `integration.read` | company | Credentials redacted |
| API-M24-07 | STF | `staff.suggest` | company | Any staff |
| API-M24-08 | STF | `system.status.read` | company | Summary for all staff; full for OWN/OPS; Dec (D-052) |
| API-M24-09 | STF | `system.restore_test` | company | MFA; Dec (D-005, D-052) |
| API-M24-10 | STF | `integration.manage` | company | MFA; Rsn; Aud |
| API-M24-11 | STF | `system.restore_test` | company | MFA; writes E-restore_rehearsal; Dec (D-108) |
| API-M24-12 | STF | `change.read` | company | Requesters see own requests (Own); Dec (D-191) |
| API-M24-13 | STF | `change.decide` | company | Rsn; Aud; Dec (D-191) |
| API-M24-14 | STF | `system.alerts.manage` | company | Every alert keeps an owner (BP §20.3); Rsn; Aud; Dec (D-195, D-052) |

### 13.23 M27 — SEO & discoverability (2 endpoints)

| Endpoint(s) | Auth | Permission key | Scope | Guards / notes |
|---|---|---|---|---|
| API-M27-01…02 | PUB | `public.seo` | public | Storefront server; no private dealer URLs (BR-M27-02); Dec (D-076) for -01 |

### 13.24 Coverage check

Endpoints mapped: **492 / 492** (M02 42 · M03 11 · M04 41 · M05 24 · M06 32 · M07 23 · M08 50 · M09 2 · M10 26 · M11 22 · M12 21 · M13 18 · M14 69 · M16 20 · M17 26 · M18 19 · M19 12 · M20 9 · M21 4 · M22 4 · M23 1 · M24 14 · M27 2 — equal to the `06-api.md` endpoint index after the 2026-09-27 gap resolution, which added 65 endpoints; the 427 earlier endpoints keep their keys — a script comparison of every `06-api.md` Auth·Authz cell with this section found no key differences). Any endpoint added to `06-api.md` must be added here with a key from §5 before it is implemented; an endpoint without a key is denied by default (§15 rule E1).

---

## 14. Access by surface

| Surface | Who | Authentication | Must never | Source |
|---|---|---|---|---|
| **Customer access** (storefront P-S*, `/v1/…` public and `/v1/me/…`) | R-guest, R-consumer, R-dealer | §3.1–3.4, §3.10 | See another customer's or business's orders, addresses, invoices or prices; obtain dealer prices without verified membership; trust client price/buyer type | BP §3.1, §6.5, §8.4, §17.6 · T02, T10, T22, T23 |
| **Vendor access** (P-V*, `/v1/vendor/…`) | R-vendor_applicant, R-supplier, vendor INT keys | §3.5, §3.7 | Read/write another vendor's records; publish directly; create company stock; see company margins or competitor costs; receive full customer orders | BP §3.1, §11.1–11.3 · T11–T14 |
| **ERP access** (P-E*, staff `/v1/…`) | Staff roles | §3.6; MFA for privileged | Act outside location/task scope; approve own high-risk requests; see cost/PII without permission | BP §3.1, §18 · T31 |
| **Admin access** (P-E15, M02/M24 admin keys) | R-owner, R-ops_admin (R-branch_manager team scope if delegated) | MFA mandatory; step-up per D-202 | Use shared admin passwords; self-elevate; change privileged roles, thresholds or secrets without a second approver; delete accounts or audit records | BP §18.1–18.2, §19.1; MK |
| **Machine access** | R-integration, providers (`SIG`) | §3.7; signatures | Call any operation outside the credential's named scope; sign in interactively | BP §3.1, §16.4, §17.4 |

Cross-surface rules: principals of one type are rejected by the other surfaces' endpoints (§3.11 S3); staff
"view as dealer" is a read-only preview unless D-149 decides otherwise (no session impersonation); staff acting
for a customer (assisted orders, member invitations) act under their own identity with the customer as subject,
and the action is audited (API-M10-18, API-M08-26).

---

## 15. Server-side enforcement rules (BP §17.4, §19.1)

| # | Rule | Verification |
|---|---|---|
| E1 | **Deny by default**: every endpoint declares its permission key (§13); an endpoint without a key or an unknown key is denied. `05-backend.md` M02 completion criterion "every API endpoint passes through AccessPolicy (automated check)" | TS-PERM-01 (route inventory vs §13) |
| E2 | Authorise on the server for **every** business operation — including native ERP screens (D-004), background jobs acting on user requests, exports and file downloads | TS-PERM-01, TS-PERM-04 |
| E3 | Object-level check after load, before effect/response; lists intersected with scope before pagination | TS-PERM-02 |
| E4 | Property-level allow-list per key for writes (no mass assignment); response fields shaped by role (masking §7) | TS-PERM-03, TS-PERM-10 |
| E5 | Never accept as authoritative: `is_admin`, role/permission flags, `dealer_approved`, customer type/segment/price list, `unit_price`/discount/tax/totals, `stock_quantity`/ATP, `seller_id`/offer owner, `refund_approved`/refund limits, `channel`, address ownership, membership (`06-api.md` §1.4; `03-database.md` §8.1). Such fields are processed as absent; outcome-changing values are recomputed and returned | TS-PERM-03 (T10) |
| E6 | Buyer context derived per request from the session and active membership; on sign-out or membership loss private data stops immediately; personalised responses `no-store` | TS-PERM-05 (T22) |
| E7 | Authority exceeded → `202 APPROVAL_REQUIRED` with an approval request, or `403 AUTHORITY_EXCEEDED` when the role may not even request | TS-PERM-09 |
| E8 | SoD rules §8 checked at assignment and at every decision | TS-PERM-08 |
| E9 | Privileged keys require an MFA-authenticated session; step-up actions (§3.11 S9) require recent re-authentication | TS-AUTH-02 |
| E10 | Audit event written in the same transaction as the change; reason required where §11 says so | TS-SVC-03 |
| E11 | Permission caches keyed by principal and invalidated on role/scope/membership/state change | TS-PERM-12 |
| E12 | Automations run as a declared system actor limited to their BP §12.3 "Action" and "Human boundary"; they cannot approve on behalf of people | TS-SVC-07 |
| E13 | Integration credentials limited to named operations and one organisation/system; vendor keys never reach staff or customer endpoints | TS-AUTH-09 |
| E14 | Out-of-scope and non-existent objects produce identical `404` responses and timing class | TS-PERM-02 |
| E15 | Frontend guards mirror but never replace server checks; UI permission hints come only from `API-M02-01` | TS-FE-05 |

---

## 16. Authorization test cases (OWASP API BOLA/BOPLA per BP §19.1; T10, T11, T22, T23, T31)
Case IDs are `<suite>.<n>`; suites are defined in `16-testing.md` §5. Each case runs for every role in the listed
columns of §5 that is denied (negative) and at least one role that is allowed (positive).

| Case | Threat | Setup | Action | Expected | BP test | APIs |
|---|---|---|---|---|---|---|
| TS-PERM-01.1 | Missing function-level check | Route inventory of the deployed API | Compare with §13 | Every route has a key; unknown routes denied | — | all |
| TS-PERM-01.2 | Matrix drift | Seeded roles S-03 | For each key × role in §5, call a representative endpoint | Allowed roles succeed; denied roles `403`/`404` | — | all |
| TS-PERM-02.1 | BOLA — customer order | Consumers A, B each with an order | A reads/cancels B's order by id | `404`; no state change | T23 (web) | API-M10-07, -09 |
| TS-PERM-02.2 | BOLA — addresses / quotes | A's session, B's address and quote ids | A places order with B's address or quote | `404` / `403 CONTEXT_INELIGIBLE`; no order | T10 | API-M10-06, API-M08-07, API-M05-02 |
| TS-PERM-02.3 | BOLA — business account | Dealers of accounts X, Y | X member reads Y price list, members, statements, invoices | `404` | T02 | API-M05-04, API-M08-24/25, API-M19-01/04 |
| TS-PERM-02.4 | BOLA — vendor records | Vendors V1, V2 | V1 reads/edits V2 submission, listing, PO, RTV, statement, user by changing id | `404`; nothing disclosed; security event logged | **T11** | API-M14-05, -08, -09, -24, -32, -38, -39 |
| TS-PERM-02.5 | BOLA — vendor search/files | V1 session | Workspace search and file download of V2 objects | Not returned / `404` | T11 | API-M21-03, API-M22-02 |
| TS-PERM-02.6 | BOLA — staff location | WH user scoped to location L1 | Open fulfilment, GRN, count or transfer of L2 | `404` (cross-branch stock read only per D-029) | — | API-M12-04, API-M07-10, API-M06-20, API-M06-14 |
| TS-PERM-02.7 | BOLA — guest token | GAT token for order O1 | Use token on O2; reuse expired token | `404` / `401` | T23 | API-M10-07, API-M19-02 |
| TS-PERM-02.8 | BOLA — checkout link | Link for draft D1 | Open D2 with D1 token | `404` | — | API-M10-22 |
| TS-PERM-02.9 | BOLA — exports, sessions, invitations, notifications | Users U1, U2 | U1 downloads U2 export, revokes U2 session, resends U2's account invitation, reads U2 notifications | `404` | — | API-M18-05, API-M02-11, -18, API-M20-01 |
| TS-PERM-02.10 | BOLA — support conversation | Two customers with conversations | Customer reads other's conversation | `404` | T23 | API-M16-05, -06 |
| TS-PERM-03.1 | BOPLA — price/buyer type | Guest and consumer sessions | Send `unit_price`, `customer_type=dealer`, `dealer_approved`, `seller_id`, `channel` in quote/order | Ignored; server recomputes; response shows authoritative values; event logged (MK "requests with customer_type=dealer ignored") | **T10** | API-M05-01, API-M10-06, API-M04-03 |
| TS-PERM-03.2 | BOPLA — vendor approval fields | Vendor with approved listing | Edit warranty/brand/condition/tax class; set `state=approved`, permitted categories | Pending version created for review; live unchanged; protected fields rejected | **T13** | API-M14-06, -09, -10 |
| TS-PERM-03.3 | BOPLA — refund approval | SS session | Create refund with `refund_approved=true` or amount above refundable | Ignored / `422`; approval required; refundable cap enforced (I-05) | T18 | API-M11-09, -10 |
| TS-PERM-03.4 | BOPLA — self elevation | Non-privileged staff; member buyer | Change own roles/scope; member changes own role/limit | `403`; audited | — | API-M02-22, API-M08-27 |
| TS-PERM-03.5 | BOPLA — payout bypass | Vendor accounts user | Write bank details directly on profile | Rejected; only payout-change request path | — | API-M14-33/34/43 |
| TS-PERM-03.6 | BOPLA — dealer GSTIN change | Dealer owner; buyer member | Owner changes GSTIN/legal name; buyer attempts the same | Owner: change request created, dealer pricing paused until re-verification (MK); buyer: `403` | — | API-M08-50 |
| TS-PERM-04.1 | Function level — principal type | Customer, vendor, integration sessions | Call staff endpoints (e.g. API-M02-20, API-M06-23) | `401`/`403` | — | staff routes |
| TS-PERM-04.2 | Function level — role | WH user | Call admin, pricing and finance keys | `403` | — | API-M02-21, API-M05-13, API-M11-10 |
| TS-PERM-04.3 | Integration scope | Vendor availability key | Call submission, PO or other vendor endpoints | `403`/`404` | T11 | API-M14-06, -23 |
| TS-PERM-04.4 | Webhook forgery | No / wrong signature | Post payment/shipping/WhatsApp event | `401 SIGNATURE_INVALID`; no effect; logged | T07 | API-M11-03, API-M12-16, API-M16-10, API-M20-05 |
| TS-PERM-05.1 | Private price — public | Guest | Request offers/search/sitemap for a dealer-listed SKU with forged parameters | Only public price | **T02** | API-M04-03, API-M21-01, API-M27-02 |
| TS-PERM-05.2 | Private price — sign-out cache | Dealer browses, signs out; guest uses same browser/shared cache/CDN | Browse same pages | No private price anywhere (HTML, API, client cache) | **T22** | API-M02-06, API-M04-03, API-M09-01 |
| TS-PERM-05.3 | Private price — membership loss | Member removed / account suspended mid-session | Next request | Dealer context gone; cart repriced with notice | T22 | API-M02-01, API-M05-01 |
| TS-PERM-06.1 | Chat disclosure | Unverified chat/WhatsApp user | Ask status/address/invoice/serial of an order | No disclosure; verification offered; hand-off | **T23** | API-M16-07, -09 |
| TS-PERM-06.2 | Chat scope | Verified for order O1 | Ask for O2 | No disclosure | T23 | API-M16-09 |
| TS-PERM-07.1 | Owner away — routine | Delegation active (scoped) | Delegate approves in-scope item | Allowed; tagged "delegated" | **T31** | API-M17-03, -21 |
| TS-PERM-07.2 | Owner away — out of scope | Same | Delegate attempts permission change, payout change, above-limit item | `403`; escalates / waits for owner (never auto-approved) | T31 | API-M02-22, API-M14-43, API-M17-03 |
| TS-PERM-07.3 | Delegation expiry | Delegation ended | Former delegate decides | `403` | T31 | API-M17-03 |
| TS-PERM-08.1 | SoD — self approval | User requests adjustment/refund/price change | Same user approves | `403 SELF_APPROVAL_NOT_ALLOWED` | — | API-M17-03 |
| TS-PERM-08.2 | Maker = checker | Finance maker | Same user checks & releases / signs close as checker | `403` | — | API-M11-10, -21 |
| TS-PERM-08.3 | Privileged grant | OPS grants R-finance | Without second approver | `202`; role not active until approved; MFA required | — | API-M02-22 |
| TS-PERM-08.4 | Admin + warehouse conflict | Assign admin keys to a WH user | Save | Rejected (SoD-2) | — | API-M02-22 |
| TS-PERM-09.1 | Threshold within/above | Active test thresholds (fixtures only) | Execute within and above | Within → executes; above → `202` approval | — | API-M06-23, API-M10-19 |
| TS-PERM-09.2 | Request-only role | SS | Execute a refund | `202`/`403` — request created, not executed | — | API-M11-09, -10 |
| TS-PERM-09.3 | Stale approval | Subject changed after request | Approve with old expected_version | `409 VERSION_CONFLICT` | T13 | API-M17-03 |
| TS-PERM-10.1 | Masking | SS, WH, FIN sessions | Read customer 360, serial unit | PII/serial masked per §7 | — | API-M08-29, API-M06-07 |
| TS-PERM-10.2 | Reveal | Permitted user | Reveal without reason; with reason | `422`; with reason → value, time-limited, audited | — | API-M02-31 |
| TS-PERM-10.3 | Cost/margin | CAT (not assigned), BM, SS | Read products, reports, exports | Cost/margin columns absent (D-197) | — | API-M04-15, API-M18-02, -03 |
| TS-PERM-10.4 | Secrets | Any role | Read integrations/configuration | Secrets never returned | — | API-M24-01, -03, -06 |
| TS-PERM-11.1 | Location switch | BM of L1 | Switch to L2 in shell / pass L2 filter | Not offered; filter ignored/`404` | — | API-M03-02, API-M12-03 |
| TS-PERM-11.2 | Reports & dashboard scope | BM | Run branch report, owner dashboard | Own branch only | — | API-M18-02, -12 |
| TS-PERM-12.1 | Suspension | Vendor suspended | Submit change / update availability | `403`/`409`; history readable by staff | T12 | API-M14-06, -19 |
| TS-PERM-12.2 | Deactivation | Staff deactivated with live session | Next request | `401`; sessions revoked | — | API-M02-24 |
| TS-PERM-12.3 | Role removal | Role removed during session | Next request | Permission gone (cache invalidated) | — | API-M02-22 |
| TS-PERM-13.1 | Emergency access | Staff requests access | Self-approve; act after expiry | `403`; actions tagged EMERGENCY while valid; post-review task created | — | API-M17-23, -24 |
| TS-PERM-14.1 | Approval routing | Vendor content submission | Reviewer without D-081 designation decides | `403 AUTHORITY_EXCEEDED` | T12 | API-M17-03 |
| TS-PERM-02.11 | BOLA — dealer order approvals | Business accounts X, Y | X owner lists/decides Y's order approvals | `404` | T02 | API-M08-47, -48 |
| TS-PERM-08.5 | SoD — dealer order approval | Buyer member over limit | Buyer approves own request; owner approves → buyer places order with `order_approval_id` | Buyer `403`; approved order accepted once, no stock reserved before placement | — | API-M08-46…48, API-M10-06 |
| TS-PERM-04.5 | Function level — vendor applicant | R-vendor_applicant session | Read/update own application; call any R-supplier endpoint (submissions, availability, POs) | Own application only; supplier endpoints `403` (BP §3.1 "no live catalog or stock write") | — | API-M14-67/68, API-M14-06, -19 |
| TS-PERM-09.4 | Privileged operational flags | SS, FIN, OPS without MFA, OPS with MFA | Flag an order as verification/test transaction; issue an inbound integration credential | Only OPS/OWN with MFA; credential issuance needs second approver (`202`) | — | API-M10-26, API-M02-36 |
| TS-PERM-09.5 | Change register & templates | Requester (any staff), OPS, OWN, FIN | Read change requests; decide one; publish a fiscal template version | Requester sees own only; only OWN decides; template activates only after approval | — | API-M24-12/13, API-M19-12 |
| TS-PERM-11.3 | Assignee picker scope | BM of L1 | List assignable staff | Only staff within L1 scope, names/roles only (no contact data) | — | API-M02-34 |

Authentication-side cases (sign-in, MFA, lockout, sessions, CSRF/CORS, logging) are in `16-testing.md` suites
TS-AUTH-01…10.

---

## 17. Source and plan inconsistencies noted

| # | Inconsistency | Treatment |
|---|---|---|
| 1 | BP §18.1 gives Manager "Yes" for *Create product draft* and *Record matching receipt*, and Owner/admin "Yes" for receipts; `06-api.md` API-M04-16 and API-M07-09 omit R-branch_manager / R-ops_admin / R-owner | This file follows BP §18.1 (§5.2); `06-api.md` auth cells should be aligned |
| 2 | MK:erp-admin.html shows "View supplier cost & margin — Manager: own branch"; MK:erp-pricing.html says cost & margin "visible only to Finance, Operations admin and Owner" | D-197 |
| 3 | MK:store-login.html#register discloses "This email already has a Tradex account"; MK m-forgot and `06-api.md` API-M02-02 require non-enumeration | D-040 (default non-enumerating) |
| 4 | MK: public vendor application does not create a portal login (invitation after approval); `06-api.md` API-M14-01 says it creates an R-vendor_applicant login | D-047 |
| 5 | MK shows a branch manager needing an extra "Warehouse receiver" role to receive goods, while BP §18.1 lets Manager record receipts | BP followed; mockup sample noted under D-196 |
| 6 | MK:store-dealer.html#team: buyer above order limit → owner approval request; `06-api.md` originally returned only `403 ORDER_LIMIT_EXCEEDED` | Resolved in `06-api.md` §8 (API-M08-46…48; key `dealer.order.approve`); entity gap E-01 remains (D-066) |
| 7 | `06-api.md` uses "buyer roles", "pricing roles", "catalog roles", "returns desk", "lead" — not registry roles | Mapped to R-* + designations (§4.3); D-222 |
| 8 | Other plan sections raised the same questions as this file: SoD rule set (D-196, `10-erp.md`), cost/margin visibility (D-197, `10-erp.md`), self-approval tier (D-175), buyer mapping (D-222 per `00-conventions.md` §7.2) | This file cites those IDs; B5 IDs D-201, D-203, D-204 are therefore **not used** |

---

## API gaps found

Status 2026-09-27: `06-api.md` §8 resolved G-01…G-06 with new endpoints (right-hand column); G-07 was rejected there.

| # | Screen · action | Needed operation | Source | Decision | Resolution (`06-api.md` §8) |
|---|---|---|---|---|---|
| G-01 | P-S11#team — owner approves/rejects a buyer's order that exceeds the buyer's per-order limit ("you get an approval request by email and WhatsApp. Unapproved carts don't reserve stock") | List/decide business-account order approvals | MK:store-dealer.html#team | D-066 | API-M08-46…48 |
| G-02 | P-S11 / P-S09 — dealer owner changes GSTIN, legal name or registered address ("Re-verified"; "pauses dealer pricing until Tradex re-verifies it") | Business-account change request with re-verification | MK:store-dealer.html#team; BP §8.3 | D-066, D-067 | API-M08-50 |
| G-03 | P-E15#integrations — issue, scope, rotate and revoke an **inbound** integration credential for R-integration (legacy POS events API-M23-01, vendor catalog feed) | Integration-account credential administration (API-M24-05 covers outbound provider secrets only) | BP §3.1, §16.4, §19.1 | D-083, D-107 | API-M02-35…37 |
| G-04 | P-E15 — record acceptance/post-review of an SoD conflict (MK "Conflict … Accepted · monthly post-review") | SoD exception register | MK:erp-admin.html#roles | D-196 | API-M02-39/40 (+ API-M02-25 `sod_exceptions[]`) |
| G-05 | P-S09#profile — "New sign-in alerts: Email + SMS when a new device signs in" preference (entity E-notification_preference is registered, `00-conventions.md` §7.2; no endpoint reads/writes it) | Security-alert preference | MK:store-account.html#profile (MOCKUP-ONLY) | D-040 | API-M20-08/09 |
| G-06 | P-E16 / P-V05 / P-S14 — expired invitation link → invitee requests a new invitation | Invitation re-request by invitee | MK "invite link expires" (erp-admin, vendor-account) | D-040 | API-M02-38 |
| G-07 | P-V04#users — vendor admin views which Tradex staff accessed the vendor account ("ask your vendor manager for the access report") | None needed if handled offline; otherwise an access-report endpoint | MK:vendor-account.html | — (note only) | Rejected (offline via vendor manager; staff access audited in API-M02-30) |

## Entity gaps found

| # | Gap | Source | Decision |
|---|---|---|---|
| E-01 | Business-account order approval (buyer over limit → owner decision) has no record; `E-approval_request` is staff-side and its enum lacks a customer-side type | MK:store-dealer.html#team | D-066 |
| E-02 | `E-approval_request.approval_type` lacks values used by this plan: `role_change` (non-privileged, delegated), `configuration_change` (API-M24-02), `secret_rotation` (API-M24-05), `company_change` (BR-M03-06), `user_reactivation` (API-M02-24), `product_publication` (staff drafts, BP §18.1), `automation_rule_enable` (API-M17-10), `dealer_application` if approval is two-step (D-067), `sod_exception` (D-196) | this file §8–9 | D-024 |
| E-03 | Designations (buyer, reviewer, rule owner, warehouse lead, returns desk, inspector) need storage — e.g. assignment attributes on `E-user_role_assignment` or a designation list | §4.3 | D-222, D-081, D-194 |
| E-04 | `E-payout_account_change` (registered, `00-conventions.md` §7.2) must also hold the **vendor-side** maker and checker (MK: accounts user = maker, vendor admin confirms with OTP = checker) besides the Tradex finance maker-checker | MK:vendor-account.html#bank; BP §11.5 | D-068 |
| E-05 | Sensitive-field reveal grants ("visible_until") need a record if reveals are time-limited beyond one response | API-M02-31; MK | D-153 |

## Proposed new decisions

| ID | Question | Documented options / proposal (source) | Blocks |
|---|---|---|---|
| D-200 | Which roles are **privileged**, and is **MFA** required beyond privileged staff — for all staff, vendor users, dealer business-account owners; optional for consumers? | BP §18.2, §20.1 require MFA for privileged accounts only; BP §18.1 "Edit permissions: privileged role". MK:erp-admin.html "Privileged 3: Owner · Ops admin · Finance" and MFA shown for all staff; MK:vendor-account.html "MFA required for every user"; MK:store-dealer.html "Owners must use 2-step verification"; MK:store-account.html optional customer 2-step (MOCKUP-ONLY). Options: (a) privileged staff only (BP minimum); (b) + all staff; (c) + vendor users; (d) + dealer owners; (e) optional for consumers | `E-role.privileged` seed (S-03), API-M02-04/05/12/13, onboarding flows §3.1, TS-AUTH-02 |
| D-202 | **Session lifetimes and step-up re-authentication**: idle and absolute timeouts per surface, "keep me signed in" duration, which actions need recent re-authentication and how recent | BP §19.1 "secure session handling"; MK samples: 30-day keep-signed-in (store-login), vendor "30 minutes idle · 12 hours maximum", "password + OTP" to reveal API key; `06-api.md` "recent re-auth" on API-M02-14, API-M08-13. D-083 decides the mechanism only | §3.11 S2/S9, API-M02-14, API-M08-13, API-M14-21/22, TS-AUTH-04 |
| D-205 | **Multiple business-account memberships and active buyer context**: may one sign-in be a consumer and a member of one or more business accounts; how is the active context chosen and switched; how is the cart repriced on switch? | BP §6.5 "require verified membership in the approved business account … If a customer changes to a non-eligible business/location, reprice with explicit notice"; MK:store-account.html (owner's personal settings vs Dealer zone); `E-business_account_member` unique (account, customer) allows several accounts. Vendor-side equivalent (one user in several vendor organisations) is D-177 item 4 | API-M02-01 buyer_context, API-M05-01, API-M10-06, T02, T22 |

IDs D-201, D-203 and D-204 are intentionally unused (covered by D-222, D-197, D-196 — see §17 row 8). Decisions
D-206–D-209 are proposed in `16-testing.md`.

## Registry additions requested

| # | Addition | Justification | Source |
|---|---|---|---|
| RA-01 | None for pages: sign-in/landing pages are now registered as P-S14, P-S15, P-E16, P-V05 (`00-conventions.md` §8). Staff "My profile / Security & MFA" is expected inside P-E16 or the shell — confirm under D-174 | — | `00-conventions.md` §8 |
| RA-02 | No new roles. Designations (buyer, reviewer, rule owner, warehouse lead, returns desk) are assignment data, pending D-222, D-081, D-194 | Keeps the role registry to BP §3.1 | BP §3.1, §18.1 |
| RA-03 | Permission-key catalogue of §5 as seed set S-03 content (`03-database.md` §6) | `E-permission.code` "catalogue in `07-auth-roles-permissions.md`" | `03-database.md` §2.1.3 |
