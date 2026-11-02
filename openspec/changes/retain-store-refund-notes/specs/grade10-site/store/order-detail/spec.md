## Purpose

Make retained refund reasons available through existing authorised order reads for later frontend display, without changing financial facts.

## Feature set

- Refund reason retention
  - Source fidelity: Retain supplied refund-note text per refund through webhook and provider reads.
  - Replay-safe enrichment: Fill metadata on retries and historical reads without repeating settlement.
- Refund reason exposure
  - Direct optional text: Expose non-empty notes without approval or mapping; empty notes produce no reason.
  - Explicit attribution: Keep refunds separate and expose only known line associations.
- Existing boundaries
  - Private purchase data: Preserve owner/private-link authorization, plaintext semantics and erasure.
  - Backend scope: Add data only; preserve existing clients and financial behavior.

## ADDED Requirements

### Requirement: Refund metadata retains the supplied source facts

The Store SHALL retain refund identity, supplied note text, issue time and explicitly named source lines from verified refund deliveries and provider order reads, independently of whether money has settled. Capturing metadata SHALL NOT assert a payment, returned unit or stock effect. Refund identities SHALL remain the original source identities even where later money is recorded separately. A repeated delivery or provider read SHALL enrich the same refund, not append a duplicate.

A supplied non-empty source note SHALL be preserved exactly, including whitespace around meaningful text, line breaks, Unicode and system-written values. Absent note data SHALL preserve retained text. A canonical provider order read with a supplied note SHALL replace retained text, or clear it when null, empty or whitespace-only. A verified delivery SHALL fill an unknown note but SHALL NOT replace an already captured note, including an explicit empty answer from a canonical read. Canonical supplied line associations SHALL similarly replace previous associations; an omitted associations field SHALL preserve them, and a delivery SHALL fill only unknown associations. Concurrent canonical reads SHALL use the existing serialized read claim; no source-version ordering is promised where the provider supplies no revision.

<!-- trace:scenario id=g10.store-order-detail.SC-qhz rev=1 -->
#### Scenario: g10.store-order-detail.SC10 - Settled refund notes survive both ingestion arms
**Serves:** Refund reason retention - the Store retains the explanation a later collector detail read can return

- **WHEN** the Store receives a verified settled-refund delivery or reads the same refund from its provider
- **THEN** the original refund identity, exact supplied non-empty note, issue time and explicit line associations are retained
- **AND** the financial settlement follows its existing rules

<!-- trace:scenario id=g10.store-order-detail.SC-sx2 rev=1 -->
#### Scenario: g10.store-order-detail.SC11 - Pending and restock-only notes do not manufacture settlement
**Serves:** Refund reason retention - the Store keeps source explanations without claiming money has moved

- **GIVEN** a provider refund whose money remains pending, or a restock-only refund with no refund transaction
- **WHEN** its verified delivery or provider read supplies a non-empty note
- **THEN** the metadata is retained even if the financial path excludes that refund
- **AND** metadata capture changes no refund money, points, returned quantities, stock or order status

<!-- trace:scenario id=g10.store-order-detail.SC-mne rev=1 -->
#### Scenario: g10.store-order-detail.SC12 - Money dedupe does not skip metadata enrichment
**Serves:** Refund reason retention - an earlier order gains a retained explanation without another settlement

- **GIVEN** refund money has already been recorded, including an order with older unkeyed financial history
- **WHEN** a retry, canonical provider read or explicit metadata replay supplies missing refund metadata
- **THEN** that metadata is retained under the original refund identity
- **AND** financial events, refund totals, points and stock remain unchanged
- **AND** repeating the input creates no duplicate refund metadata

<!-- trace:scenario id=g10.store-order-detail.SC-h1q rev=1 -->
#### Scenario: g10.store-order-detail.SC13 - A canonical correction survives delayed delivery
**Serves:** Refund reason retention - the Store preserves the provider read answer when old deliveries recur

