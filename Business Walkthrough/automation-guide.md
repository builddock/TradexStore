# Tradex ERP - Automation & Exceptions Module
### Business Walkthrough | BuildDock Team

---

## 1. What This Module Does
Shows all automated rules running in the background, their health status,
estimated time saved, and the full exceptions queue for the entire business.

**Used by: Owner, Operations Admin, and Supervisors**

## 2. Navigation
```
Left sidebar --> FINANCE & INSIGHT --> Automation
```

## 3. Health Dashboard

```
+--------------------------------------------------+
|  Automation & exceptions                        |
|                                                  |
|  Health right now:                              |
|  2,418 runs today   99.2% success   41h saved  |
|  3 failing jobs [!!]                           |
|                                                  |
|  Estimated staff hours saved per week: 41 h     |
|  (Based on tasks completed without human input)|
|                                                  |
|  [!] 3 rules need attention                    |
|  [ok] 94 rules running normally               |
+--------------------------------------------------+
```

## 4. Tab 1 - Rules Catalogue

All 38 automation rules (A01-A38) listed:

```
+--------------------------------------------------+
|  Rules catalogue (97 rules active)              |
|                                                  |
|  A11 - Payment -> reserve -> pick task          |
|  Status: [ok] RUNNING                          |
|  412 runs today - 0 failures                   |
|  Description: When a payment is captured,       |
|  reserve the stock and create a pick task      |
|  in the warehouse queue automatically.         |
|  [View rule] [Pause rule]                       |
|                                                  |
|  A08 - Courier tracking sync                   |
|  Status: [!!] FAILING                          |
|  Paused after 3 failures - provider timeout    |
|  Last success: 08:12 today                    |
|  [Resume] [View logs] [Propose fix]            |
|                                                  |
|  A17 - Stock below reorder point -> draft PO   |
|  Status: [ok] RUNNING                          |
|  18 draft POs created today                    |
+--------------------------------------------------+
```

### Key Automation Rules Explained

| Rule | What it does automatically |
|---|---|
| **A11** | Payment confirmed -> reserve stock + create warehouse pick task |
| **A08** | Fetch courier tracking updates every 15 minutes |
| **A17** | Stock falls below reorder point -> create a draft PO suggestion |
| **A01** | Reservation window expires (unpaid) -> release stock back to available |
| **A12** | Order held past review time -> escalate to Operations Manager |
| **A09** | Stale supplier feed (6h) -> switch offers to "confirm before promise" |
| **A38** | Automation job fails -> create one exception alert (not multiple) |

> [!NOTE]
> A Named Reviewer can pause a rule they manage. Only the Owner or
> Operations Admin can re-enable a paused rule.

## 5. Tab 2 - Run History

```
+--------------------------------------------------+
|  Recent runs (last 2 hours)                     |
|                                                  |
|  JOB-88215 - A11 - 10:42 - SUCCESS - 1.2s     |
|  JOB-88214 - A11 - 10:41 - SUCCESS - 0.9s     |
|  JOB-88213 - A08 - 10:30 - FAILED - timeout   |
|  [View failure detail] [Retry]                  |
|                                                  |
|  Failure detail - JOB-88213:                   |
|  Rule: A08 Courier tracking sync               |
|  Error: HTTP 504 Gateway Timeout               |
|  Courier endpoint: api.delhivery.com           |
|  Retried: 3 times (30s, 60s, 120s)            |
|  Auto-paused after 3 failures                 |
|  Evidence: [View full error log]               |
+--------------------------------------------------+
```

## 6. Tab 3 - Exceptions Queue

All unresolved exceptions across the entire business:

```
+--------------------------------------------------+
|  All exceptions (23 open)      [Mine (6)]       |
|  [All] [Critical] [Serious] [Warning] [Info]    |
|                                                  |
|  [CRITICAL] Payment captured - order lost       |
|  TXO-10477 - Rs.84,990 - 38 min ago            |
|  [Act now]                                      |
|                                                  |
|  [SERIOUS] Discount below margin floor          |
|  TXO-10491 - Vikram S. - awaiting Owner        |
|  [Review]                                       |
|                                                  |
|  [WARNING] Courier sync failing                |
|  17 shipments stale - A08 paused              |
|  [Resume rule]                                  |
|                                                  |
|  Exceptions resolved by staff today: 41        |
+--------------------------------------------------+
```

## 7. Tab 4 - Approvals Queue

Formal approval requests from automation-triggered workflows:

```
+--------------------------------------------------+
|  Approvals waiting (8)                          |
|                                                  |
|  Stock write-off > Rs.50,000 threshold         |
|  3 x LG Monitor - water damage - Rs.42,300     |
|  Requested by: Anita R. (Branch Manager)       |
|  [Review evidence] [Approve] [Reject]           |
|                                                  |
|  PO-2026-0196 - Rs.1,90,000 - Owner required  |
|  50 x Samsung SSD - Prime IT                  |
|  [Review PO] [Approve] [Reject]                |
+--------------------------------------------------+
```

## 8. Propose a New Automation Rule

Any staff member can propose a new automation rule:

```
+--------------------------------------------------+
|  Propose an automation rule                    |
|                                                  |
|  Rule name: [                               ]   |
|  What triggers it: [                        ]   |
|  What it should do: [                       ]   |
|  Affected module: [Orders v]                   |
|  Proposed by: Karthik R. - Support             |
|                                                  |
|  [Submit proposal]                              |
|                                                  |
|  Note: All proposals go to Owner review.       |
|  Approved rules are built and tested by        |
|  the BuildDock Team before activation.         |
+--------------------------------------------------+
```

## 9. How Other Roles See Automation

| Feature | Owner | Ops Admin | Finance | Branch Mgr | Support | Warehouse |
|---|---|---|---|---|---|---|
| View rules catalogue | Yes | Yes | No | No | No | No |
| View run history | Yes | Yes | No | No | No | No |
| Pause / resume rules | Yes | Yes | No | No | No | No |
| View exceptions (all) | Yes | Yes | Finance only | Own branch | Own branch | No |
| View approvals queue | Yes | Yes | Finance only | Own branch | No | No |
| Propose new rules | Yes | Yes | No | No | Yes | No |

---
*Based on erp-automation.html | BuildDock Team - 30 September 2026*
