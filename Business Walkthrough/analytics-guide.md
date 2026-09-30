# Tradex ERP - Analytics
### Business Walkthrough | BuildDock Team

---

## Contents

1. [What This Module Does](#1-what-this-module-does)
2. [Navigation](#2-navigation)
3. [Page Header and Buttons](#3-page-header-and-buttons)
4. [The Filter Row](#4-the-filter-row)
5. [Tab 1 - Overview](#5-tab-1---overview)
6. [Tab 2 - Sales](#6-tab-2---sales)
7. [Tab 3 - Products](#7-tab-3---products)
8. [Tab 4 - Customers](#8-tab-4---customers)
9. [Tab 5 - Store & Operations](#9-tab-5---store--operations)
10. [Cards Marked "Needs Visit Tracking"](#10-cards-marked-needs-visit-tracking)
11. [What Each Measure Means](#11-what-each-measure-means)
12. [Step-by-Step Owner Routines](#12-step-by-step-owner-routines)
13. [How Other Roles See This Module](#13-how-other-roles-see-this-module)
14. [Still To Be Decided](#14-still-to-be-decided)

---

## 1. What This Module Does

Analytics shows how the store is doing - sales, products, customers and day-to-day
operations - with every figure compared against an earlier period.

It was added after the client asked for a good analytics dashboard with sales, product,
customer and store analytics.

| Screen | Question it answers |
|---|---|
| **Control Centre** | What needs a decision **today**? |
| **Analytics** | What is growing, what is slipping, which products and customers matter most, and where do shoppers or orders get stuck? |
| **Reports** | Detailed tables, exports and scheduled reports |

**This module only shows figures.** It never changes orders, prices or stock. Decisions are
made on the pages its links lead to (Products, Pricing, Inventory, Customers, Support).

> [!IMPORTANT]
> All money figures **exclude GST** unless a label says otherwise. Net sales are after
> returns and refunds.

## 2. Navigation
```
Left sidebar --> OVERVIEW --> Analytics
```

The page has five tabs:
```
[Overview]  [Sales]  [Products]  [Customers]  [Store & operations]
```

## 3. Page Header and Buttons

```
+----------------------------------------------------------+
|  Overview > Analytics                                    |
|  Analytics                                               |
|  Saturday, 26 September 2026 - data as of 10:42 -        |
|  figures exclude GST unless stated                       |
|                                                          |
|           [Save view]  [Schedule email]  [Export]        |
+----------------------------------------------------------+
```

| Button | What it does |
|---|---|
| **[Save view]** | Remembers your date range, comparison and filters under your name, so the page opens the same way next time |
| **[Schedule email]** | Opens Reports -> Scheduled reports, where a saved view can be emailed automatically (e.g. every Monday at 8:00). Each recipient only gets what their own role and branch allow |
| **[Export]** | Downloads the figures behind every card, with your filters, as spreadsheet files (one per card). The link is private and expires. Every export is recorded. Exports never contain customers' personal details |

"data as of 10:42" tells you how fresh the figures are. If one data source is late, the page
says which figures may be incomplete.

## 4. The Filter Row

```
+------------------------------------------------------------------+
|  [7 days] [30 days*] [90 days] [12 months]                       |
|  Compare to [Previous period v]                                  |
|  [All locations v] [All channels v] [All buyers v]               |
|  [All categories v]  [reset]                                     |
|                 vs 29 Jul - 27 Aug 2026 - Rs. excl. GST          |
+------------------------------------------------------------------+
```

> [!IMPORTANT]
> **One filter row controls all five tabs.** Change a filter and every tile, chart and table
> on every tab follows.

| Filter | Options | Notes |
|---|---|---|
| **Date range** | 7 days, 30 days (default), 90 days, 12 months | Pick this first |
| **Compare to** | Previous period, or Same period last year | "Last year" removes festival and season effects |
| **Location** | All, Central Warehouse, or one branch | Location = the site that **fulfilled** the order |
| **Channel** | Website, Branch POS, WhatsApp, Assisted (staff) | Visit-tracking cards cover the website only |
| **Buyer** | Consumers or Approved dealers | Dealers buy at their own price list, so AOV and margin differ a lot |
| **Category** | One product category | Lists keep only that category |
| **[reset]** | Back to 30 days, previous period, whole store | |

A few cards are **store-wide** and ignore the location, channel, buyer and category filters:
Highlights, Targets, Customer segments and Cohort retention. Each one says so.

## 5. Tab 1 - Overview

The one-screen summary.

### 5.1 Eight headline tiles

```
+-------------+-------------+-------------+-------------+
| Net sales   | Orders      | Average     | Gross       |
| Rs.1.84 Cr  | 1,284       | order value | margin      |
| Previous:   | Previous:   | Rs.14,330   | 18.2%       |
| Rs.1.64 Cr  | 1,188       | Rs.13,780   | 17.5%       |
| +12.4% ~~~  | +8.1% ~~~   | +4.0% ~~~   | +0.7 pt ~~~ |
+-------------+-------------+-------------+-------------+
| Units sold  | Store       | Returning-  | Return rate |
| 2,961       | conversion  | customer    | 4.6%        |
| Previous:   | rate 1.40%  | share 67.5% | Previous:   |
| 2,702       | [Needs visit| Previous:   | 4.9%        |
| +9.6% ~~~   |  tracking]  | 65.7%       | -0.3 pt ~~~ |
|             | +0.12 pt    | +1.8 pt     | (good)      |
+-------------+-------------+-------------+-------------+
```

- The large figure is the chosen period; the grey line is the comparison period.
- The arrow and number are the change. Green means good for the business. For **return rate**
  lower is better, so a fall shows green.
- "pt" (percentage point) is used for rates: 1.28% -> 1.40% is +0.12 pt.
- The small line is the trend inside the period.

### 5.2 Net sales trend

A line chart of this period (blue) against the comparison period, on one scale.
Click **[Table view]** for the same numbers as a table.

### 5.3 Highlights

Short notes produced by **fixed rules** (no prediction), each with the rule that produced it.

```
+----------------------------------------------------------+
|  Highlights                                              |
|  Rule-based checks - 30 days vs the previous 30 days     |
|                                                          |
|  [up]  Refurbished laptops +32% vs the previous 30 days  |
|        Rs.29.6 L net sales                   [Good]      |
|        Rule: a category or condition grows by more than  |
|        25%                                  [Products ->]|
|  [up]  WhatsApp orders +31.8% - fastest-growing channel  |
|  [dn]  Grade B refurbished return rate 7.2% - store      |
|        average 4.6%                          [Watch]     |
|  [dn]  Mysuru Branch: paid -> dispatched 9.1 h vs 5.8 h  |
|  [up]  Dealer sales +22.0%                               |
|  [!]   Best seller Dell Latitude 5420 has 6.9 days of    |
|        stock left                                        |
|                                                          |
|  6 of 10 checks fired - rules run nightly - store-wide - |
|  thresholds are samples                                  |
+----------------------------------------------------------+
```

Click the button on a highlight to jump to the tab with the detail.

### 5.4 Top categories and sales by channel

- **Top categories by net sales** - the six biggest categories plus "Other".
- **Sales by channel** - one bar split into Website, Branch POS, WhatsApp and Assisted, with
  the amount and change for each.

### 5.5 Monthly targets

```
+------------------------------------------------------------------+
|  September targets        [Sample targets - TBC]                 |
|  Month to date, 1-26 Sep - store-wide                            |
|                                                                  |
|  Net sales  Rs.1.57 Cr of Rs.1.95 Cr    [Behind pace]            |
|  [########################......|....]  80% of target           |
|  Orders  1,092 of 1,400                 [Behind pace]            |
|  Gross margin  18.3% of 18.0%           [Above target]           |
|  New customers  281 of 330              [On track]               |
|  Dealer sales  Rs.60.4 L of Rs.70 L     [On track]               |
|                                                                  |
|  The dark tick | marks how much of the month has passed (87%)    |
+------------------------------------------------------------------+
```

Gross margin is a **level** target (it should stay above the line), not a running total.

> [!NOTE]
> Whether targets are shown at all, and who sets them, is still to be decided. The figures
> above are samples.

## 6. Tab 2 - Sales

| Card | What it shows |
|---|---|
| **Net sales and orders over time** | Two charts side by side (net sales and number of orders). Switch **Daily / Weekly / Monthly** |
| **Sales by channel** (table) | Channel, net sales, orders, AOV, share of net sales, growth |
| **Sales by location** | Net sales for each site that fulfilled orders |
| **Orders by weekday and hour** | A grid, one row per weekday and one column per hour - darker = more orders. A note names the busiest slot |
| **Payment methods** | Share of paid value: UPI, cards, net banking, EMI, cash on delivery (website, WhatsApp and assisted orders; branch counter payments are on the Payments page) |
| **Consumers and dealers** | Split of net sales, with orders, AOV and growth for each group |
| **Discounts and promotions** | Each promotion: orders, net sales, discount given, estimated extra margin, and whether it **Adds margin** or **Loses margin** |

```
+----------------------------------------------------------------+
|  Discounts and promotions             [Pricing & promotions ->]|
|  Promotion              Orders  Net sales  Discount  Extra     |
|                                            given     margin    |
|  Festive laptop week      84    Rs.14.6 L  Rs.92K    +Rs.1.2 L |
|  Dealer quantity tiers    36    Rs.10.6 L  Rs.58.7K  +Rs.50.3K |
|  Accessory bundle         64    Rs.3.8 L   Rs.27K    -Rs.5K    |
|                                        [Adds margin/Loses ...] |
+----------------------------------------------------------------+
```

## 7. Tab 3 - Products

| Card | What it shows |
|---|---|
| **Top products** | Ten best sellers: units, net sales, gross margin, return rate, stock cover, sell-through. Click a column heading to sort; click a row to open the product |
| **Category performance** | Every category ranked by net sales, or by gross margin (switch at the top) |
| **Sales by price band** | Units (or net sales) in each selling-price band, using the price the customer saw including GST |
| **Slow movers and ageing stock** | Stock sitting too long, with the oldest unit's age, days since last sale, stock value and a suggested action |
| **Condition mix and margin** | Share of sales from new, refurbished, open-box and used items, with margin and return rate for each |
| **Viewed often, bought rarely** | Products many shoppers open but few buy - **needs visit tracking** |
| **Searches with no results** | Words shoppers searched that found nothing, with a suggested fix - **needs visit tracking** |

```
+------------------------------------------------------------------+
|  Top products                                        [Catalog ->]|
|  Product              Cond.  Units  Net sales  Margin  Return    |
|                                                        rate  Cover|
|  Dell Latitude 5420   Refurb A  52   ...       18.0%   2.1%  6.9 |
|                                                         days-low |
|  ...                                                             |
+------------------------------------------------------------------+
```

"Suggested action" and "rule-based check" lines are suggestions from fixed rules. Staff
decide what to do.

## 8. Tab 4 - Customers

### 8.1 Five tiles

```
+-------------+-------------+-------------+-------------+-------------+
| Active      | New         | Repeat-     | Average     | Dealer      |
| customers   | customers   | purchase    | lifetime    | accounts    |
| 961         | 312         | rate 31.0%  | value       | active      |
| Prev: 900   | Prev: 297   | Prev: 29.1% | Rs.24,600   | 29 of 42    |
+-------------+-------------+-------------+-------------+-------------+
```

### 8.2 Cards

| Card | What it shows |
|---|---|
| **New and returning customers** | Two lines: customers who bought before, and first-time buyers |
| **Monthly cohort retention** | New customers grouped by the month of their first purchase; each row shows what share bought again in each later month. Read across a row to follow one group. Store-wide |
| **Customer segments** | Every customer from the last 24 months placed in one group by simple rules on how recently, how often and how much they bought, with a suggested action. Rules run nightly |
| **Top cities and regions** | Net sales by delivery city (or the branch city for counter sales) |
| **Why customers return items** | Return reasons by share of returned value |
| **Top dealer accounts** | Biggest dealers with price list, orders, net sales, AOV, last order and growth |
| **Support satisfaction** | Median first-response time, median resolution time, and a satisfaction score |

```
+------------------------------------------------------------------+
|  Monthly cohort retention                                        |
|  First purchase   Month 0  Month 1  Month 2  Month 3  Month 4 ...|
|  Apr '26 - 268     100%    13.8%    10.1%     8.6%     7.8%      |
|  May '26 - 301     100%    14.6%    10.6%     9.3%     8.0%      |
|  Jun '26 - 284     100%    15.1%    11.3%     9.5%               |
|  ...                                                             |
|  (later months stay blank until they have happened)              |
+------------------------------------------------------------------+
```

> [!NOTE]
> Segment messages go only to customers who agreed to receive them. This page does not send
> anything.

## 9. Tab 5 - Store & Operations

| Card | What it shows |
|---|---|
| **Store conversion funnel** | Sessions -> product views -> added to cart -> reached checkout -> paid, with the drop-off at each step - **needs visit tracking** |
| **Cart abandonment and recovery** | Share of filled carts not paid, where shoppers left, carts recovered by a reminder - **needs visit tracking** |
| **Traffic sources** | Where website visits came from - **needs visit tracking** |
| **Devices** | Mobile, desktop and tablet share of visits, with conversion - **needs visit tracking** |
| **Top landing pages** | Where visits start, share that left after one page, conversion - **needs visit tracking** |
| **Site search** | Searches per session, share using search, search-to-purchase, no-result share - **needs visit tracking** |
| **Fulfilment** | Paid -> dispatched (median hours), on-time delivery, delivery exceptions, returned to origin (RTO) |
| **Stock accuracy and stock-outs** | Counted units that matched the system, SKUs out of stock now, stock-out days, estimated lost sales, longest stock-outs |
| **Branch comparison** | Warehouse and branches side by side: net sales, orders, AOV, footfall -> sale, return rate, paid -> dispatched, growth |
| **Return rate by category** | Returns value as a share of gross sales, highest first |

```
+----------------------------------------------------------+
|  Store conversion funnel        [Needs visit tracking]   |
|  Website sessions -> paid orders - 28 Aug - 26 Sep 2026  |
|                                                          |
|  Sessions         [##########################] 43,180    |
|    down 57.0% continue - 18,570 drop off                 |
|  Product views    [###############]            24,610    |
|  Added to cart    [##]                          3,520    |
|  Reached checkout [#]                           1,610    |
|  Paid             [.]                             604    |
|                                                          |
|  Overall conversion 1.40% of sessions                    |
+----------------------------------------------------------+
```

```
+----------------------------------------------------------+
|  Fulfilment                    [Pick - pack - dispatch ->]|
|  Paid -> dispatched  On-time    Delivery     Returned to |
|  (median)            delivery   exceptions   origin (RTO)|
|  5.8 h               94.2%      2.1%         1.8%        |
|  -1.4 h (good)       +1.1 pt    -0.3 pt      -0.3 pt     |
+----------------------------------------------------------+
```

## 10. Cards Marked "Needs Visit Tracking"

Some figures describe **visits to the online store** - sessions, product views, add-to-cart,
traffic source, device, landing page and on-site search. They need the store's own visit
tracking, which the client has **not yet approved**.

```
  [eye] Needs visit tracking
```

| What this means today | What it means in the live system |
|---|---|
| In the design, these cards show sample values for review | If the client approves visit tracking, they show real figures for the website only |
| | If the client does not approve it, these cards do **not appear at all** |

The options still open are: no visit tracking, simple counts with no personal data, tracking
that asks each visitor for consent, or a third-party tool. Branch, WhatsApp and assisted sales
have no "visits", so these cards always cover the website only.

## 11. What Each Measure Means

| Measure | Plain meaning (definition as shown in the design, to be confirmed) |
|---|---|
| **Net sales** | Sales after returns and refunds, excluding GST |
| **Orders** | Number of orders placed in the period |
| **Average order value (AOV)** | Net sales divided by orders |
| **Gross margin** | Net sales minus the landed cost of the goods, as a % of net sales. 18.2% = Rs.18.20 left from every Rs.100 of sales |
| **Units sold** | Individual items sold, after returns |
| **Store conversion rate** | Paid website orders divided by website visits. 1.40% = 14 orders per 1,000 visits |
| **Returning-customer share** | Of the customers who bought in the period, the share who had bought before |
| **Return rate** | Value of items returned as a % of gross sales |
| **Stock cover** | How many days the stock on hand lasts at the last 30 days' sales rate |
| **Sell-through** | Units sold divided by (units sold + units still available) |
| **Active customers** | Customers with at least one order in the period, each counted once |
| **New customers** | Customers whose first-ever purchase is in the period |
| **Repeat-purchase rate** | Of customers who bought in the last 12 months, the share with 2 or more orders |
| **Average lifetime value** | Total net sales per customer since their first purchase, averaged |
| **Cohort retention** | Share of a first-purchase-month group who bought again in each later month |
| **Extra margin (promotion)** | Margin earned on promotion orders, minus the margin normally earned without it, minus the discount |
| **Paid -> dispatched** | Hours from payment to dispatch, median |
| **Percentage point (pt)** | The unit for changes in rates. 1.28% -> 1.40% is +0.12 pt |

## 12. Step-by-Step Owner Routines

### Weekly review (about 10 minutes)
1. Open **OVERVIEW -> Analytics**. Choose **7 days** or **30 days**, compare with **Previous
   period**.
2. On **Overview**, read the eight tiles for direction, then the **Highlights** for reasons.
3. Click a highlight's button to open the tab with the detail.
4. On **Products**, check low **stock cover** on best sellers and the **slow movers** list.
5. On **Store & operations**, check **Fulfilment** and the **Branch comparison**.

### Finding the cause of a change
1. Note which tile moved (e.g. net sales down).
2. Narrow with **Location**, then **Channel**, then **Buyer**, then **Category** - one at a time -
   until the change is explained.
3. Switch **Compare to** to **Same period last year** to rule out seasonal effects.
4. Act on the page the card links to (Pricing, Inventory, Customers, Support).

### Keeping or sharing a view
1. Set the filters you want.
2. Click **[Save view]**.
3. To send it regularly, click **[Schedule email]** and set it up in Reports.
4. To take the figures into a spreadsheet, click **[Export]**.

## 13. How Other Roles See This Module

| Role | Access (to be confirmed by the client) |
|---|---|
| **Owner** | Everything, including gross margin and cost figures |
| **Operations Admin** | To be decided. If allowed, margin only if also allowed |
| **Finance** | To be decided. If allowed, margin only if also allowed |
| **Branch Manager** | To be decided; if allowed, possibly **their own branch only** |
| **Warehouse, Sales, Support, Catalog** | No access |

When a person may not see margin, margin and cost figures are **left out** of tiles, tables and
exports - they are not shown as blank.

## 14. Still To Be Decided

| Question | Decision |
|---|---|
| Net sales basis: excluding GST, after returns and cancellations, by order date or invoice date? | D-286 |
| Where the cost for gross margin comes from, and who may see margin | D-286 |
| Monthly targets per location or channel - who sets them, and are they shown? | D-286 |
| How often the figures refresh, and the freshness label | D-286 |
| The rules for customer segments | D-286 |
| Whether branch managers see only their own branch | D-286 |
| Storefront visit tracking - none, simple counts, consent-based, or a third-party tool | D-285 |
| Satisfaction score and "Footfall -> sale" - no way of collecting ratings or counting branch visitors exists yet | to be raised with the client |

> [!NOTE]
> **Sample values.** Every amount, count, target, threshold, date, product and dealer name in
> this guide is a sample from the design mockup (Saturday 26 September 2026, 10:42). They are
> not the client's real figures.

---
*Based on erp-analytics.html | BuildDock Team - 30 September 2026*
