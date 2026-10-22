# Test Case Conventions

How a case reads in this store. [`specs-to-test-cases.md`](specs-to-test-cases.md) holds creation, coverage, traceability, lifecycle and validation; this is the one shared file for writing style. `/spec-to-tcs` writes every draft to it; `/tcs-review` restyles drafts to it before a review starts, and adds to it when a review ends. No other file may define a competing writing convention.

## How This File Grows

- **Only a reusable writing rule is a candidate** — when a `/tcs-review` ends, offer a convention only when a confirmed, reusable rule about how a case is written emerged. A case-specific edit, product fact, or style change with no reusable rule produces no candidate and no convention follow-up
- **A fact is not a candidate** — a change naming one product's page, control, label, status value or behaviour, where a value is read, or how a state is reached stays in the case it was made to, and is not offered. `## Setup Recipes` and `## Where Things Are` take no line from a review
- **A confirmed line has store-wide scope by default** — it lands under `## Store-wide` unless its wording is explicitly domain-specific. How that scope is applied to existing cases follows **A confirmed line applies at once** below
- **Refused lines land under `## Refused`** — the next review reads that section and does not offer the same pattern again
- **One line per convention** — `- <YYYY-MM-DD>, <suite path>: <the pattern, as a rule>`. A line that needs an example names an approved case id rather than pasting one
- **Narrower wins** — a capability line beats a store-wide one for that capability's suites
- **It refines how, never what** — a convention cannot add coverage, loosen "mechanism is yours, coverage is the spec's", licence an invented label, or overrule the contract; a line that contradicts [`specs-to-test-cases.md`](specs-to-test-cases.md) is reported and the contract followed
- **A convention that must hold everywhere is a contract** — it moves to `specs-to-test-cases.md` with a rules revision, and leaves this file
- **A confirmed line applies at once** — when the review that confirmed it ends, apply it to the reviewed suite's remaining drafts and its manual `actual` cases. A same-domain propagation may update other cases in a separately listed style-only follow-up, preserving purpose, expected results, trace, status, test-data meaning and automation links; a semantic change waits for that suite's review. A suite outside the domain takes it at its next generation or review. The pull request's description lists every case it changed; the conversation does not
- **`automated` and `deprecated` cases are never restyled to it** — an `automated` case changes only with its behaviour, a `deprecated` one never

## Before Adding a Convention

Every candidate from a review passes this gate before it is offered to the reviewer.

1. **Classify the candidate** — confirm that it changes only how a case is written: title, wording, step shape, result shape, pre-condition, placeholder, test-data presentation, actor wording or layout
2. **Check the core rulebook** — compare it with [`specs-to-test-cases.md`](specs-to-test-cases.md). A candidate that changes anchors, formal coverage, scenario links, case ownership, suite levels, lifecycle, export eligibility, validation or the number of cases is a core-rule change, not a convention
3. **Check existing conventions** — search `## Store-wide`, the applicable scope under `## Domains, Products and Capabilities`, and `## Refused`. A duplicate, narrower conflict or refused pattern is not offered silently
4. **Resolve conflicts explicitly** — a direct contradiction is reported to the reviewer with both rules named. The existing core rule wins; no new convention is written until the core rule is changed through its governance path
5. **Record one line only after consent** — confirmed rules use the existing dated-line format, with the scope and reason when narrower than store-wide

## Store-wide

The lines below came across from `tcs-rules` r3 when this file was split from it.

### Titles

- Five to twelve words, sentence case, naming the behaviour or condition: `Core navigation is accessible before scripts run`
- Not opened with the actor unless the actor is the point; never the journey title; never a trailing `(Negative)`
- Behaviour at a limit says "at the limit" in the title

### Size and shape

- **A case is one run, not a transcribed scenario** — one starting state, one route, and every result observed on that route; a one-step case restating a WHEN left out the arrival and the observation
- **Results follow the steps** — listed in the order the run reaches them, each naming or implying the step it is checked at, so a failed bullet points at one step and one cause
- **A long case is a signal, not a limit** — past about six steps or six results on a `feature` case, check it is not two routes, or two starting states, in one; one route with more to see stays one case, so a tester runs it once. `domain`, `product` and `platform` cases walk composed paths and take no count
- **One action per step** — "sign in, open settings, change the password" is three; a continuous flow with one outcome stays one case
- **The arrival may be the first result** — `The listing loads` tells "could not get there" from "wrong"; a case whose results are only the arrival is not a case
- **Plain words, no internal names** — `Click the collection tile`, not `dispatch the tile's click handler`

