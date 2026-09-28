/* Configurable Root Admin — contextual help engine.
   Mirrors the ERP/vendor help pattern (D-224) for the platform control plane (D-280):
     · data-help="<key>" on any element adds a small ⓘ that opens the help panel on that entry
     · a tab bar whose buttons carry data-help gets one "About this tab" button for the active tab
     · glossary terms with `ab` are underlined at their first mention in each card and explain themselves
     · the ? in the top bar opens the page guide; "Help icons" hides or shows every ⓘ
   Content lives in assets/help/glossary.js, shell.js and <page>.js, each calling RA.help.add({ key: entry }).
   Entry fields: t title · k kind · full expansion · short one-line · what · why · read[] · do[] · next ·
                 notes[] · lists[{h,items[[term,def]]}] · map[[key,note]] · rel[] · ab[] (glossary only). */
(function () {
  "use strict";
  var H = (RA.help = { e: {}, ready: false });
  H.add = function (o) { for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) H.e[k] = o[k]; };

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* [[key|label]] and [[key]] become links into the panel */
  function txt(v) {
    return String(v == null ? "" : v).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, k, l) {
      return H.e[k] ? '<button type="button" class="hp-link" data-hp-go="' + k + '">' + (l || H.e[k].t) + "</button>"
                    : (l || k); });
  }
  function para(v) {
    if (!v) return "";
    return Array.isArray(v) ? '<ul class="hp-ul">' + v.map(function (x) { return "<li>" + txt(x) + "</li>"; }).join("") + "</ul>"
                            : "<p>" + txt(v) + "</p>";
  }
  function steps(v) {
    return Array.isArray(v) ? '<ol class="hp-ol">' + v.map(function (x) { return "<li>" + txt(x) + "</li>"; }).join("") + "</ol>"
                            : para(v);
  }
  function sec(icon, h, body) {
    return body ? '<section class="hp-sec"><h3>' + RA.icon(icon) + "<span>" + h + "</span></h3>" + body + "</section>" : "";
  }

  function entryHTML(key) {
    var e = H.e[key];
    if (!e) return '<p class="hp-lead">No help is written for this item yet.</p>';
    var rel = (e.rel || []).filter(function (k) { return H.e[k]; });
    return [
      e.short && key.indexOf("g.") === 0 ? '<p class="hp-lead">' + txt(e.short) + "</p>" : "",
      sec("info", "What it is", para(e.what)),
      sec("act", "Why it matters", para(e.why)),
      sec("eye", "How to read it", para(e.read)),
      sec("check", "What to do", steps(e.do)),
      (e.lists || []).map(function (l) {
        return sec("layers", l.h, '<dl class="hp-dl">' + l.items.map(function (p) {
          return "<dt>" + txt(p[0]) + "</dt><dd>" + txt(p[1]) + "</dd>"; }).join("") + "</dl>");
      }).join(""),
      sec("chev", "What happens next", para(e.next)),
      sec("warn", "Worth knowing", para(e.notes)),
      e.map ? sec("grid", "On this page", '<ul class="hp-map">' + e.map.filter(function (p) { return H.e[p[0]]; })
        .map(function (p) { return '<li><button type="button" class="hp-link" data-hp-go="' + p[0] + '">' +
          H.e[p[0]].t + "</button>" + (p[1] ? "<span>" + txt(p[1]) + "</span>" : "") + "</li>"; }).join("") + "</ul>") : "",
      rel.length ? sec("link", "Related", '<div class="hp-rel">' + rel.map(function (k) {
        return '<button type="button" class="hp-chip" data-hp-go="' + k + '">' + H.e[k].t + "</button>"; }).join("") + "</div>") : ""
    ].join("");
  }

  function glossaryHTML() {
    var ks = Object.keys(H.e).filter(function (k) { return k.indexOf("g.") === 0; })
      .sort(function (a, b) { return H.e[a].t.localeCompare(H.e[b].t); });
    if (!ks.length) return '<p class="hp-lead">The glossary is still loading…</p>';
    var cur = "", out = '<p class="hp-lead">The words used across this portal. Anything underlined with dots on a page opens here too.</p>';
    ks.forEach(function (k) {
      var L = H.e[k].t[0].toUpperCase();
      if (L !== cur) { out += (cur ? "</div>" : "") + '<h3 class="hp-letter">' + L + '</h3><div class="hp-gl">'; cur = L; }
      out += '<button type="button" class="hp-gi" data-hp-go="' + k + '"><b>' + esc(H.e[k].t) + "</b>" +
        (H.e[k].full ? "<i>" + esc(H.e[k].full) + "</i>" : "") +
        "<span>" + String(H.e[k].short || "").replace(/<[^>]+>/g, "").replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, "$2$1") + "</span></button>";
    });
    return out + (cur ? "</div>" : "");
  }

  function searchHTML(q) {
    var n = q.toLowerCase(), hits = [];
    Object.keys(H.e).forEach(function (k) {
      var e = H.e[k], hay = [e.t, e.full, e.short, e.what, e.why].concat(e.read || [], e.do || [], e.notes || [])
        .join(" ").toLowerCase();
      var s = 0;
      if ((e.t || "").toLowerCase().indexOf(n) === 0) s = 3;
      else if ((e.t || "").toLowerCase().indexOf(n) >= 0) s = 2;
      else if (hay.indexOf(n) >= 0) s = 1;
      if (s) hits.push({ k: k, s: s });
    });
    hits.sort(function (a, b) { return b.s - a.s || H.e[a.k].t.localeCompare(H.e[b.k].t); });
    hits = hits.slice(0, 40);
    if (!hits.length) return '<p class="hp-lead">Nothing found for “' + esc(q) + '”. Try a shorter word, or open the glossary.</p>';
    return '<p class="hp-lead">' + hits.length + (hits.length === 40 ? "+" : "") + " result" + (hits.length > 1 ? "s" : "") +
      " for “" + esc(q) + '”</p><div class="hp-gl">' + hits.map(function (h) {
        var e = H.e[h.k];
        return '<button type="button" class="hp-gi" data-hp-go="' + h.k + '"><b>' + esc(e.t) + "</b><i>" +
          (h.k.indexOf("g.") === 0 ? "Term" : esc(e.k || "Help")) + "</i><span>" +
          String(e.short || (Array.isArray(e.what) ? e.what[0] : e.what) || "").replace(/<[^>]+>/g, "").slice(0, 150) +
          "</span></button>"; }).join("") + "</div>";
  }

  var panel, hist = [];

  function render() {
    var v = hist[hist.length - 1] || { view: "page" }, kind = "Help", title = "Help", full = "", body = "";
    if (v.view === "glossary") { kind = "Reference"; title = "Glossary A–Z"; body = glossaryHTML(); }
    else if (v.view === "search") { kind = "Search"; title = "Help search"; body = searchHTML(v.q); }
    else if (v.key) {
      var e = H.e[v.key] || {};
      kind = e.k || (v.key.indexOf("g.") === 0 ? "Term" : "Help"); title = e.t || v.key; full = e.full || "";
      body = entryHTML(v.key);
    } else {
      kind = "Page guide"; title = (H.e.page && H.e.page.t) || document.title.split("—")[0].trim();
      body = (H.e.page ? entryHTML("page") : '<p class="hp-lead">No page guide is written for this screen yet.</p>') +
        sec("layers", "Getting around", '<div class="hp-rel">' +
          (H.e["ra.basics"] ? '<button type="button" class="hp-chip" data-hp-go="ra.basics">' + H.e["ra.basics"].t + "</button>" : "") +
          '<button type="button" class="hp-chip" data-hp-view="glossary">Glossary A–Z</button></div>');
    }
    panel.querySelector(".hp-kind").textContent = kind;
    panel.querySelector(".hp-ttl").textContent = title;
    var f = panel.querySelector(".hp-full"); f.textContent = full; f.hidden = !full;
    var b = panel.querySelector(".hp-body"); b.innerHTML = body; b.scrollTop = 0;
    panel.querySelector("[data-hp-back]").hidden = hist.length < 2;
    panel.querySelectorAll(".hp-seg button").forEach(function (x) {
      x.classList.toggle("active", x.dataset.hpView === (v.view === "glossary" ? "glossary" : v.view === "page" && !v.key ? "page" : ""));
    });
    if (v.view !== "search") panel.querySelector(".hp-q input").value = "";
  }

  function open(v) {
    hist.push(v); if (hist.length > 30) hist.shift();
    panel.classList.add("on"); document.body.classList.add("hp-open");
    render();
    panel.querySelector(".hp-ttl").setAttribute("tabindex", "-1");
    panel.querySelector(".hp-ttl").focus();
  }
  function close() { panel.classList.remove("on"); document.body.classList.remove("hp-open"); }

  H.open = function (key) { open(key ? { view: "page", key: key } : { view: "page" }); };

  /* ---- glossary underlining: first mention of an abbreviation inside each card/panel ---- */
  function markTerms(root) {
    var terms = [];
    Object.keys(H.e).forEach(function (k) {
      (H.e[k].ab || []).forEach(function (a) { terms.push({ a: a, k: k }); });
    });
    if (!terms.length) return;
    terms.sort(function (x, y) { return y.a.length - x.a.length; });
    var re = new RegExp("\\b(" + terms.map(function (t) {
      return t.a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")\\b");
    var map = {}; terms.forEach(function (t) { map[t.a] = t.k; });
    (root || document).querySelectorAll(".card, .note, .hp-body, .kpi").forEach(function (box) {
      var seen = {};
      var walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var p = n.parentNode;
          while (p && p !== box) {
            var tg = p.tagName;
            if (tg === "ABBR" || tg === "BUTTON" || tg === "A" || tg === "SCRIPT" || tg === "STYLE" ||
                tg === "CODE" || tg === "TH" || tg === "H1" || tg === "H2" || tg === "H3" || tg === "H4")
              return NodeFilter.FILTER_REJECT;
            p = p.parentNode;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes = [], n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(function (node) {
        var m = re.exec(node.nodeValue);
        if (!m) return;
        var term = m[1];
        if (seen[term]) return;
        seen[term] = 1;
        var after = node.splitText(m.index);
        after.splitText(term.length);
        var ab = document.createElement("abbr");
        ab.className = "hterm"; ab.textContent = term;
        ab.setAttribute("data-hp-go", map[term]);
        ab.setAttribute("title", String(H.e[map[term]].short || "").replace(/<[^>]+>/g, ""));
        after.parentNode.replaceChild(ab, after);
      });
    });
  }

  /* ---- ⓘ injection ---- */
  function addIcons(root) {
    (root || document).querySelectorAll("[data-help]").forEach(function (el) {
      if (el.dataset.hiDone) return;
      el.dataset.hiDone = "1";
      var k = el.dataset.help;
      var b = document.createElement("button");
      b.type = "button"; b.className = "hi"; b.dataset.hpGo = k;
      b.setAttribute("aria-label", "What is this? " + (H.e[k] ? H.e[k].t : k));
      b.innerHTML = RA.icon("info");
      el.appendChild(b);
    });
    /* one "About this tab" per tab bar */
    (root || document).querySelectorAll(".tabs").forEach(function (bar) {
      if (bar.dataset.hiDone) return;
      var any = bar.querySelector("button[data-help]");
      if (!any) return;
      bar.dataset.hiDone = "1";
      var b = document.createElement("button");
      b.type = "button"; b.className = "hi hi-tab"; b.dataset.hpTab = "1";
      b.setAttribute("aria-label", "About this tab");
      b.innerHTML = RA.icon("info");
      bar.appendChild(b);
    });
  }

  H.refresh = function (root) { addIcons(root); markTerms(root); };

  H.mount = function () {
    panel = document.createElement("aside");
    panel.className = "hp";
    panel.setAttribute("aria-label", "Help");
    panel.innerHTML =
      '<div class="hp-head"><div style="flex:1;min-width:0">' +
      '<div class="hp-kind"></div><div class="hp-ttl" tabindex="-1"></div><div class="hp-full" hidden></div></div>' +
      '<button class="x" data-hp-back hidden aria-label="Back">' + RA.icon("back") + "</button>" +
      '<button class="x" data-hp-close aria-label="Close help">✕</button></div>' +
      '<div class="hp-tools"><div class="hp-q">' + RA.icon("search") +
      '<input type="search" placeholder="Search help" aria-label="Search help"></div>' +
      '<div class="hp-seg"><button type="button" data-hp-view="page">Page</button>' +
      '<button type="button" data-hp-view="glossary">Glossary</button></div></div>' +
      '<div class="hp-body"></div>' +
      '<div class="hp-foot">' + RA.icon("info") +
      '<span>Explanations are written for whoever is managing the platform — no technical background assumed.</span></div>';
    document.body.appendChild(panel);

    panel.addEventListener("click", function (e) {
      var g = e.target.closest("[data-hp-go]");
      if (g) { open({ view: "page", key: g.dataset.hpGo }); return; }
      var v = e.target.closest("[data-hp-view]");
      if (v) { open({ view: v.dataset.hpView }); return; }
      if (e.target.closest("[data-hp-back]")) { hist.pop(); render(); return; }
      if (e.target.closest("[data-hp-close]")) close();
    });
    var q = panel.querySelector(".hp-q input");
    var t;
    q.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var s = q.value.trim();
        if (s.length < 2) return;
        hist.push({ view: "search", q: s }); render(); q.value = s; q.focus();
      }, 220);
    });

    document.addEventListener("click", function (e) {
      var g = e.target.closest("[data-hp-go]");
      if (g && !panel.contains(g)) { e.preventDefault(); open({ view: "page", key: g.dataset.hpGo }); return; }
      if (e.target.closest("[data-hp-tab]")) {
        var bar = e.target.closest(".tabs");
        var on = bar.querySelector("button.on[data-help]") || bar.querySelector("button[data-help]");
        if (on) open({ view: "page", key: on.dataset.help });
        return;
      }
      if (e.target.closest("[data-hp-home]")) { H.open(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("on")) close();
    });

    if (localStorage.getItem("ra-hi") === "off") document.body.classList.add("hi-off");
    H.refresh();
    H.ready = true;
  };

  H.toggleIcons = function () {
    var off = document.body.classList.toggle("hi-off");
    localStorage.setItem("ra-hi", off ? "off" : "on");
    RA.toast(off ? "Help icons hidden. Turn them back on from the ? menu." : "Help icons shown.");
  };
})();
