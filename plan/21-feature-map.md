# 21 — Feature map: which capability governs which screen, tab, API and task

**Purpose.** `19-saas-platform.md` §5.3 lists every feature that can be granted or withheld per store. This file
answers the question an implementer actually has in front of them: *"I am building this screen / this tab / this
endpoint — which feature switch governs it, and what happens when that switch is off?"*

Without this map, capability gating gets applied by guesswork: some screens gate, some do not, and a store ends
up seeing a feature it was never granted. With it, every element has one named owner.

**Read this file when:** picking any task that builds a screen, a tab, a section, an endpoint or a job; adding a
new element to an existing screen; or reviewing whether a feature is fully gated.

**Related:** `19` §5 (the catalogue and the control model) · `19` §26.1 (the nine artefacts every capability
needs) · `19` §26.5 (adding a screen or field) · `00-conventions.md` §8 (page registry) · `03` §12 (data model).

---

## 1. How to read the tables

| Column | Meaning |
|---|---|
| **Section / tab** | The named part of the screen, using the identifiers the mockup and the task blocks already use |
| **Capability** | The one capability that owns it. `—` means it is part of the screen's core and is governed by the screen's module instead (`§4`) |
| **When the capability is off** | What the store sees. In almost every case the answer is **nothing at all** — the section is absent, not greyed |

Three rules apply to every row and are not repeated in each one:

1. **Off means absent.** No heading, no empty state, no placeholder, no greyed control, no space where it was
   (`19` §9 INV-1, INV-4).
2. **The route and the bundle go too.** A section behind a disabled capability is not rendered *and* its code is
   not shipped to the browser (`19` §5.2 point 4).
3. **Its endpoints answer 404,** not 403 (`19` §9 INV-3).

## 2. The mockup baseline — the reference store (`D-279`)

The clickable mockup at the repository root (`store-*.html`, `erp-*.html`, `vendor-*.html`) shows **a store with
every Phase-1 feature enabled**. It is the *reference store*: the maximal configuration, used so that reviewers,
designers and implementers can see the whole system in one place.

| What that means | What it does **not** mean |
|---|---|
| Every section in the mockup is real and must be built | That every store has every section |
| The mockup is the layout and behaviour reference for each section | That a section is always on |
| A section in the mockup with no row in this file is a **gap in this file**, and must be added before the screen is built | That the section is ungated |

So: **the mockup is not gated, and should not be.** Adding capability gating to the client-facing mockup would
make it a picture of one particular store instead of a picture of the system, and would make client review
harder. The gating lives in the product; this file is what connects the two.

The root admin mockup (`root-admin-mockup/`) is the opposite view — it shows the switches themselves.

## 3. Storefront screens (`P-S`)

### P-S01 Home (`store-home.html`)

| Section | Capability | When off |
|---|---|---|
| Header, category bar, mega menu, footer | — (`MOD-storefront`) | The storefront surface itself is absent (`19` §5.4.1) |
| Category tiles | — | — |
| Curated collections / deal rails | `CAP-CURATED_COLLECTIONS` | Rails absent; the page reflows without a gap |
| Recently viewed rail | `CAP-RECENTLY_VIEWED` | Absent |
| Recommendation rail | `CAP-RECOMMENDATIONS` | Absent |
| Refurbished / condition strip | `CAP-CONDITION_GRADES` | Absent |
| Announcement bar | `CAP-ANNOUNCEMENT_BAR` | Absent |
| Newsletter sign-up block | `CAP-EMAIL_MARKETING` | Absent, and the consent text with it |
| WhatsApp "message us" entry point | `CAP-WHATSAPP_CLICK_TO_CHAT` | Absent from header, footer and product pages together |
| Web chat launcher | `CAP-WEB_CHAT` | Absent |
| Store/branch finder link | `CAP-STORE_LOCATOR` | Absent |
| Age confirmation gate | `CAP-AGE_GATE` | Not shown; the site opens directly |

### P-S02 Category & search results (`store-listing.html`)

| Section | Capability | When off |
|---|---|---|
| Result grid, cards, pagination, sort | — (`MOD-storefront`) | — |
| Filter sidebar and active chips | `CAP-ATTRIBUTE_SCHEMAS` | Filters reduce to category and price only |
| Condition filter and condition badges | `CAP-CONDITION_GRADES` | Absent |
| Brand filter | `CAP-BRANDS` | Absent |
| Size / colour facets | `CAP-VARIANT_MATRIX` | Absent |
| Price-per-unit on cards | `CAP-UNIT_PRICE_DISPLAY` | Absent |
| Dealer tier hint on cards | `CAP-QUANTITY_TIERS` | Absent |
| Compare checkbox and tray | `CAP-COMPARE` | Absent, including the tray |
| Wishlist heart | `CAP-WISHLIST` | Absent |
| "Notify me when back" | `CAP-BACK_IN_STOCK_ALERTS` | Absent |
| Rating stars and review counts | `CAP-REVIEWS` | Absent, and rating sort removed |
| Refurbished explainer strip | `CAP-CONDITION_GRADES` | Absent |

