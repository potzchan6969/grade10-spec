# grade10-site/vault/retention-and-erasure Specification

## Purpose

What the vault keeps after a case ends, what it deletes when the person asks to
be forgotten, what it keeps anyway because it is the evidence that an agreement
existed, and the page the person reads all three on.

Two mechanisms, kept apart on purpose: a review that flags a case past its
window and acts on nothing, and an erasure the person asks for from their own
account and an operator runs.

## Feature set

- Retention windows
  - Three classes: the agreements, the identity records behind them, and the
    item photographs
  - Per brand, per class: days after the case ends, because how long evidence
    is kept is a decision about a jurisdiction
  - The review is a review: it flags, gauges and writes nothing, so a wrong
    number costs a review and not a record
  - An unset window: flagged as undecided rather than treated as zero
- Erasure
  - Asked on the account: the person asks once and every product answers
  - A case in flight blocks: nothing is erased while an item is held or a loan
    is running
  - Never signed, purged: photographs, the item's words and the ceremony's own
    personal data go, and the identity is released
  - Signed and closed, held: the sealed documents and the identity behind the
    signature stay under a named hold
  - Whichever class: contact, staff free text and the collector's own actor
    ids go, and owed mail goes with them
- What cannot be rewritten
  - Append-only records: money, corrections, valuations, movements, history
    and the audit trail take no update and no delete
  - The one exception: the collector's own actor id in the history, which
    erasure rewrites
- Your data
  - One page under the account: what is kept, where the identity stands, what
    has been signed and the ask, in one place rather than on a closed case
  - What is kept, in the reader's words: each class with the window it is kept
    for, and that a review deletes nothing by itself
  - The identity standing: verified until when and checked how — never the name
    and never the document
  - Every signed document: the one download, offered from here and bounded to
    what the page lists
  - The ask and its refusal: filed here and cancelled here inside the window,
    and withheld in words while an item is held or a loan is running
