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
| Transfer | none yet | dialog from one item | new `TransferItemDialog` → `FormDialog`, `OwnerField`, `NotesField`, `FilePicker`, `Text`, `Button`, `Notice`; the proof drawn as the auction's `ProofFilesField` composes it |
| Retire | none yet | dialog from one item | new `RetireItemDialog` → `FormDialog` (`destructive`), `ChoiceList`, `Choice`, `Notice` |
| Close a mark | none yet | dialog from the place row on one item | `PromptDialog` |
| Case tab facts | none yet | `admin.grade10.com/vault/cases/:caseId`, the Case tab | `CaseDetailPanel`, new `ItemFactsSection` → `SectionHeader`, `Figure`, `Status`, `Notice`, `Button`, `Link`, and `ItemFactsDialog` |
| Valuation | none yet | `ValuationDialog` from `CaseFlowPanel`, on the Case tab | `ValuationDialog`, gaining a read-only `Text` line |
| Walk-in known slab | none yet | the walk-in dialog from the queue's header | `WalkInDialog` from `vault-walk-ins-and-owners`, gaining `Select`, `TextField`, `Text`, `Status`, `Notice`, `Button`, `Link` |
| Documents tab | none yet | `admin.grade10.com/vault/cases/:caseId`, the Documents tab | `DocumentsPanel`, `WithheldActs` → `Text`, `Link` |
| Custody agreement | none yet | the paper, not a screen | `packages/vault/backend/src/documents/templates/custodyAgreement.ts`; no block |
| Collector page Items | none yet | `admin.grade10.com/collectors/:userId` | `CollectorPage` from `vault-walk-ins-and-owners`, new `CollectorItemsSection` → `SectionHeader`, `Panel`, Items' table, `CursorPager`, `Status`, `Notice` |
| Erasure checklist | none yet | `admin.grade10.com/erasure` | `AccountErasureSection` → `Text` |
| Request wizard | the collector flow's wizard | `grade10.com/vault`, the wizard's first step | `RequestWizard` → `RadioList`, `RadioListItem`, unchanged |

## Components

### Console blocks - existing, `@grade10/frontend-console`

`SectionHeader`, `Panel`, `Search`, `Tabs`, `Tab`, `TabPanel`, `Table`,
`Row`, `Cell`, `At`, `Status`, `StatusBadge`, `CursorPager`, `Figure`,
`Badge`, `Notice`, `Link`, `Button`, `Text`, `FormDialog`, `PromptDialog`,
`Select`, `TextField`, `NotesField`, `ChoiceList`, `Choice`, `FilePicker`.
`FormDialog` carries `destructive`; `PromptDialog` carries a required
reason; `Notice` carries a retry `Button` in its `actions`. No store block,
primitive or token is new or changed.

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
| Loading | `Status` pending | `grade10-admin-inventory-items-US-01` |
| Failed | a `Notice` with the error and retry; a section that fails alone leaves the rest standing | `grade10-admin-inventory-items-US-01` |
| Saving | `FormDialog` pending, its fields locked, the error in its footer | `grade10-admin-inventory-items-US-02` |
| Narrow | `Table` scrolls in its wrapper, `SectionHeader` actions wrap, `FormDialog` scrolls its fields | `grade10-admin-inventory-items-US-01` |

### Owner cell

One cell, used by Items, one item and each move's from and to.

| State | Shows | Anchor |
| --- | --- | --- |
| Named | the owner's name, a click opening the collector page | `grade10-admin-inventory-items-US-01` |
| Name unavailable | the short id and "name unavailable"; the row stands | `grade10-admin-inventory-items-US-01` |
| Company | the custodian or the lender by its registered name | `grade10-admin-inventory-items-US-01` |
| Erased | no owner, reading as erased | `grade10-admin-inventory-items-US-08` |

### Items

| State | Shows | Anchor |
| --- | --- | --- |
| Marked | the default tab: marked items, with title, category, grader and cert, the owner cell and the place marking it, each row opening its item | `grade10-admin-inventory-items-US-01` |
| Last edited | ❓ Q42: a column on the list as well as on one item | `grade10-admin-inventory-items-US-01` |
| All | every item, marked or not | `grade10-admin-inventory-items-US-01` |
| Retired | retired items and why each was retired | `grade10-admin-inventory-items-US-05` |
| Search | one `Search` field reading the owner's exact email, an item id, a grader and cert, else a title | `grade10-admin-inventory-items-US-01` |
| Paged | `CursorPager` under the rows | `grade10-admin-inventory-items-US-01` |
| None in a tab | `Status` empty, naming the tab | `grade10-admin-inventory-items-US-01` |
| No match | `Status` empty, naming the search and a way to clear it | `grade10-admin-inventory-items-US-01` |
| Forbidden | names `inventory:read` | `grade10-admin-inventory-items-US-01` |
| Register | Register an item in the header, for `inventory:write` only | `grade10-admin-inventory-items-US-02` |

### One item

