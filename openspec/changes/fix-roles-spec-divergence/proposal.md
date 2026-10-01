# Write the shipped role and permission set into the spec

**Author:** @ecchochan - 2026-09-04

## Why

`shared/auth/roles` is the one place a product is meant to learn what a grant
means. It has drifted from the code that enforces it by whole roles and whole
resources.

- **Two roles nobody documented.** `finance` and `treasurer` ship in
  `ROLE_PERMISSIONS` and appear in no closed-set requirement, so the spec's
  "closed set" is not the set. The refund requirement already names
  `finance` as a role it refuses.
- **Five resources missing from the vocabulary.** `vault`, `kyc`, `grading`,
  `appointment` and `inventory` are enforced and none is written down, and
  neither are auction's `payment` and `shipment` or loyalty's `demote` and
  `cancel`. A product reading this spec alone cannot tell what `kyc:read` is,
  or that it exists.
- **The role table is a sketch.** `staff` is recorded as holding six grants and
  holds nineteen; `admin` is recorded as "every permission any role grants",
  which is not what the code computes.

An engineer building from this spec alone — which is what a durable spec is for
— would build the wrong authorization.

**Metric:** resources in the spec's vocabulary against resources in
`PERMISSION_STATEMENTS` — from six of eleven to eleven of eleven.

## What Changes

- **Name `finance` and `treasurer`** in the closed role set, beside the five
  roles already there.
- **Write the vocabulary down as a table** of resources and actions, and say
  what the vault's cost-shaped actions mean: `operate` runs a case, `approve`
  sets what it costs, `payout` is the only vault action that moves money.
- **Give `kyc:read` its own resource**, rather than an action on whichever
  product collected the document — the document and the agreement printed from
  it outlive the case, and reading a case is not reading the person.
- **Replace the role table with the shipped one**, every grant, in order.
- **Say what the split between `staff` and `treasurer` does and does not
  buy.** They are disjoint on every action that moves money. One person may
  hold both and the grants stack, so two people on money comes from the rule
  that nobody approves an act they recorded (Q9), which vault and grading
  already enforce.

Goals and non-goals are in [`decisions.md`](decisions.md).

## Capabilities

### Modified Capabilities

- `shared/auth/roles` — the closed role set gains `finance` and `treasurer`;
  the permission vocabulary becomes a written table of eleven resources; the
  role table becomes the shipped mapping.

## Impact

- **No production code changes; grade10 gains tests and an e2e helper role.**
  `packages/grade10-auth/contracts/src/schemas.ts` is already the shape this
  change writes down; the spec catches up to it.
- **Every product that checks a grant** gains a spec it can build from.
- **`docs/prds/products/shared/auth/roles.md`** — the page renders the
  capability and follows it.
- **The suite beside the delta is a merge, not a replacement.** It carries the
  two journeys this change touches; `US2` holds the cases it adds, not the
  ones the durable suite already has. Acceptance folds them in and adds `US3`.
- No domain impact: `shared/auth/domain-tcs.md` walks `shared-auth-roles-US-02`
  through a staff role saved and a support refusal, and this change moves no
  grant either walk checks.

## Open questions

None; whether one person may hold both `staff` and `treasurer` is Q9.