### Walks

- **Walk shape** — `## Walk <n>: <title>`, followed by `**Starting state:**`, optional `**Shared test data:**`, and `### Route`
- **Concrete starting state** — name the actor, the surface or URL, and the seeded state the tester needs; never write only `Reset the fixture to each case's Pre-conditions` or another instruction to look elsewhere
- **Bound test data** — put the values or the exact fixture descriptions the route uses in the walk; never write only `Use each case's Test data` or `Type the query from Test data`
- **Executable waiting point** — when a route waits for a state change, the starting state names the surface where the tester waits; if the spec does not name that surface, mark the gap with `❓` and leave the source step unchanged
- **Independent short route** — group cases when they share the actor or session, surface, and one continuous route; use actual branches or data rows for fixture differences that can be prepared together, and split when a case needs a different state, setup recipe or page path
- **Practical walk size** — a coherent walk carries at least 2 and normally no more than about 25 cases; use fewer only when the suite has no adjacent compatible route, and split before setup or route length makes the walk expensive to run
- **Numbered route steps** — use a numbered item for each action the tester performs or reads; keep the action separate from the result it produces
- **Route observations** — nest `-` bullets under the numbered step where the tester records an existing case's observation; end every observation with that case's full human-facing heading id, such as `g10.auction-bidder-suspension.US1-TC1`
- **Route branches** — use `a.` and `b.` under the preceding numbered step only for actual alternative routes; each branch carries its own nested observations and case references, and a branch never creates a new observation
- **Case references** — use the full human-facing case heading id in a walk; the full case definition remains in its owning suite
- **No walk description** — a `*-tcs.md` walk carries setup, data and route only; generic explanation belongs in this file or its template
- **Complete case results** — the case definition remains the complete record of its Expected Results. A walk may repeat the result needed at that route point so a human knows what to record, but may not add or remove an assertion
- **Shared setup** — shared walk data saves human tester effort; it never makes a case depend on another case's result
- **Out-of-scope cases** — the tester follows the route unchanged and skips the out-of-scope reference and its checking
- **Several walks** — a case may be referenced by several walks. Each reference names only an observation already present in that case; a walk cannot create a new observation

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
- 2026-10-05, grade10-site/auction/bid-payment-method/feature-tcs.md: An expected result does not quote product copy. The spec's sentence is not assumed to match the product's words, so the result names the outcome.
- **Before** — step `1. The user is able to open the store front door successfully.`, result `The front door renders successfully, with the marketing hero visible immediately, and both buttons work.`
- **After** — steps `1. Navigate to <grade10 store url>.` `2. Click the shop button in the hero.` `3. Click the auction button in the hero.`, results `Front door renders, hero visible.` `Both buttons open their destinations without JavaScript.`
- 2026-09-25, grade10-site/auction/auction/feature-tcs.md: When the case layer is `api` and the spec names a read as a contract, the step says `Read the API response`, not the spec's contract name.
- 2026-10-02, grade10-site/auction/bid-panel-enrollment/feature-tcs.md: A step that enters a payment card names a **Test data** placeholder holding the provider's test value, never "a card".
- 2026-10-02, grade10-site/auction/bid-panel-enrollment/feature-tcs.md: A step that changes a value on file enters a value different from the one on file, so the change is observable.

### Placeholders

- **Self-describing, in the store's words** — `<g10 auction url>`, `<g10adm url>`, `<a collection with no artwork>`; never `<url1>`, `<TBD>`, or an undeclared abbreviation
- **For the value, not the thing** — where the spec names a control, name what the tester clicks
- **Consistent within a suite** — one surface, one placeholder
- **Never capitalised** — rewrite a sentence that would put a placeholder first
- 2026-10-07, grade10-site/auction/account-record/feature-tcs.md: Write a **Test data** field reference as an inline-code placeholder, such as `<listing_1>`, in pre-conditions, steps and expected results; use the same name throughout.

### Test data

