## Context

See [proposal.md](proposal.md) for the product reason and
[decisions.md](decisions.md) for the selected picture policy. Groups 1-6 in
[tasks.md](tasks.md) record the delivered customer pages and rich order facts.
The thumbnail extension adds optional display facts to that path.

The Grade10 routes compose `CustomerOrderHistory` and `CustomerOrderDetails`
through `@grade10/store-frontend/checkout`. `CheckoutApiService` decodes the
existing order schemas; its repository returns the decoded order directly.
The frontend `Order` model already carries shop identity, settlement, points
credit, address, payment and fulfilment facts. Its items and the wire's
`orderItemSchema` carry no images, and both pure page projections omit them.

`readOrderForBuyer` repairs one accessible order and calls
`toStoreOrdersForBuyer`. The list calls that batched projection without
repairing every order. `readOrderByLink` repairs an accessible order but calls
`toStoreOrder` directly, preserving the private link's distinct account-data
boundary. Admin order detail and card reads use `readForBuyer`; their preview
renders the same customer components. Existing repair, points, access and
Audit behavior stay in their current owners.

`ShopifyCatalog.getVariants` already returns each variant's product and first
product image. Its port accepts at most 250 IDs. An order list allows up to
100 orders, whose distinct line variants can exceed that ceiling. The shared
order blocks already accept `imageSrc` and `imageAlt`, render the existing
placeholder without a source, and leave image-resource errors to the browser.
Their address, payment and points contracts from the earlier groups are
already implemented.

## Goals / Non-Goals

**Goals:**

- Add current product pictures at the existing order-read boundary, including
  earlier orders, without storing a second purchase fact.
- Use one image enrichment for member, list, private-link and admin-preview
  reads, after their existing access checks.
- Keep order facts usable when this optional catalogue read fails.
- Keep frontend rendering testable through typed procedure fixtures.

**Non-Goals:**

- Changing order persistence, checkout validation, provider reconciliation,
  access policy, points entitlement or the shared blocks' design.
- Adding a cache, image snapshots, a dependency, metrics or a new admin flow.
- Mapping story-only line coupons, issues, promo codes, pickup facts or earned
  loyalty values without a corresponding typed order fact.

## Decisions

### Keep The Existing Page Boundaries

The [history](specs/grade10-site/store/order-history/spec.md) and
[detail](specs/grade10-site/store/order-detail/spec.md) requirements govern the
customer pages. Keep their session surfaces at `/profile/orders` and
`/profile/orders/:orderId`, `SessionDecided`, query-state branches, callbacks
and safe tracking helper. The routes own navigation and browser effects;
shared blocks receive props. A null owned-order answer remains not found.

Continue to derive the badge through `grade10-site/commerce/order-status`.
Use integer minor units before formatting. Display a non-empty shop order
number with Store-id fallback, while routes and actions keep the immutable
Store id. Existing settlement projections preserve null versus zero, separate
Points from Discount, and omit unsupported address or payment facts.
Recognized payment brands keep their logos; other supplied labels remain text.
Catalogue enrichment changes none of those mappings.

**Alternative rejected:** a second page adapter or a direct Shopify call from
the browser. Both duplicate the current feature boundary.

### Enrich Orders After Access And Repair

The picture requirements govern which image readers receive. Keep
`toStoreOrder` as the synchronous projection of recorded facts. Add a small
order-image service beside `readOrder.ts`, receiving the existing catalogue
port and already projected orders. It returns new orders with only optional
item-image fields added. It performs no database read or write.

- **Buyer and list reads** - `toStoreOrdersForBuyer` keeps its existing batched
  points projection, then enriches the complete result once. Do not invoke
  `readOrderForBuyer` per list row or add per-order catalogue reads.
- **Private links** - `readOrderByLink` enriches `[toStoreOrder(found)]` after
  existing link validation and repair. Do not replace it with the member
  projection: that would acquire member-only points facts. Keep the current
  link envelope and page-level account-data omissions. The retained legacy
  guest procedure receives images through its existing read path without
  changing its access policy.
