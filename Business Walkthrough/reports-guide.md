# Tradex ERP - Reports Module
### Business Walkthrough | BuildDock Team

---

## 1. What This Module Does
Provides standard reports for business analysis. All reports can be
filtered, scheduled, and exported. This module is read-only - it displays
data but does not change anything.

## 2. Navigation
```
Left sidebar --> FINANCE & INSIGHT --> Reports
```

## 3. Report Catalogue

```
+--------------------------------------------------+
|  Report catalogue (14 standard reports)         |
|                                                  |
|  Sales & Revenue                                |
|  - Sales & returns by branch                   |
|  - Net sales by channel                        |
|  - Top products (units + revenue + margin)     |
|  - Dealer sales by account                     |
|                                                  |
|  Stock & Operations                             |
|  - Stock ageing report                         |
|  - Stock movement summary                      |
|  - Purchase order history                      |
|  - Return rate by product                      |
|                                                  |
|  Finance                                        |
|  - Payment method mix                          |
|  - Settlement reconciliation                   |
|  - Outstanding COD                             |
|  - Refunds summary                             |
|                                                  |
|  Staff & Performance                            |
|  - Owner touches trend                         |
|  - Discount approval log                       |
+--------------------------------------------------+
```

## 4. Example Report - Sales & Returns by Branch

```
+--------------------------------------------------+
|  Sales & returns by branch                      |
|  Period: Last 30 days  [Change]                 |
|                                                  |
|  One filter row scopes everything below:        |
|  [Date range v] [Condition v] [Channel v]       |
|                                                  |
|  Branch          | Gross sales | Returns | Net   |
|  Central WH      | Rs.82.4 L   | Rs.3.2L | 79.2L |
|  SP Road Branch  | Rs.56.8 L   | Rs.2.7L | 54.1L |
|  Koramangala     | Rs.35.1 L   | Rs.1.3L | 33.8L |
|  Mysuru Branch   | Rs.18.2 L   | Rs.1.3L | 16.9L |
|                                                  |
|  TOTAL           | Rs.1.92 Cr  | Rs.8.5L |1.84 Cr|
|                                                  |
|  [Chart view] [Table view] [Export CSV/PDF]     |
+--------------------------------------------------+
```

### Definitions Used in Reports

| Term | Exact definition |
|---|---|
| **Gross sales** | Total invoice value before returns (ex GST) |
| **Returns** | Value of items returned and refunded in the period |
| **Net sales** | Gross sales minus returns (ex GST) |
| **Gross margin** | Net sales minus cost of goods sold |
| **Event date** | The date the event occurred (order placed, payment captured, etc.) |

> [!IMPORTANT]
> All figures in reports EXCLUDE GST unless a report specifically says "inc. GST."
> This is stated on every report to avoid confusion.

## 5. Scheduled Reports

Set up automatic report delivery:

```
+--------------------------------------------------+
|  Schedule a report                              |
|                                                  |
|  Report: [Sales & returns by branch     v]      |
|  Frequency: [Every Monday at 8:00 AM    v]      |
|  Format: [PDF] [Excel] [CSV]                   |
|  Send to: [rajesh@tradexelectronics.in]         |
|           [deepa.k@tradexelectronics.in]        |
|                                                  |
|             [Cancel]   [Save schedule]          |
+--------------------------------------------------+
```

## 6. Owner Weekly Digest (Report Format)

A pre-configured report sent every Sunday at 8:00 AM:
- Net sales vs previous week
- Top 5 products by revenue
- Return rate summary
- Stock health alerts
- Open exceptions count

## 7. Data Freshness

Every report shows when the underlying data was last updated:
- Sales data: near real-time (< 5 minutes)
- Stock data: near real-time (< 1 minute)
- Settlement data: updated on import (usually daily)
- If a data feed failed, the report shows a warning banner

## 8. How Other Roles See Reports

| Report category | Owner | Finance | Ops Admin | Branch Mgr | Support | Warehouse |
|---|---|---|---|---|---|---|
| Sales reports (all branches) | Yes | Yes | Yes | Own branch | No | No |
| Sales reports (with margin) | Yes | Yes | No | No | No | No |
| Stock reports | Yes | No | Yes | Own branch | No | Yes (own WH) |
| Finance reports | Yes | Yes | No | No | No | No |
| Export data | Yes | Yes | Yes | Yes (branch) | No | No |
| Schedule reports | Yes | Yes | Yes | Yes | No | No |
| Request new reports | Yes | Yes | Yes | No | No | No |

---
*Based on erp-reports.html | BuildDock Team - 30 September 2026*
