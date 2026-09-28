/* Root Admin help · Stores (P-R03). Source: plan/20-root-admin.md §6. */
RA.help.add({
  "page": { t: "Stores", k: "Page guide",
    what: "The register of every client store on the platform, and the place you start almost every piece of work from.",
    why: "Every row here is one deployment of the same software. Adding a client adds configuration and starting content — never an application, never a copy of the code.",
    read: ["<b>Category</b> is the kind of business and the version of that category the store is pinned to.",
      "<b>Template</b> is the visual design it uses.",
      "<b>State</b> is whether it is serving customers, and in which environment.",
      "<b>Configuration</b> is the published version number the store is running.",
      "<b>Hosting</b> says where it runs and confirms its data is its own."],
    do: ["Use the filters and saved views rather than scanning: <i>Needs attention</i> and <i>Behind on configuration</i> are the two that matter most days.",
      "Open a store to change anything about it. Nothing here edits a store directly."],
    notes: ["A store's key is permanent and appears in its storage paths and platform address.",
      "Bulk actions still run one deployment per store, with a canary first — never all at once."],
    map: [["ra.stores.filters", "Narrowing the list"], ["ra.stores.table", "What each column means"],
      ["ra.stores.bulk", "Acting on several stores"]],
    rel: ["g.store", "g.category", "g.template", "g.hosting"] },

  "ra.stores.filters": { t: "Filters and saved views", k: "Section",
    what: "Narrow the list by category, state, environment, or one of the saved views.",
    do: ["<b>Needs attention</b> collects drafts, suspended stores and anything with a failed deployment.",
      "<b>Behind on configuration</b> is the one to check after a busy publishing day."] },

  "ra.stores.table": { t: "The store list", k: "Table",
    lists: [{ h: "Columns", items: [
      ["Store", "The client's name, their permanent key and their web address."],
      ["E-commerce category", "The kind of business, and the version pinned to this store."],
      ["Template", "The visual design and its version."],
      ["State", "Live, deploying, draft, suspended or archived — and the environment."],
      ["Configuration", "The published version the store is running now."],
      ["Hosting", "Where it runs, and confirmation that its data, images and index are its own."],
      ["Last deployment", "When this store last changed."]] }],
    rel: ["g.version", "g.separation"] },

  "ra.stores.bulk": { t: "Bulk actions", k: "Controls",
    what: "Publish or migrate several stores in one instruction.",
    notes: ["A bulk action is still one deployment per store, run as a canary first and then in batches. An all-at-once fleet change is refused — through the screen and through the interface behind it.",
      "Migrating a category version shows what would change for each affected store before anything happens."],
    rel: ["g.canary", "g.deploy"] }
});
