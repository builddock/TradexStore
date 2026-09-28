/* Root Admin help · Deployments (P-R10). Source: plan/20-root-admin.md §5. */
RA.help.add({
  "page": { t: "Deployments", k: "Page guide",
    what: "Every store creation and every configuration change, as it happens and as it happened.",
    why: "Creating a store and changing one run the same nine steps, so there is one place to watch and one place to look afterwards.",
    read: ["<b>Running now</b> shows the step machine live: which steps are done, which is working, which are waiting.",
      "<b>History</b> is every run, including the ones that rolled back.",
      "<b>Published configurations</b> is what each store is actually serving, and what is inside it."],
    do: ["If a step fails, read the log before retrying. Every step is safe to retry, but retrying a step whose cause has not changed just fails again.",
      "A run can be resumed after an interruption; it never repeats work it already completed."],
    notes: ["If the final store check fails, the store is put back on its previous configuration automatically and keeps serving throughout.",
      "For a first deployment there is no previous configuration, so everything the run created is removed and nothing is left behind."],
    map: [["ra.d.run", "Watching a run"], ["ra.d.hist", "History"], ["ra.d.art", "Published configurations"]],
    rel: ["g.deploy", "g.smoke", "g.rollback"] },

  "ra.d.run": { t: "Running now", k: "Tab",
    what: "The nine steps of a deployment, live.",
    read: ["Steps four and six run only on a first deployment — setting up the store's own database, images and index, and creating its starting content.",
      "Step seven waits for every server to confirm it is using the new configuration. A long wait here is the first sign of drift."],
    do: ["<b>Retry step</b> is safe — a step never creates anything twice.",
      "<b>Cancel</b> rolls back anything this run created."],
    rel: ["g.deploy", "g.propagation"] },

  "ra.d.hist": { t: "History", k: "Tab",
    what: "Every run: which store, what kind of change, how long it took, who ran it and how it ended.",
    rel: ["g.deploy"] },

  "ra.d.art": { t: "Published configurations", k: "Tab",
    what: "The finished configuration each store is serving, with its fingerprint, and how many servers have applied it.",
    read: ["<b>Applied by</b> below the total is drift: some servers are still on an older version.",
      "The file list below shows what a built configuration actually contains — and why a page view costs nothing to know how a store behaves."],
    notes: ["At least the last twenty versions are kept per store, so going back is instant."],
    rel: ["g.artefact", "g.drift", "g.rollback"] }
});
