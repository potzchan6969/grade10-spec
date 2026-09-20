## Goals

- A page open while `main` moves says so, naming what landed and how long ago,
  and refreshes itself once the site shows it
- A teammate on the locally run manual sees how many commits behind `main` the
  checkout is, and pulls what landed on one click
- Neither happens under a reader who is typing, and neither asks anybody to
  sign in

## Non-Goals

- A sign-in on the hosted manual, and editing from it: the hosted site stays
  read-only, as Assign already is
- Live data on a page: the page reads one snapshot, and the deploy is what
  rebuilds it - this change only says when that snapshot is stale
- A subscription per change or per page: one webhook, one head, one socket
- Composing what a hand is told: the messages on a push are
  `stage-changes-and-notify-hands`'s
- Moving `main` or landing an artifact: the relay's landing path is its own
  change

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What says that `main` moved? | The code host's push webhook to the relay, which holds the head and tells every open page - decided by the round | The manual polling the code host from the browser, which needs a token in the page and rate-limits per reader; or a poll of the deployed snapshot alone, which cannot name what landed until the deploy is done |
| Q2 | When does a page refresh itself? | Only when the deployed snapshot's head is `main`: the banner shows at once, and the page polls `GET /api/head` every 30 s while it is behind and reloads the snapshot when it changes - decided by the round | Refreshing on the webhook, which serves the reader the same page again because the site has not rebuilt yet; or waiting for the reader to reload by hand, which is the gap this change closes |
| Q3 | How does the relay's URL reach the browser? | `GET /api/relay` answers `{ url }`, written at build to `dist/api/relay` from `RELAY_URL`; absent, the feature is off and no banner is ever shown - decided by the round | Baking the origin into the bundle, which puts a deploy-time value in a file the hosted site serves and cannot be turned off without a build; or the name `/api/live`, which the app already uses for a module of its own and which the site answers with `index.html` where it serves no such file, so a check of the wrong name passes |
| Q4 | What does the locally run manual read, and when is Pull refused? | `git fetch origin main` at most once a minute, then the counts from the checkout; Pull fast-forwards and is refused with the reason when the tree is dirty or the checkout is ahead - decided by the round | A fetch per request, which spends a network call on every render; or a Pull that stashes or merges, which decides for the teammate what happens to their own work |
| Q5 | Does Refresh now reload while the site is still rebuilding? | Yes: the link reloads whenever it is shown, and the banner's own words say the site rebuilds in a few minutes, so a reader who presses it early knows what they are getting - decided by the round | Hiding the link until the snapshot has caught up, which leaves a reader who wants the page now with nothing to press |
| Q6 | What does the locally run manual show with no remote, or after a fetch that fails? | No banner: with no `origin` there is nothing to count against, and a fetch that fails leaves the counts it last read and the time it read them - decided by the round | A banner reporting the failed fetch, which spends the one notice on the page on a tool's error rather than on the store |
| Q7 | What happens on a push to `main` that the hosted site does not rebuild on? | Two things, because there are two such pushes: `manual.yml` loses its `paths:` filter, so every push to `main` rebuilds the site; and it also runs on `workflow_run` of Lint, because Lint's own `chore(ci): apply Biome lint fixes` push is made with the default token, which fires the push webhook and starts no workflow at all. What neither reaches is bounded by `Q9` - decided by the round | Keeping the filter, which teaches readers to ignore the banner; or filtering the webhook by the paths the manual renders, which puts the manual's path list inside the relay |
| Q8 | Which text fields hold the refresh? | Any focused text field, text area or editable region, wherever it is on the page, and the refresh is taken the moment focus leaves - decided by the round | Only the locally run manual's editor, which drops a reader's search query mid-word and asks the shell to know which fields are the editor's |
| Q9 | What does the banner say when the site does not catch up? | After ten minutes behind it drops the promise that the site refreshes itself, says the site has not caught up, and the poll of `GET /api/head` backs off - decided by the round | Keeping the promise up, which reads as a page about to refresh while nothing is coming; or taking the banner down, which leaves the reader on a page that is behind with nothing said |

## Raised

The blind suite pass raised four questions, every one settled above.

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/planning/change-stages | Refresh now is offered while the site is still rebuilding: does pressing it reload anyway, and give the reader the same page and the same banner? | Q5 |
| shared/planning/change-stages | A checkout with no remote, or one whose fetch fails: does the locally run manual show no banner, or the counts it last read? | Q6 |
| shared/planning/change-stages | A push to `main` that touches nothing the hosted site rebuilds on: the banner promises the site catches up, and on that push nothing would rebuild it | Q7 |
| shared/planning/change-stages | Which text fields hold the refresh: any focused field, or only the ones the locally run manual's editor owns? | Q8 |
