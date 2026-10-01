# UI: Item register

No Figma frame and no canvas board draws any screen below but the request
wizard, whose first step is unchanged; the designer owes every other board
under Flags, and the change's record says so under `awaiting: ui-design`.
Until a board lands, each screen is the composition named here, drawn from
the console's and the store's existing blocks, and nothing below invents a
look: a state no block carries is flagged for the designer, never drawn
locally. [decisions.md](decisions.md) owns the scope, and the journeys
beside each delta own who walks it.

- **Where the views live** - Items, one item, its four dialogs and
  `OwnerField` in `packages/inventory/admin-frontend`; the Case tab's facts
  and the walk-in's lookup placed by `tech-design.md`; Prepare documents
  blocked on the Documents tab, and the valuation's slab line, in
  `packages/vault/admin-frontend`; the collector page's Items section a view
  of `packages/inventory/admin-frontend` on the page `apps/admin/grade10`
  holds; the erasure checklist's lines in
  `packages/grade10-auth/admin-frontend`; the wizard's categories in
  `packages/vault/frontend`; the custody agreement in
  `packages/vault/backend`
- **Stories** - one per view per distinct layout, `Inventory/Admin/Items/<View>`
  as the vault console names its own (`Vault/Admin/Cases/<View>`)
- **Copy** - console words are English, as on its other panels; the four
  category words are keys in
  `packages/i18n/messages/shared/<locale>/vault.json`; the agreement is in
  English

## Screens

| Screen | Board | Route | Composes |
| --- | --- | --- | --- |
| Items | none yet - the designer's | `admin.grade10.com/inventory/items` | new `ItemsPanel` → `SectionHeader`, `Search`, `Tabs`, `Tab`, `TabPanel`, `Table`, `Row`, `Cell`, `At`, `Status`, `StatusBadge`, `CursorPager`, `Notice`, `Link`, `Button` |
| One item | none yet | `admin.grade10.com/inventory/items/:itemId` | new `ItemPanel` → `SectionHeader`, `Panel`, `Figure`, `At`, `Badge`, `StatusBadge`, `Notice`, `Table`, `Row`, `Cell`, `Status`, `Text`, `Link`, `Button` |
| Register and edit | none yet | dialog from Items' header, and from one item | new `ItemFactsDialog` → `FormDialog`, `Select`, `TextField`, `NotesField`, `OwnerField`, `Text`, `Notice`, `Link` |
| Transfer | none yet | dialog from one item | new `TransferItemDialog` → `FormDialog`, `OwnerField`, `TextField`, `NotesField`, `ProofFilesField`, `Text`, `Button`, `Notice` |
| Retire | none yet | dialog from one item | new `RetireItemDialog` → `FormDialog` (`destructive`), `ChoiceList`, `Choice`, `Notice` |
| Close a mark | none yet | dialog from the place row on one item | `PromptDialog` |
| Case tab facts | none yet | `admin.grade10.com/vault/cases/:caseId`, the Case tab | `CaseDetailPanel`, new `ItemFactsSection` → `SectionHeader`, `Figure`, `Status`, `Notice`, `Button`, `Link`, and `ItemFactsDialog` |
| Valuation | none yet | `ValuationDialog` from `CaseFlowPanel`, on the Case tab | `ValuationDialog`, gaining a read-only `Text` line |
| Walk-in known slab | none yet | the walk-in dialog from the queue's header | `WalkInDialog` from `vault-walk-ins-and-owners`, gaining `Select`, `TextField`, `Text`, `Status`, `Notice`, `Button`, `Link` |
| Start valuation slab | none yet | the Start valuation act from `CaseFlowPanel`, on the Case tab | the act's dialog, gaining the walk-in's grader and cert fields and their lookup states |
| Documents tab | none yet | `admin.grade10.com/vault/cases/:caseId`, the Documents tab | `DocumentsPanel`, `WithheldActs` → `Text`, `Link` |
| Custody agreement | none yet | the paper, not a screen | `packages/vault/backend/src/documents/templates/custodyAgreement.ts`; no block |
| Collector page Items | none yet | `admin.grade10.com/vault/collectors/:userId` | `CollectorPage` from `vault-walk-ins-and-owners`, new `CollectorItemsSection` → `SectionHeader`, `Panel`, Items' table, `CursorPager`, `Status`, `Notice` |
| Erasure checklist | none yet | `admin.grade10.com/erasure` | `AccountErasureSection` → `Text` |
| Request wizard | the collector flow's wizard | `grade10.com/vault`, the wizard's first step | `RequestWizard` → `RadioList`, `RadioListItem`, unchanged |

