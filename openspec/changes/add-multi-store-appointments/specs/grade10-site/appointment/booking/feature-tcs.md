# grade10-site/appointment/booking Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-05, tcs-rules r2

## grade10-site-appointment-booking-US1: Collector books a grading visit without an account

**As a** collector with a card to grade,
**I want** to pick a shop and a time and book the visit with nothing but my name and email,
**so that** I arrive at a desk that is expecting me instead of queueing as a walk-in.

### grade10-site-appointment-booking-US1-TC1-1: Grading visit booked with a name and an email

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
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* `<grading service>` is active and customer bookable, offered at `<shop_1>`.
* `<shop_1>` is open on `<an open day>` with at least one free time.
* The user has no account and no session.

**Test data:**

| Field | Value |
| --- | --- |
| `<grading service>` | A customer-bookable service with no questions |
| `<shop_1>` | An active shop with one desk assigned to `<grading service>` |
| `<an open day>` | A day inside the service's horizon on which `<shop_1>` offers times |
| `<a free time>` | A start `<shop_1>` offers on `<an open day>` |
| `<user email>` | An address holding no live booking of `<grading service>` |

**Steps:**

1. Navigate to `<grade10 booking url>`.
2. Click `<grading service>`.
3. Click `<shop_1>`.
4. Click `<an open day>` on the calendar.
5. Click `<a free time>`.
6. Enter a name and `<user email>`.
7. Click the button that books the visit.
8. Open the inbox of `<user email>`.

**Expected Results:**

* Step 7 shows the confirmation naming `<grading service>`, `<shop_1>` and its address, `<a free time>` in the shop's zone with the zone named, and the link that manages the visit.
* Step 8 holds one confirmation for the visit, carrying a calendar file and the same link.

### grade10-site-appointment-booking-US1-TC2-1: Service address opens the flow at that service

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
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* `<grading service>` is active and customer bookable with the slug `grading`.

**Steps:**

1. Navigate to `<grade10 booking url>?service=grading`.
2. Observe the step the flow opens on.

**Expected Results:**

* `<grading service>` is shown as picked.
* The flow is on the shop step.

### grade10-site-appointment-booking-US1-TC3-1: Product-bound services stay off the public list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* `<grading service>` is active and customer bookable.
* `<vault visit service>` is active and bound to the vault.

**Test data:**

| Field | Value |
| --- | --- |
| `<grading service>` | A customer-bookable service |
| `<vault visit service>` | A service with product `vault`, never customer bookable |

**Steps:**

1. Navigate to `<grade10 booking url>`.
2. Read the services listed.

**Expected Results:**

* `<grading service>` is listed.
* `<vault visit service>` is not.

### grade10-site-appointment-booking-US1-TC4-1: Times shown are the diary's, in the shop's zone

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
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* `<shop_2>` is in `Asia/Hong_Kong`, open 10:00 to 14:00 on `<an open day>`, with one desk assigned to `<hour service>`.
* `<shop_2>` holds a live booking of `<hour service>` at 11:00 on `<an open day>`.
* The user is on the day step for `<hour service>` at `<shop_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<hour service>` | A customer-bookable service of 60 minutes with a 5-minute increment and no buffers |
| `<shop_2>` | An active shop in `Asia/Hong_Kong` with one desk |
| `<an open day>` | A day inside the horizon on which `<shop_2>` is open 10:00 to 14:00 |

**Steps:**

1. Click `<an open day>` on the calendar.
2. Read the times listed and the zone named beside them.

**Expected Results:**

* The zone reads as Hong Kong time.
* 10:00 is listed and no time between 10:05 and 11:55 is.
* Times from 12:00 to 13:00 are listed and nothing after 13:00 is.

### grade10-site-appointment-booking-US1-TC5-1: Closed days and days past the horizon cannot be picked

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* `<shop_1>` is closed on `<a closed day>`.
* `<grading service>` has a booking horizon of `<horizon days>`.
* The user is on the day step for `<grading service>` at `<shop_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a closed day>` | A day inside the horizon with no opening rule at `<shop_1>` |
| `<horizon days>` | The service's booking horizon, in days |
| `<a day past the horizon>` | The day `<horizon days>` plus one from today |

**Steps:**

1. Click `<a closed day>` on the calendar.
2. Step the calendar to the month holding `<a day past the horizon>`.
3. Click `<a day past the horizon>`.

**Expected Results:**

* Step 1 picks nothing; the day is shown as unavailable.
* Step 3 picks nothing; every day from `<a day past the horizon>` on is shown as unavailable.

