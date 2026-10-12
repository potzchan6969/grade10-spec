# Tasks

> Draft — grouped tasks fill in at planning-dev once PM confirms the open
> decisions (rate source/lock, HKD-JPY schedule fate, USD verified-bidder bar,
> invoice disclosure).

## Preparation already landed (ahead of acceptance)

- [x] Auction bid-side fixtures and letter previews read `US$` (emails
  `preview-lot.ts`, `packages/ui` auction stories, `apps/preview` auction
  pages); order/invoice amounts stay `HK$` to exercise an HKD-settled order.
- [x] `DEFAULT_LISTING_CURRENCY` → `USD` in `packages/ui/src/lib/format-money.ts`.

## Open on PM

- [ ] Conversion rate owner, lock point (setup vs invoice send), rounding.
- [ ] HKD/JPY schedules and ceilings: retire, or keep for lots already priced.
- [ ] Verified-bidder bar restated in USD (today HKD 120,000).
- [ ] Whether invoices/letters disclose the USD winning bid or the applied rate.
