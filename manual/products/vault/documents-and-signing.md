---
title: Documents and Signing
order: 2
---

Signing happens in the shop, on an iPad, with staff present. A packet is prepared
per execution: the custody agreement always, the loan agreement second when the
case is financed, and later — as its own separate packet — the release document,
because a pickup visit weeks after vaulting is a separate ceremony rather than a
continuation of the first.

Staff mint a signing ticket and hand it over as a link or a QR code. The link
carries its token in the fragment, deliberately: a fragment never reaches a
server, so it never lands in a tail worker, in Workers Logs, or in a `Referer`
header on the way to somewhere else. The token is 256-bit random, stored only as
a digest, single-use, valid for thirty minutes, and bound to one browser the
first time it is used.

The collector reads every page, consents per document, and draws or types a
signature. Declining is also on the record — a refusal to sign is an outcome, not
an abandoned session.

The seal is one guarded transaction over the whole packet. Source bytes are
re-hashed against the digest taken when the packet was prepared, a certificate
page is appended, and one sealed entry lands in the hash-chained audit log.

:::callout{kind="decision"}
There is no runtime provider port for an external e-signature vendor. The doc is
explicit about why: an interface with no implementation encodes a guess. If a
vendor is ever chosen, the seam gets written then.
:::

## Checking a signature later

When a signature is questioned, an operator opens the case's Documents tab and
asks to verify the packet. The check re-derives the manifest, re-hashes every
stored file, and re-checks the anchor's chain links with a successor probe,
caching nothing — the answer is computed fresh every time, because a cached
verification is worth nothing. Anyone holding a document's hash can also check
that hash against the public verification route without any access to the case.

:::callout{kind="warning"}
**The compliance audit reads as current and is not.** The document-handling audit
opens by saying the design is not legally deployable and lists nine blockers; its
own sign-off checklist then marks all nine as delivered in code. Treat the blocker
prose as a description of a pre-fix state. What is genuinely still open in that
file are its two lists of what is still owed — archive buckets with bucket-lock
rules, Neon projects provisioned and registered, a green nightly backup and a
first restore drill, the observability key, eight Hyperdrive placeholders, the
font asset per environment, a staging two-factor walk, chain-watcher wiring,
PAdES/PKCS#7 and RFC 3161, the legal disclosure and consent wording, and
jurisdiction, retention and licensing sign-off.
:::

:::callout{kind="warning"}
The ceremony is English only. Its disclosure, decline and download copy plus
twenty-two refusal screens live in the package in English, so the site serves
English to readers who chose traditional or simplified Chinese on that surface.
The production review calls this a defect in the catalogue, not a decision.

Two more named gaps from the same review: a sealed packet's retrieval grant
cannot be recovered without a new backend route, and retention windows are unset
for both brands, so nothing is ever deleted.
:::

:::detail{title="For engineers" for="engineer"}
Signing is `packages/doc-sign`, reached from the vault's admin router through
`signing.signers` (readable with `vault:read`) and `signing.mint` (which needs
`vault:operate`). Doc-sign adds two refusals of its own at the seal, both name
mismatches — between the signer and the packet, and between the signer and the
verified identity on the case.

The release packet deliberately does not re-check adulthood or document expiry.
Refusing to give somebody their own property back because their passport lapsed
while we held it would be wrong.

Detail:
[production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md)
and
[the compliance audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md).
:::
