# Configurable Root Admin — clickable mockup (internal)

**Do not link this folder from anything the client sees.** No page in `index.html`, the prototype toolbar,
`credits.html` or any `store-*.html`, `erp-*.html` or `vendor-*.html` may point here (decision **D-249**,
invisibility rule **INV-8** in `plan/19-saas-platform.md` §9). Every page here carries
`<meta name="robots" content="noindex,nofollow,noarchive,nosnippet">`.

The repository root is published by GitHub Pages (`CNAME`), so this folder is **reachable by URL** even though
nothing links to it. That is recorded as a known issue in `plan/STATE.md`; decision **D-115** settles whether it
stays inside the published site.

## What this is

A clickable prototype of the Configurable Root Admin — the control plane of the SaaS commerce platform, where a
store is created, given an e-commerce category, given a site template, branded, feature-configured and deployed.

- Specification: `plan/20-root-admin.md` (screens, roles, configurator, deployment pipeline, API)
- Architecture: `plan/19-saas-platform.md` (tenancy, configuration, capabilities, packs, templates)
- Source requirement: `docs/SAAS_ARCHITECTURE_CHANGE.md`
- Screen inventory: decision **D-253**

## Screens

| ID | File | Screen |
|---|---|---|
| — | `index.html` | Internal overview of this prototype (not a product screen) |
| P-R01 | `ra-login.html` | Platform sign-in with mandatory two-step verification |
| P-R02 | `ra-dashboard.html` | Platform dashboard: fleet state, attention queue, health |
| P-R03 | `ra-stores.html` | Store registry with filters, saved views and bulk actions |
| P-R04 | `ra-store-new.html` | Create-store wizard — the six steps of the brief |
| P-R05 | `ra-store.html` | Store detail: category, template, branding, features, settings, wording, domains, versions, deployments, users, support access, audit, danger zone |
| P-R06 | `ra-packs.html` | E-commerce categories (vertical packs) and the full list of 31 |
| P-R07 | `ra-templates.html` | Site templates, versions, compatibility and lifecycle |
| P-R08 | `ra-capabilities.html` | Capability registry, cross-store matrix, enforcement rules |
| P-R09 | `ra-terminology.html` | Wording per category and language, with a coverage report |
| P-R10 | `ra-deployments.html` | Deployment runs, the nine-step machine, published configurations |
| P-R11 | `ra-admin.html` | Platform people, roles, support access, record of actions |
| P-R12 | `ra-settings.html` | Platform settings, fleet health, storage, certificates, alerts |

`assets/ra.css` and `assets/ra.js` are self-contained: this prototype does **not** use the store mockup's
`assets/tradex.css` or `assets/tradex.js`, and its visual identity is deliberately different so the two are never
confused.

## Reading it

- Start at `index.html`, or go straight to `ra-login.html` → `ra-dashboard.html`.
- The clearest walkthrough of the architecture is `ra-store-new.html`: it is the brief's own Fashion & Apparel
  example, step by step.
- Buttons that only demonstrate an action show a short explanation instead of doing something.

## Sample values are not requirements

Store names, colours, counts, dates, category versions and template names beyond `VP-electronics`,
`VP-fashion_apparel`, `TPL-forge` and `TPL-aurora` are illustrative. The same rule as the store mockup:
`plan/00-conventions.md` §1.1 and §1.3.
