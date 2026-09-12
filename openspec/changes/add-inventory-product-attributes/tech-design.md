## Context

The inventory service currently stores one product classification in
`inventory.product_classifications`, while product facts are an unconstrained
`products.metadata` object. Auction reads that object through the inventory
binding and renders a hard-coded ordering. That shape cannot validate an exact
IP, Item, and Category schema, query every configured field, or distinguish a
stable field identity from its locale-specific label and value.

See [proposal.md](proposal.md) for the product reason and
[catalog requirements](specs/grade10-admin/inventory/catalog/spec.md) for the
contract.

## Goals / Non-Goals

**Goals:**

- Make the published product-schema revision selected from the existing
  classification tuple, rather than storing a second product classification
- Keep field keys and select-option keys stable while resolving labels and
  displayed values for `en`, `zh-Hant`, and `zh-Hans`
- Validate a supplied value on every write and validate the complete required
  set before either configuration publishing or a product enters `created`
- Make universal tags and configured fields queryable without treating
  localized display text as an identifier

**Non-Goals:**

- Migrate or reinterpret existing free-form `products.metadata` entries
- Keep a history of product field values or published configuration revisions
  beyond the active revision and one editable draft
- Design the configuration or product-editor screens; that belongs to
  `ui-design.md`

## Decisions

### Normalize Configured Facts

Use relational rows for product schemas, their attributes, and product values. Keep
`products.metadata jsonb` intact for legacy, unstructured metadata during this
change, but remove it from the structured product editor and Auction's
structured presentation path.

The service resolves a product's product schema by joining its one existing
`product_classifications` row to the one published product-schema revision with
the same `ip_tag_id`, `item_tag_id`, and `category_tag_id`. The product does
not persist a product-schema id or an eligibility flag: both would duplicate
facts that can change when the classification or active revision changes.

**Alternative considered — retain structured data in `products.metadata`.** A
JSON object makes a first editor quick, but cannot enforce stable field and
option identities, scoped validation, select values, localized text, or useful
per-field indexes. It also makes a published-schema check scan and interpret
each product document.

**Alternative considered — store a product-schema id on `products`.** It would
allow a product to point at a stale configuration after its classification is
edited. Resolving from the classification keeps one source for the tuple.

### Draft Revisions Preserve the Active Configuration

Model an exact tuple as one `product_schemas` identity with at most one
`published` revision and one `draft` revision. Editing starts or updates the
draft revision; publishing validates it, then changes it to `published` in the
same transaction that retires the prior published revision. Product reads use
only the published revision. A failed publish never changes that read path.

This small version boundary is needed even though historical versions are out
of scope: an editable row must not make the live Auction schema disappear or
change before it passes its affected-product validation.

**Alternative considered — one mutable row with a `published` flag.** Every
draft edit would either alter the live schema or require an unsafe in-place
rollback. It cannot keep the prior published configuration active on refusal.

### Validate Canonical Values, Localize Only Their Display

Product values use the field key and canonical storage appropriate to the data
type. Text has an English canonical value and optional per-locale translations;
number and boolean values are language-neutral; select values store stable
option keys. The renderer resolves a supplied active-locale translation, then
English. It never exposes a field key or option key as display copy.

English is the required base locale at two levels:

- Publishing an attribute/product-schema revision requires its English displayed
  field label and the English displayed value of every allowed select option.
- A required text product field needs a non-empty English value; a required
  number or boolean needs its canonical value; a required select needs a
  permitted option key (or at least one permitted key for multi-select).

Other locale entries are optional. The CMS returns missing-locale warnings for
labels and select options; product reads fall back silently to English. A
locale value that is supplied is still validated using the field's text rules.
This makes missing translation a content-quality report, not a way to bypass a
required field.

**Alternative considered — put dynamic labels and values in
`@grade10/i18n`.** The catalog is for platform copy. These are tenant-managed
CMS data and need admin CRUD, stable option keys, and per-product-schema
overrides.

### Centralize Eligibility and Validation in Inventory

