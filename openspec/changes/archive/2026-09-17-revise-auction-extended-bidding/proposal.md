**Author:** @jeffffej0909 - 2026-09-10

Product context: [Auction](../../../docs/prds/products/grade10-site/auction/auction.md),
[Auto bidding](../../../docs/prds/products/grade10-site/auction/auto-bidding.md),
[Listing](../../../docs/prds/products/grade10-admin/auction/listing.md).

## Why

The auction house's extended bidding starts **at** a lot's close. The spec
runs a rule that starts **before** it: any valid bid in the last 30 minutes
moves the close. Collectors are told one thing and the lot does another.

- **The announced close is not the close.** One bid at 19:31 moves a lot
  scheduled for 20:00 to 20:01, before 20:00 has arrived. A collector planning
  around the scheduled close finds it already gone.
- **"Extended bidding" means two things.** The in-flight
  `add-account-notifications` sends "extended bidding has started" when a lot
  enters its last 30 minutes — including a lot nobody bids on, which then
  closes on schedule. Collectors are told about overtime that never happens.
- **Operators set two numbers for one idea.** An extension window and an
  extension duration, with a rule between them. The house's rule needs one
  number: how long extended bidding runs.

Nothing measures extensions today, so there is no baseline.

**Metric:** extended-bidding take-up — lots that receive at least one bid
during extended bidding, divided by lots that enter it. The first release sets
the baseline.

**Guardrail:** median time from scheduled close to final close, so a long
uncapped tail is visible.

## What Changes

- **Extended bidding starts at the scheduled close.** No bid before the close
  moves it.
- **Only a lot with at least one bid enters it.** A lot with no bid closes at
  its scheduled close. A bid accepted at exactly the scheduled close counts.
- **Each lot runs its own timer.** A lot enters with the full extension
  duration. Each accepted bid restarts the timer at the full extension
  duration from that bid. The lot closes when the timer runs out with no new
  bid.
- **Anyone may bid during extended bidding**, not only earlier bidders.
- **The extension cap stays** — optional, empty by default, a hard stop at
  scheduled close plus cap.
- **The extension window is removed.** A listing carries one setting, the
  extension duration: 30 minutes by default, zero for off.
- **Auto bids follow the same rule.** A maximum committed before the close
  counts toward entry. An auto bid during extended bidding restarts the timer.
- **The public listing read carries the scheduled close** beside the recorded
  close, so an application can tell a lot is in extended bidding without a new
  status. This is a choice: it closes the gap where the scheduled close was
  stored but no read was required to expose it.

- **The operator queue labels a lot in extended bidding** with
  "Extended bidding: ON" on its row. It is a label, not an outcome, and not a
  filter.

**BREAKING:** the extension window leaves the admin form and the public
listing read, and the close rule changes for every published listing.

"The close" is each lot's own scheduled close. Campaigns stay clockless.

## Non-Goals

- **A new lot status.** Extended bidding is a label on the operator's queue
  row, not an outcome. The lot's outcome does not change.
- **A campaign-wide close.** Lots in one campaign close independently, even
  when they share a time.
- **Restricting who bids** during extended bidding.
- **Changing the cap**, increments, card holds, or auto-bid resolution.
- **Notification or bid-card copy.** Both live in in-flight changes; see
  Impact.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/auction`: the bidding-window requirement replaces the
  before-close extension with extended bidding after the close; the public
  contract drops the extension window and adds the scheduled close.
- `grade10-site/auction/auto-bidding`: an auto bid counts toward entry, and
  restarts the timer during extended bidding.
- `grade10-admin/auction/listing`: the extension window field is removed; the
  extension duration alone sets extended bidding.
- `grade10-admin/auction/post-sale`: a queue row carries the label
  "Extended bidding: ON" while its lot is in extended bidding.

## Impact

- **Auction service** — closes a no-bid lot at its scheduled close, moves a lot
  with a bid into extended bidding, and restarts each lot's timer on its own.
- **Public listing contract** — drops the extension window, adds the scheduled
  close.
- **Grade10 admin** — the listing form has one extension field, not two, and
  the queue row carries the extended-bidding label.
- **Ending soon** — `revise-auction-winner-invoicing` removes it as an outcome.
  The label here does not depend on that: it sits beside whatever outcome the
  row carries.
- **Grade10 site** — the lot page and bid card read the changed contract.
- **Component exports** — none added or changed.
- **Scenario ids** — none retired, none reissued. Every existing scenario
  keeps its id and title, and those that tested the old rule now test the new
  one. Three titles still name the extension window and are marked historical
  in their requirement: `grade10-site-auction-auction-SC-07a`,
  `grade10-site-auction-auto-bidding-SC-22`, and
  `grade10-admin-auction-listing-SC-27`.

Three in-flight changes assume the old rule:

| Change | Assumes today | Needs |
| --- | --- | --- |
| `add-account-notifications` | "Extended bidding has started" fires when a lot enters its extension window, 30 minutes before close | Fire at the scheduled close, only for a lot with at least one bid |
| `add-bid-panel-enrollment` | Its modified "Extension explanation copy" requirement names the extension window | Name the extension duration only. Whichever change archives second rebases on the first |
| `add-auction-winner-journey` | Suspension retracts bids "where a lot is in extended bidding" | Nothing. The phrase now means after the scheduled close |

The durable `shared/ui/auction-listing` requirement "Extension explanation copy
reflects the listing policy" still names the window. This change leaves it to
`add-bid-panel-enrollment`, which already modifies that requirement, rather
than modifying it twice.

The [auction page](../../../docs/prds/products/grade10-site/auction/auction.md)
and the [auction index](../../../docs/prds/products/grade10-site/auction/index.md)
carry this change's 🚧 lines. The admin listing page names no extension setting
and needs none.

## Open Questions

- ❓ **The label beyond the queue.** Whether the lot page, the catalogue tile,
  or My Auctions shows extended bidding, and how. For the designer.

- ❓ **Lots open at cutover.** Which rule governs a lot published under the old
  rule and still open when this ships. For the engineer who plans delivery.
- ❓ **Stored extension windows.** Whether existing window values are dropped
  or kept unread. For the engineer who plans delivery.

## References

- [Auction · Holds](../../../docs/prds/products/grade10-site/auction/index.md#holds)

## Follow-on changes

- Bid-card copy that tells a collector a lot is in extended bidding.