- **GIVEN** one refund whose retained note is A
- **WHEN** a serialized canonical provider read supplies note B and an older verified delivery later supplies A
- **THEN** B remains the retained reason
- **AND** a later input omitting the note changes neither B nor its known associations

<!-- trace:scenario id=g10.store-order-detail.SC-kou rev=1 -->
#### Scenario: g10.store-order-detail.SC14 - Canonical empty clears while omission preserves
**Serves:** Refund reason retention - the Store distinguishes an unanswered field from an explicitly empty answer

- **GIVEN** a refund with a retained reason and explicit source lines
- **WHEN** a canonical provider read supplies a null, empty or whitespace-only note and omits associations
- **THEN** no reason is returned for that refund and its explicit source lines remain
- **AND** a later delivery cannot restore the earlier note
- **AND** omitting a note in a later provider read does not change that answer

### Requirement: Retained refund records expose optional reasons and precise attribution

Authorized detail responses SHALL allow the additive optional refund-record collection below. A response without the collection SHALL remain compatible; an empty collection SHALL mean no metadata is retained. Collection presence SHALL NOT assert that refund money has settled.

| Field | Required meaning |
| --- | --- |
| Refund identity | Original source refund identity, unique within the order; separate refunds remain separate. |
| Issue time | Optional supplied issue time, absent when unknown; never a fabricated occurrence. |
| Reason | Optional plain-text non-empty source string, preserved exactly; absent for missing, null, empty, whitespace-only or erased notes. |
| Source lines | Null when unavailable, an empty array when explicitly no lines, otherwise the exact source line identities and stated quantities; quantity is a non-negative integer or null when unstated. |
| Known variant | Optional per-source-line variant derived only from an exact known source line of that order; absent when unresolved. |

The collection SHALL sort by issue time ascending, unknown issue times last, then source refund identity ascending for ties. A reason SHALL be associated only with the source lines its own refund explicitly names. A refund naming no lines SHALL remain at refund level; an unresolved line identity SHALL remain explicit without inventing a variant. Notes SHALL NOT be copied to unrelated items or merged merely because refunds share a variant.

<!-- trace:scenario id=g10.store-order-detail.SC-bxr rev=1 -->
#### Scenario: g10.store-order-detail.SC15 - Several refunds keep their text and explicit lines
**Serves:** grade10-site-store-order-detail-US-01 - the collector can retrieve distinct reasons for the actual refunded lines

- **GIVEN** two refunds with different reasons, one naming source line L1 and the other naming L2, where both lines can have the same variant
- **WHEN** an authorized order detail is read
- **THEN** two distinct refund records retain their own exact reasons and named source line identities and quantities
- **AND** neither reason is copied to the other line or another item

<!-- trace:scenario id=g10.store-order-detail.SC-y9x rev=1 -->
#### Scenario: g10.store-order-detail.SC16 - Unattributed refunds remain refund-level facts
**Serves:** grade10-site-store-order-detail-US-01 - the collector receives only attribution the source actually supplies

- **GIVEN** refunds with no named lines, unavailable associations, or a named source line the Store cannot resolve
- **WHEN** an authorized order detail is read
- **THEN** each note remains on its own refund record
- **AND** explicitly no lines remains an empty collection, unavailable attribution remains null, and an unresolved line retains its source identity without an invented variant

<!-- trace:scenario id=g10.store-order-detail.SC-4bo rev=1 -->
#### Scenario: g10.store-order-detail.SC17 - Literal source text has no content classification
**Serves:** grade10-site-store-order-detail-US-01 - the collector can retrieve the supplied reason as data

- **WHEN** an authorized detail reads retained notes containing surrounding whitespace, line breaks, Unicode, markup-looking text or a system idempotency value
- **THEN** every non-empty reason is returned literally as plain-text data
- **AND** no classification, rewriting, translation or approval is required
- **AND** empty or whitespace-only notes provide no reason

