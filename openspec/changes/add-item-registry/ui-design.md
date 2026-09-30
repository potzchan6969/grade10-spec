# UI: Item register

No Figma frame and no canvas board draws any screen below yet; the designer
owes every board under Flags, and the change's record says so under
`awaiting: ui-design`. Until a board lands, each screen is the composition
named here, drawn from the console's and the store's existing blocks, and
nothing below invents a look: a state no block carries is flagged for the
designer, never drawn locally. [decisions.md](decisions.md) owns the scope,
and the journeys beside each delta own who walks it.

- **Where the views live** - Items, one item and its four dialogs in
  `packages/inventory/admin-frontend`; the Case tab's facts, the walk-in's
  slab fields and the Documents tab's guard in
  `packages/vault/admin-frontend`; the collector page's Items section a view
  of `packages/inventory/admin-frontend` on the page `apps/admin/grade10`
  holds; the erasure checklist's line in
  `packages/grade10-auth/admin-frontend`; the wizard's categories in
  `packages/vault/frontend`; the custody agreement in
  `packages/vault/backend`
- **Stories** - one per view per distinct layout, `Inventory/Admin/Items/<View>`
  as the vault console names its own (`Vault/Admin/Cases/<View>`)
- **Copy** - the console's words stay the console's own English, as its
  panels carry them; the four new category words are keys in
  `packages/i18n/messages/shared/<locale>/vault.json`; the agreement's words
  are English, as the paper's are

## Screens

| Screen | Board | Route | Composes |
| --- | --- | --- | --- |
| Items | none yet - the designer's | `admin.grade10.com/inventory/items` | new `ItemsPanel` → `SectionHeader`, `Search`, `Tabs`, `Tab`, `TabPanel`, `Table`, `Row`, `Cell`, `At`, `Status`, `StatusBadge`, `CursorPager`, `Notice`, `Link`, `Button` |
| One item | none yet | `admin.grade10.com/inventory/items/:itemId` | new `ItemPanel` → `SectionHeader`, `Panel`, `Figure`, `At`, `Badge`, `Notice`, `Table`, `Row`, `Cell`, `Status`, `Link`, `Button` |
| Register and edit | none yet | dialog from Items' header, and from one item | new `ItemFactsDialog` → `FormDialog`, `Select`, `TextField`, `NotesField`, `ChoiceList`, `Choice`, `Text`, `Notice`, `Link` |
| Transfer | none yet | dialog from one item | new `TransferItemDialog` → `FormDialog`, `ChoiceList`, `Choice`, `TextField`, `NotesField`, `FilePicker`, `Text`, `Notice` |
| Retire | none yet | dialog from one item | new `RetireItemDialog` → `FormDialog` (`destructive`), `ChoiceList`, `Choice`, `Notice` |
| Close a hold | none yet | dialog from the place row on one item | `PromptDialog` |
| Case tab facts | none yet | `admin.grade10.com/vault/cases/:caseId`, the Case tab | `CaseDetailPanel`, new `ItemFactsSection` → `SectionHeader`, `Figure`, `Status`, `Notice`, `Button`, `Link`, and `ItemFactsDialog` |
| Walk-in known slab | none yet | the walk-in dialog from the queue's header | `WalkInDialog` from `vault-walk-ins-and-owners`, gaining `Select`, `TextField`, `Notice`, `Link` |
| Documents tab | none yet | `admin.grade10.com/vault/cases/:caseId`, the Documents tab | `DocumentsPanel` → `Notice`, `Link`, `Button` |
| Custody agreement | none yet | the paper, not a screen | `packages/vault/backend/src/documents/templates/custodyAgreement.ts`; no block |
| Collector page Items | none yet | `admin.grade10.com/collectors/:userId` | `CollectorPage` from `vault-walk-ins-and-owners`, new `CollectorItemsSection` → `SectionHeader`, `Panel`, `Table`, `Row`, `Cell`, `At`, `Badge`, `Status`, `CursorPager`, `Notice`, `Link`, `Button` |
| Erasure checklist | none yet | `admin.grade10.com/erasure` | `AccountErasureSection` → `Text`, `Link` |
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
- **`TransferItemDialog`**, **`RetireItemDialog`** - named apart from the
  vault's existing `MoveItemDialog`, which moves a locker, not an owner
- **`ItemFactsSection`** - the register's facts on the Case tab, in
  `packages/vault/admin-frontend`
- **`CollectorItemsSection`** - the Items section, each section of the
  collector page reading and refusing on its own
- **The walk-in's slab fields** - grader and cert on `WalkInDialog`
- **The Documents tab's guard** and **the erasure checklist's link**

### Words - work in `packages/i18n`

- **Four category words** - `comic`, `banknote`, `stamp` and `memorabilia`
  under `vault.category`, answered in `shared/` for en, ko, zh-Hans and
  zh-Hant

## States

### Items

