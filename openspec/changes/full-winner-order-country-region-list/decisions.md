## Goals

- Let a winner on Winner Order delivery Add Address choose any country or
  region from a complete A–Z list.
- Keep a long list usable: any typed letter jumps the highlight and scrolls
  the match into the popup.
- Leave how the catalogue is obtained to engineering (including a crawl from
  the admin portal).

## Non-Goals

- Extending the full list to account address book, store checkout, or other
  site-wide country fields in this change.
- Settling whether billing Add Address uses the same list — open until Product
  confirms.
- Limiting the picker to destinations Grade10 ships to — deferred; catalogue
  stays complete until that product call.
- Replacing Select with a searchable autocomplete / filter-as-you-type field.
- Choosing the catalogue source (owned ISO, npm package, admin crawl) in the
  requirement text — that is `tech-design.md`.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which surfaces get the full list first? | Winner Order setup only (recommended) | Reusing the form on Account, or every country field site-wide — deferred; start on the setup dialog the winner already opens |
| Q1b | Delivery only, or billing too? | Deferred — Product TBD (❓ on the PRD) | Assuming billing inherits delivery's list without a decision — rejected: billing may keep a different rule |
| Q2 | Any country, or only shippable destinations? | Complete catalogue for now; shippable-only deferred as a PRD ❓ (recommended) | Shipping-eligible set only in this change — rejected: fulfilment eligibility is a separate product call |
| Q3 | Who chooses how the list is obtained? | Engineer decides — owned list, package, or crawl from grade10-admin allowed (recommended) | Product mandating a static list in this repo, or requiring admin crawl in this change — rejected: source is implementation |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
