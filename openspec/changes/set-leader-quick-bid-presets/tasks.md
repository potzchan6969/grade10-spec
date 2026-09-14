## 1. Spec and product record (grade10-spec)

- [ ] 1.1 Keep the proposal, auction-listing delta, and journeys aligned with
      leader chips on max and a typed floor of max + 100 minor units.
- [ ] 1.2 Mark Bid Panel on the auto-bidding page and record the preset-amounts
      decision.

## 2. Shared bid card (grade10-spec)

- [ ] 2.1 Make `shared-ui-auction-listing-SC-35` and `SC-36` pass: chips are
      max + 1× / 2× / 4× increment when leading, current bid + 1× / 2× / 4×
      when not.
- [ ] 2.2 Make `shared-ui-auction-listing-SC-37` pass: a leader's custom
      minimum is max + 100 minor units and is not chip 1.

## 3. Validation (grade10-spec)

- [ ] 3.1 Run `openspec validate set-leader-quick-bid-presets --strict`.
- [ ] 3.2 Run `listing-bid-money` unit tests and the leading bid-card story.