Add one inventory-domain validator used by product create/update, mark-created,
product-schema publish and Auction search.
Entry points decode contracts and authorize; `ProductSchemaService` owns the
transaction and calls repositories. Clients render its field-level outcomes but
do not decide validity.

A draft may save an incomplete required set. Each supplied value is checked
immediately against the currently published revision (or refused if no matching
published revision assigns that field). `markProductCreated` takes a row lock,
resolves the exact active revision, validates universal classification and the
complete required set, then changes status. Auction's existing `created` status
gate remains, and its product reads/searches join the active revision and value
tables. It does not persist an `auction_eligible` projection.

**Alternative considered — validate only in the admin form or only on
publish.** Forms can be bypassed and publishing does not protect a later
product update. The inventory boundary sees every mutation and every
created-state transition.

### Auction Owns Listing Attributes

Keep product attributes in Inventory because they identify the reusable product
and participate in creation validation and search. A product-schema revision
keeps the selected product attributes and order for an Auction display. Auction
resolves that selection through Inventory whenever it renders a listing.

Store listing-specific display items directly on
`auction.listings.listing_attributes jsonb`. There are no Auction listing-field
definitions, required keys, data types, validation rules, option sets, or
translation requirements. The document is an ordered array, so a listing can
hold any display-only item and preserve the administrator's order. An item may
supply localized labels and values; rendering falls back to English, then the
supplied value.

```json
[
  {
    "label": { "en": "PSA cert number", "zh-Hant": "PSA 證書編號" },
    "value": { "en": "0001234567", "zh-Hant": "0001234567" }
  },
  {
    "label": { "en": "Vaulted" },
    "value": true
  }
]
```

**Alternative considered — attach listing values to the product schema.**
That makes a unique listing fact appear shared by every listing of the product,
which is incorrect for certification, vaulting, and shipping facts.

**Alternative considered — configure or validate listing fields.** This would
make values more uniform but turns an operational display note into a CMS
workflow. JSONB keeps listing attributes opaque and flexible; an Auction search
projection is added only if a listing attribute later becomes a public filter.

### Resolve Product Display Fields Live

Auction does not copy product fields onto a listing. Its listing-content read
calls Inventory's additive `readAuctionProductDisplay` contract with the
listing's product id and requested locale. Inventory resolves the current
published product schema, its selected display attributes, and the product's
typed values into an ordered, locale-ready field list. Auction appends the
listing's own `listing_attributes` document after those fields.

The contract is the compatibility boundary. A product-schema publication
validates every selected display attribute belongs to the revision and has an
English base label; Inventory retains published revisions and referenced
attributes rather than deleting them. The contract always returns the same
field shape, omitting a missing optional value and using locale → English
fallback. A valid Inventory change may therefore change current display, but
cannot leave Auction with an unresolved field definition or raw key.

**Alternative considered — copy a product display snapshot at publish.** It
isolates read availability and preserves historical wording, but duplicates
product data on every listing and makes Inventory corrections invisible. The
current requirement prefers live product facts with a compatible Inventory
contract.

### Respect the Inventory and Auction Boundary

PostgreSQL transactions span every schema in one database, so an Auction
transaction could atomically write `auction.*` and `inventory.*`. The design
does not use that capability for normal commands. Each domain writes its own
tables and calls the other through its contract. A cross-schema join is not
inherently slower than a same-schema join, but it couples Auction to Inventory
table shapes, permissions, migrations, locks, and availability.

Auction search uses product-attribute data supplied by Inventory through a
contract or an Auction-owned projection. No cross-schema query is part of the
runtime boundary. A shared Neon database gives one atomic transaction only
while both schemas remain in that database; separate databases need a
distributed protocol and are deliberately not treated as atomic.

## Database Schema

Product-schema tables live in the existing `inventory` PostgreSQL schema.
Auction extends its existing `listings` table in the Auction PostgreSQL schema.
IDs are system-minted `text`; timestamps use the existing `msTimestamp` convention:
`timestamp with time zone`, `NOT NULL`, `DEFAULT now()`.

