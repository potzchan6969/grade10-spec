# grade10-site/store/order-detail Specification

## Purpose

The customer order detail gives a signed-in collector one private account of a
Store order without revealing another customer's order or inventing absent
facts. It answers Store orders — online and counter purchases; a ticket order
placed on the ticketing platform is answered by that platform's own order
page, never this one.

## Feature set

- Private order access
  - Owner-only address: Show one order only to its associated collector.
  - Safe absence: Give missing and unowned ids the same answer.
- Order facts
  - Identity and money: Prefer the shop order number and keep every supplied money fact distinct.
  - Shipping and payment: Present buyer-safe settlement facts without filling gaps.
  - Fulfilment and tracking: Show current progress and safe carrier links.
  - Partial records: Omit facts the typed order does not provide.
  - Refunded units: Split a line into the units kept and the units a refund gave back.
  - Points to earn: Show what a member's order earns, and nothing where it earns none.
- Page states
  - Loading and retry: Keep the address while the read settles or retries.
- Product pictures
  - Current product identity: Show supplied current product pictures on owned orders and valid private links.
  - Optional pictures: Keep purchase facts readable when picture data is absent or unavailable.
- Refund reason retention
  - Source fidelity: Retain supplied refund-note text per refund through webhook and provider reads.
  - Replay-safe enrichment: Fill metadata on retries and historical reads without repeating settlement.
- Refund reason exposure
  - Direct optional text: Expose non-empty notes without approval or mapping; empty notes produce no reason.
  - Explicit attribution: Keep refunds separate and expose only known line associations.
- Existing boundaries
  - Private purchase data: Preserve owner/private-link authorization, plaintext semantics and erasure.
  - Backend scope: Add data only; preserve existing clients and financial behavior.

## Requirements

### Requirement: One private address shows one owned order

The Grade10 site SHALL serve an order at `/store/my-orders/<order-id>`. It SHALL
show the order only when it belongs to the signed-in collector. A missing order
and an order owned by another account SHALL use the same not-found treatment and
SHALL NOT disclose whether the id exists. A collector without a decided session
SHALL remain at the requested address while the existing sign-in surface decides
the session.

<!-- trace:scenario id=g10.store-order-detail.SC-d26 rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-01 - An owner opens one order
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a signed-in collector who owns an order
- **WHEN** they open `/store/my-orders/<order-id>` for it
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
- **WHEN** they open `/store/my-orders/<order-id>`
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
- **WHEN** its detail renders at `/store/my-orders/<order-id>`
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

### Requirement: Refunded units and earned points come from their records

A line a refund gave units back from SHALL show as two rows: the units kept,
priced as bought, then the units refunded, struck through, under a Refunded
label and `Refund issued on <date>`, the day the latest refund naming that line
was issued. A line refunded whole SHALL show its refunded row alone. A line no
refund named, or one named without a count, SHALL read as bought.

The owner-only detail SHALL show a points section when the order earns its
member points: Points to Earn until the order completes, with what the goods
still held earn at the member's tier now, and Points Earned once it completes,
with what its earns credited less any refund's claw-back. It SHALL show no
points section on a guest order, joined to an account or not; on an order
canceled or refunded in full; on an order whose goods still held earn nothing;
or when the loyalty programme does not answer. A private link SHALL show no
points section.

<!-- trace:scenario id=g10.store-order-detail.SC-wlp rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-20 - A partly refunded line shows the units kept and the units refunded
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an owned order for 3 units of one line at 10500 minor units `HKD`, and a refund issued on 20 October 2026 that named 1 of them
- **WHEN** its detail renders
- **THEN** one row shows 2 units totalling 21000 minor units `HKD`
- **AND** a second row shows 1 unit totalling 10500 minor units `HKD`, struck through, labelled Refunded, with `Refund issued on` that day

<!-- trace:scenario id=g10.store-order-detail.SC-yce rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-21 - A line refunded whole shows only its refunded row
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** an owned order whose single unit of a line a refund named
- **WHEN** its detail renders
- **THEN** that line shows one struck-through row labelled Refunded
- **AND** no row shows it as kept

