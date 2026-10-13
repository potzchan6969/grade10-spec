# Pending Drawer And Pay Cluster

## Ownership

| Requirement | Owner | Consumer |
| --- | --- | --- |
| Shared consumer pending prop, callback guards and dismissal | `add-store-cart-drawer-ui`, `shared/ui/store-cart` | Checkout uses the shared prop; it adds no second shared contract |
| Current drawer operation scope and recovery | `add-store-cart-drawer-ui`, `grade10-site/store/cart-drawer` | Checkout creation participates in the same pending lifetime |
| Pay request, current-answer navigation and stale-answer rejection | `add-shopify-checkout-integration`, `grade10-site/store/checkout` | Drawer delegates the checkout answer treatment |

## Decisions

Cart Q20 and Q21 disable non-dismissal actions for actual pending work and keep
dismissal available. Cart Q22 and checkout Q35 record option B: a still-current
successful reply opens Shopify after dismissal. Closing alone does not make
that reply stale. A changed cart, tender, member or request still does.

Legacy pending-tender US18 collided with durable order-discount US18. The
erroneous active addition is removed before publication; pending US19 and US20
own its cases without changing their identities. Both shared readings restart.

## Order

1. The existing `add-store-product-status` dependency supplies current status
   facts and depends on the earlier checkout contract. Its contract and
   existing dependency metadata are not changed by this pending increment.
2. Accept `add-store-cart-drawer-ui`, including the shared optional prop.
3. Amend `add-shopify-checkout-integration` against its historical accepted
   fingerprint `137f9cec66da45e8975e44b4be5c14c272ad34df5ee7e37dca1b8061eb5e0d8c`.
4. Land shared Group 15, then the drawer host and pending-Pay consumer groups.

Each change retains its own acceptance and verdict. This sheet is planning
evidence, not acceptance or publication. Historical snapshots stay intact.
The current acceptance preflight determines whether the older dependency
cluster needs reconciliation before this order can be used. The shared build
dependency does not add a reverse manifest edge: that would create a cycle
through the existing product-status dependency.

## Shelf Scan Sync

- **Ownership** - `add-store-shelf-scan-sync` owns the new
  `grade10-site/store/shelf-scanning` capability and edits no requirement
  another open change edits; it shares none
- **Reads** - the keeper's webhook path and 5-minute walk from
  `refresh-listing-within-seconds`, and the one-item rule from
  `add-store-product-status`, through `depends_on` only
- **Decisions** - none open across the cluster
- **Order** - accepted after `refresh-listing-within-seconds` and
  `add-store-product-status`; it holds no other change in the cluster
