---
title: Auction Management
spec: grade10-admin/auction/listing
audience: operator
order: 1
---

The operator half of the auction: a listing is drafted, filled, priced,
scheduled and published here, and a won lot is worked from the close until
the card is in the winner's hands. The collector's half is
[Auction](/p/grade10-site/auction).

## Listings

| Rule | Value |
| --- | --- |
| Currency | **USD**, **HKD** or **JPY**, one per listing; **HKD** when omitted |
| Bid floor | The currency's price schedule — [Bidding · Bid Increments](/p/grade10-site/auction/bidding#auction-logic); no minimum-increment field |
| Title | Required at create; **1 to 200** characters |
| Copy | Optional; at most **4,000** characters |
| Slug | **1 to 64** characters, lower-case words joined by hyphens, unique among every listing |
| Quantity | **1 to 500** units of the chosen product; **1** when a product is picked |
| Extension | **1,800 seconds** when omitted; **0** turns extended bidding off; an optional cap, and a cap below the duration is a hard final deadline |
| Gallery | **1 to 8** images or videos of at most **100 MiB** each, stored as uploaded; a draft may hold none |

::image{src="assets/diagrams/auction-listing-status.svg" alt="A listing from Draft to Created, Published, Closed and Settled, with Canceled beneath, reached by calling off a created or published listing"}