<!-- trace:scenario id=g10.store-order-detail.SC-po8 rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-22 - A member's order shows the points it will earn
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a member's paid web order, not yet completed, whose goods still held earn 177 points at the member's tier
- **WHEN** its detail renders
- **THEN** a Points to Earn section shows +177 pts

<!-- trace:scenario id=g10.store-order-detail.SC-ccc rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-23 - A completed order shows the points it earned
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a member's completed order whose earn credited 200 points and whose later refund clawed back 40
- **WHEN** its detail renders
- **THEN** a Points Earned section shows +160 pts

<!-- trace:scenario id=g10.store-order-detail.SC-myz rev=1 -->
#### Scenario: grade10-site-store-order-detail-SC-24 - An order that earns nothing shows no points section
**Serves:** grade10-site-store-order-detail-US-01 - Collector inspects one owned order

- **GIVEN** a guest order joined to the member's account, an order canceled, or an order refunded in full
- **WHEN** its detail renders
- **THEN** no Points to Earn or Points Earned section appears

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

### Requirement: Refund metadata retains the supplied source facts

The Store SHALL retain refund identity, supplied note text, issue time and explicitly named source lines from verified refund deliveries and provider order reads, independently of whether money has settled. Capturing metadata SHALL NOT assert a payment, returned unit or stock effect. Refund identities SHALL remain the original source identities even where later money is recorded separately. A repeated delivery or provider read SHALL enrich the same refund, not append a duplicate.

A supplied non-empty source note SHALL be preserved exactly, including whitespace around meaningful text, line breaks, Unicode and system-written values. Absent note data SHALL preserve retained text. A canonical provider order read with a supplied note SHALL replace retained text, or clear it when null, empty or whitespace-only. A verified delivery SHALL fill an unknown note but SHALL NOT replace an already captured note, including an explicit empty answer from a canonical read. Canonical supplied line associations SHALL similarly replace previous associations; an omitted associations field SHALL preserve them, and a delivery SHALL fill only unknown associations. Concurrent canonical reads SHALL use the existing serialized read claim; no source-version ordering is promised where the provider supplies no revision.

<!-- trace:scenario id=g10.store-order-detail.SC-qhz rev=1 -->
#### Scenario: g10.store-order-detail.SC10 - Settled refund notes survive both ingestion arms
**Serves:** Refund reason retention - the Store retains the explanation a later collector detail read can return

- **WHEN** the Store receives a verified settled-refund delivery or reads the same refund from its provider
- **THEN** the original refund identity, exact supplied non-empty note, issue time and explicit line associations are retained
- **AND** the financial settlement follows its existing rules

<!-- trace:scenario id=g10.store-order-detail.SC-sx2 rev=1 -->
#### Scenario: g10.store-order-detail.SC11 - Pending and restock-only notes do not manufacture settlement
**Serves:** Refund reason retention - the Store keeps source explanations without claiming money has moved

- **GIVEN** a provider refund whose money remains pending, or a restock-only refund with no refund transaction
- **WHEN** its verified delivery or provider read supplies a non-empty note
- **THEN** the metadata is retained even if the financial path excludes that refund
- **AND** metadata capture changes no refund money, points, returned quantities, stock or order status

<!-- trace:scenario id=g10.store-order-detail.SC-mne rev=1 -->
#### Scenario: g10.store-order-detail.SC12 - Money dedupe does not skip metadata enrichment
**Serves:** Refund reason retention - an earlier order gains a retained explanation without another settlement

- **GIVEN** refund money has already been recorded, including an order with older unkeyed financial history
- **WHEN** a retry, canonical provider read or explicit metadata replay supplies missing refund metadata
- **THEN** that metadata is retained under the original refund identity
- **AND** financial events, refund totals, points and stock remain unchanged
- **AND** repeating the input creates no duplicate refund metadata

