# Loyalty — delta

## ADDED Requirements

### Requirement: The top-up surface exports

The shared UI package SHALL export, from its public entry, `TopUpPackCard`,
`TopUpPackCardCopy` and `TopUpPackCardProps` under a
`shared-ui/loyalty-top-ups` group for the top-up surface.

`TopUpPackCard` SHALL draw one points pack a member picks inside a
`RadioList`, in the viewport it is given: a tile with the count under a
media box on large, a row with the radio trailing on small. It shows the
pack's points count and price and — only where a pack is discounted —
the same money read as points plus the bonus points the member gains over
what they pay, under the count. Where `disabled` holds, the card SHALL
state the supplied reason inside its accessible name and SHALL show the
same reason in a tooltip beside the points count, with no other reason
text in the card body. It SHALL take the words it renders in a single
`copy` prop of its own copy type, and SHALL receive every count, price
and state through props — it SHALL NOT fetch, subscribe to, or store
product state.

<!-- trace:scenario id=g10.loyalty-programme.SC-x4k rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-363 - A discounted pack shows its bonus
**Serves:** grade10-site-loyalty-programme-US-14 - Member buys a points pack

- **WHEN** a pack is discounted
- **THEN** the card shows the paid points plus the bonus points under the
  count

<!-- trace:scenario id=g10.loyalty-programme.SC-9m2 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-364 - A refused pack says why through its name and a tooltip
**Serves:** grade10-site-loyalty-programme-US-14 - Member buys a points pack

- **WHEN** a pack is disabled with a reason supplied
- **THEN** the reason is in the card's accessible name and in a tooltip,
  and nowhere else in the card
