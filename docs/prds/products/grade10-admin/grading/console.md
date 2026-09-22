---
title: Grading Console
spec: grade10-admin/grading/counter
audience: operator
order: 1
---

The Grading section of the admin panel is a queue of submissions cut by what each one waits for, a batches page, and
one submission in tabs whose buttons follow its status; cards are counted here, money is taken at the till.

- 🚧 **URL** — `admin.grade10.com/grading`, `/grading/batches` and `/grading/submissions/<id>`; the diary stays its own section

## Queue

🚧 **Seven views** — every status belongs to one; Today is a query on the shop's own day, its drop-offs in a strip above:

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
  Unchecked return · Uncollected 30 d · Storage fee from day 90 · Notice due; derived at the read, never stored
- 🚧 **Tiles** — the batch closing and its cards; with graders, and how many past their estimate; ready, and how many past
  30 days; to settle before collection, the sum and count of upcharges

## Hand-in

:::flow{title="Hand-in at the counter"}
## *Staff* — **Find the booking**
The day's drop-off opens its submission and the visit starts at the desk; a walk-in's list is written here, with them.

## *Staff* — **Check each card**
Present, a condition note, the declared value against its reference and inside the level's ceiling — above it the card moves to a second submission at a higher level, or is refused — and two photographs, front and back, that go to the collector's page. A card not on the list is added with the collector.

## *Collector* — **Sign the agreement**
The submission agreement on the iPad by QR code or link, with the schedule of cards as checked; mintable once every card is checked.

## *Staff* — **Take the fee at the till**
Opens once the agreement is sealed: the POS with one Grading Service line per card at the level's fee and, at Express and Super Express, one cover line per card; the paid order's reference is written to the intake receipt.

## *Staff* — **Labels, seal, hand in**
One intake label per card, the cards sealed into the intake bag with the printed list, `booked → checked_in`; the intake receipt goes out by email with the signed agreement attached.
:::

- 🚧 **No hand-in without a paid line** — a sealed agreement with no paid line leaves the submission booked, the seal
  standing and the cards with the collector; the till is run again or another drop-off is booked
- 🚧 **Refusing a card** — three reasons, the grader will not take it, declared above the level, or the collector
  withdrew it, with a line in the collector's words that shows on the submission page and the receipt exactly as
  typed; the card stays in their hands, its fee is never charged, and a line already paid is refunded at the till
- 🚧 **The safe is full** — a hand-in that would carry the declared value in the safe past its cap is refused: the
  counter tells the collector and books the next drop-off; ready slabs count toward the safe
- ❓ **Grading lines earn no points** — the fee, an upcharge, a storage fee and a refund ride the loyalty programme's
  non-earning list, as the Grading Service line does — Commercial — [Points](/p/grade10-site/loyalty/points)

## Batches

::changes{spec="grade10-admin/grading/batches"}

- 🚧 **One grader, one level** — a batch is what the grader invoices and ships back, so it is what the shop tracks, and
  a card that does not fit waits for the next; its states: open until the cut-off → closed Thursday 19:00, ships the
  next day → with the grader, its stage in its own words → back, unchecked, badged after a day → closed when received
- 🚧 **The ship form** — the packing list, one line per intake id; the grader's order number; insured to the declared
  total against the courier's written cover figure; courier, tracking and the ship date, never in the future; the
  estimate back, the level's counted from the ship day
- ❓ **Above the courier's cover** — a batch whose declared total passes the courier's written figure is split or
  held — Operations
- 🚧 **Mark as shipped** — `checked_in → sent` for every submission in the batch, each collector emailed the tracking
  and the estimate; a re-estimate takes a reason and emails every collector in the batch the day it is set
- 🚧 **Tiles** — ship today; with graders, past their estimate; back, unchecked; the safe's value against its cap
- ❓ **The safe's cap** — HKD 300,000 of declared value in the safe, an operational cap until cover is bought —
  Commercial, Legal

## Receiving

- 🚧 **The manifest and the invoice** — enter before the first scan; a manifest line naming no intake id in the
  batch is listed as unmatched and holds finishing until staff resolve it
