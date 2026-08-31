## Screens

No Figma frame exists for either screen below — the vault has no Figma
coverage today (`manual/products/vault/index.md`: "There is no Figma frame
and no shared UI block for any vault surface either"). Both are new
composition inside existing app-owned pages, from `@grade10/design-system`
primitives only, matching how every other vault screen is built.

### Collector: account storage status (`storage-billing-US-01`, `-US-02`)

New content on `VaultPage` → `CaseList`
(`apps/frontend/grade10/src/pages/vault/CaseList.tsx`), above the case list —
the account-wide landing view, which is the only screen a per-account (not
per-case) fact belongs on. Not a new route.

- **Loaded, in good standing** (`storage-billing-SC-01`, `-05` through `-09`):
  a `Card` stating the account's tier, monthly fee, and (Free tier) that it's
  free. Composed from `@grade10/design-system/components/display/card`
  (`Card`, `CardHeader`, `CardTitle`, `CardContent` — same set `CaseList`
  already imports), `Text`, and `Badge` for the tier name (`display/badge`,
  already in use on this page for case status).
- **Loaded, no payment method on file** (`storage-billing-SC-14`): the same
  card additionally states the accruing balance and that no payment method
  is on file. Use `Badge` variant `default` (the neutral fill) — this state
  precedes any warning (SC-15 hasn't fired yet if the first charge attempt
  hasn't run), so it does not earn `warning` or `error`.
- **Overdue, not yet blocked** (`storage-billing-SC-15`): the notice fires by
  email (`design.md`'s `notify` extension) — this state also needs an
  in-app echo, since a collector opening the vault mid-cycle should see the
  same fact the email told them. Same card, an explicit overdue line stating
  the balance and that continued non-payment will block withdrawal, with
  `Badge` variant `warning`.
- **Blocked** (`storage-billing-SC-16` through `-18`): same card, states
  release is blocked account-wide until the balance is paid, with `Badge`
  variant `error`. This state also has to surface on `CaseDetailView`
  (`apps/frontend/grade10/src/pages/vault/CaseDetailView.tsx`) at the moment
  a collector requests release on a specific case and it's refused for
  `OBLIGATIONS_OUTSTANDING` — that refusal already flows through existing
  case-detail error handling (the failure code is not new, per `design.md`);
  confirm the existing refusal-to-copy mapping has words for this code, or
  add them (see Components below).

No new component or design-system primitive is required for any of the four
states — every element above is `Card`/`Badge`/`Text`/`VStack`/`HStack`,
already imported on this page or its siblings.

### Operator: account billing panel (money-recording, `storage-billing-US-01` through `-03`)

New panel beside `PayoutsPanel`/`MoneyDialog`
(`apps/admin/grade10/src/pages/vault/{PayoutsPanel,MoneyDialog}.tsx`), same
tab set `CaseDetailPanel.tsx` already renders with
`@grade10/design-system/components/display/tabs`. A new "Billing" tab,
account-scoped (reads the same account the case's `userId` resolves to, same
as the collector screen above).

- Shows the current cycle's tier, fee, and every unpaid `storage_charges`
  row (`design.md` Data Model) with its cycle and amount.
- A "record payment" action, gated the same way `MoneyDialog`'s repayment
  action is gated (`vault:payout` — `admin.recordStoragePayment` in
  `design.md`'s Service Interfaces): a dialog taking the amount (must equal
  the quoted outstanding total, refused as `QUOTE_STALE` otherwise, exactly
  as `recordRepayment`'s dialog already behaves) and a method, reusing
  `REPAYMENT_METHODS`' three values and this page's existing money-recording
  dialog pattern rather than inventing a new one.
- Forfeiture screens (wherever `admin.forfeit` is offered, per
  `ADMIN_PERMISSIONS`) need no change: `storage-billing-SC-19` requires a
  storage balance to have zero influence on forfeiture eligibility, so the
  correct UI change here is none — confirm no existing forfeiture screen
  reads `outstandingObligations` for anything beyond financing, and if it
  does, that's a bug this change must not inherit, not a UI task to add.

## Components

Every component above already exists and is already imported on the pages
being extended: `Card`/`CardHeader`/`CardTitle`/`CardContent`, `Badge`,
`Text`, `Button`, `HStack`, `VStack` (all `@grade10/design-system`), `Tabs`
family (admin side only). **Nothing here is `@grade10/ui` or a new
design-system export** — this matches the proposal's own stated impact ("No
design-system or shared-ui impact — the vault has no shared UI block today").

**Verified, not invented:** `Badge`'s variant set
(`packages/design-system/src/components/display/badge.tsx`) already carries
`default`, `success`, `error`, `warning`, `info`, `brand`, `outline` — both
tones this change needs (`warning` for overdue-not-blocked, `error` for
blocked) already exist. No design-system primitive work is required by this
change, and `tasks.md` carries no grade10-spec task for a new Badge variant.

## States

Every state above is tied to a scenario id already in its heading. No state
in either screen lacks a spec scenario behind it — the four collector-screen
states are ordinary (`-01/-05..09`), overdue-not-blocked (`-14/-15`),
blocked (`-16..18`) and error-on-refusal (`OBLIGATIONS_OUTSTANDING`, an
existing failure code, not a new scenario). Loading and error (network/fetch)
states follow this page's existing pattern (`CaseList`'s
`cases.isPending`/`cases.isError` branches) — no new loading/error copy
decisions are introduced by this change beyond what `CaseList` already does.
