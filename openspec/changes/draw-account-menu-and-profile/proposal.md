**Author:** @ecchochan - 2026-10-07

## Why

The account menu's avatar shows the sign-in email's initial, while the
profile add-account-profile builds shows the collector's own image. A
collector who sets an image sees it on their profile and never in the
header.

The design-phase asks this change opened are answered as recommended
(decisions Q1-Q5): omit-profile-account-menu and add-account-profile already
ship each other look. What is left to build is the menu avatar.

**Metric:** signed-in collectors with a profile image whose menu shows an
initial instead, down to none.

## What Changes

- **Menu avatar** - the account menu shows the profile's image where the
  collector has one, and the email's initial where they do not

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/site-chrome`: the account menu takes an avatar image
- `grade10-site/site/page-shell`: the site supplies the profile's image to the
  menu

## Impact

- **`packages/ui`** - the site header's account menu
- **`apps/frontend/grade10`** - reads the profile's image for the header
- **Feature changes** - omit-profile-account-menu and add-account-profile ship
  as built and do not wait on this change

## References

- [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)
- [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)
- [Profile · Designs](../../../docs/prds/products/grade10-site/account/profile.md#designs)
