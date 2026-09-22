## Context

`@grade10/ui` `AuctionAddressForm` already collects Personal / Company, a
block-local `AuctionPhoneField` (`react-phone-number-input`), and optional
line 2 / state. Preview Complete Order Setup composes that form and titles
picker cards from kind. Live `grade10-site` Winner Order setup still needs the
submodule bump and any SPA wiring / i18n that does not yet match the contract.

See [proposal.md](./proposal.md) for why.

## Goals / Non-Goals

**Goals:**

- Keep phone and kind on the shared form contract; Winner Order setup consumes it
- Soft phone readiness: country + digits required; E.164 when parseable; no hard
  validity refuse
- Company Name required only for company; cleared on personal confirm
- No Apt./Suite/Building on the form surface

**Non-Goals:**

- Design-system PhoneInput / Figma set
- Hard libphonenumber validity refuse
- Billing Country/Region catalogue parity (PRD ❓)
- Account address book or other site-wide address forms

## Decisions

The specs own requiredness, soft phone rules, kind, picker titles, and
locality. Implementation choices:

| Topic | Choice | Rejected |
| --- | --- | --- |
| Phone UI | Block-local `AuctionPhoneField` wrapping `react-phone-number-input` in `packages/ui`; default placeholder `+852 12345678` | Design-system PhoneInput without Figma; free-text phone; generic "Enter phone number" placeholder |
| Soft refuse | Form soft-refuses empty phone / company / required locality on submit when the application has not supplied `errors`; application errors still win | Application-only validation with no local refuse; hard libphonenumber refuse |
| Non-E.164 storage | Confirm reports / snapshot keeps the entered phone string; E.164 when `parsePhoneNumber` succeeds | Drop digits; refuse confirm |
| Personal confirm | `onConfirm` clears `company` when kind is personal | Persist hidden company name into the snapshot |
| Picker card body | Preview formats lines as street, city/region, country — omits postal and phone | Full formatted address including postal and phone on the card |
| Apt. field | Do not render Apt./Suite/Building; values may keep an empty `apartment` key for type stability until a later cleanup | Collect Apt. on this form |
| Catalogue | Country/Region list stays owned by the country-region change; this change does not retarget it | Coupling phone work to billing catalogue parity |
| i18n | Preview keeps English stand-ins; `grade10-site` answers keys in `@grade10/i18n` when wiring setup | Hard-coding production copy only in the SPA |

## Risks / Trade-offs

- **[Risk]** Preview and SPA drift on phone / kind props → **Mitigation:** one `AuctionAddressForm` contract; Storybook stories cover Personal, Company, empty phone, filled phone.
- **[Risk]** Soft local refuse copy disagrees with i18n → **Mitigation:** local refuse is English fallback only when `errors.phone` / `errors.company` are absent; SPA supplies catalog strings.
- **[Risk]** Address snapshot schema lacks kind / E.164 phone → **Mitigation:** confirm-address contract accepts kind and phone; add columns only if persistence is missing (see Migration).

## Database Schema

None expected if address snapshots already store phone and can hold kind /
company name. If the live confirm-address payload lacks `addressKind` or
`phoneCountry`, extend the auction order address snapshot in the same migration
as the SPA wiring — nullable kind defaulting to personal for existing rows.

## API Contracts

Only if the live confirm-address body is still free-text phone without kind:

- Add `addressKind: "personal" | "company"`
- Keep `phone` as string (E.164 when parseable)
- Optional `phoneCountry` for soft readiness round-trips
- `company` required by product rules when kind is company (service refuses)

Unchanged endpoints are omitted.

## Migration Plan

1. Land `@grade10/ui` + preview stories on the store (already largely present).
2. Bump `external/grade10-spec` in `grade10`.
3. Wire Winner Order setup to the form contract and i18n keys; migrate snapshot
   fields only if the API still lacks them.
4. Rollback reverts the SPA wiring / submodule pin; no data rewrite for soft
   phone values already stored as strings.
