## Goals

- A collector on `grade10.com` finds no store, no cart, no checkout and no
  order pages, and nothing on the site that points at one
- A store address on a public lane answers with the not-found surface and a
  404, and no crawler is told the address exists
- Staging and development keep every store surface exactly as they are today
- Opening the shop later moves one reviewed line rather than a set of edits
  spread across the routes, the chrome and the crawler files

## Non-Goals

- Deciding when the shop opens
- Saying what the front door offers in place of the store while it is shut
- Carrying the store on the preview host separately from production
- Holding back the auction's own order and invoice pages, or the membership
  and join pages
- Hiding anything in the operator console, which already decides its own Dev
  surfaces per lane
- Changing the store's own behaviour anywhere it is still carried

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which surfaces count as the store's? | The store, the collections under it, a card's own page, the two addresses the shop hands out for a product and a collection, the cart, the checkout, and a collector's order history and order detail. | Hiding the browse pages alone. A collector who cannot reach a card can still reach a checkout, and a checkout with an empty basket and a live pay button is the surface that does the damage. |
| Q2 | What turns the store off? | The deploy environment: production carries no store, and preview is production at another address, so it carries none either. Staging and development carry it. | Keying on the site stage. The stage reads `preview` for production today by coincidence of one registry row, so a site moved to a preview stage for an unrelated reason would lose its store. |
| Q3 | Is this a lane rule or a launch gate? | A launch gate. The rule is that the store waits for the shop to open, so opening it is one reviewed line and the lanes stay as they are. | A lane rule saying production never carries a store, which would have to be rewritten rather than moved the day the shop opens. |
| Q4 | What does a public lane answer at a store address? | The not-found surface, with a 404 — the same answer any address the site does not hold gets. | A permanent redirect to the front door. The crawlable-pages rules say a replaced address redirects for good and is never linked again, and this one has to start answering at launch. |
| Q5 | What happens to the front door's store button and store card? | Both are absent from a build that does not carry the store. | Keeping the card as a teaser. A teaser promises a shop with no date behind it and needs words nobody has written. |
| Q6 | Do the auction's order and invoice pages and the loyalty pages wait too? | No. Only the shop's own pages wait; the auction's post-sale flow and the membership and join pages are carried everywhere. | Hiding the loyalty pages with the store. Points are earned and spent in the auction as well, and a member already holds a card. |
| Q7 | Where does the build's answer live? | On the site's own `config`, beside the stage and the deploy environment it already reads; the route table reads the same answer from the shared deploy-target resolver, which is what a build config can read. | A new entry in the shared site registry. The registry answers where a site is served, not which pages a build of it holds, and no other brand or app needs the answer. |
| Q8 | Is it decided when the build is made, or at each request? | When the build is made, so the pages are not in the bundle at all. | A runtime check. That leaves every store page shipped to the public and one mistake away from answering. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