### P-S03 Product detail (`store-product.html`)

| Section | Capability | When off |
|---|---|---|
| Gallery, title, price block, availability, add to basket | — (`MOD-storefront`, `MOD-orders`) | — |
| 360° spin / video | `CAP-PRODUCT_MEDIA_360` / `CAP-PRODUCT_VIDEO` | Absent from the gallery |
| Variant picker (single axis) | `CAP-VARIANTS` | Absent; one buyable item |
| Size × colour grid and size guide | `CAP-VARIANT_MATRIX`, `CAP-SIZE_GUIDE` | Absent |
| Weight / quantity selector for loose goods | `CAP-WEIGHT_PRICED_ITEMS` | Absent |
| Condition selector and grade explanation | `CAP-CONDITION_GRADES` | Absent; one condition |
| Unit inspection report (`#insp-sec`) | `CAP-QC_INSPECTION` | Absent |
| Serial-level information | `CAP-SERIAL_TRACKING` | Absent |
| Batch / best-before information | `CAP-BATCH_LOT`, `CAP-EXPIRY_DATES` | Absent |
| Policy row (`#policy-row`) — returns, warranty | `CAP-RETURNS`, `CAP-WARRANTY_CASES` | The row shows only what the store has |
| "Frequently bought together" (`#fbt-sec`) | `CAP-BUNDLES` | Absent |
| Compatibility ("fits your device") | `CAP-COMPATIBILITY` | Absent |
| Specification tabs (`#tabs-sec`) | `CAP-ATTRIBUTE_SCHEMAS` | Reduced to description only |
| Documents / datasheets | `CAP-PRODUCT_DOCUMENTS` | Absent |
| Reviews tab | `CAP-REVIEWS` | Absent |
| Questions and answers | `CAP-PRODUCT_QA` | Absent |
| Similar items (`#similar-sec`) | `CAP-RECOMMENDATIONS` | Absent |
| Delivery-slot preview | `CAP-SCHEDULED_DELIVERY_SLOTS` | Absent |
| Collect-from-shop option | `CAP-STORE_PICKUP` | Absent |
| Instalment / EMI panel | `CAP-EMI` | Absent |
| Rental period picker | `CAP-RENTAL_ITEMS`, `CAP-AVAILABILITY_CALENDAR` | Absent |
| Appointment picker | `CAP-SERVICE_APPOINTMENTS` | Absent |
| Made-to-order options | `CAP-MADE_TO_ORDER`, `CAP-PERSONALISATION` | Absent |
| Provenance / authentication block | `CAP-PROVENANCE`, `CAP-AUTHENTICATION_RECORD` | Absent |
| Wishlist, compare, share | `CAP-WISHLIST`, `CAP-COMPARE` | Absent |
| Price-drop alert | `CAP-PRICE_DROP_ALERTS` | Absent |
| Sticky mobile buy bar (`#m-buybar`) | — | — |

### P-S04 Certified refurbished landing · P-S05 Compare

| Screen | Capability | When off |
|---|---|---|
| P-S04 entire page and its navigation entry | `CAP-CONDITION_GRADES` | The page does not exist and nothing links to it |
| P-S05 entire page, the compare tray and every compare control | `CAP-COMPARE` | The page does not exist and nothing links to it |

### P-S06 Cart (`store-cart.html`)

| Section | Capability | When off |
|---|---|---|
| Lines, quantities, totals, checkout button | — (`MOD-orders`) | — |
| Save for later (`#view-seg`) | `CAP-SAVE_FOR_LATER` | Absent |
| Discount code field (`#coupon-in`) | `CAP-COUPONS` | Absent |
| Delivery PIN / serviceability check (`#pin-form`) | `CAP-COURIER_SHIPPING` | Absent |
| Quantity break hint | `CAP-QUANTITY_TIERS` | Absent |
| Minimum order notice | `CAP-MIN_ORDER_VALUE` | Absent |
| Recently viewed strip (`#recent-sec`) | `CAP-RECENTLY_VIEWED` | Absent |
| Gift message | `CAP-GIFT_MESSAGE` | Absent |

### P-S07 Checkout (`store-checkout.html`)

