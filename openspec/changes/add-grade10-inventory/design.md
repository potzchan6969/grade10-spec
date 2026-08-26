## Context

Grade10 has no house stock ledger. Auction already has a thin `products`
identity used when minting a listing, and Shopify owns storefront catalogue
quantity — neither is an operator-facing per-unit inventory for house stock.
See [proposal.md](proposal.md). Capability:
[`grade10-inventory/catalog`](specs/grade10-inventory/catalog/spec.md).
Screens: [ui.md](ui.md).

Conventions this design follows: `docs/conventions/packages.md`,
`docs/conventions/backend.md`, `docs/architecture/multi-product.md`,
`docs/architecture/security.md` in the grade10 monorepo.

## Goals / Non-Goals

**Goals:**

- Ship a Grade10-only inventory worker and admin console for products and
  serialized units, with remaining available count and change history.
- Use **channel-tied** unit statuses so a sold (or listed) unit records
  which service moved it — Auction now (`auction-listing` /
  `auction-sold`), Store or others later (`store-sold`, …) without a
  channel-blind `sold`.
- Record **every** successful product/unit mutation (platform audit +
  domain changelogs); reuse elevated-procedure audit and existing admin
  table/editor patterns.

**Non-Goals:**

- Auction listing editor `productId` wiring (seam documented below only).
- Shopify inventory sync or ZZZ inventory.
- New design-system or `@grade10/ui` components.

## Decisions

### Package and worker layout

Place the product under `packages/inventory/{contracts,backend,admin-frontend}`
publishing `@grade10/inventory-contracts`, `@grade10/inventory-service`, and
`@grade10/inventory-admin-frontend`. Thin worker at
`apps/backend/grade10/inventory` (factory + migrations + wrangler), matching
auction/vault assembly. Register service id `inventory` in
`packages/app-env` `ServiceId` / `BRAND_SERVICES.grade10` only; bind
`INVENTORY_SERVICE` on `apps/backend/grade10/api`.

**Rejected:** `packages/grade10-inventory` — newer domains (`vault`,
`loyalty`, `appointment`) use unprefixed directory names; npm already scopes
`@grade10/`. **Rejected:** embedding inventory inside the auction worker —
stock outlives any one channel and must stay reusable.

### Serialized units, not a quantity column

`inventories` (domain: inventory units) stores one row per physical item.
“Add with quantity N” inserts N rows sharing `productId` with distinct ids.
There is no quantity column on product or unit.

**Rejected:** a single row with `quantity` — cannot reserve or sell one unit
independently, and breaks the future Auction-per-unit seam.

### Channel-tied unit status

Status vocabulary in this change:
`available` | `auction-listing` | `auction-sold` | `withdrawn`.

Remaining available count = units in `available` only.

Pattern for later channels (Store not confirmed): add
`{channel}-listing` / `{channel}-sold` (e.g. `store-sold`) to the same enum
when that channel ships — do **not** collapse back to a bare `sold`.

**Future Auction mapping (not built here):** listing committed / live →
`auction-listing`; sale settled → `auction-sold` (with price/currency);
call-off or release → back to `available` or `withdrawn` as Auction
decides. Listing editor will later accept a `productId` (and eventually a
unit id).

**Rejected:** channel-blind `available` | `reserved` | `sold` | `withdrawn`
— a later Store (or other) sale path would overwrite *how* the unit sold;
ops and reconciliation need the channel in the status.

### Sold money only on sold statuses

`soldPrice` (integer minor units > 0) and `soldCurrency` (ISO 4217) are both
non-null iff status is a sold status (`auction-sold` in this change);
otherwise both null. Enforced in contracts and service writes. When a new
`{channel}-sold` status is added, the same money rule applies to it.

### Change history vs `@grade10/audit`

**Both layers — every successful mutation, no silent paths:**

1. **Platform audit** — every admin mutation goes through
   `elevatedProcedure("inventory:…")` and appends to the worker’s
   `audit_logs` chain via `@grade10/postgres` audit helpers, same as auction.
   The merged admin Audit section gains an `inventory` chain entry. A write
   that skips the elevated ladder is a bug.
2. **Domain change history** — a product-owned append-only `changelogs` table
   records **every** successful create/update/delete on products and units —
   operator elevated writes **and** server-driven updates — with actor =
   user id **or** `server`, subject kind/id, action, and details. Admin and
   services query this for per-entity history. Automated
   `auction-listing` / `auction-sold` paths that never hit an elevated
   operator call still leave a changelog trail.

**Invariant:** if a product or unit row changes successfully, at least one
changelog row is written in the same transaction. Operator writes also
append `audit_logs`. Failed / refused writes append neither.

