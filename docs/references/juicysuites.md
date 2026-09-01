# JuicySuite Loyalty — Feature Spec for Reimplementation

Reverse-engineered from JuicySuite's public product pages (juicysuite.com, Aug 2026). Scoped for a build on **a custom e-commerce site + Shopify**.

Legend: **P0** = core MVP · **P1** = second wave · **P2** = later / optional

---

## 1. Feature inventory

### 1.1 Membership & identity — P0
| Feature | Notes |
|---|---|
| Member registration | Phone or social login; branded signup URL + QR auto-generated. Claimed ~10s signup, no app download. |
| Web member centre | Balance, tier, vouchers, history, profile — hosted branded page |
| Apple Wallet / Google Wallet pass | Issued at enrolment; web pass fallback for unsupported devices |
| Design customisation | Brand colours, logo, hero art, welcome message; live preview in admin |
| Unified profile | One record per person across POS / web / app / wallet; identity resolution on email + phone + device + loyalty ID |
| White-label mobile app | Enterprise/add-on tier only |

### 1.2 Earn mechanics — P0
| Feature | Notes |
|---|---|
| Points | Earn per dollar / per visit / per SKU / per action |
| Stamp card | "Buy N get 1" — configurable stamp count, animated progress, auto-reissues a fresh card on completion |
| Bonus multipliers | Scheduled (e.g. 2× Tuesdays) and segment-scoped |
| Welcome gift | On signup — P1 |
| Birthday gift | Date-triggered — P1 |
| Missions / challenges | Multi-buy, spend goals, consecutive-visit streaks — P2 |
| Referral earn | Two-sided, see 1.6 |

### 1.3 Tiers — P1
- Configurable tier count (their default demo shows 4: bronze → black)
- Entry thresholds on rolling spend windows (e.g. $1,200 / rolling 12 months)
- Per-tier perks: discount %, early access, free shipping, exclusive vouchers
- Auto-upgrade the instant a threshold is crossed; congrats message fires across wallet + email + push
- Downgrade rules at review date, with optional grace period + advance warning
- Tier doubles as a ready-made segment for targeting
- Member-facing progress indicator ("X to next tier")

### 1.4 Burn / rewards — P0
| Feature | Notes |
|---|---|
| Points → reward redemption | Catalogue of redeemable rewards with point cost |
| Voucher types | % off, fixed amount, BOGO, free item, physical/digital gift |
| Voucher rules | Min spend, eligible SKUs, stacking limits, expiry window, per-member caps |
| Self-declining vouchers | Rules enforced server-side at redemption — declines itself if conditions unmet |
| Single-use enforcement | Voids across all channels the instant it's redeemed (anti-screenshot) |
| One-scan redemption | QR from wallet pass or app; NFC tap at contactless reader |
| Reward quota management | Set/adjust/monitor caps per reward |
| Promo codes | Manually distributed codes — P1 |

### 1.5 Stored value — P2
| Feature | Notes |
|---|---|
| Prepaid credit wallet | Reloadable, tied to member account |
| Top-up + auto-reload | Auto top-up when balance drops below threshold |
| Bonus on load | Tiered (e.g. load 100 → get 115), applied at purchase |
| Real-time draw-down | Balance updates at POS/web/app on spend, no reconciliation lag |
| Admin controls | Freeze, transfer, refund a balance; full audit log of every load/spend/refund |
| Gift cards | Separate from credit: fixed value, bought for someone else, branded designs, personal message, **scheduled delivery date**, partial redemption with remainder retained, digital + physical |
| Expiry / breakage rules | Configurable within local regulation |

### 1.6 Referral — P1
- Two-sided reward (advocate + friend), each configurable independently
- Reward released only on a **qualifying milestone** you define: signup, first purchase, or spend threshold
- Personal link **and** code per member, shareable in one tap to WhatsApp / SMS / email / social
- Per-channel attribution: share → signup → first qualified purchase
- Fraud checks: device, payment method, behaviour; blocks self-referrals, duplicate accounts, referral rings
- Reward caps per advocate
- Top-advocate leaderboard; CAC and ROI per advocate

### 1.7 Gamification — P2
- Instant-win: spin-to-win wheel, scratch card, mystery box
- Server-side draws against defined odds; entries rate-limited per member; every play logged
- Prize pool + budget caps — campaign auto-stops when budget exhausted
- Streaks (consecutive visits) with progress bar
- Seasonal leaderboards, badge collections
- Same campaign renders in app + web + wallet pass with synced progress

