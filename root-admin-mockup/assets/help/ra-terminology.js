/* Root Admin help · Wording (P-R09). Source: plan/19-saas-platform.md §11. */
RA.help.add({
  "page": { t: "Wording", k: "Page guide",
    what: "The words each kind of store uses for everyday things — product, piece, catch, batch, dealer, stockist — and the place they are edited.",
    why: "It is why a fish shop and a computer shop can run on the same system without either sounding wrong to its own staff.",
    read: ["<b>Compare categories</b> shows the same concept across five kinds of business. It is the fastest way to understand what this page is for.",
      "<b>Wording set</b> is where you actually edit, for one category and one language.",
      "<b>Coverage</b> is the check: a category with missing words cannot be given to a store."],
    do: ["Edit for the category, not for one client, unless a client has genuinely different trade language.",
      "Use the preview to judge wording in a real screen rather than in a list — a word that reads well in a table can read badly in a sentence."],
    notes: ["Nothing in the system is called “product” in the code. Everything asks this set, which is why adding a category never means renaming anything.",
      "Changing a word changes it everywhere in the stores that use it — every screen, email, document and export."],
    map: [["ra.tm.comp", "The same concept, five businesses"], ["ra.tm.set", "Editing a set"], ["ra.tm.cov", "Coverage"]],
    rel: ["g.terminology", "g.category", "g.completeness"] },

  "ra.tm.comp": { t: "Compare categories", k: "Tab",
    what: "One row per concept, one column per kind of business, so you can see what actually differs.",
    rel: ["g.terminology"] },

  "ra.tm.set": { t: "Wording set", k: "Tab",
    what: "The editable words for one category and one language, with singular, plural and an example sentence.",
    read: ["<b>Overridden by a store</b> means one client uses a different word from their category's default — usually their trade language."],
    notes: ["Pluralisation and grammar belong to the entry, not to the place it is used, so a word used in twenty screens only has to be right once."],
    rel: ["g.terminology"] },

  "ra.tm.cov": { t: "Coverage", k: "Tab",
    what: "Which categories have a complete set of words, and exactly which entries are missing.",
    why: "A missing word does not produce a blank screen in production — it blocks publishing, here, where it is cheap to fix.",
    rel: ["g.completeness", "g.terminology"] }
});
