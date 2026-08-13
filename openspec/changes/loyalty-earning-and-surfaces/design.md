# Design

## Delivery of a money event

The store owns what a completed purchase means; the commerce library owns the
purchase state machine. Today the library reports how many orders moved, not
which — so every consumer bolts its own hook onto whichever call site it
happened to be looking at, and the analytics hook already misses two of the
three paths that reach a completed purchase.

The library gains a money-event record written in the same transaction as the
state change. Its identity is the record's own key: one per transition, present
on every path, stable across retries. A delivery pass claims due records with a
guarded update — the same claim-is-the-lock shape the reconciliation pass
already uses — and hands them to a sink the application registers.

This replaces a direct call from the purchase path. A direct call would be lost
on any transient failure, and the programme's refund handling explicitly relies
on the caller retrying: a refund that arrives before its earning is refused as
missing, on purpose, expecting a later attempt.

The library stays free of loyalty. It knows only that something completed and
that an application asked to be told.

Rejected: the durable task scheduler. It stores in a different database than the
purchase, so scheduling could not be part of the same transaction; it has no
production use anywhere; and it deletes a task after a bounded number of
attempts, which for money is data loss.

## Why the programme's failures are returned, not thrown

The programme answers a refused recording as a value, not an exception. A sink
written around exception handling would treat every refusal — wrong currency,
conflicting retry key, missing earning — as success. The sink therefore inspects
the answer first and only then guards against transport failure, and its
counters carry the refusal reason so a systematic refusal is visible on the
first day rather than at the first audit.

## The wire contract

Response shapes live with the application that composes the router, alongside
the equivalent contract the store already publishes, and both ends use them: the
surface parses what it receives, and the resolver declares that it returns what
the schema describes.

The parse happens on the surface. Declaring it on the resolver as well was
considered and rejected: parsing on the way out silently drops fields the schema
does not mention, which would defeat the existing check that a member never
receives an operator's written reason — the check would pass because the parse
removed the evidence, not because the code stopped leaking it. A type annotation
gives the same one-definition guarantee, is checked when the code is compiled,
and rewrites nothing at runtime.

## Two surfaces, two shapes

The membership surface follows the storefront pattern: feature slices behind
injected use cases, one place where a response is parsed, and a fixture that
swaps only the transport so tests exercise the real parsing.

The console does not. It has one implementation of everything and nothing to
substitute, so injection buys it nothing. It keeps the one thing that is not
about substitution — a single place where a response is parsed — because an
operator acting destructively on a stale page deserves a decode failure that
names the call rather than a missing value three components deep.

The console is the first surface here to read the programme over its typed
transport, so it establishes that pattern rather than following one.

## The second factor over a typed transport

The programme signals a missing second factor in an error's message text, while
the identity administration surface signals it in an error code. A surface
written against one cannot read the other, and no environment a developer runs
enforces a second factor, so the mistake would not appear until staging.

The signal moves onto the error's structured payload, where a surface reads it
as a field. One place in the console interprets it; a test drives it with a
fabricated error, because no runnable environment produces a real one.

## Navigation without a router

No surface in this repository's consumers uses a routing library, and adopting
one for a single console would split that convention. The console keeps its
state in the address bar instead — section, member, page — read and written
directly. That gives a working back button, survives a reload, and makes a
member view shareable, with no dependency and no convention to renegotiate.

## Permissions read from the router

The console's sections and the actions behind them must require the same
permission. Writing that twice is how they drift — an existing admin surface
already gates on one permission while its only server actions require another.

Each operator action declares its permission where it is defined; the console
reads that declaration rather than repeating it, and a test walks every operator
action asserting one is declared.

## Identity stays in the identity system

The programme deliberately holds no personal data. An operator still needs to
find a member by email, so identity is read at the moment of the request and
never stored.

It is served from a connection of its own, not from the one that resolves
sessions: that connection is held by four services across every environment and
performs no authorisation of its own, so any capability added to it is granted
to all of them at once. The identity connection instead resolves the calling
operator's own session and requires the identity permission and a verified
second factor, so holding the connection grants nothing.

The programme reaches it through a port the application supplies, because the
programme's test harness has no service connections at all — without a port the
security-relevant half would ship with no test around it.

Three things travel with it: a search index shaped for the query actually run,
because today's search cannot use any index; response headers marking identity
as belonging to one caller, because the programme's service has a shared
response cache enabled and the identity service deliberately has none; and a
log entry recording who read which records, because the operator log records
only changes and identity reads change nothing.
