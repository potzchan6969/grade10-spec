## Context

Inventory already owns product classifications, typed product attributes,
schema revisions, aggregate stock, Cert ID allocation records, and inventory
history. Its admin API uses authenticated tRPC procedures and service-owned
Drizzle transactions. Schema editing already has save-draft, compatibility
review, and publish operations. The current CSV product import is a separate
PriceCharting workflow with provider-specific preview tables and a 500-row
limit; it remains unchanged.

The implementation shares one new catalog-import boundary across the schema
manifest, product-entry, and inventory flows, while keeping their commit
operations separate. The full contract is in the
[catalog spec](specs/grade10-admin/inventory/catalog/spec.md) and
[listing spec](specs/grade10-admin/auction/listing/spec.md).

## Goals / Non-Goals

**Goals:**

- Reuse the existing product schema lifecycle and typed-attribute validators.
- Keep workbook parsing, row validation, identity matching, and atomic writes
  deterministic and reviewable.
- Preserve one copy-fact record per included inventory row, including RAW rows
  without a Cert ID.
- Keep PriceCharting product import and existing aggregate inventory behavior
  intact.

**Non-Goals:**

- Change auction allocation rules for the explicit `No Cert ID` choice.
- Infer product taxonomy or create tags from source labels.
- Store or rewrite the uploaded workbook after its normalized rows are staged.

## Decisions

The catalog spec governs the product hierarchy, card template, schema
manifest, product and inventory uploads, and copy-level facts. The listing
spec governs explicit inventory-unit selection and display. The implementation
uses the existing Inventory service and database as the write boundary; the
browser never writes directly to storage, and Auction continues to receive
opaque Inventory record ids through its existing binding.

- **Schema management** — Extend the existing Product Schemas admin surface
  with a shared card-template action and manifest upload. A template definition
  is a validated set of shared attribute keys; applying it to a workbook source
  classification key uses the same Category + Year + Set group rule and
  per-product signature overrides as the product uploader. The resolved key
  must select one existing IP, Item, and Category tuple. Each mapping produces
  its own draft schema revision by
  calling the same validators and persistence helpers as `saveProductSchemaDraft`.
  The importer never publishes. The existing compatibility review and publish
  procedures remain the only route to an active revision.
- **File decoding** — Add one shared CSV/XLSX decoder to the inventory admin
  frontend, with an explicit XLSX parser dependency. It reads all non-empty
  sheets, keeps the sheet name and one-based source row, and emits canonical
  JSON rows. CSV uses the same header and cell-normalization path. Enforce a
  10 MiB source-file limit, 2,000 data-row limit, and 24-hour preview lifetime;
  these limits admit the supplied 1,162-row workbook as one batch. Reject
  malformed files and unsupported file types before creating an import
  session. Server-side validators treat browser output as untrusted input.
- **Category mapping** — Keep workbook Category labels as source references,
  never taxonomy. The effective mapping key is the complete normalized source
  product signature: Category, Year, Set, Item, Subject, Card Number, and
  Variety. This lets different IPs, sets, and products under `TCG Cards` map
  to different existing tuples. The UI may offer a Category + Year + Set group
  action, but applies it only after the admin chooses one tuple for that whole
  group; each product signature can override it. If one source signature
  cannot identify a single target tuple, require a per-product mapping and
  block commit until resolved. Never apply Category alone when it covers
  multiple source identities or target tuples. Each resolved mapping selects
  existing IP, Item, and Category tags; no tag is inferred or created. The
  workbook Item value maps to `products.name`; it never selects the Grade10
  Item tag. Reuse the same mapping component for schema, product, and
  inventory flows.
- **Workbook headers** — Product-entry upload maps `Item` to product name and
  `Year`, `Set`, `Subject`, `Card Number`, and `Variety` to the corresponding
  card-schema fields; `Category` remains a source label for the explicit tag
  mapping. Inventory upload uses those same product identity fields plus
  `Cert Number` → Cert ID, `Grade Issuer`, `Grade`, `Autograph Grade`, and
  `Serial` as copy facts. `Item Status` drives the include decision. Ignore
  `My Cost`, `PSA Estimate`, `Gain/Loss`, `My Value`, `Date Acquired`,
  `Source`, `My Notes`, `Vault Status`, `Vaulted Date`, `Days Vaulted`,
  `Listing Status`, `Listing Date`, `Listing Price`, `Sold Status`, `Sold On`,
  `Sold Date`, `Sold Price`, `Sold Fees`, `Sold Proceeds`, and `Payment Date`.
  The decoder reads a copy of the uploaded file, stages only normalized rows,
  and never modifies or writes back to the source workbook.
