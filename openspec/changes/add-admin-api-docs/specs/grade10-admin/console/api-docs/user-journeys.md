## User journeys

### grade10-admin-console-api-docs-US-01: Engineer reads what a procedure needs before wiring a call

**As an** engineer wiring a console or storefront feature to a backend call,
**I want** to open the procedure and read its caller, grant, input and output in one place,
**so that** I wire the call correctly without reading the backend's source.

**Accepted by:**

- `grade10-admin-console-api-docs-SC-04` — A production build carries no API docs address
- `grade10-admin-console-api-docs-SC-05` — A non-production build lists the surface under Dev
- `grade10-admin-console-api-docs-SC-06` — A router's procedures are listed with kind and caller
- `grade10-admin-console-api-docs-SC-07` — A procedure's detail shows its wire path and fields
- `grade10-admin-console-api-docs-SC-09` — An elevated procedure names its grant
- `grade10-admin-console-api-docs-SC-10` — A fresh-session call is told apart from a session call
- `grade10-admin-console-api-docs-SC-14` — A forwarded procedure names the service that does its work

### grade10-admin-console-api-docs-US-02: QA reviewer traces what a grant unlocks

**As a** QA reviewer planning a pass for one operator role,
**I want** to filter every service at once by a grant,
**so that** I see each procedure that role reaches and nothing it does not.

**Accepted by:**

- `grade10-admin-console-api-docs-SC-03` — The rail names every service with its count
- `grade10-admin-console-api-docs-SC-08` — A filter narrows every service by path or grant

### grade10-admin-console-api-docs-US-03: Engineer relies on the page after a contract changed

**As an** engineer who changed a procedure's input,
**I want** the repository to refuse the change until the document is regenerated,
**so that** the page never lags behind the server it describes.

**Accepted by:**

- `grade10-admin-console-api-docs-SC-01` — Every mounted procedure appears, and nothing else
- `grade10-admin-console-api-docs-SC-02` — A changed router fails the check until regenerated
- `grade10-admin-console-api-docs-SC-12` — The page names the commit it was read from
- `grade10-admin-console-api-docs-SC-13` — Reading the same routers twice gives one document

### grade10-admin-console-api-docs-US-04: Backend reviewer finds the outputs left undeclared

**As a** backend reviewer,
**I want** each procedure without an output shape marked as such, with a count per service,
**so that** I know where to add one rather than discovering it from a consumer's bug.

**Accepted by:**

- `grade10-admin-console-api-docs-SC-11` — An undeclared output is said, not invented
