# Tradex ERP - Orders Module
### Business Walkthrough - Step by Step
### Non-Technical Edition by BuildDock Team

---

## Contents

1. [What This Module Does](#1-what-this-module-does)
2. [How to Navigate Here](#2-how-to-navigate-here)
3. [How Orders Work - The 6-Step Flow](#3-how-orders-work)
4. [Section A - KPI Strip (6 Key Numbers)](#4-section-a---kpi-strip)
5. [Section B - Filter Bar](#5-section-b---filter-bar)
6. [Section C - Order List Tabs](#6-section-c---order-list-tabs)
7. [Section D - The Order Table](#7-section-d---the-order-table)
8. [Section E - Order Detail Drawer](#8-section-e---order-detail-drawer)
9. [Section F - Place on Hold](#9-section-f---place-on-hold)
10. [Section G - Cancel Lines](#10-section-g---cancel-lines)
11. [Section H - New Assisted Order](#11-section-h---new-assisted-order)
12. [How Other Roles See Orders](#12-how-other-roles-see-orders)

---

---

## 1. What This Module Does

The **Orders** module is the central place where every customer order -
from all channels - is managed from the moment it is placed until it is
delivered or returned.

**Key principle:** An order has THREE separate status tracks:
1. **Order state** - what the order itself is doing (confirmed, on hold, cancelled)
2. **Payment state** - what the money is doing (awaiting, captured, refunded)
3. **Fulfilment state** - what the physical goods are doing (to pick, packed, dispatched)

These three tracks are always shown separately. A payment problem does NOT
automatically change the order state.

---

---

## 2. How to Navigate Here

```
Left sidebar --> SELL & SERVE --> Orders
```

The badge number on "Orders" in the sidebar shows how many orders currently
need action (urgent items only).

---

---

## 3. How Orders Work - The 6-Step Flow

At the top of the Orders page is a visual guide showing the 6 stages every
order passes through. Click any step to filter the list to orders at that stage.

```
+--------+    +--------+    +--------+    +--------+    +--------+    +--------+
|   1    | -> |   2    | -> |   3    | -> |   4    | -> |   5    | -> |   6    |
| Take   |    | Receive|    | Clear  |    | Pick & |    |Dispatch|    |Deliver |
| order  |    |payment |    | holds  |    | pack   |    |& track |    |& close |
|        |    |        |    |        |    |        |    |        |    |        |
| 47 today    | 3 await|    |2 hold  |    |5 in WH |    |4 on way|    |1 done  |
| Customer    | Customer    |1 approv|    |Warehouse    |Courier |    |        |
| Support     | Automatic   |Support |    |        |    |Support |    |        |
+--------+    +--------+    +--------+    +--------+    +--------+    +--------+
```

---

### Step 1 - Take the Order

**What happens:** Customer places an order on the website, WhatsApp, at a
branch counter, or via staff (assisted order). The system:
- Sets the price from the current active price list
- Reserves the stock for a short time (reservation window)
- Creates the order record

**Who does it:** Customer themselves, or Support staff for assisted orders.

---

### Step 2 - Receive Payment

**What happens:** The order is officially "confirmed" only when the payment
provider (Razorpay / payment gateway) confirms the money is captured.

**Important rule:** An order is NEVER confirmed just because the customer
says they paid. The system waits for the payment provider's confirmation.

**If payment does not arrive:** The stock reservation expires automatically
and the stock is released back for others to buy. The customer is notified.

**Who does it:** Customer (pays on the website/link), or Automatic (UPI/card confirmation).

---

### Step 3 - Clear Approvals & Holds

**What happens:** Some orders need a human decision before they go to the warehouse:
- Discount above staff authority
- GSTIN verification for dealer orders
- Suspected payment risk
- Stock exception

**Who does it:** Support team, Finance (for payment issues), Branch Manager.

---

### Step 4 - Pick & Pack

**What happens:** Confirmed, paid, no-holds orders are released to the warehouse.
Warehouse staff scan every item and serial number, then pack the order.

**Who does it:** Warehouse team (in Pick - Pack - Dispatch module).

---

### Step 5 - Dispatch & Track

**What happens:** The courier is booked (automatically), the label is printed,
and the parcel is handed over to the courier rider. Tracking updates
are fetched automatically from the courier.

**Important:** Tracking status changes ONLY the Fulfilment state.
It does NOT change the Order state or Payment state.

**Who does it:** Dispatch desk (warehouse), Courier.

---

### Step 6 - Deliver & Close

**What happens:** The courier delivers the parcel. The customer receives the goods.
The order is marked as Delivered. If the customer later wants to return, it
goes to the Returns & Warranty module.

**Cancellations:** Orders with lines not yet dispatched can be cancelled by
Support. Shipped items come back as a Return, not a cancellation.

---

---

## 4. Section A - KPI Strip

Six live numbers at the top of the Orders page:

```
+----------+----------+----------+----------+----------+----------+
|    47    |    12    |     7    |     2    |  5.8 h   |     2    |
| Orders   | Awaiting | Needs    | Overdue  | Paid to  | Cancel   |
| today    | payment  | action   | dispatch | dispatch | requests |
|          |          |          |          |          |          |
| +9% vs   | Rs.3.42L | Oldest   | -3 vs    | -1.4 h   |Rs.39,960 |
| last Sat | reserved | 26h      | last wk  |          | SLA 4 h  |
+----------+----------+----------+----------+----------+----------+
```

| Tile | What it means | Warning sign |
|---|---|---|
| **Orders today** | Total new orders placed today | Down vs same day last week |
| **Awaiting payment** | Orders placed but payment not yet confirmed. Value shows Rs. at risk | More than 20 is unusual |
| **Needs action** | Orders stopped due to a problem needing a human decision | Any red number needs immediate attention |
| **Overdue dispatch** | Orders confirmed 24+ hours ago but not yet dispatched | Even 1 overdue order needs investigation |
| **Paid to dispatched** | Average time from payment to courier handover | Above 8 hours is a concern |
| **Cancel requests** | Customers who have asked to cancel | SLA 4 hours - resolve quickly |

---

---

## 5. Section B - Filter Bar

```
+--------------------------------------------------------------+
|  [Search: Order no., customer, serial...]                    |
|  [Date range v]  [All locations v]  [All channels v]        |
|  [All buyers v]  [Any payment state v]         [Reset X]    |
+--------------------------------------------------------------+
```

| Filter | Options |
|---|---|
| **Search** | Type an order number (TXO-xxxxx), customer name, phone, or serial number |
| **Date range** | Today / Last 7 days / Last 30 days / This financial year / Custom range |
| **Location** | All locations / Central Warehouse / SP Road / Koramangala / Mysuru |
| **Channel** | All / Web / Branch POS / WhatsApp / Assisted (staff) |
| **Buyer type** | All / Consumer (B2C) / Approved dealer (B2B) |
| **Payment state** | All / Not started / Pending / Failed / Captured / COD / Refunded |
| **[Reset]** | Clears all filters and returns to default view |

> [!NOTE]
> **Tip:** To find a specific order quickly, type the order number in the
> Search box. The system searches across order numbers, customer names,
> mobile numbers, and serial numbers simultaneously.

---

---

## 6. Section C - Order List Tabs

Six tabs act as saved work queues. Each tab filters the order list to a
specific group.

```
+----------+----------+----------+----------+----------+----------+
| All      | Needs    | Awaiting | On hold  | Partially| Cancel   |
| orders   | action   | payment  |          | fulfilled| requests |
| 148      | 7 [red]  | 12       | 3        | 4        | 2        |
+----------+----------+----------+----------+----------+----------+
```

---

### Tab 1 - All Orders (148)

Shows every order from every channel in one list.
Default view when you open the Orders screen.

**Useful for:** Searching for a specific order, reviewing overall order volume,
exporting data.

---

### Tab 2 - Needs Action (7) [red]

> [!IMPORTANT]
> **Start here every morning.** These are orders that are STOPPED and cannot
> move forward until someone makes a decision.

Includes orders with:
- A discount approval request from a customer or staff
- A GSTIN or address verification needed for a dealer order
- A payment mismatch flagged by the system
- A stock exception (item no longer available)
- Oldest open item: 26 hours (escalation risk)

**What to do:** Click each order, read the "Next step" box, and take the action shown.

---

### Tab 3 - Awaiting Payment (12)

Orders where the customer has placed the order but payment has NOT been confirmed.
These have live stock reservations (Rs.3.42 lakh worth of stock is temporarily reserved).

**What to do:** Usually nothing - just monitor. If an order has been awaiting
payment for more than 30 minutes, the reservation expires and stock is released automatically.
You can optionally click **[Send payment reminder]** to nudge the customer.

---

### Tab 4 - On Hold (3)

Orders that have been deliberately paused by staff or the system.
Cannot be released to the warehouse until the hold is lifted.

**Common reasons an order is put on hold:**
- Customer request (wants to change address or item)
- Address or GSTIN verification needed
- Payment review (suspicious transaction)
- Stock problem at the reserved location

**What to do:** Click the order, review the hold reason and note, resolve the
issue, then click **[Release hold]** to send it to the warehouse queue.

---

### Tab 5 - Partially Fulfilled (4)

Orders where some lines have been dispatched but others have not.
Example: A customer ordered a laptop + printer. Laptop dispatched, printer
still waiting for stock.

**What to do:** Monitor until all lines are fulfilled. If one line cannot be
fulfilled, escalate to Support to contact the customer about partial fulfilment options.

---

### Tab 6 - Cancellation Requests (2)

Customers or staff have requested a cancellation on these orders.
Rs.39,960 is at stake (value of items to be cancelled).
SLA: resolve within 4 hours.

**What to do:**
- Lines NOT yet dispatched: can be cancelled. System calculates the refund automatically.
- Lines already dispatched: CANNOT be cancelled. Customer must raise a return instead.

Click the order, select which lines to cancel, choose a reason, and confirm.

---

---

## 7. Section D - The Order Table

Each row in the order table shows one order with these columns:

```
+----+------------------+------------------+----------+-----+--------+
| [] | Order            | Buyer            | Channel  | Loc | Value  |
|    | TXO-10486        | Karthik R.       | WhatsApp | BLR |Rs.84,990|
|    | 26 Sep · 09:58   | Retail consumer  |          |     |        |
+----+------------------+------------------+----------+-----+--------+
     | Order state      | Payment          | Fulfilment       | SLA  |
     | CONFIRMED        | CAPTURED         | PICKING          | ok   |
+----+------------------+------------------+------------------+------+
```

---

### Column Explanations

| Column | What it shows |
|---|---|
| **Checkbox** | Select multiple orders for bulk actions |
| **Order** | Order ID (TXO-xxxxx), date and time placed, any notes or flags |
| **Buyer** | Customer name and type (Retail consumer / Approved dealer) |
| **Channel** | Where the order came from (Web / Branch POS / WhatsApp / Assisted) |
| **Loc** | Which branch or warehouse is fulfilling this order |
| **Value** | Order total (ex GST) |
| **Order state** | Current status of the order itself |
| **Payment** | Current payment status |
| **Fulfilment** | Current warehouse/courier status |
| **SLA flag / Age** | How long the order has been open + SLA status (ok / warn / overdue) |

---

### The Three State Columns - Quick Reference

**Order states:**
- DRAFT - Assisted order being built, not yet submitted
- AWAITING PAYMENT - Placed, payment not yet confirmed
- CONFIRMED - Paid and ready to fulfil
- ON HOLD - Stopped, needs human decision
- PARTIALLY FULFILLED - Some lines sent, some waiting
- CANCELLED - All or some lines cancelled
- COMPLETED - All lines delivered

**Payment states:**
- NOT STARTED - Customer has not attempted payment yet
- PENDING - Payment in progress at gateway
- CAPTURED - Money successfully received
- FAILED - Payment attempt failed
- COD - Cash on delivery, payment due on delivery
- REFUNDED - Money returned to customer

**Fulfilment states:**
- RESERVED - Stock held, not yet picked
- PICKING - Warehouse is picking this order now
- PACKED - Picked and packed, awaiting courier booking
- DISPATCHED - With the courier
- DELIVERED - Customer received the parcel
- DELIVERY EXCEPTION - Courier reported a problem
- RETURNED TO ORIGIN - Courier returned the parcel

---

### Bulk Actions (Select Multiple Orders)

Check the boxes on multiple orders to do bulk actions:

```
[3 selected]
[Release to fulfilment] [Print pick lists] [Assign...] [Place on hold] [Send reminder] [Export]
```

| Action | What it does |
|---|---|
| **Release to fulfilment** | Sends paid + reserved orders to the warehouse pick queue |
| **Print pick lists** | Prints combined pick lists for selected orders |
| **Assign** | Assigns orders to a specific warehouse staff member |
| **Place on hold** | Puts all selected orders on hold (requires a reason) |
| **Send payment reminder** | Sends a reminder message to customers who have not paid |
| **Export** | Downloads selected orders as a CSV file |

---

---

## 8. Section E - Order Detail Drawer

Click any row in the order table to open the **Order Detail Drawer** on the right side.

```
+-----------------------------------------------------+
|  TXO-10486 · Retail consumer · WhatsApp  [X Close]  |
|                                                      |
|  +----------+  +----------+  +----------+           |
|  | ORDER    |  | PAYMENT  |  |FULFILMENT|           |
|  |CONFIRMED |  | CAPTURED |  | PICKING  |           |
|  +----------+  +----------+  +----------+           |
|                                                      |
|  [!] Next step: Order is in the warehouse queue.    |
|  No action needed - wait for fulfilment to complete |
|                                                      |
|  [ Lines & pricing ] [ Payments 2 ] [ Shipments ]  |
|  [ Timeline & audit ]  [ Internal notes 2 ]         |
+-----------------------------------------------------+
```

The top of the drawer always shows:
- The order ID and badges (buyer type, source channel)
- The 3 state boxes (Order / Payment / Fulfilment) updated live
- An alert box if there is something wrong
- The **"Next step"** box telling you exactly what to do

---

### Drawer Tab 1 - Lines & Pricing

Shows every product in the order with quantities, unit prices, and totals.

```
+--------------------------------------------------+
|  Lines & pricing                                 |
|  Product            | Qty | Unit price | Total  |
|  MacBook Air M2     |  1  | Rs.84,990  | Rs.84,990|
|  Serial: U-000806   |     |            |        |
|  Apple Care 1yr     |  1  | Rs.4,999   | Rs.4,999 |
|                                                  |
|  Subtotal (ex GST)          Rs.89,989            |
|  GST (18%)                  Rs.16,198            |
|  TOTAL                      Rs.1,06,187          |
|  Dealer discount (8%)       - Rs.7,199           |
|  AMOUNT PAID                Rs.98,988            |
+--------------------------------------------------+
```

**What you can see:**
- Each product line with SKU, serial number (if assigned), and price
- All applied discounts with the reason and who approved them
- GST breakdown
- Final amount paid

---

### Drawer Tab 2 - Payments (2)

Shows the full payment history for this order.

```
+--------------------------------------------------+
|  Payments                                        |
|  Attempt 1 · Razorpay                           |
|  FAILED · 10:01 AM · Card - HDFC                |
|  Reason: Bank declined (insufficient funds)      |
|                                                  |
|  Attempt 2 · Razorpay                           |
|  CAPTURED · 10:04 AM · UPI - Google Pay          |
|  Amount: Rs.98,988 · Ref: pay_Nx8Qxxx           |
|  Settlement expected: 28 Sep                     |
+--------------------------------------------------+
```

The number badge on the tab (e.g. "2") shows how many payment attempts were made.
Each attempt is listed with the result, method, and reference number.

---

### Drawer Tab 3 - Shipments

Shows all physical shipments for this order (one order can have multiple shipments
if items are dispatched in parts).

```
+--------------------------------------------------+
|  Shipments                                       |
|  Shipment 1 of 1 · Delhivery                    |
|  AWB: 1106XXXXXXXXX                              |
|  Status: Out for delivery · Last update: 09:45  |
|                                                  |
|  Items in this shipment:                         |
|  MacBook Air M2 · Serial U-000806               |
|  Apple Care 1yr box                              |
|                                                  |
|  Estimated delivery: Today by 18:00             |
|  [Track shipment] [Copy AWB]                    |
+--------------------------------------------------+
```

---

### Drawer Tab 4 - Timeline & Audit

A complete, uneditable history of everything that happened to this order.

```
+--------------------------------------------------+
|  Timeline & audit                                |
|  09:58 · Customer placed order via WhatsApp     |
|  09:58 · Stock reserved (R-5589 · 30 min)       |
|  10:04 · Payment captured (pay_Nx8Qxxx)         |
|  10:04 · Reservation confirmed (R-5589)         |
|  10:05 · Released to fulfilment queue (auto)    |
|  10:31 · Wave W-26-07 created (Irfan M.)        |
|  10:33 · Bin R-12 scanned (ok)                  |
|  10:35 · Serial U-000806 verified (ok)          |
+--------------------------------------------------+
```

Every event is logged with the exact time and who or what caused it.
This log **cannot be edited** and is the official audit trail.

---

### Drawer Tab 5 - Internal Notes

Staff can add private notes to an order that are visible to staff only.
Customers NEVER see these notes.

```
+--------------------------------------------------+
|  Internal notes                                  |
|  Karthik R. · Support · 26 Sep 10:21            |
|  Customer asked on WhatsApp to drop the 2 mice- |
|  found stock locally. Raised cancellation for   |
|  line 3. Remaining lines unchanged.              |
|                                                  |
|  Irfan M. · Warehouse · 26 Sep 10:34            |
|  SSDs picked from A-03. Laptop U-000806 picked  |
|  from R-12. Holding mice at pack bench until    |
|  cancel decision.                               |
|                                                  |
|  Add internal note:                              |
|  [@mention to notify a team member]              |
|                         [Add note]              |
+--------------------------------------------------+
```

Use notes to communicate across teams about a specific order.
All notes are permanently stored in the audit trail.

---

### Drawer Footer - Actions

At the bottom of the drawer, action buttons let you take the next step:

```
[Place on hold]   [Cancel lines...]   [Resend notification v]   [Add note]

                          [View invoice]   [Open in fulfilment ->]
```

| Button | What it does |
|---|---|
| **Place on hold** | Pause this order (opens the Hold form - Section F) |
| **Cancel lines** | Cancel one or more lines not yet dispatched (Section G) |
| **Resend notification** | Resend an email / WhatsApp / SMS to the customer (options in dropdown) |
| **Add note** | Quick-add an internal note (jumps to the Notes tab) |
| **View invoice** | Opens the GST tax invoice for this order (generated once, never changes) |
| **Open in fulfilment** | Jumps to this order in the Pick-Pack-Dispatch screen |

---

---

## 9. Section F - Place on Hold

When you click **[Place on hold]**, a form appears:

```
+--------------------------------------------------+
|  Place order on hold                   [X]       |
|  Stops release to fulfilment                     |
|  Payment and reservations are kept active        |
|                                                  |
|  Reason *                                        |
|  [ Customer request - confirm details       v ]  |
|    Other options:                                |
|    Address / GSTIN verification                  |
|    Payment review (mismatch or risk)             |
|    Stock exception                               |
|    Awaiting approval                             |
|                                                  |
|  Review by                  Owner               |
|  [ 26 Sep 14:00    ]        [ Karthik R.   v ]  |
|                                                  |
|  Note (internal) *                               |
|  [What must happen before release?          ]    |
|                                                  |
|  [ ] Notify customer (order is under review)    |
|                                                  |
|  [!] Reservation extended while on hold (max 48h)|
|      If hold exceeds review time, escalates to  |
|      the operations manager automatically.       |
|                                                  |
|                    [Cancel]  [Place on hold]     |
+--------------------------------------------------+
```

| Field | What to fill |
|---|---|
| **Reason** | Select the closest reason from the list |
| **Review by** | Set a date and time by which this hold must be resolved |
| **Owner** | Assign the hold to the person responsible for resolving it |
| **Note** | Write what needs to happen before the order can be released |
| **Notify customer** | Check this to send the customer an "under review" message |

> [!IMPORTANT]
> The stock reservation is extended while on hold (maximum 48 hours policy).
> If the hold is not resolved by the review time, it automatically escalates
> to the Operations Manager.

---

---

## 10. Section G - Cancel Lines

When you click **[Cancel lines...]**, a form shows all lines in the order:

```
+--------------------------------------------------+
|  Cancel lines - TXO-10486              [X]       |
|  Only lines not yet dispatched are eligible      |
|  Refund uses the original allocated price        |
|                                                  |
|  [X] Logitech MX Keys (2 units) - Rs.7,998     |
|      Can cancel - not yet picked                 |
|                                                  |
|  [ ] MacBook Air M2 - Rs.84,990                 |
|      Cannot cancel - already picked (U-000806)   |
|                                                  |
|  [ ] Apple Care 1yr - Rs.4,999                  |
|      Cannot cancel - cannot separate from laptop |
|                                                  |
|  Cancellation reason *                           |
|  [ Customer request (before dispatch)       v ]  |
|    Other: Out of stock / Pricing error / Fraud   |
|                                                  |
|  Refund amount: Rs.7,998                         |
|  Refund to: UPI - Google Pay (original method)   |
|                                                  |
|                    [Cancel]  [Cancel lines]      |
+--------------------------------------------------+
```

> [!IMPORTANT]
> - Only lines NOT yet dispatched can be cancelled
> - Lines already picked or dispatched CANNOT be cancelled - they must come back as returns
> - The refund is calculated automatically at the original purchase price
> - The refund is returned to the customer's original payment method

---

---

## 11. Section H - New Assisted Order

For customers who order by phone, WhatsApp or walk-in, staff create an
**Assisted Order** on their behalf.

**How to open:** Click **[+ New assisted order]** button in the top-right corner.

```
+------------------------------------------------------------------+
|  New assisted order                                       [X]    |
|  Creating an order on behalf of a customer                       |
|  Placed by: Pooja H. · BR-KRM                                    |
+------------------------------------------------------------------+
|  Customer search                 |  Order summary               |
|  [ Search name, phone, email ]   |                              |
|  Or: [ + New customer ]          |  Customer: Ramesh Kumar      |
|                                  |  Phone: +91 9876543210       |
|  Product search                  |  Type: Retail consumer       |
|  [ Search SKU, name, serial ]    |                              |
|                                  |  Items:                      |
|  +------+------------------+--+  |  MacBook Air M2    Rs.84,990|
|  | [img]| MacBook Air M2   |+Add| |  x 1                        |
|  |      | SKU: LAP01-RA    |    |  |                              |
|  |      | Rs.84,990  Avail:4    |  Subtotal:        Rs.84,990   |
|  +------+------------------+--+  |  GST (18%):       Rs.15,298 |
|                                  |  TOTAL:           Rs.1,00,288|
|  Discount (optional)             |                              |
|  [ 0  ]%   [Reason for discount] |  [o] Payment link (WhatsApp)|
|  Your limit: 5%                  |  ( ) Pay at counter (cash)  |
|  Needs approval above 5%         |  ( ) COD                    |
|                                  |  ( ) Bank transfer          |
|                                  |                              |
|                                  |  [Place order & send link]  |
+------------------------------------------------------------------+
```

### Assisted Order Step by Step

**Step 1 - Find or create the customer:**
- Search by name, mobile, or email
- If customer is new, click [+ New customer] to add them first

**Step 2 - Search for products:**
- Search by product name, SKU, or serial number
- See live stock availability and price
- Click [+Add] to add items to the cart

**Step 3 - Apply a discount (if needed):**
- Enter a % discount and mandatory reason
- Your personal discount limit is shown (e.g. "5% - needs approval above 5%")
- If you enter more than your limit, the order is flagged for approval

**Step 4 - Choose payment method:**
- Payment link via WhatsApp (most common for phone/WhatsApp orders)
- Pay at counter (for walk-in customers)
- COD - Cash on delivery
- Bank transfer (for large orders)

**Step 5 - Place the order:**
Click [Place order & send link]. The customer receives a WhatsApp message
with a payment link. Once they pay, the order automatically moves to fulfilment.

---

---

## 12. How Other Roles See Orders

---

### Owner and Operations Admin

See ALL orders from ALL locations and channels.
Full access to all tabs, actions, and order details including costs and margins.
Can approve discount overrides directly from the order.

---

### Finance

Sees ALL orders from ALL locations.
Focus is on the **Payments tab** in each order.
Can process refunds and view settlement details.
Cannot cancel lines or place holds (those are operational decisions).

---

### Branch Manager

**Sees:** Only orders from their assigned branch (e.g. BR-SPR - SP Road only).
**Cannot see:** Orders from other branches.
**Can do:** All actions on their branch's orders - place holds, cancel lines,
create assisted orders for their branch.
**Cannot do:** Approve discounts above their authority limit.

---

### Sales Associate / Support Executive

**Sees:** Only orders from their assigned branch.
**Can do:**
- View order details
- Create assisted orders (up to their discount limit)
- Add internal notes
- Resend notifications to customers
- Place orders on hold
- Cancel lines not yet dispatched

**Cannot see:**
- Supplier costs or gross margin
- Orders from other branches
- Financial payment details beyond basic status

---

### Warehouse Staff

**Sees:** Only orders at their location in the Pick-Pack-Dispatch module
(NOT in the Orders module directly).
The Orders module is not their primary workspace.

**In the Orders module (limited view):**
- Can view order details for orders assigned to their location
- Cannot take any order management actions
- Cannot view pricing or payment details

---

### Role Comparison Table

| Feature | Owner | Ops Admin | Finance | Branch Mgr | Support | Warehouse |
|---|---|---|---|---|---|---|
| See all locations' orders | Yes | Yes | Yes | Own only | Own only | Own only |
| View payment details | Yes | Yes | Yes | Basic | Basic | No |
| View gross margin | Yes | No | Yes | No | No | No |
| Create assisted order | Yes | Yes | No | Yes | Yes | No |
| Place on hold | Yes | Yes | No | Yes | Yes | No |
| Cancel lines | Yes | Yes | No | Yes | Yes | No |
| Approve discount overrides | Yes | Limited | No | No | No | No |
| View invoice | Yes | Yes | Yes | Yes | Yes | No |
| Resend notifications | Yes | Yes | No | Yes | Yes | No |
| Export orders | Yes | Yes | Yes | Yes (branch) | No | No |

---

## Appendix - Order Module Glossary

| Term | Plain English meaning |
|---|---|
| **Assisted order** | An order created by a staff member on a customer's behalf (phone/walk-in/WhatsApp) |
| **Reservation** | Stock temporarily held for a customer while they pay - expires if unpaid |
| **Hold** | A deliberate pause on an order - nothing moves until the hold is lifted |
| **SLA** | Service Level Agreement - the time limit for resolving an issue (e.g. cancel requests: 4 hours) |
| **AWB** | Air Waybill - the courier's tracking number for a shipment |
| **RTO** | Return to Origin - when a courier fails to deliver and sends the parcel back |
| **COD** | Cash on Delivery - customer pays in cash when the parcel arrives |
| **Margin floor** | The minimum acceptable profit percentage - discounts below this need Owner approval |
| **Wave** | A batch of orders grouped together for a picker to collect in one efficient trip |
| **Partially fulfilled** | An order where some items are dispatched and others are still being processed |

---

*This guide covers Tradex ERP Orders Module - Version 1.4.2*
*Based on erp-orders.html mockup*
*Produced by BuildDock Team - Last updated: 30 September 2026*