<!-- trace:scenario id=g10.store-order-detail.SC-h1q rev=1 -->
#### Scenario: g10.store-order-detail.SC13 - A canonical correction survives delayed delivery
**Serves:** Refund reason retention - the Store preserves the provider read answer when old deliveries recur

- **GIVEN** one refund whose retained note is A
- **WHEN** a serialized canonical provider read supplies note B and an older verified delivery later supplies A
- **THEN** B remains the retained reason
- **AND** a later input omitting the note changes neither B nor its known associations

<!-- trace:scenario id=g10.store-order-detail.SC-kou rev=1 -->
#### Scenario: g10.store-order-detail.SC14 - Canonical empty clears while omission preserves
**Serves:** Refund reason retention - the Store distinguishes an unanswered field from an explicitly empty answer

- **GIVEN** a refund with a retained reason and explicit source lines
- **WHEN** a canonical provider read supplies a null, empty or whitespace-only note and omits associations
- **THEN** no reason is returned for that refund and its explicit source lines remain
- **AND** a later delivery cannot restore the earlier note
- **AND** omitting a note in a later provider read does not change that answer

### Requirement: Retained refund records expose optional reasons and precise attribution

Authorized detail responses SHALL allow the additive optional refund-record collection below. A response without the collection SHALL remain compatible; an empty collection SHALL mean no metadata is retained. Collection presence SHALL NOT assert that refund money has settled.

| Field | Required meaning |
| --- | --- |
| Refund identity | Original source refund identity, unique within the order; separate refunds remain separate. |
| Issue time | Optional supplied issue time, absent when unknown; never a fabricated occurrence. |
| Reason | Optional plain-text non-empty source string, preserved exactly; absent for missing, null, empty, whitespace-only or erased notes. |
| Source lines | Null when unavailable, an empty array when explicitly no lines, otherwise the exact source line identities and stated quantities; quantity is a non-negative integer or null when unstated. |
| Known variant | Optional per-source-line variant derived only from an exact known source line of that order; absent when unresolved. |

The collection SHALL sort by issue time ascending, unknown issue times last, then source refund identity ascending for ties. A reason SHALL be associated only with the source lines its own refund explicitly names. A refund naming no lines SHALL remain at refund level; an unresolved line identity SHALL remain explicit without inventing a variant. Notes SHALL NOT be copied to unrelated items or merged merely because refunds share a variant.

<!-- trace:scenario id=g10.store-order-detail.SC-bxr rev=1 -->
#### Scenario: g10.store-order-detail.SC15 - Several refunds keep their text and explicit lines
**Serves:** grade10-site-store-order-detail-US-01 - the collector can retrieve distinct reasons for the actual refunded lines

- **GIVEN** two refunds with different reasons, one naming source line L1 and the other naming L2, where both lines can have the same variant
- **WHEN** an authorized order detail is read
- **THEN** two distinct refund records retain their own exact reasons and named source line identities and quantities
- **AND** neither reason is copied to the other line or another item

<!-- trace:scenario id=g10.store-order-detail.SC-y9x rev=1 -->
#### Scenario: g10.store-order-detail.SC16 - Unattributed refunds remain refund-level facts
**Serves:** grade10-site-store-order-detail-US-01 - the collector receives only attribution the source actually supplies

- **GIVEN** refunds with no named lines, unavailable associations, or a named source line the Store cannot resolve
- **WHEN** an authorized order detail is read
- **THEN** each note remains on its own refund record
- **AND** explicitly no lines remains an empty collection, unavailable attribution remains null, and an unresolved line retains its source identity without an invented variant

<!-- trace:scenario id=g10.store-order-detail.SC-4bo rev=1 -->
#### Scenario: g10.store-order-detail.SC17 - Literal source text has no content classification
**Serves:** grade10-site-store-order-detail-US-01 - the collector can retrieve the supplied reason as data

- **WHEN** an authorized detail reads retained notes containing surrounding whitespace, line breaks, Unicode, markup-looking text or a system idempotency value
- **THEN** every non-empty reason is returned literally as plain-text data
- **AND** no classification, rewriting, translation or approval is required
- **AND** empty or whitespace-only notes provide no reason

