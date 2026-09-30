# 00 — Conventions, source-fidelity rules and canonical registries

This file is the **backbone** of the Tradex implementation plan. Every other plan file uses the
identifiers defined here. If an identifier is needed that is not defined here, add it here first
(and record the change in `STATE.md` → Session log) — never invent a parallel naming scheme.

---

## 1. Source documents (the only sources of truth)

| Code | Source | Location | Notes |
|---|---|---|---|
| **MEET** | Client meeting summary | `docs/meeting.txt` | Business intent; figures and owners are explicitly *not* decisions |
| **BP** | Connected ERP and E-commerce Platform — Requirements, solution design, automation and implementation blueprint v1.1 | `docs/ERP_Ecommerce_Implementation_Blueprint.md` | Primary technical source. Cite as `BP §x.y` |
| **PR1** | Integrated Commerce & Business Management Platform — Proposal | `docs/Integrated_Commerce_Business_Platform_Proposal.pdf` | Owner-facing proposal. Cite as `PR1 §x` |
| **PR2** | Integrated Commerce & Business Management Platform — Detailed solution proposal | `docs/Professional_Ecommerce_ERP_Implementation_Proposal_CLEAN.pdf` | Consolidates PR1 + BP. Cite as `PR2 §x` |
| **MK** | Clickable HTML mockup v0.1 (34 screens since 2026-09-30) | repo root: `store-*.html`, `erp-*.html`, `vendor-*.html`, `assets/` | UI source. Cite as `MK:<page-file>` |
| **SAAS** | SaaS architecture change request (2026-09-28, from the user) | `docs/SAAS_ARCHITECTURE_CHANGE.md` | **Authoritative for the architecture.** Cite as `SAAS §1` / `SAAS §3 S##`. Expanded in `19-saas-platform.md`, `20-root-admin.md` |
| **MK-R** | Configurable Root Admin mockup (12 screens, internal) | `root-admin-mockup/` | UI source for P-R01–P-R12. Cite as `MK-R:<page-file>`. Not linked from the client-facing mockup (`D-249`) |
| **CF1** | Client feedback on mockup v0.1 (2026-09-30): storefront rework, employee monitoring, analytics dashboard | `docs/CLIENT_FEEDBACK_2026-09-30.md` | Authoritative for those three change requests. Cite as `CF1 §1`–`CF1 §3`. Interpreted by `D-281`–`D-286` |

To read the PDFs as text: `pdftotext -layout docs/<file>.pdf -`.

### 1.1 How the mockup may be used as a source
- The mockup is authoritative for **screen inventory, layout, sections, fields, actions, states and flows**.
- The mockup's **sample data values are NOT requirements**: prices, product names, people, IDs, return windows
  (7/10 days), "42-point inspection", free-delivery threshold (₹999), reservation countdown (15 min), approval
  limits (e.g. ₹25k, 8 %), courier/accounting product names (e.g. Delhivery, Tally), EMI banks, store hours, branch
  names. Each such value is a **REQUIRES_DECISION** item (see `DECISIONS.md`).
- The mockup's **prototype toolbar** (View-as switcher, Phase notes, All screens), `index.html` (prototype
  overview) and `credits.html` are review aids, **not product features**.
- **The mockup is the reference store** (`D-279`): it shows a store with **every Phase-1 feature enabled**, and is
  deliberately not feature-gated. It is a picture of the system, not of one client's configuration. Which
  capability governs which section is in **`21-feature-map.md`**; a mockup element with no row there is a gap in
  that file, closed before the screen is built.
- `assets/tradex.js` sample catalogue/reference data and chart helpers are prototype code. The design tokens and
  component styles in `assets/tradex.css` are the approved-for-review visual direction, pending sign-off (D-049).
- Where the mockup shows something the blueprint marks **Conditional (C)** or **Later (L)**, the plan keeps it but
  tags it with the blueprint's status and the related decision.
- Where the mockup shows something **not mentioned in any document** (e.g. product Q&A, bank/UPI offer cards,
  EMI plans), the plan records it as `MOCKUP-ONLY` and links a decision on whether to build it.

### 1.2 Source authority after the SaaS change (2026-09-28)

`SAAS` changed the *shape* of the product, not the requirements of the business the other documents describe.

| Question | Authoritative source |
|---|---|
| What must a store be able to do? | MEET, BP, PR1, PR2, MK — unchanged |
| How is the system built, deployed, configured and separated? | **SAAS**, then BP where SAAS is silent |
| Who configures a store's category, features, template, branding? | **SAAS** → `20-root-admin.md` |
| What may a store user see? | **SAAS §3 S03** (`D-229`) overrides any mockup or BP screen that would expose the platform |

Concretely: everything MEET/BP/PR1/PR2/MK specify is now the specification of **one store** — store `tradex`,
vertical pack `VP-electronics` (`D-251`). Where BP §3.3 / R15 / `D-045` said "prepare boundaries but do not build
SaaS", `D-227` supersedes them. No BP engineering rule is relaxed (money, idempotency, trust boundaries, one
stock authority all stand).

### 1.3 How the root admin mockup may be used as a source
Same rules as §1.1: authoritative for screen inventory, layout, sections, fields, actions, states and flows;
Every screen carries contextual help (ⓘ, page guide, search, glossary) written for the platform
operator (`D-280`) — part of the specification, not a review aid. Its sample values (store names, counts,
colours, pack and template names beyond `VP-electronics`,
`VP-fashion_apparel`, `TPL-forge`, `TPL-aurora`) are **not** requirements. It must never be linked from a
client-facing page (`D-249`).

## 2. Evidence labels (use exactly these)

