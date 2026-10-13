# Tasks

## 1. Preview — View Bank Details and proof split

- [x] 1.1 Add `WinnerOrderHowToPayDialog` with amount (no Copy), FPS / HK
      Local / International pill tabs (`defaultValue="fps"`), per-tab fields
      (HK Local: bank name, codes, full account number; SWIFT: beneficiary
      name, beneficiary address, bank name, bank address, SWIFT/BIC, full
      account number), payment reference as a detail row at the bottom of each
      tab (no Copy) with memo warning, OUR note on SWIFT after the reference
      band, FPS QR placeholder with solid border and alt, Done footer
- [x] 1.2 Slim `WinnerOrderPaymentProofDialog` to title Submit Payment Proof
      and proof form only (no amount, reference box, or Proof of Payment
      heading; remove flat Bank Details rails card); keep file limits and
      abandon gate
- [x] 1.3 Wire Order summary primary **Submit Payment Proof** and secondary
      **View Bank Details** for pending bank-transfer invoices; hide both when
      Payment Verifying
- [x] 1.4 Align transfer reference fixture to `LK7P2Q01`; seed previews with
      Grade10 Finance Limited / HSBC Hong Kong samples. Live instructions and
      the FPS QR come from Finance-owned configuration and are snapshotted on
      the issued invoice.
- [x] 1.5 Storybook: View Bank Details standalone (FPS / HK Local / SWIFT);
      Submit Payment Proof standalone; Payment page shell + **Submit Proof
      Flow** / **Pay with Card** CTA outcomes (no duplicate dialog smokes)
- [x] 1.6 Run ui-ux-pro-max ux/shadcn searches and pre-delivery checklist
      (320px hug + horizontal tab scroll; `sm+` full-width track; QR alt;
      touch gap; body scroll on panels)
