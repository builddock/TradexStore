# Tradex ERP - Team Monitor (Team & Activity)
### Business Walkthrough | BuildDock Team

---

## Contents

1. [What This Module Does](#1-what-this-module-does)
2. [Navigation](#2-navigation)
3. [What Is Recorded - and What Is Not](#3-what-is-recorded---and-what-is-not)
4. [Page Header and Buttons](#4-page-header-and-buttons)
5. [The Filter Row](#5-the-filter-row)
6. [The Six Summary Tiles](#6-the-six-summary-tiles)
7. [Live Status Board](#7-live-status-board)
8. [How Each Area Is Being Handled](#8-how-each-area-is-being-handled)
9. [Who Is Working Where](#9-who-is-working-where)
10. [Activity Feed](#10-activity-feed)
11. [Alerts & Unusual Activity](#11-alerts--unusual-activity)
12. [Performance](#12-performance)
13. [Person Detail](#13-person-detail)
14. [Alert Rules](#14-alert-rules)
15. [Step-by-Step Owner Routines](#15-step-by-step-owner-routines)
16. [How Other Roles See This Module](#16-how-other-roles-see-this-module)
17. [Still To Be Decided](#17-still-to-be-decided)

---

## 1. What This Module Does

The Team Monitor is the Owner's view of the staff. It answers four questions on one page:

- **Who is working right now, and on what?**
- **What has each person done today?**
- **Is the work in each part of the system keeping up?**
- **Has anything unusual happened that needs a closer look?**

It was added after the client asked for a dedicated section to monitor each employee, check
their activities and current status, and see how staff are handling the ERP section.

**This page only looks.** It never changes an order, a price or a stock figure. The few things
you can do here - acknowledge an alert, sign someone out, change an alert rule - are recorded
in the audit log like every other change.

> [!IMPORTANT]
> The Team Monitor only uses what people do **inside Tradex**. It does not watch screens,
> keyboards, cameras, phones or locations. Read Section 3 before using it.

## 2. Navigation
```
Left sidebar --> OVERVIEW --> Team monitor
```

The number next to **Team monitor** in the sidebar is the count of open alerts that are
**serious or critical**. When it shows nothing, there is nothing serious waiting.

The menu entry only appears for the Owner, and for anyone the Owner has chosen to share the
page with (see Section 16).

## 3. What Is Recorded - and What Is Not

Click **[What is recorded]** at the top of the page to see this notice. Staff see the same
notice at their first sign-in and can reread it in their profile.

```
+----------------------------------------------------------+
|  What Tradex records about staff activity                |
|                                                          |
|  RECORDED                      NOT RECORDED              |
|  [ok] Actions taken in Tradex  [x] Screen contents or    |
|       (who did what, to which      screenshots           |
|       record, when, from which [x] Keystrokes, typing,   |
|       device and branch            mouse movements       |
|       network)                 [x] Webcam or microphone  |
|  [ok] Sign-ins and sessions    [x] Personal devices,     |
|  [ok] Workspace presence           other apps, websites  |
|       (active / idle, worked   [x] GPS or physical       |
|       out only from activity       location              |
|       inside Tradex)           [x] Private messages      |
|  [ok] Work items (assigned,        outside Tradex        |
|       picked up, finished)                               |
|                                                          |
|  How staff are told | Who can see this page              |
|  How long it is kept | What it is used for               |
|  Legal review - TBC                                      |
|                     [Preview staff notice]   [Close]     |
+----------------------------------------------------------+
```

| Question | Answer shown in the notice |
|---|---|
| How are staff told? | A short notice at their first sign-in, and again in My profile |
| Who can see this page? | The Owner. Others only if the Owner shares it. Opening a person's details is itself recorded |
| How long is it kept? | Presence, performance and audit records each have their own period - to be confirmed |
| What is it used for? | Workload and cover, service targets, security, and reviewing sensitive actions |
| Is anything decided automatically? | No. Alerts come from fixed rules, not AI, and a person always decides what happens next. Nothing about pay, warnings or dismissal is decided by the system |

> [!IMPORTANT]
> The wording of the notice, the keeping periods and the legal check under India's DPDP Act
> are still to be confirmed with the client's legal adviser before go-live.

## 4. Page Header and Buttons

```
+----------------------------------------------------------+
|  Team & activity                                         |
|  Who is working, what they are doing and how each part   |
|  of the workspace is being handled - live - updated 10:42|
|                                                          |
|  [lock] Visible to the owner only                        |
|  [What is recorded]  [Alert rules]  [Export]             |
+----------------------------------------------------------+
```

| Button | What it does |
|---|---|
| **[What is recorded]** | Opens the transparency notice (Section 3) |
| **[Alert rules]** | Opens the list of rules that raise alerts (Section 14) |
| **[Export]** | Downloads today's team activity as a CSV file, with your filters. It contains only what you are allowed to see, and the export itself is recorded |

"updated 10:42" tells you how fresh the page is.

## 5. The Filter Row

```
+----------------------------------------------------------+
|  [Live] [Today*] [7 days] [30 days]                      |
|  [All locations v] [All teams v] [All workspace areas v] |
|  [Search a person...]      Showing 14 of 14 staff        |
+----------------------------------------------------------+
```

| Filter | What it changes |
|---|---|
| **Live / Today / 7 days / 30 days** | Live = the activity list shows only the last 60 minutes. Today = everything since midnight (default). 7 or 30 days = the Performance table covers that many complete days. The tiles, status board, area table and grid always show now / today |
| **Location** | Shows only people based at one branch or the warehouse |
| **Team** | Warehouse, Sales & branches, Support, Catalog & pricing, Finance or Management |
| **Workspace area** | Focuses the page on one part of the system, e.g. Returns & warranty |
| **Search a person** | Type part of a name or job title |

When any filter is set, a **Clear filters** link appears next to the count.

## 6. The Six Summary Tiles

```
+-----------+-----------+-----------+-----------+-----------+-----------+
| On shift  | Active    | Idle now  | Actions   | Work items| Open      |
| now       | now       | (10+ min) | recorded  | handled   | alerts    |
| 11 / 13   | 7         | 2         | 625       | 229       | 8         |
| 1 on leave| last 10   | Farah K.  | +6% vs    | median    | 3 serious |
| 1 not in  | min       | 26 min    | last Sat  | 10 min    | or        |
| 1 later   |           | Sneha P.  |           | each      | critical  |
+-----------+-----------+-----------+-----------+-----------+-----------+
```

| Tile | Plain meaning |
|---|---|
| **On shift now** | People signed in and working (active, idle, on break or in a meeting) out of those scheduled today. The line underneath explains the gap |
| **Active now** | People who did something in Tradex in the last few minutes |
| **Idle now (10+ min)** | Signed in, but nothing done in Tradex for 10 minutes or more (sample value) - longest first |
| **Actions recorded today** | Every saved change, approval, scan, reply or sign-in counts once |
| **Work items handled today** | Orders packed, conversations closed, deliveries received, refunds done - and the typical time each took |
| **Open alerts** | Alerts nobody has acknowledged yet (same number as the sidebar badge counts for serious ones) |

> [!IMPORTANT]
> **Idle does not mean not working.** A person may be on a phone call, helping a walk-in
> customer or packing a parcel away from the screen. Treat idle time as a reason for a
> friendly check, never as proof.

## 7. Live Status Board

One card per person on today's roster. The Owner is not on the board.

```
+------------------------------------------------+
|  (AR)  Anita Rao                  [Active]     |
|        Operations admin - Koramangala  since   |
|        Branch                          10:38   |
|  +------------------------------------------+  |
|  | Reviewing write-off ADJ-0187             |  |
|  | 3 x LG 27UL550, Rs.42,300 - Inventory    |  |
|  +------------------------------------------+  |
|  [Acting for owner until 27 Sep]               |
|                                                |
|   55            12             7 min           |
|   actions today items handled  median time     |
|                                                |
|  Open items  [#########.....]  6 / 15          |
|  MacBook - Safari - Koramangala branch network |
+------------------------------------------------+
```

**Buttons above the cards:** All - Active - Idle - Break or away - Not working (each with a count).

### Status key

| Status | Meaning |
|---|---|
| **Active** | Did something in Tradex in the last few minutes |
| **Idle** | Signed in, but no activity in Tradex for a while (minutes shown) |
| **On break** | The person set this themselves |
| **In a meeting / away** | The person set this themselves, sometimes with a short note |
| **Offline** | Not signed in; the card shows when their shift starts |
| **On leave** | Approved leave for today |
| **Not yet signed in** | Their shift has started but they have not signed in |

The coloured ring around each person's initials matches the status, and the status is always
written in words as well.

**Open items bar** - work assigned to that person and not finished. It turns amber, then red,
as the queue fills. "Still assigned while on leave - reassign" means work is waiting on
someone who is away.

**Click any card** to open that person's full details (Section 13).

## 8. How Each Area Is Being Handled

One row for every part of the workspace, in the same order as the menu.

```
+--------------------------------------------------------------------------+
|  How each area is being handled        9 on track - 4 at risk - 1 behind |
|                                                                          |
|  Area           Open  Handled  Oldest    Target  Median  Working  State  |
|                       today    waiting   met     time    now             |
|  Orders          18    64      3 h 10    94%     6 min   (VS)(LN) On track|
|  Pick-pack-disp  39    58      26 h      88%     14 min  (AN)     At risk |
|  Returns          6     3      2 d 4 h   83%     22 min  nobody   At risk |
|   "Returns desk uncovered - Imran S. is on leave with 4 cases"           |
|  Support inbox   23    37      48 min    78%     6 min   (KR)     Behind  |
|   "4 customers waiting past target - Farah K. idle 26 min"               |
|  ... and 10 more areas                                                   |
|                                                     [Service reports ->] |
+--------------------------------------------------------------------------+
```

| Column | Plain meaning |
|---|---|
| **Open** | Work waiting or in progress right now |
| **Handled today** | Work finished today |
| **Oldest waiting** | How long the oldest open item has waited, and which one |
| **Target met** | Share of items finished within their target time ("no target" for areas without one) |
| **Median time** | The typical time per item, e.g. "pick -> packed" |
| **Working now** | Who is active in that area now; others shown with their status |
| **Overrides** | Items that needed an exception, e.g. "6 discounts above limit" |
| **State** | **On track** = within targets. **At risk** = a target is close to being missed, or cover is missing. **Behind** = targets are being missed now. The reason is written underneath |

Click an area name to open that area's own page and act there.

> [!IMPORTANT]
> This table is how the Owner sees whether staff are handling the ERP section as a whole. A
> queue can fall behind because nobody is covering it, even when every individual is busy.

## 9. Who Is Working Where

A grid of people (rows) against workspace areas (columns). Each square shows how many actions
that person took in that area today - darker blue means more.

```
+------------------------------------------------------------------+
|  Who is working where                          [Table view]      |
|                                                                  |
|  Person       Orders Dispatch Returns Support ... Payments Total |
|  Arjun N.       .      58       .       .           .       64   |
|  Karthik R.    12       .       5      44           .       67   |
|  Deepa K.       5       .       6       .          48       69   |
|  ...                                                             |
|                                                                  |
|  Actions today: [ ] none  [light .... dark] 1 ... 55+            |
+------------------------------------------------------------------+
```

- Point at a square for the exact number and that area's share of the person's day.
- Click a square (or select it and press Enter) to open the person.
- **[Table view]** shows the same numbers as a plain table with totals.

## 10. Activity Feed

Staff actions today, in plain language, newest first.

```
+----------------------------------------------------------+
|  Activity                                   [Audit log ->]|
|  Show: [All 28] [Sensitive only 8] [Money 6] [Stock 8]   |
|        [Prices & discounts 5] [Access & exports 7]       |
|                                                          |
|  10:41  Arjun N. Packed an order - 2 items, serial       |
|         numbers scanned   TXO-10482 - Pick-pack-dispatch |
|  10:36  Anita R. Approved a stock transfer, Central      |
|         Warehouse -> Koramangala (6 units)               |
|         TR-0214 - Inventory   [Delegated authority]      |
|  09:47  Vikram S. Exported the customer list - 1,860     |
|         records with phone numbers                       |
|         EXP-0415 - Customers  [Sensitive]                |
|  ...                                     [Show all 28]   |
|                                                          |
|  Flags: Sensitive | Delegated authority | After hours |  |
|         Needed approval | Emergency access               |
+----------------------------------------------------------+
```

| Flag | Meaning |
|---|---|
| **Sensitive** | Money, stock, price, access or export action worth a second look |
| **Delegated authority** | Done on the Owner's behalf under a delegation |
| **After hours** | Outside the person's working hours |
| **Needed approval** | The action went above the person's own limit |
| **Emergency access** | Done under time-limited emergency access |

For older activity (7 or 30 days) use **Audit log ->**.

## 11. Alerts & Unusual Activity

Alerts come from **fixed rules, not AI**. Each one says which rule fired and why.

```
+----------------------------------------------------------+
|  Alerts & unusual activity                      [Rules]  |
|  Rule-based checks - no AI - 8 open                      |
|                                                          |
|  [CRITICAL] The same person created and approved a refund|
|  Deepa Krishnan - 07:02 - RF-2291                        |
|  RF-2291 - Rs.12,490 - created 06:52, approved 07:02     |
|  +----------------------------------------------------+  |
|  | Why flagged: a refund is approved by someone other |  |
|  | than the person who created it ...                 |  |
|  | Threshold: Any occurrence   [sample - TBC]         |  |
|  +----------------------------------------------------+  |
|  [Acknowledge] [Open person] [Open record]               |
|                                                          |
|  [SERIOUS] Bulk customer export - Vikram Shetty - 09:47  |
|  [WARNING] Customers waiting while the assignee is idle  |
|  ...                                                     |
+----------------------------------------------------------+
```

**Order:** open alerts first, then critical, serious, warning.

| Button | What it does |
|---|---|
| **[Acknowledge]** | Records that you have seen the alert (who and when). It does **not** accuse anyone and does not change the person's work or access |
| **[Open person]** | Opens the person's details |
| **[Open record]** | Opens the refund, export, order or other record |
| **[Reassign]** | Shown on "work assigned to someone on leave" alerts - move the work on the area's own page |

Serious and critical alerts also reach the Owner's exception list and daily digest.

## 12. Performance

Work over complete days - the last 7 days by default, or 30 days with the 30-day filter.

```
+--------------------------------------------------------------------+
|  Performance - Last 7 days (Sat 19 - Fri 25 Sep)       [Reports ->]|
|                                                                    |
|  (i) Roles differ - compare people within the same role.           |
|      These figures show workload and flow inside Tradex. They do   |
|      not capture phone calls, walk-in advice, training or help     |
|      given to colleagues. Use them to start a conversation, not to |
|      rank people.                                                  |
|                                                                    |
|  Employee        Work   Median  Target  Sent back  Overrides  Per  |
|                  items  time    met     /corrected            day  |
|  Karthik R.      383    6 min   88%     1.8%       2          ~~~  |
|  Deepa K.        382    3 min   98%     0.5%       4          ~~~  |
|  ...                                                               |
|  Team median     ...                                               |
|  Pooja H.        No complete days yet - first shift today          |
+--------------------------------------------------------------------+
```

- Click a column heading to sort.
- Click a name to open the person.

> [!IMPORTANT]
> A packer and a finance executive do completely different work. Only compare people in the
> same role, and talk to the person before drawing any conclusion.

## 13. Person Detail

Click any name, card or grid row to open one person in full. **Opening a person's details is
itself recorded in the audit log.**

```
+----------------------------------------------------------+
|  (NK) Naveen Kumar                                  [x]  |
|  Warehouse associate - Warehouse - Central Warehouse     |
|  [On break] since 10:30 - Pick-pack-dispatch             |
|                                                          |
|  [Today] [Areas] [Performance] [Sessions & access]       |
|  [Sensitive actions] [Access]                            |
|  ------------------------------------------------------  |
|  First sign-in 08:05 - active 2 h 12 min - idle 13 min   |
|  - breaks 12 min           [Full record in audit log ->] |
|                                                          |
|  08:05  Signed in - Handheld WH-05                       |
|  08:12  Picking in wave W-0926-1                         |
|  09:52  Removed 1 unit from stock without a photo  [!]   |
|  10:28  Packed TXO-10480                                 |
|  10:30  Set his status to "On break"                     |
|                                                          |
|  [Message] [Reassign open items]  [View in audit log]    |
+----------------------------------------------------------+
```

| Tab | What it shows |
|---|---|
| **Today** | The day's timeline: sign-ins, actions, flagged items, status changes. Only actions inside Tradex are listed |
| **Areas** | Presence today (active, idle, break, meeting) and actions by area, plus the areas the person usually works in |
| **Performance** | Last 7 days against the median of people in the **same role** (or the whole team if the person is alone in the role) |
| **Sessions & access** | Sessions open now, failed sign-ins, two-step sign-in method, today's and this week's sign-ins with device and **network or branch label only** (no GPS). **[Sign out everywhere]** ends every open session and is recorded |
| **Sensitive actions** | Overrides, refunds, price and discount changes, stock adjustments, exports and access changes in the last 7 days, each with the reason given |
| **Access** | Role, location scope, two-step sign-in, limits, delegation or leave, account age, last access review. Changes are made only in Settings & access -> Users |

> [!NOTE]
> **[Message]** and **[Reassign open items]** are shown in the design but are not yet backed
> by a confirmed feature. Until they are, reassign work on the area's own page.

## 14. Alert Rules

Click **[Alert rules]** (page header) or **[Rules]** (alerts card).

```
+----------------------------------------------------------------+
|  Alert rules                                                   |
|  Fixed rules checked by the system - no AI.                    |
|  Every threshold is a sample to be confirmed (TBC).            |
|                                                                |
|  On  Rule                         Threshold      Notify   Level|
|  [x] Same person creates and      Any occurrence Owner    Crit.|
|      approves                                                  |
|  [x] Bulk customer export         500 records    Owner +  Ser. |
|                                                  Ops admin     |
|  [x] Failed sign-in attempts      5 in 10 min    Owner +  Ser. |
|  [x] Discounts above the          3 a day        Branch   Warn.|
|      person's limit                              manager       |
|  [x] Stock removed without photo  Any            ...      Warn.|
|  [x] Waiting work, idle assignee  20 min idle    ...      Warn.|
|  [x] Sign-in outside hours        09:30-20:30    Ops admin Warn|
|  [x] Work assigned to someone     Hourly check   ...      Warn.|
|      on leave                                                  |
|  [ ] Price change above limit     5%             Owner    Warn.|
|                                                                |
|  How alerts reach you                                          |
|  [x] Critical and serious: at once, in Tradex and on WhatsApp  |
|  [x] Warnings: in the owner's 8:00 daily digest                |
|  [ ] Tell the person concerned when an alert about them is     |
|      raised                                                    |
|                                     [Cancel]  [Save rules]     |
+----------------------------------------------------------------+
```

**To change a rule (Owner):**
1. Open **Alert rules**.
2. Switch the rule on or off, or type a new threshold.
3. Choose who is notified.
4. Click **[Save rules]**. The change is recorded in the audit log.

Turning a rule off stops new alerts. Past alerts stay in the history.

> [!IMPORTANT]
> All thresholds on screen are samples. In the live system every rule starts **switched off**
> until the client confirms its threshold.

## 15. Step-by-Step Owner Routines

### Morning check (about 3 minutes)
1. Open **OVERVIEW -> Team monitor**.
2. Look at the **area table** first. Deal with any **Behind** row, then **At risk**. Read the
   reason under the state.
3. Look at **Alerts**. For each open alert: read **Why flagged**, open the person or record,
   then click **[Acknowledge]**.
4. Glance at the **status board** to see who is in, idle, on break or on leave before moving
   any work.

### When an area is Behind
1. Read the reason (e.g. "4 customers waiting past target").
2. Check **Working now** - is anyone covering the area?
3. Click the area name to open its page and reassign or pick up the waiting items there.

### When an alert appears
1. Read what happened and which rule fired.
2. Open the record to see the facts.
3. If needed, talk to the person. The alert itself decides nothing.
4. Click **[Acknowledge]** so the alert leaves the open list.

### Weekly performance review
1. Set the period to **7 days** (or **30 days** for a monthly review).
2. Filter by **Team**, and compare people only within the same role.
3. Open a person for their trend against the role median.
4. Use the figures to start a conversation - not to rank people.

## 16. How Other Roles See This Module

| Role | Access to Team monitor |
|---|---|
| **Owner** | Full: every section, alerts, rules, export |
| **Operations Admin** | Only if the Owner shares the page. Then: read, acknowledge alerts, alert rules, export |
| **Branch Manager** | Only if the Owner shares the page, and then **only their own branch**: read, acknowledge, export |
| **Finance, Warehouse, Sales, Support, Catalog** | No access. The menu entry does not appear and the page address shows "not found" |

**What every staff member sees about themselves:**
- The notice about what is recorded, at first sign-in and in their profile.
- An **On break / In a meeting** option to set their own status (if the client allows it).
- Possibly their own activity history in My profile -> My activity (to be decided).

The Owner's own actions are not shown on the board or in the feed, but they are recorded in
the audit log like everyone else's.

## 17. Still To Be Decided

These points are open with the client (decision D-283) before this page is built:

| Question | Why it matters |
|---|---|
| Does "REP section" in the request mean the ERP workspace? | The page is built on that reading |
| Who besides the Owner may open the page? | Operations admin, branch managers for their own branch, or nobody |
| After how many minutes is a person "idle"? Can staff set "On break" themselves? | Samples on screen say 10, 15 and 20 minutes in different places |
| How long are presence and activity records kept? | Samples: 90 days presence, 24 months performance |
| Exact wording of the staff notice, and can staff see their own summary? | Legal adviser to draft |
| Which alert rules are on, and their thresholds? | All values on screen are samples |
| Where do shifts, days off and leave come from? | Needed for "On shift now", "On leave" and "Not yet signed in" |
| Legal review under the DPDP Act and employment contracts | Before go-live |

> [!NOTE]
> **Sample values.** Every name, time, count, limit, target, threshold and keeping period in
> this guide is a sample from the design mockup (Saturday 26 September 2026, 10:42). They are
> not the client's real figures or rules.

---
*Based on erp-team.html | BuildDock Team - 30 September 2026*
