## Goals

- The account menu offers Profile by one rule on every surface, the one Q1
  settles, and Page Shell, the page-shell and site-chrome contracts, the app
  and the account-menu stories all state that rule.
- Optional `onProfile` stays on `SiteHeader`, so either answer to Q1 leaves
  it as it is.
- The account menu offers no item beyond its five, and no contract requires a
  My Auction Orders link in it.

## Non-Goals

- Building or finishing the account page at `/profile` -
  `add-account-profile` owns it, and its launch reopens the profile gate.
- Removing `onProfile` or `copy.profile` from `SiteHeader`.
- Renaming `/profile/orders` or changing My Orders gating.
- Cart, Help, or compact-drawer behaviour.
- What opens My Auction Orders - Q13 asks it, and a later change builds the
  answer.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does the menu offer Profile wherever the account page is carried, or never? Carried by Page Shell · Account Menu and the page-shell account-menu requirement. | ❓ product - recommended: Profile joins first wherever the account page is carried, which today is development and staging only, so no public lane shows it; the durable contracts already say this, and the change still lands its withheld-page, Membership and sign-out corrections | Never offering Profile, even once the account page launches - reverses the hide-profile-until-launch decision that Profile is handler-gated, drops the one route to the account page that stays put on every surface, and leaves the Account breadcrumbs on My Auctions and the order pages as the only way in |