## Components

### Console blocks - existing, `@grade10/frontend-console`

`SectionHeader`, `Panel`, `Search`, `Tabs`, `Tab`, `TabPanel`, `Table`,
`Row`, `Cell`, `At`, `Status`, `StatusBadge`, `CursorPager`, `Figure`,
`Badge`, `Notice`, `Link`, `Button`, `Text`, `FormDialog`, `PromptDialog`,
`Select`, `TextField`, `NotesField`, `ChoiceList`, `Choice`, `FilePicker`.
`FormDialog` carries `destructive`; `PromptDialog` carries a required
reason; `Notice` carries a retry `Button` in its `actions`. `ProofFilesField`
moves into `@grade10/frontend-console` from the auction's order dialogs, which
then import it from there, unchanged; it composes `FilePicker`. No store
block, primitive or token is new or changed.

### Store primitives - existing, `@grade10/design-system`

`RadioList`, `RadioListItem`, as the wizard's first step composes them.

### New in grade10 - work in the application

- **`ItemsPanel`** - the list, its search and its three tabs, in
  `packages/inventory/admin-frontend`
- **`ItemPanel`** - one item's facts, owner, places and moves
- **`ItemFactsDialog`** - register and edit, shared by Items, one item and
  the Case tab
- **`OwnerField`** - an exact-email `TextField` and an entity `ChoiceList`,
  used by Register and Transfer and never by Edit
- **`TransferItemDialog`**, **`RetireItemDialog`** - named apart from the
  vault's existing `MoveItemDialog`, which moves a locker, not an owner
- **`ItemFactsSection`** - the register's facts on the Case tab, placed by
  `tech-design.md`
- **The valuation's slab line** - grader, grade and cert on
  `ValuationDialog`
- **`CollectorItemsSection`** - Items' table narrowed to one owner, the
  owner column dropped, retired items left out and the place column reading
  marked or not; each section of the collector page reads and refuses on its
  own
- **The walk-in's slab fields** - grader and cert on `WalkInDialog`, its
  lookup placed by `tech-design.md`
- **Prepare documents blocked** on the Documents tab, and **the erasure
  checklist's `holds` lines**, one per marked item

### Words - work in `packages/i18n`

- **Four category words** - `comic`, `banknote`, `stamp` and `memorabilia`
  under `vault.category`, answered in `shared/` for en, ko, zh-Hans and
  zh-Hant
- **The category column** - the console's category column reads
  `vault.category`, as status words do

## States

### Every screen

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | `Status` pending | `grade10-admin-inventory-items-SC-59` |
| Failed | a `Notice` with the error and retry; a section that fails alone leaves the rest standing | `grade10-admin-inventory-items-SC-59` |
| Saving | `FormDialog` pending, its fields locked, the error in its footer | `grade10-admin-inventory-items-SC-15` |
| Narrow | `Table` scrolls in its wrapper, `SectionHeader` actions wrap, `FormDialog` scrolls its fields | **Out of suite:** the console blocks own it - `Table`, `SectionHeader` and `FormDialog` at phone width, stated in their `@grade10/frontend-console` stories, and walked by the console's narrow-width smoke |

### Owner cell

One cell, used by Items, one item and each move's from and to.

| State | Shows | Anchor |
| --- | --- | --- |
| Named | the owner's name, a click opening the collector page | `grade10-admin-inventory-items-SC-16` |
| Name unavailable | the short id and "name unavailable"; the row stands | `grade10-admin-inventory-items-SC-17` |
| Company | the custodian or the lender by its registered name | `grade10-admin-inventory-items-SC-18` |
| Erased | no owner, reading as erased | `grade10-admin-inventory-items-SC-64` |

### Items

| State | Shows | Anchor |
| --- | --- | --- |
| Marked | the default tab: marked items, with title, category, grader and cert, the owner cell and the place marking it, each row opening its item | `grade10-admin-inventory-items-SC-50` |
| Last edited | no column on the list; one item's page shows who edited it last and when, as Q42 reads | `grade10-admin-inventory-items-SC-12` |
| All | every item, marked or not | `grade10-admin-inventory-items-SC-51` |
| Retired | retired items and why each was retired | `grade10-admin-inventory-items-SC-51` |
| Search | one `Search` field reading the owner's exact email, an item id, a grader and cert, else a title or description | `grade10-admin-inventory-items-SC-54` |
| Search past the tab | a search lists every item whatever tab is open; a retired match carries a retired `Badge` | `grade10-admin-inventory-items-SC-71` |
| Paged | `CursorPager` under the rows | `grade10-admin-inventory-items-SC-56` |
| None in a tab | `Status` empty, naming the tab | `grade10-admin-inventory-items-SC-55` |
| No match | `Status` empty, naming the search and a way to clear it | `grade10-admin-inventory-items-SC-55` |
| Forbidden | names `inventory:read` | `grade10-admin-inventory-items-SC-58` |
| Register | Register an item in the header, for `inventory:write` only | `grade10-admin-inventory-items-SC-14` |

