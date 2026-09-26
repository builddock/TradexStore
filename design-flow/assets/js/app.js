/* ==========================================================================
   TradexStore — prototype shell
   Renders the shared chrome, owns the cart store, and drives each page.
   Plain ES2017, no dependencies, works straight from the file system.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- utils */

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function icon(name, cls) {
    return '<span class="ms ' + (cls || '') + '" aria-hidden="true">' + name + '</span>';
  }

  var LOGO_SRC = 'assets/img/logo-tradex-full.png';
  var LOGO_W = 140;   // 279 x 60 source, rendered at 30px tall
  var LOGO_H = 30;

  function brandLogo() {
    return '<img class="brand-logo" src="' + LOGO_SRC + '" alt="TradexStore" ' +
      'width="' + LOGO_W + '" height="' + LOGO_H + '">';
  }

  function money(n) {
    return '$' + Number(n || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function stars(rating) {
    var out = '';
    var full = Math.floor(rating + 0.001);
    var half = rating - full >= 0.4;
    var i;
    for (i = 0; i < 5; i++) {
      if (i < full) out += icon('star', 'ms-fill');
      else if (i === full && half) out += icon('star_half', 'ms-fill');
      else out += icon('star');
    }
    return out;
  }

  /* ------------------------------------------------------------ cart store */

  var STORE_KEY = 'tradexstore.cart.v2';
  var TAX_RATE = 0.0725;
  var COUPON = { code: 'TRADEX10', amount: 20 };

  function seedCart() {
    return CART_SEED.map(function (l) {
      return {
        sku: l.sku, img: l.img, name: l.name, meta: l.meta,
        serial: l.serial, price: l.price, qty: l.qty, flag: l.flag,
        flagText: l.flagText, flagKind: l.flagKind
      };
    });
  }

  var cart = (function () {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length) return parsed;
      }
    } catch (e) { /* storage unavailable — fall through to seed */ }
    return { items: seedCart(), coupon: true, shipping: 'free' };
  })();

  function saveCart() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }

  function totals() {
    var subtotal = cart.items.reduce(function (sum, l) { return sum + l.price * l.qty; }, 0);
    var units = cart.items.reduce(function (sum, l) { return sum + l.qty; }, 0);
    // a voucher can never discount more than the cart is actually worth
    var discount = cart.coupon && subtotal > 0 ? Math.min(COUPON.amount, subtotal) : 0;
    var shipping = 0;
    var taxed = Math.max(0, subtotal - discount);
    var tax = Math.round(taxed * TAX_RATE * 100) / 100;
    return {
      lines: cart.items.length,
      units: units,
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      tax: tax,
      total: taxed + shipping + tax
    };
  }

  function addToCart(line) {
    var existing = cart.items.filter(function (l) { return l.sku === line.sku; })[0];
    if (existing) existing.qty += line.qty || 1;
    else cart.items.push({
      sku: line.sku, img: line.img, name: line.name, meta: line.meta || '',
      serial: line.serial || line.sku, price: line.price, qty: line.qty || 1,
      flag: 'IN STOCK', flagText: 'Added to staging', flagKind: 'ok'
    });
    saveCart();
    syncCartUI();
    toast(line.name + ' added to the tech bag');
  }

  function syncCartUI() {
    var t = totals();
    $$('[data-cart-count]').forEach(function (n) { n.textContent = t.lines; });
    $$('[data-cart-total]').forEach(function (n) { n.textContent = money(t.total); });
    $$('[data-cart-subtotal]').forEach(function (n) { n.textContent = money(t.subtotal); });
    // Panels that depend on cart totals register a __render hook when mounted.
    $$('[data-summary-root], #summary-root, [data-threshold-root], #threshold-root')
      .forEach(function (n) { if (n.__render) n.__render(); });
  }

  /* ---------------------------------------------------------------- toast */

  var toastTimer;
  function toast(msg) {
    var node = $('#toast');
    if (!node) {
      node = document.createElement('div');
      node.id = 'toast';
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      document.body.appendChild(node);
    }
    node.textContent = msg;
    node.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { node.classList.remove('is-on'); }, 2600);
  }

  /* --------------------------------------------------------------- chrome */

  function chromeHTML(page) {
    var nav = NAV_LINKS.map(function (l) {
      var active = l.href === page || (page === 'home' && l.href === 'home.html');
      return '<a href="' + l.href + '"' + (active ? ' class="is-active"' : '') + '>' + esc(l.label) + '</a>';
    }).join('');

    var drawerNav = NAV_LINKS.map(function (l) {
      var active = l.href === page;
      return '<a href="' + l.href + '"' + (active ? ' class="is-active"' : '') + '>' +
        esc(l.label) + icon('arrow_forward', 'ms-sm') + '</a>';
    }).join('');

    var utility = UTILITY_ITEMS.map(function (u) {
      return '<span class="u-item' + (u.hideSm ? ' u-hide-sm' : '') + '">' + icon(u.icon, 'ms-sm') +
        '<span>' + (u.text ? '<strong class="u-lead">' + esc(u.lead) + '</strong> ' + esc(u.text) : esc(u.lead)) +
        '</span></span>';
    }).join('');

    var footerCols = FOOTER_COLS.map(function (c) {
      return '<div class="footer-col"><h3>' + esc(c.title) + '</h3><ul>' +
        c.links.map(function (l) { return '<li><a href="index.html">' + esc(l) + '</a></li>'; }).join('') +
        '</ul></div>';
    }).join('');

    var header =
      '<div class="utility-bar"><div class="container">' + utility + '</div></div>' +

      '<header class="site-header"><div class="container header-inner">' +

        '<button class="btn-icon menu-toggle" type="button" data-drawer-open aria-label="Open navigation">' +
          icon('menu', 'ms-lg') + '</button>' +

        '<a class="brand" href="home.html" aria-label="TradexStore home">' +
          brandLogo() +
        '</a>' +

        '<button class="sys-pill" type="button">All Systems' + icon('expand_more', 'ms-sm') + '</button>' +

        '<div class="field header-search" role="search">' +
          icon('search', 'ms-sm') +
          '<input type="search" id="global-search" placeholder="Search hardware, SKUs, specs…" aria-label="Search catalogue">' +
          '<span class="kbd">&#8984;K</span>' +
        '</div>' +

        '<nav class="main-nav" aria-label="Primary">' + nav + '</nav>' +

        '<div class="header-actions">' +
          '<button class="btn-icon act-currency" type="button" aria-label="Currency: US Dollar">' + icon('currency_exchange') + '</button>' +
          '<button class="btn-icon icon-badge act-orders" type="button" aria-label="Orders">' + icon('package_2') + '</button>' +
          '<button class="btn-icon icon-badge act-wish" type="button" aria-label="Wishlist">' +
            icon('favorite') + '<span class="count">4</span>' +
          '</button>' +
          '<a class="cart-button" href="cart.html" aria-label="Tech bag">' +
            '<span class="cart-icon icon-badge">' + icon('shopping_bag') +
              '<span class="count" data-cart-count>3</span></span>' +
            '<span class="cart-total"><span>Total</span><span data-cart-total>$404.43</span></span>' +
          '</a>' +
          '<button class="avatar-button" type="button" aria-label="Account">' +
            '<img src="assets/img/avatar.png" alt="" width="40" height="40">' +
          '</button>' +
        '</div>' +

      '</div></header>';

    var footer =
      '<footer class="site-footer">' +
        '<div class="container footer-main">' +
          '<div>' +
            '<div class="footer-brand-row">' +
              brandLogo() +
              '<span class="badge badge-light">SPEC LAB 2.4</span>' +
            '</div>' +
            '<p class="footer-text" style="margin-top:0.75rem">Engineered IT infrastructure, competition-grade mechanical ' +
            'inputs, and calibrated battlestation hardware for developers, makers, and enthusiasts.</p>' +
            '<form class="subscribe" data-subscribe>' +
              '<label class="field" style="flex:1 1 auto">' +
                '<span class="sr-only">Email</span>' +
                '<input type="email" placeholder="Enter engineering email for drops…" required>' +
              '</label>' +
              '<button class="btn btn-primary" type="submit">Subscribe</button>' +
            '</form>' +
          '</div>' +
          footerCols +
        '</div>' +
        '<div class="container footer-bar">' +
          '<span>&copy; 2025 TRADEXSTORE TECHNOLOGIES INC. ALL RIGHTS RESERVED.</span>' +
          '<span class="status-online">' + icon('check_circle', 'ms-sm') + 'SYSTEM STATUS: OPTIMAL &nbsp; NODE: US-CENTRAL-1</span>' +
        '</div>' +
      '</footer>';

    var drawer =
      '<div class="drawer-scrim" data-drawer-close></div>' +
      '<aside class="drawer" id="site-drawer" aria-hidden="true" aria-label="Navigation">' +
        '<div class="row">' +
          brandLogo() +
          '<button class="btn-icon spacer" type="button" data-drawer-close aria-label="Close navigation">' +
            icon('close', 'ms-lg') + '</button>' +
        '</div>' +
        '<label class="field">' + icon('search', 'ms-sm') +
          '<input type="search" placeholder="Search hardware…" aria-label="Search catalogue">' +
        '</label>' +
        '<nav>' + drawerNav + '</nav>' +
        '<div class="stack-sm">' +
          '<span class="t-eyebrow">Dispatch</span>' +
          '<p class="t-body-sm t-muted">Orders placed before 16:00 EST ship same-day from the Austin hub.</p>' +
        '</div>' +
        '<a class="btn btn-primary btn-block" href="cart.html">Review tech bag &bull; ' +
          '<span data-cart-total>$404.43</span></a>' +
      '</aside>';

    return { header: header, footer: footer, drawer: drawer };
  }

  function mountChrome() {
    var page = document.body.getAttribute('data-page') || '';
    var parts = chromeHTML(page);

    var headerHost = $('#chrome-header');
    if (headerHost) headerHost.innerHTML = parts.header;

    var footerHost = $('#chrome-footer');
    if (footerHost) footerHost.innerHTML = parts.footer;

    var drawerHost = $('#chrome-drawer');
    if (drawerHost) drawerHost.innerHTML = parts.drawer;

    wireDrawer();
    wireGlobal();
    syncCartUI();
  }

  function wireDrawer() {
    var drawer = $('#site-drawer');
    var scrim = $('.drawer-scrim');
    if (!drawer) return;

    function setOpen(open) {
      drawer.classList.toggle('is-open', open);
      if (scrim) scrim.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    $$('[data-drawer-open]').forEach(function (b) {
      b.addEventListener('click', function () { setOpen(true); });
    });
    $$('[data-drawer-close]').forEach(function (b) {
      b.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  function wireGlobal() {
    // cmd/ctrl + K focuses search
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === 'k') {
        var input = $('#global-search');
        if (input) { e.preventDefault(); input.focus(); input.select(); }
      }
    });

    // wishlist hearts
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-wish]');
      if (!btn) return;
      e.preventDefault();
      var on = btn.classList.toggle('is-on');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (btn.classList.contains('media-action')) {
        btn.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + (btn.getAttribute('aria-label') || '').replace(/^(Save|Remove) /, ''));
      }
      toast(on ? 'Saved to wishlist' : 'Removed from wishlist');
    });

    // newsletter
    var sub = $('[data-subscribe]');
    if (sub) {
      sub.addEventListener('submit', function (e) {
        e.preventDefault();
        toast('Subscribed — drop alerts armed for this address');
        sub.reset();
      });
    }

    // prototype-only affordances
    var demoMessages = [
      ['data-demo-audio', 'Acoustic sample playback is not wired in this prototype'],
      ['data-demo-review', 'Evaluation form opens in the production build'],
      ['data-demo-link', 'External document — not included in this prototype']
    ];
    demoMessages.forEach(function (pair) {
      document.addEventListener('click', function (e) {
        var hit = e.target.closest('[' + pair[0] + ']');
        if (hit) { e.preventDefault(); toast(pair[1]); }
      });
    });
  }

  /* ---------------------------------------------------------- product card */

  function productCard(p) {
    var flags = (p.flags || []).map(function (f) {
      return '<span class="badge badge-primary">' + esc(f) + '</span>';
    }).join('');

    var specs = (p.specs || []).map(function (s) {
      return '<span class="spec-pill">' + esc(s) + '</span>';
    }).join('');

    var stockCls = p.stockKind === 'warn' ? 'stock-note is-warn' : 'stock-note';

    return '' +
      '<article class="product-card">' +
        '<div class="media">' +
          '<div class="media-badge">' + flags + '</div>' +
          '<button class="media-action" type="button" data-wish aria-label="Save ' + esc(p.name) + '">' +
            icon('favorite', 'ms-sm') + '</button>' +
          '<img src="' + p.img + '" alt="' + esc(p.alt) + '" loading="lazy" width="512" height="279">' +
        '</div>' +
        '<div class="product-meta">' +
          '<span class="product-brand">' + esc(p.brand) + '</span>' +
          '<span class="rating">' + stars(p.rating) + '<strong>' + p.rating.toFixed(1) + '</strong>' +
            '<span class="t-dim">(' + p.reviews + ')</span></span>' +
        '</div>' +
        '<h3 class="product-title">' + esc(p.name) + '</h3>' +
        '<p class="product-desc clamp-2">' + esc(p.blurb) + '</p>' +
        '<div class="spec-list">' + specs + '</div>' +
        '<div class="product-foot">' +
          '<div class="price-block">' +
            '<span class="price">' + money(p.price) + '</span>' +
            (p.compareAt ? '<span class="price-strike">' + money(p.compareAt) + '</span>' : '') +
          '</div>' +
          '<button class="btn btn-primary btn-sm" type="button" data-add="' + esc(p.sku) + '">' +
            icon('shopping_cart', 'ms-sm') + 'Deploy</button>' +
        '</div>' +
        '<span class="' + stockCls + '">' + (p.stockKind === 'warn' ? icon('timer', 'ms-sm') : icon('check_circle', 'ms-sm')) +
          esc(p.stock) + '</span>' +
      '</article>';
  }

  function wireAddButtons(root) {
    $$('[data-add]', root || document).forEach(function (btn) {
      if (btn.__wired) return;
      btn.__wired = true;
      btn.addEventListener('click', function () {
        var sku = btn.getAttribute('data-add');
        // A deal card carries its own imagery, copy and discount pricing, so it wins
        // over the catalogue entry that may share the same SKU.
        var deal = DEALS.filter(function (d) { return d.sku === sku; })[0];
        if (deal) {
          addToCart({ sku: deal.sku, img: deal.img, name: deal.name, meta: deal.specs.join(' • '), serial: deal.sku, price: deal.price, qty: 1 });
          return;
        }
        var p = PRODUCT_BY_SKU[sku];
        if (p) {
          addToCart({ sku: p.sku, img: p.img, name: p.name, meta: p.specs ? p.specs.join(' • ') : '', serial: p.sku, price: p.price, qty: 1 });
        }
      });
    });
  }

  /* ============================== HOME ==================================== */

  function initHome() {
    var heroRoot = $('#hero-root');
    if (heroRoot) {
      heroRoot.innerHTML =
        '<div class="hero"><div class="hero-inner">' +
          '<div>' +
            '<div class="row row-wrap" style="gap:0.5rem">' +
              '<span class="badge badge-primary">' + icon('bolt', 'ms-sm') + esc(HERO.eyebrow) + '</span>' +
              '<span class="t-mono-sm t-dim">' + esc(HERO.sysId) + '</span>' +
            '</div>' +
            '<h1 class="t-display hero-title">' + esc(HERO.titleLead) +
              '<span class="accent">' + esc(HERO.titleAccent) + '</span></h1>' +
            '<p class="t-body-lg hero-copy">' + esc(HERO.copy) + '</p>' +
            '<div class="hero-actions">' +
              '<a class="btn btn-primary btn-lg" href="product.html">Explore Drop' + icon('arrow_forward', 'ms-sm') + '</a>' +
              '<a class="btn btn-secondary btn-lg" href="catalog.html">' + icon('tune', 'ms-sm') + 'Configure Core Specs</a>' +
              '<span class="hero-note"><span class="dot"></span>' + esc(HERO.note) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="hero-visual">' +
            '<div class="media">' +
              '<span class="badge badge-light hero-float">' + icon('thermostat', 'ms-sm') + esc(HERO.float) + '</span>' +
              '<img src="' + HERO.img + '" alt="' + esc(HERO.alt) + '" width="512" height="279" fetchpriority="high">' +
            '</div>' +
            '<div class="hero-specs">' +
              HERO.specs.map(function (s) {
                return '<div class="spec-tile"><span class="k">' + esc(s.k) + '</span>' +
                  '<div class="v">' + esc(s.v) + '</div><div class="s">' + esc(s.s) + '</div></div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div></div>';
    }

    var catRoot = $('#categories-root');
    if (catRoot) {
      catRoot.innerHTML = CATEGORIES.map(function (c) {
        return '<a class="category-card" href="catalog.html">' +
          '<div class="media"><img src="' + c.img + '" alt="' + esc(c.alt) + '" loading="lazy" width="512" height="279"></div>' +
          '<div><div class="category-name">' + esc(c.name) + '</div>' +
          '<div class="category-count">' + esc(c.count) + '</div></div>' +
        '</a>';
      }).join('');
    }

    var dealRoot = $('#deals-root');
    if (dealRoot) {
      dealRoot.innerHTML = DEALS.map(function (d) {
        return '<article class="product-card">' +
          '<div class="media">' +
            '<span class="badge badge-primary media-badge" style="position:absolute;top:0.625rem;left:auto;right:0.625rem">' +
              esc(d.discount) + '</span>' +
            '<img src="' + d.img + '" alt="' + esc(d.alt) + '" loading="lazy" width="512" height="279">' +
          '</div>' +
          '<span class="t-mono-sm t-dim">' + d.specs.map(esc).join(' &bull; ') + '</span>' +
          '<h3 class="product-title">' + esc(d.name) + '</h3>' +
          '<p class="product-desc clamp-2">' + esc(d.blurb) + '</p>' +
          '<div class="product-foot">' +
            '<div class="price-block">' +
              '<span class="price">' + money(d.price) + '</span>' +
              '<span class="price-strike">' + money(d.compareAt) + '</span>' +
            '</div>' +
          '</div>' +
          '<button class="btn btn-primary btn-block btn-sm" type="button" data-add="' + esc(d.sku) + '">' +
            icon('shopping_cart', 'ms-sm') + 'Claim Unit</button>' +
        '</article>';
      }).join('');
      wireAddButtons(dealRoot);
    }

    var showRoot = $('#showcase-root');
    if (showRoot) {
      var spots = SHOWCASE.hotspots.map(function (h, i) {
        return '<button class="hotspot" type="button" style="left:' + h.x + '%;top:' + h.y + '%" ' +
          'aria-expanded="false" data-hotspot="' + i + '" aria-label="' + esc(h.name) + '">' +
          icon('add', 'ms-sm') + '</button>' +
          '<div class="hotspot-card" data-hotspot-card="' + i + '" style="left:' + h.x + '%;top:calc(' + h.y + '% + 32px)">' +
            '<span class="lab">' + esc(h.label) + '</span>' +
            '<div class="nm">' + esc(h.name) + '</div>' +
            '<div class="pr">' + esc(h.price) + '</div>' +
          '</div>';
      }).join('');

      showRoot.innerHTML =
        '<div class="showcase">' +
          '<div class="showcase-media">' +
            '<img src="' + SHOWCASE.img + '" alt="' + esc(SHOWCASE.alt) + '" loading="lazy" width="512" height="279"' +
              ' style="width:100%;height:auto">' +
            spots +
          '</div>' +
          '<div class="showcase-bar">' +
            '<span class="grp">' + icon('check_circle', 'ms-sm') + 'All 5 Components in Stock</span>' +
            '<span class="grp">' + icon('architecture', 'ms-sm') + 'Acoustically Dampened Profile</span>' +
            '<a class="link-arrow spacer" href="product.html">Explore Sound Test &amp; Spec Sheet' + icon('volume_up', 'ms-sm') + '</a>' +
          '</div>' +
        '</div>';

      $$('[data-hotspot]', showRoot).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-hotspot');
          var card = $('[data-hotspot-card="' + id + '"]', showRoot);
          var open = btn.getAttribute('aria-expanded') === 'true';
          $$('[data-hotspot]', showRoot).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
          $$('[data-hotspot-card]', showRoot).forEach(function (c) { c.classList.remove('is-open'); });
          if (!open) {
            btn.setAttribute('aria-expanded', 'true');
            if (card) card.classList.add('is-open');
          }
        });
      });
    }

    var trendRoot = $('#trending-root');
    if (trendRoot) {
      trendRoot.innerHTML = TRENDING_TABS.map(function (t) {
        return '<button class="tab" type="button" data-tab="' + t.id + '">' + esc(t.label) + '</button>';
      }).join('');

      function paint(id) {
        $$('[data-tab]', trendRoot).forEach(function (b) {
          b.classList.toggle('is-active', b.getAttribute('data-tab') === id);
        });
        var tab = TRENDING_TABS.filter(function (t) { return t.id === id; })[0] || TRENDING_TABS[0];
        var host = $('#trending-grid');
        host.innerHTML = tab.skus
          .map(function (sku) { return PRODUCT_BY_SKU[sku]; })
          .filter(Boolean)
          .map(productCard)
          .join('');
        wireAddButtons(host);
        wireWish(host);
      }

      $$('[data-tab]', trendRoot).forEach(function (b) {
        b.addEventListener('click', function () { paint(b.getAttribute('data-tab')); });
      });
      paint(TRENDING_TABS[0].id);
    }

    var stripRoot = $('#trust-strip-root');
    if (stripRoot) {
      stripRoot.innerHTML = TRUST_STRIP.map(function (f) {
        return '<div class="feature"><span class="icon-tile">' + icon(f.icon, 'ms-lg') + '</span>' +
          '<div><div class="feature-title">' + esc(f.title) + '</div>' +
          '<p class="feature-text">' + esc(f.text) + '</p></div></div>';
      }).join('');
    }

    var rowRoot = $('#trust-row-root');
    if (rowRoot) {
      rowRoot.innerHTML = TRUST_ROW.map(function (f) {
        return '<div class="feature"><span class="icon-tile">' + icon(f.icon, 'ms-lg') + '</span>' +
          '<div><div class="feature-title">' + esc(f.title) + '</div>' +
          '<p class="feature-text">' + esc(f.text) + '</p></div></div>';
      }).join('');
    }

    startCountdown();
  }

  function startCountdown() {
    var h = $('#cd-h'), m = $('#cd-m'), s = $('#cd-s');
    if (!h || !m || !s) return;

    var remaining = 4 * 3600 + 17 * 60 + 9;
    function tick() {
      remaining = remaining > 0 ? remaining - 1 : 4 * 3600 + 17 * 60 + 9;
      var hh = Math.floor(remaining / 3600);
      var mm = Math.floor((remaining % 3600) / 60);
      var ss = remaining % 60;
      h.textContent = String(hh).padStart(2, '0');
      m.textContent = String(mm).padStart(2, '0');
      s.textContent = String(ss).padStart(2, '0');
    }
    tick();
    window.setInterval(tick, 1000);
  }

  function wireWish(root) {
    // handled by the delegated document listener in wireGlobal()
  }

  /* ============================= CATALOG ================================== */

  var PRICE_MIN = 20;
  var PRICE_MAX = 600;
  var PRICE_DEFAULT_MAX = 350;

  var catalogState = {
    keyword: '',
    min: PRICE_MIN,
    max: PRICE_DEFAULT_MAX,
    tier: '',
    acoustics: [],
    form: [],
    iface: [],
    brand: [],
    sort: 'weight',
    pageSize: 9,
    page: 1,
    view: 'grid'
  };

  function facetCounts(key) {
    return CATALOG.reduce(function (acc, p) {
      var v = p[key];
      if (v) acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});
  }

  function filtered() {
    var kw = catalogState.keyword.trim().toLowerCase();

    return CATALOG.filter(function (p) {
      if (kw) {
        var hay = (p.name + ' ' + p.blurb + ' ' + p.sku + ' ' + p.brand + ' ' + (p.specs || []).join(' ')).toLowerCase();
        if (hay.indexOf(kw) === -1) return false;
      }
      if (p.price < catalogState.min || p.price > catalogState.max) return false;
      if (catalogState.tier && p.tier !== catalogState.tier) return false;

      if (catalogState.acoustics.length && catalogState.acoustics.indexOf(p.acoustics) === -1) return false;
      if (catalogState.iface.length && catalogState.iface.indexOf(p.iface) === -1) return false;
      if (catalogState.brand.length && catalogState.brand.indexOf(p.brandGroup) === -1) return false;
      if (catalogState.form.length) {
        if (!p.form) return false;
        // "TKL 80%" also satisfies "TKL 80%"; treat 65%/75% strictly
        if (catalogState.form.indexOf(p.form) === -1) return false;
      }
      return true;
    }).sort(function (a, b) {
      switch (catalogState.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating || b.reviews - a.reviews;
        case 'reviews': return b.reviews - a.reviews;
        case 'newest': return b.weight - a.weight;
        default: return a.weight - b.weight;
      }
    });
  }

  // The price envelope only counts as an active criterion once the user moves it
  // off the catalogue default, so the chip rail stays quiet on first load.
  function priceActive() {
    return catalogState.max !== PRICE_DEFAULT_MAX;
  }

  function activeCount() {
    return (catalogState.keyword ? 1 : 0) +
      (catalogState.tier ? 1 : 0) +
      (priceActive() ? 1 : 0) +
      catalogState.acoustics.length +
      catalogState.form.length +
      catalogState.iface.length +
      catalogState.brand.length;
  }

  function initCatalog() {
    var filterRoot = $('#filter-root');
    var gridRoot = $('#grid-root');
    if (!filterRoot || !gridRoot) return;

    var acCounts = facetCounts('acoustics');
    var ifCounts = facetCounts('iface');
    var brCounts = facetCounts('brandGroup');
    var tierCounts = facetCounts('tier');

    function checkRow(group, value, label, count, checked) {
      return '<label class="check"><input type="checkbox" data-facet="' + group + '" value="' + esc(value) + '"' +
        (checked ? ' checked' : '') + '><span>' + esc(label) + '</span>' +
        (count != null ? '<span class="count">' + count + '</span>' : '') + '</label>';
    }

    filterRoot.innerHTML =
      '<div class="filters-head">' +
        '<span class="row" style="gap:0.5rem">' + icon('tune', 'ms-sm') +
          '<strong style="font-family:var(--font-display)">Filters</strong></span>' +
        '<span class="row" style="gap:0.375rem">' +
          '<span class="badge badge-tonal">CALIBRATED</span>' +
          '<button class="btn-icon filters-toggle" type="button" data-filters-close aria-label="Close filters">' +
            icon('close', 'ms-sm') +
          '</button>' +
        '</span>' +
      '</div>' +

      '<div class="filter-group">' +
        '<h3>Target Keyword</h3>' +
        '<label class="field">' + icon('search', 'ms-sm') +
          '<input type="search" id="filter-keyword" placeholder="e.g. Lekker, QMK, Gasket…" aria-label="Target keyword">' +
        '</label>' +
      '</div>' +

      '<div class="filter-group">' +
        '<h3>Price Envelope</h3>' +
        '<input type="range" class="range" id="filter-price" min="20" max="600" step="5" value="350" aria-label="Maximum price">' +
        '<div class="price-legend"><span>Min: $20</span><span id="price-max-label">Max: $350</span></div>' +
      '</div>' +

      '<div class="filter-group">' +
        '<h3>Inventory Tier</h3>' +
        '<div class="checks">' +
          '<label class="check"><input type="radio" name="tier" value="" checked><span>All inventory</span></label>' +
          '<label class="check"><input type="radio" name="tier" value="Ready to Dispatch"><span>Ready to Dispatch</span><span class="count">' + (tierCounts['Ready to Dispatch'] || 0) + '</span></label>' +
          '<label class="check"><input type="radio" name="tier" value="Lab Pre-Order / Batch"><span>Lab Pre-Order / Batch</span><span class="count">' + (tierCounts['Lab Pre-Order / Batch'] || 0) + '</span></label>' +
        '</div>' +
      '</div>' +

      '<div class="filter-group">' +
        '<h3>Acoustics &amp; Actuation</h3>' +
        '<div class="checks">' + FACETS.acoustics.map(function (a) {
          return checkRow('acoustics', a, a, acCounts[a] || 0, false);
        }).join('') + '</div>' +
      '</div>' +

      '<div class="filter-group">' +
        '<h3>Form Factor Layout</h3>' +
        '<div class="check-grid">' + FACETS.form.map(function (f) {
          return '<button class="chip" type="button" data-chip="form" data-value="' + esc(f) + '">' + esc(f) + '</button>';
        }).join('') + '</div>' +
      '</div>' +

      '<div class="filter-group">' +
        '<h3>Interface &amp; Protocol</h3>' +
        '<div class="checks">' + FACETS.iface.map(function (v) {
          return checkRow('iface', v, v, ifCounts[v] || 0, false);
        }).join('') + '</div>' +
      '</div>' +

      '<div class="filter-group">' +
        '<h3>Brand Ecosystem</h3>' +
        '<div class="checks">' + FACETS.brand.map(function (b) {
          var label = b === 'Tradex Apex Lab' ? b + ' <span class="badge badge-tonal">CUSTOM</span>' : b;
          return '<label class="check"><input type="checkbox" data-facet="brand" value="' + esc(b) + '">' +
            '<span>' + label + '</span><span class="count">' + (brCounts[b] || 0) + '</span></label>';
        }).join('') + '</div>' +
      '</div>';

    var toolbar = $('#toolbar-root');
    if (toolbar) {
      toolbar.innerHTML =
        '<span class="t-mono-sm t-dim">SORT:</span>' +
        '<select class="select" id="sort-select" aria-label="Sort products">' +
          '<option value="weight">Spec Priority &amp; Popularity</option>' +
          '<option value="price-asc">Price: Low to High</option>' +
          '<option value="price-desc">Price: High to Low</option>' +
          '<option value="reviews">Highest Polling Latency</option>' +
          '<option value="rating">Customer Score (5.0+)</option>' +
          '<option value="newest">Newest Revision Batch</option>' +
        '</select>' +
        '<span class="badge badge-outline-primary">' + icon('verified', 'ms-sm') + 'POLLED IN 1.2ms</span>' +
        '<span class="toolbar-spacer"></span>' +
        '<span class="t-mono-sm t-dim">Show:</span>' +
        '<div class="tab-group" id="pagesize-group">' +
          [9, 24, 48].map(function (n) {
            return '<button class="tab' + (n === 9 ? ' is-active' : '') + '" type="button" data-size="' + n + '">' + n + '</button>';
          }).join('') +
        '</div>' +
        '<div class="view-toggle">' +
          '<button type="button" data-view="grid" class="is-active" aria-label="Grid view">' + icon('grid_view', 'ms-sm') + '</button>' +
          '<button type="button" data-view="list" aria-label="List view">' + icon('view_list', 'ms-sm') + '</button>' +
        '</div>';
    }

    function criteria() {
      var host = $('#criteria-root');
      if (!host) return;
      var chips = [];

      if (catalogState.keyword) chips.push(['keyword', '"' + catalogState.keyword + '"']);
      if (catalogState.tier) chips.push(['tier', catalogState.tier]);
      if (priceActive()) {
        chips.push(['price', 'Max ' + money(catalogState.max) + (catalogState.max >= PRICE_MAX ? '+' : '')]);
      }
      catalogState.acoustics.forEach(function (a) { chips.push(['acoustics:' + a, a]); });
      catalogState.form.forEach(function (f) { chips.push(['form:' + f, f]); });
      catalogState.iface.forEach(function (v) { chips.push(['iface:' + v, v]); });
      catalogState.brand.forEach(function (b) { chips.push(['brand:' + b, b]); });

      var n = activeCount();
      host.innerHTML = '<span class="t-mono-sm t-dim">Active Criteria:</span>' +
        (chips.length
          ? chips.map(function (c) {
              return '<button class="chip chip-removable" type="button" data-clear="' + esc(c[0]) + '">' +
                esc(c[1]) + icon('close', 'ms-sm') + '</button>';
            }).join('')
          : '<span class="t-body-sm t-muted">None — full inventory in view</span>') +
        (chips.length ? '<button class="btn btn-ghost btn-sm" type="button" data-clear="all">Clear All (' + n + ')</button>' : '');
    }

    function paint() {
      var list = filtered();
      var total = list.length;
      var pages = Math.max(1, Math.ceil(total / catalogState.pageSize));
      if (catalogState.page > pages) catalogState.page = pages;

      var start = (catalogState.page - 1) * catalogState.pageSize;
      var slice = list.slice(start, start + catalogState.pageSize);

      gridRoot.className = 'grid-catalog' + (catalogState.view === 'list' ? ' is-list' : '');
      gridRoot.innerHTML = slice.length
        ? slice.map(productCard).join('')
        : '<div class="card card-pad" style="grid-column:1/-1;text-align:center">' +
            '<p class="t-h3">No hardware matches this configuration</p>' +
            '<p class="t-body-sm t-muted" style="margin-top:0.5rem">Loosen a filter to widen the envelope.</p>' +
          '</div>';

      wireAddButtons(gridRoot);

      var statEl = $('#stat-units');
      if (statEl) statEl.textContent = total;

      var foot = $('#foot-root');
      if (foot) {
        var nums = [];
        for (var i = 1; i <= pages; i++) {
          if (i === 1 || i === pages || Math.abs(i - catalogState.page) <= 1) nums.push(i);
          else if (nums[nums.length - 1] !== '…') nums.push('…');
        }
        foot.innerHTML =
          '<div class="foot-status">' +
            '<span class="t-body-sm t-muted">Showing <strong id="result-count">' +
              (total ? start + 1 : 0) + '</strong>&ndash;<strong id="result-last">' +
              Math.min(start + slice.length, total) + '</strong> of <strong id="result-total">' +
              total + '</strong> calibrated hardware units</span>' +
            '<div class="progress foot-meter"><span id="result-progress" style="width:0%"></span></div>' +
          '</div>' +
          '<div class="pager">' +
            '<button type="button" data-page="prev"' + (catalogState.page === 1 ? ' disabled' : '') +
              ' aria-label="Previous page">' + icon('chevron_left', 'ms-sm') + '</button>' +
            nums.map(function (n) {
              return n === '…'
                ? '<span class="t-mono-sm t-dim" style="padding:0 0.25rem">…</span>'
                : '<button type="button" data-page="' + n + '"' + (n === catalogState.page ? ' class="is-active"' : '') + '>' + n + '</button>';
            }).join('') +
            '<button type="button" data-page="next"' + (catalogState.page === pages ? ' disabled' : '') +
              ' aria-label="Next page">' + icon('chevron_right', 'ms-sm') + '</button>' +
          '</div>';

        // the counter + meter live inside the footer we just rendered
        var countEl = $('#result-count');
        if (countEl) countEl.textContent = total ? start + 1 : 0;
        var totalEl = $('#result-total');
        if (totalEl) totalEl.textContent = total;
        var barEl = $('#result-progress');
        if (barEl) barEl.style.width = (total ? (Math.min(start + slice.length, total) / total) * 100 : 0) + '%';
      }

      criteria();
    }

    // ---- events -----------------------------------------------------------

    var kw = $('#filter-keyword');
    kw.addEventListener('input', function () {
      catalogState.keyword = kw.value;
      catalogState.page = 1;
      paint();
    });

    var price = $('#filter-price');

    function paintPriceUI() {
      var max = catalogState.max;
      var lab = $('#price-max-label');
      if (lab) lab.textContent = 'Max: $' + max + (max >= PRICE_MAX ? '+' : '');
      if (price) {
        price.value = String(max);
        price.style.setProperty('--fill', ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN) * 100) + '%');
      }
    }

    function resetPrice() {
      catalogState.max = PRICE_DEFAULT_MAX;
      paintPriceUI();
    }

    price.addEventListener('input', function () {
      catalogState.max = Number(price.value);
      paintPriceUI();
      catalogState.page = 1;
      paint();
    });
    paintPriceUI();

    filterRoot.addEventListener('change', function (e) {
      var input = e.target;
      if (input.name === 'tier') {
        catalogState.tier = input.value;
      } else if (input.getAttribute && input.getAttribute('data-facet')) {
        var group = input.getAttribute('data-facet');
        var val = input.value;
        var arr = catalogState[group];
        var idx = arr.indexOf(val);
        if (input.checked && idx === -1) arr.push(val);
        if (!input.checked && idx !== -1) arr.splice(idx, 1);
      } else {
        return;
      }
      catalogState.page = 1;
      paint();
    });

    filterRoot.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-chip]');
      if (!chip) return;
      var group = chip.getAttribute('data-chip');
      var val = chip.getAttribute('data-value');
      var arr = catalogState[group];
      var idx = arr.indexOf(val);
      if (idx === -1) arr.push(val);
      else arr.splice(idx, 1);
      chip.classList.toggle('is-active', idx === -1);
      catalogState.page = 1;
      paint();
    });

    var criteriaHost = $('#criteria-root');
    if (criteriaHost) {
      criteriaHost.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-clear]');
        if (!btn) return;
        var key = btn.getAttribute('data-clear');

        if (key === 'all') {
          catalogState.keyword = '';
          catalogState.tier = '';
          catalogState.acoustics = [];
          catalogState.form = [];
          catalogState.iface = [];
          catalogState.brand = [];
          resetPrice();
          var kwInput = $('#filter-keyword');
          if (kwInput) kwInput.value = '';
          $$('input[type="checkbox"][data-facet]', filterRoot).forEach(function (c) { c.checked = false; });
          $$('button[data-chip]', filterRoot).forEach(function (c) { c.classList.remove('is-active'); });
          var allTier = filterRoot.querySelector('input[name="tier"][value=""]');
          if (allTier) allTier.checked = true;
        } else if (key === 'keyword') {
          catalogState.keyword = '';
          var ki = $('#filter-keyword');
          if (ki) ki.value = '';
        } else if (key === 'tier') {
          catalogState.tier = '';
          var at = filterRoot.querySelector('input[name="tier"][value=""]');
          if (at) at.checked = true;
        } else if (key === 'price') {
          resetPrice();
        } else {
          var parts = key.split(':');
          var g = parts[0], v = parts.slice(1).join(':');
          var i = catalogState[g].indexOf(v);
          if (i !== -1) catalogState[g].splice(i, 1);
          $$('button[data-chip][data-value="' + v.replace(/"/g, '\\"') + '"]', filterRoot)
            .forEach(function (c) { c.classList.remove('is-active'); });
          $$('input[data-facet="' + g + '"]', filterRoot).forEach(function (c) {
            if (c.value === v) c.checked = false;
          });
        }
        catalogState.page = 1;
        paint();
      });
    }

    if (toolbar) {
      toolbar.addEventListener('change', function (e) {
        if (e.target.id === 'sort-select') {
          catalogState.sort = e.target.value;
          catalogState.page = 1;
          paint();
        }
      });

      toolbar.addEventListener('click', function (e) {
        var size = e.target.closest('[data-size]');
        if (size) {
          catalogState.pageSize = Number(size.getAttribute('data-size'));
          catalogState.page = 1;
          $$('[data-size]', toolbar).forEach(function (b) {
            b.classList.toggle('is-active', b === size);
          });
          paint();
          return;
        }
        var view = e.target.closest('[data-view]');
        if (view) {
          catalogState.view = view.getAttribute('data-view');
          $$('[data-view]', toolbar).forEach(function (b) {
            b.classList.toggle('is-active', b === view);
          });
          paint();
        }
      });
    }

    var footHost = $('#foot-root');
    if (footHost) {
      footHost.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-page]');
        if (!btn || btn.disabled) return;
        var v = btn.getAttribute('data-page');
        var pages = Math.max(1, Math.ceil(filtered().length / catalogState.pageSize));
        if (v === 'prev') catalogState.page = Math.max(1, catalogState.page - 1);
        else if (v === 'next') catalogState.page = Math.min(pages, catalogState.page + 1);
        else catalogState.page = Number(v);
        paint();
        var grid = $('#grid-root');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // mobile filter drawer
    var filters = $('.filters');
    var scrim = $('#filter-scrim');
    function setFilters(open) {
      if (filters) filters.classList.toggle('is-open', open);
      if (scrim) scrim.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    $$('[data-filters-open]').forEach(function (b) {
      b.addEventListener('click', function () { setFilters(true); });
    });
    if (scrim) scrim.addEventListener('click', function () { setFilters(false); });
    $$('[data-filters-close]').forEach(function (b) {
      b.addEventListener('click', function () { setFilters(false); });
    });

    paint();
  }

  /* ============================= PRODUCT ================================== */

  function initProduct() {
    var galleryRoot = $('#gallery-root');
    if (!galleryRoot) return;

    var active = 0;

    function paintGallery() {
      var g = PDP.gallery[active];
      var main = $('#gallery-main');
      main.innerHTML =
        '<div class="media">' +
          '<span class="badge badge-primary gallery-float">' + icon('precision_manufacturing', 'ms-sm') +
            esc(PDP.eyebrow) + '</span>' +
          '<span class="badge badge-light" style="position:absolute;left:0.75rem;bottom:3.5rem;z-index:2">' +
            esc(PDP.flags[0]) + '</span>' +
          '<img src="' + g.img + '" alt="' + esc(g.alt) + '" width="512" height="279" fetchpriority="high">' +
          '<button class="gallery-btn" type="button" data-ar>' + icon('view_in_ar', 'ms-sm') + '360° Interactive Rig</button>' +
        '</div>';

      $('#gallery-thumbs').innerHTML = PDP.gallery.map(function (t, i) {
        // five alternates mirror the design's thumbnail rail
        return '<button class="thumb' + (i === active ? ' is-active' : '') + '" type="button" data-thumb="' + i + '">' +
          '<div class="media"><img src="' + t.img + '" alt="' + esc(t.alt) + '" loading="lazy" width="512" height="279"></div>' +
          '<span class="t-mono-sm t-dim" style="display:block;margin-top:0.25rem">' + esc(t.caption) + '</span>' +
        '</button>';
      }).join('');

      $$('[data-thumb]', galleryRoot).forEach(function (b) {
        b.addEventListener('click', function () {
          active = Number(b.getAttribute('data-thumb'));
          paintGallery();
        });
      });

      var ar = $('[data-ar]', galleryRoot);
      if (ar) {
        ar.addEventListener('click', function () {
          toast('AR desk view needs a WebXR capable device');
        });
      }
    }

    paintGallery();

    $('#pdp-stats').innerHTML = PDP.stats.map(function (s) {
      return '<div class="pdp-stat">' + icon(s.icon, 'ms-lg') + '<b>' + esc(s.v) + '</b><span>' + esc(s.s) + '</span></div>';
    }).join('');

    /* ---- buybox ---------------------------------------------------------- */

    var switchCost = 0;
    var isoSurcharge = 0;
    var qty = 1;
    var switchId = (PDP.switches.filter(function (s) { return s.def; })[0] || PDP.switches[0]).id;
    var keycapIdx = 0;

    var buybox = $('#buybox-root');
    buybox.innerHTML =
      '<div class="buybox-head">' +
        '<span class="t-mono-sm t-dim">SKU: ' + esc(PDP.sku) + '</span>' +
        '<span class="badge badge-outline-primary">' + esc(PDP.rev) + '</span>' +
      '</div>' +

      '<div style="margin-top:0.75rem">' +
        '<span class="badge badge-dark">' + icon('check_circle', 'ms-sm') + esc(PDP.stock) + '</span>' +
        '<h1 class="t-h1" style="margin-top:0.625rem">' + esc(PDP.name) + '</h1>' +
        '<p class="t-body-sm t-muted" style="margin-top:0.5rem">' + esc(PDP.blurb) + '</p>' +
      '</div>' +

      '<div class="row row-wrap" style="margin-top:0.75rem;gap:0.5rem">' +
        '<span class="rating">' + stars(PDP.rating) + '<strong>' + PDP.rating.toFixed(2) + '</strong></span>' +
        '<span class="t-mono-sm t-dim">/</span>' +
        '<span class="t-mono-sm t-dim">' + esc(PDP.logs) + '</span>' +
        '<span class="t-mono-sm t-dim">/</span>' +
        '<span class="t-mono-sm t-dim">' + esc(PDP.qa) + '</span>' +
      '</div>' +

      '<div class="price-panel" style="margin-top:1rem">' +
        '<div class="price-row">' +
          '<span class="price" id="pdp-price">' + money(PDP.price) + '</span>' +
          '<span class="price-strike">' + money(PDP.compareAt) + '</span>' +
          '<span class="badge badge-error">' + esc(PDP.badge) + '</span>' +
        '</div>' +
        '<p class="installments">' + esc(PDP.installments) + ' <em>Klarna</em> &middot; ' +
          '<a class="t-primary" href="index.html" style="text-decoration:underline">Learn more</a></p>' +
      '</div>' +

      '<div style="margin-top:1rem">' +
        '<div class="panel-head">' +
          '<span class="t-mono">MECHANICAL SWITCH ARCHITECTURE</span>' +
          '<span class="t-mono-sm t-primary">' + icon('volume_up', 'ms-sm') + ' Switch Audio Samples</span>' +
        '</div>' +
        '<div class="stack-sm">' +
          PDP.switches.map(function (s) {
            return '<button class="option' + (s.def ? ' is-active' : '') + '" type="button" data-switch="' + s.id + '" ' +
              'data-cost="' + s.cost + '" aria-pressed="' + (!!s.def) + '">' +
              '<span class="swatch">' + icon(s.icon, 'ms-sm') + '</span>' +
              '<span class="txt"><span class="nm">' + esc(s.name) + '</span>' +
                '<span class="sub" style="display:block">' + esc(s.sub) + '</span></span>' +
              (s.perk ? '<span class="badge badge-tonal">' + esc(s.perk) + '</span>'
                      : '<span class="cost">+$' + s.cost.toFixed(2) + '</span>') +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div style="margin-top:1rem">' +
        '<div class="panel-head"><span class="t-mono">KEYCAP REGIONAL STANDARD</span></div>' +
        '<div class="check-grid">' +
          PDP.keycaps.map(function (k, i) {
            return '<button class="chip' + (i === 0 ? ' is-active' : '') + '" type="button" data-keycap="' + i + '">' +
              esc(k) + icon('check_circle', 'ms-sm') + '</button>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div class="buybox-actions">' +
        '<div class="stepper">' +
          '<button type="button" data-qty="-1" aria-label="Decrease quantity">' + icon('remove', 'ms-sm') + '</button>' +
          '<output id="pdp-qty">1</output>' +
          '<button type="button" data-qty="1" aria-label="Increase quantity">' + icon('add', 'ms-sm') + '</button>' +
        '</div>' +
        '<button class="btn btn-secondary btn-icon" type="button" data-wish aria-label="Save item">' +
          icon('favorite', 'ms-sm') + '</button>' +
        '<button class="btn btn-primary buybox-cta" type="button" id="pdp-add">' +
          icon('shopping_cart', 'ms-sm') + 'Add to Cart &bull; <span id="pdp-total">' + money(PDP.price) + '</span></button>' +
      '</div>' +

      '<button class="btn btn-dark btn-block buybox-express" type="button" id="pdp-express" style="margin-top:0.5rem">' +
        icon('bolt', 'ms-sm') + 'INSTANT EXPRESS CHECKOUT (APPLE PAY / GPAY)</button>' +

      '<div class="ship-note">' +
        icon('timer', 'ms-sm') + ' <strong>Order within 2 hrs 14 mins</strong> for Same-Day Dispatch.<br>' +
        '<span class="t-dim">Estimated doorstep delivery to Austin Hub: Tomorrow, 14:00 - 18:00 via Priority 2-Day Air.</span>' +
      '</div>';

    function recalc() {
      var unit = PDP.price + switchCost + isoSurcharge;
      $('#pdp-price').textContent = money(unit);
      $('#pdp-total').textContent = money(unit * qty);
    }

    $$('[data-switch]', buybox).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-switch]', buybox).forEach(function (x) {
          x.classList.remove('is-active');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('is-active');
        b.setAttribute('aria-pressed', 'true');
        switchId = b.getAttribute('data-switch');
        switchCost = Number(b.getAttribute('data-cost'));
        recalc();
      });
    });

    $$('[data-keycap]', buybox).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Number(b.getAttribute('data-keycap'));
        $$('[data-keycap]', buybox).forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        keycapIdx = i;
        isoSurcharge = i === 1 ? 12 : 0;
        recalc();
      });
    });

    $$('[data-qty]', buybox).forEach(function (b) {
      b.addEventListener('click', function () {
        qty = Math.min(9, Math.max(1, qty + Number(b.getAttribute('data-qty'))));
        $('#pdp-qty').textContent = qty;
        recalc();
      });
    });

    $('#pdp-add').addEventListener('click', function () {
      var sw = PDP.switches.filter(function (s) { return s.id === switchId; })[0] || PDP.switches[0];
      addToCart({
        sku: PDP.sku,
        img: PDP.gallery[0].img,
        name: PDP.name,
        meta: 'Switch: ' + sw.name + ' • Keycaps: ' + (keycapIdx === 1 ? 'ISO (EU)' : 'ANSI (US)') + ' • Tri-Mode Wireless',
        serial: PDP.sku,
        price: PDP.price + switchCost + isoSurcharge,
        qty: qty
      });
    });

    $('#pdp-express').addEventListener('click', function () {
      window.location.href = 'cart.html';
    });

    /* ---- spec matrix ----------------------------------------------------- */

    $('#specs-root').innerHTML = PDP.specs.map(function (s) {
      return '<article class="spec-card">' +
        '<span class="k">' + esc(s.k) + icon(s.icon, 'ms-sm') + '</span>' +
        '<div class="v">' + esc(s.v) + '</div>' +
        '<div class="s">' + esc(s.s) + '</div>' +
        '<p>' + esc(s.p) + '</p>' +
      '</article>';
    }).join('');

    $('#sheet-root').innerHTML = PDP.sheet.map(function (row) {
      return '<div class="trow"><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>';
    }).join('');

    $('#bundle-root').innerHTML = PDP.bundle.map(function (b) {
      return '<div class="bundle-item">' +
        '<div class="media"><img src="' + b.img + '" alt="' + esc(b.alt) + '" loading="lazy" width="512" height="279"></div>' +
        '<div class="txt">' +
          '<span class="t-mono-sm t-primary">' + esc(b.label) + '</span>' +
          '<div class="nm">' + esc(b.name) + '</div>' +
          '<div class="pr">' + esc(b.price) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    /* ---- reviews & qa ---------------------------------------------------- */

    $('#reviews-root').innerHTML = PDP.reviews.map(function (r) {
      return '<article class="review">' +
        '<div class="head"><span class="stars">' + stars(r.stars) + '</span>' +
          '<span class="when">' + esc(r.when) + '</span></div>' +
        '<h4>' + esc(r.title) + '</h4>' +
        '<p>' + esc(r.body) + '</p>' +
        '<div class="foot"><span class="t-mono-sm t-dim">' + esc(r.who) + '</span>' +
          '<span class="verified">' + icon('verified', 'ms-sm') + 'Verified Buyer</span></div>' +
      '</article>';
    }).join('');

    $('#qa-root').innerHTML = PDP.questions.map(function (q) {
      return '<div class="qa-item"><p class="q">Q: ' + esc(q.q) + '</p>' +
        '<p class="a"><b>Tradex Engineering:</b> ' + esc(q.a) + '</p></div>';
    }).join('');

    // mobile sticky bar
    var bar = $('#checkout-bar');
    if (bar) {
      bar.innerHTML =
        '<span class="amt"><small>Configured total</small><b id="bar-total">' + money(PDP.price) + '</b></span>' +
        '<button class="btn btn-primary" type="button" id="bar-add">' + icon('shopping_cart', 'ms-sm') + 'Add to Cart</button>';
      $('#bar-add').addEventListener('click', function () {
        $('#pdp-add').click();
      });
      var obs = new MutationObserver(function () {
        var t = $('#pdp-total');
        var bt = $('#bar-total');
        if (t && bt) bt.textContent = t.textContent;
      });
      obs.observe($('#pdp-total'), { childList: true, characterData: true, subtree: true });
    }
  }

  /* ============================== CART ==================================== */

  function initCart() {
    var linesRoot = $('#lines-root');
    if (!linesRoot) return;

    $('#steps-root').innerHTML = CART_STEPS.map(function (s, i) {
      return '<button class="step' + (i === 0 ? ' is-active' : '') + '" type="button" data-step="' + s.id + '">' +
        icon(s.icon) +
        '<span class="txt"><span class="idx">' + esc(s.idx) + '</span>' +
          '<span class="nm" style="display:block">' + esc(s.name) + '</span>' +
          '<span class="sub" style="display:block">' + esc(s.sub) + '</span></span>' +
      '</button>';
    }).join('');

    $('#steps-root').addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]');
      if (!b) return;
      $$('[data-step]').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      var step = b.getAttribute('data-step');
      if (step === 'routing') toast('Shipping details — express air already assigned');
      else if (step === 'gateway') toast('Payment gateway — 1-tap express ready');
      else if (step === 'dispatch') toast('Dispatch — tracking telemetry opens after payment');
    });

    function paintLines() {
      var countEl = $('#lines-count');
      if (countEl) countEl.textContent = cart.items.length;

      if (!cart.items.length) {
        linesRoot.innerHTML =
          '<div class="card card-pad" style="text-align:center">' +
            '<p class="t-h3">Your tech bag is empty</p>' +
            '<p class="t-body-sm t-muted" style="margin-top:0.5rem">Stage hardware from the catalogue to continue.</p>' +
            '<a class="btn btn-primary" href="catalog.html" style="margin-top:1rem">Browse hardware</a>' +
          '</div>';
        return;
      }

      linesRoot.innerHTML = cart.items.map(function (l, i) {
        return '<article class="line-item" data-line="' + i + '">' +
          '<div class="media"><img src="' + l.img + '" alt="' + esc(l.name) + '" loading="lazy" width="512" height="279"></div>' +
          '<div>' +
            '<div class="tags">' +
              '<span class="badge badge-success">' + esc(l.flag || 'IN STOCK') + '</span>' +
              '<span class="t-mono-sm ' + (l.flagKind === 'warn' ? 't-primary' : 't-dim') + '">' +
                esc(l.flagText || 'Fast Dispatch') + '</span>' +
            '</div>' +
            '<h3 class="nm">' + esc(l.name) + '</h3>' +
            '<p class="sub">' + esc(l.meta) + '</p>' +
            '<p class="sku">SKU: ' + esc(l.serial) + ' &nbsp;•&nbsp; ' + esc(l.sku === l.serial ? 'QMK/VIA Ready' : 'QMK/VIA Ready') + '</p>' +
          '</div>' +
          '<div class="right">' +
            '<span class="price">' + money(l.price * l.qty) + '</span>' +
            '<div class="row" style="gap:0.375rem">' +
              '<div class="stepper">' +
                '<button type="button" data-qty-line="' + i + '" data-delta="-1" aria-label="Decrease quantity">' +
                  icon('remove', 'ms-sm') + '</button>' +
                '<output>' + l.qty + '</output>' +
                '<button type="button" data-qty-line="' + i + '" data-delta="1" aria-label="Increase quantity">' +
                  icon('add', 'ms-sm') + '</button>' +
              '</div>' +
              '<button class="btn-icon" type="button" data-remove="' + i + '" aria-label="Remove ' + esc(l.name) + '">' +
                icon('delete', 'ms-sm') + '</button>' +
            '</div>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    linesRoot.addEventListener('click', function (e) {
      var q = e.target.closest('[data-qty-line]');
      if (q) {
        var i = Number(q.getAttribute('data-qty-line'));
        var d = Number(q.getAttribute('data-delta'));
        cart.items[i].qty = Math.min(9, Math.max(1, cart.items[i].qty + d));
        saveCart(); paintLines(); syncCartUI();
        return;
      }
      var r = e.target.closest('[data-remove]');
      if (r) {
        var idx = Number(r.getAttribute('data-remove'));
        var name = cart.items[idx].name;
        cart.items.splice(idx, 1);
        saveCart(); paintLines(); syncCartUI();
        toast(name + ' removed from the tech bag');
      }
    });

    /* ---- add-ons --------------------------------------------------------- */

    $('#addons-root').innerHTML = ADDONS.map(function (a) {
      return '<div class="addon">' +
        '<div class="media"><img src="' + a.img + '" alt="' + esc(a.alt) + '" loading="lazy" width="512" height="279"></div>' +
        '<div><div class="nm">' + esc(a.name) + '</div>' +
        '<p class="sub">' + esc(a.sub) + '</p></div>' +
        '<div class="foot">' +
          '<span class="price">+$' + a.price.toFixed(2) + '</span>' +
          '<button class="btn btn-secondary btn-sm" type="button" data-addon="' + esc(a.sku) + '">' +
            icon('add', 'ms-sm') + 'Add</button>' +
        '</div>' +
      '</div>';
    }).join('');

    $('#addons-root').addEventListener('click', function (e) {
      var b = e.target.closest('[data-addon]');
      if (!b) return;
      var a = ADDONS.filter(function (x) { return x.sku === b.getAttribute('data-addon'); })[0];
      if (!a) return;
      addToCart({ sku: a.sku, img: a.img, name: a.name, meta: a.sub, serial: a.sku, price: a.price, qty: 1 });
      paintLines();
    });

    /* ---- coupon ---------------------------------------------------------- */

    var couponRow = $('#coupon-row');
    function paintCoupon() {
      couponRow.innerHTML =
        '<span class="t-mono" style="margin-right:auto">Enterprise &amp; Community Vouchers</span>' +
        (cart.coupon
          ? '<span class="chip chip-removable">' + icon('verified', 'ms-sm') + 'TRADEX10 (-' + money(COUPON.amount) + ')' +
              '<button class="btn-icon" style="width:18px;height:18px" type="button" data-coupon="remove" aria-label="Remove coupon">' +
              icon('close', 'ms-sm') + '</button></span>'
          : '<label class="field" style="flex:0 1 200px"><span class="sr-only">Promo code</span>' +
              '<input type="text" id="coupon-input" placeholder="PROMO CODE" value="TRADEX10"></label>' +
            '<button class="btn btn-secondary btn-sm" type="button" data-coupon="apply">Apply</button>');
    }

    couponRow.addEventListener('click', function (e) {
      var b = e.target.closest('[data-coupon]');
      if (!b) return;
      if (b.getAttribute('data-coupon') === 'apply') {
        var input = $('#coupon-input');
        var code = (input && input.value || '').trim().toUpperCase();
        if (code === COUPON.code) {
          cart.coupon = true;
          saveCart(); paintCoupon(); syncCartUI();
          toast('Voucher applied — $20.00 off staging');
        } else {
          toast('Voucher not recognised — try TRADEX10');
        }
      } else {
        cart.coupon = false;
        saveCart(); paintCoupon(); syncCartUI();
        toast('Voucher removed');
      }
    });

    /* ---- summary --------------------------------------------------------- */

    var summaryRoot = $('#summary-root');
    var checkoutBar = $('#checkout-bar');

    function paintSummary() {
      var t = totals();

      if (!t.lines) {
        summaryRoot.innerHTML =
          '<div class="panel-head">' +
            '<span class="panel-title">Order Summary</span>' +
            '<span class="t-mono-sm t-dim">TXD-EST-9082</span>' +
          '</div>' +
          '<p class="t-body-sm t-muted" style="margin-top:0.75rem">Nothing staged yet. Add a component to see the duty-inclusive total.</p>' +
          '<a class="btn btn-primary btn-block" href="catalog.html" style="margin-top:1rem">' +
            icon('grid_view', 'ms-sm') + 'Browse hardware</a>';
        if (checkoutBar) checkoutBar.innerHTML = '';
        document.body.classList.remove('has-checkout-bar');
        return;
      }

      summaryRoot.innerHTML =
        '<div class="panel-head">' +
          '<span class="panel-title">Order Summary</span>' +
          '<span class="t-mono-sm t-dim">TXD-EST-9082</span>' +
        '</div>' +
        '<div class="summary-rows">' +
          '<div class="r"><span>Cart Subtotal (' + t.units + ' components)</span>' +
            '<span class="v">' + money(t.subtotal) + '</span></div>' +
          (t.discount
            ? '<div class="r"><span>' + icon('sell', 'ms-sm') + ' TRADEX10 Coupon Discount</span>' +
                '<span class="v discount">-' + money(t.discount) + '</span></div>'
            : '') +
          '<div class="r"><span>Express 2-Day Air <span class="badge badge-tonal">LOCKED</span></span>' +
            '<span class="v free">FREE</span></div>' +
          '<div class="r"><span>Estimated Sales Tax <span class="t-dim">(CA ~ 7.25%)</span></span>' +
            '<span class="v">' + money(t.tax) + '</span></div>' +
        '</div>' +
        '<div class="summary-total">' +
          '<div><div class="lab">Total Amount</div>' +
            '<div class="sub">Includes all duties &amp; expedited handling</div></div>' +
          '<div style="text-align:right">' +
            '<div class="amt">' + money(t.total) + '</div>' +
            '<div class="t-mono-sm t-dim">Earns ' + Math.round(t.total) + ' Tradex Points</div>' +
          '</div>' +
        '</div>' +
        '<div class="or-line">Instant 1-Tap Express Pay</div>' +
        '<div class="express">' +
          '<button class="pay-apple" type="button" data-express>Pay</button>' +
          '<button class="pay-g" type="button" data-express>G Pay</button>' +
        '</div>' +
        '<div class="or-line">Or Standard Staging</div>' +
        '<button class="btn btn-primary btn-block btn-lg" type="button" id="proceed">' +
          'PROCEED TO CHECKOUT &bull; ' + money(t.total) + icon('arrow_forward', 'ms-sm') + '</button>' +
        '<div class="ship-note">' + icon('speed', 'ms-sm') +
          ' Orders ship within 12 hours. Tier 1 Tradex VIP Perks Active on this session.</div>';

      if (checkoutBar) {
        checkoutBar.innerHTML =
          '<span class="amt"><small>Total</small><b>' + money(t.total) + '</b></span>' +
          '<button class="btn btn-primary" type="button" id="bar-proceed">Checkout' + icon('arrow_forward', 'ms-sm') + '</button>';
        document.body.classList.add('has-checkout-bar');
      }
    }

    summaryRoot.__render = paintSummary;

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-express]') || e.target.closest('#proceed') || e.target.closest('#bar-proceed')) {
        toast('Prototype only — no payment is captured');
      }
    });

    /* ---- assurances + threshold ------------------------------------------ */

    $('#assurances-root').innerHTML = ASSURANCES.map(function (a) {
      return '<div class="assurance">' + icon(a.icon, 'ms-lg') +
        '<div><div class="nm">' + esc(a.title) + '</div><p>' + esc(a.text) + '</p></div></div>';
    }).join('');

    function paintThreshold() {
      var root = $('#threshold-root');
      if (!root) return;

      var t = totals();
      var target = 150;
      var pct = Math.min(100, Math.round(t.subtotal / target * 100));

      if (!t.lines) {
        root.innerHTML =
          '<div class="row-top">' + icon('flight_takeoff', 'ms-lg') +
            '<span>Free 2-Day Air unlocks at ' + money(target) + '</span>' +
            '<span class="badge badge-tonal spacer">0% REACHED</span></div>' +
          '<p class="t-body-sm t-muted" style="margin-top:0.25rem">Stage hardware to activate priority logistics out of the Austin, TX hub.</p>' +
          '<div class="bar"><span style="width:0%"></span></div>';
        return;
      }

      if (t.subtotal < target) {
        var remaining = target - t.subtotal;
        root.innerHTML =
          '<div class="row-top">' + icon('flight_takeoff', 'ms-lg') +
            '<span>' + money(remaining) + ' away from FREE 2-Day Air Shipping</span>' +
            '<span class="badge badge-tonal spacer">' + pct + '% REACHED</span></div>' +
          '<p class="t-body-sm t-muted" style="margin-top:0.25rem">Add ' + money(remaining) +
            ' of hardware to clear the ' + money(target) + ' free-air threshold — Austin, TX hub</p>' +
          '<div class="bar"><span style="width:' + pct + '%"></span></div>';
        return;
      }

      root.innerHTML =
        '<div class="row-top">' + icon('flight_takeoff', 'ms-lg') +
          '<span>You unlocked FREE 2-Day Air Shipping!</span>' +
          '<span class="badge badge-success spacer">' + pct + '% REACHED</span></div>' +
        '<p class="t-body-sm t-muted" style="margin-top:0.25rem">Cart threshold exceeded (' + money(target) +
          ' min) • Priority logistics hub Austin, TX assigned</p>' +
        '<div class="bar"><span style="width:' + pct + '%"></span></div>';
    }

    var thresholdHost = $('#threshold-root');
    if (thresholdHost) thresholdHost.__render = paintThreshold;

    paintLines();
    paintCoupon();
    paintSummary();
    paintThreshold();
    syncCartUI();
  }

  /* ============================== FLOW ==================================== */

  function initFlow() {
    var root = $('#flow-grid');
    if (!root) return;

    var screens = [
      {
        step: '01', file: 'home.html', title: 'Home Discovery',
        text: 'Utility strip, sticky command header, limited-drop hero with live spec tiles, six category rails, flash-deal countdown grid, battlestation showcase with interactive hotspots, trending tabs, trust strips and footer.',
        tags: ['Hero drop', 'Categories', 'Flash deals', 'Showcase', 'Tabs'],
        img: 'assets/img/flow-home.png', ref: 'TRADEXSTORE - Home Discovery (Desktop)'
      },
      {
        step: '02', file: 'catalog.html', title: 'Product Catalog',
        text: 'Breadcrumb trail, node heading with live unit counter, removable active-criteria chips, full facet rail (keyword, price envelope, tier, acoustics, form factor, protocol, brand), sort / density / view controls and pagination.',
        tags: ['Facet rail', 'Live filtering', 'Grid + list', 'Pagination'],
        img: 'assets/img/flow-catalog.png', ref: 'TRADEXSTORE - Product Catalog (Desktop)'
      },
      {
        step: '03', file: 'product.html', title: 'Product Detail',
        text: 'Gallery with five alternate captures and AR entry point, buybox with switch architecture options, regional keycap standard, quantity stepper, decomposed spec matrix, verified spec sheet, bundle builder, acoustic chart, reviews and engineer Q&A.',
        tags: ['Gallery', 'Options', 'Spec matrix', 'Bundle', 'Reviews'],
        img: 'assets/img/flow-product.png', ref: 'TRADEXSTORE - Product Detail Page (Desktop)'
      },
      {
        step: '04', file: 'cart.html', title: 'Cart & Checkout',
        text: 'Four-stage order rail, free-shipping threshold meter, serialized line items with quantity control, voucher application, recommended add-ons, express pay shortcuts and a sticky order summary.',
        tags: ['Step rail', 'Threshold', 'Vouchers', 'Summary'],
        img: 'assets/img/flow-cart.png', ref: 'TRADEXSTORE - Shopping Cart & Checkout (Desktop)'
      }
    ];

    root.innerHTML = screens.map(function (s) {
      return '<a class="flow-card" href="' + s.file + '">' +
        '<div class="flow-frame">' +
          '<span class="flow-step">STEP ' + s.step + '</span>' +
          '<img src="' + s.img + '" alt="' + esc(s.ref) + '" loading="lazy">' +
        '</div>' +
        '<div class="flow-body">' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<p>' + esc(s.text) + '</p>' +
          '<div class="flow-tags">' +
            s.tags.map(function (t) { return '<span class="spec-pill">' + esc(t) + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
      '</a>';
    }).join('');

    var rail = $('#flow-rail');
    if (rail) {
      rail.innerHTML = screens.map(function (s, i) {
        return (i ? icon('chevron_right', 'ms-sm') : '') +
          '<a class="node" href="' + s.file + '">' + icon('arrow_forward', 'ms-sm') + esc(s.title) + '</a>';
      }).join('');
    }

    var palette = [
      ['Background', '#faf8ff'], ['Surface low', '#f2f3ff'], ['Surface container', '#eaedff'],
      ['Surface high', '#e2e7ff'], ['Primary', '#0058c3'], ['Primary container', '#0070f3'],
      ['Secondary', '#00687a'], ['Secondary container', '#57dffe'], ['Tertiary', '#006296'],
      ['Inverse surface', '#283044'], ['On surface', '#131b2e'], ['Outline variant', '#c1c6d7']
    ];

    var swatchRoot = $('#palette-root');
    if (swatchRoot) {
      swatchRoot.innerHTML = palette.map(function (p) {
        return '<div class="swatch-card">' +
          '<div class="swatch" style="background:' + p[1] + '"></div>' +
          '<span class="t-mono-sm">' + esc(p[0]) + '</span>' +
          '<span class="nm">' + p[1] + '</span>' +
        '</div>';
      }).join('');
    }

    var typeRoot = $('#type-root');
    if (typeRoot) {
      var rows = [
        ['headline-xl', 'Space Grotesk 700 · 48/56 · -0.03em', 'Hardware Telemetry'],
        ['headline-lg', 'Space Grotesk 600 · 36/44 · -0.02em', 'Explore Core Categories'],
        ['headline-md', 'Space Grotesk 600 · 24/32', 'Precision Flash Deals'],
        ['headline-sm', 'Space Grotesk 600 · 20/28', 'Vortex Titan Pro 75%'],
        ['body-lg', 'Geist 400 · 18/28', 'Architectural grade rendering and zero-compromise esports velocity.'],
        ['body-md', 'Geist 400 · 16/24', 'Gasket mounted CNC aluminum chassis with active OLED matrix.'],
        ['label-md', 'Geist 600 · 14/20', 'MECHANICAL SWITCH ARCHITECTURE'],
        ['tech-mono', 'JetBrains Mono 500 · 13/18 · 0.04em', 'SKU: VTX-TP75-PRO-GR • 1000Hz POLLING']
      ];
      var typeClass = {
        'headline-xl': 't-display',
        'headline-lg': 't-h1',
        'headline-md': 't-h2',
        'headline-sm': 't-h3',
        'body-lg': 't-body-lg',
        'body-md': '',
        'label-md': 't-label',
        'tech-mono': 't-mono'
      };
      typeRoot.innerHTML = rows.map(function (r) {
        return '<div class="panel" style="padding:1rem">' +
          '<span class="t-mono-sm t-dim">' + esc(r[1]) + '</span>' +
          '<div style="margin-top:0.5rem">' +
            '<span class="' + typeClass[r[0]] + '">' + esc(r[2]) + '</span>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    var libRoot = $('#library-root');
    if (libRoot) {
      var files = [];
      var i;
      for (i = 1; i <= 39; i++) {
        files.push({ file: 'product-' + String(i).padStart(2, '0') + '.png', group: 'Product render' });
      }
      files.push({ file: 'logo-tradex-full.png', group: 'Brand mark' });
      files.push({ file: 'avatar.png', group: 'Account avatar' });

      libRoot.innerHTML = files.map(function (f) {
        return '<figure class="swatch-card" style="margin:0">' +
          '<div class="media" style="margin-bottom:0.5rem"><img src="assets/img/' + f.file +
            '" alt="Design asset ' + f.file + '" loading="lazy" width="512" height="279"></div>' +
          '<span class="t-mono-sm">' + f.file + '</span>' +
          '<span class="nm">' + esc(f.group) + '</span>' +
        '</figure>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------- bootstrap */

  function boot() {
    mountChrome();
    wireAddButtons(document);

    var page = document.body.getAttribute('data-page');
    if (page === 'home') initHome();
    else if (page === 'catalog') initCatalog();
    else if (page === 'product') initProduct();
    else if (page === 'cart') initCart();
    else if (page === 'flow') initFlow();

    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // expose the few helpers the pages need inline
  window.Tradex = { money: money, addToCart: addToCart, toast: toast, icon: icon };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
