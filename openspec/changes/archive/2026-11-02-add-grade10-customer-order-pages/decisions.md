## Goals

- Give collectors private order history and details using supplied purchase facts.
- Keep the original page composition, settlement breakdown and tracking scope.
- Help collectors recognise purchased products through current catalogue pictures.
- Cover earlier purchases, member pages, private links and the existing customer preview.
- Keep purchase facts readable when picture lookup fails or supplies no image.

## Non-Goals

- Purchase-time image snapshots, image hosting, a picture cache or database migration.
- Variant-specific picture selection or a new production dependency.
- Deployment, production-data operations or environment setup.
- Backend changes beyond supplying optional pictures on existing order reads.
- Changes to checkout, cart, discounts, tax, payments, refunds, returns or order status.
- New admin workflows or changes to who may read an order or its account facts.
- Shared block redesign, new tokens, exports, copy or image-error treatment.
- Customer cancellation, returns, address editing or a secondary status-note slot.
- Inventing absent payment, address, loyalty, pickup or purchase facts.
- Changing the cart's applied Points label to include its points count.

## Decisions

These rows record the thumbnail recommendation the user selected for planning
on 2026-10-22. They extend the original proposal; they do not reconstruct its
earlier interview. Existing order, guest-link and points decisions retain
their owners in the related changes named by the proposal.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which image identifies a purchased product? | The first current product picture, matching cart behavior, including on earlier purchases (recommended). Later catalogue edits can change that picture. | Purchase-time snapshots; they require storage and do not repair earlier orders by themselves. |
| Q2 | What if the catalogue supplies no picture or cannot be read? | Keep the existing placeholder and readable order facts. Picture lookup failure is logged without failing the order read (recommended). | Refusing the whole order read or treating missing pictures as missing purchases. |
| Q3 | Which readers receive the picture? | My Orders, owned details, valid private links and the existing admin customer preview (recommended). Existing authorization and private-link account-data restrictions remain. | Updating only the two member page mappings and leaving sibling reads without pictures. |
| Q4 | Does catalogue enrichment replace purchase facts? | Only image display facts are added. Recorded title, quantity, currency, prices, totals, status and tracking remain unchanged (recommended). | Reusing cart validation to reprice or reject historical purchases. |
| Q5 | What if alt text is blank or a response predates picture fields? | Use the recorded item title for absent, empty or whitespace-only alt text; responses without pictures keep the placeholder (recommended). | Empty accessible names, invented copy or a required field that rejects older responses. |
| Q6 | Does this add image rendering or image-error states? | Reuse existing order blocks, frames and browser image presentation. An image resource failure leaves the rest of the order usable. | Redesigning shared image fallback behavior within a data-supply change. |
| Q7 | Which active change owns this extension? | Extend the original order-pages change. Its member-page composition remains here; guest-link access and account joining remain in add-store-guest-checkout. | A competing change declaring the same unpublished order-page capabilities. |
| Q8 | Does malformed optional picture metadata weaken order-response validation? | Malformed upstream catalogue metadata is an optional lookup failure under Q2. Supplied order picture fields remain optional strings; null or non-string values still fail typed response validation - decided by the round. Sources: the site picture requirements, [API Contracts](tech-design.md#api-contracts) and task 8.1. | Silently accepting an invalid typed order payload; the recommendation to discard bad metadata applies before the order response is produced. |
| Q9 | Does one failed catalogue batch discard successful pictures? | Keep completed successful batches and leave unresolved items pictureless - decided by the round. Sources: Q1/Q2, [Batch By Variant Identity](tech-design.md#batch-by-variant-identity) and tasks 9.1/9.2. | Dropping available pictures because a different optional lookup failed. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/order-history; grade10-site/store/order-detail | QA1: If optional image facts are malformed in an otherwise valid order response, should only the picture be discarded or should the response fail validation? recommended: discard unusable picture facts. Q5 settles absent fields and blank alt text, but not malformed supplied facts. | Q8 |
| grade10-site/store/order-history; grade10-site/store/order-detail | QA1: When one catalogue batch fails and another supplies pictures, must successful pictures remain? recommended: retain successful pictures and use placeholders only for unresolved items. | Q9 |
