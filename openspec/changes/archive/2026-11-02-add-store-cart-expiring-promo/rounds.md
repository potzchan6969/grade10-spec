# Rounds

One row per round: what it read, who read it, what stood and what it asked.
Written by the landing, in the landing's own commit.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 1 | 7 | manual, verifier | The requester confirmed the final local cart-picker walk was completed manually at the supported narrow and wide widths for members and guests. The state record below transcribes the required cases covered by that confirmation. | No failed local-walk gate was reported. The separate controlled Storybook manual case `shared.ui-store-cart.US22-TC1` was not separately evidenced in the confirmation; no screenshots were attached. | Requester confirmation in the Codex conversation, 2026-11-02; [PromoTicket ExpiringSoon Storybook reference](https://storybook.grade10-stg.com/?path=/story/store-cart-blocks-promoticket--expiring-soon) |

## Final walk state record

The requester reported the walk passed. I did not independently repeat it.

| Scenario | State checked | Expected result confirmed by requester |
| --- | --- | --- |
| `g10.store-cart-drawer.SC59` | Member's held code at the inclusive 14-day boundary | Only the existing expiry/conditions detail is emphasized; the ticket's title, code, action and order stay the same. |
| `g10.store-cart-drawer.SC60` | Distant, missing-expiry and non-live expiry states | Detail stays plain; no expiry emphasis is derived. |
| `g10.store-cart-drawer.SC61` | Public code in guest picker | Public code remains in the picker with its existing title and detail. |
| `g10.store-cart-drawer.SC62` | Public code in the member's merged picker | Public and held codes remain in the merged list with their established order and behavior. |
| `g10.store-cart-drawer.SC63` | Inapplicable near-expiry held code | Existing muted refusal remains; no Apply action appears; only the detail receives emphasis. |
| `g10.store-cart-drawer.SC64` | Refused near-expiry public code | Existing muted refusal remains; no Apply action appears; title, code and position stay the same. |
| `g10.shared-store-cart.SC70` | Applicable ticket with `detailEmphasis: true` | Supplied title, detail, code, callback and ordering remain; only detail is emphasized. |
| `g10.shared-store-cart.SC71` | Plain ticket with false or omitted emphasis | Existing plain detail treatment remains; the component derives no state. |
| `g10.shared-store-cart.SC72` | Inapplicable near-expiry public ticket | Muted refusal and no Apply remain; only the detail is emphasized. |

The linked Storybook reference is the agreed visual reference. The separate
`shared.ui-store-cart.US22-TC1` manual TCS row remains for the post-deployment
human QA pass; no result for that case is claimed here.
