# UI: Vault walk-ins and owners

No Figma frame exists. The design canvas is the frame:
[Vault canvas](https://claude.ai/artifact/BUPaDYBGRH8p5ib5hZk8Su), one board
per screen, named below by its id (`A14`, `A15`, `C24`). The three boards
draw the looks the build composed from the console's and the store's
existing blocks, as [Q27](decisions.md#decisions) directs; the collector
page has no board yet. A state no block carries is flagged for the
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
| Walk-in form | `A14` | dialog from the queue's header, `admin.grade10.com/vault` | new `WalkInDialog` → `FormDialog`, `TextField`, `NotesField`, `ChoiceList`, `Choice`, `MoneyField`, `FileButton`, `MediaGallery`, `Notice` |
| Walk-in draft | the Drafts view as it stands | `admin.grade10.com/vault/cases/:caseId` | `CaseDetailPanel`, `WithheldActs` → `Badge`, `Notice`, `Button`, `Link` |
| Queue and held items, collector | `A15` | `admin.grade10.com/vault`, the queue and the Held items tab; the collector in the URL | `CaseQueuePanel`, `CaseQueueTable`, `CustodyHoldingsPanel` → `Table`, `Row`, `Cell`, `Link`, `Status`, `Button` |
| Collector page v1 | none yet - the designer draws the page | `admin.grade10.com/vault/collectors/:userId` | new `CollectorPage` → `SectionHeader`, `Panel`, `Table`, `Row`, `Cell`, `At`, `StatusBadge`, `CursorPager`, `Status`, `Link` |
| Send a draft staff opened | the collector flow's list and wizard; the photograph step `C24` | `grade10.com/vault`, then the wizard on the draft | `CaseList`, the wizard's third step `RequestReview`, unchanged |

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
| Closed | Open a walk-in in the queue's header, for `vault:operate` only | `grade10-admin-vault-operator-queue-SC-63` |
| Statement first | the collection statement shown before staff type, its version kept by the open (Q17); in production the open refuses while the statement is unwritten (Q24) | `grade10-admin-vault-operator-queue-SC-58` |
| Empty | email, category, title, description, lane and amount, photos; no name and no contact number; Open case disabled until a category and a title are given, a photograph not needed | `grade10-admin-vault-operator-queue-SC-79` |
| Photos added | the photos in a `MediaGallery`, n of 10; a selected photograph offers **Remove photograph** | `grade10-admin-vault-operator-queue-SC-75` |
| Opening | Open case pending; the form held | **Out of suite:** the dialog's pending state, drawn by the `WalkInDialog` story in `packages/vault/admin-frontend` and checked in its review |
| Opened | the new draft opens on its own page | `grade10-admin-vault-operator-queue-SC-55` |
| Signed-in address | a `Notice` in the dialog's footer naming the refusal: that customer sends the request from their own phone; the form keeps what was typed | `grade10-admin-vault-operator-queue-SC-57` |
| Refused otherwise | a title or description past its limit refused in words beside that field, Open case held; a refusal only the worker gives reads in the dialog's footer, beside Cancel and Open case; the form keeps what was typed | `grade10-admin-vault-operator-queue-SC-76` |

Grader and cert arrive with `add-item-registry`. The form is built without
waiting on counsel's statement text (Q24).

### Walk-in draft

| State | Shows | Anchor |
| --- | --- | --- |
| Listed | the draft in the Drafts view, as any draft reads there; nothing to value or book; Cancel offered; **The collector's cases** in the header | `grade10-admin-vault-operator-queue-SC-55` |
| Sent | it leaves Drafts for Needs staff, as any submitted case | `grade10-site-vault-case-intake-SC-34` |
| Cancelled for a typo | the draft and every photograph on it are removed from the account at the wrong address, never listed there as cancelled, and nobody is emailed; staff's Closed view lists it under its reference, its item reading as erased | `grade10-site-vault-case-lifecycle-SC-41` |

### Queue and held items, collector

| State | Shows | Anchor |
| --- | --- | --- |
| Named | a Collector column after the item: each row's collector by account name, or by the email handle of an account the walk-in created until the customer names themselves, as a button narrowing to that collector, and a **Collector page** link beside it | `grade10-admin-vault-operator-queue-SC-66` |
| Name unavailable | the short id followed by "name unavailable", still narrowing and linking; the rest of the row and the list stand | `grade10-admin-vault-operator-queue-SC-69` |
| Treasurer | a treasurer reads the rows as today, with no collector column | `grade10-admin-vault-operator-queue-SC-70` |
| Narrowed to one collector | a line above the rows naming the collector, the same on the queue and Held items, with **Every collector** clearing it; the cuts count that collector's cases | `grade10-admin-vault-operator-queue-SC-71` |
| Narrowed, none | the collector holds no case in this cut | `grade10-admin-vault-operator-queue-SC-73` |
| Narrowed to nobody | an unknown or malformed id reads as a collector holding no case | `grade10-admin-vault-operator-queue-SC-77` |
| Overdue and search | neither names a collector nor narrows by one | `grade10-admin-vault-operator-queue-SC-78` |

### Collector page v1

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | each section's own `Status` pending | `grade10-admin-console-collector-page-SC-17` |
| Header | the account's name and email | `grade10-admin-console-collector-page-SC-08` |
| Header, treasurer | the short id and no name; the contact stays on each case | `grade10-admin-console-collector-page-SC-09` |
| Header, unavailable | the short id and "name unavailable", no email; the sections still load | `grade10-admin-console-collector-page-SC-10` |
| Header, no vault case | the short id and "holds no vault case"; no name or email | `grade10-admin-console-collector-page-SC-22` |
| Header failed | the header's own error and a retry; the cases still listed | `grade10-admin-console-collector-page-SC-20` |
| Their cases on the queue | a link in the header opening the queue narrowed to the collector, for every reader | `grade10-admin-console-collector-page-SC-19` |
| Vault cases | reference, item, status, lane, last touched, each opening its case; paged | `grade10-admin-console-collector-page-SC-12` |
| Vault cases, none | the collector holds no vault case | `grade10-admin-console-collector-page-SC-14` |
| Section failed | the section's own error with retry; the others stand | `grade10-admin-console-collector-page-SC-16` |
| Unknown collector | nobody answers to that id | `grade10-admin-console-collector-page-SC-11` |

### Send a draft staff opened

| State | Shows | Anchor |
| --- | --- | --- |
| Signing in | the site's existing sign-in dialog | **Out of suite:** the site's sign-in dialog, stated in `shared/auth/sign-in` |
| Listed as a draft | the draft on the collector's list, reading that staff opened it at the counter; it reopens in the wizard | `grade10-site-vault-case-intake-SC-32` |
| The wizard's own | the third step's read-back, statement tick and send, with its own states | `grade10-site-vault-case-intake-SC-34` |
| Photo removed | the photograph step shows each photograph as a thumbnail with a text button under it removing it, staff's or their own, before the send | `grade10-site-vault-case-intake-SC-37` |
| Cancelled before sending | a draft the collector cancelled reads as any cancelled draft; one staff cancelled leaves the list | `grade10-site-vault-case-lifecycle-SC-44` |

## Flags

- **The collector page has no board** - its rows above are the designer's
  to draw; Q27 builds it on the console's existing blocks now, replaced when
  its board lands
- **Drawn from the build** - `A14`, `A15` and `C24` draw what the build
  composed, so the designer reviews them as boards rather than drawing them
  fresh
