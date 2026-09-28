/* Root Admin help · the frame that surrounds every screen: navigation, environment, search, notifications,
   the account menu and the support-access banner. Sources: plan/20-root-admin.md §1, §3, §6, §7. */
RA.help.add({
  "ra.basics": { t: "Getting around this portal", k: "Guide",
    what: "This is the control plane: the place where client stores are created, configured and deployed. It is not part of any store, and no client ever sees it.",
    read: ["The <b>left menu</b> is grouped: Overview (what exists and what needs you), Catalogue (the building blocks you configure stores from) and Operations (running the platform).",
      "The <b>ⓘ</b> next to a heading, tab or control explains that specific thing.",
      "The <b>?</b> in the top bar opens the guide for whichever page you are on.",
      "Words with a dotted underline are explained — hover or click them.",
      "Anything with <i>Prototype:</i> in its message is a demonstration, not a working action."],
    do: ["If you are new, read <b>Stores</b> first to see what exists, then <b>Create store</b> to see how one is made.",
      "Hold <b>Shift</b> while clicking the ? to hide or show every ⓘ at once."],
    notes: ["Store names, colours, counts and dates in this prototype are examples, not real clients."],
    rel: ["g.store", "g.feature", "g.deploy"] },

  "ra.nav.overview": { t: "Overview", k: "Menu group",
    what: "What exists on the platform and what currently needs a person: the dashboard and the store list.",
    rel: ["g.store"] },
  "ra.nav.catalogue": { t: "Catalogue", k: "Menu group",
    what: "The building blocks you configure a store from: e-commerce categories, bundles, templates, features and wording.",
    why: "Nothing here belongs to one client. These are the pieces every store is assembled out of, so a change here can affect many stores — which is why each one is versioned and migrated deliberately.",
    rel: ["g.category", "g.bundle", "g.template", "g.feature"] },
  "ra.nav.operations": { t: "Operations", k: "Menu group",
    what: "Running the platform: deployments in progress, the people who work here with the record of what they did, and platform settings and health.",
    rel: ["g.deploy", "g.audit", "g.fleet"] },

  "ra.env": { t: "Environment switcher", k: "Control",
    what: "Switches between the production platform, which real customers use, and staging, which is for trying things.",
    why: "The two hold different stores and different configurations. Doing production work while looking at staging is the classic way to lose an afternoon.",
    notes: ["Staging stores are never indexed by search engines and always use test payment details.",
      "In this prototype the switcher is not wired to the sample data."],
    rel: ["g.environment"] },

  "ra.search": { t: "Platform search", k: "Control",
    what: "Finds a store, an address, a category, a template, a feature or a deployment by name.",
    do: ["Search by the client's name, their web address, or the store key."] },

  "ra.notifications": { t: "Notifications", k: "Control",
    what: "Things that happened without you: a deployment finished or failed, a store fell behind on its configuration, a certificate is close to expiry.",
    notes: ["Anything urgent also raises an alert with a named owner. This bell is the convenient view, not the safety net."],
    rel: ["g.drift"] },

  "ra.user": { t: "Your account", k: "Control",
    what: "Who you are signed in as, your role here, and whether your two-step sign-in is active.",
    notes: ["Two-step sign-in is required for everyone on this platform, with no exception."],
    rel: ["g.roles", "g.mfa"] },

  "ra.helpbtn": { t: "Help for this page", k: "Control",
    what: "Opens the guide for the page you are on, with a search box and the full glossary.",
    do: ["Hold <b>Shift</b> while clicking to hide or show every ⓘ on the screen."] },

  "ra.support": { t: "Support access is active", k: "Banner",
    what: "Somebody here currently has permission to look at a specific client's data. The banner stays visible for as long as that is true.",
    why: "Looking at a client's business is the most sensitive thing anyone does here, so it is never quiet.",
    notes: ["The client's owner was told when it started.",
      "Everything done under it appears in the client's own record of actions, under the name of the person here.",
      "It expires automatically and can be ended at any time."],
    rel: ["g.support", "g.audit"] },

  "ra.internal": { t: "Internal prototype banner", k: "Banner",
    what: "A reminder that this is the platform's own portal, not part of any client's system, and that it is deliberately not linked from anything a client sees.",
    why: "During a client demonstration, nobody should stumble into the machinery that runs every other client's store." }
});
