# Tradex ERP - Purchasing & Receiving Module
### Business Walkthrough | BuildDock Team

---

## 1. What This Module Does
Manages the complete purchase cycle: deciding what to buy, creating purchase
orders, receiving goods, performing quality checks, and recording supplier bills.

**Key rule (Rule A17):** The system SUGGESTS purchase orders but never sends them
automatically. A Buyer must review and approve every PO before it goes to the supplier.

## 2. Navigation
```
Left sidebar --> STOCK --> Purchasing & receiving
```

## 3. How Purchase Suggestions Are Generated
```
System checks every SKU daily:
  Current stock < Reorder point?
  YES --> Draft PO created for that SKU
  
  Suggested quantity = Reorder quantity
  (set per SKU in Inventory settings)
  
  Supplier = Default supplier for that SKU
  Price = Last purchase price (from previous PO)
```

## 4. Tab 1 - Suggestions
```
+--------------------------------------------------+
|  Purchase suggestions (18 SKUs)                 |
|  Rule A17: Review and approve before sending    |
|                                                  |
|  [Select all] [Create PO from selected]         |
|                                                  |
|  SKU    | Product       | Qty | Supplier | Price|
|  LAP01  | MacBook Air M2| 10  | Apple IN | 72k  |
|  SSD-01 | Samsung 1TB   | 50  | Prime IT | 3.8k |
|  MON-01 | LG 27"        | 20  | NetCore  | 14k  |
|                                                  |
|  [Create purchase orders]                        |
+--------------------------------------------------+
```

## 5. Tab 2 - Purchase Orders

### PO States
| State | Meaning |
|---|---|
| DRAFT | Created, not sent to supplier |
| PENDING APPROVAL | Above approval threshold, waiting sign-off |
| SENT | Emailed or shared with supplier |
| PARTIALLY RECEIVED | Some goods arrived, balance pending |
| RECEIVED | All goods received |
| CLOSED | Invoiced and reconciled |

### Approval Thresholds
| PO Value | Who must approve |
|---|---|
| Up to Rs.25,000 | Buyer (Ops Admin with Buyer designation) |
| Rs.25,001 - Rs.2,00,000 | Operations Admin |
| Above Rs.2,00,000 | Owner |

## 6. Tab 3 - New Purchase Order
```
+--------------------------------------------------+
|  New purchase order - PO-2026-0196 (Draft)      |
|                                                  |
|  Supplier: [Prime IT Solutions       v]          |
|  Delivery to: [WH-BLR Central Warehouse v]       |
|  Expected delivery: [03 Oct 2026]               |
|                                                  |
|  Lines:                                          |
|  SKU    | Product        | Qty | Unit cost | Tot|
|  SSD-01 | Samsung 1TB    | 50  | Rs.3,800  |190k|
|  [+ Add line]                                   |
|                                                  |
|  Subtotal: Rs.1,90,000                          |
|  Approval required: Operations Admin             |
|                                                  |
|  [Save draft] [Submit for approval]              |
+--------------------------------------------------+
```

## 7. Tab 4 - Receiving (GRN)
When goods arrive from the supplier:

```
+--------------------------------------------------+
|  Receive against PO-2026-0188                   |
|  GRN-0442 - Prime IT - 27 Sep expected          |
|                                                  |
|  Scan each item as you receive it:              |
|  SKU    | PO qty | Received | Variance          |
|  SSD-01 | 50     | 48       | -2 (short)        |
|                                                  |
|  Scan log:                                      |
|  10:31 | SN-001 | Samsung SSD | OK              |
|  10:32 | SN-002 | Samsung SSD | OK              |
|  10:33 | SN-XXX | WRONG SKU [!] | Rejected       |
|                                                  |
|  QC outcome per unit:                           |
|  SSD001-N: Pass / Fail / Send to quarantine     |
|                                                  |
|  Landed cost (optional):                        |
|  Freight: [Rs.2,500]   Insurance: [Rs.500]      |
|                                                  |
|  [Complete receiving]                            |
+--------------------------------------------------+
```

A short delivery (receiving fewer than ordered) creates a discrepancy record
automatically and a follow-up task to recover the balance.

## 8. Tab 5 - Supplier Bills
Match supplier invoices to purchase orders:
- Upload bill PDF
- System matches to the relevant PO automatically
- Any price or quantity discrepancy is flagged for review
- Approved bills are sent to Finance for payment

## 9. How Other Roles See Purchasing
| Feature | Owner | Ops Admin + Buyer | Finance | Branch Mgr | Warehouse |
|---|---|---|---|---|---|
| View suggestions | Yes | Yes | No | View only | No |
| Create POs | Yes | Yes | No | No | No |
| Approve POs | By value | By value | No | No | No |
| Receive goods | No | No | No | No | Yes |
| QC items | No | No | No | No | Yes |
| Approve supplier bills | Yes | Yes | Yes | No | No |

---
*Based on erp-purchasing.html | BuildDock Team - 30 September 2026*