### 1.8 Segmentation — P1
- **Dynamic segments**: rule-defined, membership recalculates automatically as behaviour changes
- Filter dimensions: spend, frequency, recency, products/SKU, tier, location, channel, lifecycle stage
- Live audience count while building
- Save + reuse segments
- Predictive scores: churn risk, next-best-product, high-value flag — P2
- One-click activation into a campaign, voucher, or automation

### 1.9 Marketing automation — P1
- Visual journey canvas: triggers → conditions/branches → actions
- Triggers: abandoned cart, birthday, lapsed visit (N days silent), tier promotion, signup, milestone
- Channels: email, SMS, push, wallet pass alert, WhatsApp, in-app
- Multi-step drips with wait/skip logic and step-aware fallbacks (email → SMS if unopened → wallet push)
- **Unified per-customer rate limit** across all channels
- A/B (and A/B/C/n) at every send step; promote a winner mid-flight without stopping the journey
- Preset journey templates, every node editable
- Geofenced wallet push (P2) — trigger on proximity to a store

### 1.10 Analytics — P0 (basic) → P1 (full)
- Real-time dashboards, no batch delay
- Core metrics: members, enrolment, active campaigns, **point liability**, redemption rate, **breakage**, repeat rate, AOV lift, program ROI
- Cohort analysis by signup month; funnel drop-off; tier movement over time
- Drill-down by cohort / channel / tier / store / date range
- Custom per-team dashboards (marketing = lift & ROI; finance = liability & breakage; ops = redemption volume)
- Scheduled recurring reports to email as PDF/CSV
- Live share links; CSV export

### 1.11 Admin & ops — P0
- Merchant admin portal, member management, transaction report
- **Staff app**: point/stamp earn & burn, voucher verification at counter
- POS integration (all plans)
- API access (their Elite tier and above)
- Enterprise: SSO, dedicated server, per-branch config, multi-branch rollups

### 1.12 AI layer — P2 / optional
- Loyalty marketing agent (campaign generation)
- Reporting insight agent (natural-language analytics)
- MCP server exposing loyalty data to LLM tooling

---

## 2. Their plan gating (useful as a build order)

| Tier | Unlocks |
|---|---|
| Basic | Registration, points/stamps, gift redemption, design customisation, wallet pass, vouchers, dashboard, member mgmt, transaction report, staff app, POS integration |
| Growth | Welcome gift, birthday gift, referral, push + SMS |
| Elite | Tiers, giveaway campaigns, promo codes, all missions, credit & prepaid voucher, API access |
| Enterprise | White-label app, SSO, dedicated server, system customisation |

Pricing model: **per branch**, member-quota-based (3k / 5k / 15k / 30k+), quota top-uppable, ~20% off annual.

---

## 3. Data model (minimum viable)

```
Member
  id, email, phone, name, birthday, locale, consent_flags,
  tier_id, tier_since, tier_review_at,
  points_balance, lifetime_points, lifetime_spend,
  shopify_customer_id, external_ids[], created_at, source

PointsLedger              # append-only, never mutate balance directly
  id, member_id, delta, reason, reference_type, reference_id,
  expires_at, campaign_id, created_at, idempotency_key

EarnRule
  id, trigger (order|visit|sku|action|signup|birthday|referral),
  rate, unit, multiplier, segment_id, sku_filter[],
  starts_at, ends_at, priority, active

Tier
  id, name, threshold_amount, threshold_window_days,
  perks_json, downgrade_grace_days, rank

Reward / Voucher
  id, type (percent|fixed|bogo|free_item|gift),
  value, point_cost, min_spend, eligible_skus[],
  stackable, max_uses, quota_total, quota_remaining,
  valid_from, valid_until

VoucherInstance
  id, voucher_id, member_id, code, state (issued|redeemed|expired|voided),
  issued_at, redeemed_at, redeemed_channel, order_id

StampCard
  id, member_id, template_id, stamps_current, stamps_required,
  completed_at, reward_voucher_id

StoredValueAccount + StoredValueTxn   # loads, spends, refunds, freezes
Referral                              # advocate_id, code, invitee_id, state, qualified_at
Segment                               # rule_json, is_dynamic, last_evaluated_at
Journey / JourneyRun                  # definition_json, member_id, current_node, state
Event                                 # raw event stream feeding everything above
```

