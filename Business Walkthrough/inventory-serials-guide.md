# Tradex ERP - Inventory & Serials Module
### Business Walkthrough | BuildDock Team

---

## Contents
1. What This Module Does
2. How to Navigate Here
3. How Available Stock Is Calculated
4. Tab 1 - Stock (Overview)
5. Tab 2 - Serials
6. Tab 3 - Movements (Ledger)
7. Tab 4 - Transfers
8. Tab 5 - Stock Counts
9. Tab 6 - Reservations
10. How Other Roles See Inventory

---

## 1. What This Module Does

The **Inventory & Serials** module is the single source of truth for all physical
stock across every location. Every unit that enters, moves, or leaves the
business is tracked here.

**Key principle - One Stock Authority:**
There is only ONE system that decides how much stock is available.
No branch or warehouse can have its own separate stock count that differs
from the system. This prevents overselling.

---

## 2. How to Navigate Here

```
Left sidebar --> STOCK --> Inventory & serials
```

---

## 3. How Available Stock Is Calculated

```
+--------------------------------------------------+
|  How available-to-promise (ATP) is calculated   |
|                                                  |
|  Physical stock on shelf          = 120 units   |
|  MINUS: Reserved (unpaid orders)  = -12         |
|  MINUS: Quarantine (inspection)   = -8          |
|  MINUS: Damaged / write-off       = -3          |
|  MINUS: In transit (transfers)    = -6          |
|  PLUS: Inbound (confirmed POs)    = +24         |
|  ------------------------------------           |
|  AVAILABLE TO PROMISE             = 115 units   |
|                                                  |
|  This is the number shown on the website       |
|  and to staff when checking stock.             |
+--------------------------------------------------+
```

---

## 4. Tab 1 - Stock Overview

```
+--------------------------------------------------------------+
|  Inventory & serials   [All locations v]  [Export]          |
|  [Search SKU, name, serial...]                               |
|                                                              |
|  SKU       | Product          | New | Refurb | Quar | Reorder|
|  LAP01-RA  | MacBook Air M2   | 12  | 4      | 2    | 5      |
|  SSD-01-N  | Samsung 1TB SSD  | 94  | 0      | 1    | 20     |
|  MON-01-R  | LG 27" Monitor   | 31  | 18     | 9    | 10     |
|                                                              |
|  [18 SKUs below reorder point]  [Review purchasing ->]      |
+--------------------------------------------------------------+
```

### Column Meanings

| Column | What it shows |
|---|---|
| **New** | Available new units |
| **Refurb** | Available refurbished units (any grade) |
| **Quar** | Units in quarantine (cannot be sold) |
| **Reorder** | The minimum stock level trigger for a purchase order |

---

## 5. Tab 2 - Serials

Track individual unit-level history for serialised products.

```
+--------------------------------------------------+
|  Serial: U-000806 - MacBook Air M2              |
|                                                  |
|  Status: SOLD - TXO-10486 - 26 Sep 2026        |
|  Current location: Delivered to customer        |
|                                                  |
|  History:                                       |
|  15 Aug - Received in GRN-0421 - WH-BLR        |
|  16 Aug - QC passed - moved to shelf R-12       |
|  20 Sep - Reserved for TXO-10486               |
|  26 Sep - Picked - Irfan M.                     |
|  26 Sep - Packed - Bench 2                      |
|  26 Sep - Dispatched - Delhivery AWB 1106XXX   |
|  26 Sep - Delivered                             |
|                                                  |
|  Warranty: 1 year Apple (expires 26 Aug 2027)  |
+--------------------------------------------------+
```

Every serialised unit has a complete, uneditable history from the moment
it arrived at the warehouse to its current status.

---

## 6. Tab 3 - Movements (Stock Ledger)

```
+--------------------------------------------------+
|  Stock movements (append-only ledger)           |
|  Cannot be edited - every event is permanent    |
|                                                  |
|  Date     | Event      | SKU     | Qty | Location|
|  26 Sep   | GRN-0441   | SSD-01  | +24 | WH-BLR |
|  26 Sep   | Sale-TXO   | LAP01   | -1  | WH-BLR |
|  26 Sep   | Transfer   | MON-01  | -5  | WH->MYS|
|  25 Sep   | Adj-CC0038 | MON-01  | -3  | WH-BLR |
|  25 Sep   | QC-pass    | SSD-01  | +8  | WH-BLR |
+--------------------------------------------------+
```

