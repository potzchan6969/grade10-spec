## Context

Nothing gates the add today. `useCartScope` answers `GUEST_SCOPE` for a
collector with no session, `ProductBuyBox.addChosen` calls the cart's `add`
without reading the session at all, and the listing tile's cart control
reaches the cart through `setCartQuantity` → `setLine`. Both surfaces write a
guest line and both read as successful.

Two constraints shape where the gate goes:

- **`@grade10/store-frontend` does not depend on `@grade10/auth-frontend`**,
  and the admin app already renders store surfaces through
  `useCart` with no sign-in overlay anywhere above them.
- **The overlay already models the ask.** `openSignIn({ resume })` keeps the
  callback in a ref, runs it on a session and drops it on dismissal — which
  is the whole of what the third scenario on each capability asks for.

## Goals / Non-Goals

**Goals:**

- One gate both Add to cart controls pass through, so neither surface decides
  for itself what a signed-out add means.
- A resumed add that lands in the member cart, not in the guest cart it was
  opened to avoid.

**Non-Goals:**

- Retiring `GUEST_SCOPE`. The cart drawer's guest lines are the follow-on the
  proposal names; a guest cart that no longer receives adds simply holds
  nothing.
- Guest checkout, and merging a guest cart into a member cart.

## Decisions

### The cart feature refuses the write; the consumer supplies the ask

The spec says a signed-out add opens the site's sign-in dialog and writes
nothing. The scope check is the cart's — `useCartScope` already reads the
session — but the dialog is the site's. So the cart feature takes an
`onSignInRequired` callback from whoever renders it, refuses the write while
the scope is a guest, and reports the ask. `apps/frontend/grade10` wires that
callback to `openSignIn`; the admin app passes none and keeps writing.

- **Rejected: importing `@grade10/auth-frontend/sign-in/overlay` into
  `@grade10/store-frontend`.** A product feature package would gain a
  dependency on auth's presentation layer, and every surface rendering
  `useCart` without an overlay above it — the admin product-detail page
  today — would throw at mount, since `useSignInOverlay` refuses to fall back
  to a no-op by design.
- **Rejected: gating in the two pages instead.** The listing and the product
  page would each hold their own copy of the refusal, the arming and the
  replay, and the listing's control writes through `setLine` while the
  product page's writes through `add` — two shapes of the same rule is how
  they drift.

### Resume arms the intent; an effect performs it

A `resume` that calls the cart's `add` directly would run the mutation the
render that opened the dialog handed it. That mutation is bound through
`useCartWrite` to `cartKeys.intent(GUEST_SCOPE)` — the key built when the
collector had no session — so the resumed add would land on the guest cart
the gate exists to keep empty.

So `resume` only records the intent in state. An effect performs it once
`scope.kind === "member"`, with the mutation of the render that has the
member scope. Dismissal drops the ref, nothing is armed, and the cart is
unchanged with no second wire from the app.

- **Rejected: reading the scope from a ref inside `resume`.** The scope is
  not the only stale value — the query key, the mutation observer and the
  cached cart the write folds over are all the previous render's.
- **Rejected: holding the pending intent inside `useCart`.** The cart would
  then have to be told the dialog was dismissed to drop it, which is exactly
  the wire the overlay's `resume` already saves.

### The store answers a line that can no longer be written

The spec refuses an invented later add, and the cart holds a `CartLine`, not
the product — availability is the surface's, through `sellableQuantity`. So
the effect writes the line the collector asked for and the store's existing
`SetLineOutcome` refusal answers one it will not take, rolling the optimistic
fold back as it already does for a full cart. Leaving the surface unmounts
the state, which answers "sign-in takes the collector away" without a check.

- **Rejected: the intent holding a callback the surface re-runs.** The cart's
  intent would become lazy and the surface would owe it a second entry point,
  to re-derive what the collector already asked for.

## Risks / Trade-offs

- **[An armed intent fires after the collector meant to abandon it]** → only
  a sign-in completed from that dialog arms it; `closeSignIn` clears the
  ref before the effect can ever see a member scope.
- **[The session flips to member for a reason other than this dialog — a
  second tab, a link opened elsewhere — while an intent is armed]** → the add
  the collector asked for is what runs, which is the outcome the scenario
  names; it does not ask how the session arrived.
- **[The listing writes through `setLine` and the product page through
  `add`]** → the gate wraps the cart's writes rather than one of them, so a
  control added later is refused by default instead of opting in.
