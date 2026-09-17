## Context

The account's shipping address book is owned by `grade10-auth`
(`packages/grade10-auth/backend/src/services/shippingAddresses.ts`), backed
by the `shipping_addresses` table
(`packages/grade10-auth/backend/src/db/schema/index.ts`). `saveShippingAddress`
runs inside a shared `mutate()` transaction that today only checks account
existence and the `(userId, label)` uniqueness index — no count check exists.
`updateShippingAddress` and `archiveShippingAddress` are separate functions
with no dependency on a count.

Winner Order's delivery-address UI is not the Dialog/RadioList assembly
`ui-design.md` names under `external/grade10-spec/apps/preview` — that is a
Storybook sandbox in this store, not production. Production today is the
inline `AddressSection` / `AddressFields` / `AddressSummary` in
`apps/frontend/grade10/src/pages/auctions/AuctionWinnerOrderPage.tsx`, with a
plain native `<select>` over the saved addresses and an implicit
save-on-fresh-address heuristic — `amend()` passes
`saveToAddressBook: selectedAddressId === null` — no explicit "Save this
address for future orders" control exists yet.

## Goals / Non-Goals

**Goals:**
- Enforce the five-address cap where it can't be bypassed — server-side, in
  `grade10-auth`, since the book is shared across storefronts.
- Add the explicit "Save this address for future orders" control the
  proposal and `ui-design.md` require, wired to the cap's refusal.
- Leave editing, archiving and confirming a one-time order address
  unaffected by the cap, per `decisions.md` Q1 and Q5.

**Non-Goals:**
- Migrating Winner Order's address picker to the Dialog/RadioList assembly
  previewed in `external/grade10-spec/apps/preview` — `ui-design.md`'s own
  "Still work in this repo (not yet)" list defers that shared export to a
  later change; this change extends the preview's Storybook states, not
  production's component shape.
- The Account address-book surface (`decisions.md` Non-Goals).

## Decisions

- **Where the cap is enforced.** Inside `saveShippingAddress`
  (`packages/grade10-auth/backend/src/services/shippingAddresses.ts`),
  counting the account's non-archived rows before insert, inside the same
  `mutate()` transaction the label-uniqueness guard already runs in — never
  client-side alone, and never a second round-trip outside the transaction,
  so a concurrent save can't land a sixth row (`winner-order-SC-72`,
  `SC-73`).
- **What counts against the cap.** Non-archived rows only; an archived
  address frees its slot immediately (`winner-order-SC-76`).
  `updateShippingAddress` and `archiveShippingAddress` take no new
  dependency on the count — editing an existing row is not adding one
  (`winner-order-SC-77`), and an account already holding more than five
  (legacy data) keeps them and is refused only on the next save
  (`winner-order-SC-78`).
- **Refusal shape.** A new refusal code, `address_book_full`, added beside
  the existing values in `shippingAddressRefusalCodes`
  (`packages/grade10-auth/contracts/src/shippingAddresses.ts`), returned
  instead of inserting — the same shape the existing label-uniqueness
  refusal already uses, so the frontend's error handling extends rather
  than branches.
- **Frontend control.** `AuctionWinnerOrderPage.tsx`'s `amend()` stops
  inferring `saveToAddressBook` from `selectedAddressId === null` and reads
  it from a new explicit checkbox in `AddressFields`, defaulting checked
  under the cap and forced unchecked and disabled at it. The disabled state
  reads the existing `shippingAddresses()` query's length — no new fetch —
  and a short reason renders beside it via a tooltip
  (`winner-order-SC-74`, `SC-75`).
- **No UI migration.** The inline `AddressFields` / `AddressSummary` gain
  the checkbox and the cap messaging; they are not replaced by the
  previewed Dialog/RadioList assembly in this change.

## Risks / Trade-offs

- [Risk] Two concurrent saves both read a count of four and both succeed,
  landing six. → [Mitigation] The count check and the insert run inside
  `mutate()`'s existing transaction, the same one the label-uniqueness
  guard already relies on for this property.
- [Risk] The frontend's disabled-checkbox state drifts from the backend's
  actual count (a second tab already saved a fifth address). →
  [Mitigation] The backend stays the enforcement point regardless of the
  checkbox's client-side state; a save attempt still gets
  `address_book_full` from the server, and the frontend surfaces that
  refusal rather than trusting its own count.

## Migration Plan

Additive only, no schema change. The backend refusal code and cap check
ship first; the frontend checkbox and disabled state ship once that refusal
code is deployed, so an in-flight release never shows a checkbox the
backend cannot yet refuse.

## Open Questions

None that change this approach. The one product question neither reading
settled — whether the one-time address is visually distinguished in the
picker and whether it survives navigation or reload — is scoped to the
previewed Dialog assembly's eventual shared export (this change's
Non-Goals), not to the inline UI this change ships against; it stays open
on the proposal for whoever plans that migration.
