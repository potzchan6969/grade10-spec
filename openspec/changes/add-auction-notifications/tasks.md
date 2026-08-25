# Tasks: auction email notifications

`add-auction-watchlist` must be deployed before group 1 can be verified: four
of the six messages fire on a watch.

## 1. Enrolment and events (grade10)

- [ ] 1.1 Resolve a lot's enrolled collectors from its watches and its bids, making *Bidding enrols without watching*, *Unwatching does not end bidder enrolment*, and *Unwatching ends watcher enrolment* pass.
- [ ] 1.2 Emit the four progress events, keying the closing warning to the scheduled close, making *A watcher is told bidding opens tomorrow*, *A watcher is told bidding has opened*, *The closing warning uses the scheduled close*, and *Extended bidding announces itself to watchers and bidders* pass.
- [ ] 1.3 Emit the two bid-activity events, making *A bidder hears about someone else's bid* and *A collector is told they have been outbid* pass, with the outbid event carrying the current bid and effective close.
- [ ] 1.4 Make *Losing the lead without a new bid is not an outbid* and *A bid placed on a collector's behalf is still their own bid* pass.
- [ ] 1.5 Make *A called-off lot sends nothing further* and *A scheduled message is suppressed by a call-off* pass by suppressing every unsent message from the moment of call-off.
- [ ] 1.6 Verify every scenario in this group through auction backend feature tests, including a lot whose close has moved.

## 2. Sent record and deduplication (grade10)

Needs group 1 landed.

- [ ] 2.1 Record every message sent, its recipient user id, and the instant, making *An operator can see what was sent* pass.
- [ ] 2.2 Make *A progress message is sent once per lot* and *A watcher who also bids receives one copy* pass from that record.
- [ ] 2.3 Make *An outbid collector gets one message, not two* pass by preferring the outbid message for one accepted bid.
- [ ] 2.4 Verify deduplication against a collector who unwatches and watches again, per `design.md`'s rejected alternative.

## 3. Rendering and delivery (grade10)

Claimable against the events from group 1.

- [ ] 3.1 Make *Mail reaches the registered address* pass, resolving the recipient by user id and sending to their registered account email.
- [ ] 3.2 Render money in each message using the sent-message shape in `money-amounts`.
- [ ] 3.3 Render every time a message states using `dates-and-times`, so a close names its zone and matches the listing's page.
- [ ] 3.4 Verify the six rendered messages against the money and date shapes, with amounts in more than one currency exponent.

## 4. ZZZ delivery (grade10)

Claimable against the events from group 1, independently of group 3.

- [ ] 4.1 Send the same six messages to ZZZ collectors enrolled on a shared lot, resolving their registered address through the ZZZ identity boundary.
- [ ] 4.2 Verify the ZZZ delivery lane on a lot enrolled from both brands.

## 5. Operator view (grade10)

- [ ] 5.1 Show a lot's sent messages to an authorized operator, distinguishing sent from attempted per `design.md`.
- [ ] 5.2 Verify the admin auction feature lane.

## 6. Review (grade10)

- [ ] 6.1 Run the application repository's full check suite once every group above is green.
- [ ] 6.2 Verify every scenario in this change, then run `openspec validate add-auction-notifications --strict` and `openspec validate --specs`.
- [ ] 6.3 Review message volume on a lot with two active maximums before staging, per `design.md`'s flooding risk.
- [ ] 6.4 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-auction/` and archive this change.
