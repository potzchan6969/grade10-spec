# grade10-site/auction/auction-orders Test Cases

**Status:** pending-review

## Settled

* A Won row on My Auctions opening its own order is `grade10-site/auction/account-record`'s to walk; this suite walks the list from its address.
* The account menu does not open the list; `grade10-site/site/page-shell` holds the menu's items.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, for `omit-profile-account-menu`, `grade10-site/auction/auction-orders`. The modified requirement drops one sentence, that the account menu links to My Auction Orders beside My Auctions; its four scenarios are carried word for word. No durable case moves.

**Run:** QA2 reconciliation, second run, 2026-10-06. No disposition moved. The journeys file now restates `grade10-site-auction-auction-orders-US-01` under `## Context user journeys`, the delta form, since the change modifies no journey; the suite carries no section for it because no case here moves.

**Run:** QA2 reconciliation, third run, 2026-10-06. `## Settled` records Q10: the account menu does not open the list. The feature set now says a Won row opens its own order, not the list. No case or scenario moved.

**Run:** QA2 reconciliation, fourth run, 2026-10-06, after the delta's feature set kept only its Entry points line. No case or scenario moved.

**Run:** QA2 reconciliation, fifth run, 2026-10-06, in a fresh context. The four carried scenarios and the seven durable cases were joined again; none names the account menu, so no case or scenario moved.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-auction-auction-orders-US1-TC8-1` | Rejected, duplicate | A Won row on My Auctions opening its own order is `grade10-site/auction/account-record`'s rule, walked by `grade10-site-auction-account-record-US8-TC1-1`; no scenario here states it. Dropped before it was issued |
| The account-menu link | Dropped, no case | No case asserted it and no scenario stated it. The menu's closed set is `grade10-site/site/page-shell`'s, where the auction-launch menu offers My Auctions and Sign Out and no other item |
| Raised: what opens the list | Landed as Q13, open | With the menu entry gone and each Won row opening its own order, nothing in the site opens the list. Post-Bidding · My Auction Orders holds it open until Product answers |
| Contradictions | None | The durable cases walk the list from its address and agree with the carried scenarios |
