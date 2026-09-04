## User journeys

### grade10-site-vault-retention-and-erasure-US-01: Collector asks to be forgotten and the vault answers for its own data

**As a** collector who has closed their account,
**I want** the vault to delete what it holds about me,
**so that** nothing of mine is kept beyond the record of agreements I actually
signed.

**Accepted by:**

- `grade10-site-vault-retention-and-erasure-SC-06` — A cancelled case keeps nothing
- `grade10-site-vault-retention-and-erasure-SC-07` — A released case keeps its evidence
- `grade10-site-vault-retention-and-erasure-SC-08` — Owed mail goes with the person
- `grade10-site-vault-retention-and-erasure-SC-09` — The collector's own history entries are anonymised

### grade10-site-vault-retention-and-erasure-US-02: Admin runs an erasure without touching a live case

**As an** admin running a person's erasure,
**I want** to be told which of their cases are still in flight rather than
having them erased,
**so that** nobody's item or debt disappears from the record while it still
exists.

**Accepted by:**

- `grade10-site-vault-retention-and-erasure-SC-04` — A live loan blocks the erasure
- `grade10-site-vault-retention-and-erasure-SC-05` — A case that goes live mid-run is not erased
- `grade10-site-vault-retention-and-erasure-SC-10` — An update to a money record is refused

### grade10-site-vault-retention-and-erasure-US-03: Compliance officer sees what is being kept too long

**As** the person answerable for what we keep,
**I want** a list of closed cases past the window for each class, and to be
told which windows nobody has decided,
**so that** deleting is a decision somebody makes rather than something that
happens on a clock.

**Accepted by:**

- `grade10-site-vault-retention-and-erasure-SC-01` — A class nobody has decided is reported as such
- `grade10-site-vault-retention-and-erasure-SC-02` — A case past its window is flagged and left
- `grade10-site-vault-retention-and-erasure-SC-03` — The window runs from the case's own ending
