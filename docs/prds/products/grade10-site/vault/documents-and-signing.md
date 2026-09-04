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
| Custody agreement | case, customer (the verified legal name), item and category, valued at, held at (the booked shop by name), dated | custody until release; the valuation is for custody and insurance and is not an offer to buy; storage carries no fee and any later charge applies only from notice; collection in person against a signed release |
| Loan agreement | case, customer, collateral, principal, interest as `X.XX% for a N-day term`, repayable by, repayable amount, dated | the item stays in custody; the term's interest is payable even on early repayment and keeps accruing daily after the due date, uncompounded; release on full repayment; forfeiture is decided by a person and never automatic |
| Release of custody | case, customer, item, settled (an amount or "nothing was owed"), released | handed back in the condition inspected; nothing outstanding; the custody agreement ends |

- **Counterparty** — the brand's legal name and licence line where the
  brand's legal identity is set, its trading name otherwise. One function
  answers what a document may print, so both mint paths refuse in production
  while the legal name is unset rather than each remembering to ask
- **Held at** — the shop the case is booked at, read from the diary; a case
  with no booking takes one from the operator, which the console insists on
  before it will prepare. The worker itself does not: with neither, the
  agreement names a store of the brand's and no shop in particular
- **Signature** — the customer's alone; no staff countersignature or witness
  line
- **Dates** — through the platform's one date module in its one zone: a day
  for the dating and the release, a deadline naming UTC for the repayable-by
  instant, so the paper and every console state one instant the same way;
  whether any surface leaves UTC is open on [Vault](/p/grade10-site/vault)
- **Not printed** — an annualised rate, a fee statement, governing law, a
  complaints route, cooling-off

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

:::callout{kind="warning"}
Everything legally operative is English only. Agreements, disclosure, consent
lines and every email are English in the application repository; the
ceremony chrome is half in the catalogue and half English literals; and the
signing link carries no language prefix, so a collector who chose Chinese
signs an English contract under English consent text.
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
| The wording travels with the copy | Decided | The certificate prints the disclosure and consent text, not only their digests | Legal |
| The entity is data, answered once | Decided | Legal name, licence and trading name per brand in one table, read through one function by every path that mints paper, so the production refusal cannot be forgotten at the next one | Engineering |
| The shop is the booked location | Decided | Read from the diary, never typed | Engineering |
| A packet without a shop | ❓ Open | The console will not prepare one, the worker will, and the agreement then names no shop — the same question as whether custody is recorded per shop, open on [Operator Console](/p/grade10-site/vault/operator-console) | Product |
| Lender's legal name and licence | ❓ Open | The values for the table; "Grade10" prints as the trading name until then, and no production packet is possible | Legal |
| Mandatory particulars | ❓ Open | Annualised rate, fees, governing law, complaints, cooling-off, redemption period | Legal |
| Chinese versions | ❓ Open | Bilingual templates and consent copy; which language governs | Legal |
| Staff countersignature | ❓ Open | The notes say both sign; the packet has one signer role, and the ceremony supports a second | Legal |
| Recorded call | ❓ Open | A precondition event carrying a recording reference, its storage and retention class | Owner |
| Walk-in copies | ❓ Open | A recoverable retrieval route for a signer with no account and no email | Engineering |
| Digital signature and timestamp | ❓ Open | PAdES/PKCS#7 and RFC 3161; the certificate is printed text, stated rather than proved | Legal |
| Ceremony chrome and signing-link language | ❓ Open | The remaining English literals move to the catalogue and a case records a locale; needs a submodule bump | Design |
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
