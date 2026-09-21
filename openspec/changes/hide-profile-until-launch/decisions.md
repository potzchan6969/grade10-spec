## Goals

- A collector on preview or production finds no way to reach `/profile` — no
  account-menu entry, no in-app link — and an old link to it answers
  not-found, the same as the store, the vault and booking already do
- Order history and order detail keep answering wherever the store is
  carried, whether or not the profile itself is
- A collector on development or staging sees the account page and its menu
  entry exactly as they do today
- Reopening the profile is one reviewed line, the same shape as opening the
  store, the vault or booking

## Non-Goals

- Deciding when `add-account-profile` finishes, or reopening the gate — a
  follow-on change, once that one ships
- Gating order history or order detail behind the profile's own gate — they
  keep the store's gate alone
- Any change to sign-in, or to where a collector lands after it — nothing
  redirects to `/profile` today, and this change does not add such a redirect
- Membership, join, bids, or any other account-adjacent page — untouched
- ZZZ — it has no profile surface to gate
- The operator console — unaffected; it already decides its own surfaces per
  lane
- The account page's own content or behavior — `add-account-profile` owns
  that; this change only decides which lanes carry the page

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Why gate `/profile` now, when the carried-surfaces PRD explicitly decided the profile stays carried everywhere? | `add-account-profile` is still mid-build (4 of 38 tasks done): today's account page carries no avatar and a placeholder display name. It waits like the store, the vault and booking did before their own launch, and reopens the same way once that change ships. Reverses a running decision — **BREAKING**, recorded on the PRD. | Leaving the PRD's "the profile stays" decision standing and shipping the gate as an undocumented exception — the next reader would read the PRD as still true. |
| Q2 | Which lanes carry it? | (recommended) The same mechanism as the store, the vault and booking: `gatesFor` keys on the deploy environment, open wherever it is not `"production"`. Preview shares `deployEnv: "production"` with production itself, so this reads as "carried in development and staging, shut in preview and production" — exactly what was asked for, with no new gate shape. | A gate keyed on the site stage instead, which the original store gate already rejected: the stage reads `preview` for production by one registry row, so a site moved to a preview stage for an unrelated reason would lose its profile too. |
| Q3 | `/profile/orders` and `/profile/orders/:orderId` sit at addresses nested under `/profile`'s, but already carry their own `store` gate. What happens to them when `/profile` closes? | (recommended) Leave them untouched. They keep answering wherever `store` is open, independent of the profile's own gate — a mailed order-confirmation link still works even though the account page itself is shut. | Gating them behind `profile` too, so they close together with the account page. Rejected: it couples two gates that track different readiness (the shop being open vs. the account page being finished) for no reader's benefit, and breaks mailed order links on any build that carries `store` but not `profile`. |
| Q4 | Other pages link back to `/profile` (checkout, order detail, order history, auction winner order). The carried-surfaces rule already requires nothing names an absent surface. What do these links do instead when the gate is shut? | (recommended) Hide the link — the same handler-gated pattern the account menu's Profile item and My Orders already use, rather than pointing it at a different destination. | Redirecting the link elsewhere (e.g. home). Rejected: it adds a fallback destination nobody asked for, where the existing pattern (absence, not redirection) already covers every other withheld surface. |
| Q5 | The account menu's Profile item is unconditional in `SiteHeader` today — the durable `shared/ui/site-chrome` contract has it always present. Hiding the nav entrance means this becomes handler-gated. | (recommended) `onProfile` becomes optional, the same contract shape as My Orders, Cart and search: absent unless the application supplies a handler. `SiteShell.tsx` supplies it only when `config.gates.profile` is open. | Leaving `onProfile` required and gating it only in the consuming app (e.g. passing a no-op handler). Rejected: it keeps the shared component's contract claiming a control that is not always there, the same reasoning `My Orders gating` in the page-shell PRD already rejected for that item. |
