---
title: Start here
summary: Five reading paths through the manual, one per job.
order: 2
---

Everything here is readable by everyone — that is the point of one manual. But
the first hour is different depending on what you came to do, so pick a path.
Whatever the path, [Each Way In](/guides/working-a-change#each-way-in) says
where you say what you say.

## If you are a product manager

- [My turn](/my-turn) — what is on you, across every change in flight: the
  open questions addressed to you, then what is yours now, then what is coming.
- [Points](/p/grade10-site/loyalty/points) — the deepest spec we
  have, and the one written most nearly in product language. Read its journeys
  first, then the rest of [Membership](/p/grade10-site/loyalty).
- [Main Page](/p/grade10-site/store/home) and
  [Product Details](/p/grade10-site/store/product-page) — what a collector
  actually meets.
- [The vault](/p/grade10-site/vault) — the most involved product, where custody, identity
  and signing all meet.
- [Board](/in-flight) — every change moving across the platform, with tasks
  done over total, straight out of git.
- [Pending](/pending) — the changes waiting on a product manager: requirements
  nobody has written, journeys and suites nobody has derived.
- [How we plan](/guides/how-we-plan) — where a proposal stops and a spec
  starts.
- [Working a change](/guides/working-a-change) — the sentence that opens a
  change, the questions it holds for you, and the word that lands your files.

## If you are a designer

Your job here has three surfaces, then the reading. [Design](/design) is
every Figma frame and Storybook story the manual shows, with the nightly
check's verdict per card — `ok` means checked and matching, `warn`/`fail`
mean drift for someone to settle, `skipped` means nothing was compared, and a
card with no badge was not checked at all; the page says so when no report
exists. Token values live in `packages/design-system/tokens.json` — the CSS
themes and Figma are both projections of it. And every requirement row has a
propose action on the locally-run manual (the hosted site is read-only):
proposing takes thirty seconds in the browser, and everything after it is an
agent's job — the card on [Board](/in-flight) names the command to hand
over, or hand the change id to a PM or engineer.

- [My turn](/my-turn) — what is on you, across every change in flight: the
  open questions addressed to you, then what is yours now, then what is coming.
- [Package Rules](/p/shared/ui/component-package) — what the shared UI
  package owes a product, and what it refuses to hold.
- [Site Header and Footer](/p/shared/ui/site-chrome) and
  [Cart Drawer](/p/shared/ui/store-cart) — two PRDs with real
  Figma and Storybook links side by side.
- [Design sync](/p/shared/design-sync/coverage) — the unattended rail that
  compares a shipped component against the Figma node it came from.
- [Localization](/platform/shared/localization) — which languages a layout has to
  survive.
- [Dates and times](/platform/shared/dates-and-times) — the four shapes a date takes
  on screen, before you invent a fifth.
- [Pending](/pending) — the changes waiting on a designer, each with the line
  its author wrote saying what is missing. A change asks by writing
  `awaiting:` with `ui-design: <what nobody has drawn>` in its
  `.openspec.yaml`; nothing else puts it on your section.
- [Working a change](/guides/working-a-change) — `/workflow-design`, the screen the
  journeys ask for, and the word that lands it.

## If you are in QA

Your worklist is [QA](/qa): every suite awaiting review — the ones riding
in-flight changes first, then the durable capabilities — with draft counts
and untraced scenarios. Reviewing one is a conversation with an agent:
`/tcs-review <capability-or-change>` walks the draft cases one at a time,
quoting the spec behind each, and records your verdict — approve, change,
defer, or retire — signed with your handle and the date.
`approved` is the reviewed record and the build holds the suite to it; no
runner or export consumes it yet. The whole derivation, spec journeys to
classified cases, is
[specs to test cases](https://github.com/9gag/grade10-spec/blob/main/docs/governance/specs-to-test-cases.md).

- [My turn](/my-turn) — what is on you, across every change in flight: the
  open questions addressed to you, then what is yours now, then what is coming.
- [Points](/p/grade10-site/loyalty/points) — journeys, the
  scenarios that accept them, and the test cases tracing back.
- [Sign-In](/p/shared/auth/sign-in) and [Sessions](/p/shared/auth/sessions) —
  the flows every other product sits on.
- [Money amounts](/platform/shared/money-amounts) — the rounding and formatting rules
  a bug report should quote.
- [Audit trail](/p/grade10-admin/audit) — how to prove an operator action was recorded, and
  what a passing verification does not claim.
- [Board](/in-flight) — what is moving, so a test plan is written against the
  right version.
- [Working a change](/guides/working-a-change) — the two blind readings of a
  change, and the one word that lands the requirements and the cases together.

## If you are an engineer

- [My turn](/my-turn) — what is on you, across every change in flight: the
  open questions addressed to you, then what is yours now, then what is coming.
- [Frontend composition](/platform/shared/frontend-composition) — where a feature
  lives and what an application is allowed to load.
- [Package Rules](/p/shared/ui/component-package) — what to compose before
  writing a control from scratch.
- [Roles](/p/shared/auth/roles) — the permission vocabulary every backend
  checks against.
- [Document signing](/p/grade10-site/doc-sign) and [KYC](/p/grade10-site/account/kyc) — the two
  services with the most decisions per line of code.
- [Pending](/pending) — the specified changes with no plan yet, oldest first.
  Taking one is writing its `tasks.md`.
- [Working a change](/guides/working-a-change) — `/workflow-tech` and `/workflow-tasks`, the
  groups each with its test task first, and the walk the last group leaves.
- [Writing the manual](/guides/writing-the-manual) — the page grammar, for when
  you document what you built.

## If you are an operator

- [My turn](/my-turn) — what is on you, across every change in flight: the
  open questions addressed to you, then what is yours now, then what is coming.
- [Console blocks](/p/shared/console/blocks) — the shapes every console
  section is built from.
- [User directory](/p/shared/console/user-directory) — roles, standing, and
  where an account is signed in.
- [Audit trail](/p/grade10-admin/audit) — what your actions leave behind, and how an auditor
  reads it.
- [Appointments](/p/grade10-site/appointment) — running the diary: shops, weekly opening
  rules, and closing a day.
- [Roles](/p/shared/auth/roles) — what each role can reach, and why some moves
  take two people.
