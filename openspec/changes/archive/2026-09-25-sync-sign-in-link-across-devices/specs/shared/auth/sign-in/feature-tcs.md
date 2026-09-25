# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## shared-auth-sign-in-US10: Collector sees the wait end when they sign in from another device

**As a** collector who asked for a sign-in link on one device,
**I want** that device's wait to end once I sign in from another,
**so that** I am not left resending for an address I already used to sign in
elsewhere.

### shared-auth-sign-in-US10-TC1-1: Wait ends with a message when the link is followed on another device

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 store url> showing Check Your Email for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired link from that email on device B.
2. Return to device A.

**Expected Results:**

* Device A ends its wait with a message that sign-in completed on another device.
* Device A is not signed in.
* Only device B holds a session.

### shared-auth-sign-in-US10-TC2-1: Wait ends the same way when the other device signs in with Google

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 sign-in url> showing Check Your Email for <collector email>.
* Device A's brand has Google sign-in.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Complete Google sign-in with <collector email> on device B.
2. Return to device A.

**Expected Results:**

* Device A ends its wait with a message that sign-in completed on another device.
* Device A is not signed in.

### shared-auth-sign-in-US10-TC3-1: The asking device's own link followed on a different device still only closes the wait

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 store url> showing Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired link asked for on device A, but open it on device B instead.
2. Return to device A.

**Expected Results:**

* Device A ends its wait with a message that sign-in completed on another device.
* Device A is not signed in.
* Device A does not carry on any action the way a same-device tab would.

### shared-auth-sign-in-US10-TC4-1: A failed attempt on the other device leaves the wait running

Runs once per row of **Test data**.

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 store url> showing Check Your Email for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<failed attempt>` | What it is |
| --- | --- |
| expired link | a link older than five minutes, followed on device B |
| already used link | a link followed once already, followed again on device B |
| banned account | a link for <collector email> after the account is banned, followed on device B |

**Steps:**

1. Attempt the <failed attempt> on device B.
2. Return to device A.

**Expected Results:**

* Device A still shows Check Your Email, counting down toward Resend.
* Device A is not signed in.

### shared-auth-sign-in-US10-TC5-1: A settle for a different address leaves the wait running

Runs once per row of **Test data**.

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
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A on <grade10 store url> showing Check Your Email for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<other address>` | What it is |
| --- | --- |
| unrelated@example.com | an address with no relation to <collector email> |
| collector+shop@example.com | the plus-tag variant of <collector email>, its own account |

**Steps:**

1. Sign in as <other address> on device B.
2. Return to device A.

**Expected Results:**

* Device A still shows Check Your Email, counting down toward Resend.
* Device A is not signed in.

### shared-auth-sign-in-US10-TC6-1: Every surface waiting on the address ends its wait

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A and device C each showing Check Your Email after separately asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Complete Google sign-in with <collector email> on device B.
2. Return to device A, then to device C.

**Expected Results:**

* Both device A and device C end their wait with a message that sign-in completed on another device.
* Neither device A nor device C is signed in.

### shared-auth-sign-in-US10-TC7-1: A backgrounded waiting surface shows the message once returned to

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A showing Check Your Email for <collector email>, left in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Complete Google sign-in with <collector email> on device B while device A stays backgrounded.
2. Bring device A back to the foreground.

**Expected Results:**

* Device A shows the message that sign-in completed on another device.
* Device A is not signed in.

