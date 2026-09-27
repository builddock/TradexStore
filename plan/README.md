# Tradex implementation plan — index

Written for: future Claude sessions and developers implementing Tradex. Every requirement traces to `docs/`
(meeting summary, blueprint, proposals) or the mockup at the repo root. Gaps are recorded as decisions, never
filled by assumption.

**To continue work:** follow `14-continuation-protocol.md` (summary in `/CLAUDE.md`).
**To see progress:** `python3 plan/tools/status.py`.

| # | File | Covers (request section) |
|---|---|---|
| 0 | `00-conventions.md` | Sources, source-fidelity rules, evidence labels, status values, ID schemes, module/entity/page/role registries, repository layout (§19 Source-fidelity rule) |
| — | `DECISIONS.md` | Every NOT SPECIFIED / REQUIRES DECISION item (D-###), with documented options and what it blocks |
| 1 | `01-tech-stack.md` | Complete technical stack — where and why each technology is used (§1) |
| 2 | `02-architecture.md` | System architecture: frontend, backend, database, API, auth, e-commerce, vendor, marketplace, ERP, admin, files, search, notifications, payments, integrations, jobs, logging, errors, security, deployment (§2) |
| 3 | `03-database.md` | Logical data model: every entity, columns, keys, relationships, statuses, ER diagrams, migration order, seed, initialisation, validation (§3) |
| 4a | `04a-frontend-storefront.md` | Storefront screens P-S01–P-S13, store shell, design system (§4) |
| 4b | `04b-frontend-workspace-1.md` | ERP workspace shell + P-E01–P-E08 (§4) |
| 4c | `04c-frontend-workspace-2-vendor.md` | ERP workspace P-E09–P-E15 + vendor portal P-V01–P-V04 (§4) |
| 5 | `05-backend.md` | Backend modules M01–M27: services, business rules (BR-*), jobs, integrations, tests, completion criteria (§5) |
| 6 | `06-api.md` | API catalogue API-M##-## with contracts (§6) |
| 7 | `07-auth-roles-permissions.md` | Authentication, sessions, roles, permissions, protected pages/APIs (§7) |
| 8 | `08-ecommerce.md` | E-commerce features (§8) |
| 9 | `09-vendor-marketplace.md` | Vendor onboarding, approval, submissions, availability, supplier fulfilment; marketplace (LATER) (§9) |
| 10 | `10-erp.md` | ERP modules: catalog, pricing, inventory, purchasing, fulfilment, returns, finance boundary, reporting, automation (§10) |
| 11 | `11-admin.md` | Administration: control centre, users, approvals, configuration, reports, system controls (§11) |
| 12 | `12-phases.md` | Phase-by-phase / stage-by-stage implementation plan (§12) |
| 13 | `TASKS.md` | Task-level tracker — the source of truth for task status (§13) |
| 14 | `14-continuation-protocol.md` | "Continue implementation" protocol for Claude (§14) |
| 15 | `STATE.md` | Persistent implementation state & logs (§15) |
| 16 | `16-testing.md` | Testing strategy and suites (§16) |
| 17 | `17-dependencies.md` | Dependency-aware development order, parallel work (§17) |
| 18 | `18-master-checklist.md` | Final master checklist (§18) |
| — | `tools/status.py` | Computes status, next eligible task, blocking decisions, tracker consistency |

Reading order for a new session: `/CLAUDE.md` → `STATE.md` → `14-continuation-protocol.md` → `status.py` →
the `TASKS.md` stage in progress → the plan files referenced by the task.