| State | Shows | Anchor |
| --- | --- | --- |
| Header | `SectionHeader`, its `back` returning to Items | `grade10-admin-inventory-items-US-01` |
| Facts | category, title, description, grader, grade, cert, the owner cell, and who edited it last and when | `grade10-admin-inventory-items-US-01` |
| Marked | the place row: the vault, its case reference and the case's status as a `StatusBadge`, linking the case | `grade10-admin-inventory-items-US-01` |
| Transfer and Retire not offered | Transfer and Retire are not offered; a line names the vault and the case | `grade10-admin-inventory-items-US-04` |
| Not marked | Transfer and Retire offered | `grade10-admin-inventory-items-US-03` |
| Owners disagree | a warning `Notice` showing the vault's owner and the register's | `grade10-admin-inventory-items-US-01` |
| Moves | a `Table` of each move: from and to as owner cells, who, when, why, and the proof as a download | `grade10-admin-inventory-items-US-03` |
| No proof | the proof cell reads that none was given | `grade10-admin-inventory-items-US-03` |
| Proof removed | "proof removed" in the proof cell | `grade10-admin-inventory-items-US-08` |
| No moves | the moves section says the item has not changed owner | `grade10-admin-inventory-items-US-03` |
| Without `inventory:transfer` | no Transfer, and no proof to open | `grade10-admin-inventory-items-US-03` |
| Read-only | without `inventory:write`, no Register, Edit, Retire or Close mark | `grade10-admin-inventory-items-US-02` |
| Mark left open | Close mark on the place row, for `inventory:write` only | `grade10-admin-inventory-items-US-06` |
| Closed by hand | the place row names who closed it, when and why | `grade10-admin-inventory-items-US-06` |
| Retired | final and read-only, with the reason and when; no Edit, Transfer or Retire | `grade10-admin-inventory-items-US-05` |
| Erased owner | the owner cell reads as erased and the title reads as erased; Transfer still offered | `grade10-admin-inventory-items-US-08` |
| Not found | no item has that id | `grade10-admin-inventory-items-US-01` |
| Forbidden | names `inventory:read` | `grade10-admin-inventory-items-US-01` |

### Register and edit

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | category, title, description, grader, and the owner in `OwnerField`; Register disabled | `grade10-admin-inventory-items-US-02` |
| No grader | grade and cert hidden; clearing the grader clears both | `grade10-admin-inventory-items-US-02` |
| Grader chosen | grade and cert shown | `grade10-admin-inventory-items-US-02` |
| Grader not listed | the Description field's `description` says a grader not listed, its grade and cert go in the description | `grade10-admin-inventory-items-US-02` |
| Too long | the title's (200) or the description's (2,000) refusal | `grade10-admin-inventory-items-US-02` |
| Edit | the owner read-only, as a `Text` line; the owner changes only through Transfer | `grade10-admin-inventory-items-US-02` |
| Cert taken | a `Notice` in the dialog's body, `Link` in its `actions`: this grader and cert are already on <title> | `grade10-admin-inventory-items-US-02` |
| Registered | the new item opens on its own page | `grade10-admin-inventory-items-US-02` |
| Edited | the item's page shows the new facts and its last edit | `grade10-admin-inventory-items-US-02` |

### Owner field

Used by Register and Transfer, never by Edit.

| State | Shows | Anchor |
| --- | --- | --- |
| Account | a `TextField` taking the exact email | `grade10-admin-inventory-items-US-02` |
| Found | the account's name as the field's `description` | `grade10-admin-inventory-items-US-02` |
| Not found | no account has that email; the dialog's act stays disabled | `grade10-admin-inventory-items-US-02` |
| Name unavailable | the short id and "name unavailable"; the dialog's act enabled | `grade10-admin-inventory-items-US-02` |
| Entity on Register | the custodian or the lender, chosen in a `ChoiceList` | `grade10-admin-inventory-items-US-02` |
| Entity on Transfer | the custodian only, never the lender | `grade10-admin-inventory-items-US-03` |

### Transfer

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | the new owner, a reason and an optional proof; Transfer disabled until the owner and a reason are given | `grade10-admin-inventory-items-US-03` |
| Proof picked | the file's name in a `Text` line with a Remove `Button`, under the picker | `grade10-admin-inventory-items-US-03` |
| Proof refused | the refusal under the picker: one PDF, PNG, JPG, HEIC or HEIF file, at most 5 MB | `grade10-admin-inventory-items-US-03` |
| Refused while marked | an error `Notice` naming the place, when a mark landed after the page opened | `grade10-admin-inventory-items-US-04` |
| Moved | the item's page shows the new owner and the move at the top of its moves | `grade10-admin-inventory-items-US-03` |

### Retire

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | four reasons - duplicate, lost, destroyed, left the platform - and a destructive Retire, disabled until one is chosen | `grade10-admin-inventory-items-US-05` |
| Refused while marked | an error `Notice` naming the place, when a mark landed after the page opened | `grade10-admin-inventory-items-US-05` |
| Retired | the item's page reads as retired | `grade10-admin-inventory-items-US-05` |

