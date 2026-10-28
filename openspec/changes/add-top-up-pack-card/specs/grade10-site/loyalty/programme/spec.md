# Loyalty — delta

## ADDED Requirements

### Requirement: The top-up surface exports

The shared UI package SHALL export, from its public entry, `TopUpPackCard`,
`TopUpPackCardCopy` and `TopUpPackCardProps` under a
`shared-ui/loyalty-top-ups` group for the top-up surface.

`TopUpPackCard` SHALL draw one points pack a member picks inside a
`RadioList`: the pack's points count, its price right-aligned, and — only
where a pack is discounted — the same money read as points struck beside
the count, with the bonus points the member gains over what they pay shown
under the row in success. Where `disabled` holds, the card SHALL state
the supplied reason inside its accessible name and SHALL show the same
reason in a tooltip beside the points count, with no other reason text in
the card body. It SHALL take the words it renders in a single `copy` prop
of its own copy type, and SHALL receive every count, price and state
through props — it SHALL NOT fetch, subscribe to, or store product state.

<!-- trace:scenario id=g10.loyalty-programme.SC-x4k rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-363 - A discounted pack shows its bonus
**Serves:** grade10-site-loyalty-programme-US-14 - Member buys a points pack

- **WHEN** a pack is discounted
- **THEN** the card strikes the paid points beside the count and shows the
  bonus points under the row

<!-- trace:scenario id=g10.loyalty-programme.SC-9m2 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-364 - A refused pack says why through its name and a tooltip
**Serves:** grade10-site-loyalty-programme-US-14 - Member buys a points pack

- **WHEN** a pack is disabled with a reason supplied
- **THEN** the reason is in the card's accessible name and in a tooltip,
  and nowhere else in the card
