# Test Case Conventions

How a case reads. [`specs-to-test-cases.md`](specs-to-test-cases.md) says what a case is and claims; the template gives the shape. This is the one file for writing style: `/spec-to-tcs` writes every draft to it, and `/tcs-review` restyles drafts to it and adds lines to it through the gate in its skill. No other file defines a competing writing rule.

- **One line per convention** - `- <YYYY-MM-DD>, <suite path>: <the rule>`; a line that needs an example names an approved case id
- **Narrower wins** - a capability or domain line beats a store-wide one for its suites
- **It refines how, never what** - a line that contradicts the rules document is reported, and the rules document followed

## Store-wide

### Titles

- Five to twelve words, sentence case, naming the behaviour or condition: `Core navigation is accessible before scripts run`
- Not opened with the actor unless the actor is the point; never the journey title; never a trailing `(Negative)`
- Behaviour at a limit says "at the limit"
- A platform requirement opens the title: `[Mobile only] The bid panel opens as a bottom sheet`, `[Web only] …`

### Size and shape

- **A case is one run** - one starting state, one route, and every result seen on it
- **Results follow the steps** - in the order the run reaches them, each naming or implying its step, so a failed bullet points at one step
- **A long case is a signal** - past about six steps or six results on a feature case, check it is not two routes or two starting states. Composed levels take no count
- **One action per step** - "sign in, open settings, change the password" is three
- **The arrival may be the first result** - `The listing loads` tells "could not get there" from "wrong"; a case whose only result is the arrival is not a case
- **Plain words, no internal names** - `Select the collection tile`, not `dispatch the tile's click handler`

### Pre-conditions

The state the case starts from, one condition per bullet: seeded data (`At least one collection is missing its artwork`), a manipulated condition (`The catalogue cannot be reached`), or where the actor already is.

- **State, not actions** - `admin is on <g10adm url>/auction/listings` is state; `Open the media manager` is a step
- **Specific** - `customer is signed in with <card> saved and is on <listing_4>`, qualified by what the rule needs
- **Domain words, not plumbing** - never an endpoint, a table or a provider's product
- **Each record in the state the control needs** - put every record where the control the case uses, or looks for, would otherwise show
- **Reusable** - the same condition in the same words everywhere
- **Never that the feature exists** - only what state it is in
- **A platform requirement names the platform** - `customer is on mobile, on <g10url>/auction/listings/<slug_1>`
- **A refusal only a stubbed dependency makes** - the case's Testability is `automation` alone, because nobody can make it by hand

### Steps and expected results

- **Arrive once** - the first step (`Open <g10url>/store`) or a pre-condition placing the actor; one or the other
- **Then look, then act** - `Scroll to the collections section`, `Select the incomplete collection tile`
- **Platform-neutral verbs** - `select`, `enter`, `open`, `choose`, `scroll to`; never `click`, `tap` or `hover`, except in a case tagged for one platform
- **Name a control by role and region** - `the bid action in the bid panel`, `the shop button in the hero`; never by colour, position or exact label, so a small UI change rewrites nothing
- **Quote interface text only when the words are the claim** - an expected result does not quote product copy otherwise, because the spec's sentence is not assumed to match the product's words
- **Results are checkable by looking** - the thing that worked and, where the spec states it, what survived beside it (`Both buttons still work`); none is a step in disguise
- **A state a story draws** - end the result with `UI matching <story-id>`: `The cart drawer shows its empty state, UI matching store-cart-blocks-cartdrawer--empty`
- **Where the screen states the rule before the act** - the result reads what it states, met or unmet, beside the act's outcome
- **Which record** - when a case reads one record and later creates another of the same kind, the result names which one it means
- **The UI event, not the spec's UX term** - activate → select; navigate → open; unscoped → `The listing address names no collection`. Never `affordance`, `unscoped`, `narrowing` or `way on`; `e.g.` only where the spec gives the example
- **Few words** - about ten per bullet, a step a short imperative; cut `successfully`, `as expected`, `the application`, `the user is able to`. Short is not vague: `Hero is missing` is vague, `Hero collapses, page layout intact` is short and checkable
- **Exact about where, open about which** - a step says precisely where the tester looks; the values come by name from **Test data**
- **A payment card is a placeholder** - a step that enters a card names a **Test data** value holding the provider's test card, never "a card"
- **A changed value is observably different** - a step that changes a value on file enters one different from the value on file

