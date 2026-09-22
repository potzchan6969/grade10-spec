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
| Q7 | What is stored when the phone is not E.164-parseable? | The entered phone value is kept on the address; confirm is not refused for format | Refuse non-E.164; or drop the digits |
| Q8 | How are missing phone country and digits refused? | One field refusal beside Phone | Separate refusals for country and digits |
| Q9 | What happens to Company Name after switching back to Personal? | Confirm does not require it; the applied address is personal | Keep validating the hidden company name |
| Q10 | Who refuses empty required fields on the shared form? | Soft local refuse when the application has not supplied an error; application-supplied errors still win | Application-only validation with no local refuse; component-only with no application errors |
| Q11 | Does billing reuse one `AuctionAddressForm` contract? | Yes — durable billing SC-05/SC-06; this change does not split a second surface | A separate billing-only form export in this change |
| Q12 | When Same as delivery is checked, how are kind and phone reported for billing? | Confirm reports the same kind and phone for billing as delivery | Omit billing kind and phone from the payload |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/winner-order | When a phone value cannot be parsed to E.164, what exact value is stored on the address snapshot? | Q7 |
| grade10-site/auction/winner-order | Does billing Add Address use the same full A–Z country or region list and letter typeahead as delivery? | ❓ Post-Bidding · Order Setup · Billing country or region list |
| grade10-site/auction/winner-order | Are missing phone country and missing phone digits refused as one combined Phone refusal, or as separate refusals? | Q8 |
| grade10-site/auction/winner-order | After entering Company Name on Company and switching back to Personal before confirm, is the company name discarded, ignored, or still validated? | Q9 |
| shared/ui/auction-order | When phone country and digits are present but the value is not parseable to E.164, what exact shape does Confirm export? | Q7 |
| shared/ui/auction-order | Who refuses empty required fields on Confirm — the component, the application, or both? | Q10 |
| shared/ui/auction-order | For a company address, are first and last name still required? | Q2 |
| shared/ui/auction-order | Does the billing second address reuse one `AuctionAddressForm` contract or a separate surface? | Q11 |
| shared/ui/auction-order | When Same as delivery is checked, should the payload omit billing fields or repeat delivery values? | Q12 |
| shared/ui/auction-order | Is Personal the default kind when the application supplies no initial kind? | Q2 |
