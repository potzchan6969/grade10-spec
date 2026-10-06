## Goals

- A winner sees what tax they owe as its own line in the Order Summary, on the
  invoice and on the receipt
- An operator can state a tax amount when they quote, and correct it on a
  reissue
- Tax is charged whole: the card processing fee is grossed up on it, so
  Grade10 keeps the Subtotal it billed

## Non-Goals

- Computing tax. Grade10 holds no rate table, no jurisdiction rule and no
  rounding rule for tax
- Computing tax from an address. The Tax tip tells the winner the amount
  follows where the order ships, because it does; Grade10 still reads no
  address to price it, and the operator decides both the amount and whether
  the lot is taxable at all
- A tax provider. No vendor, no credential, no failure path for one that does
  not answer
- The formal tax receipt — Grade10's company details and tax ID on a receipt.
  Finance owns that question and it stays open
- Import duty. The line is Tax, and duty is not in scope
- A tax line anywhere but an auction winner's order. The store's own checkout
  prices its tax elsewhere

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does the tax amount come from? | The operator enters it on the quote, like Shipping & Handling and Insurance. Carried by `An operator quotes and sends the invoice` | A rate Grade10 computes, which needs a jurisdiction rule, a rate per regime and a rounding rule nobody has written; and a tax provider, which adds a vendor and a credential to price a number an operator already knows |
| Q2 | What does the winner see before the amount is known? | TBD, with the other quoted rows. Carried by `Tax before the invoice is sent` | Hiding the row until send, which would tell a winner the total is final when it is not |
| Q3 | What does the winner see after an invoice sends with no tax on it? | No Tax line at all — the Insurance rule, `winner-order-SC-39`. Carried by `Invoice fields` | A Tax line reading 0, which puts a permanent zero row on every untaxed order and breaks the precedent the summary already sets |
| Q4 | What is the line called? | Tax — the name the invoice fields table already gives it. Carried by `Invoice fields` | Estimated Tax, which doubles the estimate wording the suite already applies before send and is wrong after it; and Duties & Tax, which promises duty this change does not deliver |
| Q5 | How far does the change reach? | Both sides at once: the winner's line and the operator's field. Carried by `Invoice fields` and `An operator quotes and sends the invoice` | Winner-order alone, which ships a row no operator can ever fill and needs a second change the same week |
| Q6 | Is tax inside the Subtotal, so a card order's fee is grossed up on it? | Inside. The Invoice fields table already defines the Subtotal as the sum of the components above, and Tax is one of them. Carried by `Invoice fields` | Outside the fee base, which makes Grade10 absorb the provider's cut on tax it merely collects, and contradicts a requirement already written |
| Q7 | Can an operator add Tax of zero? | No — refused, exactly as Insurance at zero is refused. Carried by `An operator quotes and sends the invoice` | Allowing zero, which makes "no tax" and "tax of nothing" indistinguishable on the record |
| Q8 | Does a reissue carry Tax? | Yes — Tax joins the quoted amounts a reissue can change, with its before and after in the audit log. Carried by `An operator reissues a sent invoice` and `Invoice log history` | Freezing tax at the first send, which would force a full cancellation to correct an operator's typo |
| Q9 | Insurance and Tax are the same shape — an optional operator-entered amount, above zero, TBD before send, absent when none. Write the rules twice, or once for both? | Write Tax separately now, and generalise at the third such line | Generalising now, which re-anchors the Insurance scenarios this change cites as its precedent for a saving of one requirement |
| Q10 | When does the Tax line's info tip show? | Whenever the Tax line shows — Awaiting Setup, Preparing Invoice and after send, as Insurance's tip rides its line. That precedent landed with `add-shipping-insurance-order-summary-tooltip`, archived 2026-09-24, and is durable in `Insurance info tooltip` and `Insurance before the invoice is sent`. Carried by `Tax info tooltip` | Awaiting Setup alone, which drops the tip the moment a winner confirms an address and leaves the same TBD unexplained in Preparing Invoice |
| Q11 | What does the Tax tip say? | `Set by Grade10 for where your order ships. Some orders have none.` — first sentence names who sets it (mirrors Payment Processing Fee’s “Set by…”); second answers that some orders have none, which TBD alone does not. No dash between the two sentences. Carried by `Tax info tooltip` | `We set this from where your order ships. Some orders have none.` — rejected: “We” is vague beside siblings that name the actor; `Confirm your address and we will set the amount`, false once the address is confirmed and again once the invoice is sent; and `Tax depends on where your order ships.`, which names no actor and reads as a rate Grade10 computes from an address |
| Q12 | `add-shipping-insurance-order-summary-tooltip` owns the Order Summary tip mechanism and the pre-send TBD rule. Double them, or depend on it? | Depend on it. This change declares `depends_on: add-shipping-insurance-order-summary-tooltip` and lands after it. It reuses that change's tip mechanism and TBD rule, and states Tax's own tip and pre-send rule in `Tax info tooltip` and `Tax before the invoice is sent`, beside Insurance's, per Q9. It edits neither of those two Insurance requirements | Moving the Tax tip into that change, which edited a Planned change already carrying a `tasks.md` and needed its hand's agreement; and one rule for every quoted row now, which Q9 leaves to the third such line |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/post-sale` | Blind pass: Is removing Tax on a reissue a change of its own, distinct from changing its amount? | Q8 |
