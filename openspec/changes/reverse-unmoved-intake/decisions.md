## Goals

- An inventory admin takes regular stock intaken by mistake back out of the product
- An inventory admin removes a Cert record intaken by mistake without counting it as withdrawn
- The history shows who took a unit out as a mistake, when, how many and why

## Non-Goals

- Reducing or removing a unit that has ever been held, sold, withdrawn or vaulted, even once it is available again
- Reducing regular stock below what is available, or reducing a hold's units
- Changing Remove physical unit, which still withdraws any available Cert record outside an active hold
- Offering free-pool sell or withdraw of regular stock on the product page
- Undoing a whole intake or a whole inventory workbook import in one step
- Reducing or removing units in bulk across products

## Decisions

| Q   | Asked | Decided | Instead of |
| --- | ----- | ------- | ---------- |
| Q1  | What does a reduction or removal of a unit that never moved do to the counts? | It undoes the intake: stock and the ledger fall by the units taken out, and withdrawn, sold and vaulted stay the same - @mason5991, 2026-10-05 | Counting it as withdrawn, as Remove physical unit does today, which keeps a unit the shop never had in the withdrawn count and the ledger, and leaves Cert records with nothing new |
| Q2  | Which regular stock counts as having no history and can be reduced? | Regular stock that has never been held, sold, withdrawn or vaulted; intakes and Cert ID assignments do not count as moves. The reduction is up to the available `No Cert ID` count - @mason5991, 2026-10-05 | Only while the regular stock history holds nothing but intakes, which one Cert ID assignment would close; or any available unit, which takes out units whose earlier moves the ledger then no longer explains |
| Q3  | On a Cert record that never moved, how do the new removal and Remove physical unit sit together? | Both are offered, labelled apart: the new removal undoes the intake, and Remove physical unit records a withdrawal. A record that has moved offers only Remove physical unit, as today - @mason5991, 2026-10-05 | The new removal alone on an unmoved record, which leaves no way to record a card that was received and has truly left before it ever moved |
| Q4  | Does a reduction or removal need remarks? | Required, as withdraw and Remove physical unit ask - @mason5991, 2026-10-05 | Optional, as intake and a Cert ID change take; a reduction lowers the ledger, so the history should say why |
| Q5  | Which Cert records can be removed as a mistake? | The unmoved records of the Cert ID correction rule: available, and never named by a hold, active or closed, nor sold, withdrawn or vaulted. A record given its Cert ID from regular stock counts while it has not moved since - decided by the round | A new rule of its own, which gives one dialog two meanings of "never moved" |
| Q6  | What happens to a removed Cert record's tagged media and Cert ID? | The record and the media tagged to it are deleted, as on Remove physical unit; untagged product media stay. The Cert ID is then free on the product, so a later intake can take it - decided by the round | Keeping the record as removed, which holds the Cert ID against an intake of the right card |
| Q7  | How does the history record it? | One entry, under its own action apart from intake and withdraw, with the units taken out, the Cert ID where there was one, actor, time and remarks. A regular stock reduction shows in the `No Cert ID` history; a Cert record removal shows in the product's history, since the record is no longer listed - decided by the round | Recording it as a withdrawal, which Q1 rules out, or as a negative intake, which reads as stock received |
| Q8  | How many units does one reduction take out? | Any whole number from one to the available `No Cert ID` count, in one entry - decided by the round | One unit at a time, which turns an over-intake of fifty into fifty entries |
| Q9  | Who can reduce or remove? | An inventory admin who may write inventory, the grant intake and Remove physical unit already take; others see the rows and the history only - decided by the round | A new grant, which no team has asked for |
| Q10 | How is success measured? | Remove physical unit used on a Cert record that has only been intaken, which should fall to none - decided by the round | No measure |

## Raised

| Capability | Raised | Landed |
| ---------- | ------ | ------ |