### shared-auth-sign-in-US10-TC8-1: The wait ends the same way whether or not Resend has turned on

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer is signed out, with device A showing Check Your Email for <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<resend state>` | On device A |
| --- | --- |
| Resend disabled, counting down | less than sixty seconds since the send |
| Resend enabled | sixty seconds or more since the send, Resend not yet activated |

**Steps:**

1. Reach <resend state> on device A.
2. Complete Google sign-in with <collector email> on device B.
3. Return to device A.

**Expected Results:**

* Device A ends its wait with a message that sign-in completed on another device.
* No further resend email goes out from device A.

### shared-auth-sign-in-US10-TC9-1: The check does not disclose whether an unrelated address is signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* <signed-in address> is signed in on device B.
* customer is on <grade10 sign-in url> on device A, signed out, having asked for no link.

**Test data:**

| Field | Value |
| --- | --- |
| `<signed-in address>` | collector@example.com, currently signed in on device B |

**Steps:**

1. Ask the auth service, from device A, whether <signed-in address> currently holds a session, naming no flow of device A's own.

**Expected Results:**

* The request is refused.
* Nothing in the response states whether <signed-in address> holds a session.

## Settled

* A pending, unused, unexpired link stays valid after its address settles
  elsewhere by another method; only the link's own expiry or a later send
  ends it, exactly as before this change.

## Reconciliation

Run: read `proposal.md`, `decisions.md`, this change's `user-journeys.md`,
the durable `user-journeys.md`, the linked PRD sections, and the durable
`feature-tcs.md` for id continuity. Denied any `spec.md` (durable or this
change's) and `openspec/changes/archive/`.

* **TC1-1, TC2-1** — already stated by `shared-auth-sign-in-SC-70` and
  `SC-71`.
* **TC3-1** — real behaviour, no scenario covered the contrast with the
  same-device tab hand-off explicitly. Folded into `SC-70` and `SC-72`
  together (the link-followed-elsewhere and no-session-hand-off scenarios);
  the distinction from `shared-auth-sign-in-US-08`'s same-device carry-on is
  stated in the PRD's 🚧 line rather than as a separate scenario, since
  nothing behavioural remains once both are read together.
* **TC4-1** — case has it, no scenario did, and it is real behaviour: a
  failed attempt elsewhere must not be mistaken for a settle. Folded in as
  `shared-auth-sign-in-SC-74`.
* **TC5-1** — already stated by `SC-73`; the plus-tag variant is `SC-20`'s
  existing distinct-address rule applied here, not new behaviour.
* **A settle on a different brand does not close this brand's wait**
  (originally `TC6-1`) — raised, rejected, and removed from the suite.
  grade10 and zzz run entirely separate auth deployments and databases (no
  shared account, no shared check between them), so a settle on one brand
  affecting the other's wait is not a reachable case for this capability's
  mechanism to guard against. Not an architecture this capability states or
  tests.
* **TC6-1** (originally `TC7-1`) — case has it, no scenario did, and it is
  real behaviour, with a direct precedent in this capability's own
  same-device rule (`shared-auth-sign-in-SC-51`, every surface closes, not
  only the one that asked). Folded in as `SC-75`.
* **TC7-1** (originally `TC8-1`) — case has it, no scenario did, and it is
  real behaviour: the guarantee holds regardless of a mechanism's own
  cadence. Folded in as `SC-76`, stated as an outcome ("still learns once
  foregrounded") rather than a timing bound, consistent with
  `decisions.md`'s non-goal on a fixed detection-latency SLA.
* **Dismissing the wait and reopening sign-in starts fresh** (originally
  `TC9-1`) — raised, rejected, and removed from the suite. Already governed
  by the existing dismiss/reopen contract (`SC-44`; the PRD's "opening
  sign-in again starts at the email step"). This change introduces no state
  that persists across a dismissal, so nothing new needs asserting.
* **TC8-1** (originally `TC10-1`) — case has it, no scenario did, and it is
  real behaviour, with a direct precedent (`shared-auth-sign-in-SC-60`, the
  link's lifetime is independent of the resend wait). Folded in as `SC-77`.
* **TC9-1** (originally `TC11-1`) — already stated by `SC-79` (renumbered
  from the scenario pass's original `SC-74` during layout, see below).

**Test-case renumbering note** — the two rejected cases were removed
outright rather than kept as `deprecated`, since nothing outside this open
change has ever referenced them; the remaining cases were then renumbered
`TC6`–`TC9` to stay contiguous. No id here was issued to the durable suite.

**Raised, escalated to the author** — the blind pass surfaced a case neither
the proposal, `decisions.md`, the journeys nor the PRD settled: whether a
pending, unused, unexpired link stays valid after its address signs in
elsewhere by a different method. Landed as `decisions.md` Q6 — yes,
unaffected — and folded in as `shared-auth-sign-in-SC-78`, since the
ambiguity was real enough to warrant an explicit scenario rather than
silence.

**Renumbering note** — the scenario pass originally issued `SC-70`–`SC-74`
(five scenarios, two requirements). Reconciliation folded four new
scenarios and one settled-question scenario into the first requirement,
so the second requirement's scenario (originally `SC-74`, the bare-address
guard) was renumbered to `SC-79` to keep each requirement's scenarios
contiguous. No id here was ever issued outside this open change, so this
is layout, not a renumber of a permanent id.

**Uncovered anchors** — none; every scenario in this delta traces to
`shared-auth-sign-in-US-10` or the `Emailed link` feature-set group, and
every case above traces to `shared-auth-sign-in-US-10`.
