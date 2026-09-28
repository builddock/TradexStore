/* Root Admin help · Platform sign-in (P-R01). Source: plan/20-root-admin.md §3. */
RA.help.add({
  "page": { t: "Platform sign-in", k: "Page guide",
    what: "The way into the platform control plane. Deliberately plain: it carries no client's branding and names no store.",
    notes: ["Two-step verification is required for everyone, with no bypass and no grace period.",
      "This portal is reachable only from approved networks.",
      "A client's account does not work here, and an account from here does not work on any client's store."],
    rel: ["g.mfa", "g.roles"] }
});
