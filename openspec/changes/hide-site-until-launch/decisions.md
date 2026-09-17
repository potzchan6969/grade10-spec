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
| Q20 | Has a public lane already taken a booking whose private link this change withholds? | No. Booking, like the auction, has taken nothing on a public lane; its set — including the private link from its mail — waits whole, the way the vault's two link-bearing surfaces wait with Q16. A follow-on change covers whoever already holds a booking, should one turn up before this ships. | Splitting the private link out to keep answering, which Q16 already refused for the vault on the same shape of surface. |
| Q21 | Does a chrome region that loses every item it would hold go absent, or render empty? Only the front door's card row can genuinely reach zero — the header's navigation, the footer and the account menu always keep a non-product item such as membership, sign-in or profile. | Renders empty. The card row stays part of the page and holds no card, rather than being removed from the layout. | Removing the row itself, which would move the front door's shape lane to lane on top of what it offers. |
| Q22 | The account menu's auctions item is gated by a handler `SiteHeader` is or isn't supplied — is that a `shared/ui/site-chrome` contract, or this capability's own rule? | This capability's own rule alone: the requirement states the site-level outcome a collector meets, and names no `@grade10/ui` export. | Adding a `shared/ui/site-chrome` delta for the per-item gate. The proposal names no capability besides this one as modified, and nothing forces the component contract to move in this change. |
| Q23 | The vault's vanity domain redirects to the vault's own address. Does it stop redirecting while the vault is withheld? | No. It keeps redirecting, and lands on the not-found surface the same way any other route into a withheld product does. | Making the vanity domain stop redirecting, which is a rule this capability does not carry and a change to a surface outside its own addresses. |
| Q24 | May a carried product's own surface depend on a withheld one, such as the auction's winner order needing the store's checkout to settle payment? | No such dependency exists. Checked against the auction's own PRD: the winner order and invoice use their own payment flow, not the store's checkout, and no Feature set names a dependency between the two sets. | Writing a rule against a dependency that turned out not to exist. |
| Q25 | What does a sign-in return address that names a withheld surface meet once sign-in lands the collector there? | No new rule. Sign-in is carried on every lane, and the address it returns to is refused by "An address of an uncarried surface is not found" like any other route into it — that requirement is already worded to not depend on how the address was reached. | A rule naming sign-in specifically, which would restate a refusal that already reaches every route. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/site/carried-surfaces` | Has a public lane already taken a booking whose private link this change withholds, the way Q15 and Q16 ruled out for the auction and the vault? | Q20 |
| `grade10-site/site/carried-surfaces` | Does a chrome region that loses every item it would hold go absent, or render empty? | Q21 |
| `grade10-site/site/carried-surfaces` | Is the account menu's per-item gate this capability's rule, or a `shared/ui/site-chrome` contract? | Q22 |
| `grade10-site/site/carried-surfaces` | Does the vault's vanity domain stop redirecting while the vault is withheld? | Q23 |
| `grade10-site/site/carried-surfaces` | May a carried product's own surface depend on a withheld one, such as the auction's winner order needing the store's checkout to settle payment? | Q24 |
| `grade10-site/site/carried-surfaces` | What does a sign-in return address that names a withheld surface meet once sign-in lands the collector there? | Q25 |
