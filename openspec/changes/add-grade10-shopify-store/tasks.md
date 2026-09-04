# Tasks: Shopify-backed Grade10 Store

## 1. Shopify contracts and feasibility (grade10) (owner: @kinisworking)

- [x] 1.1 Define the Storefront catalogue/variant availability outcomes and the Admin customer, draft-order reservation, order-payment, fulfilment, and tracking outcomes using the pinned Shopify API version.
- [x] 1.2 Make `A paid buyer lands on their Grade10 order` pass against the selected Shopify plan and enabled checkout capabilities, proving the post-payment return mechanism before dependent checkout work begins.
- [x] 1.3 Make `Integration configuration is incomplete` pass for the shop domain, API version, Storefront token, Admin token/scopes, checkout-return capability, and webhook secret, exposing no credential to a browser.
- [x] 1.4 Verify transport fixtures identify a failed Shopify operation and keep business outcomes typed.

## 2. Catalogue, identity, and checkout (owner: @kinisworking)

Task 2.5 depends on the contracts in group 1; it uses fixtures rather than a running backend.

- [x] 2.1 Make `A shopper browses a current Shopify catalogue` and `Shopify catalogue data is unavailable` pass through the Store public catalogue contract.
- [x] 2.2 Make `A Shopify product change invalidates browsing data` pass with tagged cache invalidation and bounded expiry.
- [x] 2.3 Make `A shopper checks out signed in` and `A guest receives a linked Grade10 account after payment` pass through the Grade10 session and one-to-one Shopify customer association behavior.
- [x] 2.4 Make `Checkout uses live Shopify price and inventory`, `An item that sold out before payment is named`, `Backorders are refused`, and `A retry returns one checkout handoff` pass with one local order and one Shopify draft order.
- [x] 2.5 Make `A checkout URL is safe to follow`, `A permanent order URL requires its account`, and `An account lists its orders` pass in the Grade10 storefront against Store contracts and fixtures, composing the filled, section-omitted, empty, and tracking states in `ui-design.md`.
- [x] 2.6 Verify every catalogue, identity, checkout, and order-access scenario in this group through the Store backend and storefront feature lanes.

## 3. Payment and shipping projection (grade10) (owner: @kinisworking)

- [ ] 3.1 Make `A paid order reports payment separately from shipping`, `A partially fulfilled order shows every shipment`, and `Only carrier confirmation reports delivery` pass in the Store order projection.
- [ ] 3.2 Make `An invalid webhook changes nothing` and `A duplicate webhook is harmless` pass by verifying the raw-body HMAC and deduplicating accepted events.
- [ ] 3.3 Make `A missed webhook is repaired` pass through an on-read and scheduled reconciliation query to Shopify Admin.
- [ ] 3.4 Make `A staff refund is reflected in payment status` and `A customer cannot start a dispute or refund request` pass in Store order reads.
- [ ] 3.5 Verify every payment, refund, shipping, and authorization scenario in this group through Store backend, storefront, and admin feature lanes.

## 4. Delivery and review (grade10)

- [ ] 4.1 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build` after the relevant Shopify, Store backend, storefront, and admin feature lanes pass.
- [ ] 4.2 Verify every scenario in this change, run `openspec validate add-grade10-shopify-store`, and run `openspec validate --specs`.
- [ ] 4.3 Review Shopify app scopes, webhook subscriptions, secret provisioning, cache invalidation, logging/redaction, and the Continue shopping return before staging deployment.
- [ ] 4.4 Record the staging rollout evidence needed by the documentation and archive handoff without checking off implementation tasks before the relevant code is deployed.
- [ ] 4.5 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-store/`, update the Grade10 foundation PRD if its recorded decision changed, and archive this change.

## 5. Documentation and archive handoff

This group follows the deployed Grade10 implementation; it does not authorize
product-code changes in the spec store.

- [ ] 5.1 Make `An account lists its orders` pass in `manual/products/grade10-store/orders.md` by documenting the shipped Shopify-backed order history, authenticated access, Active/Past behavior, empty state, and the filled/empty Figma references.
- [ ] 5.2 At archive time, carry this delta's `## Feature set` and `## User journeys` into `openspec/specs/grade10-store/shopify-commerce/spec.md`, update the Grade10 foundation PRD only if its recorded decision changed, and preserve every journey id.
- [ ] 5.3 Verify the manual and archive handoff with `pnpm check:manual` and `pnpm run archive:preflight add-grade10-shopify-store --deployed-at <deployed-sha> --journeys-copied`.
