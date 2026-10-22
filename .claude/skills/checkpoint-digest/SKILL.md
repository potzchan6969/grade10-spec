---
name: checkpoint-digest
description: "Tell the team in Slack what moved on a branch since its last checkpoint, in the spec store and the application built from it: read the commits between each checkpoint and the branch head, draw each day they landed on as one page of pictures, and publish them; CI uploads the pages, posts what is new to Slack and moves the checkpoint. Use when a push or a schedule runs the digest, or when asked what changed on a branch since the last digest."
---

# Checkpoint digest

One page per day of what moved on a branch, in the spec store and in the application built from it (`9gag/grade10`), and a Slack post whenever a run brings something new: the changes a reader would notice, listed by area, each linked to the card that draws it. A change follows its work across both: proposed and accepted here, built there. The page sits behind the team's Cloudflare login, like a handoff page. The checkpoint, the commit the last digest was drawn to, lives in the repository as `refs/checkpoints/<branch>`, so every run starts where the last one stopped, on any machine. A push or a schedule runs it unattended; nobody answers anything on the page.

The page is a `handoff-page` page of kind `digest`: you write the facts as one data file, and that skill's builder draws and checks it. Read `.claude/skills/handoff-page/SKILL.md` for Principles, Data, Pictures and Check; this skill names only what a digest does differently.

## Steps

`<scratchpad>` is the session's scratchpad directory, or any folder outside the repository. `<skill>` is `.claude/skills/checkpoint-digest`. `<build>` is a checkout of the application repository; without `--build` the digest covers this repository alone.

1. **Load** - `writing-style`, for every word on the page and in the post
2. **Range** - `node <skill>/scripts/checkpoint.mjs range --branch <branch> --build <build> > <scratchpad>/digest/range.json`; with `commits` at 0, stop: post nothing and move nothing. `days` lists the days the new commits landed on, in either repository
3. **Facts** - for each day in `days`, `node <skill>/scripts/checkpoint.mjs facts --branch <branch> --build <build> --day <day> > <scratchpad>/digest/<day>/facts.json`, then read what Gather names; the facts cover the whole day in both repositories, and `fresh` marks the commits this run brings
4. **Chunk** - for each day, `node <skill>/scripts/chunks.mjs <scratchpad>/digest/<day>/facts.json > <scratchpad>/digest/<day>/chunks.json`; with `split` false, draw the day yourself and skip to step 6
5. **Dispatch** - with `split` true, dispatch one `digest-chunk` agent per chunk, all in one message so they run at once: give each its chunk's `id`, `spec` and `build` commits, the day's folder, its `facts.json` and `--build`'s checkout; each writes `<scratchpad>/digest/<day>/chunks/<id>.json`. While they run, read the day's head yourself: the reason, the numbers and what spans chunks
6. **Write the data** - for each day, copy `<skill>/assets/example.json` to `<scratchpad>/digest/<day>/data.json`, replace every value with your own, and delete `"example"`. On a split day write the head, the cards that span chunks, the Where the work landed card and For engineers, then `node <skill>/scripts/merge.mjs <scratchpad>/digest/<day>`: it folds every chunk's cards and follow-ups into `data.json` and their shots into `plan.json`, and refuses a missing chunk, a card listing another chunk's commit, or an id two chunks share
7. **Capture** - for each screen a change shows, find its story with `node .claude/skills/handoff-page/scripts/shoot.mjs --find <words>` and capture it into the day's folder with `shoot.mjs <scratchpad>/digest/<day> --plan <plan.json> --at <the day's last commit>`, so a past day shows its screens as they stood then; a split day captures the merged `plan.json` and any shot of your own in one run; a screen with no story gets no picture
8. **Build and check** - `node .claude/skills/handoff-page/scripts/build.mjs <scratchpad>/digest/<day>/data.json`, then the `next:` line it prints, from `apps/preview` or any folder where Playwright resolves; fix every `FAIL`, and look at `check/page-1280-light-changed.png`
9. **Verify** - dispatch the `page-verifier` agent with the day's `data.json`, `facts.json`, `shots/` and `check/`, and `--build`'s checkout; fix every finding, build, and verify again until it returns `clean`; fix a chunk's card in its `chunks/<id>.json` and merge again, so a later merge does not undo the fix
10. **Preview the post** - `node <skill>/scripts/slack.mjs <scratchpad>/digest/<day>/data.json --url https://example.com --range <scratchpad>/digest/range.json` prints the message CI will send, or that the day brought nothing new
11. **Publish** - from the repository root, `node <skill>/scripts/publish.mjs <scratchpad>/digest/<day>/page.html... --range <scratchpad>/digest/range.json`, every day's page in one call; it force-pushes the pages, their shots and the range to `digest/<branch>`, under `.digest/` on top of `main`, and that push starts the Checkpoint digest workflow (`.github/workflows/checkpoint-digest.yml`); it needs no `gh` and no token
12. **Confirm** - follow that run in the repository's Actions tab, with `gh run watch` or the GitHub tool; its summary holds each day's link, and each post is in the channel

