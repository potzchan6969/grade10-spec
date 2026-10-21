---
name: handoff-page
description: "Hand finished or blocked work to a person as one team page linked from its PR: the verdict, what changed in pictures, proof beside each claim, and decisions answered on the page. Use when a non-trivial feature is done, a branch needs a team briefing, or work waits on a human decision."
---

# Handoff page

One page, linked from its PR and behind the team's Cloudflare login, that hands a person finished or blocked work: what changed, whether it works, and what they must decide. The reader acts on it in minutes, without the session's context. You write the facts as one data file; `scripts/build.mjs` checks them and draws the page from `assets/template.html`, so every handoff looks and reads the same whichever model wrote it. Story evidence for a block or primitive is `/storybook-workbench`; the checkpoint digest that posts what moved on a branch to Slack is `/checkpoint-digest`, which draws its page with this builder.

## When a Page Earns Its Place

| The work | Hand it off as |
| --- | --- |
| A small change, or one question a sentence can carry | The reply alone, in the Clarification Request format when anything is asked |
| Decisions whose options differ in what people see or how a flow runs, or several at once | A decision page, `"page": "decision"`: its reason names the work that waits on the answers, each option is drawn, What changed becomes What is settled, and Proof holds the facts the options rest on |
| A feature, fix or capability set done, with something to see or try | A feature page |
| Many phases or roles - an epic, a release train | A feature page whose changes each carry a `phase` |

- **One home** - the page and its shots live only on their own `handoff/pr-<n>` branch, which `scripts/publish.mjs` writes; never commit them to a working branch
- **No PR** - with nothing to link it from, hand off in text: the reply carries the same verdict, proof and Clarification Request
- **One page per handoff** - only the session that faces the person builds it; a background worker returns its facts to its coordinator
- **Team only** - the host serves the page behind the team's Cloudflare login and drops it 30 days after its last upload

## Steps

`<scratchpad>` is the session's scratchpad directory, or any folder outside the repository.

1. **Load** - `writing-style` for every word on the page and in the reply, held to the store's `docs/governance/writing.md` Voice section
2. **Gather** - the facts, from the sources under Gather; never from memory
3. **Write the data** - copy `assets/example.json` to `<scratchpad>/handoff/data.json`, replace every value with your own, and delete `"example"`
4. **Build** - from the repository root, `node .claude/skills/handoff-page/scripts/build.mjs <scratchpad>/handoff/data.json`; fix every `FAIL`, weigh every `warn`, and build again until it passes; it writes `page.html` and `reply.md` beside the data
5. **Check** - run the `next:` line the build prints from a folder where Playwright resolves, and look at the screenshots
6. **Verify** - dispatch the `page-verifier` agent, as Check says; fix every finding in the data, build, and dispatch it again until it returns `clean`
7. **Publish and reply** - as Publish and Hand Over says

Never edit `page.html` by hand: change the data and build again. What the template cannot draw goes in `extra`.

## What the Reader Gets

### The Top of the Page

No summary screen: the masthead, one list of the changes, then the sections.

- **Masthead** - the kind of page and the repository over the title, then the verdict panel: the verdict, the reason as the headline, and, when anything is asked, how many questions and blockers wait, with a Go to Decide button
- **Verdict** - `ready`, `decide`, `not-ready` or `blocked`, shown as `Ready`, `Ready once you decide`, `Not ready` or `Blocked`; a Ready page whose claims are not all verified shows the count beside it (`Ready, 2 of 9 claims verified`)
- **Reason** - the one reason, as the page's headline: `Ready to merge once 2 decisions are made`
- **Numbers** - up to four counts the reader would quote, drawn large under the headline: `227 commits`, `3 states`
- **Stamp** - the branch, commit, version (`v2`) and date the page was read at, in one quiet line; a page tied to no revision cannot be trusted after the next push
- **Since** - from `v2` on, one line names what moved since the last version, so a returning reader skips the rest
- **At a glance** - with two or more changes, every change in one list grouped by phase: its kind, its title linking to its card, and who notices it; under it, a bar of the proof rows by status
- **Filter** - with four or more changes and two or more readers in `who`, one chip per reader narrows the page to the changes that reader notices; the reader's browser remembers the pick
- **Jump row** - one link per section with its count (`Decide 2`, `Proof 3/4`); on a wide screen an outline beside the page holds the same links and What changed's phases, and marks where the reader is; the page derives every count

