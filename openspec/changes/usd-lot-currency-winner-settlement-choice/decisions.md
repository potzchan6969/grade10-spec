## Goals

- Every auction price reads in USD, the one bid currency, and a collector always types USD.
- A winner picks USD or HKD once, at order setup, and pays in it.
- A winner who picks HKD reads every invoice, receipt, fee and letter in HKD, with no USD winning bid and no rate beside it.
- The payment methods a winner can pick follow the settlement currency picked.
- An operator prices a listing in USD with no other currency to choose.

## Non-Goals

- A preferred-currency reference price. No surface shows one and nothing converts a bid for display.
- Showing the applied conversion rate anywhere.
- A live, looked-up or per-order locked rate. The rate is one fixed figure.
- A settlement currency beyond USD and HKD, or a bid currency beyond USD.
- Changing a sent invoice's currency or amounts.
- Changing the card fee rule's shape, the bank transfer fee model or the buyer's premium rate.
- Changes to the `shared/money-amounts` contract.
- HKD as a bid currency or JPY as an auction currency. USD is the single, universal bid currency; HKD remains a settlement currency.

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
| Q8 | What does the winner's Order Summary read under HKD? | Each line reads HKD with its USD amount beneath it; Order Total is one HKD total - decided by @htonyl, 2026-10-14 | USD lines with a USD total then an HKD total, which shows two totals for one amount owed |
| Q9 | What does the HKD total add up from? | Convert and round up each line, then sum, with the card fee computed in HKD from the HKD card rule - decided by the PM | Converting the USD total once; the HKD lines on the invoice would not add up to the HKD total |
| Q10 | Which methods does each currency offer? | HKD: Card, FPS, HK Local. USD: Card, HK Local, International via SWIFT. Each rail is its own choice at setup, and the invoice's bank details open on the rail picked - decided by the PM, the last clause by the round | One bank transfer choice that lists all three rails after the winner confirms |
| Q11 | Which currencies do Payment Settings hold? | A card fee rule per settlement currency, USD and HKD; JPY dropped. The premium minimum is one USD amount - decided by the round | A minimum per settlement currency, which would compute the premium twice |
| Q12 | What of a lot already priced in HKD or JPY? | Every existing lot is test data; its currency is overwritten to USD with amounts unchanged and no conversion - decided by the PM | Closing out or relisting them; or keeping both schedules read-only, which would keep two lot currencies alive |
| Q13 | Does card launch in USD? | Finance saves a USD card fee rule before launch, so card works in both currencies - decided by the PM | Launching with no USD card rule; a USD winner would be offered only HK Local and SWIFT |
| Q14 | What of the preferred currency? | Defined, not built - decided by the PM ("we don't support reference currency now") | Showing a live reference price on bid surfaces in this change |
| Q15 | May an operator change the settlement currency between confirm and send? | Yes, as with address and method: before send, then reissue after - decided by the PM | The winner alone changing it; a wrong pick would need Grade10 to reopen setup |
| Q16 | In which currency does the operator type the bank transfer fee? | USD, and it converts with the other lines - decided by the PM | Typing it in the settlement currency |
| Q17 | What does a card order's Order Summary show for the fee under HKD? | The fee reads in HKD from the HKD card rule, with no USD amount beneath it, and the HKD Order Total includes it - decided by the PM; placement per Q8 | Quoting the fee in USD and converting it in total like the other lines; the card rule is a settlement-currency rule, so the fee is an HKD figure |
| Q18 | Which letters keep a USD winning bid? | Only the won-lot letter, sent before a currency is picked; every later letter reads the settlement currency only - decided by the PM | No USD bid on any letter, which would hide the bid the winner just won |
| Q19 | What does the card fee range read? | The percentage of the rule of the currency picked; Finance may set it to any value in range - decided by the PM | One fixed sentence in both currencies |
| Q20 | What does an internal bidder's order carry? | The lot and bid read USD. At close Grade10 sets the internal order's settlement currency to HKD and its method to bank transfer on FPS automatically, with no winner setup or operator selection step. Confirmed by @htonyl on 2026-10-14 | Leaving currency or rail empty; USD settlement with an internal FPS exception |
| Q21 | Who holds the USD and HKD bank details? | Finance configures them for USD and HKD in the admin panel, rail by rail, and a rail is offered once its details are held - decided by the PM | Details fixed in source or outside the panel |
| Q28 | Where does Finance configure bank details? | In the admin panel, where it remains configurable for USD and HKD; nothing in this change moves it - decided by the PM | A new bank-details screen as part of this change |
| Q29 | What does the test winner do with HKD or JPY? | The form offers USD only and the action refuses any other bid currency without creating an account, lot or order. Decided by @htonyl on 2026-10-14 | Keeping HKD and JPY choices that cannot create a valid auction lot |
| Q22 | Is the US$15,000 bar a requirement? | Yes: a delta on `grade10-site/auction/auction` states it - decided by the PM | Brand configuration only, which no test would name |
| Q23 | Can the listing form refuse a currency it does not offer? | The form has no currency control and the API refuses any currency but USD - decided by the round | A form that names the currency in a refusal |
| Q24 | Do the operator quote and the letters take deltas here? | Yes: `grade10-admin/auction/post-sale` and `grade10-site/auction/notifications-order` are in this change - decided by the PM | A follow-on change; the quote and letters would contradict this one meanwhile |
| Q25 | Do `test-winners`, `internal-bid` and `bid-payment-method` take deltas here? | Yes. Remove HKD and JPY as bid currencies wherever current auction contracts name them, including these capabilities and their dependent suites. Decided by @htonyl on 2026-10-14 | A follow-on change that leaves non-USD auction success requirements beside USD-only listing writes |
| Q26 | Do the shared UI contracts take deltas? | Yes: `shared/ui/auction-order` for the new props and `shared/ui/auction-listing` for the retired HKD and JPY caps - decided by the round | Leaving the caps as dead branches and the new props unrecorded, which the contract rule forbids |
| Q27 | What of HKD examples in the other auction capabilities? | Current bid and listing examples read USD. HKD remains only for settlement and its configuration, conversion, payments and documents. Historical archives are unchanged. Decided by @htonyl on 2026-10-14 | Leaving examples that require a retired bid currency |
| Q30 | Is a separate UI design required? | @htonyl waives ui-design for this change on 2026-10-14. Correct the existing stories to the settled choices and use their verified behavior as the reference | Holding this repair for a separate design artifact |
| Q31 | Which changes permit a reissue? | A settlement currency change or a payment choice change counts. A payment choice includes its rail: FPS to HK Local under HKD, or HK Local to International via SWIFT under USD. Decided by @htonyl on 2026-10-14 | Comparing only card versus bank transfer and refusing a rail-only change |
| Q32 | Can a listing currency edit clear an internal bid? | No. USD is fixed and a non-USD write is refused without changing the listing or its internal bid. Window and USD starting-price edits still clear a bid left outside its limits. This follows @htonyl's USD-only decision and replaces the stale currency-change part of the journey | Keeping a journey whose required currency edit is refused |
| Q33 | How does an ordinary historical bank order with no recorded rail behave? | It remains a confirmed bank-transfer order with an explicitly unknown rail. Its confirmed setup, sent invoice amounts and currencies, and existing instruction artifact remain unchanged. A new confirmation, future edit, first send for a confirmed order with no invoice, or reissue requires a currently offered rail. No rail is guessed, and internal or house orders receive no exception - approved by human A on 2026-10-14 | Treating the unknown rail as FPS, HK Local or SWIFT; allowing a new rail-less write; adding an internal exception |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| Auction bid and listing contracts | Do non-USD bid rules and their success examples remain in a follow-on change? | Q25 |
| grade10-admin/auction/internal-bid | Which settlement currency and rail does an internal order receive without a winner setup step? | Q20 |
| grade10-site/auction/winner-order | Does a bank transfer fee round up to a whole HK$ after conversion? | Q7 |
| grade10-admin/auction/post-sale | Does changing only a bank rail count as a reissue change? | Q31 |
| Shared auction UI | Does this repair require a separate UI design artifact? | Q30 |
| Auction payment settings | Are card fees still configured separately for settlement currencies? | Q11 |
| grade10-admin/auction/internal-bid | QA1 found that the existing listing-edit journey still names a currency change while USD-only writes refuse it | Q32 |
