# Design: ZZZ site navigation

Capability delta:
[`zzz/navigation`](specs/zzz/navigation/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

The ZZZ site renders three views from one address: the app root switches
on a signing-in flag and the session, so the address bar never moves and
nothing can be pointed at. There is no route table, no history handling,
and no not-found — an unknown address renders whatever the session decides.
The `zzz` product has no capabilities recorded; this change writes
its first.

`adopt-react-router` decides the routing foundation for the grade10 site
and records why: framework mode, thin route modules, packages router-free.
This change reuses those decisions rather than re-deciding them; only what
is ZZZ-shaped is decided here.

## Goals / Non-Goals

- **Goal:** the two brands promise the same navigation behavior, each under
  its own product's capability, so a collector and an engineer meet one
  contract on both.
- **Goal:** today's behavior survives by specification — home stays the
  signed-out surface, the session still decides what a collector sees.
- **Non-goal:** crawlability. No prerender list, no identity table; the
  build serves the app shell for every address, and a ZZZ change against
  these addresses owns anything more.
- **Non-goal:** a `ui.md`. The one new view — not-found — is the smallest
  honest statement built from existing design-system primitives; no Figma
  frame exists or is needed, and nothing else changes visually.

## Decisions

### The same foundation, reused not re-decided

The app adopts the framework `adopt-react-router` chose, the same way: the
`@react-router/dev` Vite plugin, a root module, one thin route module per
surface lazily importing its view, generated route types. No prerendering —
`ssr: false` with no prerender list keeps every address answering the app
shell, which is what the site serves today.

*Alternatives:* hand-roll a route table and address hook the way grade10
did before its migration — rejected: it re-creates the machinery the other
change exists to retire. A different router for a three-view app — rejected:
two brands on two routing conventions doubles what every engineer carries
for no behavior.

### Home stays the signed-out surface

`/` answers home for a collector without a session and corrects a signed-in
collector to `/profile`, replacing the entry. This preserves exactly what
the session decides today — a signed-in collector has never seen home —
while giving the profile the address it never had.

*Alternatives:* make home public for everyone — rejected: home offers only
a sign-in prompt, so showing it to a signed-in collector is a behavior
change smuggled into a routing change; the storefront change that gives
home something to offer revises this. Keep the profile answering at `/` —
rejected: two addresses for one surface, and no address means home.

### Not-found arrives with addresses

Once addresses exist, an unknown one has to answer something, and answering
home is the soft-404 habit the grade10 site's specs already refuse. The
site gains a minimal not-found view naming the failed address, rendered
without waiting for the session — the session has no say over an address
the site does not answer.

*Alternatives:* resolve unknown addresses to home — rejected above. Reuse
the grade10 site's not-found page — rejected: pages are brand-owned view
code; what is shared is the requirement's shape, not the component.

### Feature packages stay router-free

Unchanged from `adopt-react-router`, and now load-bearing from both sides:
`@grade10/store-frontend` and `@grade10/auth-frontend` serve both brands,
so a router import in either would bind the two apps' routing choices
together. Views read the address and hand features props.

## Risks

- **Convention drift between the brands.** Two apps now hold route modules
  independently. Mitigated by structural sameness — same plugin, same
  module shape, same naming — and by both capabilities' scenarios pinning
  the same behavior.
- **A session flash at `/`.** Home is session-decided, so it waits for the
  session like the profile does; the wait is the same one the whole app
  imposes today, not a regression.
