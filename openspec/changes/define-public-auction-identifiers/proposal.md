**Author:** @htonyl - 2026-09-21

## Why

- **Shared reference** - Collectors, operators, Finance and support need one stable, readable reference for a listing, its winning order and payment records without exposing internal IDs or a sequential volume signal
- **Success** - More surfaces identify the same listing and order consistently, and bank-transfer proofs match without manual identifier clarification

## What Changes

- **Listing code** - Allocate one opaque, permanent 5-character Crockford Base32 code on the first saved draft. It starts with 2 letters, is unique and never reused, including after deletion
- **Public address** - **BREAKING**: append the lower-case code to the normalized listing-title slug. Public pages expose it only in the canonical address, not as a labelled field or code-only route
- **Admin and payment reference** - Show the code to authorized listing operators. After a winner exists, use the same code as the collector-facing payment reference across order, support and payment instructions; it is not a second public order ID
- **Slug helper** - Prefill the editable title-and-code slug, refresh only an untouched generated value after title edits, and check availability on Slug field exit. Retained completed, expired and unsold addresses still block reuse
- **Stripe matching** - Store the payment reference in Stripe metadata so reconciliation does not expose provider transaction IDs to collectors
- **Invoice and receipt IDs** - Build invoice IDs from the code plus issuance sequence. New receipts for finalized full or partial payments use the paid invoice payload plus an unpadded receipt sequence; historical receipt IDs remain unchanged
- **Private identifiers** - Keep database IDs, audit numbers and provider references separate from collector-facing identifiers
- **Legacy addresses** - This launches before auction listings reach production. Grade10 does not backfill codes, retain title-only legacy addresses, or redirect them; every production listing is first saved under this change

## Examples

| Record | Example | Use |
| --- | --- | --- |
| Listing code / payment reference | `LK423` | Admin listing screens; later winner order, support, payment instructions and Stripe metadata. The public address may end in `lk423`, without a separate code or order-ID field |
| Public invoice ID | `IN-LK42301` | First invoice for `LK423` |
| Reissued invoice | `IN-LK42302` | Next issuance for the same payment reference |
| First payment receipt | `RC-LK42301P1` | First receipt for `IN-LK42301` |
| Second payment receipt | `RC-LK42301P2` | Second receipt, for example after a partial first payment |

- **Code format** - The first 2 characters use `ABCDEFGHJKMNPQRSTVWXYZ`; the final 3 use `0123456789ABCDEFGHJKMNPQRSTVWXYZ`. `LK423` and `UY294` are valid
- **Allocation** - Derive a candidate from the system UUID with a keyed one-way function, for example HMAC-SHA256. Retry the 5-character projection against active and retained reservations because it can collide
- **Invoice format** - `IN-[CODE][SEQ]`, where `SEQ` starts at `01`, has at least 2 digits and continues after `99`
- **Receipt format** - `RC-[INVOICE_PAYLOAD]P[RECEIPT_SEQ]`, where `INVOICE_PAYLOAD` is the code and invoice sequence, such as `LK42301`; `[RECEIPT_SEQ]` starts at `1` for each invoice and is not padded
- **Receipt scope** - Only a finalized full or partial payment receives a new receipt ID. Refunds, reversals and voids issue none; historical `REC-...` receipts are retained unchanged; formal tax-receipt content remains separate
- **Provider reference** - Store Stripe's provider reference separately and use it only in authorized internal records and document filenames

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- **`grade10-site/auction/listing-page`** - Resolve the canonical lower-case code suffix without adding a labelled public code
- **`grade10-admin/auction/listing`** - Allocate the code on first draft save, prefill the slug and check it on field exit
- **`grade10-site/auction/winner-order`** - Carry the payment reference forward and define its invoice and receipt identifiers

## Impact

- **API and UI** - Listing and winner-order projections expose display identifiers; shared blocks consume them and never generate or infer them
- **Operations** - Admin listings, payment instructions, support, reconciliation, invoices, receipts and bank-transfer proof matching use the approved public values
- **Provider boundary** - Stripe metadata holds the payment reference; the Stripe provider reference stays internal
- **Existing IDs** - Internal IDs, audit numbering and provider references remain available only where authorized

## Follow-on Changes

- **Implementation** - Deliver the requirement delta, API projections and shared UI adoption from the approved formats

## Constraints

- **Cached previews** - A cached shared-link preview can persist. Grade10 does not guarantee a purge or regeneration; fresh pages and metadata omit private data and any separately labelled code

## References

- [Auction Listing · Listing Code](../../../docs/prds/products/grade10-site/auction/display.md#listing-code)
- [Post-Bidding](../../../docs/prds/products/grade10-site/auction/post-bidding.md)
