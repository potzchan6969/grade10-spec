## Goals

- A winner's invoice can be sent in production, with a payment processing fee
  the operator sets from a schedule
- The rules behind the winner's page hold on the server: bank transfer only
  where Grade10 holds bank details, the setup lock, and card money that lands
- An operator works every won lot from one Orders workspace: a worklist by
  segment, a page per order, and each action in its own dialog
- Money a winner sends is never dropped
- Finance keeps Payment Settings, the fee schedule included
- QA makes a test winner in one step outside production and signs in with the
  ordinary link

## Non-Goals

- Redesigning the winner's page: its layout, stepper and copy, a Next step
  panel, a setup flow with a review step, and fee wording at the method choice.
  Only the admin console is redesigned
- Computing tax. The operator enters it, per `add-winner-order-tax-line`
- Reading the payment provider's fees, or pricing each card's real fee for an
  international card or a currency conversion
- Partial payments, cancellation reasons and reopening the address form. Each
  is its own change
- Bank transfer outside HKD, and a second payment provider
- Rewording the existing letters, and a requirement for the order link in
  letters or the old order address. The link and the address restore settled
  behaviour and ship as fixes
- Bugs that restore settled behaviour. They ship as `fix` commits with a
  regression test
- Test winners in production or on a preview, bidding as a test account on a
  real lot, a sign-in path of their own, and clearing test data away on its
  own

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does the payment processing fee come from? | A fee schedule in Payment Settings - per currency and method, a percentage and a fixed amount, or no rule - pre-fills the fee the operator sets on each invoice. The card rule is grossed up so Grade10 keeps the Subtotal whole. The sent invoice never re-prices. Finance enters the rules at rollout: HKD card 3.4% + HK$2.35 and HKD bank transfer free, with no rule in USD or JPY until Finance sets one | Reading the provider's live fees at send: Stripe has no pricing API, and the real fee depends on the card and is known only after the charge, so every send was refused |
| Q2 | What does the winner read at the method choice? | Dropped: the winner's page keeps its design. Bank transfer is offered only where Grade10 holds bank details for the currency, per Q25 | - |
| Q3 | Which amounts does the operator enter? | Shipping & Handling, Insurance, Tax and the payment processing fee. Tax follows `add-winner-order-tax-line` | A fee Grade10 fixes without the operator, which cannot carry a fee the operator agreed or waived |
| Q4 | How is a sent invoice changed? | One Reissue, on a pending or expired invoice before any money is recorded: any of address, method, fee, Shipping & Handling, Insurance, Tax and the deadline kept or restarted, with a reason and at least one change. The replaced invoice reads Replaced, never Cancelled, and its ID still finds the order | Separate requote and reissue actions, which split one job and wrote the replaced invoice as cancelled |
| Q5 | What if the price moved while the operator read it? | The send and the reissue carry the total the operator read. Grade10 refuses when its own price differs, for example after the premium minimum changed, and the dialog shows the new total with the fields kept | Sending whatever Grade10 prices at that moment, which can bill a winner an amount nobody saw |
| Q6 | Who decides which actions an order offers? | Grade10 decides, and every action is refused on the server when it does not apply. A control the operator lacks stays visible, disabled, and names the access it needs | Each screen working the rules out for itself, which drifted from the server and hid controls without saying why |
| Q7 | Where do the operator and the time on a log entry come from? | The session of the operator signed in, and Grade10's clock | What the action itself says, which let any name and any time be written into the history |
| Q8 | What happens to money that lands when the invoice cannot take it? | It is always recorded. A payment the invoice did not expect carries a flag until an operator clears it with a reason | Refusing or dropping it, which loses track of money Grade10 holds |
| Q9 | How does the operator work won lots? | One Orders workspace: a worklist with Needs action, Waiting on winner, In transit, Closed and All, each with its count, and a search; a page per order at its own address, leading with the status, the rule behind it and one primary action; each action in a dialog that restates it; money typed in major units. The listing-level queue and its tabs are removed | Keeping the listing queue beside an orders list: two tabs that disagreed, where Cancel and Reissue both requested a wire |
| Q10 | Who holds payment processing, and who edits Payment Settings? | `auction:payment`, held by finance, treasurer and admin, as the code grants it. Payment Settings moves to it from `auction:settle`, so finance edits it | Keeping Payment Settings under `auction:settle`, which only admin holds and which shut finance out of a page the manual says it keeps |
| Q11 | How does QA reach a winner's order by hand? | Outside production only, one action makes a test account that won a closed sandbox lot through the real close, so its letters go out. The address is the operator's own with a `+qa-<code>` tag, which Grade10 checks. The same address makes one test winner. The Test tab lists test winners; Cancel is the order's own | Seeding an order around the real close, which skipped its letters and failed on a deployed stack; and signing in as another account, which admin can do in production too |
| Q12 | Are the order link in letters and the old order address requirements? | No. They restore settled behaviour, so they ship as fixes | A requirement for a link that should already work |
| Q13 | What does the winner's page lead with? | Dropped: the winner's page keeps its design | - |
| Q14 | Where does a reissue's fee start? | From the current invoice while the method stays; from the new method's rule after a switch, or empty with no rule; the schedule's suggestion for the new subtotal shows beside it - decided by the round | Always starting from the schedule, which undoes a fee the operator agreed with the winner |
| Q15 | Does money that lands move a status? | A card payment on an expired invoice settles it, since it paid the whole order total, and its flag asks the operator to check. On a replaced or cancelled invoice, at an amount that differs, or on an invoice in any status that cannot take a card payment, it counts toward nothing, and finance returns it outside Grade10. Clearing a flag moves nothing - decided by the round | Never moving a status, which leaves an expired invoice the winner paid in full with nothing an operator can do but settle it a second time |
| Q16 | Where does a flagged order sit in the worklist? | Under Needs action only, whatever its status, until an operator clears every flag on it; then back in its status's segment. The segment counts add up to All - decided by the round | Finding it only by opening the order, when a flag is money waiting on someone |
| Q17 | Where does a lot still taking bids read as extended? | The Listings table reads Extended; the worklist lists won lots only - decided by the round | A label on a worklist that no longer lists lots still taking bids |
| Q18 | What does Cancel on a test winner do? | The ordinary order cancel. The sandbox lot stays closed and is never biddable - decided by the round | Deleting the test data, which erases the history QA is checking |
| Q19 | How does a test winner sign in? | The ordinary sign-in link, which the console emails to the test address after making it and again on request; the operator opens it in a private window - decided by the round | A one-time link made for test accounts, which is a second way into an account that auth would have to guard |
| Q20 | Does `treasurer` hold payment processing? | Yes, as the code grants it today - decided by the round | Leaving it off, to match a role list the roles change is already correcting |
| Q21 | How does a fee rule with one part zero read? | Dropped with Q2 | - |
| Q22 | What range does a fee rule's percentage take? | At least 0 and below 100, to two decimal places - decided by the round | No upper bound, which lets a rule of 100% or more suggest no fee at all |
| Q23 | Does leaving the review record anything? | Dropped: the winner's page keeps its setup form, which confirms the address and the method together | - |
| Q24 | Can the winner change setup after confirming it? | No. The choices lock at confirm, and the server refuses a winner's change; an operator reopens or records setup - decided by the round | A winner amendment while a window stays open, which moves the address under an invoice being prepared |
| Q25 | Where do the bank details come from? | Grade10 holds them per currency on each server: the sample account outside production, and none in production until Finance confirms Grade10's account, so production offers card only until then - decided by the round | A sample account in the site's code, which showed on every lane and on every invoice PDF, production included |
| Q26 | What replaces the 72-hour Overdue mark? | Each row shows how long the order has waited in its status. Setup Overdue is the status at the 48-hour deadline, and Preparing Invoice carries no mark - decided by the round | A second mark beside the Setup Overdue status, which also marked the operator's own queue after 72 hours |
| Q27 | What does a returned proof tell the winner? | The reason the operator gives for the winner, never the internal note; the deadline resumes with the time that was left, and the Proof not accepted letter goes out - decided by the round | Returning it with no word, which leaves the winner waiting on a check that has ended |
| Q28 | Which proof files does Grade10 take? | The winner's upload keeps its limits - 1 to 3 files of 5 MB each and 15 MB in all, PDF, PNG, JPEG, HEIC or HEIF - judged by the file's content, not its name; an operator attaches 1 to 5 JPEG, PNG or PDF files of 10 MB each - decided by the round | Trusting a file's name, which lets any file through as a JPEG |
| Q29 | What does Grade10 keep of a refund's bank account? | The bank name, the channel (FPS, local or SWIFT) and the account or FPS phone masked to its last four digits, or an FPS email to its first letter and domain; the full number stays with the bank transfer itself - decided by the round | Keeping the full account number, which is personal data Grade10 never needs again once the refund is sent |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/winner-order | How does a fee rule with one part zero read at the choice? | Q21 |
| grade10-site/auction/winner-order | Does leaving the review record any of the three choices? | Q23 |
| grade10-site/auction/winner-order | Can the winner change setup after confirming it? | Q24 |
| grade10-site/auction/winner-order | Where do the bank details come from? | Q25 |
| grade10-admin/auction/post-sale | Where does a flagged order sit, before and after the flag is cleared? | Q16 |
| grade10-admin/auction/post-sale | Where does a reissue's fee start? | Q14 |
| grade10-admin/auction/post-sale | What replaces the 72-hour Overdue mark? | Q26 |
| grade10-admin/auction/post-sale | What does Grade10 keep of a refund's bank account? | Q29 |
| grade10-admin/auction/post-sale | Does money that lands move a status? | Q15 |
| grade10-admin/auction/post-sale | Where does a lot still taking bids read as extended? | Q17 |
| grade10-admin/auction/post-sale | Does `treasurer` hold payment processing? | Q20 |
| grade10-site/auction/winner-order | What does a returned proof tell the winner? | Q27 |
| grade10-site/auction/winner-order | Which proof files does Grade10 take? | Q28 |
| grade10-admin/auction/payment-settings | What is the upper bound on a rule's percentage? | Q22 |
| grade10-admin/auction/test-winners | How does a test winner sign in? | Q19 |
| grade10-admin/auction/test-winners | What does Cancel do to the sandbox lot? | Q18 |