| Label | Meaning |
|---|---|
| `DOCUMENTED` | Explicitly stated in MEET/BP/PR1/PR2 (or the client feedback CF1) as a requirement or confirmed direction |
| `PROPOSED` | Recommended in BP/PR2 but explicitly awaiting client approval (BP "Proposed") |
| `MOCKUP` | Shown in the mockup and consistent with the documents |
| `MOCKUP-ONLY` | Shown in the mockup but not mentioned in any document — build only if the linked decision approves it |
| `CONDITIONAL` | BP capability matrix "C" — build only if the linked decision/dependency is met |
| `LATER` | BP Phase 2/3 or "Later" — out of Phase 1 scope; listed only |
| `REQUIRES_DECISION` | Needed for implementation but not specified. Must reference a `D-xxx` in `DECISIONS.md` |
| `SAAS` | Required by the SaaS architecture change (`docs/SAAS_ARCHITECTURE_CHANGE.md`); cite the `S##` requirement |
| `PACK` | Belongs to a vertical pack as data/configuration, not to the codebase (`19 §6`) |

Rule: **never silently fill a gap.** If a value, technology, field, rule or behaviour is not specified, write
`REQUIRES_DECISION (D-xxx)` and stop there.

## 3. Status values (tasks, pages, endpoints, entities)

`NOT_STARTED` · `IN_PROGRESS` · `BLOCKED` (dependency not complete) · `REQUIRES_DECISION` (waiting on a D-xxx) ·
`COMPLETED` (acceptance criteria met and verified) · `NOT_APPLICABLE` (a DECIDED decision removed the need for the
task — cite the D-ID in Evidence; counts as satisfied for dependents; D-213). A task is only `COMPLETED` when its
acceptance criteria are verified by the tests listed for it.

## 4. Delivery phases (from BP §5.1, PR2 §11)

| Phase | Name | Scope summary (BP §5.1) |
|---|---|---|
| **0** | Discovery & proof | Process maps, system audit, UI prototype, fit tests, data sample, backlog, estimate |
| **1A** | Core web launch | Consumer/dealer web storefront + ERP staff web workspace, central stock, purchase receipt, payments, dispatch, basic returns, reports, access controls |
| **1B** | Operational completion | Controlled vendor portal, validated bulk import, guided WhatsApp ordering, approvals, selected integrations |
| **2** | Mobile experience & separately approved growth | Mobile-friendly e-commerce + mobile app (Phase 1 APIs); optional marketplace — separately scoped (`LATER`) |
| **3** | AI & further expansion | Scoped AI assistance, possible multiple storefronts (`LATER`) |

Implementation **stages** (defined in `12-phases.md` §6): `0` · `1A.1` Foundation · `1A.2` Identity, access, audit &
organisation · `1A.3` Design system & app shells · `1A.4` Catalog, media, search & SEO base · `1A.5` Pricing · `1A.6`
Inventory & serials · `1A.7` Purchasing & receiving · `1A.8` Customers & dealer accounts · `1A.9` Storefront pages,
cart, checkout & orders · `1A.10` Payments & reconciliation · `1A.11` Fulfilment & shipping · `1A.12` Returns, RMA &
warranty · `1A.13` Support L1 & notifications · `1A.14` Automation, exceptions, approvals & owner control centre ·
`1A.15` Reporting & finance export · `1A.16` Administration completion · `1A.17` Migration, UAT & launch readiness ·
`1R.1` Root admin foundation & store registry · `1R.2` Store configurator, packs, templates & terminology · `1R.3`
Provisioning, deployment, platform operations & 1R release · `1B.1` Vendor portal & vendor management · `1B.2`
Validated bulk import & supplier feeds · `1B.3` Guided WhatsApp ordering & shared inbox · `1B.4` Approval
extensions, selected integrations & P1B automations · `1B.5` 1B UAT & release · `2` · `3` (scope/approve only).

**Stage order after the SaaS change (`D-227`):** `0` → `1A.1`…`1A.17` → `1R.1`…`1R.3` → `1B.1`…`1B.5` → `2` → `3`.
The multi-store foundation (M30–M33) is built **inside stage 1A.1** — the store platform is tenant-aware and
configuration-driven from its first line of code, never retrofitted. The `1R` stages build the Configurable Root
Admin on top of it; until `1R` exists, stores are provisioned by the `M35` bootstrap CLI seeded from the same
artefact format, so Phase 1A is never blocked on the portal (`D-235`).

## 5. Canonical ID schemes

| Kind | Format | Example | Defined in |
|---|---|---|---|
| Decision | `D-###` | D-001 | `DECISIONS.md` |
| Module | `M##` | M06 | this file §6 |
| Entity | `E-<name>` (logical, snake_case) | E-serial_unit | this file §7 (list) → `03-database.md` (detail) |
| Page / screen | `P-S##` storefront, `P-E##` ERP, `P-V##` vendor | P-E07 | this file §8 |
| Role | `R-<name>` | R-owner | this file §9 |
| API endpoint | `API-<M##>-##` | API-M10-03 | `06-api.md` |
| Business rule | `BR-<M##>-##` | BR-M05-02 | module docs (05/08/09/10/11) |
| Test | `TS-<area>-##` (suite), `TS-<area>-##.<n>` (case) and BP acceptance tests `T01…T36` | TS-INV-04, TS-PERM-02.4, T04 | `16-testing.md`, BP §23.1 |
| Task | `T-<stage>-<M##>-##` (permanent; stage prefix = original stage, D-213) | T-1A.6-M06-02 | skeleton `12-phases.md` §9; tracker & status `TASKS.md` |
| Stage | `0`, `1A.1`…`1A.17`, `1B.1`…`1B.5`, `2`, `3` | 1A.6 | `12-phases.md` §6 |
| DB migration group | `DB-G0`…`DB-G13` | DB-G4 | `03-database.md` §4 (DB-G12 SaaS platform §11.4; DB-G13 feature control, channels and automation §12.5) |
| Seed set | `S-01`… | S-03 | `03-database.md` §6 |
| Automation | `A01…A38` (from BP §12.2) | A05 | BP §12.2 / `10-erp.md` |
| Requirement | `R01…R20` (from BP §2.1) | R08 | BP §2.1 |
| SaaS requirement | `S##` (from SAAS §3) | S13 | `docs/SAAS_ARCHITECTURE_CHANGE.md` §3 |
| Capability | `CAP-<UPPER_SNAKE>` | CAP-SERIAL_TRACKING | registry in `19-saas-platform.md` §5.3 |
| Module | `MOD-<slug>` | MOD-inventory, MOD-rental | `19-saas-platform.md` §5.4.2 (platform and category modules) |
| Bundle | `BND-<slug>` | BND-perishables | `19-saas-platform.md` §5.5 |
| Surface | `storefront` · `workspace` · `vendor` | workspace | `19-saas-platform.md` §5.4.1 |
| Channel | `email` · `sms` · `whatsapp` · `web_chat` · `push_web` · `push_mobile` · `in_app` · `voice_callback` | whatsapp | `19-saas-platform.md` §5.6 |
| Automation capability | `CAP-AUTO_<name>` (one per BP §12.2 automation) | CAP-AUTO_DISPATCH_UPDATES | `19-saas-platform.md` §5.3 N |
| Vertical pack | `VP-<slug>` | VP-fashion_apparel | catalogue in `19-saas-platform.md` §6.2 |
| Site template | `TPL-<slug>` | TPL-aurora | `19-saas-platform.md` §7.3 |
| Configuration key | `CFG-<section>.<name>` | CFG-checkout.guest_allowed | schema in `19-saas-platform.md` §3.2 |
| Terminology token | `TT-<slug>` | TT-product_plural | `19-saas-platform.md` §11 |
| Root admin page | `P-R##` | P-R05 | this file §8 |
| Pack seed set | `S-VP-<slug>-##` | S-VP-electronics-01 | `19-saas-platform.md` §6.1 |
| Work package | `WP01…WP17` (from BP §22.2) | WP08 | BP §22.2 |

