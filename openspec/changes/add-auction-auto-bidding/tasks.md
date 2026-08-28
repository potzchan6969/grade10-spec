# Tasks: auto bidding

## 1. Bid panel maximum slot (grade10-spec) (owner: @htonyl)

Lands first: every other group consumes this through the submodule bump.

- [ ] 1.1 Add the viewer's-own-maximum slot to `ListingBidPanel` and `ListingBidPanelProps`, and the label to `ListingBidPanelCopy`, so `auto-bidding-SC-05` has a place to render its two distinct facts.
- [ ] 1.2 Cover the slot's states in colocated stories: leading with a maximum above the current bid, overtaken with the maximum unchanged, and no commitment, per `auto-bidding-SC-06`.
- [ ] 1.3 Verify with `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:stories:ui`.

## 2. Auction and Stripe contracts (grade10)

- [ ] 2.1 Change the authenticated bid action to carry a committed maximum in the listing's currency as integer minor units, making `auto-bidding-SC-01` expressible over the contract.
- [ ] 2.2 Add the viewer's own committed maximum and their leading state to authenticated listing facts, and keep it absent from public facts, per `auto-bidding-SC-07`.
- [ ] 2.3 Change the Stripe bid authorization contract to carry the committed maximum rather than a bid amount, per `auto-bidding-SC-19`.
- [ ] 2.4 Verify the contract fixtures express a refused raise that leaves the previous maximum standing, per `auto-bidding-SC-20`.

## 3. Auto-bid resolution in the auction backend (grade10)

Needs the contracts from group 2 landed.

- [ ] 3.1 Store a committed maximum per bidder per listing with its Accepted At, and migrate each existing accepted bid to a maximum equal to its amount per `design.md`'s migration plan.
- [ ] 3.2 Make `auto-bidding-SC-09`, `auto-bidding-SC-11`, `auto-bidding-SC-12`, `auto-bidding-SC-13`, `auto-bidding-SC-14`, `auto-bidding-SC-15`, `auto-bidding-SC-01`, and `auto-bidding-SC-16` pass by deriving leader and current bid from the two highest maxima using the listing's own increment.
- [ ] 3.3 Make `auto-bidding-SC-17` and `auto-bidding-SC-18` pass by settling equal maxima on Accepted At order inside the existing serialized listing decision.
- [ ] 3.4 Make `auto-bidding-SC-03`, `auto-bidding-SC-04`, and `auto-bidding-SC-02` pass on the commitment path.
- [ ] 3.5 Make `auto-bidding-SC-19`, `auto-bidding-SC-20`, and `auto-bidding-SC-21` pass by authorizing the maximum and keeping one active authorization per bidder and listing. Outbid release stays `grade10-auction/auction`.
- [ ] 3.6 Make `auto-bidding-SC-22`, `auto-bidding-SC-23`, and `auto-bidding-SC-24` pass by treating a bid Grade10 places as an accepted bid under the existing extension rule and cap, once per accepted commitment.
- [ ] 3.7 Make `auto-bidding-SC-07` pass, and verify every scenario in this group through auction backend feature tests including concurrent commitments against one listing.

## 4. Listing page (grade10)

Claimable against the contracts and fixtures from group 2; it does not need a running backend.

- [ ] 4.1 Produce the bid-panel Figma frame named in `ui.md` and link it there, so the layout has a source of truth before the panel is wired.
- [ ] 4.2 Change the bid control to ask for a maximum, with a confirmation that states the hold covers the maximum, per `design.md`'s risk on a misread maximum.
- [ ] 4.3 Make `auto-bidding-SC-05` and `auto-bidding-SC-06` pass on the listing page, rendering the maximum and the current bid as separate facts.
- [ ] 4.4 Make `auto-bidding-SC-18` pass as an accepted, not-leading state rather than an error.
- [ ] 4.5 Add the panel's new copy to the `@grade10/i18n` catalogs for every locale the site answers.
- [ ] 4.6 Verify the listing-page feature lane against the contract fixtures, including the refused-raise and unauthenticated-viewer states.

## 5. Admin bid history (grade10)

Claimable against the contracts from group 2.

- [ ] 5.1 Produce the admin bid-history Figma frame named in `ui.md` and link it there.
- [ ] 5.2 Make `auto-bidding-SC-08` pass by showing each commitment's bidder, maximum, and Accepted At, with amounts in the operator money shape.
- [ ] 5.3 Show whether Grade10 placed a bid on a bidder's behalf, per `auto-bidding-SC-23`.
- [ ] 5.4 Verify the admin auction feature lane.

## 6. Review (grade10-spec, grade10)

- [ ] 6.1 Run the application repository's full check suite once every group above is green.
- [ ] 6.2 Verify every scenario in this change, then run `openspec validate add-auction-auto-bidding --strict` and `openspec validate --specs`.
- [ ] 6.3 Review the authorization path before staging: that a raise re-authorizes before it is accepted, that a failed raise changes nothing, and that no auto-bid step issues a card check.
- [ ] 6.4 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-auction/`, apply the reconciliation to `grade10-auction/auction` named in `proposal.md`, and archive this change.