| Table | Columns | Constraints and indexes | Authority |
| --- | --- | --- | --- |
| `product_attribute_keys` | `id text NOT NULL`; `key text NOT NULL`; `data_type text NOT NULL`; `validation jsonb NOT NULL DEFAULT '{}'::jsonb`; audit timestamps | PK `id`; unique `key`; data-type and JSON-object checks; key immutable after a product attribute exists | Reusable attribute-key identity, type, validation |
| `product_attribute_key_labels`, `product_attribute_key_options`, `product_attribute_key_option_labels` | Attribute-key or option id, locale or stable option key, trimmed label, audit timestamps where applicable | Composite PKs and FKs to the attribute key or option; English base enforced by service | Localized reusable key labels and select options |
| `product_schemas` | `id text NOT NULL`; `ip_tag_id text NOT NULL`; `item_tag_id text NOT NULL`; `category_tag_id text NOT NULL`; audit timestamps | PK `id`; unique tuple; FKs to `tags` | Exact classification tuple |
| `product_schema_revisions` | `id text NOT NULL`; `product_schema_id text NOT NULL`; `state text NOT NULL DEFAULT 'draft'`; `auction_display_attribute_keys jsonb NOT NULL DEFAULT '[]'::jsonb`; audit timestamps | PK `id`; FK schema; state and JSON-array checks; partial unique indexes: one published and one draft revision per schema | Active product configuration and selected product-attribute display order for future Auction listings |
| `product_schema_attribute_keys` | `id text NOT NULL`; `revision_id text NOT NULL`; `attribute_key_id text NOT NULL`; `required boolean NOT NULL DEFAULT false`; `validation jsonb NOT NULL DEFAULT '{}'::jsonb`; audit timestamps | PK `id`; unique `(revision_id, attribute_key_id)`; FKs; JSON-object check; index `(revision_id, required)` | Product-schema key assignment, requiredness, validation override |
| `product_schema_attribute_key_labels`, `product_schema_attribute_key_options` | Schema-attribute-key id, locale or option id, label/order | Composite PKs, FKs, non-negative option order | Per-schema key labels and allowed options |
| `product_attributes` | `id text NOT NULL`; `product_id text NOT NULL`; `attribute_key_id text NOT NULL`; `text_value text NULL`; `number_value numeric NULL`; `boolean_value boolean NULL`; `option_keys text[] NULL`; audit timestamps | PK `id`; unique `(product_id, attribute_key_id)`; one canonical-value column check; btree typed-value indexes and GIN `option_keys` | Canonical typed value for one product and attribute key |
| `product_attribute_translations` | `product_attribute_id text NOT NULL`; `locale text NOT NULL`; `value text NOT NULL` | PK `(product_attribute_id, locale)`; FK product attribute cascade; trimmed non-empty check | Localized product text values |
| `auction.listings.listing_attributes` | `jsonb NOT NULL DEFAULT '[]'::jsonb` | JSON-array check only; preserves supplied order; no public-search index | Opaque listing-specific display items, including any supplied translations |

`product_classifications` and its three tag columns remain authoritative for
universal classification. `products.status` remains authoritative for its
lifecycle. The matching published revision, validation report, locale fallback,
and Auction eligibility are derived at read or command time and are not stored.
Inventory product attributes and their translations remain authoritative for
the live Auction product display. Auction `listing_attributes` are authoritative
only for their own listing; they never change product validation or product
facts.

`validation` is a JSON object because valid properties differ by field type.
The service accepts only the documented shape: text `minLength`, `maxLength`,
`pattern`; number `minimum`, `maximum`; select allowed keys via the join table;
boolean has no additional rule. It rejects incompatible keys, malformed regular
expressions, inverted ranges, and unknown keys before writing.