## 6. Module registry

| ID | Module | Primary BP sections | Phase |
|---|---|---|---|
| M01 | Platform foundation (repos, environments, CI, configuration, release) | §15.4, §16.6, §20.5, §22 WP05 | 1A |
| M02 | Identity, access & audit (authentication, users, roles, permissions, MFA, record scope, audit events) | §3.1, §18, §19.1 | 1A |
| M03 | Organisation & locations (company, branches, warehouses, bins) | §3.3, §9.5 | 1A |
| M04 | Catalog (categories & attribute schemas, brands, products, SKUs, offers, media, lifecycle, policies, compatibility, bundles, import) | §7 | 1A (import 1B) |
| M05 | Pricing (price lists, customer context, quantity tiers, promotions, margin/discount authority, quotes) | §8 | 1A |
| M06 | Inventory (stock ledger, dispositions, available-to-promise, reservations, serial units, transfers, counts, adjustments, supplier availability) | §9 | 1A |
| M07 | Purchasing & receiving (reorder suggestions, POs, goods receipt, inspection/QC, supplier bills & matching) | §9.3 | 1A |
| M08 | Customers & business accounts (consumers, dealer applications, business accounts & members, addresses, consent) | §3, §8.3, §13.3 | 1A |
| M09 | Storefront web application (public/customer UI, SEO) | §6 | 1A |
| M10 | Cart, checkout & orders (basket, quote, pending order + reservation, order state machine, cancellations, assisted orders) | §8.1, §10.1–10.3 | 1A |
| M11 | Payments, refunds & reconciliation | §10.2, §10.3, §10.6, A09, A10 | 1A |
| M12 | Fulfilment & shipping (release, pick, pack, dispatch, courier booking, tracking) | §10.4, §10.5 | 1A |
| M13 | Returns, RMA & warranty | §10.5, §7.5 | 1A |
| M14 | Vendor portal & vendor management (applications, approvals, submissions, availability feeds, supplier POs view, supplier fulfilment pilot, performance) | §3.2, §11.1–11.3 | 1B |
| M15 | Marketplace extension (seller agreements, commissions, settlements, payouts) | §11.4, §11.5 | 2 (`LATER`, optional) |
| M16 | Support & WhatsApp (click-to-chat, guided help, shared inbox, draft basket, templates, consent) | §13 | 1A (L1) / 1B (L2) |
| M17 | Automation, exceptions, approvals & delegation (rules, jobs, outbox, exception queues, approval requests, owner digest) | §12, §16.3, §18 | 1A / 1B |
| M18 | Reporting & exports | §14.3, §14.4 | 1A |
| M19 | Finance boundary & accounting export | §10.6, §14.2 | 1A |
| M20 | Notifications (customer/staff messages, templates, consent, delivery status) | §12.2 A14, §13.3 | 1A |
| M21 | Search | §6.4, §16.5 | 1A |
| M22 | Files & media (product media, private documents, CDN) | §7.4, §15.4, §19.1 | 1A |
| M23 | Integrations & adapters (payment, shipping, accounting, supplier feeds, WhatsApp, legacy ERP/POS) | §16.4 | 1A / 1B |
| M24 | Administration & settings (users, roles, thresholds, delegation, locations, integrations, audit viewer, system) | §18, §30.1 | 1A |
| M25 | Data migration & cutover | §21 | 1A |
| M26 | Security, observability, backup & operations | §19, §20, §24 | 1A |
| M27 | SEO & discoverability | §6.8 | 1A |
| M28 | Mobile web optimisation & mobile app | §28.4 | 2 (`LATER`) |
| M29 | AI assistance | §28.1–28.3 | 3 (`LATER`) |
| **M30** | **Tenancy & store context** (store registry runtime, host resolution, tenant context, data-access guard, per-store storage/secrets, store lifecycle) | SAAS §3 S01, S03; `19` §10 | 1A (stage 1A.1) |
| **M31** | **Configuration & capability runtime** (`CFG-*` schema, capability registry, artefact loader, immutable snapshot, reload/invalidation, store-editable settings, performance budget) | SAAS §3 S12–S15; `19` §3–§5 | 1A (stage 1A.1) |
| **M32** | **Vertical packs (runtime)** (catalog schema, item identity model, units, storefront/workspace/vendor profiles, pack seeds) | SAAS §3 S02, S06, S16–S18; `19` §6 | 1A |
| **M33** | **Templates & theming (runtime)** (template registry & resolution, token contract, compiled theme, template-safe components) | SAAS §3 S07–S09, S19–S21; `19` §7 | 1A |
| **M34** | **Root Admin platform** (portal P-R01–P-R12, pack/template/capability/terminology authoring, store registry, configurator, compiler, publisher, platform users & audit) — **separate codebase** `root-admin/` | SAAS §3 S04–S10; `20` | 1R |
| **M35** | **Store provisioning & deployment** (provisioning pipeline, bootstrap & seeding, domains/TLS, config publication, health callbacks, rollback, decommission) | SAAS §3 S11; `20` §5 | 1A (bootstrap CLI) / 1R (pipeline & portal) |

