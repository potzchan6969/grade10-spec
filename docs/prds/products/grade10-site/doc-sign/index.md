---
title: Document Signing
icon: signature
---

A customer sits at a counter with an iPad, reads the documents, draws a
signature, and walks away with a sealed PDF carrying a certificate of
completion. It is built and run in house: no DocuSign, no hosted provider.

Two audiences. **A signer** — a customer at the counter, or anyone opening a
link on their own phone — reads every page, gives consent, types their legal
name, and signs. **An operator** — vault staff — prepares the packet, hands over
a QR code or a link, and can later ask for the whole thing to be re-checked from
scratch.

**A packet is the unit.** An ordered set of documents prepared, reviewed, signed
and sealed as one thing. A financed vault customer signs the custody agreement
and the loan agreement in one ceremony: one QR code, one consent per document,
one certificate per document naming the whole set, one audit anchor over all of
it. A release receipt weeks later is a packet of its own, because a separate
visit is a separate execution.

The link carries its token in the URL fragment rather than the path, because a
fragment reaches no server, no log line and no referrer header — a path segment
would reach all four on every refusal. The first device to open it is bound by a
cookie, and turning up later without that cookie is treated as a conflict rather
than as a fresh start.

:::flow{title="Signing at the counter"}
## The operator prepares the packet
Documents are rendered and hashed with no database handle open at all, then
committed under the case's lock — which re-checks the identity gate and the
facts the paper was written from, and voids whatever was already out.
## A link is handed over
The operator mints a ceremony token and shows a QR code or a link. It works
once, and only on the first device that opens it.
## The signer accepts the disclosure
The e-sign disclosure is agreed once for the whole packet, recorded with the
digest of the text that was actually shown.
## Page by page, document by document
Every page must be viewed, then consent given for that document, then the legal
name typed and the signature drawn. Eleven checks run in a fixed order before a
signature is accepted — is the token live, is it this party's turn, has this
party used one name throughout, is that name the verified person's, was every
page read.
## The last mark seals everything
Every source file is fetched and re-hashed before any of them is stamped: one
document whose bytes no longer match refuses the whole packet. Then, in one
transaction, the packet completes, every document gets its sealed file, digest
and instant, the ceremony token is consumed, and one entry anchors the whole
set's fingerprint in the audit chain.
## Either party can re-check it, forever
The re-check reads nothing off a stored answer and caches nothing. It re-derives
the manifest, re-hashes every source and sealed file off the bucket, and
compares the audit anchor against the rows it describes.
:::

Declining withdraws the whole set — there is no way to refuse one document and
leave the rest signable — and it reuses the voided status rather than inventing
a fifth. What tells a decline apart from a staff withdrawal is the trail entry
naming the signer.

:::callout{kind="decision"}
Executed is two records agreeing, never a status on its own: the packet says
completed **and** every document carries the key, the digest and the instant one
transaction wrote. Every guard that rests custody or money on signed paper asks
both, because a status is one column anybody with a connection can write.
:::

:::callout{kind="note"}
No spec covers the ceremony. Nothing in the store describes packets, the
fragment-carried token, device binding, the two kinds of consent, the refusal
ladder, the all-or-nothing seal, the certificate or the erasure vocabulary. The
design lives in the vault's architecture doc and in the host contract written as
prose at the top of the package's own ports file.
:::

:::detail{title="Package design" for="engineer"}
`packages/doc-sign/` owns no database, no bucket and no worker. It publishes
table factories, route registrars, DI modules and a template contract; the host
worker makes them real, which is what lets a seal and a case event commit in one
transaction. The vault is the only host today, and finance is the product it was
made generic for.

Adding a document is a template, not a change to the ceremony. The manifest is
taken over the ordered *source* digests, not sealed bytes — the sealed PDF
prints the manifest on its certificate, so sealing over it would be circular,
and the source is what the signer actually reviewed.

The re-check names eleven findings and an empty list means every leg ran. Its
audit-anchor leg re-derives one entry's link from four rows — the entry, its
predecessor, its successor, and a probe for whether the chain runs on past it —
rather than walking from genesis, which would cost one hash per operator action
the service ever recorded. Erasure overwrites a signer's name with a marker
rather than nulling it, because null is what a party who never typed anything
carries, and an erasure nobody can tell happened is not one.

Background: the Signing section of
[the vault](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
and the audit trail in
[security](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md).
:::