### grade10-site-appointment-booking-US1-TC6-1: Questions are asked in the service's order

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
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* `<questions service>` asks a required `choice` question and then a `text` question.
* The user has picked `<questions service>`, a shop, a day and a time.

**Test data:**

| Field | Value |
| --- | --- |
| `<questions service>` | A customer-bookable service with two questions, the `choice` one first and required |

**Steps:**

1. Observe the details step.

**Expected Results:**

* The contact fields come first, then the `choice` question marked required, then the `text` question.

### grade10-site-appointment-booking-US1-TC7-1: Missing details are refused before anything is sent

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
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* The user is on the details step of `<questions service>`, which asks one required question.
* The browser's network log is open.

**Steps:**

1. Enter a name and leave the email address empty.
2. Leave the required question unanswered.
3. Click the button that books the visit.
4. Read the network log.

**Expected Results:**

* The form names the email address and the question as missing.
* No booking request was sent.

### grade10-site-appointment-booking-US1-TC8-1: Time taken meanwhile is refused and the times refresh

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
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* `<shop_1>` has one desk, and `<the last time>` is the only free time on `<an open day>`.
* User A is on the details step for `<the last time>` with their name and address entered.

**Test data:**

| Field | Value |
| --- | --- |
| `<the last time>` | The one start `<shop_1>` still offers on `<an open day>` |

**Steps:**

1. As user B, in another browser, book `<the last time>` at `<shop_1>`.
2. As user A, click the button that books the visit.
3. Read the times shown for `<an open day>`.

**Expected Results:**

* Step 2 says the time was taken and returns user A to the day's times.
* `<the last time>` is no longer listed; user A's name and address are still filled in.
* Only user B holds a booking at `<the last time>`.

### grade10-site-appointment-booking-US1-TC9-1: Second live visit for the same service is told so

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
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

* `<user email>` holds a live booking of `<grading service>` at `<the first time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the first time>` | The start of the live booking `<user email>` already holds |
| `<another free time>` | A different start `<shop_1>` offers for `<grading service>` |

**Steps:**

1. Navigate to `<grade10 booking url>`.
2. Pick `<grading service>`, `<shop_1>`, and `<another free time>`.
3. Enter a name and `<user email>`.
4. Click the button that books the visit.

**Expected Results:**

* The page says a visit is already booked and shows `<the first time>`.
* No second booking exists for `<user email>`.

### grade10-site-appointment-booking-US1-TC10-1: Booking surface is served and listed per locale

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-appointment-booking-US-01

**Pre-conditions:**

Client-side JavaScript execution is disabled in the browser settings.

**Steps:**

1. Navigate to `<grade10 booking url>`.
2. Navigate to the same address under the `/tc` prefix, then under `/sc`.
3. Read the document title and description of each.
4. Navigate to `<grade10 sitemap url>`.

**Expected Results:**

* Each address answers 200 with the booking surface's title and description in its own language.
* The sitemap lists all three addresses.

---

## grade10-site-appointment-booking-US2: Collector manages a visit after booking it

**As a** collector who has booked a visit,
**I want** to see, move or cancel it from the link in my mail, and to find all my visits when I am signed in,
**so that** a change of plans costs me a minute rather than a phone call.

### grade10-site-appointment-booking-US2-TC1-1: Mailed link opens the booking

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
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

* `<user email>` holds `<a live booking>` and its confirmation mail.

**Test data:**

| Field | Value |
| --- | --- |
| `<a live booking>` | A direct booking in `booked` at `<shop_1>`, made under `<user email>` |

**Steps:**

1. Open the confirmation mail in the inbox of `<user email>`.
2. Click the link that manages the visit.

**Expected Results:**

* The page shows the service, `<shop_1>` and its address, and the start in the shop's zone.
* The page offers to move the visit and to cancel it.

### grade10-site-appointment-booking-US2-TC2-1: Visit moved from the link

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
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

* The user is on the manage page of `<a live booking>` at `<the first time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the first time>` | The start `<a live booking>` holds now |
| `<another free time>` | A different start `<shop_1>` offers for the same service |

**Steps:**

1. Click the control that moves the visit.
2. Click the day holding `<another free time>`, then `<another free time>`.
3. Confirm the move.
4. Open the inbox of `<user email>`.

**Expected Results:**

* The page shows the visit at `<another free time>` with the same service and shop.
* Step 4 holds an update naming `<another free time>` and carrying a calendar file.

### grade10-site-appointment-booking-US2-TC3-1: Visit cancelled from the link after confirming

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
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

* The user is on the manage page of `<a live booking>`.

**Steps:**

1. Click the control that cancels the visit.
2. Confirm the cancellation in the dialog.
3. Open the inbox of `<user email>`.

