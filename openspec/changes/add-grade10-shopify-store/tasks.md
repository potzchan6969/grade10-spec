# Tasks: Shopify-backed Grade10 Store

## 1. Shopify contracts and feasibility

- [ ] 1.1 Define the Storefront catalogue/variant availability outcomes and the Admin customer, draft-order reservation, order-payment, fulfilment, and tracking outcomes using the pinned Shopify API version.
- [ ] 1.2 Make `A paid buyer lands on their Grade10 order` pass against the selected Shopify plan and enabled checkout capabilities, proving the post-payment return mechanism before dependent checkout work begins.
- [ ] 1.3 Make `Integration configuration is incomplete` pass for the shop domain, API version, Storefront token, Admin token/scopes, checkout-return capability, and webhook secret, exposing no credential to a browser.
- [ ] 1.4 Verify transport fixtures identify a failed Shopify operation and keep business outcomes typed.

## 2. Catalogue, identity, and reserved checkout

Task 2.5 depends on the contracts in group 1; it uses fixtures rather than a running backend.

- [ ] 2.1 Make `A shopper browses a current Shopify catalogue` and `Shopify catalogue data is unavailable` pass through the Store public catalogue contract.
- [ ] 2.2 Make `A Shopify product change invalidates browsing data` pass with tagged cache invalidation and bounded expiry.
- [ ] 2.3 Make `An existing Grade10 customer signs in before checkout` and `A guest receives a linked Grade10 account after payment` pass through Grade10 magic-link and one-to-one Shopify customer association behavior.
- [ ] 2.4 Make `Checkout uses live Shopify price and inventory`, `A finite-stock checkout holds inventory for fifteen minutes`, `An expired reservation cannot be paid as held stock`, `Backorders are refused`, and `A retry returns one checkout handoff` pass with one local order and one Shopify draft order.
- [ ] 2.5 Make `A checkout URL is safe to follow`, `A permanent order URL requires its account`, and `An account lists its orders` pass in the Grade10 storefront against Store contracts and fixtures.
- [ ] 2.6 Verify every catalogue, identity, reservation, and order-access scenario in this group through the Store backend and storefront feature lanes.

## 3. Payment and shipping projection

- [ ] 3.1 Make `A paid order reports payment separately from shipping`, `A partially fulfilled order shows every shipment`, and `Only carrier confirmation reports delivery` pass in the Store order projection.
- [ ] 3.2 Make `An invalid webhook changes nothing` and `A duplicate webhook is harmless` pass by verifying the raw-body HMAC and deduplicating accepted events.
- [ ] 3.3 Make `A missed webhook is repaired` pass through an on-read and scheduled reconciliation query to Shopify Admin.
- [ ] 3.4 Make `A staff refund is reflected in payment status` and `A customer cannot start a dispute or refund request` pass in Store order reads.
- [ ] 3.5 Verify every payment, refund, shipping, and authorization scenario in this group through Store backend, storefront, and admin feature lanes.

## 4. Delivery and review

- [ ] 4.1 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build` after the relevant Shopify, Store backend, storefront, and admin feature lanes pass.
- [ ] 4.2 Verify every scenario in this change, run `openspec validate add-grade10-shopify-store`, and run `openspec validate --specs`.
- [ ] 4.3 Review Shopify app scopes, webhook subscriptions, secret provisioning, cache invalidation, logging/redaction, and the verified checkout-return mechanism before staging deployment.
- [ ] 4.4 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-store/`, update the Grade10 foundation PRD if its recorded decision changed, and archive this change.
