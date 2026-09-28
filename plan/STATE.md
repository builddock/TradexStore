# STATE — implementation progress (persistent across Claude sessions)

**Read this first in every session**, then follow `14-continuation-protocol.md`.
Source of truth for individual task status is `TASKS.md`; this file is the snapshot + logs. If the two disagree,
the codebase and passing tests win, then `TASKS.md`; fix this file to match.

---

## 0. Architecture change — read before anything else (2026-09-28)
The product is now **one configurable SaaS e-commerce platform** with a **separate Configurable Root Admin**, and
Tradex is store #1 on it. Source: `docs/SAAS_ARCHITECTURE_CHANGE.md`. Decision: **D-227** (D-045 superseded).
Architecture: `19-saas-platform.md` §1–§2 (read first), `20-root-admin.md`. Added stages and tasks:
`12-phases.md` §10. Session rules: `14-continuation-protocol.md` → SaaS section. `D-227`–`D-253` are already
`DECIDED`; do not re-open them or ask the user to confirm them.

## 1. Snapshot
| Field | Value |
|---|---|
| Architecture | **Configurable SaaS platform (D-227, 2026-09-28)** — one store codebase, configuration-driven; separate root admin (`root-admin/`); Tradex = store `tradex`, pack `VP-electronics`, template `TPL-forge` |
| Separation | **Each client has its own database, image container, search index, cache namespace and encryption key (D-272)**; `store_id` scoping mandatory on every row regardless, in every topology |
| Topologies | One codebase, four placements (D-269): separated client on a shared server (**default**) · dedicated runtime · standalone install on the client's own server · shared database (agreed exception only) |
| Control model | Three levels (D-257): surfaces → modules (platform- and category-defined) → capabilities; three control states per item — not available / available and locked / **delegated to the store's own administrator** (D-258) |
| Feature catalogue | ~230 grantable features across 18 areas (D-273), including **every channel** (email, SMS, WhatsApp levels, web chat, push, in-app) and **every automation** as its own switch. Each entry carries a build status; a `CANDIDATE` entry with an open decision cannot be granted (BR-M31-17) |
| Feature map | **`21-feature-map.md`** maps every screen section, tab, endpoint and entity to the capability that governs it, with a reverse index (D-273). Read it before building any screen; `T-1A.3-M31-02` makes the build fail when a section has no declared capability |
| Mockup baseline | The client-facing mockup is **the reference store: every Phase-1 feature enabled**, deliberately not gated (D-279). It shows the system, not one client's configuration |
| Channels | Granting a channel requires five layers (D-274): capability → provider binding → verified sender → approved templates → consent and caps. Publication is blocked until all five exist, so a channel can never look configured and silently fail |
| Current phase | **0 — Discovery & proof** |
| Current stage | 0 |
| Current task | — (none in progress). Next eligible: **T-0-M01-03** Discovery questionnaire & next-meeting pack |
| Last session | 2026-09-28 — SaaS architecture change (D-227, 71 tasks), production-readiness and control-model pass (D-257–D-272, 28 tasks), feature-catalogue and channel pass (D-273–D-278, 6 tasks), the feature map (D-279, `21-feature-map.md`, 1 task), **and contextual help for the root admin** (D-280, 2 tasks): ⓘ on every heading, tab and control, page guides, search and a platform glossary, built and verified in the mockup |
| Application code present | No (`frontend/`, `backend/`, `root-admin/`, `infra/`, `tests/` not yet created) |
| UI prototype | Mockup v0.1 (32 screens) at repo root — **awaiting client sign-off (D-049)**. Storefront pages responsive (desktop · tablet · phone) since 2026-09-27; Phase 1 mobile scope is D-223. ERP workspace and vendor portal have contextual help (ⓘ, help panel, glossary) and 8 operational ERP pages have guided workflows since 2026-09-28 (D-224). ERP and vendor pages responsive (tablet · phone, desktop unchanged) since 2026-09-28; Phase 1 scope is D-226 |
| UI prototype (root admin) | `root-admin-mockup/` — **13 screens P-R01–P-R13** with contextual help on every screen (ⓘ, page guide, search, 50-term glossary — D-280), own assets, `noindex`, **not linked from any client-facing page** (D-249). Verified 2026-09-28 after the second pass: 0 console errors on 14 pages, `scrollWidth == clientWidth` at 390/768/1280/1600 px, all internal links resolve, no inbound or outbound link between the two mockups |
| Blocking decisions for Phase 1A start | D-001 (operational core), D-003 (storefront framework), D-004 (staff UI), D-005 (hosting), D-049 (UI sign-off) — see `DECISIONS.md`. The SaaS decisions D-227–D-253 are DECIDED and block nothing |

## 2. Task counts
Run `python3 plan/tools/status.py` and paste the summary here at the end of each session.

```
Tradex plan status — 466 tasks
  NOT_STARTED=158 · IN_PROGRESS=0 · BLOCKED=0 · REQUIRES_DECISION=306 · COMPLETED=1 · NOT_APPLICABLE=1
Current (earliest unfinished) stage: 0
Per stage:
  0       done   1/77   in-progress 0  blocked 0  needs-decision 47
  1A.1    done   0/34   in-progress 0  blocked 0  needs-decision 19
  1A.2    done   0/20   in-progress 0  blocked 0  needs-decision 12
  1A.3    done   0/19   in-progress 0  blocked 0  needs-decision 14
  1A.4    done   0/18   in-progress 0  blocked 0  needs-decision 13
  1A.5    done   0/10   in-progress 0  blocked 0  needs-decision 6
  1A.6    done   0/16   in-progress 0  blocked 0  needs-decision 11
  1A.7    done   0/12   in-progress 0  blocked 0  needs-decision 8
  1A.8    done   0/17   in-progress 0  blocked 0  needs-decision 11
  1A.9    done   0/32   in-progress 0  blocked 0  needs-decision 24
  1A.10   done   0/12   in-progress 0  blocked 0  needs-decision 7
  1A.11   done   0/15   in-progress 0  blocked 0  needs-decision 9
  1A.12   done   0/13   in-progress 0  blocked 0  needs-decision 8
  1A.13   done   0/15   in-progress 0  blocked 0  needs-decision 12
  1A.14   done   0/13   in-progress 0  blocked 0  needs-decision 10
  1A.15   done   0/13   in-progress 0  blocked 0  needs-decision 10
  1A.16   done   0/13   in-progress 0  blocked 0  needs-decision 9
  1A.17   done   0/21   in-progress 0  blocked 0  needs-decision 17
  1R.1    done   0/11   in-progress 0  blocked 0  needs-decision 5
  1R.2    done   0/15   in-progress 0  blocked 0  needs-decision 5
  1R.3    done   0/15   in-progress 0  blocked 0  needs-decision 10
  1B.1    done   0/18   in-progress 0  blocked 0  needs-decision 13
  1B.2    done   0/11   in-progress 0  blocked 0  needs-decision 7
  1B.3    done   0/8    in-progress 0  blocked 0  needs-decision 6
  1B.4    done   0/7    in-progress 0  blocked 0  needs-decision 5
  1B.5    done   0/4    in-progress 0  blocked 0  needs-decision 2
  2       done   0/4    in-progress 0  blocked 0  needs-decision 4
  3       done   1/3    in-progress 0  blocked 0  needs-decision 2
In progress (resume these first): none
NEXT TASK: T-0-M01-03 · Discovery questionnaire and next-meeting pack: BP §31.1 agenda, §26.1–26.7 questions Q1–Q70 issued and answers recorded; decision owners and dates assigned; vision backlog / release scope / change register lists opened
Open decisions blocking the most tasks:
  D-004 blocks 41 — Staff ERP UI: native ERP screens or custom UI (per mockup) — per P-E screen
  D-034 blocks 10 — Service levels & performance targets (availability, RPO, RTO, LCP/INP/CLS, API p95, stock 
  D-053 blocks 10 — Testing tools/frameworks (unit, integration, E2E, load, accessibility, security)
  D-101 blocks 9 — Which frontend framework builds the custom ERP staff workspace screens (`frontend/workspac
  D-107 blocks 9 — Secrets management and TLS certificate tooling: secrets store, rotation cadence, who may r
  D-035 blocks 8 — Support & maintenance model (hours, severities, response targets, coverage)
  D-001 blocks 8 — Which operational core owns stock, reservations, orders, permissions and integrations?
  D-033 blocks 8 — Object storage & CDN provider
