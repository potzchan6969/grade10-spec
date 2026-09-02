# grade10-admin/auction/listing Delta

## ADDED Requirements

### Requirement: Listing editor exposes optional campaign selection

The Grade10 auction listing editor SHALL let an authorized operator pick at
most one **Campaign** for the listing, or clear the campaign so the listing
stands alone. The picker SHALL list only campaigns that are `draft` or
`created`. A `published` or `canceled` campaign SHALL NOT appear as a
selectable option. Operator-visible labels for this control SHALL say
**Campaign**, not **Sale**.

Selecting a campaign SHALL persist when the operator clicks explicit **Save**
alongside other catalogue fields. **`listings.create`** does not write campaign
or inventory fields — only verifies holds when product and quantity are set.
On an editable listing, **`listings.setAuction`** MAY attach or clear the
campaign after create. Clearing the campaign SHALL store no campaign.
Attaching a `published` or `canceled` campaign through the API SHALL be refused.

An operator who may catalogue a listing SHALL be able to set or clear the
campaign. The picker SHALL NOT block create or publish when no campaign is
chosen.

#### Scenario: Operator attaches a draft listing to a draft campaign

- **GIVEN** a draft listing and a draft campaign titled "September Slabs"
- **WHEN** an authorized operator selects that campaign in the listing
  editor and clicks Save
- **THEN** Grade10 stores the listing under that campaign
- **AND** the listing remains a draft

#### Scenario: Operator attaches a listing to a created campaign

- **GIVEN** a created listing and a created campaign
- **WHEN** an authorized operator selects that campaign in the listing
  editor and clicks Save
- **THEN** Grade10 stores the listing under that campaign

#### Scenario: Operator clears the campaign on a listing

- **GIVEN** a draft listing attached to a draft campaign
- **WHEN** an authorized operator clears the campaign in the listing editor
  and clicks Save
- **THEN** Grade10 stores the listing with no campaign
- **AND** the listing remains a draft

#### Scenario: Published and canceled campaigns are not offered in the picker

- **GIVEN** a published campaign, a canceled campaign, and a draft campaign
- **WHEN** an authorized operator opens the campaign picker on the listing
  editor
- **THEN** the draft campaign is offered
- **AND** the published campaign is not offered
- **AND** the canceled campaign is not offered

#### Scenario: Published campaign cannot receive a listing

- **GIVEN** a draft listing and a published campaign
- **WHEN** an authorized operator attempts to attach that campaign
- **THEN** Grade10 refuses the attach
- **AND** the listing’s campaign is unchanged

#### Scenario: Listing without a campaign still creates

- **GIVEN** a draft listing with every required create field set and no
  campaign
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing has no campaign

#### Scenario: Listing editor campaign field is labeled Campaign

- **GIVEN** an authorized operator on the listing editor
- **WHEN** they view the optional campaign control
- **THEN** the control is labeled Campaign
- **AND** it is not labeled Sale

### Requirement: Listing editor product selection uses inventory eligibility

The Grade10 auction listing editor SHALL let an authorized operator select
the catalogue **product** the listing reserves against from Grade10
inventory ([`add-grade10-inventory`](../../../../../add-grade10-inventory/proposal.md)).
The product picker SHALL list only inventory products whose **`status` is
`created`** (not `draft`) and that have **available greater than zero**.

A `draft` inventory product SHALL NOT appear in the picker. A `created`
product with zero available SHALL NOT appear unless it is the listing's
currently stored product and this listing already holds units of that product
(see effective-available save rule). Product ids that are not eligible SHALL
be refused on explicit draft-save. Create verifies an existing hold rather
than re-validating picker eligibility.

Campaign covers do **not** select a product — only listings do.

#### Scenario: Product picker omits draft inventory products

- **GIVEN** a draft inventory product with available stock and a created
  inventory product with available stock
- **WHEN** an authorized operator opens the product picker on the listing
  editor
- **THEN** the created product is offered
- **AND** the draft product is not offered

#### Scenario: Product picker omits out-of-stock inventory products

- **GIVEN** a created inventory product with available zero and another
  created inventory product with available at least one
- **WHEN** an authorized operator opens the product picker on the listing
  editor
- **THEN** the in-stock created product is offered
- **AND** the out-of-stock product is not offered

#### Scenario: Draft product id is refused on listing save

- **GIVEN** a draft listing and a draft inventory product id
- **WHEN** an authorized operator attempts to save that product id on the
  listing
- **THEN** Grade10 refuses the write
- **AND** the listing's product id is unchanged

#### Scenario: Out-of-stock product id is refused on listing save

- **GIVEN** a draft listing with quantity one and a created inventory
  product whose available is zero and no active hold for this listing
- **WHEN** an authorized operator attempts to save that product id on the
  listing
- **THEN** Grade10 refuses the save
- **AND** the listing's product id is unchanged

#### Scenario: Current product remains selectable when this listing holds the last units