### Close a mark

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | a required reason; Close mark disabled until one is typed | `grade10-admin-inventory-items-US-06` |
| Closed | the place row reads as closed by hand; the item reads as not marked unless another place marks it | `grade10-admin-inventory-items-US-06` |

### Case tab facts

| State | Shows | Anchor |
| --- | --- | --- |
| Registration pending | the section says the item is registered when the valuation starts | `grade10-admin-vault-operator-queue-US-21` |
| Facts shown | the register's category, title, description, grader, grade and cert in place of the request's, linking the item; the collector's request stays as they sent it | `grade10-admin-vault-operator-queue-US-21` |
| Editable | Edit opens `ItemFactsDialog`, with its own states, for `inventory:write` | `grade10-admin-vault-operator-queue-US-21` |
| Read-only | the facts without Edit, for a `vault:read` holder without `inventory:write` | `grade10-admin-vault-operator-queue-US-21` |
| Register unreachable | this section's own error with retry; the rest of the tab stands | `grade10-admin-vault-operator-queue-US-21` |

### Valuation

| State | Shows | Anchor |
| --- | --- | --- |
| Graded | a read-only `Text` line of grader, grade and cert above "Valued at"; corrections go through the Case tab's Edit | `grade10-site-vault-valuation-and-offer-US-06` |
| No grader | no line | `grade10-site-vault-valuation-and-offer-US-06` |

### Walk-in known slab

| State | Shows | Anchor |
| --- | --- | --- |
| Slab fields | grader and cert, added to the walk-in form by this change | `grade10-admin-vault-operator-queue-US-20` |
| Looking up | pending | `grade10-admin-vault-operator-queue-US-20` |
| Register unreachable | an error with retry; the form keeps what was typed | `grade10-admin-vault-operator-queue-US-20` |
| Found | the register's facts, read-only, corrected on the Case tab; the case takes that item, and the customer's edits to the draft touch only its photos and description | `grade10-admin-vault-operator-queue-US-20` |
| Not found | nothing filled; the item is registered when the valuation starts | `grade10-admin-vault-operator-queue-US-20` |
| Retired cert | reads as not found | `grade10-admin-vault-operator-queue-US-20` |
| Another owner | found, naming its owner; Prepare documents is blocked later | `grade10-admin-vault-operator-queue-US-20` |
| Marked by another case | a `Notice` in the dialog's body, `Link` in its `actions`: refused, naming and linking the case; that mark is closed first | `grade10-admin-vault-operator-queue-US-20` |

### Documents tab

| State | Shows | Anchor |
| --- | --- | --- |
| Another owner | Prepare documents is not offered; a line names the owner the register shows and links the item, where staff can transfer it | `grade10-site-vault-case-lifecycle-US-03` |
| Refused at Prepare | an error naming the owner the register now shows, linking the item | `grade10-site-vault-case-lifecycle-US-03` |

### Custody agreement

| State | Shows | Anchor |
| --- | --- | --- |
| Item | the register's category, title and description as the item, as the register held them when the packet was prepared | `grade10-site-vault-documents-and-signing-US-06` |
| Graded | grader, grade and certificate number beside the item, as the register held them when the packet was prepared | `grade10-site-vault-documents-and-signing-US-06` |
| No grader | nothing printed for grader, grade or certificate number | `grade10-site-vault-documents-and-signing-US-06` |

### Collector page Items

| State | Shows | Anchor |
| --- | --- | --- |
| Items | title, category, grader and cert, marked or not, each row opening its item; paged | `grade10-admin-inventory-items-US-07` |
| Retired items | left out; one item's page keeps their history | `grade10-admin-inventory-items-US-07` |
| None | the collector owns no item | `grade10-admin-inventory-items-US-07` |
| Forbidden | the section names `inventory:read`, which a treasurer does not hold; the others stand | `grade10-admin-inventory-items-US-07` |
| Failed | the section's own error with retry; the others stand | `grade10-admin-inventory-items-US-07` |

### Erasure checklist

| State | Shows | Anchor |
| --- | --- | --- |
| Marked | a plain `holds` line per marked item: its id and the vault and case | `grade10-admin-inventory-items-US-08` |

### Request wizard

| State | Shows | Anchor |
| --- | --- | --- |
| Ten categories | the register's ten on the first step, each in the collector's language | `grade10-site-vault-case-intake-US-01` |

## Flags

- ❓ **Every board is missing** - the designer's: Items, one item, register
  and edit, transfer, retire and close-a-mark, the Case tab's facts, the
  valuation's slab line, the walk-in's slab fields, Prepare documents
  blocked, the collector page's Items section and the erasure checklist's
  lines; the change waits on them in its record
- ❓ Q41 **Where Items sits in the nav** - the designer's: recommended a
  detail page of Inventory, as every `/inventory/*` page is today
- ❓ **The search hint** - the designer's: `Search` has no description
  slot, so the hint can only be the placeholder, which goes once staff type
- ❓ **When the walk-in lookup runs** - the designer's
