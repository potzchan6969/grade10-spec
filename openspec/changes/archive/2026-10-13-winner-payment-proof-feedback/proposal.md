**Author:** @tangconst - 2026-09-29

Product context: [Post-Bidding · Bank Transfer Proof](../../../docs/prds/products/grade10-site/auction/post-bidding.md#bank-transfer-proof).

## Why

A winner who submits bank-transfer proof must know the upload landed and that
Grade10 is verifying it. Preview today only toasts when Winner Order page
wiring runs; the standalone Submit Payment Proof story closes silently on
success, and a failed upload has no stay-open path. Busy states still allow
leave, so submit and HEIC convert can race with abandon.

**Metric:** after a successful proof submit on Winner Order, the winner sees
both the success toast and Payment Verifying surface (target: 100% of those
submits in preview and app).

## What Changes

- **Success acknowledgement** — toast **Proof submitted** / **We'll verify
  your payment shortly.** plus Payment Verifying (alert on; Submit Payment
  Proof, View Bank Details and further upload hidden).
- **Shared toast helper** in preview so page and standalone story cannot
  drift.
- **Submit failure** — dialog stays open, draft kept, toast **Proof not
  submitted** / **Nothing was saved. Try again.**
- **Busy lock** — while submitting or converting HEIC, the whole form locks
  and leave is blocked (no Cancel, Escape or overlay dismiss).
- **Confirm stays inline** — irreversible microcopy at submit; no second
  confirm screen.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — proof upload success toast, failure
  stay-open behaviour, and busy-leave rules on Submit Payment Proof.

## Impact

- Winner Order preview: proof dialog, page wiring, Submit Payment Proof
  stories (including a forced-failure story).
- Consuming `grade10-site` must show the same toast and busy rules when it
  wires the dialog; no new `@grade10/ui` export in this change.
- PRD Post-Bidding · By Bank Transfer carries 🚧 lines this change delivers.

## Open Questions

None. The grill settled acknowledgement, failure, busy leave and docs
vehicle.

**Archive:** @tangconst after deploy.

## References

- [Post-Bidding · Bank Transfer Proof](../../../docs/prds/products/grade10-site/auction/post-bidding.md#bank-transfer-proof)
