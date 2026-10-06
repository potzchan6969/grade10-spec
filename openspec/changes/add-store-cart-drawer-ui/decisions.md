## Goals

- Describe the Cart Drawer as the signed-in member's current cart
- Keep global Cart availability with durable `grade10-site/site/page-shell`
- Keep signed-out Cart access with `require-sign-in-from-nav-cart`

## Non-Goals

- Bringing back a guest browser cart or guest checkout
- Deciding when the Cart control appears on a surface
- Deciding what a signed-out Cart press does
- Adding or removing promo-code editing; an existing selected code stays selected

## Decisions

The canonical Store and page-shell records settle this reconciliation on
2026-09-18.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which cart does the drawer read? | The signed-in member's cart; a signed-out session holds no lines | Keeping the guest browser cart from this older delta, which contradicts the Store cart decision |
| Q2 | Which change owns Cart availability? | Durable `grade10-site/site/page-shell` owns absence until Store answers and global Cart after it answers (folded from `auction-first-site-header`); this change owns the drawer | Keeping a Store-only Cart handler in this change, which would contradict the global Cart decision |
| Q3 | Which change owns a signed-out Cart press? | `require-sign-in-from-nav-cart` owns the sign-in dialog and resume; this drawer starts only for a signed-in member | Opening a guest drawer from this change, which would have no cart lines to review |

| Q4 | Does the drawer apply points? | Yes; the user-approved Storybook plan supersedes the read-only points scope. Apply, Use max and Remove share checkout's persisted choice and server quote | Keeping points as display-only context |
| Q5 | What happens to an existing code? | Preserve it when points change and include its accepted discount in the server quote | Resetting the code or changing existing promo editing |
| Q6 | What happens on an unsuccessful change? | Keep the last accepted choice and total for the same basket; block duplicate actions and Checkout while unresolved, discard stale results, and revalidate changed baskets | Optimistically presenting an unaccepted saving |

| Q7 | What input is accepted? | Apply accepts positive whole numbers; zero uses Remove. Above-ceiling amounts use the server-accepted cap | Persisting malformed amounts or duplicating the removal control |
| Q8 | What if a refresh fails after a successful write? | Do not claim rollback; keep stale totals unavailable and reread authoritative intent before Checkout | Showing the previous choice as though the write failed |

The `move-checkout-into-cart-drawer` proposal settles this round on 2026-09-29:
`grade10-site/store/cart-drawer` has no durable spec yet, so that change's
requirement and test-case deltas are folded here rather than issued as a
second owner of this capability's ids - see that change's `proposal.md` and
`decisions.md` for the full interview (goals, non-goals, and the two-reading
reconciliation).

| Q9 | Does the drawer create checkout itself once it can? | Yes - `onCheckout` creates the checkout session directly and redirects to Shopify's hosted invoice, completing this change's own deferred non-goal now that the checkout PRD and `add-shopify-checkout-integration`'s Q1 narrow to one drawer-side read plus the server's existing transactional recheck. Corrected `grade10-site-store-cart-drawer-SC-27`'s text to match (it previously said "the drawer creates no checkout", written before this decision) and reworded "Checkout navigation" to "activating Checkout" in the points-persistence requirement above it, for the same reason | Continuing to navigate to `/checkout`, which this change's own tech design named as a placeholder pending exactly this decision |
| Q10 | Where does the HKD 120,000 verification gate live once `/checkout` is removed? | Inline in the drawer, blocking Checkout and linking to the account page exactly as `CheckoutPage`'s `VerifyPanel` does today; the identity check itself stays on the account page | Redirecting to the account page instead of showing the gate inline - rejected as an extra screen. Letting the server reject with no proactive gate - rejected; it drops the existing "verify before you try to pay" guidance |
| Q11 | Is the bar checked against gross goods or the total after code and points, and does the gate replace Checkout or sit disabled beside it? | Gross goods, from the existing checkout resolution's `goodsMinor` field; the gate replaces the Checkout action's area with `VerifyPanel`'s message and link, exactly as it replaces `CheckoutPage`'s pay section today - both unchanged existing behaviour, not new choices | A new bar calculation, or showing Checkout disabled alongside the message - neither needed; the blind test-case pass in `move-checkout-into-cart-drawer` raised both as open questions and they resolved to facts already true in the code |
| Q12 | Does the drawer still apply a typed or picked code? | Yes - typed, picked and removed codes cut the total, as the Cart Promo Code section already says. This change neither adds nor removes that editing | Closing promo to display-only (the leftover review-backed facts table) |
| Q13 | Does the gate wait for checkout creation to return verify? | No - the drawer shows the gate and creates no session. The identity check still runs only on the account page | Asking Shopify first and dressing its verification outcome as the gate |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/store-cart | Which cart does the drawer read? | Q1 |

| grade10-site/store/cart-drawer | What happens to invalid or zero input? | Q7 |
| grade10-site/store/cart-drawer | What happens when persistence succeeds but a later refresh fails? | Q8 |

| grade10-site/store/cart-drawer | Is the bar checked against gross goods or the total after code and points? | Q11 |
| grade10-site/store/cart-drawer | Does the verification gate replace the Checkout action or sit disabled beside it? | Q11 |
| grade10-site/store/cart-drawer | Does the drawer still apply a typed or picked code? | Q12 |
| grade10-site/store/cart-drawer | Does the gate wait for checkout creation to return verify? | Q13 |
