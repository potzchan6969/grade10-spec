## Goals

- Retain the supplied refund note and expose it faithfully to authorised readers.
- Supply enough refund and line association data for later frontend integration without changing settlement.

## Non-Goals

- Frontend rendering, shared UI, Storybook, translations or layout changes.
- Approval/publication workflows, reason classification, mapping, translation or rewriting.
- Replacing Shopify note-based refund idempotency, or changing money, loyalty, stock, order badges or stepper rules.
- A general order-note feature or a new refund operation; this covers refund notes only.
- Running production backfills, migrations or deployments during planning.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Must a note be approved or mapped before customer exposure? | Direct refund-note text, without approval or mapping - user, 2026-11-02 | Staff-approved messages or reason-code mapping; expressly rejected by the user |
| Q2 | What happens when the note is empty? | No refund reason for absent, null, empty or whitespace-only notes; preserve a non-empty source string exactly - user instruction plus whitespace-only convention decided by the round | Placeholders, invented reasons or rewriting meaningful text |
| Q3 | Does this change implement the frontend? | Backend storage and API only - user, 2026-11-02 | Frontend display and operator publication controls |
| Q4 | Which existing order reads carry the reason? | Owner detail and valid private-link detail, as existing refund facts do - decided by the round | A new endpoint or new access grants; preserves existing purchase-data access |
| Q5 | Are machine-looking notes filtered? | No content classification: a non-empty source note, including a Grade10 idempotency value, is exposed literally - consequence of Q1, decided by the round | Regex filtering or silently replacing the idempotency convention |
| Q6 | How are multiple and unattributed notes handled? | Preserve each refund separately; associate only explicitly named lines; no line inference - decided by the round | Latest order-wide note wins, or copying a note to every item |
| Q7 | What happens on replay or old orders? | Metadata enrichment may fill missing records without replaying financial effects; no synthetic historical reasons - decided by the round | Skipping metadata solely because money was deduplicated, or treating missing metadata as a failed order read |
| Q8 | Does plain text mean HTML is safe to execute? | Reasons remain data; customer contract grants no markup execution; raw text is not copied to logs or analytics, and erasure clears it without sync restoring it - decided by the round | HTML interpretation or widening unrelated data exposure |

| Q9 | Which note is exposed when observations disagree? | The current confirmed provider read supplies the reason, including an explicit empty value clearing it; an omitted note cannot erase it - decided by the round, consistent with direct current source text in Q1 | First observation forever or stale webhook replacement of a confirmed read |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/order-detail | A later observation changes the same refund note | Q9 |
