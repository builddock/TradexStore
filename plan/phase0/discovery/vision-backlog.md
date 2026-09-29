# Vision backlog (BP §2.3)

| Field | Value |
|---|---|
| Task | `T-0-M01-03` (location per `D-210`) |
| Definition | "Everything the business may eventually need" (BP §2.3) |
| Opened | 2026-09-29, seeded from the sources only: MEET, BP §2.1 (R01–R20), §5.2, §28.5. No discovery answers yet |
| Shareable | Yes |
| Separate from | `release-scope.md` (approved, finite scope) and `change-register.md` (requests after approval). The three lists are kept apart on purpose (BP §2.3) |

## Rules
1. **An item here is not a commitment.** "Full ERP" and "all normal e-commerce features" describe a direction.
   They do not automatically include payroll, manufacturing, fleet management, every courier, every
   marketplace or advanced accounting (BP §2.3).
2. **Proposed placement** is the phase the blueprint suggests (BP §5.1, §5.2: M = recommended must-have,
   C = conditional, L = later). It is **not approved**. Placement is approved only when the item enters the
   release scope, through the BP §31.2 "Launch scope and exclusions" sign-off.
3. New ideas raised during discovery are added here with their source (e.g. "Q10 answer, 2026-10-…"). They are
   not added to the release scope directly. After the release scope is approved, a new request goes to the
   change register instead.
4. Status values: `vision` (not scheduled) · `candidate` (proposed for a release, awaiting approval) ·
   `in release scope` (approved, see `release-scope.md`) · `dropped` (with the reason and date).

