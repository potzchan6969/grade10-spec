**Author:** @rita-liu - 2026-09-11

## Why

An operator holding a ticket that names a person cannot find them. The user
directory matches an email fragment or an exact user id and nothing else, so a
name matches nothing — while the loyalty finder on the next page over already
prefix-matches name or email. The directory cannot be narrowed either: it lists
every account newest-first, a page at a time, so *who holds `admin` right now*
is a question no operator surface answers. And an account's roles, standing and
sessions each sit behind a separate confirmation, with nothing that shows one
account whole.

Two surfaces already exist for a person and neither is this one. The loyalty
record holds points, tiers and redemptions and carries no role, standing,
second factor or session. The grants page says what a role can do and not who
holds it. The directory is where access lives, and it is the weakest of the
three.

**Metric:** answer *who holds `admin` right now* and *which account is the
person on this ticket* from the directory alone.

## What Changes

- **The directory is the access desk** — it answers who holds what, and carries
  the grant, standing and session moves. The loyalty record stays where it is;
  the two link rather than merge.
- **Search matches a person** — name as well as email, without letter case,
  alongside opening an account by user id.
- **The directory narrows** — by role, by standing, and by whether the email is
  verified, with the operator choosing the order the accounts come back in.
- **An account opens beside the list** — one panel carrying identity, the grants
  the account actually holds with elevated ones marked, standing with the reason
  it was set, and each session with where it was raised. Roles are changed in
  the panel; ban, unban and erasure keep their confirmation, because they cannot
  be undone from the panel.
- **Only permitted moves appear** — sessions, ban and unban join roles and
  delete in appearing only when the console supplies a handler, so an operator
  is never offered a move the server will refuse.
- **An account has an address** — one address opens its panel, and a search and
  a page position survive being pasted to a colleague.
- **The panel reaches the rest of the person** — the loyalty record when the
  account is a customer, and what the account has done.

New component exports: `UserAccountPanel` and `UserDirectoryFilters`, with
`UserAccountPanelProps`, `UserAccountPanelCopy`, `UserDirectoryFiltersProps`,
`UserDirectoryFiltersCopy`, `UserFilterOption`, `UserFilterGroup`,
`UserGrantRow`, and `UserDirectoryOrder`. None of them exist yet. The roles
dialog and the sessions dialog stay exported, so a console that renders no
panel keeps working.

`add-admin-roles-and-permissions-page` is unarchived and has already issued
`shared-console-user-directory-SC-11` through `-SC-13` and `-US-03`. This change
starts that capability at `-SC-14` and `-US-04`; neither set moves.

## Non-Goals

- Changing grants, roles, or the role vocabulary; editing any of them here.
- A ban that expires on its own — a ban lasts until an unban, as it does today.
- Impersonating a person, setting a password, or editing an email or a name.
- Creating an account here; provisioning stays where it is.
- Acting on more than one account at once, and exporting the directory.
- Any change to the loyalty record, or to what it shows.
- Wiring the ZZZ console. The components gain the panel and the filters; that
  console adopts them when it chooses.

## Capabilities

### New Capabilities

- `grade10-admin/console/user-directory`: the page — which accounts it offers,
  how an account is addressed, the grants it resolves, and where it hands the
  operator on to.

### Modified Capabilities

- `shared/auth/users`: search matches name as well as email, the caller may
  narrow the directory and choose its order.
- `shared/console/user-directory`: the export set gains the panel and the
  filters; sessions, ban and unban become handler-gated; the panel, the grant
  rows, the session detail, and the filter vocabulary are new requirements.

## Impact

- **grade10:** the users page and its section; the directory read behind it;
  the panel, the filters and the widened session rows in the console package;
  the grant rows resolved from the shipped role map; the address the audit trail
  already links with.
- **grade10-spec:** the three deltas above, and the manual pages for the two
  shared capabilities plus a page for the new one.
- **zzz-admin:** none required. The shared exports grow; nothing it renders
  changes.

## Follow-on changes

- An account's own page, if the panel proves too small for what an operator
  needs open at once.
- Retiring the roles and sessions dialogs once every console reads an account
  in the panel.
- A person's orders, bids and vault cases, each reachable from their account.
- Acting on several accounts at once, once the directory can narrow to the set
  an operator means.
- A ban that ends on a date without an operator remembering to lift it.
