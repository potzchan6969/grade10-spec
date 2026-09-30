# UI: Vault walk-ins and owners

No Figma frame and no canvas board draws any screen below yet; the designer
owes every board under Flags, and the change's record says so under
`awaiting: ui-design`. Until a board lands, each screen is the composition
named here, drawn from the console's and the store's existing blocks, and
nothing below invents a look: a state no block carries is flagged for the
designer, never drawn locally. [decisions.md](decisions.md) owns the scope,
and the journeys beside each delta own who walks it.

- **Where the views live** - the walk-in form, the collector column and
  filter in `packages/vault/admin-frontend`; the collector page in
  `apps/admin/grade10`, its vault section a view of
  `packages/vault/admin-frontend`; the draft staff opened on the collector's
  list and in the wizard in `packages/vault/frontend`, as any draft
- **Stories** - one per view per distinct layout, `Vault/<Feature>/<View>`
  as the collector flow names them, so an id reads
  `vault-<feature>-<view>--<state>`
- **Copy** - the collector's words are keys in
  `packages/i18n/messages/shared/<locale>/vault.json`; the console's words
  stay the console's own English, as its panels carry them

## Screens

| Screen | Board | Route | Composes |
| --- | --- | --- | --- |
| Walk-in form | none yet - the designer's | dialog from the queue's header, `admin.grade10.com/vault` | new `WalkInDialog` → `FormDialog`, `TextField`, `NotesField`, `ChoiceList`, `Choice`, `MoneyField`, `FileButton`, `MediaGallery`, `Notice` |
| Walk-in draft | the Drafts view as it stands | `admin.grade10.com/vault/cases/:caseId` | `CaseDetailPanel`, `WithheldActs` → `Badge`, `Notice`, `Button`, `Link` |
| Queue and held items, collector | none yet | `admin.grade10.com/vault`, the queue and the Held items tab; the collector in the URL | `CaseQueuePanel`, `CaseQueueTable`, `CustodyHoldingsPanel` → `Table`, `Row`, `Cell`, `Link`, `Status`, `Button` |
| Collector page v1 | none yet - the designer draws the page | `admin.grade10.com/collectors/:userId` | new `CollectorPage` → `SectionHeader`, `Panel`, `Table`, `Row`, `Cell`, `At`, `StatusBadge`, `CursorPager`, `Status`, `Link` |
| Send a draft staff opened | the collector flow's list and wizard | `grade10.com/vault`, then the wizard on the draft | `CaseList`, the wizard's third step `RequestReview`, unchanged |

## Components

### Console blocks - existing, `@grade10/frontend-console`

`FormDialog`, `TextField`, `NotesField`, `ChoiceList`, `Choice`,
`MoneyField`, `FileButton`, `MediaGallery`, `SectionHeader`, `Panel`,
`Table`, `Row`, `Cell`, `At`, `Status`, `StatusBadge`, `CursorPager`,
`Notice`, `Badge`, `Link`, `Button`. The collector filter is a `Link` into
the filtered URL and a `Button` that clears it; nothing the console package
lacks. No store block, primitive or token is new or changed.

### New in grade10 - work in the application

- **`WalkInDialog`** - the counter's form, the refusal for a signed-in
  address, and the photos, in `packages/vault/admin-frontend`
- **`CollectorPage`** - the header and the vault cases section, each
  section reading and refusing on its own, in `apps/admin/grade10`
- **The collector column** - on `CaseQueueTable` and
  `CustodyHoldingsPanel`, the name narrowing the list and a link beside it to
  the collector page, and the filter's own line

### Words - work in `packages/i18n`

Answered in `shared/` for every language it speaks; the words are not
written here.

- **The list's line** - what a draft staff opened reads on the collector's
  list; the wizard's own words otherwise

## States

### Walk-in form

