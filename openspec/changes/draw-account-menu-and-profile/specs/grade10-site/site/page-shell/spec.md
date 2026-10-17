# grade10-site/site/page-shell Specification

## Feature set

- Account control
  - Account menu avatar: the collector's profile image, else their email's initial

## ADDED Requirements

### Requirement: The account menu shows the collector's profile image

Wherever the site carries the account page, the account menu's avatar SHALL
show the image the collector chose on their profile, and the initial of their
sign-in email where they have none or it fails to load.

#### Scenario: grade10-site-site-page-shell-SC-79 - Account menu shows the profile image
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector who chose a profile image
- **WHEN** they activate the account control
- **THEN** the menu's avatar shows that image, then the email, above the items
- **AND** once they remove the image, the menu's avatar shows their email's initial
