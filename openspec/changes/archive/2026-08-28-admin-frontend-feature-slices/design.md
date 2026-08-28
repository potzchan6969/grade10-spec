## Context

The application repository already runs this pattern ten packages deep: a
product's browser work is a feature slice with its own tokens, dependency-
injection module, client port, port-level fixture and colocated module test, and
an application composes lists rather than modules. `docs/` and the
`react-clean-architecture` skill carry the full convention.

Four operator surfaces predate that adoption and were never moved. They are the
whole of this change's work — no procedure they call changes, no worker changes,
and no operator gains or loses an action. What changes is which layer places the
call.

The surfaces, by the procedures they drive today:

| Surface | Backend calls today | Lands in |
| --- | --- | --- |
| Vault (41 files) | 22 procedures under the vault worker's `admin.*`, two byte routes, one REST packet route | `packages/vault/admin-frontend` |
| Appointments | 12 procedures across `locations`, `availability`, `bookings` | `packages/appointment/admin-frontend` |
| Members, rewards, invitations, liability | 23 procedures under the loyalty worker's `admin.*`, plus `program` | `packages/loyalty/admin-frontend` |
| Users (duplicated per brand) | better-auth's admin plugin, plus the auth worker's `users.deleteAccount` | `packages/grade10-auth/admin-frontend`, new slice |

## Goals / Non-Goals

**Goals:**

- One architecture in the console, not two.
- A fixture seam on every destructive operator path, so a test can drive a
  release, a ban or a settlement without a backend.
- A decode that fails naming the call when a worker renames a field.
- One definition of the user directory, installed by both brands.

**Non-Goals:**

- Any change to a screen, its copy, or its arrangement.
- Any change to which grant permits which action.
- Adding a use case to a slice that protects no invariant.

## Decisions

### One operator-facing package per product, composing the collector-facing one

The spec requires a product's browser data layer to live in a frontend package
per audience. Three products need a new one; the user directory joins the
operator-facing auth package that already exists.

Each new package takes the established shape: `src/core/` with its client port,
`coreTokens.ts` and `coreModule.ts`; slices under `src/features/<area>/<slice>/`;
one published list; `package.json` exports naming each slice's subpath, `/core`
and `/core/testing`. The core-module factory carries its product, per the
existing requirement, so a panel composing six reads as six products.

`packages/vault/admin-frontend` composes `packages/vault/frontend`'s `/core` for
the failure vocabulary and the photo port rather than restating them — the same
relationship `store-admin-frontend` already has with `store-frontend`. The other
two products have no collector-facing package to compose, so each owns its
vocabulary outright.

Rejected: one `packages/admin-frontend` holding every product's operator slices.
It reads as a layer, not a product concern, breaks the one-directory-per-concern
layout, and would put grade10-only slices in the zzz panel's dependency graph.
Also rejected: adding operator areas inside the existing collector-facing
packages — a storefront would then carry slices whose ports it can never bind,
which the operator-only-port requirement exists to prevent.

### Slice boundaries follow the operator's job, not the router

| Package | Area / slice | Holds |
| --- | --- | --- |
| vault-admin | `custody/cases` | the queue, one case whole, its timeline, contact, and the state moves: cancel, confirm vaulted, forfeit, release, prepare release, cancel from custody |
| vault-admin | `custody/valuation` | start, record, offer, accept, dispute, decline |
| vault-admin | `custody/compliance` | recorded identity checks, storage terms, document preparation, and the packet re-derivation read |
| vault-admin | `custody/settlement` | payouts and repayments |
| appointment-admin | `diary/locations` | the places a booking can happen |
| appointment-admin | `diary/availability` | rules, exceptions, and the slots they derive |
| appointment-admin | `diary/bookings` | what a location's diary holds — read-only, because a booking move belongs to the product owning the case |
| loyalty-admin | `programme/members` | lookup, search, one member, their ledger, adjustments and bonuses |
| loyalty-admin | `programme/rewards` | the catalogue and its redemptions, including settle and retry |
| loyalty-admin | `programme/invitations` | grant, list, revoke |
| loyalty-admin | `programme/liability` | the outstanding balance and the programme it is measured against |
| auth-admin | `directory/users` | the directory read, roles, moderation, and sessions |

A slice is a thing a surface needs, not a router namespace: the vault's 22
procedures are one namespace and four jobs, and an operator settling a payout is
not reading a valuation.

Depth follows the existing rule — a slice gets a use case only where an
invariant lives on this side of the wire. The vault worker owns every state
transition, so its commands resolve their repository directly; the pure helpers
already sitting beside the pages (money formatting and entry, identity
derivation, queue ordering, contact-link building) move into their slice's
`domain/` and bring their existing tests with them.

Rejected: a slice per router namespace. It would give the vault one slice of 22
handles, which is the page directory again with a token in front of it.

### One port per backend, named for the backend and the mechanism

Each package declares a procedure port over its worker's typed client —
satisfied structurally by the application's real client, which is what makes a
router rename fail to compile at the composition root. The vault's non-procedure
surface stays separate: photo bytes are pointed at rather than held, so its
slice publishes the address built from the contract's own path helpers, and the
packet re-derivation is a route port beside the procedure one.

The user directory needs two ports: the better-auth admin surface, narrowed by
hand the way the sign-in port already narrows the session calls, and the auth
worker's procedure client for account deletion. Both are handed in at the
composition root; the panel already builds both clients.

Rejected: passing better-auth's client whole. The narrowed port is the reason a
plugin change fails to compile in one file instead of surfacing at runtime in a
panel.

### Every response is decoded at the datasource, where a contract owns the shape

