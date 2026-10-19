---
name: page-cases
description: Derive, review and run the test cases of a product page - its examples, flows and its cases file under docs/cases/ - and print a run sheet with what is automated. Use when QA asks for test cases, a review or sign-off, a smoke or regression pass, or cases for a 🚧 feature.
---

# Cases From a Page

A page's cases are its `:::example` and `:::flow` blocks with an `id`, plus
the rows of `docs/cases/<page>.md`. The format is in
[Page First](../../../docs/governance/page-first.md#cases).

## Derive

1. **Read the page alone** - its rules, flows, examples and marks. Do not
   read the code or `openspec/` first: the cases are a reading of the page.
2. **List what a rule promises** - every value, every rule bullet, every
   "never", every boundary. An example on the page already proves its rule;
   skip it.
3. **Write one row per remaining promise** - Given, When, Then in the page's
   words and values; ids kebab-case and unique across the page and its
   examples; sections follow the page's `## ` headings. Tag `smoke` on the
   handful a release cannot ship without, `building` on a 🚧 line's cases.
4. **Raise what the page does not say** - a case you cannot write because
   the page is silent becomes a ❓ line on the page, not a guess in the row.
5. **Check** - `pnpm pages:check`.

## Review

Walk the rows with the person: merge duplicates, cut rows a page example
already proves, fix the wording. On sign-off set `reviewed:` to the date and
their handle.

## Run

`pnpm pages:cases <prefix> --cited <app-dir> --tsv` prints every case with
`Automated` yes or no - yes where an application test cites `<page>#<id>`.
Paste it into a sheet, walk the `no` rows (or only `smoke` for a smoke pass),
and file a failure as a bug against the case id.
