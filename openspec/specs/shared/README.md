# shared

Not an application. A capability lives here only when two or more of the four
applications — `grade10-site`, `grade10-admin`, `zzz-site`, `zzz-admin` — are held to it.
A contract only one application answers belongs to that application instead.

Capabilities are grouped one level further, by the kind of contract they are.
The platform-wide formats sit bare, because they belong to no group smaller than
everything.

## `auth` — identity and session

Session behavior every surface of either brand shares, regardless of which
application renders it.

| Capability | What it governs |
| --- | --- |
| [`auth/session`](auth/session/spec.md) | Who a signed-in person is: what a product receives when it reads the caller, that sign-in is brand-wide, and how analytics names a visitor. |
| [`auth/sign-in`](auth/sign-in/spec.md) | How a person signs in: which methods exist, what a success creates, and what a sign-in command does when activated more than once. |
| [`auth/sign-out`](auth/sign-out/spec.md) | What activating a sign-out control does on any signed-in surface. |
| [`auth/sessions`](auth/sessions/spec.md) | How an operator lists a person's sessions and ends one or all of them. |
| [`auth/users`](auth/users/spec.md) | How an operator lists, bans, unbans, and re-roles people in the identity directory. |
| [`auth/roles`](auth/roles/spec.md) | The closed role set and the permissions each role grants, so every product checks one vocabulary. |
| [`auth/audit`](auth/audit/spec.md) | How identity operator actions are recorded, and who may read or check the trail. |

## `ui` — shared components

Contracts for `packages/ui` (`@grade10/ui`) and the site chrome the design
system publishes: a compound component implemented once and imported by every
application that shows it.

| Capability | What it governs |
| --- | --- |
| [`ui/component-package`](ui/component-package/spec.md) | What the package is: shipped once from here, consumed from source, app-neutral, and carrying no store's content as a default. |
| [`ui/site-chrome`](ui/site-chrome/spec.md) | The site header and footer both brands wrap their pages in. |
| [`ui/store-home`](ui/store-home/spec.md) | The store landing surface — marketing hero, section header, and collection grid — and its export contract. |
| [`ui/store-product-listing`](ui/store-product-listing/spec.md) | The product-browsing surface — sidebar, result header, product grid, pagination — and its export contract. |
| [`ui/store-cart`](ui/store-cart/spec.md) | The cart drawer surface — item list, promo redemption, order summary, checkout CTA — and its export contract. |
| [`ui/store-order-history`](ui/store-order-history/spec.md) | The order history surface — status badge, line item, order card, and the Active/Past compound — and its export contract. |
| [`ui/auction-listing`](ui/auction-listing/spec.md) | The auction listing product-page blocks: media gallery, bid panel, and details section. |

## `console` — admin console

What both admin sites share regardless of the product behind them.

| Capability | What it governs |
| --- | --- |
| [`console/blocks`](console/blocks/spec.md) | The shapes every operator console is built from — table furniture, async status, form dialog, section header, identity strip, status badge, figure list, cursor pager. |
| [`console/visual-standard`](console/visual-standard/spec.md) | What an operator console looks like, and how a brand's identity reaches surfaces carrying no brand design of their own. |
| [`console/user-directory`](console/user-directory/spec.md) | The operator's view of the identity directory and the confirmations that change an account. What an operator may *do* is `shared/auth/users` and `shared/auth/sessions`. |

## `design-sync` — design-to-code rails

| Capability | What it governs |
| --- | --- |
| [`design-sync/coverage`](design-sync/coverage/spec.md) | What the unattended design-to-code audit must find and where it must look. Not a product surface; a contract the tooling owes every application. |

## Platform-wide formats

Bind every surface of every application, and the messages the platform sends.
They carry no second level because they belong to no group smaller than
everything.

| Capability | What it governs |
| --- | --- |
| [`money-amounts`](money-amounts/spec.md) | How a money amount — always minor units plus an ISO 4217 code — becomes something a person reads. |
| [`dates-and-times`](dates-and-times/spec.md) | How a stored instant becomes text a person reads, and how a typed calendar day becomes an instant. |
| [`localization`](localization/spec.md) | Which languages each brand speaks, and how a page ends up in one of them. |
| [`frontend-composition`](frontend-composition/spec.md) | What a product's frontend package publishes so its features compose, and what a composition root may load. |

A capability's OpenSpec ID is `shared/<group>/<capability>`, or
`shared/<capability>` for a platform-wide format. Add one only when a second
application is genuinely held to the same contract, and add it as a change under
`openspec/changes/` rather than directly.
