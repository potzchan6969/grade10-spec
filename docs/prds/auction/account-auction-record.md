# Account auction record

## Summary

A collector who watches or bids on Grade10 auctions has nowhere to see what
they are following, where they stand, or what they owe. Today the only place a
listing's standing exists is the listing's own page, so a collector holds their
own auction activity in browser tabs and memory. This PRD covers a signed-in
collector's **auction record** in the account area: a **Watching** page for
listings they marked to follow, and a **Bidding** page for listings they have
bid on, from an open bid through a won listing's payment and delivery.

## Context

- Problem or opportunity: bidding is per-listing and pull-only. A collector who
  bids on six listings closing across an evening has no single answer to "am I
  still leading?", "what closes next?", or "which of these do I owe money on?".
  A collector who is outbid learns it by returning to that listing's page. A
  collector who wins learns what happens next from the operator who contacts
  them, because `grade10-auction/post-sale` records the payment and shipment
  states on the operator queue only — the winner has no view of the same facts.
- Evidence and links:
  - There is no collector-facing account surface for auctions anywhere in this
    store. `openspec/specs/grade10-auction/` holds `listing-page`,
    `listing-media`, and `admin-listing`; the account area's only capability is
    `grade10-store/account-profile`, which is profile fields alone.
  - `docs/prds/auction/auction.md` states the winner-facing side of post-sale
    as follow-on work ("a winner-initiated request on the storefront is
    follow-on"). This PRD is that follow-on for the record surface. It also
    brings watching into scope; the parent PRD listed the idea under the retired
    name favourites (see Decisions).
  - Every post-sale fact this page shows already exists as an operator-side
    requirement — outcome, payment state, shipment state — so the winner view
    is a second audience for records Grade10 already keeps, not new bookkeeping.
  - Assumption, not measured: no analytics exist for watch or return-to-bid
    behavior, because neither the watch action nor the surface exists. The
    baseline for every metric below is zero and must be established by the
    first release rather than compared against.
- Related PRDs, OpenSpec changes, and designs:
  - [`docs/prds/auction/auction.md`](auction.md) — the parent auction decision record.
  - `openspec/changes/add-grade10-auction/` — browse and bid, and the bid
    outcomes this page reports.
  - `openspec/changes/add-auction-payment-fulfillment/` — the listing outcomes,
    payment states, and shipment states the Bidding page mirrors for the winner.
  - `openspec/changes/add-account-profile/` — the account area this surface
    joins, and the precedent that an account page is never empty.

## Goals

- Give a signed-in collector one place that answers, without opening a listing:
  what am I following, what closes next, where do I stand, and what do I owe.
- Make being outbid recoverable inside the bidding window: a collector who
  returns to this page during a live listing can see the loss of the lead and
  act on it before the close.
- Let a winner follow their own listing from won to delivered using the same
  facts the operator works from, so "where is my card?" is answerable without
  contacting Grade10.
- Make watching cheap and reversible, so a collector marks interest early in a
  sale rather than deciding at the moment of the first bid.
- Establish the first behavioral signal for auction interest — watches, and
  watch-to-bid conversion — which the product has no measurement of today.

## Non-goals

- **Notifications.** No email, push, or SMS for a close approaching, an outbid,
  or a win. This surface is pull-only in its first release; a notification
  programme is a separate change with its own consent, delivery, and quiet-hours
  decisions. See Decisions for why watching still ships without it.
- **Auto-bidding and proxy bids.** Excluded by the parent PRD and unchanged here.
- **Retracting or editing a bid.** A placed bid is binding; nothing on this page
  withdraws one.
- **Paying, requesting a wire, or arranging delivery from this page.** The
  winner reads their payment and shipment state here; recording payment and
  shipment stays the operator's, per `grade10-auction/post-sale`. A
  winner-initiated wire request remains follow-on.
- **Invoices, receipts, refunds, or dispute flows.**
- **A public watch list or collector profile.** The record is owner-only, like
  the account profile. Nobody sees what another collector watches or bids on,
  and watch counts are not shown on a listing.
- **Search, saved searches, and recommendations.** Filtering is limited to the
  states this page already groups by; discovery stays the catalogue's job.
- **Seller-side records.** Grade10 is the seller in this MVP; there is no
  consignor view.
- **ZZZ.** `zzz` gains no account auction surface here.
- **Watching or bidding history export, and any record beyond the collector's
  own account.**

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Interested collector | Browsing a sale days before it opens; several listings look worth following | Mark them without commitment, and find them again when bidding opens without re-searching the catalogue. |
| Active bidder | Bidding across several listings that close the same evening | See at a glance which ones they still lead, which they have lost, and which close next — and reach the listing that needs a bid in one step. |
| Outbid collector | Returned to the site mid-window after being outbid | Learn they lost the lead, see what the next valid bid must clear, and decide whether to re-bid before the close. |
| Winner | Won a listing and wants to know what happens next | See that they won, what state their payment is in, and whether the card has shipped, without contacting Grade10. |
| Losing bidder | Bid and did not win | Confirm the outcome and confirm their card hold is released, so a pending authorization is not read as a charge. |

## Experience

### Primary flow

1. A signed-in collector opens the auction record from the account area and
   lands on **Bidding** when they have any bidding activity, and on
   **Watching** otherwise.
2. **Watching** lists the listings they marked, soonest close first, each row
   carrying the listing, its bidding standing, its close, and its state.
3. They unwatch a listing, or open one to bid. Placing a bid moves that listing
   onto **Bidding**; it stays on Watching too, marked as one they bid on.
4. **Bidding** lists the listings they bid on, grouped as **Active**, **Won**,
   and **Didn't win**, each row saying where they stand: leading, outbid, or the
   outcome of a closed listing.
5. A won row carries what happens next — payment state, then shipment state —
   and stays on the page through delivery.

### The states each page distinguishes

The state names below are a product decision: they are what the collector is
told, in the collector's vocabulary. Their checkable behavior — when each is
entered, what each row must carry, and how each is announced — belongs in the
capability spec named under Requirements, not here.

**Surface states, both pages**

| State | What the collector sees | Why it exists |
| --- | --- | --- |
| Signed out | The account area's sign-in requirement, not an empty record | The record resolves from the session alone; there is no anonymous watch list. |
| First load | The page's frame with its rows loading | The record is a network read; the frame should not move once rows arrive. |
| Empty — Watching | An invitation into the catalogue, not "no results" | A collector with no watches has never used the feature; the page's job is to explain it. |
| Empty — Bidding | An invitation into the catalogue with the watching page named as the lighter first step | Different from Watching's empty state: this collector may already watch listings. |
| Empty — group | Only one group of Bidding is empty (no wins yet, say) | The other groups still have rows; the page is not empty. |
| Load failed | An error with a retry, keeping the account navigation reachable | A failed record read must not look like an empty record — an empty auction record and a broken one are the same picture otherwise. |
| Partially stale | Rows are shown, but a live value could not be refreshed and says so | The close and the current bid follow the clock; the page must not present a stale number as current. |
| More to load | The rows so far, with more available | A long-standing collector's record outgrows one screen. |

**Watching page states, per listing**

| State | Meaning |
| --- | --- |
| Scheduled | Published, bidding has not opened. Shows when it opens. |
| Live | Bidding open, more than 60 minutes to close. |
| Ending soon | 60 minutes or less to close, matching the operator queue's threshold. |
| Ended | Bidding is over, however it ended — sold, unsold, or called off. |

Four states only. Watching answers "is this open, and how soon does it close",
nothing more. Where the collector stands as a bidder — leading, outbid, won,
lost — is the Bidding page's job, and a watched listing they also bid on is
marked as such and reaches that page in one step. Whether an Ended row also
says how it ended is a design decision, not a state.

Two things on this page are actions rather than listing states: removing a
watch, which can be undone, and reaching the watch limit, which stops a new
watch being added until one is removed.

**Bidding page states, per listing**

| Group | State | Meaning |
| --- | --- | --- |
| Active | Leading | Their bid is the highest valid bid and the window is open. |
| Active | Outbid | A higher valid bid stands. Carries what the next valid bid must clear. |
| Active | Bid submitted | A bid was placed and Grade10 has not yet accepted it. |
| Active | Bid not accepted | The last bid was refused — too low, the window closed, or card authorization failed — with which of those it was. |
| Active | Ending soon | Open, 60 minutes or less to close, at whatever standing. |
| Won | Awaiting payment | They won; payment is being taken from the authorized card. |
| Won | Payment problem | Card capture gave up, or a wire is expected. What Grade10 needs from them, and how to reach Grade10. |
| Won | Paid | Grade10 has their money. One state, however it was collected. |
| Won | Shipped | The card has left Grade10. |
| Won | Delivered | Complete. |
| Didn't win | Outbid at close | Someone else won. Carries whether their card hold is released. |
| Didn't win | Listing canceled | The listing was called off after they bid, and what happened to their hold. |
| Didn't win | Ended unsold | Bidding ended with no winner. |
| Any | Hold releasing | Their card authorization is released but the release is not yet complete. Named because a bank-side pending authorization otherwise reads as a charge. |

## Requirements

This feature has **no approved requirements yet**. The checkable requirements —
what each state means, when it is entered, what each row carries, the ordering
and grouping rules, the accessibility obligations of a live-updating list, and
the component export contract — will be written as an OpenSpec change carrying
deltas against:

- `openspec/specs/grade10-auction/account-auction-record/spec.md` — the
  collector's own record of watched and bid-on listings: what it holds, how a
  watch is added and removed, and what each state above means.
- `openspec/specs/shared-ui/account-auction-record/spec.md` — the components
  `@grade10/ui` exports for the surface, and what each is responsible for.
  Their content and product state arrive through props, as with every block in
  that package.

No requirement, state definition, or export name is recorded in this document.
Where this document and those specs disagree once written, the specs are
correct and this document is stale.

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| `apps/frontend/grade10` | Adds the account auction record to the account area and composes it from the new `@grade10/ui` blocks; owns routing, session gating, copy, and the read/refresh calls. | The record is session-only; it must never render from an anonymous read, and no listing id supplied by the client may select another collector's record. |
| `apps/backend/grade10/store` | Resolves the Grade10 customer session and calls the pinned Auction service entrypoint for the collector's own record and watch writes. | It cannot act for another storefront, and cannot read a record for a collector other than the session's. |
| `apps/backend/grade10/auction` | Owns the watch records and composes the collector's record from listings, their bids, and the existing payment and shipment milestones. | The collector view is a projection of records the operator side already owns; it must not become a second source of truth for outcome, payment, or shipment. |
| `apps/backend/grade10/api` | Unchanged. | It stays anonymous-only and never resolves bidder identity, so no part of this surface routes through it. |
| `@grade10/ui` | Gains the account auction record blocks, composed from existing design-system primitives. | Blocks receive all content and product state through props and hold no auction state of their own. |
| `@grade10/auction-contracts` | Gains the collector record read and the watch write. | Provider-neutral; money stays an integer count of minor units plus an ISO 4217 currency code. |
| `@grade10/i18n` | Gains the state labels and empty-state copy for every locale the brands speak. | Collector-facing labels are not the operator queue's labels; see the Paid decision. |
| `apps/admin/grade10` | Unaffected. | The operator queue keeps its own outcome labels, including the Paid via Stripe and Paid via Manual distinction. |
| `apps/backend/zzz/store` | Unaffected. | ZZZ gains no account auction surface. |
| `@grade10/design-system` | Expected to need no new primitive, variant, or token. | If a state's treatment cannot be built from what ships today, that is a design-system change with its own Figma reconciliation, per `docs/governance/design-code-sync.md`. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Watch-to-bid conversion | Watched listings on which the watching collector later placed at least one bid, divided by watched listings whose bidding window opened. | Product |
| Outbid recovery rate | Listings where a collector was outbid while the window was open and placed a further bid within it, divided by such outbid events. Segmented by whether the record page was opened in between. | Product |
| Record-page reach | Signed-in collectors with any auction activity who opened the record at least once in a 30-day window, divided by all such collectors. | Product |
| Winner self-service | Won listings that reached paid with no inbound contact from the winner, divided by won listings. Proxy for whether the winner view answers "what happens next". | Product and operations |
| Hold-related contacts | Inbound contacts about a pending or unreleased card authorization, per 100 losing bids. Expected to fall if the hold states read clearly. | Operations |
| Watch depth | Distribution of watches per collector, and the share hitting the watch limit. Sets the limit's value after the first release. | Product |

Every one of these starts from no baseline; the first release establishes it.

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Watching is in scope | Decided | Watching a listing from the collector's own account is in scope from this PRD forward. The parent PRD listed the same idea as a non-goal under the name **favourites**; that non-goal is superseded and the parent links here. | Product |
| The term "favourites" is retired | Decided | The feature is **watching**, the action is **watch** and **unwatch**, and the list is the Watching page. "Favourites", "saved", and "starred" are not used in product copy, specs, message catalogs, or analytics event names. | Product |
| Watching without notifications | Decided | Watching ships before any notification programme. It is worth shipping alone: it is the discovery-to-intent bridge inside a session, and it is the only way to measure auction interest before a bid exists. The risk is real and named in Rollout — a watch a collector is never reminded of may be seen as a broken promise. Nothing on the surface may imply Grade10 will contact them. | Product |
| Two pages, not one | Decided | Watching and Bidding are different jobs — interest versus commitment — with different states, different urgency, and different empty states. One merged list would either bury a won listing among idle watches, or force a filter to be usable. | Product and design |
| A listing that is both watched and bid on | Decided | Appears on both pages, marked on Watching as one they bid on. Removing it from Watching does not touch their bids. | Product |
| Bidding groups | Decided | Active, Won, Didn't win. Won is separated from all other closed listings because it is the only group that carries an obligation. | Product |
| One "Paid" for the collector | Decided | The collector sees **Paid**, whether collection was card capture or manual. This is deliberately not the operator queue's rule, which forbids a bare "Paid" and separates Paid via Stripe from Paid via Manual — that distinction is a finance-reconciliation need, and it is noise to the person who paid. | Product and finance |
| Post-sale is read-only here | Decided | The winner reads payment and shipment state; every write stays the operator's. Adding a winner-initiated action — paying again, requesting a wire — is follow-on and must not be smuggled in as a button. | Product and operations |
| Card holds are stated plainly | Decided | The release of a losing bidder's authorization is asynchronous, so the record names the in-between state rather than implying the money is already back. Silence here is the likeliest source of "you charged me" contacts. | Product and finance |
| Ending soon threshold | Decided | 60 minutes or less to close, matching the operator queue, so the two surfaces cannot disagree about which listings are urgent. | Product |
| Bids are binding | Decided | Nothing on this page retracts a bid. A collector who believes a bid was a mistake contacts Grade10; that path is unchanged. | Product |
| Watch limit | Open | A limit exists, so a watch list stays a considered list and the read stays bounded. **The designer sets the value**, and owns what the collector sees on reaching it. Revisit against Watch depth after the first release. | Design |
| Ordering | Decided | Soonest close first on both pages, with closed listings after open ones. | Product and design |
| Watching an unpublished listing | Decided | The watch is kept and the row reads as Ended, rather than disappearing. A watch silently vanishing is indistinguishable from a bug. | Product |
| Terminology | Decided | **Listing** throughout, per the parent PRD's recorded decision. Note the drift: `openspec/specs/grade10-auction/listing-page/spec.md` says "lot". This surface does not follow that; reconciling the older spec is separate work. | Product |
| Landing page | Decided | Bidding when the collector has any bidding activity, Watching otherwise. Commitment outranks interest for a returning collector. | Product and design |
| ZZZ | Decided | Out of scope. `zzz` has no account surface, matching the account-profile decision. | Product |

## Rollout and risks

- **A watch with no reminder can read as a broken promise.** A collector who
  marks six listings and hears nothing when they close may conclude the feature
  failed, not that it never claimed to notify. Copy must not imply contact, and
  the notification follow-on should be sequenced close behind if watch depth is
  healthy but watch-to-bid conversion is not.
- **This page will be read as authoritative during the last minute of a close.**
  It shows a standing that moves. If it can be stale, it must say so, and a
  collector must never be told they lead when they do not. Where the record and
  the listing page disagree, the listing page is where the bid is placed and the
  record must not become a second answer.
- **The winner view widens who reads post-sale state.** Facts written for
  operators now reach the person they are about. Anything on the operator's
  trail that was written as an internal note is not automatically fit for the
  winner's page; only the states named above cross over.
- **Contact-volume risk cuts both ways.** Naming a releasing hold should reduce
  "you charged me" contacts, but naming a payment problem may raise contacts
  from winners who previously waited for the operator to reach them. Operations
  should see the payment-problem states before they ship.
- **Sequencing.** The shared blocks land in `grade10-spec` and reach the
  application through a submodule bump, so the UI contract must be settled
  before the application work starts. Watching can ship ahead of the Bidding
  page — it has no post-sale dependency — and doing so establishes the watch
  metric earlier.
- **Owner-only, and stays that way.** No part of this record may leak into a
  listing page, a public profile, or a shared link. Making any of it public is a
  separate decision with its own visibility and SEO obligations, as with the
  account profile.