```
`status.py --check`: 0 issues in 466 tasks.

## 3. In-progress tasks
| Task ID | Started | Done so far | Remaining |
|---|---|---|---|
| — | | | |

## 4. Blocked / requires-decision tasks (summary)
| Task ID | Blocked by (task or D-id) | Note |
|---|---|---|
| (see `status.py` output) | | |

## 5. Completed tasks log (append-only)
| Date | Task ID | Summary | Commit | Tests |
|---|---|---|---|---|
| 2026-09-26 | (pre-plan) | Clickable HTML mockup v0.1: 32 screens + overview + credits, real product photos (WP03 prototype) | — | JS-error + link checks passed on all pages |
| 2026-09-27 | (pre-plan) | Implementation plan written in `plan/` | — | — |
| 2026-09-27 | T-0-M01-01 | D-210 recorded (Phase 0 records location) | — | `status.py --check` 0 issues |
| 2026-09-27 | (mockup, user request) | Storefront mockup made responsive: phone/tablet header, menu drawer, bottom bar, filter & account panels, sticky buy/checkout bars, per-page layouts, banners & images | — | 13 widths 320–1920 px: 0 overflow; 0 image/banner issues; 0 JS errors on 34 pages; keyboard test of 3 panels passed; desktop 1440 px pixel-identical to before except live timers and the active "Refurbished" category link |
| 2026-09-28 | (mockup, user request) | ERP workspace + vendor portal: ⓘ contextual help on all 19 P-E/P-V screens (help panel with page guide, glossary A–Z of 203 terms, search), guided workflows ("How it works" strips, tab intros, next-step boxes, plain tab labels) on P-E02/03/04/06/07/08/09/12 | — | see session log 2026-09-28 |
| 2026-09-28 | (mockup, user request) | ERP workspace + vendor portal responsive for tablets and phones (slide-in menu, compact top bar, stacked panes, scrolling tables, per-page layouts); desktop/laptop unchanged; plan documented (04a §2.5, 04b §2.24, 04c X16, D-226, conditional tasks) | — | see session log 2026-09-28 (responsive) |
| 2026-09-28 | (plan, user request) | **SaaS architecture change (D-227)** applied across the plan: `docs/SAAS_ARCHITECTURE_CHANGE.md`, `19-saas-platform.md`, `20-root-admin.md`, 30 decisions D-227–D-256, modules M30–M35, 71 new tasks in 3 new stages plus 8 existing stages, `status.py` extended for phase 1R | — | `status.py --check` 0 issues in 438 tasks |
| 2026-09-28 | (mockup, user request) | Configurable Root Admin mockup: 12 screens P-R01–P-R12 in `root-admin-mockup/` with its own `assets/ra.css` + `assets/ra.js`, deliberately unlinked from the client-facing mockup (D-249) | — | 13 pages × 4 widths headless: 0 console errors, 0 page-level horizontal overflow, all internal links resolve, 0 links in either direction between the two mockups |

## 6. Decisions log (append-only; details in `DECISIONS.md`)
| Date | D-ID | Decision | Approved by |
|---|---|---|---|
| 2026-09-27 | D-054 | One repository for the whole project; canonical folder layout in `00-conventions.md` §11 (names delegated to the plan) | User |
| 2026-09-27 | D-210 | Phase 0 records in `plan/phase0/` (publication stays under D-115) | Plan design (folder layout delegated by user) |
| 2026-09-27 | D-213 | Task IDs permanent; moved tasks change Stage only; `NOT_APPLICABLE` status for tasks a decision removes | Plan design (tracking system) |
| 2026-09-28 | D-224 | Contextual help (ⓘ, help panel, glossary) on every P-E/P-V screen; guided workflows on P-E02, P-E03, P-E04, P-E06, P-E07, P-E08, P-E09, P-E12 | User |
| 2026-09-28 | D-227 | **Architecture direction: one configurable SaaS e-commerce platform.** One store codebase, behaviour from per-store configuration; never one application per category. Supersedes D-045 | User |
| 2026-09-28 | D-228 | Configurable Root Admin is a separate codebase (`root-admin/`), portal, hostname, database and identity realm; one-way dependency platform → artefact → store (SEP-1…SEP-6) | User |
| 2026-09-28 | D-229 | Store-user invisibility rules INV-1…INV-10: no other store, no category/template list, no capability or configuration identifiers, no platform vocabulary; disabled = 404 not 403; locked settings absent, not greyed | User |
| 2026-09-28 | D-230 | Configuration is stored in the root admin database (layers L1–L3, authoritative); the store database holds only the store-editable layer L4 | User |
| 2026-09-28 | D-231 | Immutable, versioned, checksummed config artefact set per store in object storage with an on-disk copy under `config/generated/<store>/v<N>/` and a `current` pointer | Plan design (delegated by SAAS) |
| 2026-09-28 | D-232 | Refresh by `config.published` event with a ≤ 30 s pointer-poll fallback; build off the request path, atomic swap, `config.applied` callback, fail closed, rollback by republishing | Plan design (delegated by SAAS) |
| 2026-09-28 | D-233 | Tenant isolation: shared schema with mandatory non-null `store_id`, unscoped-query refusal, row-level security where supported, per-store storage prefixes and secret keys; `dedicated_db` and `dedicated_runtime` as per-store options | Plan design (delegated by SAAS) |
| 2026-09-28 | D-234 | Host → store resolution from a preloaded map (O(1), no I/O); platform subdomains plus verified custom domains with automated certificates; unknown host → neutral 404 | Plan design (delegated by SAAS) |
| 2026-09-28 | D-235 | Shared multi-store runtime by default; deployment is a nine-step idempotent, resumable pipeline; before the portal exists the same pipeline runs from the M35 bootstrap CLI | Plan design (delegated by SAAS) |
| 2026-09-28 | D-236 | Capability registry `CAP-*` enforced at six points (navigation, API 404, service guard, UI/bundle, jobs, exports); disabling never deletes data | Plan design (delegated by SAAS) |
| 2026-09-28 | D-237 | Vertical pack `VP-*` = versioned data only (capabilities, settings, catalog schema, identity model, units, models, terminology, three profiles, seeds, compatibility, validation); no code may branch on a pack id | Plan design (delegated by SAAS) |
| 2026-09-28 | D-238 | Template `TPL-*` = versioned presentation layer inside the one storefront codebase; presentation only; switching needs no data migration | Plan design (delegated by SAAS) |
| 2026-09-28 | D-239 | Terminology tokens `TT-*` with per-pack sets per locale and per-store overrides, compiled to a map; hard-coded concept words fail the build | Plan design (delegated by SAAS) |
| 2026-09-28 | D-240 | Branding compiled to tokens; the compiler derives the colour ramp and blocks publication on a WCAG 2.2 AA contrast failure; output `theme.css` + `theme.json` | Plan design (delegated by SAAS) |
| 2026-09-28 | D-241 | Phase 1 builds the pack mechanism plus two packs: `VP-electronics` (1A) and `VP-fashion_apparel` (1R.2, the no-code-change proof); the other 29 are later pack content | Plan design (delegated by SAAS) |
| 2026-09-28 | D-242 | Phase 1 ships two templates: `TPL-forge` (mockup direction, electronics) and `TPL-aurora` (editorial, fashion/general) | Plan design (delegated by SAAS) |
| 2026-09-28 | D-243 | `editable_by` per configuration key plus per-store locking; store-editable by default = contact, hours, notifications, policy text, collections, saved views, staff, owner thresholds, store-held credentials | Plan design (delegated by SAAS) |
| 2026-09-28 | D-244 | Root admin uses the same language/framework family as the store backend (D-002/D-101) — one toolchain, separate application | Plan design (delegated by SAAS) |
| 2026-09-28 | D-245 | Separate platform identity realm, MFA mandatory for every platform user, identity-aware proxy, five platform roles | Plan design (delegated by SAAS) |
| 2026-09-28 | D-246 | Platform staff access to store data only by approved, ≤ 8 h, dual-audited, owner-notified grant; never silent impersonation | Plan design (delegated by SAAS) |
| 2026-09-28 | D-247 | Packs and templates are versioned and immutable; add = publish, update = publish + explicit previewed migration, remove = deprecate then retire when unused | Plan design (delegated by SAAS) |
| 2026-09-28 | D-248 | Performance budget: 0 configuration DB queries / file reads / JSON parses per request; O(1) accessors; ≤ 200 ms boot load; ≤ 30 s propagation p95; ≤ 2 ms added latency; ≤ 5 MB per store per process | Plan design (delegated by SAAS) |
| 2026-09-28 | D-249 | Root admin mockup in `root-admin-mockup/` with its own assets, `noindex`, and no link from any client-facing page | User |
| 2026-09-28 | D-250 | Provisioning seeds structure only (categories, attributes, units, policy classes, roles, first location, saved views, help, templates) plus the first owner invitation; no sample or placeholder data | Plan design (delegated by SAAS) |
| 2026-09-28 | D-251 | Tradex becomes store `tradex` (`VP-electronics`, `TPL-forge`); MEET/BP/PR1/PR2/MK keep full authority as that store's specification | Plan design (delegated by SAAS) |
| 2026-09-28 | D-252 | Phase 0 proof gains `TS-PROOF-11` (multi-store isolation) and `TS-PROOF-12` (configuration cost) on every candidate core, scored in the fit scorecard | Plan design (delegated by SAAS) |
| 2026-09-28 | D-253 | Root admin screen inventory P-R01–P-R12 | User |
| 2026-09-28 | D-257 | Root admin switches three levels: **surfaces** (website, workspace, supplier portal), **modules** (platform- and category-defined), **capabilities**. `MOD-administration` cannot be disabled | User |
| 2026-09-28 | D-258 | Three control states per module and capability — not available / available and locked / **delegated to the store's own administrator**; delegated values live in the store database, so a store change needs no deployment. Invariants CTL-1…CTL-7 | User |
| 2026-09-28 | D-259 | Configuration-schema evolution: additive / widening / breaking; a breaking change ships only with a migration plus a rebuild of every artefact, in a defined order, with a two-schema acceptance window | Plan design (readiness review) |
| 2026-09-28 | D-260 | Per-store backup, restore, export and deletion, with a rehearsed and timed single-store restore | Plan design (readiness review) |
| 2026-09-28 | D-261 | Money carries its currency; no cross-store money aggregation; per-store business-day timezone and per-store sequences | Plan design (readiness review) |
| 2026-09-28 | D-262 | Per-store quotas, rate limits and fair-share job scheduling; a limit never discloses another store | Plan design (readiness review) |
| 2026-09-28 | D-263 | Environments per store; promotion copies a published staging version into the production draft and never copies domains, secrets, store settings, delegated feature states, users or data | Plan design (readiness review) |
| 2026-09-28 | D-264 | `store_id` on every log, trace and metric; per-store dashboards and alerts; incident severity includes stores affected; canary-then-batches for fleet changes; a root admin outage takes no store down | Plan design (readiness review) |
| 2026-09-28 | D-265 | A category may define its **own modules**, composed only from capabilities that already exist in the codebase; new behaviour is one new capability, available to every category afterwards | User |
| 2026-09-28 | D-266 | **Bundles** (`BND-*`): reusable, versioned packages of modules, capabilities, settings, schema, wording, profiles and seeds; a category = base + bundles + overrides, with explicit conflicts and pinned versions | User |
| 2026-09-28 | D-267 | A **completeness gate** of 25 dimensions, enforced by the validator, blocks publication of a category that is not fully configured | User |
| 2026-09-28 | D-268 | Performance architecture and per-surface budgets for storefront, workspace and vendor portal, asserted in CI on realistic data with two stores; nine data-access rules; five cache layers; `TS-PROOF-13` added to Stage 0 | User |
| 2026-09-28 | D-269 | One codebase, four deployment placements; `store_id` scoping mandatory in all of them including single-store | User |
| 2026-09-28 | D-270 | Artefacts are signed as well as checksummed, and bound to one store and its permitted hosts | Plan design (topology review) |
| 2026-09-28 | D-271 | Client-hosted installs serve with no platform connectivity; releases pulled or pushed; version skew bounded to one minor release; a silent install is "unknown", not "healthy" | Plan design (topology review) |
| 2026-09-28 | D-272 | **Each client's data, database, images, search index and cache are separated**; a shared database is an explicitly agreed exception only; `store_id` scoping kept as a second layer | User |
| 2026-09-28 | D-273 | The **full capability catalogue** (~230 entries, 18 areas): every feature a client might buy is a switch — channels, each automation, integrations, the store's own API, sign-in methods, content, reporting. Each carries a build status; a `CANDIDATE` entry with an open decision cannot be granted | User |
| 2026-09-28 | D-274 | Granting a channel requires five layers — capability, provider binding, verified sender, approved templates, consent and caps — and publication is blocked until all five exist. Consent, caps, quiet hours, idempotency, templates, rate limits, delivery tracking and redaction are enforced centrally in the messaging service, never in an adapter | Plan design (feature-catalogue review) |
| 2026-09-28 | D-275 | Marketing and engagement features (newsletters, campaigns, abandoned cart, loyalty, referrals, gift cards, review requests) — **OPEN**, listed as CANDIDATE, not built until a scope is approved | Owner |
| 2026-09-28 | D-276 | Web chat scope and depth — **OPEN**, listed as CANDIDATE | Owner |
| 2026-09-28 | D-277 | Third-party analytics and marketing tags — **OPEN**, listed as CANDIDATE | Owner |
| 2026-09-28 | D-278 | The store's own API access and outbound webhooks — **OPEN**, listed as CANDIDATE | Owner |
| 2026-09-28 | D-279 | The client-facing mockup is **the reference store**: a store with every Phase-1 feature enabled, deliberately not feature-gated. `21-feature-map.md` is the authority for which capability governs which element | User |
| 2026-09-28 | D-280 | The Configurable Root Admin carries the same contextual help as the ERP and vendor portals (D-224): ⓘ on every heading, tab and control with a six-part explanation, a page guide behind the ?, search, a platform glossary reachable from dotted-underlined words, and a help-icons toggle. Help content is part of the definition of done for every P-R screen | User |
| 2026-09-28 | D-045 | **Superseded by D-227** — multiple businesses on one configurable platform are Phase 1 architecture, not a Phase 3 assessment | User |

## 7. Database migrations
| Migration ID / file | Entities | Environment(s) applied | Date | Task ID |
|---|---|---|---|---|
| — | | | | |

## 8. APIs implemented
| API ID | Status | Task ID | Tests |
|---|---|---|---|
| — | | | |

## 9. Frontend pages
| Page ID | Screen | Status | Task ID(s) | Notes |
|---|---|---|---|---|
| P-S01–P-S13 | Storefront | NOT_STARTED | | Mockup exists (reference) |
| P-E01–P-E15 | ERP workspace | NOT_STARTED | | Native vs custom per D-004 |
| P-V01–P-V04 | Vendor portal | NOT_STARTED | | Phase 1B |
| P-R01–P-R12 | Configurable Root Admin portal | NOT_STARTED | 1R.1–1R.3 | Mockup exists in `root-admin-mockup/` (D-249, D-253); separate codebase `root-admin/` |

## 10. Backend modules
| Module | Status | Notes |
|---|---|---|
| M01–M27 | NOT_STARTED | M15, M28, M29 are LATER |
| M30–M33 | NOT_STARTED | SaaS runtime layer in `backend/platform/` and `frontend/…/templates/`; built in stages 1A.1–1A.4 |
| M34–M35 | NOT_STARTED | Root admin platform and store deployment; `root-admin/`; stages 1R.1–1R.3 |

## 11. Tests
| Suite / T-ID (16-testing.md) | Status | Last run | Result | Environment | Evidence |
|---|---|---|---|---|---|
| — | | | | | |

## 12. Files changed (append-only, per session)
| Date | Task ID | Files |
|---|---|---|
| 2026-09-27 | (plan) | `plan/*` (24 files + `tools/status.py`), `CLAUDE.md` |
| 2026-09-27 | (mockup responsive) | `assets/tradex.css`, `assets/tradex.js`, all 13 `store-*.html`; `plan/DECISIONS.md` (D-223), `plan/STATE.md` |
| 2026-09-28 | (mockup help & guided workflows) | `assets/tradex.js`, `assets/tradex.css`, new `assets/help/` (glossary.js, shell.js, 19 page files), all 15 `erp-*.html`, all 4 `vendor-*.html`, `index.html`; `plan/DECISIONS.md` (D-224, D-225, D-174 note), `plan/04b-frontend-workspace-1.md` (rule 23, §2.21–2.23, §3.2 #5), `plan/04c-frontend-workspace-2-vendor.md` (X20), `plan/TASKS.md` (T-1A.3-M24-02, T-1A.16-M24-06, T-1B.1-M14-16; T-1A.16-M24-03 description), `plan/12-phases.md`, `plan/18-master-checklist.md`, `plan/STATE.md` |
| 2026-09-28 | (SaaS architecture change, D-227) | **New:** `docs/SAAS_ARCHITECTURE_CHANGE.md`, `plan/19-saas-platform.md`, `plan/20-root-admin.md`, `.gitignore`. **Updated:** `CLAUDE.md`; `plan/00-conventions.md` (§1.2–1.3 sources, §2 labels, §4 stages, §5 IDs, §6 M30–M35, §7.3 entities, §8 P-R, §9.1 platform roles, §11 layout, §12 conflicts 11–14), `plan/DECISIONS.md` (D-227–D-256; D-045 superseded), `plan/12-phases.md` (§2, §3, §5 P12–P13, §10), `plan/TASKS.md` (71 new blocks; 11 existing tasks' dependencies; T-3-M03-01 → NOT_APPLICABLE), `plan/14-continuation-protocol.md`, `plan/README.md`, `plan/tools/status.py` (phase 1R; NOT_APPLICABLE check), and end-of-file SaaS sections in `01`, `02`, `03` (§20), `04a` (§12), `04b` (§19), `04c` (§21), `05` (§9), `06` (§9), `07`, `08` (§13), `09` (§14), `10`, `11`, `16` (§20), `17`, `18` |
| 2026-09-28 | (SaaS second pass, D-257–D-272) | `plan/19-saas-platform.md` (§5.4 surfaces/modules/control, §5.5 bundles, §6.9 completeness gate, §10.1 per-client separation, §10.3 topologies, §10.4 standalone, §17 schema evolution, §18 per-store recovery, §19 money/time, §20 quotas, §21 environments, §22 observability, §23 edge cases, §24 definition of done, §25 performance architecture, new BR-M30-06…10, BR-M31-09…16, BR-M32-05/06, BR-M34-03/04, BR-M35-04/05), `plan/20-root-admin.md` (P-R13, P-R05 tabs, topology note, API groups), `plan/DECISIONS.md` (D-257–D-272; D-233 amended), `plan/00-conventions.md` (MOD-*, BND-*, surfaces, P-R13, bundle and feature-state entities, separation and topology rules), `plan/16-testing.md` (TS-SAAS-REL, TS-SAAS-EDGE), `plan/12-phases.md` (§3 counts, §10.7), `plan/TASKS.md` (28 new blocks; 10 existing tasks gained dependencies), `plan/README.md`, `plan/STATE.md` |
| 2026-09-28 | (root admin contextual help, D-280) | **New:** `root-admin-mockup/assets/ra-help.js` (engine) and `root-admin-mockup/assets/help/` — `glossary.js` (about 50 platform terms), `shell.js` and one file per screen (13). **Updated:** `root-admin-mockup/assets/ra.css` (help panel, ⓘ, glossary marks, responsive), `assets/ra.js` (? button, help-icons control, shell markers, mount), all 13 `ra-*.html` (script loading, `data-help` on 80 headings, 36 tabs, 5 tiles and the shell), `index.html`, `README.md`. **Plan:** `plan/DECISIONS.md` (D-280), `plan/20-root-admin.md` (§11 help specification, H-1…H-6), `plan/00-conventions.md` §1.3, `plan/12-phases.md` (§3, §10.8 addendum), `plan/TASKS.md` (`T-1R.1-M34-11`, `T-1R.3-M34-06` + 2 gate dependencies), `plan/README.md`, `plan/STATE.md`. **No client-facing file changed** |
| 2026-09-28 | (feature map, D-279) | **New:** `plan/21-feature-map.md` (screen-by-screen capability map for P-S01–P-S15, P-E01–P-E16, P-V01–P-V05; reverse index; mockup baseline; FM-1…FM-5). **Updated:** `CLAUDE.md`, `plan/00-conventions.md` §1.1, `plan/14-continuation-protocol.md`, `plan/19-saas-platform.md` (§5.3 pointer, §26.5 step 1, `CAP-CATALOG_REVIEW`/`CAP-CATALOG_VERSIONS` added), `plan/DECISIONS.md` (D-279), `plan/README.md`, `plan/12-phases.md` (§3, §10.8 addendum), `plan/TASKS.md` (`T-1A.3-M31-02` + gate dependency), `plan/STATE.md`. **No client-facing file changed** — the mockup stays ungated by design |
| 2026-09-28 | (feature catalogue and channels, D-273–D-278) | `plan/19-saas-platform.md` (§5.3 the full catalogue, §5.6 channels and providers, §26 implementation contracts, BR-M20-01…05, BR-M31-17/18, TS-SAAS-CHAN/AUTO), `plan/03-database.md` (§12 feature/channel/automation data model, indexes, DB-G13), `plan/DECISIONS.md` (D-273–D-278), `plan/00-conventions.md` (channels, automation capability ids, new entities, DB-G13), `plan/01-tech-stack.md` (§35), `plan/02-architecture.md` (§30), `plan/05-backend.md` (§10), `plan/06-api.md` (§10), `plan/07-auth-roles-permissions.md`, `plan/08-ecommerce.md` (§14), `plan/09-vendor-marketplace.md` (§15), `plan/10-erp.md`, `plan/11-admin.md`, `plan/04b` (§20), `plan/16-testing.md`, `plan/17-dependencies.md`, `plan/18-master-checklist.md`, `plan/12-phases.md` (§3, §10.8), `plan/20-root-admin.md`, `plan/TASKS.md` (6 new blocks, 4 gate dependencies, 1 ID collision corrected), `plan/README.md`, `plan/STATE.md` |
| 2026-09-28 | (root admin mockup, channels) | `root-admin-mockup/ra-store.html` new **Channels &amp; integrations** tab (channels with provider, sender and template state; automations granted per store; integrations; a live publish check), `ra-capabilities.html` catalogue by area plus a channels-and-automations view, `ra-store-new.html` wizard steps 4 and 5 grant channels and automations, `assets/ra.js` scroll fix, `assets/ra.css` base icon size. **No client-facing file changed** |
| 2026-09-28 | (root admin mockup, second pass) | `root-admin-mockup/`: new `ra-bundles.html` (P-R13); `ra-store.html` gains Environments & hosting, surfaces, modules, delegated features, email sender verification and client export; `ra-store-new.html` gains hosting/separation and the three control levels; `ra-settings.html` gains per-client separation, secret scopes and signing keys, configuration retention, DNS/certificate provider, release and schema state; `ra-admin.html` gains MFA method and sessions; `ra-stores.html` gains a hosting column; `assets/ra.css` + `assets/ra.js` top-bar fix and narrow-width layout. **No client-facing file changed** |
| 2026-09-28 | (root admin mockup, D-249) | **New:** `root-admin-mockup/` — `index.html`, `ra-login.html`, `ra-dashboard.html`, `ra-stores.html`, `ra-store-new.html`, `ra-store.html`, `ra-packs.html`, `ra-templates.html`, `ra-capabilities.html`, `ra-terminology.html`, `ra-deployments.html`, `ra-admin.html`, `ra-settings.html`, `README.md`, `assets/ra.css`, `assets/ra.js`. **No client-facing file was changed** (`index.html`, `credits.html`, `store-*`, `erp-*`, `vendor-*`, `assets/tradex.*` are untouched) |
| 2026-09-28 | (mockup responsive ERP/vendor) | `assets/tradex.css`, `assets/tradex.js`, all 15 `erp-*.html`, all 4 `vendor-*.html` (page `<style>` media queries; one script value in `erp-reports.html`); `plan/DECISIONS.md` (D-226; D-223 cross-refs), `plan/04a-frontend-storefront.md` (rule 7, §2.5), `plan/04b-frontend-workspace-1.md` (rule 15, §2.24, §3.2 #1), `plan/04c-frontend-workspace-2-vendor.md` (X16), `plan/TASKS.md` (T-1A.9-M09-12, T-1A.16-M24-07, T-1B.1-M14-17), `plan/12-phases.md`, `plan/18-master-checklist.md`, `plan/STATE.md` |

## 13. Known issues
| # | Date | Issue | Affects | Status |
|---|---|---|---|---|
| 1 | 2026-09-27 | Working tree shows 128 files from the previous site (`landing.html`, `design-flow/`) as deleted before the mockup was added; the user decides whether to commit or restore them. | repo | OPEN |
| 2 | 2026-09-27 | The repo root is published by GitHub Pages (CNAME `tradex.builddocks.in`); `docs/`, `plan/` and future `frontend/`/`backend/` code are public if the repo/site is public. | repo | OPEN — decide D-115 before the first code commit |
| 3 | 2026-09-27 | **Missing endpoints** found while writing task blocks — add an API ID to `06-api.md` (+ permission key in `07`) when the owning task is picked (protocol step 13): staff create/approve/retire compatibility links (T-1A.4-M04-07); send payment link for an existing unpaid web order (T-1A.10-M11-09); staff curated-collection editor if D-142 = staff editor (T-1A.9-M09-10); vendor-side message-thread list/read and statement-query status (T-1B.1-M14-12/-13); staff vendor-announcement API if D-142 approves (1B.1); invalid-image queue across import jobs (T-1B.2-M22-01); supplier confirmation of partner-stock lines outside the pilot (D-073/D-181, 1B.2); recurring-approval filter for policy review (1B.4); data for P-E14 hours-saved chart and P-E14/P-E15 KPI tiles (T-1A.15-M18-06) | plan | OPEN |
| 4 | 2026-09-27 | **Missing enum values/fields** — add to `03-database.md` in the owning schema task: `E-approval_request.approval_type` for inbound integration-credential issuance (API-M02-36) and vendor profile/permitted-scope change; `E-support_ticket` categories callback/enquiry/grievance/invoice_correction/sourcing_request + supplier reference/statement-query; `E-support_conversation.channel` portal; `E-support_message.sender_type` vendor; `E-message_template` provider rejection reason; `E-exception_case` type for the catalog-quality queue (API-M04-14); `E-supplier_rma.resolution_type` dispute (API-M14-32); stock-movement type for legacy branch sales via API-M23-01; minimum-order notice code in API-M05-01 (D-160) | plan | OPEN |
| 5 | 2026-09-27 | **Ownership gaps** — assign when the stage is reached: P-E11 KPI strip; P-S04 FAQ wiring to API-M16-01 (after 1A.13); email as a shared-inbox channel; checkout disclosure of pilot lines if D-073 is rejected; API-M16-17/-18 and the SLA timer in a 1A-only launch; seeds for S-13 non-inventory values (D-028, D-058, D-077); dealer bank-transfer confirmation screen if the optional T-1A.10-M11-07 is not approved; OTP/reset/invitation message wording before `E-message_template` exists (1A.2 vs 1A.13) | plan | OPEN |
| 6 | 2026-09-27 | **Cross-stage notes** — T-1A.8-M08-07 internal notes need `E-internal_note` (1A.9) and D-134; T-1A.8-M08-09 bulk message needs the 1A.13 notification core (D-145); T-1A.14-M17-11 Export button needs API-M18-03 (1A.15); supplier-RMA drafts only after 1A.11/1A.12; media backup part of T-1A.1-M26-02 verified in 1A.4 | plan | OPEN (handled inside the task blocks) |
| 7 | 2026-09-27 | **Minor document inconsistencies** — invitation-expiry decision cited as D-040 in `07` but D-083 in `03`/`11`; `11` §9.5/§12.2 still list AG-02/AG-03 (now API-M24-10/-11); `12-phases.md` §3/§10 initial status counts are pre-D-210 (status.py is authoritative); API-M14-55 roles differ between `06`/`07` and `04c`; vendor nav badges source API-M14-03 (`04c`) vs API-M18-15 (`06`) | plan | OPEN (low) |
| 8 | 2026-09-28 | **Mockup sample-data inconsistencies** found while writing the ERP help (left unchanged — samples only): P-E02 "Awaiting payment" tile 12 vs saved view 3, "Overdue dispatch" 2 vs 1 overdue row; P-E03 "Ready to ship" count 8 vs 6 rows, Overdue tile 2 vs 1; P-E07 "2 pending changes" with one shown; P-E08 Reserved tile 186 units vs 186 holds / 412 units, "3 bins frozen" vs 1 shown; P-E09 Open POs 14 vs stage bar 19, buyer self-approval ₹1 L vs "creator can't approve"; P-E12 GST series still flags the gap the close checklist says was explained; P-E15 Thresholds callout cites "D-07" (plan: D-024); P-E02 cancel form disables every line on partly shipped orders although BP §10.1/§10.3 allow cancelling unshipped lines | mockup | OPEN — tidy in the next mockup revision (T-0-M09-03) |
| 9 | 2026-09-28 | ERP and vendor pages overflowed sideways on phones (≈130–435 px at 390 px, v0.1) | mockup | RESOLVED 2026-09-28 — responsive layouts (04b §2.24); scope D-226 |
| 11 | 2026-09-28 | `root-admin-mockup/` is **not linked** from any client-facing page (D-249), but the repository root is published by GitHub Pages, so it is reachable by URL to anyone who types the path. Every page is `noindex,nofollow`. | mockup / publication | OPEN — decide with D-115 whether to move it out of the published site before the next client demo |
| 12 | 2026-09-28 | The SaaS change is documented in the plan but **no code exists yet**, so none of the new rules (store scoping, capability gating, terminology tokens, artefact loading) has been exercised against a real operational core. `TS-PROOF-11` and `TS-PROOF-12` (Stage 0, D-252) are the first real test of D-233 and D-248. | plan | OPEN — by design; resolved when Stage 0 proof runs |
| 13 | 2026-09-28 | Existing task blocks written before 2026-09-28 still describe electronics behaviour (serials, condition grades, compatibility) as if it were the product. Under D-251 that behaviour is now pack `VP-electronics`. The blocks were **not** rewritten — the rule is recorded once, in `19` §16 and in the per-file SaaS sections, and applies when each task is picked. | plan | OPEN (low) — apply the rule at pick time; do not mass-edit the tracker |
| 10 | 2026-09-28 | P-E15 `#integrations` has a 36 px horizontal overflow at 1024 px (already in v0.1). Cause: screen-reader-only "Done" labels in the contract checklist are absolutely positioned without a positioned ancestor; fixed for ≤ 980 px (`.table-wrap { position: relative }`); desktop left untouched on the user's instruction (no desktop changes) | mockup | OPEN — minor, desktop |

## 14. Session log (append-only; newest last)
### 2026-09-27 — plan creation
- Created `plan/` (conventions, decisions, stack, architecture, database, 3 frontend files, backend, API, auth,
  e-commerce, vendor/marketplace, ERP, admin, phases, TASKS, continuation protocol, testing, dependencies, master
  checklist, `tools/status.py`) and `/CLAUDE.md`.
- Sizes: 492 API endpoints · 154 registered entities · 36 screens · 191 decision rows (7 merged aliases) ·
  361 tasks (1 COMPLETED, 106 NOT_STARTED, 254 REQUIRES_DECISION) · `status.py --check`: 0 issues.
- Skeleton fixes applied from `17-dependencies.md` §14 and the task-writer reports (dependencies, decisions,
  seed owners); remaining plan gaps recorded in Known issues #3–#7.
- Next: "Continue implementation" → T-0-M01-03 (discovery questionnaire & next-meeting pack). The platform and
  UI decisions (D-001, D-003, D-004, D-005, D-049, D-115, D-211) gate Phase 1A.

### 2026-09-27 — storefront mockup made responsive (user request)
- Shared shell (`assets/tradex.js`, `assets/tradex.css`):
  - collapsible prototype toolbar ("Prototype menu");
  - phone/tablet header with a menu button, full-width search and a delivery-PIN row;
  - swipeable category pills;
  - accessible menu drawer: dialog, focus trap, Esc, focus return, category accordions;
  - phone bottom bar: Home · Categories · Deals/Dealer · Account · Cart;
  - reusable off-canvas panel helper (`TX.openSheet`);
  - bottom-sheet modals on phones, and help/compare/toasts that sit above the bottom bar.
  - Breakpoints: desktop ≥ 981 px, tablet 761–980 px, phone ≤ 760 px.
- Pages:
  - listing: filters become a left panel with a "Show N results" button;
  - product: stacked gallery with swipeable thumbnails and a sticky Add/Buy bar;
  - cart: sticky total + Checkout bar;
  - checkout: stacked steps, swipeable payment tabs;
  - order: vertical shipment tracker;
  - account: "Account menu" panel;
  - compare: sideways-scrolling table with pinned spec names;
  - help, returns, dealer, refurbished, login, home: layouts, banners and photo heroes reflow.
- ERP/vendor pages unchanged (staff mobile is Phase 2). Mockup annotations (phase notes) not edited.
- Scope question recorded as D-223 (OPEN). BP keeps mobile-web acceptance in Phase 2; the mockup now shows the
  responsive layouts either way.
- Tracker unchanged (361 tasks; next task T-0-M01-03); `status.py --check`: 0 issues.
- Follow-up (same day, user report: checkout review items not responsive):
  - A deep state crawl was added. It covers every tab, checkout/returns step, state switch, modal, drawer and
    guest/consumer/dealer view, plus URL variants.
  - It checks for page overflow, squeezed text, spill and clipping at 360/768 px.
  - Fixed:
    - checkout review items and summary lines;
    - stepper labels and tablet payment tabs;
    - cart saved rows and empty state;
    - account menu tables, list rows and field rows;
    - order lookup/status tiles; login form rows;
    - help store cards and tables; compare header; product breadcrumb, gallery buttons and spec columns;
    - dealer status panels; returns request rows.
  - Shared phone rules:
    - rows with buttons or notes wrap;
    - store data tables scroll with minimum column widths;
    - the dealer tag and delivery line are shortened on phones.
  - Result: 0 issues on all 13 store pages (~1,000 page states); 0 overflow at 13 widths 320–1920 px;
    0 JS errors; desktop 1440 px unchanged except live timers, a 1 px checkout summary shift and the active
    "Refurbished" link.

### 2026-09-28 — ERP & vendor mockup: contextual help and guided workflows (user request)
- User requests (same day): (1) an ⓘ explanation wherever needed in the ERP — sections, sub-sections, tabs, sub-tabs,
  inner pages, settings, configuration, workflows, modals, forms, tables, important buttons, statuses, notifications,
  short names/terms — opening a clear explanation (meaning, purpose, how to read it, what to do, fields/statuses/
  buttons, next step); (2) the same for the vendor portal; (3) make Orders, Pick · pack · dispatch, Returns, Products,
  Pricing, Inventory, Purchasing and Payments simpler and self-explanatory without removing any feature; (4) update
  the plan only where needed. Recorded as D-224 (DECIDED · User); content ownership as D-225 (OPEN); D-174 narrowed.
- Shared engine (`assets/tradex.js`, `assets/tradex.css`): `data-help` ⓘ buttons (placed after controls, beside
  labels, one "About this tab" per tab bar); non-modal help panel (modal sheet on phones) with page guide, glossary
  A–Z, search, back history, "Show help icons" switch; glossary abbreviations underlined at first mention per card
  with hover/focus tooltip; aliases (`see`); "How it works" strip, tab intro and next-step box components; top-bar ?
  opens the page guide; prototype bar "Help icons" toggle. Help CSS is scoped (`button.hi`, `section.flow`) — all 13
  storefront pages are pixel-identical to the committed version.
- Content (`assets/help/`): `glossary.js` 203 terms (BP §33 + terms met on the screens; page-local terms merged and
  reconciled), `shell.js` (ERP and vendor frame), 19 page files — about 1,500 entries in total. Written for
  non-experts; sample values and open decisions are labelled "sample" / "to be confirmed"; no decision IDs in texts.
- Guided workflows on P-E02, P-E03, P-E04, P-E06, P-E07, P-E08, P-E09, P-E12: 6-step strips with live sample counts
  and step filters, tab intros on every main tab, next-step boxes in record drawers/forms, 30 plain tab labels
  (crosswalk `04b` §2.22), clearer action labels; other additions listed in `04b` §2.23. Page layouts wrap at
  laptop widths (removed the v0.1 overflows at 1024 px on these pages).
- Work was split across parallel writers (no browsers); an interruption stopped 8 of them mid-page — each was resumed
  from the files on disk and completed; nothing was lost (keycheck on every page).
- Verification (sequential, one headless Chrome, `nice -n 19`): 19 ERP/vendor pages × 5 widths, every tab, modal and
  drawer opened, 562 visible ⓘ clicked — 0 JS errors, 0 empty panels, 0 missing keys, every tab has help, 1,553 ⓘ and
  626 marked terms; laptop/desktop overflow 0 except Known issue #10 (pre-existing); phone overflow unchanged or
  smaller (Phase 2, #9); help-engine functional test 13/13 (keyboard, Esc inside modals, focus return, tab help,
  links/back, search, glossary, aliases, hide-icons persistence, accessible names, phone focus trap); 0 JS errors on
  all 34 pages; storefront pixel-identical.
- Plan: `DECISIONS.md` D-224/D-225/D-174; `04b` rule 23, §2.21–§2.23, §3.2 #5; `04c` X20; tasks T-1A.3-M24-02,
  T-1A.16-M24-06, T-1B.1-M14-16 (+ `12-phases.md` skeleton/counts, `18-master-checklist.md`); T-1A.16-M24-03
  description updated (Help destination now D-224). Tracker 364 tasks; next task still T-0-M01-03;
  `status.py --check`: 0 issues. Known issues #8–#10 added (sample-data inconsistencies, phone overflow, P-E15 36 px).

### 2026-09-28 — ERP & vendor mockup made responsive (user request)
- User requests: make the Vendor and ERP sections responsive and usable on phones, tablets, laptops and desktops with
  professional, clean presentation — no new features, no removed functionality, no business-logic changes; **do not
  change the desktop UI**; and document every UI change in the plan so development has no gaps.
- Shared layer (`assets/tradex.css` "Workspace responsive", `assets/tradex.js`): ≤ 980 px the sidebar becomes a
  slide-in menu (☰; reuses `TX.openSheet` — dialog, focus trap, Esc, focus return); compact top bar (phone: search as
  a full-width row, icon buttons, full-width dropdowns); bare data tables auto-wrapped in a scroll container
  (`wrapTables`, inert on desktop via `.tw-auto`); table column minimums and scroll shadows; wrapping toolbars/headers;
  pipelines scroll; `.split`/`.ed-grid`/inbox stack; full-width drawers; bottom-sheet modals; "How it works" 3 per
  row / swipeable; charts redraw on width change; 16 px form text on phones.
- Page layer: all 19 pages got rules inside `@media (max-width: 980px | 760px | 420px)` in their own `<style>` (work
  split across 8 parallel writers — CSS only, no browsers; coordinator ran all checks). Only non-CSS change: bar-chart
  label width 132 px on phones in `erp-reports.html`.
- Verification (sequential, one headless Chrome, `nice -n 19`): state crawl of every page, tab, saved view, modal,
  drawer (+ inner tabs), menu panel, search row and notifications — 464 issues at 390/768 px before → 0 after;
  360/600 px: 0 after small-phone fixes (961 states in total). Desktop: 339 states (19 pages × all tabs ×
  1440/1280/1024 px) compared with the previous commit — 329 byte-identical, 10 sub-visible anti-aliasing noise
  (0 changed pixels above threshold; the same page varies against itself). Storefront: 342 states at 360/390 px clean;
  0 JS errors on 34 pages; help-engine test 13/13.
- Plan: D-226 (OPEN — ERP/vendor tablet/phone in Phase 1?); `04b` §2.24 (shared behaviour + per-screen table for
  P-E01–P-E15, P-V01–P-V04), rule 15; `04c` X16; storefront responsive spec written up in `04a` §2.5 (rule 7) for the
  27 Sep work (D-223); conditional tasks T-1A.9-M09-12 (D-223), T-1A.16-M24-07 and T-1B.1-M14-17 (D-226) with
  `12-phases.md` and `18-master-checklist.md` counts. Tracker 367 tasks; `status.py --check` 0 issues. Known issue #9
  resolved; #10 cause identified (desktop left unchanged).

### 2026-09-28 — SaaS architecture change applied to the plan, and the root admin mockup (user request)
- **User instruction** (recorded verbatim in `docs/SAAS_ARCHITECTURE_CHANGE.md`): redesign as a configurable SaaS
  e-commerce platform covering 31 store categories from one codebase; store users must never see the SaaS layer;
  a separate Configurable Root Admin with its own portal and codebase creates, configures and deploys stores;
  configuration lives in the database and is compiled to a fast runtime file; multiple selectable site templates;
  category-specific storefront, workspace and vendor behaviour. Plus: update the plan so a new session can start
  work without asking questions and resume where it stopped, and add an unlinked root admin mockup.
- **Source registered** as code `SAAS` (`00` §1) with a numbered requirement list S01–S24 for traceability.
- **Architecture written**: `19-saas-platform.md` (two-platform separation SEP-1…6, configuration layers L0–L5 and
  schema, artefact format and loader, reload and invalidation, performance budget, capability registry with six
  enforcement points, vertical packs with the 31-category catalogue, templates and theming, the store experience
  contract, the invisibility rules INV-1…10, tenancy and isolation, terminology, modules M30–M35, entities,
  business rules BR-M30-01…BR-M35-03, test suites, and a module-by-module impact table) and `20-root-admin.md`
  (codebase layout, platform roles, the seven abilities of the brief mapped to screens, the nine-step deployment
  pipeline, screens P-R01–P-R12, support access, API groups, entities, and how Tradex becomes store `tradex`).
- **Decisions**: D-227–D-253 recorded `DECIDED` (the user's brief is the decision for the architecture; the
  engineering choices it requires but does not name are recorded as plan design delegated by the brief, the same
  route as D-054 and D-210, each with its rationale and a change-control note). D-254 `LATER`, D-255 and D-256
  `OPEN` but blocking nothing. D-045 superseded.
- **Conventions**: new source codes SAAS and MK-R, evidence labels `SAAS` and `PACK`, ID schemes `S##`, `CAP-*`,
  `VP-*`, `TPL-*`, `CFG-*`, `TT-*`, `P-R##`, `S-VP-*`; modules M30–M35; entity registry §7.3 with the global
  `store_id` rule; page registry P-R01–P-R12; platform roles §9.1; repository layout gains `root-admin/`,
  `backend/platform/`, `frontend/storefront/templates/`, `config/generated/` and `root-admin-mockup/`; four new
  source-conflict rows.
- **Stages and tasks**: 71 new tasks, taking the tracker from 361 (pre-change: 367) to **438**. Stage 0 +7
  (two proof scenarios, pack inventory, configuration inventory, template study, operating model, scorecard
  update); stage 1A.1 +14 (the multi-store foundation — store context, tenant-safe data access, configuration
  schema, capabilities, artefact loader, reload, store settings, terminology, pack runtime, bootstrap CLI,
  two-store fixture, performance harness, codebase boundary); 1A.2 +3; 1A.3 +5; 1A.4 +3; 1A.9 +1; 1A.16 +1;
  1A.17 +2; **new stages 1R.1 (+10), 1R.2 (+12), 1R.3 (+10)**; 1B +2; stage 2 +1. Eleven existing tasks gained
  dependencies and `T-3-M03-01` became `NOT_APPLICABLE` (its question was D-045). No task ID was renamed, removed
  or re-staged, and no existing acceptance criterion was weakened; the eleven changes are listed in `12` §10.6.
- **Why the foundation sits inside stage 1A.1 rather than in its own stage**: `store_id`, capability declarations
  and terminology tokens are cheap while a table or endpoint is being written and expensive afterwards. A separate
  stage would either block the foundation on work that depends on it or guarantee a retrofit (`12` §10.2).
- **Tooling**: `tools/status.py` learned phase `1R` (order `0 → 1A → 1R → 1B → 2 → 3`) and no longer reports a
  `NOT_APPLICABLE` task whose dependencies are incomplete as an inconsistency. `--check`: 0 issues in 438 tasks;
  next task is unchanged (`T-0-M01-03`).
- **Per-file additions** at the end of 16 plan files so a reader of any one of them is not misled: stack needs
  (`01` §34), corrected system context and topology (`02` §29), the `store_id` rule, the root admin schema and
  `DB-G12` (`03` §11), storefront rules ST-S1…S8 (`04a` §12), workspace rules WS-S1…S7 (`04b` §19), vendor rules
  VP-S1…S6 (`04c` §21), modules M30–M35 (`05` §9), the two API surfaces and 404-not-403 (`06` §9), two identity
  realms and the capability-before-permission order (`07`), capability-gated commerce (`08` §13), store-scoped
  vendors (`09` §14), configuration-driven ERP (`10`), the administration split (`11`), the `TS-SAAS-*` suites and
  the two-store rule (`16` §18), the new critical path (`17`), and the SaaS checklist (`18`).
- **Root admin mockup** (`root-admin-mockup/`, D-249): 12 screens plus an internal overview, with its own
  `assets/ra.css` and `assets/ra.js` — no dependency on `assets/tradex.*` and a deliberately different visual
  identity. The clearest walkthrough is `ra-store-new.html`, which is the brief's own Fashion & Apparel example
  step by step. Every page is `noindex,nofollow,noarchive,nosnippet` and carries an "internal prototype" banner.
- **Verification**: 13 pages × 4 widths (390 / 768 / 1280 / 1600 px) in headless Chrome — 0 console errors,
  `scrollWidth == clientWidth` on every page at every width (tables and tab bars scroll inside their own
  containers by design), every `data-i` icon placeholder resolved, all internal links resolve. Link audit:
  **0 references** to the root admin from `index.html`, `credits.html`, the prototype toolbar or any
  `store-*`/`erp-*`/`vendor-*` page, and **0 links** from the root admin mockup into the store mockup.
  `git status` confirms no client-facing mockup file was touched.
- **Left deliberately undone**: existing task blocks were not rewritten to remove electronics wording (Known issue
  #13 — the rule is recorded once and applied at pick time, which is cheaper and safer than mass-editing a
  1.3 MB tracker); no implementation code was written; the 29 remaining vertical packs were not authored
  (D-241 builds the mechanism plus two packs, and D-255 prioritises the rest commercially).
- **Next**: "Continue implementation" still starts at `T-0-M01-03` (discovery questionnaire). The SaaS decisions
  need no confirmation; the Phase 1A gates (D-001, D-003, D-004, D-005, D-049) are unchanged.

### 2026-09-28 — second pass: production readiness, the control model, topologies and performance (user request)
- **Reported defect fixed first:** the root admin top bar was broken — the user chevron had no size constraint so
  it rendered at full height and the name wrapped. Cause: `.ra-user` is a `<button>` but not `.btn`, so the
  `.btn svg` sizing never applied. Fixed by sizing every icon in the top bar, replacing the `<br>`-based chip
  markup with a flex column, and adding narrow-width rules (search drops to its own row below 620 px, chip text
  hides below 760 px, the internal banner and card headers wrap instead of squeezing).
- **Audit run first, before adding anything.** An automated consistency pass over the whole plan checked that every
  `D-###`, task ID, `CAP-*`, `VP-*`, `TPL-*`, `M##`, `BR-*`, `TS-SAAS-*` and `P-R##` reference resolves, that every
  task block carries all 14 fields, and that every `P-R` screen has its mockup file. Result: **no real defects** —
  the apparent `TPL-01`/`CAP-03` collisions were substring matches on `TS-SAAS-TPL-01`/`TS-SAAS-CAP-03`, and the
  six "missing" decisions are IDs the plan explicitly reserves as unused. All 438 task blocks were complete.
- **Four user instructions arrived during the pass** and were built in rather than appended: (1) the root admin
  must switch modules and application access and delegate features to the store's ERP administrator; (2) a
  category may have its own modules, and the root admin must be able to assemble a category from reusable
  bundles, with the configuration covering everything; (3) the site, vendor portal and ERP must be fast, with no
  lag; (4) the code may be hosted on a dedicated server for one client or on one server running several stores —
  and each client's data, database and images must be separated, not clubbed together.
- **Control model (D-257, D-258):** surfaces → modules → capabilities, with three control states per item and the
  store's own administrator managing only what was delegated. Invariants CTL-1…CTL-7 cover the awkward parts: a
  store can never enable what was not delegated; a locked item is invisible rather than greyed; dependencies
  resolve before a switch is offered; a control-state change never silently discards the store's value; and
  switching something off follows a **run-out rule** so open work is never stranded.
- **Category modules and bundles (D-265, D-266, D-267):** a category may define its own modules, composed only
  from capabilities that already exist in the codebase — the line that stops a pack becoming a fork. Fourteen
  starting bundles; a category is `base + bundles + overrides` with explicit conflicts, pinned versions and
  reversible removal. A 25-dimension completeness gate blocks publication of a half-configured category.
- **Performance (D-268):** a full architecture section with per-surface budgets asserted in CI on realistic data
  with two stores, nine data-access rules (no N+1 with declared query counts, keyset pagination, `store_id`-leading
  indexes, bounded results, read models, statement timeouts, no long transactions, everything heavy asynchronous,
  partitioning), five cache layers with mandatory store-scoped keys, server-rendered storefront with hydrated
  islands, screen-shaped workspace endpoints, and one build per template rather than per store. `TS-PROOF-13`
  added to Stage 0 so a core that cannot meet the budgets is not chosen.
- **Topologies and separation (D-269–D-272):** one codebase, four placements. The **default changed** from a
  shared database to a **separated client on a shared server** — its own database, image container, search index,
  cache namespace and encryption key — with `store_id` scoping kept as a second, independent layer. Standalone
  client-hosted installs are specified in full: signed artefacts bound to one store and its hosts, pull or file
  delivery, bounded version skew, health reporting, and indefinite operation with the platform unreachable.
  Consequences handled rather than ignored: a fleet migration runner with canary and drift detection, a connection
  pooler with per-store ceilings, heavier provisioning with rollback, and simpler per-store restore.
- **Also closed:** configuration-schema evolution across releases (D-259 — the gap that would otherwise have
  broken every store on the first breaking change), per-store backup/restore/export/deletion (D-260), money and
  time across jurisdictions (D-261), quotas (D-262), environments and promotion (D-263), observability and blast
  radius (D-264). A 35-row edge-case table (`19` §23) became an executable suite, and a 15-gate definition of done
  (`19` §24) makes "no task is complete with a skipped test" mechanical rather than aspirational.
- **Tracker:** 438 → **457 tasks** (28 added, 9 of them in the first pass of the day), 0 issues from
  `status.py --check`. Ten existing tasks gained dependencies; two had their scope extended in place, both
  recorded in `12-phases.md` §10.7. No task ID was renamed, removed or re-staged.
- **Mockup:** 12 → **13 screens** (new `ra-bundles.html` for P-R13), plus Environments & hosting, surfaces,
  modules and delegated features on the store page, the three control levels and hosting in the wizard, per-client
  separation and signing keys in platform settings, MFA method and sessions in platform users, and a hosting
  column in the store list. Re-verified: 14 pages, 0 console errors, no page-level overflow at 390/768/1280/1600 px,
  all links resolve, still **0 links in either direction** between the two mockups.
- **Stated plainly and not glossed over:** no plan can guarantee defect-free code. `19` §24 is the honest version
  of that requirement — 15 gates a task must pass to be called complete, the CI list that enforces them, and what
  is measured rather than an invented coverage number.
- **Next:** unchanged. "Continue implementation" starts at `T-0-M01-03`.

### 2026-09-28 — third pass: the feature catalogue, channels and automations (user request)
- **User instruction:** features like WhatsApp, email, web chat and automation must be grantable or withheld per
  store — "if customer want that features only those can be granted else not" — with the option visible in the
  mockup and in the plan, the database and supporting changes included, and the documentation complete enough
  that an implementer does not have to infer anything.
- **The catalogue** (`19` §5.3) replaced the earlier 86-entry registry with ~230 grantable features across 18
  areas. Everything a client might buy is now a switch: each communication channel and each level within it, each
  automation, each integration, the store's own API and webhooks, sign-in methods, content and marketing
  features, reporting and presentation. Anything not in the catalogue cannot be granted, withheld or priced —
  which is the point of having one.
- **Source fidelity kept.** Every entry carries a build status (`1A`, `1B`, `LATER`, `CANDIDATE`). A `CANDIDATE`
  entry whose gating decision is open **cannot be granted to a store** — the compiler refuses and names the
  decision (`BR-M31-17`). So the catalogue can be complete while the plan still builds only what the sources
  support. Four new open decisions mark what is deliberately not built yet: marketing and engagement (`D-275`),
  web chat (`D-276`), analytics tags (`D-277`), store API and webhooks (`D-278`).
- **Channels are five layers, not one switch** (`19` §5.6). Capability → provider binding → verified sender
  (SPF/DKIM/DMARC for email, the number for WhatsApp and SMS) → approved templates → consent and caps.
  Publication is blocked until all five exist, with a report naming exactly what is missing. This closes the
  failure mode where a store is "given WhatsApp", looks configured, and silently sends nothing.
- **Messaging rules live in one place.** Consent per channel *and* purpose, preferences, frequency caps and quiet
  hours across all channels together, idempotency on a unique message key, template resolution, per-store rate
  limits, delivery tracking with suspension, and log redaction are all in the messaging service. A channel
  adapter does nothing but hand bytes to a provider, so adding a channel cannot get any of them wrong.
- **Each automation is its own capability**, with a guard, a preview, an idempotent execute, a run log, an owner
  and a pause that needs no deployment. An automation that sends a message cannot be enabled without its channel
  and its approved template — the compiler blocks that configuration and names both.
- **Database work documented rather than implied** (`03` §12): what lives where and why the catalogue and the
  per-store state must not share a table; the store-side entities with their keys and constraints; the
  root-admin control entities; the five indexes that matter and the two tables that grow without limit;
  migration group `DB-G13` and where it splits across stages; and the six rules the schema itself enforces.
- **Implementation contracts** (`19` §26) so an implementer has a checklist rather than a principle: the nine
  artefacts every capability needs and the order to write them in; the six anti-patterns the lint rules reject
  (403 instead of 404, a greyed control, a UI-only check, deleting on disable, a pack-id branch, a per-request
  capability read); the channel adapter interface and the rules an adapter may **not** implement itself; the
  automation rule interface; and the build order for any new area of behaviour.
- **Every plan file swept** for consistency with the change: `00`, `01` §35, `02` §30, `03` §12, `04b` §20, `05`
  §10, `06` §10, `07`, `08` §14, `09` §15, `10`, `11`, `12` §3 and §10.8, `16`, `17`, `18`, `19`, `20`, README
  and this file.
- **Tracker:** 457 → **463 tasks**, 0 issues. One ID collision was caught before it landed (`T-1A.13-M20-05`
  already existed) and the new task renumbered.
- **Mockup:** a Channels & integrations tab on the store page showing each channel with its provider, sender and
  template state, the automations granted to that store, the integrations, and a live publish check; the
  capability screen now shows the catalogue by area plus a channels-and-automations view; the create-store wizard
  grants channels and automations as steps 4 and 5. Two further defects found and fixed while verifying: a
  deep-linked tab left the page scrolled into empty space, and the support-access banner's icon had no size rule.
- **Next:** unchanged. "Continue implementation" starts at `T-0-M01-03`.

### 2026-09-28 — the feature map, and the mockup baseline (user request)
- **User instruction:** express things in the plan as features with an enable/disable option so an implementing
  AI understands them properly, and leave the front-end mockup with every feature enabled for now.
- **The gap this closed.** The catalogue (`19` §5.3) said *what* can be granted; nothing said *where* each switch
  is enforced. An implementer building P-S03 had no way to know that the inspection report is governed by
  `CAP-QC_INSPECTION` and the compatibility block by `CAP-COMPATIBILITY` — so gating would have been applied by
  guesswork, which is exactly how a store ends up seeing a feature it was never granted.
- **`21-feature-map.md`** now maps every section of every screen — P-S01–P-S15, P-E01–P-E16, P-V01–P-V05 — to the
  one capability that owns it and states what the store sees when it is off (in almost every case: nothing at
  all, not a greyed control). Grounded in the mockup's real tabs and sections rather than invented ones. Plus a
  reverse index from capability to screens, endpoint groups, entities and the tasks that build it, and the rules
  FM-1…FM-5 for keeping it correct.
- **`T-1A.3-M31-02`** makes it executable: the build fails when a store-facing route, section or component has no
  declared capability, and a reconciliation check fails when the code and the map disagree — so the two cannot
  drift apart silently. The map is the human-readable half of `TS-SAAS-CAP-02`; where they disagree, the test is
  right.
- **The mockup stays ungated, on purpose (`D-279`).** It is the *reference store*: every Phase-1 feature enabled,
  a picture of the system rather than of one client's configuration. Gating it would make client review harder
  and would put SaaS concepts in front of a client, which the invisibility rule forbids anyway. No client-facing
  file was changed. What changed is that the plan now says so explicitly, so nobody mistakes the mockup's
  completeness for "these sections are always present", and an implementer copying a mockup screen knows the
  mockup will not tell them what to gate — the map will.
- **Tracker:** 463 → **464 tasks**, 0 issues.
- **Next:** unchanged. "Continue implementation" starts at `T-0-M01-03`.

### 2026-09-28 — contextual help for the Configurable Root Admin (user request)
- **User instruction:** the same ⓘ explanations the ERP and vendor sections have (D-224), in the root admin, so
  anyone managing the platform has a clear idea of each section, subsection and item and what it does.
- **Why it matters here more than anywhere else:** this portal can create, reconfigure, suspend and permanently
  close a client's entire business. An operator needs to know what a control does *before* using it.
- **Engine** (`assets/ra-help.js`, self-contained like the rest of the portal — no dependency on the store
  mockup's help engine, for the same reason as D-228): ⓘ injection from `data-help` attributes, a non-modal side
  panel that **shifts the main column rather than covering it** so the thing being explained stays visible, an
  "About this tab" control per tab bar, search across every entry, a glossary reachable from the panel and from
  dotted-underlined first mentions, back history, Esc to close, and a help-icons toggle remembered between visits.
- **Content** (`assets/help/`): a glossary of about 50 platform terms — store, category, bundle, template,
  feature, module, delegation, built configuration, publish, deploy, drift, propagation, separation, hosting,
  client-hosted install, support access, canary, completeness check, and the rest — plus a shell file and one file
  per screen. Every entry follows the six-part shape: what it is · why it matters · how to read it · what to do ·
  what happens next · worth knowing. Written for a manager, not an engineer; irreversible and two-person actions
  say so; anything gated by an open decision is described as needing a scope decision rather than as available.
- **Coverage:** 80 headings, 36 tabs, 5 dashboard tiles and the shell elements marked across all 13 screens.
- **Verification:** every ⓘ on every page clicked in headless Chrome — **517 help targets, 0 missing entries,
  0 empty panels, 0 console errors**. A 10-check functional test passed: panel opens, glossary lists entries, a
  term opens, back works, search returns results, Esc closes, icons hide and show, terms are underlined and carry
  a tooltip. Layout re-verified at 390 px and 1600 px across all 14 pages: no overflow, no scroll problems, no
  console errors.
- **Three fixes found while verifying:** the panel padded only the inner body, so the top bar and the
  support-access banner were cut off — now the whole main column shifts; the panel title showed a focus box from
  the programmatic focus used for screen-reader announcement; and glossary underlining was marking text inside
  table headers and headings, which read as noise.
- **Plan:** `D-280` recorded; `20-root-admin.md` §11 specifies the pattern, the six-part entry shape and rules
  H-1…H-6, including that help content is part of the definition of done for every root admin screen;
  `T-1R.1-M34-11` builds the engine and `T-1R.3-M34-06` completes and reviews the content.
- **Tracker:** 464 → **466 tasks**, 0 issues.
- **Next:** unchanged. "Continue implementation" starts at `T-0-M01-03`.

