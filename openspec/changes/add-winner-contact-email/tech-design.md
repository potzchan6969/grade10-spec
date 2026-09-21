## Context

Winner Order Contact Us today sets a toast that names help, and order letters
share one bare `mailto:support@grade10.com` from
`packages/grade10-auction/backend/src/email/messages.ts`. The store already
holds the ready-email builders (`apps/emails/.../contact-mailto.ts`), the
preview dialog (`apps/preview/.../winner-order-contact-dialog.tsx`), and a
`Textarea` export — this change lands that behaviour in the live storefront
and in production letter renders.

See [proposal.md](./proposal.md) for why.

## Goals / Non-Goals

**Goals:**

- One ready-email shape (To, Subject, Message, mailto, copy text)
  recomputed from the order's current facts at render time
- Winner Order opens the copy-first dialog; letters carry the matching mailto
  and name the address in the body
- No new persistence for subject or body

**Non-Goals:**

- A new shared npm package for the builder between `apps/emails` and grade10
- Changing when Contact Us appears, or cancelled Winner Order Contact Us
- Operator → winner contact channel

## Decisions

The specs own the ready-email fields, subject forms, footer order, and letter
coverage. Implementation choices:

| Topic | Choice | Rejected |
| --- | --- | --- |
| Where builders live | Keep browser-safe and worker helpers separate: the storefront and production email renderer each implement the same fixed reason-to-ready-email table, asserted against shared fixture vectors; previews consume the renderer table where their runtime permits | Publishing a new shared package; importing `apps/emails` from the worker; storing subject/body on the order row; leaving the boundary open |
| Letter `contactUrl` | Build per letter at render in `emailPort` / message assembly from lot title, current invoice id, receipt ids, and reason — drop the storefront-wide bare `CONTACT_URL` constant for these kinds | Keeping one constant mailto and only changing the SPA |
| Partial-payment delivery | Add an append-only partial-payment notification kind, its database constraint migration, one idempotent enqueue at the partial-payment transition, and the production renderer before treating its contact URL as delivered | Preview-only template wiring while the requirement names a production letter |
| Winner Order UI | Local dialog state on Contact Us; `navigator.clipboard.writeText` for Copy Message; Open Mail App as `<a href={mailto}>` via Button `render` | Toast with address; silent `mailto:` as the only action; server round-trip to build the mail |
| Textarea | Consume the existing `@grade10/design-system` `Textarea` export via the submodule bump | A native `<textarea>` only in the SPA; a new `@grade10/ui` compound |
| i18n | Dialog chrome (title, labels, footer) in `@grade10/i18n` `auctionOrders` (or a sibling namespace); subject/body stay English product strings matching the letter helpers until catalogs own them | Hard-coding dialog chrome only in preview |

## Risks / Trade-offs

- **[Risk]** SPA and letter builders drift → **Mitigation:** shared fixture vectors assert the same reason → subject/body/mailto table in both helpers; backend tests cover all five letter kinds and frontend tests cover all three Winner Order reasons.
- **[Risk]** Clipboard permission fails → **Mitigation:** Copy Message still attempts write; failure surfaces through the control's existing error/pressed path — no alternate toast required until the PRD ❓ on confirmation lands.
- **[Risk]** A partial-payment transition can enqueue a duplicate letter → **Mitigation:** make the notification row unique at its existing invoice / receipt boundary and enqueue inside the transition's atomic write.

## Database Schema

`auction_order_notifications` owns delivery state. Add the partial-payment
kind to its append-only notification-type constraint and migration; reuse the
existing invoice and receipt identifiers as the idempotency boundary. No order
row stores a ready-email field.

## Service Interfaces

The partial-payment transition owns the notification write. After it records
the receipt, it inserts the partial-payment notification in the same atomic
operation; an existing notification for that receipt is a successful
idempotent result. The renderer reloads the current order, invoice, lot and
receipt data, then creates the ready-email fields without a balance.

Example: receipt `rcpt_42` on invoice `inv_7` inserts one
`payment_received_partial` notification. Retrying the transition finds that
notification and sends no second letter.

## Migration Plan

Deploy the notification-kind constraint migration before the service that
enqueues it, then deploy the renderer and storefront dialog. Rollback stops
new enqueues while retaining already-recorded notifications for the existing
delivery worker.