### One item

| State | Shows | Anchor |
| --- | --- | --- |
| Header | `SectionHeader`, its `back` returning to Items | `grade10-admin-inventory-items-SC-50` |
| Facts | category, title, description, grader, grade, cert, the owner cell, and who edited it last and when | `grade10-admin-inventory-items-SC-12` |
| Marked | the place row: the vault, its case reference and the case's status as a `StatusBadge`, linking the case | `grade10-admin-inventory-items-SC-25` |
| Two places | one place row per open mark, each naming its own case | `grade10-admin-inventory-items-SC-21` |
| Status unavailable | the place row names the vault and the case reference, its status reading unavailable | `grade10-admin-inventory-items-SC-26` |
| Closed by the vault | the place row reads closed by the vault on its day, with no reason | `grade10-admin-inventory-items-SC-23` |
| Slab the vault named | a `Notice` naming the grader, grade and cert the vault named, `Link` in its `actions` to the item that holds them | `grade10-admin-inventory-items-SC-22` |
| Transfer and Retire not offered | Transfer and Retire are not offered; a line names the vault and the case | `grade10-admin-inventory-items-SC-40` |
| Not marked | Transfer and Retire offered | `grade10-admin-inventory-items-SC-24` |
| Owners disagree | a warning `Notice` showing the vault's owner and the register's | `grade10-admin-inventory-items-SC-27` |
| Owners settled | once the mark closes, the register's owner and no warning | `grade10-admin-inventory-items-SC-70` |
| Moves | a `Table` of each move: from and to as owner cells, who, when, why, and the proof as a download | `grade10-admin-inventory-items-SC-33` |
| No proof | the proof cell reads that none was given | `grade10-admin-inventory-items-SC-34` |
| Proof removed | "proof removed" in the proof cell | `grade10-admin-inventory-items-SC-65` |
| No moves | the moves section says the item has not changed owner | `grade10-admin-inventory-items-SC-38` |
| Forfeit move | the move reads from the collector to the lender, made by the vault on that case | `grade10-admin-inventory-items-SC-42` |
| Without `inventory:transfer` | no Transfer, and no proof to open | `grade10-admin-inventory-items-SC-45` |
| Read-only | without `inventory:write`, no Register, Edit, Retire, Restore or Close mark | `grade10-admin-inventory-items-SC-14` |
| Mark left open | Close mark on the place row, for `inventory:write` only | `grade10-admin-inventory-items-SC-28` |
| Still held | no Close mark on the place row while the vault holds the item | `grade10-admin-inventory-items-SC-29` |
| Closed by hand | the place row names who closed it, when and why | `grade10-admin-inventory-items-SC-28` |
| Retired | reads only, with the reason and when; no Edit, Transfer or Retire | `grade10-admin-inventory-items-SC-46` |
| Restore offered | Restore on a retired item, for `inventory:write` only, on `PromptDialog` with a required reason | `grade10-admin-inventory-items-SC-48` |
| Restored | the item reads live with its facts and history | `grade10-admin-inventory-items-SC-48` |
| Restore refused | an error `Notice` in the dialog naming the live item that holds the grader and cert, `Link` in its `actions` | `grade10-admin-inventory-items-SC-49` |
| Erased owner | the owner cell reads as erased and the title reads as erased; Transfer still offered | `grade10-admin-inventory-items-SC-64` |
| Not found | no item has that id | `grade10-admin-inventory-items-SC-57` |
| Forbidden | names `inventory:read` | `grade10-admin-inventory-items-SC-58` |

