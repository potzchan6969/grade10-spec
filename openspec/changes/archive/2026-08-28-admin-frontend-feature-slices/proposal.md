**Author:** @seankcw - 2026-08-27

## Why

The admin panels run two architectures at once, and the larger half is the
unarchitected one.

Ten frontend packages hold 34 feature slices that follow the composition
convention exactly — each with its own tokens, dependency-injection module,
port-level fixture and colocated module test. Beside them, four operator
surfaces in `apps/admin/grade10` were written straight into page code and
never got a package:

- **Vault** — 41 files, roughly 5,000 lines. Panels call the vault worker's
  procedures directly (`CaseDetailPanel`, `PayoutsPanel`, `CustodyPanel`,
  `CaseFlowPanel`, `DocumentsPanel`, `WhatsAppPanel`), the section defines its
  own response codec inside the page directory, and one read is a bare
  `fetch()` against a vault route. The customer half of the same product
  already lives in `packages/vault/frontend`, so the product is split down the
  middle by who is looking at it.
- **Appointments, members, rewards, invitations, liability** — roughly 3,800
  lines across five sections, each importing a typed procedure client from the
  application's own client directory and decoding responses in the component
  that renders them.
- **Users** — the same directory exists twice. Five files are byte-identical
  between the grade10 and zzz panels and the 464-line page differs by 78 lines.
  It drives better-auth's admin plugin and the auth worker's procedures from
  the component, with hand-rolled loading state and no response cache.

Two consequences are already paid. A destructive operator action — banning an
account, releasing a vaulted card, settling a redemption — is reached through
code no fixture-backed test covers, because the seam a fixture binds at does
not exist on these paths. And a field a worker renames arrives as `undefined`
inside a panel rather than failing at the call, on a console that is routinely
left open across a deploy.

The capability spec did not stop any of it. `frontend-composition` governs what
a package publishes and what a composition root may load; it never says a
product's browser data layer has to live in a package at all. Every one of
these four surfaces is compliant with the spec as written.

**Metric:** operator data access resolved through a container, measured over
the sections above — 0 of 4 surfaces today, 4 of 4 when this lands; and
per-brand duplicated data-layer files in the admin panels, 6 files and roughly
970 lines today, 0 after.

## What Changes

- Require a product's browser data layer to live in a frontend package for
  every audience it serves, not only the collector-facing one, so an operator
  surface is a feature slice on the same terms as a storefront one.
- Require an application's page code to reach a backend only through a
  container-resolved handle — never a transport client, a bare request, or a
  response codec it declares itself.
- Give the four surfaces homes: new `packages/vault/admin-frontend`,
  `packages/appointment/admin-frontend` and `packages/loyalty/admin-frontend`,
  and a user-directory slice inside the existing
  `packages/grade10-auth/admin-frontend`.
- Retire the duplicated `pages/users` directory in both panels down to one
  slice both brands install.
- Add an automated check so the next surface cannot drift the same way. Today
  the convention is enforced by review alone, which is the reason there are
  four of these and not one.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `frontend-composition`: extend it from what a package publishes to where a
  product's browser data layer is allowed to live, and what application page
  code may reach.

## Impact

- Affected consumer: the Grade10 application repository — `apps/admin/grade10`,
  `apps/admin/zzz`, and new packages under `packages/**`.
- Three new frontend packages and one new slice in an existing package, each
  with its own client port, fixture, published module list and colocated module
  tests.
- `apps/admin/grade10/src/api/decode.ts` and the application-owned procedure
  clients for vault, appointment and loyalty are removed once the last section
  moves; the raw clients stay only where the composition root hands them to a
  port.
- A new check in `scripts/checks/`, picked up by `pnpm run check:libs`.
- No worker, database, deployment or wire-contract changes. Every procedure
  these surfaces call already exists and is unchanged; what moves is which
  layer calls it.

## Non-goals

- Redesigning any operator screen. Views and their copy move as they are; a
  layout change belongs to its own change.
- Moving page composition, branding or configuration into packages — those
  stay application-owned, as they are today.
- Adding a use case to a slice that protects no invariant. A read that
  forwards resolves its repository, as the storefront slices already do.
- Building an operator surface for a product that has none today (finance,
  e-kyc).
- Changing what an operator is allowed to do, or which grant lets them do it.