- **Admin preview** - existing `admin.orders.get` and `admin.orders.card` use
  the enriched buyer projection. Keep the `store:read` grant, Audit behavior
  and card's removal of address and payment. Its customer preview receives
  the same picture props through the existing customer components; it adds
  no staff journey or read endpoint.
- **Transaction boundary** - finish the current database reads and repair
  transaction before calling the catalogue. No transaction or row lock spans
  image lookup. The helper adds no claim, due row, event or mutation.

**Alternative rejected:** cart review as an order-image helper. Its price,
currency, availability and quantity decisions would revalidate a historical
purchase. Read only the image-bearing variant data instead.

### Batch By Variant Identity

Collect valid `VARIANT_GID` values from all projected items, deduplicate them,
and skip the catalogue call when that set is empty. Lookup uses `variantId`:
a point-of-sale line can have a valid variant with an empty `productId`.
Reuse `chunk` from `@grade10/utils/batch` for batches of at most 250. Process
batches sequentially rather than starting one request per order or line.

Index returned non-null variants by their returned ID, independent of response
position. Copy only `variant.product.images[0]` to matching items. A missing,
unpublished or removed variant, absent first image, or blank image URL adds no
picture fields. Do not choose another variant image, reprice the line, require
current stock, replace its recorded title or fabricate items for an empty order.
A changed catalogue image is read again on the next order request; no cache or
persisted image is introduced.

The existing Shopify transport uses `fetchWithDeadline` and
`VENDOR_DEADLINE_MS`. Retain that aborting transport deadline. Bound the whole
optional enrichment wait to the same budget: before each batch, compute the
remaining time and use `beforeDeadline` around the signal-free catalogue port.
Do not launch more batches after budget expiry. Keep each completed batch's
results; uncompleted variants remain pictureless. The remaining transport call
may finish after the wait expires, but cannot mutate returned orders or launch
another batch.

For a refusal, thrown fault or timeout, log a bounded structured warning with
operation, failure kind and batch counts, then preserve the successful order
read. Do not log a private-link secret, receipt email, address, payment data or
raw provider body. Missing catalogue nodes are normal absence, not faults.
Continue other batches while budget remains. No retry loop or metric is added.

**Alternative rejected:** one unbounded `nodes` call or unlimited parallel
lookups. The former fails above the port ceiling; the latter magnifies an
optional display read into provider load.

### Forward Optional Props Through One Customer Projection

Extend `OrderItem` with the wire's optional string fields. Keep the direct
repository return and production decoding; no identity mapper is needed.
`toOrderHistorySummary` and `toOrderDetailsProjection` forward a non-blank
`imageSrc` unchanged and use the supplied non-blank alt text. Absent, empty or
whitespace-only alt text falls back to that item's recorded title. Check
blankness with trimming, without rewriting a valid URL or meaningful alt text.
Do not derive the history alt from its formatted `title × quantity` label.

Apply the fallback in the frontend even if backend enrichment omits blank alt
text. This covers compatible response fixtures and keeps repeated variants
with different recorded titles truthful. Without a source, omit picture props
and retain the existing frame. An image-resource failure changes neither order
query state nor purchase facts; no `onError` design is added.

**Alternative rejected:** changing the shared image renderers to repair missing
application props. The application owns these item facts; the blocks already
render them.

## Service Interfaces

| Processor | Fixed Input | Success | Faults And Side Effects |
| --- | --- | --- | --- |
| Order image enrichment | `{ catalog: ShopifyCatalog, orders: readonly StoreOrder[] }` | `StoreOrder[]`, preserving order and item sequence, with optional images on matching items | Refused, thrown or late catalogue results log and leave affected items pictureless; no database work |
| Buyer order projection | Existing commerce dependencies and complete `OrderWithItems[]` | Existing buyer facts followed by one page-wide image enrichment | Existing points/read faults retain their behavior; only image lookup is optional |
| Private-link projection | Existing accessible order, viewer and event-drain callback | Existing `OrderByLink` envelope, with enriched `order` from the non-member projection | Existing null/refusal and repair behavior; no member points lookup |

