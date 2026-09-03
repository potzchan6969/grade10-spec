# UI: fix radius token projection

No screen, component, or state is added or removed. What changes is the corner
radius every existing surface already draws, so this file is the visual-review
checklist rather than a screen map.

## Screens

None added or altered in layout. The surfaces below are the ones whose rendered
corner moves; each is reviewed in its own existing story.

## Components

Radius is not drawn by a component — it is a token scale the design system
projects into utilities. The source of truth is the `Radius` collection in
[`tokens.json`](../../../packages/design-system/tokens.json), pulled from the
Figma `Radius/*` variables. No export contract changes.

Where each changing rung lands today:

| Rung | Renders | Surfaces |
| --- | --- | --- |
| `rounded-sm` | 4.8 → **4** | `Tooltip`, auction `ListingGallery` |
| `rounded-md` | 6.4 → **6** | `Select`, `DropdownMenu`, `Tooltip`, `Tabs`, `Skeleton`, layout stories |
| `rounded-xl` | 11.2 → **12** | `Dialog` |
| `rounded-4xl` | 20.8 → **32** | store-home hero (on `feat/add-store-home-blocks`) |
| `rounded-lg` | 8 → **8** | unchanged — `Card`, `Select`, `DropdownMenu`, `Tabs`, `InputOTPSlot`, auction blocks |

`rounded-2xl` and `rounded-3xl` have no named call sites; `rounded-3xl` is used
only in its arbitrary form, which was already correct.

## States

No loading, empty, or error state changes. Every state of every surface above
renders with the corrected radius, since the token is read at paint time and
not branched on.

## Review note

The `sm` and `md` moves are sub-pixel and will not be visible. The one change
worth looking at is the store-home hero at `4xl`, an 11px move, and it is the
rung the Figma frame was drawn against — verify it against the frame rather
than against the current build.
