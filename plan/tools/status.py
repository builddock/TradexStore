#!/usr/bin/env python3
"""Tradex plan status tool.

Reads plan/TASKS.md and plan/DECISIONS.md and reports progress, the next eligible task, blocking decisions and
tracker inconsistencies. Used by the continuation protocol (plan/14-continuation-protocol.md, step 4 and 20).

Usage:
  python3 plan/tools/status.py               # summary + next eligible task
  python3 plan/tools/status.py --stage 1A.3  # list tasks of one stage
  python3 plan/tools/status.py --task T-1A.4-M06-03
  python3 plan/tools/status.py --decisions   # open decisions ranked by number of blocked tasks
  python3 plan/tools/status.py --check       # consistency checks only (exit code 1 on problems)

Task block format expected in TASKS.md (one block per task):
  #### T-<stage>-<M##>-<nn> · <title>
  - **Status:** NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | REQUIRES_DECISION | NOT_APPLICABLE
  - **Stage / Module:** <stage> / <M##>
  - **Depends on:** T-..., T-...   (or —)
  - **Decisions:** D-###, ...        (or —)
"""
import argparse
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

PLAN = Path(__file__).resolve().parent.parent
STATUSES = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "REQUIRES_DECISION", "COMPLETED", "NOT_APPLICABLE"]
DONE = ("COMPLETED", "NOT_APPLICABLE")  # both satisfy dependencies (D-213)
PHASE_ORDER = {"0": 0, "1A": 1, "1B": 2, "2": 3, "3": 4}
TASK_ID = re.compile(r"T-[0-9A-Z.]+-M\d{2}-\d{2,3}")

# Stage-order rules from 12-phases.md §5 (continuation protocol step 8d-e). Keep in sync with that section.
# Stages in the same group may run in parallel; otherwise a later stage waits while an earlier stage still has
# eligible NOT_STARTED tasks.
PARALLEL_GROUPS = [
    {"1A.2", "1A.3"},                          # P1
    {"1A.5", "1A.6", "1A.7", "1A.8"},          # P2
    {"1A.9", "1A.10"},                         # P3
    {"1A.10", "1A.11"},                        # P4
    {"1A.12", "1A.13"},                        # P5
    {"1A.13", "1A.14", "1A.15", "1A.16"},      # P6
    {"1B.1", "1B.2", "1B.3"},                  # P10
    {"1B.3", "1B.4"},                          # P11
]
# P7: these 1A.17 migration-track tasks may run alongside 1A.14-1A.16
PARALLEL_TASKS = {"T-1A.17-M25-01": {"1A.14", "1A.15", "1A.16"},
                  "T-1A.17-M02-01": {"1A.14", "1A.15", "1A.16"},
                  "T-1A.17-M27-01": {"1A.14", "1A.15", "1A.16"}}
# P8: Phase 1B starts after cutover. If D-048 decides a combined 1A+1B launch (P9), remove this gate.
STAGE_GATES = {"1B": "T-1A.17-M25-06"}
LATER_STAGES = {"2", "3"}                      # never offered as next task (protocol step 8e)


def parallel(a, b, tid=None):
    if tid in PARALLEL_TASKS and b in PARALLEL_TASKS[tid]:
        return True
    return any(a in g and b in g for g in PARALLEL_GROUPS)
DEC_ID = re.compile(r"D-\d{3}")


def stage_key(stage):
    """'1A.10' -> (1, 10); '0' -> (0, 0); unknown stages sort last."""
    m = re.match(r"^(0|1A|1B|2|3)(?:\.(\d+))?$", stage.strip())
    if not m:
        return (99, 0)
    return (PHASE_ORDER[m.group(1)], int(m.group(2) or 0))


