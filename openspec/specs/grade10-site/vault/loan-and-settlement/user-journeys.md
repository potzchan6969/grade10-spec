## User journeys

### grade10-site-vault-loan-and-settlement-US-01: Treasurer records the advance that starts the loan

**As a** treasurer,
**I want** to write down a transfer that has already left the bank, against
the day it left,
**so that** the borrower's term runs from the day they got the money and
nobody can price and pay out one loan alone.

**Accepted by:**

- `grade10-site-vault-loan-and-settlement-SC-01` — The offer's maker may not pay it out
- `grade10-site-vault-loan-and-settlement-SC-02` — A value date before the signature is refused
- `grade10-site-vault-loan-and-settlement-SC-03` — The term runs from the advance
- `grade10-site-vault-loan-and-settlement-SC-04` — An amount that is not the principal is refused

### grade10-site-vault-loan-and-settlement-US-02: Borrower repays and takes the item home

**As a** borrower,
**I want** what I owe to be the same figure whenever I ask, and a part payment
to cut what my arrears run on,
**so that** I can pay some now and the rest later without being charged for
money I have already returned.

**Accepted by:**

- `grade10-site-vault-loan-and-settlement-SC-05` — Early repayment owes the whole term's interest
- `grade10-site-vault-loan-and-settlement-SC-06` — Overdue days charge the term's own daily rate
- `grade10-site-vault-loan-and-settlement-SC-09` — A part payment cuts the arrears it runs on
- `grade10-site-vault-loan-and-settlement-SC-15` — Settling moves the case
- `grade10-site-vault-loan-and-settlement-SC-23` — A loan still owing keeps the item

### grade10-site-vault-loan-and-settlement-US-03: Treasurer takes back a record the bank rejected

**As a** treasurer,
**I want** a wrong money record taken back in full by a second pair of hands,
**so that** a transfer that never happened stops counting without anybody
rewriting what was written.

**Accepted by:**

- `grade10-site-vault-loan-and-settlement-SC-16` — Nobody takes back their own record
- `grade10-site-vault-loan-and-settlement-SC-17` — The repayments come off before the advance
- `grade10-site-vault-loan-and-settlement-SC-18` — A correction does not re-date the loan

### grade10-site-vault-loan-and-settlement-US-04: Operator takes the collateral only after warning the borrower

**As a** member of shop staff,
**I want** to have to warn the borrower in writing and wait out the date I
gave them,
**so that** nobody's property is taken without notice and a chance to pay.

**Accepted by:**

- `grade10-site-vault-loan-and-settlement-SC-19` — Nothing is taken without a notice
- `grade10-site-vault-loan-and-settlement-SC-20` — Nothing is taken inside the cure period
- `grade10-site-vault-loan-and-settlement-SC-21` — A shortened notice period does not bring the date forward
- `grade10-site-vault-loan-and-settlement-SC-22` — Forfeiture settles the debt with the item
