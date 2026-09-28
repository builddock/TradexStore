# 14 — Claude continuation / resume protocol

**Audience:** every Claude session that works on Tradex. **Trigger:** the user says *"Continue implementation"*
(or anything equivalent: "continue", "next task", "resume"). Follow this protocol exactly, every time, from step 1.
Do not restart the project, do not re-plan, do not rely on memory of earlier sessions — the repository, `TASKS.md`,
`STATE.md` and `DECISIONS.md` are the only memory.

Related files: `plan/TASKS.md` (task source of truth) · `plan/STATE.md` (progress snapshot & logs) ·
`plan/DECISIONS.md` (open questions) · `plan/00-conventions.md` (IDs, labels, repo layout) ·
`plan/tools/status.py` (computes status and the next eligible task).

---

## 1. Inspect before touching anything
1. `cd` to the repository root (`TradexStore/`). Run `git status` and `git log --oneline -15`. Note uncommitted
   changes — they may be a previous session's unfinished work (see step 5).
2. List the implementation folders (`frontend/`, `backend/`, `infra/`, `tests/`) and read their top-level README
   or entry files if they exist.
3. Read, in this order: `plan/STATE.md` (whole file), `plan/DECISIONS.md` (rows with status `OPEN` or
   `PROPOSED-DEFAULT` that block current work), then the `TASKS.md` section for the current stage.
4. Run `python3 plan/tools/status.py` — it prints the current stage, counts per status, in-progress tasks,
   blocked tasks and the **next eligible task** (dependencies all `COMPLETED`, no open blocking decision).

## 2. Reconcile the tracker with reality (never trust the tracker blindly)
5. For every task marked `IN_PROGRESS` in `TASKS.md`, and for the task named as "current" in `STATE.md`:
   - inspect the files listed under **Files/components** and **Evidence**, run the task's tests;
   - if the acceptance criteria are all met and tests pass → mark `COMPLETED`, fill **Evidence**;
   - if partially done → keep `IN_PROGRESS`, write exactly what exists and what is missing under **Evidence**
     ("Done: … / Remaining: …"). This task is resumed **before** any new task.
6. Spot-check the last 3 tasks marked `COMPLETED` (files exist, tests still pass). If a completed task is broken,
   record it in `STATE.md` → *Known issues*, set it back to `IN_PROGRESS` only if its acceptance criteria no longer
   hold, and fix it first.
7. If code exists that no task accounts for, do **not** delete or rewrite it. Record it in `STATE.md` → *Known
   issues* ("untracked implementation: …") and ask the user how to treat it.

## 3. Choose the next task (dependency-aware)
8. Priority order:
   a. an `IN_PROGRESS` task (resume it);
   b. otherwise the next eligible task reported by `status.py`: lowest stage first (0 → 1A.1 → 1A.2 … → 1B.x), then
      task order within the stage;
   c. never start a task whose **Depends on** list contains anything not `COMPLETED`;
   d. never start a task in a later stage while an earlier stage still has eligible `NOT_STARTED` tasks, unless
      `12-phases.md` explicitly marks the two stages as parallelisable;
   e. never start `LATER` work (Phase 2/3, M15, M28, M29).
9. If the chosen task is `REQUIRES_DECISION` or depends on an `OPEN` decision:
   - **stop and ask the user**, presenting the decision's question and the documented options from
     `DECISIONS.md` (quote the sources). Do not choose on the user's behalf and do not "temporarily assume".
   - While waiting, you may continue with another eligible task that does not depend on that decision — say so.
   - When the user answers, record it (see `DECISIONS.md` → "How to record a decision") before implementing.
10. Tell the user in one or two lines which task you are starting and why it is next.

## 4. Implement the task — within its boundaries
11. Set the task to `IN_PROGRESS` in `TASKS.md` and set *Current task* in `STATE.md` **before** writing code.
12. Implement only what the task's description and acceptance criteria require, in the files/folders it names
    (repo layout: `00-conventions.md` §11). Reuse existing modules and components — search the codebase first
    (`grep`/`rg` for the entity, API ID, page ID, component) so nothing is built twice.
13. Source fidelity: behaviour must trace to `docs/`, the mockup, or a `DECIDED` decision. If you discover a gap,
    add a new decision to `DECISIONS.md` (next free ID), mark the affected task `REQUIRES_DECISION`, and ask.
14. Do not modify `COMPLETED` functionality unless the current task's acceptance criteria require it; if you must,
    say so in the task's Evidence and re-run that functionality's tests.
15. Do not edit the mockup pages, `docs/`, or plan files other than the tracking files, unless the task says so.
    If the plan itself is wrong, record a *Known issue* and ask before changing it.

## 5. Test
16. Run the tests listed in the task (unit, API, integration, E2E, BP acceptance tests T01–T36 where referenced).
    Tests must actually run and pass; if a test cannot run (missing tool/environment), the task is not
    `COMPLETED` — record why under Evidence and in *Known issues*.
17. Run the regression suite for modules the change touches (see `16-testing.md`).

## 6. Record progress (same session, before stopping)
18. In `TASKS.md`, for the task: set **Status**; fill **Evidence** with date, commit hash (if committed), files
    changed, migrations added, APIs implemented, tests run + results, and remaining work (if any).
19. In `STATE.md`: update the snapshot, the relevant tables (migrations, APIs, pages, modules, tests), append to
    *Files changed*, *Completed tasks* and the *Session log*. Keep entries short and factual.
