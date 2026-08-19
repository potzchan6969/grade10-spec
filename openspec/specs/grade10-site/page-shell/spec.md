# grade10-site/page-shell Specification

## Purpose
What every page of the grade10 site is wrapped in: the header a collector
navigates from, the region a surface renders into, and the footer that closes
the page. One shell for the marketing page, the store, the auction, the
profile, sign-in, and not-found, so no surface can ship without the site around
it.
## Requirements
### Requirement: Every surface renders inside the shell

The site SHALL render the header above and the footer below every surface it
answers, including not-found and the state while the session is resolving. A
surface SHALL render into a single content region between them.

The shell SHALL hold no opinion about what a surface renders inside that
region.

#### Scenario: Every address is wrapped

- **WHEN** a collector opens any address the site answers, including one it
  does not recognize
- **THEN** the header and the footer are present, with the surface between them

#### Scenario: The shell is not a page

- **WHEN** a surface renders inside the content region
- **THEN** the shell adds no heading, no copy, and no spacing decision of its
  own to that surface's content

#### Scenario: The page has one of each landmark

- **WHEN** any surface renders
- **THEN** the page carries exactly one banner, one main, and one contentinfo
  landmark, and the surface's content is inside main

### Requirement: The chrome does not wait for the session

The site SHALL render the header and the footer before the session has
resolved. Only the account control's destination SHALL depend on the session.

#### Scenario: A first paint while the session resolves

- **WHEN** a collector opens the site and the session has not yet resolved
- **THEN** the header and the footer are already rendered
- **AND** the content region shows that the surface is loading

#### Scenario: No layout shift when the session arrives

- **GIVEN** a page rendered while the session was resolving
- **WHEN** the session resolves
- **THEN** no chrome control appears, disappears, or moves

### Requirement: The account control leads where the collector can go

The site SHALL show an account control in the header at all times. It SHALL
lead to the profile when the collector is signed in, and to sign-in when they
are not.

Signing out SHALL be offered on the profile, not in the header.

#### Scenario: Signed in

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** they arrive at their profile

#### Scenario: Signed out

- **GIVEN** a collector who is not signed in
- **WHEN** they activate the account control
- **THEN** they arrive at sign-in

#### Scenario: Sign-out has one home

- **WHEN** any surface renders
- **THEN** the header offers no way to sign out
- **AND** a signed-in collector can sign out from their profile

### Requirement: The header shows only controls this site has surfaces for

The site SHALL supply the header a handler only for a control whose surface it
answers, so a control with nothing behind it does not render. Search and cart
SHALL NOT appear until the site answers them.

#### Scenario: Absent surfaces are absent controls

- **WHEN** the header renders
- **THEN** it shows the locale label and the account control
- **AND** no search or cart control appears

### Requirement: A link is present only when the site answers it

The site SHALL show a navigation, utility, footer, or legal link only when its
destination is an address the site answers. A destination that does not exist
yet SHALL be omitted rather than linked to a not-found page.

#### Scenario: Navigation lists real surfaces

- **WHEN** the header renders
- **THEN** every navigation item leads to a surface the site answers

#### Scenario: The footer drops what it cannot reach

- **WHEN** the footer renders
- **THEN** every link leads to a surface the site answers, and a column left
  with no reachable link is absent entirely

#### Scenario: The promo bar and utility row wait for their pages

- **WHEN** the header renders and the site answers none of the utility
  destinations
- **THEN** neither the promotional bar nor the utility row appears

### Requirement: The header marks the surface being viewed

The site SHALL mark the navigation item matching the current surface, and
SHALL mark none when the current address belongs to no navigation item.

#### Scenario: A collector is on a listed surface

- **GIVEN** a collector on a surface the navigation lists, or on any address beneath it
- **WHEN** the header renders
- **THEN** that navigation item is marked as the current page

#### Scenario: A collector is on an unlisted surface

- **GIVEN** a collector on the profile, sign-in, or an unrecognized address
- **WHEN** the header renders
- **THEN** no navigation item is marked as the current page

### Requirement: The shell stays usable at small widths

The site SHALL render the shell without horizontal overflow at a viewport 375
CSS pixels wide, on every surface. Chrome and content SHALL reflow rather than
be clipped, and every control SHALL remain reachable.

#### Scenario: A narrow viewport

- **GIVEN** a viewport 375 CSS pixels wide
- **WHEN** any surface renders
- **THEN** the page scrolls vertically only, with no content clipped and no
  control unreachable

