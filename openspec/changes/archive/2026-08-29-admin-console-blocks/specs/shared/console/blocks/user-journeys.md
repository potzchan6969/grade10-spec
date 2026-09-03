## User journeys

### console-blocks-US-01: Operator distinguishes a failed read from an empty queue

**As an** operator
**I want** a queue that failed to load to say it failed
**so that** I never mistake an outage for having nothing to do.

**Accepted by:**

- `console-blocks-SC-05` — A read is in flight
- `console-blocks-SC-06` — A read is refused
- `console-blocks-SC-07` — A read returns no rows

### console-blocks-US-02: Operator confirms an irreversible move deliberately

**As an** operator
**I want** every irreversible move to pass through a confirmation that names it and can be cancelled
**so that** a slip of the hand never commits something I cannot take back.

**Accepted by:**

- `console-blocks-SC-08` — An operator cancels a confirmation
- `console-blocks-SC-09` — No move uses the native confirm

### console-blocks-US-03: Operator narrows a queue with an announced control

**As an** operator
**I want** panel switches and row filters to announce what is selected
**so that** I can tell where I am and what I am looking at, with or without sight of the toggled styling.

**Accepted by:**

- `console-blocks-SC-10` — A panel switch is announced as tabs
- `console-blocks-SC-11` — A filter announces its selected option
