# Design

## Context

This change adds a channel to a programme that already runs. The programme's own
engine — the two counts, both clocks, the ladder, redemption and reversal —
lands with `revise-loyalty-programme-rules`; nothing here re-specifies it.

What does not exist today: no member has a commerce customer, the shop is not a
caller at all, no order arrives from a physical till, and a redeemed reward has
no state meaning "paid for, not yet collected".

Requirements: [`specs/grade10-site/store/membership/spec.md`](specs/grade10-site/store/membership/spec.md)
and [`specs/grade10-site/loyalty/programme/spec.md`](specs/grade10-site/loyalty/programme/spec.md).

## Decisions

### The commerce provider is Shopify, named here and never in a requirement

Every "commerce customer", "provider order" and "till" in the requirements is
Shopify, its orders, and a Shopify POS extension. The requirements say none of
that because the loyalty side of this boundary is already built that way:
`services/rewards/fulfiller.ts` states it in the code — *what the something is,
and which vendor makes it, belongs to the app assembly, so nothing here names
one*. A requirement that named Shopify would put the vendor on the wrong side
of a port the engine already draws.

This requirement vocabulary stays provider-neutral because its subject is a
member's identity and balance, while the provider is an implementation choice.
The rule belongs in `docs/governance/`; until it is written down, this remains
a decision of this design rather than a repository-wide convention.

What that costs: a reader of the specs alone cannot tell which provider is
meant. That is the point — the answer lives here, and here is where it changes.

### A member's commerce customer is paired server-side, and never blocks sign-up

Pairing runs behind the account, not in front of it: a sign-up completes whether
or not the vendor answers. The pairing either converges on retry or parks in a
state an operator can see, because a member with no customer is a member whose
in-store purchase cannot be attributed, and that is worth surfacing rather than
retrying forever in silence.

Rejected: pairing inline at sign-up. It makes the vendor's availability a
condition of joining Grade10.

### The till session is the unit of authorization, not the individual act

One identification opens a time-limited session; every read and act inside it
carries the staff and location labels and is recorded. The alternative — a
confirmation on the member's phone per act — was rejected by the owner as a
counter experience, so the controls are the session's short life, the audit on
every act, the member's instant notification, and the per-shop kill switches.

That places the trust in the shop rather than the device, which is the risk this
design accepts deliberately.

### Physical-store orders are ingested exactly once, and attributed later

Order ingestion and member attribution are separate concerns. An order lands
exactly once whether it arrives by webhook or by the reconciling sweep, and it
may carry no member at all; attribution is evidence-based and can happen
afterwards, with one claim live at a time. Refunds stay exactly-once even for an
order whose owner is not yet known, so a guest sale later attributed cannot earn
points a refund has already taken back.

Rejected: requiring identification before the sale can complete. That makes the
programme an outage away from stopping the shop selling.

### A physical reward is parked, not couponed

`revise-loyalty-programme-rules` settles that a physical reward is handed over
rather than dressed as a money-off code. This change gives that its state: a
pending collection, completed by an explicit confirmation at handover.

Rejected: one code for everything. It makes the till honour a code for an object
it is handing over, which the shop reconciles by hand, and it leaves no state
meaning "paid for, not yet collected" — so nothing can tell a member their
reward is waiting.

## Risks / Trade-offs

- **Staff act for members with no confirmation on the member's device.** A
  member's points can be spent by someone standing at a till. The controls are
  the member's instant notification on every staff-assisted act, the audit
  carrying staff and location, the session's short life, and the per-shop kill
  switches — including one that disables staff-typed email lookup while card
  identification keeps working. Nothing technical survives a member handing over
  their card, so this is instrumented rather than prevented.
- **The till cannot be blocked on the programme.** A till that stops selling
  because loyalty is down is worse than a lost point. Every path completes the
  sale first and attributes after, which means a real window where a purchase
  exists and its points do not.
- **A vendor sits inside identification and settlement.** A provider outage
  degrades every till to guest sales. That is the designed failure mode, but it
  is silent to the member until they check their balance.

## Migration Plan

Every existing member needs a paired customer. The pairing path is idempotent
and parks what it cannot resolve, so the backfill is a re-runnable sweep with
row counts asserted before and after, not a one-shot.

## Open Questions

Neither changes a requirement.

- **Physical reward menu** — which items, their point prices, the collection
  window's length, and how counter stock decrements. The lifecycle is specified;
  its contents are a menu, which is operator-editable by design.
- **Per-redemption and daily quantity bounds** — deployed values. The spec
  refuses a programme offering a per-unit reward without them, so the open part
  is what the numbers are, not whether they exist.
