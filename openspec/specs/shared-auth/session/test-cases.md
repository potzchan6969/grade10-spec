# shared-auth/session Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## session-US1: Collector is named on every surface they use

**As a** collector,
**I want** a signed-in read to report my id, email, name, and roles, and a signed-out read to report nobody,
**so that** every surface of this brand knows it is me, or that I have not signed in.

### session-US1-TC1-1: Signed-in read names id, email, name and roles

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** session-US-01

**Pre-conditions:**
Signed in as a collector on Grade10.

**Steps:**

1. Ask a Grade10 product who is calling.

**Expected Results:**

* The product receives that person's user id, email, name, and roles.

### session-US1-TC2-1: Signed-out read reports no person

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** session-US-01

**Pre-conditions:**
The caller is not signed in.

**Steps:**

1. Ask a product who is calling.

**Expected Results:**

* The product receives no person.

### session-US1-TC3-1: Another person is asked for by user id

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** session-US-01

**Pre-conditions:**
A product must show another person's name.

**Steps:**

1. Open the surface that shows that other person.

**Expected Results:**

* The product asks for that person by user id.

### session-US1-TC4-1: Client cannot claim a user on an anonymous event

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** session-US-01

**Pre-conditions:**
The caller is not signed in.

**Steps:**

1. Submit an analytics event that names a user id.

**Expected Results:**

* The recorded event is not attributed to that user id.

---

## session-US2: Collector stays signed in across the brand

**As a** collector,
**I want** one sign-in to cover every site of this brand and none of another,
**so that** I do not sign in twice on the same brand or leak into the other.

### session-US2-TC1-1: One sign-in covers every site of the brand

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** session-US-02

**Pre-conditions:**
Signed in on one Grade10 site.

**Steps:**

1. Open another Grade10 site of the same brand.

**Expected Results:**

* They are signed in as the same person.

### session-US2-TC2-1: Sign-in does not cross brands

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** session-US-02

**Pre-conditions:**
Signed in on Grade10.

**Steps:**

1. Open a ZZZ site.

**Expected Results:**

* They are not signed in there.

---

## session-US3: Collector's visits are named as them, not as a device

**As a** collector,
**I want** a signed-in event to name me and an anonymous event to name the device,
**so that** analytics does not mix my account with a browser I have not signed in on.

### session-US3-TC1-1: Signed-in event is attributed to the user id

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** session-US-03

**Pre-conditions:**
Signed in as a collector.

**Steps:**

1. Trigger a product analytics event for that visit.

**Expected Results:**

* The event is attributed to that person's user id.

### session-US3-TC2-1: Anonymous event is attributed to the device

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** session-US-03

**Pre-conditions:**
The caller is not signed in.

**Steps:**

1. Trigger a product analytics event for that visit.

**Expected Results:**

* The event is attributed to the device.
* It is not attributed to a user id.

### session-US3-TC3-1: Sign-in links the device to the person

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** session-US-03

**Pre-conditions:**
Analytics events were recorded against this device while unsigned.

**Steps:**

1. Sign in as a collector on that device.
2. Trigger a product analytics event for that visit.

**Expected Results:**

* The later event is attributed to that person.
* It still names that device.