- **Workbook normalization** — Trim surrounding whitespace from every mapped
  header and value while preserving case and internal characters. A blank
  cell or standalone hyphen `-` becomes absent. Parse `Year` as a finite
  number; keep `Card Number`, `Cert Number`, `Grade`, `Autograph Grade`, and
  `Serial` as text. Missing required `Item`, `Year`, `Set`, or `Subject` then
  fails product validation. Canonicalize known Grade Issuer values
  case-insensitively to `PSA`, `BGS`, `CGC`, or `RAW`; preserve an unknown
  issuer's trimmed spelling. Trim Cert Number but otherwise preserve its
  characters and case for uniqueness checks. A RAW copy must have no Cert
  Number; any supplied value is a row error. Every non-RAW graded copy must
  have a Cert Number; a missing issuer blocks the row until corrected. This
  matches the source list's 23 RAW rows without Cert Numbers and retains
  free-form text such as grade `Pristine 10` or `10 (BL)` without coercion.
- **Schema manifest** — Normalize a manifest row to a source classification
  key, stable attribute key, data type, required flag, labels, validation JSON,
  select options, and optional display order. Resolve source keys through the
  same Category + Year + Set group rules and full product-signature overrides
  used by product import. A Category-only key cannot fan out across multiple
  tuples; split it with additional source fields or product overrides. The
  preview joins repeated attribute definitions by stable key, rejects
  conflicting definitions, and reports invalid rows before commit. One
  admin-selected template can fan out to several explicitly mapped tuples.
  Commit locks the affected tuples in stable order, rechecks tag and key
  definitions, and writes all keys and draft revisions in one transaction.
  Draft revision persistence is shared with the editor; a failure creates no
  partial keys or revisions.
- **Product-entry import** — Add a separate catalog import service rather than
  extending the PriceCharting provider workflow. Validate names, exact tag
  tuples, published schemas, and typed attribute values with existing schema
  validators. Group repeated rows by a canonical identity consisting of the
  trimmed, case-sensitive product name, exact IP + Item + Category ids, and
  the stable-key-sorted canonical typed attribute map. Repeated identical rows
  resolve to one product. Same-name rows with a different tuple or attribute
  value remain distinct products; a name-only duplicate check must not merge
  them. Reuse exactly one matching existing product, create one draft when
  there is no match, and block a row when more than one existing product has
  the same identity. Different schema values remain distinct even when the
  name and tuple match. New drafts use the existing product, classification,
  inventory-zero, typed-attribute, and changelog persistence primitives. The
  admin marks valid drafts `created` through the existing status operation.
  Product commit never creates stock or unit records.
- **Product identity concurrency** — The existing single-product path rejects
  duplicate names globally, but product names are not unique in the database
  and the catalog contract permits same-name products with different tuples
  or schema values. Replace that service-level name-only rejection in
  `createProductRecord` with an exact-identity lookup. A manual create refuses
  only an existing non-deleted product with the same trimmed name, exact tag
  tuple, and canonical schema-value map; a different Card Number or Set is a
  separate product. If a manual create matches one existing identity, keep the
  existing duplicate-product refusal; the import path reuses that product.
  No unique name index or denormalized fingerprint is added because typed
  values are normalized across schema tables. Both create paths acquire a
  transaction-scoped advisory lock keyed by normalized name before querying
  candidates and writing. Bulk commit acquires distinct name locks in sorted
  order and rechecks identity under lock. This serializes create races while
  preserving the required composite identity.
