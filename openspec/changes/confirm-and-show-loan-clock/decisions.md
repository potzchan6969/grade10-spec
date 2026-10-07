## Goals

- An operator checks the slot before a cancelled visit is emailed to the collector
- An operator checks the address and the date to pay by before a forfeiture notice goes
- An operator opening a late loan's case reads how late it is, or the date to pay by, beside its status

## Non-Goals

- Confirming any other act: Book visit and Move visit take a slot picked first, Send again sends what the collector was already owed, and the acts that already open a dialog keep it
- A clock on queue rows; the Overdue view keeps its own count
- A clock before the due date
- A new case status for a late loan
- Changing what the collector is emailed, the date a notice names, or when a notice may be sent
- The collector's own screens

## Decisions

Every row below was put to the product owner after a staging walk, who
answered "do what's optimal to users" on 2026-10-07. The rows are the round's
recommended reading, taken on that delegation; any hand overturns one with a
reply.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Should Cancel visit and Send forfeiture notice keep acting on one press? | No: both confirm first (recommended) - decided by the round on the owner's delegation | One press, as today: an email to the customer, and a legal deadline, should never follow a misplaced press, and every other act that cannot be taken back already asks |
| Q2 | Does Cancel visit confirm before, or offer an undo after? | Confirm before (recommended) - decided by the round on the owner's delegation | An undo after the press: the email has left by the time the undo shows |
| Q3 | What does the Cancel visit confirm say? | The slot's day and time on the shop's clock, that the collector is emailed, and that the case keeps its status (recommended) - decided by the round on the owner's delegation | A bare "are you sure", which names nothing the operator can check |
| Q4 | What does the forfeiture notice confirm say, and in which tone? | The address the notice goes to and the date to pay by it sets, in the destructive tone (recommended) - decided by the round on the owner's delegation | The default tone, which reads like any other act |
| Q5 | Where does an operator read how late a loan is? | In the case header, beside the status: `N days past due` (recommended) - decided by the round on the owner's delegation | The Payouts tab alone: staff do not hold the grant to open it, and an operator opening the case does not see it |
| Q6 | What kind of mark is it? | A clock, never a badge saying the case waits on staff (recommended) - decided by the round on the owner's delegation | A waits-on-staff badge, which contradicts the rule that a case runs a clock once terms are accepted; a new `overdue` status, which `grade10-site/vault/case-lifecycle` rules out and which would move what the collector's side and the letters read |
| Q7 | What does the clock read once a forfeiture notice stands? | `pay by <date>` on the shop's clock, in place of the count (recommended) - decided by the round on the owner's delegation | Both side by side, which puts two clocks on one loan |
| Q8 | Does the header read `due in N days` before the due date? | No: the spec draws no header clock before the due date, nothing on a loan inside its term waits on the shop, and the header already states what is owed (recommended) - decided by the round on the owner's delegation | A countdown from the advance onward, which the collector's Due stage reads as a date and nothing asks of the console |
| Q9 | Which count does `N days past due` give? | Calendar days on the shop's calendar after the due date - 1 on the day after it - the count the collector's Past due stage gives; the brand's grace is not taken off and not named in the header (recommended) - decided by the round on the owner's delegation | The count net of grace days, which says when late interest starts rather than how late the loan is |
| Q10 | Which cases carry the clock? | A live loan, `active` with an advance recorded, past its due date; a storage case, a repaid loan and an ended case carry none (recommended) - decided by the round on the owner's delegation | Every case in custody, which would put a clock on cases that owe nothing |
| Q11 | What does the clock read once the date to pay by has passed? | Still `pay by <date>`; the Custody tab offers Forfeit and says so (recommended) - decided by the round on the owner's delegation | A third wording such as "pay-by date passed", which the delegation did not name |
| Q12 | Which address do the confirms name, and what if the case holds none? | The case's own email address, which every message to the collector goes to; a case with none says nobody is emailed (recommended) - decided by the round on the owner's delegation | The account's sign-in address, which the letters do not go to |
| Q13 | Which date does the notice confirm name? | The date the notice would name if sent as the confirm opens, from the brand's notice period on the brand's calendar; where the shop's day turns before the press, the notice names the worker's date, one day later, which only gives the borrower more time (recommended) - decided by the round on the owner's delegation | Asking again when the two dates differ, which is a second confirm for a date that only moves in the borrower's favour |
| Q14 | What does the notice confirm say where the brand has set no notice period? | That no date to pay by can be named without one, with the worker's refusal shown in the dialog when sent (recommended) - decided by the round on the owner's delegation | Hiding the act, which leaves the operator no reason in words |
| Q15 | Which tone does the Cancel visit confirm take, and how is it dismissed? | The default tone; dismissing reads "Keep visit", so "Cancel" never sits beside "Cancel visit" (recommended) - decided by the round on the owner's delegation | The destructive tone, which would make a visit read as weighty as a legal notice |
| Q16 | Is any other act a single press that emails the collector? | No: these two are the whole set - Book and Move take a slot picked first, Send again sends what was already owed, and Record acceptance and Agree custody terms email nothing (recommended) - decided by the round on the owner's delegation | Confirming every act, which teaches operators to press through a confirm |
| Q17 | Which clock does the Cancel visit confirm name the slot on? | The zone of the shop the visit is booked at, named as the visit booker names it, `On the shop's clock (<zone>)`; the console's other visit times move to the same clock in `read-vault-console-on-shop-clock` - decided by the planning lead on the owner's delegation | The brand's zone, which names another hour at a shop that keeps a zone of its own |
| Q18 | Does the header's count agree with the Overdue view's days overdue? | Not by rule: the header counts calendar days past the due date, as the collector's Past due stage does, and the Overdue view's count is net of the brand's grace. Both brands hold zero grace, so the two agree today; the clock keeps the `info` tone - decided by the planning lead on the owner's delegation | One count net of grace in both places, which says when late interest starts rather than how late the loan is |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/vault/operator-queue` | Which clock does the Cancel visit confirm name the slot on, and does it name the zone? Q3 says the shop's clock, while the console reads the brand's zone and a visit is booked at a shop with a zone of its own. | Q17 |
| `grade10-admin/vault/operator-queue` | Should the header's days past due and the Overdue view's days overdue agree once a brand sets grace? The header takes no grace off and the view does. | `❓ docs/prds/products/grade10-site/vault/operator-console.md` - Two late counts |
| `grade10-admin/vault/operator-queue` | What does Cancel visit do when the visit was cancelled or moved in another tab before the press? The confirm reads the case as it stands, and nothing says whether a visit already gone opens a confirm or what the operator reads instead. | `❓ docs/prds/products/grade10-site/vault/operator-console.md` - A visit gone before the press |
