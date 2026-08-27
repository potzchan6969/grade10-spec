## 1. User directory slice (grade10) (owner: @sean)

The worked reference for the other three, and the only surface that is
duplicated today. Take this group first. Tasks 1.4 and 1.5 need group 7
landed and the submodule re-pointed: the views the pages compose are shared
components, so they belong to grade10-spec.

- [x] 1.1 Add a narrowed directory client port and the auth worker's procedure port to the operator-facing auth package's core, each with a typed fixture, and bind them through that package's core-module factory — scenario: An application constructs a transport client.
- [x] 1.2 Build the `directory/users` slice — domain models, repository, datasource decoding each call against the auth contracts, tokens, data module, feature module, subpath export, and the module test resolving every token through decode against the fixtures.
- [x] 1.3 Add the slice's hooks over the shared response cache: the paginated directory read, role changes, moderation, session listing and revocation, and account deletion, each with a hook test over the real graph with the fake bound at the port only.
- [x] 1.4 Join the slice to the package's published list and move both panels' user pages onto its hooks, keeping the existing view tests unedited — scenario: Two brands show the same operator surface.
- [x] 1.5 Delete the duplicated user directory from the zzz panel and the data layer from the grade10 one, leaving one page per brand composing the slice — scenario: A brand needs the surface to differ.
- [x] 1.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`.

## 2. Vault console slices (grade10) (owner: @sean)

The largest surface. Its first task adds the one contract codec the console
currently declares for itself; nothing outside this group depends on it.

- [x] 2.1 Add the case packet's signer list to the vault contracts as the one definition both ends check against, and delete the codec the panel declares for it.
- [x] 2.2 Stand up `packages/vault/admin-frontend`: its procedure port over the vault worker's operator procedures, a route port for the packet re-derivation read, the fixture for each, a core module composing the collector-facing package's failure vocabulary and photo port, and an empty published list.
- [x] 2.3 Build `custody/cases` — the queue, the case read, its timeline and contact, and the state moves — with the queue-ordering and contact-link helpers moved into its domain carrying their existing tests, plus its module test and hook tests — scenario: A page carries out an operator command.
- [x] 2.4 Build `custody/valuation` and `custody/settlement`, moving the money entry and formatting helpers into domain with their tests, each with its module test and hook tests.
- [x] 2.5 Build `custody/compliance`, including the packet re-derivation read through the route port, with the identity-derivation helper moved into domain carrying its tests.
- [x] 2.6 Join all four slices to the published list, install the package in the grade10 panel's composition root, and move the vault section's panels onto the hooks with their existing view tests unedited — scenario: A product gains an operator surface.
- [x] 2.7 Delete the vault section's page-level codecs, its direct request, and the panel's vault procedure imports, so the section names nothing in the application's client directory — scenario: A page renders data from a backend.
- [x] 2.8 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`.

## 3. Appointments diary slices (grade10) (owner: @sean)

- [x] 3.1 Stand up `packages/appointment/admin-frontend`: its procedure port over the diary worker, a fixture, a core module, and an empty published list — scenario: A product's first surface serves operators.
- [x] 3.2 Build `diary/locations` and `diary/availability` — rules, exceptions and derived slots — each with its module test and hook tests over the fixture.
- [x] 3.3 Build `diary/bookings` as a read, with its module test, and record in the slice why it carries no command.
- [x] 3.4 Join the slices to the published list, install the package in the grade10 panel's composition root, and move the appointments section and the vault booking row onto the hooks with their existing view tests unedited.
- [x] 3.5 Delete the appointments section's decoding and its procedure imports, so the section names nothing in the application's client directory.
- [x] 3.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`.

## 4. Loyalty console slices (grade10) (owner: @sean)

- [x] 4.1 Stand up `packages/loyalty/admin-frontend`: its procedure port over the loyalty worker's operator procedures, a fixture, a core module, and an empty published list — scenario: A product gains an operator surface.
- [x] 4.2 Build `programme/members` — lookup, search, one member, the ledger, adjustments and bonuses — with its module test and hook tests.
- [x] 4.3 Build `programme/rewards`, covering the catalogue and its redemptions including settle and retry, with its module test and hook tests.
- [x] 4.4 Build `programme/invitations` and `programme/liability`, each with its module test and hook tests.
- [x] 4.5 Join the slices to the published list, install the package in the grade10 panel's composition root, and move the members, rewards, invitations and liability sections onto the hooks with their existing view tests unedited.
- [x] 4.6 Delete those sections' decoding and their procedure imports, so none names anything in the application's client directory.
- [x] 4.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`.

## 5. Panel cleanup (grade10) (owner: @sean)

Needs groups 1 to 4 landed — it deletes what they replace.

- [ ] 5.1 Collapse the panel's per-backend response caches into the one shared cache module, now that every slice owns its query keys.
- [ ] 5.2 Delete the panel's own decoder helper, and reduce its client directory to the clients the composition root hands to ports.
- [ ] 5.3 Update the repository's frontend architecture documentation and skill so the operator-facing packages are named alongside the collector-facing ones, and the enforcement line says the boundary is checked rather than reviewed.
- [ ] 5.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, `pnpm run agent:check-parity`.

## 6. Boundary check (grade10)

Lands last, when there is nothing left for it to fail on.

- [ ] 6.1 Add the boundary check to the repository's check registry: it fails on a transport client named in application page, view or component code, a request issued directly to a product backend, or a response schema declared in place — scenario: Application code reaches a transport directly.
- [ ] 6.2 Give the check named exemptions carrying their reason, including the storefront's demo lab pages, and make an exemption whose path no longer exists fail the run — scenario: A path is exempt on purpose.
- [ ] 6.3 Verify: `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`.

## 7. Directory views as shared blocks (grade10-spec) (owner: @sean)

The four views the two panels hold identical copies of are compound
components built from design-system primitives, so they belong in the shared
component package rather than in a product frontend package — that package
publishes blocks, and no product package builds on the primitives directly.
Group 1's last two tasks wait on this and on the submodule bump that follows.

- [x] 7.1 Record the export contract for the directory views as a delta against the shared UI capability, naming each export exactly.
- [x] 7.2 Build the four blocks in the shared component package — the directory table, the roles editor, the moderation confirmation and the session list — each taking every value and callback as a prop, with its stories.
- [x] 7.3 Carry every behaviour the panels' view tests assert onto the blocks as story play functions — the component lane this package actually has — so the move is proven not to have changed what they render, and the panel-side tests can go with their views.
- [x] 7.4 Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run design-sync:check`.