- **Inventory import** — Keep it as a second, independent session and commit.
  Resolve each included row against exactly one `created` product by exact
  mapped tuple, trimmed product name, and canonical supplied schema values.
  Excluded rows do not participate in matching or duplicate checks. `Active`
  Item Status rows start included; blank status rows remain unresolved until
  the admin chooses include or exclude. Preserve the selected row decisions
  with the preview. Each included row creates one per-copy record and
  increments stock by one. A RAW row must not have a Cert ID; its Grade Issuer
  and other copy facts still persist on that record. Existing aggregate
  counters remain the authority for `No Cert ID` reservations.
- **Auction listing identity** — Replace product-wide live-listing uniqueness
  for certified units with a unique live listing per `inventory_cert_id`.
  Distinct Cert IDs belonging to one product can therefore be listed at once;
  a held Cert ID cannot be reused. Keep the existing product-wide uniqueness
  for the aggregate `No Cert ID` listing.
- **Import sessions** — Use new generic `catalog_import_sessions` and
  `catalog_import_rows` tables for `schema-manifest`, `product-entry`, and
  `inventory` sessions. Do not reuse the PriceCharting preview tables because
  their candidate-confirmation contract is provider-specific. Persist the
  actor, kind, source row coordinates, normalized input, validation findings,
  selected mappings and include decisions, payload hash, expiry, status, and
  commit result ids. Stage writes after preview, never the original file.
  Commit locks the session row, verifies its actor, kind, expiry, payload hash,
  and readiness, then revalidates live schemas, classifications, product
  status, and duplicates. A committed session returns its stored result on
  retry; an expired or changed session cannot be committed.
- **Inventory transaction** — Sort resolved inventory ids, lock every
  inventory row, then recheck Cert ID uniqueness and the preview’s product
  matches. In one transaction, insert all copy records, update stock and
  unidentified-stock counters, and append one intake changelog entry per
  affected inventory with its before/after snapshots and imported unit ids.
  The partial unique Cert ID index is the final race guard. Any failed row,
  changed product, duplicate Cert ID, or constraint conflict rolls back the
  whole upload.
- **UI and service seams** — Keep file selection, source-to-tag mapping,
  row-level preview, and confirmation in Inventory admin frontend features.
  Add authenticated procedures for manifest preview/commit, product-entry
  preview/commit, and inventory preview/commit. Services own session state,
  domain validation, rechecks, lock ordering, and transactions; repositories
  own Drizzle reads and writes. The existing schema workspace and product
  status hooks remain the source for review and status changes.

## Database Schema

Inventory owns product, schema, import-session, copy-fact, aggregate-count,
Cert ID allocation, and changelog rows. Product matches and available counts
are read from these authoritative tables; previews are short-lived staged
inputs and never become catalog truth.

| Table | Change | PostgreSQL type / nullability / default |
| --- | --- | --- |
| `inventory.inventory_cert_ids` | Add per-copy facts; model the RAW/graded Cert ID invariant | `cert_id text NULL`; `grade_issuer text NULL`; `grade text NULL`; `autograph_grade text NULL`; `serial text NULL`; retain `id text` PK, `inventory_id text NOT NULL`, `status text NOT NULL DEFAULT 'available'`, and `created_at timestamptz NOT NULL DEFAULT now()`; add a check forbidding a Cert ID when `upper(trim(grade_issuer)) = 'RAW'`; import validation requires issuer `RAW` with no Cert ID or a non-RAW grading issuer with a Cert ID |
| `inventory.inventory_cert_ids` | Replace unconditional pair index with nullable-safe uniqueness | Unique `(inventory_id, cert_id)` where `cert_id IS NOT NULL`; keep inventory lookup index |
| `inventory.catalog_import_sessions` | New staged import header | `id text` PK; `kind text NOT NULL`; `status text NOT NULL DEFAULT 'previewed'`; `created_by text NOT NULL`; `payload_hash text NOT NULL`; `row_count integer NOT NULL`; `result jsonb NULL`; `expires_at timestamptz NOT NULL`; `created_at timestamptz NOT NULL DEFAULT now()`; `committed_at timestamptz NULL` |
| `inventory.catalog_import_rows` | New staged rows and source references | `import_id text NOT NULL` FK with cascade; `row_number integer NOT NULL`; `source_sheet text NOT NULL`; `input jsonb NOT NULL`; `validation_errors jsonb NOT NULL DEFAULT '[]'`; `resolved_product_id text NULL`; PK `(import_id, source_sheet, row_number)` |

