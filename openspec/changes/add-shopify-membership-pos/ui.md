# UI

Two surfaces gain something, and one is new: the member's own membership page,
the operator console, and the till — a POS extension that is its own deliverable
rather than a page in an existing app.

## Screens

The member card and till frames do not exist in Figma, and no `@grade10/ui`
block covers them. Both are work in **grade10-spec** and they block groups 9 and
10 in `tasks.md`. Nothing below describes a layout — that is the frame's job.

| Surface | App | What changes |
| --- | --- | --- |
| Membership | `@grade10/web-spa` | Gains the member card and the list of rewards awaiting collection; the page itself lands with `revise-loyalty-programme-rules`. |
| Console | `@grade10/admin` (grade10) | Gains order attribution and its undo. |
| Till | POS extension | New. Its own deploy lane, outside the SPA groups. |

## Components

| Export | Carries |
| --- | --- |
| `MemberCard` | The dynamic identification code, rendered scannable and as a short typed fallback |
| `PendingCollectionList` | Rewards paid for and awaiting collection, each with its window and where to collect it |
| `RewardMenu` | Extended: takes a quantity for a per-unit reward, and states a physical reward's collection window |

No design-system token or primitive changes. The console and the till panel both
compose these exports as brand-owned view code; neither needs exports of its own.

## States

Each state below exists because a scenario in
[`specs/grade10-store/membership/spec.md`](specs/grade10-store/membership/spec.md)
or [`specs/grade10-store/loyalty/spec.md`](specs/grade10-store/loyalty/spec.md)
defines it.

| Surface | State | Scenario behind it |
| --- | --- | --- |
| Membership | A reward paid for and awaiting collection, with its window | *Waiting is not failing* |
| Membership | Collected — the member is told at handover | *The member hears about the handover* |
| Membership | A quantity above the per-redemption bound is refused by name | *A quantity above the bound is refused* |
| Console | A wrong attribution is one action to undo | *A wrong attribution is one action to undo* |
| Till | Member identified by scan or typed code; a replay is refused with its history | *A replayed code is refused with its history* |
| Till | Email lookup finds nobody, and says only that | *An email miss discloses nothing* |
| Till | Tapped twice — one spend | *A double tap spends once* |
| Till | Spending switched off, or the programme unreachable — the sale still completes | *The kill switch stops spending, not selling* |
| Till | Email lookup stopped while the card still works | *Email-assisted spending can be stopped alone* |

An operator's reason, retry keys and the internal pricing of an entry never
reach the membership surface or the till.
