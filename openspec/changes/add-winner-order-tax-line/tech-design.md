## Context

The auction invoice already persists the amounts that make one immutable
quote: Winning Bid, Buyer's Premium, Shipping & Handling, optional Insurance,
Subtotal, Payment Processing Fee and Order Total. Its PDF projection already
renders ordinary charge rows from `lineItems`, but the quote writer and the
Winner Order read model have no tax value to supply.

Tax has the same storage boundary as Insurance. An operator supplies an
optional integer count of minor units while preparing an invoice or a
reissue. The invoice snapshot, not the winner's current address or a rate
service, owns the amount after send.

This change follows `add-shipping-insurance-order-summary-tooltip`. That
change supplies the summary-row tip mechanism and the pre-send TBD treatment
that Tax consumes.

## Decisions

1. **The invoice snapshot owns optional Tax.** Add a nullable tax amount to
   the quote input and persisted invoice amount set. A supplied value is an
   integer count of minor units in the invoice currency and must be greater
   than zero. `null` means the operator added no Tax; zero is never stored as
   an alternative spelling of absence.
   - Rejected: derive Tax from the delivery address at read time. No tax rate,
     jurisdiction rule or rounding rule belongs to this change, and a later
     address edit must not mutate an issued invoice.

2. **One pricing function derives every dependent total.** Extend the
   existing invoice pricing input with optional Tax. It calculates Subtotal
   from Winning Bid, Buyer's Premium, Shipping & Handling, Insurance when
   present and Tax when present, then calculates the card processing fee from
   that Subtotal through the existing gross-up rule. Quote preview, send and
   reissue call the same function.
   - Rejected: add Tax to Order Total after the processing fee is calculated.
     That would make preview and issued totals easy to diverge and would leave
     Grade10 absorbing the provider fee on Tax.

3. **A reissue writes a fresh Tax snapshot.** The reissue command accepts the
   same nullable Tax input as the first quote. Its change detector compares
   the prior and next normalized values, and the append-only audit entry
   records both when Tax changed. Reissue validation reuses the first-send
   positive-integer refusal.
   - Rejected: mutate Tax on the current invoice. Reissues retain the existing
     immutable-invoice and append-only-audit boundary.

4. **Tax crosses existing projections as an optional money line.** The
   winner-order read model exposes Tax from the current invoice. The Order
   Summary inserts it in the existing ordered line projection and supplies
   localized label and tooltip copy. Before send, the page supplies the
   dependency's TBD row; after send, a null amount omits the row. Invoice and
   receipt generation pass Tax as an ordinary `lineItems` charge row between
   Insurance and Subtotal.
   - Rejected: add a Tax-specific shared UI export. The summary and PDF blocks
     already accept optional supplied rows; tax policy remains in the auction
     application.

5. **Copy stays at the application boundary.** Add the Tax label, tooltip and
   operator-field copy to each Grade10 locale. Shared components receive that
   copy through props and do not import message catalogs.
   - Rejected: keep the English preview fixture as production copy. It would
     bypass the catalog completeness check and leave other Grade10 locales
     unanswered.

## Data Model

| Value | Shape | Owner |
| --- | --- | --- |
| Quote Tax input | `number \| null`, integer minor units, greater than zero when present | First-send and reissue command |
| Invoice Tax | Nullable integer minor units in the invoice currency | Immutable invoice snapshot |
| Audit Tax change | Prior and next nullable minor-unit values | Append-only reissue entry |
| Winner Tax line | Optional formatted money line from the current invoice | Winner-order read projection |

The invoice currency remains the only currency field. Tax does not carry a
rate, jurisdiction, provider reference or address foreign key. Existing rows
backfill to `null`, preserving their totals and generated documents.

## Service Interfaces

The existing quote, send and reissue processors gain one field rather than a
new endpoint:

```ts
type OptionalTaxInput = {
  taxMinor: number | null;
};
```

- **Quote preview** returns Tax, Subtotal, Payment Processing Fee and Order
  Total from the shared pricing function.
- **Send invoice** validates and persists the supplied Tax in the new invoice
  snapshot in the same transaction as its other amounts.
- **Reissue invoice** accepts Tax, compares it with the current invoice and
  records its prior and next values when changed.
- **Winner order read** returns the current invoice's optional Tax without
  recomputing it from an address.
- **PDF generation** maps the same persisted value to an ordinary `lineItems`
  charge row between Insurance and Subtotal. A null value supplies no row.

Validation failures remain tagged command refusals. A zero, negative,
fractional or unsafe Tax value is refused before pricing or persistence; no
invalid value is coerced to `null`.

## Risks / Trade-offs

- **[Risk] Preview, send and reissue calculate different totals.** → Route all
  three through one pure pricing function and test identical inputs against
  identical outputs. This preserves Determinism and Consistency.
- **[Risk] A historical invoice changes when an address or tax policy
  changes.** → Persist Tax on each immutable invoice snapshot and read it only
  from that snapshot. This preserves Resilience.
- **[Risk] Null and zero collapse at a form or wire boundary.** → Normalize an
  empty optional field to `null`, retain numeric zero for validation and
  refuse it explicitly. This preserves Clarity.
- **[Risk] A reissue changes Tax without naming it in the audit record.** →
  Keep Tax in the central quoted-amount comparison and test its prior and next
  values. This preserves Observability.
- **[Trade-off] Tax remains a scalar amount without provenance.** → That is
  the smallest shape that serves the operator-entered decision. A later
  computed-tax change can add provenance without replacing the snapshot
  amount. This preserves Flexibility and Simplicity.

## Migration Plan

1. `add-shipping-insurance-order-summary-tooltip` landed and archived on
   2026-09-24. Advance the application submodule to the commit containing
   both contracts.
2. Add the nullable invoice Tax field and backfill existing invoices to
   `null`. Deploy readers that tolerate `null` before exposing the operator
   input.
3. Deploy the shared pricing, quote, send, reissue and audit paths, followed
   by the admin field and winner/PDF projections with all locale copy.
4. Verify an untaxed existing invoice retains its stored totals and omits
   Tax, then verify a taxed card invoice and a Tax-only reissue end to end.
5. Roll back the surfaces and writers before the reader. Keep the nullable
   field and any already-issued Tax snapshots; the older reader ignores the
   additive value while issued invoice totals remain immutable.
