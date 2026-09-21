---
title: Grading Console
spec: grade10-admin/grading/counter
audience: operator
order: 1
---

The Grading section of the admin panel is a queue of submissions cut by what each one waits for, a batches page, and
one submission in tabs whose buttons follow its status; cards are counted here, money is taken at the till and written
back.

- 🚧 **URL** — `admin.grade10.com/grading` for the queue, `admin.grade10.com/grading/batches`, and
  `admin.grade10.com/grading/submissions/<id>` for one submission; the diary stays its own section

## Queue

🚧 **Seven views** — every status belongs to one, and Today is a query on the shop's own day:

| View | What it lists |
| --- | --- |
| Booked | `booked` |
| Handed in | `checked_in` |
| With the grader | `sent`, `graded` |
| Back | `returned` |
| Ready | `ready` |
| Closed | `collected`, `cancelled`, `expired` |
| Today | every open submission whose drop-off falls on the shop's own day; pickups walk in |

- ❓ **Drafts** — whether a `planned` submission has a view of its own or stays off the queue until booked — Product
- 🚧 **Rows** — submission id, collector, cards, grader and level, status, visit, last touched, and a badge naming why
  it waits: Visit today · Batch closes today · Due back · Running late · Upcharge to settle · Ungraded card ·
  Unchecked return · Uncollected 30 d · Storage fee from day 90; derived at the read, never stored
- 🚧 **Tiles** — the batch closing Thursday 19:00 and its cards; with graders, and how many past their estimate; ready
  and uncollected, and how many past 30 days; to settle before collection, the sum and count of upcharges
- 🚧 **Paging** — 50 rows a page, newest touched first, a load-more control, and the day's drop-offs in a strip above,
  each opening its submission

## Hand-in

:::flow{title="Hand-in at the counter"}
## *Staff* — **Find the booking**
The day's drop-off opens its submission; the visit starts at the desk and the runbook opens on it.

## *Staff* — **Check each card**
Present, a condition note, the declared value against its reference, and two photographs, front and back, that go to the collector's page. A card not on the list is added with the collector.

## *Staff* — **Confirm the level**
Every declared value inside the level's ceiling; a card above it moves to a second submission at a higher level, or is refused.

## *Collector* — **Sign the agreement**
The submission agreement on the iPad by QR code or link, with the schedule of cards as checked; mintable once every card is checked.

## *Staff* — **Take the fee at the till**
Opens once the agreement is sealed: the POS with one Grading Service line per card at the level's fee; the paid order's reference is written to the intake receipt.

## *Staff* — **Labels, seal, check in**
One intake label per card, the cards sealed into the intake bag with the printed list, `booked → checked_in`; the intake receipt goes out by email with the signed agreement attached.
:::

- 🚧 **Nothing charged early** — the payment opens once every card is checked and the agreement is sealed; a walk-in
  with no list is listed at the counter and runs the same runbook
- 🚧 **Refusing a card** — three reasons, the grader will not take it, declared above the level, or the collector
  withdrew it, with a line in the collector's words that shows on the submission page and the receipt exactly as
  typed; the card stays in their hands, its fee is never charged, and a line already paid is refunded at the till

## Batches

- 🚧 **One grader, one level** — a batch is what the grader invoices and ships back, so it is what the shop tracks, and
  a card that does not fit waits for the next; its states: open until the cut-off → closed Thursday 19:00, ships today
  → with the grader, its stage in its own words → back, unchecked, badged after a day → closed on the day received
- 🚧 **The ship form** — the packing list, one line per intake id in submission order; the grader's online form and its
  order number; insured to the declared total against the courier's cover; courier and tracking, shipped on, never in
  the future, and estimated back from the level's estimate counted from the ship day
- 🚧 **Mark as shipped** — `checked_in → sent` for every submission in the batch, each collector emailed the tracking
  and the estimate; a re-estimate takes a reason and emails every collector in the batch the day it is set
- 🚧 **Tiles** — ship today; with graders, past their estimate; back, unchecked; the safe's declared value against its
  cap
- ❓ **The safe's cap** — HKD 300,000 of declared value held in the safe, an operational cap until cover is bought —
  Commercial, Legal

## Receiving

- 🚧 **Scan and match** — each scan matches a cert to a card by the intake id on the grader's manifest; a cert already
  held by another submission is refused by name; the counters read scanned of total, matched, ungraded, and upcharges
  with their sum
- 🚧 **Exceptions on the card** — ungraded, with the grader's code and note, the fee standing; an upcharge from the
  invoice, due before collection; a slab on the manifest not scanned, finished as held by the grader with its expected
  date or as not returned; damaged, photographed before it leaves the box
- 🚧 **Finish receiving** — `graded → returned → ready` for every submission in the batch; each collector is emailed
  the pickup code and what is due, a card not returned or damaged the same day; saved half scanned, a batch keeps its
  scans

## One Submission

- 🚧 **Header** — the summary, the status badge and the chips: declared in total, upcharge to settle, ungraded card,
  the batch; the drop-off or the pickup block; the collector's email, phone and WhatsApp click-to-chat link with seven
  templates
- 🚧 **Cards tab** — per card the intake id, declared value, level and the one it was moved to, grade and cert in the
  grader's words, the outcome; refuse or add a card at hand-in; withdraw a card at Handed in until the batch closes,
  refunding its POS line against a receipt
- 🚧 **Money tab** — paid at hand-in with the POS reference, the upcharge from the invoice, to settle before
  collection, refunds; record a settlement, or waive the upcharge with a reason and a second person, once the cards
  are back
- 🚧 **Documents tab** — the three documents with their fingerprints; show on iPad, copy link, send again
- 🚧 **Timeline tab** — every event with the figures it carried and the grader's stages in its words; staff-only
  entries stay here and never reach the collector

