## 1. Earn on completion (grade10)

- [x] 1.1 A web order earns once, when the store first reads it complete, on its qualifying goods less the goods refunded before then (`services/orders/completion.ts`)
- [x] 1.2 Tests: a refund before completion claws back nothing and the completion earns on the goods left (`grade10-site-loyalty-programme-SC-256`), and an order that earned at payment under the old rule earns nothing again when it completes (`grade10-site-loyalty-programme-SC-257`), in `commerceRefund.ts`
- [x] 1.3 Tests: Order Details names no points for an order canceled or refunded in full (`grade10-site-loyalty-programme-SC-258`), in `projections.test.ts`
- [x] 1.4 Verify: the store database lane's refund suite and the storefront projection tests

## 2. The contract (grade10-spec)

- [x] 2.1 The programme's delta states the earn's trigger, and the durable spec carries it
