# grade10-site/vault/valuation-and-offer Specification

## Feature set

- The valuation
  - Every case valued: the paper prints what the item was worth when it came in
  - Appended, never edited: a re-valuation leaves both figures readable
  - Never below a live offer: one packet may not print a valuation under the
    loan on its next page
- The offer
  - What an offer states: a principal, the interest for the whole term, a term
    in days and an expiry — and no due date, because nothing is lent yet
  - One live offer: a counter-offer supersedes and inserts in one act
  - Bounded by the valuation: the principal is at most what the item was
    valued at
- What the brand lends under
  - One policy table: loan to value, the rate band, the term presets, offer
    validity, grace, the accrual ceiling and the notice period, per brand
  - A null bound: allows everything outside production, and refuses the offer
    in production
  - The lender named: no offer in production while the lender's registered
    name is unset
- Answering the offer
  - The collector or the counter: either may accept, and the signature is what
    binds
  - Declining keeps the request: the offer closes and staff may write another
  - An expired offer: cannot be accepted, and the case stays where it is
  - Answered from the case: Accept and Decline sit on the offer itself, each
    behind a confirmation naming the total, what a late day costs and what
    will be signed
  - Only the offer that stands: a superseded offer reads as closed and takes
    no answer, so the collector answers the live one
  - The refusal reaches the reader: an offer that ran out or a case that
    moved under the answer is named where the answer was given
- The storage lane
  - Terms with no offer: custody terms are agreed against the valuation alone
