/* Root Admin help · E-commerce categories (P-R06). Source: plan/19-saas-platform.md §6, plan/20-root-admin.md §6. */
RA.help.add({
  "page": { t: "E-commerce categories", k: "Page guide",
    what: "The kinds of business the platform can run — fashion, grocery, fish, electronics — each one expressed as configuration rather than as separate software.",
    why: "This is the answer to “how do you serve a fish shop and a computer shop with one system?” A category decides the product structure, how stock is identified, which features start on, which screens staff see and the words everyone uses.",
    read: ["<b>Published</b> categories can be given to a new store. <b>Draft</b> ones cannot.",
      "<b>In use</b> matters: a category no store uses can be retired; one in use cannot.",
      "The list of all 31 supported categories at the bottom shows what the platform covers versus what has been authored so far."],
    do: ["Open a category to see exactly what it turns on before offering it to a client.",
      "Use the migration planner rather than editing a live category. It shows what would change for each affected store first."],
    notes: ["A category never contains program code. If a client needs behaviour no feature provides, that is one change to the platform — and every category gets it afterwards.",
      "Publishing a new version of a category changes no existing store."],
    map: [["ra.p.table", "The catalogue"], ["ra.p.contains", "What a category contains"], ["ra.p.all", "All 31 supported categories"]],
    rel: ["g.category", "g.bundle", "g.module", "g.completeness"] },

  "ra.p.table": { t: "Category catalogue", k: "Table",
    lists: [{ h: "Columns", items: [
      ["Category", "Its name and its identifier."],
      ["Version", "Categories are versioned; a store is pinned to one."],
      ["State", "Published means selectable for new stores; draft means not yet."],
      ["What it turns on", "The short version of why this category is different."],
      ["In use", "How many stores are on it. Retiring is blocked while any store uses it."]] }],
    rel: ["g.category"] },

  "ra.p.contains": { t: "What a category contains", k: "Section",
    what: "Three kinds of thing: the structure it creates, the behaviour it switches on, and the words and screens it produces.",
    notes: ["Never program code. That boundary is what keeps one codebase serving every kind of business."],
    rel: ["g.category", "g.terminology"] },

  "ra.p.all": { t: "All supported categories", k: "Section",
    what: "Every kind of business the platform is designed to cover. <b>Built</b> means a category has been authored; <b>available</b> means it can be authored without any change to the software.",
    why: "It is the honest picture: the architecture supports all of them, and the work to add one is authoring, not engineering.",
    rel: ["g.category"] },

  "ra.p.new": { t: "New category", k: "Dialog",
    what: "Starts a new kind of business, from scratch or as a copy of an existing one.",
    read: ["<b>How is a stock unit identified?</b> is the choice that shapes everything else — quantity only, serial numbers, batches, batches with an expiry, or one-of-a-kind items."],
    notes: ["A new category starts as a draft and cannot be given to a store until its structure, features and complete wording pass the completeness check."],
    rel: ["g.category", "g.completeness"] },

  "ra.p.drawer": { t: "Category detail", k: "Panel",
    what: "What this category turns on, the structure it creates, what is on and off by default, and which templates suit it.",
    do: ["<b>Plan a migration</b> shows what would change, store by store, before anything happens.",
      "<b>Publish version</b> makes it selectable for new stores. Existing stores are untouched."],
    rel: ["g.category", "g.template"] }
});