- ❓ **How they enter** — imported as a file, or typed as the morning read is — Operations
- 🚧 **Scan and match** — each scan matches a cert to a card by the intake id on the grader's manifest; a cert already
  held by another submission is refused by name; counters: scanned, matched, ungraded, upcharges and their sum
- 🚧 **Exceptions on the card** — ungraded, with the grader's code and note, the fee standing; an upcharge, the sheet's
  difference between the two levels, the invoice reconciled against it and a gap Commercial's; a slab on the manifest
  not scanned, finished as held by the grader with its expected date or as not returned; damaged, photographed in the box
- 🚧 **Finish receiving** — `graded → returned → ready` for every submission in the batch, each collector emailed the
  pickup code and what is due, a card not returned or damaged the same day; a batch saved half scanned keeps its scans

## One Submission

- 🚧 **Header** — the summary, the status badge and the chips: declared in total, upcharge to settle, ungraded card,
  the batch; the drop-off or the pickup block; the collector's email, phone and WhatsApp click-to-chat templates
- 🚧 **Cards tab** — per card the intake id, declared value, level and the one it was moved to, grade and cert in the
  grader's words, the outcome; refuse or add a card at hand-in; withdraw one at Handed in until the batch closes
- 🚧 **Money tab** — paid at hand-in with the POS reference, the upcharge, storage accrued, to settle before
  collection, refunds and payouts; once the cards are back, waive the upcharge or record a payout, each with a reason
  and a second person; a payout is its own record with its route, till or transfer, and a reversal if the card turns up
- 🚧 **Documents tab** — the three documents with their fingerprints; show on iPad, copy link, send again
- 🚧 **Timeline tab** — every event with its figures and the grader's stages in its words; staff-only entries stay here

## Hand-back

:::flow{title="Hand-back at the counter"}
## *Staff* — **Who is collecting, and what is due**
The pickup code and the name, the collector's or the person named on the submission page; above the ID threshold a glance at an ID matching the name, nothing kept; anyone else is turned away. Then the upcharge and the storage accrued, one line each at the till.

## *Staff and collector* — **Hand over and check together**
Each slab and raw card ticked as it is handed over and inspected; one photograph of each slab, for the collector's page.

## *Collector* — **Sign the hand-back receipt**
On the iPad by QR code, listing every cert, what was paid and paid out, and who collected.

## *Staff* — **Close**
`ready → collected` on the sealed receipt, refused while anything is due or an item is unticked; the record stays on the page, and a second hand-back closes one whose card was held by the grader.

## *Staff* — **Vault instead, if asked**
A slab goes straight into a vault case: the collector opens the case on their phone under an account, staff value the slab, the identity check happens here and the custody packet is signed, 10 to 15 minutes on the same iPad; the receipt says the card went to the vault.
:::

## Written Notice

- 🚧 **Notice due** — from day 180 the badge asks for it: staff post it by registered post to the address on the
  agreement and record the posting date and tracking; the email goes the same day and the 30 days run from the posting
- 🚧 **After the 30 days** — nothing more in the first release: the cards stay in the safe, ready, and storage accrues

## Settings

🚧 **Every default is a setting the console reads** — never a constant; each row stands until its owner confirms it:

| Setting | Default | Confirms |
| --- | --- | --- |
| `grading.plan_nudge_days` | ❓ 21 | Operations |
| `grading.plan_expiry_days` | ❓ 30 | Operations |
| `grading.batch_cutoff` | ❓ Thursday 19:00; the batch ships the next day | Operations, against the courier's pickup schedule |
| `grading.reminder_days` | ❓ 30 and 60 | Operations |
| `grading.storage_from_day` | ❓ 90 | Operations |
| `grading.storage_fee_per_card_month` | ❓ HKD 30 | Commercial |
| `grading.notice_day` | ❓ 180 | Operations; the notice's form is Legal's |
| `grading.settlement_days` | ❓ 14, from the day the batch is received at the shop | Operations |
| `grading.id_glance_threshold` | ❓ HKD 10,000 | Operations |
| `grading.safe_declared_cap` | ❓ HKD 300,000 | Commercial, Legal |
| the fee sheet | ❓ one setting per grader and level: ceiling, fee, cover rate, estimate, cards a submission | Commercial |
| the diary services | ❓ the Grading drop-off at about 20 minutes, its Bulk variant at about 45, the customer-bookable Grading visit; names, durations and horizon | Product, Engineering |

