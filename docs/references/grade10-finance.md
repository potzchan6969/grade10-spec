# Grade10 Finance

The owner's notes for Grade10 Finance as of 2026-09: a loan against graded
cards, its numbers, and the user flow from online request to repayment. No
spec or change carries these yet; what is built is on
[the finance page](../prds/products/finance/index.md). Read this as the shape
the product starts from, not as its requirements.

## Background

1. **Entity** — registered as a separate entity from Grade10
2. **Timeline**
   1. **Grade10 Shop** opens **mid Oct (~23rd)**
   2. **Grade10 Finance** comes in **Q4 2026**, as announced in the press
      release
3. **Important numbers**
   1. **~40% loan to value** estimation
   2. **1.5% to 2.5% interest rate**
4. **Other facts**
   1. **All licenses and compliance obtained** — legally prepared
   2. **Competitors** are small and not listed companies

## User flow

### Phase 1 — Online connection (finance.grade.com)

1. *User* — **Wants a loan**: logs in, submits the cards' details, waits for
   contact (❓ e-KYC at this step?)
   1. Login via Google login or magic link
   2. Phone verification (SMS) for WhatsApp contact afterwards
   3. Submit details: photo, loan amount, items
2. *Grade10* — **Preliminary authentication and valuation** of the cards
   1. Prepare the contracts and documents where possible
3. *Grade10* — **Reach out to confirm details and send the offer** (via
   WhatsApp)
4. *User* — **Pick the custodian and accept the offer** — should pick the
   Grade10 vault (the choice itself is required for legal)
   1. Grade10 Vault
   2. Vault from another company (Tiny, also ours)
5. *User* — **Book a time slot** depending on the custodian (booking system)

### Phase 2 — Offline drop-off

- *User* — **Visit the custodian** at the booked time (e-KYC)
- *Grade10* — **Inspect the cards** for authenticity and condition (the shop
  has experts to inspect)
- *Grade10* — **Explain the key terms of the loan** — legal requires a
  recorded call, done as an automated phone call
  - ❓ How the automated call runs and is recorded
- *Both* — **Sign documents**
  - Staff confirm and update the documents from the admin
  - Users sign via a dedicated page on the iPad in the store, or from their
    own account

### Phase 3 — Reimbursement and repayment

- *Grade10* — **Manual FPS** for reimbursement
- *Grade10* — **Update system records** with proof of reimbursement
  - A successful repayment is recorded manually first
- *Grade10* — **Automated reminder** for repayment and other events on the
  loan
