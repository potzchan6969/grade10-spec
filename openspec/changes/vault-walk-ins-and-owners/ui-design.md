# UI: Vault walk-ins and owners

No Figma frame and no canvas board draws any screen below yet; the designer
owes all four, and the change's record says so under `awaiting: ui-design`.
Until a board lands, each screen is the composition named here, drawn from
the console's and the store's existing blocks, and nothing below invents a
look: a state no block carries is flagged for the designer, never drawn
locally. [decisions.md](decisions.md) owns the scope, the journeys beside each
delta own who walks it, and `tech-design.md` will own the data.

- **Where the views live** - the walk-in form, the owner column and filter in
  `packages/vault/admin-frontend`; the collector page in `apps/admin/grade10`,
  its vault section a view of `packages/vault/admin-frontend`; the
  confirmation on the case page in `packages/vault/frontend`, composing the
  new store block
- **Stories** - one per view per distinct layout, `Vault/<Feature>/<View>`
  as the collector flow names them, so an id reads
  `vault-<feature>-<view>--<state>`; the store block's stories sit beside it
  under `Vault Case/<Component>`
- **Copy** - the collector's words are keys in
  `packages/i18n/messages/shared/<locale>/vault.json`; the console's words
  stay the console's own English, as its panels carry them

## Screens

| Screen | Board | Route | Composes |
| --- | --- | --- | --- |
| Walk-in form | none yet - the designer's | dialog from the queue's header, `admin.grade10.com/vault` | new `WalkInDialog` → `FormDialog`, `TextField`, `NotesField`, `ChoiceList`, `Choice`, `MoneyField`, `FileButton`, `MediaGallery`, `Notice` |
| Walk-in case, unconfirmed | none yet | `admin.grade10.com/vault/cases/:caseId` | `CaseDetailPanel`, `WithheldActs` → `Badge`, `Notice`, `Button` |
| Queue and held items, owner | none yet | `admin.grade10.com/vault`, the queue and the Held items tab; the owner in the address | `CaseQueuePanel`, `CaseQueueTable`, `CustodyHoldingsPanel` → `Table`, `Row`, `Cell`, `Link`, `Status`, `Button` |
| Collector page v1 | none yet - the designer draws the page | `admin.grade10.com/collectors/:userId` | new `CollectorPage` → `SectionHeader`, `Panel`, `Table`, `Row`, `Cell`, `At`, `StatusBadge`, `CursorPager`, `Status`, `Link` |
| Confirm your case | none yet | `grade10.com/vault/cases/:caseId`, on a case staff opened | `CaseDetailView` → new `VaultConfirmCaseCard`, `FactCard`, `NoteList` |

## Components

### `@grade10/design-system` - existing, no new variant or token asked

`Card`, `Text`, `CheckboxListInput`, `Button`, `Alert`, `Divider`, `VStack`
inside the new block; nothing reaches the case page outside a store block.

### `@grade10/ui` - new, `shared/ui/vault-case`

- **`VaultConfirmCaseCard`**, with `VaultConfirmCaseCardProps` and
  `VaultConfirmCaseCardCopy` - the request staff opened, read back as label
  and value rows; the collection-statement tick with its link; Confirm; a
  confirmation on its way holds the card, and a refusal stays beside the tick
  it refused. Every word, row and callback through props (`onConfirm`,
  `onStatementOpen`); it fetches nothing. Beside `VaultAcceptOfferDialog` and
  `VaultCasesEmpty`, which `complete-vault-collector-flow` adds, so this block
  lands after that change publishes the capability
- **Awaiting the designer** - the card's layout, and whether the read-back
  rows sit in it or in a `FactCard` above it; the block is drawn from the
  board, never ahead of it

### `@grade10/ui` - existing

`FactCard` and `NoteList` from `shared/ui/page-blocks`: the case page's
header facts and What happens next, unchanged.

### Console blocks - existing, `@grade10/frontend-console`

`FormDialog`, `TextField`, `NotesField`, `ChoiceList`, `Choice`,
`MoneyField`, `FileButton`, `MediaGallery`, `SectionHeader`, `Panel`,
`Table`, `Row`, `Cell`, `At`, `Status`, `StatusBadge`, `CursorPager`,
`Notice`, `Badge`, `Link`, `Button`. The owner filter is a `Link` into the
filtered address and a `Button` that clears it; nothing the console package
lacks.

### New in grade10 - work in the application

- **`WalkInDialog`** - the counter's form, the refusal for a signed-in
  address, and the photos, in `packages/vault/admin-frontend`
- **`CollectorPage`** - the header and the vault cases section, each
  section reading and refusing on its own, in `apps/admin/grade10`