## Hand-back

:::flow{title="Hand-back at the counter"}
## *Staff* — **Who is collecting**
The pickup code and the name, the collector's or the person named on the submission page; above the ID threshold a glance at an ID matching the name, nothing kept. Anyone else is turned away.

## *Staff* — **Settle what is due**
The upcharge and any storage fee at the till.

## *Staff and collector* — **Hand over and check together**
Each slab and raw card ticked as it is handed over and inspected; one photograph of each slab, for the collector's page.

## *Collector* — **Sign the hand-back receipt**
On the iPad by QR code, listing every cert, the settlement and who collected.

## *Staff* — **Close**
`ready → collected`; the record stays on the submission page.

## *Staff* — **Vault instead, if asked**
A slab goes straight into a vault case: the collector opens the case on their phone under an account, staff value the slab, the identity check happens here and the custody packet is signed, 10 to 15 minutes on the same iPad; the receipt says the card went to the vault.
:::

- 🚧 **Sealed** — the receipt is refused while anything is due or an item is unticked; sealed, the submission closes
  and the page keeps the record; a second hand-back closes one whose card was held by the grader

## Settings

🚧 **Every default is a setting the console reads** — never a constant; each row is adopted until its owner confirms
it:

| Setting | Default | Confirms |
| --- | --- | --- |
| `grading.plan_nudge_days` | ❓ 21 | Operations |
| `grading.plan_expiry_days` | ❓ 30 | Operations |
| `grading.batch_cutoff` | ❓ Thursday 19:00, the batch shipping Friday | Operations, against the courier's pickup schedule |
| `grading.reminder_days` | ❓ 30 and 60 | Operations |
| `grading.storage_from_day` | ❓ 90 | Operations |
| `grading.storage_fee_per_card_month` | ❓ HKD 30 | Commercial |
| `grading.notice_day` | ❓ 180 | Operations; the notice's form is Legal's |
| `grading.settlement_days` | ❓ 14 | Operations |
| `grading.id_glance_threshold` | ❓ HKD 10,000 | Operations |
| `grading.max_cards_bulk` | ❓ 100, and 20 at every other level | Operations |
| `grading.cover_pct` | ❓ 1.5% | Commercial |
| `grading.safe_declared_cap` | ❓ HKD 300,000 | Commercial, Legal |
| the fee sheet | ❓ one sheet per grader and level: ceiling, fee, cover line, estimate | Commercial |
| the diary services | ❓ the Grading drop-off at about 20 minutes, its Bulk variant at about 45, the customer-bookable Grading visit; names and durations | Product, Engineering |

## Grants

| Grant | Roles | Opens |
| --- | --- | --- |
| 🚧 `grading:read` | staff, admin | the queue, the batches, one submission with its documents and money |
| 🚧 `grading:operate` | staff, admin | check, refuse, mint, check in, ship, re-estimate, receive, hand back, withdraw a card, vault a slab |
| 🚧 `grading:approve` | staff, admin | a waiver of the upcharge, a settlement for a card not returned or damaged |

- 🚧 **A waiver takes two people** — a reason, and a second `grading:approve` holder who is not the recorder
- 🚧 **Second factor and audit** — as the vault's: required in production and staging, and every action filed under its
  submission on the audit chain — [Operator Console](/p/grade10-site/vault/operator-console#permissions)
- 🚧 **Staff hear nothing** — no email to staff; the badges, the tiles and the day's strip are the signal

<!-- story: the queue with its tiles, the hand-in runbook, the receive table -->

:::detail{title="Code map" for="engineer"}
- **Grants** — `packages/grading/contracts/src/permissions.ts` maps every
  admin procedure to its grant, the way the vault's does
- **Slices** — `packages/grading/admin-frontend/src/features/{queue,intake,batches,receiving,handback}`;
  pages in the grade10 admin panel under `pages/grading`
- **Settings** — `grading_settings`, seeded from the defaults and read by
  every value above
- **Money** — one POS line per card, written back from the till's paid order
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md)
  and
  [the elevated-procedure ladder](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Queue by wait, not by status | Decided | A shop asks what a submission is waiting for; every status belongs to one view, and Today is a query on the shop's own day | Product |
| Badges are derived | Decided | The console and the reminder worker derive every badge the same way at the read; nothing is stored | Engineering |
| Money at the till | Decided | Cards are counted in the console; the fee, an upcharge, a refund and a storage fee are POS lines against the submission, written back | Product |
| Signed before any money moves | Decided | The till opens on the sealed agreement, and a refused or withdrawn line is refunded there | Product |
| A batch is one grader and one level | Decided | It is what the grader invoices and ships back; a card that does not fit waits for the next | Product |
| A cert is held by one submission | Decided | A scan matching a cert already held elsewhere is refused by name, so a slab can never be handed to the wrong collector | Engineering |
| A waiver takes a second person | Decided | A reason and a second `grading:approve` holder, never the recorder; a settlement is recorded under the same grant | Product |
| Staff notifications | Decided | The queue is the inbox; nothing is emailed to staff | Product |
| Drafts on the queue | ❓ Open | Whether a `planned` submission has a view of its own | Product |
| The safe's cap | ❓ Open | HKD 300,000 of declared value in the safe, an operational cap that exists only because cover does not | Commercial, Legal |
| Every default a setting | ❓ Open | Each row of the settings table, adopted from the canvas until its owner confirms or changes it | Operations, Commercial, Legal, Product |
| Buttons follow the machine | Decided | Each act shows only at the statuses the contract publishes, cancel never once the cards have left, and the worker refuses independently | Engineering |
| Counter intake | Decided | A walk-in books the customer-bookable visit and the cards are listed at the counter; the runbook is the same | Product |
:::