| Section | Capability | When off |
|---|---|---|
| Stepper, address, review, place order | — (`MOD-orders`) | — |
| Guest checkout path (`#g-phone`, `#g-email`) | `CAP-GUEST_CHECKOUT` | Sign-in required; the guest path is absent |
| Reservation timer (`#timer`) | `CAP-RESERVATIONS` | Absent |
| Delivery method choice | `CAP-COURIER_SHIPPING`, `CAP-LOCAL_DELIVERY`, `CAP-FREIGHT_BULKY` | Only the methods the store has appear |
| Collect from shop | `CAP-STORE_PICKUP` | Absent |
| Delivery slot picker | `CAP-SCHEDULED_DELIVERY_SLOTS` | Absent |
| Appointment step | `CAP-SERVICE_APPOINTMENTS` | Absent |
| Online payment | `CAP-ONLINE_PAYMENTS` | Absent |
| Cash on delivery | `CAP-COD` | Absent |
| Instalments / EMI | `CAP-EMI` | Absent |
| Bank transfer | `CAP-BANK_TRANSFER` | Absent |
| Deposit / part payment | `CAP-DEPOSITS`, `CAP-PART_PAYMENT` | Absent |
| Gift card / store credit | `CAP-GIFT_CARDS`, `CAP-WALLET_CREDIT` | Absent |
| Business account purchase order reference | `CAP-BUSINESS_ACCOUNTS` | Absent |
| Credit terms option | `CAP-CREDIT_TERMS` | Absent |
| Licence agreement step | `CAP-DIGITAL_PRODUCTS` | Absent |
| Marketing consent tick | `CAP-EMAIL_MARKETING`, `CAP-SMS_MARKETING` | Absent; transactional consent text stays |

### P-S08 Order confirmation & tracking (`store-order.html`)

| Section | Capability | When off |
|---|---|---|
| Order summary and status | — (`MOD-orders`) | — |
| Shipment tracker and courier link | `CAP-TRACKING_PAGE` | Reduced to status text |
| Download / licence key panel | `CAP-DIGITAL_DELIVERY`, `CAP-LICENCE_KEYS` | Absent |
| Appointment details | `CAP-SERVICE_APPOINTMENTS` | Absent |
| Rental return instructions | `CAP-RENTAL_LOGISTICS` | Absent |
| "Message us on WhatsApp about this order" | `CAP-WHATSAPP_CLICK_TO_CHAT` | Absent |
| Start a return | `CAP-RETURNS` | Absent |
| Leave a review prompt | `CAP-REVIEWS` | Absent |
| Guest order lookup | `CAP-GUEST_CHECKOUT` | Absent |

### P-S09 My account (`store-account.html`)

| Tab / section | Capability | When off |
|---|---|---|
| Overview, orders, addresses, profile | — (`MOD-customers`) | — |
| Wishlist tab | `CAP-WISHLIST` | Tab absent |
| Alerts and saved searches | `CAP-BACK_IN_STOCK_ALERTS`, `CAP-PRICE_DROP_ALERTS` | Absent |
| Message preferences | `CAP-NOTIFICATION_PREFERENCES` | Absent |
| Marketing subscriptions | `CAP-EMAIL_MARKETING`, `CAP-SMS_MARKETING`, `CAP-PUSH_WEB` | Only the channels the store has appear |
| Privacy requests (`#privacy`) | `CAP-PRIVACY_REQUESTS` | Absent |
| Two-step verification | `CAP-MFA_CUSTOMERS` | Absent |
| Loyalty balance | `CAP-LOYALTY_POINTS` | Absent |
| Store credit / gift cards | `CAP-WALLET_CREDIT`, `CAP-GIFT_CARDS` | Absent |
| Subscriptions | `CAP-SUBSCRIPTION_PLANS`, `CAP-BILLING_CYCLES` | Absent |
| Reorder list | `CAP-REORDER_LISTS` | Absent |
| Returns history | `CAP-RETURNS` | Absent |
| Business account switcher | `CAP-BUSINESS_ACCOUNTS` | Absent |

### P-S10 Return / warranty request (`store-returns.html`)

| Section | Capability | When off |
|---|---|---|
| Whole screen | `CAP-RETURNS` | The page does not exist and nothing links to it |
| Warranty path (`#w-note`, serial verification) | `CAP-WARRANTY_CASES`, `CAP-SERIAL_TRACKING` | Absent; returns only |
| Exchange option | `CAP-EXCHANGES` | Absent; refund only |
| Reverse pickup booking | `CAP-REVERSE_PICKUP` | Absent; drop-off instructions instead |
| Photo upload | `CAP-DOCUMENT_CAPTURE` | Absent |
| Non-returnable notice | `CAP-NON_RETURNABLE_CLASSES` | Absent |

### P-S11 Dealer zone (`store-dealer.html`)

