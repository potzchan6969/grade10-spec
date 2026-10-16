# grade10-site/loyalty/programme Test Cases

**Status:** pending-review · 0/0

## Reconciliation

**Run:** no blind pass — an export rename plus a component redesign:
`MembershipSummary`, `MembershipSummaryCopy` and `MembershipSummaryProps`
become `TierCard`, `TierCardCopy` and `TierCardProps`, and the card draws
the Figma tier card — `renewalDate`, `tierValidity` and `balanceExpiry`
leave its props in favour of `variant`, `worth`, `retentionLine`, `earnLine`
and `href`. The requirement and its scenarios are restated.

- **Staying** — `grade10-site-loyalty-programme-SC-123` (two counts apart),
  `-SC-124`, `-SC-125`, `-SC-243`, restated under the new card.
- **Staying, re-owned** — `grade10-site-loyalty-programme-SC-185` and
  `-SC-186` (the expiry line and its warning tone) are restated as rules of
  the membership surface, not of `TierCard`: the card carries no expiry line
  because the whole balance lapses on one shared inactivity date, never in
  parts. ❓ Where the line reads instead is the Tier & Benefits page's
  design 🚧; the cases stand against the surface until it lands.
- **Arriving** — `grade10-site-loyalty-programme-SC-255` (the variant skin),
  `-SC-256` (no threshold, no progress), `-SC-257` (the whole card is the
  link).
