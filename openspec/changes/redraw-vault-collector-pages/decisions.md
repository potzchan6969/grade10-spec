## Goals

- A collector sees every item they hold in the vault, in one list.
- A collector reads one vaulted item: status, estimate, grade and cert, location, condition, custody history and documents.
- A collector acts on one item: list it for auction or sale, submit a raw item for grading, or request retrieval.

## Non-Goals

- The retired loan-case screens — case list, request wizard, case page, Your data — stay retired; this change does not redraw them.
- Product routes and backend wiring; the surfaces land in Storybook first.
- The signing ceremony, emails, PDFs and operator console, which were never removed.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which collector surfaces does the change cover? | The portfolio surfaces in the workbench — Portfolio, Asset Detail, Request Retrieval, Intake Tracker, Book a Visit - decided by the round | The loan-case screens on `collector-pages.md`, which stay open pending their own design |
| Q2 | Where does the asset detail contract live? | New capability `grade10-site/vault/portfolio` - decided by the round | Folding holdings reads into `case-lifecycle`, which describes loan cases, not held assets |
| Q3 | What does a portfolio card open? | The item's page for every status — a listed item's page reads its listed price and links out to the store listing or auction lot | Routing Listed or Live Auction cards to management surfaces that do not exist, or keeping the retrieval-dialog exception for Retrieval Pending |
| Q4 | Can a listed or auctioned item be retrieved? | No — retrieval hides until the item delists or settles | Blocking the whole detail page, or rendering the link disabled |
| Q5 | How do the tabs sort? | Each tab owns a sort set remembered for the session; Live Auction defaults to ending soonest because the portfolio does not live-update bids | One shared sort, or defaulting the auction tab to highest bid |
| Q6 | What can a collector do with an item pending retrieval? | Nothing on the item — listing and a second request hide until the operator approves or declines; the request shows as the latest custody entry | Keeping the link to re-open the dialog, or letting the item list while the request waits |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