The workflow uploads each day, posts what the run brought, then moves both checkpoints, in that order. A run that fails before the move leaves both where they were, so the next run redraws the same days and posts the same changes. A post is never lost; at worst it is sent twice.

## Chunks

A busy day is too much for one reader: past 30 commits or 4,000 lines, its cards are drawn by agents that each read one focused part of it.

- **Groups** - `chunks.mjs` puts each commit with the OpenSpec change it moves or builds, else its commit scope, else the first area it touches, so a change proposed here and built in the application is one group
- **Chunks** - a group of half a chunk or more keeps a chunk of its own; smaller groups, ordered by the area they touch most, share chunks of up to 30 commits, or the day's commits over 8 when that is more
- **At most 8** - a day never dispatches more than 8 agents; with several days to draw, dispatch them day by day
- **The lead** - you write the head, the cards that span chunks, the build, the capture, the verify and the post; a `digest-chunk` agent writes only its chunk's file and captures nothing, so the workbench starts once a day
- **Quiet days** - a day under both limits is one chunk, `the-day`, and you draw it yourself
- **Bots** - report-only bot commits join no chunk; `bots` lists them

## Days, Not Runs

- **A day is the page** - each page covers every commit that landed on the branch on one Hong Kong day, from the branch at the day's start to the day's last commit; how often the digest runs never changes what a day's page covers
- **A run redraws whole days** - a run draws every day its new commits landed on, in full, so an hourly run redraws today with all of today, and a run after midnight finishes yesterday as well
- **The same day twice** - a redrawn day replaces its page and its entry in the day list; a run with no new commits changes nothing
- **The post is the run's** - each day's post lists only the changes whose `commits` include one this run brought; a day with none posts nothing, so a quiet hour stays quiet

## The Checkpoint

- **Where** - `refs/checkpoints/<branch>` on `origin`, pointing at the last commit a digest covered; it is no branch and no tag, so it shows in no branch list and triggers no push workflow
- **The application's** - `refs/checkpoints-of/<owner>/<name>/<branch>`, also in this repository: a commit with no files whose subject is the application commit the last digest covered, so one token moves both
- **Read** - `range` fetches both and prints, per repository under `spec` and `build`, `from`, `to`, `saved`, `commits` and `base`; `days` and `fresh` cover both
- **First run** - with no checkpoint, `range` starts that repository from the branch as it stood at the end of last Friday, Hong Kong time (`CHECKPOINT_FIRST_RUN` takes any other date), and `base` reads `first-run`
- **Redraw past days** - `range --from <spec sha> --build-from <application sha>` starts both repositories at the given commits rather than at their checkpoints, so the days since then are drawn and posted again; the workflow still moves each checkpoint with a lease on the value it holds now
- **Rewritten branch** - when a force-push left the checkpoint off the branch, `range` starts where the two still agree, and `base` reads `merge-base`; say so in `since`, which the page and the post show under the numbers
- **Two runs at once** - `advance` moves both checkpoints in one atomic push, with a lease on each value it read, so the second run is refused and says so; it posted changes the first run also posted, and nothing is lost
- **Who moves it** - the workflow, with its own token; a session never needs push rights for it
- **Look at it** - `git ls-remote origin 'refs/checkpoints*'`; move them by hand with `advance --to <sha> --build-repo <owner/name> --build-to <sha>`

## Gather

- **Facts** - `facts.json` holds the commits, the merged pull requests, lines per area, the OpenSpec changes that moved, token and catalog values before and now, and the primitives and blocks added or removed; `build` holds the application's commits, pull requests and lines per area; each commit names the areas it touches, the changes it moves or builds, and its lines, which `chunks.mjs` groups by
- **Links** - `build.links` names the changes whose work landed in the application that day: `recorded` where a change's `implementation.json` names the commit, `named` where a commit message names the change. Match the rest, `build.unlinked`, by reading the pull requests' titles and diffs; a commit that builds no change is drawn on its own when a reader would notice it
- **Read the source** - a commit subject says what someone meant; the diff says what happened. Read `git diff <from>..<to> -- <path>` for every change you draw, with `git -C <build>` for the application, and the PRD page or OpenSpec change it names
- **Areas** - `facts.json` groups files by area: OpenSpec changes, Requirements, Product pages, References, Tokens, Primitives, Blocks, Copy, Stories and pages, Emails, Agent skills, Governance, Tooling and CI; the application's by Agent skills, Tooling and CI, Spec store pin, Docs, then each app and package by its folder; a path no area claims is grouped by its top folder
- **Bots** - commits by `github-actions[bot]` that only record a report count toward nothing; a run that brings only those publishes nothing, and the next run's range still holds them

## What the Reader Gets

### One Post and One Page

The post repeats the top of the day's page, then lists what the run brought, in the page's order.