- **The owner column** - on `CaseQueueTable` and `CustodyHoldingsPanel`,
  the name as a link to the collector page, and the filter's own line

### Words - work in `packages/i18n`

Answered in `shared/` for every language it speaks; the words are not
written here.

- **`vault.case.confirm.*`** - title, lead, the statement tick and its link,
  confirm, the pending line, refused, and the line an unconfirmed case reads
  on the list

## States

### Walk-in form

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | email, name, category, title, description, lane and amount, photos; Open case disabled | `grade10-admin-vault-operator-queue-US-10` |
| Photos added | the photos in a `MediaGallery`, n of 10, each removable | `grade10-admin-vault-operator-queue-US-10` |
| Opening | Open case pending; the form held | `grade10-admin-vault-operator-queue-US-10` |
| Opened | the new case opens on its own page | `grade10-admin-vault-operator-queue-US-10` |
| Signed-in address | a `Notice` naming the refusal: that customer sends the request from their own phone; the form keeps what was typed | `grade10-admin-vault-operator-queue-US-10` |
| Refused otherwise | the worker's refusal in words beside the field it names | `grade10-admin-vault-operator-queue-US-10` |

### Walk-in case, unconfirmed

| State | Shows | Anchor |
| --- | --- | --- |
| Waiting for the customer | a badge on the case and its queue row; the withheld acts name the confirmation they wait for; Cancel offered | `grade10-admin-vault-operator-queue-US-10` |
| Confirmed | the badge goes and Start valuation is offered | `grade10-site-vault-case-intake-US-06` |
| Cancelled for a typo | the case ends as cancelled, and the collector is told nothing | `grade10-site-vault-case-lifecycle-US-06` |

### Queue and held items, owner

| State | Shows | Anchor |
| --- | --- | --- |
| Named | each row's owner by account name, a link to their collector page | `grade10-admin-vault-operator-queue-US-11` |
| Name unavailable | the short id and "name unavailable"; the rest of the row and the list stand | `grade10-admin-vault-operator-queue-US-11` |
| Treasurer | no owner column; the reference and the contact as today | `grade10-admin-vault-operator-queue-US-11` |
| Narrowed to one owner | the owner's name above the rows, the count for that owner, and a control clearing it | `grade10-admin-vault-operator-queue-US-12` |
| Narrowed, none | the owner holds no case in this cut | `grade10-admin-vault-operator-queue-US-12` |

### Collector page v1

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | each section's own `Status` pending | `grade10-admin-console-collector-page-US-01` |
| Header | the account's name and email | `grade10-admin-console-collector-page-US-01` |
| Header, treasurer | the contact the cases hold, and no name | `grade10-admin-console-collector-page-US-02` |
| Header, unavailable | the short id and "name unavailable"; the sections still load | `grade10-admin-console-collector-page-US-01` |
| Vault cases | reference, item, status, lane, last touched, each opening its case; paged | `grade10-admin-console-collector-page-US-01` |
| Vault cases, none | the collector holds no vault case | `grade10-admin-console-collector-page-US-01` |
| Section forbidden | the section names the grant it needs; the others stand | `grade10-admin-console-collector-page-US-02` |
| Section failed | the section's own error with retry; the others stand | `grade10-admin-console-collector-page-US-01` |
| Unknown collector | nobody answers to that id | `grade10-admin-console-collector-page-US-01` |

### Confirm your case

| State | Shows | Anchor |
| --- | --- | --- |
| Listed | the case on the collector's list, reading that it waits for their confirmation | `grade10-site-vault-case-intake-US-06` |
| To confirm | the request and staff's photos read back, the statement tick, Confirm | `grade10-site-vault-case-intake-US-06` |
| Tick missing | Confirm refused with the line under the tick; nothing sent | `grade10-site-vault-case-intake-US-06` |
| Confirming | Confirm pending; the card held | `grade10-site-vault-case-intake-US-06` |
| Confirmed | the case page as any submitted case reads it | `grade10-site-vault-case-intake-US-06` |
| Refused | the refusal beside the tick, the case unchanged | `grade10-site-vault-case-intake-US-06` |
| Cancelled before confirming | the ending as any cancelled case reads it | `grade10-site-vault-case-lifecycle-US-06` |

## Flags

- **Every board is missing** - the walk-in form, the unconfirmed case's
  badge, the owner column and filter, the collector page and the
  confirmation card; each row above is the designer's to draw, and the
  change waits on them in its record
- **One new store block** - `VaultConfirmCaseCard` in `shared/ui/vault-case`,
  with its words in `vault.json`; no existing block changes, and no primitive
  or token is asked for
