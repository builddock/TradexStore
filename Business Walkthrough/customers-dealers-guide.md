# Tradex ERP - Customers & Dealers Module
### Business Walkthrough | BuildDock Team

---

## 1. What This Module Does
Manages all customer accounts: retail consumers (B2C) and approved dealers (B2B).
Dealer accounts get special pricing tiers. This module handles new dealer
applications, customer data, and the full customer 360 view.

## 2. Navigation
```
Left sidebar --> PARTNERS --> Customers & dealers
```

## 3. Tab 1 - All Customers

```
+--------------------------------------------------+
|  Customers & dealers   [+ Add customer]          |
|  [Search name, phone, email, GSTIN...]           |
|  [All v] [Consumers v] [Dealers v]              |
|                                                  |
|  Ramesh Kumar - +91 9876543210                  |
|  Consumer - Bangalore - Lifetime: Rs.2,84,990   |
|  Last order: TXO-10486 - 26 Sep                 |
|                                                  |
|  Byte Point Solutions                           |
|  Dealer Standard - Hubballi - GSTIN: 29XXX      |
|  Lifetime: Rs.12,40,000 - Net 30 credit         |
+--------------------------------------------------+
```

### Customer 360 View (Click any customer)

```
+--------------------------------------------------+
|  Ramesh Kumar                                   |
|  Consumer - Member since 12 Jan 2025            |
|  +91 9876543210 - ramesh@email.com             |
|                                                  |
|  Lifetime value: Rs.2,84,990 (net of returns)  |
|  Orders: 14 - Returns: 2 (return rate: 14%)    |
|  Avg order: Rs.20,356                           |
|                                                  |
|  [ Orders ] [ Returns ] [ Support ] [ Consent ] |
|                                                  |
|  Orders tab: all 14 orders in reverse date order|
|  Returns tab: all return requests               |
|  Support tab: all tickets and conversations     |
|  Consent tab: WhatsApp opt-in, email consent   |
+--------------------------------------------------+
```

## 4. Tab 2 - Business Accounts (Dealers)

```
+--------------------------------------------------+
|  Business accounts (dealers)                    |
|                                                  |
|  Byte Point Solutions                           |
|  Hubballi - GSTIN: 29AAKCT4821M1Z6            |
|  Tier: Standard Dealer (8% discount)           |
|  Credit: Prepaid - Limit: N/A                  |
|  Status: ACTIVE                                 |
|  [Edit tier] [Suspend] [View orders]            |
|                                                  |
|  Suspend business account                       |
|  When suspended:                                |
|  - Prices hidden from their portal             |
|  - New orders blocked                          |
|  - Order history kept                          |
+--------------------------------------------------+
```

## 5. Tab 3 - Dealer Applications

```
+--------------------------------------------------+
|  Dealer applications (pending: 3)               |
|                                                  |
|  Byte Point Solutions - Hubballi                |
|  Applied: 25 Sep - GSTIN: 29AAKCT4821M1Z6      |
|  GSTIN: VALID (auto-checked)                   |
|  Documents uploaded: Trade licence, PAN card    |
|                                                  |
|  Decision:                                      |
|  (o) Approve as Standard Dealer (8% disc)      |
|  ( ) Approve as Gold Dealer (12% disc)         |
|  ( ) Reject                                    |
|                                                  |
|  Reason (required): [                        ]  |
|  Price list: [Standard Dealer         v]        |
|                                                  |
|  [Reject]              [Approve dealer account] |
+--------------------------------------------------+
```

**GSTIN validation** happens automatically. The system checks the government
GST portal and shows if the GSTIN is valid and matches the business name.

## 6. Tab 4 - Duplicate Detection

```
+--------------------------------------------------+
|  Potential duplicates (2 found)                 |
|                                                  |
|  Priya Nair (email) = Priya N (phone match)    |
|  Review: same person or different people?       |
|                                                  |
|  [Merge accounts]  [Keep separate]              |
|                                                  |
|  Merge safeguards:                             |
|  - NEVER merge on name alone                   |
|  - Need email OR phone match + manual review   |
|  - Merged accounts keep all order history      |
+--------------------------------------------------+
```

## 7. Privacy & Data Rules

- Customer data is kept as long as required by law (for invoice/warranty purposes)
- Even if a customer asks to be deleted, their order and invoice records are kept
- Only personal contact details can be anonymised (email replaced with anonymised value)
- All data access is logged in the audit trail

## 8. How Other Roles See Customers

| Feature | Owner | Ops Admin | Finance | Branch Mgr | Support | Warehouse |
|---|---|---|---|---|---|---|
| View all customers | Yes | Yes | Yes | Own branch | Own branch | No |
| View lifetime value | Yes | Yes | Yes | Own branch | No | No |
| Approve dealer applications | Yes | Yes | No | No | No | No |
| Edit dealer tier | Yes | Yes | No | No | No | No |
| Suspend business account | Yes | Yes | No | No | No | No |
| Merge duplicate accounts | Yes | Yes | No | No | No | No |
| View customer consent | Yes | Yes | No | Yes | Yes | No |

---
*Based on erp-customers.html | BuildDock Team - 30 September 2026*
