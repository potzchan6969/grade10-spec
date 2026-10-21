# grade10-site/loyalty/programme Test Cases

**Status:** pending-review · 0/0

## Reconciliation

**Run:** no blind pass — an export rename plus a component redesign:
`MemberCard`, `MemberCardCopy`, `MemberCardProps`, `MemberCardState` and
`MemberCardUse` become `MemberPass`, `MemberPassCopy`, `MemberPassProps`,
`MemberPassState` and `MemberPassVariant`, and the pass
draws the Figma member pass — `displayName`, `expiresIn`, `secondsUnit`,
the `fallbackCode` and `shortCode` copy keys, the `expired` state and the
`used` state leave in favour of `email`, `variant` and `refreshesIn`; the
QR is the code in full — no typed fallback — and it rotates itself out
before it lapses, so there is no expired rendering either; a code the
till takes is answered by rotation, not a frozen used surface. The
requirement and its scenarios are restated.

- **Staying** — `grade10-site-loyalty-programme-SC-123`, `-SC-124`,
  `-SC-125`, `-SC-243` and the expiry-line cases `-SC-185` and `-SC-186`,
  restated under the export list that now names `MemberPass`. The
  `TierCard` scenarios `-SC-255`, `-SC-256` and `-SC-257` stay
  `redesign-tier-card`'s — an id issues once, and this change depends on
  that one.
- **Arriving** — `grade10-site-loyalty-programme-SC-mp2` (the pass encodes
  the consumer's token, never its own), `-SC-mp3` (the variant skin),
  `-SC-mp4` (a fresh code swaps the code area, never snaps), `-SC-mp5`
  (the pass names the member by account email).
- **Proven in the suite** — the code-rotation transition, the
  busy refresh control and the refused-refresh reason are exercised by the
  `MemberPass` block stories (`CodeRotates`, `Refreshing`,
  `RefreshFailed`, `PassNeverMintsItsCode`); they prove a
  rendering, they settle no product rule, so they carry no scenario.
  There is no `used` rendering to exercise — the pass rotates past a
  taken code, and the `store/membership` sibling delta drops the mirror.
