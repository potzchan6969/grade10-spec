## Screens

### Vault home with cases

Board: `C01-VaultHome` on the [vault design canvas](https://claude.ai/artifact/BUPaDYBGRH8p5ib5hZk8Su);
the chip tones are its `Statuses` board's. Storybook: `Vault Case/VaultCases`,
one story per card state. The site renders the same block under its own
title and intro.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `VaultCases` | `@grade10/ui` | Start a request, Your cases with the count, a card per case, the several-items note |
| `Card`, `Badge`, `Button`, `Text`, `Alert` | `@grade10/design-system` | Inside the block only |

- **Badge tones** - [Q6](decisions.md#decisions); the softer fills are
  grade10#702's palette
- **The next step's tint** - `primary-muted` for Answer by, `muted` for a
  draft's step
- **Icons** - Phosphor, as the store's blocks use: the chip icons Q6 names,
  an arrow on the next step, a calendar on the calendar line, a caret on the
  card, a plus on Start a request, an info mark on the note
- **The facts line** - joined by a middle dot, the board's separator, drawn
  by the block
- **Words** - [Q8](decisions.md#decisions); `vault.list.open` and
  `vault.list.noVisit` go

## States

### Vault home with cases

| State | Shows | Anchor |
| --- | --- | --- |
| Cases | Start a request, Your cases with the count, one card per case in the list's order, the several-items note | `shared-ui-vault-case-SC-24` |
| Offer waiting | Offer waiting for you and Waiting on you; opened, With a loan, asked for, the reference; Answer by in the primary tint; the booked visit | `shared-ui-vault-case-SC-26`, `grade10-site-vault-valuation-and-offer-SC-25` |
| Visit booked | Request sent and With us; the calendar line names the visit | **Out of suite:** the word each state reads is the site's map, held by the site's `CaseList` test; its parts are `shared-ui-vault-case-SC-26` |
| Terms agreed, visit ahead | Terms agreed and Visit with its day; no calendar line | **Out of suite:** the word each state reads is the site's map, held by the site's `CaseList` test; its parts are `shared-ui-vault-case-SC-26` |
| In the vault | In the vault and With us since the day; Storage only; no next step and no calendar line | `grade10-site-vault-case-lifecycle-SC-34` |
| Loan running | Loan running and Due with its day; In the vault since on the calendar line | **Out of suite:** the word each state reads is the site's map, held by the site's `CaseList` test; its parts are `shared-ui-vault-case-SC-26` |
| Past due | Loan running and the days past due in the error tone | **Out of suite:** the word each state reads is the site's map, held by the site's `CaseList` test; its parts are `shared-ui-vault-case-SC-26` |
| Repaid | Repaid and Settled with its day | **Out of suite:** the word each state reads is the site's map, held by the site's `CaseList` test; its parts are `shared-ui-vault-case-SC-26` |
| Back with you | Back with you and Collected with its day | **Out of suite:** the word each state reads is the site's map, held by the site's `CaseList` test; its parts are `shared-ui-vault-case-SC-26` |
| Draft | Not sent yet and With you; the step to add photographs in the muted tint; no calendar line | `grade10-site-vault-case-intake-SC-01` |
| Walk-in draft | Not sent yet and With you; the counter line as the step in the muted tint | `grade10-site-vault-case-intake-SC-32` |
| Ended | Declined, Cancelled, Expired or Forfeited and Closed with its day; the reason staff gave, when given, in the error tone; no next step | `shared-ui-vault-case-SC-26` |
| Untitled item | the vault's word for an item with no name, as the case page reads it; the control described by the reference | `shared-ui-vault-case-SC-26` |
| Narrow | the board's 390 px column: the chips and the facts line wrap | **Out of suite:** the stories at the board's 390 px column, a design review |
| Loading | the site's skeleton cards, as today | **Out of suite:** the site's `CaseList` test |
| Error | the site's failure line, as today | **Out of suite:** the site's `CaseList` test |
