# grade10-admin/appointment/diary Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-05, tcs-rules r2

## grade10-admin-appointment-diary-US1: Operator opens a shop for bookings

**As an** operator running a shop,
**I want** to set up the shop, its desks and rooms, its hours and the services each can take,
**so that** collectors book into the capacity the shop actually has.

### grade10-admin-appointment-diary-US1-TC1-1: New shop offers its first slot

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<grade10 admin appointments url>`.
* `<grading service>` is active and customer bookable.

**Test data:**

| Field | Value |
| --- | --- |
| `<grading service>` | A customer-bookable service with a 30-minute duration |
| `<new shop>` | A shop name not yet in the diary, in `Asia/Hong_Kong` |

**Steps:**

1. Create `<new shop>` with a slug, its zone, an address and a phone.
2. Add one desk to `<new shop>`.
3. Add a rule to `<new shop>` for Monday 10:00 to 14:00.
4. Assign `<grading service>` to the desk.
5. As the user, navigate to `<grade10 booking url>`, pick `<grading service>`, then `<new shop>`, then the coming Monday.

**Expected Results:**

* Step 5 lists Monday times from 10:00 on, the last ending by 14:00.

### grade10-admin-appointment-diary-US1-TC2-1: Shop with no assigned resource is offered nowhere

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

* `<unassigned shop>` is active with hours and one desk, and no service assigned to it.

**Test data:**

| Field | Value |
| --- | --- |
| `<unassigned shop>` | An active shop with a desk and rules but no service assignment |

**Steps:**

1. As the user, navigate to `<grade10 booking url>`.
2. Pick `<grading service>`.
3. Read the shops offered.

**Expected Results:**

* `<unassigned shop>` is not among them.

### grade10-admin-appointment-diary-US1-TC3-1: Retired shop keeps its day readable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

* The admin is signed in with the manage grant.
* `<shop_1>` holds `<a live booking>` tomorrow.

**Test data:**

| Field | Value |
| --- | --- |
| `<shop_1>` | An active shop offering `<grading service>` |
| `<a live booking>` | A booking in `booked` at `<shop_1>` tomorrow |

**Steps:**

1. Navigate to `<grade10 admin appointments url>` and open `<shop_1>`.
2. Retire the shop.
3. As the user, navigate to `<grade10 booking url>` and pick `<grading service>`.
4. As the admin, open `<shop_1>`'s day for tomorrow.

**Expected Results:**

* Step 3 does not offer `<shop_1>`.
* Step 4 shows `<a live booking>` in its lane.

### grade10-admin-appointment-diary-US1-TC4-1: Service created with its shape

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

The admin is signed in with the manage grant and is on the services list under `<grade10 admin appointments url>`.

**Test data:**

| Field | Value |
| --- | --- |
| Name | Grading |
| Duration | 30 minutes |
| Increment | 15 minutes |
| Buffer after | 10 minutes |
| Minimum notice | 120 minutes |
| Booking horizon | 60 days |
| Reminder lead | 1440 minutes |
| Customer bookable | on |

**Steps:**

1. Create a service with every value in the test data.
2. Read the services list.

**Expected Results:**

* The service is listed, active, with those values.

### grade10-admin-appointment-diary-US1-TC5-1: Resources assigned per shop set each shop's capacity

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

* The admin is signed in with the manage grant.
* `<shop_1>` and `<shop_2>` each hold two desks with the same hours, and `<grading service>` is assigned to neither.

**Steps:**

1. Open `<grading service>` and assign it to both desks of `<shop_1>`.
2. Assign it to one desk of `<shop_2>`.
3. As the user, navigate to `<grade10 booking url>`, pick `<grading service>`, then `<shop_1>`, then an open day.
4. Repeat step 3 for `<shop_2>`.

**Expected Results:**

* Step 3 shows a capacity of 2 on each time.
* Step 4 shows a capacity of 1.

### grade10-admin-appointment-diary-US1-TC6-1: Retired service leaves the public list and keeps its bookings

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

* The admin is signed in with the manage grant.
* `<grading service>` holds `<a live booking>`.

**Steps:**

1. Open `<grading service>` and retire it.
2. As the user, navigate to `<grade10 booking url>` and read the services listed.
3. As the admin, open the bookings list and narrow it to `<grading service>`.

**Expected Results:**

* Step 2 does not list `<grading service>`.
* Step 3 lists `<a live booking>` under the service's name.

### grade10-admin-appointment-diary-US1-TC7-1: Questions are asked in the order they were added

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

The admin is signed in with the manage grant and has `<grading service>` open.

**Test data:**

| Field | Value |
| --- | --- |
| First question | Required `choice`, options Raw and Slabbed |
| Second question | `text`, not required |

**Steps:**

1. Add the first question, then the second.
2. As the user, book `<grading service>` at `<shop_1>` up to the details step.

**Expected Results:**

* The details step asks the `choice` question first, marked required, then the `text` question.

### grade10-admin-appointment-diary-US1-TC8-1: Weekly rule opens the shop and a resource keeps its own hours

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

* The admin is signed in with the manage grant.
* `<shop_3>` has a desk and a room assigned to `<grading service>`, and no rules yet.

**Test data:**

| Field | Value |
| --- | --- |
| `<shop_3>` | An active shop with one desk and one room, both assigned to `<grading service>` |

**Steps:**

1. Open `<shop_3>`'s hours and add a rule for Tuesdays 09:00 to 18:00.
2. Add a rule on the room for Tuesdays 10:00 to 13:00.
3. Open `<shop_3>`'s day for the coming Tuesday.

**Expected Results:**

* Step 1 lists the rule under Tuesday.
* Step 3 shows the desk's lane open 09:00 to 18:00 and the room's lane open 10:00 to 13:00.

### grade10-admin-appointment-diary-US1-TC9-1: Special dates close a day or run it on other hours

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

* The admin is signed in with the manage grant.
* `<shop_1>` is open Mondays 10:00 to 18:00.

**Test data:**

| Field | Value |
| --- | --- |
| `<the coming Monday>` | The next Monday inside the horizon |
| `<the Monday after>` | The Monday following `<the coming Monday>` |

**Steps:**

1. Open `<shop_1>`'s special dates and close `<the coming Monday>`.
2. Set `<the Monday after>` to 12:00 to 15:00.
3. As the user, navigate to `<grade10 booking url>`, pick `<grading service>`, `<shop_1>`, and read `<the coming Monday>` on the calendar.
4. Click `<the Monday after>` and read its times.

**Expected Results:**

* Step 1 lists `<the coming Monday>` as closed.
* Step 3 shows `<the coming Monday>` as unavailable.
* Step 4 lists times from 12:00, the last ending by 15:00.

### grade10-admin-appointment-diary-US1-TC10-1: Read grant sees the diary and no write control

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

The admin is signed in with the read grant and without the manage grant.

**Steps:**

1. Navigate to `<grade10 admin appointments url>`.
2. Open the shops, the services, a shop's day and the bookings list in turn.

**Expected Results:**

* Each surface lists its records.
* No control that creates, edits, retires, blocks, books, moves, cancels or closes out is rendered on any of them.

### grade10-admin-appointment-diary-US1-TC11-1: Every write lands an audit entry naming the operator

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-01

**Pre-conditions:**

* The admin is signed in with the manage grant.
* `<shop_1>` has a free desk at `<a free time>` tomorrow.

**Steps:**

1. Create a shop.
2. Block a desk of `<shop_1>` for an hour tomorrow.
3. Book `<grading service>` at `<a free time>` for a collector giving a name.
4. Navigate to `<grade10 admin audit url>` and read the newest three entries.

**Expected Results:**

* Three entries name the admin, the action, and the shop, the block and the booking respectively.

---

## grade10-admin-appointment-diary-US2: Operator runs a shop's day from the diary

**As an** operator on the shop floor,
**I want** to read the day by desk and room, close one when it cannot be used, and record who came,
**so that** the diary matches what is happening in the shop.

### grade10-admin-appointment-diary-US2-TC1-1: Day lays out one lane per resource

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is signed in with the read grant.
* `<shop_1>` has two desks; `<a live booking>` is at 10:00 on the first and `<a block>` at 14:00 on the second, on `<the day>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the day>` | A day on which `<shop_1>` is open |
| `<a live booking>` | A booking in `booked` at 10:00 on the first desk on `<the day>` |
| `<a block>` | A block from 14:00 to 15:00 on the second desk on `<the day>` |

**Steps:**

1. Navigate to `<grade10 admin appointments url>` and open `<shop_1>`'s day for `<the day>`.
2. Read each lane.

**Expected Results:**

* The first lane shows `<a live booking>` at 10:00 and the second shows `<a block>` at 14:00.
* Both are placed on the shop's clock, with the zone named.

### grade10-admin-appointment-diary-US2-TC2-1: Stepping between days moves the lanes with the date

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is on `<shop_1>`'s day for `<the day>`.
* `<shop_1>` holds `<a live booking>` on `<the day>` and `<tomorrow's booking>` on the day after.