### Sections keep one order

The same names in the same order on every handoff, so a reader who has seen one knows where to look on the next. A section with no data drops out.

| Section | Data | Left out when |
| --- | --- | --- |
| Decide | `decide` | Nothing is asked and nothing was decided for the reader |
| What changed | `changes` | Never, on a feature page |
| Try it | `try` | Nothing is visible to try |
| Proof | `proof` | Never |
| Ship it | `ship` | Nothing ships |
| Follow-ups | `followups` | Nothing is left |
| For engineers | `engineers`, one collapsed block | Never |

- **Decide leads** - when the verdict waits on it (`decide`, `blocked`); otherwise it follows Proof, so the reader decides with the evidence in view
- **Changes lead** - `"lead": "changes"` keeps What changed first even when the verdict waits, for a change the reader must understand before the questions make sense
- **The demo leads** - `"lead": "extra"` opens on the `extra` section, for a page whose point is a live demo: a proposal, or options told apart by playing them; the reader sees the problem before the questions about it
- **Try it** - names where the work can be walked: the workbench with `pnpm storybook` ([`docs/governance/storybook.md`](../../../docs/governance/storybook.md)), the manual with `pnpm manual`, or the staging workbench once `pnpm storybook:deploy:staging` ran; a deploy is the person's call, so it is asked as a blocker, never done unasked
- **Ship it** - names what each consuming application must do when it bumps the submodule: an export that moved, regenerated theme CSS, a catalog key to answer, a Design Override; what breaks if the change is wrong, and how to undo it

### Each Change Is One Card

- **Head** - its kind (`New`, `Changed`, `Removed`, or `Settled` on a decision page), who notices it, and a link to the card itself
- **Before and Now** - the `before` and `now` lines as one slip, before above now
- **Picture** - one or more, as Pictures says
- **Links** - the sources a reader opens next: the proposal, the pull request, the requirement
- **Proof** - each proof row whose `change` is the card's `id`, its status as an icon and a word

## Principles

- **Start from what the reader notices** - list the few changes a person would see, each with one picture and one before/now line; what does not change what the reader knows or does goes into For engineers or nowhere
- **Draw each thing once** - what the demo plays needs no card in What changed; a decision page lists as settled only what neither the demo nor a question shows, and its Proof holds only the facts the options rest on
- **Build every picture from the code** - read the code behind each rule the page states, port behaviour from its pure functions, and use the labels and values the screen shows (`HK$53,998.00`, not `$53,998`), from the catalog under `packages/i18n/messages/`; when a picture and the code disagree, the code wins and the reply says the earlier version was wrong
- **Proof beside the claim** - every claim says how it was proven and on which revision, or that it was not; `not-run` is a status, never a footnote, and the verdict never outruns the ledger
- **Ask only what the reader must decide** - a choice with a conventional default, or a fact the code settles, is made and listed under `agentDecisions`, where the reader can overrule it
- **Define every term from the user's side** - for each verb (submit, waits, re-checks, blocks) the page answers: which button, and is it the whole form or each step; who waits, where, how long, and the timeout; whether the screen updates on the same click or after a refresh, and the exact message

## Gather

