---
title: What the Collector Hears
spec: grade10-site/grading/collector-notifications
order: 5
---

Every event on a submission decides one email, or silence on purpose; the
channel is email only, in English, and every message links to the submission
page, which needs no account.

## Messages

🚧 **One decision per event** — the table is the map, written down once so a
new event cannot ship silent:

| Event | Subject | When | Carries | Link |
| --- | --- | --- | --- | --- |
| The plan is saved and the collector leaves without booking | Your submission: 4 cards for PSA Regular | at once, and again as the nudge at day 21; not sent when booked in one sitting | the cards and the declared total, the estimate, the day the plan is kept until and the nudge day | Book the drop-off |
| The plan expires | Your submission list has expired | day 30 with no drop-off booked | nothing paid, nothing owed; start again from the price sheet | Start a submission |
| Drop-off booked | Drop-off booked: Tue 27 Oct 2026, 15:00 | on booking | where, what to bring, the visit's length, the fee, the day the cards leave and the estimate, a calendar file | Open your submission |
| Drop-off moved, cancelled, missed, or the day before | one each, sent by grading | on each event; the reminder the day before | the visit, and on a missed one the line to book again from the page | Open your submission |
| Handed in | Handed in: 4 cards for PSA Regular | at hand-in | the intake receipt: what was paid and the POS reference, the intake ids, the batch's cut-off and ship day, the estimate; the receipt and the signed agreement attached | Open your submission |
| A card withdrawn, or the cards collected | the hand-back receipt | at the counter | the signed receipt attached | Open your submission |
| Batch shipped | Your cards are on their way to PSA | the ship day | the courier and tracking, the grader's order number, the estimate | Open your submission |
| Running late | PSA is running late with your cards | the day the batch is re-estimated, to every collector in it | the grader's stage, the old and the new estimate | Open your submission |
| Grades posted | Grades are in: a PSA 10, two 9s, and one returned ungraded | the morning the grades are read | each card's grade and cert, any upcharge and that it is settled at the counter, any ungraded card with the grader's note, the review line | See the grades |
| A card not back with the box: held by the grader, not returned, or damaged | One card did not come back: Lugia V (Alternate Art) | the day it is recorded at receiving | a held card, the day the grader holds it until; a card not returned or damaged, the payout at declared value and the fee refunded, inside the payout window | Open your submission |
| Ready to collect | Ready to collect: 3 slabs and 1 card | when receiving finishes | the pickup code, the shop's hours, what is due, the vault offer, the uncollected ladder, naming someone to collect and the ID line | Open your submission |
| Still here | Your graded cards are still with us | 30 and 60 days after the ready email | the code, what is due, the storage day and the notice day | Open your submission |
| Storage fee | Your graded cards: a storage fee from today | day 90 | the fee a card a month, what is due, the notice day, the vault offer | Open your submission |
| Written notice | Written notice: collect your graded cards | the day staff post it, from day 180; by email and by registered post | what is due today, the code, the 30 days from the posting date, and clause 6 | Open your submission |

- 🚧 **Silence on purpose** — a card refused at the counter is told at the
  counter and shows on the receipt; naming a collector sends no email, History
  on the page logs it
- 🚧 **The drop-off's messages are grading's** — booked, moved, cancelled,
  missed and the day before are sent by the submission; the diary sends none
  for a product booking — [Appointments](/p/grade10-site/appointment)
- 🚧 **The footer** — the submission id and its summary, the custodian's
  registered name trading as Grade10, the shop and its address, the complaints
  contact, and that dates and times are Hong Kong time
- 🚧 **A failed send is kept** — every message rides the vault's retry ladder
  and parks with its reason —
  [Collector Pages](/p/grade10-site/vault/collector-pages)
- ❓ **Registered post** — whether email alone serves the written notice —
  Legal
- ❓ **The plan's link, when it goes** — sent when the collector leaves the wizard without booking; the server
  cannot see a tab close — Product
- ❓ **Opening hours and the contact** — the diary's weekly rules or a written line; the shop phone or a
  WhatsApp number — Operations
- ❓ **The shop on a plan's letter** — which shop a submission with no visit yet prints — Product

<!-- story: an email in the grading shell, with the footer -->

:::detail{title="Code map" for="engineer"}
- **Vocabulary** — the event-to-message map in
  `packages/grading/backend/src/notify/vocabulary.ts`; copy in
  `email/messages.ts`
- **Retries** — the vault's ladder, instantiated into the grading database
- **Templates** — the grading shell in `apps/emails`
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Every event tells the collector or is decided silent | Decided | One map from event to message; a refused card and a named collector are the two silences, because both are told at the counter or on the page | Product |
| Email only, English | Decided | No SMS and no WhatsApp automation; the console's click-to-chat templates are staff-pressed | Product |
| The link needs no account | Decided | Every message links to the submission page, which the emailed link opens on any device | Product |
| A held card is told in the not-back message | Decided | Told the day it is recorded, with the day the grader holds it until, inside the message for a card not back with the box; the set of messages does not grow for it | Product |
| The notice's channels | ❓ Open | By email and by registered post to the address taken at signing, the day staff post it; whether email alone serves | Legal |
:::
