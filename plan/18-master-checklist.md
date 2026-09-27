# 18 — Final master checklist

**Purpose.** One checklist that proves the whole Tradex system (Phase 1 = 1A + 1B) is implemented, verified, deployed
and handed over. It is organised by phase/stage, module, frontend, backend, database, APIs, integrations, testing,
deployment and documentation. Every item cites the task ID(s) of the skeleton (`12-phases.md` §9) that deliver it and
the verification (test ID or evidence) that proves it.

**Sources used.** `12-phases.md` (§2, §5–§9 — task IDs, stage completion criteria, T-test gates, traceability),
`03-database.md` §4–§6 (migration groups, invariants, seed sets), `04a`/`04b`/`04c` (screens, tabs, shells), `05-backend.md`
§1, §4, §5 (cross-cutting rules, automations, module completion criteria), `06-api.md` §2, §7 (492 endpoints),
`07-auth-roles-permissions.md`, `10-erp.md` (§x.10 completion criteria, §15 automation catalogue), `11-admin.md` §15,
`16-testing.md` (suites, T01–T36, UAT §13, go-live §14, DoD §15), `17-dependencies.md`, `DECISIONS.md`; BP §5.1, §17.6,
§20.5, §21.3, §22.2, §23.1–§23.4, §24.1–§24.4.

**Labels.** `(C)` = CONDITIONAL / MOCKUP-ONLY / scope-decision item: built only if its decision approves it, otherwise
its task becomes `NOT_APPLICABLE` (D-213) and the item is ticked with that evidence. `LATER` = out of Phase 1 scope
(listed in §11 only). Decision IDs are given where an item cannot be built or valued without them; the full blocking
list per task is in `12` §9 and ranked in `17` §13. No new requirement, task or decision is introduced here (reserved
range D-216–D-219 unused).

---

## 0. How to use this checklist

1. **Tick rule.** An item is ticked (`- [x]`) only when **every task ID it cites** is `COMPLETED` or `NOT_APPLICABLE` in
   `TASKS.md` **and** the verification it names has recorded evidence (task **Evidence** field, `STATE.md` §11 test rows,
   `16` §16). A `NOT_APPLICABLE` task needs the deciding D-ID in its Evidence (D-213). Never tick from memory — tick from
   the tracker.
2. **Source of truth.** `TASKS.md` is the task status authority; this file is a completion *view* across dimensions.
   If the two disagree, fix this file. Task IDs are permanent (D-213): a re-staged task keeps its ID, so items stay valid.
3. **Coverage.** §1.2 cites every one of the 355 tasks of stages 0–1B.5 (the 6 scope-only tasks of stages 2–3 are in
   §11); the other sections regroup the same tasks by
   module, screen, schema, endpoint, integration, test, deployment and documentation concern. An item may cite tasks of
   several stages — it can only be ticked when the last of them is complete (see `17` §10.2 and §11.2 for progressive
   screens and endpoints).
4. **When to update.** At the end of every session (`14` steps 18–20) after `TASKS.md` and `STATE.md`: re-run the status
   view (§12) and tick the items it reports as satisfied whose verification evidence exists.
5. **Final proof.** The system is complete for Phase 1 when every item of §1–§10 is ticked (no `LATER` item of §11 is
   required), `python3 plan/tools/status.py --check` reports 0 issues and the 1B exit gate T-1B.5-M17-01 is `COMPLETED`.

Item format: `- [ ] <what> — Tasks: <task IDs> · Decisions: <D-IDs> · Verify: <tests / evidence>`.

---

## 1. Phases and stages

### 1.1 Phase exit gates (BP §5.1; `16` §12)

- [ ] **Phase 0 exit** — owner and operations approve business model and scope; BP §31.2 items 1–9 signed; 48 decision records; costed backlog — **Tasks:** T-0-M01-28, T-0-M01-29 · **Decisions:** D-211 (start of 1A.1) · **Verify:** TS-PROOF-01…10 results per candidate; D-001 `DECIDED`; `status.py --stage 0` all COMPLETED; STATE §6 decision log
- [ ] **Phase 1A exit** — web end-to-end UAT and reconciled opening stock; go-live checklist G1–G13 evidenced — **Tasks:** T-1A.17-M25-05, T-1A.17-M01-01, T-1A.17-M25-06 · **Decisions:** D-048 · **Verify:** all 1A T-tests (§8.1) recorded passed; UAT sign-off (`16` §13); TS-MIG-03, TS-MIG-06; §9.2 G1–G13
- [ ] **Hypercare complete and handed over** (BP §21.3 step 10, §24.4; WP17 'Stable operations and handover') — **Tasks:** T-1A.17-M26-07 · **Decisions:** D-214, D-035 · **Verify:** hypercare exit criteria per D-214 met; first-weeks review of exceptions, tickets, abandonment, search failures, discrepancies, automation recorded; TS-BKP-04 scheduled; TS-MIG-08 legacy read-only access
- [ ] **Phase 1B exit** — measured process improvement and manageable exceptions — **Tasks:** T-0-M17-02, T-1B.4-M17-03, T-1B.5-M25-01, T-1B.5-M26-01, T-1B.5-M17-01 · **Decisions:** D-048, D-215 · **Verify:** T11–T14, T24, T26 pass; BP §4 measures vs baseline (owner touches, touch time, exceptions resolved at staff level); TS-ADM-10

### 1.2 Stages — every task complete

Each item lists **all** tasks of the stage (`12` §9). The stage gate task runs the stage-exit suites (`16` §4 cadence S).

- [ ] **Stage 0 — Discovery & proof** (69 tasks; gate T-0-M01-29; `12` §6.1) — BP §5.1 exit gate; WP01 approved requirements and open decisions; WP02 retain/replace recommendation with evidence; WP03 web client approval and task-test notes; WP04 critical scenarios pass — **Tasks:** T-0-M01-01, T-0-M01-02, T-0-M01-03, T-0-M01-04, T-0-M25-01, T-0-M25-02, T-0-M25-03, T-0-M25-04, T-0-M17-01, T-0-M17-02, T-0-M09-01, T-0-M09-02, T-0-M09-03, T-0-M01-05, T-0-M06-01, T-0-M05-01, T-0-M11-01, T-0-M13-01, T-0-M14-01, T-0-M17-03, T-0-M01-06, T-0-M01-07, T-0-M01-08, T-0-M08-01, T-0-M14-02, T-0-M19-01, T-0-M25-05, T-0-M03-01, T-0-M17-04, T-0-M17-05, T-0-M17-06, T-0-M17-07, T-0-M17-08, T-0-M02-01, T-0-M05-02, T-0-M05-03, T-0-M05-04, T-0-M13-02, T-0-M04-01, T-0-M19-02, T-0-M19-03, T-0-M25-06, T-0-M26-01, T-0-M26-02, T-0-M09-04, T-0-M01-09, T-0-M01-10, T-0-M01-11, T-0-M01-12, T-0-M01-13, T-0-M09-05, T-0-M01-26, T-0-M01-27, T-0-M01-14, T-0-M01-15, T-0-M01-16, T-0-M01-17, T-0-M01-18, T-0-M01-19, T-0-M01-20, T-0-M01-21, T-0-M01-22, T-0-M01-23, T-0-M01-24, T-0-M01-25, T-0-M26-03, T-0-M26-04, T-0-M01-28, T-0-M01-29 · **Verify:** TS-PROOF-01…10; BP §31.2 sign-off worksheet
- [ ] **Stage 1A.1 — Foundation** (13 tasks; gate T-1A.1-M01-10; `12` §6.2) — staging and production reproducible from `infra/`; CI green on main; DB-G0 applied; outbox worker running; deploy and first restore proof; no secret in the repository or published site — **Tasks:** T-1A.1-M01-01, T-1A.1-M01-02, T-1A.1-M01-03, T-1A.1-M01-04, T-1A.1-M01-05, T-1A.1-M01-06, T-1A.1-M01-07, T-1A.1-M01-08, T-1A.1-M01-09, T-1A.1-M17-01, T-1A.1-M26-01, T-1A.1-M26-02, T-1A.1-M01-10 · **Verify:** TS-DB-01/02/04/08, TS-UNIT-02/06, TS-SVC-02, TS-API-02/05/08, TS-BKP-01, TS-SEC-05/06/07, TS-REG-01/02/04
- [ ] **Stage 1A.2 — Identity, access, audit & organisation** (17 tasks; gate T-1A.2-M02-09; `12` §6.3) — every endpoint behind AccessPolicy; MFA for privileged accounts; audit events for privileged actions; company, locations and bins seeded; approval, exception, configuration and integration cores; secrets never returned — **Tasks:** T-1A.2-M02-01, T-1A.2-M02-02, T-1A.2-M02-03, T-1A.2-M02-04, T-1A.2-M02-05, T-1A.2-M02-06, T-1A.2-M02-07, T-1A.2-M02-08, T-1A.2-M03-01, T-1A.2-M03-02, T-1A.2-M17-01, T-1A.2-M17-02, T-1A.2-M23-01, T-1A.2-M23-02, T-1A.2-M24-01, T-1A.2-M24-02, T-1A.2-M02-09 · **Verify:** TS-AUTH-01…10, TS-PERM-01/04/08/09, TS-UNIT-03/10, TS-SVC-03/04/06, TS-ADM-01/02/05/06/07/09/12, TS-INT-04/10, TS-SEC-09/11
- [ ] **Stage 1A.3 — Design system & app shells** (12 tasks; gate T-1A.3-M09-06; `12` §6.4) — tokens, components, content rules and key states approved (BP §6.7 step 7); loading/empty/error/keyboard/focus states per component; permission-filtered shells; keyboard-operable sign-in — **Tasks:** T-1A.3-M09-01, T-1A.3-M09-02, T-1A.3-M09-03, T-1A.3-M09-04, T-1A.3-M09-05, T-1A.3-M01-01, T-1A.3-M24-01, T-1A.3-M02-01, T-1A.3-M02-02, T-1A.3-M03-01, T-1A.3-M09-06 · **Verify:** TS-FE-01/03/06, TS-A11Y-02, TS-AUTH-01/02, TS-ADM-01/02/05/06/15, T30 (sign-in part)
- [ ] **Stage 1A.4 — Catalog, media, search & SEO base** (15 tasks, of which 1 (C); gate T-1A.4-M04-10; `12` §6.5) — catalog configured without code change; drafts never overwrite live; publication checker and review queue; search with facets and synonyms; SEO service; representative product import — **Tasks:** T-1A.4-M04-01, T-1A.4-M04-02, T-1A.4-M04-03, T-1A.4-M04-04, T-1A.4-M04-05, T-1A.4-M04-06, T-1A.4-M04-07, T-1A.4-M22-01, T-1A.4-M22-02, T-1A.4-M21-01, T-1A.4-M27-01, T-1A.4-M04-08, T-1A.4-M04-09, T-1A.4-M25-01, T-1A.4-M04-10 · **Verify:** TS-ERP-15, TS-UNIT-07, TS-SVC-08/09, TS-ECOM-01, TS-SEC-03/04, TS-MIG-01, TS-PROOF-02, T36 (catalog/search part)
- [ ] **Stage 1A.5 — Pricing** (10 tasks, of which 2 (C); gate T-1A.5-M05-09; `12` §6.6) — one pricing engine as the only price source; price matrix and private-price isolation at API level; approved price changes; margin controls — **Tasks:** T-1A.5-M05-01, T-1A.5-M05-02, T-1A.5-M04-01, T-1A.5-M05-03, T-1A.5-M05-04, T-1A.5-M05-05, T-1A.5-M05-06, T-1A.5-M05-07, T-1A.5-M05-08, T-1A.5-M05-09 · **Verify:** TS-UNIT-01/02, TS-ERP-16, TS-PERM-05, TS-API-07, TS-PROOF-03, T03 (engine part)
- [ ] **Stage 1A.6 — Inventory & serials** (16 tasks, of which 4 (C); gate T-1A.6-M06-12; `12` §6.7) — append-only ledger reconciling to positions (zero drift); serial lifecycle with inspections; transfers with in-transit balances; counts and approved adjustments; A04 projection — **Tasks:** T-1A.6-M06-01, T-1A.6-M06-02, T-1A.6-M06-03, T-1A.6-M06-04, T-1A.6-M06-05, T-1A.6-M06-06, T-1A.6-M06-07, T-1A.6-M06-08, T-1A.6-M06-09, T-1A.6-M06-10, T-1A.6-M03-01, T-1A.6-M04-01, T-1A.6-M23-01, T-1A.6-M06-11, T-1A.6-M25-01, T-1A.6-M06-12 · **Verify:** TS-ERP-02/03/05/06, TS-UNIT-05, TS-DB-03/07, TS-PERF-03, TS-INT-07, T16
- [ ] **Stage 1A.7 — Purchasing & receiving** (12 tasks, of which 1 (C); gate T-1A.7-M07-10; `12` §6.8) — receipt → QC → sellable with serials; POs approved by value; three-way match; cost signals never change live prices — **Tasks:** T-1A.7-M07-01, T-1A.7-M07-02, T-1A.7-M07-03, T-1A.7-M07-04, T-1A.7-M07-05, T-1A.7-M07-06, T-1A.7-M07-07, T-1A.7-M05-01, T-1A.7-M07-08, T-1A.7-M07-09, T-1A.7-M25-01, T-1A.7-M07-10 · **Verify:** TS-ERP-04/09, TS-PROOF-01, TS-E2E-10 (receipt part), T15
- [ ] **Stage 1A.8 — Customers & dealer accounts** (17 tasks, of which 2 (C); gate T-1A.8-M08-12; `12` §6.9) — only verified members of approved business accounts receive dealer context; consent with history; data requests; dealer applications reviewed — **Tasks:** T-1A.8-M08-01, T-1A.8-M08-02, T-1A.8-M08-03, T-1A.8-M08-04, T-1A.8-M08-05, T-1A.8-M08-06, T-1A.8-M08-07, T-1A.8-M02-01, T-1A.8-M08-08, T-1A.8-M08-09, T-1A.8-M08-10, T-1A.8-M09-01, T-1A.8-M09-02, T-1A.8-M09-03, T-1A.8-M08-11, T-1A.8-M25-01, T-1A.8-M08-12 · **Verify:** TS-ECOM-09/10, TS-ERP-17, TS-PERM-02/05/10, TS-DB-06, TS-INT-08, T02 (membership part)
- [ ] **Stage 1A.9 — Storefront pages, cart, checkout & orders** (30 tasks, of which 11 (C); gate T-1A.9-M10-09; `12` §6.10) — browse, compare condition, context price, cart and checkout to a pending order with atomic reservation; staff order queue, holds and cancellations; WP09 core customer tasks complete — **Tasks:** T-1A.9-M10-01, T-1A.9-M05-01, T-1A.9-M06-01, T-1A.9-M12-01, T-1A.9-M10-02, T-1A.9-M10-03, T-1A.9-M10-04, T-1A.9-M10-05, T-1A.9-M10-06, T-1A.9-M10-07, T-1A.9-M05-02, T-1A.9-M05-03, T-1A.9-M08-01, T-1A.9-M06-02, T-1A.9-M10-08, T-1A.9-M09-01, T-1A.9-M09-02, T-1A.9-M09-03, T-1A.9-M09-04, T-1A.9-M09-05, T-1A.9-M09-06, T-1A.9-M09-07, T-1A.9-M09-08, T-1A.9-M09-09, T-1A.9-M09-10, T-1A.9-M09-11, T-1A.9-M04-01, T-1A.9-M27-01, T-1A.9-M10-09 · **Verify:** T01, T02, T03, T04, T06 (order part), T10, T22, T33 (snapshot), T36; TS-ERP-01, TS-ECOM-01…07, TS-FE-02/05/06/08, TS-API-03/07/09/10, TS-PERM-03/05, TS-PERF-01, TS-E2E-02/08/10
- [ ] **Stage 1A.10 — Payments & reconciliation** (12 tasks, of which 3 (C); gate T-1A.10-M11-10; `12` §6.11) — hosted payment with signed webhooks; duplicate/late/out-of-order events safe; refunds with maker-checker never exceeding the refundable amount — **Tasks:** T-1A.10-M23-01, T-1A.10-M11-01, T-1A.10-M11-02, T-1A.10-M11-03, T-1A.10-M11-04, T-1A.10-M11-05, T-1A.10-M11-06, T-1A.10-M11-07, T-1A.10-M11-08, T-1A.10-M11-09, T-1A.10-M09-01, T-1A.10-M11-10 · **Verify:** T06, T07 (payment effect), T08, T09, T18 (refund part), T19, T34 (refund part); TS-INT-01, TS-ERP-13, TS-ERR-01, TS-API-06, TS-PROOF-05, TS-E2E-06/11
- [ ] **Stage 1A.11 — Fulfilment & shipping** (15 tasks, of which 4 (C); gate T-1A.11-M12-12; `12` §6.12) — release, pick, pack and dispatch the correct serial with documents; courier booking with manual fallback; tracking and delivery exceptions — **Tasks:** T-1A.11-M12-01, T-1A.11-M23-01, T-1A.11-M12-02, T-1A.11-M12-03, T-1A.11-M19-01, T-1A.11-M12-04, T-1A.11-M12-05, T-1A.11-M12-06, T-1A.11-M12-07, T-1A.11-M12-08, T-1A.11-M12-09, T-1A.11-M12-10, T-1A.11-M12-11, T-1A.11-M09-01, T-1A.11-M12-12 · **Verify:** T07, T20, T21 (fulfilment path); TS-ERP-10/11, TS-INT-02, TS-UNIT-09, TS-ADM-14, TS-ERR-03
- [ ] **Stage 1A.12 — Returns, RMA & warranty** (13 tasks, of which 4 (C); gate T-1A.12-M13-09; `12` §6.13) — returned units never sellable without a disposition decision; refunds and resale decided separately; credit notes; warranty claims; supplier RMAs — **Tasks:** T-1A.12-M13-01, T-1A.12-M13-02, T-1A.12-M13-03, T-1A.12-M13-04, T-1A.12-M13-05, T-1A.12-M13-06, T-1A.12-M13-07, T-1A.12-M08-01, T-1A.12-M04-01, T-1A.12-M10-01, T-1A.12-M09-01, T-1A.12-M13-08, T-1A.12-M13-09 · **Verify:** T17, T18/T19 via RMA, T33, T34; TS-ERP-12, TS-ECOM-08, TS-UNIT-08, TS-E2E-01/09, TS-PROOF-07
- [ ] **Stage 1A.13 — Support L1 & notifications** (12 tasks, of which 2 (C); gate T-1A.13-M16-05; `12` §6.14) — A14 notifications with delivery status; help centre, guided chat with handoff, web inbox and tickets; no disclosure without verification; assisted orders — **Tasks:** T-1A.13-M20-01, T-1A.13-M20-02, T-1A.13-M20-03, T-1A.13-M20-04, T-1A.13-M20-05, T-1A.13-M16-01, T-1A.13-M16-02, T-1A.13-M16-03, T-1A.13-M10-01, T-1A.13-M16-04, T-1A.13-M09-01, T-1A.13-M16-05 · **Verify:** T05, T23 (web), T25; TS-SVC-05, TS-ECOM-11/12/15, TS-INT-04, TS-PERM-06, TS-ERP-18, TS-E2E-04
- [ ] **Stage 1A.14 — Automation, exceptions, approvals & owner control centre** (13 tasks, of which 1 (C); gate T-1A.14-M17-12; `12` §6.15) — rule catalogue with kill switch and dry run; exception and approval queues; thresholds, delegation, emergency access; digest; control centre; owner-away day passes — **Tasks:** T-1A.14-M17-01, T-1A.14-M17-02, T-1A.14-M17-03, T-1A.14-M17-04, T-1A.14-M17-05, T-1A.14-M17-06, T-1A.14-M17-07, T-1A.14-M17-08, T-1A.14-M17-09, T-1A.14-M18-01, T-1A.14-M17-10, T-1A.14-M17-11, T-1A.14-M17-12 · **Verify:** T09 (exception visible), T21, T31; TS-UNIT-10, TS-SVC-02/06/07/11, TS-PERM-07/08/09/13/14, TS-ADM-03/04/10/11, TS-ERR-05/06, TS-E2E-07, TS-PROOF-08
- [ ] **Stage 1A.15 — Reporting & finance export** (13 tasks, of which 1 (C); gate T-1A.15-M18-08; `12` §6.16) — launch report set reconciles with sample transactions; secure exports and schedules; accounting export with control totals; daily close — **Tasks:** T-1A.15-M18-01, T-1A.15-M18-02, T-1A.15-M18-03, T-1A.15-M18-04, T-1A.15-M18-05, T-1A.15-M18-06, T-1A.15-M19-01, T-1A.15-M19-02, T-1A.15-M11-01, T-1A.15-M18-07, T-1A.15-M09-01, T-1A.15-M10-01, T-1A.15-M18-08 · **Verify:** T18 (accounting effect), T27, T35 (export during checkout); TS-ERP-14/19, TS-INT-05, TS-SVC-10, TS-SEC-10, TS-UNIT-11, TS-PERF-05, TS-PROOF-10
- [ ] **Stage 1A.16 — Administration completion** (9 tasks, of which 2 (C); gate T-1A.16-M24-05; `12` §6.17) — complete P-E15; change register; alert catalogue with owners; retention hooks; all decision-driven values stored as configuration; AccessPolicy on every admin endpoint — **Tasks:** T-1A.16-M24-01, T-1A.16-M24-02, T-1A.16-M24-03, T-1A.16-M24-04, T-1A.16-M26-01, T-1A.16-M26-02, T-1A.16-M24-05 · **Verify:** TS-ADM-01…15, TS-SVC-04, TS-PERM-10/11/12, TS-SEC-05, TS-DB-06
- [ ] **Stage 1A.17 — Migration, UAT & launch readiness** (17 tasks, of which 1 (C); gate T-1A.17-M01-01; `12` §6.18) — reconciled migration and restore rehearsals; security, performance and accessibility acceptance; UAT; training; handover; go-live; cutover; hypercare — **Tasks:** T-1A.17-M25-01, T-1A.17-M02-01, T-1A.17-M27-01, T-1A.17-M25-02, T-1A.17-M25-03, T-1A.17-M26-01, T-1A.17-M25-04, T-1A.17-M26-02, T-1A.17-M26-03, T-1A.17-M26-04, T-1A.17-M09-01, T-1A.17-M26-05, T-1A.17-M26-06, T-1A.17-M25-05, T-1A.17-M01-01, T-1A.17-M25-06, T-1A.17-M26-07 · **Verify:** T28, T30, T32, T35 (load); TS-MIG-01…08, TS-BKP-02/03/04, TS-SEC-01…12, TS-PERF-01…07, TS-A11Y-01…03, TS-FE-07; UAT sets; G1–G13
- [ ] **Stage 1B.1 — Vendor portal & vendor management** (17 tasks, of which 3 (C); gate T-1B.1-M14-15; `12` §6.19) — vendor onboarding and portal; submissions reach the live catalog only after review; no cross-vendor access; suspension effects — **Tasks:** T-1B.1-M14-01, T-1B.1-M14-02, T-1B.1-M14-03, T-1B.1-M14-04, T-1B.1-M14-05, T-1B.1-M14-06, T-1B.1-M14-07, T-1B.1-M14-08, T-1B.1-M14-09, T-1B.1-M14-10, T-1B.1-M14-11, T-1B.1-M14-12, T-1B.1-M14-13, T-1B.1-M14-14, T-1B.1-M14-15 · **Verify:** T11, T12, T13 with two vendors; TS-VEN-01/02/05/06/08/09/10/11, TS-FE-04, TS-PERM-02/03/04, TS-PROOF-06/09, TS-E2E-03
- [ ] **Stage 1B.2 — Validated bulk import & supplier feeds** (10 tasks, of which 2 (C); gate T-1B.2-M04-04; `12` §6.20) — staged imports with row-level results and no duplicates on repeat; vendor batches; supplier availability with freshness enforcement — **Tasks:** T-1B.2-M04-01, T-1B.2-M22-01, T-1B.2-M23-01, T-1B.2-M04-02, T-1B.2-M06-01, T-1B.2-M14-01, T-1B.2-M14-02, T-1B.2-M04-03, T-1B.2-M05-01, T-1B.2-M04-04 · **Verify:** T14, T26, T35 (import during checkout); TS-VEN-03/04, TS-ERP-08/15, TS-INT-06, TS-SEC-04, TS-ERR-06, TS-PERF-05
- [ ] **Stage 1B.3 — Guided WhatsApp ordering (L2) & shared inbox** (8 tasks; gate T-1B.3-M16-06; `12` §6.21) — WhatsApp shared inbox, guided ordering into draft baskets, verified status, handoff with context, consented WhatsApp notifications — **Tasks:** T-1B.3-M23-01, T-1B.3-M16-01, T-1B.3-M16-02, T-1B.3-M16-03, T-1B.3-M16-04, T-1B.3-M16-05, T-1B.3-M20-01, T-1B.3-M16-06 · **Verify:** T23 (WhatsApp), T24, T25 (WhatsApp); TS-E2E-05, TS-INT-03, TS-ECOM-11/12, TS-ERP-18, TS-PERM-06
- [ ] **Stage 1B.4 — Approval extensions, selected integrations & P1B automations** (7 tasks, of which 2 (C); gate T-1B.4-M17-04; `12` §6.22) — 1B approval types; P1B automations with completed templates; selected integrations; supplier-fulfilment pilot (if approved); improvement measured vs baseline — **Tasks:** T-1B.4-M17-01, T-1B.4-M05-01, T-1B.4-M17-02, T-1B.4-M14-01, T-1B.4-M23-01, T-1B.4-M17-03, T-1B.4-M17-04 · **Verify:** TS-SVC-07, TS-PERM-14, TS-ADM-10/11, TS-UNIT-10, TS-VEN-07, TS-INT-10
- [ ] **Stage 1B.5 — 1B UAT & release** (4 tasks; gate T-1B.5-M17-01; `12` §6.23) — 1B UAT accepted; 1B released by the approved rollout; first vendors onboarded; 1B exit evidence — **Tasks:** T-1B.5-M25-01, T-1B.5-M26-01, T-1B.5-M14-01, T-1B.5-M17-01 · **Verify:** UAT-VEN, UAT-SUP (WhatsApp), UAT-WALK (WhatsApp order); T11–T14, T24, T26

