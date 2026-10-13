## Goals

- Every auction price reads in USD, the one bid currency, and a collector always types USD.
- A winner picks USD or HKD once, at order setup, and pays in it.
- A winner who picks HKD reads every invoice, receipt, fee and letter in HKD, with no USD winning bid and no rate beside it.
- The payment methods a winner can pick follow the settlement currency picked.
- An operator prices a listing in USD with no other currency to choose.

## Non-Goals

- A preferred-currency reference price. The term is defined in the PRD so the three currencies are not confused; no surface shows one and nothing converts a bid for display.
- Showing the applied conversion rate anywhere.
- A live, looked-up or per-order locked rate. The rate is one fixed figure.
- A settlement currency beyond USD and HKD, or a bid currency beyond USD.
- Changing a sent invoice's currency or amounts.
- Changing the card fee rule's shape, the bank transfer fee model or the buyer's premium rate.
- Changes to the `shared/money-amounts` contract.
- `test-winners`, `internal-bid` and `bid-payment-method`: a follow-on change drops HKD and JPY from them.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How do lots price? | Denominated in USD; collectors see `US$` | USD display conversion over a non-USD lot currency |
| Q2 | Who picks settlement currency? | The winner, at order setup - USD or HKD, nothing preselected - decided by the PM | Order currency fixed to the lot currency; a fixed HKD order; HKD and card preselected, each currency remembering its last method, as `add-hkd-settlement` drafted |
| Q3 | How does USD become HKD? | One fixed rate, 7.85 HKD to 1 USD, for every order - decided by the PM | A live rate, or one locked at setup or at invoice send; the operator entering the HKD amounts, as `add-hkd-settlement` drafted; the pair is stable, so a fixed figure needs no source, lock or refresh |
| Q4 | What happens to HKD and JPY lot pricing and Payment Settings? | Retired; JPY is dropped from Payment Settings too. USD is the single, universal bid currency, so the HKD and JPY increment schedules and ceilings go, and the admin panel offers neither - decided by the PM | Keeping them for lots already priced, or JPY dormant in Payment Settings; two schedules would keep a second and third lot currency alive |
| Q5 | What is the verified-bidder bar in USD (today HKD 120,000)? | US$15,000, a round figure just under HK$120,000 at 7.85 (about US$15,287) - decided by the PM | Keeping HK$120,000 and converting each bid to test it, which would bring the conversion back onto bid surfaces |
| Q6 | What does an HKD order disclose? | The invoice, receipt and letters carry HKD only: no USD winning bid and no rate, anywhere - decided by the PM | Printing the USD bid beside the converted totals; showing the applied rate |
| Q7 | How does the converted amount round? | Up to the whole HK$ - `100.01` and `100.1` both read `101` - decided by the PM | Rounding up to the first decimal, as the words say; `100.01` would read `100.1` and the example would not hold |
| Q8 | What does the winner's Order Summary read under HKD? | Lines stay USD; Order Total splits into a USD total line, then the converted HKD total line - decided by the PM | An all-HKD summary, which hides the bid the winner won |
| Q9 | What does the HKD total add up from? | Convert and round up each line, then sum, with the card fee computed in HKD from the HKD card rule - decided by the PM | Converting the USD total once; the HKD lines on the invoice would not add up to the HKD total |
| Q10 | Which methods does each currency offer? | HKD: Card, FPS, HK Local. USD: Card, HK Local, International via SWIFT. Each rail is its own choice at setup, and the invoice's bank details open on the rail picked - decided by the PM, the last clause by the round | One bank transfer choice that lists all three rails after the winner confirms |
| Q11 | Which currencies do Payment Settings hold? | A card fee rule per settlement currency, USD and HKD; JPY dropped. The premium minimum is one USD amount - decided by the round | A minimum per settlement currency, which would compute the premium twice |
| Q12 | What of a lot already priced in HKD or JPY? | Every existing lot is test data; its currency is overwritten to USD with amounts unchanged and no conversion - decided by the PM | Closing out or relisting them; or keeping both schedules read-only, which would keep two lot currencies alive |
| Q13 | Does card launch in USD? | Finance saves a USD card fee rule before launch, so card works in both currencies - decided by the PM | Launching with no USD card rule; a USD winner would be offered only HK Local and SWIFT |
| Q14 | What of the preferred currency? | Defined, not built - decided by the PM ("we don't support reference currency now") | Showing a live reference price on bid surfaces in this change |
| Q15 | May an operator change the settlement currency between confirm and send? | Yes, as with address and method: before send, then reissue after - decided by the PM | The winner alone changing it; a wrong pick would need Grade10 to reopen setup |
| Q16 | In which currency does the operator type the bank transfer fee? | USD, and it converts with the other lines - decided by the PM | Typing it in the settlement currency |
| Q17 | ❓ What does a card order's Order Summary show for the fee under HKD? | ❓ PM - recommended: the fee reads in HKD from the HKD card rule, among the USD lines; the USD total is the USD lines and the HKD total is what the invoice asks for | Quoting the fee in USD and converting it in total like the other lines; the card rule is a settlement-currency rule, so the fee is an HKD figure and the PM's question is open |
| Q18 | Which letters keep a USD winning bid? | Only the won-lot letter, sent before a currency is picked; every later letter reads the settlement currency only - decided by the PM | No USD bid on any letter, which would hide the bid the winner just won |
| Q19 | What does the card fee range read? | The percentage of the rule of the currency picked; Finance may set it to any value in range - decided by the PM | One fixed sentence in both currencies |
| Q20 | What does an internal bidder's order carry? | The lot reads USD; settlement and rail stay with the operator and nothing else changes - decided by the PM | Naming a settlement currency and one rail, which moves `add-auction-internal-bid`'s requirement |
| Q21 | ❓ Which USD bank details does Grade10 hold at launch? | ❓ Finance - recommended: HK Local and SWIFT details for USD are confirmed before launch | Launching USD with card alone, which a missing USD card rule would leave with nothing |
| Q22 | Is the US$15,000 bar a requirement? | Yes: a delta on `grade10-site/auction/auction` states it - decided by the PM | Brand configuration only, which no test would name |
| Q23 | Can the listing form refuse a currency it does not offer? | The form has no currency control and the API refuses any currency but USD - decided by the round | A form that names the currency in a refusal |
| Q24 | Do the operator quote and the letters take deltas here? | Yes: `grade10-admin/auction/post-sale` and `grade10-site/auction/notifications-order` are in this change - decided by the PM | A follow-on change; the quote and letters would contradict this one meanwhile |
| Q25 | Do `test-winners`, `internal-bid` and `bid-payment-method` take deltas here? | No: one follow-on change drops HKD and JPY from them - decided by the PM | Carrying all five here, a larger plan |
| Q26 | Do the shared UI contracts take deltas? | Yes: `shared/ui/auction-order` for the new props and `shared/ui/auction-listing` for the retired HKD and JPY caps - decided by the round | Leaving the caps as dead branches and the new props unrecorded, which the contract rule forbids |
| Q27 | What of HKD examples in the other auction capabilities? | Left; no requirement fails and a lot is still priced in one currency - decided by the round | Restating each in USD now |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/winner-order | QA2 and blind pass: between the winner confirming and the invoice being sent, may an operator change the order's settlement currency, as the post-sale edit before send may change the address and the method? The currency locks for the winner on confirming and is fixed once sent, and nothing says what an operator may do in the window. | Q15 |
| grade10-site/auction/winner-order | QA2: under HKD, is the operator's bank transfer fee typed in USD and converted with the other quote lines, or typed in HKD? The conversion rule names a bank transfer fee among the converted lines and the post-sale quote types every amount in the lot's currency, now USD, but three bank-fee scenarios read the fee as an amount in HKD that the operator entered. | Q16 |
| grade10-site/auction/winner-order | QA2: on a card order settled in HKD, what does the Order Summary show for the Payment Processing Fee and the two totals? The requirement reads the fee in HKD and the USD total as the sum of the USD lines, so the fee row sits in HKD among USD lines and the USD total leaves it out; no scenario or page row shows a card order. | Q17 |
| grade10-site/auction/winner-order | QA2: which order letters of an HKD order print no USD winning bid? Q6 says letters carry HKD only, with no USD bid anywhere, while the proposal and the tech design keep US$ on the won-lot letter, which is sent before any currency is picked. | Q18 |
| grade10-site/auction/winner-order | QA2: the card fee range reads "about 3.4% + a fixed amount" in both currencies, and the USD card rule is a separate figure Finance has not set. Does the USD choice read its own rule's percentage, or the same fixed text? | Q19 |
| grade10-site/auction/winner-order | QA2: the internal bidder's order names an HKD lot, bank transfer and Preparing Invoice, and has no winner to pick a currency or a rail. Which settlement currency and rail does it carry now that every lot is USD? | Q20 |
| grade10-site/auction/winner-order | QA2: which USD bank details does Finance hold at launch? Tasks name only the USD card rule as a launch dependency. A rail is offered only where Grade10 holds its details, so until Finance confirms HK Local and SWIFT details for USD, a USD winner is offered card alone, and nothing at all while the USD card rule is missing. | Q21 |
| grade10-site/auction/auction | QA2: the US$15,000 verified-bidder bar is testable but sits in no requirement or scenario. The requirement says only "the brand's bar", and this change's proposal does not name the capability. Is the figure a requirement of this capability, which needs a delta, or brand configuration only? | Q22 |
| grade10-admin/auction/listing | QA2: how can a create name a currency for the form to refuse, when the form offers no currency control and no control can change? One earlier scenario still says the form prevents the request and names currency, and another says no currency control exists. | Q23 |
| grade10-admin/auction/post-sale | QA2: this capability is outside the proposal and still states the earlier model in these requirements: the operator quote types every amount "in the lot's currency" and reads "the payment method the winner chose" with no rail and no settlement currency, and the money-in-major-units line uses HK$. Does it need a delta in this change or a follow-on change? | Q24 |
| grade10-admin/auction/test-winners | QA2: this capability is outside the proposal and its test-winner currency row still reads USD, HKD or JPY per listing. Does it take a delta in this change or a follow-on change? | Q25 |
| grade10-admin/auction/internal-bid | QA2: this capability is outside the proposal. Its amount row reads "the listing's currency" and "the ceiling for that currency", and one scenario places an internal bid on a JPY listing. Does it take a delta in this change or a follow-on change? | Q25 |
| grade10-site/auction/bid-payment-method | QA2: this capability is outside the proposal. Its premium-rate requirement says the rate reads the same "across all supported auction currencies" and its scenario opens listings in USD, HKD and JPY. Does it take a delta in this change or a follow-on change? | Q25 |
| grade10-site/auction/notifications-order | QA2: this capability is outside the proposal, and its invoice, payment-received and receipt letters state amounts in HKD for a lot. Does it take a delta that names the settlement currency in this change, or a follow-on change, and which letters keep a USD amount (see the letters row above)? | Q24 |
| shared/ui/auction-listing | QA2: the proposal and the tech design say this contract does not change, but its custom-maximum requirement still tables HKD 80,000,000 and JPY 5,000,000,000 whole major-unit caps, which the bid ceiling no longer has. Is the table left as dead branches, or does it take a delta? | Q26 |
| shared/ui/auction-order | QA2: tasks 1.2 to 1.4 add the settlement currency choice, one choice per rail, two total lines and a one-rail bank dialog to the winner-order block, and the proposal does not name this capability, which holds the export contract. Does its spec need a delta naming the new props? | Q26 |
| grade10-site/auction/auto-bidding | QA2: this capability, with `auction`, `bidder-suspension`, `account-record`, `listing-page`, `notifications` and `order-status` under `grade10-site/auction`, states no HKD or JPY rule, but their examples use HKD lots, and auto-bidding says a maximum is in the listing's currency and works an HKD example. No requirement fails, since a lot is still priced in one currency. Are the examples left, or restated in USD by a follow-on change? | Q27 |
| grade10-admin/auction/post-sale | QA2: Q20 says an internal bidder's order reads USD with settlement and rail left to the operator and "nothing else changes", but the order now carries no currency and no rail and a send refuses until an operator sets both by an edit before send, a step the order never had. The internal bidder's durable send scenario, outside this change by Q25, sends it with no such step. Does an internal bidder's order send as it did, or does it need the operator's edit first? | ❓ TBC - PM |
| grade10-admin/auction/test-winners | QA2: a test winner's form still takes a currency of USD, HKD or JPY and makes a lot in it, while the listing, bid and maximum columns now hold USD only and the API refuses any other code. Does the test winner take USD alone in this change, or keep HKD and JPY until the follow-on change? | ❓ TBC - PM |
| grade10-site/auction/winner-order | QA2: a bank transfer fee of 5000 minor units typed in USD reads 39250 minor units in HKD and an order total of 142350 in one scenario, which is 392.50 HK$, while the conversion rule rounds each line up to the whole HK$ and so reads 39300 and 142400. Which figure stands? | Q7 |
