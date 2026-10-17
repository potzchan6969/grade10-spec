# shared/ui/site-chrome Specification

## Feature set

- Header controls
  - Account menu avatar: the profile image where supplied, else the email's initial

## ADDED Requirements

### Requirement: The account menu's avatar shows the profile image

When `session` is `"signed-in"` and `accountEmail` is supplied, the account
menu's small (`xs`) avatar SHALL show `accountAvatarSrc` where it is
supplied, and the initial of the part of `accountEmail` before the `@` where
it is not supplied or fails to load. A failed image SHALL leave no broken
image in the menu.

#### Scenario: shared-ui-site-chrome-SC-49 - Account menu avatar shows the profile image
**Serves:** grade10-site/site/page-shell#grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** `session` is `"signed-in"`, `accountEmail` is supplied, and
  `accountAvatarSrc` is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu's avatar shows that image in place of the initial
- **AND** when the image fails to load, the avatar shows the initial of the
  part of `accountEmail` before the `@`, and no broken image
