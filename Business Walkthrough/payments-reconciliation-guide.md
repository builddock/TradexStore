# Tradex ERP - Payments & Reconciliation Module
### Business Walkthrough | BuildDock Team

---

## 1. What This Module Does
Manages all money movement: payments received from customers, reconciliation
with bank/gateway settlements, refunds, COD collection, and the daily financial close.

**Used primarily by: Finance team**

## 2. Navigation
```
Left sidebar --> FINANCE & INSIGHT --> Payments & reconciliation
```

## 3. Tab 1 - Payments Overview

```
+--------------------------------------------------+
|  Payments & reconciliation   26 Sep 2026        |
|                                                  |
|  Today                                          |
|  Rs.6.9 L received   47 orders   Rs.14,681 avg  |
|                                                  |
|  Method mix today:                              |
|  UPI:     62% - Rs.4.28 L                      |
|  Card:    21% - Rs.1.45 L                      |
|  COD:     11% - Rs.0.76 L (to collect)         |
|  NetBank:  6% - Rs.0.41 L                      |
|                                                  |
|  Unmatched value by age:                        |
|  < 1 day:  Rs.2,14,000  (31 items)             |
|  1-3 days: Rs.48,000    (6 items) [warn]        |
|  > 3 days: Rs.12,000    (2 items) [critical]    |
|                                                  |
|  [View unmatched items]                         |
+--------------------------------------------------+
```

### Unmatched Items Queue

Items where the payment gateway settlement does not match the order:

```
+--------------------------------------------------+
|  Unmatched items (39)                           |
|                                                  |
|  pay_Nx8Qxxx - Rs.98,988 - UPI - 26 Sep 10:04  |
|  Matched to: TXO-10486 [OK]                    |
|                                                  |
|  pay_Mx7Pyyy - Rs.45,000 - Card - 24 Sep 15:30 |
|  NOT MATCHED - No order found                   |
|  Age: 2 days [warn]                             |
|  [Investigate] [Match manually] [Mark as misc]  |
|                                                  |
|  [Apply settlement file: Import .csv]           |
+--------------------------------------------------+
```

## 4. Tab 2 - Payment Events

The payment event log tracks every state change of every payment attempt:

```
+--------------------------------------------------+
|  Payment events (append-only)                   |
|                                                  |
|  pay_Nx8Qxxx - Rs.98,988                       |
|  10:01 - Created (order TXO-10486)             |
|  10:01 - Initiated (UPI deeplink sent)          |
|  10:03 - Attempt 1 FAILED (bank decline)       |
|  10:04 - Attempt 2 CAPTURED                    |
|  10:04 - Webhook received (signed, verified)   |
|  10:04 - Order confirmed                       |
|  Settlement expected: 28 Sep                   |
+--------------------------------------------------+
```

> [!NOTE]
> Payment state and order state are SEPARATE. A failed payment does not
> cancel the order - the customer can retry. An order is only confirmed
> when a payment reaches "CAPTURED" state.

## 5. Tab 3 - Reconciliation

Match bank settlements to gateway statements to orders:

```
+--------------------------------------------------+
|  Reconciliation - Daily settlement              |
|                                                  |
|  Gateway statement: Rs.6,84,230 net            |
|  Bank credit:       Rs.6,84,230                |
|  Difference:        Rs.0 [MATCHED]             |
|                                                  |
|  Breakdown:                                     |
|  Gross captures:    Rs.7,12,840                |
|  Gateway fees:     - Rs.21,380                 |
|  Refunds paid out: - Rs.7,230                  |
|  Net settlement:    Rs.6,84,230                |
|                                                  |
|  [Import bank file] [Confirm reconciliation]    |
+--------------------------------------------------+
```

## 6. Tab 4 - Refunds

```
+--------------------------------------------------+
|  Refunds (pending: 4)                           |
|                                                  |
|  RF-0231 - Sony WH-1000XM4 - Rs.19,990         |
|  RMA-0093 - Inspection: PASSED                  |
|  Refund to: UPI - Google Pay (original method)  |
|  Status: FAILED (2 retries)                     |
|  [Retry refund] [Manual bank transfer]          |
|                                                  |
|  Retry safeguards:                             |
|  - Each retry is logged separately             |
|  - System prevents duplicate refunds           |
|  - Same reference ID used for idempotency      |
+--------------------------------------------------+
```

## 7. Tab 5 - COD Management

```
+--------------------------------------------------+
|  Cash on Delivery (COD)                         |
|                                                  |
|  Deliveries today: 12                           |
|  Collected: Rs.45,200 (8 deliveries)           |
|  Pending: Rs.18,400 (4 deliveries)             |
|                                                  |
|  COD remittance from courier:                  |
|  Expected: 28 Sep                              |
|  Amount: Rs.63,600                             |
|                                                  |
|  [Match COD remittance to orders]              |
+--------------------------------------------------+
```

## 8. Tab 6 - Daily Close

A maker-checker close process at end of each business day:

```
+--------------------------------------------------+
|  Daily close - 26 Sep 2026                      |
|                                                  |
|  Checklist (Maker: Deepa K.):                  |
|  [x] All payments reconciled                   |
|  [x] Unmatched items reviewed                 |
|  [x] Refunds processed                        |
|  [ ] COD remittance matched                   |
|  [ ] Close approved by checker (Vikram S.)    |
|                                                  |
|  [Submit for checker approval]                  |
|                                                  |
|  Checker (Vikram S.):                          |
|  [Review and approve daily close]              |
+--------------------------------------------------+
```

The daily close follows a **maker-checker** rule:
- One person (Maker) completes the close checklist
- A different person (Checker) approves it
- No one can be both maker and checker for the same day (Separation of Duties)

## 9. How Other Roles See Payments

| Feature | Owner | Finance | Ops Admin | Branch Mgr | Support | Warehouse |
|---|---|---|---|---|---|---|
| View payment overview | Yes | Yes | Summary | No | No | No |
| Process refunds | Yes | Yes | No | No | No | No |
| Reconcile settlements | Yes | Yes | No | No | No | No |
| View COD details | Yes | Yes | Yes | Own branch | No | No |
| Approve daily close | Yes | Checker | Checker | No | No | No |
| View unmatched items | Yes | Yes | No | No | No | No |

---
*Based on erp-finance.html | BuildDock Team - 30 September 2026*
