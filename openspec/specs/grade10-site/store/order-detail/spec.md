# grade10-site/store/order-detail Specification

## Purpose

The customer order detail gives a signed-in collector one private account of a
Store order without revealing another customer's order or inventing absent facts.

## Feature set

- Private order access
  - Owner-only address: Show one order only to its associated collector.
  - Safe absence: Give missing and unowned ids the same answer.
- Order facts
  - Identity and money: Prefer the shop order number and keep every supplied money fact distinct.
  - Shipping and payment: Present buyer-safe settlement facts without filling gaps.
  - Fulfilment and tracking: Show current progress and safe carrier links.
  - Partial records: Omit facts the typed order does not provide.
- Page states
  - Loading and retry: Keep the address while the read settles or retries.

- Product pictures
  - Current product identity: Show supplied current product pictures on owned orders and valid private links.
  - Optional pictures: Keep purchase facts readable when picture data is absent or unavailable.

## Requirements

### Requirement: One private address shows one owned order

The Grade10 site SHALL serve an order at `/profile/orders/<order-id>`. It SHALL
show the order only when it belongs to the signed-in collector. A missing order
and an order owned by another account SHALL use the same not-found treatment and
SHALL NOT disclose whether the id exists. A collector without a decided session
SHALL remain at the requested address while the existing sign-in surface decides
the session.

<!-- trace:scenario id=g10.store-order-detail.SC-d26 rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-01 - An owner opens one order
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a signed-in collector who owns an order
- **WHEN** they open `/profile/orders/<order-id>` for it
- **THEN** that order's detail appears

<!-- trace:scenario id=g10.store-order-detail.SC-a2p rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-02 - Missing and unowned orders look the same
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a signed-in collector
- **WHEN** they open an unknown order id or an order id owned by another account
- **THEN** the same not-found treatment appears for either id
- **AND** the page does not say whether an order exists

<!-- trace:scenario id=g10.store-order-detail.SC-en3 rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-03 - A signed-out collector keeps the requested order address
**Serves:** grade10-site-store-order-detail-US-02 - Collector signs in to the requested order

- **GIVEN** a collector without a signed-in session
- **WHEN** they open `/profile/orders/<order-id>`
- **THEN** the sign-in surface opens without replacing that address
- **AND** a successful sign-in reads that order at the same address

### Requirement: The detail preserves the order facts the Store supplies

The page SHALL pass the customer-facing badge defined by
`grade10-site/commerce/order-status` to the detail block. It SHALL identify the
order by its Store-supplied shop order number when that value is present and
non-empty, otherwise by its Store order id. The immutable Store order id SHALL
remain the route key in either case. The page SHALL show the placed date,
available line items, fulfilment facts, and these money facts when present:

| Fact | Meaning |
| --- | --- |
| Quoted subtotal | What the Store quoted before the hosted checkout |
| Discount | What the settled order states was deducted as an order promo |
| Points credit | What the settled order states was paid with points, shown separately from Discount |
| Shipping charge | What the settled order states was charged for shipping |
| Tax | What the settled order states was charged as tax |
| Paid total | What the collector was charged after hosted shipping and tax |
| Refunded amount | What has been returned from the paid total |

Every amount SHALL remain integer minor units paired with its ISO 4217 currency
code until formatted. A supplied zero discount, shipping charge, or tax SHALL
render as a stated zero; a null value SHALL omit that row. Discount, points
credit, and refund values SHALL read as deductions without changing the paid
total. A points credit SHALL appear after Discount when both are present, SHALL
name the points deducted in its label, and SHALL use the same success-styled
money-credit treatment as the cart drawer. A line total SHALL be its captured
unit price multiplied by quantity.

The owner-only detail SHALL render the supplied shipping-address parts in postal
order and omit null or empty parts. A recipient name SHALL appear only when a
first or last name is supplied. The page SHALL NOT turn a shipping address into
a pickup address.

The owner-only detail SHALL render a supplied payment instrument only when at
least one displayable payment fact is present. A recognized card or wallet SHALL
use its corresponding logo. An unrecognized provider value SHALL remain visible
as text beside any supplied mask instead of receiving an unrelated logo. When a
wallet and masked number are both supplied, the wallet identity SHALL appear
beside that mask so the device-account digits are not presented as the card's.

