# Verify once, from the account

**Author:** @ecchochan - 2026-09-05

## Why

The identity store holds one verified record per person and answers it across
every product, but only one product asks: the vault, for a visit. A collector
who buys a graded card worth a year's salary at the store, or bids that much at
the auction, is asked nothing about who they are — and one who verified for a
vault visit last month gets no credit for it anywhere else.

- **High-value sales know nobody.** A dealer in high-value goods in Hong Kong
  has to know its customer above HKD 120,000; the store and the auction sell
  and settle above it with no identity behind the account.
- **The only way to verify is to book a visit.** A person with no vault case
  cannot be verified at all, so the record's cross-product reuse has one
  writer and no reader.
- **A verification is a ceremony somebody else starts.** The vault invites; the
  collector has no page of their own to verify from, and no consent step
  written down anywhere.

**Metric:** share of orders and bids at or above the bar placed by a verified
collector, and the share of those verifications the collector did once and
was recognised for a second time.

## What Changes

- **A collector verifies from their account.** The account page shows where
  they stand — verified until when, expired, or not yet — and the bar an order
  or a bid is held to. They read what the provider will check, tick their
  consent, and are handed to the provider's page on their own device. The
  verdict lands on its own, as it does for a vault visit.
- **Consent is explicit, and recorded.** No check starts without the
  collector's agreement given on the page that starts it, on every surface
  that hosts a check — the account page and the vault's invitation alike.
- **A checkout above the bar needs a verified buyer.** The store prices the
  basket's goods live before any order is made; at or above the bar, a buyer
  the identity store does not answer `verified` for is sent to their account
  to verify, and a guest is asked to sign in. No order is left behind.
- **A bid above the bar needs a verified bidder.** The storefront holds the
  bid before the auction hears of it, and tells the bidder where to verify.
- **The bar is the brand's.** Grade10's is **12,000,000 HKD minor units**
  (HKD 120,000.00), on an order's goods and on a bid alike, so a collector
  meets one bar whichever way they buy. ZZZ verifies nobody and gates
  nothing.
- **One check counts everywhere.** A collector verified at a vault visit is
  recognised at the store and the auction without a ceremony; one verified
  from their account is recognised at their next visit.

## Delivery status

Account-based identity verification and high-value checkout and bid gating are
deferred and disabled in production. Dormant implementation may remain behind
optional runtime or feature-flag wiring, but no account check is started by
this change and no checkout or bid is blocked by it while disabled.

The threshold and accountable Compliance owner remain unresolved. HKD 120,000
and the existing Product/Compliance owner labels are proposals, not shipped
decisions.

This change remains active. It is not eligible for archive or spec fold until
the threshold and Compliance ownership are decided, the required compliance
approval is complete, and the feature is enabled and deployed to production.

## Non-Goals

- **Verifying a guest.** A person with no account has no standing; above the
  bar they sign in first.
- **Any identity field on the site.** The account page says verified, expired
  or not yet, and until when. A name, a birth date and a document are the
  vault's to show an operator, never a storefront's to show anybody.
- **Inviting by email from the store.** The collector is on the page that
  asks; the vault keeps its emailed invitation for a visit booked ahead.
- **Sanctions, PEP and watchlist screening.** A different question, with its
  own legal duty.
- **Re-verification on a schedule.** An expired document asks the collector
  again; nothing else does.
- **Chinese and Korean copy in the application.** The catalogue lands here in
  every language the site speaks; the application wires its pages through it
  once the submodule moves.

## Capabilities

### New Capabilities

- `grade10-site/store/account-identity` — the account page's identity card:
  the standing it shows, the consent it collects, the check it starts, what it
  never shows, and what erasing the account does to the check.

### Modified Capabilities

- `grade10-site/commerce/commerce` — the identity bar at checkout: goods
  priced live before an order, a verified buyer above the bar, a guest sent to
  sign in.
- `grade10-site/auction/auction` — the identity bar on a bid: held at the
  storefront, before the auction hears of it.

## Impact

- **The store backend** — hosts a hosted check for the site's own accounts,
  the way the vault hosts one for a case: the check's row in the store's
  database, the provider's callback on the store's worker, the read-back and
  expiry lists on its cron, and the check erased with the account.
- **The identity store** — a second host holds the service, minted for the
  store; the record and its bindings are unchanged.
- **Checkout and bidding** — one gate each, at the storefront, on the standing
  the identity store answers.
- **The account page** — an identity card; the checkout page and the bid
  dialog — one refusal each, pointing at it.
- **No ZZZ surface.** ZZZ runs auth and store only, verifies nobody, and its
  store gates nothing.
- **No new permission.** A person reads and starts their own verification;
  no operator surface changes.

## Decisions taken

- **Threshold** — ❓ Open. The order and bid amount that requires a verified
  identity, its rationale, and its accountable owner are not confirmed. HKD
  120,000 is a candidate only.
- **Compliance ownership** — ❓ Open. The accountable Compliance owner and
  approval path for consent, reuse, provider transfer, retention, and erasure
  are not confirmed.
- **Production enablement** — Deferred. The feature remains disabled until the
  threshold, Compliance ownership, DPIA, DPA, and production rollout are
  approved.

## References

- [Account · Verified Identity](../../../docs/prds/products/grade10-site/auction/account.md#verified-identity)
- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic)
