## User journeys

### grade10-site-vault-case-lifecycle-US-01: Collector calls off a request before the item is in the vault

**As a** collector,
**I want** to end my own request at any point before I hand the item over,
**so that** nothing is left open in my name and any visit I booked goes with
it.

**Accepted by:**

- `grade10-site-vault-case-lifecycle-SC-09` — A collector cancels an offer they were made
- `grade10-site-vault-case-lifecycle-SC-10` — A case in the vault is not the collector's to cancel

### grade10-site-vault-case-lifecycle-US-02: Collector who stops answering is not left with an open case

**As a** collector,
**I want** a request I never came back to to end by itself, with a message
saying so,
**so that** I am not waiting on a case nobody is working and my item is not
expected at a counter.

**Accepted by:**

- `grade10-site-vault-case-lifecycle-SC-06` — An abandoned agreement ends after a month
- `grade10-site-vault-case-lifecycle-SC-07` — A collector who rebooked keeps their case
- `grade10-site-vault-case-lifecycle-SC-08` — A settled loan waits for its owner

### grade10-site-vault-case-lifecycle-US-03: Operator moves a case through the counter without stepping over a guard

**As a** member of shop staff,
**I want** each move to run only where it belongs and to be refused when the
case has moved under me,
**so that** two of us working the same counter cannot leave one case in a
state neither of us meant.

**Accepted by:**

- `grade10-site-vault-case-lifecycle-SC-01` — A terminal case takes no move
- `grade10-site-vault-case-lifecycle-SC-04` — A case that moved under the caller is refused
- `grade10-site-vault-case-lifecycle-SC-05` — The history has no gaps
- `grade10-site-vault-case-lifecycle-SC-11` — An unwind is refused past the advance
