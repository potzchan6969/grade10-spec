# Write the shipped role and permission set into the spec

**Author:** @ecchochan - 2026-09-04

## Why

`shared/auth/roles` is the one place a product is meant to learn what a grant
means. It has drifted from the code that enforces it, and the drift is not
cosmetic — it is whole roles and whole resources.

- **A role nobody documented.** `treasurer` ships in `ROLE_PERMISSIONS` and
  appears in no requirement, so the spec's "closed set" is not the set.
- **Six resources missing from the vocabulary.** `vault`, `finance`, `kyc`,
  `appointment`, `inventory` and the money-shaped auction actions are all
  enforced and none is written down. A product reading this spec alone cannot
  tell what `kyc:read` is, or that it exists.
- **The role table is a sketch.** `staff` is recorded as holding six grants and
  holds eighteen; `admin` is recorded as "every permission any role grants",
  which is not what the code computes.

An engineer building from this spec alone — which is what a durable spec is for
— would build the wrong authorization.

**Metric:** resources in the spec's vocabulary against resources in
`PERMISSION_STATEMENTS` — from five of eleven to eleven of eleven.

## What Changes

- **Name `treasurer`** in the closed role set, beside the five roles already
  there.
- **Write the vocabulary down as a table** of resources and actions, and say
  what the cost-shaped actions mean: `operate` runs a flow, `approve` sets what
  something costs, `payout` is the only action that moves money.
- **Give `kyc:read` its own resource**, rather than an action on whichever
  product collected the document — the document and the agreement printed from
  it outlive the case, and reading a case is not reading the person.
- **Replace the role table with the shipped one**, every grant, in order.
- **Say what the split between `staff` and `treasurer` does and does not
  buy.** They are disjoint on every action that moves money. They are not
  mutually exclusive, and grants stack, so the separation is a provisioning
  practice rather than something the vocabulary enforces.

## Non-Goals

- **Changing any grant.** Nothing here alters who may do what; the code is the
  reference and the spec is what moves.
- **Enforcing disjointness.** Whether one person may hold both `staff` and
  `treasurer` is a provisioning decision, not this change's to take.
- **The `vault:operate` / `vault:approve` split.** `staff` holds both, so no
  role separates them today. Whether one should is
  `add-hosted-identity-verification`'s open question, not this change's.
- **Service principals.** A till's grants sit outside the role vocabulary
  entirely. That belongs with the change that ships the till.

## Capabilities

### Modified Capabilities

- `shared/auth/roles` — the closed role set gains `treasurer`; the permission
  vocabulary becomes a written table of eleven resources; the role table
  becomes the shipped mapping.

## Impact

- **No code changes.** `packages/grade10-auth/contracts/src/schemas.ts` is
  already the shape this change writes down; the spec catches up to it.
- **Every product that checks a grant** gains a spec it can build from.
- **`docs/prds/products/shared/auth/roles.md`** — the page renders the
  capability and follows it.

## Open questions

- ❓ **Whether one person may hold both `staff` and `treasurer`.** The grants
  are disjoint; the roles are not exclusive, and a person holding both gets the
  union. Whether provisioning should refuse the pair is unowned. *Owner:
  whoever owns operator provisioning.*
