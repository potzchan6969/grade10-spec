# Decisions

## Goals

- **Buy without an account** - a signed-out collector checks out the cart this
  browser holds, pays on Shopify's hosted invoice, and is asked for nothing
  but an email there.
- **Account after payment, never before** - the order page on return from
  checkout invites the buyer to create an account, and a sign-in that proves
  the order's email links the order.
- **One private link per order** - every order email's View order button opens
  the order's private page; the link page shows no account facts.

## Non-Goals

- **Existing-account email banner** - dropped 2026-10-13: Shopify's page holds
  the email before payment and a lookup there needs an extension.
- **Shopify Thank-you page extension** - the prompt lives on the Grade10 order
  page instead.
- **Grade10 store emails** - Shopify's order emails carry everything.
- **Public-code source and list** - owned by `add-store-public-codes`.
- **Points on a guest order** - dropped 2026-10-14: a guest order never
  earns, linked or not ([Q5](#decisions)).
- **An identity bar at checkout** - dropped 2026-10-14: the store asks no buyer, guest or member, to verify at any value.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does a guest choose guest vs sign-in? | The drawer footer: guest checkout primary, a quiet sign-in link under it | A choice step after Checkout, which adds a tap for every guest |
| Q2 | Can a guest use a code? | A guest may type or pick a public code; no points at tender, and a member's code is never shown; a member-only code typed by a guest is refused as a code nobody minted. Decided by the owner 2026-10-13; supersedes the basket-only rule of 2026-10-12 | The basket alone, no code at all |
| Q3 | Which guest orders reach an account? | Every paid guest order placed under an email joins the member's account automatically once a sign-in proves that email — a magic link to it or a Google account under it — on any sign-in, including the prompt's. The order gets an owner. Decided by the owner 2026-10-13; supersedes prompt-only saving (earlier 2026-10-13) | Only an order the buyer saved by signing in from the post-checkout prompt (earlier 2026-10-13) |
| Q4 | Where is the account prompt? | On the Grade10 order page on return from checkout | A Shopify Thank-you extension, which lives outside the store and limits Google sign-in |
| Q5 | Does a linked guest order earn points? | No - a guest order never earns, linked or not; only an order placed with an account earns. Decided by the owner 2026-10-14; supersedes earning on completion once linked (2026-10-13) | One still in progress when linked earns when it completes (2026-10-13) |
| Q6 | Who gets a private order link? | Every order; signed out sees the public page, the owner is sent to their account's order page, anyone else sees the public page, and the page shows no account facts | Guests only, with a member's order showing not-found |
| Q7 | Does Shopify's checkout warn a guest with an existing account? | No - dropped from scope 2026-10-13; Shopify's page holds the email before payment and a lookup there needs an extension | A banner extension on Shopify's page |
| Q8 | Does the prompt show on an order page opened from an email link? | Yes, signed out - the email note and the sign-in ask show on any signed-out view of the order, the return from checkout or a link; signed in, neither shows. The gate is sign-in state, not guest vs member. Decided by the owner; supersedes the link-never-converts rule of the earlier round | Only the return from checkout converts; a receipt link never asks (earlier round) |
| Q9 | Does a public code survive sign-in from the drawer? | Yes, if it still fits the merged cart - decided by the round | Dropping the code on sign-in |
| Q10 | Does a sign-in under a different email link the order? | No - only a sign-in that proves the order's email links it: a magic link to that email, or a Google account under it. A Google account under another email signs the buyer in and adds nothing; the prompt names the order's email and offers the magic link to it. Decided by the owner 2026-10-13 | Any account signed in from the prompt taking the order |
| Q11 | When does a linked guest order earn? | Never - see Q5. Decided by the owner 2026-10-14; supersedes earning on completion when linked before it completed (2026-10-13) | Earning on completion like every order, if linked before it completed (2026-10-13) |

Supersedes `add-shopify-checkout-integration` Q3 and its non-goal "No guest
storefront checkout".

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/order-detail` | Does a Google sign-in under a different email than the order's save the order? | Q10 |