20. Run `python3 plan/tools/status.py` again and paste its summary into the session log entry.
21. Commit only if the user has asked for commits (the user commits to git themselves unless they say otherwise).

## 7. Stop at a logical point
22. Stop after completing the task (or a coherent sub-part of a large task) — do not start a second large task in
    the same turn unless the user asked for several. End with a short report: task done, tests, what is next,
    any decision the user must make.
23. Next session: start again at step 1. Never skip the reconcile step.

---

## Guard-rails (the protocol exists to prevent these)
| Risk | Guard |
|---|---|
| Re-implementing completed functionality | Steps 5–7 reconcile first; step 12 searches the codebase before writing |
| Skipping unfinished dependencies | Step 8c; `status.py` only offers tasks whose dependencies are `COMPLETED` |
| Duplicate functionality | Step 12 search; one module owns each entity/API (see `05-backend.md`) |
| Changing completed functionality unnecessarily | Step 14 |
| Undocumented assumptions | Step 13; `DECISIONS.md`; source-fidelity rules in `00-conventions.md` §2 |
| Starting later phases early | Step 8d–e |
| Losing progress between sessions | Steps 11, 18–20 (tracker updated before and after work) |
| Silent partial work | Step 5 "Done / Remaining" evidence; `IN_PROGRESS` is resumed first |

## Other user requests
- *"What's the status?"* → run steps 1–4 and report `status.py` output plus open decisions; change nothing.
- *"Implement task T-…"* → verify its dependencies/decisions (steps 8–9) first; if not eligible, explain why.
- *"We decided X"* → record the decision (`DECISIONS.md` procedure), update affected tasks, then continue.
- *"Change requirement …"* → BP §25.5 change control: record it as a decision/change entry, identify affected tasks,
  and ask for confirmation before editing the plan.

---

## SaaS architecture change — what every session must know (2026-09-28, `D-227`)

The architecture changed on 2026-09-28: this is **one configurable SaaS e-commerce platform**, and Tradex is
store #1 on it. Source: `docs/SAAS_ARCHITECTURE_CHANGE.md`. Architecture: `19-saas-platform.md`,
`20-root-admin.md`. Decisions: `D-227`–`D-256`.

### Add to step 1 (inspect)
After reading `STATE.md`, read **`19-saas-platform.md` §1 and §2** (about five minutes). They change how every
other plan file must be read: MEET/BP/PR1/PR2 and the mockup specify **one store**, not the whole product
(`00-conventions.md` §1.2).

### Add to step 9 (decisions)
`D-227`–`D-253` are already `DECIDED` — the user's brief is the decision and the user asked that work be able to
start without further questions. **Do not re-open them and do not ask the user to confirm them.** `D-254`
(`LATER`), `D-255` and `D-256` are open but block nothing in Phase 1. Everything else is unchanged: a task
blocked by any other `OPEN` decision still stops and asks.

### Add to step 12 (implement) — the seven rules that are easy to break
1. **One codebase.** A new e-commerce category is a vertical pack (data); a new look is a template under
   `frontend/storefront/templates/`. Never fork, never branch on a pack id (`BR-M32-02`).
2. **`store_id` from the first migration.** Every store-scoped table, every unique constraint, every index
   prefix, every job payload (`BR-M30-01…04`). Adding it later means migrating live data.
3. **No configuration I/O on the request path.** Read from the immutable snapshot; never add a "just one query"
   fallback (`BR-M31-01`, `D-248`).
4. **Declare a capability for every store-facing route and component**, and enforce it at all six points.
   Disabled means **404**, not 403 (`BR-M31-02`, `D-229` INV-3). Before building any screen, read that screen's
   row in **`21-feature-map.md`** — it names the capability that governs each section, and the mockup you are
   copying shows a store with *everything* enabled (`D-279`), so it will not tell you what to gate.
5. **No hard-coded concept word and no hard-coded visual value.** Terminology tokens and theme tokens
   (`BR-M33-02`, `D-239`).
6. **Nothing store-facing may reveal the platform** — no other store, no category list, no template list, no
   capability or configuration identifier, no platform vocabulary, no link to the root admin (`D-229` INV-1…10).
   A locked setting is **absent** from the store admin, never greyed out.
7. **`root-admin/` is a hard boundary.** No import in either direction; the store runtime never reads the
   platform database (`19` §2 SEP-1…SEP-6).

### Add to step 16 (test)
Every integration and E2E run uses the **two-store fixture** (`T-1A.1-M30-04`). A change that passes with one
store and fails with two is the regression this architecture exists to prevent. The `TS-SAAS-*` suites
(`16-testing.md` §18) run in CI on every change, not before a release.

### Add to step 15 (do not edit)
The root admin mockup lives in `root-admin-mockup/` and must **never** be linked from `index.html`, the prototype
toolbar, `credits.html` or any `store-*`/`erp-*`/`vendor-*` page — the client must not see it during a demo
(`D-249`). Check this before committing any mockup change.

### Where the work is
`12-phases.md` §10 lists every added stage and task and the eleven existing tasks that changed. Stage order is
`0 → 1A.1…1A.17 → 1R.1…1R.3 → 1B.1…1B.5 → 2 → 3`; `tools/status.py` enforces it and still reports the next
eligible task exactly as before.