| State | Shows | Anchor |
| --- | --- | --- |
| Closed | Open a walk-in in the queue's header, for `vault:operate` only | `grade10-admin-vault-operator-queue-US-10` |
| Statement first | ❓ awaiting Legal (Q17): the collection statement shown before staff type | `grade10-admin-vault-operator-queue-US-10` |
| Empty | email, name, category, title, description, lane and amount, photos; Open case disabled | `grade10-admin-vault-operator-queue-US-10` |
| Photos added | the photos in a `MediaGallery`, n of 10, each removable | `grade10-admin-vault-operator-queue-US-10` |
| Opening | Open case pending; the form held | `grade10-admin-vault-operator-queue-US-10` |
| Opened | the new draft opens on its own page | `grade10-admin-vault-operator-queue-US-10` |
| Signed-in address | a `Notice` naming the refusal: that customer sends the request from their own phone; the form keeps what was typed | `grade10-admin-vault-operator-queue-US-10` |
| Refused otherwise | the worker's refusal in words beside the field it names | `grade10-admin-vault-operator-queue-US-10` |

Grader and cert arrive with `add-item-registry`.

### Walk-in draft

| State | Shows | Anchor |
| --- | --- | --- |
| Listed | the draft in the Drafts view, as any draft reads there; nothing to value or book; Cancel offered; **The collector's cases** in the header | `grade10-admin-vault-operator-queue-US-10` |
| Sent | it leaves Drafts for Needs staff, as any submitted case | `grade10-site-vault-case-intake-US-06` |
| Cancelled for a typo | the draft ends as cancelled, and nobody is emailed | `grade10-site-vault-case-lifecycle-US-06` |

### Queue and held items, collector

| State | Shows | Anchor |
| --- | --- | --- |
| Named | each row's collector by account name, a click narrowing to that collector, and a link beside it to their collector page | `grade10-admin-vault-operator-queue-US-11` |
| Name unavailable | the short id and "name unavailable"; the rest of the row and the list stand | `grade10-admin-vault-operator-queue-US-11` |
| Treasurer | a treasurer reads the rows as today, with no collector column | `grade10-admin-console-collector-page-US-02` |
| Narrowed to one collector | the collector's name above the rows, the count for that collector, and a control clearing it | `grade10-admin-vault-operator-queue-US-12` |
| Narrowed, none | the collector holds no case in this cut | `grade10-admin-vault-operator-queue-US-12` |

### Collector page v1

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | each section's own `Status` pending | `grade10-admin-console-collector-page-US-01` |
| Header | the account's name and email | `grade10-admin-console-collector-page-US-01` |
| Header, treasurer | the short id and no name; the contact stays on each case | `grade10-admin-console-collector-page-US-02` |
| Header, unavailable | the short id and "name unavailable"; the sections still load | `grade10-admin-console-collector-page-US-01` |
| Vault cases | reference, item, status, lane, last touched, each opening its case; paged | `grade10-admin-console-collector-page-US-01` |
| Vault cases, none | the collector holds no vault case | `grade10-admin-console-collector-page-US-01` |
| Section failed | the section's own error with retry; the others stand | `grade10-admin-console-collector-page-US-01` |
| Unknown collector | nobody answers to that id | `grade10-admin-console-collector-page-US-01` |

### Send a draft staff opened

| State | Shows | Anchor |
| --- | --- | --- |
| Signing in | the site's existing sign-in dialog | `grade10-site-vault-case-intake-US-06` |
| Listed as a draft | the draft on the collector's list, reading that staff opened it at the counter; it reopens in the wizard | `grade10-site-vault-case-intake-US-06` |
| The wizard's own | the third step's read-back, statement tick and send, with its own states | `grade10-site-vault-case-intake-US-06` |
| Cancelled before sending | the ending as any cancelled draft reads it | `grade10-site-vault-case-lifecycle-US-06` |

## Flags

- **Every board is missing** - the walk-in form, the collector column and
  filter, and the collector page; each row above is the designer's to draw,
  and the change waits on them in its record