- **What changed** - `git log --oneline origin/main...HEAD`, `git diff --stat origin/main...HEAD` and the PRs; for work already merged, each merge against its first parent (`git diff --stat <merge>^1 <merge>`)
- **Store** - PRD pages, message catalogs, shared blocks (`packages/ui/src/blocks/`) and OpenSpec changes live in this repository; read them at `main` unless the work is on another branch
- **Intent** - the PRD page with its open ❓ lines, and the OpenSpec change when there is one, read in `openspec/changes/<change-id>/`: proposal, `decisions.md`, journeys, `tasks.md`, `rounds.md`; merged work with no change reads the capability's spec under `openspec/specs/`
- **Proof** - test runs, story tests, `pnpm check:manual`, CI checks and the consuming application's `implementation.json`, each with its revision
- **Rules** - the code behind every rule the page states: a countdown, a refusal, an eligibility rule; one rule drawn from memory is how a page goes wrong
- **Who reads** - ask only what cannot be inferred: who reads the page, and which decisions are theirs

## Data

`assets/example.json` is a complete page: copy it, keep its shape, and change every value. The build names every key it does not know, refuses a missing field or an id it cannot use, and says how to fix each.

- **Schema** - `assets/data.schema.json` names every key, its type, its allowed values and what it holds; read it for any key the table below leaves short, and an editor checks the data as you type through the example's `$schema` line
- **One source** - the build reads its key lists and allowed values from the schema and adds the rules a schema cannot say, such as one recommended option first; a key the template learns goes into the schema first, or the build warns that the page ignores it

| Key | Holds |
| --- | --- |
| `title` | The page's name, two to four words: `Extended Bidding Label` |
| `page` | `feature`, `decision`, or `digest` for `/checkpoint-digest` |
| `lead` | `extra` to open on the demo, `changes` to open on What changed when Decide would lead; left out otherwise |
| `verdict`, `reason` | The verdict and its one reason; a digest has no verdict |
| `stamp` | `repo`, `branch`, `commit` (7 characters; a merged change stamps its merge commit), `date` (`2026-10-19`), `version`; a digest takes `from` and `fromDate`, the commit and day it starts from, in place of `version`, and `/checkpoint-digest` sets both days to the day its page covers; a fact read in another repository names its commit in its proof row |
| `since` | From `v2`: what moved since the last version |
| `numbers` | `label` and `value`, a number or short text: up to four counts the reader would quote |
| `decide.questions` | `n`, `title`, `ask`, `options`, `why`, `blocks`, `reasons`, `picture`, `answered` |
| `decide.questions[].options` | `key` (`A`, `B`), `label`, `recommended`, `outcome`, `cost`, `picture` |
| `decide.blockers` | `n`, `title`, `action`, `who`, `why`, `blocks`, `reasons`, `done` |
| `decide.agentDecisions` | `decision`, `taken`, `why` |
| `changes` | `id`, `kind` (`new`, `changed`, `removed`; `settled` on a decision page), `who`, `title`, `before` (needed by `changed` and `removed`), `now`, `picture`, `phase`, `links` (`text`, `href`); on a digest, `commits`, the commits it comes from |
| `try` | `where`, and `steps` with `role`, `when`, `title`, `where`, `do`, `success`, `picture` |
| `proof` | `claim`, `how`, `revision`, `href`, `status` (`verified`, `partial`, `not-run`, `failed`), `why`, `change` |
| `ship` | `needs` (a list), `risk`, `undo` |
| `followups` | `id`, `title`, `why`, `owner`, `due` |
| `engineers` | `commits` (`sha`, `subject`, `href`), `files`, `notes`, `links` (`text`, `href`) |
| `extra` | `title` and `file`: an HTML fragment drawn as its own section after Try it |