### 1.3 Work packages (BP §22.2 acceptance evidence; `12` §8.1)

- [ ] **WP01 Discovery** — acceptance: Approved requirements and open decisions — **Tasks:** T-0-M01-03, T-0-M01-04, T-0-M25-01, T-0-M17-01, T-0-M17-02, T-0-M02-01 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP02 Technical audit** — acceptance: Retain/replace recommendation with evidence — **Tasks:** T-0-M25-02, T-0-M25-03, T-0-M25-04, T-0-M25-05 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP03 UI/UX** — acceptance: Web client approval and task-test notes (mobile in Phase 2) — **Tasks:** T-0-M09-01, T-0-M09-02, T-0-M09-03, T-0-M09-04, T-1A.3-M09-01, T-1A.3-M09-02 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP04 Platform proof** — acceptance: Critical scenarios pass — **Tasks:** T-0-M01-05, T-0-M06-01, T-0-M05-01, T-0-M11-01, T-0-M13-01, T-0-M14-01, T-0-M17-03, T-0-M01-06, T-0-M01-09 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP05 Environment** — acceptance: Deploy/restore proof — **Tasks:** T-1A.1-M01-06, T-1A.1-M01-07, T-1A.1-M01-08, T-1A.1-M26-02, T-1A.1-M01-10, T-1A.2-M24-02, T-1A.16-M24-01 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP06 Master data** — acceptance: Representative products import correctly — **Tasks:** T-1A.2-M03-02, T-1A.4-M04-02, T-1A.4-M04-04, T-1A.4-M25-01, T-1A.4-M04-10, T-1B.2-M04-01 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP07 Pricing** — acceptance: Price matrix and privacy tests pass — **Tasks:** T-1A.5-M05-02, T-1A.5-M05-09, T-1A.8-M08-06, T-1A.9-M05-01 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP08 Inventory** — acceptance: Last-unit/serial/count tests pass — **Tasks:** T-1A.6-M06-12, T-1A.7-M07-10, T-1A.9-M06-01 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP09 Commerce** — acceptance: Core customer tasks complete — **Tasks:** T-1A.3-M09-04, T-1A.4-M21-01, T-1A.8-M09-02, T-1A.9-M10-09 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP10 Payments** — acceptance: Duplicate/late payment scenarios pass — **Tasks:** T-1A.10-M11-10 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP11 Fulfilment** — acceptance: Full fulfilment/return sample passes — **Tasks:** T-1A.11-M12-12, T-1A.12-M13-09 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP12 Automation** — acceptance: Failure recovery and measured run logs — **Tasks:** T-1A.1-M17-01, T-1A.2-M17-01, T-1A.2-M17-02, T-1A.13-M20-02, T-1A.14-M17-12, T-1B.4-M17-02 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP13 Vendor portal** — acceptance: No cross-vendor access; approved changes only — **Tasks:** T-1B.1-M14-15, T-1B.2-M14-01, T-1B.2-M14-02, T-1B.4-M14-01 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP14 WhatsApp** — acceptance: Chat-to-order and handoff UAT — **Tasks:** T-1A.13-M10-01, T-1A.13-M16-05, T-1B.3-M16-06 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP15 Reporting** — acceptance: Totals reconcile with sample transactions — **Tasks:** T-1A.15-M18-08 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP16 Migration/UAT** — acceptance: Client sign-off and reconciled opening data — **Tasks:** T-1A.17-M25-05, T-1A.17-M25-06, T-1B.5-M25-01 · **Verify:** acceptance evidence recorded in the gate task Evidence
- [ ] **WP17 Launch/support** — acceptance: Stable operations and handover — **Tasks:** T-1A.17-M26-05, T-1A.17-M26-06, T-1A.17-M01-01, T-1A.17-M25-06, T-1A.17-M26-07, T-1B.5-M26-01 · **Verify:** acceptance evidence recorded in the gate task Evidence

---

## 2. Modules (M01–M29)

A module is complete when all its Phase 1 tasks are complete and its module regression set (`16` §17, TS-REG-02)
passes. Endpoint counts from `06` §7.2; completion criteria are itemised in §4.1. LATER modules are in §11.

- [ ] **M01 Platform foundation** — 12 Phase 1 tasks in 1A.1, 1A.3, 1A.17; 0 endpoints — **Tasks:** T-1A.1-M01-01, T-1A.1-M01-02, T-1A.1-M01-03, T-1A.1-M01-04, T-1A.1-M01-05, T-1A.1-M01-06, T-1A.1-M01-07, T-1A.1-M01-08, T-1A.1-M01-09, T-1A.1-M01-10, T-1A.3-M01-01, T-1A.17-M01-01 · **Verify:** module regression TS-DB-01, TS-SVC-02, deploy smoke, TS-BKP-01; module criteria §4.1
- [ ] **M02 Identity, access & audit** — 13 Phase 1 tasks in 1A.2, 1A.3, 1A.8, 1A.17; 42 endpoints — **Tasks:** T-1A.2-M02-01, T-1A.2-M02-02, T-1A.2-M02-03, T-1A.2-M02-04, T-1A.2-M02-05, T-1A.2-M02-06, T-1A.2-M02-07, T-1A.2-M02-08, T-1A.2-M02-09, T-1A.3-M02-01, T-1A.3-M02-02, T-1A.8-M02-01, T-1A.17-M02-01 · **Verify:** module regression TS-UNIT-03, TS-AUTH-01…10, TS-PERM-01…14, TS-SVC-03, TS-ADM-01/02/05/09; module criteria §4.1
- [ ] **M03 Organisation & locations** — 4 Phase 1 tasks in 1A.2, 1A.3, 1A.6; 11 endpoints — **Tasks:** T-1A.2-M03-01, T-1A.2-M03-02, T-1A.3-M03-01, T-1A.6-M03-01 · **Verify:** module regression TS-ADM-06, TS-PERM-11; module criteria §4.1
- [ ] **M04 Catalog** — 18 Phase 1 tasks in 1A.4, 1A.5, 1A.6, 1A.9, 1A.12, 1B.2; 41 endpoints — **Tasks:** T-1A.4-M04-01, T-1A.4-M04-02, T-1A.4-M04-03, T-1A.4-M04-04, T-1A.4-M04-05, T-1A.4-M04-06, T-1A.4-M04-07, T-1A.4-M04-08, T-1A.4-M04-09, T-1A.4-M04-10, T-1A.5-M04-01, T-1A.6-M04-01, T-1A.9-M04-01, T-1A.12-M04-01, T-1B.2-M04-01, T-1B.2-M04-02, T-1B.2-M04-03, T-1B.2-M04-04 · **Verify:** module regression TS-UNIT-07, TS-ERP-15, TS-ECOM-01/02, TS-SVC-09, TS-SEC-04, TS-VEN-02; module criteria §4.1
- [ ] **M05 Pricing** — 15 Phase 1 tasks in 1A.5, 1A.7, 1A.9, 1B.2, 1B.4; 24 endpoints — **Tasks:** T-1A.5-M05-01, T-1A.5-M05-02, T-1A.5-M05-03, T-1A.5-M05-04, T-1A.5-M05-05, T-1A.5-M05-06, T-1A.5-M05-07, T-1A.5-M05-08, T-1A.5-M05-09, T-1A.7-M05-01, T-1A.9-M05-01, T-1A.9-M05-02, T-1A.9-M05-03, T-1B.2-M05-01, T-1B.4-M05-01 · **Verify:** module regression TS-UNIT-01/02, TS-ECOM-03, TS-ERP-16, TS-PERM-05, TS-API-10; module criteria §4.1
- [ ] **M06 Inventory** — 15 Phase 1 tasks in 1A.6, 1A.9, 1B.2; 32 endpoints — **Tasks:** T-1A.6-M06-01, T-1A.6-M06-02, T-1A.6-M06-03, T-1A.6-M06-04, T-1A.6-M06-05, T-1A.6-M06-06, T-1A.6-M06-07, T-1A.6-M06-08, T-1A.6-M06-09, T-1A.6-M06-10, T-1A.6-M06-11, T-1A.6-M06-12, T-1A.9-M06-01, T-1A.9-M06-02, T-1B.2-M06-01 · **Verify:** module regression TS-UNIT-05, TS-ERP-01…08, TS-DB-03/07, TS-SVC-01; module criteria §4.1
- [ ] **M07 Purchasing & receiving** — 10 Phase 1 tasks in 1A.7; 23 endpoints — **Tasks:** T-1A.7-M07-01, T-1A.7-M07-02, T-1A.7-M07-03, T-1A.7-M07-04, T-1A.7-M07-05, T-1A.7-M07-06, T-1A.7-M07-07, T-1A.7-M07-08, T-1A.7-M07-09, T-1A.7-M07-10 · **Verify:** module regression TS-ERP-04, TS-ERP-09, TS-INT-05; module criteria §4.1
- [ ] **M08 Customers & business accounts** — 14 Phase 1 tasks in 1A.8, 1A.9, 1A.12; 50 endpoints — **Tasks:** T-1A.8-M08-01, T-1A.8-M08-02, T-1A.8-M08-03, T-1A.8-M08-04, T-1A.8-M08-05, T-1A.8-M08-06, T-1A.8-M08-07, T-1A.8-M08-08, T-1A.8-M08-09, T-1A.8-M08-10, T-1A.8-M08-11, T-1A.8-M08-12, T-1A.9-M08-01, T-1A.12-M08-01 · **Verify:** module regression TS-ECOM-09/10, TS-ERP-17, TS-PERM-02, TS-DB-06; module criteria §4.1
- [ ] **M09 Storefront web application** — 27 Phase 1 tasks in 1A.3, 1A.8, 1A.9, 1A.10, 1A.11, 1A.12, 1A.13, 1A.15, 1A.17; 2 endpoints — **Tasks:** T-1A.3-M09-01, T-1A.3-M09-02, T-1A.3-M09-03, T-1A.3-M09-04, T-1A.3-M09-05, T-1A.3-M09-06, T-1A.8-M09-01, T-1A.8-M09-02, T-1A.8-M09-03, T-1A.9-M09-01, T-1A.9-M09-02, T-1A.9-M09-03, T-1A.9-M09-04, T-1A.9-M09-05, T-1A.9-M09-06, T-1A.9-M09-07, T-1A.9-M09-08, T-1A.9-M09-09, T-1A.9-M09-10, T-1A.9-M09-11, T-1A.10-M09-01, T-1A.11-M09-01, T-1A.12-M09-01, T-1A.13-M09-01, T-1A.15-M09-01, T-1A.17-M09-01, T-1A.9-M09-12 · **Verify:** module regression TS-FE-02/05/06, TS-ECOM-01…05, TS-PERF-01; module criteria §4.1
- [ ] **M10 Cart, checkout & orders** — 12 Phase 1 tasks in 1A.9, 1A.12, 1A.13, 1A.15; 26 endpoints — **Tasks:** T-1A.9-M10-01, T-1A.9-M10-02, T-1A.9-M10-03, T-1A.9-M10-04, T-1A.9-M10-05, T-1A.9-M10-06, T-1A.9-M10-07, T-1A.9-M10-08, T-1A.9-M10-09, T-1A.12-M10-01, T-1A.13-M10-01, T-1A.15-M10-01 · **Verify:** module regression TS-UNIT-04/06, TS-ECOM-04…07/11, TS-ERP-01, TS-ERR-01, TS-API-03; module criteria §4.1
- [ ] **M11 Payments, refunds & reconciliation** — 11 Phase 1 tasks in 1A.10, 1A.15; 22 endpoints — **Tasks:** T-1A.10-M11-01, T-1A.10-M11-02, T-1A.10-M11-03, T-1A.10-M11-04, T-1A.10-M11-05, T-1A.10-M11-06, T-1A.10-M11-07, T-1A.10-M11-08, T-1A.10-M11-09, T-1A.10-M11-10, T-1A.15-M11-01 · **Verify:** module regression TS-INT-01, TS-ERP-13/14, TS-ERR-01, TS-DB-03; module criteria §4.1
- [ ] **M12 Fulfilment & shipping** — 13 Phase 1 tasks in 1A.9, 1A.11; 21 endpoints — **Tasks:** T-1A.9-M12-01, T-1A.11-M12-01, T-1A.11-M12-02, T-1A.11-M12-03, T-1A.11-M12-04, T-1A.11-M12-05, T-1A.11-M12-06, T-1A.11-M12-07, T-1A.11-M12-08, T-1A.11-M12-09, T-1A.11-M12-10, T-1A.11-M12-11, T-1A.11-M12-12 · **Verify:** module regression TS-UNIT-09, TS-ERP-10/11, TS-INT-02; module criteria §4.1
- [ ] **M13 Returns, RMA & warranty** — 9 Phase 1 tasks in 1A.12; 18 endpoints — **Tasks:** T-1A.12-M13-01, T-1A.12-M13-02, T-1A.12-M13-03, T-1A.12-M13-04, T-1A.12-M13-05, T-1A.12-M13-06, T-1A.12-M13-07, T-1A.12-M13-08, T-1A.12-M13-09 · **Verify:** module regression TS-UNIT-08, TS-ERP-12, TS-ECOM-08, TS-E2E-09; module criteria §4.1
- [ ] **M14 Vendor portal & vendor management** — 21 Phase 1 tasks in 1B.1, 1B.2, 1B.4, 1B.5; 69 endpoints — **Tasks:** T-1B.1-M14-01, T-1B.1-M14-02, T-1B.1-M14-03, T-1B.1-M14-04, T-1B.1-M14-05, T-1B.1-M14-06, T-1B.1-M14-07, T-1B.1-M14-08, T-1B.1-M14-09, T-1B.1-M14-10, T-1B.1-M14-11, T-1B.1-M14-12, T-1B.1-M14-13, T-1B.1-M14-14, T-1B.1-M14-15, T-1B.2-M14-01, T-1B.2-M14-02, T-1B.4-M14-01, T-1B.5-M14-01, T-1B.1-M14-16, T-1B.1-M14-17 · **Verify:** module regression TS-VEN-01…11, TS-PERM-02/03/04; module criteria §4.1
- [ ] **M16 Support & WhatsApp** — 11 Phase 1 tasks in 1A.13, 1B.3; 20 endpoints — **Tasks:** T-1A.13-M16-01, T-1A.13-M16-02, T-1A.13-M16-03, T-1A.13-M16-04, T-1A.13-M16-05, T-1B.3-M16-01, T-1B.3-M16-02, T-1B.3-M16-03, T-1B.3-M16-04, T-1B.3-M16-05, T-1B.3-M16-06 · **Verify:** module regression TS-ECOM-12, TS-ERP-18, TS-INT-03, TS-PERM-06; module criteria §4.1
- [ ] **M17 Automation, exceptions, approvals & delegation** — 20 Phase 1 tasks in 1A.1, 1A.2, 1A.14, 1B.4, 1B.5; 26 endpoints — **Tasks:** T-1A.1-M17-01, T-1A.2-M17-01, T-1A.2-M17-02, T-1A.14-M17-01, T-1A.14-M17-02, T-1A.14-M17-03, T-1A.14-M17-04, T-1A.14-M17-05, T-1A.14-M17-06, T-1A.14-M17-07, T-1A.14-M17-08, T-1A.14-M17-09, T-1A.14-M17-10, T-1A.14-M17-11, T-1A.14-M17-12, T-1B.4-M17-01, T-1B.4-M17-02, T-1B.4-M17-03, T-1B.4-M17-04, T-1B.5-M17-01 · **Verify:** module regression TS-UNIT-10, TS-SVC-02/06/07/11, TS-PERM-07/08/09/13/14, TS-ADM-03/04/10/11; module criteria §4.1
- [ ] **M18 Reporting & exports** — 9 Phase 1 tasks in 1A.14, 1A.15; 19 endpoints — **Tasks:** T-1A.14-M18-01, T-1A.15-M18-01, T-1A.15-M18-02, T-1A.15-M18-03, T-1A.15-M18-04, T-1A.15-M18-05, T-1A.15-M18-06, T-1A.15-M18-07, T-1A.15-M18-08 · **Verify:** module regression TS-UNIT-11, TS-SVC-10, TS-ERP-19, TS-PERF-05, TS-SEC-10, TS-ADM-15; module criteria §4.1
- [ ] **M19 Finance boundary & accounting export** — 3 Phase 1 tasks in 1A.11, 1A.15; 12 endpoints — **Tasks:** T-1A.11-M19-01, T-1A.15-M19-01, T-1A.15-M19-02 · **Verify:** module regression TS-INT-05, TS-ERP-14, TS-DB-02, TS-ADM-14; module criteria §4.1
- [ ] **M20 Notifications** — 6 Phase 1 tasks in 1A.13, 1B.3; 9 endpoints — **Tasks:** T-1A.13-M20-01, T-1A.13-M20-02, T-1A.13-M20-03, T-1A.13-M20-04, T-1A.13-M20-05, T-1B.3-M20-01 · **Verify:** module regression TS-SVC-05, TS-ECOM-15, TS-INT-04; module criteria §4.1
- [ ] **M21 Search** — 1 Phase 1 task in 1A.4; 4 endpoints — **Tasks:** T-1A.4-M21-01 · **Verify:** module regression TS-ECOM-01, TS-SVC-09, TS-PERF-06, TS-PERM-05; module criteria §4.1
- [ ] **M22 Files & media** — 3 Phase 1 tasks in 1A.4, 1B.2; 4 endpoints — **Tasks:** T-1A.4-M22-01, T-1A.4-M22-02, T-1B.2-M22-01 · **Verify:** module regression TS-SVC-08, TS-SEC-03/04; module criteria §4.1
- [ ] **M23 Integrations & adapters** — 8 Phase 1 tasks in 1A.2, 1A.6, 1A.10, 1A.11, 1B.2, 1B.3, 1B.4; 1 endpoints — **Tasks:** T-1A.2-M23-01, T-1A.2-M23-02, T-1A.6-M23-01, T-1A.10-M23-01, T-1A.11-M23-01, T-1B.2-M23-01, T-1B.3-M23-01, T-1B.4-M23-01 · **Verify:** module regression TS-INT-01…10 (touched adapter); module criteria §4.1
- [ ] **M24 Administration & settings** — 11 Phase 1 tasks in 1A.2, 1A.3, 1A.16; 14 endpoints — **Tasks:** T-1A.2-M24-01, T-1A.2-M24-02, T-1A.3-M24-01, T-1A.3-M24-02, T-1A.16-M24-01, T-1A.16-M24-02, T-1A.16-M24-03, T-1A.16-M24-04, T-1A.16-M24-05, T-1A.16-M24-06, T-1A.16-M24-07 · **Verify:** module regression TS-SVC-04, TS-ADM-07/12/13; module criteria §4.1
- [ ] **M25 Data migration & cutover** — 11 Phase 1 tasks in 1A.4, 1A.6, 1A.7, 1A.8, 1A.17, 1B.5; 0 endpoints — **Tasks:** T-1A.4-M25-01, T-1A.6-M25-01, T-1A.7-M25-01, T-1A.8-M25-01, T-1A.17-M25-01, T-1A.17-M25-02, T-1A.17-M25-03, T-1A.17-M25-04, T-1A.17-M25-05, T-1A.17-M25-06, T-1B.5-M25-01 · **Verify:** module regression TS-MIG-01…08; module criteria §4.1
- [ ] **M26 Security, observability, backup & operations** — 12 Phase 1 tasks in 1A.1, 1A.16, 1A.17, 1B.5; 0 endpoints — **Tasks:** T-1A.1-M26-01, T-1A.1-M26-02, T-1A.16-M26-01, T-1A.16-M26-02, T-1A.17-M26-01, T-1A.17-M26-02, T-1A.17-M26-03, T-1A.17-M26-04, T-1A.17-M26-05, T-1A.17-M26-06, T-1A.17-M26-07, T-1B.5-M26-01 · **Verify:** module regression TS-BKP-01…04, TS-PERF-07, TS-SEC-05…09; module criteria §4.1
- [ ] **M27 SEO & discoverability** — 3 Phase 1 tasks in 1A.4, 1A.9, 1A.17; 2 endpoints — **Tasks:** T-1A.4-M27-01, T-1A.9-M27-01, T-1A.17-M27-01 · **Verify:** module regression TS-ECOM-13, TS-MIG-05; module criteria §4.1

---

## 3. Frontend

Screen IDs `00` §8; tabs, modals (`m-…`) and drawers (`d-…`) from the mockup and `04a`/`04b`/`04c`. Every screen item is
verified by the states rule of `16` §15.2 D4 (loading, empty, error, desktop/laptop viewport, accessibility) in addition to
the tests named. P-E items are decided per screen by D-004: a screen decided *native* is ticked with its tasks
`NOT_APPLICABLE` and the native configuration evidenced in `backend/` (`00` §11).

### 3.1 Design system, application scaffolds and shells