### Register and edit

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | category, title, description, grader, and the owner in `OwnerField`; Register disabled | `grade10-admin-inventory-items-SC-10` |
| No grader | grade and cert hidden; clearing the grader clears both | `grade10-admin-inventory-items-SC-02` |
| Grader chosen | grade and cert shown | `grade10-admin-inventory-items-SC-02` |
| Grader not listed | the Description field's `description` says the description prints on the custody agreement, and that a grader not listed, its grade and cert go in it | `grade10-admin-inventory-items-SC-03`, `grade10-site-vault-documents-and-signing-SC-32` |
| Too long | the title's (200) or the description's (2,000) refusal | `grade10-admin-inventory-items-SC-04` |
| Edit | the owner read-only, as a `Text` line; the owner changes only through Transfer | `grade10-admin-inventory-items-SC-13` |
| Cert taken | a `Notice` in the dialog's body, `Link` in its `actions`: this grader and cert are already on <title> | `grade10-admin-inventory-items-SC-07` |
| Registered | the new item opens on its own page | `grade10-admin-inventory-items-SC-10` |
| Edited | the item's page shows the new facts and its last edit | `grade10-admin-inventory-items-SC-12` |

### Owner field

Used by Register and Transfer, never by Edit.

| State | Shows | Anchor |
| --- | --- | --- |
| Account | a `TextField` taking the exact email | `grade10-admin-inventory-items-SC-10` |
| Found | the account's name as the field's `description` | `grade10-admin-inventory-items-SC-10` |
| Not found | no account has that email; the dialog's act stays disabled | `grade10-admin-inventory-items-SC-11` |
| Name unavailable | the short id and "name unavailable"; the dialog's act enabled | `grade10-admin-inventory-items-SC-69` |
| Entity on Register | the custodian only, chosen in a `ChoiceList`; never the lender, which only a forfeit reaches (Q14, Q28) | `grade10-admin-inventory-items-SC-19` |
| Entity on Transfer | the custodian only, never the lender | `grade10-admin-inventory-items-SC-19` |

### Transfer

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | the new owner, a reason and an optional proof; Transfer disabled until the owner and a reason are given | `grade10-admin-inventory-items-SC-35` |
| Present owner | Transfer disabled while the new owner named is the present one; a same-owner refusal after a resend reads as moved | `grade10-admin-inventory-items-SC-75` |
| Erased owner | a required title `TextField`; Transfer disabled until it is given | `grade10-admin-inventory-items-SC-73` |
| Proof picked | the file's name in a `Text` line with a Remove `Button`, under the picker | `grade10-admin-inventory-items-SC-36` |
| Proof refused | the refusal under the picker: up to 5 PDF, PNG or JPG files, each at most 10 MB | `grade10-admin-inventory-items-SC-36` |
| Refused while marked | an error `Notice` naming the place, when a mark landed after the page opened | `grade10-admin-inventory-items-SC-41` |
| Moved | the item's page shows the new owner and the move at the top of its moves | `grade10-admin-inventory-items-SC-33` |

### Retire

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | four reasons - duplicate, lost, destroyed, left the platform - and a destructive Retire, disabled until one is chosen | `grade10-admin-inventory-items-SC-46` |
| Refused while marked | an error `Notice` naming the place, when a mark landed after the page opened | `grade10-admin-inventory-items-SC-47` |
| Retired | the item's page reads as retired | `grade10-admin-inventory-items-SC-46` |

### Close a mark

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | a required reason; Close mark disabled until one is typed | `grade10-admin-inventory-items-SC-28` |
| Closed | the place row reads as closed by hand; the item reads as not marked unless another place marks it | `grade10-admin-inventory-items-SC-28` |

### Case tab facts

| State | Shows | Anchor |
| --- | --- | --- |
| Registration pending | the section says the item is registered when the valuation starts | `grade10-admin-vault-operator-queue-SC-55` |
| Facts shown | the register's category, title, description, grader, grade and cert in place of the request's, linking the item; the collector's request stays as they sent it | `grade10-admin-vault-operator-queue-SC-56` |
| Editable | Edit opens `ItemFactsDialog`, with its own states, for `inventory:write` | `grade10-admin-vault-operator-queue-SC-57` |
| Read-only | the facts without Edit, for a `vault:read` holder without `inventory:write` | `grade10-admin-vault-operator-queue-SC-57` |
| Forbidden | names `inventory:read` and shows no facts, for a `vault:read` holder without it, as the treasurer is; the rest of the tab stands | `grade10-admin-vault-operator-queue-SC-66` |
| Register unreachable | this section's own error with retry; the rest of the tab stands | `grade10-admin-vault-operator-queue-SC-58` |

### Valuation

| State | Shows | Anchor |
| --- | --- | --- |
| Graded | a read-only `Text` line of grader, grade and cert above "Valued at"; corrections go through the Case tab's Edit | `grade10-site-vault-valuation-and-offer-SC-33` |
| No grader | no line | `grade10-site-vault-valuation-and-offer-SC-34` |