- **Words** - every value is plain text in the reader's words, with plain hyphens and no dashes; `**bold**`, `` `code` `` and `[text](https://...)` render, and nothing else does
- **One line each** - a reason, a title, a before and a now each fit one line; the build warns past that
- **Proof per change** - give each change at least one proof row whose `change` is its `id`; the row's status shows on the change's card
- **How** - the method and where it lives: `Unit test, CartDrawer.test.tsx: strikes only the line a product discount cuts`, `E2E on the lot page`, `Walk on staging`, or `Read in points.ts` for a fact the code states
- **Status** - `verified`, checked on that revision by a run or by reading; `partial`, part of it checked, or checked on another revision; `not-run`, a test or walk that exists or is planned and nobody ran for this page; `failed`, it ran and failed
- **Phases** - give each change a `phase` when the work has many; the page groups the changes and counts new, changed and removed per phase
- **Ids are keys** - question and blocker numbers and follow-up ids outlive a version; never renumber or reuse one
- **A change's id is its address** - every link to its card ends in it, so the build refuses an id the page uses for its own parts, such as `decide` or `proof`
- **Answered** - once an answer is recorded, keep the question with `answered: {option, text, href}` naming the record, or a blocker with `done: {text, href}`; the card shows the outcome, and the reply stops asking it

## Decide

The page carries the Clarification Request from `AGENTS.md` (Questions and blockers) as cards, and `reply.md` carries the same numbers and words.

- **Question** - the short title and the exact ask; at least two options, the recommended one first as `A` with `"recommended": true`; each option's outcome and cost; `why`, `blocks`, and `reasons` with each source linked: a decision row, a requirement anchor, a commit, a test
- **Draw the difference** - where options differ in what a person sees or how a flow runs, give each option the picture of its outcome: a `mock` each, a `lanes` timeline, a `flow`
- **Blocker** - the exact action, `who` can take it, and what waits on it; the card carries a `Done` box
- **Agent decisions** - each decision taken without asking; the reader overrules one in a PR comment
- **❓ and 🚧** - an open ❓ on the PRD is a question; a 🚧 outcome is confirmed and in flight, and is never asked again
- **Words not yet written** - an option that adds a screen, a letter or a switch has no catalog words: mark them `"draft": true` (a dotted underline), and what the option adds `"added": true` (a dashed outline); the page adds the key

### Answers come back on the PR

- **Pick** - picks and notes stay in the reader's browser; `Copy answers` puts one line (`Answers: 1A, 2B - note`) on the clipboard for a PR comment or the chat
- **Read back** - when the person says they are done, read the PR's comments (`gh pr view <n> --comments`) and act; a product answer moves to its record first - the PRD page and `decisions.md` through `/planning-pm`, a task through `tasks.md` - and the next version marks the card `answered` or `done`

## Pictures

Every change, option and step leads with a picture; text is captions and short cards. `assets/pictures.json` holds one of each kind, ready to copy.

| The content | `kind` | Holds |
| --- | --- | --- |
| A screen of the build under review | `shot` | `src` (`shots/<name>.jpg`), `phone` |
| A visual change | `beforeNow` | `before`, `now`: two shots of the same state |
| What a question's option would show, where nobody has built it | `mock` | `frame` (`phone`, `desktop`, `email`, `push`), `title`, `url` (desktop), `from` and `subject` (email), `app`, `time` and `body` (push), `items` |
| A path through screens or systems | `flow` | `steps`: `text`, `who`, `arrow` (the label on the way in), `tone` |
| Two people racing, or anything with a clock | `lanes` | `lanes`, and `events`: `at`, `lane`, `to`, `text`, `tone` |
| A status | `states` | `states`: `name`, `means`, `by`, `who` |
| What moved | `table` | `columns`, `rows` |
| Words or values that changed, key by key | `diff` | `rows`: `name`, `before`, `now`; a row with only `now` is new, one with only `before` is removed |
| Things moving between stages | `board` | `columns`: `name`, `tone`, `items` |
| Numbers | `bars` | `unit`, and `items`: `label`, `value` |