| Q2 | Remove `onProfile` from the component, or keep it optional? | Keep optional `onProfile` on `SiteHeader`; Profile renders first whenever it is supplied, and whether Grade10 supplies it is Q1. Carried by Site Header and Footer · Account Entry and the site-chrome account-menu requirement. | Deleting the prop and its render path - rules out the account page's menu item without buying clarity for collectors |
| Q3 | Does this change touch the account page or `add-account-profile`? | No. The account page at `/profile` is carried in development and staging behind its own gate, and `add-account-profile` reopens it on the public lanes; this change touches only the account menu. Carried by the Non-Goals. | Extending or superseding `add-account-profile` - page work is separate from the menu's composition |
| Q4 | Does `/profile/orders` imply a Profile item in the menu? | No. My Orders keeps that path; the path name is not a Profile destination. Carried by Page Shell · Account Menu, the My Orders line. | Dropping or renaming My Orders because the path contains `profile` - order history already answers, and the menu item is My Orders |
| Q5 | Does Membership open the membership page wherever that page is carried, by the rule Q1 settles for Profile? Carried by Page Shell · Account Menu, the Membership line. | ❓ product - recommended: yes, one rule for both account pages, decided with Q1, so the menu never offers an address a lane withholds | Membership waiting for the loyalty programme's own launch change - leaves the menu following two rules for two gated account pages |
| Q6 | With no email supplied, does the menu show the account label without an avatar, as built? Carried by Site Header and Footer · Account Entry, the avatar line. | ❓ design - recommended: yes, the label alone and no avatar, as `SiteHeader` renders it today | An avatar drawn from some other source - none is supplied when the email is missing |
| Q7 | Once Q1 and Q5 are answered, which items does the Auction & Store account-menu story show? Today `Open` shows My Orders, My Auctions, Membership and Sign Out, while staging runs Profile, My Orders, My Auctions and Sign Out, and no story supplies every handler for the site-chrome order. Carried by the account-menu stories, which Page Shell · Account Menu and Site Header and Footer · Account Entry embed. | ❓ design - recommended: restore the with-Profile story under Q1's "wherever carried", supplying every handler so it shows the full order, and drop Membership from `Open` until Q5 lets it join | Leaving `Open` as it is - it shows a Membership item no site supplies and no Profile item staging shows |
| Q8 | Does Profile stay out when `onProfile` is supplied without `copy.profile`, as Membership does without `copy.membership`? | It cannot arise: `SiteHeaderCopy` requires `profile`, so Profile always has its label (`packages/ui/src/blocks/site-chrome/site-header.tsx:39`). Only Membership's copy is optional, so only Membership names both. Carried by the site-chrome account-menu requirement. | Making `copy.profile` optional and gating Profile on it - a second gate on a label every brand already supplies |
| Q9 | Does the account entry still render only when its handler is supplied? | Yes. `Nav` shows its account control only with a handler or an account slot, and `SiteHeader` always supplies one: `onSignIn` signed out, the account menu signed in. Carried by the site-chrome handler-gated feature-set line, which keeps account, and the `Nav` controls requirement. | Dropping account from the handler-gated line - a bare `Nav` would then show an account control with nothing behind it |
| Q10 | Does the account menu link to My Auction Orders, as `grade10-site/auction/auction-orders` still requires? | No. `launch-account-menu-composition` Q7 decided it, and grade10 `05cb3fefa4` removed the link: `SiteShell.tsx:155-171` supplies no orders item, and each Won row opens its own order (`AccountAuctionRecordPage.tsx:448-453`). This change drops the sentence from the auction-orders requirement and corrects Post-Bidding · My Auction Orders. | Keeping the requirement - the contract would require a link the decided menu and the app both leave out |
| Q11 | Does `SiteHeader` keep `onOrders` and `copy.orders`? | No. They come off `SiteHeaderProps` and `SiteHeaderCopy` with their render path, so the menu's five items are the whole set. Nobody supplies them: grade10 dropped them in `05cb3fefa4`, and zzz renders its own header. Carried by the site-chrome account-menu requirement and Site Header and Footer · Account Entry. | Naming a sixth item in the fixed order - keeps a prop for a destination no product offers |
| Q12 | `nav-cart-count-badge` restates the page-shell Account menu line and the site-chrome Handler-gated line in their old wording. Which change carries them? | This one. Feature-set lines fold by label, so a delta that restates an unchanged line reverts whatever folded before it. Handler-gated names the account slot beside the handlers, as `Nav` shows it (`packages/design-system/src/components/layout/nav.tsx:326`). `nav-cart-count-badge` keeps only the lines it changes - Active-line count, Cart slot and Cart count - and its Cart slot line carries the cart slot's own rule (its Q11), so the two changes share no line, in either acceptance order. Recorded in both changes. | Each change carrying the other's lines - couples both to every later edit of either |
| Q13 | Nothing in the site opens My Auction Orders: the menu offers no orders item (Q10) and each Won row opens its own order. Does My Auctions link to the list? Carried by Post-Bidding · My Auction Orders. | ❓ product - recommended: yes, My Auctions links to it, so the list Post-Bidding decides on stays reachable; a later change builds the link | Each Won row as the only way to an order - leaves the list reachable by its address alone |
| Q14 | Does the site ever show the account label in place of the sign-in email? | No. A signed-in session always carries the account's email (`packages/grade10-auth/backend/src/db/schema/index.ts:20`, grade10 `src/root.tsx:367-368`), so the label fallback is `SiteHeader`'s alone, held by the site-chrome account-menu requirement. The page-shell menu requirement drops it with its scenario. Carried by Site Header and Footer · Account Entry, the avatar line. | Keeping the fallback in page-shell - a requirement for a state the site never reaches, tested only by supplying no email |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/site/page-shell | Acceptance review: the decision to never offer Profile rested on there being no Profile page, and the account page exists behind its own gate. Does the menu offer Profile wherever that page is carried, or never? | Q1 |
| grade10-site/site/page-shell | Acceptance review: the membership page is carried behind its own gate as the account page is. Does Membership follow the rule Q1 settles for Profile? | Q5 |
| shared/ui/site-chrome | Acceptance review: with no email supplied, `SiteHeader` shows the account label and no avatar, which no requirement states. Is that the look? | Q6 |
| shared/ui/site-chrome | Acceptance review: the with-Profile account-menu story was dropped before Q1 was settled. Is it restored if Profile stays wherever the account page is carried? | Q7 |
| grade10-site/site/page-shell | QA1 blind pass: the journey fixes Membership in the menu once Store answers, while Page Shell leaves it out of the Account menu line and Q5 ties it to the rule Q1 settles for Profile. If Q1 lands on never, does Membership leave the menu too, and the journey with it? | Q5 |
| shared/ui/site-chrome | QA1 blind pass: Membership joins only with both `onMembership` and `copy.membership`. Does Profile likewise stay out when `onProfile` is supplied without `copy.profile`? | Q8 |
| shared/ui/site-chrome | QA1 blind pass: the proposal's handler-gated line names search, cart, Profile, My Orders and Membership, and drops account from the durable line. Does the account entry still render only when its handler is supplied? | Q9 |
| shared/ui/site-chrome | Acceptance review, second round: Q7 asked only about restoring the with-Profile story, while `Open` also shows a Membership item no site supplies. Which composition does the story show once Q1 and Q5 are answered? | Q7 |
| grade10-site/auction/auction-orders | Acceptance review, second round: the auction-orders requirement still requires an account-menu link beside My Auctions, which the page-shell menu and the app leave out. | Q10 |
| shared/ui/site-chrome | Acceptance review, second round: `SiteHeader` renders a sixth item after Membership when `onOrders` and `copy.orders` are supplied, outside the five-item order. | Q11 |
| grade10-site/site/page-shell | Acceptance review, second round: `nav-cart-count-badge` restates this change's two feature-set lines in their old wording. | Q12 |
| grade10-site/auction/auction-orders | Applying Q10: with the menu entry gone, nothing in the site opens My Auction Orders. | Q13 |
| grade10-site/site/page-shell | QA1 blind pass, third round: one verified email is one account, and the session read carries it, so a signed-in collector always has an email. Does the site ever show the account label in place of the email, or is that fallback `SiteHeader`'s alone? | Q14 |
