## Goals

- An inventory admin takes regular stock intaken by mistake back out of the product
- An inventory admin removes a Cert record intaken by mistake without counting it as withdrawn
- The history shows who took a unit out as a mistake, when, how many and why

## Non-Goals

- Reducing or removing a unit that has ever been held, sold, withdrawn or vaulted, even once it is available again
- Reducing regular stock below what is available, or reducing a hold's units
- Offering free-pool sell or withdraw of regular stock on the product page
- Undoing a whole intake or a whole inventory workbook import in one step
- Reducing or removing units in bulk across products

## Decisions

| Q   | Asked | Decided | Instead of |
| --- | ----- | ------- | ---------- |
| Q1  | What does a reduction or removal of a unit that never moved do to the counts? | It undoes the intake: stock and the ledger fall by the units taken out, and withdrawn, sold and vaulted stay the same - @mason5991, 2026-10-05 | Counting it as withdrawn, as Remove physical unit does today, which keeps a unit the shop never had in the withdrawn count and the ledger, and leaves Cert records with nothing new |
| Q2  | Which regular stock counts as having no history and can be reduced? | Regular stock that has never been held, sold, withdrawn or vaulted; intakes and Cert ID assignments do not count as moves. The reduction is up to the available `No Cert ID` count - @mason5991, 2026-10-05 | Only while the regular stock history holds nothing but intakes, which one Cert ID assignment would close; or any available unit, which takes out units whose earlier moves the ledger then no longer explains |
| Q3  | On a Cert record that never moved, how do the new removal and Remove physical unit sit together? | One removal per record: a record that has only been intaken offers only the reversal, and Remove physical unit is offered only on a record that has moved, so it still records a withdrawal. **BREAKING:** Remove physical unit no longer appears on a record that has only been intaken - @mason5991, 2026-10-05 (held) | Both offered on an unmoved record, which the round recommended so a card that was received and left before it ever moved still counts as withdrawn; the author held one button per record, and that card is reversed with remarks saying why (Q4) |
| Q4  | Does a reduction or removal need remarks? | Required, and prefilled with `Entered by mistake` in the confirmation: the admin may edit them, never leave them empty. A card that was received and has left before it ever moved is reversed with remarks saying so - @mason5991, 2026-10-05 | Required and typed every time, as withdraw and Remove physical unit ask, which slows the usual mistake; or optional, which leaves a ledger fall unexplained |
| Q5  | Which Cert records can be removed as a mistake? | The unmoved records of the Cert ID correction rule: available, and never named by a hold, active or closed, nor sold, withdrawn or vaulted. A record given its Cert ID from regular stock counts while it has not moved since - decided by the round | A new rule of its own, which gives one dialog two meanings of "never moved" |
| Q6  | What happens to a removed Cert record's tagged media and Cert ID? | The record and the media tagged to it are deleted, as on Remove physical unit; untagged product media stay. The Cert ID is then free on the product, so a later intake can take it - decided by the round | Keeping the record as removed, which holds the Cert ID against an intake of the right card |
| Q7  | How does the history record it? | One entry, under its own action apart from intake and withdraw, with the units taken out, the Cert ID where there was one, actor, time and remarks. A regular stock reduction shows in the `No Cert ID` history; a Cert record removal shows in the product's history, since the record is no longer listed - decided by the round | Recording it as a withdrawal, which Q1 rules out, or as a negative intake, which reads as stock received |
| Q8  | How many units does one reduction take out? | Any whole number from one to the available `No Cert ID` count, in one entry - decided by the round | One unit at a time, which turns an over-intake of fifty into fifty entries |
| Q9  | Who can reduce or remove? | An inventory admin who may write inventory, the grant intake and Remove physical unit already take; others see the rows and the history only - decided by the round | A new grant, which no team has asked for |
| Q10 | How is success measured? | Withdrawals whose remarks say the unit was entered by mistake, which should fall to none - decided by the round | Remove physical unit used on a Cert record that has only been intaken, which Q3 now rules out by construction |
| Q11 | Does a reduction or removal run as soon as the admin chooses it? | No: a confirmation dialog opens first. It names the Cert ID or the number of `No Cert ID` units, says stock and the ledger fall by that number and, for a Cert record, that its tagged media are deleted, and holds the remarks. Nothing changes until the admin confirms; cancelling changes nothing and writes no history - @mason5991, 2026-10-05 | Running on the first click, which is how a misclick takes a unit out of the ledger with no withdrawal to show for it |

## Raised

| Capability | Raised | Landed |
| ---------- | ------ | ------ |