<!-- trace:scenario id=g10.store-order-detail.SC-6ot rev=1 -->
#### Scenario: g10.store-order-detail.SC18 - Multiple refund ordering is deterministic
**Serves:** grade10-site-store-order-detail-US-01 - the collector receives a stable sequence on repeat reads

- **GIVEN** retained refunds with different, tied and unknown issue times
- **WHEN** the same authorized detail is read repeatedly without new facts
- **THEN** records are ordered by known issue time ascending, unknown times last, and original refund identity ascending for ties
- **AND** the order remains identical regardless of ingestion order

### Requirement: Existing authorized detail reads carry retained reasons

The existing detail read flow SHALL extend as follows:

1. Apply the existing owner or private-link authorization before reading or repairing refund metadata.
2. Use retained metadata and the existing eligible provider-repair path; a missing note SHALL NOT turn a successful order read into failure.
3. Return the refund records to the owner and to the valid private-link holder without new access grants or account facts on the private-link answer.

Older responses without refund metadata SHALL remain usable. Earlier orders SHALL acquire only metadata the source actually supplies through existing eligible reads or an explicitly invoked metadata replay; the Store SHALL NOT invent reasons or require a completed historical backfill before an order is readable. This backend change SHALL NOT require a frontend, layout or shared UI change.

<!-- trace:scenario id=g10.store-order-detail.SC-gnm rev=1 -->
#### Scenario: g10.store-order-detail.SC19 - Owners and valid links receive matching reasons
**Serves:** grade10-site-store-order-detail-US-01 - the existing permitted readers receive the same supplied refund explanation

- **GIVEN** an order with retained refund metadata
- **WHEN** its owner or a valid private-link holder reads its detail through the existing interface
- **THEN** the answer includes the same refund records and reasons
- **AND** the private-link answer continues excluding account and loyalty facts

<!-- trace:scenario id=g10.store-order-detail.SC-e8r rev=1 -->
#### Scenario: g10.store-order-detail.SC20 - Denied detail reads disclose no refund metadata
**Serves:** grade10-site-store-order-detail-US-01 - a viewer outside the existing order boundary gains no purchase facts

- **WHEN** a viewer uses an unknown order id, an unowned member-order address or an invalid private link
- **THEN** the existing refusal occurs without refund metadata or an order-existence disclosure
- **AND** metadata enrichment is not attempted before authorization

<!-- trace:scenario id=g10.store-order-detail.SC-idf rev=1 -->
#### Scenario: g10.store-order-detail.SC21 - Historical missing metadata preserves usable order facts
**Serves:** grade10-site-store-order-detail-US-01 - the collector can still read an earlier order before its metadata is available

- **GIVEN** an earlier order with no retained notes or a provider read that fails to supply them
- **WHEN** its authorized detail is read
- **THEN** its existing readable purchase facts remain available without an invented reason
- **AND** an otherwise compatible response omitting the new collection remains valid
- **AND** later successful metadata-only replay can fill supplied reasons without replaying financial effects

### Requirement: Refund reason text stays within the existing erasure boundary

Refund reason text SHALL be private purchase data under the existing order access and person-erasure scope. Erasure SHALL clear retained reason text and durably prevent subsequent retries, provider reads and metadata replay from restoring it, including when erasure races an ingestion. It SHALL preserve the financial record. Raw reason text SHALL NOT be added to logs or analytics.

<!-- trace:scenario id=g10.store-order-detail.SC-46a rev=1 -->
#### Scenario: g10.store-order-detail.SC22 - Erasure wins against replay and concurrent ingestion
**Serves:** Existing boundaries - the existing erasure journey removes retained private text durably

- **GIVEN** orders in the existing person-erasure scope with retained notes
- **WHEN** erasure runs, including concurrently with refund metadata ingestion
- **THEN** every such retained reason is cleared and subsequent verified deliveries, provider reads and metadata replay cannot restore its text
- **AND** financial facts survive unchanged
- **AND** metadata diagnostics and analytics contain no raw reason text

