## Feature set

- Links only to surfaces
  - Store cart control: offers Cart only where the site's drawer can answer it

## MODIFIED Requirements

### Requirement: The header shows only controls this site has surfaces for

The site SHALL supply the header a handler only for a control whose surface it
answers. Cart SHALL appear on a Store surface and checkout, where the site
answers the Store cart drawer, and SHALL remain absent on every other surface.
Search SHALL NOT appear until the site answers it.

#### Scenario: grade10-site-site-page-shell-SC-09 - Absent surfaces are absent controls

- **GIVEN** a collector on a surface other than a Store surface or checkout
- **WHEN** the header renders
- **THEN** it shows the locale label and the account control
- **AND** no search or cart control appears

#### Scenario: grade10-site-site-page-shell-SC-16 - Store surfaces offer Cart

- **GIVEN** a collector on a Store surface or checkout
- **WHEN** the header renders
- **THEN** the Cart control appears
- **AND** no search control appears