def parse_tasks(path):
    tasks, order = {}, []
    cur = None
    for line in path.read_text(encoding="utf-8").splitlines():
        h = re.match(r"^#{3,5}\s+(T-[0-9A-Z.]+-M\d{2}-\d{2,3})\s*[·:\-–—]\s*(.+)$", line)
        if h:
            cur = {"id": h.group(1), "title": h.group(2).strip(), "status": None, "stage": "", "module": "",
                   "deps": [], "decisions": []}
            if cur["id"] in tasks:
                cur["duplicate"] = True
            tasks[cur["id"]] = cur
            order.append(cur["id"])
            continue
        if not cur:
            continue
        f = re.match(r"^\s*[-*]\s+\*\*(.+?):\*\*\s*(.*)$", line)
        if not f:
            continue
        key, val = f.group(1).strip().lower(), f.group(2).strip()
        if key == "status":
            cur["status"] = val.split()[0].strip("`") if val else None
        elif key.startswith("stage"):
            parts = [p.strip() for p in val.split("/")]
            cur["stage"] = parts[0].strip("`") if parts else ""
            cur["module"] = parts[1].strip("`") if len(parts) > 1 else ""
        elif key.startswith("depends"):
            cur["deps"] = TASK_ID.findall(val)
        elif key.startswith("decision"):
            cur["decisions"] = DEC_ID.findall(val)
    return tasks, order


