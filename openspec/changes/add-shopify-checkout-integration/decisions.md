# Decisions

## Goals

- **Integration** - Consume all cart-header backend behavior through existing frontend boundaries.
- **Complete contract** - Retain published checkout requirements for review, hosted handoff, safe repetition/recovery, settlement/return and carrier rates.
- **Cart protection** - Reflect authoritative conversion and preserve later edited or rebuilt carts with their tender.

## Non-Goals

- **Operations** - No migration execution, deployment, provider setup, production write or real payment in this planning run.
- **Product additions** - No guest storefront checkout, new badge, standalone checkout page, embedded payment or new Shopify return destination.
- **Local workarounds** - No browser-owned invoice authority, local cart deletion, new dependency or duplicate data client.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When is the basket read? | Preserve the durable contract: review on open and make a current decision at Pay, including reuse | Earlier drawer quote replacing Pay's decision |
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

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/checkout` | Retain every durable safety requirement despite branch gaps? | Q20 |
| `grade10-site/store/checkout` | Introduce a new unpaid badge? | Q21 |
| `grade10-site/store/checkout` | Does the shop's review of the cart retire an open invoice? | Q23 |

## Product Authority

- **Instruction** - On 2026-10-07, @kinisworking said: "the frontend should be integrated all changes from the backend and the requirements from the specs".
- **Supersession** - Earlier frontend-only decisions remain in acceptance history; they do not constrain this amendment.
- **Follow-up** - On 2026-10-08, the owner authorized updating this amendment to follow the merged backend and address the readiness findings. Q8 and Q22 clarify existing journeys and feature roots; their frozen anchors are unchanged.
- **Acceptance** - Scope clarification settles planning inputs; the complete plan receives human acceptance after QA2 and fresh acceptance review.