`inventory.products`, `product_classifications`, `product_attributes`,
`product_schemas`, and `product_schema_revisions` remain the source of truth for
product identity and schema data. `inventory.inventories` remains authoritative
for aggregate stock and reservation counts. A unit record's Cert ID and facts
are authoritative for that copy; a non-null Cert ID is also the opaque unit
choice used by reservations. A null Cert ID is not addressable as an Auction
unit and remains on the aggregate `No Cert ID` path.

```text
products 1──1 product_classifications
    │
    ├──* product_attributes
    ├──1 inventories 1──* inventory_cert_ids (one imported physical copy per row)
    │                    └──* reservations (numbered holds by opaque record id)
    └──1 product_schemas 1──* product_schema_revisions

catalog_import_sessions 1──* catalog_import_rows
```

The expand migration drops no existing copy or import data. Convert
`inventory_cert_ids.cert_id` to nullable, add the four copy-fact columns, and
replace its index in one Inventory migration. Existing non-null Cert ID rows
keep their ids and status. New import tables have bounded row-count and state
checks, cascade from session to staged rows, and an expiry index. The imported
product identity is deliberately resolved through the existing classification
and attribute rows rather than a second denormalized identity column.

## Service Interfaces

Each entrypoint derives the actor from authenticated staff context. The file
decoder supplies source coordinates and normalized cell values; services
validate every input again and never trust client validation results.

| Processor | Fixed input | Success / refusal |
| --- | --- | --- |
| Preview schema manifest | actor, source rows, explicit source-label-to-tuple mappings | session id, per-row findings, tuple and attribute preview / unsupported file, mapping, type, key, or manifest conflict |
| Commit schema manifest | actor, session id, payload hash | all draft revision ids / expired, changed, invalid, incompatible-key, or stale-tuple refusal |
| Preview product entries | actor, source rows, exact tuple mappings | session id, each row's typed values and existing-product match / missing mapping, missing schema value, invalid value, or ambiguous identity |
| Commit product entries | actor, session id, payload hash | distinct product ids and created/reused counts / expired, stale schema, duplicate identity, or any row failure |
| Preview inventory units | actor, source rows, tuple mappings, blank-status decision | session id, include/exclude state, exact product match, and copy facts per row / unresolved status choice, missing or ambiguous product, or invalid unit facts |
| Commit inventory units | actor, session id, payload hash | affected inventory snapshots, unit ids, and history ids / expired, stale product, duplicate Cert ID, inventory conflict, or any row failure |

Previews write only session and row records in a short transaction after
validation. The three commits each own one transaction and follow the same
outer order: lock the session row; verify actor, kind, expiry, and payload
hash; load staged rows; revalidate all inputs against live database state;
acquire sorted identity locks; perform all domain writes; save the session
result and committed timestamp; commit. Validation or persistence failure
rolls back every domain write and leaves the session retryable only when no
data changed. A second commit after success reads the stored result without
replaying writes.

Product identity lookup first narrows candidates to non-deleted products with
the same exact classification ids and trimmed, case-sensitive name, then
hydrates their attributes and compares the complete key set from that
product's published revision. Canonical values contain one entry for every
assigned schema key; an omitted optional value is explicit `null`, numbers
use the schema number representation, and select values use stable option
keys. Attributes outside that published revision do not participate. One
exact candidate is reused by import; no candidate creates a draft; multiple
exact candidates produce an ambiguous-identity error and block the batch.
The same lookup in `createProductRecord` returns the existing duplicate-product
refusal for one candidate. No global name uniqueness check remains.

The import uses a name-scoped transaction advisory lock for every distinct
normalized name in sorted order, then re-queries products and attributes
before deciding to reuse, create, or reject an ambiguous identity. Manual
`createProductRecord` resolves the exact tuple and schema values, takes the
same lock before its identity lookup and write, and no longer rejects a name
solely because another product uses it. The session's committed result makes
retries idempotent; a later upload with the same exact identity finds and
reuses the existing product.

