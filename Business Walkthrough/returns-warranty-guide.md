# Tradex ERP - Returns & Warranty Module
### Business Walkthrough - Step by Step
### Non-Technical Edition by BuildDock Team

---

## Contents

1. [What This Module Does](#1-what-this-module-does)
2. [How to Navigate Here](#2-how-to-navigate-here)
3. [The Returns Flow - Step by Step](#3-the-returns-flow)
4. [Tab 1 - Return Requests](#4-tab-1---return-requests)
5. [Tab 2 - Quarantine (Inspection)](#5-tab-2---quarantine)
6. [Tab 3 - Warranty Claims](#6-tab-3---warranty-claims)
7. [Tab 4 - Vendor Returns (RTV)](#7-tab-4---vendor-returns)
8. [How Other Roles See Returns](#8-how-other-roles-see-returns)

---

## 1. What This Module Does

The **Returns & Warranty** module manages everything that comes back to you:
- Customer returns (changed mind, defective, wrong item)
- Warranty claims (product failed within warranty period)
- RTO (Return to Origin - courier could not deliver and sent it back)
- Vendor returns (sending defective stock back to suppliers)

**Key principle:** A return does NOT automatically create a refund.
Inspection happens first. The refund (or replacement) is decided AFTER inspection.

---

## 2. How to Navigate Here

```
Left sidebar --> SELL & SERVE --> Returns & warranty
```

The badge number shows how many active return requests need attention.

---

## 3. The Returns Flow

```
+----------+   +----------+   +----------+   +----------+   +----------+
|    1     |-> |    2     |-> |    3     |-> |    4     |-> |    5     |
| Request  |   | Approve  |   | Receive  |   | Inspect  |   | Resolve  |
| raised   |   | return   |   | item back|   | & grade  |   |refund/   |
|          |   |          |   |          |   |          |   |replace   |
| Customer |   | Support  |   | Warehouse|   | Inspector|   | Finance  |
| or staff |   | Manager  |   |          |   |          |   | Support  |
+----------+   +----------+   +----------+   +----------+   +----------+
```

### Step 1 - Return Request Raised
Customer contacts support (WhatsApp, email, or calls). Support staff raise a
Return Request (RMA) in the system. OR the customer raises it themselves via
the online portal.

### Step 2 - Approve the Return
Support or Branch Manager reviews the request:
- Is the item within the return window? (varies by condition: New 7 days, Refurb 3 days)
- Is the reason valid?
- Is the item eligible for return (some items like activated software are non-returnable)?

If approved: a Return Authorisation number (RMA-XXXX) is generated.
If rejected: customer is notified with the reason.

### Step 3 - Receive the Item
- For courier returns: the warehouse receives the parcel and scans the RMA barcode.
- For walk-in returns at branch: staff at the counter receive and scan the item.
- RTO parcels (courier returned) arrive automatically from the courier.

### Step 4 - Inspect & Grade
Warehouse inspector checks the returned item:
- Does it match what was ordered? (correct serial, correct model)
- What is the condition? (matches customer's claim? any damage not mentioned?)
- Are all accessories and packaging present?

### Step 5 - Resolve (Refund / Replace / Reject)
Based on inspection:
- **Full refund:** Item is in good condition, matches description
- **Partial refund:** Item is damaged beyond reported condition, or accessories missing
- **Replacement:** Customer prefers a new unit instead of refund
- **Rejected:** Item does not match (e.g. customer returned a different product)

---

## 4. Tab 1 - Return Requests

```
+-------------------------------------------------------+
|  Return requests             [+ New return request]   |
|  Active: 18 - Oldest: 2 days                         |
|                                                       |
|  [All] [Pending approval] [Approved] [Received]      |
|                                                       |
|  RMA-0093 - Sony WH-1000XM4 - Rs.19,990             |
|  TXO-10421 - Deepa Kumar - 24 Sep - 2 days old       |
|  Reason: Defective (audio cuts out)                  |
|  Status: APPROVED - item not yet received            |
|  [Track return] [Receive item] [View original order]  |
|                                                       |
|  RMA-0092 - Dell Monitor P2422H - Rs.18,400         |
|  TXO-10398 - Arjun S. - 23 Sep                      |
|  Reason: Wrong item received                         |
|  Status: RECEIVED - awaiting inspection              |
|  [Open in quarantine]                                |
+-------------------------------------------------------+
```

### Creating a New Return Request

Click **[+ New return request]**:

```
+--------------------------------------------------+
|  New return request                    [X]       |
|                                                  |
|  Order reference *                               |
|  [ TXO-10421              ]  [Find order]        |
|                                                  |
|  Items to return *                               |
|  [x] Sony WH-1000XM4 - Serial SN-XXXXXXXXXXX   |
|  [ ] Carrying case - Rs.999                     |
|                                                  |
|  Return reason *                                 |
|  [ Defective - product not working         v ]   |
|    Other: Wrong item / Changed mind /            |
|    Physical damage on arrival / Missing parts    |
|                                                  |
|  Customer description *                          |
|  [Audio cuts out after 30 minutes of use.    ]   |
|                                                  |
|  Return window                                   |
|  New item: 7 days (purchased 20 Sep - 4 left)   |
|                                                  |
|  Return method                                   |
|  (o) Customer ships to us (courier pickup)       |
|  ( ) Customer walks into branch                  |
|  ( ) Our courier collects from customer          |
|                                                  |
|  Refund preference                               |
|  (o) Original payment method                    |
|  ( ) Store credit                                |
|                                                  |
|             [Cancel]  [Approve & generate RMA]   |
+--------------------------------------------------+
```

### Return Window Policy

| Product condition | Return window |
|---|---|
| New | 7 days from delivery |
| Refurbished | 3 days from delivery |
| Open box | 3 days from delivery |
| Used | Not eligible for return (unless defective) |

---

## 5. Tab 2 - Quarantine (Inspection)

When a returned item arrives at the warehouse, it goes into **Quarantine**
until inspected. Quarantined items CANNOT be sold.

```
+--------------------------------------------------+
|  Quarantine - items awaiting inspection (23)     |
|                                                  |
|  RMA-0093 - SONY WH-1000XM4 - received 10:42   |
|  Customer claim: audio cuts out (defective)      |
|  Assigned to: Irfan M.                          |
|                                                  |
|  Inspection form:                                |
|  [x] Correct item (serial matches: SN-XXXXX)    |
|  [ ] Accessories present: (missing: carry case) |
|  [ ] Original packaging: present / missing       |
|                                                  |
|  Condition grade:                                |
|  (o) As described by customer                   |
|  ( ) Better than described                       |
|  ( ) Worse than described (add note)            |
|                                                  |
|  Functional test result:                         |
|  ( ) Fully working                               |
|  (o) Defect confirmed (matches customer claim)   |
|  ( ) Different defect found                     |
|  ( ) No defect found (could not replicate)      |
|                                                  |
|  Photos: [Upload 1] [Upload 2] [Upload 3]        |
|                                                  |
|  Inspector note:                                 |
|  [ Audio tested for 1 hour. Cuts out at 35 min ]|
|                                                  |
|  Outcome recommendation:                         |
|  (o) Full refund (defect confirmed, item OK)    |
|  ( ) Partial refund                             |
|  ( ) Replacement                                |
|  ( ) Reject return (item not as described)       |
|                                                  |
|  Refund amount: Rs.19,990                        |
|                                                  |
|             [Save draft]  [Submit inspection]    |
+--------------------------------------------------+
```

### After Inspection

Based on the inspection outcome:

| Outcome | What happens |
|---|---|
| **Full refund** | Finance is notified to process Rs.19,990 refund to original payment method |
| **Partial refund** | Finance is notified of the adjusted amount, reason is logged |
| **Replacement** | A new order is created for the replacement unit (no charge to customer) |
| **Reject return** | Customer is notified with photographic evidence. Item is returned to customer. |

The inspection report (photos + notes + decision) is permanently attached
to the RMA record and the original order. It cannot be edited after submission.

---

## 6. Tab 3 - Warranty Claims

```
+--------------------------------------------------+
|  Warranty claims (active: 7)                     |
|                                                  |
|  WC-0041 - Apple MacBook Air M2                 |
|  Serial: U-000806 - Purchased: 26 Aug 2026       |
|  Warranty: 1 year Apple (expires 26 Aug 2027)   |
|  Issue: Keyboard not responding on right side    |
|  Status: Sent to authorised service centre       |
|  [Track repair] [Contact service centre]        |
|                                                  |
|  WC-0039 - LG 27UL550 Monitor                  |
|  Serial: MON-00234 - Purchased: 12 Jul 2026      |
|  Warranty: 3 year LG (expires 12 Jul 2029)      |
|  Issue: Dead pixel cluster (top-right corner)   |
|  Status: REPLACEMENT APPROVED by LG             |
|  [Create replacement dispatch]                   |
+--------------------------------------------------+
```

### Warranty Claim Process

1. Customer reports issue within warranty period
2. Support team logs a Warranty Claim (WC-XXXX)
3. System checks the serial number against purchase date and warranty terms
4. Depending on the brand's policy:
   - Send to authorised service centre (most electronics)
   - Brand sends replacement directly
   - Tradex replaces from stock (if covered under Tradex warranty)

---

## 7. Tab 4 - Vendor Returns (RTV)

RTV = Return to Vendor. Items that need to go back to the supplier.

```
+--------------------------------------------------+
|  Vendor returns - RTV (active: 4)                |
|                                                  |
|  RTV-0021 - NetCore Solutions                   |
|  8 x LG 27UL550 (water damaged at WH-BLR)       |
|  Value: Rs.1,12,800 - Awaiting vendor approval  |
|  Debit note issued: DN-2026-0041                |
|  [Follow up with vendor] [View debit note]       |
|                                                  |
|  RTV-0019 - Prime IT                            |
|  3 x ASUS ROG (DOA - Dead on Arrival)           |
|  Value: Rs.89,970 - Vendor approved return       |
|  Courier booked: DHL pickup 2 Oct               |
|  [Track return shipment]                         |
+--------------------------------------------------+
```

A Debit Note is automatically generated when an RTV is approved.
This reduces the amount owed to the vendor on the next payment.

---

## 8. How Other Roles See Returns

| Feature | Owner | Ops Admin | Finance | Branch Mgr | Support | Warehouse |
|---|---|---|---|---|---|---|
| See all return requests | Yes | Yes | Yes | Own branch | Own branch | Own WH |
| Approve return requests | Yes | Yes | No | Yes (own) | Yes (limited) | No |
| Perform inspection | No | No | No | No | No | Yes |
| Process refund | Yes | No | Yes | No | No | No |
| Create warranty claims | Yes | Yes | No | Yes | Yes | No |
| Create vendor returns | Yes | Yes | No | No | No | No |
| View inspection photos | Yes | Yes | Yes | Yes | Yes | Yes |

---

*This guide covers Tradex ERP Returns & Warranty Module - Version 1.4.2*
*Based on erp-returns.html mockup*
*Produced by BuildDock Team - Last updated: 30 September 2026*
