## User journeys

### shared-console-audit-US-01: Auditor isolates writes on the merged trail

**As an** auditor,
**I want** the merged trail filtered and ordered by time,
**so that** I can see one person's writes without paging past other products.

**Accepted by:**

- `shared-console-audit-SC-01` — Filters combine
- `shared-console-audit-SC-02` — A date range covers both calendar days
- `shared-console-audit-SC-03` — Newest-first is the default
- `shared-console-audit-SC-04` — Oldest-first orders by time
- `shared-console-audit-SC-05` — Audit offers no email filter
- `shared-console-audit-SC-06` — The trail never returns an email
- `shared-console-audit-SC-07` — The location restores filters and sort
- `shared-console-audit-SC-08` — No matches is not an empty trail
- `shared-console-audit-SC-09` — One product's silence does not hold a filtered page

### shared-console-audit-US-02: Auditor inspects a trail row

**As an** auditor,
**I want** subject, a readable action, roles, and details on a row,
**so that** I can name who was acted on without email or hashes.

**Accepted by:**

- `shared-console-audit-SC-10` — A row names the subject user id
- `shared-console-audit-SC-11` — The action has a readable name
- `shared-console-audit-SC-12` — Expanding shows roles and details
- `shared-console-audit-SC-13` — Actor and subject ids can be copied
- `shared-console-audit-SC-14` — Directory links only when the operator can open Users
- `shared-console-audit-SC-15` — Email and hashes stay off the row

### shared-console-audit-US-03: Auditor jumps to a chain break

**As an** auditor,
**I want** a chain broken at a position to open that row,
**so that** I land on the break instead of paging to it.

**Accepted by:**

- `shared-console-audit-SC-16` — A broken chain opens at that position

### shared-console-audit-US-04: Auditor sees chain health without a product list

**As an** auditor,
**I want** one line when every chain is reading, and a notice only when one is not,
**so that** the trail is not buried under seven identical rows.

**Accepted by:**

- `shared-console-audit-SC-17` — A quiet trail is one line; an issue is a notice