- 🚧 **Pinned** — the fee sheet is pinned to a submission at booking and every figure the agreement prints at
  signing; a change reaches only submissions not yet booked

## Grants

| Grant | Roles | Opens |
| --- | --- | --- |
| 🚧 `grading:read` | staff, admin | the queue, the batches, one submission with its documents and money |
| 🚧 `grading:operate` | staff, admin | check, refuse, mint, hand in, ship, re-estimate, receive, hand back, withdraw a card, vault a slab, post the notice |
| 🚧 `grading:approve` | staff, admin | a waiver of the upcharge, a payout for a card not returned or damaged, a settings write |

- 🚧 **Two people for money** — a waiver, a payout and a money setting take a reason and a second `grading:approve`
  holder who is not the recorder; a settings write is filed under its own audit subject, `settings`
- 🚧 **Second factor and audit** — as the vault's: required in production and staging, and every action filed under its
  submission on the audit chain — [Operator Console](/p/grade10-site/vault/operator-console#permissions)
- 🚧 **Staff hear nothing** — no email to staff; the badges, the tiles and the day's strip are the signal

<!-- story: the queue with its tiles, the hand-in runbook, the receive table -->

:::detail{title="Code map" for="engineer"}
- **Grants** — `packages/grading/contracts/src/permissions.ts` maps every
  admin procedure to its grant, the way the vault's does
- **Slices** — `packages/grading/admin-frontend/src/features/{queue,intake,batches,receiving,handback,notice}`;
  pages in the grade10 admin panel under `pages/grading`
- **Settings** — `grading_settings`, seeded from the defaults and read by
  every value above; the fee sheet and the diary services as their own records
- **Money** — one POS line per card, written back from the till's paid order
  by line; a payout on its own record
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
| Money at the till | Decided | Cards are counted in the console; the fee, the cover line, an upcharge, a refund and a storage fee are POS lines against the submission, written back by line | Product |
| Signed before any money moves | Decided | The till opens on the sealed agreement, and a refused or withdrawn line is refunded there | Product |
| No hand-in without a paid line | Decided | A sealed agreement with no paid line leaves the submission booked and the cards with the collector; the till is run again or another drop-off booked | Product |
| A batch is one grader and one level | Decided | It is what the grader invoices and ships back; a card that does not fit waits for the next | Product |
| A cert is held by one submission | Decided | A scan matching a cert already held elsewhere is refused by name, so a slab can never be handed to the wrong collector | Engineering |
| The upcharge is the sheet's | Decided | Receiving records the fee sheet's difference and reconciles the invoice against it; a gap between them is Commercial's | Product |
| Two people for money | Decided | A waiver, a payout and a money setting take a reason and a second `grading:approve` holder, never the recorder | Product |
| The notice is a counter act | Decided | A queue rung from day 180, a posting record with the date and tracking, the email the same day; the 30 days run from the posting; nothing after it in the first release | Product |
| One submission is one capability | Decided | The runbooks and the tabs are one screen at one address, so they are one spec, as the vault keeps one case inside its queue | Product |
| Staff notifications | Decided | The queue is the inbox; nothing is emailed to staff | Product |
| Drafts on the queue | ❓ Open | Whether a `planned` submission has a view of its own | Product |
| The safe's cap | ❓ Open | HKD 300,000 of declared value in the safe, ready slabs counted, refusing a hand-in past it; an operational cap that exists only because cover does not | Commercial, Legal |
| Every default a setting | ❓ Open | Each row of the settings table, adopted from the canvas until its owner confirms or changes it; pinned to a submission at booking and at signing | Operations, Commercial, Legal, Product |
| Buttons follow the machine | Decided | Each act shows only at the statuses the contract publishes, cancel never once the cards have left, and the worker refuses independently | Engineering |
| Counter intake | Decided | A walk-in books the customer-bookable visit and the cards are listed at the counter; the runbook is the same | Product |
| When the section opens to the shop | ❓ Open | Grading is off the public site and behind a grant in the console until launch; the change that opens it removes the hold in the same commit, once the readiness list is complete | Product |
:::