```mermaid
erDiagram
  tags ||--o{ product_classifications : classifies
  products ||--|| product_classifications : has
  products ||--o{ product_attributes : stores
  product_attribute_keys ||--o{ product_attributes : defines
  product_attributes ||--o{ product_attribute_translations : localizes

  tags ||--o{ product_schemas : selects
  product_schemas ||--o{ product_schema_revisions : has
  product_schema_revisions ||--o{ product_schema_attribute_keys : assigns
  product_attribute_keys ||--o{ product_schema_attribute_keys : reuses
  product_schema_attribute_keys ||--o{ product_schema_attribute_key_labels : overrides
  product_schema_attribute_keys ||--o{ product_schema_attribute_key_options : permits

  product_attribute_keys ||--o{ product_attribute_key_labels : labels
  product_attribute_keys ||--o{ product_attribute_key_options : offers
  product_attribute_key_options ||--o{ product_attribute_key_option_labels : localizes

```

`auction_display_attribute_keys` is a JSONB column on a product-schema
revision. `listing_attributes` is a JSONB column on an Auction listing; it is
not a relation table or a configurable Auction field definition.

## Service Interfaces

`ProductSchemaService` owns the Inventory processors. Each write executes in the
inventory database transaction begun by the service; repositories contain only
SQL and return rows. tRPC admin routers and the inventory RPC binding only
decode/authorize and map outcomes.

| Processor | Input | Success | Refusal and controls |
| --- | --- | --- | --- |
| `saveProductAttributeKey` | `{ actorId, attributeKey?: { id }, key, dataType, validation, labels, options }` | `{ attributeKey, translationWarnings }` | Duplicate/used key, invalid rule, duplicate option key, or absent English base label/value. Transaction writes attribute key → labels → options → option labels. |
| `saveProductSchemaDraft` | `{ actorId, tuple, revisionId?, attributeKeys, auctionDisplayAttributeKeys }` | `{ draftRevision, translationWarnings }` | Locks the tuple's `product_schemas` row; validates tags, references, and the selected display attributes; writes identity if absent → draft revision → assignments/labels/options. Replaces draft child rows atomically. |
| `queryIncompatibleProductAttributes` | `{ actorId, target: { attributeKeyId } \| { productSchemaRevisionId }, page }` | `{ affectedProductCount, incompatible: Array<{ productId, attributeKey, reason }> }` | Read-only review of a saved attribute-key update or saved schema draft. Resolves its current rules against matching product attributes without writing or locking them, so an admin can correct the returned products. A schema publish repeats validation under its write lock, so a stale review cannot authorize an incompatible change. |
| `publishProductSchema` | `{ actorId, revisionId }` | `{ publishedRevision, translationWarnings, affectedProductCount }` | Locks schema, draft revision, and matching classifications with `FOR UPDATE`; validates English bases and every matching product. On violation, returns `{ code: 'product-schema-publish-blocked', violations[] }` and rolls back. On success, retires old published → publishes draft atomically. |
| `upsertProductAttribute` | `{ actorId, productId, attribute }` | `{ product, validationReport }` | Locks product and resolves its published revision. Validates the supplied product attribute and locale value before replacing its value and translations. Refusal leaves the prior attribute unchanged. Draft completeness is reported, not refused. |
| `markProductCreated` | `{ actorId, productId }` | `{ product }` | Locks product and classification; resolves the published product schema; requires all 3 tags and every required product attribute. Returns `{ code: 'product-schema-invalid', violations[] }` without changing status/history on refusal. |
| `saveAuctionListingAttributes` | `{ actorId, listingId, listingAttributes: Json }` | `{ listing }` | Locks the listing and replaces the JSONB array without field-level validation. The entrypoint limits only document size and ordinary request safety; it does not interpret keys, types, labels, values, or translations. |
| `publishAuctionListing` | `{ actorId, listingId }` | `{ listing }` | Locks and publishes the listing without copying product fields. It requires the product to be eligible under Inventory's published schema; a refusal leaves the listing unpublished. |
| `readAuctionListingContent` | `{ listingId, locale }` | `{ fields: Array<{ label, value, displayOrder }> }` | Reads the listing and calls Inventory's `readAuctionProductDisplay` for ordered product fields, then appends `listing_attributes`. It resolves `locale → en → supplied value` for listing items. |
| `searchAuctionProducts` | `{ locale, universalFilters, attributeFilters, query, page }` | `{ results, availableFilters }` | Uses Inventory's product-attribute contract or an Auction-owned projection. It never offers listing attributes as criteria. |

