## Screens

### Winner Order — Order summary (pending bank transfer)

Layout SoT: Storybook `My Auctions/Winner Order/Payment` —
`Pending Payment — Bank Transfer` and related payment stories in
`apps/preview/src/pages/winner-order.payment.stories.tsx`.

Primary full-width **Submit Payment Proof**; secondary full-width outline
**View Bank Details** immediately beneath (≥8px gap). Secondary hides whenever the
primary is hidden.

### Winner Order — View Bank Details

Storybook: `My Auctions/Winner Order/Payment/View Bank Details` (standalone) and
opened from the page secondary control.

Title **View Bank Details**. Subtext: choose a transfer method and use the
details below. Amount due as medium emphasis type only. Tabs (default pill
variant, `defaultValue="fps"`, full-width list): FPS, HK Local, International.
Each panel scrolls inside the dialog (tab list stays put). FPS: scan QR (solid
border frame) beside manual FPS ID / account name. HK Local: bank name, bank
code, branch code, full account number (bank and branch code included). SWIFT:
beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC,
full account number or IBAN. Each tab ends with a payment-reference band
(label, code, memo warning, tight code-to-hint gap) in the same field rhythm
as the rail rows. SWIFT places the OUR alert **after** that band so destination
fields stay continuous. Preview samples use Grade10 Finance Limited / HSBC Hong
Kong. Footer **Done**.

### Winner Order — Submit Payment Proof

Storybook: `My Auctions/Winner Order/Payment/Submit Payment Proof` and page
story **Submit Proof Flow**.

Title **Submit Payment Proof**. Subtext: after transfer, upload the receipt
here. No amount due, no transfer-reference box, no Proof of Payment heading —
proof fields and FileDropzone only. Footer Cancel · **Submit Payment Proof**.

No new Figma frame — Dialog / Tabs / Button / FileDropzone / Alert already ship
in `@grade10/design-system`.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Dialog`, `DialogHeader`, `DialogTitle`, `DialogSubtext`, `DialogBody`, `DialogFooter`, `DialogClose` | `@grade10/design-system` | Both modals |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@grade10/design-system` | Rail switch in View Bank Details (default / pill) |
| `Button` | `@grade10/design-system` | Submit Payment Proof / View Bank Details / Done / Submit |
| `Alert` | `@grade10/design-system` | OUR note on SWIFT (inline, not dismissible) |
| `FileDropzoneTarget`, `FileDropzoneFileList` | `@grade10/design-system` | Proof upload |
| `Text`, `Toast` | `@grade10/design-system` | Form hints, proof feedback |
| Preview `WinnerOrderHowToPayDialog` | `apps/preview` | View Bank Details assembly — not a published export |
| Preview `WinnerOrderPaymentProofDialog` | `apps/preview` | Proof-only assembly — not a published export |

**ui-ux-pro-max gates (build):** one primary CTA; FPS QR descriptive `alt` /
`role="img"`; touch gap under primary; no horizontal scroll at 375px; Phosphor
icons only; Grade10 tokens only (no alternate palette).

**Copy work for `tasks.md`:** preview holds English stand-ins. When
`grade10-site` wires the surface, answer keys in `@grade10/i18n`.

## States

### Winner Order — Order summary

| State | Shows | Anchor |
| --- | --- | --- |
| Pending bank transfer | Submit Payment Proof + View Bank Details under it | `winner-order-SC-180` |
| Payment Verifying / primary hidden | Neither Submit Payment Proof nor View Bank Details | `winner-order-SC-108` |

### Winner Order — View Bank Details

| State | Shows | Anchor |
| --- | --- | --- |
| Open (FPS default) | Amount + FPS panel (ID, account name, QR with alt, payment reference at bottom) | `winner-order-SC-181` |
| HK Local tab | Bank name, bank code, branch code, full account number (bank and branch code included); payment reference at bottom | `winner-order-SC-182` |
| SWIFT tab | Beneficiary name, beneficiary address, bank name, bank address, SWIFT/BIC, full account number; payment reference; OUR note after reference | `winner-order-SC-183` |

### Winner Order — Submit Payment Proof

| State | Shows | Anchor |
| --- | --- | --- |
| Form open | Title Submit Payment Proof; proof fields only; no rail tabs | `winner-order-SC-184` |
| Successful submit | Payment Verifying on Winner Order | `winner-order-SC-108` |
| Leave with draft | Confirm abandon | **Out of suite:** abandon gate |
