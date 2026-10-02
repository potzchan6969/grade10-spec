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
| **Closed** | The close passes — [Bidding](/p/grade10-site/auction/bidding#auction-logic) | Nothing; the sale goes on in its order |
| **Settled** | The order is done | Nothing |
| **Canceled** | Called off from draft, created or published, or its campaign is cancelled | Nothing; a second call-off is refused |

- **Explicit Save** — nothing is stored until Save, and a draft can be
  half-written for a week; create's requirements are checked on the form and
  again at the API, so a script cannot slip past what the form refuses
- **Prices read back** — each price shows as a formatted decimal amount
  before saving, so its decimal placement can be checked
- **Starting price of 0** — a listing in USD, HKD or JPY can start at
  **0**; its first bid must still reach the currency's lowest increment
- **Sandbox** — set only while draft: the listing runs on test-mode payment
  credentials, so the house can rehearse a sale
- **Stock** — saving a draft with a product and a quantity holds that stock;
  a changed quantity moves the hold, changing the product warns that Save
  moves it, create is refused without a matching hold, and a call-off
  releases it
- **Cert ID** - creating a listing takes an explicit choice of one Cert ID
  of the selected product, or `No Cert ID` for regular stock without a Cert
  record; each Cert ID can have its own live listing, and only one
- 🚧 **Slug helper** — the first saved draft receives a title-and-code slug:
  lower-case title words, then its lower-case listing code. The helper follows
  title edits only while the operator has left that generated value unchanged.
  An operator may replace it. Leaving the Slug field checks the chosen value
  and names a collision before Save; a slug already held by a completed,
  expired or unsold listing remains unavailable
- 🚧 **Listing code** — a stable opaque 5-character code, always leading with
  2 letters, allocated on the first saved draft and shown read-only in the
  Listings table and on its admin screen under the existing listing-read
  access. Its lower-case form is the suffix of the public listing address, but
  it is never shown as a separate public-page field or accepted as a route or
  access grant. Once a winner exists it doubles as the order's payment
  reference. The code stays reserved after deletion — [Auction Display ·
  Listing Schema](/p/grade10-site/auction/display#listing-schema), [Post-
  Bidding · The Invoice](/p/grade10-site/auction/post-bidding#the-invoice)
- **Publish** — a created listing is ready but not visible; publishing is a
  separate move, now or at a Publish at after now that can be cleared
- **Call off** — any time before the close, bids or not; the stock is
  released, the listing leaves browse and search, and its canonical
  slug remains reserved and directly accessible. Its listing code stays
  reserved and never resolves as a route; explicit hard deletion is outside
  this rule
- 🚧 **Unsold close** — a listing that closes with no winner releases its
  stock hold at that moment, and the units are available again. The listing's page says the stock was released, with
  the date. An operator does nothing to get the stock back — [Products and
  Stock · Intake](/p/grade10-admin/inventory/catalog#intake)
- 🚧 **Stock already held** — a listing that closed Unsold before this ships
  still holds its stock. One release frees every such hold, and each shows in
  the inventory history as released by that clean-up
- 🚧 **Relist** — an Unsold listing offers Relist, which opens a new draft
  with the same product, quantity, Cert ID choice, title, copy, price, currency
  and gallery. The draft takes its own stock hold on Save, gets its own slug
  and listing code, sets its own window, and carries no bids or history from
  the closed one. Campaign, reserve, extension, taxonomy and sandbox start as
  on any new draft. Relist shows on an Unsold listing only, to an operator who
  can operate auctions; nothing is stored until Save. It shows on the
  listing's row in the Listings table, once its stock was released, and not
  on a listing in a campaign or one already relisted
- **Media** — an operator can choose reusable assets from the selected
  inventory product or upload media directly to the listing, then order every
  item together. A chosen product asset becomes part of the listing on Save:
  later product-media edits, reordering, or deletion do not change that lot.
  A picked direct-upload file is previewed and stored only on confirm; an item
  joins, is replaced, removed or re-captioned until the close — [Auction
  Display · Media Gallery](/p/grade10-site/auction/display#auction-details)
- 🚧 **Cert-aware inventory media** - a listing for one Cert ID starts with
  untagged product media and media tagged to that Cert. Media tagged to another
  Cert stays in a separately labelled drawer until the operator deliberately
  adds it. A `No Cert ID` listing represents regular stock, has no Cert record,
  and starts with untagged product media. Each selected source is copied into
  the listing gallery.
- 🚧 **Extended bidding** - a published lot past its scheduled close and still
  taking bids reads Extended in the Listings table; its status does not change
- 🚧 **Open order** - a won lot's row opens its order in Orders
- **Watchers** — opening Stats on a listing shows how many collectors watch
  that lot, across both brands; interest, not a count of expected bidders; the
  Listings table does not show the count
- **Refused** — a currency outside the three, or a starting price that is not
  a whole amount of 0 or more; a slug of the wrong shape, or one another listing
  holds; two categories from one taxonomy, or a published or canceled
  campaign; a close not after the start, or a close or Publish at not after
  now at create; a ninth media item, an unsupported or empty file, or
  removing the last item once created; prices, window, slug or sandbox on a
  published listing, and every write on a closed, settled or canceled one

:::detail{title="Listings code map" for="engineer"}
- **Close** — `sweeps/close.ts`
- **Stock release** — `sweeps/stockRelease.ts`
- **Relist save** — `services/listings/draft.ts`
- **Architecture** —
  [auction.md](https://github.com/9gag/grade10/blob/main/docs/architecture/auction.md)
:::

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

## Featured

Operator-curated slides on the collector catalogue's Featured band —
[Auction Display · Catalogue](/p/grade10-site/auction/display#catalogue).

| Rule | Value |
| --- | --- |
| Slots | At most **3**, in operator order |
| Each slot | One published Active or Upcoming listing, and one **front page image** uploaded for that slot |
| Front page canvas | 🚧 **2400 × 1500** (landscape 8:5). Keep the subject in the centre; the stage crops from the edges as the viewport changes |
| Front page file | 🚧 JPEG or WebP; aim at most **400 KB** after encode |

- 🚧 **Manage Featured** — from the Listings tab, beside Create listing; opens
  a sub-page of the ordered slots. An authorized operator fills, orders,
  replaces and clears slots there. A slot without both a listing and its front
  page image is not shown on `/auction`. Ended listings cannot fill a slot
- 🚧 **Front page image** — one image per slot, uploaded for the carousel; not
  picked from the listing gallery and not the campaign cover. It is the banner
  background and the slab on that slide. The upload brief is the canvas and
  file rows above. If it fails to load on the site, the slide uses the lot’s
  first gallery image, or the stage’s default background colour if that is
  missing too — no broken-image chrome

## Orders

🚧 One workspace, Orders under `/auction`, works every won lot from the close
through delivery: a worklist that says what needs doing, and a page for each
order.

| Rule | Value |
| --- | --- |
| Payment window | **7 calendar days** from send |
| 🚧 Address window | **48 hours** from actual close for the winner to confirm setup, which locks it; a reasoned operator reopen gives a fresh **48 hours**; after confirmation only an operator changes it |
| Proof files | **1 to 5** PDF, JPEG or PNG files of at most **10 MB** each, kept for the life of the account |
| Buyer's premium | **20%** of the winning bid or the currency minimum — [Payment Settings](/p/grade10-admin/auction/management#payment-settings) |

| Status | Segment | Primary action | Waited since |
| --- | --- | --- | --- |
| 🚧 Awaiting Setup | Waiting on winner | None | The lot's close |
| 🚧 Setup Overdue | Needs action | Reopen setup | The address deadline |
| 🚧 Preparing Invoice | Needs action | Send invoice | The winner's setup confirmation |
| 🚧 Pending Payment | Waiting on winner | None | The send |
| 🚧 Payment Overdue | Needs action | Reissue | The payment deadline |
| 🚧 Payment Verifying | Needs action | Check proof | The winner's latest proof |
| 🚧 Partially Paid | Waiting on winner | Record payment | The latest payment |
| 🚧 Processing | Needs action | Dispatch | The payment that paid it |
| 🚧 Shipped | In transit | Confirm delivery | The dispatch |
| 🚧 Delivered · Cancelled · Refunded | Closed | None | The delivery, the cancel or the refund |

- 🚧 **The order page** - at its own address. The header holds the status, a
  Test badge on a sandbox lot, the rule behind the status in one sentence, how
  long it has waited, and one primary action, with every other action that
  applies now under More
- **The winner** - name, registered email and phone, never a payment-provider
  identifier, beside the deadline, the reissue count and the suspension state
- 🚧 **One timeline** - the invoice log, the fulfilment log and comments,
  oldest first; a comment is 1 to 2,000 characters, never edited or deleted
- 🚧 **Each action is a dialog** - it restates what will happen, a refusal
  reads as a sentence with the dialog kept open, and money is typed as the
  winner reads it, `50.00` for HK$50.00

| Action | On | Access |
| --- | --- | --- |
| Send invoice | Preparing Invoice | Payment processing |
| 🚧 Reissue | Pending Payment or Payment Overdue | Payment processing |
| 🚧 Confirm or return proof | Payment Verifying, where these are the only actions | Payment processing |
| 🚧 Record payment | A bank transfer invoice in Pending Payment or Payment Overdue, or a Partially Paid order | Payment processing |
| 🚧 Cancel order | Awaiting Setup, Setup Overdue, Preparing Invoice or Payment Overdue | Payment processing |
| 🚧 Reopen the address form, or record setup | Setup Overdue | Payment processing |
| 🚧 Change setup | Preparing Invoice | Payment processing |
| 🚧 Clear flag | Each flagged payment, with a reason | Payment processing |
| Refund | Processing, Shipped, Delivered or Partially Paid, once | Refund processing |
| 🚧 Dispatch | Processing | Shipment processing |
| 🚧 Confirm delivery | Shipped | Shipment processing |
| 🚧 Comment | Any order the operator can open | Reading |

## Post-Sale Queue

🚧 The Orders worklist: one row per won lot's order, in Needs action, Waiting
on winner, In transit, Closed and All, opening on Needs action.

- 🚧 **Segments** - each counted, the counts adding up to All; a flagged order
  sits under Needs action only until every flag is cleared. The first three
  list the longest wait first, Closed and All the latest first
- 🚧 **Row** - the listing code, which opens the order, the lot, the winner,
  the status and its flag, the total, how long it has waited, and the primary
  action unless the order is flagged or the operator lacks the access
- 🚧 **Waited** - from when the status began, or from a flag. Setup Overdue is
  the status at the 48-hour address deadline and nothing else is marked:
  Preparing Invoice carries no mark, and no wait changes a status
- 🚧 **Search and filters** - by the start of a listing code, any invoice ID
  the order held, the winner's email or a payment's reference; one status of
  the segment's, then a cancellation
  category; all kept in the address

## Payment

- 🚧 **The quote** - the operator reads the confirmed address, the method, the
  winning bid and the premium, enters Shipping & Handling (zero allowed) and
  optional Insurance (above zero), reads the Payment Processing Fee, the
  total and the deadline to the minute, and sends, which starts the 7 days
- 🚧 **Tax** — a third quoted amount beside Shipping & Handling and
  Insurance, optional and above zero. Grade10 computes no rate: the operator
  decides what is owed and enters it
- 🚧 **Billing address** — shown beside the delivery address on the quote;
  send is refused while the order has none, and the edit before send adds
  it; an address recorded by phone asks for billing too, same as delivery by
  default
- 🚧 **Payment Processing Fee** - a card invoice's fee is Grade10's own: the
  Stripe card rule for the order's currency, grossed up so Grade10 keeps the
  Subtotal whole, read-only with the rule it came from. With no card rule for
  the currency, the invoice cannot be sent or reissued, and the dialog says so
  and points to Payment Settings. A bank transfer invoice's fee is the
  operator's own, zero or more with no cap; empty reads Free. On a reissue,
  the fee is editable only when the reissued invoice is bank transfer; a
  switch to card prices it from the card rule, and a switch to bank transfer
  starts it empty. A sent invoice never re-prices
- 🚧 **What was seen is sent** - the send and the reissue carry the total the
  operator read; when Grade10 now prices the order differently, for example
  because the premium minimum changed, the send is refused and the dialog
  shows the new total
- 🚧 **Edit before send** — at the winner's request the operator changes the
  address, the method or both, with a reason the log keeps beside the old and
  new values; the order stays Preparing Invoice. Bank transfer is refused
  where Grade10 holds no bank details for the order's currency
- 🚧 **Reissue** — one action for any change after send, on a pending or
  expired invoice: address, method, fee, shipping, insurance, tax, and the
  deadline kept or restarted, with a reason and at least one change; no limit,
  each logged with its count, and the buyer's reissue history across all their
  orders shown before another is granted. The replaced invoice reads
  Replaced, and its ID still finds the order
- 🚧 **Checking proof** — the operator opens the winner's files on the
  order page, then confirms, with their own files
  if they wish, or returns the invoice to pending with a reason the winner
  reads and one kept internal; the deadline resumes with the time that was
  left, and returning is not offered once the invoice has expired
- 🚧 **Expired invoice** — the winner can no longer start a payment on it;
  one started in time still counts, and one that lands after expiry pays it,
  flagged Paid late. The operator reissues with a fresh 7 days, records a
  payment, or cancels
- 🚧 **Money that lands** - a card payment is always recorded. One the
  invoice did not expect carries one of six flags until an operator clears it
  with a reason, and clearing moves nothing. Money that counts toward nothing
  blocks neither a reissue nor a cancel, and finance returns it outside
  Grade10

| A card payment that lands | What it does | Flag |
| --- | --- | --- |
| 🚧 On a cancelled order | Counts toward nothing; the order stays Cancelled | Paid after cancel |
| 🚧 On a replaced invoice | Counts toward nothing | Paid on a replaced invoice |
| 🚧 At another amount or currency | Counts toward nothing | Amount mismatch |
| 🚧 On an expired invoice | Pays it | Paid late |
| 🚧 On a paid invoice | Counts above the Order Total | Overpaid |
| 🚧 On an invoice in any other state, which no card payment can start on | Counts toward nothing | Unexpected status |

- 🚧 **Record payment** - one dialog for money received outside the card
  checkout: the amount, starting at the balance; bank transfer, cash or a
  described method; a reference, required for a bank transfer; the date
  received; 1 to 5 private proof files; and a reason. Never on a card invoice,
  which is reissued as bank transfer first
- 🚧 **Partially Paid** — the deadline stops for good, and what will not be
  paid off is settled by hand outside Grade10

| Payments so far | The next payment | What happens |
| --- | --- | --- |
| 🚧 Under 90% of the invoice | Less than the balance | Recorded; the order reads Partially Paid |
| 🚧 90% or more | Less than the balance | Asked to close as Paid, or keep it Partially Paid at the real balance; asked again on every later payment |
| 🚧 Any | Exactly the balance | Closes on its own; the order reads Processing |
| 🚧 Any | More than the balance | Accepted after an overpayment confirmation; the invoice is marked Paid, the payment is flagged Overpaid, and the excess can be returned through the refund flow |

- 🚧 **Reopening the address form** — after the 48-hour deadline and before
  send, on request and with a reason, giving a fresh 48 hours; repeatable,
  changes no status, never on a cancelled order. Or the operator records an
  address the winner gives by phone, leaving the form closed

| Cancelling an order | Value |
| --- | --- |
| 🚧 Its reason | One category — Non-payment, Missed setup, Winner asked, Lot issue or Other — and a note, both required; the queue filters cancelled orders by category |
| 🚧 What the dialog states | Before the operator confirms: the lot goes back to stock, no runner-up is offered it, the winner is emailed, a suspension stays, and the cancel cannot be undone |
| The lot | Back to stock with no runner-up offer, its hammer price and bid history kept for audit and never carried into a new listing |
| 🚧 Relisting it | The order links to its lot, which an operator relists by hand; nothing is relisted on its own |
| 🚧 A payment that lands after | Recorded, and it flags the order: the order stays Cancelled, finance sends the money back outside Grade10, and the operator clears the flag once it has gone |

- **Refund** — the winner asks Customer Service, outside Grade10; the
  operator sends the money by hand, in the Stripe dashboard or by bank
  transfer, then records it on the order. One refund per order, never
  reversed. A closing refund reads Refunded for good. An overpayment returns
  only the difference and the order keeps its status

| The refund records | Value |
| --- | --- |
| Amount | Above zero and no more than the winner has paid — the Order Total where they paid in full, what was collected where they paid in parts; offered at what was paid, and the operator decides it |
| Reason and note | Damaged, Not as described, Not received, Duplicate or overpayment, or Other; the note carries what the winner asked and is optional, Other included |
| 🚧 Date | When the money left, typed by the operator and never in the future |
| Method and reference | How the money went back, with its Stripe or bank reference |
| 🚧 Where it went | A card by its brand and last four digits. By bank: FPS, HK local bank transfer or SWIFT international wire, the bank name, and an account number or IBAN, or for FPS a phone number, an email or an FPS ID. It is typed in full and kept only masked, as the winner reads it: a number to its last four digits, an email to its first letter and domain |
| 🚧 Before it commits | The operator confirms a restatement of the amount, the method and where it went, and the lot's outcome, saying this is the order's only refund and cannot be undone |
| Proof | 1 to 5 files, each a PDF, JPEG or PNG of at most 10 MB, as Record payment takes them; operators only |
| The lot | Back to stock, when the card came back or never left, or kept by the winner, when it stays sold |
| Its number | The next one in the internal audit series |

- **Finding refunds** — a closing refund filters as Refunded; an overpayment stays on the order's current status. Both are on the order detail and
  the invoice log, with who recorded it and when
- **The winner** — a closing refund reads Refunded, an overpayment keeps
  the order's status, neither gets a letter, and bidder standing does not
  change
- **Refund transaction clues for the winner** — Transfer to uses the
  shared payment card: brand logo and the last four digits for a card, or a
  bank icon with the masked destination on the primary line and the free-text
  bank name as secondary text under it. A bank refund also shows its provider
  reference in the winner details; a card refund shows none. Full proof,
  Stripe reference and audit number stay with the operator
- 🚧 **Internal audit number** — every invoice and receipt carries one
  gapless number, such as `#00010482`, shown to operators and never to the
  winner; a replaced invoice keeps its number
- **Failed payments** - every failed payment attempt stays in the invoice log
- ❓ **Contact channel** — how an operator reaches a winner about a transfer
  or a proof; WhatsApp is the working assumption, on the number from the
  address form; Operations confirms

## Fulfilment

Shipment is its own grant, apart from payment: the person who may settle
money is not necessarily the person who dispatches cards.

- 🚧 **Dispatch** - from the page of a Processing order: the carrier, the
  tracking number and the carrier's tracker link when there is one, with the
  address kept as it stood; the order reads Shipped and the winner gets the
  shipped letter. Recording an address never dispatches
- 🚧 **Delivery** - from the page of a Shipped order: the date it arrived,
  and the carrier's proof as one file when there is one; the order reads
  Delivered, and the winner reads both on their order and keeps the proof -
  [Post-Bidding · Winner
  Order](/p/grade10-site/auction/post-bidding#winner-order)

## Payment Settings

The buyer-premium minimums and the Stripe card fee rule that prices a card
invoice's payment processing fee, as the Payment settings tab under
`/auction`. A bank transfer invoice's fee is the operator's own, per
[Auction Management · Payment](#payment); Payment Settings holds no rule for
it.

| Rule | Value |
| --- | --- |
| Minimum charge | One amount per currency, zero or more; **0** in USD, HKD and JPY at first |
| 🚧 Card fee rule | One per currency: a percentage of at least 0 and below 100, to two decimal places, and a fixed amount of zero or more; or no rule, and half a rule is refused |
| 🚧 At rollout | Nothing is stored until the first save; Finance sets HKD **3.4% + HK$2.35** |
| 🚧 Typed as | The currency's major units, `2.35` for HK$2.35, stored as minor units |
| Who | 🚧 Operators with payment processing, `auction:payment`; others neither read nor change it |
| Saved | Whole, replacing all three currencies' rules at once and recording the operator and the time; a new value applies to card invoices sent or reissued after it, and never re-prices a sent one |
| Refused | A missing or unsupported currency, a negative amount or one finer than the currency's smallest unit, or a read or save without that access — nothing stored changes |

- 🚧 **Live example** - each card fee shows, as it is typed, the fee a card
  invoice charges on a subtotal of 1,000 in its currency, grossed up so
  Grade10 keeps the whole subtotal once Stripe takes its fee from the whole
  charge
- ❓ **USD and JPY** - no card fee until Finance sets one, so a card invoice
  in them cannot be sent; Finance confirms the rates

| Subtotal | Stripe card fee | Card fee charged | Order total |
| --- | --- | --- | --- |
| HK$1,000.00 | 3.4% + HK$2.35 | HK$37.63 | HK$1,037.63 |
| HK$3,120.00 | 3.4% + HK$2.35 | HK$112.25 | HK$3,232.25 |

::story{id="auction-admin-payment-settings--loaded" title="Payment settings loaded"}

## Grants

| Work | Grant | Held by |
| --- | --- | --- |
| Drafting, editing, publishing and calling off a listing or a campaign | `auction:write` and `auction:operate` | `staff` |
| 🚧 Opening Orders, an order and its proof files, and commenting; attaching a proof file takes the grant of its action | `auction:read` - reading | `staff`, `finance`, `treasurer` and `admin` |
| Sending and reissuing an invoice, recording a payment, checking proof, cancelling, reopening, recording or changing setup | `auction:payment` - payment processing | `finance`, `treasurer` and `admin` |
| 🚧 Clearing a flag, and Payment Settings: the premium minimums and the card fee rule | `auction:payment` - payment processing | `finance`, `treasurer` and `admin` |
| Dispatch and delivery | `auction:shipment` - shipment processing | `staff` and `admin` |
| Recording a refund | `auction:refund` - refund processing | `staff` and `admin` |
| 🚧 Making a test winner, outside production | `auction:operate` and `user:create` | `admin` |

- 🚧 **A control the operator lacks** - stays listed and disabled, naming the
  access it needs, such as Needs payment processing, and the server refuses
  it too - [Roles](/p/shared/auth/roles)
- 🚧 **Reasons** - an edit before send, a reissue, a recorded payment or
  refund, a cancel, a returned proof, a setup change and a cleared flag each
  need one; a send and a confirmed proof need none. Every entry names the
  operator signed in and Grade10's own time
- **The trail** — every elevated move appends to the hash-chained audit trail
  and refuses to run if that record cannot be written — [Audit
  trail](/p/grade10-admin/audit)

## Test Winners

🚧 Outside production, one action makes a test account that has won a closed
sandbox lot, so QA walks the winner's order by hand as a real winner would.

| Rule | Value |
| --- | --- |
| Where | Local, staging, staging-2 and UAT only; never production or a preview, whose console carries no Test tab |
| Email | The operator's own address with a `+qa-<code>` tag, checked by Grade10, so every letter lands in their own inbox. The same address makes one test winner; one that holds a verified account is refused |
| The lot | `Test lot <code>`, a sandbox lot closed through the real close, now or up to 30 days back, so its order and letters are the real ones; never biddable |
| Sign-in | The ordinary sign-in link, which the console emails to the test address after making it and again on request; opened in a private window, so the operator stays signed in |

- 🚧 **The list** - Winners in the Test tab lists test winners newest first,
  each with its email, lot, order status and when it was made, with Email
  sign-in link and Open order
- 🚧 **Worked as any order** - the order reads Test in Orders, where Cancel is
  the ordinary cancel and the lot stays closed; Winners cancels nothing itself

::changes{spec="grade10-admin/auction/test-winners"}

## Pending Spec

::next{spec="grade10-admin/auction/post-sale"}

:::detail{title="Code map" for="engineer"}
- **Service** — [Auction Service](/platform/auction-service)
- **Fixture tabs** — `LOCAL_FIXTURES_ENABLED`: the Campaign and Listings tabs seed and drop fixture listings, local dev only
- **Winners** — `trpc/routers/testWinners.ts` on the `testBids` middleware; the Test tab ships only in pre-production builds
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
competition proportionate without asking anyone to predict the close. Orders
is the operator's close-out surface: a worklist that says what needs doing,
and one page per order that keeps the winner contact, money, delivery state
and timeline together, with payment and shipment as separate jobs.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Auction operator | Creating a listing | Chooses a supported currency without predicting its closing price. |
| Finance operator | Reviews or updates the premium minimums and the card fee rule | Sees one minimum and one card rule per currency, and saves them whole. |
| Other operator | Opens Auction without payment processing | Cannot read or change the payment settings. |
| QA | Needs to walk a winner's order | Makes a test winner in one step outside production and signs in with the ordinary link. |

**Not in scope.** Operator editing of the increment schedules; currency
conversion or added currencies; per-listing floors; changing Stripe account
settings.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Catalogue Featured | 🚧 In flight | At most 3 ordered slots from Manage Featured on Listings; each binds one published listing and one operator-uploaded front page image for the site carousel. Not gallery picks, not auto Top-N, not the campaign cover alone. | Design |
| Supported currencies | Decided | USD, HKD or JPY only; the selected currency's shared schedule supplies the floor, with no listing-level override and no schedule editing. | Product |
| Watch count placement | Decided | In the Listings Stats dialog with the bidder count, not a Watchers column on the table and not on the listing's own page. | Design |
| Unsold stock | 🚧 In flight | Released automatically at the Unsold close, and once for every hold an earlier Unsold close left behind; not an operator step. Relist opens a new draft and never reopens the closed listing. | Product |
| Listing gallery sources | Decided | One combined gallery may hold selected product assets and direct uploads; the operator freely orders both. | Product |
| Listing media snapshot | Decided | Selected product assets are copied into the listing at Save; later product-gallery changes do not alter the lot. | Product |
| Payment source | Decided | The order tells a card payment through Stripe from money an operator records. | Product and Finance |
| Shipment authority | Decided | Payment and shipment use separate grants; staff may ship, finance may collect, and publishing remains catalogue work. | Operations |
| Shipping model | Decided | Grade10 records the confirmed dispatch snapshot, carrier tracking, fulfilment milestones and delivery proof. | Operations |
| Who reopens the address form | Decided | The operator, with payment processing and a mandatory reason; a reopen gives a fresh 48 hours and changes no status. Refused on a cancelled order, whose lot is back in stock. | Product and Operations |
| Operational history | Decided | Invoice and fulfilment logs remain append-only and separate from the compliance audit chain. | Product and Engineering |
| Premium minimum | 🚧 In flight | Under Auction because auction invoices use it; behind payment processing, `auction:payment`, because changing it changes the amount collected. Chosen over the settlement grant, which only `admin` holds, so finance could not keep the settings it owns. | Product and finance |
| Payment processing fee | 🚧 In flight | The invoice's payment method decides. A card invoice's fee is Grade10's own: the Stripe card rule per currency, grossed up so Grade10 keeps the subtotal whole; with no rule for the currency, the invoice cannot be sent or reissued. A bank transfer invoice's fee is the operator's own; a sent invoice never re-prices, and Finance enters the card rule at rollout. Chosen over reading the provider's fees at send, which Stripe cannot answer - [Post-Bidding · The Invoice](/p/grade10-site/auction/post-bidding#the-invoice). | Product and finance |
| A reissue's fee | 🚧 In flight | Editable only where the reissued invoice is bank transfer, starting from the current invoice while the method stays. A switch to card prices it from the card rule; a switch to bank transfer starts it empty. Chosen over always pricing it from the schedule, which undoes a fee the operator agreed with the winner. | Product and finance |
| Orders workspace | 🚧 In flight | One worklist in segments with counts - Needs action, Waiting on winner, In transit, Closed, All - and one page per order with one primary action and each action in its own dialog. Chosen over a listing-level queue beside a separate winner orders tab, which split one order across two surfaces. | Product and Operations |
| What was seen is sent | 🚧 In flight | The send and the reissue carry the total the operator read and are refused when Grade10 now prices the order differently. Chosen over sending whatever the server computes, which can bill a total nobody saw. | Product and finance |
| Money that lands | 🚧 In flight | A card payment is always recorded, and one the invoice did not expect carries a flag until an operator clears it with a reason. On an expired invoice it pays the invoice, since it paid the whole total; on a replaced or cancelled invoice, at an amount that differs, or on an invoice in any state that cannot take a card payment, it counts toward nothing and blocks nothing, and finance returns it outside Grade10. Chosen over refusing or dropping it, which loses track of money Grade10 holds, and over never moving a status, which leaves an expired invoice the winner paid in full to be settled a second time. | Product and finance |
| Test winners | 🚧 In flight | Outside production, one action makes a test account on the operator's own tagged address that won a closed sandbox lot through the real close, so its letters go out. It signs in with the ordinary link in a private window, and Cancel is the order's own. Chosen over seeding an order around the real close, which skipped its letters, and over a sign-in link of its own, which auth would have to guard. | Product and Engineering |
| How long an order waited | 🚧 In flight | Each row and order page shows how long the order has waited in its status. Setup Overdue is the status at the 48-hour address deadline, and Preparing Invoice carries no mark; its payment timer starts at send. Chosen over a second Overdue mark beside the Setup Overdue status, which also marked the operator's own queue after 72 hours. | Product |
| Partial payment stays operator-only | 🚧 In flight | Recorded through Record payment, for less than the full balance, any number of times. Self-service card and bank transfer are untouched. Chosen over a winner-facing partial-pay flow to keep the change small. | Product and finance |
| Who records a refund | Decided | Operations, with a refund grant of its own held by `staff` and `admin`, apart from `auction:payment`. Chosen over finance approving each refund, to keep one step; finance reconciles from the order detail. | Product, Operations and finance |
| Refund money path | Decided | Sent by hand in Stripe or by bank transfer and recorded in Grade10, as refunds after capture already are. Chosen over refunding cards from Grade10 through Stripe. | Product and finance |
| One refund, any amount | Decided | One refund per order. A closing refund ends it as Refunded. An overpayment returns only the difference and the order keeps its status. Chosen over every refund, including an overpayment, ending as Refunded. | Product and finance |
| Refund letter | Decided | None; Customer Service already speaks to the winner. | Product |
| Refund transaction clues | Decided | Transfer to uses the shared payment card: brand logo and the last four digits for a card, or a bank icon with the masked destination on the primary line and the free-text bank name as secondary text under it. A bank refund also shows its provider reference to the winner; a card refund shows none. Full proof, Stripe reference and audit number stay with the operator. | Product |
| Who cancels | 🚧 In flight | Operators only; a winner who wants out asks Contact Us. Chosen over a winner cancelling before the invoice is sent, which would let a bid be walked away from. | Product and Operations |
| Cancel is final | 🚧 In flight | No undo, and a late payment never revives the order: the lot may already be relisted and the winner already emailed. Chosen over a short undo window. | Product and Operations |
| Paid after cancel | 🚧 In flight | Refunded by finance outside Grade10, then cleared on the order. Chosen over widening the Refund action to cancelled orders, for a rare case. | Product and finance |
| Finding a flagged order | 🚧 In flight | A flagged order, Paid after cancel included, counts under Needs action only, whatever its status, until an operator clears every flag on it. Chosen over finding it only by opening the order, since a flag is money waiting on someone. | Product and Operations |
| Measuring cancellation | 🚧 In flight | Cancellations each month by category, and winner contacts per 100 cancellations. | Product |
| Partially Paid needs no action | 🚧 In flight | Unlike Payment Verifying, nothing is waiting on the operator by default; they open the order when a new payment arrives. | Product and finance |
:::
