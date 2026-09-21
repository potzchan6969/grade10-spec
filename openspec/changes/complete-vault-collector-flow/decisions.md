## Goals

- A collector answers an offer, cancels a request and asks for the item back from their own case page, each act behind a confirmation naming what it does
- A collector reads the fact their case meets — a lapsed, declined or superseded offer, a missed visit, an ask for the item back, and the four endings — in their own words, derived at the read
- A case carries a six-character reference a person can say at the counter, type as the bank-transfer reference and search by in the console
- A borrower with a live loan reads where to pay, each repayment and what it did, the reminder dates, and the final notice with its date to pay by
- A collector reviews the request and acknowledges the collection statement before sending it, and lands on a booked-visit screen they can put in their calendar
- A collector reads what the vault keeps about them, their identity standing, downloads every signed document at once, and asks to be forgotten from one page
- An operator reads the day's counts, visits, arrears and held items at a glance, sees the rule before the refusal on the three dialogs, ticks the key terms, walks the visit in order and reads forfeiture as four states
- Every collector email names what its board names, as a table and blocks with the lender's footer, from templates in this store
- The identity panel shows the record's six states, and the notifications requirement counts the twenty-four messages the worker sends

## Non-Goals

- A new status for any of the facts the page derives
- SMS or WhatsApp automation; click-to-chat stays staff-pressed
- A second custodian
- Online payment; the borrower pays at their own bank and a treasurer records it
- A signing-room resource in the diary; the vault books one visit and the signing happens inside it
- The operative legal wording counsel owes — the notice's clause, the licence line, the collection statement; it stays bracketed
- Anything the grading product needs from the vault, which `add-card-grading` carries
- A locker registry, capacity, transfers or a stock-take against the shelf

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the collector read when the offer lapsed, was declined or replaced, when a visit was missed, or when they asked for the item back? | The fact, derived at every read from the case, its offer and its visit, in the collector's words with the one thing to do next; the lapsed offer stops reading as a live one | A fifteenth status and its siblings — a cached answer that can be wrong, the reason `overdue` is no status either |
| Q2 | Accept, Decline, Cancel and Ask for it back are on the worker and in the catalogue and not on the page. Wire them, or leave them to the counter? | Wire them, each behind a confirmation naming the total, what a late day costs and what will be signed | The counter alone, which the record already rejects: the collector answers for themselves |
| Q3 | How does a case get a handle a person can use? | A six-character reference from an alphabet that cannot be misread, issued at intake beside the id; additive, the id stays the key and the address | Shortening the id, which is the key and every email's address; prefix search on the uuid, which finds nothing a person can type |
| Q4 | Which alphabet, and does the reference go in the address? | Digits and capitals without 0, O, 1, I and L; the address keeps the id - decided by the round | All 36 characters, which read 0 as O at a counter; the reference in the address, which would rewrite every email link |
| Q5 | How is a borrower told where to pay? | A structured block: the lender's FPS id, its bank account, the case reference as the transfer reference, or card or cash at the counter; on the live loan and in every money message | One free-text instructions field, the standing decision, which nothing renders and no borrower can copy into a bank form |
| Q6 | Where do the repayments and the final notice reach the borrower? | On the case page, with the allocation sentence, beside the email | Email only, which leaves the borrower re-reading a month of mail to know the balance |
| Q7 | What is the wizard's third step? | A review that reads the request back, says what happens next, and takes the tick that the collection statement was read | Sending from the photo step with the statement linked in a footer, which evidences nothing |
| Q8 | Does the tick wait for Legal's statement text? | No; it ships linking the statement page, which reads "Being prepared" until Legal writes it - decided by the round | Holding the step until the wording lands |
| Q9 | What happens after a visit is booked? | A booked screen naming the shop, the slot and what to bring, with add to calendar, move and cancel; add to calendar is a calendar file the phone opens | Returning to the case; a calendar-provider link, which picks a provider for the collector |
| Q10 | Where does the collector read what is kept and ask to be forgotten? | One Your data page under the account: the retention table per class, the identity standing, every signed document in one download, the ask with its in-flight refusal in words | A retention card on the released case alone, with no download and no ask |
| Q11 | What does the console gain? | Counts on every view, a today block, arrears tiles, held-items tiles, a ledger kind filter, the net out of the business, a takes-back column, a CSV export, search by reference | A finance report screen apart from the ledger; a queue with no counts |
| Q12 | The canvas also draws a stock-take sheet and Send notice from an arrears row. In? | ❓ pm - recommended: neither; the sheet belongs to the deferred stock-take, and the notice stays an act on the case | Both as drawn on A02 and A08 |
| Q13 | Does an operator learn a rule from the refusal or before it? | Before it: the make-offer dialog shows the cap, the presets, the derived interest, total, late-day figure and annualised rate and the five gates; the vault dialog its three preconditions; the payout dialog the two people, the due date and the reminder days | The worker's refusal as the only teacher, which it stays behind the display |
| Q14 | How are the key terms recorded as explained? | Five items ticked before the loan packet opens; the recording reference stays optional | The lone reference field, which records that a call happened and not what it covered |
| Q15 | How does a counter of three run the visit? | The Case tab opens on the visit's steps in order, ticked as each act lands, saying why an act is not offered yet; the Custody tab shows forfeiture as past due, notice sent, cure running, a person forfeits | Flat action lists per tab, learned from a manual |
| Q16 | What do the emails carry, and where are they built? | Every message names what its board names — the terms table, the total, the late-day cost, the expiry, how to pay, the reminder schedule, the notice's clause, lapse condition and "a person decides" line, the licence footer and the complaints contact — as React Email templates in this store's `apps/emails` | Copy moved to `@grade10/i18n` alone, inside the four-field shell that cannot hold a table; templates kept in the worker |
| Q17 | Do the emails wait for the licence wording? | No; bracketed values print until Legal's land, which `check:libs` already names | Holding the templates until item 1 closes |
| Q18 | What does the identity panel show? | The record's six states: Verified, Out, Stalled, Refused, Lapsed, None | The provider's eight, which the console shows today and the PRD never defined |
| Q19 | The spec tables twenty-three messages and the worker sends twenty-four. Which is right? | Twenty-four; the identity-check invitation joins the table under `collector-notifications` | Tabling the invitation under `identity-verification`, which would split one closed set in two |
| Q20 | The canvas draws a signing-room resource in the diary. Does the vault book it? | No; the vault books one visit and the signing happens inside it | A second booking per case, which the visit-booking capability refuses |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
