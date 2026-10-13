# Store Cart Thumbnails

The approved implementation brief, read on 2026-10-13, supports the picture extension in [Add Store Cart Thumbnails](../../openspec/changes/add-store-cart-thumbnails/proposal.md).

## Source

- **Brief** - `grade10/docs/temp/store-cart-thumbnails-implementation.md`, read on 2026-10-13
- **Approval** - the brief records approval on 2026-10-13, Pacific/Auckland; the author requested spec updates from that plan
- **Report** - blank cart picture boxes on the Pokemon collection at 541 x 741, although catalogue pictures exist for the reported Gengar VMAX and demo booster-box products
- **Evidence limit** - the brief records diagnosis, not an implemented fix or proof that those development products remain available

## Approved Scope

- **Selection** - first product picture, matching the collection card; preserve the catalogue URL and its query parameters
- **Read** - carry pictures through the existing batched live variant review, without another request per cart line
- **Display** - optional reviewed-line picture URL and alt text reach the existing shared cart item props
- **Fallback** - absent pictures use the existing placeholder; absent or empty alt text uses the item name
- **Storage** - keep cart intent free of picture metadata; reread the picture after reload
- **Compatibility** - old and enriched responses decode; picture absence changes no price, quantity, status or readiness
- **Ownership** - grade10 owns the runtime data flow; grade10-spec owns the shared contract and controlled-asset story coverage
- **Boundary** - no variant-specific selection, database migration, new dependency, shared UI redesign, checkout arithmetic change or production operation

## Planning Ownership

- **Change** - [Add Store Cart Thumbnails](../../openspec/changes/add-store-cart-thumbnails/proposal.md) owns the picture extension; [Add Store Cart Drawer UI](../../openspec/changes/add-store-cart-drawer-ui/proposal.md) retains the other drawer and pending-operation work
- **Signed-out policy** - transport compatibility checks do not change the existing member and guest cart journeys
- **Contract gap** - the shared renderer supports pictures, but its durable specification does not state that contract; the application change also excludes image enrichment. This spec extension makes the approved behavior explicit before implementation
