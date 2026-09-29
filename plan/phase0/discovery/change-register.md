# Change register (BP §2.3, §25.5)

| Field | Value |
|---|---|
| Task | `T-0-M01-03` (location per `D-210`) |
| Definition | "New requests after approval, including effort and impact" (BP §2.3) |
| Opened | 2026-09-29 — **no entries**. No release scope has been approved yet (`release-scope.md`), so there is no baseline to change |
| Shareable | Yes |
| Separate from | `vision-backlog.md` and `release-scope.md` (BP §2.3) |
| Later home | Whether the register moves into the ERP workspace (`E-change_request`, `API-M24-07`) or stays in project tooling is `D-191`. The fields below match `E-change_request` (`03-database.md` §2.21.27) so entries can move without re-keying |

## Rules
1. **Before a baseline is approved**, a new request goes to `vision-backlog.md`, not here. The register starts
   with the first approved version in `release-scope.md`.
2. **Every entry states** business reason, acceptance criteria, alternatives, effort range, recurring cost,
   affected dates and decision. It records who approved the change and which baseline it changes (BP §25.5).
   Acceptance criteria are required before a decision is taken (`03-database.md` §2.21.27).
3. **When the budget is fixed, offer a scope swap**: name what leaves the baseline to make room (BP §25.5).
4. **Decision** is one of `pending` · `approved` · `rejected` · `deferred`. An approved change updates
   `release-scope.md` and adds a new baseline version there. A deferred or rejected request may be kept in the
   vision backlog.
5. **Requested by / decided by** are recorded as roles. Store a personal name only with the client's agreement
   while `D-115` (publication) is open.
6. Entry IDs are `CR-001`, `CR-002`, … in order. They are never reused or renumbered.

## Entries
| ID | Date raised | Type | Title | Requested by | Business reason | Acceptance criteria | Alternatives | Effort range | Recurring cost | Affected dates | Scope swap offered | Decision | Decided by · date | Baseline changed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| — | | | *No entries: no approved baseline yet* | | | | | | | | | | | |

*Type* follows `E-change_request.request_type`: `report` · `integration` · `feature` · `other`.
