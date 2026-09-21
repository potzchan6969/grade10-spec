**Author:** @brianchacha6969 - 2026-09-21

## Why

A collector whose offer ran out reads "Offer waiting for you" with nothing to
answer; the same page offers no Accept, Decline or Cancel although the worker
already serves all three; a borrower is told a balance and nowhere to send it;
and a case's only handle is a uuid nobody can read out at a counter. The design
canvas draws the collector flow and the console against the fourteen statuses
and the policy numbers the code runs: it adds surfaces and words, not a machine.

**Metric:** share of offers answered from the collector's own case page rather
than at the counter, and share of live loans whose repayment arrives under the
case reference. Both read zero today, because neither act exists.

## What Changes

- **The case page does what the record says** — Accept, Decline, Cancel and
  Ask for it back, each behind a confirmation naming the total, what a late
  day costs and what will be signed
- **The page reads the fact the case meets** — a lapsed, declined or
  superseded offer, a missed visit, an ask for the item back and the four
  endings, in the collector's words, derived at the read; a stepper and a
  chip say where the case stands and whose the item is; no status is added
- **A case gets a reference a person can use** — six characters that cannot
  be misread, unique per brand and never reused, issued at intake beside the
  id, which stays the key and the address
- **A borrower is told where to pay** — a how-to-pay block: the lender's FPS
  id, its bank account under the lender's registered name, the case reference
  as the transfer reference, or card or cash at the counter; on the live loan
  and in every money message. **BREAKING** for the standing decision that how
  to pay is one free-text field
- **A live loan shows its repayments and its final notice** — each repayment
  with its value date, method and the balance after it, the reminder dates,
  and the notice's date to pay by
- **The wizard reviews before it sends** — a third step reads the request
  back, says what happens next, and takes the collection-statement tick
- **A booked visit gets its own screen** — the shop, the slot, what to bring,
  add to calendar as a file that replaces its predecessor and is withdrawn on
  a cancel, move and cancel
- **The collector has a Your data page** — what the vault keeps and for how
  long, the identity standing, every signed document in one bounded and
  recorded download, and the ask to be forgotten, filed there by the
  collector and cancellable inside the seven days
- **The console reads the day at a glance** — a count on every view, the
  Today cut in slot order, arrears summed, held-items tiles, a ledger kind
  filter, the net out, a bounded and recorded CSV, search by the reference
- **The console says the rule before the refusal** — the three dialogs state
  their bounds and preconditions; the key-terms dialog ticks the agreement's
  own terms; the Case tab walks the visit in order; Forfeit is withheld with
  its reason in words
- **Every collector email is a table-and-block message** — the figures as a
  table, how to pay, the reminder schedule, the notice's clause and "a person
  decides" line, the licence footer and the complaints contact; letters the
  worker renders, aligned with the preview source in this store's
  `apps/emails`; production refuses the act that would print a value Legal
  owes while it is unset, and brackets print outside production only
- **The identity panel collapses to the record's six states**
- **The notifications requirement counts twenty-four** — the identity-check
  invitation joins the table. **BREAKING** for the requirement's name and its
  closed set, which read twenty-three

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/vault/valuation-and-offer`: Accept and Decline from the page
  with their confirmations, and a superseding offer read and answered
- `grade10-site/vault/case-lifecycle`: Cancel from the page; the fact the
  case meets and the four endings, derived at the read
- `grade10-site/vault/loan-and-settlement`: the how-to-pay block, the
  repayments and the notice on the page, and the rule shown before the act
  on the three dialogs
- `grade10-site/vault/collector-notifications`: twenty-four messages, each a
  table and blocks with the footer, and the notice's own content
- `grade10-site/vault/case-intake`: the case reference issued at intake, and
  the review step with its tick
- `grade10-site/vault/retention-and-erasure`: the Your data page — the
  retention table, the identity standing, the ask and its refusal
- `grade10-site/vault/documents-and-signing`: the key-terms dialog on the
  agreement's own terms, and every signed document in one download
- `grade10-site/vault/visit-booking`: the booked screen and its calendar file
- `grade10-admin/vault/operator-queue`: counts and the Today cut on the
  landing view, search by reference, the visit checklist, Forfeit withheld
  in words, the identity panel's six states
- `grade10-admin/vault/money-book`: the kind filter, the net-out figure, the
  CSV, and the arrears summed
- `shared/auth/users`: the account holder files and cancels their own
  erasure request

## Impact

- **Collector SPA** — `packages/vault/frontend`: the case page, the wizard,
  the booking, the case list and a Your data page under the account
- **Vault worker** — `packages/vault/backend`: the reference, the detail read,
  the calendar file, the bounded downloads, the letters in `src/email`
  replacing `email/messages.ts`
- **Console** — `packages/vault/admin-frontend`: the queue, arrears,
  held-items and money panels with the takes-back column, the case tabs, the
  three dialogs and the identity panel
- **Auth worker** — the self-service filing and cancelling of an erasure request
- **Brand data** — `packages/app-env/src/legalIdentity.ts` replaces
  `paymentInstructions` with the FPS id and the bank account; `check:libs`
  names them until Finance sets them
- **Contracts** — `packages/vault/contracts`: the detail shape gains the
  reference and the derived fact; `paymentInstructions` is replaced by the
  structured block, **BREAKING** for the collector SPA's case mapper, its
  model and its fixture transport
- **This store** — `apps/emails` gains the vault preview letters and
  `packages/i18n` the collector's new words; a submodule bump carries both
- **Beside this change** — `add-hosted-identity-verification` owns the six
  identity states this change only shows; `add-card-grading` carries what the
  grading product needs from the vault

## Follow-on changes

- The grading product's own use of the vault's custody and visit, carried by
  `add-card-grading`
- A locker registry, capacity and a stock-take against the shelf, when a
  shop outgrows free-text lockers
- SMS or WhatsApp reminders once the owner names a provider
- A renewal: a new offer on the outstanding principal, the day a borrower
  asks to extend

## Open questions

- **The author's handle** — `@brianchacha6969` has no row in `team.yaml`;
  the round that lands this adds one
- **Legal** — the notice's operative wording, the licence line, the
  complaints contact and the collection statement; each a `TBC Legal` row on
  [Compliance and Readiness](../../../docs/prds/products/grade10-site/vault/compliance-and-readiness.md#outside-the-code)
- **Finance** — the FPS id and the bank account, a ❓ on
  [Loan and Money](../../../docs/prds/products/grade10-site/vault/loan-and-money.md#reading-the-book)
- **Product** — a stock-take sheet and Send notice from an arrears row,
  held as `decisions.md` Q12

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
- [Compliance and Readiness · Before the first production case](../../../docs/prds/products/grade10-site/vault/compliance-and-readiness.md#before-the-first-production-case)
- [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
- [Operator Console · One case](../../../docs/prds/products/grade10-site/vault/operator-console.md#one-case)
- [Identity Check · Identity states](../../../docs/prds/products/grade10-site/vault/identity-check.md#identity-states)
- [Account Data · Erasure](../../../docs/prds/platform/account-data.md#erasure)
- [Users · Erasure](../../../docs/prds/products/shared/auth/users.md#erasure)