- **GIVEN** a draft listing with an active inventory hold of quantity three
  on a created product whose global available is zero
- **WHEN** an authorized operator opens the product picker on that listing
- **THEN** the current product is offered
- **AND** other out-of-stock products are not offered

### Requirement: Listing editor saves catalogue fields only on explicit Save

The Grade10 auction listing editor SHALL NOT persist catalogue fields —
including **product**, **quantity**, and **campaign** — until an authorized
operator clicks an explicit **Save** control. Changing a field in the form
SHALL update local editor state only and SHALL NOT call `listings.saveDraft`,
inventory reserve, adjust, release, or product-change mutations.

Auto-save, debounced save, or save-on-blur for catalogue fields SHALL NOT
be used on the listing editor.

#### Scenario: Picking a product does not reserve stock until Save

- **GIVEN** a draft listing with no active inventory hold
- **WHEN** an authorized operator selects a created inventory product in the
  editor but has not clicked Save
- **THEN** Grade10 has not created an inventory reservation
- **AND** the listing's stored product id is unchanged

#### Scenario: Changing quantity does not adjust the hold until Save

- **GIVEN** a draft listing with an active inventory hold of quantity two
- **WHEN** an authorized operator changes quantity to five in the editor but
  has not clicked Save
- **THEN** the hold remains quantity two
- **AND** the listing's stored quantity is unchanged

### Requirement: Listing quantity defaults when a product is chosen

The listing editor SHALL expose a **quantity** field — a whole number from
**1 to 500**, the same bounds as inventory reservations.

When an operator selects a catalogue product and quantity is empty, the
editor SHALL default quantity to **1** in local form state. Quantity MAY
remain empty only while no product is selected.

On explicit Save with both **productId** and **quantity** set, Grade10 SHALL
synchronize inventory as defined below. Save with a product and no quantity
SHALL NOT create or change an inventory hold.

#### Scenario: Product selection defaults quantity to one in the form

- **GIVEN** a draft listing with no product selected and empty quantity
- **WHEN** an authorized operator selects a created inventory product
- **THEN** the editor shows quantity one in the form
- **AND** no inventory reservation exists until Save

### Requirement: Draft save synchronizes an active inventory reservation

When an authorized operator explicitly saves a draft listing with both
**productId** and **quantity** set, Grade10 SHALL synchronize inventory
**before** persisting the listing fields:

1. Validate the product is inventory **`status` `created`**. Refuse draft
   inventory products.
2. Compute **effective available** for the requested product: global
   `available` plus this listing's **remaining** on an active hold for the
   same product, if any. Refuse when requested quantity exceeds effective
   available.
3. If no active hold exists for this listing → call
   `AuctionInventoryService.reserve` with `holderReference` = listing id,
   the product, and quantity. The reservation SHALL be **`active`**.
4. If an active hold exists on the **same** product with a different
   quantity → call `adjustReservation` to the new quantity. Decreasing
   quantity SHALL decrease inventory **`reserved`** without increasing
   reservation **`released`**.
5. If an active hold exists on a **different** product → call
   `changeReservationProduct` on that reservation with the new product and
   quantity in one inventory transaction.
6. Persist listing **productId** and **quantity** only after inventory
   succeeds. On inventory refusal, listing fields SHALL be unchanged.

Clearing **productId** or **quantity** on Save SHALL release any active hold
for this listing (full release of remaining) before persisting the cleared
field(s).

#### Scenario: First explicit save with product and quantity reserves stock

- **GIVEN** a draft listing with no active inventory hold
- **AND** a created inventory product with available at least three
- **WHEN** an authorized operator sets product and quantity three and clicks
  Save
- **THEN** Grade10 creates an active reservation of quantity three keyed by
  the listing id
- **AND** the product's inventory **reserved** increases by three
- **AND** the listing stores product id and quantity three

#### Scenario: Save increases quantity adjusts the same reservation

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product A has available at least two
- **WHEN** an authorized operator changes quantity to five and clicks Save
- **THEN** the same reservation id stays active with quantity five
- **AND** product A **reserved** increases by two
- **AND** reservation **released** is unchanged

#### Scenario: Save decreases quantity frees stock without release counter

- **GIVEN** a draft listing with an active hold of quantity five
- **WHEN** an authorized operator changes quantity to two and clicks Save
- **THEN** the same reservation id stays active with quantity two
- **AND** inventory **reserved** decreases by three
- **AND** reservation **released** remains zero

#### Scenario: Save changes product moves the hold atomically

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product B is **created** with available at least three
- **WHEN** an authorized operator selects product B, keeps quantity three,
  and clicks Save
- **THEN** Grade10 moves the hold to product B with quantity three in one
  inventory transaction
- **AND** product A **reserved** decreases by three
- **AND** product B **reserved** increases by three
- **AND** the listing stores product B

#### Scenario: Save refused when quantity exceeds effective available

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product A available is one
- **WHEN** an authorized operator changes quantity to five and clicks Save
- **THEN** Grade10 refuses the save
- **AND** the hold and listing fields are unchanged

