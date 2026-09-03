**Author:** @seankcw - 2026-09-02

## Why

An engineer wiring a console feature, or a QA reviewer checking what a role
unlocks, has one way to learn what a backend call needs — its caller, its
grant, the shape it takes and gives back: open the router source. Grade10's
backends answer over two hundred procedures across eight services (store and
auction alone mount 101), every one of them already declaring its input
shape and, where elevated, its grant. That record exists; nobody can read it
without a checkout.

The record is also thinner than it looks. 28 of the store's 46 procedures
declare an output shape; 9 of the auction's 55 do. What those calls answer
is whatever the code happens to return, and nothing shows the gap.

The measure that moves: the share of procedures with a declared output shape
(37 of 101 today across store and auction), because a page that prints "not
declared" beside a call is what makes the gap worth closing. Secondary: the
number of contract changes the drift check refuses before they merge.

The design is on a canvas:
[Grade10 API Docs](https://claude.ai/code/artifact/9b0c8ff4-71ca-4132-80c8-4e12369580c6).

## What Changes

- Add an **API docs** surface to the Grade10 admin console, under the Dev
  heading, carried by non-production builds only.
- Read the surface's content from the routers themselves — one document per
  backend service, listing every procedure the router mounts with its kind,
  caller, grant, input shape and output shape — and refuse a build whose
  committed document no longer matches its router.
- Render, per procedure: the dotted path and the wire path it lands on, the
  caller in four words (`public`, `session`, `session · fresh`, `elevated`
  with its grant), and field tables for input and output with type,
  required, and constraints.
- Say plainly when a procedure declares no output, and count how many in
  each service do not.
- Filter every service at once by procedure path or by grant.

## Non-Goals

- Routes that are not procedures: the public catalogue and auction browse
  reads, provider webhooks, the carrier callback, media and proof uploads,
  the till's token handshake, analytics ingestion, dev fixtures.
- Prose: the doc comments above each procedure are not carried.
- An OpenAPI document or a third-party viewer.
- Executing a call from the page.
- Availability in a production build, or any grant that would gate it there.
- The ZZZ admin console.

## Capabilities

### New Capabilities

- `grade10-admin/console/api-docs`: the procedure record every backend already
  carries, rendered in the console and held to its routers.

### Modified Capabilities

None. The surface composes the console's existing vocabulary
(`shared/console/visual-standard`) and blocks (`shared/console/blocks`)
and changes neither.

## Impact

- The `grade10` application repository: the admin console gains a test-kind
  surface and nav entry; a generator, its committed output, and a repository
  check that fails on drift join the validation list. Which packages and
  scripts is the engineer's to decide at promotion.
- This store: a manual page for the capability under
  `docs/prds/products/grade10-admin/console/`, written at promotion.
- No backend behaviour changes. No shared UI export changes.
- The ZZZ console is untouched; the generator reads the grade10 assembly.
