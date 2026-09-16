## Feature set

- Queue
  - Two states before an invoice: Awaiting Address waits on the winner, Preparing Invoice waits on an operator and needs action
  - Overdue mark: an order whose address window has closed is marked, so a stalled order is chased rather than forgotten
  - Expired invoices: an order whose invoice has expired reads Pending Payment and is highlighted as needing action
- Quote and send
  - Operator quote: Shipping & Handling, and Insurance when added, are priced by a person for the winner's confirmed address
  - Reopening the address entrance: an operator gives a winner whose window has closed a fresh 48 hours, with a reason
  - Send opens the window: sending issues the invoice, locks the address, and starts the 7-day deadline
  - Re-quote on request: an address change after send is re-priced and reissued by an operator, who decides what happens to the deadline
- Resolving an unpaid order
  - Manual settlement: a non-card payment is recorded with its method, its reference, and proof of it
  - Cancellation: now also available before an invoice is sent, for an order the operator decides not to pursue
- Audit trail
  - Payment method on the record: every paid entry says how it was paid
