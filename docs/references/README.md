# References

Source material and working notes: what a PRD, a spec, or a change cites as
its evidence — an owner's draft, competitor research, a vendor-integration
design. A reference explains and preserves; it is never authoritative. Where
one disagrees with a spec, the spec is correct, and a decision worth keeping
moves into the capability's page under `docs/prds/` or a change rather than
staying here. The manual renders every document here under References, so a
page cites one by linking it.

Two documents are the standard for what a reference looks like.
[`grade10-finance.md`](grade10-finance.md) is the shape — a heading, then an
outline whose every line leads with its key term in bold, steps naming their
actor first, phases as sub-headings.
[`grade10-loyalty-program.md`](grade10-loyalty-program.md) is a longer one,
with tables and worked examples. Both:

- Open by saying what the document is, its date, and which spec, PRD, or
  change carries the decisions it led to.
- State decided facts flatly. Mark an open item with ❓ and the question the
  owner still has to answer — never silently pick.
- Separate the contract from the configuration: a tunable value is named as
  config, so a number changing does not rot the document.
- Prefer a table for structured data and a worked example for arithmetic.

The `shopify-*` set is the working notes behind the
`add-shopify-membership-pos` change: the umbrella plan, the checkout identity
flow, the POS extension, and the resilience test plan. Application code and
its architecture records stay documented in the application repository; these
documents may point at them by repository and path.

[`delivery-workflow-blueprint.md`](delivery-workflow-blueprint.md) is the
owner's brief for the delivery workflow — the five phases, the nine stages a
change moves through, the screens, the messages and the rails — and the
shape the `stage-changes-and-notify-hands` change and its follow-on changes
build from.
