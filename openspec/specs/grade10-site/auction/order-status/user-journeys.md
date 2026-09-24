## User journeys

### auction-status-US-01: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

### auction-status-US-02: Partially Paid status ends self-service Pay for good

**As a** winner or operator,
**I want** an invoice with any payment recorded against it to read Partially Paid, with no running deadline and no self-service Pay,
**so that** the status always says whether Grade10 is still owed money and who settles the rest.

### auction-status-US-03: Payment deadline past reads Payment Overdue

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue,
**so that** Status alone shows self-service Pay has closed without implying the invoice is still pending.

### auction-status-US-04: Setup deadline past reads Setup Overdue

**As a** winner or operator,
**I want** incomplete setup past its deadline to read Setup Overdue,
**so that** Status alone shows self-service Confirm has closed without implying setup is still open.
