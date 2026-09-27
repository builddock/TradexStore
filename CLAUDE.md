# Tradex — instructions for Claude sessions

Tradex is a connected **e-commerce storefront + ERP web workspace + vendor portal** for an Indian retailer of
computers, laptops, PC parts, cameras and electronics (new, open-box, refurbished, used), with branches, a central
warehouse, approved dealers (B2B), suppliers and WhatsApp ordering. Phase 1 = web storefront + ERP web workspace;
mobile = Phase 2; AI = Phase 3.

## Repository map
| Path | What | Rule |
|---|---|---|
| `docs/` | Source requirements: `meeting.txt`, `ERP_Ecommerce_Implementation_Blueprint.md` (BP), two proposal PDFs | Read-only sources of truth |
| repo root `*.html`, `assets/` | Clickable mockup v0.1 (32 screens) — the UI reference, published by GitHub Pages | Do not modify unless the user asks |
| `plan/` | Implementation plan, `TASKS.md` (task tracker), `STATE.md` (progress), `DECISIONS.md` (open questions) | Update tracking files every session |
| `frontend/`, `backend/`, `infra/`, `tests/` | Implementation code (created during Phase 1) | Layout: `plan/00-conventions.md` §11 |

## When the user says "Continue implementation"
Follow **`plan/14-continuation-protocol.md`** exactly. In short:
1. Inspect the repo (`git status`, implementation folders), read `plan/STATE.md`, run `python3 plan/tools/status.py`.
2. Reconcile `TASKS.md` with the actual code and tests (resume `IN_PROGRESS` work first; never redo `COMPLETED` work).
3. Pick the next eligible task (all dependencies `COMPLETED`, no `OPEN` decision). If it needs a decision, **ask the
   user** with the documented options — never assume.
4. Mark it `IN_PROGRESS`, implement only that task, run its tests.
5. Update `TASKS.md` (status + evidence) and `STATE.md` (snapshot, logs), then stop at a logical point and report.

## Non-negotiable rules
- **Source fidelity:** build only what `docs/`, the mockup, or a `DECIDED` entry in `plan/DECISIONS.md` supports.
  Mockup sample values (prices, names, day counts, ₹ limits, product names of couriers/accounting tools) are not
  requirements. Gaps → add a decision to `DECISIONS.md` and ask.
- Use the IDs in `plan/00-conventions.md` (modules M##, entities E-*, pages P-*, roles R-*, APIs API-*, tasks T-*).
- Never start Phase 2/3 (`LATER`) work, never skip dependencies, never duplicate an existing module/component —
  search the codebase first.
- Money is never floating point (BP §8.1); never trust client-sent price, role, stock, seller or refund-approval
  fields (BP §17.4); payments/refunds/orders must be idempotent (BP §10.2–10.3).
- The user commits to git themselves unless they ask you to commit.

## Plan index
`plan/README.md` lists every plan file and what it covers.
