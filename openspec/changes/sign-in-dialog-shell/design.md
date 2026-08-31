# Design — sign-in-dialog-shell

## Context

`SignInCard` has shipped since `add-auth-session` with no capability spec. It
composes `Card` + `CardHeader` + `CardContent` + a `VStack gap="md"`, and is
capped at `max-w-sm`. Nothing held it to the design: `auth-sign-in` carries no
`audit.json` table, so `design-sync:audit --all-blocks` never reached it, and
no `.figma.ts` template exists for any of the four published Auth Sign-In
components, so `design-sync:check` never reached it either.

The values the spec requires already exist in the design system and need no
change:

| | `DialogContent` | Figma `Login Dialog` (`4666:1488`) |
| --- | --- | --- |
| width | `max-w-(--container-md)` = 448 | 448 |
| radius | `rounded-(--radius-4xl)` = 32 | 32 |
| padding | `p-6` = 24 | 24 |
| gap | `gap-6` = 24 | 24 |
| scrim | `bg-overlay` | `#0A0A0A4D` |

`--overlay` resolves through `{gray-950-opacity-30}` to `#0A0A0A4D` exactly, so
`DialogOverlay` already paints the scrim design draws. `DialogHeader` renders
its close control by default (`showCloseButton = true`).

No data model, no wire, no migration: this change is one block's composition.

## Decisions

### Keep the export name; change what it renders

The spec governs that `SignInCard` renders as a modal
([Sign-in renders as a modal dialog over a scrim](specs/shared-ui/auth-sign-in/spec.md)).
It stays named `SignInCard` and stays at its current import path, so consuming
applications change props without changing imports.

The alternative is renaming it `SignInDialog` and retiring `SignInCard`, which
is more honest about what the component now is. Rejected because the rename
buys accuracy in exchange for touching every import in every consuming
application on top of a prop change they must already make. The name is
already a slight lie in the other direction — `Card` here reads as "the
sign-in card", the surface, not the primitive — and the block directory is
`auth-sign-in`, not `auth-sign-in-card`. Revisit if a second sign-in surface
ever needs a non-modal variant, which would make the distinction load-bearing.

### Controlled `open`, with no uncontrolled fallback

The spec requires visibility to be the consumer's. Implement it as required
`open` / `onOpenChange` passed straight to `Dialog`, with no `defaultOpen`
escape hatch.

The alternative an engineer might reach for is an optional `open` that falls
back to internal state when omitted, which would keep the change
source-compatible for consumers that render `SignInCard` unconditionally
today. Rejected: it makes the breaking change silent. A consumer who upgrades
without adapting would get a dialog that opens itself on mount and cannot be
closed by the application, which is worse than a type error at the call site.
Required props make the migration a compile failure.

### Override the body gap locally rather than changing `DialogBody`

Figma's generic `Dialog` (`2159:3169`) draws its body slot at gap 16, and
`DialogBody` is `gap-4` — they agree, and the overlays audit table already
asserts it. The `Login Dialog` body is gap 24.

So the 24 is this surface's, not the primitive's. Apply it as `gap-6` on the
`DialogBody` instance inside `SignInCard`.

The alternative is widening `DialogBody` to 24 and letting the generic dialog
inherit it. Rejected: it would silently move every other dialog in the system
away from the value Figma draws for them, to fix one surface — and the
`design-sync` rails would then report the generic Dialog as drifting.

### Reuse `Divider`; do not reach for a dialog-specific separator

The body composition order changes, not its parts. `Divider` with its `label`
already renders what Figma's `divider` frame draws. The only change is where
it sits relative to `providerSlot`.

### Give `auth-sign-in` an `audit.json` in the same change

The drift survived because nothing checked it. Add the table alongside the
implementation, rather than filing it as follow-up work that would leave the
same blind spot open.

The table covers one row — the body gap — because `audit-freshness.test.ts`
admits only classes the block's own file contains literally, and everything
else the dialog renders belongs to `DialogContent`, audited already by the
design system's `overlays/audit.json` against the generic Dialog. That is the
right split: this block owns the 24px override and nothing more, and a table
snapshotting another module's strings would go stale silently the next time
that module changed.

The alternative is a separate hygiene change covering all five uncovered block
directories at once. Rejected only for this block — the sweep is still worth
doing, but shipping a composition fix without the rail that would have caught
it reproduces the original mistake.

## Risks / Trade-offs

- **Every consuming application breaks at the call site, deliberately.** The
  required `open` / `onOpenChange` pair makes it a type error rather than a
  runtime surprise. Mitigation is the migration note in `tasks.md`, and the
  submodule bump being the boundary — applications adapt on their own schedule
  after this lands here.
- **A consumer that routes to a sign-in page today has more to do than pass
  props.** They must move the trigger to wherever the action originates and
  delete the route. That work is theirs and is not in this change's task list;
  the proposal names it under Impact.
- **`auth-two-factor` is left mismatched.** `TwoFactorVerifyForm` keeps its
  16px body gap against the `OTP Dialog`'s 24. Naming it as a non-goal rather
  than fixing it in passing keeps this change reviewable, but the two blocks
  now differ until that change lands.

## Open Questions

None. The three decisions that would have changed the specs or the task
breakdown — export name, controlled-vs-uncontrolled, and how far parity goes —
were settled with the author before drafting.
