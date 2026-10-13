# grade10-site/commerce/commerce Specification

## Purpose

A checkout prices the basket before an order exists and asks nothing about
identity, at any value. Grade10 never required a sign-in or a verified identity
for a checkout; the identity bar applies to a bid alone.

## Feature set

- Checkout and identity
  - Priced first: the basket's goods are priced live before any order is made
  - No identity gate: a checkout at any value reads no standing and refuses nobody for it

## Requirements

### Requirement: A checkout asks nothing about identity

The system SHALL price the basket's goods live, before any order is made. A
checkout SHALL ask nothing about identity at any value: it SHALL read no
standing, and SHALL neither refuse a buyer nor ask a guest to sign in because
of the goods' value.

<!-- trace:scenario id=g10.commerce-commerce.SC-7mb rev=2 -->
#### Scenario: grade10-site-commerce-commerce-SC-28 - A checkout at any value asks nothing about identity
**Serves:** Checkout and identity - a checkout at any value reads no standing and refuses nobody for it

- **GIVEN** a basket whose goods are worth any value, HKD 120,000 or more
  included
- **WHEN** any buyer checks out, signed in or as a guest
- **THEN** no standing is read and the checkout proceeds as any other