| State | Shows | Anchor |
| --- | --- | --- |
| Held | the default tab: held items, with title, category, grader and cert, owner, the place holding it, last edited | `grade10-admin-inventory-items-US-01` |
| All | every item, held or not | `grade10-admin-inventory-items-US-01` |
| Retired | retired items and why each was retired | `grade10-admin-inventory-items-US-05` |
| Owner named | the owner's name, a click opening the collector page | `grade10-admin-inventory-items-US-01` |
| Name unavailable | the short id and "name unavailable"; the row stands | `grade10-admin-inventory-items-US-01` |
| Company owner | the custodian or the lender by its registered name | `grade10-admin-inventory-items-US-01` |
| Search | one `Search` field; its hint says what it reads: an email, an item id, a grader and cert, else a title | `grade10-admin-inventory-items-US-01` |
| Paged | `CursorPager` under the rows | `grade10-admin-inventory-items-US-01` |
| Loading | `Status` pending | `grade10-admin-inventory-items-US-01` |
| None in a tab | `Status` empty, naming the tab | `grade10-admin-inventory-items-US-01` |
| No match | `Status` empty, naming the search and a way to clear it | `grade10-admin-inventory-items-US-01` |
| Failed | a `Notice` with the error and retry | `grade10-admin-inventory-items-US-01` |
| Narrow | the table scrolls sideways in its own wrapper; search and tabs stack above it | `grade10-admin-inventory-items-US-01` |
| Register | Register an item in the header, for `inventory:write` only | `grade10-admin-inventory-items-US-02` |

### One item

| State | Shows | Anchor |
| --- | --- | --- |
| Facts | category, title, description, grader, grade, cert, the owner, and who edited it last and when | `grade10-admin-inventory-items-US-01` |
| Held | the place row: the vault, its case reference and status, linking the case | `grade10-admin-inventory-items-US-01` |
| Transfer and Retire withheld | both acts withheld in words, naming the place that holds the item | `grade10-admin-inventory-items-US-04` |
| Not held | Transfer and Retire offered | `grade10-admin-inventory-items-US-03` |
| Owners disagree | a warning `Notice` showing the vault's owner and the register's | `grade10-admin-inventory-items-US-01` |
| Moves | a `Table` of each move: from, to, who, when, why, and the proof as a download | `grade10-admin-inventory-items-US-03` |
| Proof removed | "proof removed" in the proof cell | `grade10-admin-inventory-items-US-08` |
| No moves | the moves section says the item has not changed owner | `grade10-admin-inventory-items-US-03` |
| Without `inventory:transfer` | no Transfer, and no proof to open | `grade10-admin-inventory-items-US-03` |
| Hold left open | Close the hold on the place row, for `inventory:write` only | `grade10-admin-inventory-items-US-06` |
| Closed by hand | the place row names who closed it, when and why | `grade10-admin-inventory-items-US-06` |
| Retired | ❓ awaiting the owner (Q40): read-only, with the reason and when; no Edit, Transfer or Retire | `grade10-admin-inventory-items-US-05` |
| Erased owner | no owner and the title reading as erased; Transfer still offered | `grade10-admin-inventory-items-US-08` |
| Loading | `Status` pending | `grade10-admin-inventory-items-US-01` |
| Not found | nobody answers to that item id | `grade10-admin-inventory-items-US-01` |
| Failed | a `Notice` with the error and retry | `grade10-admin-inventory-items-US-01` |

### Register and edit

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | category, title, description, grader, and the owner; Register disabled | `grade10-admin-inventory-items-US-02` |
| No grader | grade and cert off | `grade10-admin-inventory-items-US-02` |
| Grader chosen | grade and cert on | `grade10-admin-inventory-items-US-02` |
| Owner an account | a `TextField` taking the exact email | `grade10-admin-inventory-items-US-02` |
| Account found | the account's name under the field | `grade10-admin-inventory-items-US-02` |
| Account not found | no account answers to that email; Register stays disabled | `grade10-admin-inventory-items-US-02` |
| Account, name unavailable | the short id and "name unavailable"; Register offered | `grade10-admin-inventory-items-US-02` |
| Owner an entity | the custodian or the lender, chosen in a `ChoiceList` | `grade10-admin-inventory-items-US-02` |
| Cert taken | an error `Notice` naming the item that grader and cert already name, linking it | `grade10-admin-inventory-items-US-02` |
| Saving | Register or Save pending; the form held | `grade10-admin-inventory-items-US-02` |
| Registered | the new item opens on its own page | `grade10-admin-inventory-items-US-02` |
| Edited | the item's page shows the new facts and its last edit | `grade10-admin-inventory-items-US-02` |

### Transfer

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | the new owner (an account or the custodian), a reason, a proof; Transfer disabled | `grade10-admin-inventory-items-US-03` |
| Account found | the account's name under the exact-email field | `grade10-admin-inventory-items-US-03` |
| Account not found | no account answers to that email; Transfer stays disabled | `grade10-admin-inventory-items-US-03` |
| Proof picked | the file's name under the picker | `grade10-admin-inventory-items-US-03` |
| Proof refused | the refusal under the picker: one PDF, PNG, JPG, HEIC or HEIF file, at most 5 MB | `grade10-admin-inventory-items-US-03` |
| Refused while held | an error `Notice` naming the place, when a hold landed after the page opened | `grade10-admin-inventory-items-US-04` |
| Moved | the item's page shows the new owner and the move at the top of its moves | `grade10-admin-inventory-items-US-03` |

