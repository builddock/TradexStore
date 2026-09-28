# SaaS architecture change request (SAAS)

| Field | Value |
|---|---|
| Source code (plan) | **SAAS** — cite as `SAAS §<n>` |
| Received | 2026-09-28 |
| From | The user (project owner) — direct written instruction to the implementation team |
| Status | **Authoritative.** Supersedes the single-business assumption of MEET/BP/PR1/PR2 wherever the two conflict |
| Recorded as | `D-227` (architecture direction) and the decisions `D-228`–`D-256` in `plan/DECISIONS.md` |
| Plan files that expand it | `plan/19-saas-platform.md`, `plan/20-root-admin.md` |

## How this document relates to the other sources

MEET, BP, PR1 and PR2 describe **one** business: an Indian retailer of computers, laptops, PC parts, cameras
and electronics. That description is still valid — but it is now the description of **one store** on a
multi-store SaaS platform, not the description of the whole product.

Reading rule for every plan file and every implementation session:

1. **BP/MEET/PR1/PR2 requirements keep their authority** for what a store must be able to do. They are the
   requirements of the first store, `VP-electronics` / store `tradex`.
2. **This document (SAAS) has authority over the architecture**: one reusable, configuration-driven codebase;
   a separate Configurable Root Admin platform; database-driven configuration compiled to a fast runtime
   artefact; multiple UI templates; category-specific behaviour by configuration.
3. Where BP §3.3 / R15 / `D-045` said "prepare boundaries but do not build SaaS", **SAAS overrides it**
   (`D-227`). BP §3.3's boundary advice (company, branch, location separation) is still followed *inside* a store.
4. Nothing in this document relaxes the BP engineering rules: money is never floating point (BP §8.1); never
   trust client-sent price/role/stock/seller/refund fields (BP §17.4); payments, refunds and orders are
   idempotent (BP §10.2–10.3); one stock authority (BP §9); source fidelity (`00-conventions.md` §2).

---

## §1. Verbatim request (2026-09-28)

