/* Root Admin help · Templates (P-R07). Source: plan/19-saas-platform.md §7. */
RA.help.add({
  "page": { t: "Site templates", k: "Page guide",
    what: "The visual designs a client's website can use. A template decides layout, spacing, typography and imagery — and nothing else.",
    why: "Look is what clients care most about, and it must never affect money. Keeping the two apart is what lets a store change its design without touching a single record.",
    read: ["Each template card shows its character, the categories it suits, its accessibility status and how many stores use it.",
      "The versions table below is where lifecycle happens: publish, migrate stores, deprecate, retire.",
      "The two lists at the bottom — what a template may and may not change — are the boundary that makes all of this safe."],
    do: ["Preview a template with a real store's branding before offering it. A name tells a client nothing.",
      "Use <b>Plan an update</b> to see which stores would change before publishing a new version."],
    notes: ["Every template renders the same data through the same contracts, so switching one needs no data migration and can be reversed.",
      "Retiring is blocked while any store uses a template; deprecating is the step that stops new stores choosing it."],
    map: [["ra.t.versions", "Versions and assignment"], ["ra.t.may", "What a template may change"], ["ra.t.maynot", "What it may never change"]],
    rel: ["g.template", "g.branding"] },

  "ra.t.versions": { t: "Versions and assignment", k: "Table",
    what: "Every template version, its state, the categories it suits, and which stores are on it.",
    read: ["<b>Superseded</b> means a newer version exists and some stores are still on the old one — that is normal, not a fault. Stores move only when you migrate them."],
    rel: ["g.template"] },

  "ra.t.may": { t: "What a template may change", k: "Section",
    what: "Layout, section order, component styling and density, typography and spacing, imagery treatment, motion, and how things arrange on small screens.",
    rel: ["g.template"] },

  "ra.t.maynot": { t: "What a template may never change", k: "Section",
    what: "Prices or how they are calculated, stock and availability, tax, policies and disclosures, validation, checkout steps, which features exist, or any brand name, colour or wording.",
    why: "If a template could change any of those, switching one would be a business change rather than a visual one — and no client would ever dare.",
    rel: ["g.template", "g.branding"] }
});
