# Pending Operations Planning Run

**Date:** 2026-10-13
**Source:** `47b98335ef8fb88c62a81da7f68d452964b07817`, based on store main `7177871bbd59`
**Input digest:** `abeb03776e73168b1195edf6e81a9de02e47599e33de48ebe02bf17cecaa40d0`

## Scope

This run updates pending drawer operations in this change and pending Pay in
`add-shopify-checkout-integration`. Existing unrelated requirements, case
identities, completed tasks and historical acceptance snapshots are retained.
Q14 and Q15 settle the product scope and available dismissal.

## Frozen Inputs

The coordinator assembled `/tmp/cart-pending-qa1`; `input-manifest.json`
records each included file's digest. The snapshot contains the proposals,
decisions, PRDs, journey sets, feature-set outlines, pending design states,
existing cases without scenario links or reconciliation, the Store domain
suite and the case-writing rules and template.

| Capability | Pending anchors | Existing roots |
| --- | --- | --- |
| `grade10-site/store/cart-drawer` | `g10.store-cart-drawer.US7`, `g10.store-cart-drawer.US8`, `g10.store-cart-drawer.US9`, Pending operations | Drawer entry, Current cart review, Honest cart summary, Member tender context, Cart changes, Continuing onward, Checkout from the drawer |
| `shared/ui/store-cart` | `g10.shared-store-cart.US19`, `g10.shared-store-cart.US20`, Pending operations | Existing durable feature-set roots retained whole |
| `grade10-site/store/checkout` | Existing `grade10-site-store-checkout-US-05` and `grade10-site-store-checkout-US-06`; Safe repetition and recovery | Current basket and tender, Hosted Shopify handoff, Order settlement and return, Carrier rates |

QA1 receives no requirement text, scenarios, technical design, reconciliation,
QA2 or archive material. Dev receives the same frozen anchors and decisions
and reads the existing implementation; Dev does not receive QA1 cases.
These are read instructions, not a harness-enforced access boundary. The
recorded digest identifies the supplied snapshot, not proof of isolation.

## Readings

QA1, Dev, QA2 and acceptance-review results are recorded here as they finish.
New cases remain draft. Acceptance and publication require separate recorded
evidence; this planning record grants neither.

## Shared Anchor Restart

The earlier active pending-tender US18 collided with durable order-discount
US18. Its erroneous addition is removed; the already-issued pending US19 and
US20 anchors own the pending cases, whose identities remain intact. The shared
QA1 and Dev readings restarted independently in fresh contexts against
`8a8d6e59d40ebf9ff1cb4b6de04213976b73a4e0be37cb793296ae70beaaed4e`.
Unchanged cart and checkout readings retain their original input identity.

## Human Clarification

QA1 raised the successful checkout reply after dismissal. On 2026-10-13 the
human chose option B: open Shopify for the still-current reply. Cart Q16 and
checkout Q35 record the answer. The checkout PRD, design, request guards,
scenario and dependent case are patched before QA2. This changes no journey
or feature-set root, so QA2 reconciles the clarification without another
blind anchor restart. Closing invalidates tender-view publication; it does
not make a checkout answer stale by itself.

## Independent Drafts

- **QA1** - 9 new cart cases and 4 new shared cases; six existing cart/checkout
  routes or assertions updated. Cases remain draft. QA1 found the post-close
  reply question and sequential write waits missing from an existing route
- **Dev** - Technical design, scenarios and appended delivery groups precede
  case comparison. Added cart SC34-SC40, shared SC64-SC69 and checkout
  SC66-SC68. Historical task ids, owners, completions and snapshots retained
- **Shared restart** - Fresh Dev verifies all five public prop types, including
  the exported promo sheet, and exempts dismissal's collapsed-state callback
  from edit guards. Fresh QA1 retains legacy case identities under the correct
  anchors and avoids a duplicate compatibility suite
