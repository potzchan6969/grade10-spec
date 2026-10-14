# Manual QA Passes

## Values

| Rule | Value |
| --- | --- |
| Lane | staging, on the release candidate build |
| Walker | a person, or an agent driving a browser |
| Depths | D1 critical path · D2 business rules · D3 edges |
| Tiers | 0 the bar · 1 changed · 2 full |
| Go | Tier 0 walked whole · no blocker or critical open |
| Bar size | 40 cases at most; past that, the product owner moves a D1 feature to D2 |
| Walk time | TBC — about 10 minutes a case with its setup, until the first store pass measures it |
| Surfaces | Tier 0 on Web and Mobile, console cases on Web only · Tiers 1 and 2 on the surface the run names |
| Mobile | a phone-sized browser for an agent · an iPhone in Safari and an Android phone in Chrome for a person |
| Languages | Tier 0 in the default language · the bar's browse and buy cases once more in each other language |
| Rated again | Change on every pass · Impact, Reach and depth when a capability is added, and every quarter |

## Scope

A pass ranks features, never single cases: each feature sits in one scope at one depth, and its tier follows from that depth and from what the release changed. Each product keeps its ranked scopes in a map, under **Scope Maps**.

- **Scope** — an area of the product a teammate names in two or three words, such as Buying Online or Membership
- **Feature** — one capability, or a named group of its journeys when a capability holds two things a buyer would name apart
- **One scope per feature** — a feature that serves two scopes sits where its failure is felt first
- **Rank** — the first scope is the one whose failure costs the most; rank orders the work inside a tier and decides nothing else
- **Line** — the launch line a feature opens with, from [Carried Surfaces](../prds/products/grade10-site/site/carried-surfaces.md). Staging carries every line; a pass ranks a feature by the line it ships on

## Depth

| Depth | Holds | A feature is here when |
| --- | --- | --- |
| D1 critical path | the route most of the scope's users take to its outcome | Impact 3 and Reach 3 |
| D2 business rules | refusals, limits and recovery that protect money, points, access or personal data | Impact 3, or Impact 2 and Reach 3 |
| D3 edges | presentation, empty and loading states, secondary routes | anything else |

- **Bar journeys** — inside a D1 feature, the map names the journeys that walk its main outcome; only those reach the bar

## Rating a Feature

| Rating | 3 | 2 | 1 |
| --- | --- | --- | --- |
| Impact | money, points, a coupon, access or personal data goes wrong, or the journey cannot start | the main outcome is wrong, and nothing is lost | presentation or convenience |
| Reach | nearly every user of the scope, on every visit | most of them, or often | a few, or rarely |
| Change | new, changed in this release, or its provider changed | something it depends on changed | nothing changed since the last pass |

- **Impact and Reach** — held in the product's map
- **Change** — rated on every pass, from the changes and `fix` commits the release carries
- **A line opening** — every feature on a line the release opens rates Change 3

## Tiers

| Tier | Holds |
| --- | --- |
| 0 the bar | the bar case of each bar journey · the smoke cases of each feature rated Change 3 · the carried-surfaces cases of each line the release opens |
| 1 changed | the `high` cases of each D1 and D2 feature rated Change 2 or 3 · every case the release's changes added or revised |
| 2 full | the `high` cases of unchanged D1 and D2 features · D3 features · `medium` and `low` cases · exploratory time |

- **Breadth before depth** — Tier 0 covers every scope before Tier 1 adds cases to any one, so no scope ships unwalked
- **Order inside a tier** — scope rank, then Impact, then Reach. A pass cut short stops between two features, never inside one
- **Bar case** — the journey's `smoke` case. Where a journey has none, or its smoke case does not walk the journey's main outcome, the map names the case that does, and the suite's next `/tcs-review` moves the tag
- **Opening a line** — its carried-surfaces cases are walked on production right after the line opens, reading only: no purchase and no sign-up
- **A state staging cannot make** — a case that needs a mocked answer, an outage or two callers racing stays with CI; the selection leaves it out with that reason
- **CI does not walk the bar** — an automated case still goes on the sheet. CI runs against fixtures and a fake shop; the pass proves the deployed site, console and shop work together

## Who Walks a Case

| Walker | Walks | Needs |
| --- | --- | --- |
| Agent | the staging site, the admin console, the shop's hosted checkout, and the console's POS till and loyalty test pages, in a browser | a tester account whose sign-in mail it can read, the staging shop's test card, an admin account with its second factor |
| Person | a phone's wallet, a till device, a camera, and how a page reads and looks | the device, signed in to a tester account |

