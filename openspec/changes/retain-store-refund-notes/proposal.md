**Author:** @kinisworking - 2026-11-02

## Why

Collectors can read a refund amount and affected units but the backend discards the refund note explaining it. Retaining that note lets a later frontend show the supplied reason. Success means every received non-empty note on a supported refund is durably retrievable through its authorised order-detail read without repeating a financial effect.

## What Changes

- **Retained refund reasons** - preserve each incoming Shopify refund note and its refund identity through webhook and provider-read ingestion.
- **Direct exposure** - owner and valid private-link order reads return non-empty notes as plain-text refund reasons, without approval, rewriting or reason-code mapping; empty notes provide no reason.
- **Faithful associations** - keep multiple refunds separate and associate reasons only with lines the refund actually names; notes without lines stay at refund level.
- **Safe enrichment** - retries, reconciliation and metadata backfill preserve money, points and stock behavior; reason text stays within the existing order access and erasure boundaries.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/store/order-detail`: backend persistence and authorised exposure of refund reasons.

## Impact

- **Product record** - [Order Details](../../../docs/prds/products/grade10-site/store/order-detail.md#items).
- **Application repository** - `grade10`: Store contracts, Shopify adapters, refund services, persistence, erasure and order-detail routers; generated migrations for both Store deployment schemas where shared.
- **Consumers** - additive Store customer API data for the Grade10 site; shared UI exports and rendering stay unchanged.
- **Evidence** - inspected application `origin/main` at `453163418c`: Shopify parser already carries notes, adapters drop them, and Shopify refund creation uses note as an idempotency key. The user's 2026-11-02 instruction selects direct exposure despite that earlier approval proposal.

## Follow-on changes

- Show a supplied refund reason on Order Details, leaving no reason text when the note is empty.
