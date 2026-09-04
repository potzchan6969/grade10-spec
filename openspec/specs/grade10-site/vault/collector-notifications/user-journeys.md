## User journeys

### grade10-site-vault-collector-notifications-US-01: Borrower is warned before the due date and while it runs late

**As a** borrower,
**I want** a message a week and a day before my loan is due, and one every
week it stays late,
**so that** I know what I owe and what a late week costs before anything is
taken.

**Accepted by:**

- `grade10-site-vault-collector-notifications-SC-05` — A week before, and the day before
- `grade10-site-vault-collector-notifications-SC-07` — A long-overdue loan is told once where it stands
- `grade10-site-vault-collector-notifications-SC-08` — The notice stops the reminders

### grade10-site-vault-collector-notifications-US-02: Collector hears about everything that happens to their case

**As a** collector,
**I want** a message for each thing that happens to my case, with a link
straight to it,
**so that** I never have to ask the shop what stage my item is at.

**Accepted by:**

- `grade10-site-vault-collector-notifications-SC-01` — Every event is decided
- `grade10-site-vault-collector-notifications-SC-02` — Three endings, three messages
- `grade10-site-vault-collector-notifications-SC-03` — The advance names the due date
- `grade10-site-vault-collector-notifications-SC-04` — A correction reaches the borrower

### grade10-site-vault-collector-notifications-US-03: Signer leaves with the documents they signed

**As** somebody who has just signed at the counter,
**I want** the sealed set mailed to me once, with the documents attached,
**so that** I hold my own copy without asking for one.

**Accepted by:**

- `grade10-site-vault-collector-notifications-SC-13` — One signer, one set
- `grade10-site-vault-collector-notifications-SC-14` — A retried delivery re-reads the documents
- `grade10-site-vault-collector-notifications-SC-15` — A set too heavy to attach still tells the signer

### grade10-site-vault-collector-notifications-US-04: Operator picks up a message that never went

**As a** member of shop staff,
**I want** a case to be flagged when a message to its collector ran out of
attempts, and to be able to send it again,
**so that** a provider outage costs a delay rather than a customer who was
never told.

**Accepted by:**

- `grade10-site-vault-collector-notifications-SC-09` — The item is vaulted even though the mail failed
- `grade10-site-vault-collector-notifications-SC-10` — Five attempts, then parked
- `grade10-site-vault-collector-notifications-SC-11` — An operator hands a parked message back
- `grade10-site-vault-collector-notifications-SC-16` — A corrected address gets the retry