#### Scenario: Clearing product on Save releases the hold

- **GIVEN** a draft listing with an active hold on a product
- **WHEN** an authorized operator clears the product and clicks Save
- **THEN** Grade10 releases the hold
- **AND** inventory **reserved** decreases by the hold's remaining
- **AND** the listing stores no product id

#### Scenario: Clearing quantity on Save releases the hold

- **GIVEN** a draft listing with an active hold of quantity three
- **WHEN** an authorized operator clears quantity and clicks Save
- **THEN** Grade10 releases the hold
- **AND** inventory **reserved** decreases by three
- **AND** the listing stores no quantity

#### Scenario: Save with product but no quantity creates no hold

- **GIVEN** a draft listing with no active hold
- **WHEN** an authorized operator sets a created product but clears quantity
  and clicks Save
- **THEN** Grade10 persists the product id
- **AND** no inventory reservation is created

### Requirement: Create verifies an existing inventory hold

`listings.create` SHALL move a listing from **`draft`** to **`created`** only
when every other create requirement is met **and**, when the listing stores
both **productId** and **quantity**, an **active** inventory reservation
exists for that listing with the same product and quantity.

Create SHALL **not** call inventory reserve, adjust, or product-change
mutations. The operator MUST have saved the draft with product and quantity
first so the hold already exists.

#### Scenario: Create succeeds when hold matches saved product and quantity

- **GIVEN** a draft listing stored with product A and quantity three
- **AND** an active inventory hold of quantity three on product A for this
  listing
- **WHEN** an authorized operator creates the listing with every other
  required field set
- **THEN** Grade10 moves the listing to **created**
- **AND** the hold remains active with quantity three

#### Scenario: Create refused when no hold exists

- **GIVEN** a draft listing stored with product A and quantity three
- **AND** no active inventory hold for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

#### Scenario: Create refused when hold quantity mismatches

- **GIVEN** a draft listing stored with quantity five
- **AND** an active hold of quantity three for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

#### Scenario: Create refused when hold product mismatches

- **GIVEN** a draft listing stored with product B and quantity three
- **AND** an active hold of quantity three on product A for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

### Requirement: Product change warns before moving an existing hold

When an operator changes the catalogue **product** on a listing that already
has an **active** inventory reservation from a prior explicit Save, the
editor SHALL show a confirmation dialog before applying the new product to
local form state. The dialog SHALL state that confirming and clicking Save
will move the hold to the new product and free reserved stock on the prior
product.

The dialog SHALL NOT appear when:

- the listing has never had an active hold (first product selection on a
  new or never-saved draft), or
- the listing has no active hold (draft saved without product or quantity,
  or hold already released).

Canceling the dialog SHALL leave the selected product unchanged in the form.

#### Scenario: Product change prompts when a hold already exists

- **GIVEN** a draft listing with an active hold on product A from a prior Save
- **WHEN** an authorized operator selects product B in the picker
- **THEN** the editor shows a confirmation dialog that Save will move the
  hold to product B and free reserved stock on product A
- **AND** no inventory mutation runs until Save

#### Scenario: First product selection does not prompt

- **GIVEN** a draft listing with no active hold
- **WHEN** an authorized operator selects product A
- **THEN** no confirmation dialog is shown
- **AND** quantity defaults to one in the form

#### Scenario: Canceling the product-change dialog keeps the prior product

- **GIVEN** a draft listing with an active hold on product A
- **WHEN** an authorized operator selects product B and cancels the
  confirmation dialog
- **THEN** the form still shows product A
- **AND** the hold on product A is unchanged

### Requirement: Product-change save failure surfaces an editor error

When Save calls `changeReservationProduct` and inventory refuses — for example
insufficient stock on the new product, a draft target product, or quantity
below the settled floor — the listing editor SHALL show an operator-visible
error. The listing's stored **productId** and **quantity** SHALL remain the
values from before that Save attempt, and the hold on the prior product SHALL
be unchanged.

#### Scenario: Save shows error when new product has insufficient stock

- **GIVEN** a draft listing with an active hold on product A
- **AND** product B available is less than the requested quantity
- **WHEN** an authorized operator selects product B and clicks Save
- **THEN** Grade10 refuses the save
- **AND** the editor shows an error naming insufficient stock
- **AND** the listing still stores product A with the prior quantity
- **AND** the hold on product A is unchanged

### Requirement: Listing cancel releases inventory hold

When a listing is canceled through operator call-off or campaign fan-out,
Grade10 SHALL release any **active** inventory reservation for that listing
(full release of remaining) before or as part of the cancel transition.

#### Scenario: Cancel releases remaining stock

- **GIVEN** a created listing with an active hold of quantity three and
  remaining three
- **WHEN** an authorized operator cancels the listing
- **THEN** the reservation becomes **closed**
- **AND** inventory **reserved** decreases by three
- **AND** the listing moves to **canceled**