- **Either, by default** — a case either walker can take is given to whoever is free; the map names the features only a person walks
- **One walker per case** — the run's notes name who walked it
- **An agent stops and reports** — a step it cannot take, a result it cannot read, or a page that asks for something real: a live card, a person's own mailbox, a production sign-in
- **A person confirms an agent's fail** — on a Tier 0 case, before the fail blocks the release

## On Staging

- **Test material only** — tester accounts, the staging shop and its test card; never a real customer's data or a live card
- **Evidence** — every `fail` keeps a screenshot or a recording, the page address, the build, the language, the tester and the time
- **Redacted** — email addresses, session material, payment details and checkout tokens are cut from evidence before it is shared
- **Clean afterwards** — a coupon, a points grant or a ban the pass made is reversed, or named in the run's notes, so the next pass starts from known ground

## Release Bar

- **Go** — Tier 0 walked whole on the release candidate, and no blocker or critical open
- **A failing Tier 0 case blocks the release** — unless the product owner signs a waiver in the run's notes: the case, the risk taken and the date of the fix
- **Never cut** — time cuts Tier 2, then Tier 1 from the bottom of the rank; a pass that cannot finish Tier 0 does not release
- **Found on the way** — a defect outside the tiers is rated on the same scale, and a blocker or critical blocks the same way
- **Tiers 1 and 2** — walked as far as time allows, in order; the report names what the pass did not reach, and the product owner reads it before the go
- **Severity** — the case scale in [Specs to Test Cases](specs-to-test-cases.md#values)

## Cutting for Time

| Time | Walks |
| --- | --- |
| The least a release takes | Tier 0, never less |
| More | Tier 0, then Tier 1 by rank, stopping between two features |
| A full pass | Tier 0, Tier 1, then Tier 2 by rank |

- **Walker-days** — cases times the walk time, divided by the walkers; agents walk side by side, so more walkers shorten a pass without cutting it

## Running a Pass

1. **Name the release** — the build, its lane, the lines it opens, and the changes it carries: changes archived or claimed since the last pass, and `fix` commits
2. **Rate Change** — for each feature, from step 1
3. **Check the map** — every capability the release carries sits in one scope at one depth; a capability the map does not hold is placed first, at D1 until rated
4. **Resolve the bar** — copy the last finalized bar run with `--copy-run`, add the smoke cases of changed features and the cases of opened lines, and drop what the release no longer carries
5. **Check readiness** — a Tier 0 case still `draft` is reviewed with `/tcs-review` first, or printed with `--include-draft` and the reason recorded; a bar journey with no case is reported to the product manager, never invented in the pass
6. **Agree the bar** — the product owner confirms the Tier 0 list, the walkers and the cut line before anything is printed
7. **Print and walk** — `/tcs-run-sheet`, one run per tier: Tier 0 by `--cases-file`, Tiers 1 and 2 by `--scope` and `--priority`
8. **Decide** — go or no-go against **Release Bar**
9. **Feed back** — a defect that escapes to production raises the feature's Impact or Reach, or adds the case that would have caught it; the map changes in the same week

## Scope Maps

### Grade10 Store

The shop at `grade10.com/store`, and what it needs in order to sell: sign-in, membership at the counter, and the console that runs them — [Store](../prds/products/grade10-site/store/index.md).

| Rank | Scope | Line |
| --- | --- | --- |
| 1 | Buying Online | Store |
| 2 | Finding a Card | Store · the front door |
| 3 | Account | every lane · Profile |
| 4 | Membership | Membership |
| 5 | At the Counter | Membership · the till app · Store for the shelf scanner |
| 6 | Running the Store | the console, every lane |
| 7 | Site Foundation | every lane |

- **Person only** — Member card in a wallet, Shelf scanning, and how a page reads and looks
- **Discount promotions** — authored in Shopify Admin, so they are walked as Sale prices

#### Buying Online

| Feature | Journeys | Depth | Impact · Reach |
| --- | --- | --- | --- |
| Cart drawer: open, edit, pay | `grade10-site/store/cart-drawer` US1 · US2 · US6 | D1 | 3 · 3 |
| Hosted checkout and the way back | `grade10-site/store/checkout` US-01 · US-03 | D1 | 3 · 3 |
| Guest checkout | `grade10-site/store/checkout` US-04 | D1 | 3 · 3 |
| A changed cart line | `grade10-site/store/checkout` US-02 | D2 | 3 · 2 |
| Coupons at checkout | `grade10-site/store/discounts` US-01 · US-02 · US-03 | D2 | 3 · 2 |
| Points at checkout | `grade10-site/store/cart-drawer` US4 · US5 · `grade10-site/loyalty/programme` US-03 | D2 | 3 · 2 |
| Sale prices | `grade10-site/store/site-discounts` US-01 | D2 | 3 · 2 |
| A guest order found again | `grade10-site/store/checkout` US-09 | D2 | 3 · 2 |
| Order status, refunds and holds | `grade10-site/commerce/order-status` | D2 | 2 · 3 |
| Waiting on the drawer | `grade10-site/store/cart-drawer` US7 · US8 · US9 | D2 | 2 · 3 |
| Cart pictures, and back to a card | `grade10-site/store/cart-drawer` US3 · US10 | D3 | 1 · 3 |

#### Finding a Card

| Feature | Journeys | Depth | Impact · Reach |
| --- | --- | --- | --- |
| Front door | `grade10-site/store/home` US-01 · US-02 | D1 | 3 · 3 |
| Listing | `grade10-site/store/product-listing` US-01 · US-02 | D1 | 3 · 3 |
| A card's page, and adding it | `grade10-site/store/product-page` US-01 · US-03 | D1 | 3 · 3 |
| Sold out, and the last of a card | `grade10-site/store/product-page` US-04 · US-05 · `grade10-site/store/product-listing` US-06 · `grade10-site/store/home` US-06 | D2 | 2 · 3 |
| Narrowing, ordering and search | `grade10-site/store/product-listing` US-04 · US-05 · US-11 | D2 | 2 · 3 |
| Adding without signing in | `grade10-site/store/product-listing` US-12 · `grade10-site/store/product-page` US-11 | D2 | 2 · 3 |
| Opening a card from the listing | `grade10-site/store/product-listing` US-16 | D2 | 2 · 3 |
| Cross-sell | `grade10-site/store/cross-sell` | D3 | 1 · 2 |
| Browsing extras | `grade10-site/store/home` US-03 · US-04 · US-05 · `grade10-site/store/product-listing` US-03 · US-07 · US-08 · US-09 · `grade10-site/store/product-page` US-02 · US-13 | D3 | 1 · 2 |

#### Account

| Feature | Journeys | Depth | Impact · Reach |
| --- | --- | --- | --- |
| Sign-in by link | `shared/auth/sign-in` US-01 | D1 | 3 · 3 |
| Google sign-in | `shared/auth/sign-in` US-03 | D1 | 3 · 3 |
| Staying signed in, and signing out | `shared/auth/session` US-02 · `shared/auth/sign-out` US-01 | D1 | 3 · 3 |
| Refused sign-ins, and a shared device | `shared/auth/sign-in` US-04 · US-05 · US-06 · US-09 · `shared/auth/session` US-06 · `shared/auth/sign-out` US-02 | D2 | 3 · 2 |
| Profile | `grade10-site/store/account-profile` | D2 | 2 · 3 |
| Identity check | `grade10-site/store/account-identity` | D2 | 3 · 1 |
| Sign-in extras | `shared/auth/sign-in` US-07 · US-08 · US-10 · US-11 · `shared/auth/session` US-01 · US-03 · US-04 · US-05 | D3 | 1 · 2 |

#### Membership

| Feature | Journeys | Depth | Impact · Reach |
| --- | --- | --- | --- |
| Joining, and the member's page | `grade10-site/store/membership` US-01 · `grade10-site/loyalty/programme` US-04 | D1 | 3 · 3 |
| Points on a paid order | `grade10-site/loyalty/programme` US-01 | D1 | 3 · 3 |
| Redeeming a reward | `grade10-site/loyalty/programme` US-07 | D1 | 3 · 3 |
| Tiers, refunds and expiry | `grade10-site/loyalty/programme` US-02 | D2 | 3 · 2 |
| A coupon left open elsewhere | `grade10-site/loyalty/programme` US-08 · US-11 | D2 | 3 · 2 |
| Member card in a wallet | `grade10-site/store/wallet-member-card` US-01 · US-02 · US-03 · US-04 · US-06 · US-07 · US-08 | D2 | 3 · 2 |
| Expiry reminders | `grade10-site/loyalty/expiry-reminders` | D3 | 2 · 2 |

#### At the Counter

| Feature | Journeys | Depth | Impact · Reach |
| --- | --- | --- | --- |
| A member found and spending at the till | `grade10-site/store/membership` US-02 | D1 | 3 · 3 |
| A till sale earning points | `grade10-site/store/membership` US-03 | D1 | 3 · 3 |
| Coupons, sale prices and notices at the till | `grade10-site/store/discounts` US-04 · `grade10-site/store/site-discounts` US-02 · `grade10-site/store/membership` US-04 | D2 | 3 · 2 |
| Shelf scanning | `grade10-site/store/shelf-scanning` | D3 | 2 · 2 |
| Store locator and free pick-up | `grade10-site/store/store-locator` · `grade10-site/store/product-page` US-10 | D3 | 1 · 2 |

#### Running the Store

| Feature | Journeys | Depth | Impact · Reach |
| --- | --- | --- | --- |
| Console sign-in and its second factor | `shared/auth/sign-in` US-12 · `shared/auth/session` US-07 · US-08 | D1 | 3 · 3 |
| Moving points | `grade10-site/loyalty/programme` US-05 | D1 | 3 · 3 |
| Writing a reward | `grade10-site/loyalty/programme` US-09 | D1 | 3 · 3 |
| Bans, roles and the audit trail | `shared/auth/users` US-02 · US-03 · `shared/auth/roles` · `shared/auth/audit` | D2 | 3 · 2 |
| Reversing or cancelling a redemption | `grade10-site/loyalty/programme` US-06 · US-10 | D2 | 3 · 1 |
| Ending sessions and passes | `shared/auth/sessions` · `grade10-site/store/wallet-member-card` US-05 · US-09 | D2 | 3 · 1 |
| The directory | `shared/auth/users` US-01 · US-04 · US-05 · US-06 | D3 | 1 · 3 |

#### Site Foundation

| Feature | Journeys | Depth | Impact · Reach |
| --- | --- | --- | --- |
| What each lane carries | `grade10-site/site/carried-surfaces` US-04 · US-08 | D1 | 3 · 3 |
| Page shell and the cart button | `grade10-site/site/page-shell` US-01 · US-06 | D1 | 3 · 3 |
| Languages, and money on screen | `shared/localization` · `shared/money-amounts`, read on the way past in every bar case | D1 | 3 · 3 |
| Withheld products stay hidden | `grade10-site/site/carried-surfaces` US-01 · US-02 · US-03 · US-05 · US-06 · US-07 | D2 | 3 · 2 |
| Navigation | `grade10-site/site/navigation` | D2 | 2 · 3 |
| Crawlable pages | `grade10-site/site/crawlable-pages` | D2 | 2 · 3 |
| Shell extras | `grade10-site/site/page-shell` US-02 · US-03 · US-04 · US-05 · US-07 · US-08 | D3 | 1 · 3 |
| Analytics, type and dates | `grade10-site/analytics/analytics` · `grade10-site/site/typography` · `shared/dates-and-times` | D3 | 1 · 3 |

#### Bar Cases

The first bar, one case per bar journey, ready for `--cases-file`. The language walks take `grade10-site-store-e2e-US1-TC1-2` and `g10.store-cart-drawer.US6-TC1` again under `/tc` and `/sc`.

```text
# Buying Online
g10.store-cart-drawer.US1-TC1
g10.store-cart-drawer.US2-TC1
g10.store-cart-drawer.US6-TC1
grade10-site-store-checkout-US1-TC1-1
grade10-site-store-checkout-US3-TC2-1
grade10-site-store-checkout-US4-TC1-3
# Finding a Card
grade10-site-store-home-US1-TC1-1
grade10-site-store-e2e-US1-TC1-2
grade10-site-store-product-listing-US1-TC1-1
grade10-site-store-product-page-US1-TC1-1
grade10-site-store-product-page-US3-TC1-1
# Account
shared-auth-e2e-US1-TC1-1
shared-auth-sign-in-US3-TC1-1
shared-auth-e2e-US2-TC1-1
# Membership
grade10-site-loyalty-programme-US4-TC2-1
grade10-site-loyalty-programme-US1-TC3-1
grade10-site-loyalty-programme-US7-TC8-1
# At the Counter
grade10-site-store-e2e-US4-TC1-2
grade10-site-store-membership-US3-TC1-1
# Running the Store
shared-auth-sign-in-US12-TC1-1
grade10-site-loyalty-programme-US5-TC3-1
grade10-site-loyalty-programme-US9-TC1-1
# Site Foundation
grade10-site-site-carried-surfaces-US4-TC1-2
grade10-site-site-carried-surfaces-US8-TC1-2
grade10-site-site-page-shell-US1-TC1-1
grade10-site-site-page-shell-US06-TC4-1
```

- **Store line alone** — Buying Online, Finding a Card, Account, the console's sign-in, and Site Foundation less the withheld-products case: 18 cases
- **Membership line** — Membership, At the Counter, moving points, writing a reward, and the withheld-products case: 8 more
- ❓ **Joining** — `grade10-site-store-membership-US-01` has no case a walker can run on staging, since its smoke case needs the shop to be unreachable. The product manager names the case that walks a plain join

## See Also

- [Specs to Test Cases](specs-to-test-cases.md) — the cases, their properties, and what a run sheet holds
- [Run-sheet skill](../../.claude/skills/tcs-run-sheet/SKILL.md) — selecting, printing and finalizing a pass
- [Carried Surfaces](../prds/products/grade10-site/site/carried-surfaces.md) — the lines, and what each lane carries
