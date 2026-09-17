## 1. Product record and email templates (grade10-spec)

- [ ] 1.1 Confirm `order-delivered.tsx` and `order-cancelled.tsx` (and
      `payment-reminder.tsx` `urgency: "first"`) match
      `order-mail-SC-40`…`SC-43` — address / delivered time, cancelled-at, CTA
      order, Contact Us destination; adjust copy only where the templates
      drift from the settled letters.
- [ ] 1.2 Keep the 🚧 outcomes on
      `docs/prds/products/grade10-site/auction/bidding.md` (no one-hour
      reminder) and `post-bidding.md` (reissue = payment reminder; delivered;
      cancelled) aligned with this change; no scenario ids on the pages.
- [ ] 1.3 Verify: `pnpm check:manual` (this change clean), `pnpm run
      tcs:validate email-trigger-revision`.

## 2. Retire the one-hour ending-soon fanout (grade10)

Needs nothing from group 1.

- [ ] 2.1 Remove `endingSoonReminders` from `WORK_LISTS` and stop calling
      `remindEndingSoon` so T−1h claims and bulk jobs no longer run —
      `grade10-site-auction-notifications-SC-44`, `SC-48`; keep
      `listing_ending_soon` inactive if the kind remains.
- [ ] 2.2 Leave closes-in-24h and extended progress fanouts unchanged so
      `grade10-site-auction-notifications-SC-45`, `SC-46`, `SC-47` (and
      durable `SC-08`, `SC-09`) still pass; update the pass-order comment and
      `docs/architecture/auction.md` Sweeps rows that still treat ending-soon
      as live mail.
- [ ] 2.3 Verify: focused ending-soon / progress fanout and pass-order tests,
      `pnpm run typecheck` for the auction backend package,
      `pnpm run test:backend` for the auction worker lane that owns these
      specs.

## 3. Reissue sends the payment reminder (grade10)

Needs group 1 only if React Email wiring for `invoice_sent` / payment-reminder
`first` is not already bound in the application.

- [ ] 3.1 On both reissue paths, enqueue `invoice_sent` with the **new**
      `invoiceId` (never `invoice_reissued`) so
      `order-mail-SC-40` holds — same first payment letter as send, with total
      and `Pay by …`; leave day-3 / day-6 scheduling on
      `schedulePaymentReminders`.
- [ ] 3.2 Ensure a repeated confirmation of the same reissue does not send a
      second letter (`order-mail-SC-43`) via the existing idempotency key; keep
      `invoice_reissued` inactive.
- [ ] 3.3 Verify: focused winner-invoice / post-sale reissue and order
      notification tests, `pnpm run typecheck`, `pnpm run test:backend` for
      the auction lane.

## 4. Delivered and cancelled letter content (grade10)

Needs group 1 templates available to the render path (submodule bump if the
application pins an older SHA).

- [ ] 4.1 Activate `delivered` and `order_cancelled` in `ACTIVE_MAIL_KINDS`
      and pass delivery address, delivered time, cancelled-at, View order, and
      Contact Us into the React Email templates so `order-mail-SC-41` and
      `order-mail-SC-42` hold.
- [ ] 4.2 Advance `external/grade10-spec` to the landed group 1 commit when
      templates or PRD marks moved, preserving unrelated nested work, and make
      `pnpm run check:submodules` pass.
- [ ] 4.3 Verify: focused order-email render / fulfillment / cancel tests,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`,
      `pnpm run build` where integration binds the email package.
