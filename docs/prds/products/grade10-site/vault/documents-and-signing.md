---
title: Documents and Signing
spec: grade10-site/vault/documents-and-signing
order: 4
---

Signing happens in the shop, on an iPad, with staff present, and every
document is a one-page English PDF the vault renders itself; no e-signature
vendor is involved.

- **Three documents** — the custody agreement on every case, the loan
  agreement second when financed, and the release document at collection as a
  packet of its own
- **A packet is the unit** — prepared, read, consented to, signed and sealed
  as one set; declining withdraws the whole set and is on the record
- **The link** — `grade10.com/vault/sign#<token>`: a **256-bit** token carried
  in the fragment so no server, log or referrer sees it, stored as a digest,
  single-use, **30 minutes**, bound to the first device that opens it
- **The seal** — one transaction over the packet: source bytes re-hashed
  against the digest taken at preparation, a certificate page appended to
  each PDF, one entry anchored in the hash-chained audit log
- **Copies** — a download while the seal's short grant lives, an email with
  the PDFs attached, and the case page itself; every case belongs to an
  account, so every signer has a durable copy path
- **Verification** — anyone holding a PDF's SHA-256 can check it at
  `api.grade10.com/vault/api/documents/verify/<sha256>`; an operator re-checks
  a whole packet from the Documents tab, and the answer is computed fresh
  every time

## What the paper says

| Document | Facts printed | Terms |
| --- | --- | --- |
| Custody agreement | case, customer (the verified legal name), item and category, valued at, held at (the shop by name), dated, complaints | the custodian keeps the item in a secured vault until release; the valuation is what staff recorded and is not an offer to buy; reasonable care while it is held; storage carries no fee; collection in person against a signed release |
| Loan agreement | case, customer, collateral, principal, interest as `X.XX% for a N-day term`, the same rate stated per annum, `Fees: None`, the term as `N days from the Advance Date`, repayable amount, dated, licence, complaints | the lender lends against collateral the custody agreement holds; the term runs from the day the principal is advanced and the date is confirmed in writing then; after it the same daily rate continues, uncompounded and with no further fee; early repayment any day with the term's interest payable in full; release on full repayment; a written notice naming a final date at least **14 days** off before ownership may be taken, and forfeiture is always a person's decision; Hong Kong SAR law; executed by the lender on the advance; the borrower's own line that the key terms were explained before signing |
| Release of custody | case, customer, item, settled (an amount or "nothing was owed"), released, complaints | handed back in the condition inspected; nothing outstanding; the custody agreement ends |

- **Two counterparties** — the custodian signs the custody agreement and the
  release, the lender signs the loan agreement, and the licence prints on the
  lender's paper alone. One function answers what a document may print, so
  every mint path refuses in production while the party it needs is unnamed
  rather than each remembering to ask
- **Held at** — the shop the case is booked at, read from the diary, or one
  the operator names; a packet that can name no shop is refused, by the
  worker as by the console, because an agreement that does not say where the
  item is held is not one anybody can be held to
- **Terms explained first** — the counter records that the key terms were
  explained, with a recording reference where there is one, before a loan
  packet may be prepared; the borrower signs a line saying it happened
- **Signature** — the customer's alone; no staff countersignature or witness
  line, and the loan agreement states that the lender executes it on the
  advance
- **Dates** — through the platform's one date module: a document is dated the
  day it was signed on the shop's own clock, and a deadline names the zone it
  is stated in
- **Not printed** — cooling-off, and a redemption period no regime has named

## Consent and identity on the certificate

- **Two consents** — one e-sign disclosure for the packet, one consent per
  document; both stored as full text and digest, both printed in full on the
  certificate above their digests, and anchored. The certificate says so in
  print: the wording is reflowed to fit the page, and each digest is over the
  stored text rather than over the lines as they appear
- **Wording** — interim English, pending counsel, served by the ceremony from
  one per-brand table with no fallback
- **Certificate** — typed name, consent and signing instants, pages viewed, IP
  and user agent, the verified legal name in full, document type, masked
  number, the verifying staff member's name with their id behind it, the
  full event log, every source digest
- **Name match** — the typed name must be the verified person's; the identity
  is read from the case's binding, never typed by an operator
- **Reuse** — a returning customer's last check can be bound to a new case
  under the same age and expiry refusals, without a new photograph
