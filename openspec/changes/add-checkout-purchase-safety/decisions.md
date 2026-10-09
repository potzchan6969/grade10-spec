# Decisions

## Goals

- **Published contract** - Deliver the durable requirement "A checkout intent is safe to repeat" in the store backend.
- **One payable invoice** - Keep one order and one payable invoice per purchase across repeated Pay, reload, lost answers, concurrent tabs and worker stops.

## Non-Goals

- **Frontend** - The drawer and order surfaces belong to `add-shopify-checkout-integration`; this change adds frontend work only where its backend contract requires it.
- **Operations** - No deployment, migration execution or provider change during planning.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does this work come from? | The backend guarantees moved out of `add-shopify-checkout-integration` on 2026-10-09 by @kinisworking ([Q24](../add-shopify-checkout-integration/decisions.md)) | Keeping them as unfinished groups in the frontend change |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/checkout` | Which backend design delivers reuse, terminal replay, concurrency and dispatch recovery, and who owns it? | |
