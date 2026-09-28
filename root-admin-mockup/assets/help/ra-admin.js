/* Root Admin help · Platform users & audit (P-R11). Source: plan/20-root-admin.md §3, §7. */
RA.help.add({
  "page": { t: "Platform people and records", k: "Page guide",
    what: "Who can operate this platform, what each of them is allowed to do, what they have done, and every occasion on which somebody here looked at a client's data.",
    why: "This portal can create, change and close a client's whole business. Who holds that power, and what they did with it, has to be visible.",
    read: ["<b>People</b> is the list of accounts and their two-step sign-in state.",
      "<b>What each role can do</b> is the permission matrix — read it before inviting somebody.",
      "<b>Access to store data</b> is the separate, time-limited permission needed to see a client's records. No role includes it.",
      "<b>Record of actions</b> is the unchangeable log."],
    do: ["Give the narrowest role that does the job. Most people need Operator or Author, not Owner.",
      "Review the access grants monthly: a grant that was refused, or one used outside a client request, is worth a conversation."],
    notes: ["Two-step sign-in is required for everyone here with no exception and no grace period.",
      "No account here works on any client store, and no client account works here."],
    map: [["ra.a.users", "People"], ["ra.a.roles", "What each role can do"], ["ra.a.sup", "Access to store data"], ["ra.a.audit", "Record of actions"]],
    rel: ["g.roles", "g.mfa", "g.support", "g.audit"] },

  "ra.a.users": { t: "People", k: "Tab",
    what: "Every account on this platform, its role, its two-step sign-in method and its active sessions.",
    read: ["<b>Invitation pending</b> means the person cannot do anything at all until they have set up two-step sign-in.",
      "<b>Active sessions</b> is where to look if somebody loses a device."],
    rel: ["g.mfa", "g.roles"] },

  "ra.a.roles": { t: "What each role can do", k: "Tab",
    what: "The permission matrix for the five platform roles.",
    read: ["Two rows need two people: closing a store permanently, and retiring a category or template.",
      "Notice what is <b>not</b> in any row: reading a client's business data. That always needs a separate grant."],
    rel: ["g.roles", "g.support"] },

  "ra.a.sup": { t: "Access to store data", k: "Tab",
    what: "Every request to look at a client's records: who asked, why, what they could do, who approved it and how it ended.",
    why: "It is the record that lets you answer a client asking “who looked at our data, and why?” without hedging.",
    read: ["<b>Refused</b> entries matter as much as granted ones — they show the approval step is real."],
    notes: ["Maximum eight hours. The approver cannot be the requester. The client's owner is told when it starts.",
      "Everything done under a grant also appears in the client's own record of actions, under the name of the person here."],
    rel: ["g.support", "g.audit"] },

  "ra.a.audit": { t: "Record of actions", k: "Tab",
    what: "Everything done on this platform: who, what, when, to which store, and what it looked like before and after.",
    do: ["Filter by store when a client asks what changed, and by person when reviewing a colleague's work.",
      "Export for an audit; no secret value is ever written to it."],
    notes: ["Written in the same step as the change, so an action cannot happen without being recorded. Nobody can edit or delete it."],
    rel: ["g.audit"] },

  "ra.a.invite": { t: "Invite someone", k: "Dialog",
    what: "Creates an account and sends an invitation that expires in 48 hours.",
    notes: ["There is no temporary password. They must set up two-step sign-in before they can do anything."],
    rel: ["g.mfa", "g.roles"] }
});