<!-- trace:scenario id=g10.store-order-detail.SC-6ot rev=1 -->
#### Scenario: g10.store-order-detail.SC18 - Multiple refund ordering is deterministic
**Serves:** grade10-site-store-order-detail-US-01 - the collector receives a stable sequence on repeat reads

- **GIVEN** retained refunds with different, tied and unknown issue times
- **WHEN** the same authorized detail is read repeatedly without new facts
- **THEN** records are ordered by known issue time ascending, unknown times last, and original refund identity ascending for ties
- **AND** the order remains identical regardless of ingestion order

### Requirement: Existing authorized detail reads carry retained reasons

The existing detail read flow SHALL extend as follows:

1. Apply the existing owner or private-link authorization before reading or repairing refund metadata.
2. Use retained metadata and the existing eligible provider-repair path; a missing note SHALL NOT turn a successful order read into failure.
3. Return the refund records to the owner and to the valid private-link holder without new access grants or account facts on the private-link answer.

Older responses without refund metadata SHALL remain usable. Earlier orders SHALL acquire only metadata the source actually supplies through existing eligible reads or an explicitly invoked metadata replay; the Store SHALL NOT invent reasons or require a completed historical backfill before an order is readable. This backend change SHALL NOT require a frontend, layout or shared UI change.

<!-- trace:scenario id=g10.store-order-detail.SC-gnm rev=1 -->
#### Scenario: g10.store-order-detail.SC19 - Owners and valid links receive matching reasons
**Serves:** grade10-site-store-order-detail-US-01 - the existing permitted readers receive the same supplied refund explanation

- **GIVEN** an order with retained refund metadata
- **WHEN** its owner or a valid private-link holder reads its detail through the existing interface
- **THEN** the answer includes the same refund records and reasons
- **AND** the private-link answer continues excluding account and loyalty facts

<!-- trace:scenario id=g10.store-order-detail.SC-e8r rev=1 -->
#### Scenario: g10.store-order-detail.SC20 - Denied detail reads disclose no refund metadata
**Serves:** grade10-site-store-order-detail-US-01 - a viewer outside the existing order boundary gains no purchase facts

- **WHEN** a viewer uses an unknown order id, an unowned member-order address or an invalid private link
- **THEN** the existing refusal occurs without refund metadata or an order-existence disclosure
- **AND** metadata enrichment is not attempted before authorization

<!-- trace:scenario id=g10.store-order-detail.SC-idf rev=1 -->
#### Scenario: g10.store-order-detail.SC21 - Historical missing metadata preserves usable order facts
**Serves:** grade10-site-store-order-detail-US-01 - the collector can still read an earlier order before its metadata is available

- **GIVEN** an earlier order with no retained notes or a provider read that fails to supply them
- **WHEN** its authorized detail is read
- **THEN** its existing readable purchase facts remain available without an invented reason
- **AND** an otherwise compatible response omitting the new collection remains valid
- **AND** later successful metadata-only replay can fill supplied reasons without replaying financial effects

### Requirement: Refund reason text stays within the existing erasure boundary

Refund reason text SHALL be private purchase data under the existing order access and person-erasure scope. Erasure SHALL clear retained reason text and durably prevent subsequent retries, provider reads and metadata replay from restoring it, including when erasure races an ingestion. It SHALL preserve the financial record. Raw reason text SHALL NOT be added to logs or analytics.

<!-- trace:scenario id=g10.store-order-detail.SC-46a rev=1 -->
#### Scenario: g10.store-order-detail.SC22 - Erasure wins against replay and concurrent ingestion
**Serves:** Existing boundaries - the existing erasure journey removes retained private text durably

- **GIVEN** orders in the existing person-erasure scope with retained notes
- **WHEN** erasure runs, including concurrently with refund metadata ingestion
- **THEN** every such retained reason is cleared and subsequent verified deliveries, provider reads and metadata replay cannot restore its text
- **AND** financial facts survive unchanged
- **AND** metadata diagnostics and analytics contain no raw reason text