The page SHALL NOT infer a payment method, address, discount, points credit,
shipping charge, tax, image, loyalty amount, or other missing value from
another fact.

<!-- trace:scenario id=g10.store-order-detail.SC-bjc rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-04 - A web order keeps quoted and paid totals distinct
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a web order quoted at 10000 minor units `HKD` and paid at 11200 minor units `HKD`
- **WHEN** its detail renders
- **THEN** the quoted subtotal shows 10000 minor units `HKD`
- **AND** the paid total shows 11200 minor units `HKD`

<!-- trace:scenario id=g10.store-order-detail.SC-0uc rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-05 - A partial refund stays distinct from the charge
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an order paid at 11200 minor units `HKD` and refunded by 2000 minor units `HKD`
- **WHEN** its detail renders
- **THEN** the paid total remains 11200 minor units `HKD`
- **AND** the refund shows 2000 minor units `HKD` separately

<!-- trace:scenario id=g10.store-order-detail.SC-3mi rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-06 - A point-of-sale order does not invent web fields
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a point-of-sale order with a paid total but no quoted subtotal or line items
- **WHEN** its detail renders
- **THEN** the paid total appears
- **AND** no zero subtotal, empty product row, payment method, or shipping address is invented

<!-- trace:scenario id=g10.store-order-detail.SC-6xb rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-07 - Unavailable optional facts are omitted
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an order with no payment method, address, discount, points credit, shipping charge, tax, image, or loyalty amount
- **WHEN** its detail renders
- **THEN** those sections or rows are omitted
- **AND** no placeholder is presented as a known order fact

<!-- trace:scenario id=g10.store-order-detail.SC-ik3 rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-17 - Points credit stays distinct from Discount
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an owned order with an order promo discount of 17700 minor units `HKD` and a points credit of 10000 minor units `HKD`
- **WHEN** its money summary renders
- **THEN** Discount and Points appear as separate deduction rows
- **AND** Points follows Discount
- **AND** the Points label names the 100 points deducted
- **AND** neither amount is folded into the other

<!-- trace:scenario id=g10.store-order-detail.SC-usm rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-18 - Points credit shows under either points title
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an owned order whose shop named its points discount "Points", for 10000 minor units `HKD` and 100 points
- **WHEN** its money summary renders
- **THEN** a Points row shows 10000 minor units `HKD`
- **AND** its label names the 100 points deducted, as it does for "Deduction from Points"

<!-- trace:scenario id=g10.store-order-detail.SC-ejb rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-19 - No points credit where the shop named no points discount
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an owned order whose points were debited, and whose discounts carry neither points title or are not named at all
- **WHEN** its money summary renders
- **THEN** no Points row appears

<!-- trace:scenario id=g10.store-order-detail.SC-7ci rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-13 - Customer-facing identity does not replace the route id
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an owned order with or without a non-empty Store-supplied shop order number
- **WHEN** its detail renders at `/profile/orders/<order-id>`
- **THEN** the shop order number identifies the order when supplied
- **AND** the Store order id identifies it otherwise
- **AND** the address continues to use the immutable Store order id

<!-- trace:scenario id=g10.store-order-detail.SC-gbw rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-14 - Supplied settlement rows preserve zero and absence
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** two equivalent orders where one supplies zero discount, shipping, and tax and the other supplies null for all three
- **WHEN** their money summaries render
- **THEN** the first order shows all three rows as stated zeroes
- **AND** the second order omits all three rows
- **AND** each paid total remains the charge

<!-- trace:scenario id=g10.store-order-detail.SC-cew rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-15 - A partial shipping address remains truthful
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an owned order with a shipping address whose recipient and optional address parts are absent
- **WHEN** its detail renders
- **THEN** the supplied non-empty address parts appear in postal order
- **AND** no blank recipient, placeholder line, or pickup address appears

<!-- trace:scenario id=g10.store-order-detail.SC-ik7 rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-16 - Payment identity remains truthful
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an owned order with a supplied card, wallet, or unrecognized payment provider
- **WHEN** its payment method renders
- **THEN** a recognized card or wallet uses its corresponding logo
- **AND** an unrecognized provider remains visible as text without an unrelated logo
- **AND** any wallet identity appears beside its supplied masked device-account number