Every stock movement is recorded permanently. The running balance of all
movements always equals the current stock level. This is the audit trail
for all stock.

---

## 7. Tab 4 - Transfers

Move stock between warehouse and branches.

```
+--------------------------------------------------+
|  Active transfers (3)   [+ New transfer]         |
|                                                  |
|  TR-0212 - WH-BLR to Mysuru Branch             |
|  5 x LG Monitor - Created by Anita R.           |
|  Status: IN TRANSIT - dispatched 26 Sep 09:40  |
|  Mysuru received: 4 of 5 (1 missing!)           |
|  [Investigate discrepancy] [Confirm receipt]    |
|                                                  |
|  TR-0211 - WH-BLR to Koramangala Branch        |
|  10 x Samsung SSD - IN TRANSIT                 |
|  Expected arrival: today by 16:00              |
+--------------------------------------------------+
```

### Creating a Transfer

```
New transfer form:
  From location: [WH-BLR - Central Warehouse v]
  To location:   [BR-MYS - Mysuru Branch      v]
  Product:       [LG 27" Monitor              ]
  Quantity:      [5]
  Reason:        [Replenish branch stock       ]
  Carrier:       [Company vehicle / Courier    ]
              [Create transfer]
```

When the receiving location scans in the arriving items, the transfer
is marked as complete and stock is moved in the system.

---

## 8. Tab 5 - Stock Counts

Schedule and manage physical stock counts (stocktakes).

```
+--------------------------------------------------+
|  Stock counts (CC-0038 - in progress)           |
|                                                  |
|  Location: WH-BLR - Central Warehouse          |
|  Date: 26 Sep 2026 - Counter: Irfan M.         |
|                                                  |
|  Count sheet:                                   |
|  SKU    | System qty | Counted | Variance       |
|  SSD-01 | 94         | 94      | 0 [ok]         |
|  LAP01  | 12         | 11      | -1 [!]         |
|  MON-01 | 31         | 34      | +3 [!]         |
|                                                  |
|  Variance review required for: 2 items         |
|                                                  |
|  Adjustment approval thresholds:               |
|  Up to Rs.5,000 variance: Branch Manager       |
|  Rs.5,001 to Rs.50,000: Operations Admin       |
|  Above Rs.50,000: Owner approval required       |
|                                                  |
|  [Submit variances for approval]                |
+--------------------------------------------------+
```

---

## 9. Tab 6 - Reservations

Shows all current stock reservations (stock held for unpaid orders).

```
+--------------------------------------------------+
|  Active reservations (12)                       |
|                                                  |
|  R-5589 - MacBook Air M2 (U-000806)            |
|  Reserved for: TXO-10486 - 10:04               |
|  Expires: 10:34 (30 min window)                |
|  Status: CONFIRMED (payment captured)           |
|                                                  |
|  R-5590 - Samsung SSD x3                       |
|  Reserved for: TXO-10491 - 10:12               |
|  Expires: 10:42 (30 min window)                |
|  Status: AWAITING PAYMENT                      |
|                                                  |
|  [Release all expired]  (auto-released by rule) |
+--------------------------------------------------+
```

Reservations with status "AWAITING PAYMENT" expire automatically after
the reservation window (typically 30 minutes for online orders).
The system releases them automatically via automation rule A11.

---

## 10. How Other Roles See Inventory

| Feature | Owner | Ops Admin | Finance | Catalog | Branch Mgr | Warehouse |
|---|---|---|---|---|---|---|
| View all locations stock | Yes | Yes | No | No | Own branch | Own WH |
| View serials | Yes | Yes | No | Yes (own cat) | Yes | Yes |
| Create transfers | Yes | Yes | No | No | Own branch | No |
| Approve adjustments | Yes | Yes | No | No | Up to limit | No |
| Run stock counts | No | Yes | No | No | Yes (own) | Yes (own) |
| View stock ledger | Yes | Yes | No | No | Own branch | Own WH |

---

*This guide covers Tradex ERP Inventory & Serials Module - Version 1.4.2*
*Based on erp-inventory.html mockup | BuildDock Team - 30 September 2026*
