# Decision brief — D-105 · Public storefront caching and invalidation mechanism

**Status:** **DECIDED 2026-09-28 — Option C with the §5.1 guest-only simplification**, by the user (technical lead). Recorded in `DECISIONS.md` D-105.
**Approver:** Technical lead (`DECISIONS.md` D-105)
**Prepared:** 2026-09-28
**Blocks:** `T-1A.9-M09-04` (directly); transitively `TS-PERM-05`, `TS-PERF-03`, `TS-SVC-09`, `T22`, and the cache
policy recorded by `T-1A.3-M09-03` in `frontend/storefront/`
**Independent of:** `D-001` / `D-002` (the operational core). This decision can be recorded before the Phase 0
proof runs, and it is the highest-leverage page-speed decision in the plan.

> **Records location.** `D-210` (DECIDED) keeps Phase 0 records in `plan/phase0/`. The full folder layout
> (`discovery/`, `audit/`, `ui/`, `proof/`, `estimate/`, `signoff/`) is created by `T-0-M01-01`; this brief creates
> only `decision-briefs/`.

---

## 1. Why this brief is narrower than the D-105 row suggests

The `DECISIONS.md` D-105 row was written on 2026-09-27, **before** `D-268` (2026-09-28). `D-268` already decided the
*cache model*: five layers, their contents, their key composition and their invalidation triggers
(`19-saas-platform.md` §25.4), plus the data-access and rendering rules of §25.3 and §25.5.

So D-105 no longer asks "what do we cache and how do we invalidate it". **It asks only: by which mechanism, and
where does public HTML caching physically happen.** Sections 2–3 below are already binding and buildable today;
section 4 is the genuine remaining choice.

---

## 2. Already binding — build against this now, no decision needed

### 2.1 The five cache layers (`D-268`, `19` §25.4)

| Layer | Contents | Key includes | Invalidated by |
|---|---|---|---|
| 1. In-process snapshot | Configuration, capabilities, terminology, navigation, catalog schema | store | Publish (`19` §4.4) |
| 2. CDN / edge | Static assets, `theme.css`, images | content hash | Never — filenames are immutable |
| 3. CDN / edge | **Public storefront HTML** | store + route + buyer-context class + config version | Publish, catalog publish, price publish |
| 4. Shared cache | Read models, projections, search results, serviceability | **store** + entity + version | Write to the underlying entity |
| 5. Per request | Memoised lookups inside one request | request | End of request |

**Layer 3 is the only layer D-105 still has to choose a mechanism for.** Layers 1, 2, 4 and 5 are fully specified.

### 2.2 Non-negotiable rules (`D-268` `BR-M30-09`; BP §16.5, §8.4)

1. **Every cache key contains the store.** A key that forgets it is both a leak and a correctness bug.
2. **Private or buyer-specific data never enters a shared cache.**
3. **Cached HTML is only ever public content — never a signed-in page.**
4. **Stampede protection** on every expensive rebuild.
5. `Cache-Control: private, no-store` on **every** response that depends on buyer context (`06-api` §1.11).
6. Public projections carry a **version/timestamp** so stale data is detectable (`BR-M04-20`, `BR-M06-18`,
   `BR-M21-03`).
7. On **sign-out and on membership loss**, all client-held private data (dealer prices, quotes, cart prices,
   orders, addresses) is discarded and pages refetch as guest (`04a` §1.4 rule 5, `BR-M02-13`).
8. Dealer-context HTML is **never shared-cached and never indexable** (`BR-M27-02`).
9. **Read models on hot paths** (`19` §25.3 rule 5): the storefront product and category projections are
   maintained projections, not an eight-table join per request.
10. **Server-rendered HTML streamed for first paint, interactivity hydrated only where needed** (`19` §25.5). A
    product page never boots a full client application to show text and a price.
11. `theme.css` is static, hashed, `Cache-Control: public, max-age=31536000, immutable` (`D-248`).

### 2.3 Rendering class per page (`02-architecture` §4.2, `04a` §1.3)

| Page | Class |
|---|---|
| P-S01 Home, P-S02 Category & search, P-S03 Product detail, P-S04 Certified refurbished, P-S05 Compare (D-042), P-S13 Help & policies, P-S11 **landing only** | Public, server-rendered, shared-cacheable |
| Dealer price and tiers, saved delivery PIN, PIN serviceability and delivery estimate, signed-in dealer home modules | **Private islands** — fetched with the session, never baked into shared HTML |
| P-S06 Cart, P-S07 Checkout, P-S08 Order confirmation, P-S09 My account, P-S10 Returns & warranty, P-S11 dealer area, P-S12 Sign in / register | Fully private, `private, no-store` |

