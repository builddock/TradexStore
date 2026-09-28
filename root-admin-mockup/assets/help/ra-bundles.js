/* Root Admin help · Bundles (P-R13). Source: plan/19-saas-platform.md §5.5, §6.9. */
RA.help.add({
  "page": { t: "Bundles", k: "Page guide",
    what: "Reusable packages of settings that a category is assembled from — perishable goods, trade accounts, sizes and colours, supplier network.",
    why: "Without them, the third person to build a perishable-goods category would not make the same forty decisions as the first, and categories would drift apart. A bundle is that thinking, done once.",
    read: ["A category is <b>base + bundles (in the order you choose) + category-specific changes</b>.",
      "The worked example shows exactly how one real category was assembled, and how many settings each bundle contributed.",
      "The completeness list at the bottom is the 25 things that must be answered before any category can be published."],
    do: ["Build a new category by applying bundles first and only then making category-specific changes. It is faster and far more consistent.",
      "If two bundles disagree, resolve it explicitly. The system will not choose for you."],
    notes: ["A published bundle version cannot be edited. A category pins the versions it was built from, so improving a bundle never silently changes a live store.",
      "Nothing about bundles reaches a client's store — a store only ever receives the finished configuration."],
    map: [["ra.b.table", "The library"], ["ra.b.example", "How a category is assembled"], ["ra.b.complete", "The completeness check"]],
    rel: ["g.bundle", "g.category", "g.completeness"] },

  "ra.b.table": { t: "Bundle library", k: "Table",
    what: "Every bundle, what it gives a category, and which categories use it.",
    read: ["<b>Used by</b> tells you the blast radius of changing one. A bundle used by six categories is not a casual edit."],
    rel: ["g.bundle"] },

  "ra.b.example": { t: "How a category is assembled", k: "Section",
    what: "A real worked example: the base profile, then each bundle in order, then the category's own changes.",
    read: ["Later steps override earlier ones, and every value shows where it came from — so you can always tell a bundle's default from a deliberate choice."],
    rel: ["g.bundle"] },

  "ra.b.complete": { t: "Completeness check", k: "Section",
    what: "The 25 things that must be answered before a category can be published, checked by the system rather than by a person with a list.",
    why: "It turns “did we configure everything?” from a memory exercise into a mechanical check.",
    notes: ["Anything unanswered blocks publishing, and the same report is visible while you work."],
    rel: ["g.completeness", "g.terminology"] },

  "ra.b.new": { t: "New bundle", k: "Dialog",
    what: "Starts a new reusable package, empty or as a copy of an existing one.",
    notes: ["A bundle may only use features that exist in the platform release. If it needs something new, that is one change to the system — and every category gets it afterwards."],
    rel: ["g.bundle", "g.feature"] }
});
