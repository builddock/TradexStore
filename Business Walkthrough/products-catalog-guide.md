# Tradex ERP - Products & Catalog Module
### Business Walkthrough | BuildDock Team

---

## Contents
1. What This Module Does
2. How to Navigate Here
3. Tab 1 - Products List
4. Tab 2 - Product Editor
5. Tab 3 - Import Pipeline
6. Tab 4 - Review Queue
7. Product Lifecycle (States)
8. How Other Roles See Catalog

---

## 1. What This Module Does

The **Products & Catalog** module is where all product information lives.
Every product sold on the website or at branches is managed here:
names, descriptions, photos, technical specifications, serial numbers,
and product condition (New / Refurbished / Open Box / Used).

**Key rule:** No product can go live without passing a Publish Readiness check.
This prevents incomplete or incorrect listings from reaching customers.

---

## 2. How to Navigate Here

`
Left sidebar --> CATALOG --> Products
`

---

## 3. Tab 1 - Products List

`
+--------------------------------------------------------------+
|  Products & catalog                [Import] [+ New product] |
|  [Search SKU, name, brand...]                                |
|  [All conditions v] [All categories v] [All states v]       |
|                                                              |
|  SKU       | Product name              | State   | Stock | M |
|  LAP01-RA  | MacBook Air M2 - 8GB 256  | LIVE    | 12    | 3 |
|  LAP04-RA  | Dell Latitude 5420 14"    | DRAFT   | 0     | 0 |
|  MON-01-R  | LG 27UL550 Refurb Grade A | LIVE    | 31    | 5 |
|  SSD-01-N  | 1TB Samsung 870 EVO New   | REVIEW  | 94    | 0 |
+--------------------------------------------------------------+
`

### Product States Explained

| State | What it means | Who can change it |
|---|---|---|
| **DRAFT** | Being created or edited - not visible to customers | Catalog specialist |
| **REVIEW** | Ready for review - waiting for a Designated Reviewer to approve | Reviewer must publish |
| **LIVE** | Active and visible on the website and in branch systems | Catalog / Owner |
| **PAUSED** | Temporarily hidden (e.g. during a price change or recall) | Catalog / Owner |
| **ARCHIVED** | No longer sold - kept for history and warranty purposes | Owner only |

> [!IMPORTANT]
> Draft v7 of a product NEVER overwrites the live v6.
> Edits create a new version in draft. The live version stays unchanged
> until the new version is explicitly published after review.

---

## 4. Tab 2 - Product Editor

Click any product to open the editor:

`
+--------------------------------------------------+
|  Dell Latitude 5420 14" FHD Business Laptop      |
|  SKU: LAP04-RA | Category: Laptops | DRAFT v2    |
|                                                  |
|  [ Details ] [ Specs ] [ Photos ] [ Serials ]    |
|  [ Pricing ] [ Publish readiness ] [ History ]   |
|                                                  |
|  Details tab:                                    |
|  Product name: [Dell Latitude 5420 14" FHD...]  |
|  Brand: [Dell]  Condition: [New v]              |
|  Short description: [14-inch FHD business lpt.] |
|  Full description: [Full editor here...]         |
|  HSN code: [8471]  GST %: [18%]                 |
+--------------------------------------------------+
`

### Publish Readiness Check

Before a product can go live, it must pass these checks:

`
+--------------------------------------------------+
|  Publish readiness                               |
|                                                  |
|  [ok] Product name (complete)                    |
|  [ok] Category assigned                          |
|  [ok] At least 3 photos uploaded                |
|  [ok] HSN code set                              |
|  [ok] GST rate set                              |
|  [!!] Technical specifications incomplete        |
|       Missing: RAM, Storage, Display resolution  |
|  [!!] No price set in any active price list     |
|  [ ] Review required (category: Laptops)        |
|                                                  |
|  CANNOT PUBLISH - 2 blocking issues remain       |
+--------------------------------------------------+
`

Blocking issues MUST be fixed before the product can be published.
Warnings can be bypassed but are recorded in the audit log.

### Refurbished / Grade Products

Refurbished items have extra fields:
- **Grade:** A (excellent) / B (good, minor marks) / C (functional, visible wear)
- **Inspection report:** Uploaded by the warehouse inspector
- **Cosmetic notes:** Specific marks or scratches documented
- **Serial-specific photos:** Photos of the EXACT unit (not generic stock photos)
- **Tested by / Date:** Who inspected it and when

Each refurbished unit is its own individual listing tied to a specific serial number.

---

## 5. Tab 3 - Import Pipeline

For bulk product creation from supplier price lists:

`
+--------------------------------------------------+
|  Import pipeline                                 |
|                                                  |
|  IMP-0092 - prime-it-pricelist-2026-09-26.xlsx  |
|  Uploaded: 26 Sep 10:12 - 247 rows              |
|                                                  |
|  Step 1: Column mapping                          |
|  Your column     | Maps to                      |
|  "Product Name"  | --> Product name             |
|  "Part#"         | --> SKU                      |
|  "MRP"           | --> List price               |
|  "EAN"           | --> Barcode                  |
|                                                  |
|  Step 2: Map supplier codes to your categories   |
|  "NB" --> Laptops                               |
|  "MON" --> Monitors                             |
|                                                  |
|  Step 3: Row results (preview)                   |
|  Row 1: OK - New product - LAP04-RA             |
|  Row 2: MATCH - Updates existing MON-01         |
|  Row 47: ERROR - Missing HSN code               |
|                                                  |
|  241 OK / 3 MATCH / 3 ERRORS                    |
|                                                  |
|  [Fix errors] [Import OK rows] [Cancel]          |
+--------------------------------------------------+
`

---

## 6. Tab 4 - Review Queue

Products submitted for review before going live:

`
+--------------------------------------------------+
|  Review queue (4 products)                       |
|                                                  |
|  Samsung Galaxy Book Pro - LAP09-N               |
|  Submitted by: Sneha P. - 26 Sep 10:00           |
|  Category: Laptops                               |
|  [Preview listing] [Approve & publish] [Reject]  |
+--------------------------------------------------+
`

Only staff with the **Designated Reviewer** designation for a category
can approve and publish products in that category.

---

## 7. Product Lifecycle (Full Summary)

`
[New product added]
      |
      v
 [DRAFT] <---- Edit / revise at any time
      |
      v (Submit for review)
 [REVIEW] <---- Reviewer checks and approves
      |
      v (Reviewer publishes)
 [LIVE] --> Customer can see and buy
      |
      +--> [PAUSED] (temporary - hide from sale)
      |
      v (Owner archives)
 [ARCHIVED] --> No longer available, kept for history
`

---

## 8. How Other Roles See Catalog

| Feature | Owner | Ops Admin | Finance | Catalog Spec | Branch Mgr | Support |
|---|---|---|---|---|---|---|
| View product list | Yes | Yes | Yes | Yes | Yes | Yes |
| Create / edit products | Yes | Yes | No | Yes (assigned cat) | No | No |
| Import from supplier file | Yes | Yes | No | Yes | No | No |
| Publish products | Yes | Yes | No | If reviewer | If reviewer | No |
| Pause / archive | Yes | Yes | No | No | No | No |
| View inspection reports | Yes | Yes | No | Yes | Yes | No |
| View cost/margin | Yes | No | Yes | No | No | No |

---

*This guide covers Tradex ERP Products & Catalog Module - Version 1.4.2*
*Based on erp-catalog.html mockup | BuildDock Team - 30 September 2026*
