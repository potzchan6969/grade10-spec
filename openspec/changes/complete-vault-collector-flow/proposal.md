**Author:** @brianchacha6969 - 2026-09-21

## Why

A collector whose offer ran out reads "Offer waiting for you" with nothing to
answer: the sweep closes the offer row and leaves the case `offer_made`, and
the page shows the expired line only while an open offer is still on it. The
same page offers no Accept, no Decline and no Cancel, although the record
says they are the collector's own and the worker already serves all three; a
borrower is told a balance and nowhere to send it; and the only handle a case
has is a uuid nobody can read out at a counter or type at a bank. The design
canvas draws the whole collector flow and the console against the fourteen
statuses and the policy numbers the code runs — every figure on it reproduces
what runs — so what it adds is surfaces and words, not a machine.

**Metric:** share of offers answered from the collector's own case page
rather than at the counter, and share of live loans whose repayment arrives
under the case reference. Both read zero today, because neither act exists.

## What Changes

- **The case page does what the record says it does.** Accept, Decline,
  Cancel and Ask for it back land from the page, each behind a confirmation
  naming what it does — the total, what a late day costs and what will be
  signed. The acts exist on the worker and in the catalogue; this wires them.
- **The page reads the fact the case meets, derived at the read.** A lapsed,
  declined or superseded offer, a missed visit, an ask for the item back, and
  the four endings each read in the collector's words with the one thing to
  do next; no status is added, and a lapsed offer stops reading as a live one.
- **A case gets a reference a person can use.** Six characters from an
  alphabet that cannot be misread, issued at intake beside the id: printed
  on the page and in every email, spoken at the counter, typed as the
  bank-transfer reference, prefix-searched in the console. Additive: the id
  stays the key and the address, and every existing wire keeps its shape.
- **A borrower is told where to pay.** A structured how-to-pay block — the
  lender's FPS id, its bank account, the case reference as the transfer
  reference, or card or cash at the counter — on the live loan and in every
  money message. **BREAKING** for the standing decision that how to pay is
  one free-text instructions field: the field becomes three values, which
  `check:libs` names until Legal and Finance set them.
- **A live loan shows its repayments and its final notice.** Each repayment
  with its value date, method and the balance after it, the allocation
  sentence, the reminder dates, and — once a notice is sent — the date to pay
  by, the reminders already sent, and that nothing can be taken before then.
- **The wizard reviews before it sends.** A third step reads the request
  back, says what happens next, and takes the tick that the collector has
  read the personal information collection statement.
- **A booked visit gets its own screen.** The shop, the slot, what to bring,
  add to calendar, move and cancel; the case repeats the add-to-calendar
  while a visit is ahead.
- **The collector has a Your data page.** What the vault keeps and for how
  long, the identity standing, every signed document from every case in one
  download, and the ask to be forgotten with its in-flight refusal in words.
- **The console reads the day at a glance.** Counts on every view, today's
  visits in order, arrears tiles, held-items tiles, a ledger kind filter, the
  net out of the business, a takes-back column and a CSV export; search by
  the case reference.
- **The console says the rule before the refusal.** The make-offer, vault
  and payout dialogs state their bounds, their preconditions and what the
  recording fixes; the Documents tab ticks the five key terms as a checklist;
  the Case tab walks the visit in order; the Custody tab shows forfeiture as
  four states.
- **Every collector email is a table-and-block message.** The terms table,
  the total, the late-day cost, the expiry, how to pay, the reminder
  schedule, the notice's clause reference, lapse condition and "a person
  decides" line, the lender's licence footer and the complaints contact —
  delivered as React Email templates in this store's `apps/emails`, which
  carries no vault template today. The wording Legal owes stays bracketed.
- **The identity panel collapses to the record's six states.** Verified,
  Out, Stalled, Refused, Lapsed, None, as the PRD already defines them, in
  place of the provider's eight.
- **The notifications requirement counts twenty-four.** The identity-check
  invitation the worker already sends joins the table. **BREAKING** for the
  requirement's name and its closed set, which read twenty-three.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/vault/valuation-and-offer`: Accept and Decline from the
  collector's page with their confirmations; a lapsed or superseded offer
  read at the read; the offer dialog's bounds, derived figures and gates shown
  before submit.
- `grade10-site/vault/case-lifecycle`: Cancel from the page; the five between
  states and the four endings the page derives and reads in the collector's
  words.
- `grade10-site/vault/loan-and-settlement`: the structured how-to-pay block;
  the repayments list and the final notice on the collector's page; the
  vault and payout dialogs restating their preconditions and what they fix.
- `grade10-site/vault/collector-notifications`: twenty-four messages; what
  each message names, as a table and blocks with the licence footer and the
  complaints contact; the notice's own content.
