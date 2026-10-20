---
name: checkpoint-digest
description: "Tell the team in Slack what moved on a branch since its last checkpoint: read the commits between the checkpoint and the branch head, draw each day they landed on as one page of pictures, and publish them; CI uploads the pages, posts what is new to Slack and moves the checkpoint. Use when a push or a schedule runs the digest, or when asked what changed on a branch since the last digest."
---

# Checkpoint digest

One page per day of what moved on a branch, and a Slack post whenever a run brings something new: the changes a reader would notice, listed by area, each linked to the card that draws it. The page sits behind the team's Cloudflare login, like a handoff page. The checkpoint, the commit the last digest was drawn to, lives in the repository as `refs/checkpoints/<branch>`, so every run starts where the last one stopped, on any machine. A push or a schedule runs it unattended; nobody answers anything on the page.

The page is a `handoff-page` page of kind `digest`: you write the facts as one data file, and that skill's builder draws and checks it. Read `.claude/skills/handoff-page/SKILL.md` for Principles, Data, Pictures and Check; this skill names only what a digest does differently.

## Steps

`<scratchpad>` is the session's scratchpad directory, or any folder outside the repository. `<skill>` is `.claude/skills/checkpoint-digest`.

1. **Load** - `writing-style`, for every word on the page and in the post
2. **Range** - `node <skill>/scripts/checkpoint.mjs range --branch <branch>`; with `commits` at 0, stop: post nothing and move nothing. `days` lists the days the new commits landed on
3. **Facts** - for each day in `days`, `node <skill>/scripts/checkpoint.mjs facts --branch <branch> --day <day> > <scratchpad>/digest/<day>/facts.json`, then read what Gather names; the facts cover the whole day, and `fresh` marks the commits this run brings
4. **Write the data** - for each day, copy `<skill>/assets/example.json` to `<scratchpad>/digest/<day>/data.json`, replace every value with your own, and delete `"example"`
5. **Build and check** - `node .claude/skills/handoff-page/scripts/build.mjs <scratchpad>/digest/<day>/data.json`, then the `next:` line it prints, from `apps/preview` or any folder where Playwright resolves; fix every `FAIL`, and look at `check/page-1280-light-changed.png`
6. **Preview the post** - `node <skill>/scripts/slack.mjs <scratchpad>/digest/<day>/data.json --url https://example.com --from <from> --to <to>`, with `from` and `to` from step 2, prints the message CI will send, or that the day brought nothing new
7. **Publish** - from the repository root, `node <skill>/scripts/publish.mjs <scratchpad>/digest/<day>/page.html... --branch <branch> --from <from> --to <to> --saved <saved>`, every day's page in one call, with `from`, `to` and `saved` from step 2 (`saved` is `null` on a first run, and `--saved null` passes it); it force-pushes the pages, their shots and the range to `digest/<branch>`, under `.digest/` on top of `main`, and that push starts the Checkpoint digest workflow (`.github/workflows/checkpoint-digest.yml`); it needs no `gh` and no token
8. **Confirm** - follow that run in the repository's Actions tab, with `gh run watch` or the GitHub tool; its summary holds each day's link, and each post is in the channel

The workflow uploads each day, posts what the run brought, then moves the checkpoint, in that order. A run that fails before the move leaves the checkpoint where it was, so the next run redraws the same days and posts the same changes. A post is never lost; at worst it is sent twice.

## Days, Not Runs

- **A day is the page** - each page covers every commit that landed on the branch on one Hong Kong day, from the branch at the day's start to the day's last commit; how often the digest runs never changes what a day's page covers
- **A run redraws whole days** - a run draws every day its new commits landed on, in full, so an hourly run redraws today with all of today, and a run after midnight finishes yesterday as well
- **The same day twice** - a redrawn day replaces its page and its entry in the day list; a run with no new commits changes nothing
- **The post is the run's** - each day's post lists only the changes whose `commits` include one this run brought; a day with none posts nothing, so a quiet hour stays quiet

## The Checkpoint

- **Where** - `refs/checkpoints/<branch>` on `origin`, pointing at the last commit a digest covered; it is no branch and no tag, so it shows in no branch list and triggers no push workflow
- **Read** - `range` fetches it and prints `from`, `to`, `saved`, `commits`, `base` and `days`
- **First run** - with no checkpoint, `range` starts from the branch as it stood at the end of last Friday, Hong Kong time (`CHECKPOINT_FIRST_RUN` takes any other date), and `base` reads `first-run`
- **Rewritten branch** - when a force-push left the checkpoint off the branch, `range` starts where the two still agree, and `base` reads `merge-base`; say so in `since`, which the page and the post show under the numbers
- **Two runs at once** - `advance` pushes with a lease on the value it read, so the second run is refused and says so; it posted changes the first run also posted, and nothing is lost
- **Who moves it** - the workflow, with its own token; a session never needs push rights for it
- **Look at it** - `git ls-remote origin 'refs/checkpoints/*'`; move it by hand with `advance --to <sha>`