Before and after:

- **Before** - step `1. The user is able to open the store front door successfully.`, result `The front door renders successfully, with the marketing hero visible immediately, and both buttons work.`
- **After** - steps `1. Open <g10url>/store.` `2. Select the shop button in the hero.` `3. Select the auction button in the hero.`, results `Front door renders, hero visible.` `Both buttons open their destinations.`

### Placeholders

- **Self-describing, in the store's words** - `<g10url>`, `<g10adm url>`, `<a collection with no artwork>`; never `<url1>`, `<TBD>` or an undeclared abbreviation
- **An address is `<g10url>/<path>`** - never "the staging site's …"; no case names an environment unless the environment is the partition under test
- **A Test data field is inline code** - `<listing_1>`, the same name in pre-conditions, steps and results
- **One surface, one placeholder** within a suite
- **Never capitalised** - rewrite a sentence that would put a placeholder first

### Test data

- **Values survive a fixture change** - a value that only sets the case up states its rule or range, so any fixture meeting it will do: `HKD280 (range: 1000-79999 minor units)`, `HKD70 (range: >0 minor units)`. A boundary, equality, derived or configured value is fixed and says so: `HKD10 (fixed boundary)`. An exact reading has no tilde, `1800s (30mins)`; `~` only where the reading has a remainder, `1024b (1KiB or ~1KB)`. Omit trailing `.00`. The reading guides fixture choice; it does not say how the product displays the amount
- **Pick values of your own, and vary them** - where a rule accepts a range, use representative values other than the scenario's example, and not the same number across cases; keep the scenario's value only when it is a boundary, tier threshold, equality, comparison, computed or spec-fixed value
- **Executable and replaceable** - every value is one a tester can set up today, and any other value meeting its rule or range works the same
- **`Field | Value`** - `Field` is a plain name such as `listing_1`; `Value` is the exact value or the conditions a fixture must meet. A run binds the name to a concrete value; results refer to the name, never paste the row
- **Rows bind by placeholder** - a row-based table names each bound column with its `<placeholder>`, never "the row's value". Sentences read correctly once values are bound
- **A computed result is a concrete value** in **Test data**; the result states the formula that equals it, and a step never states the outcome
- **Readable units, the requirement's unit** - `100 mebibytes`, `30 minutes`; never a rounded unit that moves the bound
- **One row per distinct answer** - refusal rows take one value per answer the provider gives, not several that produce the same answer
- **A class of values takes two members** - when a rule names a class, such as any role other than `user`, two rows are enough
- **Edge values ride on a live case** - a very long, non-Latin, zero or empty value is a row or value in a live case whose route shows that field

### Actors

- **Class, qualifier, place** - `customer(gold member) is on the shopping cart page.`, `admin(holds auction:operate) is on <g10adm url>/auction/listings.` The qualifier carries what the rule needs and nothing more; a bare `customer` is right where state does not matter; two of a class are `customer A` and `customer B`

### Walks

A walk exists to cut a tester's setup and running time. Its shape:

```markdown
## Walk 1: Publish a listing and place the first bid

**Starting state:**

- customer(enrolled bidder) is signed in.
- `<listing_1>` is published, open for bidding, and visible at `<g10url>/auction/listings/<slug_1>`.
- The tester waits for the scheduled close on the listing page.

**Shared test data:**

| Field | Value |
| --- | --- |
| `listing_1` | A published listing open for bidding |
| `opening price` | `HKD280 (range: 1000-79999 minor units)` |

### Route

1. Open `<g10url>/auction/listings/<slug_1>`. `g10.auction-auction.US1-TC1`
2. Read the listing's status and current bid.
   - The listing is open for bidding. `g10.auction-auction.US1-TC2`
3. Enter `<opening price>` in the bid panel and select the bid action.
   - The bid is accepted. `g10.auction-auction.US2-TC1`
4. Wait on the listing page until the scheduled close.
   - The listing closes with the expected result. `g10.auction-auction.US2-TC2`
```