Inventory commit groups rows by resolved inventory id and locks those
inventories in sorted order before its first domain write. For each group it
rechecks the product remains `created`, validates row identity, and queries
existing Cert IDs after trimming. It also requires a Grade Issuer for every
included copy, rejects a Cert ID on `RAW`, and requires one for every non-RAW
graded copy. It batches unit inserts, counter updates,
and one append-only changelog per affected inventory. Unique-index violations
are translated to the same duplicate-Cert-ID row error returned by preview;
the transaction rolls back rather than accepting partial stock.

The existing manual intake service continues to support aggregate quantity
and optional Cert ID records. It calls the same unit-row repository with
empty copy facts for supplied Cert IDs. Ordinary unnumbered intake remains
aggregate-only. The existing PriceCharting preview, confirmation, and commit
procedures and their tables are not routed through the new catalog importer.

## API Contracts

- Add authenticated schema-manifest preview and commit procedures; commit
  creates draft revisions only. Existing schema review and publish procedures
  remain unchanged.
- Add authenticated product-entry preview and commit procedures, distinct
  from the PriceCharting `productImport` router.
- Add authenticated inventory-unit preview and commit procedures. Inventory
  input rows carry optional `certId`, `gradeIssuer`, `grade`,
  `autographGrade`, and `serial`, plus the explicit row decision for blank
  Item Status. Preview requires Grade Issuer, prohibits Cert ID for `RAW`,
  and requires Cert ID for any other grading issuer.
- Change the internal Cert ID record contract so `certId` is nullable and
  copy-level facts are returned on inventory-unit reads. Reservation APIs
  continue to accept the opaque record id only for a non-null Cert ID.

## Risks / Trade-offs

- [XLSX files can contain oversized or malformed sheets] → Cap source bytes,
  data rows, sheet count, and cell length in the decoder; repeat row limits in
  the service contract and reject formulas rather than trusting cached values.
- [A schema can change after preview] → Revalidate the published revision and
  all typed values under the commit transaction before creating products.
- [Two products can share a display name] → Match by the full composite
  identity, preserve different identities, serialize same-name writers, and
  refuse only when more than one existing product matches the same identity.
- [Concurrent imports can reuse a Cert ID] → Lock inventories and enforce
  the partial unique index in PostgreSQL; map constraint conflicts to a full
  batch refusal.
- [A retry can duplicate writes] → Lock the session and return its persisted
  result after commit; check the canonical identity again for each product.
- [A RAW copy is not selectable by Cert ID] → Persist its copy facts, while
  leaving reservation and stock arithmetic on the existing aggregate path.
- [Import preview can outlive the source schema or product] → Expire previews
  after 24 hours and repeat all mutable-state checks during commit.

## Migration Plan

1. Add the import tables and copy-fact columns, make `cert_id` nullable, and
   replace the uniqueness index with a partial index. Preserve existing record
   ids and allocation statuses.
2. Update Inventory contracts, repositories, and service validators to support
   nullable Cert IDs and copy-level text fields. Keep current manual intake and
   aggregate reservation behavior working.
3. Add schema-manifest preview and draft commit using the existing schema
   validation and review/publish lifecycle.
4. Add the shared CSV/XLSX decoder, explicit mapping UI, and product-entry
   preview and atomic draft-product commit. Reuse the existing `created`
   status operation for readiness before inventory upload.
5. Add inventory preview and atomic unit commit with product matching, blank
   status decisions, per-copy facts, counter updates, and changelogs.
6. Deploy the expanded Inventory contract before the admin surfaces that read
   copy facts. Run the Drizzle and migration gates, focused service and UI
   suites, then the inventory worker and admin builds.

Before deploy, rollback is the prior application version plus a down migration
that removes the new columns and tables. After any import has written copy
facts or staged sessions have been used, preserve or export those rows before
rolling back; deleting them would lose operator-entered data. Existing Cert ID
records remain readable throughout the expand migration.

## Open Questions

None that change behavior or task breakdown. The XLSX parser is an explicit
frontend dependency selected during implementation; decoding remains behind
the shared file adapter and does not affect stored contracts.
