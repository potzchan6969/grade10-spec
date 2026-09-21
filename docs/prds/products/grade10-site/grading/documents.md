---
title: Documents and Signing
spec: grade10-site/grading/counter-documents
order: 4
---

Two one-page English documents, each signed on the shop iPad with staff
present and sealed in-house on the vault's ceremony —
[Documents and Signing](/p/grade10-site/vault/documents-and-signing); the
intake receipt between them is issued, not signed.

## The Documents

🚧 **Three papers** — two signed, one issued:

| Document | When | Signed by | Emailed |
| --- | --- | --- | --- |
| Submission agreement | at hand-in, once every card is checked; the fee follows the signature | the collector | with the intake receipt, at check-in |
| Intake receipt | at check-in; issued, not signed | nobody | the checked-in email is the receipt |
| Hand-back receipt | at collection, once the balance is settled and every item is ticked | whoever collects | with the signed document attached |

- 🚧 **The link** — `grade10.com/grading/sign#<token>`, shown on the iPad or
  copied from the console; one document each time, 30 minutes, on the vault's
  token rules
- 🚧 **Your name** — as on the booking; grading needs no ID, and a vault case
  opened on the same visit does
- 🚧 **Postal address** — one line at signing, prefilled from the account,
  kept with the agreement and used only for the written notice under clause 6
- 🚧 **Declining** — withdraws the document and is on the record; nothing is
  paid on a declined agreement, and nothing is handed back on a declined
  receipt
- 🚧 **Copies** — a download after the seal, an email with the signed PDF
  attached, and the submission page itself, each document with its fingerprint

## The Submission Agreement

- 🚧 **Printed** — the submission id, the customer, the postal address, the
  grader and level, the cards as a schedule with each declared value, the
  declared value in total, the fee paid at the counter once signed, the
  estimated return as about N weeks from the day the batch leaves and an
  estimate not a promise, the date on the shop's day, complaints
- 🚧 **Seven clauses** — in the reader's words:
  1. Grade10 submits the cards to the grader on the customer's behalf under
     the grader's own terms, and hands them back in person to the customer or
     a person they name on the submission page, against the pickup code;
     slabs are not shipped
  2. The declared value sets the level and the insured cover; it does not
     affect the grade
  3. The fee is charged whether or not the grader encapsulates a card; a card
     refused at hand-in, or withdrawn before its batch closes, is not charged
  4. Where the grader moves a card to a higher level the difference is payable
     at the counter before collection; the grade is the grader's decision
  5. In transit the cards are covered to their declared value under the
     courier's declared-value cover and the grader's terms; at the shop they
     are kept in the safe and Grade10 holds no separate policy; a card not
     returned, or returned damaged, is settled at its declared value with its
     fee refunded, within 14 days
  6. Cards not collected incur a storage fee of HKD 30 a card a month from
     day 90, payable before collection; after written notice at 180 days
     Grade10 may dispose of them under the Disposal of Uncollected Goods
     Ordinance (Cap. 456) and holds the proceeds less its fees for the
     customer
  7. Governing law Hong Kong SAR; the complaints contact
- ❓ **Custodian registered name** — printed as the party trading as Grade10
  on both documents and every email — Legal
- ❓ **Complaints contact** — printed on both documents and every email —
  Legal
- ❓ **Clause 5** — changes the day a policy is bought; until then the
  courier's cover and the safe's cap stand — Commercial, Legal
- ❓ **Clause 6's wording** — the draft reads "within 90 days of notice"
  where the pages count 90 days from the ready date; the clause and the
  notice are worded together — Legal

## The Intake Receipt

- 🚧 **Carries** — every intake id, the POS reference of the paid order, the
  cards as checked, and the estimated day back; issued at check-in as a
  document and as the checked-in email, with the signed agreement attached

## The Hand-back Receipt

- 🚧 **Printed** — the customer; what was handed back, the encapsulated cards
  with their certs and any card returned ungraded with its code; what was
  settled and how; who collected, the customer in person or the named person,
  and whether an ID was matched to the name with nothing kept; where and when
- 🚧 **Three clauses** — the customer inspected each item and accepted it in
  the condition handed back; nothing is outstanding; the submission is closed
  and the graded record stays on the submission page
- ❓ **The first clause when a named person collects** — names them in the
  customer's place — Legal
- 🚧 **Refused while anything is due** — the receipt cannot be prepared until
  the balance is settled and every item is ticked; sealed, the submission
  closes
- 🚧 **A card held by the grader** — the receipt names the card still out,
  and a second receipt closes the submission
- 🚧 **A slab vaulted instead** — the receipt says the card went to the vault
  rather than the customer

<!-- story: the agreement and the receipt on the iPad -->

:::detail{title="Code map" for="engineer"}
- **Templates** —
  `packages/grading/backend/src/documents/templates/{submissionAgreement,intakeReceipt,handBackReceipt}.ts`;
  the entity from `packages/app-env/src/legalIdentity.ts`
- **Ceremony** — `packages/doc-sign`, its table factories instantiated into
  the grading database
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Two documents, one ceremony | Decided | The agreement and the receipt ride the vault's doc-sign seal; the intake receipt is issued, because a receipt for money already taken needs no signature | Product |
| Signed before any money moves | Decided | The till opens on the sealed agreement, so the collector never pays for cards nobody has checked | Product |
| The postal address is one line | Decided | Taken at signing, prefilled, kept only for the clause 6 notice; no other use | Legal |
| English governs | Decided | The documents and every email are English; the screen's chrome speaks the collector's language, as the vault's does | Legal |
| The bracketed facts | ❓ Open | The custodian's registered name and the complaints contact print on both documents and every email; the receipt's first clause for a named person; clause 6's window | Legal |
| Clause 5 | ❓ Open | Stands as drawn until a policy is bought; the day it is, the clause changes | Commercial, Legal |
:::