### 2.4 Budgets this mechanism must meet (`D-268` §25.2, `D-034`)

| Metric | Budget |
|---|---|
| Storefront HTML time to first byte p95 | **≤ 200 ms cached · ≤ 500 ms uncached** |
| Storefront LCP p75 (mid-range mobile, throttled) | ≤ 2.0 s |
| Storefront INP p75 / CLS | ≤ 200 ms / ≤ 0.1 |
| JavaScript shipped on a product page | ≤ 150 KB compressed |
| Database queries per page render | ≤ 12, asserted per route |
| Stock movement → browse display propagation | ≤ 60 s (starting proposal, `D-034`) |

Asserted in CI on realistic data volumes (`D-010`) **with two stores present**. A pull request that breaks a budget
fails like a failing test.

---

## 3. What is genuinely still open

1. **Where layer-3 public HTML caching physically happens** — framework cache, CDN edge, or both.
2. **The invalidation transport** — on-demand tag/surrogate-key purge, TTL only, or purge plus a safety TTL.
3. **How the buyer-context class in the layer-3 key is derived at the caching point.** §25.4 mandates that the key
   contains it; it does not say how it is computed. *This is where a T22 leak would come from.*
4. **How ≤ 60 s stock freshness is achieved** without purging whole pages on every stock movement.

---

## 4. Options

### Option A — Projection-only caching (no shared HTML cache)

Cache layers 1, 2, 4, 5 only. Every storefront HTML response is rendered per request from read-model projections.
Public HTML is not edge-cached.

| | |
|---|---|
| **For** | T22 leak risk structurally near zero; simplest possible invalidation; no buyer-context class at any shared cache; nothing to configure in `infra/` |
| **Against** | The ≤ 200 ms cached TTFB budget has no cached class to apply to, so every request pays origin cost; no spike absorption; highest origin and database load; SEO crawl budget spent on dynamic renders |
| **Budget risk** | Meets ≤ 500 ms uncached if projections are fast; **fails to exploit** the ≤ 200 ms cached target |

### Option B — Framework cache only (Next.js full-route cache / ISR + cache tags)

Public routes cached inside the application; on-demand revalidation by tag on publish, catalog-publish and
price-publish events; private and dealer routes always dynamic.

| | |
|---|---|
| **For** | One mechanism, in one codebase and one language; tags map cleanly onto the `config.published` / catalog / price events; the buyer-context class is computed where the session is already known, which is the safest place; no CDN surrogate-key taxonomy to maintain |
| **Against** | The cache is per-instance unless a **shared cache handler** is configured — on a shared multi-store runtime that means inconsistent HTML between instances; still an origin round trip, so no edge offload; ties the cache lifecycle to the framework version (`D-003` pinning) |
| **Budget risk** | Comfortably meets ≤ 500 ms; meets ≤ 200 ms only for origin-local traffic, not globally |

### Option C — CDN edge HTML cache with surrogate keys, framework cache behind it *(recommended, see §5)*

Public HTML cached at the edge, keyed `store + route + buyer-context class + config version`; surrogate-key purge
on publish / catalog publish / price publish; availability rendered as a hydrated island so stock freshness never
requires a page purge; everything buyer-specific is `private, no-store` and never reaches the edge.

| | |
|---|---|
| **For** | The only option that meets ≤ 200 ms cached TTFB for anonymous and crawler traffic — which is most storefront traffic; absorbs spikes and bulk-import load; matches §25.4 layer 3 verbatim; stock freshness solved by islands rather than purge storms |
| **Against** | Two mechanisms to keep coherent; requires a disciplined surrogate-key taxonomy; a mis-derived buyer-context class at the edge is a private-price leak — which is exactly why `TS-PERM-05.2` explicitly covers "incl. CDN/shared cache" |
| **Budget risk** | Meets every budget; carries the highest correctness burden, mitigated by §5.2 |
| **Prerequisite** | `D-033` must name a CDN that supports **surrogate keys / tag-based purge** and per-store cache segmentation. Feed this requirement into D-033 |

---

## 5. Recommendation