| Tab / section | Capability | When off |
|---|---|---|
| Whole screen and its navigation entry | `CAP-BUSINESS_ACCOUNTS` | The page does not exist |
| Application form (`#app-seg`) | `CAP-DEALER_APPLICATIONS` | Absent |
| Price list browser (`#pl-rows`) | `CAP-PRICE_LISTS` | Absent |
| Quantity tier columns | `CAP-QUANTITY_TIERS` | Absent |
| Quick order (`#qo-in`) | `CAP-REORDER_LISTS` | Absent |
| Bulk order upload (`#bulk`) | `CAP-CATALOG_IMPORT` | Absent |
| Quote requests | `CAP-QUOTES` | Absent |
| Credit and statement panel | `CAP-CREDIT_TERMS` | Absent |
| Contract prices | `CAP-CONTRACT_PRICING` | Absent |

### P-S12 Sign in · register · apply (`store-login.html`)

| Section | Capability | When off |
|---|---|---|
| Sign-in form | `CAP-PASSWORD_SIGN_IN` or `CAP-OTP_SIGN_IN` | At least one must be on; the compiler rejects a store with neither |
| One-time code path | `CAP-OTP_SIGN_IN` / `CAP-SMS_OTP` | Absent |
| Google / Apple sign-in | `CAP-SSO_GOOGLE`, `CAP-SSO_APPLE` | Absent |
| Dealer application tab | `CAP-DEALER_APPLICATIONS` | Absent |
| Vendor application tab | `CAP-VENDOR_PORTAL` | Absent |
| Guest continue | `CAP-GUEST_CHECKOUT` | Absent |

### P-S13 Help centre & policies (`store-help.html`)

| Section | Capability | When off |
|---|---|---|
| Whole screen | `CAP-HELP_CENTRE` | The page does not exist |
| Contact form (`#contact`) | `CAP-CONTACT_FORMS` | Absent |
| Call-back request | `CAP-CALLBACK_REQUESTS` | Absent |
| WhatsApp entry point | `CAP-WHATSAPP_CLICK_TO_CHAT` | Absent |
| Web chat launcher | `CAP-WEB_CHAT` | Absent |
| Branch list and map | `CAP-STORE_LOCATOR` | Absent |
| Policy pages (returns, warranty, privacy) | Follow the capability they describe | A policy for a feature the store does not have is absent |

### P-S14 Account-access landings · P-S15 Error and unavailable pages

Not capability-gated — they must exist in every store. P-S15 additionally carries the suspension notice
(`19` §14 `BR-M30-05`) and the neutral unknown-host response (`19` §10.2).

## 4. Workspace screens (`P-E`)

A workspace screen belongs to a **module** (`19` §5.4.2); if the module is off, the whole screen and its
navigation entry are absent. Within a screen, tabs and columns are gated individually.