**Expected Results:**

* The page shows the visit as cancelled and offers neither a move nor a cancel.
* Step 3 holds a cancellation for the visit.

### grade10-site-appointment-booking-US2-TC4-1: Closed booking's link offers nothing

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
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

* `<user email>` holds `<a completed booking>` and its confirmation mail.

**Test data:**

| Field | Value |
| --- | --- |
| `<a completed booking>` | A direct booking in `completed`, made under `<user email>` |

**Steps:**

1. Open the confirmation mail of `<a completed booking>`.
2. Click the link that manages the visit.

**Expected Results:**

* The page shows the visit as completed.
* No move and no cancel is offered.

### grade10-site-appointment-booking-US2-TC5-1: Unknown secret answers not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

None.

**Test data:**

| Field | Value |
| --- | --- |
| `<an unknown secret>` | A well-formed secret the diary never issued |

**Steps:**

1. Navigate to `<grade10 booking manage url>#<an unknown secret>`.

**Expected Results:**

* The page answers not found.
* No booking is shown.

### grade10-site-appointment-booking-US2-TC6-1: Secret never leaves the browser in a path or query

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
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

* `<user email>` holds `<a live booking>` and its confirmation mail.
* The browser's network log is open.

**Steps:**

1. Open the confirmation mail and click the link that manages the visit.
2. Inspect every request in the network log.

**Expected Results:**

* The page request carries the secret in neither its path nor its query.
* The secret appears only in the body of the booking's own reads and writes.

### grade10-site-appointment-booking-US2-TC7-1: Signed-in list holds the visits under the address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

* The user is signed in with the account whose address is `<user email>`.
* `<user email>` holds `<a live booking>` tomorrow and `<a completed booking>` last week.

**Steps:**

1. Navigate to `<grade10 my bookings url>`.
2. Read the order of the visits listed.
3. Click `<a live booking>`.

**Expected Results:**

* `<a live booking>` is listed first as upcoming; `<a completed booking>` is listed after it as past.
* Step 3 opens the page that manages `<a live booking>`.

### grade10-site-appointment-booking-US2-TC8-1: Signed out, the list invites sign-in

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

The user has no session.

**Steps:**

1. Navigate to `<grade10 my bookings url>`.

**Expected Results:**

* The page invites the user to sign in.
* No visit is listed.

### grade10-site-appointment-booking-US2-TC9-1: Private addresses are never listed or indexed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-appointment-booking-US-02

**Pre-conditions:**

None.

**Steps:**

1. Navigate to `<grade10 sitemap url>` and search it for the manage and my-bookings addresses.
2. Navigate to `<grade10 booking manage url>` and inspect the page source for its robots directive.
3. Navigate to `<grade10 my bookings url>` and inspect the page source for its robots directive.

**Expected Results:**

* Neither address is in the sitemap.
* Steps 2 and 3 each carry a directive not to index the page.

---

## grade10-site-appointment-booking-US3: A script tries to book the shop out

**As a** shop protecting its booking capacity,
**I want** an anonymous booking attempt to pass a challenge and a per-address
budget,
**so that** a script cannot flood the diary or hold every seat for itself.

### grade10-site-appointment-booking-US3-TC1-1: Address that has spent its budget is refused at the limit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-appointment-booking-US-03

**Pre-conditions:**

* `<address>` has made 10 booking attempts against `<shop>` in the last 24 hours.

**Test data:**

| Field | Value |
| --- | --- |
| `<address>` | The network address the attempts are made from |
| `<budget>` | 10 booking attempts per 24 hours |

**Steps:**

1. Submit an 11th booking attempt from `<address>`.
2. Read the refusal's code and reason.

**Expected Results:**

* The attempt is refused `TOO_MANY_REQUESTS`.
* The refusal carries the reason `budget`, so the site can word the wait itself.

### grade10-site-appointment-booking-US3-TC2-1: Request with no challenge token is refused where the secret is set

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-appointment-booking-US-03

**Pre-conditions:**

* The deployment under test has the challenge secret set.

**Steps:**

1. Submit a booking request carrying no challenge token.
2. Read the refusal's code.

**Expected Results:**

* The request is refused `FORBIDDEN`.

### grade10-site-appointment-booking-US3-TC3-1: Refused request holds no seat

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-appointment-booking-US-03

**Pre-conditions:**

* A booking request that fails the gate — over `<budget>`, or carrying no challenge token where the secret is set.

**Steps:**

1. Submit that request against `<slot>`.
2. Read the booking rows and the hold on `<slot>`.

**Expected Results:**

* No booking row was written.
* No slot was held.