**Why not audit alone:** `@grade10/audit-contracts` list input has no
subject filter (cursor + limit only), details is mutation-input JSON keyed
for the elevated call, and server-driven updates are not elevated operator
actions. Audit remains the compliance chain; changelogs are the entity
ledger the inventory console and future channel hooks need.

**Rejected:** changelogs without `audit_logs` — would skip the elevated
ladder required by `docs/architecture/security.md`. **Rejected:** audit-only
or optional changelog on “important” actions — product requires each action
recorded. **Rejected:** extending shared audit list filters in this change —
out of scope for a new product.

### RBAC admin-only

Add `inventory: ["read", "write"]` to `PERMISSION_STATEMENTS`. Do **not** add
those grants to `staff`, `support`, `treasurer`, or `auditor`. `admin`
receives them via `ALL_PERMISSIONS`. Section door: `inventory:read`; writes
use `inventory:write`. Durable `shared-auth/roles` is already behind the
implementing repo (missing treasurer/vault); this change does not rewrite
that map — grants live in auth contracts and are pinned by inventory
procedure permission maps.

### Admin composition

Brand pages under `apps/admin/grade10/src/pages/inventory/` compose hooks from
`@grade10/inventory-admin-frontend`, mirroring auction `ListingsPanel`: app
owns table chrome; package owns DI feature slices and fixtures. No new
`@grade10/ui` exports.

### Data model (persistence)

Schema lives in `@grade10/inventory-service` (backend package); migrations in
`apps/backend/grade10/inventory/src/db/migrations`.

- **products** — id, name, description, created_at, updated_at, created_by,
  remarks.
- **inventories** — id, product_id (FK), name, added_by, created_at,
  updated_at, status, sold_price (nullable int), sold_currency (nullable),
  remarks.
- **changelogs** — id/seq, at, actor (`userId` string or `server`), subject
  kind, subject id, action, details (canonical JSON text). Append-only;
  prefer DB triggers that block UPDATE/DELETE like audit, without requiring
  the cryptographic hash chain (that stays on `audit_logs`).
- **audit_logs** — standard per-worker chain.

Deletes of units are hard deletes of eligible rows (`available` /
`withdrawn` only), with a changelog entry written in the same transaction
before delete.

### API surface (admin procedures)

Illustrative procedure map (exact paths pinned in contracts):

| Procedure | Permission | Behaviour |
| --- | --- | --- |
| `products.list` | read | Products + remaining available count |
| `products.get` | read | Product + units summary |
| `products.create` / `products.update` | write | Product writes |
| `products.remainingCount` | read | Available count for product id |
| `inventories.listIds` | read | Unit ids for product id |
| `inventories.list` | read | Units for product (admin detail) |
| `inventories.add` | write | Quantity N create |
| `inventories.update` / `inventories.delete` | write | Unit edit / eligible delete |

Internal service helpers (not public admin API in this change) mark units
`auction-listing` / `auction-sold` / release for future Auction; they append
changelogs with actor `server`.

### Auction seam (document only)

| Later work | This change |
| --- | --- |
| Listing editor selects `productId` | Not implemented |
| Bind listing ↔ unit id | Not implemented |
| Listing lifecycle → unit status | Vocabulary reserved only |

Auction’s existing thin product table stays Auction-local until a follow-on
explicitly migrates or dual-writes; do not silently share tables across
workers.

## Alternatives considered

| Alternative | Why rejected |
| --- | --- |
| Quantity column on product | Cannot treat units independently |
| Channel-blind `reserved` / `sold` | Hides whether Auction, Store, or another service sold the unit |
| Audit-only or selective history | No subject filter; product requires every action recorded |
| Inventory inside auction worker | Blocks reuse; wrong service boundary |
| Staff read access | User asked admin-only for now |

## Risks / Trade-offs

- **Two history stores** — operators may look at Audit vs inventory changelog
  for different questions; document in admin copy later if confusing.
- **Hard unit delete** — `auction-sold` / `auction-listing` protected;
  `available` / `withdrawn` removable. If ops need tombstones later, add
  soft-delete in a follow-on.
- **Quantity cap 500** — protects a single transaction; large intakes need
  multiple adds.
- **Stale shared-auth roles spec** — implement against auth contracts in
  grade10; archive/sync of roles vocabulary is separate work.

## Migration Plan

Greenfield Neon database for `grade10-inventory` (dev/staging/production).
No backfill from Auction products. Deploy order: inventory worker after auth,
before or with admin frontend; API gateway binding required before admin
calls succeed.

## Open Questions

None that change specs, approach, or task breakdown. Authoritative answers
from product feedback: channel-tied statuses (`auction-listing` /
`auction-sold`, extensible per channel), every mutation recorded (audit +
changelogs), admin-only, quantity = N rows, sold money only on sold
statuses, package path `packages/inventory`. Store channel status labels
remain deferred until Store sales are confirmed.
