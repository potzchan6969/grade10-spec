---
title: Admin Console
---

Every operator works in one console per brand, not one console per product.
Shop staff, support, a treasurer, an auditor and an admin all sign in at the
same address and see a single sidebar whose entries are whatever their role can
actually open. Grade10's console spans thirteen sections and seven backends;
ZZZ's has three.

This product is what those consoles share regardless of the product behind them.
It lives in the application repository rather than the shared-UI package,
because admin surfaces carry no brand design — what distinguishes one brand's
console from another's is the theme its application supplies, and nothing else.

## What it covers

Two capabilities today. **Console blocks** is the furniture: the table, the
three async states, the confirmation dialog, the section header, the operator
identity strip, the status badge, the figure list and the cursor pager — written
once so nine consoles stop rebuilding the same shapes and drifting apart.
**User directory** is the account table an operator works from, plus the three
confirmations behind changing an account.

What an operator is *allowed* to do is not here: that is
[sign-in and accounts](/p/shared/auth). This product governs what the components
render and what they expose.

:::callout{kind="warning"}
The console as a whole is barely specified. There is no spec for the section
list, the roles and permission vocabulary, the URL-as-route convention, the
step-up two-factor model, the first-admin bootstrap, or the elevated ladder
every button climbs. The one place the console's shape is written down is inside
the loyalty spec, where loyalty happens to depend on it — every section outside
loyalty has no console requirement at all.
:::

:::callout{kind="note"}
There are no Figma frames for the admin, by decision. The in-flight change
`admin-visual-standard` is what settles the console's visual vocabulary across
both brands' consoles and the seven operator packages they assemble from.
:::

:::detail{title="How a console is assembled" for="engineer"}
Each console is a thin application over the operator packages: one dependency
container loads the feature modules published by each product's
`admin-frontend` package, and the console's own pages stay thin. Grants come
from each backend's own published permission map rather than from strings
restated in the console, so a grant the vocabulary does not have is a compile
error rather than a button that never appears.

The console is presentation only — each backend is what actually refuses the
data, on every request. See
[docs/architecture/security.md](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
and
[docs/conventions/code-layout.md](https://github.com/9gag/grade10/blob/main/docs/conventions/code-layout.md).
:::
