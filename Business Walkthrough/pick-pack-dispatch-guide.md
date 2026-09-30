# Tradex ERP - Pick, Pack & Dispatch Module
### Business Walkthrough - Step by Step
### Non-Technical Edition by BuildDock Team

---

## Contents

1. [What This Module Does](#1-what-this-module-does)
2. [How to Navigate Here](#2-how-to-navigate-here)
3. [The 6-Step Fulfilment Flow](#3-the-6-step-fulfilment-flow)
4. [Section A - KPI Strip (6 Numbers)](#4-section-a---kpi-strip)
5. [Tab 1 - To Pick](#5-tab-1---to-pick)
6. [Tab 2 - Pick & Scan (Scan Station)](#6-tab-2---pick--scan)
7. [Tab 3 - To Pack](#7-tab-3---to-pack)
8. [Tab 4 - Ready to Ship](#8-tab-4---ready-to-ship)
9. [Tab 5 - Dispatched Today](#9-tab-5---dispatched-today)
10. [Tab 6 - Problems (Exceptions)](#10-tab-6---problems)
11. [How Other Roles See This Module](#11-how-other-roles-see-this-module)

---

## 1. What This Module Does

The **Pick, Pack & Dispatch** module is the physical warehouse workspace.
It takes orders that are paid and confirmed, and manages every physical step
until parcels are handed to the courier.

This module is primarily used by **Warehouse Staff and Warehouse Supervisors**.
The Owner and Branch Manager can monitor it to check for overdue items.

**Key principle:** Every item is scanned at least twice before leaving.
The system blocks wrong items from being dispatched - even if the wrong serial
number is accidentally picked, the scan station rejects it.

---

## 2. How to Navigate Here

```
Left sidebar --> SELL & SERVE --> Pick - pack - dispatch
```

At the top of the page, you can switch between locations:

```
Location: [Central Warehouse (WH-BLR) v]
           Central Warehouse / SP Road Branch / Koramangala / Mysuru
```

Each location sees only its own work queue.

**Page header information:**
- Location name and shift hours (e.g. 09:00-18:00)
- Courier cut-off time (e.g. 16:30 - last time to pack for same-day dispatch)
- Next courier pickup time (e.g. Delhivery pickup 17:00)

---

## 3. The 6-Step Fulfilment Flow

```
+----------+    +----------+    +----------+    +----------+    +----------+    +----------+
|    1     | -> |    2     | -> |    3     | -> |    4     | -> |    5     | -> |    6     |
| Release  |    | Pick &   |    | Pack &   |    | Book     |    | Hand to  |    | Track to |
| & plan   |    | scan     |    | check    |    | courier  |    | courier  |    | delivery |
|          |    |          |    |          |    |          |    |          |    |          |
| 14 ready |    | 5 being  |    | 6 to     |    | 8 ready  |    | 9 of 12  |    | 41 sent  |
| Supervisor     | Picker  |    | pack     |    |  [!] 1   |    | staged   |    | [!] sync |
|          |    |          |    | Packer   |    | failed   |    | 17:00    |    | paused   |
+----------+    +----------+    +----------+    +----------+    +----------+    +----------+
```

---

### Step 1 - Release & Plan the Pick

Paid orders with reserved stock join the "To Pick" queue automatically (by automation rule A11).
A supervisor groups them into a **wave** - a batch of orders for one picker to collect in one efficient trip.
The route is planned by bin sequence (shortest walking path through the warehouse).

**Who does it:** Automatic + Warehouse Supervisor

---

### Step 2 - Pick & Scan

The picker takes the wave's pick list and walks the warehouse collecting items.
At the **scan station**, they scan:
1. The bin location code
2. The product SKU barcode
3. The unit's serial number (for tracked items)

The system verifies each scan against what was ordered.
A wrong item = red warning = put it back and scan the correct one.

**Who does it:** Picker (Warehouse Staff)

---

### Step 3 - Pack & Check

After picking, the packer:
- Re-checks the serial number and product condition
- Checks all accessories are included (cables, manuals, chargers)
- Places the printed invoice and warranty documents inside the box
- Weighs and seals the parcel
- Photographs the packed box (for dispute evidence)

**Who does it:** Packer (Warehouse Staff)

---

### Step 4 - Book Courier & Print Label

The courier booking is created automatically once packing is complete.
The shipping label is printed.

If the courier connection is down: book manually using [Book manually] option.

**Who does it:** Automatic (or Dispatch Desk if manual)

---

### Step 5 - Hand Over to Courier

The dispatch desk stages all parcels on the handover manifest.
When the courier rider arrives:
- Rider scans each parcel
- Rider provides an OTP
- Dispatch desk signs the manifest

**Who does it:** Dispatch desk + Courier rider

---

### Step 6 - Track to Delivery

Courier tracking updates are fetched automatically every few minutes.
Each update shows where the parcel is until it is delivered or comes back.

If a parcel comes back (RTO - Return to Origin), it enters the Returns & Warranty module.

**Who does it:** Automatic + Support (for customer queries)

---

## 4. Section A - KPI Strip

```
+----------+----------+----------+----------+-----------+----------+
|    23    |  5.8 h   |    2     |  99.6%   | Degraded  |    12    |
| Due      | Paid to  | Overdue  | Scan     | Courier   | Next     |
| today    | dispatch | (>24h)   | accuracy | status    | pickup   |
|          |          |          |          |           | 17:00    |
| 9 before | -1.4 h   | Oldest   | 3 wrong  | Booking OK| 9 staged |
| 14:00    | (good)   | 26h      | blocked  | Track OFF |          |
+----------+----------+----------+----------+-----------+----------+
```

| Tile | Meaning | Warning sign |
|---|---|---|
| **Due today** | Orders that must be dispatched today | Any number in red means SLA at risk |
| **Paid to dispatched** | Average time from payment to handover | Above 8 hours is a concern |
| **Overdue (>24h)** | Orders confirmed 24+ hours ago, still not dispatched | Even 1 is urgent |
| **Scan accuracy** | What % of scans were correct (no wrong items) | Below 99% needs investigation |
| **Courier status** | Is the courier integration working? | "Degraded" means tracking is paused |
| **Next pickup** | How many parcels are staged for the next courier collection | If staging falls behind, call the courier |

---

## 5. Tab 1 - To Pick

Shows all orders released and ready for the warehouse to start picking.

```
+------------------------------------------+  +------------------------------+
|  Released orders                         |  |  Wave W-26-07  (in progress) |
|  Paid + reserved -> released by A11      |  |  Irfan M. - started 10:31   |
|  Held orders are blocked                 |  |  3 orders - bin sequence     |
|  [Priority v] [Promise time] [Zone]      |  |  14 of 17 units picked (82%)|
|                                          |  |  [==========   ]            |
|  [0 selected]                            |  |                              |
|  [Create wave] [Assign picker] [Print]   |  |  R-12 [bin] MacBook - ok    |
|                                          |  |  A-03 [bin] SSD x10 - ok    |
|  Order    | Items | Priority | Bins | By |  |  A-07 [bin] Monitor - [!]   |
|  TXO-10486| 3     | Express  | R-12 |14:00  |                              |
|  TXO-10491| 5     | Standard | A-03 |18:00  |  [Re-print] [Open scan sta] |
|  ...                                     |  +------------------------------+
+------------------------------------------+
```

### How to Create a Wave

1. Check the boxes on 2 or more orders in the list
2. Click **[Create wave]** - the system groups them and plans the pick route by bin location
3. A wave card appears on the right showing the pick route
4. Click **[Assign picker]** to assign it to a specific picker
5. Click **[Print]** to send the pick list to the printer

> [!IMPORTANT]
> Held orders (e.g. GSTIN check pending) are BLOCKED from appearing here.
> They will appear automatically once the hold is released from the Orders screen.

### The Wave Card (Right Side)

Shows the currently active wave:
- Wave ID and which picker it is assigned to
- Progress bar (14 of 17 units picked = 82%)
- The pick route in bin sequence (walk from bin to bin in order)
- Green bins = picked and verified, Red = problem

---

## 6. Tab 2 - Pick & Scan

The **Scan Station** - the most important screen for a picker.

```
+--------------------------------------------------+
|  Scan station - Bench 2          [Scanner ready] |
|  Irfan M. - Wave W-26-07 - TXO-10486 - Line 2/3|
|                                                  |
|  Step 1: BIN    Step 2: SKU     Step 3: SERIAL  |
|  [ok] R-12      [ok] LAP01-RA   [-->] Waiting   |
|                                                  |
|  Expected: Dell Latitude 5420 - Serial: U-000806 |
|                                                  |
|  +------------------------------------------+   |
|  | Scan log                                 |   |
|  | 10:31 | R-12       | Bin: correct        |   |
|  | 10:32 | LAP01-RA   | SKU: correct        |   |
|  | 10:33 | SN-000807  | WRONG SERIAL [X]    |   |
|  |       |            | Expected: U-000806  |   |
|  | 10:34 | U-000806   | Serial: correct     |   |
|  +------------------------------------------+   |
|                                                  |
|  [Mark short pick]    [Complete pick for order]  |
+--------------------------------------------------+
```

### How Scanning Works Step by Step

**Step 1 - Scan the bin:**
Point the scanner at the bin location barcode (e.g. R-12).
- Green = correct bin, proceed
- Red = wrong bin, move to correct location

**Step 2 - Scan the SKU label:**
Scan the product barcode on the box/item.
- Green = correct product, proceed
- Red = wrong product, do NOT pick this item - put it back

**Step 3 - Scan the serial number:**
Scan the serial number sticker on the unit.
- Green = correct serial, unit is allocated to this order
- Red = wrong serial (see scan log line for SN-000807 above - it was rejected).
  Put the item back and scan the correct unit.

**When all 3 steps are green:** The line is verified. Move to the next line.

**[Mark short pick]:** If an item cannot be found (it should be there but is not), mark it as a short pick. This triggers a stock investigation and may hold the order.

**[Complete pick for order]:** When all lines in the order are verified, complete it. The order moves automatically to the "To Pack" queue.

---

## 7. Tab 3 - To Pack

Orders that have been fully picked and are waiting to be packed.

```
+--------------------------------------------------+
|  To pack (6 orders)                              |
|                                                  |
|  TXO-10486 - Irfan M. - 10:36 - Bench 2        |
|  MacBook Air M2 + Apple Care                     |
|  [!] Express - dispatch by 14:00                |
|                                                  |
|  Packing checklist:                              |
|  [x] Serial re-verified (U-000806)              |
|  [x] All accessories present (charger, manual)  |
|  [x] Invoice printed and placed inside          |
|  [x] Warranty card included                     |
|  [x] Box sealed                                 |
|  [ ] Weight recorded (actual: 2.4 kg)           |
|  [ ] Box photographed                           |
|                                                  |
|                           [Complete packing]     |
+--------------------------------------------------+
```

### Packing Checklist Explained

| Item | Why it matters |
|---|---|
| **Serial re-verified** | Confirms the correct unit goes in the box (not just the right model) |
| **All accessories present** | Missing charger = customer complaint and expensive return |
| **Invoice printed and placed inside** | Legal requirement for GST compliance |
| **Warranty card included** | Required for warranty claims |
| **Box sealed** | Prevents tampering during transit |
| **Weight recorded** | Used for courier billing and for disputes about missing items |
| **Box photographed** | Evidence if customer claims the box was empty or damaged on arrival |

---

## 8. Tab 4 - Ready to Ship

Packed orders ready for courier booking and label printing.

```
+--------------------------------------------------+
|  Ready to ship (8 orders)                        |
|  Manifest MF-0926-02 - 12 parcels - pickup 17:00|
|                                                  |
|  [!] 1 booking failed - needs manual booking    |
|  [!] 1 not yet booked                           |
|                                                  |
|  AWB         | Order     | Status    | Label    |
|  1106XXXXX   | TXO-10486 | Booked    | [Print]  |
|  -           | TXO-10491 | FAILED    |[Book manually]|
|  -           | TXO-10488 | Pending   | [Retry]  |
|                                                  |
|  [Stage all booked orders] [Open manifest]       |
+--------------------------------------------------+
```

### Courier Booking Status

| Status | What it means | Action |
|---|---|---|
| **Booked** | AWB number assigned, label ready | Print label and stage the parcel |
| **Pending** | Booking request sent, waiting for courier confirmation | Wait or click Retry |
| **FAILED** | Courier API rejected the booking | Click [Book manually] |

**[Book manually]:** Opens a form to enter courier details manually. Use this when
the courier integration is down or when the PIN code is not serviced by the default courier.

**[Open manifest]:** Opens the handover manifest - the list of all parcels to be
handed to the courier rider. Print this for the physical handover.

**[Stage all booked orders]:** Marks all booked orders as "staged" (physically
placed in the courier staging area).

---

## 9. Tab 5 - Dispatched Today

Shows all parcels that have been handed to the courier today.

```
+--------------------------------------------------+
|  Dispatched today (41 parcels)                   |
|  [!] Courier tracking sync paused since 08:15   |
|      Tracking status may be stale               |
|                                                  |
|  AWB         | Order     | Status       | Since  |
|  1106XXX001  | TXO-10471 | Out for del  | 08:20  |
|  1106XXX002  | TXO-10472 | In transit   | 09:15  |
|  1106XXX003  | TXO-10474 | DELIVERED    | 11:30  |
|  1106XXX009  | TXO-10481 | Stale [!]    | 08:15  |
+--------------------------------------------------+
```

The orange banner at the top is an important warning:
When courier sync is paused, tracking statuses shown may be hours old.
This is the same issue visible in the Control Centre exceptions.

---

## 10. Tab 6 - Problems (Exceptions)

Shows all fulfilment exceptions that need human attention.

```
+--------------------------------------------------+
|  Problems - exceptions (6 open, 1 critical)      |
|  [All] [Critical] [Short picks] [Delivery fail] |
|                                                  |
|  [CRITICAL] Short pick - TXO-10475              |
|  1 x Dell P2422H - not found at bin A-07        |
|  Picker: Irfan M. - 10:45                       |
|  Customer SLA: 14:00 dispatch (45 min left)     |
|  [Find alternate unit] [Notify order team]       |
|                                                  |
|  [SERIOUS] Booking failed - TXO-10491           |
|  Courier API timeout - 3 retries                |
|  [Book manually] [Change courier]                |
|                                                  |
|  [WARNING] Refused delivery - TXO-10460         |
|  Customer refused parcel at door                |
|  RTO in transit - expect return by 28 Sep       |
|  [Create return] [Contact customer]             |
|                                                  |
|  [WARNING] Delivery exception - TXO-10453       |
|  Customer not available - 2nd attempt tomorrow  |
|  [Notify customer] [Reschedule]                 |
+--------------------------------------------------+
```

### Exception Types Explained

| Exception | What it means | Action |
|---|---|---|
| **Short pick** | An item that should be in stock was not found at its bin location | Find an alternate unit or notify order team to put order on hold |
| **Booking failed** | The courier API rejected the shipment booking | Book manually or try a different courier |
| **Wrong unit scanned** | Scan station rejected a serial number (not allocated to this order) | Put the item back, find correct unit |
| **Refused delivery** | Customer refused the parcel when the courier tried to deliver | Contact customer, decide whether to re-attempt or process as return |
| **Delivery exception** | Courier could not find customer (wrong address, not home) | Notify customer, reschedule delivery |

---

## 11. How Other Roles See This Module

### Warehouse Staff (Primary Users)

This is their main workspace. They see the full module.
- Land on "To Pick" tab by default
- Can access all 6 tabs
- Cannot see order pricing or payment details
- Cannot see orders from other locations

### Warehouse Supervisor

Same as Warehouse Staff PLUS:
- Can create waves and assign pickers
- Can see all benches and all pickers' progress
- Can view the Problems tab and escalate
- Can print manifests and book couriers manually

### Branch Manager

- Can view this module for their branch
- Can see the KPI strip and Problems tab
- Cannot perform physical scan operations (not their role)
- Uses this screen to monitor if their branch's dispatch is on track

### Owner and Operations Admin

- Can view all locations in this module (use the location dropdown)
- Uses this screen to monitor overdue dispatches from the Control Centre
- Cannot perform physical scan operations

### Finance

- Does NOT have access to this module
- Finance sees order dispatch status from the Orders module (Fulfilment column)

### Sales Associate / Support

- Does NOT have access to this module
- Can check dispatch status from the Orders module
- Cannot see or operate the physical fulfilment process

---

### Role Access Summary

| Feature | Warehouse | Supervisor | Branch Mgr | Owner/Ops | Finance | Support |
|---|---|---|---|---|---|---|
| View To Pick tab | Yes | Yes | Yes (own) | Yes (all) | No | No |
| Create wave | No | Yes | No | Yes | No | No |
| Use scan station | Yes | Yes | No | No | No | No |
| View Problems tab | Yes | Yes | Yes (own) | Yes (all) | No | No |
| Book courier manually | Dispatch desk | Yes | No | Yes | No | No |
| View all locations | No | No | No | Yes | No | No |

---

*This guide covers Tradex ERP Pick-Pack-Dispatch Module - Version 1.4.2*
*Based on erp-fulfilment.html mockup*
*Produced by BuildDock Team - Last updated: 30 September 2026*