**Test data:**

| Field | Value |
| --- | --- |
| `<tomorrow's booking>` | A booking in `booked` at `<shop_1>` on the day after `<the day>` |

**Steps:**

1. Click the control that steps to the next day.
2. Read the date shown and the lanes.

**Expected Results:**

* The date shown is the day after `<the day>`.
* The lanes show `<tomorrow's booking>` and not `<a live booking>`.

### grade10-admin-appointment-diary-US2-TC3-1: Desk blocked with a reason

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day for tomorrow.
* `<shop_1>`'s first desk is free from 12:00 to 14:00 tomorrow.

**Test data:**

| Field | Value |
| --- | --- |
| Span | 12:00 to 14:00 tomorrow |
| Reason | Maintenance |

**Steps:**

1. Block the first desk for the span with the reason.
2. Read the first desk's lane.
3. As the user, navigate to `<grade10 booking url>`, pick `<grading service>`, `<shop_1>` and tomorrow, and read the times.

**Expected Results:**

* Step 2 shows the block from 12:00 to 14:00 with the reason Maintenance.
* Step 3 offers no time on the first desk whose visit overlaps 12:00 to 14:00.

### grade10-admin-appointment-diary-US2-TC4-1: Whole shop blocked for the day

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day for tomorrow.
* `<shop_1>` is open 09:00 to 18:00 tomorrow.

