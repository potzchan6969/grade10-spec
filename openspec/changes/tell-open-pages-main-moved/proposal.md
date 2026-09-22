# Tell an open page that `main` moved

**Author:** @ecchochan - 2026-09-20

Product context: [Change Stages](../../../docs/prds/products/shared/planning/change-stages.md), a planned page under [Planning](../../../docs/prds/products/shared/planning/index.md). Owner's brief: [Delivery workflow blueprint](../../../docs/references/delivery-workflow-blueprint.md).

## Why

Every message a hand is sent points at a page, and the page can be older than the message. The planning messages go out on the push to `main` (`stage-changes-and-notify-hands` decisions Q60), while the hosted manual is rebuilt and redeployed by `manual.yml` after it: a full clone with its submodule, an install, the OpenSpec CLI, the snapshot build and a Wrangler deploy. A hand who opens the link in that window reads the stage before the landing, and a hand whose page was already open reads it until they think to reload. The footer names the commit the snapshot was built from and nothing compares it with `main`, so nothing on the screen says the page is behind.

The same gap is wider at a terminal. A teammate running the manual locally, or working the store as a submodule, reads whatever their checkout holds; nothing says how far behind `main` it is, and the fix is a `git pull` nobody is prompted to make.

Success is a reader who never acts on a stale page: a page open while `main` moves says so, refreshes itself once the site has caught up, and a locally run manual says how many commits behind `main` the checkout is and pulls on one click. The number to move: how long a hand reads a page built before the push they were told about, which nothing measures today.

## What Changes

- **A page open while `main` moves is told.** The code host's push webhook reaches the relay, and the relay tells every open page over one socket. The hosted manual shows a banner naming the commit's subject and how long ago it landed, offers Refresh now to a reader who will not wait for the deploy, and refreshes itself once the deployed snapshot's head is `main` - not before, because a reload while the site is still building gives the reader the same page again. Nothing is reloaded under a reader who is typing.
- **The locally run manual says how far behind the checkout is, and pulls.** It reads `origin/main` and says how many commits behind `main` the checkout is; Pull fast-forwards on one click, and is refused with the reason when the tree is dirty or the checkout is ahead.
- **The relay holds the head.** One `Live` Durable Object holds `main`'s head, its subject and when it landed, answers `GET /head` to anybody and broadcasts a move to every socket on `GET /live`. A page that cannot reach the relay shows no banner and reads as it does today. A delivery the relay never receives leaves the head as it was: no page is told, and the next push's delivery corrects it.
- **Operations owns three lines.** The push webhook on the repository, the relay's eighth secret, and `RELAY_URL` as a repository variable `manual.yml` passes to the build. With the variable unset the feature is off and nothing else changes.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/planning/change-stages`: how a reader is told that what the page shows has moved. The capability already states where teammates look after `main` moves; this change states what an open page and a local checkout do about it. `stage-changes-and-notify-hands` creates the capability, and this change carries no requirement that change writes.

## Impact

- `grade10-spec`: `tools/relay` gains `POST /github/events`, the `Live` Durable Object created by migration `v2`, `GET /head` and `GET /live`, and `GITHUB_WEBHOOK_SECRET` as the eighth required secret; `tools/manual` gains `GET /api/relay`, `GET /api/head`, `GET /api/upstream`, `POST /api/pull`, the `useMainHead` hook and the banner in the shell; `build-snapshot.mts` writes `dist/api/relay` and `dist/api/head`; `.github/workflows/manual.yml` takes three edits - `RELAY_URL` passed to the build step, its `paths:` filter dropped, and a `workflow_run` trigger on Lint, so a push made with the default token rebuilds the site too.
- Operations, in this order: `run-a-round-on-every-artifact`'s 8.1 deploys the relay with the real `REPO`, which gives every step below the origin to point at; then `GITHUB_WEBHOOK_SECRET`, set before the relay build that requires it ships, because a relay with one secret unset answers 500 on every route; then the push webhook on the repository and `RELAY_URL` on the repository variables, which are safe in either order; then a `manual.yml` re-run, which is what puts the variable into the built site. The plan's deploy group carries the date it is next chased and the handle who chases it, because `hands:` has no Operations key.
- The way back: `RELAY_URL` deleted and `manual.yml` re-run takes the banner off the hosted site, and the webhook disabled stops the head moving. A relay rolled back keeps the `Live` class and the head it stored - only a `deleted_classes` migration removes them.
- The locally run manual's half is not gated: `GET /api/upstream` and `POST /api/pull` need no webhook, no secret and no `RELAY_URL`, ship the moment the code lands, and their way back is a revert.
- Every teammate: a banner on a page that has moved, and a Pull button on the locally run manual. Nobody signs in, and nothing is edited from the hosted site.
- No consuming application: the relay and the manual are this store's own tools, and no component export moves.

## Open Questions

None.

## References

- [Change Stages · Surfaces](../../../docs/prds/products/shared/planning/change-stages.md#surfaces)
- [Delivery workflow blueprint](../../../docs/references/delivery-workflow-blueprint.md)
- [PRDs and OpenSpec · The change's record](../../../docs/governance/prd-and-openspec.md#the-changes-record)
- [Task ownership](../../../docs/governance/task-ownership.md)
