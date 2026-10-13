## Goals

- **One avatar** - the account menu shows the collector's profile image, the
  same one the profile shows

## Non-Goals

- **Holding the feature changes** - omit-profile-account-menu and
  add-account-profile ship their interims and archive without this change
- **Which items the menu offers** - Profile and Membership join wherever
  their page is carried, settled in omit-profile-account-menu Q1 and Q5; this
  change asks only how the story shows them
- **Who judges an empty name** - the application refuses it, and save
  stays enabled

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Account menu: with no email supplied, does it show the account label alone with no avatar? | Yes, the label alone and no avatar, as the header draws it today - decided 2026-10-08 by the product manager, as recommended | An avatar from another source, which nothing supplies; or a site-chrome change that owns the look |
| Q2 | Account menu: does its avatar follow the profile's image? | Yes, built in a site-chrome change of its own - decided 2026-10-08 by the product manager, as recommended | The menu keeping the email's initial while the profile shows the collector's image |
| Q3 | Account menu story: which items does the Auction & Store story show? | `WithProfile` supplies every handler and shows Profile, My Orders, My Auctions, Membership and Sign Out; `Open` shows My Orders, My Auctions and Sign Out - decided 2026-10-08 by the product manager, as recommended | Leaving the open story showing a Membership item no site supplies; or only what a carried build runs |
| Q4 | Profile form: are the avatar, its controls and the email row built from the requirements with no frames? | Yes: built from the requirements on the existing avatar and text area primitives. Storybook on `main` is the agreed look, not Figma - decided 2026-10-08 | Waiting for frames nobody has scheduled |
| Q5 | Profile form: does save stay enabled on an empty name? | Enabled, showing the application's refusal - decided 2026-10-08 by the product manager, as recommended | A disabled save, a second judge of the empty name |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/site-chrome | R1 - Account menu with no email supplied: the header shows the account label alone and no avatar. The site never reaches this state, since a signed-in session always carries an email. Options: (a) yes, the label alone and no avatar, as built; (b) an avatar drawn from some other source; (c) defer to a site-chrome change that owns the look. Recommended: (a), since it matches the build and costs one clause in the requirement. Owner: Designer (@tangconst). From: omit-profile-account-menu Q6 | Q1 |
| shared/ui/site-chrome | R2 - Account menu avatar: it shows the email's initial while the profile shows the collector's image. Options: (a) it follows the profile's image, built in a site-chrome change of its own; (b) it keeps the email's initial. Recommended: (a); the change that builds it takes the menu's lines, and add-account-profile edits none of them. Owner: Designer (@tangconst). From: add-account-profile Q15 | Q2 |
| shared/ui/site-chrome | R3 - Auction & Store account-menu story: the open story shows My Orders, My Auctions, Membership and Sign Out, and no story supplies every handler for the full order. Options: (a) restore the story as `WithProfile`, every handler supplied, so it shows the full order, and drop Membership from the open story until a site supplies it; (b) leave the open story as it is; (c) show only what a carried build runs: Profile, My Orders, My Auctions, Sign Out. Recommended: (a), the interim omit-profile-account-menu ships, since the product manager has settled that Profile and Membership join wherever their page is carried. Owner: Designer (@tangconst). From: omit-profile-account-menu Q7 | Q3 |
| shared/ui/store-profile | R4 - Profile form: no frame draws the avatar, its choose and remove controls, its preview or the email row, and the shipped form disables save on an empty display name. Options: (a) build from the requirements on the existing avatar and text area primitives with no frames; save stays enabled and shows the refusal; (b) wait for frames for the avatar, its controls and the email row; (c) keep save disabled on an empty display name. Recommended: (a), so the application is the one judge of an empty name. Owner: Designer (@tangconst). From: add-account-profile Q5 | Q4, Q5 |