| Status | Reached when | What can change |
| --- | --- | --- |
| **Draft** | The first save; nothing is required yet | Everything, sandbox included |
| **Created** | Create: a title, a slug, a starting price, a start, a close after both the start and now, at least one media item, and the stock hold the draft took | Catalogue fields, prices and window, slug, Publish at, media |
| **Published** | An operator publishes, or Publish at arrives; a draft never publishes | Catalogue copy, taxonomy and media only |
| **Closed** | The close passes — [Bidding](/p/grade10-site/auction/bidding#auction-logic) | Nothing; the sale is settled in the queue |
| **Settled** | The order is done | Nothing |
| **Canceled** | Called off from draft, created or published, or its campaign is cancelled | Nothing; a second call-off is refused |

- **Explicit Save** — nothing is stored until Save, and a draft can be
  half-written for a week; create's requirements are checked on the form and
  again at the API, so a script cannot slip past what the form refuses
- **Prices read back** — each price shows as a formatted decimal amount
  before saving, so its decimal placement can be checked
- **Sandbox** — set only while draft: the listing runs on test-mode payment
  credentials, so the house can rehearse a sale
- **Stock** — saving a draft with a product and a quantity holds that stock;
  a changed quantity moves the hold, changing the product warns that Save
  moves it, create is refused without a matching hold, and a call-off
  releases it
- 🚧 **Cert ID** — creating a listing takes an explicit choice of one Cert ID
  of the selected product, or `No Cert ID` for an unnumbered unit; each Cert
  ID can have its own live listing, and only one
- **Publish** — a created listing is ready but not visible; publishing is a
  separate move, now or at a Publish at after now that can be cleared
- **Call off** — any time before the close, bids or not; live holds and the
  stock are released, and the slug is freed while the called-off lot stops
  answering at it
- **Media** — a picked file is previewed and stored only on confirm, then
  shown at card size with a zoom preview on hover; an item joins, is
  replaced, removed or re-captioned until the close — [Auction Display ·
  Media Gallery](/p/grade10-site/auction/display#auction-details)
- 🚧 **Watchers** — the Listings table shows how many collectors watch each
  lot, across both brands; interest, not a count of expected bidders
- **Refused** — a currency outside the three, or a starting price that is not
  a positive whole amount; a slug of the wrong shape, or one another listing
  holds; two categories from one taxonomy, or a published or canceled
  campaign; a close not after the start, or a close or Publish at not after
  now at create; a ninth media item, an unsupported or empty file, or
  removing the last item once created; prices, window, slug or sandbox on a
  published listing, and every write on a closed, settled or canceled one

## Campaigns

A campaign is a catalogue cover: an event many listings belong to, with a
title (**1 to 200** characters) and copy (up to **4,000**) of its own, and
deliberately no clocks and no money.

| Status | Reached when | Offered |
| --- | --- | --- |
| **Draft** | An operator opens it with a title; no public cover | Edit, Create, Cancel |
| **Created** | The operator creates it; still no public cover | Edit, Publish, Cancel |
| **Published** | The operator publishes; the cover is public, and each listing under it still publishes on its own | Edit, Cancel |
| **Canceled** | Called off from any of the three; each listing still under it is called off too | Nothing |

- **A listing joins** — from the listing editor's Campaign picker, which
  offers draft and created campaigns only; a listing works without one, and
  the Listings table shows `-`

## Post-Sale Queue

The queue works every winner order from close through delivery: each row
wears one outcome, the queue filters to one outcome at a time, and an order
opens into its winner, invoices, payments, addresses, fulfilment and trail.

| Rule | Value |
| --- | --- |
| Payment window | **7 calendar days** from send |
| Address window | **48 hours** from close; a reopen gives a fresh **48 hours** |
| Overdue | **72 hours** or more idle in Awaiting Address or Preparing Invoice |
| Proof files | **1 to 5** PDF, JPEG or PNG files of at most **10 MB** each, kept for the life of the account |
| Buyer's premium | **20%** of the winning bid or the currency minimum — [Payment Settings](/p/grade10-admin/auction/management#payment-settings) |

| Outcome | When | Needs action |
| --- | --- | --- |
| Draft · Scheduled · Live | Before a sale; time left is read from the close | No |
| Unsold · Called off | Ended without a payable order | No |
| Awaiting Address | The lot closed without a confirmed delivery address | No |
| Preparing Invoice | The winner confirmed an address; no invoice yet | Yes |
| Pending Payment | The invoice is unpaid; an expired one shows Expired beside it | When expired |
| 🚧 Payment Verifying | The winner uploaded payment proof | Yes, until the proof is checked |
| Processing | Paid, not dispatched | Yes |
| Shipped · Delivered | Dispatched; delivery confirmed | No |
| Cancelled · Refunded | A recorded terminal outcome | No |

- **Overdue** — a separate, filterable mark on an order idle 72 hours or more;
  it changes nothing, and the operator decides whether to contact the winner,
  invoice or cancel
- ❓ **Overdue after the address deadline** — whether the mark should follow
  the 48-hour deadline instead of 72 hours idle; Product confirms
- **Extended bidding: ON** — a lot past its scheduled close and still taking
  bids carries this label; its outcome does not change
- 🚧 **Search** — by listing code, invoice ID or bank reference; a replaced
  invoice's ID or reference still finds the order
- **The order detail** — the winner's name, registered email and phone, never
  a payment-provider identifier; the invoice, fulfilment and derived statuses
  with the rule that produced them, the deadline with its countdown, the
  reissue count and the suspension state; how long it has waited; and the
  trail of status changes and comments in one time order, never edited or
  deleted

| Action | On | Grant |
| --- | --- | --- |
| Send invoice | Preparing Invoice | Payment processing |
| Reissue | A sent invoice, pending or expired | Payment processing |
| 🚧 Confirm or return proof | Payment Verifying, where these are the only actions | Payment processing |
| Settle manually | A bank transfer invoice, pending or expired | Payment processing |
| Cancel order | Awaiting Address, Preparing Invoice, or an expired invoice | Payment processing |
| 🚧 Reopen the address form, or record an address | Awaiting Address after the deadline, before send | Payment processing |
| Dispatch | A paid order | Shipment processing |
| Confirm delivery | A dispatched order | Shipment processing |
| Comment | Any order the operator can open | None |

## Payment

- **The quote** — the operator reads the confirmed address, the method, the
  winning bid and the premium, enters Shipping & Handling (zero allowed) and
  optional Insurance (above zero), and sends; the send locks the address and
  starts the 7 days
- 🚧 **Payment Processing Fee** — for card, priced by Grade10 from the
  provider's live fees, and the send is refused when they cannot be read; for
  bank transfer, entered by the operator on every invoice, zero or more
- 🚧 **Edit before send** — at the winner's request the operator changes the
  address, the method or both, with a reason the log keeps beside the old and
  new values; the order stays Preparing Invoice. Bank transfer only in a
  currency with bank details — HKD at launch
- 🚧 **Reissue** — one action for any change after send: address, method,
  fee, shipping, insurance, and the deadline kept or restarted, with a reason
  and at least one change; no limit, each logged with its count, and the
  buyer's reissue history across all their orders shown before another is
  granted
- 🚧 **Checking proof** — the operator confirms, with the winner's files and
  their own if they wish, or returns the invoice to pending with a reason the
  winner reads and one kept internal; the prompt shows the time left, and
  returning is not offered once the invoice has expired
- 🚧 **Expired invoice** — the winner can no longer pay it: a card payment
  received at or after the deadline is refused, while one started in time
  still counts; the operator reissues with a fresh 7 days, settles manually,
  or cancels
- 🚧 **Manual settlement** — records bank transfer, cash or another described
  method, a reference where required, and 1 to 5 private proof files; settled
  at the invoice's full order total with its fee line kept, and never on a
  card invoice, which is reissued as bank transfer first
- 🚧 **Reopening the address form** — after the 48-hour deadline and before
  send, on request and with a reason, giving a fresh 48 hours; repeatable,
  changes no status, never on a cancelled order. Or the operator records an
  address the winner gives by phone, leaving the form closed
- **Cancel** — the lot returns to stock with no runner-up offer; the hammer
  price and bid history stay for audit and are not carried into a new listing
- 🚧 **Internal audit number** — every invoice and receipt carries one
  gapless number, such as `#00010482`, shown to operators and never to the
  winner; a replaced invoice keeps its number
- **The hold** — released at the close, never captured; every failed payment
  attempt stays in the invoice log
- ❓ **Contact channel** — how an operator reaches a winner about a transfer
  or a proof; WhatsApp is the working assumption, on the number from the
  address form; Operations confirms

## Fulfilment

Shipment is its own grant, apart from payment: the person who may settle
money is not necessarily the person who dispatches cards.

- **Dispatch** — needs a paid invoice; records the address snapshot, the
  carrier and the tracking number, and recording an address never dispatches
- **Delivery** — records the carrier's proof; the winner reads both on their
  order — [Post-Bidding · Winner
  Order](/p/grade10-site/auction/post-bidding#winner-order)

## Payment Settings

The buyer-premium minimums, as the Payment settings tab under `/auction`.

| Rule | Value |
| --- | --- |
| Minimum charge | One non-negative whole amount per currency, in minor units; **0** in USD, HKD and JPY at first |
| Who | Operators who can settle auction money; others neither read nor change it |
| Saved | Whole, replacing the mapping at once and recording the operator and the time; a new value applies to invoices sent or reissued after it |
| Refused | A missing or unsupported currency, a negative or fractional amount, or a read or save without the settlement permission — nothing stored changes |

::story{id="auction-admin-payment-settings--loaded" title="Payment settings loaded"}

## Grants

| Work | Grant | Held by |
| --- | --- | --- |
| Drafting, editing, publishing and calling off a listing or a campaign | `auction:write` and `auction:operate` | `staff` |
| Sending, reissuing and settling an invoice, checking proof, cancelling, reopening the address form, the premium minimums | `auction:settle` — payment processing | `finance`, and `admin` |
| Dispatch and delivery | Shipment processing | `staff`, and `admin` |

- **A control the operator lacks** — stays visible and disabled, and the
  server refuses it too; reissue, returning proof, manual settlement and
  cancellation each record the operator and a mandatory reason —
  [Roles](/p/shared/auth/roles)
- **The trail** — every elevated move appends to the hash-chained audit trail
  and refuses to run if that record cannot be written — [Audit
  trail](/p/grade10-admin/audit)

## Pending Spec

::next{spec="grade10-admin/auction/post-sale"}

:::detail{title="Code map" for="engineer"}
- **Service** — [Auction Service](/platform/auction-service)
- **Test panel** — `LOCAL_FIXTURES_ENABLED`: the Campaign and Listings tabs seed and drop fixture listings, local dev only
:::

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-admin/auction/listing"}

::cases{id="grade10-admin/auction/campaign"}

::cases{id="grade10-admin/auction/post-sale"}

::cases{id="grade10-admin/auction/payment-settings"}
:::

:::detail{title="Product decisions" for="pm"}
An operator chooses the auction currency but not the increments that shape its
bidding: one schedule keeps a lot's opening price accessible and its later
competition proportionate without asking anyone to predict the close. The
queue is the operator's close-out surface, where payment and shipment are
separate jobs and one order detail keeps the winner contact, money, delivery
state and trail together.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Auction operator | Creating a listing | Chooses a supported currency without predicting its closing price. |
| Finance operator | Reviews or updates the premium minimums | Sees one value for USD, HKD and JPY and saves a non-negative whole amount. |
| Other operator | Opens Auction without settlement permission | Cannot read or change the payment settings. |

**Not in scope.** Operator editing of the increment schedules; currency
conversion or added currencies; per-listing floors; changing Stripe account
settings.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Supported currencies | Decided | USD, HKD or JPY only; the selected currency's shared schedule supplies the floor, with no listing-level override and no schedule editing. | Product |
| Watch count placement | Decided | A Watchers column on the Listings table, not the listing's own page. | Design |
| Payment source | Decided | The queue distinguishes a fresh Stripe charge from manual settlement, and both release the bid-time hold rather than capturing it. | Product and Finance |
| Shipment authority | Decided | Payment and shipment use separate grants; staff may ship, finance may collect, and publishing remains catalogue work. | Operations |
| Shipping model | Decided | Grade10 records the confirmed dispatch snapshot, carrier tracking, fulfilment milestones and delivery proof. | Operations |
| Who reopens the address form | Decided | The operator, with payment processing and a mandatory reason; a reopen gives a fresh 48 hours and changes no status. Refused on a cancelled order, whose lot is back in stock. | Product and Operations |
| Operational history | Decided | Invoice and fulfilment logs remain append-only and separate from the compliance audit chain. | Product and Engineering |
| Premium minimum | Decided | Under Auction because auction invoices use it; behind the settlement permission because changing it changes the amount collected. | Product and finance |
| Overdue and the address deadline | ❓ Open | Whether the Overdue mark should follow the 48-hour address deadline instead of 72 hours idle, so a winner is not blocked for a day before an operator is told. | Product |
:::