**Test data:**

| Field | Value |
| --- | --- |
| Span | 09:00 to 18:00 tomorrow |
| Reason | Stocktake |

**Steps:**

1. Block the shop for the span with the reason.
2. Read every lane.
3. As the user, navigate to `<grade10 booking url>`, pick `<grading service>` and `<shop_1>`, and read tomorrow on the calendar.

**Expected Results:**

* Step 2 shows the block in every lane with the reason Stocktake.
* Step 3 shows tomorrow as unavailable.

### grade10-admin-appointment-diary-US2-TC5-1: Removing a block reopens the span

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is signed in with the manage grant.
* `<shop_1>`'s first desk holds `<a block>` tomorrow.

**Steps:**

1. Open the blocks in force at `<shop_1>` and remove `<a block>`.
2. As the user, navigate to `<grade10 booking url>`, pick `<grading service>`, `<shop_1>` and tomorrow, and read the times.

**Expected Results:**

* Times inside `<a block>`'s span are offered again.

### grade10-admin-appointment-diary-US2-TC6-1: Product booking shows its case and cannot be moved from the console

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day.
* `<a vault visit>` is in that day.

**Test data:**

| Field | Value |
| --- | --- |
| `<a vault visit>` | A booking in `booked` made by the vault over its binding for `<a case>` |

**Steps:**

1. Click `<a vault visit>` in its lane.
2. Read what it shows and offers.

**Expected Results:**

* It shows the product as the vault and names `<a case>`.
* No move and no cancel is offered.

### grade10-admin-appointment-diary-US2-TC7-1: Visit marked completed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day for today.
* `<this morning's booking>` is in a lane.

**Test data:**

| Field | Value |
| --- | --- |
| `<this morning's booking>` | A booking in `booked` at `<shop_1>` this morning |

**Steps:**

1. Click `<this morning's booking>`.
2. Mark it completed.

**Expected Results:**

* The booking reads `completed` in its lane.

### grade10-admin-appointment-diary-US2-TC8-1: Visit marked a no-show

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day for today.
* `<a passed booking>` is in a lane.

**Test data:**

| Field | Value |
| --- | --- |
| `<a passed booking>` | A booking in `booked` whose start has passed |

