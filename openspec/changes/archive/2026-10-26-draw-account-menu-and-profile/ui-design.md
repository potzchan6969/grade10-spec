## Screens

### Site header - account menu avatar

No Figma frame draws the account menu; Storybook on `main` is the agreed look.

- [Storybook: Account menu, open with profile image](https://storybook.grade10-stg.com/?path=/story/site-page-shell-blocks-siteheader-auction-store-account-menu--with-profile-image)
- [Storybook: Account menu, profile image fails](https://storybook.grade10-stg.com/?path=/story/site-page-shell-blocks-siteheader-auction-store-account-menu--with-broken-profile-image)

## Components

- `SiteHeader` from `@grade10/ui` gains the optional prop `accountAvatarSrc`; the avatar is the existing `Avatar` (`AvatarImage`, `AvatarFallback`) from `@grade10/design-system` at size `xs`
- No new primitive, variant, token or message key

## States

### Site header - account menu avatar

| State | Shows | Anchor |
| --- | --- | --- |
| Profile image | The profile image in the menu's `xs` avatar, above the email | `grade10-site-site-page-shell-SC-79` |
| No profile image | The initial of the email before the `@` in the avatar | `grade10-site-site-page-shell-SC-79` |
| Profile image fails to load | The initial, and no broken image | **Out of suite:** the story's play test (task 1.2); the `SiteHeader` contract scenario is the site-chrome follow-up change's |
| No email supplied | The account label alone, and no avatar | **Out of suite:** the site never reaches it, since a signed-in session always carries an email; the `SiteHeader` contract scenario is the site-chrome follow-up change's |
