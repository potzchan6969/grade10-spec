# Loyalty: earning, an operator console, and a membership surface

Product context: [Grade10 loyalty programme](../../../docs/prds/loyalty/programme.md).

## Why now

The loyalty programme is built and running, and nobody can use it. No product
records a purchase against it, so no member can hold a point; and it has no
surface, so neither a member nor an operator can see or do anything.

## Scope

- **Earning.** The store records completed purchases and refunds against the
  programme, once per money event, surviving an outage on either side.
- **The missing operator actions.** Campaign point grants that count toward
  tier, listing invitations, listing rewards including archived ones, finding a
  redemption to reverse, and reading which tiers the programme defines.
- **The missing member reads.** What a member has redeemed, and an activity
  entry a member can read without a second lookup.
- **An operator console.** One surface for members, points, invitations,
  rewards, and the operator log, gated per permission.
- **A membership surface.** Tier, balance, activity, the reward menu, and
  redemption.
- **Operator identity lookup**, under the identity permission, so an operator
  can find a member by email rather than by an opaque identifier.

## Non-goals

- **Fulfilment.** A redemption produces an entitlement; turning that into a
  discount code or a counter transaction is a separate decision, unmade.
- **Editable programme economics.** The earn rate, expiry window and tier ladder
  stay in code, deployed and reviewed. An operator cannot change what a purchase
  earns.
- **The annual cap on the invitation-only tier and its approval step.** Named in
  the PRD as an open question; the programme does not enforce either today.
- **ZZZ.** The second brand's loyalty product is retired as part of this work;
  only Grade10 runs a programme.

## Consumer impact

| Application | What it must do |
| --- | --- |
| `grade10-store` backend | Sell in the programme's currency, record purchases and refunds, and fail to start if the currencies disagree |
| `grade10-loyalty` backend | Publish a wire contract, add the missing operator and member actions, and narrow its public reward menu |
| `grade10-auth` backend | Serve operator identity lookups under the identity permission, on a connection separate from session resolution |
| `grade10-loyalty` console | New |
| `grade10-loyalty` membership surface | New |
| `zzz-loyalty` backend | Removed |

No design-system primitive changes and no component export contract changes.
Both new surfaces compose published primitives.

## Compatibility

The programme's stored data is unchanged except for what the store needs to
record a refund amount. Nothing already recorded is rewritten.

The identity lookup is a new capability on the identity service, reachable only
with an operator session that carries the identity permission — adding it must
not widen what any existing service connection can already do.

## Validation

- The programme's portable behaviour suite covers every new action, including
  that a campaign grant moves tier progress and a correction does not.
- Delivery of a money event is proven by recording a purchase while the
  programme is unreachable and showing the points arrive afterwards.
- The console's second-factor path is proven by test, because the environments
  developers run do not enforce a second factor.
- Both surfaces carry unit suites, and both are registered in the repository's
  test and build chains — a check enforces that registration rather than
  trusting it.

## Open decisions

Recorded in the PRD, not resolved here: what a point is worth in money, whether
points liability is reported, and the cap and approval on the invitation-only
tier.
