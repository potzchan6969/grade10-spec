## User journeys

### auction-status-US-01: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

### auction-status-US-02: Partially Paid status ends self-service Pay for good

**As a** winner or operator,
**I want** an invoice with a payment recorded against it that counts toward the balance to read Partially Paid, with no running deadline and no self-service Pay,
**so that** the status always says whether Grade10 is still owed money and who settles the rest.

### auction-status-US-03: Payment deadline past reads Payment Overdue

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue,
**so that** Status alone shows self-service Pay has closed without implying the invoice is still pending.

### auction-status-US-04: Setup deadline past reads Setup Overdue

**As a** winner or operator,
**I want** incomplete setup past its deadline to read Setup Overdue,
**so that** Status alone shows self-service Confirm has closed without implying setup is still open.

### auction-status-US-08: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

### auction-status-US-07: Partially Paid status ends self-service Pay for good

**As a** winner or operator,
**I want** an invoice with a payment recorded against it that counts toward the balance to read Partially Paid, with no running deadline and no self-service Pay,
**so that** the status always says whether Grade10 is still owed money and who settles the rest.

### auction-status-US-05: Winner misses the address deadline

**As a** winner whose address window has closed,
**I want** to understand that Grade10 must reopen the form,
**so that** I know why I cannot confirm the address myself.

The order reads Setup Overdue while no address is confirmed. It shows Contact
Us and no Confirm delivery address control. When an operator reopens the form,
the winner receives a fresh 48-hour deadline. An operator may instead record
an address without reopening the winner's form.

### auction-status-US-06: Operator resolves a missed address deadline

**As an** operator,
**I want** to reopen the address form with a reason or record an address the
winner gave by phone,
**so that** the order can resume setup or reach Preparing Invoice.

The operator action is recorded. Reopening gives a fresh 48-hour window;
recording an address leaves winner self-service closed. Neither action is
available after the invoice is sent.