Example: a Pokémon product has `product_classifications = (pokemon,
single-card, tcg)`, a required `grading` assignment, and no
`product_attributes` row for `grading`. `markProductCreated` locks the
product and classification, reads the active tuple revision, finds the missing
row, and returns `product-schema-invalid` with `[{ attributeKey: 'grading',
reason: 'required' }]`; its status remains `draft`. If the product has
`grading = ['psa-10']`, validation succeeds and the same transaction writes
`products.status = 'created'`, advances `updated_at`, and creates the existing
`product-update` history row.

## Contracts

Extend `@grade10/inventory-contracts` additively with discriminated schemas
for product attribute keys, localized labels, option keys, product-schema
revisions, canonical typed product values, translation warnings, and validation
violations. The schemas preserve the stable key on admin reads but require
renderers to use resolved `label` and `value`.

Add authorized inventory-admin procedures for attribute-key and
product-schema draft/save/review/publish operations, and extend product
create/update/read with product attributes plus a validation report. Include a
read-only incompatible-product-attributes review for saved schema and
attribute-key updates. Add an
additive, locale-aware Inventory product-display read and Auction contracts for
opaque listing-attribute JSONB. Update its public listing contract to carry
the resolved fields. Remove the hard-coded metadata mapper only after consumers
use the new field list.

## Risks / Trade-offs

- **[A published schema change can invalidate many products]** → Lock the
  tuple and affected classifications during publish; validate every affected
  product before flipping the active revision
- **[Requiredness can be confused with missing translations]** → Validate
  canonical required values separately from translation warnings; require
  English base content only
- **[Dynamic field filters can become slow]** → Query typed canonical columns
  through per-type indexes and option-key GIN indexes; paginate from the
  inventory query rather than filtering Auction results in memory
- **[A flexible listing attribute later needs public search]** → Add a JSONB
  GIN index for exact containment first; introduce an Auction-owned typed
  search projection only for range, sort, facet, or high-volume requirements
- **[A cross-schema command hides ownership]** → Keep writes behind Inventory
  and Auction services; use one database transaction across schemas only for a
  deliberately owned operational migration or repair
- **[Inventory changes break an Auction display]** → Resolve display through
  one versioned Inventory contract; retain published revisions and referenced
  attributes, validate selected fields at schema publication, and return a
  stable locale-ready field shape with optional values omitted
- **[Legacy metadata and structured fields can show different facts]** → Make
  structured content the only source for the new Auction presentation and
  leave legacy metadata unchanged until an explicit migration change is scoped
- **[Configuration removal changes a live product read]** → Do not delete a
  published revision; retire it only after a successor validates, and refuse
  deletion of a field/value referenced by a published revision or product

## Migration Plan

1. Add Drizzle tables, checks, foreign keys, and indexes in a new append-only
   inventory migration. Do not modify existing migration files or drop
   `products.metadata`.
2. Deploy contracts and inventory service support with no product schemas. All
   existing products remain `draft`/`created` according to their current status;
   existing created products retain their existing stock behavior, while only
   the new content-aware Auction presentation requires an active revision.
3. Create and publish product schemas, then backfill product structured values
   through the admin CMS. Publishing blocks until matching products meet the
   new required set.
4. Add opaque `listing_attributes` JSONB to Auction listings. Render product
   fields through Inventory's additive display contract and append saved listing
   items; filters use product attributes only. Keep the legacy metadata read
   compatible until the consuming listing contract has landed.
5. Roll back application code by leaving new tables and rows inert. Do not
   roll back the migration or delete configured content; forward-fix a faulty
   revision from its draft.
