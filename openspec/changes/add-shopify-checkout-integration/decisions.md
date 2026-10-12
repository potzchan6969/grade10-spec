# Decisions

## Goals

- **Integration** - Use the current checkout request, cart, tender, quote and order reads through existing frontend boundaries.
- **One Pay at a time** - Accept one Pay per drawer and ignore answers for an older cart, tender or member.
- **Cart protection** - Read the cart and tender again after payment; the backend's merged member-edit guard decides what clears.

## Non-Goals

- **Operations** - No migration execution, deployment, provider setup, production write or real payment in this planning run.
- **Product additions** - No guest storefront checkout, new badge, standalone checkout page, embedded payment or new Shopify return destination.
- **Local workarounds** - No browser-owned invoice authority, local cart deletion, new dependency or duplicate data client.
- **Backend** - No backend, contract, schema or migration change. Purchase reuse, terminal replay, concurrency, dispatch recovery and durable retirement belong to [`add-checkout-purchase-safety`](../add-checkout-purchase-safety/proposal.md).

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When is the basket read? | Preserve the durable contract: review on open and make a current decision at Pay, including reuse. The review before a reused invoice is delivered by `add-checkout-purchase-safety` (Q24) | Earlier drawer quote replacing Pay's decision |
| Q2 | Which Shopify flow is used? | Shopify Draft Order hosted invoice; the same purchase reuses its saved invoice | Embedded payment or fresh creation on repeat |
| Q3 | Who uses public checkout? | Fresh signed-in member session; operator/typed-email adapters retain established gates | Public guest checkout |
| Q4 | Where are shipping and tax calculated? | Shopify owns final shipping, tax and payment; drawer shows an estimate | Drawer shown as final charge |
| Q5 | Who owns orders and money? | Backend owns creation, provider correlation and lifecycle | Browser-owned payment state |
| Q6 | What happens on repeated Pay? | One purchase identity, order and payable invoice; server reuse or settling | Duplicate orders/invoices |
| Q7 | Who settles payment? | Verified webhooks, reconciliation and order reads use guarded backend transition | Frontend settlement |
| Q8 | What happens to the cart? | Convert the active cart bought only when its member-edit counter matches; shop review changes alone allow conversion. Re-read and preserve later member edits or a rebuilt cart | General-version conversion, matching-variant deletion or quantity subtraction |
| Q9 | Who owns carrier rates? | Preserve and verify token-gated carrier rule and preview parity | Dropping carrier requirements |
| Q10 | Where does confirmation return? | Static Grade10 Your Orders link on both Shopify confirmation surfaces | Purchase-specific link or native Continue shopping dependency |
| Q11 | Does reload reuse a purchase? | Preserve one identity through same-session reload; backend decides invoice/state | New invoice after reload |
| Q12 | What happens on refusal? | Name changed lines, block stale handoff and permit repair; retain tender refusal honesty | Stale basket or silently dropped tender |
| Q13 | What happens on response loss? | Recover existing purchase without another invoice | Transport error treated as proof nothing was created |
| Q14 | What happens on a worker crash? | Safe pre-dispatch retry; ambiguous dispatched purchase is recovery-only | Dispatching again without evidence |
| Q15 | What happens to older invoices after edits? | Provider-aware retirement/recovery; cancellation rendered only from backend facts | Ignoring payable invoices or edit success proving cancellation |
| Q16 | What happens to edits during payment? | Invoice fixes submitted purchase; later edits survive settlement and stale responses cannot redirect | Rewriting invoice or deleting later intent |
| Q17 | What is delivery scope? | All cart-header changes and durable requirements; uncovered backend guarantees are delivery prerequisites | Narrow frontend-only amendment |
| Q18 | What if no matching order is returned? | Existing loading, error/Retry and empty/Shop now states; recovery invents no order | Local purchase invention |
| Q19 | Does verification add a shared slot? | Existing drawer-host account feedback and profile action | New verification export |
| Q20 | Are backend limitations scope waivers? | No; the 2026-10-07 instruction retains every spec requirement and delivery waits for evidence | Incomplete guarantees becoming product contract |
| Q21 | Does this add Awaiting payment? | Follow existing spec status labels; add no new shared badge in this amendment | Speculative status-set migration |
| Q22 | How are the 2026-10-08 review findings addressed? | One canonical persisted purchase and dispatch claim; live validation before invoice reuse; no canceled invoice handoff; distinguish member edits from shop review; v2 explicitly accepts zero points | Returning a superseded URL, validation bypass, general-version cleanup or rejecting ordinary no-points checkout |
| Q23 | Does the shop's review of the cart retire an open invoice? | No. Only a member line or tender edit records retirement; a shop stock or price review leaves the invoice for the next Pay, which supersedes it. Decided 2026-10-08 | Retiring on every general-version change |
| Q24 | What does this change deliver? | Frontend integration with the current backend only. The published requirement "A checkout intent is safe to repeat" stays in the durable spec, unmodified by this change. Its backend guarantees move to `add-checkout-purchase-safety`. Decided 2026-10-09 by @kinisworking; supersedes Q17, Q20 and the backend parts of Q6, Q11, Q13-Q16 and Q22 | Backend Groups 8-10 and 12 inside this change, or rewriting the durable requirement to today's behavior |
| Q25 | Which payment request does the drawer send? | The existing `checkout.createCheckout`: reviewed lines with their seen unit price, the accepted coupon fields, positive points, or no points field when none are spent. No purchase key, cart id or version, context read or protocol envelope. Decided 2026-10-09 | The v2 request and its zero-inclusive points field |
| Q26 | What do the added journeys promise? | US-05: one Pay at a time from the drawer, with no stale handoff. US-06: a later cart survives payment of an earlier one. Neither promises invoice reuse or retirement. Issued case ids stay | Removing US-05 and orphaning its issued cases |
| Q27 | What happens when the Pay answer is lost or cannot be read? | The drawer ends the pending Pay, shows the existing failure feedback and does not retry by itself. It claims neither that no invoice exists nor that one was canceled. A later Pay is a deliberate new request | Automatic retry, or treating a transport error as proof nothing was created |
| Q28 | What does the drawer do with an answer for an older cart, tender or member? | Nothing: it does not open Shopify, navigate or overwrite current state. The drawer keeps the current cart | Opening the older invoice |
| Q29 | What does a repeated Pay on another tab or after reload do? | It is a new request; the backend's current behavior decides. Converging tabs on one purchase is `add-checkout-purchase-safety` | A browser-held purchase identity |
| Q30 | After a lost answer, can a second Pay leave two orders? | Only when the answer was lost before the first order recorded its invoice. Once recorded, a Pay for the unchanged cart and tender gets the same invoice back (`reusedCheckout`); otherwise the backend keeps only the newest payable invoice (`supersedePromisedOrders`). The existing failure feedback is unchanged. Accepted by @kinisworking on 2026-10-09 with Q24; corrected 2026-10-09 after acceptance review | New feedback copy or a browser-held purchase to prevent it |
| Q31 | Is Pay available for an edited cart while an older Pay is pending? | No. Pending Pay disables drawer actions under the 2026-10-12 requirement, whose full scope is owned by `add-store-cart-drawer-ui` Q14. Changes from another tab or session still invalidate the answer (Q28); Pay returns only after the pending request ends and current facts are ready | A second request or cart/tender edit through the same pending drawer |
| Q32 | Does a canceled older order belong to this change? | No. An order read shows canceled through the existing order-status labels; when the backend cancels is `add-checkout-purchase-safety`. This change's suite does not test it | A drawer or order-page state owned by this change |
| Q33 | Does this suite keep the settlement, notification and ownership cases? | Yes. "Shopify payment settles one Grade10 order" stays in this change's delta for its cart release paragraph, so its existing backend tests are linked without backend changes | Moving them to `add-checkout-purchase-safety` |
| Q34 | What happens to drawer answer kinds the current request never returns? | Remove `settled`, `terminal`, `intentConflict` and `recoveryRequired` from the frontend resolution; they belonged to the removed v2 transport. Follows Q25 | Keeping unreachable branches |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/checkout` | Retain every durable safety requirement despite branch gaps? | Q20 |
| `grade10-site/store/checkout` | Introduce a new unpaid badge? | Q21 |
| `grade10-site/store/checkout` | Does the shop's review of the cart retire an open invoice? | Q23 |
| `grade10-site/store/checkout` | Does this change keep the backend guarantees? | Q24 |
| `grade10-site/store/checkout` | Which payment request does the drawer send after the v2 transport was removed? | Q25 |
| `grade10-site/store/checkout` | After a lost Pay answer, today's backend may already hold a payable invoice, and a deliberate second Pay is a new request. Does this change ship with a second payable invoice possible until `add-checkout-purchase-safety` lands, and does the failure feedback point the collector to Your Orders before paying again? | Q30 |
| `grade10-site/store/checkout` | While a Pay is pending and the collector saves a cart or tender edit, is Pay available for the edited cart before the older answer arrives, or only once it does? | Q31 |
| `grade10-site/store/checkout` | With retirement moved to `add-checkout-purchase-safety`, can an older order read canceled in this change at all, and does the "Canceled older invoice" state belong to this change's acceptance? | Q32 |
| `grade10-site/store/checkout` | Settlement through notification and reconciliation, repeated or invalid notifications, and another member's order reads are backend guarantees this change does not modify. Does this change's suite keep verifying them, or do they move with the backend guarantees to `add-checkout-purchase-safety`? | Q33 |

## Product Authority

- **Instruction** - On 2026-10-07, @kinisworking said: "the frontend should be integrated all changes from the backend and the requirements from the specs".
- **Supersession** - Earlier frontend-only decisions remain in acceptance history; they do not constrain this amendment.
- **Follow-up** - On 2026-10-08, the owner authorized updating this amendment to follow the merged backend and address the readiness findings. Q8 and Q22 clarify existing journeys and feature roots; their frozen anchors are unchanged.
- **Frontend scope** - On 2026-10-09, @kinisworking chose to keep this change to the frontend and move the backend guarantees to a separate change. Q24 supersedes the 2026-10-07 instruction for this change only; the durable requirements are not weakened.
- **Acceptance** - Scope clarification settles planning inputs; the complete plan receives human acceptance after QA2 and fresh acceptance review.