- [ ] Repository and `frontend/` folders per `00` §11 (design-system, storefront, workspace, vendor-portal); publication scope handled — **Tasks:** T-1A.1-M01-01 · **Decisions:** D-115, D-211 · **Verify:** folder tree exists; TS-SEC-05 (no secrets in repository or published site)
- [ ] Design tokens and foundations (colour, type, spacing, radius, elevation, font hosting, icon set, packaging for three apps) — **Tasks:** T-1A.3-M09-01 · **Decisions:** D-049, D-103 · **Verify:** token package consumed by all apps; UI sign-off record
- [ ] Component inventory with loading/empty/error states, keyboard and focus behaviour, non-colour status indicators, charts — **Tasks:** T-1A.3-M09-02 · **Decisions:** D-051 · **Verify:** TS-FE-01, TS-A11Y-02 (components)
- [ ] Storefront application scaffolding (framework, rendering classes, data-access rules, buyer context, global states, route scheme, API client with error-code mapping) — **Tasks:** T-1A.3-M09-03 · **Decisions:** D-003, D-050, D-163 · **Verify:** TS-FE-06; route map (D-163) and cache policy (D-105) recorded in `frontend/storefront/`
- [ ] Store shell: header, category bar, mega menu, footer, user menu and sign-out, compare tray and PIN-modal placeholders — **Tasks:** T-1A.3-M09-04, T-1A.9-M09-05 · **Verify:** TS-FE-02, TS-FE-05
- [ ] Store shell: help/chat widget (guided help, handoff) — **Tasks:** T-1A.13-M09-01 · **Verify:** TS-ECOM-12, T23 (web)
- [ ] Store shell: PIN / delivery-location modal wired to serviceability — **Tasks:** T-1A.9-M12-01 · **Decisions:** D-013, D-162 · **Verify:** TS-ECOM-05
- [ ] Workspace application scaffolding with the D-004 screen register (custom vs native per P-E screen), permission-aware rendering, shared list/queue patterns — **Tasks:** T-1A.3-M01-01 · **Decisions:** D-101, D-004 · **Verify:** TS-FE-03; D-004 register committed in `frontend/workspace/`
- [ ] Workspace shell: permission-filtered sidebar, top bar, location switcher, global search box, 'New' menu, user menu, workspace context — **Tasks:** T-1A.3-M24-01, T-1A.4-M21-01 · **Decisions:** D-170 · **Verify:** TS-ADM-15, TS-PERM-11, TS-FE-05
- [ ] Responsive layouts for tablets and phones — storefront (04a §2.5, D-223) and ERP workspace / vendor portal (04b §2.24, 04c X16, D-226); desktop unchanged `(C)` — **Tasks:** T-1A.9-M09-12, T-1A.16-M24-07, T-1B.1-M14-17 · **Decisions:** D-223, D-226, D-206 · **Verify:** device-matrix checks (no page overflow, all states usable), desktop visual regression
- [ ] Contextual help and guided workflow (04b §2.21, 04c X20): ⓘ help, help panel with page guide, glossary and search; How it works strips, tab intros, next-step boxes on P-E02/03/04/06/07/08/09/12; help content for every P-E and P-V screen — **Tasks:** T-1A.3-M24-02, T-1A.16-M24-06, T-1B.1-M14-16 · **Decisions:** D-224, D-225 · **Verify:** TS-A11Y-02, TS-FE-01, content check (no missing keys/links, all tabs and status values explained)
- [ ] Workspace shell: notification bell and own notification preferences — **Tasks:** T-1A.13-M20-03 · **Decisions:** D-146 · **Verify:** TS-SVC-05
- [ ] Workspace shell: 'Delegation while away' indicator — **Tasks:** T-1A.14-M17-08 · **Verify:** TS-ADM-04, T31
- [ ] Shell completion: sidebar queue counts, staff help, 'My profile' (staff and vendor users), system-health card — **Tasks:** T-1A.16-M24-01, T-1A.16-M24-03 · **Decisions:** D-172, D-174 · **Verify:** TS-ADM-15, TS-ADM-08
- [ ] Vendor-portal application scaffolding and vendor shell — **Tasks:** T-1B.1-M14-02 · **Decisions:** D-101, D-200 · **Verify:** TS-FE-04

### 3.2 Storefront screens (P-S01–P-S15)

- [ ] P-S01 Home — fixed modules and category tiles (API-M09-01) — **Tasks:** T-1A.9-M09-02 · **Verify:** TS-FE-02, TS-ECOM-01; private data never in shared cache (T22)
- [ ] P-S01 — curated collections, deals and banners with editors `(C)` — **Tasks:** T-1A.9-M09-03 · **Decisions:** D-142, D-043 · **Verify:** TS-ECOM-14 when disabled
- [ ] P-S01–P-S07 — discovery rails and device-held browsing history `(C)` — **Tasks:** T-1A.9-M09-10 · **Decisions:** D-164 · **Verify:** TS-ECOM-14
- [ ] P-S01–P-S07 — reference price (MRP) and discount display in the price block `(C)` — **Tasks:** T-1A.9-M09-11 · **Decisions:** D-166 · **Verify:** TS-ECOM-14
- [ ] P-S02 Category & search results — filters, sort, cards, buyer-context prices, availability, no-result state — **Tasks:** T-1A.4-M21-01, T-1A.5-M04-01, T-1A.6-M06-03, T-1A.9-M09-05 · **Verify:** T01, T36, TS-ECOM-01, TS-PERF-06
- [ ] P-S03 Product detail — offers by condition, #description, #specs, #inspection (unit inspection report), #warranty, policies, delivery line — **Tasks:** T-1A.6-M06-05, T-1A.9-M09-06 · **Verify:** T01, T22, T33, TS-ECOM-02
- [ ] P-S03 #qa — product Q&A with staff answers `(C)` — **Tasks:** T-1A.9-M04-01 · **Decisions:** D-065 · **Verify:** TS-ECOM-14
- [ ] P-S03 #reviews — reviews and ratings with moderation `(C)` — **Tasks:** T-1A.12-M04-01 · **Decisions:** D-041 · **Verify:** TS-ECOM-14
- [ ] P-S03 — compatible items `(C)` — **Tasks:** T-1A.4-M04-07 · **Decisions:** D-071 · **Verify:** TS-ECOM-14
- [ ] P-S03 — bundles with component stock `(C)` — **Tasks:** T-1A.6-M04-01 · **Decisions:** D-072 · **Verify:** TS-ECOM-14
- [ ] P-S03 — store pickup / availability by branch `(C)` — **Tasks:** T-1A.11-M12-08 · **Decisions:** D-061, D-029 · **Verify:** TS-ECOM-14
- [ ] P-S04 Certified refurbished landing — **Tasks:** T-1A.9-M09-06 · **Verify:** TS-ECOM-02, T01
- [ ] P-S05 Compare products, compare tray, P-S09 #wishlist `(C)` — **Tasks:** T-1A.9-M09-09 · **Decisions:** D-042 · **Verify:** TS-ECOM-14
- [ ] P-S06 Cart — lines, quantity, save for later, revalidated price/stock notices, guest-cart merge — **Tasks:** T-1A.9-M10-02, T-1A.9-M09-07 · **Decisions:** D-129 · **Verify:** TS-ECOM-04, T03
- [ ] P-S07 Checkout — address, delivery, review, place pending order — **Tasks:** T-1A.9-M10-03, T-1A.9-M09-07 · **Verify:** T04, T10, TS-ECOM-05, TS-FE-08
- [ ] P-S07 Checkout — payment step (hosted collection) — **Tasks:** T-1A.10-M11-01 · **Decisions:** D-012 · **Verify:** T06, TS-E2E-06
- [ ] P-S07 — cash on delivery option `(C)` — **Tasks:** T-1A.10-M11-08 · **Decisions:** D-020 · **Verify:** TS-ECOM-14
- [ ] P-S07 — EMI plans, bank/UPI offer cards, saved payment methods `(C)` — **Tasks:** T-1A.10-M09-01 · **Decisions:** D-062, D-184 · **Verify:** TS-ECOM-14
- [ ] P-S07/P-S08/P-S09 — guest checkout, guest order access, linking guest/branch orders `(C)` — **Tasks:** T-1A.9-M10-06 · **Decisions:** D-021, D-168 · **Verify:** TS-E2E-11, TS-AUTH-07
- [ ] P-S07 — dealer order approvals inside a business account `(C)` — **Tasks:** T-1A.9-M08-01 · **Decisions:** D-066 · **Verify:** TS-ECOM-10
- [ ] P-S08 Order confirmation & tracking — order states, cancellation — **Tasks:** T-1A.9-M09-08 · **Decisions:** D-165 · **Verify:** TS-ECOM-06, T34
- [ ] P-S08 — payment status and retry — **Tasks:** T-1A.10-M11-01 · **Verify:** TS-ECOM-06
- [ ] P-S08 — shipment tracking and invoice download — **Tasks:** T-1A.11-M09-01 · **Verify:** TS-ECOM-06
- [ ] P-S08 — delivery OTP handover for high-value deliveries `(C)` — **Tasks:** T-1A.11-M12-09 · **Decisions:** D-183 · **Verify:** TS-ECOM-14
- [ ] P-S09 My account — guest view, #overview, #addresses, #profile (security, sessions), #privacy (consents, data requests) — **Tasks:** T-1A.8-M09-02 · **Verify:** TS-ECOM-09, T25 (consent)
- [ ] P-S09 #orders with cancellation — **Tasks:** T-1A.9-M09-08 · **Verify:** TS-ECOM-06
- [ ] P-S09 #invoices — **Tasks:** T-1A.11-M09-01 · **Verify:** TS-ECOM-06
- [ ] P-S09 #returns — **Tasks:** T-1A.12-M09-01 · **Verify:** TS-ECOM-08
- [ ] P-S09 #devices (registered devices) `(C)` — **Tasks:** T-1A.12-M08-01 · **Decisions:** D-133 · **Verify:** TS-ECOM-14
- [ ] P-S09 / P-S02 / P-S03 — engagement extras (back-in-stock, price-drop, saved-search alerts, newsletter) `(C)` — **Tasks:** T-1A.13-M20-05 · **Decisions:** D-141 · **Verify:** TS-ECOM-14, TS-ECOM-15
- [ ] P-S10 Return / warranty request — #new, #requests — **Tasks:** T-1A.12-M09-01 · **Decisions:** D-165 · **Verify:** TS-ECOM-08, T17
- [ ] P-S10 — withdraw, appeal, arrange collection `(C)` — **Tasks:** T-1A.12-M13-07 · **Decisions:** D-169 · **Verify:** TS-ECOM-08
- [ ] P-S11 Dealer zone — #overview, #team, account status, #pricelist — **Tasks:** T-1A.8-M09-03 · **Verify:** T02, TS-ECOM-10, TS-PERM-05
- [ ] P-S11 #quotes and #bulk manual entry (quick order) `(C)` — **Tasks:** T-1A.9-M05-03 · **Decisions:** D-121 · **Verify:** TS-ECOM-03, TS-E2E-02
- [ ] P-S11 #bulk CSV upload `(C)` — **Tasks:** T-1B.2-M05-01 · **Decisions:** D-121 · **Verify:** TS-ECOM-03
- [ ] P-S11 #reorder — **Tasks:** T-1A.9-M09-08 · **Verify:** TS-ECOM-06
- [ ] P-S11 #invoices (financial-year ZIP, statement of account, GST reconciliation export) — **Tasks:** T-1A.15-M19-02 · **Verify:** TS-ECOM-06, TS-SEC-10
- [ ] P-S12 #signin — **Tasks:** T-1A.3-M09-05 · **Decisions:** D-040 · **Verify:** TS-AUTH-01, T30 (sign-in)
- [ ] P-S12 #register and #dealer (dealer application) — **Tasks:** T-1A.8-M09-01 · **Verify:** TS-AUTH-06, TS-ECOM-10
- [ ] P-S12 #vendor (vendor application) — **Tasks:** T-1B.1-M14-03 · **Decisions:** D-047, D-068 · **Verify:** TS-VEN-01
- [ ] P-S13 Help centre & policies incl. contact info and support hours — **Tasks:** T-1A.13-M09-01 · **Decisions:** D-037 · **Verify:** TS-ECOM-12
- [ ] Storefront WhatsApp click-to-chat entry points (Level 1) — **Tasks:** T-1A.13-M16-03 · **Decisions:** D-014 · **Verify:** TS-ECOM-12
- [ ] Storefront WhatsApp Level 2 entry points and basket checkout-link landing — **Tasks:** T-1B.3-M16-02 · **Decisions:** D-014, D-151 · **Verify:** TS-ECOM-11, TS-E2E-05
- [ ] P-S14 Account-access landings — password-reset completion, invitation acceptance `(C)` — **Tasks:** T-1A.3-M09-05 · **Decisions:** D-040, D-066 · **Verify:** TS-AUTH-05, TS-AUTH-06
- [ ] P-S15 Not-found / unavailable / error pages and wiring for unavailable products and old URLs — **Tasks:** T-1A.3-M09-04, T-1A.9-M27-01, T-1A.17-M27-01 · **Decisions:** D-076 · **Verify:** T32, TS-ECOM-13, TS-MIG-05

### 3.3 ERP workspace screens (P-E01–P-E16)

