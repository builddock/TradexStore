# Tradex ERP - Control Centre
### Business Walkthrough - Owner & All Roles
### Non-Technical Edition by BuildDock Team

---

## Contents

1. [Owner Login - Step by Step](#1-owner-login)
2. [Control Centre Overview](#2-control-centre-overview)
3. [Section A - Page Header & Actions Bar](#3-section-a---page-header)
4. [Section B - Filter Bar](#4-section-b---filter-bar)
5. [Section C - KPI Tiles (The 6 Key Numbers)](#5-section-c---kpi-tiles)
6. [Section D - Needs Attention (Exceptions)](#6-section-d---needs-attention)
7. [Section E - Approvals Waiting on You](#7-section-e---approvals)
8. [Section F - Order Pipeline](#8-section-f---order-pipeline)
9. [Section G - Sales Charts](#9-section-g---sales-charts)
10. [Section H - Stock Health](#10-section-h---stock-health)
11. [Section I - Automation Panel](#11-section-i---automation)
12. [Section J - Recent Activity Feed](#12-section-j---recent-activity)
13. [Section K - Top Products Table](#13-section-k---top-products)
14. [Section L - Daily Digest](#14-section-l---daily-digest)
15. [How Other Roles See the Control Centre](#15-other-roles)

---

---

## 1. Owner Login

### 1.1 Open the System

Go to your Tradex ERP workspace URL in any browser.
Example: `https://erp.tradexelectronics.in`

```
+------------------------------------------+
|  TRADEX ERP                              |
|  Workspace sign-in                       |
|                                          |
|  Work email                              |
|  [ rajesh@tradexelectronics.in ]         |
|                                          |
|  Password                                |
|  [ ........           ]                  |
|                                          |
|  Or: [ Sign in with a one-time code ]   |
|                         [ Sign in ]      |
+------------------------------------------+
```

Type your work email and password, then click **Sign in**.

---

### 1.2 Two-Step Verification

After your password, the system asks for your authenticator code.

```
+------------------------------------------+
|  Two-step verification                   |
|                                          |
|  Open your authenticator app and enter   |
|  the 6-digit code shown there.           |
|                                          |
|  [ 4  8  2  9  1  3 ]                   |
|                                          |
|  [ Use a backup code instead ]          |
|                         [ Verify ]       |
+------------------------------------------+
```

Open **Google Authenticator / Authy / Microsoft Authenticator** on your phone.
Find the "Tradex ERP" entry. Enter the 6-digit number. Click **Verify**.

> [!IMPORTANT]
> The 6-digit code changes every 30 seconds. If it expires before you type it,
> wait for the next code in the app and use that one instead.

---

### 1.3 You Land on the Control Centre

After the code is verified, you go directly to the **Control Centre** -
your personal command dashboard for the whole business.

```
+-------------------------------------------------------------------+
|  Good morning, Rajesh           [Delegation on - Anita R. Rs.25k]|
|  Saturday, 26 September 2026                                      |
|  data fresh as of 10:42 - stock sync lag 14s                     |
|                         [Preview daily digest]       [Export]     |
+-------------------------------------------------------------------+
|  [Today] [7 days] [30 days*] [90 days]  [All locations v]        |
+-------------------------------------------------------------------+
|  Rs.1.84 Cr | 1,284 Orders | Rs.14,330 | 6.2%  | 98.7% | 5.8 h  |
+-------------------------------------------------------------------+
|  NEEDS ATTENTION (6)          |  APPROVALS WAITING (5)           |
+-------------------------------------------------------------------+
|  ...exceptions list...        |  ORDER PIPELINE (live)           |
+-------------------------------------------------------------------+
|  SALES CHART by channel       |  SALES by location + mix         |
+-------------------------------------------------------------------+
|  STOCK HEALTH  |  AUTOMATION  |  RECENT ACTIVITY                 |
+-------------------------------------------------------------------+
|  TOP PRODUCTS TABLE                                               |
+-------------------------------------------------------------------+
```

Each section is explained fully below.

---

---

## 2. Control Centre Overview

The Control Centre is the **first screen you see every time you log in**.
It summarises the entire business so you can understand its health in
under 2 minutes - without opening any other screen.

**Key design principle:** The Control Centre only shows things that **need
your attention**. Routine work (picking orders, answering support tickets)
stays in staff queues and never reaches you here. You only see what has
escalated above what your team can handle on their own.

**Everything is live** - numbers refresh automatically as orders come in,
stock moves, and staff complete tasks.

---

---

## 3. Section A - Page Header

```
+-------------------------------------------------------------------+
|  Good morning, Rajesh                                             |
|  Saturday, 26 September 2026                                      |
|  data fresh as of 10:42 - stock sync lag 14s                     |
|                                                                   |
|  [Delegation on - Anita R. up to Rs.25k]  (green badge)          |
|                                                                   |
|                    [Preview daily digest]          [Export]       |
+-------------------------------------------------------------------+
```

---

### What Each Part Means

**"Good morning, Rajesh"**
- Personalised greeting using your name from your account
- Confirms you are signed in as yourself and not someone else

**Date line**
- Shows today's date and day of the week
- Confirms the system clock is correct for your timezone

**"data fresh as of 10:42 - stock sync lag 14s"**
- 10:42 = the page data was last refreshed at 10:42 AM today
- "stock sync lag 14s" = stock numbers are only 14 seconds behind live reality
- If this shows a large delay (e.g. "lag 45 min"), the data may be stale -
  refresh the page or contact BuildDock Team

**"Delegation on - Anita R. up to Rs.25k" (green badge)**
- Appears ONLY when you have an active delegation running
- Means: Anita R. is currently authorised to approve things on your behalf
  up to Rs.25,000
- Click this badge to see full details or cancel the delegation
- If you see this and did NOT set it up, contact BuildDock Team immediately

---

### The Two Action Buttons

**[Preview daily digest]**
- Opens a preview of the morning summary report sent at 8:00 AM by email/WhatsApp
- Shows yesterday's numbers and what needs a decision today
- Use this when you have been away and want a quick catch-up
- Full details in Section L

**[Export]**
- Downloads the current dashboard view as a PDF or CSV file
- Useful for sharing in a meeting or weekly review

---

---

## 4. Section B - Filter Bar

```
+-------------------------------------------------------------------+
|  [Today]  [7 days]  [30 days*]  [90 days]                        |
|  [All locations              v]                                   |
|  [All channels               v]                                   |
|  [All buyers                 v]                                   |
|                                                                   |
|  Compared with the previous 30 days - figures exclude GST        |
+-------------------------------------------------------------------+
```

> [!IMPORTANT]
> **This filter bar controls everything below it.** When you change any
> filter, ALL tiles, charts, and tables refresh instantly to match.

---

### Time Period Buttons

| Button | What it shows |
|---|---|
| **Today** | Numbers from midnight to right now |
| **7 days** | Rolling last 7 days |
| **30 days** | Rolling last 30 days (default) |
| **90 days** | Rolling last 90 days (quarterly review) |

The comparison shown below each KPI tile always compares the SAME length
of time before your selected period.
Example: With "30 days" selected, the +12.4% comparison is against the 30 days before that.

---

### Location Filter

| Option | What it shows |
|---|---|
| **All locations** | Combined numbers from all branches and the warehouse |
| **Central Warehouse** | Warehouse only |
| **SP Road Branch** | SP Road branch only |
| **Koramangala Branch** | Koramangala branch only |
| **Mysuru Branch** | Mysuru branch only |

Use this to review a single branch's performance or investigate an issue
at a specific location.

---

### Channel Filter

| Option | What it means |
|---|---|
| **All channels** | All sales combined |
| **Website** | Orders placed on the Tradex online store |
| **Branch POS** | Walk-in sales at a branch counter |
| **WhatsApp** | Orders converted from WhatsApp conversations |
| **Assisted (staff)** | Orders placed by staff on behalf of a customer |

Use this to compare which channel is performing better or investigate a
dip in one specific channel.

---

### Buyer Type Filter

| Option | What it means |
|---|---|
| **All buyers** | Consumer + Dealer orders combined |
| **Consumers** | Regular retail customers only |
| **Approved dealers** | Verified B2B dealer/reseller orders (at dealer prices) |

**Bottom note:** "figures exclude GST" - all money figures are net of tax.
This is the standard for comparing revenue performance.

---

---

## 5. Section C - KPI Tiles

The 6 tiles are the most important numbers on the page.
They show the health of the business at a glance.

```
+----------+----------+----------+----------+----------+---------+
| Rs.1.84Cr| 1,284    | Rs.14,330| 6.2%     | 98.7%    | 5.8 h   |
| Net sales| Orders   | Avg order| Owner    | Stock    | Paid to |
|          |          | value    | touches  | accuracy | dispatch|
| +12.4% ^ | +8.1% ^  | +4.0% ^  | from 31%v| +0.9pt ^ | -1.4h v |
+----------+----------+----------+----------+----------+---------+
```

Each tile shows:
- A **big number** - the current value for the selected period
- A **trend indicator** (^ up arrow or v down arrow) vs the previous period
- A **tiny sparkline graph** - the trend line over the selected time window

---

### Tile 1 - Net Sales (Rs.1.84 Cr)

**What it is:** Total money collected from completed orders in the selected
period - after returns, after discounts, and excluding GST.

**"Cr" = Crore.** Rs.1.84 Cr = Rs.1,84,00,000

**+12.4% with green arrow:** Sales are 12.4% higher than the same period
before. Green = growing. Red = falling.

**If this drops - what to do:**
1. Change the Channel filter to find which channel dropped
2. Change the Location filter to find which branch dropped
3. Open the Orders screen to investigate

---

### Tile 2 - Orders (1,284)

**What it is:** Total number of orders placed in the selected period.

**Compare with Net Sales:** If sales are up but orders are flat, customers
are buying higher-value items. If orders are up but sales are flat, people
are buying smaller items. Understanding this difference helps your pricing
and inventory strategy.

---

### Tile 3 - Average Order Value (Rs.14,330)

**What it is:** Net Sales divided by number of Orders.
Rs.1.84 Cr / 1,284 orders = approximately Rs.14,330 per order.

**Why it matters:** A rising average order value means customers are buying
premium products or larger quantities per visit. This is especially
important for your dealer B2B segment.

---

### Tile 4 - Owner Touches (6.2%)

**What it is:** The percentage of all transactions and decisions that
required YOU (the Owner) to personally step in, approve, or intervene.

**Why going DOWN is GOOD:**
- 31% (before) meant you had to personally handle 31 in every 100 decisions
- 6.2% (now) means your team independently handles 93.8% of everything
- A lower number = your team is empowered and thresholds are well configured
- You are NOT a bottleneck in your own business

**Downward green arrow:** For this tile only, going down is a positive sign.

**If this goes UP:** Staff may need training, thresholds may need adjustment,
or there is unusual activity. Go to Settings > Approval thresholds to review.

---

### Tile 5 - Stock Accuracy (98.7%)

**What it is:** How closely the system's stock numbers match what is
physically present in warehouses and branches.

- 100% = everything the system says is there is actually there
- 98.7% = 1.3% of items counted during a stock check did not match the system

**Industry standard:** 98%+ is considered good. Below 96% is a concern.

**If this drops below 97%:**
- Schedule an emergency stock count at the location that dropped
- Check if recent receiving or transfer processes had errors
- Review the quarantine log for missing items

---

### Tile 6 - Paid to Dispatched (5.8 hours)

**What it is:** The average time between a customer's payment being confirmed
and the order being handed to the courier.

**Going DOWN is GOOD:**
- Was 7.2 hours before; now 5.8 hours - your team is faster
- Lower = happier customers = fewer "where is my order?" support calls
- Industry best practice for electronics: under 6 hours for in-stock items

**If this rises above 12 hours:** Check Pick/Pack/Dispatch queue. Use the
Location filter to identify if one branch is slower than others.

---

---

## 6. Section D - Needs Attention (Exceptions)

```
+-------------------------------------------------------+
|  Needs attention                     [Mine (6) v]     |
|  Only exceptions above delegated authority reach you  |
|  6 open - 41 resolved by staff this week              |
+-------------------------------------------------------+
```

---

### What This Section Is

Your **personal escalation queue** - problems that your team could not
resolve on their own and need you to decide.

The key phrase is: *"Only exceptions above delegated authority reach you."*
The system automatically filters out routine work and only brings you items
that have exceeded what your staff are allowed to handle.

**"41 resolved by staff this week"** - this tells you how much your team
handled without needing you. The 6 here are what bubbled up.

**Two tabs:**
- **Mine (6):** Items that specifically need YOU (the Owner) to act on
- **All teams (23):** All open exceptions across the whole team (for visibility)

---

### Severity Levels

| Badge | Colour | Meaning | Respond within |
|---|---|---|---|
| **CRITICAL** | Red | Customer money at risk or SLA breach imminent | Minutes |
| **SERIOUS** | Orange | Revenue or compliance issue | Within the hour |
| **WARNING** | Yellow | Operational issue that will grow if ignored | Today |
| **INFO** | Blue | Informational - no immediate action needed | When possible |

---

### Exception 1 - Payment Captured But Order Not Confirmed (CRITICAL)

```
|  [!] CRITICAL                                               |
|  Payment captured but order not confirmed                   |
|  TXO-10477 - Apple MacBook Air M2 - Rs.84,990             |
|  38 min ago - Finance: Deepa K. - Due by 11:30            |
|  Razorpay payment captured 10:04 - reservation expired 10:02|
|  One alternate unit (U-000815) available at SP Road        |
|  [Reserve alternate unit]    [Refund]                      |
```

**What happened:**
- Customer paid Rs.84,990 for a MacBook Air M2 at 10:04 AM
- But the stock reservation expired at 10:02 AM (2 minutes earlier)
- Order is in limbo - money received, no stock reserved

**Your two choices:**
- **[Reserve alternate unit]** - One more unit exists at SP Road.
  Click to reserve it and fulfil the order. Customer is notified automatically.
- **[Refund]** - If you cannot fulfil, refund the customer immediately.

**Why CRITICAL:** Customer has paid but has no confirmation. Every minute of
delay increases the risk of a chargeback complaint.

---

### Exception 2 - Discount Below Margin Floor (SERIOUS)

```
|  [!] SERIOUS                                                |
|  Discount below margin floor needs owner approval           |
|  TXO-10491 - Assisted order - 10 x Dell P2422H monitors   |
|  1h 12min - Requested by Vikram S. (his limit is 8%)       |
|  Requested 14% for school tender. Margin after: 3.1%       |
|  (Your floor is 6%)                                         |
|  [Approve]    [Counter with 10%]                           |
```

**What happened:**
- Vikram (Ops Admin) is handling a bulk order from a school
- School wants 14% discount; Vikram's authority is 8%
- At 14% discount, gross margin drops to 3.1% (below your 6% floor)
- Vikram could not approve it himself, so he escalated to you

**Your choices:**
- **[Approve]** - Accept 14% discount; reason is recorded in the audit log
- **[Counter 10%]** - Send a counter-offer of 10% back to Vikram to propose to the school

**Business consideration:** A school tender may mean recurring bulk orders
even at thin margin. Use your judgement on the relationship value.

---

### Exception 3 - Refund Failed at Payment Provider (SERIOUS)

```
|  [!] SERIOUS                                                |
|  Refund failed at payment provider (2 retries)              |
|  RMA-0093 - Sony WH-1000XM4 - Rs.19,990                   |
|  3 hours elapsed - Customer SLA: 6 hours                   |
|  [Open refund]                                              |
```

**What happened:**
- Customer returned Sony headphones, return was accepted, item received back
- System tried to refund Rs.19,990 to the customer's account - failed twice
- Customer SLA is 6 hours; 3 hours have already passed

**What to do:**
- Click **[Open refund]** - go to the Finance screen and manually initiate
  the refund or contact the payment gateway support line

---

### Exception 4 - Stock Write-Off Above Manager Threshold (WARNING)

```
|  [i] WARNING                                                |
|  Stock write-off above manager threshold                    |
|  WH-BLR - 3 x LG 27UL550 monitors - water damage          |
|  Value: Rs.42,300                                           |
|  Flagged by: Irfan M. --> reviewed by: Anita R.            |
|  [Review evidence]                                          |
```

**What happened:**
- 3 monitors were water-damaged at the Bangalore Warehouse
- Warehouse staff Irfan flagged it, Branch Manager Anita reviewed it
- Rs.42,300 is above what a Branch Manager can approve for write-off
- Needs Owner approval before stock can be officially written off

**What to do:**
- Click **[Review evidence]** to see photos and documentation of the damage
- If satisfied, approve the write-off

---

### Exception 5 - Supplier Feed Stale (WARNING)

```
|  [i] WARNING                                                |
|  Supplier availability feed stale for 26 hours              |
|  NetCore Solutions - 14 offers affected                     |
|  Auto-rule switched offers to "confirm before promise"      |
|  [Contact vendor]                                           |
```

**What happened:**
- Vendor NetCore Solutions has not sent a stock update for 26 hours
- The system already protected you: it automatically switched their 14 product
  listings from "in stock" to "confirm before promise" mode
- No customer will be falsely promised out-of-stock items

**What to do:**
- Click **[Contact vendor]** to send a message to NetCore asking for an update
- Once they send their feed, offers switch back to normal automatically

---

### Exception 6 - Courier Sync Failing (WARNING)

```
|  [i] WARNING                                                |
|  Courier status sync failing - auto-retry paused after 3   |
|  17 shipments without tracking update since 08:15          |
|  [View job]                                                 |
```

**What happened:**
- The automated link between Tradex and the courier is broken
- 17 shipments have no tracking update since 08:15 AM
- System tried 3 times and paused (to avoid overloading the failing service)

**What to do:**
- Click **[View job]** to see the technical error in the Automation screen
- If it is a courier API issue, contact the courier's technical support
- If it is a Tradex issue, contact BuildDock Team

---

---

## 7. Section E - Approvals Waiting on You

```
+-------------------------------------------+
|  Approvals waiting on you                 |
|  5 items - oldest 1 day    [Open queue]   |
+-------------------------------------------+
|  [DH] Marketplace seller application      |
|       Digital Hub Traders                 |
|       Phase 2 pilot - docs verified       |
|                              [Review]     |
+-------------------------------------------+
|  [BP] Dealer application                  |
|       Byte Point Solutions, Hubballi      |
|       GSTIN validated                     |
|                              [Review]     |
+-------------------------------------------+
|  [PL] Price list change - Dealer Gold     |
|       Q4 revision - 38 SKUs - avg -1.8%  |
|                              [Review]     |
+-------------------------------------------+
|  [VS] Vendor listing - sensitive edit     |
|       RenewTech - warranty 6 --> 3 months |
|       4 SKUs affected                     |
|                              [Review]     |
+-------------------------------------------+
```

---

### What This Section Is

Your **formal decision inbox** - structured requests from your team or the
system that need your explicit approval before anything changes.

Unlike "Needs Attention" which are urgent problems, Approvals are planned
requests that follow a formal process with reasons and evidence attached.

**"Oldest 1 day"** - one of these has waited 1 day. The longer an approval
waits, the more your team is blocked from completing work.

---

### Approval 1 - Marketplace Seller Application

**What it is:** Digital Hub Traders has applied to sell products through
Tradex as a marketplace partner. Their documents have been verified by the team.

**What you decide:**
- Click **[Review]** to see their full application (business docs, GSTIN,
  bank details, product categories)
- Approve or reject with a reason

---

### Approval 2 - Dealer Application

**What it is:** Byte Point Solutions from Hubballi has applied for a dealer
account (B2B buyer with dealer pricing). GSTIN has been automatically validated.

**What you decide:**
- Click **[Review]** to see company details and decide which dealer tier to
  assign (Standard / Gold) based on their expected order volume

---

### Approval 3 - Price List Change (Dealer Gold)

**What it is:** The team has prepared a Q4 price revision for the Dealer Gold
tier - 38 products with an average price reduction of 1.8%.
The change is a draft. Your approval makes it live.

**What you decide:**
- Click **[Review]** to see a side-by-side comparison of old vs new prices
  for all 38 products
- Approve to publish, or reject with a note to revise

> [!IMPORTANT]
> The live price list does NOT change until you approve.
> You always see the full diff before committing.

---

### Approval 4 - Vendor Listing Sensitive Edit

**What it is:** Vendor RenewTech wants to reduce the warranty period on
4 products from 6 months to 3 months. Warranty changes are treated as
"sensitive edits" and require Owner approval.

**What you decide:**
- Click **[Review]** to see exactly which 4 products are affected
- Approve or reject. If approved, product pages update automatically.

---

---

## 8. Section F - Order Pipeline

```
+----------------------------------+
|  Order pipeline           Live   |
|  All locations       [Orders ->] |
+----------------------------------+
|  12          |  23              |
|  Awaiting    |  Confirmed       |
|  payment     |  to pick         |
+----------------------------------+
|  16          |  41              |
|  Picking /   |  Dispatched      |
|  packed      |  today           |
+----------------------------------+
|  3  [warn]   |  2  [critical]   |
|  Delivery    |  Overdue         |
|  exceptions  |  (>24h)          |
+----------------------------------+
```

---

### What This Section Is

A **live snapshot** of where every order is right now across all locations.
This panel ignores the time period filter - it always shows the current
live moment.

---

### Each Stage Explained

| Number | Stage | What it means |
|---|---|---|
| **12** | Awaiting payment | Customer placed order but payment not yet confirmed |
| **23** | Confirmed - to pick | Payment done, warehouse has not started picking yet |
| **16** | Picking / packed | Warehouse is actively picking or packing these right now |
| **41** | Dispatched today | Orders handed to courier today |
| **3** | Delivery exceptions | Courier reported a problem (failed delivery, wrong address) |
| **2** | Overdue dispatch (red) | Orders confirmed 24+ hours ago but NOT yet dispatched |

**The 2 red "Overdue" orders need immediate action.**
Click **[Orders ->]** to open the Orders screen. Filter by "Overdue" to
see which orders these are and which location is holding them up.

---

---

## 9. Section G - Sales Charts

```
+----------------------------------+-----------------------------+
|  Net sales by channel            |  Net sales by location      |
|  Daily - last 30 days (ex GST)   |  Last 30 days               |
|                                  |                             |
|  [Line chart with 3 lines]       |  Central Warehouse  Rs.79L  |
|  -- Website (highest)            |  SP Road Branch     Rs.54L  |
|  -- Branch POS                   |  Koramangala Branch Rs.34L  |
|  -- WhatsApp                     |  Mysuru Branch      Rs.17L  |
|                                  |                             |
|  [Table view]                    |  Sales mix by condition     |
|                                  |  New 58% / Refurb 27%       |
|                                  |  Open box 9% / Used 6%      |
+----------------------------------+-----------------------------+
```

---

### Chart 1 - Net Sales by Channel (Line Chart)

**What it shows:** Daily revenue over the last 30 days, split into 3 lines:
- Website orders (online store)
- Branch POS (walk-in sales)
- WhatsApp orders (chat-converted)

**How to read it:**
- Higher on the chart = more revenue that day
- A sudden dip on one line = that specific channel had a bad day
- Weekends typically show higher Website/WhatsApp, lower Branch POS

**[Table view] button:** Switches the chart to a data table if you prefer numbers.

**Business insights:**
- If the WhatsApp line is flat while Website grows - your chat team needs attention
- If Branch POS drops on a specific day - check if that branch had a power cut or staff shortage
- If all 3 lines drop together - look for an external cause (festival, news event)

---

### Chart 2 - Net Sales by Location (Horizontal Bar Chart)

**What it shows:** Revenue earned at each location for the selected period.

Reading the example:
- Central Warehouse (Rs.79L): Highest because it fulfils most online orders
- SP Road Branch (Rs.54L): Your highest-revenue walk-in branch
- Koramangala Branch (Rs.34L): Growing steadily
- Mysuru Branch (Rs.17L): Newest branch, still building volume

**Business insights:**
- Quickly see which branch is growing and which needs support
- If Mysuru is not growing after 6 months, review staffing and local marketing

---

### Chart 3 - Sales Mix by Condition (Stacked Bar)

**What it shows:** What percentage of your total revenue comes from each
product condition type:
- **New: 58%** - primary business
- **Refurbished: 27%** - significant and growing
- **Open box: 9%**
- **Used: 6%**

**Business insights:**
- If refurbished share grows past 35%, ensure you have enough refurb inventory
- If new share drops, check if your new product pricing is competitive vs marketplace
- This mix affects your average margin - new vs refurb have very different margins

---

---

## 10. Section H - Stock Health

```
+---------------------------------------------+
|  Stock health                [Inventory ->]  |
+---------------------------------------------+
|  [!] 18 SKUs below reorder point            |
|      12 draft POs suggested - buyer needed  |
|                              [Review]       |
+---------------------------------------------+
|  [X] 23 units in quarantine                 |
|      9 customer returns - 14 inbound QC     |
|                              [Inspect]      |
+---------------------------------------------+
|  [-] 3 transfers in transit                 |
|      1 partly received (-1 unit) - BR-MYS   |
|                              [Track]        |
+---------------------------------------------+
|  [t] Rs.6.2 L stock older than 90 days     |
|      Mostly refurbished Grade B monitors    |
|                              [Ageing]       |
+---------------------------------------------+
```

---

### What This Section Is

A **health check of your physical stock** across all locations.
Four key risk areas you should review every morning.

---

### Row 1 - SKUs Below Reorder Point

**What it means:** 18 product types have fallen below their minimum
stock level (the "reorder point" you set for each product).

"12 draft POs suggested" = the system has already drafted purchase orders
to replenish these. But someone with Buyer authority needs to approve them
before they are sent to suppliers.

**What to do:** Click **[Review]** to open Purchasing and approve the
suggested purchase orders. Delay risks running out of stock and losing sales.

---

### Row 2 - Units in Quarantine

**What it means:** 23 individual units CANNOT be sold right now:
- 9 are customer returns waiting for inspection
- 14 are newly arrived units awaiting inbound quality check

Until inspected and cleared, these units are NOT counted as available stock.

**What to do:** Click **[Inspect]** to go to Returns/Receiving and assign
warehouse staff to complete the inspection.
- Units that pass inspection move to available stock
- Units that fail are written off or returned to the vendor

---

### Row 3 - Transfers in Transit

**What it means:** 3 stock transfers are currently on the road between
your locations. One has a discrepancy - 1 unit is missing at the Mysuru
branch when counted on receipt.

**What to do:** Click **[Track]** to open the transfer record and investigate
the missing unit. Was it lost in transit, miscounted, or still on the vehicle?

---

### Row 4 - Aged Stock (Older Than 90 Days)

**What it means:** You have stock worth Rs.6.2 lakh that has been sitting
unsold for more than 90 days. Mostly refurbished Grade B monitors.

**Why this matters:** Old stock ties up working capital and warehouse space.
At 90+ days, action is needed.

**Options:**
1. Run a clearance promotion at a discounted price
2. Bundle with a fast-moving product
3. Return to vendor (if return policy allows)
4. Write off if truly unsaleable

Click **[Ageing]** to see the full aged stock list with product details.

---

---

## 11. Section I - Automation Panel

```
+---------------------------------------------+
|  Automation                       [Rules ->] |
+---------------------------------------------+
|  2,418    |  99.2%    |  41 h    |  3        |
|  Runs     |  Success  |  Staff   |  Failing  |
|  today    |  rate     |  time    |  jobs [!] |
|           |           |  saved   |           |
+---------------------------------------------+
|  [ok] Payment -> reserve -> pick task        |
|       412 runs - 0 failures today           |
+---------------------------------------------+
|  [X]  Courier tracking sync                  |
|       Paused - provider timeout              |
+---------------------------------------------+
```

---

### What This Section Is

Shows how your **automated rules and background jobs** are performing.
Automation handles tasks without any human involvement - for example, when
a payment is confirmed, the system automatically reserves the stock and
creates a pick task for the warehouse - no one needs to do this manually.

---

### The 4 Automation Numbers

| Number | What it means |
|---|---|
| **2,418 Runs today** | Automation has completed 2,418 tasks today without human input |
| **99.2% Success rate** | 99.2% of those tasks completed without error |
| **41 h Staff time saved** | Estimated hours your team did NOT spend on manual tasks this week |
| **3 Failing jobs (red)** | 3 automation rules are currently broken and not running |

**The 41 hours saved is a real business metric.** It shows the return on
investment of the automation rules you have configured.

---

### Individual Rule Rows

**Green - Payment to reserve to pick (working perfectly):**
- 412 runs today, zero failures
- This rule: when payment is confirmed, stock is reserved and a pick task
  is created for the warehouse - all automatically, no manual step needed

**Red - Courier tracking sync (failing / paused):**
- The system tried 3 times to fetch tracking updates from the courier partner
- It paused after 3 failures to avoid repeatedly hitting a broken service
- Same issue shown in Needs Attention section
- Click **[Rules ->]** to open the Automation screen for technical detail

---

---

## 12. Section J - Recent Activity Feed

```
+------------------------------------------+
|  Recent activity             [Audit log]  |
+------------------------------------------+
|  [IM] Irfan M.                           |
|       Received GRN-0441 - 24 units       |
|       3 sent to QC                       |
|       10:31 - Central Warehouse          |
+------------------------------------------+
|  [SP] Sneha P.                           |
|       Published 6 products after review  |
|       10:12 - Catalog                    |
+------------------------------------------+
|  [KR] Karthik R.                         |
|       Converted WhatsApp chat to order   |
|       TXO-10486                          |
|       09:58 - Support                    |
+------------------------------------------+
|  [AR] Anita R.                           |
|       Approved transfer TR-0212          |
|       WH -> Mysuru                       |
|       09:40 - delegated authority        |
+------------------------------------------+
|  [A]  Automation                         |
|       Released 14 expired reservations   |
|       09:30 - scheduled job              |
+------------------------------------------+
```

---

### What This Section Is

A **live activity feed** of the last few significant actions taken across
the business - by staff and by automation.

This is NOT a full audit log. It shows a curated selection of notable
recent events. For the complete audit trail, click **[Audit log]**.

---

### Reading Each Entry

| Entry | What it tells you |
|---|---|
| Irfan M. received GRN-0441 | A goods delivery arrived at the warehouse. 24 units received, 3 flagged for quality check. |
| Sneha P. published 6 products | Catalog specialist approved and published 6 product listings live on the store. |
| Karthik R. converted WhatsApp to order TXO-10486 | A support staff member turned a customer chat into a confirmed sales order. |
| Anita R. approved transfer TR-0212 | Branch manager approved a stock move from warehouse to Mysuru (using your delegation). |
| Automation released 14 expired reservations | System automatically freed stock that was reserved but payment never came. |

**"Delegated authority" note:** When you see this tag on an entry, the action
was taken by someone using a delegation you set up. It is fully audited and
you receive a notification.

---

---

## 13. Section K - Top Products Table

```
+----------------------------------------------------------------------+
|  Top products - Last 30 days (net of returns)        [Sales ->]      |
+---------------+----------+-------+----------+--------+-------+-------+
| Product       | Condition| Units | Net sales| Margin | Return| Stock |
|               |          | sold  |          |  %     | rate  | avail |
+---------------+----------+-------+----------+--------+-------+-------+
| MacBook Air M2| New      | 142   | Rs.XX L  | 18.0%  | 2.1%  | 12    |
| 1TB SSD       | New      | 386   | Rs.XX L  | 14.0%  | 0.8%  | 94    |
| MacBook Pro   | New      | 61    | Rs.XX L  | 11.0%  | 1.6%  | 8     |
| LG 27" Monitor| Refurb   | 88    | Rs.XX L  | 13.0%  | 2.3%  | 31    |
| Intel i5 CPU  | New      | 74    | Rs.XX L  | 9.0%   | 0.4%  | 22    |
| HP LaserJet   | Refurb   | 57    | Rs.XX L  | 21.0%  | 3.5%  | 14    |
+---------------+----------+-------+----------+--------+-------+-------+
```

Click any row to open the full product detail in Catalog.

---

### Column by Column

| Column | What it means | What to watch for |
|---|---|---|
| **Product** | Name, photo thumbnail, and SKU code | - |
| **Condition** | New / Refurbished / Open box / Used | Check if refurb share is growing in top list |
| **Units sold** | How many units sold in the period | High units + low margin = volume play |
| **Net sales** | Revenue from this product (ex GST, ex returns) | Your revenue concentration risk |
| **Gross margin %** | Profit % after cost of goods | Below 8% is thin; above 18% is healthy |
| **Return rate %** | % of units sold that were returned | Above 3% shown in orange - investigate |
| **Stock available** | Units in stock RIGHT NOW | Zero = out of stock risk |

---

### Warning Signs

**High return rate (shown in orange/red above 3%):**
- Product quality issue
- Misleading product description
- Wrong product dispatched
- Click the product to review recent returns and customer feedback

**Low "Stock available" with high "Units sold":**
- Selling fast but about to run out
- Check Stock Health panel - is there a draft PO for this item?
- Create an urgent purchase order if needed

**Gross margin below 6%:**
- Pricing may be too low
- Check if dealer discount approvals are eating into margin
- Review if supplier cost has increased

---

---

## 14. Section L - Daily Digest

The **Daily Digest** is a summary report sent automatically to the Owner
every morning at **8:00 AM** by email AND WhatsApp. You can preview it
any time by clicking **[Preview daily digest]** in the header.

```
+----------------------------------------------------+
|  Owner daily digest - preview                  [X] |
|  Sent at 8:00 AM by email & WhatsApp               |
|  Only material items included                      |
+----------------------------------------------------+
|  Yesterday net sales  |  Orders  |  Exceptions     |
|  Rs.6.9 L             |  47      |  2 for you      |
+----------------------------------------------------+
|  [!] Needs a decision today:                       |
|  Discount override TXO-10491 (14% vs 8% limit)    |
|  Write-off Rs.42,300 at WH-BLR                    |
+----------------------------------------------------+
|  [ok] Handled by staff yesterday:                  |
|  38 dispatches, 6 returns inspected,               |
|  2 dealer orders repriced, 14 reservations freed   |
+----------------------------------------------------+
|  [i] Data connections status:                      |
|  Stock sync: 14s lag (normal)                      |
|  Settlements imported: 07:10 (normal)              |
|  Courier status: delayed (sync paused - check)     |
+----------------------------------------------------+
|  [Close]               [Edit digest settings]      |
+----------------------------------------------------+
```

---

### What Each Part of the Digest Means

**Top row - Yesterday at a glance:**
- Total net sales for yesterday
- Number of orders placed yesterday
- How many exceptions are waiting for you personally today

**[!] Needs a decision today (orange box):**
- Only things that specifically need YOUR decision
- If this is empty when you open it in the morning, you start the day clear
- This is the most important section - read it first

**[ok] Handled by staff (green box):**
- Everything your team resolved without you
- The more items here, the more effectively your team is operating
- A growing list here over time means your business is becoming self-managing

**[i] Data connections status (blue box):**
- Whether all system integrations (stock sync, payments, courier) are working
- If something is delayed here, you know before any customer complains

**[Edit digest settings] button:**
- Change the delivery time (e.g. 7:00 AM instead of 8:00 AM)
- Add or remove sections from the digest
- Add a second recipient (e.g. your business partner or accountant)

---

---

## 15. How Other Roles See the Control Centre

> Each role sees a different, automatically filtered version of the Control
> Centre. The system removes sections and data that the user is not permitted
> to see based on their role. Staff never see another role's data.

---

### 15.1 Branch Manager View

**Example:** Anita R. - Branch Manager at SP Road (BR-SPR)

```
+------------------------------------------------------------+
|  Good morning, Anita                                       |
|  SP Road Branch - Saturday, 26 September 2026             |
+------------------------------------------------------------+
|  [Today][7d][30d][90d]   [SP Road Branch - LOCKED]        |
|  (Location filter is fixed - cannot switch to other branch)|
+------------------------------------------------------------+
```

| Dashboard section | Branch Manager sees | Owner sees |
|---|---|---|
| KPI - Net sales | SP Road only: Rs.54 L | All: Rs.1.84 Cr |
| KPI - Orders | SP Road only | All locations |
| KPI - Owner touches | NOT shown | Shown |
| KPI - Stock accuracy | SP Road only | All locations |
| KPI - Gross margin | NOT shown (no cost visibility) | Shown |
| Needs Attention | SP Road exceptions only | All exceptions |
| Approvals | SP Road-level approvals only | All approvals |
| Order pipeline | SP Road orders only | All locations |
| Sales charts | SP Road sales only | Company-wide |
| Stock Health | SP Road inventory only | All locations |
| Automation panel | NOT shown | Shown |
| Recent Activity | SP Road team only | All teams |
| Top Products | SP Road top sellers only | Company-wide |
| Daily digest | Branch-level digest | Full business digest |

**Key restriction:** The Location filter is locked to BR-SPR.
Anita cannot switch to see Koramangala or Mysuru data.

---

### 15.2 Warehouse Staff View

**Example:** Kiran D. - Warehouse Staff at Central Warehouse (WH-BLR)

Warehouse staff do **NOT** land on the Control Centre dashboard.
They land directly on their **personal work queue**:

```
+------------------------------------------------------------+
|  Good morning, Kiran                                       |
|  Central Warehouse                                         |
+------------------------------------------------------------+
|  YOUR WORK QUEUE TODAY                                     |
|                                                            |
|  [23 Pick tasks waiting]         [Open pick tasks]        |
|  [5 Inbound GRNs to receive]     [Go to receiving]        |
|  [14 QC items pending]           [Inspect]                |
+------------------------------------------------------------+
```

**What Warehouse staff do NOT see:**
- Revenue, sales, or any financial figures
- Gross margin or supplier costs
- Approvals or exceptions queue
- Customer names or contact details (only order labels)
- Stock from other branches

---

### 15.3 Sales Associate / Support Executive View

**Example:** Pooja H. - Sales Associate at Koramangala Branch (BR-KRM)

Sales staff also do NOT land on the Control Centre.
They land on their **support and orders queue**:

```
+------------------------------------------------------------+
|  Good morning, Pooja                                       |
|  Koramangala Branch                                        |
+------------------------------------------------------------+
|  YOUR QUEUE                                                |
|                                                            |
|  [8 support tickets open]       [Open support inbox]      |
|  [3 assisted orders in progress][Go to orders]            |
|  [2 returns pending]            [Go to returns]           |
+------------------------------------------------------------+
```

**What Sales staff do NOT see:**
- Revenue or financial figures of any kind
- Gross margin or supplier costs
- Approvals or exceptions queue
- Stock or orders from other branches
- Automation panel or audit log

---

### 15.4 Finance View

**Example:** Deepa K. - Finance (company-wide access)

```
+------------------------------------------------------------+
|  Good morning, Deepa                                       |
|  Finance - All locations                                   |
+------------------------------------------------------------+
```

| Dashboard section | Finance sees | Owner sees |
|---|---|---|
| KPI - Net sales | All locations | All locations |
| KPI - Gross margin | Shown (Finance can see costs) | Shown |
| KPI - Owner touches | NOT shown | Shown |
| Needs Attention | Finance exceptions only (refunds, payments) | All |
| Approvals | Finance approvals only | All |
| Stock Health | NOT shown | Shown |
| Automation | NOT shown | Shown |
| Sales charts | Shown with margin data | Shown |
| Top Products | Shown with gross margin % | Shown |
| Daily digest | Finance digest (settlements, pending refunds) | Full digest |

**Key capability:** Finance is the only non-Owner role that can see
Gross Margin % and supplier cost data across the whole business.

---

### 15.5 Operations Admin View

**Example:** Vikram S. - Operations Admin (company-wide)

The Operations Admin has the closest view to the Owner.

| Dashboard section | Ops Admin sees | Owner sees |
|---|---|---|
| KPI - all tiles | All EXCEPT Owner touches and Gross margin | All 6 |
| Needs Attention | Operational exceptions (not financial) | All |
| Approvals | Operational approvals (not financial) | All |
| Sales charts | Shown | Shown |
| Gross margin | NOT shown | Shown |
| Stock Health | All locations | All locations |
| Automation | Shown | Shown |
| Recent Activity | All teams | All teams |
| Daily digest | Ops-level digest | Full business digest |
| Delegation controls | Cannot set delegations | Full control |

**Key difference:** Ops Admin handles all operations but cannot see
financial margins, cannot override financial approvals, and cannot
set up delegations.

---

### 15.6 At-a-Glance Role Comparison Table

| Data / Section | Owner | Ops Admin | Finance | Branch Mgr | Warehouse | Sales |
|---|---|---|---|---|---|---|
| Revenue (company) | Yes | Yes | Yes | Own branch | No | No |
| Gross margin % | Yes | No | Yes | No | No | No |
| Supplier costs | Yes | No | Yes | No | No | No |
| All exceptions | Yes | Ops only | Finance only | Own branch | No | No |
| All approvals | Yes | Ops only | Finance only | Own branch | No | No |
| Order pipeline | Yes | Yes | Yes | Own branch | No | No |
| Stock health | Yes | Yes | No | Own branch | Own WH | No |
| Automation panel | Yes | Yes | No | No | No | No |
| All activity feed | Yes | Yes | No | Own branch | Own WH | Own |
| Top products + margin | Yes | No margin | Yes | No margin | No | No |
| Daily digest | Full | Ops summary | Finance | Branch only | No | No |
| Set delegations | Yes | No | No | No | No | No |

---

---

## Appendix - Glossary for This Document

| Term | Plain English meaning |
|---|---|
| **GRN** | Goods Receipt Note - document confirming stock has arrived from a supplier |
| **RMA** | Return Merchandise Authorisation - reference number for a customer return |
| **PO** | Purchase Order - order sent to a supplier to buy more stock |
| **SKU** | Stock Keeping Unit - the unique code for one specific product variant |
| **Gross margin** | The profit percentage after deducting the cost of goods from the sale price |
| **Reorder point** | The stock level at which a new purchase order should be triggered automatically |
| **Quarantine** | Stock held aside for inspection - cannot be sold until cleared |
| **Transfer** | Moving stock from one location (warehouse or branch) to another |
| **Aged stock** | Stock that has been unsold for more than 90 days |
| **Delegation** | A time-limited transfer of approval authority from Owner to a named person |
| **Automation** | Rules that the system runs automatically without any human action needed |
| **Sparkline** | The small trend line graph shown below each KPI tile |
| **Exception** | A problem that escalated beyond what staff could handle within their authority |
| **SLA** | Service Level Agreement - the time limit within which something must be resolved |
| **Owner touches** | The % of all business decisions that required the Owner to personally act |
| **Margin floor** | The minimum acceptable profit percentage - discounts below this need Owner approval |
| **Draft PO** | A purchase order the system has suggested but not yet sent to the supplier |

---

*This guide covers Tradex ERP Control Centre - Version 1.4.2*
*Based on erp-dashboard.html mockup and plan/05-backend.md*
*Produced by BuildDock Team - Last updated: 30 September 2026*
