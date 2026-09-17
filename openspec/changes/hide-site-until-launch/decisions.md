## Goals

- A collector on `grade10.com` finds no store, no auction, no vault and no way
  to book a visit, and nothing on the site that points at one
- A withheld address on a public lane answers with the not-found surface and a
  404, and no crawler is told the address exists
- Staging and development keep every surface exactly as they are today
- Opening one product later moves one reviewed line rather than a set of edits
  spread across the routes, the chrome and the crawler files
- Each product opens on its own date without waiting for the other three

## Non-Goals

- Deciding when any of the four products opens
- Saying what the front door offers while all four are shut
- Carrying a product on the preview host separately from production
- Holding back the membership and join pages, the profile, sign-in or the
  legal pages
- Winding down live lots or bids, of which there are none
- Hiding anything in the operator console, which already decides its own Dev
  surfaces per lane
- Changing a product's own behaviour anywhere it is still carried
- Dropping a withheld product's page code from a build

## Decisions

Q1 to Q12 were settled by `hide-store-until-launch` and archived with it —
[decisions](../archive/2026-09-17-hide-store-until-launch/decisions.md). They
still hold, and the numbering carries on from them so a row leads back to the
round that asked it.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q13 | Does only the shop wait, or does every product? | Every product. The store, the auction, the vault and booking a visit each wait for their own launch. None of the four is ready for the public, and a collector meets the same unhonoured promise whichever one they reach. This reverses the archived Q6 and is **BREAKING**. | Holding the store alone, as the archived Q6 decided. That reading assumed the other three were ready, and they are not. |
| Q14 | One launch switch, or one per product? | One per product: four lines, each opened by its own reviewed change. The auction opens first. | A single switch for the whole site. It would hold a ready product shut behind the slowest of the four, and the auction is ahead of the others. |
| Q15 | Is there live auction activity to wind down before the auction is hidden? | No. The auction has never answered publicly and its first launch will be on production, so the surfaces can simply stop answering. Nothing is owed to anyone. | Writing a wind-down for lots and bids. It would cover a case no lane has produced. |
| Q16 | Do the signing ceremony and the identity check stay open, since each answers a mailed link whose holder may have no account? | No. All four vault surfaces wait together: a shut vault mints no such link, so any link already sent was internal. | Keeping the two link-bearing surfaces open so a request already sent could still be completed. It would leave two live entry points into a product that is shut. |
| Q17 | Does the collector's bids page wait with the auction? | Yes. Bids are the auction's record whatever the address says, and they mean nothing without it. | Treating it as an account page beside the profile, which stays on every lane. |
| Q18 | What does the header's account menu do about its auctions item? | The site supplies the handler only where it carries the auction, and `SiteHeader` draws the item only when it has one — the way its cart control already works. | Leaving the item drawn. It would open not-found from a menu on every public page, which is the dead link the rule exists to stop. |
| Q19 | What is left on `grade10.com` while all four are shut? | A holding site: the front door, the terms, the privacy page, the membership and join pages, the profile and sign-in. The front door keeps its headline and drops every card whose product is withheld. | Gating the loyalty pages as well, leaving almost nothing. A member already holds a card and can still read it. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