### Walk-in known slab

| State | Shows | Anchor |
| --- | --- | --- |
| Slab fields | grader, grade and cert, added to the walk-in form by this change, all three or none | `grade10-admin-vault-operator-queue-SC-60` |
| Looking up | pending | `grade10-admin-vault-operator-queue-SC-59` |
| Register unreachable | an error with retry; the form keeps what was typed | `grade10-admin-vault-operator-queue-SC-64` |
| Found | the register's facts, read-only, corrected on the Case tab; the form fills category and title from them; the case takes that item, and the customer's edits to the draft touch only its photos and description | `grade10-admin-vault-operator-queue-SC-59` |
| Not found | nothing filled; the item is registered when the valuation starts | `grade10-admin-vault-operator-queue-SC-60` |
| Retired cert | reads as retired | `grade10-admin-vault-operator-queue-SC-61` |
| Another owner | found, filling nothing; the owner by name for `kyc:read`, else by short id; Prepare documents is blocked later | `grade10-admin-vault-operator-queue-SC-62` |
| Marked by another case | a `Notice` in the dialog's body, `Link` in its `actions`: refused, naming and linking the case; that mark is closed first | `grade10-admin-vault-operator-queue-SC-63` |

### Start valuation slab

| State | Shows | Anchor |
| --- | --- | --- |
| Slab fields | grader, grade and cert, offered when the case has named no slab, with the walk-in's lookup states | `grade10-admin-vault-operator-queue-SC-65` |
| Found | the register's facts, read-only; the case takes that item rather than registering a second, and the request stays as sent | `grade10-admin-vault-operator-queue-SC-65` |

### Documents tab

| State | Shows | Anchor |
| --- | --- | --- |
| Another owner | Prepare documents is not offered; a line names the owner the register shows, by name for `kyc:read`, else by short id, and links the item, where staff can transfer it | `grade10-site-vault-case-lifecycle-SC-46` |
| Refused at Prepare | an error naming the owner the register now shows the same way, linking the item | `grade10-site-vault-case-lifecycle-SC-47` |
| Register pending | an error saying the item is still being registered | `grade10-site-vault-case-lifecycle-SC-49` |
| Register unreachable | an error saying the register cannot be read now | `grade10-site-vault-case-lifecycle-SC-48` |

### Custody agreement

| State | Shows | Anchor |
| --- | --- | --- |
| Item | the register's category, title and description as the item, as the register held them when the packet was prepared | `grade10-site-vault-documents-and-signing-SC-32` |
| Graded | grader, grade and certificate number beside the item, as the register held them when the packet was prepared | `grade10-site-vault-documents-and-signing-SC-33` |
| No grader | nothing printed for grader, grade or certificate number | `grade10-site-vault-documents-and-signing-SC-34` |

### Collector page Items

| State | Shows | Anchor |
| --- | --- | --- |
| Items | title, category, grader and cert, marked or not, each row opening its item; paged | `grade10-admin-inventory-items-SC-60` |
| Retired items | left out; one item's page keeps their history | `grade10-admin-inventory-items-SC-60` |
| None | the collector owns no item | `grade10-admin-inventory-items-SC-61` |
| Forbidden | the section names `inventory:read`, which a treasurer does not hold; the others stand | `grade10-admin-inventory-items-SC-62` |
| Failed | the section's own error with retry; the others stand | `grade10-admin-inventory-items-SC-62` |

### Erasure checklist

| State | Shows | Anchor |
| --- | --- | --- |
| Marked | a plain `holds` line per marked item: its id and the vault and case | `grade10-admin-inventory-items-SC-63` |

### Request wizard

| State | Shows | Anchor |
| --- | --- | --- |
| Ten categories | the register's ten on the first step, each in the collector's language | `grade10-site-vault-case-intake-SC-32` |

## Flags

- ❓ **Every board is missing** - the designer's: Items, one item, register
  and edit, transfer, retire and close-a-mark, the Case tab's facts, the
  valuation's slab line, the walk-in's and Start valuation's slab fields, Prepare documents
  blocked, the collector page's Items section and the erasure checklist's
  lines; the change waits on them in its record
- Q41 **Where Items sits in the nav** - a detail page of Inventory, reached
  from its header; the designer may still draw a nav entry of its own
- ❓ **The search hint** - the designer's: `Search` has no description
  slot, so the hint can only be the placeholder, which goes once staff type
- ❓ **When the walk-in lookup runs** - the designer's