| Screen | Module that owns it | Tab / section → capability |
|---|---|---|
| **P-E01** Owner control centre (`erp-dashboard.html`) | `MOD-administration` (always on) | KPI tiles follow the capabilities that produce them; automation panel `CAP-AUTOMATION_RULES`; exception panel `CAP-EXCEPTION_QUEUES`; approvals panel `CAP-APPROVAL_WORKFLOWS`; digest card `CAP-AUTO_OWNER_DIGEST` |
| **P-E02** Orders (`erp-orders.html`) | `MOD-orders` | Drawer tabs: `od-lines` —, `od-pay` `CAP-ONLINE_PAYMENTS`, `od-ship` `CAP-COURIER_SHIPPING`, `od-time` —, `od-notes` `CAP-ORDER_NOTES`. Assisted-order action `CAP-ASSISTED_ORDERS`; partial dispatch `CAP-PARTIAL_DISPATCH`; backorder column `CAP-BACKORDERS` |
| **P-E03** Pick · pack · dispatch (`erp-fulfilment.html`) | `MOD-fulfilment` | `topick`/`picking`/`topack`/`ready`/`dispatched` —; wave controls `CAP-PICK_WAVES`; label printing `CAP-SHIPPING_LABELS`; packing slips `CAP-PACKING_SLIPS`; `exceptions` `CAP-EXCEPTION_QUEUES`; proof of delivery `CAP-DELIVERY_PROOF` |
| **P-E04** Returns, RMA & warranty (`erp-returns.html`) | `MOD-returns` | `rma` `CAP-RETURNS`; `warranty`/`rd-wty` `CAP-WARRANTY_CASES`; `supplier` `CAP-SUPPLIER_RMA`; `quarantine` `CAP-STOCK_ADJUSTMENTS`; `refunds` `CAP-REFUND_APPROVALS`; `rd-insp` `CAP-QC_INSPECTION`; exchange decision `CAP-EXCHANGES` |
| **P-E05** Support & WhatsApp inbox (`erp-support.html`) | `MOD-support` | `inbox` `CAP-WHATSAPP_SHARED_INBOX` or `CAP-WEB_CHAT`; `tickets` `CAP-SUPPORT_TICKETS`; `library` `CAP-HELP_CENTRE`; SLA timers `CAP-SUPPORT_SLA_TIMERS`; channel switcher shows only granted channels |
| **P-E06** Catalog & imports (`erp-catalog.html`) | `MOD-catalogue` | `products`/`editor` —; `templates` `CAP-ATTRIBUTE_SCHEMAS`; `review` `CAP-CATALOG_REVIEW`; `import` `CAP-CATALOG_IMPORT`; media import `CAP-MEDIA_IMPORT`; condition fields `CAP-CONDITION_GRADES`; compatibility editor `CAP-COMPATIBILITY`; bundle editor `CAP-BUNDLES`; variant grid `CAP-VARIANT_MATRIX` |
| **P-E07** Pricing & dealer tiers (`erp-pricing.html`) | `MOD-pricing` | `lists` `CAP-PRICE_LISTS`; `tiers` `CAP-QUANTITY_TIERS`; `promotions` `CAP-PROMOTIONS`; `rules`/`controls` `CAP-MARGIN_FLOORS`; `approvals` `CAP-PRICE_CHANGE_APPROVAL`; `simulator` —; `audit` `CAP-AUDIT_VIEWER`; location prices `CAP-LOCATION_PRICING`; contract prices `CAP-CONTRACT_PRICING` |
| **P-E08** Inventory & serials (`erp-inventory.html`) | `MOD-inventory` | `stock`/`movements` —; `reservations` `CAP-RESERVATIONS`; `serials` `CAP-SERIAL_TRACKING`; batch/expiry columns `CAP-BATCH_LOT`, `CAP-EXPIRY_DATES`; `transfers` `CAP-TRANSFERS`; `counts` `CAP-CYCLE_COUNTS`; `supplier` `CAP-SUPPLIER_AVAILABILITY`; bin columns `CAP-BINS`; cold-chain flags `CAP-COLD_CHAIN` |
| **P-E09** Purchasing & receiving (`erp-purchasing.html`) | `MOD-purchasing` | `suggestions` `CAP-REORDER_RULES`; `orders`/`new-po` `CAP-PURCHASE_ORDERS`; `receive` `CAP-GOODS_RECEIPT`; inspection step `CAP-QC_INSPECTION`; `bills` `CAP-SUPPLIER_BILLS`; landed-cost fields `CAP-LANDED_COST`; `suppliers` — |
| **P-E10** Customers & dealers (`erp-customers.html`) | `MOD-customers` | `all`/`c-profile`/`c-orders` —; `business`/`applications` `CAP-BUSINESS_ACCOUNTS`, `CAP-DEALER_APPLICATIONS`; `c-consent` `CAP-CONSENT_CAPTURE`; `privacy` `CAP-PRIVACY_REQUESTS`; `duplicates` `CAP-CUSTOMER_MERGE`; `c-support` `MOD-support`; `c-returns` `MOD-returns`; tags `CAP-CUSTOMER_TAGS` |
| **P-E11** Vendors & submissions (`erp-vendors.html`) | `MOD-vendor` | `list`/`applications` `CAP-VENDOR_PORTAL`; `submissions` `CAP-VENDOR_SUBMISSIONS`; `freshness` `CAP-VENDOR_AVAILABILITY_FEED`; `performance` `CAP-VENDOR_PERFORMANCE`; `marketplace` `CAP-MARKETPLACE` (LATER) |
| **P-E12** Payments & reconciliation (`erp-finance.html`) | `MOD-payments` + `MOD-finance` | `payments`/`events` `CAP-ONLINE_PAYMENTS`; `recon` `CAP-AUTO_PAYMENT_RECONCILIATION`; `refunds` `CAP-REFUND_APPROVALS`; `cod` `CAP-COD`; `export` `CAP-ACCOUNTING_EXPORT`; `close` `CAP-DAY_CLOSE`; settlement import `CAP-SETTLEMENT_IMPORT` |
| **P-E13** Reports (`erp-reports.html`) | `MOD-reporting` | Report list `CAP-STANDARD_REPORTS`; saved views `CAP-SAVED_VIEWS`; scheduling `CAP-SCHEDULED_REPORTS`; exports `CAP-DATA_EXPORTS`; report request `CAP-CUSTOM_REPORT_REQUESTS`. Individual reports appear only when the capability producing their data is on |
| **P-E14** Automation & exceptions (`erp-automation.html`) | `MOD-automation` | `rules`/`runs`/`rd-*` `CAP-AUTOMATION_RULES`, and each rule row its own `CAP-AUTO_*`; `exceptions` `CAP-EXCEPTION_QUEUES`; `approvals` `CAP-APPROVAL_WORKFLOWS`; value chart `CAP-AUTOMATION_VALUE_TRACKING` |
| **P-E15** Settings, roles & audit (`erp-admin.html`) | `MOD-administration` (cannot be disabled) | `users`/`roles` —; `locations` `CAP-MULTI_LOCATION`; `thresholds` `CAP-APPROVAL_THRESHOLDS`; `delegation` `CAP-DELEGATION`; `integrations` per `CAP-*` integration; `audit` `CAP-AUDIT_VIEWER`; `system` —; **Features section** `CAP-SELF_SERVICE_FEATURES` (`§5`); **Channels section** per granted channel; access reviews `CAP-ACCESS_REVIEWS`; retention `CAP-DATA_RETENTION_RULES` |
| **P-E16** Staff sign-in and MFA | — | MFA step `CAP-MFA_STAFF`; method follows `D-040` |
| **P-E17** Team & activity (`erp-team.html`, sidebar "Team monitor"; added 2026-09-30, `D-282`) | `MOD-administration` | Whole screen and its navigation entry `CAP-TEAM_MONITOR` (off → entry absent, route and API-M24-15…17 404, no heartbeat); within it `CAP-TEAM_MONITOR`: KPI tiles, `#board` (with `#sg`), `#area-body`, `#hm` / `#hm-table`, `#feed` (with `#feed-chips`), `#perf-body`, drawer `#d-person` (`pd-today`, `pd-areas`, `pd-perf`, `pd-sess`, `pd-sens`, `pd-access`), modal `#m-recorded`; presence — status ring and statuses on `#board`, `#sg` Idle / Break or away, "Idle over 15 min" tile, `pd-areas` "Presence today", shell heartbeat and status control — `CAP-STAFF_PRESENCE`; `#alerts`, "Open alerts" tile, sidebar badge, "Alert rules" button and `#m-rules` `CAP-STAFF_ACTIVITY_ALERTS` (each rule its own switch); "Audit log →", "Full record in the audit log →", "View in audit log" `CAP-AUDIT_VIEWER`; "Export" (`act-export`) `CAP-DATA_EXPORTS`. Access beyond R-owner is a delegated permission (`team.monitor.read`, `D-283`), not a capability |
| **P-E18** Analytics (`erp-analytics.html`; added 2026-09-30, `D-284`) | `MOD-reporting` | Screen, navigation entry and tabs `overview` / `sales` / `products` `CAP-ANALYTICS_DASHBOARD`, which also carries the order-system cards of `store` (`#ful-stats`, `#stk-stats`, `#br-body`, `#ch-retcat`); tab `customers` `CAP-CUSTOMER_ANALYTICS`; every card marked "Needs visit tracking" — "Store conversion rate" tile in `#ov-kpis`, the conversion rule in `#hl-rows`, `#vnb-body`, `#nr-body`, `#ch-funnel`, `#cart-stats` / `#cart-where`, `#ch-traffic`, `#ch-devices` / `#dev-body`, `#lp-body`, `#ss-stats` — `CAP-STOREFRONT_VISIT_ANALYTICS` (CANDIDATE, `D-285`); recovered carts in `#cart-stats` also `CAP-ABANDONED_CART_RECOVERY`; "Save view" (`#act-save`) `CAP-SAVED_VIEWS`; "Export" (`#act-export`) `CAP-DATA_EXPORTS`; "Schedule email" (`act-schedule`) `CAP-SCHEDULED_REPORTS`; `#promo-body` `CAP-PROMOTIONS`; `#ch-buyer`, `#dl-body`, dealer tiles `CAP-BUSINESS_ACCOUNTS`; `#ch-cond` / `#cond-body` `CAP-CONDITION_GRADES`; `#tgt-rows` absent until `D-286` (c). Margin figures are a permission (`analytics.margin.read`, `D-286`), not a capability |

