# Tasks: automatic bidding

## 1. Bid panel maximum slot (grade10-spec)

Lands first: every other group consumes this through the submodule bump.

- [ ] 1.1 Add the viewer's-own-maximum slot to `ListingBidPanel` and `ListingBidPanelProps`, and the label to `ListingBidPanelCopy`, so *A bidder reads their own commitment* has a place to render its two distinct facts.
- [ ] 1.2 Cover the slot's states in colocated stories: leading with a maximum above the current bid, overtaken with the maximum unchanged, and no commitment, per *An overtaken bidder sees that they no longer lead*.
- [ ] 1.3 Verify with `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:stories:ui`.

## 2. Auction and Stripe contracts (grade10)

- [ ] 2.1 Change the authenticated bid action to carry a committed maximum in the listing's currency as integer minor units, making *A bidder commits a maximum* expressible over the contract.
- [ ] 2.2 Add the viewer's own committed maximum and their leading state to authenticated listing facts, and keep it absent from public facts, per *A maximum is hidden while it leads*.
- [ ] 2.3 Change the Stripe bid authorization contract to carry the committed maximum rather than a bid amount, per *The hold is the maximum, not the price*.
- [ ] 2.4 Verify the contract fixtures express a refused raise that leaves the previous maximum standing, per *A raise that cannot be authorized changes nothing*.

## 3. Proxy resolution in the auction backend (grade10)

Needs the contracts from group 2 landed.

- [ ] 3.1 Store a committed maximum per bidder per listing with its accepted instant, and migrate each existing accepted bid to a maximum equal to its amount per `design.md`'s migration plan.
- [ ] 3.2 Make *A challenger below the leader's maximum raises the price only*, *A challenger above the leader's maximum takes the lead*, *The step to lead cannot exceed the new leader's maximum*, and *A first maximum opens the bidding* pass by deriving leader and current bid from the two highest maximums using the listing's own increment.
- [ ] 3.3 Make *A tie goes to the earlier commitment* and *A tie is not a refusal* pass by settling equal maximums on accepted-instant order inside the existing serialized listing decision.
- [ ] 3.4 Make *A leader raises their own maximum*, *Lowering a maximum is refused*, and *A maximum below the minimum next bid is refused* pass on the commitment path.
- [ ] 3.5 Make *The hold is the maximum, not the price*, *A raise that cannot be authorized changes nothing*, *A proxy step needs no new card check*, and *An overtaken bidder's hold is released* pass by authorizing the maximum and keeping one active authorization per bidder and listing.
- [ ] 3.6 Make *A proxy bid extends the close*, *A proxy bid is counted and recorded*, and *Two maximums with room left keep extending* pass by treating a bid Grade10 places as an accepted bid under the existing extension rule and cap.
- [ ] 3.7 Make *A leader's maximum is not public* and *The current bid never passes the leader's maximum* pass, and verify every scenario in this group through auction backend feature tests including concurrent commitments against one listing.

## 4. Listing page (grade10)

Claimable against the contracts and fixtures from group 2; it does not need a running backend.

- [ ] 4.1 Produce the bid-panel Figma frame named in `ui.md` and link it there, so the layout has a source of truth before the panel is wired.
- [ ] 4.2 Change the bid control to ask for a maximum, with a confirmation that states the hold covers the maximum, per `design.md`'s risk on a misread maximum.
- [ ] 4.3 Make *A bidder reads their own commitment* and *An overtaken bidder sees that they no longer lead* pass on the listing page, rendering the maximum and the current bid as separate facts.
- [ ] 4.4 Make *A tie is not a refusal* pass as an accepted, not-leading state rather than an error.
- [ ] 4.5 Add the panel's new copy to the `@grade10/i18n` catalogs for every locale the site answers.
- [ ] 4.6 Verify the listing-page feature lane against the contract fixtures, including the refused-raise and unauthenticated-viewer states.

## 5. Admin bid history (grade10)

Claimable against the contracts from group 2.

- [ ] 5.1 Produce the admin bid-history Figma frame named in `ui.md` and link it there.
- [ ] 5.2 Make *An operator can answer a dispute* pass by showing each commitment's bidder, maximum, and accepted instant, with amounts in the operator money shape.
- [ ] 5.3 Show whether Grade10 placed a bid on a bidder's behalf, per *A proxy bid is counted and recorded*.
- [ ] 5.4 Verify the admin auction feature lane.

## 6. Review (grade10-spec, grade10)

- [ ] 6.1 Run the application repository's full check suite once every group above is green.
- [ ] 6.2 Verify every scenario in this change, then run `openspec validate add-auction-proxy-bidding --strict` and `openspec validate --specs`.
- [ ] 6.3 Review the authorization path before staging: that a raise re-authorizes before it is accepted, that a failed raise changes nothing, and that no proxy step issues a card check.
- [ ] 6.4 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-auction/`, apply the reconciliation to `grade10-auction/auction` named in `proposal.md`, and archive this change.
