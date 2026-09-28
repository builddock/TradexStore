/* Root Admin help · Capabilities (P-R08). Source: plan/19-saas-platform.md §5.2, §5.3. */
RA.help.add({
  "page": { t: "Features", k: "Page guide",
    what: "The complete list of switchable behaviour on the platform — about 230 things a client can be given or not, across eighteen areas.",
    why: "Anything not on this list cannot be granted, withheld or priced. That is the point of having it.",
    read: ["<b>Catalogue</b> is the whole list with what each feature does and how many stores have it.",
      "<b>Channels & automations</b> separates out the things clients most often buy individually.",
      "<b>Store matrix</b> shows, across every store at once, who has what. This view exists only here — no client can see it.",
      "<b>How enforcement works</b> explains the six places a switched-off feature is blocked."],
    do: ["Use this page to answer “can we sell them X?” before promising it.",
      "Anything marked <i>needs a scope decision</i> is listed but not built. It can be discussed with a client; it cannot be granted."],
    notes: ["A feature is not the same as a permission. A feature decides whether a store has the thing at all; permissions inside a store decide who may use it."],
    map: [["ra.c.reg", "The catalogue"], ["ra.c.chan", "Channels and automations"], ["ra.c.mat", "Who has what"], ["ra.c.rules", "How enforcement works"]],
    rel: ["g.feature", "g.module", "g.candidate"] },

  "ra.c.reg": { t: "Catalogue", k: "Tab",
    what: "Every feature, what it does in plain language, which kinds of business need it, and how many stores currently have it.",
    read: ["<b>Categories that need it</b> is the quickest way to judge whether a feature belongs in a proposal."],
    rel: ["g.feature"] },

  "ra.c.chan": { t: "Channels & automations", k: "Tab",
    what: "The communication channels and the individual automations, separated out because they are the features clients most often buy one at a time.",
    notes: ["Granting a channel also needs a provider account, a verified sender and approved wording. Until those exist, the store cannot be published with the channel on."],
    rel: ["g.channel", "g.automation", "g.chanreq"] },

  "ra.c.mat": { t: "Store matrix", k: "Tab",
    what: "Which stores have which features, side by side.",
    why: "It is how you spot a client paying for something nobody switched on, or two similar clients configured differently for no reason.",
    notes: ["This view exists only in this portal. No store can see it, and no store can see which features another store has."],
    rel: ["g.feature"] },

  "ra.c.rules": { t: "How enforcement works", k: "Tab",
    what: "The six places a switched-off feature is blocked, and the rules behind them.",
    read: ["The important one is <b>not found, not forbidden</b>: a store that does not have a feature gets the same answer as if the feature had never existed. Saying “not allowed” would confirm it exists."],
    notes: ["Nothing is deleted when a feature is switched off. Switching it back on restores everything, unchanged."],
    rel: ["g.feature"] }
});