### Requirement: Fulfilment and tracking use supplied order facts

The page SHALL show supplied fulfilment status and estimated delivery without
presenting an estimate as an event that already happened. Track Order SHALL
appear only for an absolute `https` carrier URL with no embedded credentials.
It SHALL open that URL in a new browser context isolated from the Grade10 page.
A carrier or tracking number alone SHALL NOT create a tracking action.

<!-- trace:scenario id=g10.store-order-detail.SC-4bj rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-08 - An estimate is not a completed milestone
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an order with an estimated delivery date and no completed delivery event
- **WHEN** its fulfilment detail renders
- **THEN** the date is identified as an estimate
- **AND** delivery is not presented as completed

<!-- trace:scenario id=g10.store-order-detail.SC-xz6 rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-09 - A safe carrier URL enables the detail action
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a fulfilment with an absolute `https` carrier URL carrying no credentials
- **WHEN** the order detail renders
- **THEN** Track Order appears
- **AND** activating it opens the carrier URL in a new browser context isolated from the Grade10 page

<!-- trace:scenario id=g10.store-order-detail.SC-2ah rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-10 - Unsafe tracking data creates no action
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a fulfilment with a carrier and tracking number but no safe carrier URL
- **WHEN** the order detail renders
- **THEN** Track Order does not appear

### Requirement: The detail distinguishes loading, failure, and not found

The page SHALL show a loading state until the first order read settles. A failed
read SHALL show a localized error and a retry action at the same address. A
successful null answer SHALL show the not-found treatment rather than a loading
or transport-error state.

<!-- trace:scenario id=g10.store-order-detail.SC-4lu rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-11 - The first read is still loading
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **WHEN** the first order read has not settled
- **THEN** the page shows a loading state and no not-found claim

<!-- trace:scenario id=g10.store-order-detail.SC-gzr rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-12 - A failed read can be retried
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** the order read failed
- **WHEN** the collector activates Retry
- **THEN** the page reads the same order again without changing its address

### Requirement: Current product pictures supplement accessible order details

Owned Order Details and valid private order links SHALL show each available
first current product picture beside its matching recorded item, including
purchases made before picture support. A later catalogue edit SHALL be
reflected when the order is read again. Pictures SHALL NOT replace recorded
titles, quantities, currency, prices, totals, status or tracking facts.

| Picture State | Required Outcome |
| --- | --- |
| Current first product picture available | Show it in the existing item frame |
| Catalogue alt text absent, empty or whitespace-only | Use the recorded item title as the image's accessible name |
| Meaningful catalogue alt text supplied | Preserve that accessible name |
| Product or picture unavailable | Keep the existing placeholder and purchase facts |
| Picture lookup fails | Record a diagnostic and keep the order detail and its actions usable |
| Image resource fails to load | Keep other order facts and actions usable |

Order item responses SHALL allow absent `imageSrc` and `imageAlt` fields.
When supplied, each field SHALL be a string. A compatible response without
picture fields SHALL remain readable with the existing placeholder.

Supplying pictures SHALL preserve the existing owner and private-link access
rules. A private link SHALL retain its existing account-data restrictions:
no Points row, Points to Earn, Points Earned, wallet or account details.
Unknown orders, unowned member reads and invalid private links SHALL disclose
no order picture or other order fact.

<!-- trace:scenario id=g10.store-order-detail.SC-lss rev=1 -->
#### Scenario: g10.store-order-detail.SC1 - Earlier owned orders show matching current pictures
**Serves:** g10.store-order-detail.US7 - the collector recognises the items on an earlier owned order

- **GIVEN** an earlier owned order with different recorded items and available current product pictures
- **WHEN** the collector opens its details
- **THEN** each item shows its own product's first current picture
- **AND** recorded titles, quantities, currency, prices, totals, status and tracking remain unchanged

<!-- trace:scenario id=g10.store-order-detail.SC-sdh rev=1 -->
#### Scenario: g10.store-order-detail.SC2 - Rereading an order reflects the current first picture
**Serves:** g10.store-order-detail.US7 - the collector recognises the items on an earlier owned order