The application's own decoder helper and the codecs declared inside the vault
page directory both go. Each datasource decodes with the codec from its
product's contracts package, naming the procedure it called.

One shape the pages decode today has no contract behind it and must gain one:
the signer list a case's packet answers with. A composition of an existing
contract codec — a list of a shape the contract already defines — needs no new
contract entry and is composed at the datasource.

The user directory is the exception, and deliberately so. Its shapes are
better-auth's, declared in that library's own types, and the auth contracts
carry no codecs at all — they are types and service bindings. A codec there
would assert a third-party library's wire rather than a contract one of our
workers publishes, which is the judgement the sign-in and two-factor slices
already made: a narrowed structural port, typed and not decoded, so a plugin
change fails to compile at the composition root. The one call in that slice
our own worker answers, account deletion, rides its typed procedure client for
the same reason every other procedure does.

Rejected: moving the application's decoder helper into a shared package. Each
package already owns a decode that names the call, and a second general one
invites a datasource to hand back a body it did not parse. Also rejected:
defining directory codecs in the auth contracts to make that slice look like
its siblings — matching a shape is not the same as owning it.

### The panel returns to one response cache

The panels run a cache per backend today because a procedure key names neither
the backend nor the client, and three routers answer under `audit` and two under
`admin`. Slice hooks own their query keys, namespaced by package, so the
collision the extra caches work around stops existing and the panel keeps the
one shared cache module the spec already requires.

Rejected: keeping a cache per backend. It survives the migration unchanged, but
it means a panel invalidating across products has to know which cache holds
what, and the spec puts cache-wide policy in one module for exactly that reason.

### The user directory brings TanStack Query into the operator-facing auth package

That package deliberately carries no query cache today: its two-factor slice is
a set of commands with no server state to hold. The directory is a paginated,
filtered read that is re-read after every moderation action, and it is hand-
rolling that today. It takes the same read shape every other slice uses; the
two-factor slice is untouched.

Rejected: keeping the hand-rolled state to preserve the package's no-query
delta. The delta was a statement about commands, not a budget, and re-fetching
after a ban is the read pattern the cache exists for.

### A view two panels hold identically is a shared block, not a slice view

The four user-directory views are byte-identical across the brands, so one of
them has to go — but they are built from design-system primitives, and no
product frontend package builds on those directly. The shared component
package is where a compound component both consoles render belongs, and its
capability spec is where the export contract for one is recorded.

So the views move up rather than across: they become blocks in the shared
component package, and the slice's pages compose them alongside its hooks.
That makes the group span two repositories, with the shared-component work
landing first and the submodule bump as the boundary.

Rejected: moving the views into the product package on the design system
directly. One slice in the repository already does that, so it is not
unprecedented — but it is the exception rather than the pattern, and it would
put a second answer to "where does a shared component live" beside a package
built precisely to answer it. Also rejected: leaving a copy in each panel. It
is the duplication this change exists to remove, and the surface would drift
the moment one brand edited its copy.

### An automated check, in the registry the repository already runs

`scripts/checks/` is a registry — `check:libs` runs everything in it — so the
boundary check lands there beside the ones guarding table ownership and lane
membership. It reads application source under the page, view and component
directories and fails on a transport client import, a request issued directly to
a product backend, or a response schema declared in place. Exemptions are named
paths with a reason, and a named path that no longer exists fails the run, so an
exemption cannot outlive what it was written for — the same shape the
table-ownership check already uses.

Rejected: a lint rule via the repository's formatter-linter. It can restrict an
import path, but it cannot see a bare request or a schema declared inline, which
is two of the three ways these four surfaces drifted.

## Data model

No database change. No column, table, index or migration is added or altered by
this change.

## Contracts

No wire change. Every procedure and route these surfaces call keeps its shape,
its input and its output.

One response shape gains a contract entry because the application currently
declares it itself: the signer list on a case's packet, which lands in the
vault's contracts. It is an additive definition of what the worker already
answers, checked by the same codec on both ends afterwards.

## Risks / Trade-offs

- **A large diff with no behavioral intent.** Roughly nine thousand lines move.
  Every existing colocated view test moves with its view and must stay green
  unchanged; a test that has to be edited to pass is a signal that behavior
  moved, and the edit needs its own justification in review.
- **Operator paths that never had a fixture-backed test.** The migration creates
  the seam but does not by itself write the tests. Each slice lands with the
  module test the convention requires, resolving every token through decode
  against its fixture — that is the first coverage these paths get, and it is
  the deliverable, not a follow-up.
- **The cache consolidation is the one behavioral risk.** Moving off per-backend
  caches changes what invalidates what. It is contained to the panel and covered
  by the slices' own hook tests, but it is the change most likely to show up as
  a stale panel rather than a failing test.
- **Three new packages to keep aligned.** Mitigated by taking the shape from an
  existing operator-facing package rather than writing each from scratch.
- **The check will find more than these four surfaces.** The storefront's demo
  lab pages issue their own requests. They are demo surfaces that ship nothing,
  so they are exemptions with a reason rather than migration work.

## Migration Plan

Nothing runs in parallel and nothing is dual-written: each surface's data layer
exists in exactly one place at any commit. Per surface — stand the package up,
move the slice, repoint the pages, delete what it replaced. A surface is done
when its section imports nothing from the application's client directory.

The user directory is first: it is the smallest, it is the one that is
duplicated, and it proves the shape on a package that already exists. The check
lands last, when there is nothing left for it to fail on.

## Open Questions

- The exemption list the boundary check ships with, beyond the storefront's demo
  lab pages. It is settled by running the check across the repository once it is
  written, and every exemption carries its reason at that point — it changes
  neither the specs, the approach, nor the task breakdown.
