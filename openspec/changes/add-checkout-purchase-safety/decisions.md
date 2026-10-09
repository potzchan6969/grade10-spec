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
| Q2 | Which backend design delivers reuse, terminal replay, concurrency and dispatch recovery, and who owns it? | Deferred to the awaiting planning artifacts in `.openspec.yaml`. The 2026-10-10 case handoff carries the published requirement unchanged; it chooses no backend design, delivery order or owner | Settling backend design during a case handoff |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/checkout` | Which backend design delivers reuse, terminal replay, concurrency and dispatch recovery, and who owns it? | Q2 |

## Planning Status

- **Case handoff** - The owner requests active backend safety drafts with their IDs and traces preserved on 2026-10-10. Frontend acceptance retains the published safety assertions.
- **Backend design** - Scope, delivery order and owner remain awaiting artifacts in `.openspec.yaml`. This case handoff settles none of them.