- `grade10-site/vault/case-intake`: the case reference issued at intake; the
  review step and the collection-statement tick.
- `grade10-site/vault/retention-and-erasure`: the Your data page — retention
  table, identity standing, the erasure ask and its in-flight refusal.
- `grade10-site/vault/documents-and-signing`: the key-terms checklist before
  the loan packet; every signed document in one download.
- `grade10-site/vault/visit-booking`: the visit-booked screen with add to
  calendar.
- `grade10-admin/vault/operator-queue`: counts and the today block; search
  by reference; arrears and held-items tiles; the ordered visit checklist;
  the forfeiture stepper; the identity panel's six states.
- `grade10-admin/vault/money-book`: the kind filter, the net-out figure, the
  takes-back column and the CSV export.

## Impact

- **Collector SPA** — `CaseDetailView`, `RequestWizard`, `VisitBooking` and
  the case list in `packages/vault/frontend`; a Your data page under the
  account; `VaultApi` gains accept, decline and cancel, which the customer
  router already serves.
- **Vault worker** — the reference issued at intake and searchable; the
  detail read carrying the repayments, the notice, the derived fact and the
  reference; a calendar file for a booked visit; a bulk document download;
  the notifications rendered from templates rather than `email/messages.ts`.
- **Console** — the queue, arrears, held-items and money panels, the case
  tabs, the three dialogs and the identity panel in
  `packages/vault/admin-frontend`.
- **Brand data** — `packages/app-env/src/legalIdentity.ts` replaces
  `paymentInstructions` with the FPS id, the bank account and the account
  name; `check:libs` names them until Legal and Finance set them.
- **This store** — `apps/emails/emails/vault/*` as React Email templates on
  the shared shell, the six boards first and the eighteen unillustrated kinds
  on the same shell; the collector's new words in `packages/i18n`; the
  application picks both up with a submodule bump.
- **Contracts** — `packages/vault/contracts` gains the reference, the
  repayments and the derived fact on the detail shape, all additive.
- **Beside this change** — `add-hosted-identity-verification` carries the
  identity-check capability this change's identity panel reads; the six
  states are that page's and this change only shows them. `add-card-grading`
  carries what the grading product needs from the vault.

## Follow-on changes

- The grading product's own use of the vault's custody and visit, carried by
  `add-card-grading`.
- A locker registry, capacity and a stock-take against the shelf, when a
  shop outgrows free-text lockers.
- SMS or WhatsApp reminders once the owner names a provider.
- A renewal: a new offer on the outstanding principal, the day a borrower
  asks to extend.

## Open questions

- **The author's handle** — `@brianchacha6969` has no row in `team.yaml`
  yet; the round that lands this adds one, or the hands are written by
  somebody who has.
- **Legal** — the forfeiture notice's operative wording and the clause it
  cites, the lender's licence line and the complaints contact, and the
  personal information collection statement; each is a `TBC Legal` row on
  [Compliance and Readiness](../../../docs/prds/products/grade10-site/vault/compliance-and-readiness.md#outside-the-code),
  and the templates print bracketed values until they land.
- **Finance** — the FPS id and the bank account the how-to-pay block prints,
  a ❓ on [Loan and Money](../../../docs/prds/products/grade10-site/vault/loan-and-money.md#reading-the-book).
- **Product** — a stock-take sheet and Send notice from an arrears row,
  drawn on the canvas and held as `decisions.md` Q12.

## References

- [Collector Pages · Request wizard](../../../docs/prds/products/grade10-site/vault/collector-pages.md#request-wizard)
- [Collector Pages · Case page](../../../docs/prds/products/grade10-site/vault/collector-pages.md#case-page)
- [Collector Pages · Booking a visit](../../../docs/prds/products/grade10-site/vault/collector-pages.md#booking-a-visit)
- [Collector Pages · Messages](../../../docs/prds/products/grade10-site/vault/collector-pages.md#messages)
- [Case Lifecycle · Timers](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md#timers)
- [Case Lifecycle · Exits](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md#exits)
- [Loan and Money · Records](../../../docs/prds/products/grade10-site/vault/loan-and-money.md#records)
- [Loan and Money · Reading the book](../../../docs/prds/products/grade10-site/vault/loan-and-money.md#reading-the-book)
- [Documents and Signing · Document terms](../../../docs/prds/products/grade10-site/vault/documents-and-signing.md#document-terms)
- [Compliance and Readiness · Retention and erasure](../../../docs/prds/products/grade10-site/vault/compliance-and-readiness.md#retention-and-erasure)
- [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
- [Operator Console · One case](../../../docs/prds/products/grade10-site/vault/operator-console.md#one-case)
- [Identity Check · Identity states](../../../docs/prds/products/grade10-site/vault/identity-check.md#identity-states)
