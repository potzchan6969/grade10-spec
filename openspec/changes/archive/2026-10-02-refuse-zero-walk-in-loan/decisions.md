## Goals

- Case intake states the rule its worker holds: a financing amount is more than zero
- Staff read why a loan of zero is refused, beside the loan field, before anything is sent

## Non-Goals

- Changing the worker's amount rule or its refusal
- Changing the collector's wizard or its words: it refuses zero already, in the collector's own words
- Translating the console: its words stay English, as every console string is
- An upper limit on the amount asked for beyond what the worker holds now

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does case intake say a financing amount is? | An integer count of minor units, more than zero - decided by the owner, owner-questions 15, 2026-10-02 | An integer count of minor units only, which lets a loan of nothing read as a lane |
| Q2 | Where does a loan of zero read at the counter? | Beside the loan field, before anything is sent, as the malformed address reads beside its field - decided by the owner, owner-questions 15, 2026-10-02 | The footer with the worker's own text, which names no field and reads in no rule's words |
| Q3 | Which rule decides that an amount is not more than zero? | The worker's own rule for the amount, read by the form, so the two never disagree (recommended) | A second check in the console, which drifts from the worker's |
| Q4 | When does the refusal show and clear? | When staff leave the loan field holding an amount that is not more than zero, never while they type; it clears as soon as the amount meets the rule or is emptied, and shows again only when they next leave the field; Open case stays unavailable while the amount fails the rule, unless staff choose storage only (Q8) (recommended) | On every keystroke, which refuses `0` before `0.50` is finished |
| Q5 | Is an empty loan field refused? | No: with a loan chosen, Open case stays unavailable until an amount is typed, as it is today, and nothing is refused beside the field (recommended) | Refusing an empty field the moment staff tab past it, before they have asked the customer |
| Q6 | Where do the refusal's words live? | In the console, beside its other walk-in words: `A loan is more than zero. Ask the customer how much, or choose Storage only.` (recommended) | A key in the shared catalogs: the console is English by decision |
| Q7 | Do the wizard's words change to say "more than zero"? | No: the wizard's refusal already names both ways on, an amount or storage only, in the collector's words in four languages, and the console's words name the same two and say the rule (recommended) | Rewriting four catalogs for a rule the collector already reads |
| Q8 | What happens when staff choose Storage only while the refusal shows? | The loan field goes and Open case becomes available, since a storage case carries no amount; the amount is kept and the refusal is cleared, so choosing a loan again shows the amount with Open case unavailable, and the refusal shows when staff next leave the field (recommended) | Showing the refusal at once on a field built again, which the console draws only after the field is typed in or left, so it would show on the first keystroke |
| Q9 | Is a negative amount refused beside the loan field in the same words? | No: the console's money field refuses a minus sign itself as it is typed, in its own words, and hands no amount on, so Open case is held and the zero refusal never sees one (recommended) | A second refusal for the same field in other words |
| Q10 | Is an amount finer than the currency's smallest unit, such as `0.004` in HKD, read as zero? | No: the console's money field refuses it as it is typed, in its own words, and never rounds it; the collector's wizard field does not take it, as it takes no zero (recommended) | Rounding it to zero and refusing it as a loan of zero, which refuses an amount nobody typed |
| Q11 | Which case-intake requirement carries the rule? | The financing amount's own requirement, the one that decides the lane (recommended) | The facts table's row, which `add-item-registry` also rewrites while in flight, so whichever archives second would undo the other |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/vault/operator-queue` | When staff choose Storage only while the refusal shows, does it clear, does Open case become available, and is the typed amount dropped? | Q8 |
| `grade10-admin/vault/operator-queue` | Does the loan field take a minus sign, and is a negative amount refused beside the field in the same words? | Q9 |
| `grade10-admin/vault/operator-queue`, `grade10-site/vault/case-intake` | Is an amount with more decimals than the currency holds, below one minor unit, refused as zero, rounded, or refused as malformed? | Q10 |
