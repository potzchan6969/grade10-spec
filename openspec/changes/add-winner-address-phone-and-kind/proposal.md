**Author:** @tangconst - 2026-09-22

Product context: [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup).

## Why

Winner Order Add Address asks for a phone as free text and always shows an
optional Company Name. Collectors cannot pick a calling-country, and a company
delivery or billing address has no way to require the company name.

**Metric:** share of Add Address confirms that carry a country-selected phone
with digits and, when the address is a company address, a company name
(target: 100% of those confirms).

## What Changes

- **Phone with country** — Add Address uses a country-aware phone field
  (flag or globe, calling code when it is not already in the typed value,
  national number). Country and digits are required; the value is stored as
  E.164 when parseable. Unusual formats are not refused. Phone country starts
  empty — nothing preselected. Placeholder shows an example with calling code
  (`+852 12345678`).
- **Personal or company** — the winner chooses Personal or Company. Company
  shows Company Name as required; Personal hides it. A company address shows
  the company name as the picker card title; a personal address shows the
  recipient name. The card body shows street, city or region, and country
  only — no postal code and no phone.
- **Locality** — address line 2 and state are optional; Apt./Suite/Building
  is not collected on this form.
- **Shared form and setup** — `AuctionAddressForm` carries both; Winner Order
  Complete Order Setup Add Address uses the same contract.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — order-setup Add Address phone and
  address kind.
- `shared/ui/auction-order` — `AuctionAddressForm` values and surface for
  phone and Personal / Company.

## Impact

- `@grade10/ui` `AuctionAddressForm` (and a block-local phone field).
- Winner Order Complete Order Setup preview under `apps/preview`.
- `react-phone-number-input` as a `packages/ui` dependency.
- Consuming `grade10-site` wiring follows the submodule bump.

## Open Questions

None for this change. Hard phone-format refusal and a Figma-backed design-system
PhoneInput stay out of scope. Country/Region catalogue and searchable field
belong to `full-winner-order-country-region-list`.

**Archive:** @tangconst after deploy.

## References

- [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup)
- [Auction Order Blocks](../../../docs/prds/products/shared/ui/auction-order.md)