- **GIVEN** a product's first picture changed after the collector last opened an earlier order
- **WHEN** the collector reads that order again
- **THEN** the item shows the new first current picture
- **AND** its recorded purchase facts remain unchanged

<!-- trace:scenario id=g10.store-order-detail.SC-dn2 rev=1 -->
#### Scenario: g10.store-order-detail.SC3 - Missing catalogue pictures preserve detail facts
**Serves:** `g10.store-order-detail.US7`, `g10.store-order-detail.US8` - owners and private-link holders recognise the recorded items

- **GIVEN** an accessible order with items whose products are removed, unpublished or supply no picture
- **WHEN** its details load successfully
- **THEN** affected items keep the existing placeholder beside their recorded facts
- **AND** supplied money, fulfilment and tracking remain readable

<!-- trace:scenario id=g10.store-order-detail.SC-ut1 rev=1 -->
#### Scenario: g10.store-order-detail.SC4 - Detail alt text falls back to the recorded title
**Serves:** `g10.store-order-detail.US7`, `g10.store-order-detail.US8` - owners and private-link holders recognise the recorded items

- **GIVEN** pictured items with absent, empty, whitespace-only or meaningful catalogue alt text
- **WHEN** the order details render
- **THEN** each blank alt uses that item's recorded title as the image's accessible name
- **AND** meaningful supplied alt text remains the accessible name

<!-- trace:scenario id=g10.store-order-detail.SC-3gw rev=1 -->
#### Scenario: g10.store-order-detail.SC5 - Picture lookup failure does not fail the order detail
**Serves:** `g10.store-order-detail.US7`, `g10.store-order-detail.US8` - owners and private-link holders recognise the recorded items

- **GIVEN** an accessible order's facts are readable but picture lookup fails
- **WHEN** its details load
- **THEN** affected items keep the existing placeholder beside unchanged purchase facts
- **AND** the detail and any valid tracking action remain usable
- **AND** the picture lookup failure has a diagnostic record

<!-- trace:scenario id=g10.store-order-detail.SC-yx8 rev=1 -->
#### Scenario: g10.store-order-detail.SC6 - Legacy responses preserve pictureless details
**Serves:** `g10.store-order-detail.US7`, `g10.store-order-detail.US8` - owners and private-link holders recognise the recorded items

- **GIVEN** a compatible order response without picture fields on its items
- **WHEN** the current application reads that response
- **THEN** Order Details renders the recorded items with the existing placeholder
- **AND** absent picture fields do not turn the successful read into an error

<!-- trace:scenario id=g10.store-order-detail.SC-4at rev=1 -->
#### Scenario: g10.store-order-detail.SC7 - Private links receive pictures without account facts
**Serves:** g10.store-order-detail.US8 - the link holder recognises a purchase without account access

- **GIVEN** a valid private link for an earlier guest or member order with an available current product picture
- **WHEN** a link holder who is not the signed-in owner opens it
- **THEN** the matching recorded item shows the same first current product picture as the owned detail
- **AND** no Points row, Points to Earn, Points Earned, wallet or account details appear
- **AND** the link does not grant account access or change order ownership

<!-- trace:scenario id=g10.store-order-detail.SC-na2 rev=1 -->
#### Scenario: g10.store-order-detail.SC8 - Pictures do not disclose inaccessible orders
**Serves:** `grade10-site-store-order-detail-US-01`, `g10.store-order-detail.US8` - the viewer meets the existing refusal without seeing purchase facts

- **GIVEN** an unknown order, an unowned member-order address or an invalid private link
- **WHEN** the viewer opens that address
- **THEN** the existing not-found treatment appears without an order picture
- **AND** no recorded order fact or existence claim is disclosed

<!-- trace:scenario id=g10.store-order-detail.SC-x4j rev=1 -->
#### Scenario: g10.store-order-detail.SC9 - Image resource failure preserves detail actions
**Serves:** `g10.store-order-detail.US7`, `g10.store-order-detail.US8` - owners and private-link holders recognise the recorded items

- **GIVEN** a supplied picture whose image resource fails to load
- **WHEN** an owner or valid private-link holder reads the order
- **THEN** the recorded purchase facts remain readable
- **AND** any valid tracking action remains usable