## Gather

- **Facts** - `facts.json` holds the commits, the merged pull requests, lines per area, the OpenSpec changes that moved, token and catalog values before and now, and the primitives and blocks added or removed
- **Read the source** - a commit subject says what someone meant; the diff says what happened. Read `git diff <from>..<to> -- <path>` for every change you draw, and the PRD page or OpenSpec change it names
- **Areas** - `facts.json` groups files by area: OpenSpec changes, Requirements, Product pages, References, Tokens, Primitives, Blocks, Copy, Stories and pages, Emails, Agent skills, Governance, Tooling and CI; a path no area claims is grouped by its top folder
- **Bots** - commits by `github-actions[bot]` that only record a report count toward nothing; a run that brings only those publishes nothing, and the next run's range still holds them

## What the Reader Gets

### One Post and One Page

The post repeats the top of the day's page, then lists what the run brought, in the page's order.

- **Post head** - the title; the day, the repository and branch, and the day's range, which opens GitHub's comparison of the two commits
- **Post lead** - the reason, the numbers and an Open the digest button, which opens the branch's one link
- **Post changes** - how many are new since the last post, of how many on the day, then the new ones grouped by area as on the page: each change's kind, its title linking to its card, and who notices it; past 12 changes, one link to the rest
- **Post follow-ups** - one link to the page's follow-ups, with their count; listing them in every post would repeat them each hour
- **Page** - every change of the day drawn, at `reports/grade10-spec/digest/<branch>/<day>/` on the reports host, behind the team's Cloudflare login; the host drops it 30 days after its last upload
- **One link** - `reports/grade10-spec/digest/<branch>/index.html` always opens the newest day; the run keeps `days.json` beside it (`scripts/days.mjs`), one entry per day for the last 29 days, newest first
- **Day bar** - every day's page carries one from that list: Earlier, a pick of every day, and Later
- **Title** - `<Branch> Branch Digest`, such as `Main Branch Digest`
- **Reason** - the two or three moves that matter most, in one line: `3 site pages proposed, the Accounts pages rewritten, and the company site catalogs added`
- **Numbers** - the day's counts a reader would quote, four at most, each recounted from `facts.json`: commits, pull requests merged, changes proposed, changes archived

### What Changed, by Area

Each change is one card with a `phase` naming its area; the page groups and counts them. Draw what a reader would act on, not every commit.

| What moved | Draw it as |
| --- | --- |
| OpenSpec changes proposed, accepted or archived | A `board` with one column per move, or a `flow` of one change's stages |
| A rule on a product page or in a requirement | `before` and `now` lines, and a `flow` or `states` when it is a path or a status |
| Token values | A `diff` of each token, before and now, where a colour shows its swatch; a `mock` with the new values when a reader would see them |
| Catalog words | A `diff` of each key's words where they changed; a `table` of key and each language where they are new |
| A primitive or block added or removed | A `shot` of its story when one can be captured, else a `mock` with `rendered` set |
| Where the work landed | `bars` of lines or commits per area, as the last card |
| Tooling, CI and agent skills | One card each for what changes how the team works; the rest goes in For engineers |

- **Kind** - `new`, `changed` or `removed` when the change is one; leave it out for an overview card
- **Commits** - every commit the change comes from, from `facts.json`; the build refuses a change without them, and the post finds what is new through them
- **Who** - the readers who notice it: `Product`, `Design`, `Engineering`, `Members`, `Visitors`; the page's filter and the post use the same names
- **Links** - the sources a reader opens next: the proposal, the pull request, the requirement
- **Proof** - leave it out; a digest reports what landed and claims nothing about whether it works
- **Follow-ups** - what the range leaves waiting: a change proposed and not accepted, a 🚧 line with no change, a design-sync report that drifted
- **For engineers** - the merged pull requests as `commits`, and the facts command in `notes`

## Running It Unattended

A push or a schedule runs this skill in a session or a CI job. The session needs:

- **History** - `range` unshallows a shallow clone; a checkout with `fetch-depth: 0` skips that
- **A browser** - Playwright and Chromium for the check; `pnpm setup:browsers` installs them
- **Push rights for `digest/*`** - the push itself starts the workflow

The Checkpoint digest workflow needs, in the repository's settings:

- **`E2E_REPORTS_R2_*`** - the secrets the Handoff page workflow already uses
- **`SLACK_BOT_TOKEN`** and **`vars.SLACK_CHANNEL_ID`** - the bot and channel the Manual and Storybook workflows already post with

The workflow runs one digest per branch at a time and refuses a run whose secrets or channel are missing. On a push to the branch, pass the branch with `--branch`; the head of the checkout is `to`. A schedule that finds no commits posts nothing.
