# grade10-site/loyalty/programme Top-up surface Test Cases

**Status:** draft

## Walk 1: Pick a pack for top-up

Starting state:

* customer(member) is signed in and opens the top-up picker on `<loyalty>`.

Shared test data:

| Field | Value |
| --- | --- |
| loyalty | The member's Membership page |
| pack | 10,000 points at HK$9,500, list HK$10,000 |

### Route

1. Read the 10,000-point pack's row.
   * The row shows its price, the list price struck through and a save badge. `g10.loyalty-programme.US9-TC1`
2. Read a pack over today's remaining limit.
   * The pack cannot be picked, and its reason is in its name and a tooltip on the warning icon. `g10.loyalty-programme.US9-TC2`

## Background

* The member's surface is `<loyalty>` on the Grade10 site; the top-up picker opens over it.
* Packs are points with an operator-set discount; a pack over what is left of the day's top-up limit cannot be picked.