- [ ] P-E01 Owner control centre (+ m-digest) — needs attention, approvals, pipeline, health, automation panel, KPI tiles — **Tasks:** T-1A.14-M17-09, T-1A.14-M18-01, T-1A.14-M17-11 · **Decisions:** D-004, D-190, D-063 · **Verify:** T31, TS-ADM-10, TS-E2E-07
- [ ] P-E02 Orders — saved-view-ready table, filters, bulk actions, d-order (#od-lines, #od-time), m-hold, m-cancel, deep links — **Tasks:** T-1A.9-M10-08 · **Decisions:** D-004 · **Verify:** TS-FE-03, TS-ERP-01
- [ ] P-E02 — d-order payment panel (#od-pay) and send-payment-link action — **Tasks:** T-1A.10-M11-09 · **Decisions:** D-004 · **Verify:** TS-ERP-13
- [ ] P-E02 — d-order fulfilment and invoice panels (#od-ship), release-to-fulfilment action — **Tasks:** T-1A.11-M09-01 · **Verify:** TS-ERP-10
- [ ] P-E02 — m-assisted (assisted orders and secure checkout links) — **Tasks:** T-1A.13-M10-01 · **Decisions:** D-151, D-004 · **Verify:** TS-ECOM-11, T05
- [ ] P-E02 — internal order notes with mentions (#od-notes) `(C)` — **Tasks:** T-1A.9-M10-07 · **Decisions:** D-134 · **Verify:** TS-ECOM-14
- [ ] P-E03 Pick · pack · dispatch — #topick, #picking (scan station), #topack, #ready, #dispatched, #exceptions, m-manual — **Tasks:** T-1A.11-M12-11 · **Decisions:** D-004 · **Verify:** T20, TS-ERP-10/11
- [ ] P-E03 — pick waves and handover manifests `(C)` — **Tasks:** T-1A.11-M12-07 · **Decisions:** D-132 · **Verify:** TS-ECOM-14
- [ ] P-E03 — warehouse and counter devices (printers, scale, bench camera) `(C)` — **Tasks:** T-1A.11-M12-10 · **Decisions:** D-147 · **Verify:** TS-ECOM-14
- [ ] P-E04 Returns, RMA & warranty — #rma (+ d-rma: #rd-case, #rd-insp, #rd-dec, #rd-wty, #rd-time), #refunds, #warranty, #supplier, #quarantine — **Tasks:** T-1A.12-M13-08 · **Decisions:** D-004 · **Verify:** T17, TS-ERP-12
- [ ] P-E05 Support inbox (web channel) — #inbox, #tickets, #library, m-ticket — **Tasks:** T-1A.13-M16-04 · **Decisions:** D-004 · **Verify:** T23 (web), TS-ERP-18
- [ ] P-E05 — WhatsApp channel features in #inbox — **Tasks:** T-1B.3-M16-01 · **Decisions:** D-074, D-004 · **Verify:** T24, TS-ERP-18
- [ ] P-E05 — m-basket (WhatsApp draft basket) — **Tasks:** T-1B.3-M16-02 · **Decisions:** D-151, D-014 · **Verify:** TS-ECOM-11, TS-E2E-05
- [ ] P-E06 Catalog — #products, #editor, d-prod, m-vdiff, m-changes, m-url, staff draft discard — **Tasks:** T-1A.4-M04-08 · **Decisions:** D-004 · **Verify:** TS-ERP-15, T33
- [ ] P-E06 — #templates (+ m-newcat) and #review — **Tasks:** T-1A.4-M04-09 · **Decisions:** D-004 · **Verify:** T36, TS-ERP-15
- [ ] P-E06 #review — vendor items — **Tasks:** T-1B.1-M14-07 · **Decisions:** D-004 · **Verify:** T12, T13
- [ ] P-E06 #import (+ m-import-new) — **Tasks:** T-1B.2-M04-01 · **Decisions:** D-004, D-057 · **Verify:** T26, TS-ERP-15
- [ ] P-E07 Pricing — #lists (+ d-list, m-newlist), #tiers, #simulator, #controls, #rules, #approvals (+ m-decide), #audit — **Tasks:** T-1A.5-M05-08 · **Decisions:** D-004 · **Verify:** TS-ERP-16
- [ ] P-E07 #promotions (promotions, stacking, coupon codes) `(C)` — **Tasks:** T-1A.5-M05-04 · **Decisions:** D-043 · **Verify:** TS-ECOM-14
- [ ] P-E07 — location-based price lists `(C)` — **Tasks:** T-1A.5-M05-06 · **Decisions:** D-044 · **Verify:** TS-ECOM-14
- [ ] P-E08 Inventory — #stock, #serials, #movements, #transfers (+ m-transfer), #counts — **Tasks:** T-1A.6-M06-11 · **Decisions:** D-004 · **Verify:** T16, TS-ERP-02/03/05/06
- [ ] P-E08 m-reveal (manufacturer serials) and P-E10 reveal with reason — **Tasks:** T-1A.8-M02-01 · **Decisions:** D-153, D-130 · **Verify:** TS-PERM-10
- [ ] P-E08 #reservations — **Tasks:** T-1A.9-M06-02 · **Decisions:** D-004 · **Verify:** TS-ERP-07
- [ ] P-E08 #supplier and P-E11 #freshness — **Tasks:** T-1B.2-M06-01 · **Decisions:** D-028, D-004 · **Verify:** T14, TS-ERP-08
- [ ] P-E09 Purchasing — #suggestions, #orders (+ d-po), #new-po, #suppliers — **Tasks:** T-1A.7-M07-08 · **Decisions:** D-004 · **Verify:** TS-ERP-09
- [ ] P-E09 — #receive (GRN scan screen) and #bills — **Tasks:** T-1A.7-M07-09 · **Decisions:** D-004 · **Verify:** T15, TS-ERP-04
- [ ] P-E10 Customers & dealers — #all (+ d-360), #business (+ m-suspend, m-invite), #applications, #privacy — **Tasks:** T-1A.8-M08-11 · **Decisions:** D-004 · **Verify:** TS-ERP-17
- [ ] P-E10 #duplicates (+ m-merge) `(C)` — **Tasks:** T-1A.12-M08-01 · **Decisions:** D-133 · **Verify:** TS-ECOM-14
- [ ] P-E10 — customer tags and consented bulk templated messages `(C)` — **Tasks:** T-1A.8-M08-09 · **Decisions:** D-145 · **Verify:** TS-ECOM-14
- [ ] P-E10 — staff 'view as dealer' preview `(C)` — **Tasks:** T-1A.8-M08-10 · **Decisions:** D-149 · **Verify:** TS-ECOM-14
- [ ] P-E11 Vendors — #list (+ d-vendor), #applications, m-invite, m-policy — **Tasks:** T-1B.1-M14-03 · **Decisions:** D-004 · **Verify:** TS-VEN-01
- [ ] P-E11 #submissions (+ m-vsdec) — **Tasks:** T-1B.1-M14-07 · **Decisions:** D-004 · **Verify:** T12, TS-VEN-02
- [ ] P-E11 #performance — **Tasks:** T-1B.1-M14-13 · **Decisions:** D-187, D-004 · **Verify:** TS-VEN-11
- [ ] P-E11 — vendor suspension and reinstatement — **Tasks:** T-1B.1-M14-08 · **Decisions:** D-189 · **Verify:** TS-VEN-10
- [ ] P-E12 Payments — #payments (+ d-pay), #events, #refunds (+ m-retry) — **Tasks:** T-1A.10-M11-09 · **Decisions:** D-004 · **Verify:** T07, T08, T19, TS-ERP-13
- [ ] P-E12 #recon (+ m-import) `(C)` — **Tasks:** T-1A.10-M11-07 · **Decisions:** D-064 · **Verify:** TS-INT-09
- [ ] P-E12 #cod `(C)` — **Tasks:** T-1A.10-M11-08 · **Decisions:** D-020 · **Verify:** TS-INT-09
- [ ] P-E12 #export (accounting export, GST series) — **Tasks:** T-1A.15-M19-01 · **Decisions:** D-011, D-004 · **Verify:** T27, TS-INT-05
- [ ] P-E12 #close (daily close) — **Tasks:** T-1A.15-M11-01 · **Decisions:** D-004 · **Verify:** T27, TS-ERP-14
- [ ] P-E13 Reports — catalogue, viewer, m-export, #schedules (+ m-schedule, m-digest), #exports — **Tasks:** T-1A.15-M18-07 · **Decisions:** D-004 · **Verify:** T27, T35, TS-ERP-19
- [ ] P-E13 m-request and change register — **Tasks:** T-1A.16-M24-02 · **Decisions:** D-191 · **Verify:** TS-ADM-13
- [ ] P-E02–P-E13 KPI strips `(C)` — **Tasks:** T-1A.15-M18-06 · **Decisions:** D-173 · **Verify:** TS-ERP-19
- [ ] Saved views / work queues on P-E list screens — **Tasks:** T-1A.15-M18-05 · **Verify:** TS-FE-03
- [ ] P-E14 Automation — #rules (+ d-rule: #rd-def, #rd-runs, #rd-hist; m-kill, m-resume), #runs, #exceptions, m-pauseall, m-propose — **Tasks:** T-1A.14-M17-10 · **Decisions:** D-004 · **Verify:** T21, TS-ADM-11
- [ ] P-E14 #approvals (+ m-approve) — generic approval queue `(C)` — **Tasks:** T-1A.14-M17-06 · **Decisions:** D-192, D-179 · **Verify:** TS-PERM-08/09, TS-UNIT-10
- [ ] P-E14 — 1B approval-queue extensions — **Tasks:** T-1B.4-M17-01 · **Decisions:** D-192 · **Verify:** TS-PERM-14, TS-ADM-10
- [ ] P-E15 Settings — #users (+ m-invite, access reviews), #roles, #audit (+ d-audit) — **Tasks:** T-1A.3-M02-02 · **Decisions:** D-004 · **Verify:** TS-ADM-01/02/05/09
- [ ] P-E15 #locations — **Tasks:** T-1A.3-M03-01 · **Decisions:** D-004 · **Verify:** TS-ADM-06
- [ ] P-E15 #thresholds (+ m-thr) — **Tasks:** T-1A.14-M17-07 · **Decisions:** D-024, D-004 · **Verify:** TS-ADM-03, TS-PERM-09
- [ ] P-E15 #delegation (+ m-ea) — **Tasks:** T-1A.14-M17-08 · **Decisions:** D-025, D-004 · **Verify:** TS-ADM-04, TS-PERM-07/13, T31
- [ ] P-E15 #integrations, #system, operational settings and feature flags — **Tasks:** T-1A.16-M24-01 · **Decisions:** D-004 · **Verify:** TS-ADM-07/08/12, TS-SVC-04
- [ ] P-E03/P-E06/P-E07/P-E08/P-E09/P-E15 MOCKUP-ONLY controls and explanatory panels (build / defer / drop per item) `(C)` — **Tasks:** T-1A.16-M24-04 · **Decisions:** D-177, D-171 · **Verify:** decision per item recorded
- [ ] P-E16 Staff sign-in, MFA challenge/enrolment, password reset, invitation acceptance — **Tasks:** T-1A.3-M02-01 · **Decisions:** D-004, D-040 · **Verify:** TS-AUTH-01/02/05, T30 (sign-in)

### 3.4 Vendor portal screens (P-V01–P-V05)

- [ ] P-V05 Vendor sign-in, invitation acceptance and security (MFA) — **Tasks:** T-1B.1-M14-02 · **Decisions:** D-040, D-047 · **Verify:** TS-AUTH-01/02/06
- [ ] P-V01 Vendor dashboard, action items, two-way messaging — **Tasks:** T-1B.1-M14-12 · **Verify:** TS-FE-04
- [ ] P-V01 scorecard — **Tasks:** T-1B.1-M14-13 · **Decisions:** D-187 · **Verify:** TS-VEN-11
- [ ] P-V01 vendor announcements and policy updates `(C)` — **Tasks:** T-1B.1-M14-14 · **Decisions:** D-142 · **Verify:** TS-ECOM-14
- [ ] P-V02 Products & submissions — #listings (+ d-listing), #submissions (+ d-sub), #new — **Tasks:** T-1B.1-M14-06 · **Decisions:** D-081 · **Verify:** T12, T13, TS-VEN-02
- [ ] P-V02 #bulk — **Tasks:** T-1B.2-M14-02 · **Verify:** T26, TS-VEN-03
- [ ] P-V03 #pos (+ d-po) and #returns (+ d-rtv) — **Tasks:** T-1B.1-M14-09 · **Verify:** TS-VEN-06, TS-VEN-08, T11
- [ ] P-V03 m-asn, m-reject — supplier PO confirmation/rejection and advance shipping notices with serials `(C)` — **Tasks:** T-1B.1-M14-10 · **Decisions:** D-131 · **Verify:** TS-VEN-06
- [ ] P-V03 #feed (+ m-api, m-csv, m-form, m-rotate) — **Tasks:** T-1B.2-M14-01 · **Decisions:** D-083, D-202 · **Verify:** T14, TS-VEN-04
- [ ] P-V03 #tasks — supplier-fulfilment pilot (+ m-decline, m-evidence) `(C)` — **Tasks:** T-1B.4-M14-01 · **Decisions:** D-007, D-008, D-181 · **Verify:** TS-VEN-07
- [ ] P-V04 #users (+ m-invite) — **Tasks:** T-1B.1-M14-04 · **Decisions:** D-137 · **Verify:** T11, TS-VEN-05
- [ ] P-V04 #profile (+ m-req change request), #documents, #terms (+ m-terms), #bank (payout-account change, maker-checker) — **Tasks:** T-1B.1-M14-05 · **Decisions:** D-068, D-188 · **Verify:** TS-VEN-09
- [ ] P-V04 #statements — **Tasks:** T-1B.1-M14-11 · **Decisions:** D-011 · **Verify:** TS-VEN-09

### 3.5 Cross-cutting UI verification

- [ ] Every screen renders the user-facing states of BP §6.3 and every API error code (`06` §1.7) accurately — **Tasks:** T-1A.3-M09-06, T-1A.9-M10-09, T-1A.17-M09-01 · **Verify:** TS-FE-02, TS-FE-06, TS-ERR-04
- [ ] Disabled CONDITIONAL / MOCKUP-ONLY features hidden; APIs answer `FEATURE_DISABLED` — **Tasks:** T-1A.9-M10-09, T-1A.16-M24-05 · **Verify:** TS-ECOM-14
- [ ] Buyer-context and permission rendering (guest / consumer / dealer / staff scopes); no private price after sign-out — **Tasks:** T-1A.9-M09-04, T-1A.9-M10-09 · **Verify:** TS-FE-05, T22, TS-API-07
- [ ] Double-submit and retry UX with one idempotency key per user intent — **Tasks:** T-1A.9-M09-07, T-1A.10-M11-01 · **Verify:** TS-FE-08, T06
- [ ] Browser matrix and accessibility acceptance of key flows (keyboard, screen reader) — **Tasks:** T-1A.17-M09-01 · **Decisions:** D-206, D-051 · **Verify:** TS-FE-07, TS-A11Y-01…03, T30

---

## 4. Backend

### 4.1 Module completion criteria (`05` §5; `10` §x.10; `11` §15)

- [ ] **M01 Platform foundation** — Staging and production reproducible from `infra/`; CI green on main; deploy and restore proof documented (WP05); feature-flag mechanism usable by M11/M12/M16 (`05` §5.1) — **Tasks:** T-1A.1-M01-06, T-1A.1-M01-07, T-1A.1-M26-02, T-1A.1-M01-10, T-1A.2-M24-01 · **Decisions:** D-001, D-002, D-005, D-077 · **Verify:** TS-SVC-02, TS-SEC-05, TS-BKP-01, TS-ADM-12
- [ ] **M02 Identity, access & audit** — Every API endpoint passes AccessPolicy (automated route-inventory check); privileged accounts cannot operate without MFA; audit events for all privileged actions (`05` §5.2) — **Tasks:** T-1A.2-M02-02, T-1A.2-M02-03, T-1A.2-M02-06, T-1A.2-M02-09, T-1A.16-M24-05 · **Decisions:** D-040, D-083, D-200, D-222 · **Verify:** TS-PERM-01, TS-AUTH-02, TS-SVC-03, T11, T22
- [ ] **M03 Organisation & locations** — Confirmed legal entities, branches, warehouses and bins seeded; every stock record references a valid location/bin (`05` §5.3) — **Tasks:** T-1A.2-M03-01, T-1A.2-M03-02, T-1A.6-M03-01 · **Decisions:** D-010 · **Verify:** TS-ADM-06, TS-DB-02
- [ ] **M04 Catalog** — Representative products import correctly (WP06); T36 without code change; pending versions never alter live data (T13); every publication, suspension and archive audited; nothing purchasable without passing publication checks (`05` §5.4; `10` §3.10) — **Tasks:** T-1A.4-M04-04, T-1A.4-M04-05, T-1A.4-M25-01, T-1A.4-M04-10, T-1A.9-M10-09, T-1B.1-M14-07 · **Decisions:** D-081, D-125, D-127 · **Verify:** T36, T13, TS-ERP-15, TS-MIG-01
- [ ] **M05 Pricing** — Price matrix and privacy tests pass (WP07); the engine is the only price source for every channel (no client price accepted); every list activation traceable to an approved change request (`05` §5.5; `10` §4.10) — **Tasks:** T-1A.5-M05-02, T-1A.5-M04-01, T-1A.5-M05-03, T-1A.5-M05-09, T-1A.9-M05-01 · **Decisions:** D-016, D-017, D-018 · **Verify:** TS-UNIT-01, TS-ECOM-03, TS-PERM-05, TS-API-10, T02, T03, T10, T22
- [ ] **M06 Inventory** — Last-unit, serial and count tests pass (WP08); reconciliation zero drift on rehearsal data; A04 lag within the agreed window; reserved and in-transit quantities distinguishable in every view; every adjustment has reason, approver and value impact (`05` §5.6; `10` §5.10) — **Tasks:** T-1A.6-M06-02, T-1A.6-M06-03, T-1A.6-M06-04, T-1A.6-M06-07, T-1A.6-M06-08, T-1A.6-M06-12, T-1A.9-M06-01 · **Decisions:** D-026, D-027, D-034 · **Verify:** TS-ERP-01…07, TS-DB-07, TS-PERF-03, T04, T16
- [ ] **M07 Purchasing & receiving** — Receipt → QC → sellable with serials; T15; no PO sent without approval; bills matched or held with a reason; suppliers maintained in 1A (`05` §5.7; `10` §6.10) — **Tasks:** T-1A.7-M07-02, T-1A.7-M07-04, T-1A.7-M07-05, T-1A.7-M07-07, T-1A.7-M07-10 · **Decisions:** D-176, D-178 · **Verify:** T15, TS-ERP-04, TS-ERP-09
- [ ] **M08 Customers & business accounts** — Only verified members of approved accounts receive dealer context; consent history complete; deletion workflow retains statutory records (`05` §5.8) — **Tasks:** T-1A.8-M08-03, T-1A.8-M08-04, T-1A.8-M08-06, T-1A.8-M08-12, T-1A.16-M26-02 · **Decisions:** D-066, D-067, D-205 · **Verify:** T02, T25, TS-ECOM-09/10, TS-PERM-02, TS-DB-06
- [ ] **M09 Storefront web application** — Home modules served without private data leakage; storefront caching isolates private data (`05` §5.9) — **Tasks:** T-1A.9-M09-02, T-1A.9-M09-04 · **Decisions:** D-105, D-142 · **Verify:** T22, TS-API-07, TS-FE-05
- [ ] **M10 Cart, checkout & orders** — Checkout accurate-outcome tests pass (T04–T10, BP §30.2 Checkout); every order change audited; assisted and web orders share one pricing, reservation and payment path; D-150 transitions confirmed (`05` §5.10; `10` §7.11) — **Tasks:** T-1A.9-M10-03, T-1A.9-M10-04, T-1A.9-M10-05, T-1A.9-M10-09, T-1A.13-M10-01 · **Decisions:** D-021, D-150, D-151 · **Verify:** T04, T06, T10, TS-UNIT-04, TS-SVC-01/03
- [ ] **M11 Payments, refunds & reconciliation** — Duplicate/late payment scenarios pass (WP10); refunds never exceed the refundable amount; daily reconciliation reconciles with the provider sample (T27) (`05` §5.11; `10` §10.11) — **Tasks:** T-1A.10-M11-02, T-1A.10-M11-04, T-1A.10-M11-05, T-1A.10-M11-10, T-1A.15-M11-01 · **Decisions:** D-012 · **Verify:** T07, T08, T09, T18, T19, T27, TS-INT-01, TS-DB-03 (I-05)
- [ ] **M12 Fulfilment & shipping** — Full fulfilment sample passes (WP11); no dispatch without serial verification; stock decremented exactly once per unit; handover evidence stored; manual booking fallback usable (`05` §5.12; `10` §8.10) — **Tasks:** T-1A.11-M12-03, T-1A.11-M12-04, T-1A.11-M12-05, T-1A.11-M12-12 · **Decisions:** D-013 · **Verify:** T07, T20, TS-ERP-10/11, TS-ERR-03
- [ ] **M13 Returns, RMA & warranty** — Returned units never sellable without a disposition; refunds and resale decided separately and audited; warranty claims never auto-accepted (A23); supplier RMAs share only required data (`05` §5.13; `10` §9.10) — **Tasks:** T-1A.12-M13-03, T-1A.12-M13-04, T-1A.12-M13-05, T-1A.12-M13-06, T-1A.12-M13-09 · **Decisions:** D-022 · **Verify:** T17, T33, T34, TS-ERP-12, TS-VEN-08
- [ ] **M14 Vendor portal & vendor management** — No cross-vendor access; approved changes only reach the live catalog after review (WP13); suspended vendors blocked (`05` §5.14) — **Tasks:** T-1B.1-M14-04, T-1B.1-M14-07, T-1B.1-M14-08, T-1B.1-M14-15 · **Decisions:** D-047, D-068 · **Verify:** T11, T12, T13, TS-VEN-05, TS-VEN-10, TS-PROOF-06/09
- [ ] **M16 Support & WhatsApp** — Chat-to-order and handoff UAT (WP14); no disclosure without verification (`05` §5.16) — **Tasks:** T-1A.13-M16-02, T-1A.13-M16-05, T-1B.3-M16-02, T-1B.3-M16-03, T-1B.3-M16-04, T-1B.3-M16-06 · **Decisions:** D-014, D-074 · **Verify:** T23, T24, TS-PERM-06, TS-E2E-05
- [ ] **M17 Automation, exceptions, approvals & delegation** — Failure recovery and measured run logs (WP12); owner sees only material exceptions in a simulated owner-away day (`05` §5.17; `10` §14.8) — **Tasks:** T-1A.1-M17-01, T-1A.2-M17-01, T-1A.2-M17-02, T-1A.14-M17-01, T-1A.14-M17-03, T-1A.14-M17-05, T-1A.14-M17-12 · **Decisions:** D-024, D-025, D-063, D-078 · **Verify:** T21, T31, TS-SVC-02/06/07, TS-PROOF-08
- [ ] **M18 Reporting & exports** — Launch report set reconciles with sample transactions (WP15); definitions published with each report (`05` §5.18; `10` §13.7) — **Tasks:** T-1A.15-M18-01, T-1A.15-M18-02, T-1A.15-M18-08 · **Decisions:** D-075 · **Verify:** TS-ERP-19, TS-UNIT-11, T27
- [ ] **M19 Finance boundary & accounting export** — Finance confirms invoice/export and reconciliation process (BP §23.4); one accounting mapping per approved document/version (`05` §5.19) — **Tasks:** T-1A.11-M19-01, T-1A.15-M19-01, T-1A.15-M11-01 · **Decisions:** D-011, D-055, D-037 · **Verify:** T27, TS-INT-05, TS-ERP-14, TS-DB-02 (I-09)
- [ ] **M20 Notifications** — A14 notifications for the approved event list with visible delivery status (`05` §5.20) — **Tasks:** T-1A.13-M20-01, T-1A.13-M20-02, T-1B.3-M20-01 · **Decisions:** D-058 · **Verify:** TS-SVC-05, TS-ECOM-15, T25
- [ ] **M21 Search** — Agreed relevance/latency tests pass on a representative catalog (`05` §5.21) — **Tasks:** T-1A.4-M21-01, T-1A.5-M04-01, T-1A.6-M06-03 · **Decisions:** D-032, D-010 · **Verify:** TS-PERF-06, TS-ECOM-01
- [ ] **M22 Files & media** — Private files never reachable without authorisation (`05` §5.22) — **Tasks:** T-1A.4-M22-01, T-1A.4-M22-02, T-1B.2-M22-01 · **Decisions:** D-033, D-112 · **Verify:** TS-SVC-08, TS-SEC-03/04, T28 (attachments restored)
- [ ] **M23 Integrations & adapters** — Each enabled integration passes its contract checklist (`05` §5.23) — **Tasks:** T-1A.2-M23-01, T-1A.2-M23-02, T-1A.10-M23-01, T-1A.11-M23-01, T-1B.2-M23-01, T-1B.3-M23-01 · **Decisions:** D-012, D-013, D-014, D-015, D-057 · **Verify:** TS-INT-10 per adapter
- [ ] **M24 Administration & settings** — All decision-driven settings stored as versioned configuration with audit; secrets never returned (`05` §5.24; `11` §15) — **Tasks:** T-1A.2-M24-01, T-1A.2-M24-02, T-1A.16-M24-01, T-1A.16-M24-05 · **Verify:** TS-SVC-04, TS-ADM-07/12
- [ ] **M25 Data migration & cutover** — Reconciled opening stock and serials signed off (Phase 1A exit gate) (`05` §5.25) — **Tasks:** T-1A.17-M25-01, T-1A.17-M25-02, T-1A.17-M25-03, T-1A.17-M25-04, T-1A.17-M25-06 · **Decisions:** D-009, D-038, D-039 · **Verify:** TS-MIG-03, TS-MIG-06, G3
- [ ] **M26 Security, observability, backup & operations** — Go-live checklist items for monitoring, backups, incident contacts and restore evidence (BP §23.4) (`05` §5.26) — **Tasks:** T-1A.1-M26-01, T-1A.1-M26-02, T-1A.16-M26-01, T-1A.17-M26-01, T-1A.17-M26-05 · **Decisions:** D-052, D-108, D-034 · **Verify:** T28, TS-BKP-02, TS-ADM-08, G9
- [ ] **M27 SEO & discoverability** — Redirect map loaded and crawl-checked after migration; sitemap excludes private/unpublished URLs (`05` §5.27) — **Tasks:** T-1A.4-M27-01, T-1A.9-M27-01, T-1A.17-M27-01 · **Decisions:** D-076, D-163 · **Verify:** T32, TS-ECOM-13, TS-MIG-05
- [ ] **Branch operations** — Every branch sale reaches the same stock authority (T05); transfers reconcile (T16); branch reports reconcile with stock and sales per location (`10` §12.5) — **Tasks:** T-1A.6-M06-07, T-1A.6-M23-01, T-1A.13-M10-01, T-1A.15-M18-02 · **Decisions:** D-029, D-030 · **Verify:** T05, T16, TS-ERP-05, TS-INT-07
- [ ] **Administration (`11` §15)** — Owner independence, access control, approvals and thresholds, delegation and emergency access, configuration, integrations, reports and exports, audit reconstruction, system controls — **Tasks:** T-1A.3-M02-02, T-1A.14-M17-07, T-1A.14-M17-08, T-1A.14-M17-12, T-1A.16-M24-05, T-1A.17-M26-01 · **Decisions:** D-024, D-025 · **Verify:** T31, T10, T11, T13, T22, T27, T28, T35; TS-ADM-05 (sample transaction reconstruction, BP §20.1)

### 4.2 Cross-cutting backend rules (`05` §1)

- [ ] TX-1 place pending order: order + line snapshots + reservations + idempotency record + outbox row in one transaction — **Tasks:** T-1A.9-M06-01, T-1A.9-M10-03 · **Verify:** TS-SVC-01, T04, T06
- [ ] TX-2 apply payment event (dedup + attempt transition + order transition + allocation or exception) — **Tasks:** T-1A.10-M11-02, T-1A.10-M11-03 · **Verify:** TS-SVC-01, T07, T08, T09
- [ ] TX-3 cancel lines (cancellation + affected reservations released + refund request + order state) — **Tasks:** T-1A.9-M10-05, T-1A.10-M11-05 · **Verify:** TS-SVC-01, T34
- [ ] TX-4 dispatch / handover (fulfilment + stock movement + reservation consumed + serial event) — **Tasks:** T-1A.11-M12-05 · **Verify:** TS-SVC-01, TS-ERP-10
- [ ] TX-5 post goods receipt (receipt + movements + serial units + PO quantities) — **Tasks:** T-1A.7-M07-05 · **Verify:** TS-SVC-01, T15
- [ ] TX-6 transfer ship / receive — **Tasks:** T-1A.6-M06-07 · **Verify:** TS-SVC-01, T16
- [ ] TX-7 approve stock adjustment (approval decision + movement + adjustment status) — **Tasks:** T-1A.2-M17-01, T-1A.6-M06-08 · **Verify:** TS-SVC-01, TS-ERP-06
- [ ] TX-8 / TX-9 receive return into quarantine; resale disposition — **Tasks:** T-1A.12-M13-03 · **Verify:** TS-SVC-01, T17
- [ ] TX-10 approval decision + subject state change — **Tasks:** T-1A.2-M17-01 · **Verify:** TS-SVC-01, TS-UNIT-10
- [ ] Durable work: every external call recorded as an outbox operation in the business transaction; worker, scanner, retries with caps, one incident per job + entity (A38) — **Tasks:** T-1A.1-M17-01, T-1A.2-M17-02, T-1A.14-M17-03 · **Verify:** TS-SVC-02, T21, TS-ERR-06
- [ ] Idempotency records: same key + same payload → stored result; different payload → IDEMPOTENCY_CONFLICT — **Tasks:** T-1A.1-M01-05, T-1A.1-M17-01 · **Verify:** TS-UNIT-06, TS-API-03, T06
- [ ] State machines as explicit transition tables with guards (order, payment attempt, refund, fulfilment, RMA, product lifecycle, vendor submission) — **Tasks:** T-1A.4-M04-05, T-1A.9-M10-04, T-1A.10-M11-02, T-1A.11-M12-02, T-1A.12-M13-02, T-1B.1-M14-06 · **Decisions:** D-150 · **Verify:** TS-UNIT-04
- [ ] Shared kernel: money never floating point; tax arithmetic; identifiers and non-fiscal numbering; timestamps and business day — **Tasks:** T-1A.1-M01-03 · **Decisions:** D-104, D-123, D-124 · **Verify:** TS-UNIT-02, TS-DB-08
- [ ] Structured logs with correlation ids, error capture, no secrets/OTPs/payment data in logs; business audit separate from technical logs — **Tasks:** T-1A.1-M26-01, T-1A.2-M02-03 · **Verify:** TS-SEC-06, TS-AUTH-10, TS-SVC-03
- [ ] Error model: stable error codes and envelope with correlation id; provider timeouts never produce guessed success — **Tasks:** T-1A.1-M01-05 · **Decisions:** D-080 · **Verify:** TS-API-02, TS-ERR-01
- [ ] Server-derived context: price, buyer type, role, stock, seller and refund-approval fields never trusted from clients — **Tasks:** T-1A.1-M01-05, T-1A.9-M05-01, T-1A.9-M10-03 · **Verify:** TS-API-10, TS-PERM-03, T10

### 4.3 Automations A01–A38 (BP §12.2; `10` §15; `12` §8.7)

An automation is complete when its task is complete, its BP §12.3 template is filled and — if selected by D-078 — it is
activated through S-17 (T-1A.14-M17-02 for 1A, T-1B.4-M17-02 for 1B) and passes TS-SVC-07 (template and kill switch).
Phase per `10` §15.2: P1 → 1A, P1B → 1B, P1/C → 1A conditional, P2/P3 → LATER (§11).

- [ ] **A01** Supplier product import maps and validates fields — P1 → 1B per D-048/D-078 — **Tasks:** T-1B.2-M04-01 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A02** Import authorised media by product mapping — P1 → 1B per D-048/D-078 — **Tasks:** T-1B.2-M22-01 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A03** Scan receipt and serials against PO — P1 — **Tasks:** T-1A.7-M07-05, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A04** Committed stock event refreshes availability — P1 — **Tasks:** T-1A.6-M06-03, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A05** Transactional reservation at confirmation — P1 — **Tasks:** T-1A.9-M06-01, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A06** Scheduled reservation expiry — P1 — **Tasks:** T-1A.9-M06-01, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A07** Central pricing engine evaluates approved tiers — P1 — **Tasks:** T-1A.5-M05-02, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A08** Guided WhatsApp selection creates draft order — P1B — **Tasks:** T-1B.3-M16-02, T-1B.4-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A09** Signed webhook updates payment state — P1 — **Tasks:** T-1A.10-M11-02, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A10** Import settlement records and match fees/net — P1/C (D-064) `(C)` — **Tasks:** T-1A.10-M11-07 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A11** Eligible order enters warehouse queue — P1 — **Tasks:** T-1A.11-M12-02, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A12** Generate approved invoice/packing documents — P1 — **Tasks:** T-1A.11-M19-01, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A13** Packed order requests provider booking — P1/C (D-013) `(C)` — **Tasks:** T-1A.11-M12-04 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A14** Approved transitions send messages — P1 — **Tasks:** T-1A.13-M20-02, T-1A.14-M17-02, T-1B.3-M20-01 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A15** Verified order lookup returns permitted status — P1B — **Tasks:** T-1B.3-M16-03, T-1B.4-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A16** Deadline rule reminds assigned staff — P1 — **Tasks:** T-1A.14-M17-02, T-1A.14-M17-05 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A17** Replenishment suggestions — P1 — **Tasks:** T-1A.7-M07-03, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A18** Shared authorised stock view — P1 — **Tasks:** T-1A.6-M06-03, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A19** Exception and KPI digest — P1 — **Tasks:** T-1A.14-M17-02, T-1A.14-M17-09 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A20** Validate vendor submission fields and risky changes — P1B — **Tasks:** T-1B.1-M14-06, T-1B.4-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A21** Supplier freshness expiry — P1B — **Tasks:** T-1B.2-M06-01, T-1B.4-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A22** Return policy check and review routing — P1 — **Tasks:** T-1A.12-M13-02, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A23** Warranty match of invoice, serial and policy — P1 — **Tasks:** T-1A.12-M13-05, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A24** Counts generate variance review — P1 — **Tasks:** T-1A.6-M06-08, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A25** Supplier invoice matching — P1 — **Tasks:** T-1A.7-M07-07, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A26** Accounting export of invoices and credits — P1/C (D-011) `(C)` — **Tasks:** T-1A.15-M19-01 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A27** Dealer application completeness and routing — P1 — **Tasks:** T-1A.8-M08-05, T-1A.14-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A28** Unpaid-buyer reminders — P1/C (D-078) `(C)` — **Tasks:** T-1A.13-M20-04 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A32** Curated compatibility rules — P1/C (D-071) `(C)` — **Tasks:** T-1A.4-M04-07 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A36** Margin-leakage flag — P1B — **Tasks:** T-1B.4-M05-01, T-1B.4-M17-02 · **Verify:** TS-SVC-07; BP §12.3 template complete
- [ ] **A38** Job monitor creates one actionable incident — P1 — **Tasks:** T-1A.2-M17-02, T-1A.14-M17-02, T-1A.14-M17-03 · **Verify:** TS-SVC-07; BP §12.3 template complete
- A29, A30, A31, A33, A34, A35, A37 are P2/P3 — `LATER`, see §11.

---

## 5. Database

### 5.1 Migration groups (`03` §4; `12` §8.5)

Each group: schema (or native records/extension DocTypes under D-001) applied in order, reversible where the platform
allows, constraints and uniqueness in place, deferred references added by the later group. Verify for every group:
TS-DB-01 (applies in order on an empty DB and on the previous release), TS-DB-02 (constraints), TS-DB-04 (append-only
ledgers where applicable), TS-DB-08 (types).

- [ ] **DB-G0 Foundation & control infrastructure** — 17 entities; first group — **Tasks:** T-1A.1-M01-04 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08, TS-DB-04
- [ ] **DB-G1 Organisation & identity** — 13 entities; depends on DB-G0 — **Tasks:** T-1A.2-M02-01 · **Decisions:** D-040, D-083 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08
- [ ] **DB-G2 Catalog** — 25 entities; depends on DB-G0, DB-G1 — **Tasks:** T-1A.4-M04-01 · **Decisions:** D-125, D-127 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08
- [ ] **DB-G3 Pricing** — 9 entities; depends on DB-G2 — **Tasks:** T-1A.5-M05-01 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08
- [ ] **DB-G4 Inventory & serials** — 13 entities; depends on DB-G2, DB-G1 — **Tasks:** T-1A.6-M06-01 · **Decisions:** D-128 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08, TS-DB-04
- [ ] **DB-G5 Purchasing & receiving** — 9 entities; depends on DB-G2, DB-G3, DB-G4 — **Tasks:** T-1A.7-M07-01 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08
- [ ] **DB-G6 Customers & business accounts** — 13 entities; depends on DB-G0, DB-G1, DB-G3 — **Tasks:** T-1A.8-M08-01 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08
- [ ] **DB-G7 Quotes, orders & payments** — 18 entities; depends on DB-G3, DB-G4, DB-G5, DB-G6 — **Tasks:** T-1A.9-M10-01 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08, TS-DB-04
- [ ] **DB-G8 Fulfilment, returns & finance export** — 14 entities; depends on DB-G7 — **Tasks:** T-1A.11-M12-01 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08
- [ ] **DB-G9 Vendor portal** — 8 entities; depends on DB-G2, DB-G7, DB-G8 — **Tasks:** T-1B.1-M14-01 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08
- [ ] **DB-G10 Support, storefront content, reporting & automation activation** — 13 entities; depends on DB-G2, DB-G6, DB-G7 — **Tasks:** T-1A.9-M09-01 · **Verify:** TS-DB-01, TS-DB-02, TS-DB-08
- [ ] Deferred references of `03` §4 added by the later groups (e.g. `serial_unit.goods_receipt_line_id` in DB-G5, `stock_movement.reservation_id` in DB-G7, `supplier.current_vendor_approval_id` in DB-G9) — **Tasks:** T-1A.7-M07-01, T-1A.9-M10-01, T-1A.11-M12-01, T-1B.1-M14-01 · **Verify:** TS-DB-01 on the previous release
- [ ] DB-G5 schema applied only after DB-G3 (`03` §4; skeleton edge missing — `17` §14 #2) — **Tasks:** T-1A.5-M05-01, T-1A.7-M07-01 · **Verify:** migration order log shows DB-G3 before DB-G5

### 5.2 Conditional and mockup-only entities (migrated by the feature task after its decision)

- [ ] E-verification_challenge, E-user_session, E-api_credential migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.2-M02-01 · **Decisions:** D-040, D-021, D-083 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-device_station migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.11-M12-10 · **Decisions:** D-147 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-compatibility_link migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.4-M04-07 · **Decisions:** D-071 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-bundle_component migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.6-M04-01 · **Decisions:** D-072 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-promotion, E-promotion_code migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.5-M05-04 · **Decisions:** D-043 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-shipping_charge_rule migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.9-M12-01 · **Decisions:** D-162 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-lot migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.6-M06-09 · **Decisions:** D-126 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-landed_cost_charge migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.7-M07-06 · **Decisions:** D-056 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-customer_tag migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.8-M08-09 · **Decisions:** D-145 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-wishlist_item migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.9-M09-09 · **Decisions:** D-042 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-alert_subscription migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.13-M20-05 · **Decisions:** D-141 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-cart, E-cart_line migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.9-M10-02 · **Decisions:** D-129 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-internal_note migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.9-M10-07 · **Decisions:** D-134 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-merch_collection migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.9-M09-03 · **Decisions:** D-142 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-product_question migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.9-M04-01 · **Decisions:** D-065 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-settlement_record migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.10-M11-07 · **Decisions:** D-064 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-pick_wave, E-handover_manifest migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.11-M12-07 · **Decisions:** D-132 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-product_review migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.12-M04-01 · **Decisions:** D-041 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-customer_merge, E-registered_device migrated (or recorded not needed) `(C)` — **Tasks:** T-1A.12-M08-01 · **Decisions:** D-133 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-supplier_confirmation migrated (or recorded not needed) `(C)` — **Tasks:** T-1B.2-M04-03 · **Decisions:** D-073, D-181 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-advance_shipping_notice migrated (or recorded not needed) `(C)` — **Tasks:** T-1B.1-M14-10 · **Decisions:** D-131 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-vendor_announcement migrated (or recorded not needed) `(C)` — **Tasks:** T-1B.1-M14-14 · **Decisions:** D-142 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built
- [ ] E-supplier_fulfilment_task migrated (or recorded not needed) `(C)` — **Tasks:** T-1B.4-M14-01 · **Decisions:** D-007, D-008, D-181 · **Verify:** TS-DB-01/02 for the added tables; `NOT_APPLICABLE` evidence if not built

### 5.3 Seed sets (`03` §6; `12` §8.6)

Seeds load **only decided values**; placeholder or mockup sample values are rejected (TS-DB-05, seed framework
T-1A.1-M01-09).

- [ ] **S-01 Company & registrations** — E-company; before: Everything with `[CO]`; values decided by: D-010, D-037, D-055, D-059 — **Tasks:** T-1A.2-M03-02 · **Verify:** TS-DB-05
- [ ] **S-02 Locations & bins** — E-location, E-location_bin; before: Stock, users with location scope; values decided by: D-010, D-029, D-061 — **Tasks:** T-1A.2-M03-02 · **Verify:** TS-DB-05
- [ ] **S-03 Roles & permissions** — E-role, E-permission, E-role_permission; before: Any user; values decided by: `07-auth-roles-permissions.md`; D-066, D-137 — **Tasks:** T-1A.2-M02-02 · **Verify:** TS-DB-05
- [ ] **S-04 Privileged & integration accounts** — E-user_account, E-user_role_assignment, E-invitation, E-api_credential (C); before: Go-live; values decided by: D-040, D-083; BP §24.2 (account ownership) — **Tasks:** T-1A.2-M02-09 · **Verify:** TS-DB-05
- [ ] **S-05 Approval thresholds & authority** — E-approval_threshold, E-discount_authority, E-margin_floor; before: Adjustments, pricing overrides, refunds, POs; values decided by: D-024 — **Tasks:** T-1A.14-M17-07 · **Verify:** TS-DB-05
- [ ] **S-06 Delegation alternates** — E-delegation; before: Go-live ("alternate approvers", BP §23.4); values decided by: D-025 — **Tasks:** T-1A.14-M17-08 · **Verify:** TS-DB-05
- [ ] **S-07 Catalog structure** — E-category, E-attribute_definition, E-category_attribute, E-brand; before: Products; values decided by: Client (BP §26.1 Q3); D-057 — **Tasks:** T-1A.4-M04-03 · **Verify:** TS-DB-05
- [ ] **S-08 Condition grades & inspection checklists** — E-condition_grade, E-configuration_version (inspection_checklist); before: Refurbished SKUs, inspections; values decided by: D-023 — **Tasks:** T-1A.4-M04-03 · **Verify:** TS-DB-05
- [ ] **S-09 Warranty & return policies** — E-warranty_policy, E-return_policy; before: Offers; values decided by: D-022 — **Tasks:** T-1A.4-M04-03 · **Verify:** TS-DB-05
- [ ] **S-10 Tax classifications** — E-tax_classification; before: Products; values decided by: D-037 — **Tasks:** T-1A.4-M04-03 · **Verify:** TS-DB-05
- [ ] **S-11 Segments & price lists** — E-customer_segment, E-price_list, E-price_rule_version, E-price_list_item, E-quantity_tier; before: Checkout; values decided by: D-006, D-016, D-018, D-044 — **Tasks:** T-1A.5-M05-07, T-1A.8-M08-08 · **Verify:** TS-DB-05
- [ ] **S-12 Pricing policy & promotions** — E-price_rule_version (pricing_policy), E-promotion; before: Checkout; values decided by: D-017, D-043 — **Tasks:** T-1A.5-M05-07 · **Verify:** TS-DB-05
- [ ] **S-13 Operational parameters** — E-configuration_version; before: Reservations, supplier feeds, counts, notifications; values decided by: D-026, D-027, D-028, D-069, D-058, D-077 — **Tasks:** T-1A.6-M06-10 · **Verify:** TS-DB-05
- [ ] **S-14 Reason-code lists** — E-configuration_version (reference_list); before: Holds, cancellations, adjustments, returns, transfers; values decided by: D-139 — **Tasks:** T-1A.6-M06-10 · **Verify:** TS-DB-05
- [ ] **S-15 Terms & notices** — E-terms_version; before: Registration, applications, consent; values decided by: D-037, D-067, D-068 — **Tasks:** T-1A.8-M08-03, T-1A.8-M08-08, T-1B.1-M14-05 · **Verify:** TS-DB-05
- [ ] **S-16 Templates & approved answers** — E-message_template, E-approved_answer; before: Notifications, support; values decided by: D-014, D-015, D-050, D-058, D-074 — **Tasks:** T-1A.13-M20-01, T-1B.3-M16-05 · **Verify:** TS-DB-05
- [ ] **S-17 Automation rules** — E-automation_rule; before: Automation go-live; values decided by: D-078 — **Tasks:** T-1A.14-M17-02, T-1B.4-M17-02 · **Verify:** TS-DB-05
- [ ] **S-18 Integrations** — E-integration_setting; before: Payments, shipping, accounting, messaging; values decided by: D-009, D-011, D-012, D-013, D-014, D-015 — **Tasks:** T-1A.2-M24-02 · **Verify:** TS-DB-05
- [ ] **S-19 Report schedules** — E-report_schedule; before: Reporting; values decided by: D-063, D-075 — **Tasks:** T-1A.15-M18-04 · **Verify:** TS-DB-05
- [ ] **S-20 Opening master & transactional data** — via M25 (§7.4); before: Launch; values decided by: D-038, D-039 — **Tasks:** T-1A.17-M25-01 · **Verify:** TS-DB-05; TS-MIG-03 control totals
- [ ] **S-21 Import templates & mapping profiles** — E-import_mapping_profile (+ template files in E-attachment); before: Catalog/supplier imports; values decided by: D-057 — **Tasks:** T-1B.2-M04-01 · **Verify:** TS-DB-05
- [ ] **S-22 Search synonyms** — E-search_synonym; before: Storefront search; values decided by: BP §6.4; D-032 — **Tasks:** T-1A.4-M21-01 · **Verify:** TS-DB-05
- [ ] **S-23 SEO redirect map** — E-seo_redirect; before: Cutover (switch of channels); values decided by: D-076 — **Tasks:** T-1A.17-M27-01 · **Verify:** TS-DB-05
- [ ] **S-24 Merchandising collections** — E-merch_collection; before: Storefront home; values decided by: D-142 — **Tasks:** T-1A.9-M09-03 · **Verify:** TS-DB-05
- [ ] **S-25 Lots (only if lot tracking approved)** — E-lot; before: Opening stock of lot-tracked SKUs; values decided by: D-126 `(C)` — **Tasks:** T-1A.6-M06-09 · **Verify:** TS-DB-05
- [ ] **S-26 Shipping charge rules** — E-shipping_charge_rule; before: Checkout; values decided by: D-162, D-061, D-020, D-037 (provisional owner — not named in the skeleton, `17` §14 #3) — **Tasks:** T-1A.9-M12-01 · **Verify:** TS-DB-05
- [ ] **S-27 Device stations (only if devices integrated)** — E-device_station; before: Scan/pack/erasure stations; values decided by: D-147, D-110 (provisional owner — not named in the skeleton, `17` §14 #3) `(C)` — **Tasks:** T-1A.11-M12-10 · **Verify:** TS-DB-05
- [ ] **S-28 Support contact channels** — E-configuration_version (`support.contact_channels`), E-company.consumer_disclosures; before: Help pages, footer; values decided by: D-074, D-037 (provisional owner — not named in the skeleton, `17` §14 #3) — **Tasks:** T-1A.13-M09-01 · **Verify:** TS-DB-05
- [ ] **S-29 Notification preference defaults** — E-notification_preference (defaults per event group); before: Notifications; values decided by: D-058 (provisional owner — not named in the skeleton, `17` §14 #3) — **Tasks:** T-1A.13-M20-03 · **Verify:** TS-DB-05

### 5.4 Consistency invariants (BP §17.6; `03` §5.1; `05` §1.6)

- [ ] I-01 No duplicate effect for the same accepted business operation — **Tasks:** T-1A.1-M17-01, T-1A.9-M10-03, T-1A.10-M11-02, T-1A.10-M11-05, T-1A.11-M12-04, T-1A.15-M19-01, T-1B.2-M04-01 · **Verify:** T06, T07, T18, T20, T26, TS-DB-03
- [ ] I-02 No negative sellable allocation under normal confirmed-order processing — **Tasks:** T-1A.9-M06-01, T-1A.9-M10-03, T-1A.10-M11-03, T-1A.11-M12-05 · **Verify:** T04, T05, T09, TS-ERP-01, TS-DB-03
- [ ] I-03 A serialised unit cannot be shipped twice without a recorded return and new sale — **Tasks:** T-1A.6-M06-04, T-1A.11-M12-03, T-1A.11-M12-05, T-1A.12-M13-03 · **Verify:** T17, TS-ERP-03, TS-DB-02
- [ ] I-04 Stock movement history reconciles to current balances — **Tasks:** T-1A.6-M06-02, T-1A.6-M06-03 · **Verify:** T15, T16, T21, TS-DB-07
- [ ] I-05 Refunds never exceed the refundable captured amount — **Tasks:** T-1A.10-M11-05, T-1A.12-M13-04 · **Verify:** T18, T19, T34, TS-DB-03
- [ ] I-06 Approved private prices do not cross customer/business boundaries — **Tasks:** T-1A.5-M04-01, T-1A.8-M08-06, T-1A.9-M05-01, T-1A.9-M09-04 · **Verify:** T02, T10, T22, TS-PERM-05
- [ ] I-07 Order snapshots preserve what was sold — **Tasks:** T-1A.4-M04-04, T-1A.9-M10-03 · **Verify:** T33, TS-DB-03
- [ ] I-08 Unapproved vendor content cannot become a purchasable offer — **Tasks:** T-1A.4-M04-05, T-1B.1-M14-06, T-1B.1-M14-07 · **Verify:** T12, T13, TS-VEN-02
- [ ] I-09 One external accounting mapping per approved document/version — **Tasks:** T-1A.15-M19-01 · **Verify:** T27, TS-INT-05, TS-DB-02
- [ ] I-10 Every material override has an actor, reason and authority trail — **Tasks:** T-1A.2-M02-03, T-1A.2-M17-01, T-1A.14-M17-08 · **Verify:** T31, TS-ADM-05 (sample transaction reconstruction, BP §20.1)
- [ ] Other documented invariants (`03` §5.4): reservation and pending order together; transfers never create/destroy stock; supplier availability never becomes company stock; positions never overwritten; captured payment never downgraded; returned units quarantined; refund and resale separate; expired price list never yields zero price; requester ≠ approver; suspended vendors blocked; channel from entry point; privileged role only with MFA — **Tasks:** T-1A.2-M02-06, T-1A.2-M17-01, T-1A.5-M05-02, T-1A.6-M06-07, T-1A.6-M06-08, T-1A.9-M10-03, T-1A.10-M11-02, T-1A.12-M13-03, T-1B.1-M14-08, T-1B.2-M06-01 · **Verify:** TS-DB-03, TS-UNIT-04/05, TS-PERM-08, TS-AUTH-02

### 5.5 Validation, personal data, retention and opening data

- [ ] Validation rules by area (`03` §8) implemented at API and database level; client-sent authority fields ignored — **Tasks:** T-1A.1-M01-05, T-1A.4-M04-02, T-1A.9-M10-03 · **Verify:** TS-UNIT-07, TS-API-10, TS-SEC-02, T10
- [ ] Personal-data fields classified; field-level protection and masking/reveal with reason — **Tasks:** T-1A.8-M02-01, T-1A.16-M26-02 · **Decisions:** D-130, D-153 · **Verify:** TS-DB-06, TS-PERM-10
- [ ] Retention classes implemented as entity hooks; anonymisation keeps statutory records — **Tasks:** T-1A.8-M08-04, T-1A.16-M26-02 · **Decisions:** D-036, D-060 · **Verify:** TS-DB-06
- [ ] Non-production data synthetic or approved masked extracts only — **Tasks:** T-1A.1-M01-09, T-1A.17-M25-02 · **Decisions:** D-136 · **Verify:** `16` §3.2 TD1–TD4 evidence
- [ ] Opening master and transactional data (S-20) loaded via M25 with control totals: products/SKUs, images, stock by location/owner/condition/serial, customers/dealers, vendors, open orders, open POs, payments/refunds, warranty records, SEO URLs (BP §21.2) — **Tasks:** T-1A.4-M25-01, T-1A.6-M25-01, T-1A.7-M25-01, T-1A.8-M25-01, T-1A.17-M25-01, T-1A.17-M02-01, T-1A.17-M27-01, T-1A.17-M25-06 · **Decisions:** D-038, D-039, D-009 · **Verify:** TS-MIG-01…06, G3

---

## 6. APIs (492 endpoints, `06-api.md`)

### 6.1 Global API criteria

- [ ] API conventions in place: versioned base path, error envelope with correlation id, pagination/filter/sort, money/date formats, idempotency transport, optimistic concurrency — **Tasks:** T-1A.1-M01-05 · **Decisions:** D-080, D-079 · **Verify:** TS-API-02, TS-API-04, TS-API-05, TS-API-08
- [ ] Every one of the 492 endpoints is in the route inventory behind AccessPolicy (deny by default) and matches the `07` §13 matrix — **Tasks:** T-1A.2-M02-02, T-1A.16-M24-05, T-1A.17-M26-02 · **Verify:** TS-PERM-01, TS-SEC-01
- [ ] Every endpoint conforms to its `06` §3 contract (request, validation, response, errors) — **Tasks:** T-1A.9-M10-09, T-1A.17-M26-02 · **Verify:** TS-API-01 (all 492), TS-API-09 (BP §17.4 contracts)
- [ ] Idempotent endpoints replay the stored result and reject a different payload — **Tasks:** T-1A.1-M17-01, T-1A.9-M10-03, T-1A.10-M11-01 · **Verify:** TS-API-03
- [ ] Personalised responses never publicly cached; public catalog cacheable — **Tasks:** T-1A.9-M09-04 · **Verify:** TS-API-07, T22
- [ ] Object- and property-level authorisation on every endpoint (BOLA/BOPLA), function-level checks — **Tasks:** T-1A.17-M26-02 · **Verify:** TS-PERM-02/03/04, TS-SEC-01

### 6.2 Endpoints by module and implementing task

Each item = the endpoints whose **first** implementing task is the cited task (`17` §11.1). `also` = later tasks that
extend or complete the same endpoints (`17` §11.2) — the item is ticked only when those are complete too. Verify for every
item: TS-API-01 contract tests and TS-PERM-01 inventory for the IDs, plus the suites the task names (listed).

**M02 Identity, access & audit — 42 endpoints**

- [ ] API-M02-35…37 (3) — **Tasks:** T-1A.2-M02-02 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-03, TS-PERM-01/04, TS-AUTH-09
- [ ] API-M02-30 (1) — **Tasks:** T-1A.2-M02-03 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-03, TS-SEC-09
- [ ] API-M02-01, API-M02-04, API-M02-06, API-M02-09 (4) — **Tasks:** T-1A.2-M02-04, T-1A.8-M08-06 · **Verify:** TS-API-01, TS-PERM-01; TS-AUTH-01/04…05/08/10
- [ ] API-M02-02…03, API-M02-07…08 (4) — **Tasks:** T-1A.2-M02-05 · **Verify:** TS-API-01, TS-PERM-01; TS-AUTH-01/03/05, TS-SEC-11
- [ ] API-M02-05, API-M02-10…15, API-M02-32 (8) — **Tasks:** T-1A.2-M02-06 · **Verify:** TS-API-01, TS-PERM-01; TS-AUTH-02
- [ ] API-M02-16…24, API-M02-34, API-M02-38 (11) — **Tasks:** T-1A.2-M02-07 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-01/15, TS-AUTH-06, TS-PERM-12
- [ ] API-M02-25…29, API-M02-39…42 (9) — **Tasks:** T-1A.2-M02-08 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-02/09, TS-PERM-08
- [ ] API-M02-31 (1) — **Tasks:** T-1A.8-M02-01 · **Verify:** TS-API-01, TS-PERM-01; TS-PERM-10
- [ ] API-M02-33 (1) — **Tasks:** T-1A.16-M24-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-15

**M03 Organisation & locations — 11 endpoints**

- [ ] API-M03-01…06, API-M03-08…09 (8) — **Tasks:** T-1A.2-M03-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-06, TS-PERM-11
- [ ] API-M03-10…11 (2) — **Tasks:** T-1A.3-M24-01 · **Verify:** TS-API-01, TS-PERM-01; TS-FE-03, TS-PERM-11, TS-ADM-15
- [ ] API-M03-07 (1) — **Tasks:** T-1A.6-M03-01 · **Verify:** TS-API-01, TS-PERM-01

**M04 Catalog — 41 endpoints**

- [ ] API-M04-22…29, API-M04-40…41 (10) — **Tasks:** T-1A.4-M04-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-15, TS-UNIT-07
- [ ] API-M04-15…19, API-M04-21 (6) — **Tasks:** T-1A.4-M04-04 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-15, TS-API-04
- [ ] API-M04-20, API-M04-39 (2) — **Tasks:** T-1A.4-M04-05 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-04, TS-PERM-14
- [ ] API-M04-01…02, API-M04-04 (3) — **Tasks:** T-1A.4-M04-06 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-01…02
- [ ] API-M04-05 (1) — **Tasks:** T-1A.4-M04-07 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M04-03 (1) — **Tasks:** T-1A.5-M04-01 · **Verify:** TS-API-01, TS-PERM-01; TS-API-07, TS-PERM-05, TS-SVC-09
- [ ] API-M04-06 (1) — **Tasks:** T-1A.6-M04-01 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M04-11…13 (3) — **Tasks:** T-1A.9-M04-01 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M04-07…10 (4) — **Tasks:** T-1A.12-M04-01 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M04-14 (1) — **Tasks:** T-1A.13-M20-05 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M04-30…38 (9) — **Tasks:** T-1B.2-M04-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-15, TS-API-08

**M05 Pricing — 24 endpoints**

- [ ] API-M05-10…16 (7) — **Tasks:** T-1A.5-M05-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-16, TS-API-04
- [ ] API-M05-17…19, API-M05-24 (4) — **Tasks:** T-1A.5-M05-04 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14, TS-UNIT-01
- [ ] API-M05-20…21 (2) — **Tasks:** T-1A.5-M05-05 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-16, TS-PERM-09…10
- [ ] API-M05-22…23 (2) — **Tasks:** T-1A.7-M05-01 · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M05-04 (1) — **Tasks:** T-1A.8-M08-06 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-10, TS-PERM-02/05
- [ ] API-M05-01…02 (2) — **Tasks:** T-1A.9-M05-01 · **Verify:** TS-API-01, TS-PERM-01; TS-API-09…10
- [ ] API-M05-03, API-M05-06…09 (5) — **Tasks:** T-1A.9-M05-03 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-03
- [ ] API-M05-05 (1) — **Tasks:** T-1A.15-M18-03 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-10, TS-SEC-10, TS-PERF-05

**M06 Inventory — 32 endpoints**

- [ ] API-M06-03…04, API-M06-11 (3) — **Tasks:** T-1A.6-M06-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-02, TS-UNIT-05, TS-DB-03…04/07
- [ ] API-M06-05…08 (4) — **Tasks:** T-1A.6-M06-04 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-03
- [ ] API-M06-02, API-M06-09, API-M06-31 (3) — **Tasks:** T-1A.6-M06-05 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-02
- [ ] API-M06-10 (1) — **Tasks:** T-1A.6-M06-06 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M06-12…17 (6) — **Tasks:** T-1A.6-M06-07 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-05
- [ ] API-M06-18…23, API-M06-32 (7) — **Tasks:** T-1A.6-M06-08 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-06, TS-PERM-09
- [ ] API-M06-30 (1) — **Tasks:** T-1A.7-M07-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-09
- [ ] API-M06-24…25 (2) — **Tasks:** T-1A.9-M06-01 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-05, TS-ERP-01/07, TS-SVC-11
- [ ] API-M06-01 (1) — **Tasks:** T-1A.11-M12-08 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M06-26…29 (4) — **Tasks:** T-1B.2-M06-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-08, TS-INT-06

**M07 Purchasing & receiving — 23 endpoints**

- [ ] API-M07-18…19, API-M07-22…23 (4) — **Tasks:** T-1A.7-M07-02 · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M07-01…02 (2) — **Tasks:** T-1A.7-M07-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-09
- [ ] API-M07-03…08, API-M07-21 (7) — **Tasks:** T-1A.7-M07-04 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-09, TS-PERM-14
- [ ] API-M07-09…13, API-M07-20 (6) — **Tasks:** T-1A.7-M07-05 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-04, TS-SVC-01, TS-API-03
- [ ] API-M07-14…17 (4) — **Tasks:** T-1A.7-M07-07 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-09

**M08 Customers & business accounts — 50 endpoints**

- [ ] API-M08-01…08 (8) — **Tasks:** T-1A.8-M08-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-09, TS-AUTH-06, TS-UNIT-07
- [ ] API-M08-09…10 (2) — **Tasks:** T-1A.8-M08-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-09, TS-SVC-05
- [ ] API-M08-12…13, API-M08-44…45 (4) — **Tasks:** T-1A.8-M08-04 · **Verify:** TS-API-01, TS-PERM-01; TS-DB-06
- [ ] API-M08-20…23 (4) — **Tasks:** T-1A.8-M08-05 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-10, TS-INT-08
- [ ] API-M08-24…27, API-M08-50 (5) — **Tasks:** T-1A.8-M08-06 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-10, TS-PERM-02/05
- [ ] API-M08-28…30, API-M08-33…36, API-M08-38…40 (10) — **Tasks:** T-1A.8-M08-07 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-17, TS-PERM-10
- [ ] API-M08-31…32 (2) — **Tasks:** T-1A.8-M08-09 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M08-37 (1) — **Tasks:** T-1A.8-M08-10 `(C)` · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M08-49 (1) — **Tasks:** T-1A.9-M10-06 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-AUTH-07, TS-E2E-11
- [ ] API-M08-46…48 (3) — **Tasks:** T-1A.9-M08-01 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-10
- [ ] API-M08-16…18 (3) — **Tasks:** T-1A.9-M09-09 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M08-14…15, API-M08-41…43 (5) — **Tasks:** T-1A.12-M08-01 `(C)` · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M08-11, API-M08-19 (2) — **Tasks:** T-1A.13-M20-05 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14

**M09 Storefront web application — 2 endpoints**

- [ ] API-M09-01 (1) — **Tasks:** T-1A.9-M09-02 · **Verify:** TS-API-01, TS-PERM-01; TS-FE-02
- [ ] API-M09-02 (1) — **Tasks:** T-1A.9-M09-10 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14

**M10 Cart, checkout & orders — 26 endpoints**

- [ ] API-M10-01…05, API-M10-25 (6) — **Tasks:** T-1A.9-M10-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-04
- [ ] API-M10-06…08 (3) — **Tasks:** T-1A.9-M10-03 · **Verify:** TS-API-01, TS-PERM-01; TS-API-03/09, TS-ECOM-05, TS-ERP-01, TS-DB-03
- [ ] API-M10-13…15, API-M10-17 (4) — **Tasks:** T-1A.9-M10-04, T-1A.11-M12-02 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-04, TS-ERR-01
- [ ] API-M10-09 (1) — **Tasks:** T-1A.9-M10-05 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-07
- [ ] API-M10-10…12 (3) — **Tasks:** T-1A.9-M10-06 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-AUTH-07, TS-E2E-11
- [ ] API-M10-16 (1) — **Tasks:** T-1A.9-M10-07 `(C)` · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M10-23 (1) — **Tasks:** T-1A.12-M13-04 · **Verify:** TS-API-01, TS-PERM-01; TS-E2E-09, TS-ERP-12
- [ ] API-M10-24 (1) — **Tasks:** T-1A.12-M10-01 `(C)` · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M10-18…22 (5) — **Tasks:** T-1A.13-M10-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-11, TS-AUTH-07
- [ ] API-M10-26 (1) — **Tasks:** T-1A.15-M10-01 · **Verify:** TS-API-01, TS-PERM-01; TS-MIG-06

**M11 Payments, refunds & reconciliation — 22 endpoints**

- [ ] API-M11-01…02, API-M11-22 (3) — **Tasks:** T-1A.10-M11-01 · **Verify:** TS-API-01, TS-PERM-01; TS-API-03, TS-FE-08, TS-ECOM-05
- [ ] API-M11-03, API-M11-07 (2) — **Tasks:** T-1A.10-M11-02 · **Verify:** TS-API-01, TS-PERM-01; TS-API-06, TS-INT-01, TS-UNIT-09
- [ ] API-M11-04…06 (3) — **Tasks:** T-1A.10-M11-04 · **Verify:** TS-API-01, TS-PERM-01; TS-INT-01, TS-ERR-01
- [ ] API-M11-08…12 (5) — **Tasks:** T-1A.10-M11-05 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-13, TS-INT-01, TS-PERM-08, TS-ECOM-07
- [ ] API-M11-19 (1) — **Tasks:** T-1A.10-M11-06 · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M11-13…17 (5) — **Tasks:** T-1A.10-M11-07 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-INT-09, TS-ERP-14
- [ ] API-M11-18 (1) — **Tasks:** T-1A.10-M11-08 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M11-20…21 (2) — **Tasks:** T-1A.15-M11-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-14

**M12 Fulfilment & shipping — 21 endpoints**

- [ ] API-M12-01 (1) — **Tasks:** T-1A.9-M12-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-05, TS-INT-02
- [ ] API-M12-03…04, API-M12-06 (3) — **Tasks:** T-1A.11-M12-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-10
- [ ] API-M12-07…09 (3) — **Tasks:** T-1A.11-M12-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-03/10
- [ ] API-M12-10 (1) — **Tasks:** T-1A.11-M19-01 · **Verify:** TS-API-01, TS-PERM-01; TS-DB-02, TS-ADM-14
- [ ] API-M12-11…13 (3) — **Tasks:** T-1A.11-M12-04 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-11, TS-INT-02, TS-ERR-03
- [ ] API-M12-15 (1) — **Tasks:** T-1A.11-M12-05 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-10, TS-SVC-01
- [ ] API-M12-16…18 (3) — **Tasks:** T-1A.11-M12-06 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-09, TS-ERP-11, TS-API-06
- [ ] API-M12-05, API-M12-14 (2) — **Tasks:** T-1A.11-M12-07 `(C)` · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M12-19 (1) — **Tasks:** T-1A.11-M12-08 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M12-20 (1) — **Tasks:** T-1A.11-M12-09 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M12-21 (1) — **Tasks:** T-1A.11-M12-10 `(C)` · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M12-02 (1) — **Tasks:** T-1A.12-M13-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-08, TS-ERP-12, TS-UNIT-04

**M13 Returns, RMA & warranty — 18 endpoints**

- [ ] API-M13-01…02 (2) — **Tasks:** T-1A.12-M13-01 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-08
- [ ] API-M13-03…09 (7) — **Tasks:** T-1A.12-M13-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-08, TS-ERP-12, TS-UNIT-04
- [ ] API-M13-10…11 (2) — **Tasks:** T-1A.12-M13-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-12
- [ ] API-M13-12…13, API-M13-18 (3) — **Tasks:** T-1A.12-M13-05 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-08, TS-ERP-12
- [ ] API-M13-14…16 (3) — **Tasks:** T-1A.12-M13-06 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-08, TS-ERP-12
- [ ] API-M13-17 (1) — **Tasks:** T-1A.12-M13-07 `(C)` · **Verify:** TS-API-01, TS-PERM-01

**M14 Vendor portal & vendor management — 69 endpoints**

- [ ] API-M14-57…58 (2) — **Tasks:** T-1A.8-M08-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-09, TS-SVC-05
- [ ] API-M14-66 (1) — **Tasks:** T-1A.8-M08-07, T-1B.1-M14-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-17, TS-PERM-10
- [ ] API-M14-01, API-M14-45…50, API-M14-67…68 (9) — **Tasks:** T-1B.1-M14-03 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-01
- [ ] API-M14-02, API-M14-36…38 (4) — **Tasks:** T-1B.1-M14-04 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-05, TS-PERM-02…04
- [ ] API-M14-33…35, API-M14-41…44, API-M14-52, API-M14-59, API-M14-69 (10) — **Tasks:** T-1B.1-M14-05 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-09
- [ ] API-M14-04…12 (9) — **Tasks:** T-1B.1-M14-06 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-02, TS-FE-04
- [ ] API-M14-54, API-M14-56 (2) — **Tasks:** T-1B.1-M14-07 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-02, TS-PERM-14
- [ ] API-M14-51 (1) — **Tasks:** T-1B.1-M14-08 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-10, TS-PERM-12
- [ ] API-M14-23…24, API-M14-31…32 (4) — **Tasks:** T-1B.1-M14-09 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-06/08
- [ ] API-M14-25…26 (2) — **Tasks:** T-1B.1-M14-10 `(C)` · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M14-39…40 (2) — **Tasks:** T-1B.1-M14-11 · **Verify:** TS-API-01, TS-PERM-01
- [ ] API-M14-03, API-M14-53, API-M14-60 (3) — **Tasks:** T-1B.1-M14-12 · **Verify:** TS-API-01, TS-PERM-01; TS-FE-04
- [ ] API-M14-55 (1) — **Tasks:** T-1B.1-M14-13 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-11
- [ ] API-M14-18…22, API-M14-61 (6) — **Tasks:** T-1B.2-M14-01 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-04, TS-AUTH-09
- [ ] API-M14-13…17 (5) — **Tasks:** T-1B.2-M14-02 · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-03
- [ ] API-M14-27…30, API-M14-62…65 (8) — **Tasks:** T-1B.4-M14-01 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-VEN-07

**M16 Support & WhatsApp — 20 endpoints**

- [ ] API-M16-11 (1) — **Tasks:** T-1A.13-M20-05, T-1A.13-M16-02 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14
- [ ] API-M16-01…02, API-M16-14…16 (5) — **Tasks:** T-1A.13-M16-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-12
- [ ] API-M16-03…09, API-M16-12…13, API-M16-19 (10) — **Tasks:** T-1A.13-M16-02, T-1B.3-M16-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-12, TS-ERP-18, TS-PERM-06
- [ ] API-M16-20 (1) — **Tasks:** T-1A.13-M09-01 · **Verify:** TS-API-01, TS-PERM-01; TS-FE-02, TS-ECOM-12
- [ ] API-M16-10 (1) — **Tasks:** T-1B.3-M23-01 · **Verify:** TS-API-01, TS-PERM-01; TS-INT-03, TS-API-06
- [ ] API-M16-17…18 (2) — **Tasks:** T-1B.3-M16-05 · **Verify:** TS-API-01, TS-PERM-01; TS-INT-03

**M17 Automation, exceptions, approvals & delegation — 26 endpoints**

- [ ] API-M17-02…03 (2) — **Tasks:** T-1A.2-M17-01, T-1B.1-M14-07 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-04/10, TS-PERM-08…09
- [ ] API-M17-08…13 (6) — **Tasks:** T-1A.14-M17-01 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-07, TS-ADM-11
- [ ] API-M17-15…17 (3) — **Tasks:** T-1A.14-M17-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ERR-06, TS-SVC-02
- [ ] API-M17-14 (1) — **Tasks:** T-1A.14-M17-04 · **Verify:** TS-API-01, TS-PERM-01; TS-ERR-05
- [ ] API-M17-05…07 (3) — **Tasks:** T-1A.14-M17-05 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-06/11
- [ ] API-M17-01, API-M17-04 (2) — **Tasks:** T-1A.14-M17-06 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-10, TS-PERM-09
- [ ] API-M17-18…19 (2) — **Tasks:** T-1A.14-M17-07 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-03, TS-PERM-09
- [ ] API-M17-20…24 (5) — **Tasks:** T-1A.14-M17-08 · **Verify:** TS-API-01, TS-PERM-01; TS-PERM-07/13, TS-ADM-04
- [ ] API-M17-25…26 (2) — **Tasks:** T-1A.14-M17-09 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-10

**M18 Reporting & exports — 19 endpoints**

- [ ] API-M18-12 (1) — **Tasks:** T-1A.14-M18-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-10
- [ ] API-M18-01…02, API-M18-17…18 (4) — **Tasks:** T-1A.15-M18-01 · **Verify:** TS-API-01, TS-PERM-01; TS-UNIT-11, TS-ERP-19, TS-PERM-11
- [ ] API-M18-03…05 (3) — **Tasks:** T-1A.15-M18-03 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-10, TS-SEC-10, TS-PERF-05
- [ ] API-M18-06…10 (5) — **Tasks:** T-1A.15-M18-04 · **Verify:** TS-API-01, TS-PERM-01; TS-ERP-19
- [ ] API-M18-13…14, API-M18-19 (3) — **Tasks:** T-1A.15-M18-05 · **Verify:** TS-API-01, TS-PERM-01; TS-FE-03
- [ ] API-M18-16 (1) — **Tasks:** T-1A.15-M18-06 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-FE-03
- [ ] API-M18-11 (1) — **Tasks:** T-1A.16-M24-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-13
- [ ] API-M18-15 (1) — **Tasks:** T-1A.16-M24-03 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-15

**M19 Finance boundary & accounting export — 12 endpoints**

- [ ] API-M19-01…02, API-M19-09…12 (6) — **Tasks:** T-1A.11-M19-01, T-1A.15-M19-01 · **Verify:** TS-API-01, TS-PERM-01; TS-DB-02, TS-ADM-14
- [ ] API-M19-06…08 (3) — **Tasks:** T-1A.15-M19-01 · **Verify:** TS-API-01, TS-PERM-01; TS-INT-05, TS-ERP-14, TS-DB-02
- [ ] API-M19-03…05 (3) — **Tasks:** T-1A.15-M19-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-10

**M20 Notifications — 9 endpoints**

- [ ] API-M20-03…05 (3) — **Tasks:** T-1A.13-M20-01 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-05, TS-INT-04
- [ ] API-M20-01…02, API-M20-08…09 (4) — **Tasks:** T-1A.13-M20-03, T-1B.1-M14-12 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-05
- [ ] API-M20-06…07 (2) — **Tasks:** T-1A.13-M20-05 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-14

**M21 Search — 4 endpoints**

- [ ] API-M21-01…04 (4) — **Tasks:** T-1A.4-M21-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-01, TS-SVC-09, TS-PERF-06

**M22 Files & media — 4 endpoints**

- [ ] API-M22-01…03 (3) — **Tasks:** T-1A.4-M22-01 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-08, TS-SEC-03
- [ ] API-M22-04 (1) — **Tasks:** T-1A.4-M22-02 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-08, TS-SEC-04

**M23 Integrations & adapters — 1 endpoints**

- [ ] API-M23-01 (1) — **Tasks:** T-1A.6-M23-01 `(C)` · **Verify:** TS-API-01, TS-PERM-01; TS-INT-07, TS-ERR-02

**M24 Administration & settings — 14 endpoints**

- [ ] API-M24-01…02 (2) — **Tasks:** T-1A.2-M24-01, T-1A.16-M24-01 · **Verify:** TS-API-01, TS-PERM-01; TS-SVC-04, TS-ADM-12
- [ ] API-M24-03…06, API-M24-10 (5) — **Tasks:** T-1A.2-M24-02, T-1A.16-M24-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-07, TS-INT-10, TS-PERM-10
- [ ] API-M24-07…09, API-M24-11 (4) — **Tasks:** T-1A.16-M24-01, T-1A.16-M24-02, T-1A.17-M26-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-07…08/12, TS-SVC-04
- [ ] API-M24-12…13 (2) — **Tasks:** T-1A.16-M24-02 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-13
- [ ] API-M24-14 (1) — **Tasks:** T-1A.16-M26-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ADM-08

**M27 SEO & discoverability — 2 endpoints**

- [ ] API-M27-01…02 (2) — **Tasks:** T-1A.4-M27-01 · **Verify:** TS-API-01, TS-PERM-01; TS-ECOM-13

### 6.3 Webhooks and machine-to-machine endpoints

- [ ] API-M11-03 payment-provider webhook (signed payment/refund events) — **Tasks:** T-1A.10-M23-01, T-1A.10-M11-02 · **Decisions:** D-012 · **Verify:** TS-API-06, TS-INT-01, T07, T08
- [ ] API-M12-16 shipping-provider webhook (carrier status events) — **Tasks:** T-1A.11-M23-01, T-1A.11-M12-06 · **Decisions:** D-013 · **Verify:** TS-API-06, TS-INT-02, TS-UNIT-09
- [ ] API-M16-10 WhatsApp webhook (inbound messages and delivery statuses) — **Tasks:** T-1B.3-M23-01 · **Decisions:** D-014 · **Verify:** TS-API-06, TS-INT-03
- [ ] API-M20-05 messaging-provider webhook (email/SMS delivery status) — **Tasks:** T-1A.2-M23-02, T-1A.13-M20-01 · **Decisions:** D-015 · **Verify:** TS-API-06, TS-INT-04
- [ ] API-M23-01 legacy POS / branch stock events through a supported interface `(C)` — **Tasks:** T-1A.6-M23-01 · **Decisions:** D-009, D-030 · **Verify:** TS-INT-07, T05
- [ ] API-M14-18…22 vendor availability by portal, CSV and API key (incl. key rotation) — **Tasks:** T-1B.2-M14-01 · **Decisions:** D-083, D-202 · **Verify:** TS-VEN-04, TS-AUTH-09, TS-INT-06
- [ ] All webhooks: raw-body signature verified before parsing; persisted and deduplicated on provider event id; only legal transitions applied; missing/late events closed by scheduled reconciliation (`06` §1.8) — **Tasks:** T-1A.10-M11-02, T-1A.10-M11-04, T-1A.11-M12-06, T-1A.13-M20-01, T-1B.3-M23-01 · **Verify:** TS-API-06, TS-PERM-04 (webhook forgery)

---

## 7. Integrations (each gated by its decision)

An integration is complete when its adapter passes the integration contract checklist (BP §16.4; TS-INT-10) in the
provider sandbox, fault-injection cases (timeout, duplicate, out-of-order, lost response) pass (`16` §8.1), production
credentials are held per environment (T-1A.2-M24-02) and the go-live prerequisite G4 is evidenced for enabled features.

- [ ] Adapter framework: contract checklist, integration-event logging, timeouts and retries through the outbox, reconciliation hooks — **Tasks:** T-1A.2-M23-01, T-1A.2-M24-02 · **Verify:** TS-INT-10, TS-SVC-04, TS-ADM-07
- [ ] **Email / SMS / OTP** provider: OTP and invitation messages; A14 notifications; delivery-status intake — **Tasks:** T-1A.2-M02-05, T-1A.2-M23-02, T-1A.13-M20-01, T-1A.13-M20-02 · **Decisions:** D-015 · **Verify:** TS-INT-04, TS-AUTH-01, TS-SVC-05, T25
- [ ] **Payment** provider: hosted collection, status query, webhooks, refunds and refund status, provider reconciliation — **Tasks:** T-1A.10-M23-01, T-1A.10-M11-01, T-1A.10-M11-02, T-1A.10-M11-04, T-1A.10-M11-05 · **Decisions:** D-012 · **Verify:** TS-INT-01, TS-PROOF-05, T06, T07, T08, T09, T18, T19; G4
- [ ] Payment settlement import and matching (A10) `(C)` — **Tasks:** T-1A.10-M11-07 · **Decisions:** D-064 · **Verify:** TS-INT-09
- [ ] Cash on delivery and courier COD remittance `(C)` — **Tasks:** T-1A.10-M11-08 · **Decisions:** D-020 · **Verify:** TS-INT-09
- [ ] **Shipping** provider: PIN serviceability and delivery options — **Tasks:** T-1A.9-M12-01 · **Decisions:** D-013, D-162 · **Verify:** TS-INT-02, TS-ECOM-05
- [ ] **Shipping** provider: booking with deduplication and manual fallback, labels, tracking webhooks and polling, reverse pickup — **Tasks:** T-1A.11-M23-01, T-1A.11-M12-04, T-1A.11-M12-06, T-1A.12-M13-02 · **Decisions:** D-013 · **Verify:** TS-INT-02, TS-ERP-11, TS-ERR-03, T20; G4
- [ ] **WhatsApp** Level 1: click-to-chat entry points with shared order references — **Tasks:** T-1A.13-M16-03 · **Decisions:** D-014 · **Verify:** TS-ECOM-12
- [ ] **WhatsApp** Level 2: Business Platform / Cloud API adapter, 24-hour window, templates, shared inbox, guided ordering, verified status, WhatsApp notifications with opt-out — **Tasks:** T-1B.3-M23-01, T-1B.3-M16-01, T-1B.3-M16-02, T-1B.3-M16-03, T-1B.3-M16-05, T-1B.3-M20-01 · **Decisions:** D-014, D-058 · **Verify:** TS-INT-03, T23, T24, T25; G4
- [ ] **Accounting export** (file or API): batches with control totals, per-document status, retries with the same keys, acknowledgement import — **Tasks:** T-1A.15-M19-01 · **Decisions:** D-011 · **Verify:** TS-INT-05, T18, T27, TS-PROOF-10; G6
- [ ] **Legacy ERP / POS** stock events through a supported interface (shared stock authority) `(C)` — **Tasks:** T-1A.6-M23-01 · **Decisions:** D-009, D-030 · **Verify:** TS-INT-07, T05
- [ ] **Legacy systems** data exports for migration and read-only history after cutover — **Tasks:** T-1A.17-M25-01, T-1A.17-M25-06 · **Decisions:** D-009, D-038 · **Verify:** TS-MIG-01…08
- [ ] **Supplier feeds**: versioned product/availability files or APIs, SSRF-safe fetch, supplier-code mapping, freshness — **Tasks:** T-1B.2-M23-01, T-1B.2-M04-02, T-1B.2-M06-01, T-1B.2-M14-01 · **Decisions:** D-057, D-028 · **Verify:** TS-INT-06, TS-SEC-04, T14
- [ ] GSTIN verification source for dealer applications — **Tasks:** T-1A.8-M08-05 · **Decisions:** D-067 · **Verify:** TS-INT-08
- [ ] Object storage, CDN and malware scanning for files and media — **Tasks:** T-1A.4-M22-01, T-1A.4-M22-02 · **Decisions:** D-033, D-112 · **Verify:** TS-SVC-08, TS-SEC-03
- [ ] Warehouse/counter devices (label/invoice printers, scale, bench camera) `(C)` — **Tasks:** T-1A.11-M12-10 · **Decisions:** D-147 · **Verify:** TS-ECOM-14
- [ ] Selected 1B integrations (BP §5.1), each passing the contract checklist `(C)` — **Tasks:** T-1B.4-M23-01 · **Decisions:** D-212 · **Verify:** TS-INT-10
- [ ] Integration health checks for all enabled adapters on P-E15 #integrations — **Tasks:** T-1A.16-M24-01 · **Verify:** TS-ADM-07

---

## 8. Testing

### 8.1 BP critical acceptance suite T01–T36 (BP §23.1; `12` §7; `16` §6)

Ticked when the pass-at gate is `COMPLETED` with the test recorded as passed in `STATE.md` §11 (automated in
`tests/acceptance/` where possible) and accepted in UAT.

- [ ] **T01** Guest browses refurbished laptop — passes at 1A.9 (T-1A.9-M10-09) — **Tasks:** T-0-M04-01, T-1A.6-M06-05, T-1A.9-M09-05, T-1A.9-M09-06, T-1A.9-M10-09 · **Verify:** T01 automated/UAT evidence
- [ ] **T02** Dealer sees authorised price; public cannot — passes at 1A.9 (T-1A.9-M10-09) — **Tasks:** T-0-M05-01, T-1A.5-M04-01, T-1A.8-M08-06, T-1A.8-M08-12, T-1A.9-M10-09 · **Verify:** T02 automated/UAT evidence
- [ ] **T03** Dealer quantity crosses tier threshold — passes at 1A.9 (T-1A.9-M10-09) — **Tasks:** T-0-M05-01, T-0-M05-04, T-1A.5-M05-02, T-1A.5-M05-09, T-1A.9-M10-02, T-1A.9-M10-09 · **Verify:** T03 automated/UAT evidence
- [ ] **T04** Two sessions buy the last unit — passes at 1A.9 (T-1A.9-M10-09) — **Tasks:** T-0-M06-01, T-1A.9-M06-01, T-1A.9-M10-03, T-1A.9-M09-07, T-1A.9-M10-09 · **Verify:** T04 automated/UAT evidence
- [ ] **T05** Branch sale competes with online sale — passes at 1A.13 (T-1A.13-M16-05) — **Tasks:** T-0-M06-01, T-1A.6-M23-01, T-1A.13-M10-01, T-1A.13-M16-05 · **Verify:** T05 automated/UAT evidence
- [ ] **T06** Buyer repeats order request — passes at 1A.10 (T-1A.10-M11-10) — **Tasks:** T-1A.9-M10-03, T-1A.9-M09-07, T-1A.9-M10-09, T-1A.10-M11-01, T-1A.10-M11-10 · **Verify:** T06 automated/UAT evidence
- [ ] **T07** Payment callback duplicated — passes at 1A.11 (T-1A.11-M12-12) — **Tasks:** T-0-M11-01, T-1A.10-M11-02, T-1A.10-M11-10, T-1A.11-M12-12 · **Verify:** T07 automated/UAT evidence
- [ ] **T08** Payment events out of order — passes at 1A.10 (T-1A.10-M11-10) — **Tasks:** T-0-M11-01, T-1A.10-M11-02, T-1A.10-M11-10 · **Verify:** T08 automated/UAT evidence
- [ ] **T09** Payment after reservation expiry — passes at 1A.14 (exception visible, T-1A.14-M17-12) — **Tasks:** T-1A.10-M11-03, T-1A.10-M11-10, T-1A.14-M17-12 · **Verify:** T09 automated/UAT evidence
- [ ] **T10** Price / buyer-type tampering — passes at 1A.9 (T-1A.9-M10-09) — **Tasks:** T-1A.2-M02-09, T-1A.9-M05-01, T-1A.9-M10-03, T-1A.9-M09-07, T-1A.9-M10-09 · **Verify:** T10 automated/UAT evidence
- [ ] **T11** Vendor edits another vendor's ID — passes at 1B.1 (T-1B.1-M14-15) — **Tasks:** T-0-M14-01, T-1B.1-M14-04, T-1B.1-M14-15, T-1B.5-M25-01 · **Verify:** T11 automated/UAT evidence
- [ ] **T12** Vendor submits new listing — passes at 1B.1 (T-1B.1-M14-15) — **Tasks:** T-0-M14-01, T-1B.1-M14-06, T-1B.1-M14-07, T-1B.1-M14-15, T-1B.5-M25-01 · **Verify:** T12 automated/UAT evidence
- [ ] **T13** Vendor edits approved warranty — passes at 1B.1 (T-1B.1-M14-15) — **Tasks:** T-0-M14-01, T-1B.1-M14-06, T-1B.1-M14-07, T-1B.1-M14-15, T-1B.5-M25-01 · **Verify:** T13 automated/UAT evidence
- [ ] **T14** Supplier feed becomes stale — passes at 1B.2 (T-1B.2-M04-04) — **Tasks:** T-1B.2-M06-01, T-1B.2-M14-01, T-1B.2-M04-04, T-1B.5-M25-01 · **Verify:** T14 automated/UAT evidence
- [ ] **T15** Partial receipt with wrong serial — passes at 1A.7 (T-1A.7-M07-10) — **Tasks:** T-0-M06-01, T-1A.7-M07-05, T-1A.7-M07-10 · **Verify:** T15 automated/UAT evidence
- [ ] **T16** Transfer only partly received — passes at 1A.6 (T-1A.6-M06-12) — **Tasks:** T-1A.6-M06-07, T-1A.6-M06-12 · **Verify:** T16 automated/UAT evidence
- [ ] **T17** Returned laptop to quarantine — passes at 1A.12 (T-1A.12-M13-09) — **Tasks:** T-0-M13-01, T-1A.11-M12-03, T-1A.12-M13-03, T-1A.12-M13-09 · **Verify:** T17 automated/UAT evidence
- [ ] **T18** Duplicate refund command — passes at 1A.15 (accounting effect, T-1A.15-M18-08) — **Tasks:** T-1A.10-M11-05, T-1A.10-M11-10, T-1A.12-M13-04, T-1A.12-M13-09, T-1A.15-M19-01, T-1A.15-M18-08 · **Verify:** T18 automated/UAT evidence
- [ ] **T19** Refund provider times out — passes at 1A.10 (T-1A.10-M11-10) — **Tasks:** T-1A.10-M11-05, T-1A.10-M11-10, T-1A.12-M13-09 · **Verify:** T19 automated/UAT evidence
- [ ] **T20** Shipping booking response lost — passes at 1A.11 (T-1A.11-M12-12) — **Tasks:** T-1A.11-M23-01, T-1A.11-M12-04, T-1A.11-M12-12 · **Verify:** T20 automated/UAT evidence
- [ ] **T21** Worker stops after order commit — passes at 1A.14 (T-1A.14-M17-12) — **Tasks:** T-0-M17-03, T-1A.1-M17-01, T-1A.10-M11-04, T-1A.11-M12-12, T-1A.14-M17-03, T-1A.14-M17-12 · **Verify:** T21 automated/UAT evidence
- [ ] **T22** Dealer signs out; no private-price leakage — passes at 1A.9 (T-1A.9-M10-09) — **Tasks:** T-0-M05-01, T-1A.5-M04-01, T-1A.9-M09-04, T-1A.9-M10-09 · **Verify:** T22 automated/UAT evidence
- [ ] **T23** Chat customer asks for another person's order — passes at 1A.13 web (T-1A.13-M16-05); 1B.3 WhatsApp (T-1B.3-M16-06) — **Tasks:** T-1A.13-M16-02, T-1A.13-M16-05, T-1B.3-M16-03, T-1B.3-M16-06 · **Verify:** T23 automated/UAT evidence
- [ ] **T24** WhatsApp bot cannot resolve — passes at 1B.3 (T-1B.3-M16-06) — **Tasks:** T-1B.3-M16-04, T-1B.3-M16-06, T-1B.5-M25-01 · **Verify:** T24 automated/UAT evidence
- [ ] **T25** Opted-out customer meets reminder rule — passes at 1A.13 (T-1A.13-M16-05); WhatsApp 1B.3 — **Tasks:** T-1A.8-M08-03, T-1A.13-M20-02, T-1A.13-M20-04, T-1A.13-M16-05, T-1B.3-M20-01, T-1B.3-M16-06 · **Verify:** T25 automated/UAT evidence
- [ ] **T26** Mixed valid/invalid import rows — passes at 1B.2 (T-1B.2-M04-04) — **Tasks:** T-1B.2-M04-01, T-1B.2-M14-02, T-1B.2-M04-04, T-1B.5-M25-01 · **Verify:** T26 automated/UAT evidence
- [ ] **T27** Accountant reconciles a test trading day — passes at 1A.15 (T-1A.15-M18-08) — **Tasks:** T-0-M11-01, T-1A.15-M19-01, T-1A.15-M11-01, T-1A.15-M18-08 · **Verify:** T27 automated/UAT evidence
- [ ] **T28** Backup restoration rehearsal — passes at 1A.17 (T-1A.17-M26-01) — **Tasks:** T-0-M26-04, T-1A.17-M26-01 · **Verify:** T28 automated/UAT evidence
- T29 Mobile web/app checkout — `LATER` (Phase 2, not a Phase 1 gate) — see §11
- [ ] **T30** Keyboard-only key flow — passes at 1A.17 (T-1A.17-M09-01) — **Tasks:** T-1A.3-M09-06, T-1A.17-M09-01 · **Verify:** T30 automated/UAT evidence
- [ ] **T31** Owner unavailable for routine operations — passes at 1A.14 (T-1A.14-M17-12) — **Tasks:** T-1A.14-M17-08, T-1A.14-M17-12 · **Verify:** T31 automated/UAT evidence
- [ ] **T32** Old product URL after migration — passes at 1A.17 (T-1A.17-M27-01) — **Tasks:** T-1A.3-M09-04, T-1A.17-M27-01 · **Verify:** T32 automated/UAT evidence
- [ ] **T33** Product/price change after an order — passes at 1A.12 (T-1A.12-M13-09) — **Tasks:** T-1A.4-M04-04, T-1A.9-M10-03, T-1A.9-M10-09, T-1A.12-M13-01, T-1A.12-M13-05, T-1A.12-M13-09 · **Verify:** T33 automated/UAT evidence
- [ ] **T34** Customer cancels one line — passes at 1A.12 (T-1A.12-M13-09) — **Tasks:** T-0-M13-01, T-1A.9-M10-05, T-1A.10-M11-05, T-1A.10-M11-10, T-1A.12-M13-04, T-1A.12-M13-09 · **Verify:** T34 automated/UAT evidence
- [ ] **T35** Large report/import during checkout — passes at 1A.17 load test (T-1A.17-M26-04); 1B.2 for imports — **Tasks:** T-1A.15-M18-03, T-1A.15-M18-08, T-1A.17-M26-04, T-1B.2-M04-04 · **Verify:** T35 automated/UAT evidence
- [ ] **T36** New ordinary category configured — passes at 1A.9 (T-1A.9-M10-09) — **Tasks:** T-1A.4-M04-02, T-1A.4-M04-09, T-1A.4-M04-10, T-1A.9-M09-05, T-1A.9-M10-09 · **Verify:** T36 automated/UAT evidence

### 8.2 Suite areas (`16` §5)

Ticked when every suite of the area named by in-scope tasks has run and passed at the stage gates listed (cadence S),
and the area's release-candidate runs (cadence R) pass on staging. Per-suite task lists: `17` Appendix C.

- [ ] **TS-UNIT-01…11** Unit (11 suites) — **Tasks:** T-1A.1-M01-10, T-1A.2-M02-09, T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.11-M12-12, T-1A.12-M13-09, T-1A.14-M17-12, T-1A.15-M18-08, T-1B.4-M17-04 · **Verify:** all 11 suites passed at the listed gates; named by 28 tasks (`17` App. C)
- [ ] **TS-SVC-01…11** Backend service (11 suites) — **Tasks:** T-1A.1-M01-10, T-1A.2-M02-09, T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.11-M12-12, T-1A.13-M16-05, T-1A.14-M17-12, T-1A.15-M18-08, T-1A.16-M24-05, T-1B.2-M04-04, T-1B.3-M16-06, T-1B.4-M17-04 · **Verify:** all 11 suites passed at the listed gates; named by 33 tasks (`17` App. C)
- [ ] **TS-FE-01…08** Frontend / component (8 suites) — **Tasks:** T-1A.3-M09-06, T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.11-M12-12, T-1A.12-M13-09, T-1A.13-M16-05, T-1A.14-M17-12, T-1A.15-M18-08, T-1A.17-M09-01, T-1B.1-M14-15 · **Verify:** all 8 suites passed at the listed gates; named by 42 tasks (`17` App. C)
- [ ] **TS-API-01…10** API / contract (10 suites) — **Tasks:** T-1A.1-M01-10, T-1A.3-M09-06, T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.11-M12-12, T-1A.12-M13-09, T-1A.13-M16-05, T-1A.14-M17-12, T-1A.15-M18-08, T-1A.16-M24-05, T-1B.1-M14-15, T-1B.2-M04-04, T-1B.3-M16-06, T-1B.4-M17-04 · **Verify:** all 10 suites passed at the listed gates; named by 32 tasks (`17` App. C)
- [ ] **TS-DB-01…08** Database (8 suites) — **Tasks:** T-1A.1-M01-10, T-1A.2-M02-09, T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.11-M12-12, T-1A.15-M18-08, T-1A.16-M24-05, T-1B.1-M14-15 · **Verify:** all 8 suites passed at the listed gates; named by 27 tasks (`17` App. C)
- [ ] **TS-INT-01…10** Integration adapters (10 suites) — **Tasks:** T-1A.2-M02-09, T-1A.6-M06-12, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.11-M12-12, T-1A.13-M16-05, T-1A.15-M18-08, T-1B.2-M04-04, T-1B.3-M16-06, T-1B.4-M17-04 · **Verify:** all 10 suites passed at the listed gates; named by 28 tasks (`17` App. C)
- [ ] **TS-AUTH-01…10** Authentication (10 suites) — **Tasks:** T-1A.1-M01-10, T-1A.2-M02-09, T-1A.3-M09-06, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.13-M16-05, T-1A.17-M02-01, T-1B.1-M14-15, T-1B.2-M04-04 · **Verify:** all 10 suites passed at the listed gates; named by 17 tasks (`17` App. C)
- [ ] **TS-PERM-01…14** Permissions (14 suites) — **Tasks:** T-1A.2-M02-09, T-1A.3-M09-06, T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.13-M16-05, T-1A.14-M17-12, T-1A.15-M18-08, T-1A.16-M24-05, T-1A.17-M26-02, T-1B.1-M14-15, T-1B.3-M16-06, T-1B.4-M17-04 · **Verify:** all 14 suites passed at the listed gates; named by 38 tasks (`17` App. C)
- [ ] **TS-ECOM-01…15** E-commerce (15 suites) — **Tasks:** T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.11-M12-12, T-1A.12-M13-09, T-1A.13-M16-05, T-1A.15-M18-08, T-1A.17-M27-01, T-1B.2-M04-04, T-1B.3-M16-06 · **Verify:** all 15 suites passed at the listed gates; named by 59 tasks (`17` App. C)
- [ ] **TS-VEN-01…11** Vendor (11 suites) — **Tasks:** T-1A.12-M13-09, T-1B.1-M14-15, T-1B.2-M04-04, T-1B.4-M17-04 · **Verify:** all 11 suites passed at the listed gates; named by 14 tasks (`17` App. C)
- TS-MKT-01…07 Marketplace — `LATER` (D-046), see §11
- [ ] **TS-ERP-01…19** ERP (19 suites) — **Tasks:** T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.8-M08-12, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.11-M12-12, T-1A.12-M13-09, T-1A.13-M16-05, T-1A.15-M18-08, T-1B.2-M04-04, T-1B.3-M16-06 · **Verify:** all 19 suites passed at the listed gates; named by 63 tasks (`17` App. C)
- [ ] **TS-ADM-01…15** Admin (15 suites) — **Tasks:** T-1A.2-M02-09, T-1A.3-M09-06, T-1A.6-M06-12, T-1A.11-M12-12, T-1A.14-M17-12, T-1A.16-M24-05, T-1B.4-M17-04, T-1B.5-M17-01 · **Verify:** all 15 suites passed at the listed gates; named by 27 tasks (`17` App. C)
- [ ] **TS-E2E-01…11** End-to-end journeys (11 suites) — **Tasks:** T-1A.7-M07-10, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.12-M13-09, T-1A.13-M16-05, T-1A.14-M17-12, T-1B.1-M14-15, T-1B.3-M16-06 · **Verify:** all 11 suites passed at the listed gates; named by 12 tasks (`17` App. C)
- [ ] **TS-ERR-01…06** Error handling (6 suites) — **Tasks:** T-1A.2-M02-09, T-1A.3-M09-06, T-1A.6-M06-12, T-1A.9-M10-09, T-1A.10-M11-10, T-1A.11-M12-12, T-1A.14-M17-12, T-1B.2-M04-04 · **Verify:** all 6 suites passed at the listed gates; named by 13 tasks (`17` App. C)
- [ ] **TS-SEC-01…12** Security (12 suites) — **Tasks:** T-1A.1-M01-10, T-1A.2-M02-09, T-1A.4-M04-10, T-1A.15-M18-08, T-1A.16-M24-05, T-1A.17-M26-02, T-1A.17-M26-03, T-1A.17-M26-07, T-1B.2-M04-04 · **Verify:** all 12 suites passed at the listed gates; named by 17 tasks (`17` App. C)
- [ ] **TS-A11Y-01…03** Accessibility (3 suites) — **Tasks:** T-1A.3-M09-06, T-1A.17-M09-01 · **Verify:** all 3 suites passed at the listed gates; named by 4 tasks (`17` App. C)
- [ ] **TS-PERF-01…07** Performance & load (7 suites) — **Tasks:** T-1A.4-M04-10, T-1A.6-M06-12, T-1A.9-M10-09, T-1A.15-M18-08, T-1A.17-M26-04, T-1A.17-M26-07, T-1B.2-M04-04 · **Verify:** all 7 suites passed at the listed gates; named by 8 tasks (`17` App. C)
- [ ] **TS-BKP-01…04** Backup & restore (4 suites) — **Tasks:** T-1A.1-M01-10, T-1A.17-M26-01, T-1A.17-M25-04, T-1A.17-M26-07 · **Verify:** all 4 suites passed at the listed gates; named by 5 tasks (`17` App. C)
- [ ] **TS-MIG-01…08** Migration rehearsal (8 suites) — **Tasks:** T-1A.4-M04-10, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.8-M08-12, T-1A.15-M18-08, T-1A.17-M25-01, T-1A.17-M02-01, T-1A.17-M27-01, T-1A.17-M25-02, T-1A.17-M25-03, T-1A.17-M25-04, T-1A.17-M25-06 · **Verify:** all 8 suites passed at the listed gates; named by 12 tasks (`17` App. C)
- [ ] **TS-REG-01…04** Regression (4 suites) — **Tasks:** T-1A.1-M01-10, T-1A.17-M26-07 · **Verify:** all 4 suites passed at the listed gates; named by 2 tasks (`17` App. C)
- [ ] **TS-PROOF-01…10** Platform proof (10 suites) — **Tasks:** T-0-M01-29, T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.10-M11-10, T-1A.12-M13-09, T-1A.14-M17-12, T-1A.15-M18-08, T-1B.1-M14-15 · **Verify:** all 10 suites passed at the listed gates; named by 17 tasks (`17` App. C)

### 8.3 User acceptance testing (`16` §13)

- [ ] UAT-WH warehouse: receive & inspect with serials, transfer, count & adjustment request, pick/pack/dispatch correct serial, returned unit to quarantine — **Tasks:** T-1A.17-M25-05 · **Verify:** T15, T16, T17, TS-E2E-10
- [ ] UAT-SALES sales/dealer: assisted order, dealer application decision, dealer bulk order, line cancellation — **Tasks:** T-1A.17-M25-05 · **Verify:** TS-E2E-02, T02, T03, T34
- [ ] UAT-FIN finance: payment reconciliation, refunds incl. duplicate and timeout, daily close, accounting export of a test trading day — **Tasks:** T-1A.17-M25-05 · **Verify:** T18, T19, T27
- [ ] UAT-SUP support (web part): help/chat handoff, verified order lookup, return request — **Tasks:** T-1A.17-M25-05 · **Verify:** T23
- [ ] UAT-OWN owner: control centre, approvals within thresholds, owner-away day, audit reconstruction — **Tasks:** T-1A.17-M25-05 · **Verify:** T31, TS-E2E-07
- [ ] UAT-CUS customer journeys: browse → buy refurbished laptop, guest order access, keyboard-only key flow — **Tasks:** T-1A.17-M25-05 · **Verify:** TS-E2E-01, T30
- [ ] UAT-WALK (1A): one real purchase receipt, one website order, one return — **Tasks:** T-1A.17-M25-05 · **Verify:** BP §31.1 walkthroughs
- [ ] UAT-VEN vendor: application, submission with correction, availability update, isolation check — **Tasks:** T-1B.5-M25-01 · **Verify:** T11–T14, TS-E2E-03
- [ ] UAT-SUP (WhatsApp) and UAT-WALK (WhatsApp order) — **Tasks:** T-1B.5-M25-01 · **Verify:** TS-E2E-05, T24, T25
- [ ] UAT evidence records (test, expected, actual, references, defect, retest, acceptance) indexed in `tests/uat/`; representatives trained before UAT — **Tasks:** T-1A.17-M26-06, T-1A.17-M25-05, T-1B.5-M25-01 · **Verify:** `16` §13.3 records complete; `16` §13.4 exit

### 8.4 Performance, security, accessibility, restore, migration rehearsal, regression, proof

- [ ] Performance and load: page experience, API p95, propagation, mixed workload, heavy-job isolation (T35), search relevance/latency, availability — **Tasks:** T-1A.15-M18-08, T-1A.17-M26-04, T-1B.2-M04-04 · **Decisions:** D-034, D-207 · **Verify:** TS-PERF-01…07, T35
- [ ] Automated security verification on staging (OWASP object/property-level authorisation, injection, uploads, SSRF, secrets, logging hygiene, encryption, CSV injection, abuse protection) — **Tasks:** T-1A.17-M26-02 · **Verify:** TS-SEC-01…11
- [ ] Independent security assessment before go-live `(C)` — **Tasks:** T-1A.17-M26-03 · **Decisions:** D-208 · **Verify:** TS-SEC-12, G13
- [ ] Dependency updates and vulnerability triage in place (periodic) — **Tasks:** T-1A.17-M26-07 · **Verify:** TS-SEC-08 (cadence P)
- [ ] Accessibility and browser acceptance of key flows (keyboard, screen reader, agreed browsers) — **Tasks:** T-1A.17-M09-01 · **Decisions:** D-206, D-051 · **Verify:** TS-A11Y-01…03, TS-FE-07, T30
- [ ] Restore rehearsal to staging against agreed recovery point/time, incl. attachments; post-restore business reconciliation — **Tasks:** T-1A.17-M26-01, T-1A.17-M25-04 · **Decisions:** D-034, D-108 · **Verify:** T28, TS-BKP-02, TS-BKP-03
- [ ] Scheduled restore rehearsal after launch — **Tasks:** T-1A.17-M26-07 · **Decisions:** D-108 · **Verify:** TS-BKP-04 (cadence P)
- [ ] Migration rehearsal: sample trial import reconciled; full dry run with measured downtime; control totals; password migration/reset; redirects; cutover verification; rollback/forward recovery; legacy read-only access — **Tasks:** T-1A.17-M02-01, T-1A.17-M27-01, T-1A.17-M25-02, T-1A.17-M25-03, T-1A.17-M25-04, T-1A.17-M25-06 · **Decisions:** D-038, D-039, D-076 · **Verify:** TS-MIG-01…08
- [ ] Regression: critical pack of all runnable T-tests (TS-REG-01) on every release candidate; module regression per task (TS-REG-02); upgrade regression (TS-REG-03); decision-change regression (TS-REG-04) — **Tasks:** T-1A.1-M01-07, T-1A.17-M26-07 · **Verify:** TS-REG-01…04
- [ ] Platform proof scenarios PS-1…PS-10 on each candidate, re-run on the chosen core — **Tasks:** T-0-M06-01, T-0-M05-01, T-0-M11-01, T-0-M13-01, T-0-M14-01, T-0-M17-03, T-1A.4-M04-10, T-1A.5-M05-09, T-1A.6-M06-12, T-1A.7-M07-10, T-1A.10-M11-10, T-1A.12-M13-09, T-1A.14-M17-12, T-1A.15-M18-08, T-1B.1-M14-15 · **Decisions:** D-001 · **Verify:** TS-PROOF-01…10
- [ ] End-to-end journeys BP §29 (TS-E2E-01…11) automated in `tests/e2e/` — **Tasks:** T-1A.9-M10-09, T-1A.10-M11-10, T-1A.12-M13-09, T-1A.13-M16-05, T-1A.14-M17-12, T-1B.1-M14-15, T-1B.3-M16-06 · **Verify:** TS-E2E-01…11
- [ ] Definition of done D1–D9 applied to every `COMPLETED` task — **Tasks:** T-1A.17-M25-05, T-1B.5-M25-01 · **Verify:** `16` §15.2 evidence in each task's Evidence field

---

## 9. Deployment

### 9.1 Environments, CI, secrets, observability, backups, release

- [ ] Development, staging and production environments defined in `infra/`, reproducible, separate accounts/credentials, TLS, masked staging data — **Tasks:** T-1A.1-M01-06 · **Decisions:** D-005, D-077, D-102, D-109 · **Verify:** clean deploy to staging from `infra/`; TS-SEC-05, TS-SEC-07
- [ ] Backend application skeleton on the chosen operational core; module packages — **Tasks:** T-1A.1-M01-02 · **Decisions:** D-001, D-002, D-109 · **Verify:** deploy smoke on staging
- [ ] CI pipeline: lint, unit/integration suites, build, migration check on an empty database, release checklist; cross-application test harness in `tests/` — **Tasks:** T-1A.1-M01-07 · **Decisions:** D-077, D-053 · **Verify:** CI green on main; TS-REG-01/02/04
- [ ] Secrets management and certificate tooling; no secrets in the repository or published site — **Tasks:** T-1A.1-M01-08, T-1A.2-M24-02 · **Decisions:** D-107, D-115 · **Verify:** TS-SEC-05, TS-SVC-04
- [ ] Observability baseline: structured logs with correlation ids, error capture, uptime and job-health checks (queue age) — **Tasks:** T-1A.1-M26-01 · **Decisions:** D-052 · **Verify:** TS-SEC-06; job-health checks (queue age) visible
- [ ] Alert catalogue: conditions, page vs daily review, named owners; routing drills — **Tasks:** T-1A.16-M26-01 · **Decisions:** D-195 · **Verify:** TS-ADM-08; every alert has an owner (BP §20.3)
- [ ] Backups: database, attachments and media; outside the primary runtime; encrypted; scheduled; first restore proof — **Tasks:** T-1A.1-M26-02 · **Decisions:** D-108 · **Verify:** TS-BKP-01; restore proof evidence in `infra/`
- [ ] Release management: reviewed code, automated critical tests, migration plan, staging verification, release notes; feature flags for integrations/customer groups; software rollback ≠ business rollback (BP §20.5) — **Tasks:** T-1A.1-M01-10, T-1A.2-M24-01 · **Decisions:** D-077 · **Verify:** release template used for every release; TS-ADM-12
- [ ] Feature flags and operational settings administered as versioned configuration — **Tasks:** T-1A.2-M24-01, T-1A.16-M24-01 · **Verify:** TS-ADM-12, TS-SVC-04
- [ ] System status: environments, backup and restore evidence, alert routing visible on P-E15 #system and the shell health card — **Tasks:** T-1A.16-M24-01, T-1A.17-M26-01 · **Decisions:** D-034, D-108 · **Verify:** TS-ADM-08
- [ ] Incident mode and automation pause (BP §20.4 containment) — **Tasks:** T-1A.14-M17-04 · **Verify:** TS-ERR-05
- [ ] Production verification / test transactions flagged and excluded from reports, metrics and accounting export — **Tasks:** T-1A.15-M10-01 · **Decisions:** D-209 · **Verify:** TS-MIG-06 (supervised transactions)
- [ ] GitHub Pages publication scope settled before implementation code is committed — **Tasks:** T-1A.1-M01-01 · **Decisions:** D-115 · **Verify:** publication check recorded (STATE §13 #2)

### 9.2 Go-live checklist (BP §23.4; `16` §14 G1–G13)

- [ ] G1 Approved scope and unresolved-item disposition — **Tasks:** T-0-M01-29, T-1A.17-M01-01 · **Decisions:** D-048 · **Verify:** signed scope; `DECISIONS.md` open items dispositioned
- [ ] G2 Signed-off product, price, warranty and return policies — **Tasks:** T-1A.4-M04-03, T-1A.5-M05-07, T-1A.17-M01-01 · **Decisions:** D-017, D-022, D-023 · **Verify:** policy versions active (API-M04-24); TS-UNIT-08
- [ ] G3 Correct opening stock and serials — **Tasks:** T-1A.6-M25-01, T-1A.17-M01-01, T-1A.17-M25-06 · **Decisions:** D-038, D-135 · **Verify:** TS-MIG-03, TS-MIG-06, TS-DB-07
- [ ] G4 Merchant, courier and WhatsApp prerequisites complete for enabled features — **Tasks:** T-1A.10-M23-01, T-1A.11-M23-01, T-1A.17-M01-01 · **Decisions:** D-012, D-013, D-014 · **Verify:** TS-INT-10 checklist per adapter
- [ ] G5 Critical payment, refund, stock, access and recovery tests passed — **Tasks:** T-1A.17-M25-05, T-1A.17-M01-01 · **Verify:** TS-REG-01; T04–T10, T18–T21, T11/T22/T23 as applicable; TS-BKP-02
- [ ] G6 Finance confirms invoice/export and reconciliation process — **Tasks:** T-1A.15-M18-08, T-1A.17-M01-01 · **Decisions:** D-011, D-055 · **Verify:** T27, TS-ERP-14, TS-INT-05
- [ ] G7 Phase 1 e-commerce and ERP web UI accepted on agreed desktop/laptop browsers — **Tasks:** T-1A.17-M09-01, T-1A.17-M01-01 · **Decisions:** D-049, D-206, D-051 · **Verify:** TS-FE-07, TS-A11Y-01…03, UAT sign-off
- [ ] G8 Staff trained with assigned responsibilities and alternate approvers — **Tasks:** T-1A.2-M02-09, T-1A.14-M17-08, T-1A.17-M26-06, T-1A.17-M01-01 · **Decisions:** D-025 · **Verify:** role assignments (S-03/S-04), delegation alternates (S-06), UAT attendance
- [ ] G9 Monitoring, backups, incident contacts and restore evidence available — **Tasks:** T-1A.16-M26-01, T-1A.17-M26-01, T-1A.17-M01-01 · **Decisions:** D-052, D-108, D-035 · **Verify:** TS-ADM-08, TS-BKP-02, alert owners
- [ ] G10 Migration rehearsal and rollback/forward-recovery plan approved — **Tasks:** T-1A.17-M25-03, T-1A.17-M25-04, T-1A.17-M01-01 · **Decisions:** D-038 · **Verify:** TS-MIG-02, TS-MIG-07
- [ ] G11 No unresolved critical defects; other known issues accepted with workaround — **Tasks:** T-1A.17-M25-05, T-1A.17-M01-01 · **Decisions:** D-035 · **Verify:** defect log (`16` §13.3)
- [ ] G12 Domain, hosting, credentials, repository and vendor accounts controlled by agreed owners — **Tasks:** T-1A.17-M26-05, T-1A.17-M01-01 · **Decisions:** D-005, D-115 · **Verify:** handover record (BP §24.2); TS-SEC-05
- [ ] G13 Security assessment result (only if D-208 requires it) `(C)` — **Tasks:** T-1A.17-M26-03, T-1A.17-M01-01 · **Decisions:** D-208 · **Verify:** TS-SEC-12

### 9.3 Cutover, hypercare and 1B release

- [ ] Cutover executed per BP §21.3 steps 5–9: freeze or final delta, final import with control totals, verification of opening stock/serials/payment references/permissions, channel switch, supervised low-risk transactions and refunds — **Tasks:** T-1A.17-M25-06 · **Decisions:** D-209, D-048 · **Verify:** TS-MIG-06, TS-MIG-08
- [ ] Hypercare (BP §21.3 step 10; §24.4): close monitoring, first-weeks review of exceptions, tickets, abandoned checkout, search failures, stock discrepancies, automation performance; legacy read-only access kept — **Tasks:** T-1A.17-M26-07 · **Decisions:** D-214, D-035 · **Verify:** hypercare review record; TS-BKP-04, TS-PERF-07, TS-REG-01
- [ ] 1B release: staging verification, rollout by feature flag and group, release notes, rollback plan — **Tasks:** T-1B.5-M26-01 · **Decisions:** D-048, D-215 · **Verify:** release evidence; UAT-VEN/SUP accepted
- [ ] First vendors onboarded through the approved route; vendor data activated — **Tasks:** T-1B.5-M14-01 · **Decisions:** D-047 · **Verify:** TS-VEN-01, T11

---

## 10. Documentation

### 10.1 Handover package (BP §24.2)

- [ ] Source repository (single repository per D-054) with ownership recorded — **Tasks:** T-1A.1-M01-01, T-1A.17-M26-05 · **Verify:** G12
- [ ] Architecture decisions (`DECISIONS.md` rows `DECIDED` with approver and date; `01`/`02` updated after D-001) — **Tasks:** T-0-M01-29, T-1A.17-M26-05 · **Verify:** decision log in STATE §6
- [ ] Configuration inventory — **Tasks:** T-1A.16-M24-05, T-1A.17-M26-05 · **Verify:** inventory produced from versioned configuration (`12` §6.17)
- [ ] Deployment instructions — **Tasks:** T-1A.1-M01-10, T-1A.17-M26-05 · **Verify:** deploy runbook used for the clean staging deploy of T-1A.1-M01-10
- [ ] Environment and account ownership — **Tasks:** T-1A.17-M26-05 · **Verify:** G12
- [ ] Data dictionary (logical `03` mapped to the physical model) — **Tasks:** T-1A.17-M26-05 · **Verify:** covers every applied migration group (TS-DB-01)
- [ ] API contracts (`06` as implemented) — **Tasks:** T-1A.17-M26-05 · **Verify:** TS-API-01 results attached
- [ ] Integration mappings per adapter — **Tasks:** T-1A.2-M23-01, T-1A.17-M26-05 · **Verify:** contract checklist per adapter (TS-INT-10)
- [ ] Backup/restore runbook — **Tasks:** T-1A.17-M26-01, T-1A.17-M26-05 · **Verify:** T28 evidence
- [ ] Monitoring guide and alert owner list — **Tasks:** T-1A.16-M26-01, T-1A.17-M26-05 · **Verify:** TS-ADM-08
- [ ] Incident procedures (BP §20.4) — **Tasks:** T-1A.14-M17-04, T-1A.17-M26-05 · **Verify:** BP §20.4 steps documented; TS-ERR-05
- [ ] Staff SOPs — **Tasks:** T-1A.17-M26-06 · **Verify:** SOP per role
- [ ] Test evidence (suites, T-tests, UAT) — **Tasks:** T-1A.17-M26-05, T-1A.17-M25-05 · **Verify:** `STATE.md` §11 and `tests/uat/` index
- [ ] Licensing inventory — **Tasks:** T-1A.17-M26-05 · **Verify:** inventory included in the handover package
- [ ] Known issues — **Tasks:** T-1A.17-M26-05 · **Verify:** `STATE.md` §13 current
- [ ] Upgrade policy (supported-version updates; extension upgrade regression) — **Tasks:** T-1A.17-M26-05 · **Verify:** TS-REG-03 defined

### 10.2 Runbooks (`infra/`)

- [ ] Deploy, rollback, migration-plan and release-notes templates — **Tasks:** T-1A.1-M01-10 · **Verify:** used for staging deploys
- [ ] Backup and restore runbook with first restore proof — **Tasks:** T-1A.1-M26-02, T-1A.17-M26-01 · **Verify:** TS-BKP-01, TS-BKP-02
- [ ] Cutover runbook: dry run, stop/go thresholds, window and responsible people — **Tasks:** T-1A.17-M25-03 · **Verify:** TS-MIG-02
- [ ] Rollback and forward-recovery plan incl. post-restore business reconciliation — **Tasks:** T-1A.17-M25-04 · **Verify:** TS-MIG-07, TS-BKP-03
- [ ] Incident runbooks and support model (severities, response targets, coverage) — **Tasks:** T-1A.17-M26-05 · **Decisions:** D-035 · **Verify:** BP §24.1 table values recorded
- [ ] Maintenance calendar (BP §24.3): version updates, security fixes, dependency review, backup checks, restore rehearsals, access review, failed-job review, provider API changes, catalog quality, cost monitoring — **Tasks:** T-1A.2-M02-08, T-1A.17-M26-05 · **Decisions:** D-035, D-108, D-194 · **Verify:** owners named (`11` §12.5)

### 10.3 SOPs and training (BP §24.2)

- [ ] Staff training by role using actual tasks; recorded walkthroughs for receipt, dispatch, return, approval and exception resolution — **Tasks:** T-1A.7-M07-10, T-1A.11-M12-12, T-1A.12-M13-09, T-1A.14-M17-12, T-1A.17-M26-06 · **Verify:** training records (G8); walkthrough recordings in the handover package
- [ ] Owner guide to the control centre and dashboard — **Tasks:** T-1A.14-M17-11, T-1A.17-M26-06 · **Verify:** guide included in the handover package
- [ ] Catalog procedure: configuring a new category and attribute template (T36) — **Tasks:** T-1A.4-M04-10 · **Verify:** T36 executed by catalog staff
- [ ] Stock-event → movement mapping and opening-stock import procedure — **Tasks:** T-1A.6-M25-01, T-1A.6-M06-12 · **Verify:** `12` §6.7 documentation row
- [ ] Receiving, dispatch and returns SOP inputs — **Tasks:** T-1A.7-M07-10, T-1A.11-M12-12, T-1A.12-M13-09 · **Verify:** SOPs published
- [ ] Permission catalogue and role matrix reconciled with seed S-03 — **Tasks:** T-1A.2-M02-09 · **Verify:** TS-ADM-02
- [ ] Component inventory and content rules in `frontend/design-system/`; D-004 screen register — **Tasks:** T-1A.3-M01-01, T-1A.3-M09-06 · **Verify:** TS-FE-01
- [ ] Report definitions (event dates, gross/net, tax basis) published with each report — **Tasks:** T-1A.15-M18-02 · **Verify:** TS-ERP-19
- [ ] BP §12.3 template completed for every activated automation rule (1A and 1B) — **Tasks:** T-1A.14-M17-02, T-1B.4-M17-02 · **Verify:** TS-SVC-07
- [ ] Approved answers and message templates as seeded (S-16) — **Tasks:** T-1A.13-M20-01, T-1B.3-M16-05 · **Verify:** TS-DB-05
- [ ] Vendor onboarding SOP and published review policy — **Tasks:** T-1B.1-M14-07, T-1B.1-M14-15 · **Verify:** TS-VEN-01
- [ ] Import templates and mapping profiles published (S-21) — **Tasks:** T-1B.2-M04-01 · **Verify:** TS-VEN-03
- [ ] 1B runbook and training updates for vendor managers and support — **Tasks:** T-1B.5-M26-01 · **Verify:** training record
- [ ] Process-improvement measurement report vs the BP §4 baseline — **Tasks:** T-0-M17-02, T-1B.4-M17-03 · **Verify:** 1B exit evidence

### 10.4 Plan and tracking records

- [ ] Phase 0 deliverable pack (requirements, current-state assessment, future-state workflows, role and permission matrix, UI direction, architecture and integration plan, migration plan, roadmap, estimate, risk and decision register) kept per D-210 in `plan/phase0/` — **Tasks:** T-0-M01-01, T-0-M01-29 · **Verify:** BP §31.2 sign-off worksheet
- [ ] `TASKS.md` statuses and Evidence complete; `STATE.md` logs current; `DECISIONS.md` rows decided with approver and date — **Tasks:** T-1A.17-M01-01, T-1B.5-M17-01 · **Verify:** `python3 plan/tools/status.py --check` reports 0 issues
- [ ] Change register maintained (BP §2.3, §25.5) — **Tasks:** T-1A.16-M24-02 · **Decisions:** D-191 · **Verify:** TS-ADM-13

---

## 11. Out of scope for Phase 1 (`LATER`) — listed only

Never started unless the owner asks (`14` step 8e). Not required to tick Phase 1 complete.

| Item | Scope task (runs only on the owner's request) | Decision |
|---|---|---|
| M15 Marketplace extension (seller agreements, commissions, settlements, payouts; DB-G11; TS-MKT-01…07; A33) | T-2-M15-01 | D-046 |
| M28 Mobile web optimisation and mobile app (T29) | T-2-M28-01, T-2-M01-01 | D-085 |
| M29 AI assistance (A34) | T-3-M29-01 | D-086 |
| Further automation A29, A30, A31, A35, A37 (P2/P3) | T-3-M17-01 | D-086 |
| Multiple storefronts / businesses | T-3-M03-01 | D-045 |
| Locked marketplace previews P-E11 #marketplace and P-V04 #marketplace — not built in Phase 1 | — | D-046 |

---

## 12. Status view (optional script — no new tool)

The checklist is ticked by hand. To see which items are ready, copy the block below into a scratch file and run it
from the repository root (`python3 <file> plan`, add `--all` to list every item). It reads `TASKS.md` (block format of
`12` §9.1 / `tools/status.py`) and this file, counts per item how many cited tasks are `COMPLETED` or `NOT_APPLICABLE`,
lists items that are **ready to tick** (all cited tasks done — then confirm the verification evidence before ticking)
and items **ticked but open**, and prints a per-section summary. It changes nothing. Task-ID validity is checked by the
script in `17-dependencies.md` §15.

```python
#!/usr/bin/env python3
"""Status view of 18-master-checklist.md: for every checklist item, how many cited tasks are COMPLETED/NOT_APPLICABLE
in TASKS.md. Read-only; prints items that may be ticked and ticked items that are not yet satisfied.
Usage: python3 checklist_view.py [path/to/plan] [--all]"""
import re, sys
from pathlib import Path
args = [a for a in sys.argv[1:] if not a.startswith("--")]
plan = Path(args[0] if args else "plan")
tasks_md = plan / "TASKS.md"
if not tasks_md.exists():
    sys.exit("plan/TASKS.md not found — generate it from 12-phases.md §9.1 first")
status, cur = {}, None
for line in tasks_md.read_text(encoding="utf-8").splitlines():
    h = re.match(r"^#{3,5}\s+(T-[0-9A-Z.]+-M\d{2}-\d{2})\b", line)
    if h: cur = h.group(1); continue
    s = re.match(r"^\s*[-*]\s+\*\*Status:\*\*\s*`?([A-Z_]+)", line)
    if s and cur: status[cur] = s.group(1)
DONE = {"COMPLETED", "NOT_APPLICABLE"}
section, per = "", {}
for line in (plan / "18-master-checklist.md").read_text(encoding="utf-8").splitlines():
    if line.startswith("## "): section = line[3:].strip()
    m = re.match(r"^- \[( |x)\] (.*)$", line)
    if not m: continue
    ids = list(dict.fromkeys(re.findall(r"T-(?:0|1A\.\d+|1B\.\d+|2|3)-M\d\d-\d\d", m.group(2))))
    done = sum(1 for t in ids if status.get(t) in DONE)
    ok = bool(ids) and done == len(ids)
    ticked = m.group(1) == "x"
    c = per.setdefault(section, [0, 0, 0]); c[0] += 1; c[1] += ok; c[2] += ticked
    if (ok and not ticked) or (ticked and not ok) or "--all" in sys.argv:
        flag = "READY TO TICK" if ok and not ticked else ("TICKED BUT OPEN" if ticked and not ok else "")
        print(f"{flag:15} {done:>3}/{len(ids):<3} {m.group(2)[:110]}")
print("\nSection                                             items  satisfied  ticked")
for s, (n, ok, t) in per.items():
    print(f"{s[:50]:50} {n:6} {ok:10} {t:7}")
```

---

## Appendix — verification record (2026-09-27)

| Check | Result |
|---|---|
| Task IDs cited in this file exist in the skeleton (`17` §15 script) | 361 distinct IDs cited, 0 unknown — every skeleton task appears in at least one item |
| Endpoint coverage (§6.2 ranges expanded) | 492 of 492 endpoint IDs of `06-api.md` |
| Screen coverage | all 36 screens P-S01–P-S15, P-E01–P-E16, P-V01–P-V05 plus the three shells |
| Module, schema, seed, invariant, automation, work-package coverage | M01–M29, DB-G0–DB-G11, S-01–S-29, I-01–I-10, A01–A38, WP01–WP17 |
| Test coverage | T01–T36, all 22 `TS-` areas (214 suites), UAT sets, G1–G13 |
| Decision IDs | all exist in `DECISIONS.md`; D-216–D-219 cited only as the unused reserved range |
| Status view script (§12) | ran against a synthetic `TASKS.md`; lists ready items and the per-section summary |
