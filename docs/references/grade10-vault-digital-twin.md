# Grade10 Vault Digital Twin

Owner's notes for a Collect-style vault on Grade10: optional online booking
on Book a Visit (`grade10.com/book`), or walk-in; staff registers the
collectible at the counter, the collector signs custody, and a digital twin
lands in the portfolio. As of 2026-10-05. No OpenSpec change and no PRD mark
carries these yet. Read this as a proposal to the team, not as
requirements. Today's vault product is shop custody with an optional loan —
[Vault](../prds/products/grade10-site/vault/index.md).

**Review surfaces**

- **Service flow** — Cursor canvas
  `canvases/vault-digital-twin-flow.canvas.tsx` (open beside chat)
- **Collector UI** — Storybook workbench (`pnpm run storybook:workbench`):
  - `Pages/Appointment/Book Visit`
  - `Pages/Appointment/Confirmation`
  - `Pages/Appointment/Appointments`
  - `Pages/Submissions`
  - `Pages/Submissions/Item Card`
  - `Pages/Vault/Portfolio`
  - `Pages/Vault/Item Detail`
  - `Pages/Vault/Request Retrieval`

## Settled Decisions

| Topic | Decision |
| --- | --- |
| Product shell | Same vault product; this pack details storage + twin, not a second name |
| Day-one job | Storage — arrive at a shop (booked or walk-in), vault, hold and track portfolio value |
| Ultimate job | Storage + list to auction |
| Loan / Grade10 Finance | Out of this pack; today's financed lane stays as shipped until a separate decision |
| Online booking | Optional — **Book a Visit** (`grade10.com/book`) at the Hong Kong Grade10 Store, 13 Pak Sha Road, Causeway Bay. Services on the page: card grading, vault drop-off, collection consultation |
| Pre-book declaration | None — answers and notes are a reference for the desk, not an intake record |
| Confirmation | On-screen `BookingConfirmation`, plus email, calendar file, and a manage link — [Book a Visit](../prds/products/grade10-site/appointment/booking.md) |
| Where to check | **Appointments** — signed-in cards (`grade10.com/book/mine`); the mail manage link (`grade10.com/book/manage#<secret>`) opens that visit on the same page. Not the intake tracker |
| Cancel / move | Yes, while the visit is live, up to the slot; closed visits offer nothing |
| Upcoming visits | One live vault diary booking per email. A second upcoming vault booking is refused and names the visit already held |
| Intake vs a new booking | Intake does not block booking. After the visit is used or cancelled, another drop-off can be booked while earlier items are still incoming |
| Walk-in | Allowed; the visitor may not have a Grade10 account yet |
| Intake start | When staff registers the item at the counter (booked or walk-in) |
| Submissions | Collector **item list** after registration — status and vault actions on each row; hand-in / submission id is meta on the item, not a submission detail page |
| Custody consent | Sign at the visit to put the collectible in the vault |
| Drop-off and retrieval | The Hong Kong Grade10 Store, Causeway Bay only; no shipping on day one |
| Fees | Fee-based storage; limited free launch offer on day one |
| Valuation | Declared at counter registration → intake estimate → market feed later; every number names its source |
| Eligibility day one | Raw and graded; not limited to TCG — the inventory register's ten categories |
| Items per visit | Multi-item supported; day-one soft limit may be 1 |
| Legal custodian | ❓ TBC (legal); diagrams assume Grade10 as bailee, CFA as facility |
| Auction pages | Not edited in this pack; list / Vault Verified / keep-in-vault stay Proposed on the flow only |
| Deep-zoom / 360 | Proposed, ops TBC; day one shows static HD front and back |

## Open Questions

- ❓ **Custodian on paper** — Grade10, CFA, or both; who is the named insured (legal)
- ❓ **Storage fee schedule** after the free launch offer ends — amount, cadence, per-item vs portfolio (ops / product)
- ❓ **Price feed** for live market estimates — source and refresh (product / data)
- ❓ **Auction launch** — when Vault Verified listing and vault-to-vault transfer ship (product)
- ❓ **Day-one soft limit** on items per visit — 1 or open multi-item (ops)
- ❓ **Mail-in and ship-home** — when courier intake and retrieval ship (ops / product)
- ❓ **Counter registration steps** — exact staff ceremony after arrival (ops)
- ❓ **Walk-in account / KYC** — how staff create or link an account before signing (ops / product)
- ❓ **Service slug** on `/book` for vault drop-off (product)
- ❓ **Reminder lead** — one day by default; same-day drop-off may want an hour (product)

## Conflict With Today's Vault

- **Today** — in-person visit, locker custody, optional loan; collector photos; release in person; signing on the shop iPad
- **Today's diary** — `Vault visit` is bound to a vault case and is not listed on `/book`
- **This cut uses** Book a Visit for optional vault drop-off at Causeway Bay, and counter signing for storage-only intake
- **This cut still differs** — lists vault drop-off as a customer-bookable service; digital twin, portfolio valuation, later auction liquidity; loan stays out of this pack; intake tracking starts at counter registration, not at booking
- **Auction PRDs** still list vault storage as out of scope; this pack does not reverse that in specs

## V1 Cut

**Inside day one**