Identity flows through the existing session or link check, order repair and
repository read, then the image enrichment, output schema, production client
decoder, frontend domain item and customer projection. Admin permission and
Audit checks precede the same buyer read. No image request comes from a block.

For example, an earlier order line names variant
`gid://shopify/ProductVariant/41`, title `Recorded Card`, quantity 2 and unit
price 10000 minor units `HKD`. A current catalogue answer with first image
`https://cdn.example.test/card.jpg?v=7` adds that URL. A blank alt becomes
`Recorded Card` at presentation. A current title or price in that catalogue
answer replaces neither recorded value; the line total stays 20000 minor units
`HKD`. Reordered or null variant nodes cannot transfer another item's picture.

## API Contracts

| Order Item Field | Shape | Absence |
| --- | --- | --- |
| `imageSrc` | Optional string | Catalogue cannot supply a first product picture |
| `imageAlt` | Optional string | Catalogue supplies no non-blank alt text; frontend uses recorded title |

Add the fields with `Schema.optionalKey(Schema.String)` on `orderItemSchema`.
They flow through existing `orderSchema`, `orderListSchema`, `orderByLinkSchema`
and the admin card schema. There are no new input fields or endpoints.

Use the actual production decoders to prove legacy image-free responses remain
valid and enriched responses retain both fields on member, list, private-link
and admin paths. Exercise the previous schema against enriched responses to
prove older clients can discard unknown fields. `null` or non-string picture
fields are invalid under the new schema. Keep the saved prior schema in the
compatibility test rather than weakening the production schema.

## Risks / Trade-offs

- **[Risk] Optional image lookup delays a large order page.** - Deduplicate
  across its orders, cap batches at 250 and bound the enrichment wait.
- **[Risk] A catalogue failure hides the receipt.** - Catch only the optional
  enrichment boundary, log its failure and return existing purchase facts.
- **[Risk] Shared stories imply unavailable purchase data.** - Add only the
  approved image fields. Keep unsupported promo, pickup and loyalty values
  absent; keep named points allocations under the existing rule.
- **[Risk] Private links acquire account facts.** - Preserve their non-member
  projection, and compare the enriched envelope and rendered omissions in
  router and page tests. Keep all access and account-joining rules with
  `add-store-guest-checkout`.
- **[Risk] Contract decoding silently strips image fields.** - Assert raw
  output, output-schema decoding and the frontend decoder separately.
- **[Risk] A rendered image tag points at unusable bytes.** - Browser walks use
  controlled served assets and assert loaded dimensions, alongside unchanged
  facts and actions on resource failure.
- **[Risk] Current pictures differ from the purchase date.** - This is the
  selected product policy. No historical-image claim is made.

## Migration Plan

1. Reconcile the two product records with the settled picture decision and
   preserve their in-flight marks. No shared block contract change is needed
   for this extension; the earlier groups remain completed history.
2. Land optional wire and domain item types with old/new decoder proof.
3. Backend enrichment and frontend projections can then proceed independently
   against the contract and controlled fixtures. Reuse the current catalogue
   image selection; do not reopen the cart-thumbnail change's persistence rules.
4. Verify member list, owned detail, valid and rejected private links, and
   existing admin preview. Preserve the current shared submodule pin unless
   the accepted contract handoff requires its normal update.
5. Keep `add-store-order-status` as the status owner and the guest-checkout
   change as the link/account owner. No production operation is part of this
   planning work.
6. Optional fields allow backend and frontend rollout in either order after
   decoder checks. Reverting either application side returns affected views to
   their existing placeholders. There is no database migration or cache reset.
