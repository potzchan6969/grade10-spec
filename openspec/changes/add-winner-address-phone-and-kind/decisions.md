## Goals

- Let a winner enter a phone with a country selector on Add Address.
- Require country and digits; store E.164 when parseable; do not refuse
  unusual formats.
- Let the winner mark the address Personal or Company, and require Company
  Name only for company.
- Show the company name as the picker card title for company addresses.

## Non-Goals

- Refusing a number that fails hard libphonenumber validity.
- Tax ID or VAT on company addresses.
- Dropping first and last name on company addresses.
- A Figma-backed design-system PhoneInput primitive in this change.
- Account address book, store checkout, or other site-wide address forms
  beyond Winner Order setup and `AuctionAddressForm`.
- Default-address pre-fill, edit-saved-address, or leave-draft persistence.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How strict is phone validation? | Country + digits required; E.164 when parseable; unusual formats accepted (recommended) | Hard validity refuse; or free-text with no country selector |
| Q2 | How does company name appear? | Personal / Company toggle; Company Name required only for company, hidden on personal (recommended) | Always-visible optional Company Name |
| Q3 | Where does the phone UI live? | Block-local field in `@grade10/ui` on `AuctionAddressForm` until design publishes a PhoneInput set | New design-system primitive without Figma |
| Q4 | What starts selected on Add Address? | Phone country and Country/Region start empty — nothing preselected | Hong Kong or another default country |
| Q5 | What is the picker card title? | Company address → company name; personal → recipient first and last name | Always recipient name; or company name instead of collecting names |
| Q6 | Which locality fields are required? | Address line 1 and postal code required; address line 2 and state optional; no Apt./Suite/Building on this form | State required; Apt. field kept |

## Raised

None.
