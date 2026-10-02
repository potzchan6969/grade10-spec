**Author:** @ecchochan - 2026-10-02

## Why

At the counter, staff type the customer's email address into the walk-in
form. When the address is not an email address, the worker refuses the open
and the form's footer prints the worker's own text, which no rule or words
cover. The suites' review also found that a walk-in scenario says the
eleventh photograph "is refused by name", when the form takes the add
control away at ten (owner-questions 14).

## What Changes

- **An address that is not an email address** - the walk-in form refuses it
  beside the address field, in the console's words, and sends nothing. The
  check is the worker's own rule for an address, so the form and the worker
  never disagree on one.
- **Ten photographs** - the walk-in scenario says what was built: at ten the
  form offers no way to add another, and still holds ten.

Goals and non-goals are in [`decisions.md`](decisions.md).

## Capabilities

### Modified Capabilities

- `grade10-admin/vault/operator-queue` - the walk-in requirement's refusal
  table gains the address row and its scenario; the ten-photograph scenario
  is corrected.

## Impact

- **Page** - [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
  carries the 🚧 line for the address refusal.
- **grade10** - the walk-in dialog in `packages/vault/admin-frontend` checks
  the address with the contract's own address rule and shows the refusal
  beside the field. No worker, wire or contract change. Consumer app: the
  grade10 admin console (`apps/admin/grade10`).
- **Component exports** - none move. The refusal uses the console's existing
  field refusal.
- **Metric** - walk-in opens the worker refuses for a malformed address: from
  every malformed address typed to none, since the form no longer sends one.

## Open questions

None.

## References

- [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