- 2026-10-22, docs/prds/products/grade10-site/store/tests/domain-tcs.md: Test data names no environment. An address is `<g10url>/<path>`, never "the staging site's …", and no pre-condition or starting state says which environment, unless the environment is the partition under test.
- 2026-10-14, grade10-site/auction/winner-order/feature-tcs.md: Bind every replaceable test-data field by its inline-code `<placeholder>` in the pre-conditions, steps or expected results that use it; row-based tables name each bound column with that placeholder, never "the row's value". Write complete sentences that remain readable after binding concrete values, keeping fixture descriptions and selection notes outside the substituted value. Switch data rows without rewriting the route; keep each row in its stated partition, retain fixed boundaries and configured values, and state how derived results follow its inputs.
- **Readable units, the requirement's unit** — `100 mebibytes`, `30 minutes`; never a rounded megabyte that moves the bound
- **Rows with one checking** — keep one row when values share the same purpose, route and expected checking. Use separate rows when the expected provider answer or checking differs; use separate cases when the purpose differs
- 2026-10-07, grade10-site/auction/account-record/feature-tcs.md: In a `Field | Value` table, `Field` is a plain name such as `listing_1`. `Value` states the exact value or the conditions a fixture must meet. A test walk binds the name to a concrete value meeting that row, and expected results refer to the binding rather than pasting the row's description.
- 2026-09-25, grade10-site/auction/domain-tcs.md: A value that is not a boundary states an assumption and the range the requirement accepts, for example `HKD 800.00 or JPY 8000 or USD 8.00 (any price > 500 minor units)`. A boundary keeps its exact number and adds a readable reading. An exact reading has no tilde: `1800s (30mins)`. Use `~` only when that reading has a remainder: `1024b (1KiB or ~1KB)`. The exact number stays, so the reading never moves the bound.
- 2026-09-25, grade10-site/auction/auction/feature-tcs.md: A computed result is a concrete value in **Test data**, as `g10.auction-auction.US2-TC12` does. The expected result states the formula that equals it. A step does not state the outcome.
- 2026-10-02, grade10-site/auction/bid-panel-enrollment/feature-tcs.md: Rows for a refusal take one value per distinct answer the provider gives, not several values that produce the same answer.
- 2026-10-06, shared/auth/users/feature-tcs.md: When a rule names a class of values, for example any role other than `user`, the test data takes two members of the class as rows; two are enough.
- 2026-10-07, shared/auth/audit/feature-tcs.md: A case manual QA can run walks the product flow that reaches the write, such as a guest checkout for a trusted-product create, not the call behind it.
- 2026-10-07, shared/auth/audit/feature-tcs.md: A case that needs a dependency mocked to refuse has Testability `automation` alone; nobody can make the refusal by hand.
- 2026-10-08, shared/auth/roles/feature-tcs.md: A case's pre-condition puts each record in the state where the control the case uses, or looks for, would otherwise show.
- 2026-10-08, shared/auth/roles/feature-tcs.md: Where the screen states the rule before the act, the expected result reads what it states, met or unmet, beside the act's outcome.
- 2026-10-08, shared/auth/roles/feature-tcs.md: When a case reads one record and later creates another of the same kind, the expected result names which one it means.

### Actors

- **Class, qualifier, place** — `customer(gold member) is on the shopping cart page.`, `admin(holds auction:operate) is on <grade10 auction admin listings url>.` The qualifier carries what the rule under test needs and nothing more; a bare `customer` is right where state does not matter; two of a class are `customer A` and `customer B`

### Classification starting shapes

