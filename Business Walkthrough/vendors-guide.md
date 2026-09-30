# Tradex ERP - Vendors Module
### Business Walkthrough | BuildDock Team

---

## 1. What This Module Does
Manages all supplier/vendor relationships: who supplies your products,
their pricing and availability feeds, their performance, and the marketplace
programme (vendors selling through Tradex).

## 2. Navigation
```
Left sidebar --> PARTNERS --> Vendors
```

## 3. Tab 1 - Vendor List

```
+--------------------------------------------------+
|  Vendors (active: 24)         [+ Invite vendor]  |
|  [Search vendor name, GSTIN...]                  |
|                                                  |
|  Prime IT Solutions                             |
|  Bangalore - GSTIN: 29XXXXX                    |
|  Products: 847 SKUs - Status: ACTIVE            |
|  Feed: Fresh (updated 09:15 today)             |
|  Payment terms: Net 30                          |
|  [View vendor]                                   |
|                                                  |
|  NetCore Solutions                              |
|  Status: ACTIVE - Feed: STALE (26h) [!]        |
|  Auto-rule: switched to "confirm before promise" |
|  [Contact vendor] [View details]                |
+--------------------------------------------------+
```

### Vendor Detail Page

```
+--------------------------------------------------+
|  Prime IT Solutions                             |
|  Vendor since: Jan 2025                         |
|  Contact: Suresh M. - suresh@primeit.in         |
|                                                  |
|  Products: 847 - Active: 820 - Paused: 27      |
|  Pending submissions: 14                        |
|                                                  |
|  Performance (last 30 days):                   |
|  On-time delivery: 97.2%                        |
|  Order fill rate: 99.1%                         |
|  Return rate: 1.4%                              |
|  Dispute resolution: 2.1 days avg              |
|                                                  |
|  Payment: Rs.4,20,000 pending - Net 30         |
|                                                  |
|  [Purchase orders] [Bills] [Submissions]        |
+--------------------------------------------------+
```

## 4. Tab 2 - Vendor Applications (Marketplace)

```
+--------------------------------------------------+
|  Marketplace vendor applications (2 pending)    |
|                                                  |
|  Digital Hub Traders                            |
|  Applied: 25 Sep - Phase 2 pilot               |
|  Products: Electronics accessories              |
|  Docs verified by: Vikram S.                   |
|                                                  |
|  Review policy:                                |
|  1. Verify GSTIN and business registration     |
|  2. Check product category fit                 |
|  3. Review terms version acceptance            |
|  4. Assign categories and locations            |
|                                                  |
|  [Reject]           [Approve as marketplace vendor]|
+--------------------------------------------------+
```

## 5. Tab 3 - Vendor Submissions (New/Updated Products)

When a vendor uploads new products or edits existing ones via their portal,
it appears here for review:

```
+--------------------------------------------------+
|  Vendor submissions (pending: 8)                |
|                                                  |
|  SUB-0234 - RenewTech - Sensitive edit         |
|  4 SKUs: warranty change 6m -> 3m              |
|  [!] Flagged: warranty reduction               |
|  [View diff] [Approve] [Reject]                 |
|                                                  |
|  SUB-0233 - Prime IT - New products (6)        |
|  Standard submission - no sensitive changes     |
|  [Review 6 products]                            |
+--------------------------------------------------+
```

Sensitive edits (warranty changes, price reductions above threshold,
condition changes) are automatically flagged and require Owner approval.

## 6. Tab 4 - Feed Freshness

Vendor availability feeds (how much stock they say they have) are checked here:

```
+--------------------------------------------------+
|  Feed freshness (automated)                     |
|                                                  |
|  Prime IT Solutions                             |
|  Last update: 26 Sep 09:15 (1h 27m ago) - OK  |
|                                                  |
|  NetCore Solutions                              |
|  Last update: 25 Sep 07:00 (26h ago) - STALE  |
|  Auto-action: Switched 14 offers to            |
|  "confirm before promise"                      |
|  [Contact vendor]                              |
|                                                  |
|  Rule: Feed stale > 6h --> auto switch         |
|  Rule: Feed stale > 48h --> auto pause offers  |
+--------------------------------------------------+
```

## 7. Tab 5 - Vendor Performance

Monthly performance dashboard for each vendor:
- On-time delivery rate
- Order fill rate (how often they can fulfil what was ordered)
- Return/defect rate
- Average dispute resolution time

Poor performers are flagged for review. Consistently poor performance
can lead to account suspension.

## 8. How Other Roles See Vendors

| Feature | Owner | Ops Admin | Finance | Catalog | Branch Mgr | Warehouse |
|---|---|---|---|---|---|---|
| View vendor list | Yes | Yes | Yes | Yes | No | No |
| View vendor performance | Yes | Yes | Yes | No | No | No |
| Approve vendor applications | Yes | Yes | No | No | No | No |
| Review vendor submissions | Yes | Yes | No | Yes | No | No |
| View vendor payment details | Yes | No | Yes | No | No | No |
| Invite new vendors | Yes | Yes | No | No | No | No |

---
*Based on erp-vendors.html | BuildDock Team - 30 September 2026*