> ### Important Architecture Change
>
> The current system was originally designed as an e-commerce website and ERP/vendor system specifically for
> selling electronic items.
>
> I have now changed the architecture direction.
>
> The system must be redesigned as a SaaS e-commerce platform. The same codebase must be capable of being
> configured and used for different types of e-commerce businesses.
>
> The platform may be used for stores selling:
>
> * Electronics
> * Groceries
> * Fish
> * Furniture
> * Footwear
> * Antiques
> * Fashion & Apparel
> * Grocery & Supermarket
> * Beauty & Cosmetics
> * Health & Wellness
> * Home & Furniture
> * Jewelry & Watches
> * Automotive
> * Sports & Fitness
> * Books & Media
> * Toys & Kids
> * Pet Supplies
> * Industrial & Hardware
> * Construction & Building Materials
> * Agriculture & Gardening
> * Office & Business Supplies
> * Digital Products
> * Services
> * Handmade & Crafts
> * Luxury & Collectibles
> * Fresh / Perishable Products
> * Wholesale / B2B Products
> * Subscription Products
> * Rental Products
> * Custom / Made-to-Order Products
> * Multiple product categories combined in one store
> * The current customised TradeX e-commerce system
>
> The architecture must therefore support all of these types through configuration rather than creating a
> separate codebase for every type of e-commerce website.
>
> ### Important Requirement: Store Users Must Not See the SaaS Architecture
>
> The individual store owner, representative admin, vendor, or other users controlling a specific store must not
> know about or interact with the underlying multi-category SaaS configuration system.
>
> For them, the system must appear as a normal e-commerce platform designed specifically for their business.
>
> For example:
>
> * A fashion store should appear as a fashion e-commerce website.
> * An agriculture store should appear as an agriculture and gardening e-commerce website.
> * An electronics store should appear as an electronics e-commerce website.
>
> The users of that individual store should only see the features, products, options, terminology, and
> interfaces configured for that particular store.
>
> They should not see all available e-commerce categories or the SaaS configuration options.
>
> ### Configurable Root Admin
>
> There must be a separate Configurable Root Admin system.
>
> The Configurable Root Admin must have a separate portal and separate codebase from the individual store system.
>
> The Configurable Root Admin is responsible for creating and configuring individual stores.
>
> The Configurable Root Admin should be able to:
>
> 1. Create/configure a store.
> 2. Select the e-commerce type/category for the store.
> 3. Select the UI/site template for that store.
> 4. Configure the store's colours and other required visual settings.
> 5. Upload the store logo.
> 6. Configure the required features and behaviour for that store.
> 7. Deploy the configured store.
>
> ### Example
>
> If a client wants a Fashion & Apparel e-commerce website:
>
> 1. The Configurable Root Admin selects Fashion & Apparel as the e-commerce type.
> 2. The Configurable Root Admin selects a suitable UI/site template.
> 3. The Configurable Root Admin configures the colours and other required settings.
> 4. The Configurable Root Admin uploads the client's logo.
> 5. The Configurable Root Admin deploys the store.
>
> The resulting store must operate as a fashion-specific e-commerce website.
>
> The store owner, representative admin, and vendors should only see the functionality configured for that
> fashion store.
>
> They should not see the other e-commerce types supported by the SaaS platform.
>
> ### Database-Driven Configuration
>
> The e-commerce type, available features, UI configuration, enabled modules, terminology, and other
> store-specific behaviour must be controlled through configuration.
>
> These configurations must be stored in the database.
>
> The application must use these configurations to determine how the individual store operates.
>
> For example:
>
> * A Fashion & Apparel configuration should enable the functionality required for a fashion store.
> * An Agriculture & Gardening configuration should enable the functionality required for an agriculture and
>   gardening store.
> * An Electronics configuration should enable the functionality required for an electronics store.
>
> The system must therefore not require a separate application codebase for each e-commerce category.
>
> ### Performance Requirement
>
> The configuration system must not make the website slow or cause lag.
>
> The application should not continuously query the database for configuration values that do not frequently
> change.
>
> Since many configuration values are one-time or infrequently changed, an appropriate mechanism should be used
> to load the configuration efficiently.
>
> The configuration may also be stored in a configurable file on disk after it has been configured, so that the
> application can use the generated configuration instead of repeatedly querying the database.
>
> The architecture should therefore support an approach where:
>
> * Configuration is managed through the database.
> * Configuration can be generated or cached into a local configuration file.
> * The running store can use the generated configuration efficiently.
> * Configuration changes can regenerate or refresh the required configuration.
> * Store performance must remain fast.
>
> ### Category-Specific Store Behaviour
>
> When a store is configured for a specific e-commerce category, the system must automatically provide the
> functionality appropriate for that category.
>
> For example:
>
> **Fashion & Apparel**
>
> If the store is configured as Fashion & Apparel, the frontend, ERP/admin section, and vendor section should
> provide the functionality required for a fashion store.
>
> **Agriculture & Gardening**
>
> If the store is configured as Agriculture & Gardening, the frontend, ERP/admin section, and vendor section
> should provide the functionality required for an agriculture and gardening store.
>
> The same principle must apply to every supported e-commerce category.
>
> The system must therefore support category-specific functionality without creating separate codebases for each
> category.
>
> ### Multiple Site Templates
>
> The SaaS platform must support multiple site/UI templates.
>
> Different e-commerce categories should be able to use different templates.
>
> The templates must not make every client website look identical.
>
> For example, two different clients using the same underlying SaaS platform should be able to have different
> visual designs.
>
> Templates must be configurable and selectable by the Configurable Root Admin.
>
> The architecture must also allow templates to be:
>
> * Added in the future.
> * Removed in the future.
> * Updated in the future.
> * Assigned to different e-commerce categories.
> * Selected for individual stores.
>
> Adding or removing templates must not require creating a separate application codebase for each store.
>
> ### Core Architectural Requirement
>
> The final architecture must separate:
>
> **1. Configurable Root Admin Platform**
>
> This is the management/control system used to configure and deploy individual stores.
>
> It must have its own portal and codebase.
>
> **2. Individual Store Platform**
>
> This is the actual e-commerce system used by the client.
>
> It must operate according to the configuration created by the Configurable Root Admin.
>
> The store users must experience it as a normal e-commerce system specific to their business category.
>
> ### Final Objective
>
> The goal is to build one configurable SaaS e-commerce platform that can be used to create many different types
> of e-commerce websites.
>
> The underlying system must remain generic and reusable, while each deployed store must behave and appear as a
> specific e-commerce business based on its configuration.
>
> The architecture must support:
>
> * Multiple e-commerce categories.
> * Category-specific functionality.
> * Category-specific frontend behaviour.
> * Category-specific ERP/admin functionality.
> * Category-specific vendor functionality.
> * Multiple UI/site templates.
> * Store-specific branding.
> * Store-specific colours and configuration.
> * Database-driven configuration.
> * Efficient runtime configuration.
> * Future addition and removal of e-commerce categories.
> * Future addition and removal of templates.
> * Separate Configurable Root Admin portal and codebase.
> * Individual store-specific experience.
> * High performance without unnecessary repeated database configuration queries.
>
> Do not design the system as a collection of separate e-commerce applications.
>
> Design it as one reusable SaaS e-commerce platform whose behaviour is controlled by store configuration.