**Non-negotiables:**
- Points are a **ledger**, not a mutable integer. Balance = sum of ledger. Refunds claw back via a negative entry.
- Every write carries an **idempotency key** — webhooks retry.
- Voucher redemption is a **single atomic transaction** with a row lock. This is where double-spend happens.
- Point expiry runs FIFO on a scheduled job.

---

## 4. Shopify integration

**Install & auth**
- Shopify App (or a private/custom app if it's only your store). One-click install, read catalogue + currency + customer base on connect.

**Webhooks to subscribe**
| Topic | Action |
|---|---|
| `orders/paid` | Award points, advance stamps, evaluate tier, mark referral qualified |
| `orders/updated` | Recalculate if line items changed |
| `refunds/create` | Claw back points proportionally |
| `orders/cancelled` | Reverse the full earn |
| `customers/create` | Create member, issue welcome gift |
| `customers/data_request` / `redact`, `shop/redact` | **Mandatory GDPR webhooks — app review fails without them** |

**Redemption at checkout**
- Points → discount is implemented as a **Shopify discount code** generated on demand (unique, single-use, customer-scoped), or as a **Function-based discount** (Shopify Functions) if you want it applied without a code.
- Tier perks (e.g. free shipping at Gold) → best as a **Discount Function** reading a customer metafield for tier.
- Write `tier`, `points_balance`, `member_id` to **customer metafields** so Liquid, Functions, and Flow can all read them.
- Checkout UI extensions for the "apply your points" widget on Shopify Plus; on non-Plus use the cart page.

**Storefront**
- Ship the widget as a **Theme App Extension (App Block)** so merchants/you drop it into the theme editor without editing Liquid. Inherits theme typography and palette.
- Surfaces: floating launcher, account page panel, product-page "earn X points" badge, cart-page redemption.

**Custom site (non-Shopify)**
- Your loyalty service is the source of truth; Shopify is one of N channels.
- Expose a REST/GraphQL API: `POST /events` (order, visit, action), `GET /members/:id`, `POST /redemptions`, `POST /vouchers/validate`.
- Same idempotency + ledger rules apply. Reconcile on a nightly job against Shopify order totals.

**Wallet passes**
- Apple: PassKit — you need an Apple Developer account, a Pass Type ID cert, and a web service endpoint for `getSerialNumbers` / `getLatestVersion` / push updates via APNs.
- Google: Google Wallet API — loyalty class + object, JWT "Save to Wallet" link.
- Both need a signed update pipeline: balance changes → push → pass refreshes on open.

---

## 5. Build order

**Phase 1 (MVP)** — member registration + web member centre, points ledger, earn on `orders/paid`, refund claw-back, one reward type (fixed/% voucher), Shopify discount-code redemption, storefront App Block, basic dashboard (members, points issued, points redeemed, liability).

**Phase 2** — tiers + auto up/downgrade, welcome & birthday gifts, referral with fraud checks, email/SMS/push channels, stamp cards, wallet passes.

**Phase 3** — segmentation, journey builder, A/B testing, cohort analytics, scheduled reports.

**Phase 4** — stored value/gift cards (regulatory weight: unredeemed balances are a liability, and escheatment rules vary by jurisdiction — worth a lawyer before you ship this), gamification, predictive scores.

---

## 6. Things easy to underestimate

1. **Point liability accounting.** Issued-but-unredeemed points are a balance-sheet liability. Model breakage from day one; finance will ask.
2. **Fraud.** Referral rings, voucher screenshot sharing, multi-account signups. Server-side enforcement only — never trust the client.
3. **Refunds and partial refunds.** Proportional claw-back that can push a balance negative. Decide the policy before you have the bug.
4. **Rate limiting across channels.** A member hitting a birthday journey, a tier-upgrade message, and a campaign in one hour needs a global per-member cap.
5. **Timezone and rolling windows.** "Rolling 12-month spend" for tier review is the single most common source of tier bugs.
6. **Wallet pass update cost.** Every balance change is an APNs push. Batch and debounce.
7. **Idempotency.** Shopify redelivers webhooks. Without keys you will double-award points on day one.