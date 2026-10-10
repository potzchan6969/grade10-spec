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

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