def parse_decisions(path):
    decs = {}
    if not path.exists():
        return decs
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.startswith("| D-"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 6:
            continue
        did = cells[0]
        # Status column is the 6th cell (ID, Question, Options, Approver, Blocks, Status, Decision)
        status = cells[5] if len(cells) > 5 else ""
        decs[did] = {"status": status, "question": re.sub(r"\*\*", "", cells[1])[:90]}
    return decs


def resolve(decs, did, seen=None):
    """Follow `MERGED → D-###` aliases to the decision that actually needs deciding."""
    seen = seen or set()
    d = decs.get(did)
    if d is None or did in seen:
        return did
    m = re.search(r"MERGED\s*(?:→|->)\s*(D-\d{3})", d["status"])
    return resolve(decs, m.group(1), seen | {did}) if m else did


def decision_open(decs, did):
    d = decs.get(resolve(decs, did))
    if d is None:
        return True  # unknown decision id counts as open (and is reported by --check)
    return not d["status"].upper().startswith("DECIDED")


def analyse(tasks, order, decs):
    done = {t for t, v in tasks.items() if v["status"] in DONE}
    eligible, unblocked_rd, issues = [], [], []
    for tid in order:
        t = tasks[tid]
        if t.get("duplicate"):
            issues.append(f"{tid}: duplicate task id")
        if t["status"] not in STATUSES:
            issues.append(f"{tid}: invalid/missing status '{t['status']}'")
        if not t["stage"] or stage_key(t["stage"])[0] == 99:
            issues.append(f"{tid}: invalid/missing stage '{t['stage']}'")
        for d in t["deps"]:
            if d not in tasks:
                issues.append(f"{tid}: depends on unknown task {d}")
            elif stage_key(tasks[d]["stage"]) > stage_key(t["stage"]):
                issues.append(f"{tid}: depends on later-stage task {d}")
        for d in t["decisions"]:
            if d not in decs:
                issues.append(f"{tid}: references unknown decision {d}")
        deps_ok = all(d in done for d in t["deps"])
        decs_ok = not any(decision_open(decs, d) for d in t["decisions"])
        if t["status"] in DONE and not deps_ok:
            issues.append(f"{tid}: COMPLETED but dependencies not all COMPLETED")
        if t["status"] == "NOT_STARTED" and deps_ok and decs_ok:
            eligible.append(tid)
        if t["status"] == "REQUIRES_DECISION" and decs_ok and t["decisions"]:
            unblocked_rd.append(tid)
    # cycle detection
    state = {}

    def visit(n, stack):
        state[n] = 1
        for d in tasks.get(n, {}).get("deps", []):
            if d not in tasks:
                continue
            if state.get(d) == 1:
                issues.append(f"dependency cycle: {' -> '.join(stack + [n, d])}")
            elif state.get(d) is None:
                visit(d, stack + [n])
        state[n] = 2

    for n in order:
        if state.get(n) is None:
            visit(n, [])
    eligible.sort(key=lambda x: (stage_key(tasks[x]["stage"]), order.index(x)))
    # Stage-order gate (protocol step 8d): drop tasks whose stage must wait for an earlier, non-parallel stage that
    # still has eligible NOT_STARTED tasks; apply STAGE_GATES and never offer LATER stages.
    elig_stages = {tasks[x]["stage"] for x in eligible}
    gated = []
    for x in eligible:
        st = tasks[x]["stage"]
        if st in LATER_STAGES:
            continue
        gate = next((g for pfx, g in STAGE_GATES.items() if st.startswith(pfx)), None)
        if gate and tasks.get(gate, {}).get("status") not in DONE:
            continue
        if any(stage_key(e) < stage_key(st) and not parallel(e, st, x) for e in elig_stages):
            continue
        gated.append(x)
    return gated, unblocked_rd, issues


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage")
    ap.add_argument("--task")
    ap.add_argument("--decisions", action="store_true")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()

    tpath, dpath = PLAN / "TASKS.md", PLAN / "DECISIONS.md"
    if not tpath.exists():
        print("plan/TASKS.md not found"); return 1
    tasks, order = parse_tasks(tpath)
    decs = parse_decisions(dpath)
    eligible, unblocked_rd, issues = analyse(tasks, order, decs)

    if a.check:
        for i in issues:
            print("ISSUE:", i)
        print(f"{len(issues)} issue(s) in {len(tasks)} tasks")
        return 1 if issues else 0

    if a.task:
        t = tasks.get(a.task)
        if not t:
            print("unknown task"); return 1
        print(f"{t['id']} · {t['title']}\n  status={t['status']} stage={t['stage']} module={t['module']}")
        for d in t["deps"]:
            print(f"  depends on {d}: {tasks.get(d, {}).get('status', 'UNKNOWN')}")
        for d in t["decisions"]:
            print(f"  decision {d}: {decs.get(d, {}).get('status', 'UNKNOWN')} — {decs.get(d, {}).get('question', '')}")
        return 0

    if a.stage:
        for tid in order:
            t = tasks[tid]
            if t["stage"] == a.stage:
                print(f"{t['status']:<18} {tid:<22} {t['title']}")
        return 0

    blocked_by_dec = defaultdict(list)
    for tid in order:
        t = tasks[tid]
        if t["status"] in ("NOT_STARTED", "REQUIRES_DECISION", "BLOCKED"):
            for d in t["decisions"]:
                if decision_open(decs, d):
                    blocked_by_dec[resolve(decs, d)].append(tid)

    if a.decisions:
        for d, ts in sorted(blocked_by_dec.items(), key=lambda kv: -len(kv[1])):
            print(f"{d} ({decs.get(d, {}).get('status', '?')}) blocks {len(ts):>3} task(s) — {decs.get(d, {}).get('question', '')}")
        return 0

    counts = Counter(t["status"] for t in tasks.values())
    by_stage = defaultdict(Counter)
    for t in tasks.values():
        by_stage[t["stage"]][t["status"]] += 1
    in_prog = [tid for tid in order if tasks[tid]["status"] == "IN_PROGRESS"]
    open_stages = [s for s in sorted(by_stage, key=stage_key) if by_stage[s]["COMPLETED"] + by_stage[s]["NOT_APPLICABLE"] < sum(by_stage[s].values())]
    print(f"Tradex plan status — {len(tasks)} tasks")
    print("  " + " · ".join(f"{s}={counts.get(s, 0)}" for s in STATUSES))
    print(f"Current (earliest unfinished) stage: {open_stages[0] if open_stages else 'ALL COMPLETE'}")
    print("Per stage:")
    for s in sorted(by_stage, key=stage_key):
        c = by_stage[s]
        print(f"  {s:<7} done {c['COMPLETED'] + c['NOT_APPLICABLE']:>3}/{sum(c.values()):<3}  in-progress {c['IN_PROGRESS']}  "
              f"blocked {c['BLOCKED']}  needs-decision {c['REQUIRES_DECISION']}")
    print("In progress (resume these first):", ", ".join(in_prog) or "none")
    if in_prog:
        nxt = in_prog[0]
    else:
        nxt = eligible[0] if eligible else None
    print("NEXT TASK:", f"{nxt} · {tasks[nxt]['title']}" if nxt else "none eligible — see blocking decisions below")
    if eligible[1:6]:
        print("Also eligible:", ", ".join(eligible[1:6]))
    if unblocked_rd:
        print("REQUIRES_DECISION tasks whose decisions are now DECIDED (set them to NOT_STARTED):", ", ".join(unblocked_rd))
    top = sorted(blocked_by_dec.items(), key=lambda kv: -len(kv[1]))[:8]
    if top:
        print("Open decisions blocking the most tasks:")
        for d, ts in top:
            print(f"  {d} blocks {len(ts)} — {decs.get(d, {}).get('question', '')}")
    if issues:
        print(f"Tracker issues: {len(issues)} (run with --check)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
