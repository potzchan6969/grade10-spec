# QA1 blind review report

**Result** - The six frozen feature suites and both affected auction domain suites are delivered for QA2. Coverage was derived from the supplied PRDs, decisions, frozen Purpose/Feature outlines, journeys, and prior blind cases only. No scenario requirements, tech design, task files, implementation source, or other QA/Dev reports were read.

**Input packet** - `/private/tmp/qa1-1155-r5-input`, 36 files, SHA-256 digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`.

**Delivered paths**

- `/private/tmp/qa1-1155-r5-output/openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/auto-bidding/feature-tcs.md`
- `/private/tmp/qa1-1155-r5-output/openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/account-record/feature-tcs.md`
- `/private/tmp/qa1-1155-r5-output/openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/listing-page/feature-tcs.md`
- `/private/tmp/qa1-1155-r5-output/openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/bidder-suspension/feature-tcs.md`
- `/private/tmp/qa1-1155-r5-output/openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/notifications/feature-tcs.md`
- `/private/tmp/qa1-1155-r5-output/openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/post-sale/feature-tcs.md`
- `/private/tmp/qa1-1155-r5-output/openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/domain-tcs.md`
- `/private/tmp/qa1-1155-r5-output/openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/domain-tcs.md`

**Coverage**

| Suite | Product roots covered | Frozen journey anchors represented |
| --- | --- | --- |
| `auto-bidding` | Commit a maximum; own standing; two-maximum price; auto-bid as a bid; house maximum | All 5 supplied journeys; 33 cases, no unmatched trace |
| `account-record` | After close; watching a listing; Watching page; Bidding page; reaching record; tabs by bidding window; row actions; Won status | All 10 supplied journeys; 37 cases, no unmatched trace |
| `listing-page` | Lot address; shared link preview; unknown-lot refusal; live-lot handover; watching lot; catalogue and sitemap; live-lot updates; one service clock; close and result; Recent Bids outcome; public identifier | All 15 supplied journeys; 59 cases, no unmatched trace |
| `bidder-suspension` | Trigger and notice; suspension scope; standing bids; reinstatement | All 3 supplied journeys; 14 cases, no unmatched trace |
| `notifications` | Enrolment; progress messages; bid-activity messages; close-outcome messages; delivery; house participation | All 8 supplied journeys; 31 cases, no unmatched trace |
| Admin `post-sale` | Quote and send; telephone setup | The supplied quote/send, unpaid-order reissue, and formal telephone setup journeys are represented. Canonical traces use the individual journey anchor, including US07 and US20. |
| Site `auction/domain-tcs.md` | Cross-feature auction routes, USD bid facts, close, internal bidder, settlement choice | Existing site route groups retained; settlement-choice routes remain under US12 and internal house close routes under US13. |
| Admin `auction/domain-tcs.md` | Catalogue/listing operation; post-sale collection; internal order quote/send and stock return | Existing admin route groups retained; internal order close has Preparing Invoice and no invoice sent at close. |

Every feature-case Trace resolves to one actual journey anchor. Existing opaque case IDs and historical suite headings/groups were preserved. Feature and domain case revisions were advanced where their fixture or expected behavior changed; changed cases remain drafts. Historical absent cases were kept.

**Repairs**

- Bid facts use USD. Corrected fixtures follow the product schedule: the zero-start opening bid is USD1; the minimum after USD100 is USD105; the next bid uses the increment tier of the amount being beaten. Boundary and maximum outcomes use the schedule rather than fixed ad hoc increments.
- The internal-order quote/send route starts with an internal HKD/FPS order in Preparing Invoice. It has USD101 winning bid, USD20.20 buyer premium, USD10.01 Shipping & Handling, and USD0 bank transfer fee. The close creates no invoice; the operator sends the quote.
- At the packet's fixed 7.85 HKD/USD rate and whole-HKD upward rounding per component, the quote converts to HKD793 + HKD159 + HKD79 + HKD0 = HKD1,031. The USD101 win fixture is consistent with the schedule: the minimum after the public USD100 maximum is USD105, capped at the internal bidder's USD101 maximum. The fixed rate, rounding rule, line-by-line conversion, and 20% premium are in the supplied decisions and post-bidding PRD.
- Telephone record setup is a US20 case and stops at Preparing Invoice, with the order bound to the telephone-recorded setup. Reissue cases use the unpaid-order US07 journey when that is the behavior under test.

**Gaps and unmet decisions** - No uncovered root or journey anchor was found within the supplied six-capability scope and affected site/admin auction routes. No product decision from the supplied packet blocks these cases. This is a packet-level coverage conclusion; it does not claim implementation behavior was exercised.
