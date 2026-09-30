# Vault and Grading Drafts for Counsel

Drafts of the legal wording the vault and grading print, written 2026-09-30
when the open questions on `complete-vault-collector-flow`, `add-card-grading`,
`vault-walk-ins-and-owners` and `add-item-registry` were answered. The
decisions they serve are on
[Compliance and Readiness](../prds/products/grade10-site/vault/compliance-and-readiness.md)
and [Grading](../prds/products/grade10-site/grading/index.md); each draft is a
readiness item there.

None of this is counsel's. Every statute, section and period named here is
recalled, not verified; Legal confirms each. Every text is English only; the
Chinese version is counsel's. Braces are values the product fills. No licence
number, registered name, mailbox or account appears: each is a field that
refuses in production until a person with the authority sets it.

## Where Each Value Lives

1. **The lender's name, licence wording and number** — per brand in
   `packages/app-env/src/legalIdentity.ts` in the application repository;
   production refuses the offer, the agreement and every money letter while
   unset (Legal)
2. **The FPS id and bank account** — beside them in the same file; every
   production offer refuses while unset (Finance)
3. **The complaints contact** — beside them; a monitored mailbox on the
   brand's domain, a phone and the shop's address; every vault email and paper
   refuses in production while unset (Owner)
4. **Counsel's texts** — the forfeiture notice's operative sentences, the
   collection statement, the escalation line and any prescribed annex, in a
   per-brand, versioned legal-copy table beside `consentCopy.ts`, still to
   build; the record that prints one keeps its version
5. **The notice period for uncollected cards** — the setting
   `grading.notice_period_days`, pinned at signing, seeded at **90** until
   counsel confirms

## Forfeiture Notice

The lapse line turns on the lending regime, still `TBC Legal`, so it has two
readings and counsel keeps one.

> **Notice of default and intended forfeiture**
>
> Case {reference} · {item}
>
> This notice is given by {lenderLegalName} under the clause "{heading}" of
> your loan agreement dated {agreementDate}.
>
> 1. Your loan was repayable by {dueDate} and has not been repaid.
> 2. As at {asAt}, {outstanding} is owed. Each further day adds {perDay},
>    without compounding and with no fee.
> 3. Pay the full amount by {payBy} and the item stays yours to collect in the
>    usual way.
> 4. If the full amount is not paid by {payBy}:
>    - **(A, pawnbroking reading)** the item may be forfeited and become the
>      property of {lenderLegalName}, and the loan is then settled with nothing
>      further owed; or
>    - **(B, money-lending reading)** we may sell the item, apply what it
>      fetches to what you owe and the reasonable costs of the sale, and pay
>      you anything left over. [Counsel: whether a shortfall the sale does not
>      cover stays owed or is written off.]
> 5. Nothing happens automatically. After {payBy} a member of our staff
>    decides; until they do, you may still pay in full.
> 6. This is the last reminder about this loan.
> 7. If you think this notice or the amount is wrong, contact
>    {complaintsContact} before {payBy}.

## Notices Clause

For the loan agreement and the custody agreement. The vault holds no postal
address, so email is the only service it can prove.

> **Notices** — We send notices about this agreement by email to the address
> on your case. A notice is treated as received on the day it is sent. Tell us
> at once if that address changes.

## Licence Line

One per regime, printed after the lender's name.

- **Money lender** — `{lenderLegalName} · Money Lender's Licence No.
  {licenceNumber}`, and, as recalled from the licence conditions, the warning
  `Warning: You have to repay your loans. Don't pay any intermediaries.`
  (`忠告：借錢梗要還，咪俾錢中介`) on the loan paper and any advertisement,
  with the Ordinance's prescribed summary (as recalled, Cap. 163, Schedule 1)
  as an annex to the agreement
- **Pawnbroker** — `{lenderLegalName} · Pawnbroker's Licence No.
  {licenceNumber}`, with the particulars the Ordinance (as recalled, Cap. 166)
  prescribes for a pawn ticket

