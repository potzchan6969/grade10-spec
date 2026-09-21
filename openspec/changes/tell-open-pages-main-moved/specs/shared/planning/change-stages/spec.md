# shared/planning/change-stages Specification

## ADDED Requirements

### Requirement: An open page is told when `main` moves

A page somebody already has open says when `main` has moved past what it shows,
and catches up without being reloaded by hand.

- **Told at once** — a page open while `main` moves SHALL show one notice
  naming the landed commit's subject and how long ago it landed, and SHALL keep
  one notice, naming the latest commit, however many land before it catches up
- **Refreshed on demand** — the notice SHALL offer one action that re-reads the
  page at once
- **Caught up on its own** — the page SHALL show what landed once the snapshot
  it is served is built from `main`, and SHALL drop the notice then
- **Still behind** — ten minutes after it was told, the notice SHALL say the
  site has not caught up and SHALL NOT say the site refreshes itself
- **Never under a reader who is typing** — the page SHALL NOT replace what it
  shows while a text field has focus, and SHALL do it once focus leaves
- **Nothing to tell it** — a page with no source for what `main` is on SHALL
  show no notice, SHALL read as it does when nothing has moved, and SHALL
  report no error
- **Behind, in a checkout** — the locally run manual SHALL say how many commits
  behind `main` the checkout is, and SHALL say nothing where the checkout is
  level with `main` or has nothing to compare against
- **Origin cannot be read** — the locally run manual SHALL keep the last
  counts and SHALL say when it was last read
- **Pulled on one action** — it SHALL fast-forward the checkout on one action
  and show what those commits landed
- **Refused, never decided** — it SHALL refuse the pull, naming what is in the
  way, where the tree holds uncommitted work or the checkout holds a commit
  `main` does not, and SHALL leave the checkout as it was

#### Scenario: shared-planning-change-stages-SC-72 - A page open while `main` moves is told and refreshes when caught up
**Serves:** shared-planning-change-stages-US-10 - the teammate answers on what landed, on the page they already had open

**GIVEN** a page open on the hosted manual, served the snapshot built from the commit `main` is on
**WHEN** a commit lands on `main`
**THEN** the page SHALL show one notice naming that commit's subject and how long ago it landed
**AND** a second commit landing before the page catches up SHALL leave one notice, naming that later commit
**AND** the notice SHALL offer one action that re-reads the page at once
**AND** the page SHALL show what landed once the snapshot it is served is built from the latest commit, and SHALL drop the notice
**AND** ten minutes after the page was told, the notice SHALL say the site has not caught up and SHALL NOT say the site refreshes itself
**AND** the page SHALL NOT replace what it shows while a text field has focus, and SHALL do it once focus leaves

#### Scenario: shared-planning-change-stages-SC-73 - The locally run manual says how far behind and pulls
**Serves:** shared-planning-change-stages-US-11 - the teammate reads what landed without leaving the page for a command

**GIVEN** the manual run from a clean checkout that `main` has moved past
**WHEN** the teammate reads the page
**THEN** it SHALL say how many commits behind `main` the checkout is
**AND** one action SHALL fast-forward the checkout and leave the page showing what those commits landed
**AND** a checkout level with `main`, or one with nothing to compare against, SHALL show no count and no notice
**AND** a checkout whose fetch of `origin` fails SHALL keep the last counts it read and say when they were last read

#### Scenario: shared-planning-change-stages-SC-74 - Pull is refused on a dirty or ahead checkout
**Serves:** shared-planning-change-stages-US-11 - the teammate's own work is never decided for them

**GIVEN** the manual run from a checkout behind `main` that holds uncommitted work, or holds a commit `main` does not
**WHEN** the teammate reads the page
**THEN** it SHALL refuse the pull and name which of the two is in the way
**AND** the checkout SHALL be left as it was, with nothing committed, stashed, merged or rebased

#### Scenario: shared-planning-change-stages-SC-75 - No relay, no banner
**Serves:** shared-planning-change-stages-US-10 - the teammate reads the page as they do today wherever nothing can tell it

**GIVEN** a page open on the hosted manual with no source for what `main` is on
**WHEN** a commit lands on `main`
**THEN** the page SHALL show no notice
**AND** the page SHALL read as it did before the commit landed, and SHALL report no error