## Items
| ID | Item | Source | Proposed placement (not approved) | Decisions · questions | Status |
|---|---|---|---|---|---|
| VB-001 | Storefront with familiar marketplace shopping patterns, strong UI, original visual identity | R01; MEET; BP §1.3, §6 | 1A (M) | D-049 · Q61, Q62 | candidate |
| VB-002 | Fast, usable web experience on desktop and laptop | R02; MEET | 1A (M) | D-034 · Q15 | candidate |
| VB-003 | Consumer and approved-dealer prices | R03; MEET "dealer and retail prices"; BP §3.1 | 1A (M) | D-006, D-017 · Q2, Q32 | candidate |
| VB-004 | Quantity discounts for dealers | R04; BP §8.2 | 1A (M) | D-018 · Q33 | candidate |
| VB-005 | Location-based pricing | MEET "potentially location-based pricing engines" | not placed by BP | D-044 · Q32 | vision |
| VB-006 | Supplier/vendor portal: sign-in, submit products and stock, approval before anything goes live | R05; MEET; BP §11 | 1A (C) admin-created accounts · 1B (M) | D-007, D-047, D-048 · Q7 | candidate |
| VB-007 | Owner stays in control: role-based authority, exception dashboard, audit, alerts | R06; MEET; BP §12.5 | 1A (M) | D-024, D-222 · Q52 | candidate |
| VB-008 | New product types added by configuration: categories, attributes, filters (incl. imported, refurbished and own-brand goods) | R07; MEET; BP §7.1, T36 | 1A (M) | D-023 · Q3 | candidate |
| VB-009 | One stock authority, reflected on the website, shared by every sales channel | R08; MEET; BP §9.1 | 1A (M) | D-001, D-009 · Q14 | candidate |
| VB-010 | Automation of repetitive staff work, chosen after observing the real work | R09; MEET; BP §12.1 | 1A (selected) · 1B | D-078, D-221 · Q51–Q59 | candidate |
| VB-011 | Less owner intervention: delegation rules, service times, escalation | R10; MEET; BP §12.6 | 1A (M) · 1B improve | D-025 · Q51, Q56 | candidate |
| VB-012 | Website help: FAQ and chat with hand-off to staff | R11; MEET; BP §5.2 | 1A (M) simple flows · later AI option | D-074 · Q48 | candidate |
| VB-013 | WhatsApp click-to-chat and assisted checkout with shared order references | R11; MEET; BP §13.1 | 1A (M) | D-014 · Q50 | candidate |
| VB-014 | Guided WhatsApp ordering | R11; BP §13.2 | 1A (C) · 1B (M) | D-014, D-048 · Q10, Q50 | candidate |
| VB-015 | Mobile-friendly e-commerce (dedicated phone layouts, touch, device performance) | R12; MEET; BP §5.1 | Phase 2 | D-223 · Q63 | vision |
| VB-016 | Mobile app using the Phase 1 business functions | R12; MEET "web comes before an app" | Phase 2 | D-085 · Q66 | vision |
| VB-017 | AI assistance (drafting, support summaries, FAQ), incl. local model hosting | R13; MEET; BP §28.1 | Phase 3 | D-086 · Q68 | vision |
| VB-018 | Multi-branch and warehouse stock, sales, fulfilment and exception reporting | R14; MEET | 1A (M) | D-075 · Q21 | candidate |
| VB-019 | Additional businesses or brands with their own website | R15; MEET "separate domains or instances"; BP §28.5 | when the BP §28.5 trigger is met: confirmed brands/markets with their ownership and pricing rules | Q67 | vision |
| VB-020 | Warranty, RMA, authenticity and returns traceability for every unit | R19; MEET; BP §6.6 | 1A (M) basic · 1B improve · advanced RMA later | D-022, D-023 · Q8, Q46 | candidate |
| VB-021 | Automatic transfer of supplier product details, quantities and images | R20; MEET | investigation · validated bulk import in 1B | D-057, D-028 · Q17, Q30 | candidate |
| VB-022 | Guest checkout | BP §5.2 | 1A (M), policy to confirm | D-021 | candidate |
| VB-023 | Wishlist and product comparison | BP §5.2 | 1A/1B (C) | D-042 · Q64 | candidate |
| VB-024 | Reviews and ratings with moderation | BP §5.2 | 1A/1B (C) | D-041 · Q64 | candidate |
| VB-025 | Dealer quotations and bulk order entry | BP §26.7 Q64 | not placed by BP | D-121 · Q64 | vision |
| VB-026 | Purchase orders, receipts and supplier records | MEET "recording purchase orders and received products"; BP §5.2 | 1A (M) | D-220 | candidate |
| VB-027 | Branch sale entry or integration (a full replacement POS is conditional) | BP §5.2 | 1A (M) | D-009 · Q11 | candidate |
| VB-028 | Finance exports and reconciliation | BP §5.2 | 1A (M) | D-011 · Q38 | candidate |
| VB-029 | Marketplace: external sellers selling to customers, with settlements | MEET "seller listings and products the business does not stock"; BP §3.2, §11.4 | Phase 2 optional, separately gated | D-046 · Q7, Q67 | vision |
| VB-030 | Dealer credit terms | BP §5.2 ("default prepaid") | Phase 2/3 | D-019 · Q37 | vision |
| VB-031 | Full accounting replacement | BP §5.2 | conditional | D-011 · Q38 | vision |
| VB-032 | Promotions, coupons and campaigns | PR1 §8 | not placed by BP | D-043 · Q34 | vision |
| VB-033 | HR, payroll and attendance | MEET "employee" requirements; BP §5.2 | Phase 2/3 (C) | — | vision |
| VB-034 | Automated payment-collection calls | MEET (cost basis unclear, BP §2.2) | excluded from the first release (BP §5.3) | D-078 · Q59 | vision |
| VB-035 | Advanced search / dedicated search engine | BP §5.2, §28.5 | when native search fails agreed relevance or speed at real catalog size | — | vision |
| VB-036 | Replenishment and demand forecasting | BP §28.1, §28.5 | when there is enough clean sales, stock-out and lead-time history | — | vision |
| VB-037 | Recovery in a second region | BP §28.5 | when business loss and service commitments justify the cost | D-034 · Q69 | vision |