## §2. Follow-up instruction, same message (mockup)

> So in plan folder update all things needed for the new architecture so when AI start working on it, it will use
> those and start working on it without asking any questions and at any point I stopped and created a new session
> and asked AI to continue, it will pick from where it stopped. And also add a new configurable root admin html
> mockup in a separate folder inside the project file and don't add any link in the current project's pages, so my
> client will not see it when doing demo.

Recorded as `D-249` (mockup location, not linked from the client-facing mockup) and `D-253` (root-admin screen
inventory P-R01–P-R12).

---

## §3. Numbered requirement list extracted from §1 (for traceability)

Plan files cite these as `SAAS §3 S##`.

| ID | Requirement | Plan home |
|---|---|---|
| S01 | One reusable codebase configured per store; never one application per category | 19 §1, §2 |
| S02 | The 31 listed e-commerce categories (+ combined and the existing TradeX store) must all be reachable by configuration | 19 §6 (vertical packs), `D-241`, `D-255` |
| S03 | Store users (owner, representative admin, vendor, staff, customers) must not see the SaaS layer, other categories, or configuration options that are not theirs | 19 §9 (invisibility rule), `D-229` |
| S04 | A separate Configurable Root Admin platform: separate portal **and** separate codebase | 20 §1, `D-228` |
| S05 | Root admin can create/configure a store | 20 §4, P-R04, P-R05 |
| S06 | Root admin selects the e-commerce type/category for a store | 20 §4 step 2, 19 §6 |
| S07 | Root admin selects the UI/site template | 20 §4 step 3, 19 §7 |
| S08 | Root admin configures colours and other visual settings | 20 §4 step 4, 19 §7.4 |
| S09 | Root admin uploads the store logo | 20 §4 step 4, 19 §7.4 |
| S10 | Root admin configures required features and behaviour | 20 §4 step 5, 19 §5 (capabilities) |
| S11 | Root admin deploys the store | 20 §5 (deployment pipeline), `D-235` |
| S12 | Configuration is stored in the database and drives store behaviour | 19 §3, `D-230` |
| S13 | Configuration must not make the store slow; no repeated DB reads for stable values | 19 §4, `D-248` |
| S14 | Configuration may be generated/cached to a configuration file on disk and used from there | 19 §4.2 (config artefact), `D-231` |
| S15 | Configuration changes regenerate/refresh the configuration | 19 §4.4, `D-232` |
| S16 | Category-specific functionality in the storefront | 19 §6.3, 04a additions |
| S17 | Category-specific functionality in the ERP/admin workspace | 19 §6.4, 04b additions |
| S18 | Category-specific functionality in the vendor section | 19 §6.5, 04c additions |
| S19 | Multiple site/UI templates; clients must not all look the same | 19 §7, `D-242` |
| S20 | Templates can be added, removed, updated, assigned to categories and selected per store, without a new codebase | 19 §7.5, `D-247` |
| S21 | Store-specific branding, colours and configuration | 19 §7.4 |
| S22 | Future addition and removal of e-commerce categories | 19 §6.6, `D-247` |
| S23 | Separation of the two platforms is architectural, not cosmetic | 19 §2, 20 §1 |
| S24 | Each deployed store behaves and appears as a specific business | 19 §8 (store experience contract) |
