---
title: Documents Service
order: 1
---

## Values

| Area | Documents |
| --- | --- |
| Collection | the collection statement |
| Vault | custody agreement, release receipt |
| Finance | loan agreement, key terms record |
| Grading | submission agreement, intake receipt, hand-back receipt, withdrawal receipt |
| Consignment | consignment agreement, consignment receipt, return receipt, payout statement |
| Partner | master agreement, deal schedule |
| Transit | packing list, delivery note; never signed |

## One Service

- **Its own** - the documents service keeps every template, packet, signer,
  signature and sealed file in its own schema and bucket, inside the
  commerce wall; it keeps a signer's name, email and phone and only a
  masked ID number - [Account Data](/platform/account-data#postgres-by-default)
- **One signing address** - `grade10.com/sign#<token>`; the vault's and
  grading's signing addresses lead to it
- **The ceremony stands** - the packet, the consent, the refusal ladder, the
  seal and the re-check run as they do for the vault today -
  [Document Signing](/p/grade10-site/doc-sign)
- **A service asks** - a vault case, a grading submission, a consignment or
  a deal prepares a packet for its subject, hands over the link or QR code,
  and is told when it is sealed
- **Signed paper is asked for** - an act resting on signed paper asks the
  documents service whether the packet is executed, at the moment of the act

## Templates

- **By area** - each template belongs to one area in the table above
- **Versions** - a template changes by a new version; a sealed document keeps
  the version it was signed on
- **Approved by Legal** - production refuses to seal a version nobody
  approved; outside production it seals with a bracket, as grading's
  placeholders print
- **Any document** - an admin prepares any approved template for a person,
  an item or a deal and has it signed, such as a partner's master agreement

## Testing Documents

- **Every template, rendered** - with sample data in staging, page by page
- **A sandbox ceremony** - signs and seals with no real person, kept apart
  from real packets
- **A new version shows its difference** - against the version in use,
  before Legal approves it

## Moving the Vault and Grading

- **Consignment first** - consignment starts on the service -
  [Consignment](/p/grade10-site/consignment)
- ❓ Engineering - **When the vault and grading move** - their packets
  copied with their seals and anchors, and their signing addresses led to
  the new one

:::detail{title="Product decisions" for="pm"}
Signing is a library each product builds into its own schema: the vault
and grading each hold their own packets, templates and signing address.
Consignment, partner deals and a winner keeping a lot in the vault each need
signed paper next, and each would build the same tables a third and a fourth
time, with nowhere to test every template at once. The owner asks for one
document service any service can use. The design is
[Inventory and Services Design](/references/inventory-and-services-design).

**Users.** Signers, at the counter or on their own phone; staff, who prepare
and hand over packets; Legal, who approves templates; QA, who tests every
template in one place.

**Not in scope.** An outside e-signature provider; signing by a staff member
for the house; documents nobody signs beyond the transit papers.

**Measurement.** Templates sealed in production without an approved version,
held at zero; packets re-checked with no finding.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A service of its own | Decided | doc-sign becomes the documents service, as the KYC service left the vault; this replaces the rule that a seal and its case event commit in one transaction with an act that asks whether the packet is executed - decided under the owner's delegation, 2026-10-08, on the owner's suggestion | Engineering |
| One signing address | Decided | `grade10.com/sign`, so a signer meets one ceremony whatever they sign - decided under the owner's delegation, 2026-10-08 | Product |
| Templates approved by Legal | Decided | Production refuses to seal an unapproved version, as grading refuses a placeholder - only Legal approves a version - decided by the owner, 2026-10-08 | Legal |
| Who prepares any document and who approves | ❓ Open | Only Legal approves a template version; admins prepare any document under a grant of their own; a Legal member may approve their own draft - taken by engineering while fixing review findings, 2026-10-11 | Legal |
| When the vault and grading move | ❓ Open | After consignment ships on the service | Engineering |
| A sandbox run on an unapproved version in production | ❓ Open | Refused when the sandbox packet is prepared, before a sample person signs; the design shows the run stopped at the seal - taken by engineering while building the service, 2026-10-10 | Legal |
| Who vouches for an admin's signer | ❓ Open | The identity check the host recorded the last time the person signed, until the KYC store mints an entrypoint for consignment - taken by engineering while building the service, 2026-10-10 | Engineering |
| What an admin's any-document dialog prepares | ❓ Open | The partner master agreement and the deal schedule, whose data the dialog asks for; a template a service's record fills, such as the consignment agreement, is shown held and prepared from its consignment - taken by engineering while building the console, 2026-10-10 | Product |
| Where the signing address is carried | ❓ Open | `/sign` waits on a documents gate of its own, open on the lanes the consignment worker runs on and shut on UAT and production until it launches - taken by engineering while building the site, 2026-10-10 | Engineering |
:::
