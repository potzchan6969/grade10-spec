# Decisions

## Goals

- A collector notices that a live cart promo is nearing expiry while choosing
  a code.
- The discount and expiry remain readable as two separate pieces of ticket
  content.

## Non-Goals

- No backend, database, quote, or API contract change; the existing
  `expiresAt` fact is sufficient.
- No new or changed expiry wording, translation key, date format, or copy
  slot.
- No replacement of the discount title with expiry text, and no change to
  promo ordering, applicability, or selection behavior.
- No change to the Coupons page’s already-planned ticket state, QR behavior,
  or coupon lifecycle.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does the 14-day emphasis apply to the cart promo picker? | Yes — the cart picker uses the same near-expiry detail emphasis for each live held or public promo code it displays, whether the code can apply to the current basket or is listed with a refusal. - decided by the round | Keeping the emphasis only on the Coupons page — this would leave the cart picker’s choice surface without the confirmed warning |
| Q2 | Does expiry text replace the discount value line? | No — the ticket title continues to carry the discount, while the detail slot carries expiry and/or conditions. - decided by the round | Replacing the title or detail with a single combined line — it would lose the existing ticket slots and change the copy |
| Q3 | What determines the 14-day state? | Grade10 marks a live code when its expiry is at most 14 days away, using the current consumer clock; the shared ticket renders the supplied boolean and does not calculate time. The boundary is inclusive. - decided by the round | A shared component clock or a backend boolean — either would duplicate ownership and make the visual contract less reusable |
| Q4 | What changes for the collector? | Only the existing `Use by` detail slot is visually emphasised; the title, detail text, code, Apply behavior, and list order stay unchanged. - decided by the round | Adding an urgency label or changing the sentence — the designer and PM confirmed no text change |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
