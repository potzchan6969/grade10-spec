# UI

One surface gains a card — the account page — and two gain a refusal: the
checkout page and the bid dialog. Nothing new is a page of its own.

## Screens

No frame exists in Figma for any of the three; each is `TBC` with Design and
does not block delivery, because every state below composes primitives the
design system already ships. A frame, when drawn, replaces the description
here.

| Surface | App | What changes |
| --- | --- | --- |
| Account page | `@grade10/web-spa` | Gains the identity card: the standing, the bar, the consent and the one action |
| Checkout page | `@grade10/web-spa` | Gains the verify panel where a refusal renders: the bar, the goods' value, a link to the account |
| Bid dialog | `@grade10/web-spa` via `@grade10/auction-frontend` | Gains one refusal line: a verified identity is needed, verify from the account |

## Components

| Export | Package | Carries |
| --- | --- | --- |
| `IdentityView` | `@grade10/store-frontend/identity` | The card: standing, bar, consent, action; every word a prop |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` | `@grade10/design-system/components/display/card` | The card's shell |
| `CheckboxButton` | `@grade10/design-system/components/forms/checkbox-button` | The consent box |
| `Button`, `Link`, `Text`, `VStack` | `@grade10/design-system` | The action, the way to the account, the words, the stack |

## States

Each state below exists because a scenario defines it.

| Surface | State | Scenario behind it |
| --- | --- | --- |
| Account | Verified until a day; no action | *A verified collector sees they are verified and until when* |
| Account | Not verified; the bar; consent and Verify | *A collector nobody verified sees the bar and how to verify* |
| Account | Verify disabled until the box is ticked | *Nothing reaches the provider before the collector agrees* |
| Account | Check in progress; Continue | *A collector verifies from their account and is recognised* |
| Account | The provider is deciding; Check again | *A check the provider is deciding is not started twice* |
| Account | Declined; the counter named; Try again | *A declined collector may try again* |
| Account | Expired; Verify again | *A collector whose document lapsed verifies again* |
| Account | Nothing | *A brand with no identity store shows nothing* |
| Checkout | Verify panel: the bar, the goods' value, the way to the account | *An unverified buyer above the bar is sent to verify* |
| Bid dialog | One refusal line | *An unverified bidder above the bar is held at the storefront* |

No state shows an identity field. The account page names a standing and a
day; the checkout names money; the dialog names nothing about the person.

## Words

Every string is the brand's, through `@grade10/i18n`: the `identity` namespace
for the card, `checkout.identity.*` for the panel, `auctionListing.identityRequired`
for the dialog, in every language the shared layer speaks. Until the
application's submodule moves past the catalogue, each page holds its English
source in one hook, as the vault's pages do.