## Complaints Footer

The contact is the Owner's; the escalation line is counsel's.

> Complaints: {complaintsContact}. If you are not satisfied with our reply,
> you may contact {escalation}.

- **{escalation}** — the regulator for the regime counsel names, and the
  Privacy Commissioner for Personal Data on a matter about personal data
- ❓ Owner — whether the footer promises a reply within a number of working
  days

## Personal Information Collection Statement

One per brand, for every product, versioned. Production refuses the send, and
the walk-in form's open, while it is unwritten; each keeps the version it
showed. Notice is due on or before collection (as recalled, PDPO DPP1(3)).

> **Personal Information Collection Statement** · version {version} · {date}
>
> 1. **Who we are** — {legalName}, and for a loan {lenderLegalName} ("we").
> 2. **What we collect** — your name and contact details; for the vault, your
>    date of birth, identity document details and photograph; photographs and
>    details of your items; and records of your cases, submissions, loans,
>    payments and messages.
> 3. **Why** — to assess, value, store, grade and return your items; to make,
>    run and recover a loan; to check your identity and prevent fraud; to keep
>    the records the law requires; and to handle complaints and disputes.
> 4. **Whether you must give it** — the details we mark as required are needed
>    to provide the service. Without them we cannot accept your item, submit
>    it for grading or make a loan.
> 5. **Who we share it with** — our service providers for hosting, email,
>    payments and logging, who act on our instructions; the grading company
>    you choose; our professional advisers; and courts, regulators and law
>    enforcement where the law requires. Some of these providers keep data
>    outside Hong Kong, including in Singapore and the United States. We do not
>    sell your personal data.
> 6. **How long** — for the time Your data shows for each kind of record,
>    then it is reviewed for deletion.
> 7. **Your rights** — under the Personal Data (Privacy) Ordinance (Cap. 486)
>    you may ask to see and correct your personal data. Write to
>    {privacyContact}. We may charge a reasonable fee for a copy.
> 8. **Direct marketing** — we do not use your personal data for direct
>    marketing unless you give separate consent.

- **{privacyContact}** — the complaints contact unless a data-access contact
  is set

## Submission Agreement, Clause 6

Grading's clause for cards nobody collects, one draft merging the fee, the
lien and the sale.

> Cards not collected incur the storage fee pinned at signing, per card and
> per month, from the day pinned at signing after the ready email, payable
> before collection. Grade10 may keep the cards until the upcharge and the
> storage fee are paid. After written notice on the notice day pinned at
> signing, and the days that notice gives from its posting, Grade10 may sell
> them under the Disposal of Uncollected Goods Ordinance (Cap. 456) and under
> this clause, and holds the proceeds, less what is owed and the sale's costs,
> for the customer.

## Uncollected Cards Notice

Posted by registered post to the address taken at signing and emailed the
same day.

> **Notice of intention to sell uncollected goods**
>
> Submission {reference} · posted {postedOn}
>
> {legalName}, {shopAddress}, holds the cards listed below, which you handed
> in for grading on {handedInOn}. They have been ready to collect since
> {readyOn}.
>
> 1. You owe {owed}: the storage fee to {asAt}{upcharge, if any}. The storage
>    fee continues at {feePerCardPerMonth} per card per month.
> 2. Collect the cards and pay what is owed by {collectBy} ({noticeDays} days
>    from the posting date above).
> 3. If you do not, we may sell the cards under clause 6 of your submission
>    agreement and the Disposal of Uncollected Goods Ordinance (Cap. 456). We
>    will take what you owe and the costs of the sale from what they fetch and
>    hold the rest for you. [Counsel: we sell through our own auction, so the
>    costs are out-of-pocket only, or the commission we keep is stated here.]
> 4. Book a collection at {link}, or contact {complaintsContact}.
>
> {cardSchedule}

- **The sale and the proceeds** — at the brand's own auction, with what is
  left held for the collector for six years; recommendations for
  `dispose-uncollected-cards`, not settled