**Option C, with one deliberate simplification: only the `guest` class is ever edge-cached.**

### 5.1 The simplification

The layer-3 buyer-context class takes exactly **two** values at the edge:

| Class | Determined by | Treatment |
|---|---|---|
| `guest` | No session cookie present | Edge-cacheable |
| everything else (consumer, dealer, staff) | Session cookie present | **Cache bypass** — origin renders, `private, no-store` |

This is a narrowing of what §25.4 permits, not a contradiction of it. Its value is that **a private price can never
enter the edge cache by construction**, because no signed-in response is ever eligible for it — so T22 stops being a
configuration question and becomes a structural guarantee. The cost is that signed-in dealers get uncached TTFB
(≤ 500 ms), which is the correct trade: dealers are a small, authenticated, latency-tolerant population, and
anonymous browsing plus crawling is the traffic the ≤ 200 ms budget exists for.

### 5.2 Controls that make Option C safe

1. The cache-key/bypass rule lives in **one** place in `infra/` (edge configuration), reviewed as security-relevant
   code, not spread across route handlers.
2. `Vary` is never relied upon for private isolation — **cookie presence drives bypass**, before any key lookup.
3. Origin responses assert their own class: any response with buyer context carries `private, no-store`, so an edge
   misconfiguration still cannot cache it (belt and braces).
4. Availability, dealer price, tiers and PIN serviceability are **islands** fetched with the session — never in
   shared HTML (§2.2 rule 2, `04a` §1.3).
5. `TS-PERM-05.2` runs against the real shared cache, not only against the origin.
6. Surrogate-key taxonomy: `store:<key>`, `product:<id>`, `category:<id>`, `price-book:<id>`, `config:v<N>` —
   purged by the publish events of `19` §4.4 and `BR-M04-20`.
7. A short safety TTL behind tag purge, so a dropped purge degrades to staleness bounded by the TTL rather than
   serving stale content indefinitely.

### 5.3 How ≤ 60 s stock propagation is met

Stock does **not** purge pages. The availability projection (`A04`, `T-1A.6-M06-03`) is layer 4, keyed
`store + entity + version`; the storefront renders availability as an island reading that projection with its
`as_of` timestamp. A stock movement invalidates the projection entry only. Page HTML keeps its own, slower
invalidation (publish events). This is what keeps `TS-PERF-03` achievable without purge storms, and it is why
"Only N left" wording comes from real ATP (`BR-M04-18`) rather than from cached HTML.

---

## 6. Interactions to respect

| Decision | Interaction |
|---|---|
| `D-033` (object storage & CDN, OPEN) | Option C requires surrogate-key/tag purge support. **Decide D-105 first, then constrain D-033.** |
| `D-003` (storefront framework, PROPOSED-DEFAULT) | Options B and C both assume server-rendered HTML with hydrated islands |
| `D-083` (cookie/session scope) | Defines the cookie whose presence drives the §5.1 bypass |
| `D-102` (hostnames / deployables) | Edge configuration is per hostname |
| `D-163` (route scheme) | Determines which routes are cacheable classes |
| `D-113` (image variants) | Layer 2; independent of this choice |
| `D-032` (search) | Search results are layer 4, not layer 3 |
| `D-034` (targets) | Supplies the ≤ 60 s propagation figure |

---

## 7. Recording — done 2026-09-28

Per `DECISIONS.md` → *How to record a decision*, all five steps are applied:

1. ✅ `DECISIONS.md` D-105 → `DECIDED`, value recorded with approver and date.
2. ✅ `STATE.md` → *Decisions log*, *Files changed* and *Session log* updated.
3. ✅ `TASKS.md` → `T-1A.9-M09-04` **and** `T-1A.9-M09-13` moved `REQUIRES_DECISION` → `NOT_STARTED`.
   `T-1A.3-M09-03` keeps its cache-policy deliverable.
4. ✅ Plan files updated: `02-architecture.md` §4.2, `04a-frontend-storefront.md` §1.3 rows,
   `01-tech-stack.md` §2 and §16.
5. ✅ `D-033` gained the surrogate-key / per-store-segmentation requirement.

**Implementation entry points:** `T-1A.9-M09-04` (rendering classes, cache headers, invalidation, sign-out purge) and `T-1A.9-M09-13` (read models, the five layers, per-route query budgets). Both sit in stage 1A.9, behind the Phase 0 exit gate — §2 of this brief is what to build against when that opens.
