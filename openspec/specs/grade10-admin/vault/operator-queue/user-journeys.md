## User journeys

### grade10-admin-vault-operator-queue-US-01: Operator opens the shop and sees what is waiting

**As a** member of shop staff starting a shift,
**I want** the queue cut by what each case is waiting for, with today's visits
and a badge saying why a case needs me,
**so that** I can work the counter without being emailed anything.

**Accepted by:**

- `grade10-admin-vault-operator-queue-SC-01` — Today is the shop's day
- `grade10-admin-vault-operator-queue-SC-02` — Every status has exactly one home
- `grade10-admin-vault-operator-queue-SC-03` — A valuation nobody has touched badges after a week
- `grade10-admin-vault-operator-queue-SC-05` — A page resumes where the last one stopped

### grade10-admin-vault-operator-queue-US-02: Operator finds the case of the person at the counter

**As a** member of shop staff,
**I want** to find a case by the customer's number, address or case id,
**so that** somebody standing in front of me is served without my being able
to walk the whole customer list.

**Accepted by:**

- `grade10-admin-vault-operator-queue-SC-07` — A number is found however it was typed
- `grade10-admin-vault-operator-queue-SC-08` — A search records itself without the term
- `grade10-admin-vault-operator-queue-SC-09` — Listing the queue records nothing

### grade10-admin-vault-operator-queue-US-03: Operator works one case from its own tabs

**As a** member of shop staff,
**I want** each tab to offer exactly the acts this case's status allows,
**so that** I cannot be shown a button that will only be refused.

**Accepted by:**

- `grade10-admin-vault-operator-queue-SC-10` — The console offers only what the machine allows
- `grade10-admin-vault-operator-queue-SC-11` — The worker refuses what a stale console offers
- `grade10-admin-vault-operator-queue-SC-12` — The console shows only what the operator may do
- `grade10-admin-vault-operator-queue-SC-13` — Staff cannot record money

### grade10-admin-vault-operator-queue-US-04: Operator takes an item in and can say where it is

**As a** member of shop staff,
**I want** to name the shop and locker when I take an item in, and to list
everything we hold,
**so that** anybody can be told which vault an item is sitting in.

**Accepted by:**

- `grade10-admin-vault-operator-queue-SC-18` — Vaulting without a shop is refused
- `grade10-admin-vault-operator-queue-SC-19` — The held list says which vault holds what
- `grade10-admin-vault-operator-queue-SC-20` — There is no counter intake
