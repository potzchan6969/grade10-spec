## Context

The site renders one sign-in overlay above its routes and one cart drawer
beside them; both are held open by state the site root owns, and once the
Store cart drawer answers every surface's header receives a cart handler. The
overlay already takes a `resume` an ask carries, which it runs once a session
arrives — the mechanism `require-sign-in-to-add-to-cart` uses for an add
pressed without a session.

The session reaches the chrome as a snapshot with three states: resolving,
signed out, signed in. The header already renders before it settles, showing
the signed-out account entry until it does.

## Goals / Non-Goals

**Goals:**

- The Cart control's behaviour turns on the session without the chrome waiting
  for it, or moving when it settles.
- A drawer opened after sign-in is the one the collector pressed for, not a
  second ask they have to make.

**Non-Goals:**

- The drawer's contents, which are `shared/ui/store-cart`'s.
- The cart's own data scope. A member's cart is already keyed by the session;
  nothing about what the drawer reads changes here.

## Decisions

**The site decides, the shared header does not.** The spec puts the behaviour
on `grade10-site/site/page-shell`, and the shared header already takes a cart
handler it calls blindly. So the gate wraps the handler the site supplies
rather than reaching into the header: the header keeps one prop and one
meaning, and a second brand wiring the same component is unaffected.

*Rejected:* a `signedIn` prop on the shared header that makes it ask by itself.
It would put a product rule about carts inside a component held by two
products, and force every consumer to answer a question most of them do not
have. An engineer reaching for it should know it was considered.

**The ask carries the drawer open as its `resume`.** The overlay's existing
`resume` runs on a successful sign-in and is dropped on dismissal, which is
exactly SC-22 and SC-23 — nothing new holds the intent, and there is no state
to clear when the surface goes.

*Rejected:* opening the drawer from an effect that watches the session. It
would also fire for a session that arrived from somewhere else — the account
menu, another tab — and open a drawer nobody asked for.

**Resolving counts as signed out**, so the control reads one boolean. The
header shows the signed-out account entry in the same window, so the control
and the entry beside it agree. The cost is in Risks.

*Rejected:* gating on a settled anonymous session, which is what the cart's own
write gate does. It would open the drawer during the resolve for someone who
turns out to be a guest, and the drawer would then have to hold an ask of its
own — a state no design covers.

## Risks / Trade-offs

- [A returning member presses Cart before the session settles and gets a dialog
  they did not need] → The window is one auth round-trip, and the proposal's
  metric counts dismissals: a dismissal rate that does not fall as the site
  gets faster is the signal to revisit. No implementation control is worth
  adding before that data exists.
- [The site gains a second place that decides what a session may do with a
  cart, after the cart's own write gate] → Both are the same one-line question
  against the same session snapshot; neither owns state. If a third appears,
  the question moves into the cart feature and both surfaces ask it.

## Migration Plan

None. No data, no wire, no stored state — one handler changes behaviour, and a
deploy is the whole rollout. Reverting is reverting the commit.

## Open Questions

- Whether the control should disappear for a signed-out collector instead of
  asking. It is the proposal's open question, it needs the metric to answer,
  and it changes neither these decisions nor the task breakdown: hiding the
  control is a change to what the site supplies a handler for, one line from
  where the gate now sits.