### Retire

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | four reasons - duplicate, lost, destroyed, left the platform - and a destructive Retire, disabled until one is chosen | `grade10-admin-inventory-items-US-05` |
| Refused while held | an error `Notice` naming the place, when a hold landed after the page opened | `grade10-admin-inventory-items-US-05` |
| Retired | the item's page reads as retired | `grade10-admin-inventory-items-US-05` |

### Close a hold

| State | Shows | Anchor |
| --- | --- | --- |
| Asking | a required reason; Close disabled until one is typed | `grade10-admin-inventory-items-US-06` |
| Closed | the place row reads as closed by hand; the item reads as not held unless another place holds it | `grade10-admin-inventory-items-US-06` |

### Case tab facts

| State | Shows | Anchor |
| --- | --- | --- |
| Registration pending | the section says the item is registered when the valuation starts | `grade10-admin-vault-operator-queue-US-21` |
| Facts shown | category, title, grader, grade, cert and description from the register, linking the item | `grade10-admin-vault-operator-queue-US-21` |
| Editable | Edit opening `ItemFactsDialog`, for `inventory:write` | `grade10-admin-vault-operator-queue-US-21` |
| Read-only | the facts without Edit, for a `vault:read` holder without `inventory:write` | `grade10-admin-vault-operator-queue-US-21` |
| Beside the valuation | grader, grade and cert where staff record the valuation | `grade10-site-vault-valuation-and-offer-US-06` |
| Register unreachable | this section's own error with retry; the rest of the tab stands | `grade10-admin-vault-operator-queue-US-21` |
| Cert names another item | an error `Notice` naming that item, linking it | `grade10-admin-vault-operator-queue-US-21` |

### Walk-in known slab

| State | Shows | Anchor |
| --- | --- | --- |
| Slab fields | grader and cert, added to the walk-in form by this change | `grade10-admin-vault-operator-queue-US-20` |
| Found | the item's facts filled in; the case takes that item | `grade10-admin-vault-operator-queue-US-20` |
| Not found | nothing filled; the item is registered when the valuation starts | `grade10-admin-vault-operator-queue-US-20` |
| Retired cert | reads as not found | `grade10-admin-vault-operator-queue-US-20` |
| Another owner | found, naming its owner; the Documents tab's guard applies later | `grade10-admin-vault-operator-queue-US-20` |
| Held by another case | refused, naming that case, linking it; its hold closes first | `grade10-admin-vault-operator-queue-US-20` |

### Documents tab

| State | Shows | Anchor |
| --- | --- | --- |
| Another owner | Prepare withheld in words, naming the owner the register holds and linking the item, where Transfer is offered | `grade10-site-vault-case-lifecycle-US-03` |

### Custody agreement

| State | Shows | Anchor |
| --- | --- | --- |
| Graded | grader, grade and cert beside the item, as the register held them at prepare | `grade10-site-vault-documents-and-signing-US-06` |
| No grader | nothing printed for grader, grade or cert | `grade10-site-vault-documents-and-signing-US-06` |

### Collector page Items

| State | Shows | Anchor |
| --- | --- | --- |
| Items | title, category, grader and cert, held or not, each row opening its item; paged | `grade10-admin-inventory-items-US-07` |
| Retired items | ❓ awaiting the owner (Q39): left out | `grade10-admin-inventory-items-US-07` |
| Loading | the section's own `Status` pending | `grade10-admin-inventory-items-US-07` |
| None | the collector owns no item | `grade10-admin-inventory-items-US-07` |
| Forbidden | the section names `inventory:read`, which a treasurer does not hold; the others stand | `grade10-admin-inventory-items-US-07` |
| Failed | the section's own error with retry; the others stand | `grade10-admin-inventory-items-US-07` |

### Erasure checklist

| State | Shows | Anchor |
| --- | --- | --- |
| Held | the inventory row's `holds` line names the item and the place, linking the item | `grade10-admin-inventory-items-US-08` |

### Request wizard

| State | Shows | Anchor |
| --- | --- | --- |
| Ten categories | the register's ten on the first step, each in the collector's language | `grade10-site-vault-case-intake-US-01` |

## Flags

- **Every board is missing** - Items, one item, register and edit, transfer,
  retire and close-a-hold, the Case tab's facts, the walk-in's slab fields,
  the Documents tab's guard, the collector page's Items section and the
  erasure checklist's line; each row above is the designer's to draw, and
  the change waits on them in its record
- **Where Items sits in the nav** - its own section beside Inventory, or
  under an Inventory heading; the console's sections carry either
- **The search hint** - how one field tells an email, an item id, a grader
  and cert and a title apart, in words staff read before they type
- **The proof's accept list** - `FilePicker` takes the list `tech-design.md`
  settles for HEIC and HEIF
- **The checklist's link** - a product's `holds` lines are plain text
  today; a line that links the item needs the checklist to carry one