## 5. The store's own Features and Channels sections (P-E15)

These two sections are themselves governed, and they are the visible half of `D-258`:

| Element | Rule |
|---|---|
| The **Features** section exists at all | Only when `CAP-SELF_SERVICE_FEATURES` is on **and** at least one item is `delegated`. A store with nothing delegated has no Features section — not an empty one |
| Which rows appear | Only items whose control state is `delegated` (`19` §5.4.3 CTL-7). Locked and unavailable items are absent from the page **and** from the data the page loads |
| The **Channels** section | Only channels granted to this store, and within them only those marked `delegated`. Credentials are write-only and never displayed again |
| Automations on P-E14 | Only automations granted to this store; only delegated ones are switchable, the rest are visible-but-fixed or absent according to their control state |

## 6. Vendor portal (`P-V`)

The whole surface is gated by `CAP-VENDOR_PORTAL`; when it is off there is no vendor sign-in, no vendor route and
no vendor bundle (`19` §5.4.1).

| Screen | Tab / section → capability |
|---|---|
| **P-V01** Vendor dashboard | Action items —; messages `CAP-VENDOR_MESSAGING`; performance summary `CAP-VENDOR_PERFORMANCE` |
| **P-V02** Products & submissions | `listings`/`new`/`submissions` `CAP-VENDOR_SUBMISSIONS`; `bulk` `CAP-CATALOG_IMPORT`; submission fields follow the pack's vendor profile (`19` §6.5) |
| **P-V03** Availability, POs, tasks, returns | `feed` `CAP-VENDOR_AVAILABILITY_FEED`; `m-api` `CAP-VENDOR_API_KEYS`; `m-csv`/`m-form` `CAP-VENDOR_AVAILABILITY_FEED`; `pos` `CAP-PURCHASE_ORDERS`; `tasks` `CAP-SUPPLIER_FULFILMENT`; `returns` `CAP-SUPPLIER_RMA` |
| **P-V04** Profile & statements | `profile`/`users`/`documents` —; `bank` `CAP-VENDOR_STATEMENTS`; `statements` `CAP-VENDOR_STATEMENTS`; `terms` —; `marketplace` `CAP-MARKETPLACE` (LATER) |
| **P-V05** Vendor sign-in | MFA follows `D-200`; not capability-gated beyond the surface |