- **Post head** - the title; the day, the repository and branch, and the day's range, which opens GitHub's comparison of the two commits
- **Post lead** - the reason, the numbers and an Open the digest button, which opens the branch's one link
- **Post changes** - how many are new since the last post, of how many on the day, then the new ones grouped by area as on the page: each change's kind, its title linking to its card, who notices it, and its `now` line, so the post reads as results without opening the page; past 12 changes, one link to the rest
- **Post follow-ups** - one link to the page's follow-ups, with their count; listing them in every post would repeat them each hour
- **Page** - every change of the day drawn, at `reports/grade10-spec/digest/<branch>/<day>/` on the reports host, behind the team's Cloudflare login; the host drops it 30 days after its last upload
- **One link** - `reports/grade10-spec/digest/<branch>/index.html` always opens the newest day; the run keeps `days.json` beside it (`scripts/days.mjs`), one entry per day for the last 29 days, newest first
- **Day bar** - every day's page carries one from that list: Earlier, a pick of every day, and Later
- **Title** - `<Branch> Branch Digest`, such as `Main Branch Digest`
- **Reason** - the two or three moves that matter most, in one line: `3 site pages proposed, the Accounts pages rewritten, and the company site catalogs added`
- **Numbers** - the day's counts a reader would quote, four at most, each recounted from `facts.json`: commits and pull requests merged across both repositories (`pulls`, merged or squashed), changes proposed, changes built or archived

### What Changed, by Area

Each change is one card with a `phase` naming its area; the page groups and counts them. Draw what a reader would act on, not every commit.

Every card leads with a picture, and At a glance shows that picture as the card's thumbnail, so the day reads at a glance before a word of it. The build refuses a card without one. Pick by what the reader would recognise first:

1. **A screen** - a `shot` captured with `shoot.mjs`, or a `beforeNow` pair where the same state looks different; the thumbnail is the screen itself
2. **A chart** - `bars` for anything counted: lines, commits, keys, cases, tests
3. **A table** - `table` for things listed side by side: keys and their words, ids and their rules, files and what moved
4. **A diff** - `diff` for values or words before and now; a colour shows its swatch in the thumbnail too
5. **A diagram** - `board`, `flow` or `states` for moves between stages and paths

- **Several pictures** - a card may carry a list: the screen first, then the chart or table that explains it; the thumbnail shows the screen and counts the rest
- **Engineering cards** - tooling, CI and skills still get a picture: a `flow` of the new steps, a `table` of commands and what each does, or `bars` of what moved

| What moved | Draw it as |
| --- | --- |
| OpenSpec changes proposed, accepted or archived | A `board` with one column per move, or a `flow` of one change's stages |
| A change built in the application | One card for the change, with the spec store and application commits both under `commits`, its pull request under `links`, and a `shot` of what a reader now meets |
| Application work no change names | One card per thing a reader would notice; a refactor, a fix or CI goes in For engineers |
| A rule on a product page or in a requirement | `before` and `now` lines, and a `diff` of the rule's words, or a `flow` or `states` when it is a path or a status; a `shot` of the story that shows the rule when one exists |
| Token values | A `diff` of each token, before and now, where a colour shows its swatch; a `shot` of a story that shows them when a reader would see them |
| Catalog words | A `diff` of each key's words where they changed; a `table` of key and each language where they are new |
| A primitive or block added or removed | A `shot` of its story |
| Where the work landed | `bars` of lines or commits per area, as the last card |
| Tooling, CI and agent skills | One card each for what changes how the team works, with a `flow` or `table` of how it now runs; the rest goes in For engineers |

- **Kind** - `new`, `changed` or `removed` when the change is one; leave it out for an overview card
- **Commits** - every commit the change comes from, in either repository, from `facts.json`; the build refuses a change without them, and the post finds what is new through them
- **Who** - the readers who notice it: `Product`, `Design`, `Engineering`, `Members`, `Visitors`; the page's filter and the post use the same names
- **Links** - the sources a reader opens next: the proposal, the pull request, the requirement
- **Pictures of screens** - capture a `shot` for every card whose change a story shows, in either repository, before reaching for a diagram; only a `shot` captured with `shoot.mjs`, captioned with the story and commit it came from; the build refuses a `mock` on a digest, because a drawn screen never matches what the frontend renders, and a shot captured at any commit but the day's last
- **Proof** - leave it out; a digest reports what landed and claims nothing about whether it works
- **Follow-ups** - what the range leaves waiting: a change proposed and not accepted, a 🚧 line with no change, a design-sync report that drifted
- **For engineers** - the merged pull requests as `commits`, and the facts command in `notes`

## Running It Unattended

A push or a schedule runs this skill in a session or a CI job. The session needs:

- **History** - `range` unshallows a shallow clone of either repository; a checkout with `fetch-depth: 0` skips that
- **The application** - a checkout of `9gag/grade10` to pass as `--build`, with read access; the workflow never needs it
- **A browser** - Playwright and Chromium for the check; `pnpm setup:browsers` installs them
- **Push rights for `digest/*`** - the push itself starts the workflow

The Checkpoint digest workflow needs, in the repository's settings:

- **`E2E_REPORTS_R2_*`** - the secrets the Handoff page workflow already uses
- **`SLACK_BOT_TOKEN`** and **`vars.SLACK_CHANNEL_ID`** - the bot and channel the Manual and Storybook workflows already post with

The workflow runs one digest per branch at a time and refuses a run whose secrets or channel are missing. On a push to the branch, pass the branch with `--branch`; the head of the checkout is `to`. A schedule that finds no commits posts nothing.
