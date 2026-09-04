---
title: Documents and Signing
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
  the PDFs attached when the case has an address, the case page for account
  holders; a walk-in with no email has no durable copy path
- **Verification** — anyone holding a PDF's SHA-256 can check it at
  `api.grade10.com/vault/api/documents/verify/<sha256>`; an operator re-checks
  a whole packet from the Documents tab, and the answer is computed fresh
  every time

## What the paper says

| Document | Facts printed | Terms |
| --- | --- | --- |
| Custody agreement | case, customer (the verified legal name), item and category, valued at, held at, dated | custody until release; the valuation is for custody and insurance and is not an offer to buy; storage carries no fee and any later charge applies only from notice; collection in person against a signed release |
| Loan agreement | case, customer, collateral, principal, interest as `X.XX% for a N-day term`, repayable by, repayable amount, dated | the item stays in custody; the term's interest is payable even on early repayment and keeps accruing daily after the due date, uncompounded; release on full repayment; forfeiture is decided by a person and never automatic |
| Release of custody | case, customer, item, settled (an amount or "nothing was owed"), released | handed back in the condition inspected; nothing outstanding; the custody agreement ends |

- **Counterparty** — "Grade10"; no legal name, registration or licence number
  on any page
- **Signature** — the customer's alone; no staff countersignature or witness
  line
- **Dates** — `YYYY-MM-DD (UTC)`; the due date is the last millisecond of a
  UTC day, which is 08:00 the next morning in Hong Kong
- **Held at** — always "a Grade10 store vault": the console never sends the
  shop's name, though the case knows the booked location
- **Not printed** — an annualised rate, a fee statement, governing law, a
  complaints route, cooling-off, the lending entity

## Consent and identity on the certificate

- **Two consents** — one e-sign disclosure for the packet, one consent per
  document; both stored as full text and digest, both printed on the
  certificate and anchored
- **Wording** — interim English, pending counsel, served by the ceremony from
  one per-brand table with no fallback
- **Certificate** — typed name, consent and signing instants, pages viewed, IP
  and user agent, the verified legal name, document type, masked number, who
  verified and when, the full event log, every source digest; it prints the
  verifying staff member's raw user id
- **Name match** — the typed name must be the verified person's; the identity
  is read from the case's binding, never typed by an operator
- **Release** — does not re-check adulthood or document expiry; a lapsed
  passport is no reason to keep somebody's property

:::callout{kind="warning"}
Everything legally operative is English only. Agreements, disclosure, consent
lines, every email and the ceremony chrome are English in the application
package, and the signing link carries no language prefix, so a collector who
chose Chinese signs an English contract under English consent text. The
production review calls this a catalogue defect, not a decision.
:::

:::callout{kind="warning"}
The owner's notes require a recorded call explaining the key terms before
signing. Nothing models a call, a recording or a precondition rung for one;
the seal ladder's rungs are token, packet, turn, name, disclosure, document,
identity, verified name, pages viewed and consent.
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| In-house signing | Decided | No vendor port until a vendor is chosen; an interface with no implementation encodes a guess | Engineering |
| Token in the fragment | Decided | A fragment reaches no server, log or referrer | Engineering |
| Release is its own packet | Decided | A pickup weeks later is a separate execution | Product |
| Executed is two records agreeing | Decided | Packet completed and every document sealed in one transaction; no guard rests on a status alone | Engineering |
| Lender's legal identity on the paper | ❓ Open | Whose name, registration and licence print; "Grade10" today while the notes say Finance is a separate entity | Legal |
| Mandatory particulars | ❓ Open | Annualised rate, fees, governing law, complaints, cooling-off, redemption period | Legal |
| Chinese versions | ❓ Open | Bilingual templates and consent copy; which language governs | Legal |
| Zone on the paper | ❓ Open | Hong Kong time instead of UTC | Product |
| Staff countersignature | ❓ Open | The notes say both sign; the packet has one signer role | Legal |
| Recorded call | ❓ Open | A precondition event carrying a recording reference, its storage and retention class | Owner |
| Shop name on the custody agreement | ❓ Open | Read from the booked location; the console sends nothing today | Engineering |
| Walk-in copies | ❓ Open | A recoverable retrieval route for a signer with no account and no email | Engineering |
| Digital signature and timestamp | ❓ Open | PAdES/PKCS#7 and RFC 3161; the certificate is printed text, stated rather than proved | Legal |
:::

:::detail{title="For engineers" for="engineer"}
- **Templates** —
  `packages/vault/backend/src/documents/templates/{custodyAgreement,loanAgreement,releaseDocument,page}.ts`;
  consent copy in `documents/consentCopy.ts`
- **Preparation** — `documents/prepare.ts` renders with no transaction open,
  then re-derives every printed fact under the case lock and refuses drift;
  the packet lives 24 hours
- **Ceremony** — `packages/doc-sign` (refusals, seal, certificate, decline);
  the vault reaches it through `signing.signers` (`vault:read`) and
  `signing.mint` (`vault:operate`)
- **Durability** — `sweeps/archive.ts` copies sealed bytes to a delete-less
  archive bucket with digest, `sweeps/integrity.ts` re-hashes 200 rows per
  pass, `sweeps/auditChain.ts` exports verified heads; the bucket lock itself
  is set by hand
- **Audits** —
  [compliance audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md)
  (blocker prose is pre-fix; the checklist is current) and
  [production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md)
:::
