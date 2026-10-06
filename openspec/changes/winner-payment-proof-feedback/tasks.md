# Tasks: Winner payment proof feedback

The preview owns the shared feedback composition and its stories. The
consuming `grade10-site` application wires the same outcomes into its existing
Winner Order surface. No group has an owner until an engineer claims it.

## 1. Preview feedback contract (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Add failing interaction tests for success and failure toast copy, the retained draft after a failed upload, and the page success callback (`winner-order-SC-119`, `winner-order-SC-218`)
- [ ] 1.2 Add failing interaction tests for HEIC conversion and upload busy states; assert Cancel, Escape and overlay dismiss leave the dialog open (`winner-order-SC-219`)
- [ ] 1.3 Implement the preview-local feedback helper and the ready, converting, submitting and failed state transitions; keep the approved copy in one helper (`winner-order-SC-119`, `winner-order-SC-218`, `winner-order-SC-219`)
- [ ] 1.4 Verify the focused standalone stories, preview typecheck and lint, `pnpm check:manual` and `pnpm run validate:changes winner-payment-proof-feedback`

## 2. Winner Order preview integration (grade10-spec) (owner: @htonyl)

- [ ] 2.1 Add failing page and story assertions for Payment Verifying, the success toast, the hidden Submit Payment Proof and View Bank Details controls, and the inline irreversible microcopy (`winner-order-SC-218`, `winner-order-SC-220`)
- [ ] 2.2 Wire the page success callback to the existing Payment Verifying state and use the shared feedback helper from the page and standalone stories (`winner-order-SC-218`)
- [ ] 2.3 Keep the failed dialog open with its draft and error toast, and block all leave paths while converting or submitting (`winner-order-SC-119`, `winner-order-SC-219`)
- [ ] 2.4 Verify the Winner Order preview story set and the focused page flow, including the non-busy dirty-leave confirmation (`winner-order-SC-102`, `winner-order-SC-219`)

## 3. Consuming Winner Order integration (grade10) (owner: @htonyl)

- [ ] 3.1 Add failing consumer tests for successful proof acknowledgement, failed retry with draft retention, hidden payment entry points after Payment Verifying, and busy leave blocking (`winner-order-SC-119`, `winner-order-SC-218`, `winner-order-SC-219`)
- [ ] 3.2 Wire the existing consuming-app proof dialog and Winner Order page to the approved feedback contract and exact success and failure copy; keep the existing upload procedure and i18n boundary (`winner-order-SC-119`, `winner-order-SC-218`, `winner-order-SC-219`)
- [ ] 3.3 Verify the consuming-app typecheck, lint, focused Winner Order tests and the focused browser E2E journey (`winner-order-SC-119`, `winner-order-SC-218`, `winner-order-SC-219`)

## 4. The walk - Preview payment proof feedback (grade10-spec)

- [ ] 4.1 Walk the standalone success, failure and busy stories, then the page flow from pending bank-transfer invoice through success and Payment Verifying; cover `winner-order-SC-102`, `winner-order-SC-119`, `winner-order-SC-218`, `winner-order-SC-219` and `winner-order-SC-220`
- [ ] 4.2 Run the focused preview checks after the walk and record any implementation defect against the owning group
- [ ] 4.3 After deployment, run `/tcs-review winner-payment-proof-feedback` and review the draft cases before any manual execution

## 5. The walk - Consuming Winner Order feedback (grade10)

- [ ] 5.1 Walk the consuming Winner Order from a pending bank-transfer invoice through successful proof submit and Payment Verifying; cover `winner-order-SC-119`, `winner-order-SC-218` and `winner-order-SC-219`
- [ ] 5.2 Run the final focused consuming-app checks after the walk and record any implementation defect against the owning group
- [ ] 5.3 After deployment, run `/tcs-review winner-payment-proof-feedback` and review the draft cases before any manual execution
