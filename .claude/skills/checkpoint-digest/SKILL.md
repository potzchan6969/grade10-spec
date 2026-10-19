---
name: checkpoint-digest
description: "Tell the team in Slack what moved on a branch since its last checkpoint: read the commits between the checkpoint and the branch head, draw what changed as one page of pictures, and publish it; CI uploads the page, posts its link to Slack and moves the checkpoint. Use when a push or a schedule runs the digest, or when asked what changed on a branch since the last digest."
---

# Checkpoint digest

One Slack post that tells the team what moved on a branch since the last post: the changes a reader would notice, listed by area, with a link to the page that draws each one. The page sits behind the team's Cloudflare login, like a handoff page. The checkpoint, the commit the last digest was drawn to, lives in the repository as `refs/checkpoints/<branch>`, so every run starts where the last one stopped, on any machine. A push or a schedule runs it unattended; nobody answers anything on the page.

The page is a `handoff-page` page of kind `digest`: you write the facts as one data file, and that skill's builder draws and checks it. Read `.claude/skills/handoff-page/SKILL.md` for Principles, Data, Pictures and Check; this skill names only what a digest does differently.

## Steps

`<scratchpad>` is the session's scratchpad directory, or any folder outside the repository. `<skill>` is `.claude/skills/checkpoint-digest`.

1. **Load** - `writing-style`, for every word on the page and in the post
2. **Range** - `node <skill>/scripts/checkpoint.mjs range --branch <branch>`; with `commits` at 0, stop: post nothing and move nothing
3. **Facts** - `node <skill>/scripts/checkpoint.mjs facts --branch <branch> > <scratchpad>/digest/facts.json`, then read what Gather names
4. **Write the data** - copy `<skill>/assets/example.json` to `<scratchpad>/digest/data.json`, replace every value with your own, and delete `"example"`
5. **Build and check** - `node .claude/skills/handoff-page/scripts/build.mjs <scratchpad>/digest/data.json`, then the `next:` line it prints, from `apps/preview` or any folder where Playwright resolves; fix every `FAIL`, and look at `check/page-1280-light-changed.png`
6. **Preview the post** - `node <skill>/scripts/slack.mjs <scratchpad>/digest/data.json --url https://example.com` prints the message CI will send
7. **Publish** - from the repository root, `node <skill>/scripts/publish.mjs <scratchpad>/digest/page.html --branch <branch> --to <to> --from <saved>`, with `to` and `saved` from step 2 (`saved` is `null` on a first run, and `--from null` passes it); it force-pushes the page, its shots and its range to `digest/<branch>` and dispatches the Checkpoint digest workflow (`.github/workflows/checkpoint-digest.yml`)
8. **Confirm** - wait for that run (`gh run watch`); its summary holds the page's link, and the post is in the channel

The workflow uploads the page, posts the link, then moves the checkpoint, in that order. A run that fails before the move leaves the checkpoint where it was, so the next digest tells the same range again. A post is never lost; at worst it is sent twice.

## The Checkpoint

- **Where** - `refs/checkpoints/<branch>` on `origin`, pointing at the last commit a digest covered; it is no branch and no tag, so it shows in no branch list and triggers no push workflow
- **Read** - `range` fetches it and prints `from`, `to`, `commits` and `base`
- **First run** - with no checkpoint, `range` starts from the last commit older than 7 days (`CHECKPOINT_FIRST_RUN` changes it), and `base` reads `first-run`
- **Rewritten branch** - when a force-push left the checkpoint off the branch, `range` starts where the two still agree, and `base` reads `merge-base`; say so in the post
- **Two runs at once** - `advance` pushes with a lease on the value it read, so the second run is refused and says so; it posted a range the first run also posted, and nothing is lost
- **Who moves it** - the workflow, with its own token; a session never needs push rights for it
- **Look at it** - `git ls-remote origin 'refs/checkpoints/*'`; move it by hand with `advance --to <sha>`

## Gather

- **Facts** - `facts.json` holds the commits, the merged pull requests, lines per area, the OpenSpec changes that moved, token and catalog values before and now, and the primitives and blocks added or removed
- **Read the source** - a commit subject says what someone meant; the diff says what happened. Read `git diff <from>..<to> -- <path>` for every change you draw, and the PRD page or OpenSpec change it names
- **Areas** - `facts.json` groups files by area: OpenSpec changes, Requirements, Product pages, References, Tokens, Primitives, Blocks, Copy, Stories and pages, Emails, Agent skills, Governance, Tooling and CI; a path no area claims is grouped by its top folder
- **Bots** - commits by `github-actions[bot]` that only record a report count toward nothing; a range that holds only those moves the checkpoint without a post

## What the Reader Gets

### One post and one page

- **Post** - the page's title as a header, the reason with an Open the page button, the repository, branch, range and date, then one block per area listing each change as its title and its now line, then Follow-ups
- **Page** - every change drawn, at `reports/grade10-spec/digest/<branch>/<commit>/` on the reports host, behind the team's Cloudflare login; the host drops it 30 days after upload
- **Title** - `<Branch> Branch Digest`, such as `Main Branch Digest`
- **Reason** - the two or three moves that matter most, in one line: `3 site pages proposed, the Accounts pages rewritten, and the company site catalogs added`

### What changed, by area

Each change is one card with a `phase` naming its area; the page groups and counts them. Draw what a reader would act on, not every commit.

| What moved | Draw it as |
| --- | --- |
| OpenSpec changes proposed, accepted or archived | A `table` of change and where it moved, or a `flow` of its stages |
| A rule on a product page or in a requirement | `before` and `now` lines, and a `flow` or `states` when it is a path or a status |
| Token values | A `table` of token, before and now; a `mock` with the new values when a reader would see them |
| Catalog words | A `table` of key and words, with before and now where words changed |
| A primitive or block added or removed | A `shot` of its story when one can be captured, else a `mock` with `rendered` set |
| Where the work landed | `bars` of lines or commits per area, as the last card |
| Tooling, CI and agent skills | One card each for what changes how the team works; the rest goes in For engineers |

- **Kind** - `new`, `changed` or `removed` when the change is one; leave it out for an overview card
- **Who** - the readers who notice it: `Product`, `Design`, `Engineering`, `Members`
- **Proof** - leave it out; a digest reports what landed and claims nothing about whether it works
- **Follow-ups** - what the range leaves waiting: a change proposed and not accepted, a 🚧 line with no change, a design-sync report that drifted
- **For engineers** - the merged pull requests as `commits`, and the facts command in `notes`

## Running It Unattended

A push or a schedule runs this skill in a session or a CI job. The session needs:

- **History** - `range` unshallows a shallow clone; a checkout with `fetch-depth: 0` skips that
- **A browser** - Playwright and Chromium for the check; `pnpm setup:browsers` installs them
- **Push rights for `digest/*`** and **`gh`** - to push the page and dispatch the workflow, as a handoff page does

The Checkpoint digest workflow needs, in the repository's settings:

- **`E2E_REPORTS_R2_*`** - the secrets the Handoff page workflow already uses
- **`SLACK_BOT_TOKEN`** and **`vars.SLACK_CHANNEL_ID`** - the bot and channel the Manual and Storybook workflows already post with

The workflow runs one digest per branch at a time and refuses a run whose secrets or channel are missing. On a push to the branch, pass the branch with `--branch`; the head of the checkout is `to`. A schedule that finds no commits posts nothing.
