## Screens

### Membership

The member's loyalty home (`Loyalty/Membership/Screens/Membership` —
`apps/preview/src/pages/loyalty/membership/membership-page.tsx`).

### Member pass

The pass dialog the title row's Member Pass button opens
(`membership.member-pass.stories.tsx`).

### Top-up picker, confirming and result toast

The hosted journey `TopUpFlow` plays over the page
(`apps/preview/src/pages/loyalty/top-up-flow.tsx`): the pack picker,
the confirming wait, then the outcome toast on the page itself.

## Components

`SiteHeader`, `Footer`, `NavigationLink`, `Button`, `Dialog`, `Drawer`,
`Toast`, `AsyncMessage` from `@grade10/design-system`; `TierCard`,
`TierInfoCard`, `TierLadder`, `HowPointsWork`, `MemberPass`,
`RewardMenu`, `CouponList`, `PointHistory`, `TopUpPackCard`,
`WalletPassLinks` from `@grade10/ui`. Nothing missing — every surface
here is already drawn in Storybook.

## States

### Membership

| State | Shows | Anchor |
| --- | --- | --- |
| Default | Title row with Member Pass and Top-up Points beside it, separator below; rail naming Overview, Rewards, Coupons, Points History; Overview pane with the tier card, Tiers & Benefits cards and How Points Work — no ladder | `g10.loyalty-membership-page.US1` |
| Top Up | Picker opens over the page from Top-up Points; Pay → confirming dialog; credited pack's toast names the points and the raised balance | `g10.loyalty-membership-page.US1` |
| Narrow | Rail becomes a scrollable row above the content | `g10.loyalty-membership-page.US1` |
| No points | Empty ledger, no coupons, nothing to redeem | `g10.loyalty-membership-page.US1` |

### Member pass

| State | Shows | Anchor |
| --- | --- | --- |
| Default | Tier skin, member email, QR, countdown, wallet actions in a dialog | `g10.loyalty-membership-page.US1` |

### Top-up picker, confirming and result toast

| State | Shows | Anchor |
| --- | --- | --- |
| Confirming | Non-dismissable wait: dialog wide, drawer narrow | `g10.loyalty-membership-page.US1` |
| Points added | Toast: points added, new balance | `g10.loyalty-membership-page.US1` |
| Under review | Toast: charged only if approved, reference, action into Points History | `g10.loyalty-membership-page.US1` |
| Not approved | Toast: nothing charged | `g10.loyalty-membership-page.US1` |
| Payment not completed | Toast: nothing charged, Try again action | `g10.loyalty-membership-page.US1` |
