# Grade10 Vault Digital Twin

Owner's notes for a Collect-style vault on Grade10: send a graded
collectible in, vault it at Crown Fine Art, show a digital twin in the
collector's portfolio. As of 2026-09-30. No OpenSpec change and no PRD mark
carries these yet. Read this as a proposal to the team, not as
requirements. Today's vault product is still shop custody with an optional
loan — [Vault](../prds/products/grade10-site/vault/index.md).

**Review surfaces**

- **Service flow** — Cursor canvas
  `canvases/vault-digital-twin-flow.canvas.tsx` (open beside chat)
- **Collector UI** — Storybook workbench (`pnpm run storybook:workbench`):
  - `Pages/Vault/Submit`
  - `Pages/Vault/Submission Confirmation`
  - `Pages/Vault/Intake Tracker`
  - `Pages/Vault/Portfolio`
  - `Pages/Vault/Item Detail`
  - `Pages/Vault/Request Retrieval`

## Settled Decisions

| Topic | Decision |
| --- | --- |
| Product shell | Same vault product; this pack details storage + twin, not a second name |
| Day-one job | Storage — send item in, vault at CFA, hold and track portfolio value |
| Ultimate job | Storage + list to auction |
| Loan / Grade10 Finance | Out of this pack; today's financed lane stays as shipped until a separate decision |
| Intake | Mail-in shipping and/or store drop-off, then transit to Crown Fine Art for intake, scan, and slot |
| Fees | Fee-based storage; limited free launch offer on day one |
| Valuation | Declared at submit → intake estimate → market feed later; every number names its source |
| Eligibility day one | Graded slabs only; raw near-term |
| Submission size | Multi-item manifest supported; day-one soft limit may be 1 |
| Retrieval | Pickup or ship (ops TBC) |
| Legal custodian | ❓ TBC (legal); diagrams assume Grade10 as bailee, CFA as facility |
| Auction pages | Not edited in this pack; list / Vault Verified / keep-in-vault stay Proposed on the flow only |
| Deep-zoom / 360 | Proposed, ops TBC; day one shows static HD front and back |

## Open Questions

- ❓ **Custodian on paper** — Grade10, CFA, or both; who is the named insured (legal)
- ❓ **Storage fee schedule** after the free launch offer ends — amount, cadence, per-item vs portfolio (ops / product)
- ❓ **Inbound courier and insurance** — carrier, who pays, declared-value caps (ops)
- ❓ **Outbound ship** for retrieval — fees and SLA (ops)
- ❓ **Price feed** for live market estimates — source and refresh (product / data)
- ❓ **Auction launch** — when Vault Verified listing and vault-to-vault transfer ship (product)
- ❓ **Day-one soft limit** on items per submission — 1 or open multi-item (ops)

## Conflict With Today's Vault

- **Today** — in-person visit, locker custody, optional loan; collector photos; release in person
- **This proposal** — send-in storage, professional scan twin, portfolio valuation, later auction liquidity
- **Auction PRDs** still list vault storage as out of scope; this pack does not reverse that in specs
- The team still chooses how loan and storage-first share one product name

## V1 Cut

**Inside day one**

1. Online submit (graded, multi-item capable)
2. Manifest PDF (packing slip + shipping label)
3. Ship or store drop-off → CFA intake, authenticate, HD scan, Vault Storage ID
4. Digital twin in My Vault Portfolio
5. Hold and track (declared / intake estimate)
6. Request retrieval (pickup or ship; ship ops TBC)

**Beyond the cut (Proposed)**

1. Live market price feed
2. List vaulted item to auction in one click
3. Vault Verified badge and keep-in-vault vs ship on auction checkout
4. Instant vault-to-vault ownership transfer after a win
5. Deep-zoom / 360 imaging
6. Raw / ungraded intake

## Asset Statuses

| Status | Who sees it | Meaning |
| --- | --- | --- |
| Draft | Collector | Form started, not submitted |
| Submitted | Collector | Manifest issued; waiting for package |
| In transit | Collector | Shipped toward Grade10 / CFA |
| At store | Collector | Dropped at a Grade10 store; awaiting facility transfer |
| Intake | Collector / ops | Facility received; checklist and cert check |
| Imaging | Collector / ops | Professional front/back scan |
| In Vault | Collector | Twin live; item in climate-controlled slot |
| Listed on Auction | Collector | Proposed — item listed from vault |
| Retrieval pending | Collector | Retrieval requested; not yet out |
| Out | Collector | Released from vault |

## Service Flow

### Phase 1 — Online submission

1. *Collector* — **Opens Submit to Vault** from account or vault entry
2. *Collector* — **Adds graded slab(s)** — set/name, grading company, cert number, declared insurance value; may add another item
3. *Collector* — **Chooses send method** — ship with prepaid label, or leave at a Grade10 store
4. *System* — **Issues a submission** with a unique QR / barcode and a Manifest PDF
5. *Collector* — **Prints the Manifest** — packing slip inside the box, shipping label outside when shipping

### Phase 2 — Send in

1. *Collector* — **Packs to the checklist** — team bag for slabs, bubble wrap, hard box, packing slip inside
2. *Collector* — **Hands to courier or drops at store**
3. *System* — **Shows In transit or At store** on the intake tracker

### Phase 3 — Intake, authentication, digitization

1. *Facility* — **Receives the package** and scans the packing-slip QR
2. *Facility* — **Runs the intake checklist** — cert / serial match, physical condition; staff sign-off on the slip fields
3. *Facility* — **Images front and back** in high resolution
4. *Facility* — **Assigns Vault Storage ID** and a physical slot
5. *System* — **Creates the digital twin** and moves status to In Vault
6. *System* — **Notifies the collector** — e.g. your item is now securely vaulted

### Phase 4 — In vault (day one)

1. *Collector* — **Sees the twin on Vault Portfolio** — scan, grade, estimate with source label, status badge
2. *Collector* — **Holds and tracks** — aggregate portfolio value from labeled estimates
3. *Collector* — **Requests retrieval** — pickup or ship (ship ops TBC)

### Phase 5 — Proposed liquidity

1. *Collector* — **Lists for auction** in one click with vault images and grading data prefilled
2. *Bidder* — **Sees Vault Verified** and Vault ID on the lot (auction pages not designed in this pack)
3. *Winner* — **Chooses keep in vault or ship home** at settlement (TBC)
4. *System* — **Transfers ownership digitally** when keep-in-vault; no physical move

## Manifest PDF

Serves as packing list (inside) and shipping label (outside).

1. **Packing slip**
   1. Unique submission QR / barcode
   2. Itemized inventory — name/set, grading company and cert, declared insurance value
   3. User identity — account email, contact phone
   4. Intake checklist — blank checkboxes for facility staff on open
2. **Shipping label and instructions**
   1. Pre-addressed courier label (e.g. SF Express)
   2. Security and packing checklist for the collector

## Notifications

| Moment | Message shape |
| --- | --- |
| Submitted | Submission confirmed; print Manifest and send |
| Received | Package received at store or CFA |
| Vaulted | Twin ready in portfolio |
| Retrieval | Updates while retrieval is pending and when out |

## Fees (proposal)

- **Storage** — fee-based after launch; free for a limited launch offer on day one
- **Intake** — ❓ TBC
- **Retrieval** — ❓ TBC (especially ship-out)

## Non-Goals For This Pack

- OpenSpec change or `/workflow-plan`
- PRD 🚧 marks on vault or auction pages
- Edits to auction listing or winner-order Storybook pages
- Durable `@grade10/ui` vault block export contract
- Loan / Finance lane redesign
- Real PDF generation or courier API wiring
