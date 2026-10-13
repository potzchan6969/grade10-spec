# Decisions

## Goals

- **A code a guest can use** - the picker lists the codes open to everyone,
  and a typed public code applies for anyone.
- **One picker** - members see public codes beside their own wallet codes and
  rewards; guests see the public codes only.

## Non-Goals

- **A second code on one cart** - one promo code per cart, as today.
- **The invoice's own discount field** - Shopify's invoice field is unchanged.
- **Minting public codes in the loyalty admin** - they are not minted to a
  member.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Are public codes listed in the cart? | Listed to guests and members alike. Decided by the owner 2026-10-13; supersedes the 2026-10-12 row | The cart neither lists nor takes a public code |
| Q2 | What does a guest's code list hold? | Public codes only; a member's codes and rewards are never shown | Showing member codes to a guest |
| Q3 | Where do public codes come from? | Shopify discounts tagged `public`, read by the store. Decided by the owner 2026-10-13 | Minting public codes in the loyalty admin, or a new admin surface |
| Q4 | How do public codes order beside wallet codes? | Codes that fit first, then soonest to expire, across public and wallet codes alike. Decided by the owner 2026-10-13 | A section order that ignores fit, or public codes always last |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/discounts` | Where do public codes come from? | Landed as Q3: Shopify discounts tagged `public`, read by the store. Decided by the owner 2026-10-13 |
| `grade10-site/store/discounts` | How do public codes order beside wallet codes? | Landed as Q4: fit first, then soonest expiry, across both lists. Decided by the owner 2026-10-13 |
| `grade10-site/store/discounts` | A public code beside the cart's own code - does the invoice take a second code? | ❓ Product - open row on the discounts page; adjacent to this change, not settled by it |