- **Release** — does not re-check adulthood or document expiry; a lapsed
  passport is no reason to keep somebody's property

:::callout{kind="note"}
English governs the paper. The agreements, the e-sign disclosure, the
per-document consent lines and every email are English, and the certificate
attests to the exact words that were shown; the screen's own chrome speaks
the collector's language. Bilingual templates and consent copy are Legal's to
supply.
:::

## Specs and journeys

**Specs** — this page documents `grade10-site/vault/documents-and-signing`.
The requirements are its; this page holds the decision behind them.

::spec{id="grade10-site/vault/documents-and-signing"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| In-house signing | Decided | No vendor port until a vendor is chosen; an interface with no implementation encodes a guess | Engineering |
| Token in the fragment | Decided | A fragment reaches no server, log or referrer | Engineering |
| Release is its own packet | Decided | A pickup weeks later is a separate execution | Product |
| Executed is two records agreeing | Decided | Packet completed and every document sealed in one transaction; no guard rests on a status alone | Engineering |
| The wording travels with the copy | Decided | The certificate prints the disclosure and consent text, not only their digests | Legal |
| The entity is data, answered once | Decided | Legal name, licence and trading name per brand in one table, read through one function by every path that mints paper, so the production refusal cannot be forgotten at the next one | Engineering |
| The shop is the booked location | Decided | Read from the diary, never typed | Engineering |
| A packet names its shop or is refused | Decided | The worker refuses exactly where the console refuses, so no agreement prints a place nobody can be held to | Product |
| Two entities on the paper | Decided | The custodian on custody and release, the lender on the loan, the licence on the lender's alone; the values are Legal's | Legal |
| The particulars that are computable | Decided | The annualised simple rate, `Fees: None`, Hong Kong SAR governing law, the complaints contact and the early-repayment line print today; the exact wording a regime prescribes is Legal's | Legal |
| Cooling-off | Decided | None: no cooling-off is recalled for a secured loan, and early repayment is open any day | Legal |
| Staff countersignature | Deferred | The borrower signs; the agreement states that the lender executes it on the advance, the certificate names the verifying staff member, and the payout row evidences execution. Reopens if counsel asks, or if the owner's "both sign" means countersign | Legal |
| The terms are explained before the paper | Decided | A recorded event at the counter, an optional recording reference, a refusal to prepare the loan packet without it, and a line the borrower signs; telephony and its storage are a vendor's | Owner |
| Every signer has a copy | Decided | Every case belongs to an account, so the sealed set reaches an address, the case page and the download alike | Engineering |
| Digital signature and timestamp | Decided | The hash chain and the witnessed head stand; RFC 3161 on the head export is the first upgrade if counsel asks | Legal |
| Chinese versions | TBC Legal | Bilingual templates and consent copy, and which language governs; English governs until then | Legal |
| E-sign adequacy | TBC Legal | In person on the iPad, staff present, identity verified, the disclosure and consent printed in full on the certificate | Legal |
:::

:::detail{title="For engineers" for="engineer"}
- **Templates** —
  `packages/vault/backend/src/documents/templates/{custodyAgreement,loanAgreement,releaseDocument,page}.ts`;
  the entity comes from `documents/legalEntity.ts` over
  `packages/app-env/src/legalIdentity.ts`; consent copy in
  `documents/consentCopy.ts`
- **Preparation** — `documents/prepare.ts` resolves the shop from the case's
  `locationId` through the diary outside any transaction, renders, then
  re-derives every printed fact under the case lock and refuses drift; the
  packet's window clears a booked visit
- **Ceremony** — `packages/doc-sign` (refusals, seal, certificate, decline);
  the vault reaches it through `signing.signers` (`vault:read`) and
  `signing.mint` (`vault:operate`)
- **Identity reuse** — `admin.reuseKyc` over the identity store's
  `latestForUser` and `bind`; the verifier's name rides `verifiedByName`
- **Durability** — `sweeps/archive.ts` copies sealed bytes to a delete-less
  archive bucket with digest, `sweeps/integrity.ts` re-hashes 200 rows per
  pass, `sweeps/auditChain.ts` exports verified heads; the bucket lock itself
  is set by hand
- **Audits** —
  [compliance audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md)
  (read as of its date; the checklist is current) and
  [production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md)
:::
