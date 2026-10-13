# grade10-site/auction/winner-order Specification

## Feature set

- Settlement currency
  - Winner's choice at setup: before the payment method the winner picks USD or HKD; `HKD` is preselected, and changing it restores the method last chosen there
  - Order in the chosen currency: the invoice, order total, fees, payments, refunds and order letters carry the settlement currency; the winning bid stays a USD fact
  - Locked on confirmation: once the winner confirms, the currency changes by an operator's edit before send, or a reissue after
  - ❓ Disclosure: whether the invoice prints the USD winning bid beside an HKD order's totals is pending PM
- Methods by currency
  - USD: card, Hong Kong local bank transfer, SWIFT
  - HKD: card, FPS, Hong Kong local bank transfer
  - Rails: View Bank Details shows only the rails of the order's currency

## ADDED Requirements

### Requirement: The winner chooses a settlement currency at order setup

At order setup the winner SHALL choose the order's settlement currency from
`USD` and `HKD` before choosing a payment method. `HKD` SHALL be the
preselected currency, `card` the preselected method, and Grade10 SHALL record
the confirmed currency on the order. Changing the currency SHALL restore the
payment method last chosen in it. Grade10 SHALL refuse a confirmation with no
currency chosen.

The invoice and every payment, refund and order letter for that order SHALL
carry the settlement currency. A bid amount on a winner-facing surface SHALL
stay in the lot's USD. For an `HKD` order the operator SHALL issue the invoice
in HKD, per `grade10-admin/auction/post-sale`; Grade10 SHALL hold no exchange
rate and SHALL NOT convert the winning bid.

Once the winner confirms, the currency locks with the method, per "The winner
chooses a payment method with the address". Once an invoice is sent it SHALL
NOT change.

#### Scenario: grade10-site-auction-winner-order-SC-XX - Winner picks settlement currency at setup

- **GIVEN** a winner setting up an order won on a `USD` lot
- **WHEN** they open the payment-method step
- **THEN** `HKD` is preselected and its methods are offered with `card` chosen
- **AND** they may switch to USD before confirming

#### Scenario: grade10-site-auction-winner-order-SC-XX - Each currency remembers its method

- **GIVEN** a winner who chose HKD and then bank transfer
- **WHEN** they switch to USD and back to HKD
- **THEN** HKD shows bank transfer still chosen
- **AND** USD showed card, its remembered default

### Requirement: Methods and bank rails follow the settlement currency

Grade10 SHALL offer methods by the order's settlement currency, each only where
Grade10 can take it, per "The winner chooses a payment method with the address":

| Currency | Card | Bank transfer rails |
| --- | --- | --- |
| USD | Card | Hong Kong local bank transfer, SWIFT |
| HKD | Card | FPS, Hong Kong local bank transfer |

Card SHALL be offered where Payment Settings holds a card fee rule for the
settlement currency. Bank transfer SHALL be offered where Grade10 holds bank
details for the settlement currency. View Bank Details SHALL show the rails of
the order's currency alone, defaulting to FPS for HKD and to Hong Kong local
for USD.

#### Scenario: grade10-site-auction-winner-order-SC-XX - HKD offers card, FPS and Hong Kong bank transfer

- **GIVEN** an HKD order whose winner confirmed, where Grade10 holds HKD bank
  details and Payment Settings holds an HKD card rule
- **WHEN** the winner opens View Bank Details
- **THEN** the dialog shows FPS and Hong Kong local, defaulting to FPS
- **AND** it shows no SWIFT rail

#### Scenario: grade10-site-auction-winner-order-SC-XX - USD offers card, Hong Kong bank transfer and SWIFT

- **GIVEN** a USD order whose winner confirmed bank transfer
- **WHEN** the winner opens View Bank Details
- **THEN** the dialog shows Hong Kong local and SWIFT, defaulting to Hong Kong local
- **AND** it shows no FPS rail

## MODIFIED Requirements

The by-currency phrasing in "The winner chooses a payment method with the
address" now reads against the settlement currency, not the lot's. Its text is
unchanged until the PM confirms.

## REMOVED Requirements

None.