## 7. Entity registry (logical names; detail in `03-database.md`)

Physical table names, types and native-ERP mapping depend on **D-001** (operational core). BP §17.2: *"These
diagrams express business concepts, not a mandate to duplicate ERP tables. Map each concept to native records,
custom fields, or extension records after selecting the core."*

| Module | Entities |
|---|---|
| M02 | E-user_account, E-role, E-permission, E-role_permission, E-user_role_assignment, E-delegation, E-audit_event |
| M03 | E-company, E-location, E-location_bin |
| M04 | E-category, E-attribute_definition, E-category_attribute, E-brand, E-product, E-sku, E-sku_attribute_value, E-offer, E-media_asset, E-tax_classification, E-condition_grade, E-warranty_policy, E-return_policy, E-catalog_change_version, E-compatibility_link, E-bundle_component, E-import_job, E-import_row, E-supplier_code_mapping |
| M05 | E-price_list, E-price_list_item, E-quantity_tier, E-price_rule_version, E-promotion, E-margin_floor, E-discount_authority, E-quote, E-quote_line |
| M06 | E-stock_movement, E-stock_position, E-reservation, E-serial_unit, E-serial_event, E-inspection, E-transfer, E-transfer_line, E-stock_count, E-stock_count_line, E-stock_adjustment, E-supplier_availability, E-reorder_rule |
| M07 | E-supplier, E-purchase_order, E-purchase_order_line, E-goods_receipt, E-goods_receipt_line, E-supplier_bill, E-supplier_bill_line, E-replenishment_suggestion |
| M08 | E-customer, E-customer_segment, E-business_account, E-business_account_member, E-dealer_application, E-address, E-consent_record |
| M10 | E-sales_order, E-order_line, E-order_cancellation, E-idempotency_record |
| M11 | E-payment_attempt, E-payment_event, E-refund, E-settlement_record |
| M12 | E-fulfilment, E-fulfilment_line, E-shipment_event |
| M13 | E-return_request, E-return_line, E-warranty_case, E-supplier_rma |
| M14 | E-vendor_application, E-vendor_approval, E-vendor_user, E-vendor_submission, E-terms_version, E-supplier_fulfilment_task |
| M15 (`LATER`) | E-seller_agreement, E-commission_rule, E-seller_settlement, E-payout |
| M16 | E-support_conversation, E-support_message, E-support_ticket, E-approved_answer, E-message_template |
| M17 | E-automation_rule, E-job_attempt, E-outbox_operation, E-integration_event, E-exception_case, E-approval_request, E-approval_threshold |
| M18 | E-export_job, E-report_schedule |
| M19 | E-invoice_reference, E-accounting_export |
| M20 | E-notification |
| M24 | E-configuration_version, E-integration_setting |
| M22 | E-attachment |

### 7.1 Registry additions accepted 2026-09-27 (requested by plan sections; label = build condition)