- **Title names the route** - what the tester does, in a few words; never "Additional fixture checks", "Execute every case", "— phase 2" or "… and adjacent checks"
- **One starting state** - the tester's identity, every fixture's state, the page the route starts on, and where the tester waits. Never a list of `Steps 1–3 setup` blocks, and never "reset to each case's pre-conditions"
- **Shared test data the tester can use as is** - the values or ranges the route uses, in the walk; never "use each case's test data"
- **One numbered step per action**, numbered straight through the walk
- **`-` only for an observation** - an expected result an existing case records, ending with that case's full current heading id
- **`a.` and `b.` only for a real alternative route** - each carries its own observations
- **Real actions** - write what the tester enters; never "Type the query from Test data" or "Run the route for TC …"
- **A waiting point names its surface** - where the spec names none, mark it ❓
- **No description** - setup, data and route only

## Setup Recipes

How to reach a state a case needs, by hand, written once and named from pre-conditions. One `###` per recipe: the state it produces, the steps, and the environments it holds for.

### Choose picks on a staging-shop card

A card whose picks are the given cards, in the given order.

1. In the store's Shopify admin, go to Apps > Search & Discovery > Product recommendations.
2. Open the product.
3. Under Complementary products, add the picks in order.
4. Select Save.
5. Wait 60 seconds past the save before reading the card's page.

**Holds for:** staging.

### A card with chosen facts, on the staging shop

A card with a given world, language, collectible type and picks, in a known catalogue order.

1. In the store's Shopify admin, open the product.
2. Set its world, language and collectible type, the metafields the catalogue filters read.
3. Set its picks by the recipe "Choose picks on a staging-shop card".
4. Read its catalogue order, its creation date, on the store listing sorted by latest product.
5. Wait until the listing's world filter shows the card, then 60 more seconds.

**Holds for:** staging.

### A card sharing nothing

A card for sale whose world, language and collectible type no other product for sale carries, with picks as the case states.

1. In the store's Shopify admin, create the product, for sale.
2. Give its world, language and collectible type values no other card uses.
3. Set its picks as the case states.

**Holds for:** staging.

### Put a card in the Main Page's merchandised row

A card among the 5 that the Main Page's merchandised row shows.

1. Open the Main Page and note the first collection tile in its grid.
2. In the store's Shopify admin, go to Products > Collections and open that collection.
3. Add the card to the collection.
4. Set the collection's sort to Manually and drag the card into its first 5 products.
5. Select Save.
6. Wait 60 seconds past the save, then reload the Main Page until the row shows the card.

**Holds for:** staging.

### Sell a card out

A card the catalogue lists with nothing for sale.

1. In the store's Shopify admin, open the product.
2. Set every variant's inventory to 0.
3. Wait until the store listing shows it sold out.
4. Wait 60 more seconds.

**Holds for:** staging.

## Where Things Are

The team's names for a surface or a control, and where a tester finds it. Which environment a run uses, and its addresses, are the run sheet's: [`tcs-run-sheet`](../../.claude/skills/tcs-run-sheet/SKILL.md#environments).

- **Store's Shopify admin** - the Shopify admin of the shop behind `<g10url>/store`
- **Store's sales channel** - the store's Shopify admin, the product, Publishing, Headless
- **Product recommendations** - the store's Shopify admin, Apps > Search & Discovery > Product recommendations; Shopify's own label
- **Complementary products** - Product recommendations, the product, the Complementary products field, where a card's picks are chosen in order; Shopify's own label
- **Save** - Product recommendations, the product, the Save button that keeps its Complementary products; Shopify's own label

## Domains, Products and Capabilities

Lines scoped narrower than the store, one `###` per scope, by its path.

### grade10-site/auction

- 2026-10-14, grade10-site/auction/winner-order/feature-tcs.md: Use `listing` for an auctioned item in test prose and fixture names, following the accepted auction contract; keep winner orders distinct from listings. Keep literal interface text, payload keys and email subjects where their exact wording is the claim, even where the contract still says `lot`.
- 2026-09-25, grade10-site/auction/domain-tcs.md: Two bidders use separate sessions. A maximum is entered in the custom maximum on the bid panel.

## Refused

Patterns a review offered that were genuinely new and that the reviewer refused, with why; never offered again. A candidate that repeats an existing rule is stopped at the gate and leaves no line here.

- 2026-10-02, grade10-site/auction/bid-panel-enrollment/feature-tcs.md: A state the actor's qualifier names is not restated as a pre-condition saying how it was reached. Refused: too specific to the cases it came from to be a convention.
- 2026-10-02, grade10-site/auction/bid-panel-enrollment/feature-tcs.md: A case uses the term the product's PRD decides as its sole term, even where the spec still uses an older one. Refused: too specific to the cases it came from to be a convention.