Read the case against **Step 5: Classify the Case** in [Specs to Test Cases](specs-to-test-cases.md#step-5-classify-the-case). Presentation, code logic and a core-flow label do not determine its classification. A case run through the interface uses `e2e`; one suitable for both a script and a human uses `automation, manual`.

## Setup Recipes

How to reach a state a case needs, by hand, written once and named from pre-conditions. One `###` per recipe: the state it produces, then the steps, then the environments it holds for.

### Choose picks on a staging-shop card

A card whose picks are the given cards, in the given order.

1. In the staging shop's admin, go to Apps > Search & Discovery > Product recommendations.
2. Open the product.
3. Under Complementary products, add the picks in order.
4. Click Save.
5. Wait 60 seconds past the save before reading the card's page.

**Holds for:** staging.

### A card with chosen facts, on the staging shop

A card with a given world, language, collectible type and picks, in a known catalogue order.

1. In the staging shop's admin, open the product.
2. Set its world, language and collectible type, the product's metafields the catalogue filters read.
3. Set its picks by the recipe "Choose picks on a staging-shop card".
4. Read its catalogue order, its creation date, on the store listing sorted by latest product.
5. Wait until the listing's world filter shows the card, then 60 more seconds.

**Holds for:** staging.

### A card sharing nothing

A card for sale whose world, language and collectible type no other product for sale carries, with picks as the case states.

1. In the staging shop's admin, create the product, for sale.
2. Give its world, language and collectible type values no other card uses.
3. Set its picks as the case states.

**Holds for:** staging.

### Put a card in the Main Page's merchandised row

A card among the 5 that the Main Page's merchandised row shows.

1. Open the Main Page and note the first collection tile in its grid.
2. In the staging shop's admin, go to Products > Collections and open that collection.
3. Add the card to the collection.
4. Set the collection's sort to Manually and drag the card into its first 5 products.
5. Click Save.
6. Wait 60 seconds past the save, then reload the Main Page until the row shows the card.

**Holds for:** staging.

### Sell a card out

A card the catalogue lists with nothing for sale.

1. In the staging shop's admin, open the product.
2. Set every variant's inventory to 0.
3. Wait until the store listing shows it sold out.
4. Wait 60 more seconds.

**Holds for:** staging.

## Where Things Are

The team's names for a surface or a control, and where a tester finds it: `<name> — <page or placeholder>, <where on it>`.

- Staging storefront — https://grade10-stg.com, the Grade10 site on staging, backed by the Shopify shop `grade10-staging-wcmnrpar.myshopify.com`; every hand walk of `grade10-site/store/cross-sell` runs here, and a card's page is `/store/products/<handle>`
- Staging shop's admin — the Shopify admin of `grade10-staging-wcmnrpar.myshopify.com`
- Store's sales channel — the staging shop's admin, the product, Publishing, Headless
- Product recommendations — the staging shop's admin, Apps > Search & Discovery > Product recommendations; Shopify's own label, named in `add-store-cross-sell`'s decisions Q45
- Complementary products — the staging shop's admin, Apps > Search & Discovery > Product recommendations, the product, the Complementary products field; Shopify's own label, where a card's picks are chosen in order
- Save — the staging shop's admin, Product recommendations, the product, the Save button that keeps its Complementary products; Shopify's own label

## Domains, Products and Capabilities

Lines scoped narrower than the store, one `###` per scope, by its path (`grade10-site/store`, `grade10-site/auction/auction`).

### grade10-site/auction

- 2026-10-14, grade10-site/auction/winner-order/feature-tcs.md: Use `listing` for an auctioned item in test prose and fixture names, following the accepted auction contract; keep winner orders distinct from listings. Preserve literal interface text, payload keys and email subjects when their exact wording is the assertion, even where the contract still names `lot`.
- 2026-09-25, grade10-site/auction/domain-tcs.md: Two bidders use separate sessions. A maximum is entered in the custom maximum on the bid panel.
- 2026-10-12, grade10-site/auction: For numeric test data, choose a representative value different from the linked scenario's example when the rule accepts a range or equivalence partition. Keep the scenario value when it is a boundary, tier threshold, equality or comparison value, computed fixture, or the specification gives no valid alternate range; bind any derived expected value to the row or formula.
- 2026-10-13, grade10-site/auction: Every minor-unit test-data fixture uses a compact major-price reading: replaceable values use `HKD280 (range: 1000–79999 minor units)`, source-defined open bounds use `HKD70 (range: >0 minor units)`, and boundary, equality, derived, configured or otherwise fixed values use `HKD10 (fixed ...)`. Omit trailing `.00` for whole major amounts; keep non-zero fractional digits. These readings guide fixture selection and do not assert the product's display text.

## Refused

Patterns a review offered and the reviewer refused, with why; never offered again.

- 2026-10-02, grade10-site/auction/bid-panel-enrollment/feature-tcs.md: A state the actor's qualifier names is not restated as a pre-condition saying how it was reached. Refused: too specific to the cases it came from to be a convention.
- 2026-10-02, grade10-site/auction/bid-panel-enrollment/feature-tcs.md: A case uses the term the product's PRD decides as its sole term, even where the spec still uses an older one. Refused: too specific to the cases it came from to be a convention.
