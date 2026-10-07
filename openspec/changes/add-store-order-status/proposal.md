**Author:** @jeffffej0909 - 2026-08-28

## Why

A collector who opens an order cannot reliably tell where it stands. Your
Orders and Order Details share one interim adapter, `customerOrderStatus` in
the grade10 application's `apps/frontend/grade10/src/pages/orders/orderStatus.ts`,
and no requirement says what its answer should be. It differs from the
[Order Status](../../../docs/prds/products/grade10-site/commerce/order-status.md)
page in five ways:

- **Completed** - a paid, fully fulfilled order reads Completed, archived or
  not (`orderStatus.ts:36-38`)
- **Till sales** - a paid counter sale reads Completed by where it was sold,
  whatever its fulfilment (`orderStatus.ts:27-29`)
- **Partial refunds** - a partial refund reads the same as a full one, because
  the Store's own status folds them together (`orderStatus.ts:25`)
- **Held orders** - a held or scheduled order carrying a refund reads Refunded,
  where the page keeps it Processing (`orderStatus.ts:25`)
- **Failed checkouts** - a checkout that failed before Shopify recorded it
  reads Canceled (`orderStatus.ts:22`), where the badge covers only orders
  Shopify holds (Q15)

A partly refunded, held or voided order is where a collector is most likely to
write to support, and it is where the adapter has no defined answer.

**Metric** - support contacts about order status per 100 orders, and their
share of all Store contacts, with partly refunded and held orders watched as
their own segment.

## What Changes

- **One rule** - introduces `grade10-site/commerce/order-status`: an order's
  Shopify order, payment and fulfilment facts resolve to one of five badges,
  Processing, Shipped, Completed, Canceled or Refunded, by an ordered rule that
  resolves every combination
- **Secondary note** - the rule may also name one note identifier, read with
  the order's return state; no surface shows it in this delivery (Q14)
- **Every surface** - every Store surface that shows order status takes it
  from this rule, which replaces the interim adapter
- **One stored copy** - Your Orders and Order Details read one stored copy of
  Shopify's facts: an order paid in full, refunded or canceled reaches it
  within 5 minutes, and any other change to an order Shopify holds open,
  placed in the last 90 days, within the hour (Q23, Q24)
- **Your Orders** - lists a web checkout once the shop records it, and groups
  orders by whether Shopify still holds them open rather than by badge (Q15,
  Q16)
- **Shared badge** - `OrderHistoryStatus` keeps its six variants and drops the
  meaning it gave each one; Order Status defines what a Store order's badge
  means

The ordered rule replaces the source PRD's fifteen-step priority list, which
resolved badges only and could not produce the notes its own tables showed.
The rule was drawn from the thirty rows that PRD confirmed. Q9 and Q19 changed
rule 4 since. Its owner files the PRD with the references before group 1, and
task 1.1 checks every row (Q17).

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/commerce/order-status`: how an order's Shopify order, payment
  and fulfilment facts resolve to one badge, how its return state and those
  facts choose an optional note identifier, and the obligation on every surface
  that shows order status to use it.

### Modified Capabilities

- `shared/ui/store-order-history`: `Order status maps the six Status-set
  variants` keeps the six accepted statuses and the consumer's label, and
  replaces its meaning column with the rule that the consumer chooses the
  status.

## Impact

**Consumers** - Your Orders and Order Details in the grade10 application
derive their badge from this rule, and `orderStatus.ts` is deleted. Your
Orders' listing and grouping rules stay in `add-grade10-customer-order-pages`'
order-history requirement; this change builds both, because each needs the
facts and the backend read it adds.
`add-grade10-customer-order-pages` holds its completion behind this change
(its `tech-design.md`, step 5) and names this capability in its deltas, as
does `clarify-auction-shipping-progress-copy` in the auction's independence
rule; both depend on the id `grade10-site/commerce/order-status`.

**Delivery facts for the tech design:**

1. **Facts the Store order lacks** - the typed Store order carries a
   normalised lifecycle that folds partial and full refunds together, and no
   archived flag or return status; the Shopify order query fetches neither.
   The tech design decides how Shopify's financial status, fulfilment status,
   `closed`, `cancelledAt` and `returnStatus` reach the rule, how they are
   stored for Your Orders, which reads stored rows, and how existing orders
   are backfilled.
2. **Returns** - `returned` is not a member of Shopify's fulfilment status;
   Shopify reports returns on the order's `returnStatus`, and the rule reads
   them there.
3. **Till sales** - the tech design checks how Shopify reports fulfilment and
   archiving for this shop's counter sales (Q12).
4. **One implementation** - the rule is written once, where both pages and a
   later notification centre can import it, and is tested over every
   combination of its vocabulary.

**Design system** - no primitive, Figma component set or `tokens.json`
change.

## References

- [Order Status · Badges](../../../docs/prds/products/grade10-site/commerce/order-status.md#badges)
- [Order Status · Updates from Shopify](../../../docs/prds/products/grade10-site/commerce/order-status.md#updates-from-shopify)
- [Order Status · Secondary Note](../../../docs/prds/products/grade10-site/commerce/order-status.md#secondary-note)
- [Order Status · Pickup](../../../docs/prds/products/grade10-site/commerce/order-status.md#pickup)
- [Order History Blocks](../../../docs/prds/products/shared/ui/store-order-history.md)
- [Refunds](../../../docs/prds/products/grade10-site/store/refunds.md)
- [Shipping · Today](../../../docs/prds/products/grade10-site/store/shipping.md#today)
- [Your Orders](../../../docs/prds/products/grade10-site/store/order-history.md)