## 7. Root admin (`P-R`)

Root admin screens are **not** governed by store capabilities — they are governed by platform roles
(`00-conventions.md` §9.1) and are invisible to every store by construction (`19` §9 INV-8). The mapping of
screen to role is in `20-root-admin.md` §3 and §6.

## 8. Reverse index — capability → where it is enforced

Use this when adding or auditing a capability. Every capability needs all nine artefacts of `19` §26.1; this
index says where the screen and API ones live.

A trailing `*` denotes **every capability with that prefix**, listed individually in `19` §5.3 — `CAP-AUTO_*` is
the automation family, `CAP-WHATSAPP_*` the five WhatsApp levels, and so on. Each one is a separate switch; the
grouping here is only to keep the table readable.

| Capability | Screens | Endpoint groups | Entities | Built by |
|---|---|---|---|---|
| `CAP-SERIAL_TRACKING` | P-S03, P-E06, P-E08, P-E03, P-E04, P-S10 | M06 serial endpoints | E-serial_unit, E-serial_event | `T-1A.6-*`, `T-1A.4-M32-02` |
| `CAP-BATCH_LOT`, `CAP-EXPIRY_DATES` | P-S03, P-E08, P-E03, P-E09 | M06 | E-lot, stock rows | `T-1A.4-M32-02` (contracts), per-pack build |
| `CAP-CONDITION_GRADES` | P-S02, P-S03, P-S04, P-E06, P-E04 | M04 | E-condition_grade | `T-1A.4-*` |
| `CAP-COMPARE`, `CAP-WISHLIST` | P-S02, P-S03, P-S05, P-S09 | M08/M09 | E-wishlist_item | `T-1A.9-M09-09` |
| `CAP-REVIEWS`, `CAP-PRODUCT_QA` | P-S02, P-S03, P-S08, P-E06 | M09 | E-product_review, E-product_question | `T-1A.9-M04-01`, `D-041`/`D-065` |
| `CAP-GUEST_CHECKOUT` | P-S07, P-S08, P-S12 | M10 | E-customer (guest flag) | `T-1A.9-M10-06` |
| `CAP-COD`, `CAP-EMI`, `CAP-ONLINE_PAYMENTS` | P-S03, P-S07, P-E12 | M11 | E-payment_attempt | `T-1A.10-*` |
| `CAP-STORE_PICKUP`, `CAP-COURIER_SHIPPING` | P-S03, P-S06, P-S07, P-S08, P-E03 | M12 | E-fulfilment | `T-1A.11-*` |
| `CAP-RETURNS`, `CAP-EXCHANGES`, `CAP-WARRANTY_CASES` | P-S08, P-S10, P-E04, P-E10 | M13 | E-return_request, E-warranty_case | `T-1A.12-*` |
| `CAP-BUSINESS_ACCOUNTS`, `CAP-QUANTITY_TIERS` | P-S07, P-S11, P-E07, P-E10 | M05/M08 | E-business_account, E-quantity_tier | `T-1A.8-*`, `T-1A.5-*` |
| `CAP-VENDOR_*` | P-S12, P-E11, all P-V | M14 | E-vendor_* | `T-1B.1-*`, `T-1B.1-M32-01` |
| `CAP-WHATSAPP_*` | P-S01, P-S03, P-S08, P-S13, P-E05 | M16/M20 | E-channel_binding, E-conversation, E-message_dispatch | `T-1A.13-M20-06`, `-07`, `T-1A.13-M16-03`, 1B.3 |
| `CAP-EMAIL_*`, `CAP-SMS_*`, `CAP-PUSH_*`, `CAP-WEB_CHAT` | P-S09, P-S13, P-E05, P-E15 | M20 | E-channel_binding, E-sender_identity, E-message_dispatch | `T-1A.13-M20-06`, `-07` |
| `CAP-AUTO_*` (each) | P-E14, plus the screen its outcome appears on | M17 | E-automation_rule, E-automation_run | `T-1A.13-M17-01` |
| `CAP-APPROVAL_WORKFLOWS`, `CAP-EXCEPTION_QUEUES` | P-E01, P-E04, P-E07, P-E14 | M17 | E-approval_request, E-exception_case | `T-1A.2-M17-01`, `-02` |
| `CAP-CATALOG_IMPORT`, `CAP-MEDIA_IMPORT` | P-S11, P-E06, P-V02 | M04/M22 | E-import_job, E-import_row | `T-1B.2-*`, `T-1B.2-M32-01` |
| `CAP-SELF_SERVICE_FEATURES` | P-E15 Features section | Store feature endpoints | E-store_feature_state | `T-1A.16-M24-09` |
| `CAP-STORE_API`, `CAP-WEBHOOKS` | P-E15 integrations | Store public API | E-api_credential, E-webhook_subscription | gated by `D-278` |
| `CAP-TEAM_MONITOR` | P-E17 (whole screen, sidebar entry) | API-M24-15, API-M24-16, API-M24-17; API-M18-03 dataset `team_activity` | E-audit_event (`area`, `work_item_ref`), E-work_item_event | `T-1A.2-M02-11`, `T-1A.16-M24-12`, `T-1A.16-M24-13`; client review `T-0-M09-07` |
| `CAP-STAFF_PRESENCE` | P-E17 `#board` statuses, Idle tile, `pd-areas`; shell(E) heartbeat and "On break / In a meeting" control | API-M02-43 | E-staff_presence_interval | `T-1A.2-M02-11`, `T-1A.16-M24-12` |
| `CAP-STAFF_ACTIVITY_ALERTS` | P-E17 `#alerts`, "Open alerts" tile, sidebar badge, `#m-rules`; serious alerts in P-E01 exceptions and the owner digest | API-M24-18, API-M24-19, API-M24-20 | E-staff_alert_rule, E-staff_alert | `T-1A.14-M17-13`, `T-1A.16-M24-12` |
| `CAP-ANALYTICS_DASHBOARD` | P-E18 (screen, sidebar entry, `overview`, `sales`, `products`, order-system cards of `store`) | API-M18-20; API-M18-03 dataset `analytics.<view>` | E-analytics_daily_fact | `T-1A.15-M18-09`, `T-1A.15-M18-10`, `T-1A.16-M24-13` |
| `CAP-CUSTOMER_ANALYTICS` | P-E18 `customers` | API-M18-20 (`view = customers`) | E-customer_cohort_snapshot | `T-1A.15-M18-09`, `T-1A.15-M18-10` |
| `CAP-STOREFRONT_VISIT_ANALYTICS` (CANDIDATE, `D-285`) | P-E18 cards marked "Needs visit tracking"; storefront beacon on P-S01…P-S13 (no visible UI) | API-M09-03; API-M18-20 visit cards | E-storefront_visit_counter (option b) or E-storefront_visit_event (option c); E-analytics_daily_fact (`visits`) | `T-1A.9-M09-14` (CONDITIONAL), `T-1A.15-M18-09`, `T-1A.15-M18-10` |

## 9. Keeping this file correct

| Rule | Detail |
|---|---|
| FM-1 | A screen, tab, section, column, action or endpoint added to the product without a row here is **incomplete work**, not a documentation gap. `19` §26.5 step 1 makes it the first question when adding anything |
| FM-2 | `TS-SAAS-CAP-02` already fails the build when a store-facing route or component has no declared capability. This file is the human-readable half of that test — if the two disagree, the test is right and this file is out of date |
| FM-3 | When a task is picked, its **Frontend impact** and **API impact** fields should name the capabilities from this file. A task that gates nothing must say so explicitly |
| FM-4 | The mockup is the reference store (`§2`). A mockup element with no row here is a gap in this file; a row here with no mockup element is either a later-phase feature or an error — check `19` §5.3 build status before assuming |
| FM-5 | Capability ids here must exist in `19` §5.3. The plan audit checks this |
