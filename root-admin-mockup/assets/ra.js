/* Configurable Root Admin — prototype script.
   Self-contained: no dependency on the store mockup's assets/tradex.js.
   Sample values (store names, counts, colours, dates) are illustrative, not requirements. */
(function () {
  "use strict";
  var RA = (window.RA = {});

  /* ---------------- icons (inline SVG, 24-grid, stroke) ---------------- */
  var P = {
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    store: "M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6",
    plus: "M12 5v14M5 12h14",
    layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
    palette: "M12 3a9 9 0 100 18h2a3 3 0 003-3 3 3 0 00-3-3h-1a2 2 0 010-4h2a5 5 0 00-3-8zM7.5 9.5h.01M10.5 6.5h.01M7 14h.01",
    toggle: "M8 7h8a5 5 0 010 10H8A5 5 0 018 7zM8 12h.01",
    type: "M4 6V4h16v2M12 4v16M9 20h6",
    rocket: "M5 15l-1 5 5-1M14 4c3 0 6 3 6 6-1.5 4-5 7-9 9l-6-6c2-4 5-7.5 9-9zM14.5 9.5h.01",
    users: "M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 7.5a3 3 0 106 0 3 3 0 00-6 0zM21 19v-1a4 4 0 00-3-3.8",
    cog: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2v.2a2 2 0 11-4 0v-.1a1.7 1.7 0 00-3-1.2l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00-1.2-2.9H3a2 2 0 110-4h.1a1.7 1.7 0 001.2-3l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 003-1.2V3a2 2 0 114 0v.1a1.7 1.7 0 003 1.2l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 001.2 3H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z",
    search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
    bell: "M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 01-3.4 0",
    info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16v-4M12 8h.01",
    warn: "M10.3 4l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0zM12 9v4M12 17h.01",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    chev: "M9 18l6-6-6-6",
    down: "M6 9l6 6 6-6",
    back: "M19 12H5M12 19l-7-7 7-7",
    menu: "M3 6h18M3 12h18M3 18h18",
    lock: "M5 11h14v10H5zM8 11V7a4 4 0 118 0v4",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.7 2.5 15.3 0 18-2.5-2.7-2.5-15.3 0-18z",
    doc: "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5M9 13h6M9 17h4",
    box: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8",
    clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
    act: "M13 2L4 14h7l-1 8 9-12h-7z",
    trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
    up: "M12 19V5M5 12l7-7 7 7",
    copy: "M9 9h11v11H9zM5 15H4V4h11v1",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z",
    pulse: "M3 12h4l3 8 4-16 3 8h4"
  };
  RA.icon = function (n, cls) {
    var d = P[n] || P.info;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") +
      '><path d="' + d + '"/></svg>';
  };

  /* ---------------- navigation ---------------- */
  RA.nav = [
    ["Overview", [
      ["Dashboard", "ra-dashboard.html", "grid", "P-R02", ""],
      ["Stores", "ra-stores.html", "store", "P-R03", "7"]
    ]],
    ["Catalogue", [
      ["E-commerce categories", "ra-packs.html", "layers", "P-R06", ""],
      ["Bundles", "ra-bundles.html", "box", "P-R13", ""],
      ["Templates", "ra-templates.html", "palette", "P-R07", ""],
      ["Capabilities", "ra-capabilities.html", "toggle", "P-R08", ""],
      ["Terminology", "ra-terminology.html", "type", "P-R09", ""]
    ]],
    ["Operations", [
      ["Deployments", "ra-deployments.html", "rocket", "P-R10", "2"],
      ["Platform users & audit", "ra-admin.html", "users", "P-R11", ""],
      ["Settings & health", "ra-settings.html", "cog", "P-R12", "1"]
    ]]
  ];

  /* ---------------- sample data ---------------- */
  RA.stores = [
    { key: "tradex", name: "Tradex Computers", pack: "Electronics", packv: "1.4.0", tpl: "Forge", tplv: "2.1.0",
      state: "live", env: "production", host: "tradex.example.in", cfg: 42, dep: "2 days ago",
      owner: "owner@tradex.example.in", colour: "#2b5cff", iso: "shared", loc: "IN · INR · en-IN" },
    { key: "verdeleaf", name: "Verde Leaf Garden Co.", pack: "Agriculture & Gardening", packv: "0.9.2",
      tpl: "Aurora", tplv: "1.3.0", state: "live", env: "production", host: "verdeleaf.example.in", cfg: 17,
      dep: "6 days ago", owner: "rani@verdeleaf.example.in", colour: "#2f855a", iso: "shared", loc: "IN · INR · en-IN" },
    { key: "atelier", name: "Atelier Nine", pack: "Fashion & Apparel", packv: "1.1.0", tpl: "Aurora", tplv: "1.3.0",
      state: "live", env: "production", host: "ateliernine.example.com", cfg: 23, dep: "yesterday",
      owner: "hello@ateliernine.example.com", colour: "#b5446e", iso: "shared", loc: "IN · INR · en-IN" },
    { key: "harbour", name: "Harbour Fresh Seafood", pack: "Fish", packv: "0.6.0", tpl: "Aurora", tplv: "1.2.0",
      state: "live", env: "production", host: "harbourfresh.example.in", cfg: 9, dep: "3 hours ago",
      owner: "ops@harbourfresh.example.in", colour: "#1b6b8f", iso: "shared", loc: "IN · INR · en-IN" },
    { key: "oakrow", name: "Oakrow Furniture", pack: "Home & Furniture", packv: "0.8.1", tpl: "Aurora",
      tplv: "1.3.0", state: "deploying", env: "production", host: "oakrow.example.in", cfg: 4, dep: "running now",
      owner: "mail@oakrow.example.in", colour: "#8a5a2b", iso: "shared", loc: "IN · INR · en-IN" },
    { key: "northgear", name: "Northgear Industrial", pack: "Industrial & Hardware", packv: "0.5.0", tpl: "Forge",
      tplv: "2.1.0", state: "draft", env: "staging", host: "northgear.staging.example", cfg: 0, dep: "never",
      owner: "not invited yet", colour: "#4a5568", iso: "shared", loc: "IN · INR · en-IN" },
    { key: "pawpost", name: "Paw Post Pet Supplies", pack: "Pet Supplies", packv: "0.4.0", tpl: "Aurora",
      tplv: "1.2.0", state: "suspended", env: "production", host: "pawpost.example.in", cfg: 11,
      dep: "28 days ago", owner: "admin@pawpost.example.in", colour: "#7a4fbf", iso: "shared", loc: "IN · INR · en-IN" }
  ];
  RA.stateTag = function (s) {
    var m = { live: ["ok", "Live"], deploying: ["acc", "Deploying"], draft: ["", "Draft"],
              suspended: ["warn", "Suspended"], archived: ["", "Archived"], failed: ["bad", "Failed"] };
    var t = m[s] || ["", s];
    return '<span class="tag ' + t[0] + '"><span class="dot"></span>' + t[1] + "</span>";
  };

  RA.packs = [
    ["VP-electronics", "Electronics", "1.4.0", "published", 1, "Serial numbers, condition grades, compatibility, refurbished inspection, dealer tiers"],
    ["VP-fashion_apparel", "Fashion & Apparel", "1.1.0", "published", 1, "Size and colour variant matrix, size guide, seasons and collections, exchange-led returns"],
    ["VP-agriculture", "Agriculture & Gardening", "0.9.2", "published", 1, "Seasonality, live plants, batch and lot tracking, regulated chemicals, bulk units"],
    ["VP-seafood", "Fish", "0.6.0", "published", 1, "Cold chain, catch and pack dates, weight pricing, very short shelf life"],
    ["VP-furniture", "Home & Furniture", "0.8.1", "published", 1, "Bulky freight, lead times, made-to-order options, room and dimension attributes"],
    ["VP-industrial_hardware", "Industrial & Hardware", "0.5.0", "published", 1, "Technical specifications, bulk packs, B2B pricing, datasheets"],
    ["VP-pet_supplies", "Pet Supplies", "0.4.0", "published", 1, "Subscriptions, weight packs, expiry dates"],
    ["VP-grocery", "Grocery & Supermarket", "0.3.0", "draft", 0, "Batch and expiry, weight pricing, delivery slots, minimum order value"],
    ["VP-jewellery", "Jewelry & Watches", "0.2.0", "draft", 0, "Metal and stone attributes, hallmarking, weight-based pricing, high-value handling"],
    ["VP-digital", "Digital Products", "0.2.0", "draft", 0, "No stock, licence keys and downloads, instant delivery, no shipping"],
    ["VP-services", "Services", "0.1.0", "draft", 0, "Appointments, capacity, no inventory, service areas"],
    ["VP-rental", "Rental Products", "0.1.0", "draft", 0, "Rental periods, availability calendar, deposits, return condition"]
  ];

  RA.caps = [
    ["CAP-SERIAL_TRACKING", "Inventory", "Track individual units by serial number", "electronics, jewellery", 2],
    ["CAP-BATCH_LOT", "Inventory", "Track stock by batch or lot", "grocery, fish, agriculture, beauty", 3],
    ["CAP-EXPIRY_DATES", "Inventory", "Record and act on shelf life", "grocery, fish, pet supplies", 3],
    ["CAP-UNIQUE_ITEMS", "Catalog", "Every item is one of a kind, quantity fixed at one", "antiques, collectibles", 0],
    ["CAP-VARIANT_MATRIX", "Catalog", "Two-axis variant grid, for example size by colour", "fashion, footwear", 1],
    ["CAP-SIZE_GUIDE", "Catalog", "Size guide on the product page", "fashion, footwear", 1],
    ["CAP-CONDITION_GRADES", "Catalog", "New, open-box, refurbished and used grades", "electronics", 1],
    ["CAP-COMPATIBILITY", "Catalog", "“Fits your device” compatibility links", "electronics, automotive", 1],
    ["CAP-WEIGHT_PRICED_ITEMS", "Pricing", "Price by weight or volume", "fish, grocery, agriculture", 3],
    ["CAP-QUANTITY_TIERS", "Pricing", "Quantity break pricing", "all B2B-capable stores", 5],
    ["CAP-COLD_CHAIN", "Inventory", "Temperature-controlled handling and packing rules", "fish, grocery", 2],
    ["CAP-SCHEDULED_DELIVERY_SLOTS", "Orders", "Customer chooses a delivery slot", "grocery, fish, furniture", 3],
    ["CAP-FREIGHT_BULKY", "Fulfilment", "Bulky and freight delivery", "furniture, industrial, construction", 2],
    ["CAP-DIGITAL_DELIVERY", "Fulfilment", "Download or licence key delivery", "digital products, books & media", 0],
    ["CAP-SERVICE_APPOINTMENTS", "Fulfilment", "Book an appointment instead of a shipment", "services", 0],
    ["CAP-RENTAL_LOGISTICS", "Fulfilment", "Send out and take back rented items", "rental", 0],
    ["CAP-SUBSCRIPTION_PLANS", "Catalog", "Recurring plans with billing cycles", "subscriptions, pet supplies", 1],
    ["CAP-MADE_TO_ORDER", "Catalog", "Configured or made-to-order items with lead times", "handmade, furniture", 1],
    ["CAP-VENDOR_PORTAL", "Vendor", "Suppliers get their own portal", "electronics, industrial, fashion", 3],
    ["CAP-BUSINESS_ACCOUNTS", "Customers", "Approved business accounts with members", "wholesale, industrial, office", 4],
    ["CAP-EXCHANGES", "Returns", "Exchange instead of refund", "fashion, footwear", 1],
    ["CAP-AGE_GATE", "Storefront", "Age confirmation before browsing", "regulated categories", 0]
  ];

  /* ---------------- shell ---------------- */
  function navHtml(cur) {
    var h = "";
    RA.nav.forEach(function (g) {
      h += '<div class="grp">' + g[0] + "</div>";
      g[1].forEach(function (i) {
        var label = i[0];
        h += '<a href="' + i[1] + '"' + (i[1] === cur ? ' class="on" aria-current="page"' : "") + ">" +
          RA.icon(i[2]) + "<span>" + label + "</span>" +
          (i[4] ? '<span class="cnt">' + i[4] + "</span>" : "") + "</a>";
      });
    });
    return h;
  }

  RA.shell = function (opts) {
    opts = opts || {};
    var cur = (location.pathname.split("/").pop() || "ra-dashboard.html");
    var main = document.querySelector("main");
    if (!main) return;

    var side = document.createElement("aside");
    side.className = "ra-side";
    side.innerHTML =
      '<div class="ra-brand"><span class="ra-logo" aria-hidden="true">RA</span>' +
      '<span class="bi"><span class="bt">Configurable Root Admin</span>' +
      '<span class="bs">Commerce platform control plane</span></span></div>' +
      '<div class="ra-env"><label for="ra-env">Environment</label>' +
      '<select id="ra-env"><option>Production</option><option>Staging</option></select></div>' +
      '<nav class="ra-nav" aria-label="Platform">' + navHtml(cur) + "</nav>" +
      '<div class="foot">Prototype v0.1 &middot; internal<br>Platform release 1.12.3</div>';

    var top = document.createElement("div");
    top.className = "ra-top";
    top.innerHTML =
      '<button class="btn sm ra-menu" id="ra-menu" aria-label="Menu">' + RA.icon("menu") + "</button>" +
      '<div class="ra-search">' + RA.icon("search") +
      '<input type="search" placeholder="Search stores, domains, categories, templates…" aria-label="Platform search"></div>' +
      '<span class="sp"></span>' +
      '<button class="btn sm ra-bell" id="ra-bell" title="Notifications" aria-label="Notifications: 3 unread">' +
      RA.icon("bell") + '<span class="cnt">3</span></button>' +
      '<button class="ra-user" id="ra-user" aria-label="Signed in as A. Menon, platform operator">' +
      '<span class="ra-av" aria-hidden="true">AM</span>' +
      '<span class="ui"><span class="un">A. Menon</span>' +
      '<span class="ur">Platform operator &middot; MFA on</span></span>' +
      RA.icon("down", "uc") + "</button>";

    var app = document.createElement("div");
    app.className = "ra-app";
    var wrap = document.createElement("div");
    wrap.className = "ra-main";
    document.body.insertBefore(app, main);
    app.appendChild(side);
    app.appendChild(wrap);
    wrap.appendChild(top);
    if (opts.support) {
      var sup = document.createElement("div");
      sup.className = "ra-support";
      sup.innerHTML = RA.icon("shield") + "<span><b>Support access active</b> &middot; store <b>" + opts.support +
        "</b> &middot; read-only &middot; expires in 3 h 12 min &middot; the store owner has been notified and every " +
        "action is written to their own audit trail.</span>" +
        '<span style="margin-left:auto"><button class="btn sm" data-demo="Support access ended. The grant is closed ' +
        'and the store owner has been notified.">End access now</button></span>';
      wrap.appendChild(sup);
    }
    wrap.appendChild(main);
    main.className = "ra-body";

    document.getElementById("ra-menu").addEventListener("click", function () { side.classList.toggle("on"); });
    document.getElementById("ra-bell").addEventListener("click", function () {
      RA.toast("3 notifications: Oakrow deployment running · Paw Post suspended 28 days · 1 instance behind on configuration");
    });
    document.getElementById("ra-user").addEventListener("click", function () {
      RA.toast("Signed in as A. Menon · Platform operator · MFA verified 41 minutes ago");
    });
    document.getElementById("ra-env").addEventListener("change", function () {
      RA.toast("Prototype: the environment switcher is not wired to sample data.");
    });
  };

  /* ---------------- helpers ---------------- */
  /* Put the window back at the top after a layout that may have moved it (tab panes, injected tables). */
  RA.toTop = function () {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var n = 0;
    (function again() {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
      if (++n < 4) requestAnimationFrame(again);
    })();
    setTimeout(function () { if (window.scrollY !== 0) window.scrollTo(0, 0); }, 120);
  };

  RA.toast = function (msg) {
    var t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    var d = document.createElement("div");
    d.textContent = msg;
    t.appendChild(d);
    setTimeout(function () { d.remove(); }, 4200);
  };

  RA.table = function (cols, rows, cls) {
    var h = '<div class="tw"><table class="t' + (cls ? " " + cls : "") + '"><thead><tr>';
    cols.forEach(function (c) { h += "<th>" + c + "</th>"; });
    h += "</tr></thead><tbody>";
    rows.forEach(function (r) {
      h += "<tr>";
      r.forEach(function (c) { h += "<td>" + c + "</td>"; });
      h += "</tr>";
    });
    return h + "</tbody></table></div>";
  };

  RA.tabs = function (root) {
    var host = typeof root === "string" ? document.querySelector(root) : root;
    if (!host) return;
    var bar = host.querySelector(".tabs");
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-tab]");
      if (!b) return;
      bar.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      host.querySelectorAll(".pane").forEach(function (p) {
        p.classList.toggle("on", p.id === b.dataset.tab);
      });
      if (history.replaceState) history.replaceState(null, "", "#" + b.dataset.tab);
    });
    var want = location.hash.slice(1);
    var target = want && bar.querySelector('button[data-tab="' + want + '"]');
    (target || bar.querySelector("button")).click();
    // A tabbed page changes height twice while it loads: the browser may jump to a #tab anchor, and hiding the
    // other panes then shrinks the document underneath that position. Both leave the page scrolled into empty
    // space. Start at the top, after the panes have settled.
    RA.toTop();
  };

  RA.picks = function (sel, onPick) {
    document.querySelectorAll(sel).forEach(function (b) {
      b.addEventListener("click", function () {
        var group = b.closest("[data-pickgroup]") || document;
        group.querySelectorAll(sel).forEach(function (o) { o.classList.remove("on"); });
        b.classList.add("on");
        if (onPick) onPick(b);
      });
    });
  };

  RA.overlay = function (id) {
    var el = document.getElementById(id);
    if (!el) return { open: function () {}, close: function () {} };
    var scrim = document.querySelector(".scrim");
    if (!scrim) {
      scrim = document.createElement("div");
      scrim.className = "scrim";
      document.body.appendChild(scrim);
    }
    var last = null;
    function close() {
      el.classList.remove("on");
      if (!document.querySelector(".drawer.on,.modal.on")) scrim.classList.remove("on");
      if (last) last.focus();
    }
    function open() {
      last = document.activeElement;
      scrim.classList.add("on");
      el.classList.add("on");
      var f = el.querySelector("button,a,input,select,textarea");
      if (f) f.focus();
    }
    scrim.addEventListener("click", close);
    el.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && el.classList.contains("on")) close(); });
    return { open: open, close: close };
  };

  /* Any element with data-open="<overlay id>" opens that drawer or modal. */
  RA.wireOpeners = function () {
    var cache = {};
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-open]");
      if (!t) return;
      e.preventDefault();
      var id = t.dataset.open;
      cache[id] = cache[id] || RA.overlay(id);
      cache[id].open();
    });
  };

  /* Buttons that only demonstrate an action in the prototype. */
  RA.wireDemo = function () {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-demo]");
      if (!t) return;
      e.preventDefault();
      RA.toast(t.dataset.demo);
    });
  };

  RA.boot = function (opts) {
    RA.shell(opts);
    RA.wireOpeners();
    RA.wireDemo();
    document.querySelectorAll("[data-tabs]").forEach(function (h) { RA.tabs(h); });
    RA.toTop();
    document.querySelectorAll("svg[data-i]").forEach(function (s) {
      s.outerHTML = RA.icon(s.dataset.i);
    });
  };
})();
