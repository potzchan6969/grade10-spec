## Goals

- A losing bidder's row and an open listing's Status are specified as the build shows them
- No requirement or draft case in account-record or analytics names a bid card hold

## Non-Goals

- Changing what the build shows: grade10#773 already shows it
- The paragraph in "A winner reads their own payment and shipment state" that
  points at the old hold requirement: `clarify-auction-shipping-progress-copy`
  folds that requirement while in flight and still carries it, so it drops the
  paragraph before it is accepted
- The open lines on Bidding that ask Product to restate the close outcomes now
  that a bid takes no card hold, among them an unsold lot's row for a lone
  first bid: their owner restates them; this change only retires the case
  that read a first bid confirming after the close
- Post-sale's payment states and their wire request: `complete-auction-post-sale`
  removes that requirement whole
- The bid-hold requirements of `grade10-site/auction/auction`,
  `auto-bidding`, `winner-order`, `lot-status`, `bid-panel-enrollment` and
  `bid-payment-method`, and the hold cases of the auction domain suites: a
  change of their own retires them

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does a losing bidder's row say? | Didn't win, and that the card was not charged, on a lot lost at the close and on a called-off lot, as grade10#773 shows it - decided by the owner, owner-questions 22, 2026-10-02 | A hold being released or released, which no bid takes any more |
| Q2 | What Status does an open listing read? | Leading or Outbid only. A refused attempt is not a bid: it adds no row and moves no Status, and shows on the bid panel, never on My Auctions, as grade10#785 builds it - decided by the owner, owner-questions 22, 2026-10-02, as the build stands after grade10#785 | Bid not accepted reading "Grade10 accepted none of the collector's bids", the owner's words for a state the build no longer has; Bid submitted, which a bid accepted at once never shows |
| Q3 | What does a leader whose raise is refused read? | Leading: the refused raise moves nothing - decided by the owner, owner-questions 22, 2026-10-02 | Bid not accepted, which hid that their standing bid still leads |
| Q4 | Does analytics keep a rule about an authorization or a hold capture? | No: Bid Placed fires when a maximum is accepted, and nothing captures a hold, so the clause and its scenario go - decided by the owner, owner-questions 22, 2026-10-02 | Keeping a scenario no build can reach |
| Q5 | How does a requirement drop a scenario? | It is renamed with its whole block, keeping its scenario ids; a retired id is never reissued (recommended) | A modified block, which `validate:changes` refuses once it drops a scenario, or removing and adding it, which reissues ids |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/account-record` | Does a called-off lot's row say the card was not charged, as a lot lost at the close does? | Q1 |
| `grade10-site/auction/account-record` | Does a leader whose raise is refused read Leading or Bid not accepted? | Q3 |
