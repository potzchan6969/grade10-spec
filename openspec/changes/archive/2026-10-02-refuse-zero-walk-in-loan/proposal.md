**Author:** @ecchochan - 2026-10-02

## Why

At the counter, staff who choose a loan enter the amount the customer asks
for. The walk-in form takes `0`, the worker refuses any amount that is not
more than zero, and the form's footer prints the worker's own text, which no
rule or words cover. The collector's own wizard refuses zero already, while
case intake says only that the financing amount is an integer count of minor
units (owner-questions 15).

## What Changes

- **More than zero** - case intake's financing amount reads more than zero,
  the rule the worker and the collector's wizard already hold.
- **A loan of zero at the counter** - the walk-in form refuses it beside the
  loan field, in the console's words, and sends nothing. The check is the
  worker's own rule for the amount, so the form and the worker never disagree
  on one.

Goals and non-goals are in [`decisions.md`](decisions.md).

## Capabilities

### Modified Capabilities

- `grade10-site/vault/case-intake` - the financing amount's rule reads more
  than zero, with a scenario for a loan of zero.
- `grade10-admin/vault/operator-queue` - the walk-in requirement's refusal
  table gains the loan row and its scenario.

## Impact

- **Pages** - [Collector Pages · Request Wizard](../../../docs/prds/products/grade10-site/vault/collector-pages.md#request-wizard)
  states that a loan asks for more than zero;
  [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
  carries the 🚧 line for the loan refusal.
- **grade10** - the walk-in dialog in `packages/vault/admin-frontend` checks
  the amount with the contract's own amount rule and shows the refusal beside
  the field; the console's money field in `packages/frontend-console` tells
  the form when staff leave it. No worker, wire or contract change. Consumer
  app: the grade10 admin console (`apps/admin/grade10`).
- **Component exports** - none move. `MoneyField` gains an optional `onBlur`,
  as `TextField` and `NotesField` have.
- **Metric** - walk-in opens the worker refuses for a loan of zero: from every
  zero typed to none, since the form no longer sends one.

## Open questions

None.

## References

- [Collector Pages · Request Wizard](../../../docs/prds/products/grade10-site/vault/collector-pages.md#request-wizard)
- [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
