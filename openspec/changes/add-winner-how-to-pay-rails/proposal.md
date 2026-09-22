**Author:** @tangconst - 2026-09-22

Product context: [Post-Bidding · Paying](../../../docs/prds/products/grade10-site/auction/post-bidding.md#paying).

## Why

A pending bank-transfer invoice already owes the winner three rails and a
proof upload, but Storybook folds both into one dialog under a single Pay
control. The winner cannot tell from Order summary that bank details live
inside that dialog, and stacking FPS / local / SWIFT with the proof form
makes either job hard to finish.

**Metric:** share of pending bank-transfer Winner Order sessions where View
Bank Details and Submit Payment Proof are separate controls and the View Bank
Details surface opens with FPS selected (target: 100% of those sessions in
preview, then grade10-site).

## What Changes

- **Two Order summary entry points** on a pending bank-transfer invoice:
  primary **Submit Payment Proof** opens the proof dialog; secondary
  **View Bank Details** under it opens the rails dialog. Both hide once Payment
  Verifying (or when Pay is already hidden).
- **View Bank Details dialog** shows amount due (display-only) and three pill
  tabs defaulting to FPS. Each tab includes that rail’s fields, then payment
  reference as a detail row (`LK7P2Q01`, no Copy) with a memo warning —
  FPS (ID, account name, QR), HK Local (bank name, bank code, branch code,
  full account number including bank and branch code), International / SWIFT
  (beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC,
  full account or IBAN, then payment reference, then OUR charges note).
  No Copy on amount or rail fields.
- **Submit Payment Proof dialog** is proof-only (title **Submit Payment
  Proof**): proof fields and FileDropzone only — no amount due, transfer
  reference, or Proof of Payment heading. Existing 1–3 / 5 MB / 15 MB / HEIC
  upload rules and irreversible confirm stay. Flat Bank Details card removed.
- **Durable view-bank-details fields expand** for QR, branch code, beneficiary
  address, bank name, bank address, OUR note, tab default FPS, and the two entry points.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — View Bank Details surface, Order summary
  secondary control, expanded rail fields; Submit Payment Proof stays a
  separate dialog.

## Impact

- Winner Order preview under `apps/preview` (`WinnerOrderHowToPayDialog`,
  slimmed `WinnerOrderPaymentProofDialog`, Order summary secondary control).
- No new `@grade10/ui` export — both dialogs stay preview composition.
- `grade10-site` wires the same entry points when it consumes the change;
  live FPS QR and account values wait on Finance.

## Open Questions

- ❓ Live account values and FPS QR asset — Finance (already on the PRD).

## References

- [Post-Bidding · Paying](../../../docs/prds/products/grade10-site/auction/post-bidding.md#paying)
