## User journeys

### sign-out-US-01: Collector or operator signs out and lands signed out

**As a** signed-in person,
**I want** the control to show the request in flight and, on success, leave the signed-in surface,
**so that** I know the tap registered and I am not still looking at my account.

**Accepted by:**

- `sign-out-SC-01` — The control is busy while sign-out runs
- `sign-out-SC-02` — An operator signs out of an admin panel
- `sign-out-SC-03` — A collector signs out of the grade10 site

### sign-out-US-02: Collector or operator retries a refused sign-out

**As a** signed-in person,
**I want** a refused sign-out named as a failure I can retry,
**so that** a network miss does not leave me signed in with no explanation.

**Accepted by:**

- `sign-out-SC-04` — A refused sign-out is reported
- `sign-out-SC-05` — A retry clears the failure
