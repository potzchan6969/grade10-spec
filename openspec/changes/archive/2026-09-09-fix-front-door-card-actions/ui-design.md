# UI design

Behaviour is the two deltas beside this file; technical decisions are
[`tech-design.md`](tech-design.md). Nothing new is drawn here: two treatments
the card already has are turned on for a surface that never passed them, and
one control is turned off.

## Screens

### The front door's merchandised row

[Figma `Product grid` — `4171:11916`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-11916)

Five cards across, drawn from the same `Product / Product Card` the listing
uses. **No card in the frame carries a cart control**, at rest or otherwise —
which is the row as designed, and what `SC-23` states.

### The card's own states

[Figma `Product / Product List` — `4244:4943`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4244-4943)

Where the sold-out and markdown treatments are drawn in full — the dimmed
well with its `SOLD OUT` mark, the `SALE` badge, and the struck-through
former price beside the current one. The front door adopts these unchanged;
it does not get treatments of its own.

## Components

Every export already ships, and no variant or token is missing. The only
contract change is behavioural and carried by `tasks.md` group 1.

| Export | Package | Draws |
| --- | --- | --- |
| `ProductCard` | `@grade10/ui` | The tile: image, name, prices |
| `ProductCardImage` | `@grade10/ui` | The well, the badges, and the cart control that is now opt-in |
| `Badge` | `@grade10/design-system` | `SALE` at `variant="success"`, `SOLD OUT` at the default |

Types the front door supplies rather than draws: `ProductCardProps`,
`ProductCardCopy`.

What the front door stops supplying is as much of this change as what it
starts: the four cart words go, because the control they name will not be
drawn.

## States

| State | What renders | Scenario |
| --- | --- | --- |
| Available | The card at rest, one price, no badge, no cart control | `SC-23` |
| Marked down | `SALE` badge on the well, former price struck through beside the current one | `SC-22` |
| Sold out | The dimmed well and its `SOLD OUT` mark, no sale badge | `SC-21` |
| Hover, focus | Unchanged from rest — no control appears at either | `SC-23` |
| Row absent | No heading and no cards, as the catalogue leaves it | `SC-14`, unchanged |

## Where the frames disagree

Two open items for the designer. Neither holds delivery: the code answers both
today, and the answers below are what ships unless the frames are settled.

❓ **The `SALE` badge is green on the front door's grid and dark on the
listing's.** One component, two frames, two fills. The code draws
`variant="success"` — green — so the front door's grid is what ships and the
listing's frame is the one out of step. `docs/governance/design-code-sync.md`
holds that a genuine disagreement is recorded rather than absorbed, so it is
recorded here.

❓ **`Product grid` shows a `SALE` badge on all five cards and a struck-through
price on one.** The badge and the strikethrough are one treatment — the former
price is what draws both — so that combination is not reachable and reads as
placeholder content rather than a rule. Stated so a reviewer does not build to
it.
