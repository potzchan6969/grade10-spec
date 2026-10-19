## Goals

- A collector in a region where auctions are not offered keeps the store and
  the rest of the site, unchanged.
- That collector never meets an auction entry point — not in the navigation,
  the account menu, or any auction surface.
- A direct auction address reached from a restricted region answers an honest
  restriction page, never a broken or empty auction.
- An auction action sent from a restricted region is refused at the service
  boundary, not merely unadvertised.

## Non-Goals

- Restricting the store, grading, vault or any non-auction surface by region.
- Changing how a region is judged restricted — the edge's region signal is
  read as given; the list of restricted regions is configuration, not spec.
- VPN circumvention beyond the edge signal — the check answers the request's
  observed region, not the collector's real one.
- Retroactive handling of bids or orders already accepted — see the ❓ row on
  the Bidding PRD.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does the restriction bind? | Edge plus application - the edge judges the region per request, the application hides entry points and refuses auction actions | UI-only hiding, which leaves every auction API callable from a restricted region |
| Q2 | What does a signed-in restricted collector with live commitments (a standing bid, a watched lot, an unpaid invoice) get? | Decided by agent - see Q8 | Full block, which strands money already committed |
| Q3 | What does the restricted page say? | Honest copy naming the restriction, with a link to the store | Masking as the generic not-found page, which lies to a collector arriving from an email link |
| Q4 | When the region signal is missing or fails | Decided by agent - fail open: a request with no readable region, or the edge's `XX`, is unrestricted, and a page whose availability read fails shows auctions; the services still judge every act on its own | Fail closed, which locks out unrestricted collectors on a lookup fault |
| Q5 | How often is the region judged? | Per request, at the edge - decided by the round | Session-sticky, which keeps a moved collector on the wrong answer |
| Q6 | Do auction data reads get refused, or only page loads and mutations? | Refused the same way - decided by the round | Mutations only, which leaves live-update and standing channels open to a hand-made request |
| Q7 | How does the account menu drop My Auctions for a restricted request? | `onMyAuctions` becomes handler-gated like every other optional item - decided by the round | The durable contract required the item, so no application-level answer existed without it |
| Q8 | What stays open to a restricted collector with commitments already made? | Decided by agent - the winner order and its invoice, with their address, payment and proof actions, and unwatching and muting alerts; new bids, card enrollment, watches, the catalogue, lots, standings, My Auctions and the bidding history are refused | Read-only access to every commitment, which needs a read-only My Auctions nobody has drawn; a full block, which strands money already won |
| Q9 | Which regions are restricted, and where is the list kept? | Decided by agent - `AUCTION_RESTRICTED_REGIONS` in `@grade10/app-env`: CU, IR, KP and SY to start, ❓ Product and legal confirm the list | A list per lane, which lets staging disagree with production about the law |
| Q10 | Does ZZZ share the rule? | Decided by agent - yes: one list for every brand, enforced in the shared store and auction services ZZZ deploys | A ZZZ-only rule, which a second list would let drift |
| Q11 | How does a page learn the verdict? | Decided by agent - the auction service answers `public.availability` per request; the browser asks once per page load and the chrome and auction routes read it. The document stays one set of bytes for every request, so it can be cached and prerendered | The site worker writing the verdict into each document, which ends prerendered and cacheable pages |
| Q12 | Is the restriction page indexable? | Decided by agent - it renders in the browser at the auction's own address, so the document a crawler reads is the auction's, never the restriction page; no `noindex` is needed | A served restriction document, which Q11 rules out |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/availability | Does a live-update or other auction data read from a restricted region get refused, or only page loads and mutations? | Q6 |
| grade10-site/auction/availability | Should the restriction page be indexable, or emit `noindex`? | Q12 |
