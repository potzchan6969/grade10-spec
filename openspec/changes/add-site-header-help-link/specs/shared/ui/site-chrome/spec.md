## Feature set

- External links
  - New-tab destinations: a `NavLink` marked `external` opens in a new tab with
    `rel="noopener noreferrer"` in primary nav (wide bar and compact drawer)
    and in the utility strip / compact utility list

## ADDED Requirements

### Requirement: An external link opens in a new tab

A link the application marks external opens in a new tab wherever the chrome
renders it.

**The flag** - `NavLink` SHALL accept an optional `external` flag.

**New-tab destinations** - When a link is marked `external`, `Nav` SHALL render
it with `target="_blank"` and `rel="noopener noreferrer"` wherever that link
appears — primary navigation on a wide viewport, primary items in the compact
menu drawer, the wide utility strip, and utility items in the compact menu.

**Same tab** - When `external` is omitted or false, the link SHALL navigate in
the same browsing context.

**Application decides** - The chrome SHALL NOT invent which links are external
— the application supplies the flag with the link.

#### Scenario: shared-ui-site-chrome-SC-27 - External link opens a new tab
**Serves:** External links - new-tab destinations

- **GIVEN** a primary or utility link marked `external`
- **WHEN** the header renders that link in the primary nav, utility strip, or
  the compact menu
- **THEN** the link carries `target="_blank"` and `rel="noopener noreferrer"`

#### Scenario: shared-ui-site-chrome-SC-28 - Same-tab link stays in place
**Serves:** External links - new-tab destinations

- **GIVEN** a link with no `external` flag
- **WHEN** the header renders that link
- **THEN** the link has no `target="_blank"`
