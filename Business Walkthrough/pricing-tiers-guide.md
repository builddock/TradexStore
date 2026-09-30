# Tradex ERP - Pricing & Tiers Module
### Business Walkthrough | BuildDock Team

---

## Contents
1. What This Module Does
2. How to Navigate Here
3. How Every Price Is Calculated
4. Tab 1 - Price Lists
5. Tab 2 - Dealer Tiers
6. Tab 3 - Price Simulator
7. Tab 4 - Promotions
8. Tab 5 - Approvals
9. How Other Roles See Pricing

---

## 1. What This Module Does

The **Pricing & Tiers** module manages all pricing in the system:
- Standard retail prices (what consumers pay)
- Dealer tier prices (discounted prices for approved dealers - B2B)
- Promotional prices (time-limited offers)
- Approval workflow for price changes

**Key rule:** No price change goes live without an approval. Every change is
compared to the previous price and reviewed before publishing.

---

## 2. How to Navigate Here

```
Left sidebar --> CATALOG --> Pricing & tiers
```

---

## 3. How Every Price Is Calculated

```
+--------------------------------------------------+
|  How every price is calculated                   |
|                                                  |
|  Base: Supplier cost (visible to Finance/Owner) |
|   +   Margin %                                  |
|   =   Internal floor price                      |
|       (no sale can go below this)               |
|                                                  |
|  List price (MRP / RRP)                         |
|   - Dealer discount (by tier %)                 |
|   = Dealer net price                            |
|   - Quantity discount (if applicable)           |
|   = Final dealer price                          |
|                                                  |
|  Promotions: applied on top, time-limited       |
|  Taxes (GST): added at checkout, never in       |
|  the price list                                 |
+--------------------------------------------------+
```

---

## 4. Tab 1 - Price Lists

```
+--------------------------------------------------+
|  Price lists (active: 4)                        |
|                                                  |
|  Standard Retail - Active                        |
|  1,284 SKUs - Last updated: 15 Sep 2026         |
|  [View / Edit]                                   |
|                                                  |
|  Dealer Gold - Q4 2026 revision [DRAFT]         |
|  38 SKUs changed - avg -1.8%                    |
|  Submitted for approval: 26 Sep                 |
|  AWAITING YOUR APPROVAL                         |
|  [Review & approve]                             |
|                                                  |
|  Dealer Standard - Active                        |
|  [View / Edit]                                   |
|                                                  |
|  [+ New price list]                              |
+--------------------------------------------------+
```

### Reviewing a Price List Change

When you click **[Review & approve]** on a draft change:

```
+--------------------------------------------------+
|  Dealer Gold - Q4 2026 revision                 |
|  Changes: 38 SKUs - avg -1.8%                   |
|                                                  |
|  SKU      | Current price | New price | Change  |
|  LAP01-RA | Rs.78,000     | Rs.76,440 | -2.0%   |
|  MON-01   | Rs.16,500     | Rs.16,170 | -2.0%   |
|  SSD-01   | Rs.4,800      | Rs.4,704  | -2.0%   |
|  ...38 rows total...                            |
|                                                  |
|  Reason submitted: Q4 dealer incentive           |
|  Submitted by: Vikram S. (Ops Admin)            |
|                                                  |
|  [Reject with note]         [Approve & publish] |
+--------------------------------------------------+
```

The live price list does NOT change until you click **[Approve & publish]**.

---

## 5. Tab 2 - Dealer Tiers

```
+--------------------------------------------------+
|  Dealer tiers                                   |
|                                                  |
|  Standard Dealer (154 dealers)                  |
|  Discount: 8% off list price                    |
|  Minimum order: Rs.25,000                        |
|  Credit: Prepaid only                           |
|                                                  |
|  Gold Dealer (23 dealers)                       |
|  Discount: 12% off list price                   |
|  Minimum order: Rs.1,00,000                     |
|  Credit: Net 30 (approved accounts only)        |
|                                                  |
|  Platinum (3 dealers - invite only)             |
|  Discount: 16% off list price + qty discounts   |
|  Custom credit terms                            |
|                                                  |
|  [Edit tier rules]  (Owner approval required)   |
+--------------------------------------------------+
```

### Quantity Discounts (Platinum Tier)

| Quantity | Additional discount |
|---|---|
| 1-9 units | Base tier price (16% off) |
| 10-49 units | +2% (total 18% off) |
| 50+ units | +4% (total 20% off) |

> [!NOTE]
> Whether discounts apply to each unit (graduated) or to all units once
> a tier is reached is still to be confirmed with the client (Decision Q33).

---

## 6. Tab 3 - Price Simulator

Test what any customer or dealer would pay without changing anything live.

```
+--------------------------------------------------+
|  Price simulator (read-only)                    |
|                                                  |
|  Product: [MacBook Air M2       v]              |
|  Customer type: [Dealer Gold    v]              |
|  Quantity: [10]                                 |
|  Promotion: [Diwali Sale Oct    v]              |
|                                                  |
|  Calculation:                                   |
|  List price:              Rs.84,990             |
|  Dealer Gold (-12%):     -Rs.10,199             |
|  Quantity 10+ (-2%):     -Rs.1,700              |
|  Diwali promo (-3%):     -Rs.2,550              |
|  ------------------------------------           |
|  Net price per unit:      Rs.70,541             |
|  GST (18%):              +Rs.12,697             |
|  Final price per unit:    Rs.83,238             |
|  Order total (10 units):  Rs.8,32,380           |
+--------------------------------------------------+
```

Use this before quoting a large order to ensure the price is correct.
The simulator uses the live pricing engine - same as what the customer sees.

---

## 7. Tab 4 - Promotions

```
+--------------------------------------------------+
|  Active promotions                              |
|                                                  |
|  Diwali Sale 2026                               |
|  3% off all laptops                             |
|  Valid: 1 Oct - 5 Nov 2026                     |
|  Applies to: Retail + Dealer Standard           |
|  Status: SCHEDULED (starts 1 Oct)              |
|                                                  |
|  Back to School July 2026                       |
|  Status: EXPIRED (ended 31 Jul)                |
|                                                  |
|  [+ New promotion]                              |
+--------------------------------------------------+
```

---

## 8. Tab 5 - Approvals

Shows all pending price-related approvals:
- Price list changes
- New promotions
- Discount overrides above staff authority

All require Owner (or delegated approver) sign-off before going live.

---

## 9. How Other Roles See Pricing

| Feature | Owner | Finance | Ops Admin | Catalog | Branch Mgr | Support |
|---|---|---|---|---|---|---|
| View all price lists | Yes | Yes | Yes | Yes | View only | No |
| Create / edit price lists | Yes | Yes | Yes | No | No | No |
| Approve price changes | Yes | Limited | No | No | No | No |
| View dealer tier discounts | Yes | Yes | Yes | No | Yes | No |
| Use price simulator | Yes | Yes | Yes | No | Yes | No |
| Create promotions | Yes | No | Yes | No | No | No |
| View supplier costs | Yes | Yes | No | No | No | No |

---

*This guide covers Tradex ERP Pricing & Tiers Module - Version 1.4.2*
*Based on erp-pricing.html mockup | BuildDock Team - 30 September 2026*