- **Any picture** - takes a `caption`, and `added: true` when an option adds all of it; in a list of pictures, a `mock` or `shot` sits beside the next where they fit, and every other kind takes the full row
- **No kind fits** - draw it with the closest kind, and name the missing kind in the reply: what it would show, and for which change; a new kind lands as an entry in `assets/data.schema.json` and a drawing in `assets/template.html`, never as markup in the data
- **Diff** - marks the words a row changed; a colour shows its swatch; a value that changed whole is shown unmarked
- **Phones** - on a narrow screen a `flow` runs top to bottom, and `lanes` become a list
- **Screens are captured** - a screen on the page is the screen the frontend renders: a `shot` or `beforeNow` that `scripts/shoot.mjs` captured, which the page captions with the story and the commit it came from; the build refuses one `shots/shots.json` does not record, and a `mock` anywhere but a question's option
- **Mock items** - one part each: `h`, `text` (`muted`), `label` with `value`, `button` (`primary`), `switch` (`on`), `field` with `value`, `notice`, `tip`, `badge`, `divider`; each may add `draft`, `added` and `tone`; `draft: true` on the mock itself marks its subject, title and body
- **Tones** - `ok`, `warn`, `bad`, `info`, `accent`, `none`
- **Mocks** - an option's planned screen only, in the product's own colours, light in both page themes, with the catalog's words

## Real Screenshots

Diagrams explain; screenshots prove. Every change that shows on a screen gets the real screen of the build under review, after its diagram.

- **Capture with `shoot.mjs`** - `node .claude/skills/handoff-page/scripts/shoot.mjs <scratchpad>/handoff --plan <plan.json>` starts the workbench from this checkout, captures each shot the plan names, and records it in `shots/shots.json`; `--find <words>` lists the story ids, and `--at <commit>` captures the stories as they stood at that commit, from a temporary worktree. A plan is a list: `{"name": "lot-extended", "story": "<story id>", "args": {...}, "phone": true}`, or `{"name": "lot", "url": "http://localhost:5173/..."}` for a page a running app serves
- **No story, no picture** - a state with no story is the designer's to draw first (`/storybook-workbench`); until then the card has no picture and its Proof row reads `partial`. Never draw it
- **Use the story's own args** - make the state the caption claims through the story's args, and the catalog's words; the reply names each story it captured
- **Story order** - capture a process in one serial run, so each screen shows the result of the step before; a cross-role effect is captured after the step that causes it
- **Demo data only** - no production data, no real person's name, address, card, document or identity photo, and no token, magic link or session id in an address bar; a page travels further than you expect
- **Look at every image** - the thing that matters below the fold (scroll or filter to it), a PDF blank in headless Chromium (render page 1 with `pdftoppm -jpeg -f 1 -l 1`), a dev badge in a corner (hide it)
- **Size** - `shoot.mjs` captures desktop at 1280 wide and phone at 390, as JPEG, into `<scratchpad>/handoff/shots/`, where the build and the check look for them
- **Capturing finds bugs** - each one goes into Follow-ups and the reply: a past sale still saying it opens soon, a countdown to a date already gone

## Walkthroughs

For a change whose value is a process - setting up a sale, a vault case from intake to payout - Try it walks it step by step.

- **One path per person** - give each step a `role` (`Admin`, `Collector`); the page shows a switch per role and remembers the choice; a step with no role shows on every path
- **Bands in time** - `when` groups the steps: `Before the sale`, `On the day`, `After it closes`
- **Each step** - a title in the user's words; `do` in one or two sentences, saying what it does not touch; `where` (`Console → Auctions`, a URL); `success`, the exact message from the catalog; a `shot` as its `picture` when one was captured
- **Cast** - the seeded people chosen on purpose: a fresh account for a first-time path, a returning one for history, one with a failing card for a refusal

## Beyond the Template

A simulation - a countdown, a race, an extension, a retry - is code the template does not draw, and is worth it only when the work turns on a clock or a race. Write it as an HTML fragment (its markup and a `<script>`) in a file beside the data and name it in `extra`; the page draws it as its own section after Try it, or first with `"lead": "extra"` when the page is about it.

