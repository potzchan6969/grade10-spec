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
- Deciding which address governs tax, or whether a lot is taxable at all. The
  operator decides both, outside the product
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
| Q1 | Where does the tax amount come from? | The operator enters it on the quote, like Shipping & Handling and Insurance | A rate Grade10 computes, which needs a jurisdiction rule, a rate per regime and a rounding rule nobody has written; and a tax provider, which adds a vendor and a credential to price a number an operator already knows |
| Q2 | What does the winner see before the amount is known? | TBD, with the other quoted rows | Hiding the row until send, which would tell a winner the total is final when it is not |
| Q3 | What does the winner see after an invoice sends with no tax on it? | No Tax line at all — the Insurance rule, `winner-order-SC-39` | A Tax line reading 0, which puts a permanent zero row on every untaxed order and breaks the precedent the summary already sets |
| Q4 | What is the line called? | Tax — the name the invoice fields table already gives it | Estimated Tax, which doubles the estimate wording the suite already applies before send and is wrong after it; and Duties & Tax, which promises duty this change does not deliver |
| Q5 | How far does the change reach? | Both sides at once: the winner's line and the operator's field | Winner-order alone, which ships a row no operator can ever fill and needs a second change the same week |
| Q6 | Is tax inside the Subtotal, so a card order's fee is grossed up on it? | Inside. The Invoice fields table already defines the Subtotal as the sum of the components above, and Tax is one of them | Outside the fee base, which makes Grade10 absorb the provider's cut on tax it merely collects, and contradicts a requirement already written |
| Q7 | Can an operator add Tax of zero? | No — refused, exactly as Insurance at zero is refused | Allowing zero, which makes "no tax" and "tax of nothing" indistinguishable on the record |
| Q8 | Does a reissue carry Tax? | Yes — Tax joins the quoted amounts a reissue can change, with its before and after in the audit log | Freezing tax at the first send, which would force a full cancellation to correct an operator's typo |

| Q9 | Insurance and Tax are the same shape — an optional operator-entered amount, above zero, TBD before send, absent when none. Write the rules twice, or once for both? | ❓ Product - recommended: twice now, generalised at the third such line. Generalising here re-anchors the Insurance scenarios this change cites as its precedent, for a saving of one requirement | Generalising now, which rewrites requirements this change does not otherwise touch |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
