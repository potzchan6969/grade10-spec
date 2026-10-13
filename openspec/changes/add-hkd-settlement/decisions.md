## Goals

- Let a winner settle in USD or HKD, chosen at order setup.
- Offer the methods Grade10 can take in each currency.

## Non-Goals

- A rate, a conversion or a lock point: the operator enters the HKD amounts.
- A settlement currency beyond USD and HKD.
- A display of bids or prices in HKD; bids and lots stay USD.
- ❓ Rounding of an operator's HKD amounts, and whether the invoice prints the USD winning bid beside them - pending PM and Finance.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who picks the settlement currency? | The winner, at order setup, before the payment method; HKD and card are preselected; each currency remembers its last method | A currency fixed to the lot |
| Q2 | How is the HKD amount reached? | The operator issues the invoice in HKD | A rate in Payment Settings, or an automatic conversion at setup |
| Q3 | Which methods does each currency offer? | USD: card, Hong Kong bank transfer, SWIFT. HKD: card, FPS, Hong Kong bank transfer | One list for both |
| Q4 | ❓ Rounding and USD-bid disclosure on the invoice? | Pending PM and Finance | - |
| Q5 | ❓ Is the choice its own step or on the payment-method step? | The storybook draws it on the payment-method step; PM confirms | - |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
