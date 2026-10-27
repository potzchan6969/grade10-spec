**Author:** @potzchan6969 - 2026-10-27

## Why

A collector with a binder of cards has no reason to leave them in the
Grade10 vault: storage is free but earns nothing, and a case holds one card,
so ten cards are ten requests. The owner's draft makes the vault the top of
the consignment funnel by paying each vaulted card a small daily incentive,
and Phase A of that draft goes live in mid November 2026 -
[G10 Vault and Consignment](../../../docs/references/g10-vault-and-consignment-draft.md).

**Metric:** cards vaulted per owner; cards earning; incentive credited
against cards later consigned. All zero today, because nothing earns.

## What Changes

- **BREAKING - A case holds many cards** - every card handed in on one visit
  sits in one case, each with its own contract effective start date, its own
  incentive rate and, where financed, its own financing term; one case was
  one item - [Case Lifecycle](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md)
- **Each card earns daily** - from its contract's effective start, once it
  has passed authentication, every earning card's amount for the day before
  is credited shortly after midnight Hong Kong time, worked from the market
  price, the factor and the card's rate, each recorded with the amount -
  [Earnings](../../../docs/prds/products/grade10-site/vault/earnings.md#what-a-card-earns)
- **One balance per owner** - every card's incentive lands in one balance on
  the owner's account, showing what can be cashed out and what is locked
  until its day; nothing is cashed out yet -
  [Earnings](../../../docs/prds/products/grade10-site/vault/earnings.md#the-balance)
- **The first N days lock, and the switch says how** - credited daily and
  locked, or held and credited on day N, picked by an admin; the balance reads
  the same once day N passes -
  [Earnings](../../../docs/prds/products/grade10-site/vault/earnings.md#values)
- **Taking a card back early costs a fee** - inside Y days of its effective
  start a card owes the vault's early withdrawal fee, which may be 0, paid
  from a payment link or at the shop's till before the card is handed back -
  [Earnings](../../../docs/prds/products/grade10-site/vault/earnings.md#taking-a-card-back-early)
- **Staff pause earning** - on one card or a whole account, until released
- **Every figure is a setting** - the rate, N, Y, the fee, the crediting
  switch, the price rules and when identity is asked for are changed by an
  admin in the console and logged, and a card keeps the terms pinned when
  its contract took effect
- **When identity is asked is a setting** - each point the vault may ask for
  a verified identity is switched on or off, so the still-open KYC decision
  moves without a release -
  [Identity Check](../../../docs/prds/products/grade10-site/vault/identity-check.md#gate)

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities
- `grade10-site/vault/earnings`: the daily incentive per card, the crediting
  switch and the lock, pausing, the owner's balance, and the early withdrawal
  fee and its payment
- `grade10-admin/vault/earnings-settings`: the figures an admin sets - rate,
  N, Y, the fee, the crediting switch, the price rules and the identity
  points - and their log

### Modified Capabilities
- `grade10-site/vault/case-intake`: a case takes many cards, each with its
  own effective start date, incentive rate and financing term
- `grade10-site/vault/case-lifecycle`: a card is released only once an early
  withdrawal fee it owes is paid
- `grade10-site/vault/identity-verification`: whether identity is required
  before the custody paperwork, and at the other points, is read from
  settings rather than fixed

## Impact

- **Vault service** - cases, their cards and per-card terms; a daily credit
  pass on its own Hong Kong midnight schedule; the obligations seam release
  already refuses on; the vault's documents, which print one item today
- **A balance ledger** - new, beside the vault, since the vault and commerce
  databases may not read each other
- **Inventory** - the market price per card, from a SNKRDUNK feed beside the
  PriceCharting reference
- **Store and POS** - a payment link and a till line for the fee, bound back
  to the withdrawal the way a counter sale binds
- **Overlap** - `redraw-vault-collector-pages` draws the portfolio this
  balance and these cards appear on; `add-consignment` pays an incentive at
  consignment that the owner's draft replaces with this one

## Follow-on changes

- Cashing the balance out, by FPS or bank transfer
- Consigning a card straight from the vault, earning until it sells
- Taking a card back by appointment, with the incentive it forfeits shown
- One hold per card across the till and the online store
