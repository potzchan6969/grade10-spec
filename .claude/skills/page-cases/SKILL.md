---
name: page-cases
description: Read a product page fresh for what it leaves out, keep its cases file to what no example walks, and print a run sheet with what is automated. Use when QA asks for test cases, a review or sign-off, a smoke or regression pass, or before a 🚧 line is built.
---

# Cases From a Page

A page's ids are its rules that end in `{#id}`, its `:::example` and
`:::flow` blocks with an `id`, and the rows of `docs/cases/<page>.md`. The
format is in [Page First](../../../docs/governance/page-first.md#cases).

## Read Fresh

Read the sections alone - not the code, not the tests. For each rule ask:

- **Abuse** - what does a person gain by doing it twice, fast, or out of order
- **Boundaries** - the value exactly at, one under and one over each limit
- **Another tab or device** - what the second one sees, and when
- **Slow or failed** - what the person sees while waiting, and after a failure
- **In flight at launch** - a record that started under the old rule
- **Measured** - what tells us it works in production
- **Disputed** - what a member or an operator could contest, and the record
  that settles it
- **Stated twice** - where else the fact is written, and whether it agrees

An answer the page already gives is a test to write, cited to its id. An
answer it does not give becomes a ❓ line on the page, never a guess in a
row.

## Keep the File Narrow

A row is only for a case no page example walks and a test cites. It never
restates a page value; a row that only repeats a rule or a Rules table cell
is deleted. Ids are kebab-case and unique across the page; sections follow
the page's `## ` headings. Tag `smoke` on the handful a release cannot ship
without, `manual` on a walk by hand. Then `pnpm pages:check`.

## Review

Walk the rows with the person: merge duplicates, cut rows the page already
proves, fix the wording. On sign-off set `reviewed:` to the date and their
handle.

## Run

`pnpm pages:cases <prefix> --cited <app-dir> --tsv` prints every id with
`Automated` yes or no - yes where a running application test cites
`<page>#<id>` in its title - and warns on a citation no page holds. Walk the
`no` rows (only `smoke` for a smoke pass) and file a failure as a bug
against the id.