**Steps:**

1. Click `<a passed booking>`.
2. Mark it a no-show.

**Expected Results:**

* The booking reads `no_show`.

### grade10-admin-appointment-diary-US2-TC9-1: Closed booking offers no action

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-02

**Pre-conditions:**

* The admin is signed in with the manage grant.
* `<a cancelled booking>` is in the bookings list.

**Test data:**

| Field | Value |
| --- | --- |
| `<a cancelled booking>` | A booking in `cancelled` |

**Steps:**

1. Open the bookings list and click `<a cancelled booking>`.
2. Read the actions offered.

**Expected Results:**

* No move, cancel or outcome is offered.

---

## grade10-admin-appointment-diary-US3: Operator books a visit for a collector at the counter

**As an** operator at the counter,
**I want** to book, move or cancel a visit for a collector who walked in or called,
**so that** a collector without the site in front of them still gets a desk that is expecting them.

### grade10-admin-appointment-diary-US3-TC1-1: Walk-in booked with a name and no address

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-03

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day for tomorrow.
* `<shop_1>` has a free desk at 10:00 tomorrow for `<grading service>`.

**Steps:**

1. Start a booking at 10:00.
2. Pick `<grading service>`, enter a name, leave the email address empty, and confirm.
3. Click the new booking in its lane.

**Expected Results:**

* The booking is live at 10:00 with source `operator` and booked by the admin.
* No mail is sent.

### grade10-admin-appointment-diary-US3-TC2-1: Operator names the desk

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-03

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day for tomorrow.
* Both desks of `<shop_1>` are free at 10:00 tomorrow.

**Steps:**

1. Start a booking at 10:00 on the second desk's lane.
2. Pick `<grading service>`, enter a name, and confirm.

**Expected Results:**

* The booking sits in the second desk's lane.
* The first desk is still offered at 10:00.

### grade10-admin-appointment-diary-US3-TC3-1: Direct booking moved to another time

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-03

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day.
* `<a live booking>` is at 10:00 with an answer to `<a question>`, and 14:00 is free.

**Steps:**

1. Click `<a live booking>` and choose to move it.
2. Pick 14:00 and confirm.
3. Click the booking at 14:00.

**Expected Results:**

* The booking is live at 14:00 with the same attendee and the same answer to `<a question>`.
* 10:00 is offered again.

### grade10-admin-appointment-diary-US3-TC4-1: Direct booking cancelled after confirmation

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-03

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day.
* `<a live booking>` is at 10:00 on the only desk.

**Steps:**

1. Click `<a live booking>` and choose to cancel it.
2. Confirm in the dialog.
3. As the user, navigate to `<grade10 booking url>`, pick `<grading service>`, `<shop_1>` and that day.

**Expected Results:**

* The booking reads `cancelled`.
* Step 3 offers 10:00 again.

### grade10-admin-appointment-diary-US3-TC5-1: Full time refused by name

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-03

**Pre-conditions:**

* The admin is signed in with the manage grant and is on `<shop_1>`'s day.
* Every desk of `<shop_1>` is occupied at `<a full time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a full time>` | A start at which every desk assigned to `<grading service>` holds a live booking |

**Steps:**

1. Start a booking at `<a full time>`.
2. Pick `<grading service>`, enter a name, and confirm.

**Expected Results:**

* The console says the time is full.
* No new booking appears in any lane.

### grade10-admin-appointment-diary-US3-TC6-1: Bookings list narrows and searches

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-appointment-diary-US-03

**Pre-conditions:**

* The admin is signed in with the read grant.
* Bookings exist at `<shop_1>` and `<shop_2>`, for `<grading service>` and `<another service>`, in every state, including `<attendee A>`'s live booking of `<grading service>` at `<shop_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<attendee A>` | An attendee name holding one live booking of `<grading service>` at `<shop_1>` and bookings elsewhere |

**Steps:**

1. Open the bookings list under `<grade10 admin appointments url>`.
2. Narrow it to `<shop_1>`, `<grading service>` and `booked`.
3. Search `<attendee A>`.

**Expected Results:**

* Only `<attendee A>`'s live bookings of `<grading service>` at `<shop_1>` are listed.