| Module | Entity | Label | Source / decision |
|---|---|---|---|
| M02 | E-invitation | DOCUMENTED | Admin invitation of vendors (BP §11.1); business-account employee invitations (BP §8.3, D-066); staff invite (MK:erp-admin.html) |
| M02 | E-terms_acceptance | DOCUMENTED | Terms version accepted by vendor/dealer (BP §11.1, §11.4) |
| M02 | E-verification_challenge | CONDITIONAL | One-time codes for sign-in / guest order access — D-040, D-021 |
| M02 | E-user_session | CONDITIONAL | Only if the session mechanism needs a stored record — D-083 |
| M02 | E-api_credential | CONDITIONAL | Integration accounts (BP §3.1) and vendor API keys (MK:vendor-availability.html) — D-083 |
| M02 | E-access_review | MOCKUP | Periodic access review (BP §20.1, §24.3; MK:erp-admin.html) |
| M08 | E-data_request | DOCUMENTED | Reviewed privacy requests: export / correction / deletion (BP §19.2–19.3; MK:erp-customers.html, store-account.html#privacy) — D-060 |
| M08 | E-customer_tag | MOCKUP-ONLY | D-145 |
| M09 | E-merch_collection | DOCUMENTED | Home "curated collections" (BP §6.3); who edits them — D-142 |
| M09 | E-wishlist_item | CONDITIONAL | D-042 |
| M09 | E-product_review | CONDITIONAL | D-041 |
| M09 | E-product_question | MOCKUP-ONLY | D-065 |
| M09 | E-alert_subscription | MOCKUP-ONLY | Price-drop / back-in-stock alerts — D-141 |
| M10 | E-cart, E-cart_line | REQUIRES_DECISION | D-129 (client-side vs server-side cart) |
| M10 | E-internal_note | MOCKUP-ONLY | D-134 |
| M05 | E-promotion_code | CONDITIONAL | Coupons — D-043 |
| M04 | E-import_mapping_profile | MOCKUP | Versioned import template / mapping (BP §7.4; MK:erp-catalog.html#import) |
| M06 | E-lot | CONDITIONAL | Batch/lot/expiry tracking — D-126 |
| M08 | E-customer_merge, E-registered_device | MOCKUP-ONLY | D-133 |
| M11 | E-finance_day_close | MOCKUP | Daily close checklist with maker/checker (MK:erp-finance.html#close; BP §14.2, §18.2) |
| M12 | E-pick_wave, E-handover_manifest | MOCKUP-ONLY | D-132 |
| M14 | E-advance_shipping_notice | MOCKUP-ONLY | Supplier PO confirmation / ASN — D-131 |
| M18 | E-saved_view | MOCKUP | Saved filter views / work queues (MK:erp-orders.html, erp-reports.html) |
| M21 | E-search_synonym | DOCUMENTED | "Start with curated synonyms" (BP §6.4) |
| M24 | E-change_request | DOCUMENTED | Change register (BP §2.3, §25.5); report/integration requests (MK:erp-reports.html, erp-admin.html) |
| M27 | E-seo_redirect | DOCUMENTED | Redirect mapping (BP §6.8, §21.2) — D-076 |

### 7.2 Registry additions accepted 2026-09-27 (second wave)

| Module | Entity | Label | Source / decision |
|---|---|---|---|
| M26 | E-restore_rehearsal | DOCUMENTED | Backup restore rehearsal evidence (BP §20.1, §23.4, T28) |
| M25 | E-migration_rehearsal | DOCUMENTED | Migration dry-run / rehearsal evidence and control totals (BP §21.3, §23.4) |
| M08 / M14 | E-verification_document | DOCUMENTED | Dealer and vendor verification documents: type, number, validity, verification state (BP §8.3, §11.1) — requirements D-067, D-068 |
| M14 | E-payout_account_change | DOCUMENTED | Payout/bank account change with maker-checker verification (BP §11.5, §18.1) — D-068 |
| M20 | E-notification_preference | MOCKUP | Per-user notification preferences (MK:vendor-account.html, erp-admin.html); consent stays in E-consent_record |
| M12 | E-fulfilment_parcel, E-fulfilment_scan | MOCKUP | Parcels per shipment and scan log at the scan station (MK:erp-fulfilment.html; BP §10.4 "scan location/SKU/serial") |
| M05 | E-cost_signal | MOCKUP | Supplier cost-change signals that must not auto-change live prices (BP §8.4; MK:erp-pricing.html) |
| M12 | E-device_station | CONDITIONAL | Warehouse/counter devices — D-147 |
| M14 | E-vendor_announcement | CONDITIONAL | D-142 |
| M07 | E-landed_cost_charge | CONDITIONAL | D-056 |
| M10 | E-supplier_confirmation | CONDITIONAL | Confirmation of supplier-sourced order lines — D-073, D-181 |
| M12 | E-shipping_charge_rule | CONDITIONAL | D-162 |

The purchasing **"buyer"** responsibility used in BP §9.3 and §12.2 (A17, A30) is not a registered role; it is
mapped to an existing R-* role or added only through D-222.

Relationship clarifications accepted: E-fulfilment also covers reverse pickups and returned-to-origin shipments
(BP §10.5); E-support_conversation may have a vendor as the counter-party (MK:erp-support.html); E-exception_case is
the single exception record type for all exception queues (BP §12.5).

### 7.3 SaaS platform entities added 2026-09-28 (source: SAAS · `D-227`–`D-253`; detail in `03-database.md` §11)

**Root admin database** (module M34/M35 — a *different database* from the store database, SEP-1):

| Area | Entities |
|---|---|
| Platform identity | E-platform_user, E-platform_role, E-platform_role_assignment, E-platform_audit_event, E-platform_support_access |
| Store registry | E-store_registration, E-store_environment, E-store_domain |
| Configuration | E-store_config_draft, E-store_config_version, E-config_publication, E-config_artifact |
| Vertical packs | E-vertical_pack, E-vertical_pack_version, E-pack_migration |
| Capabilities | E-capability_definition, E-capability_default, E-store_capability_override |
| Templates | E-template, E-template_version, E-template_compatibility |
| Branding & wording | E-brand_asset, E-terminology_token, E-terminology_set, E-terminology_override |
| Deployment | E-deployment, E-deployment_step, E-platform_notification |
| Bundles (`D-266`) | E-bundle, E-bundle_version, E-pack_bundle_application |
| Feature control (`D-273`) | E-module_definition, E-channel_requirement (+ `build_status`, `gating_decision` on E-capability_definition; `item_kind`, `control_state` on E-store_capability_override) |

**Store database** (module M30/M31/M35):

| Entity | Purpose |
|---|---|
| E-store | The store's own identity record: id, key, display name, jurisdiction, currency, locales, state |
| E-store_setting | Layer L4 — the store-editable subset only (`D-243`) |
| E-store_feature_state | Layer L4 — the on/off value of every **delegated** module and capability, set by the store's own administrator (`D-258`) |
| E-store_feature_change | Append-only history of delegated-feature changes, including control-state changes the platform made (`D-258` CTL-6) |
| E-channel_binding, E-sender_identity, E-channel_suspension | Which provider account a store uses per channel, its verified sender, and suspension after repeated failure (`D-274`) |
| E-message_dispatch | One row per outbound message; unique `(store_id, message_key)` is what makes "one event, one message" true under retry (`D-274`) |
| E-automation_run | The run log that makes an automation auditable (`19` §26.3 AUT-4) |
| E-integration_binding, E-webhook_subscription | Non-messaging integrations, and outbound webhooks when `CAP-WEBHOOKS` is granted (`D-278`) |
| E-store_setting_version | Monotonic version used to invalidate the L4 overlay without polling |
| E-config_state | Applied config version, checksum, applied_at, per-instance report, drift flag |
| E-store_bootstrap_run | Idempotent record of seed sets applied during provisioning (`D-250`) |

**Global rule (`BR-M30-01`):** every entity in §7, §7.1 and §7.2 is **store-scoped** and gains a non-null
`store_id`, included in its primary key or a mandatory index prefix and in every unique constraint. The only
exceptions are the root-admin entities above (different database) and pure code-level reference data that is
identical for all stores.

Rules for the registry: an entity may only be added if a source (BP/PR/MEET/MK/SAAS) requires or clearly implies
it; the entity's row in `03-database.md` must cite that source.

### 7.4 Registry additions 2026-09-30 (client feedback `CF1`; detail `03-database.md` §13)

| Module | Entity | Label | Source / decision |
|---|---|---|---|
| M02 | E-staff_presence_interval | DOCUMENTED | Workspace presence for P-E17 (`CF1 §2`, D-282); idle rule and retention D-283 |
| M02 | E-work_item_event | DOCUMENTED | Assignment and handling times of work items for P-E17 (`CF1 §2`, D-282); retention D-283 |
| M17 | E-staff_alert_rule | DOCUMENTED | Staff activity alert rules (`CF1 §2`, D-282); thresholds D-283 |
| M17 | E-staff_alert | DOCUMENTED | Raised staff alerts with acknowledgement (`CF1 §2`, D-282) |
| M18 | E-analytics_daily_fact | DOCUMENTED | Rebuildable analytics read model for P-E18 (`CF1 §3`, D-284); definitions D-286 |
| M18 | E-customer_cohort_snapshot | DOCUMENTED | Rebuildable cohort / segment read model for P-E18 (`CF1 §3`, D-284); segment rules D-286 |
| M09 | E-storefront_visit_counter / E-storefront_visit_event | CONDITIONAL | Store-visit metrics for P-E18 — only one, per D-285 |

E-audit_event gains `area` and `work_item_ref` (D-282).

## 8. Page / screen registry (source: mockup)

Routes are **not specified** by the documents; the mockup file name is the reference identifier. Production
routes follow D-003/D-004 (framework and staff-UI approach).

### Storefront (customer-facing web) — `P-S`
| ID | Screen | Mockup file |
|---|---|---|
| P-S01 | Home | store-home.html |
| P-S02 | Category & search results | store-listing.html |
| P-S03 | Product detail (incl. unit inspection report) | store-product.html |
| P-S04 | Certified refurbished landing | store-refurbished.html |
| P-S05 | Compare products | store-compare.html |
| P-S06 | Cart | store-cart.html |
| P-S07 | Checkout | store-checkout.html |
| P-S08 | Order confirmation & tracking | store-order.html |
| P-S09 | My account | store-account.html |
| P-S10 | Return / warranty request | store-returns.html |
| P-S11 | Dealer zone (B2B) | store-dealer.html |
| P-S12 | Sign in · register · dealer & vendor application | store-login.html |
| P-S13 | Help centre & policies | store-help.html |
| (shell) | Header, category bar, mega menu, footer, help/chat widget, compare tray, PIN modal | `assets/tradex.js` (store shell) |
| P-S14 | Account access landings: password-reset completion, invitation acceptance (no mockup screen) | CONDITIONAL — D-040, D-066; APIs in `06-api.md` M02 |
| P-S15 | Not-found / unavailable / error pages (no mockup screen) | DOCUMENTED — BP §23.1 T32 "useful unavailable page", §6.8 |

### ERP staff workspace — `P-E`
| ID | Screen | Mockup file |
|---|---|---|
| P-E01 | Owner control centre | erp-dashboard.html |
| P-E02 | Orders | erp-orders.html |
| P-E03 | Pick · pack · dispatch | erp-fulfilment.html |
| P-E04 | Returns, RMA & warranty | erp-returns.html |
| P-E05 | Support & WhatsApp inbox | erp-support.html |
| P-E06 | Catalog & imports | erp-catalog.html |
| P-E07 | Pricing & dealer tiers | erp-pricing.html |
| P-E08 | Inventory & serials | erp-inventory.html |
| P-E09 | Purchasing & receiving | erp-purchasing.html |
| P-E10 | Customers & dealers | erp-customers.html |
| P-E11 | Vendors & submissions | erp-vendors.html |
| P-E12 | Payments & reconciliation | erp-finance.html |
| P-E13 | Reports | erp-reports.html |
| P-E14 | Automation & exceptions | erp-automation.html |
| P-E15 | Settings, roles & audit | erp-admin.html |
| (shell) | Sidebar, location switcher, global search, "New" menu, notifications, user menu, system-health card | `assets/tradex.js` (workspace shell) |
| P-E16 | Staff sign-in, MFA, password reset, invitation acceptance (no mockup screen) | DOCUMENTED — BP §18.2 (MFA for privileged accounts), §19.1; methods D-040 |
| P-E17 | Team & activity (employee monitoring; sidebar "Team monitor") | erp-team.html — added 2026-09-30 for `CF1 §2` (`D-282`, policy `D-283`) |
| P-E18 | Analytics (sales, product, customer and store analytics) | erp-analytics.html — added 2026-09-30 for `CF1 §3` (`D-284`, `D-285`, `D-286`) |

### Vendor portal — `P-V`
| ID | Screen | Mockup file |
|---|---|---|
| P-V01 | Vendor dashboard | vendor-dashboard.html |
| P-V02 | Products & submissions | vendor-products.html |
| P-V03 | Availability, POs, fulfilment tasks & returns | vendor-availability.html |
| P-V04 | Business profile & statements | vendor-account.html |
| P-V05 | Vendor sign-in, invitation acceptance & security (no mockup screen) | DOCUMENTED — BP §11.1 (admin invitation), §19.1; methods D-040, route D-047 |

### Configurable Root Admin portal — `P-R` (separate platform, separate codebase; `20-root-admin.md` §6)
| ID | Screen | Mockup file (`root-admin-mockup/`) |
|---|---|---|
| P-R01 | Platform sign-in (MFA mandatory) | ra-login.html |
| P-R02 | Platform dashboard | ra-dashboard.html |
| P-R03 | Stores (registry) | ra-stores.html |
| P-R04 | Create store (6-step wizard) | ra-store-new.html |
| P-R05 | Store detail & configuration | ra-store.html |
| P-R06 | E-commerce categories (vertical packs) | ra-packs.html |
| P-R07 | Templates | ra-templates.html |
| P-R08 | Capabilities & feature matrix | ra-capabilities.html |
| P-R09 | Terminology | ra-terminology.html |
| P-R10 | Deployments & publications | ra-deployments.html |
| P-R11 | Platform users, roles & audit | ra-admin.html |
| P-R12 | Platform settings & health | ra-settings.html |
| P-R13 | Bundles (reusable building blocks for categories) | ra-bundles.html |
| (shell) | Left nav, environment switcher, platform search, notifications, user menu, support-access banner | `root-admin-mockup/assets/ra.js` |

**No `P-S`, `P-E` or `P-V` screen may link to, mention or hint at a `P-R` screen** (`D-229` INV-8).

BP §30.1 note (applies to all `P-E`): *"Reuse native ERP screens where they fit. Build custom staff UI only where
it materially improves a frequent task."* → decision **D-004** decides, per P-E screen, native vs custom UI.
After the SaaS change every `P-S`/`P-E`/`P-V` screen is additionally **configuration-driven**: its sections,
columns, fields and wording come from the store's capability set, pack profile and terminology (`19` §6, §11).

## 9. Role registry (source: BP §3.1 actors, BP §18.1 authority matrix)

| ID | Role | BP source | Notes |
|---|---|---|---|
| R-guest | Guest | §3.1 | Browse, search, compare, public price; no dealer prices/private history |
| R-consumer | Consumer (B2C) | §3.1 | Terminology pending D-006 |
| R-dealer | Approved dealer (B2B business-account member) | §3.1, §8.3 | Member sub-roles inside a business account: D-066 |
| R-vendor_applicant | Vendor applicant | §3.1, §11.1 | No live catalog/stock write access |
| R-supplier | Approved supplier (vendor user) | §3.1, §11.2 | Own records only |
| R-seller | Marketplace seller | §3.1, §11.4 | `LATER` (M15) |
| R-catalog_staff | Catalog staff | §3.1, §18.1 | |
| R-warehouse_staff | Warehouse staff | §3.1 | Assigned locations/tasks |
| R-sales_support | Sales / support staff | §3.1 | Limited discount/refund authority |
| R-branch_manager | Branch manager | §3.1 | Assigned branch; cross-branch visibility per D-029 |
| R-finance | Finance | §3.1 | Separation of duties |
| R-ops_admin | Operations admin | §3.1 | Sensitive finance changes still restricted |
| R-owner | Owner / super admin | §3.1 | MFA, logged privileged actions |
| R-integration | Integration account | §3.1 | Machine-to-machine, narrow |

All roles above are **store roles**: they exist inside one store and can never see or affect another store
(`19` §10, `BR-M30-01`).

### 9.1 Platform roles (Configurable Root Admin — a separate identity realm, `D-245`)

| ID | Role | May |
|---|---|---|
| R-root_owner | Platform owner / super admin | Everything, incl. platform users, pack/template retirement, store decommission (two-person), support-access approval |
| R-root_operator | Platform operator | Create/configure/deploy stores, publish configuration, manage domains, run migrations |
| R-root_author | Pack & template author | Author/publish vertical packs, templates, capability defaults, terminology sets; no store access |
| R-root_support | Platform support | Read-only fleet view; may request time-boxed, approved, audited store support access (`D-246`) |
| R-root_readonly | Platform read-only | Fleet health and audit only |

A platform role never grants implicit access to store data, and a store role never grants any platform access.
The two realms share no user table, session, token issuer or cookie domain (SEP-3).

BP §18.1 collapses staff roles into columns *Staff / Manager / Finance / Owner-admin / Vendor*; exact monetary
thresholds are client-supplied (D-024). Detailed mapping: `07-auth-roles-permissions.md`.

## 10. Writing rules for every plan file
1. Cite a source for every requirement: `(BP §9.2)`, `(MK:erp-inventory.html#serials)`, `(PR1 §8)`.
2. Tag every item with an evidence label from §2.
3. Use only IDs defined in this file / `DECISIONS.md` / `06-api.md` / `TASKS.md`.
4. Prefer tables. No marketing language.
5. Do not duplicate content: cross-reference by ID instead.

## 11. Repository layout (D-054 — decided 2026-09-27; folder names delegated by the user to this plan)

One repository (`TradexStore`) holds the whole project.

```
TradexStore/
├── index.html, credits.html, store-*.html, erp-*.html, vendor-*.html, assets/
│                               ← clickable store mockup (UI reference, published by GitHub Pages via CNAME). Do
│                                 not modify as part of implementation unless the user asks.
├── root-admin-mockup/          ← Configurable Root Admin mockup P-R01–P-R12 with its own assets/ (D-249).
│                                 INTERNAL: never linked from any page above; noindex on every page.
├── docs/                       ← source requirement documents (read-only sources)
├── plan/                       ← this implementation plan, TASKS.md, STATE.md, DECISIONS.md, tools/status.py
│   ├── phase0/                 ← Phase 0 records (D-210): decision-briefs/, discovery/, audit/, ui/, proof/,
│   │                             estimate/, signoff/ — proof code only on throwaway branches `proof/<candidate>`
│   └── records/<stage>/        ← later-stage project records: measurement reports, scope documents (e.g. Phase 2/3
│                                 scoping), UAT evidence summaries
├── handover/                   ← BP §24.2 handover package documents that are not code: SOPs, training material,
│                                 owner dashboard guide, user guides, data dictionary exports
├── frontend/                   ← THE STORE PLATFORM UI — one codebase, every store (SAAS §3 S01)
│   ├── design-system/          ← design tokens & UI components (M09, D-049)
│   │   └── theme/              ← token contract + compiled-theme consumption (M33)
│   ├── storefront/             ← customer-facing web application: P-S01…P-S13 (M09, framework D-003)
│   │   └── templates/<slug>/   ← site templates TPL-* (M33, D-238): TPL-forge, TPL-aurora, …
│   ├── workspace/              ← ERP staff workspace UI: P-E01…P-E15 — only screens decided "custom" under D-004
│   └── vendor-portal/          ← vendor portal UI: P-V01…P-V04 (M14)
├── backend/                    ← THE STORE PLATFORM BACKEND — operational core customisation / extension app,
│   │                             controlled commerce API, business modules, adapters, jobs, migrations &
│   │                             data-migration scripts (internal structure depends on D-001 / D-002)
│   └── platform/               ← the SaaS runtime layer (19-saas-platform.md)
│       ├── tenancy/            ← M30: store context, host resolution, data-access guard, per-store storage
│       ├── config/             ← M31: CFG-* schema, artefact loader, immutable snapshot, reload, L4 settings
│       ├── capabilities/       ← M31: capability registry and the six enforcement points
│       ├── packs/              ← M32: pack profile consumption (catalog schema, identity model, profiles)
│       └── bootstrap/          ← M35 store side: provisioning bootstrap, seed application, health callbacks
├── root-admin/                 ← THE CONFIGURABLE ROOT ADMIN PLATFORM — separate codebase (M34/M35, D-228)
│                                 app/ api/ domain/ compiler/ deploy/ platform-ops/ migrations/ tests/
│                                 (layout: 20-root-admin.md §2). Its own dependency manifest, build and pipeline.
├── config/generated/           ← compiled config artefacts per store (19 §4.2). GENERATED — never hand-edited,
│                                 never committed (git-ignored); present on each runtime host.
├── infra/                      ← environment definitions, deployment, CI/CD configuration; operational
│                                 runbooks in infra/runbooks/ (backup/restore, incident, release) (D-005, D-052, D-077)
└── tests/                      ← cross-application suites (tools per D-053):
    ├── acceptance/  (BP §23.1 T01–T36)   ├── e2e/        ├── load/       ├── a11y/
    ├── security/                          ├── restore/    ├── migration/  └── uat/
```

Rules:
- Whether `frontend/storefront`, `frontend/workspace` and `frontend/vendor-portal` deploy as separate
  applications or share one deployable is an architecture detail recorded in `02-architecture.md`; the folders
  exist so each application boundary (BP §15.6 "one codebase per real application boundary") is clear.
- **`root-admin/` is a hard boundary.** Nothing under `frontend/` or `backend/` may import anything under
  `root-admin/`, and nothing under `root-admin/` may import store business code. Enforced by a lint rule and a
  CI check (`TS-SAAS-SEP-01`, `19` §2 SEP-6).
- **Each client's data is separated** (`D-272`): its own database, object-storage container, search index, cache
  namespace and encryption key. `store_id` scoping stays mandatory on every store-scoped row regardless, in every
  topology including a single-store standalone install (`19` §10.1, `BR-M30-10`).
- **One codebase, four placements** (`D-269`): shared platform (exception), separated client on a shared server
  (default), dedicated runtime, standalone install on the client's own server. No topology fork in the code.
- **There is never a second store codebase.** A new e-commerce category is a vertical pack (data); a new look is
  a template inside `frontend/storefront/templates/`; neither is a fork (`SAAS §3 S01`, `S20`, `S22`).
- `config/generated/` is machine-written output of the root admin compiler. It is in `.gitignore`; committing an
  artefact is a defect (`BR-M31-07`).
- If D-004 decides a P-E screen uses native ERP screens, that screen gets **no** code in `frontend/workspace/`;
  its configuration lives in `backend/`.
- Unit tests live next to the code they test inside each folder; `tests/` holds only cross-application suites.
- Mobile app (Phase 2, M28) and AI (Phase 3, M29) folders are **not** created in Phase 1.

## 12. Source conflicts and how the plan treats them

| # | Conflict | Plan treatment | Decision |
|---|---|---|---|
| 1 | MEET: Shopify-style platforms "too constrained"; BP §15.1–15.2 still lists Shopify + ERP as an option; BP §1.2 / D-001 evaluation order omits it | Follow BP §1.2 (D-001 options) | D-001 |
| 2 | PR1 §12 phase allocation (vendor = Phase 2, purchasing/warehouses/RMA = Phase 3, WhatsApp/automation = Phase 4) vs BP §5.1 (v1.1, 26 Sep 2026) and PR2 §11 | Follow BP §5.1 / PR2 §11 — PR2 consolidates PR1 + BP; BP v1.1 is the latest priority update | D-220, D-048 |
| 3 | PR1 "rules/workflow engine" vs BP §5.3/§15.6 "no general-purpose workflow builder" | Follow BP: per-module configurable rules + approval matrix | D-221 |
| 4 | PR1 §14 lists development + staging + production; BP §16.6 requires staging + production separated | Plan uses development, staging, production (PR1 adds, BP does not forbid) | D-077 |
| 5 | BP §12.2 marks A01/A02 imports P1, BP §5.1 puts validated bulk import in 1B | Stage allocation per D-048 / D-078 | D-048, D-078 |
| 6 | Mockup stock-ledger "Reserve/Release" rows vs BP §9.2/§17.2 (reservations are separate records that only reduce ATP) | Reservations modelled in E-reservation; screens may present both views | — |
| 7 | Mockup order list shows summary payment/fulfilment labels not in BP §10.1 state lists ("Not started", "Partly dispatched", "Released") | Treated as derived display summaries; stored states follow BP §10.1 + D-150 | D-150 |
| 8 | Mockup reserves stock when a WhatsApp checkout link is sent; BP §29.5 implies reservation at customer confirmation | Open | D-151 |
| 9 | Mockup staff role labels vs BP §3.1 roles | Map labels to R-* roles | D-222 |
| 10 | Mockup audit sample rows mention staff "iPhone/Android app"; BP §28.4 "staff ERP mobile … is not implied" | Not in scope; sample data only | D-085 |
| 11 | BP §3.3 / R15 and `D-045`: "multiple businesses / separate domains — later; prepare boundaries **without building SaaS**" vs SAAS: build the SaaS platform now | **SAAS wins.** `D-045` is superseded; BP §3.3's company/branch/location boundary advice still applies *inside* a store | D-227 |
| 12 | MEET/BP/PR1/PR2 describe electronics-specific behaviour (serials, refurbished grades, compatibility) as product requirements vs SAAS: the codebase must be category-agnostic | Both hold: the behaviour is required, but it belongs to vertical pack `VP-electronics`, not to the code (`19` §6) | D-237, D-251 |
| 13 | Mockup shows one fixed storefront design vs SAAS §3 S19 "templates must not make every client website look identical" | The mockup is `TPL-forge`, one of several templates; a second template `TPL-aurora` proves the mechanism | D-242 |
| 14 | BP §18 / `11-admin.md` treat "administration" as one thing vs SAAS: two administrations | Split: store administration = P-E15 (M24, store-editable keys only); platform administration = P-R* (M34) | D-228, D-243 |
