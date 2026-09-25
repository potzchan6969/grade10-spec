# Test Case Conventions

How a case reads in this store. [`specs-to-test-cases.md`](specs-to-test-cases.md) holds the contract — ids, properties, levels, what a case may claim — and this file holds the house style that sits on top of it. `/spec-to-tcs` writes every draft to it; `/tcs-review` restyles drafts to it before a review starts, and adds to it when a review ends.

## How This File Grows

- **Every edit is a candidate** — when a `/tcs-review` ends, each change the reviewer made to a case is offered back as one line: what was changed, and the pattern it suggests. The reviewer confirms, rewords or refuses each one; nothing lands unasked
- **Confirmed lines land under the narrowest scope that fits** — the capability's section unless the reviewer says it holds wider: domain, product, platform, or the whole store
- **Refused lines land under `## Refused`** — the next review reads that section and does not offer the same pattern again
- **One line per convention** — `- <YYYY-MM-DD>, <suite path>: <the pattern, as a rule>`. A line that needs an example names an approved case id rather than pasting one
- **Narrower wins** — a capability line beats a store-wide one for that capability's suites
- **It refines how, never what** — a convention cannot add coverage, loosen "mechanism is yours, coverage is the spec's", licence an invented label, or overrule the contract; a line that contradicts [`specs-to-test-cases.md`](specs-to-test-cases.md) is reported and the contract followed
- **A convention that must hold everywhere is a contract** — it moves to `specs-to-test-cases.md` with a rules revision, and leaves this file
- **`actual` and `deprecated` cases are never restyled to it** — a manual `actual` case only on the reviewer's yes, an `automated` one never

## Store-wide

The lines below came across from `tcs-rules` r3 when this file was split from it.

### Titles

- Five to twelve words, sentence case, naming the behaviour or condition: `Core navigation is accessible before scripts run`
- Not opened with the actor unless the actor is the point; never the journey title; never a trailing `(Negative)`
- Behaviour at a limit says "at the limit" in the title

### Size and shape

- **A case is a run, not a transcribed scenario** — one to four steps, one to three results; a one-step case restating a WHEN left out the arrival and the observation
- **One action per step** — "sign in, open settings, change the password" is three; a continuous flow with one outcome stays one case
- **The arrival may be the first result** — `The listing loads` tells "could not get there" from "wrong"; a case whose results are only the arrival is not a case
- **Plain words, no internal names** — `Click the collection tile`, not `dispatch the tile's click handler`

### Pre-conditions

The concrete setup that produces the scenario's GIVEN, in the environment's terms, one condition per bullet: a manipulated condition (`Network conditions are manipulated to block static styling assets (CSS)`), a stubbed upstream (`The catalogue endpoint is mocked to return a 500`), seeded data (`At least one collection is missing its artwork`), or where the actor already is.

- **State, not actions** — `The admin is on <admin listings url>` is state; `Open the media manager` is a step
- **Specific** — `A user is signed in with <card> saved and is on <listing_4>`, qualified by what the rule needs
- **Domain words, not plumbing** — never an endpoint name, a table or a provider's product
- **Reusable** — the same condition in the same words everywhere it appears
- **Never that the feature exists** — only what state it is in

### Steps and expected results

- **Arrive once** — the first step (`Navigate to <grade10 store url>`) or a pre-condition placing the actor; one or the other, never neither
- **Then look, then act** — `Scroll to the collections section`, `Click the incomplete collection tile`, `Wait for the catalogue request to fail`
- **Results are checkable by looking** — the thing that worked and, where the spec states it, what survived beside it (`Both buttons still work`); none is a step in disguise
- **The UI event, not the spec's UX term** — activate → the click; navigate or render → the browser event; unscoped → `The listing URL names no collection`. Never `affordance`, `unscoped`, `narrowing`, `way on` in a case, even when the spec says them; `e.g.` only where the spec gives the example
- **Few words** — ten per bullet, a step a short imperative; cut `successfully`, `as expected`, `the application`, `the user is able to`; one idea per bullet. Short is not vague: `Hero is missing` is vague, `Hero collapses, page layout intact` is short and checkable
- **Exact about where, open about which** — a step says precisely where a tester looks and what they touch; the values it uses come by name from **Test data**, so the case survives a changed value
- **Interface text only when it is the claim** — quote a label only where the words are what the case verifies; elsewhere name the control by what it does (`the shop button in the hero`), so a copy change does not rewrite the case
- **Before** — step `1. The user is able to open the store front door successfully.`, result `The front door renders successfully, with the marketing hero visible immediately, and both buttons work.`
- **After** — steps `1. Navigate to <grade10 store url>.` `2. Click the shop button in the hero.` `3. Click the auction button in the hero.`, results `Front door renders, hero visible.` `Both buttons open their destinations without JavaScript.`

### Placeholders

- **Self-describing, in the store's words** — `<grade10 browse listing url>`, `<a collection with no artwork>`; never `<url1>`, `<TBD>`, or a bare `<store url>` where the store runs more than one brand
- **For the value, not the thing** — where the spec names a control, name what the tester clicks
- **Consistent within a suite** — one surface, one placeholder
- **Never wrapped, never capitalised** — rewrite the sentence instead

### Test data

- **Readable units, the requirement's unit** — `100 mebibytes`, `30 minutes`; never a rounded megabyte that moves the bound
- 2026-09-25, grade10-site/auction/domain-tcs.md: A value that is not a boundary states an assumption and the range the requirement accepts, for example `HKD 800.00 or JPY 8000 or USD 8.00 (any price > 500 minor units)`. A boundary keeps its exact number and adds a readable reading. An exact reading has no tilde: `1800s (30mins)`. Use `~` only when that reading has a remainder: `1024b (1KiB or ~1KB)`. The exact number stays, so the reading never moves the bound.

### Actors

- **Class, qualifier, place** — `customer(gold member) is on the shopping cart page.`, `admin(holds auction:operate) is on <grade10 auction admin listings url>.` The qualifier carries what the rule under test needs and nothing more; a bare `customer` is right where state does not matter; two of a class are `customer A` and `customer B`

### Classification starting shapes

Starting shapes, not substitutes for reading the case: a core positive path `critical` / `high`; a degradation the journey survives `major` / `medium`; an empty state `normal` / `medium`; a presentational fallback `minor` / `low`; a case run through the interface `e2e`; worth a script and a human eye `automation, manual`.

## Setup Recipes

How to reach a state a case needs, by hand, written once and named from pre-conditions. One `###` per recipe: the state it produces, then the steps, then the environments it holds for.

None yet.

## Where Things Are

The team's names for a surface or a control, and where a tester finds it: `<name> — <page or placeholder>, <where on it>`.

None yet.

## Domains, Products and Capabilities

Lines scoped narrower than the store, one `###` per scope, by its path (`grade10-site/store`, `grade10-site/auction/auction`).

### grade10-site/auction

- 2026-09-25, grade10-site/auction/domain-tcs.md: Two bidders use separate sessions. A maximum is entered in the custom maximum on the bid panel.

## Refused

Patterns a review offered and the reviewer refused, with why; never offered again.

None yet.
