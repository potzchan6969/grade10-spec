## Purpose

The customer order detail gives a signed-in collector one private account of a
Store order without revealing another customer's order or inventing absent facts.

## Feature set

- Private order access
  - Owner-only address: Show one order only to its associated collector.
  - Safe absence: Give missing and unowned ids the same answer.
- Order facts
  - Items and money: Keep quoted, paid, and refunded amounts distinct.
  - Fulfilment and tracking: Show current progress and safe carrier links.
  - Partial records: Omit facts the typed order does not provide.
- Page states
  - Loading and retry: Keep the address while the read settles or retries.

## ADDED Requirements

### Requirement: One private address shows one owned order

The Grade10 site SHALL serve an order at `/store/orders/<order-id>`. It SHALL
show the order only when it belongs to the signed-in collector. A missing order
and an order owned by another account SHALL use the same not-found treatment and
SHALL NOT disclose whether the id exists. A collector without a decided session
SHALL remain at the requested address while the existing sign-in surface decides
the session.

#### Scenario: grade10-site-store-order-detail-SC-01 - An owner opens one order

- **GIVEN** a signed-in collector who owns an order
- **WHEN** they open `/store/orders/<order-id>` for it
- **THEN** that order's detail appears

#### Scenario: grade10-site-store-order-detail-SC-02 - Missing and unowned orders look the same

- **GIVEN** a signed-in collector
- **WHEN** they open an unknown order id or an order id owned by another account
- **THEN** the same not-found treatment appears for either id
- **AND** the page does not say whether an order exists

#### Scenario: grade10-site-store-order-detail-SC-03 - A signed-out collector keeps the requested order address

- **GIVEN** a collector without a signed-in session
- **WHEN** they open `/store/orders/<order-id>`
- **THEN** the sign-in surface opens without replacing that address
- **AND** a successful sign-in reads that order at the same address

### Requirement: The detail preserves the order facts the Store supplies

The page SHALL pass the customer-facing badge defined by
`grade10-site/store/order-status` to the detail block. It SHALL show the order
id, placed date, available line items, fulfilment facts, and these money facts
when present:

| Fact | Meaning |
| --- | --- |
| Quoted subtotal | What the Store quoted before the hosted checkout |
| Paid total | What the collector was charged after hosted shipping and tax |
| Refunded amount | What has been returned from the paid total |

Every amount SHALL remain integer minor units paired with its ISO 4217 currency
code until formatted. A line total SHALL be its captured unit price multiplied
by quantity. The page SHALL NOT infer a payment method, address, discount,
shipping charge, tax, image, or loyalty amount from another fact.

#### Scenario: grade10-site-store-order-detail-SC-04 - A web order keeps quoted and paid totals distinct

- **GIVEN** a web order quoted at 10000 minor units `HKD` and paid at 11200 minor units `HKD`
- **WHEN** its detail renders
- **THEN** the quoted subtotal shows 10000 minor units `HKD`
- **AND** the paid total shows 11200 minor units `HKD`

#### Scenario: grade10-site-store-order-detail-SC-05 - A partial refund stays distinct from the charge

- **GIVEN** an order paid at 11200 minor units `HKD` and refunded by 2000 minor units `HKD`
- **WHEN** its detail renders
- **THEN** the paid total remains 11200 minor units `HKD`
- **AND** the refund shows 2000 minor units `HKD` separately

#### Scenario: grade10-site-store-order-detail-SC-06 - A point-of-sale order does not invent web fields

- **GIVEN** a point-of-sale order with a paid total but no quoted subtotal or line items
- **WHEN** its detail renders
- **THEN** the paid total appears
- **AND** no zero subtotal, empty product row, payment method, or shipping address is invented

#### Scenario: grade10-site-store-order-detail-SC-07 - Unavailable optional facts are omitted

- **GIVEN** an order with no payment method, address, discount, shipping charge, tax, image, or loyalty amount
- **WHEN** its detail renders
- **THEN** those sections or rows are omitted
- **AND** no placeholder is presented as a known order fact

### Requirement: Fulfilment and tracking use supplied order facts

The page SHALL show supplied fulfilment status and estimated delivery without
presenting an estimate as an event that already happened. Track Order SHALL
appear only for an absolute `https` carrier URL with no embedded credentials.
It SHALL open that URL in a new browser context isolated from the Grade10 page.
A carrier or tracking number alone SHALL NOT create a tracking action.

#### Scenario: grade10-site-store-order-detail-SC-08 - An estimate is not a completed milestone

- **GIVEN** an order with an estimated delivery date and no completed delivery event
- **WHEN** its fulfilment detail renders
- **THEN** the date is identified as an estimate
- **AND** delivery is not presented as completed

#### Scenario: grade10-site-store-order-detail-SC-09 - A safe carrier URL enables the detail action

- **GIVEN** a fulfilment with an absolute `https` carrier URL carrying no credentials
- **WHEN** the order detail renders
- **THEN** Track Order appears
- **AND** activating it opens the carrier URL in a new browser context isolated from the Grade10 page

#### Scenario: grade10-site-store-order-detail-SC-10 - Unsafe tracking data creates no action

- **GIVEN** a fulfilment with a carrier and tracking number but no safe carrier URL
- **WHEN** the order detail renders
- **THEN** Track Order does not appear

### Requirement: The detail distinguishes loading, failure, and not found

The page SHALL show a loading state until the first order read settles. A failed
read SHALL show a localized error and a retry action at the same address. A
successful null answer SHALL show the not-found treatment rather than a loading
or transport-error state.

#### Scenario: grade10-site-store-order-detail-SC-11 - The first read is still loading

- **WHEN** the first order read has not settled
- **THEN** the page shows a loading state and no not-found claim

#### Scenario: grade10-site-store-order-detail-SC-12 - A failed read can be retried

- **GIVEN** the order read failed
- **WHEN** the collector activates Retry
- **THEN** the page reads the same order again without changing its address