- **Watch the demo** - a scripted story that reaches every rule, at a selectable speed
- **Play it yourself** - the reader acts in each person's window
- **Before / Now** - replays the old behaviour against the new
- **Every case on the page** - several cases stack one after another, each with its own Play and Reset; settings they share sit in one bar above them; never hide a case behind a tab, since the reader compares cases by scrolling
- **From the code** - the rules ported from the code's pure functions, every message from the catalog
- **At rest** - under `prefers-reduced-motion` it opens paused on a first frame that already reads as a picture
- **Repaint** - build each window's skeleton once with one slot per field, and repaint a slot only when its own HTML changes; rebuilding on each tick loses clicks

## Check

1. **Facts** - re-read each claim against its source, recount every number from its source, and find each label in the catalog (`grep -rn '"<label>"' packages/i18n/messages/shared/en/`)
2. **Render** - the `next:` line the build prints, `node <repo>/.claude/skills/handoff-page/scripts/check.mjs <page>`, run from `apps/preview` or any folder where Playwright resolves; it wraps the page in the skeleton and content policy it is served with (`scripts/document.mjs`), renders it 390, 1024 and 1280 wide in light and dark, answers every card, narrows the page to each reader in the filter, and fails on a script error, a missing file, sideways scroll, a broken image, a theme that does not flip, a pick missing from the answer line, or a reader the filter leaves with no change
3. **Look** - open the `-top.png` shots and the section shots (`-<section>.png`, at 390 and 1280 wide); a clean run can still read badly
4. **Cold read** - when the page asks anything, one fresh subagent with none of this session's context reads the top shot and the Decide section and answers: what is the verdict, what am I asked, what would I pick and why; whatever it gets wrong is rewritten in the data, because the real reader starts from the same place; a session with no subagent says the cold read did not run
5. **Simulate** - for an `extra` simulation, drive it headless: Watch the demo at top speed and read its log against the code's rules, act in each window, flip Before / Now
6. **Verify** - dispatch the `page-verifier` agent (`.claude/agents/page-verifier.md`, on Haiku) with the paths of `data.json`, the facts, `shots/` and `check/`; it checks every number, commit, before and now, quoted word, shot and link against its source and returns one line per finding. Fix each in the data, build, and dispatch a fresh one until it returns `clean`; a session with no subagent says the verify did not run

A cloud session whose Playwright wants another browser build sets `CHROMIUM_PATH=/opt/pw-browsers/chromium`; a new machine runs `pnpm setup:browsers` once.

## Publish and Hand Over

1. **Publish** - before the PR merges, from the repository root, `node .claude/skills/handoff-page/scripts/publish.mjs <scratchpad>/handoff/page.html --pr <n>`; it force-pushes the page and `<scratchpad>/handoff/shots/` to `handoff/pr-<n>` and dispatches the Handoff page workflow (`.github/workflows/handoff.yml`), which uploads them and keeps one comment on the PR with the link; closing the PR deletes the branch, and a merged PR's run deletes it after the upload
2. **Confirm** - wait for that run (`gh run watch`), open its link from the PR comment, and say in one line what you exercised and what you could not, and why
3. **Reply** - the contents of `reply.md`, with `{{link}}` replaced by the page's link and `#decide` after it when anything is asked, or build again with `--url <link>` to fill it; it reads as The Reply says
4. **Rounds** - each round re-checks the facts, raises `stamp.version`, writes `since`, builds, checks and publishes again; the link holds
5. **Clean up** - delete the capture spec and its `test-results/`, stop any server, and keep the data, the page and the screenshots out of the repository

### The Reply

`reply.md` is a draft the person can read without opening the page: the verdict with its exceptions (`Ready, 7 of 9 claims verified`), what changed, what is not verified, then the Clarification Request. Long lists stop at six and point at the page. Trim or reword it to fit the conversation; `writing-style` governs the words.

- **Each line a result** - what a change does now, or what a check found, in the catalog's words: `The label reads **Time left (extended)** until the lot closes`
- **Say where it was checked** - the workbench, staging or CI, on which commit; a failure says why, and whether it was already known
- **Held back is not impossible** - an action waiting on the person's permission, such as a deploy, is named as waiting on them
- **An offer names its cost** - what it would take or leave behind