1. Optional: book vault drop-off on Book a Visit (diary) and read what to prepare — or walk in
2. At the store: staff registers the item (create or link account if needed)
3. Staff pre-check; collector signs custody at the visit
4. HD scan, Vault Storage ID, twin in My Vault Portfolio
5. Hold and track (declared / intake estimate)
6. Request retrieval — pickup at the store
7. Book another drop-off whenever no upcoming vault visit is held — even while earlier items are incoming

**Beyond the cut (Proposed)**

1. Mail-in shipping, prepaid labels, Manifest courier slip
2. Ship-home retrieval
3. Live market price feed
4. List vaulted item to auction in one click
5. Vault Verified badge and keep-in-vault vs ship on auction checkout
6. Instant vault-to-vault ownership transfer after a win
7. Deep-zoom / 360 imaging

## Asset Statuses

Intake statuses begin when staff registers the item. A visit booking alone
does not create a row here. Incoming statuses do not consume the diary.

| Status | Who sees it | Meaning |
| --- | --- | --- |
| Registered | Collector / ops | Staff registered the item at the counter |
| Pre-check | Collector / ops | Staff checking condition |
| Signing | Collector / ops | Custody agreement open on the counter |
| Imaging | Collector / ops | Professional front/back scan |
| In Vault | Collector | Twin live; item in climate-controlled slot |
| Listed on Auction | Collector | Proposed — item listed from vault |
| Retrieval pending | Collector | Pickup requested; not yet out |
| Out | Collector | Released at the store |

Visit booking (when used) is managed as a diary visit on Book a Visit, not as
an asset status.

## Service Flow

### Phase 1 — Optional online booking

1. *Collector* — **Opens Book a Visit** at `grade10.com/book` (optional), vault drop-off preselected from the portfolio
2. *Collector* — **Picks a service, then a free slot** at the Hong Kong Grade10 Store, 13 Pak Sha Road, Causeway Bay — name and email; notes for the desk only; no item declaration; no stepper
3. *System* — **Confirms the visit** — on-screen confirmation, email, calendar file, manage link
4. *Collector* — **Moves or cancels** on Appointments — each booking is a card; the mail manage link opens that visit
5. *Collector* — **May instead walk in** with no booking and no account yet

### Phase 2 — Counter registration, pre-check, sign

1. *Collector* — **Arrives** at the shop (booked slot or walk-in)
2. *Staff* — **Registers the item** — category, raw or graded, facts, declared value; create or link account if needed — intake tracker starts here; the diary visit completes
3. *Staff* — **Pre-check** — identity of the item, physical condition, cert match when graded
4. *Collector* — **Signs** the custody agreement on the shop iPad (`grade10.com/vault/sign#<token>`) to put the item in the vault
5. *System* — **Records the signature** and moves status toward vaulting

### Phase 3 — Digitization

1. *Facility* — **Images front and back** in high resolution (after the visit; CFA is the long-term store)
2. *Facility* — **Assigns Vault Storage ID** and a physical slot
3. *System* — **Creates the digital twin** and moves status to In Vault
4. *System* — **Notifies the collector** — e.g. your item is now securely vaulted

### Phase 4 — In vault (day one)

1. *Collector* — **Sees the twin on Vault Portfolio** — scan, grade or raw, estimate with source label, status badge
2. *Collector* — **Holds and tracks** — aggregate portfolio value from labeled estimates
3. *Collector* — **May book another drop-off** — intake in progress does not lock `/book`
4. *Collector* — **Requests retrieval** — pickup at the Hong Kong Grade10 Store, Causeway Bay; no shipping on day one

### Phase 5 — Proposed liquidity

1. *Collector* — **Lists for auction** in one click with vault images and grading data prefilled
2. *Bidder* — **Sees Vault Verified** and Vault ID on the lot (auction pages not designed in this pack)
3. *Winner* — **Chooses keep in vault or ship home** at settlement (TBC)
4. *System* — **Transfers ownership digitally** when keep-in-vault; no physical move

## Categories

Day one takes the register's ten: trading card, comic, coin, banknote, stamp,
bullion, watch, jewellery, memorabilia, other —
[Items](../prds/products/grade10-admin/inventory/items.md).

## Notifications

| Moment | Message shape |
| --- | --- |
| Visit booked | Shop, slot, what to prepare, calendar file, manage link (visit only — not intake) |
| Visit moved / cancelled | Updated or withdrawn calendar file |
| Reminder | Once, ahead of the visit, at the service's lead |
| Registered | Item on the intake tracker after counter registration |
| Vaulted | Twin ready in portfolio |
| Retrieval | Pickup booked; item out at the store |

## Fees (proposal)

- **Storage** — fee-based after launch; free for a limited launch offer on day one
- **Intake** — ❓ TBC
- **Retrieval** — ❓ TBC (pickup; ship-home is Proposed)

## Non-Goals For This Pack

- OpenSpec change or `/workflow-plan` (including listing Vault on `/book`)
- PRD 🚧 marks on vault or auction pages
- Edits to auction listing or winner-order Storybook pages
- Durable `@grade10/ui` vault block export contract
- Loan / Finance lane redesign
- Real booking API, courier API, or account-at-counter product
- Multiple upcoming vault visits under one email
- Mail-in or ship-home on day one
