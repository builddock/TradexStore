# Release scope (BP §2.3)

| Field | Value |
|---|---|
| Task | `T-0-M01-03` (location per `D-210`) |
| Definition | "A finite, approved set of workflows with acceptance criteria" (BP §2.3) |
| Opened | 2026-09-29 |
| **Approved scope** | **None yet.** Approval is BP §31.2 item "Launch scope and exclusions" (accepted version, approver, date), checked by the Phase 0 exit gate `T-0-M01-29` |
| Shareable | Yes |
| Separate from | `vision-backlog.md` (everything the business may need) and `change-register.md` (requests after approval) |

## How this list works
1. Until the scope is approved, this file holds **proposed baseline v0**: the blueprint's recommended phases
   (BP §5.1) and capability matrix (BP §5.2). It is reviewed at the next meeting (agenda item 4). Nothing below is
   approved.
2. Every workflow names the acceptance tests that prove it (BP §23.1, T01–T36). "The suite applies to the release
   containing each feature" (BP §23.1). A workflow without acceptance criteria cannot enter an approved baseline
   (BP §2.3, §22.5).
3. Three open decisions shape this list before it can be approved: `D-048` (first public launch = 1A only, or 1A
   and 1B combined), `D-220` (PR1 §12 places some modules in later phases than BP §5.1), and `D-223` / `D-226`
   (whether phone and tablet layouts are in Phase 1; BP places dedicated mobile work in Phase 2).
4. Once a version is approved, it is frozen. Later changes go through `change-register.md`, and each approved
   change names the baseline version it changes (BP §25.5).

## Baseline register
| Version | Status | Content | Approved by | Date | Changes from previous |
|---|---|---|---|---|---|
| v0 | **proposed, not approved** | BP §5.1 / §5.2 as below | — | — | — |

## Proposed baseline v0

### Phase 1A — core web launch (proposal, BP §5.1)
Goal: deliver the e-commerce and ERP web applications. Proposed exit gate: *web end-to-end UAT and reconciled
opening stock*.

| ID | Workflow | BP §5.2 | Acceptance tests (BP §23.1) | Open decisions |
|---|---|---|---|---|
| RS-1A-01 | Browse categories, filters and search; product detail with clear condition, warranty and actual offer | M | T01, T30, T33 | D-023 |
| RS-1A-02 | Consumer checkout (guest purchase policy to confirm) | M | T04, T06, T10, T30 | D-021, D-026 |
| RS-1A-03 | Dealer approval, dealer price list and quantity tiers, with no private-price leakage | M | T02, T03, T10, T22 | D-006, D-017, D-018 |
| RS-1A-04 | Central stock, warehouse and serial records: one authority for every channel | M | T04, T05, T15, T16 | D-001 |
| RS-1A-05 | Purchase orders, receipts and basic supplier records | M | T15 | — |
| RS-1A-06 | Branch sale entry or integration (full replacement POS is conditional) | M | T05 | D-009 |
| RS-1A-07 | Payments with one provider, including duplicate and late notifications | M | T07, T08, T09 | D-012 |
| RS-1A-08 | Pick, pack and dispatch with one courier and a manual fallback | M | T20, T21 | D-013 |
| RS-1A-09 | Basic returns, refunds and warranty traceability | M | T17, T18, T19, T33, T34 | D-022 |
| RS-1A-10 | Website FAQ and chat hand-off; WhatsApp click-to-chat and assisted checkout | M | T23, T24, T25 | D-014 |
| RS-1A-11 | Owner exception dashboard, audit, alerts and access controls | M | T22, T31 | D-024, D-025, D-222 |
| RS-1A-12 | Reports and basic finance exports / reconciliation | M | T27, T35 | D-011, D-075 |
| RS-1A-13 | A new ordinary product category configured without rebuilding | M (BP §7.1) | T36 | — |
| RS-1A-14 | Backup restoration rehearsed; old website addresses redirected after migration | BP §20, §21 | T28, T32 | D-034, D-076, D-108 |

### Phase 1B — operational completion (proposal, BP §5.1)
Goal: reduce repetitive work further. Proposed exit gate: *measured process improvement and manageable
exceptions*.

| ID | Workflow | BP §5.2 | Acceptance tests (BP §23.1) | Open decisions |
|---|---|---|---|---|
| RS-1B-01 | Controlled vendor portal: vendor submissions reviewed before going live | M in 1B (C in 1A) | T11, T12, T13, T14 | D-007, D-047 |
| RS-1B-02 | Validated bulk import | — | T26 | D-057 |
| RS-1B-03 | Guided WhatsApp ordering | M in 1B (C in 1A) | T24, T25 | D-014 |
| RS-1B-04 | Approvals | — | T31 | D-192 |
| RS-1B-05 | Selected integrations | — | per integration (timeout, duplicate event, reconciliation, manual recovery — BP §22.5) | D-212 |

"1A and 1B are proposed web-delivery sub-releases within Phase 1; 1B is not the mobile phase. If the client
requires vendor self-service and WhatsApp ordering at the first public launch, combine the gates and budget for
them. A click-to-chat button alone is not complete WhatsApp ordering." (BP §5.1)

### Conditional items: in or out needs a decision first (BP §5.2 "C")
| Item | Placement if approved | Decision |
|---|---|---|
| Wishlist and basic product comparison | 1A or 1B | D-042 |
| Reviews and ratings (moderation, verified purchase) | 1A or 1B | D-041 |
| Vendor admin-created accounts and submissions in 1A | 1A | D-007, D-048 |
| Structured WhatsApp ordering in 1A | 1A | D-014, D-048 |
| Full accounting replacement | any phase, with its own migration and finance sign-off | D-011 |
| Full replacement POS | 1A | D-009 |

### Explicit first-release exclusions (BP §5.3)
"Unless deliberately added": general-purpose workflow builders, dynamic AI pricing, customer wallets, complex
loyalty, cross-border checkout, automated lending/credit decisions, autonomous purchasing, full repair workshop
ERP, marketplace payout automation, dedicated mobile-friendly optimisation, mobile applications, automated
collection calls, Kubernetes, Kafka, a separate service for every module, and active-active multi-region
deployment. Excluded functions may still need a manual interface. For example, a warranty ticket can be tracked
without a full repair workshop system (BP §5.3).

### Later phases
Phase 2 (mobile-friendly e-commerce and the mobile app; acceptance T29) and Phase 3 (AI and further expansion)
are listed in `vision-backlog.md`. They are not part of this baseline.
