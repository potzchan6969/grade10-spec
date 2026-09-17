## Goals

- Keep Cart absent while the Store cart drawer is not answered
- Supply one global Cart control after the Store cart drawer answers
- Keep the auction-first header free of unavailable destinations

## Non-Goals

- Defining the signed-out Cart activation flow
- Defining the Cart Drawer contents or member cart scope
- Adding a guest cart or guest checkout

## Decisions

The canonical page-shell and Store cart records settle this reconciliation on
2026-09-18.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When does Cart appear? | It is absent until Store answers the Cart Drawer, then appears on every surface, including Auction | Supplying Cart only on Store and checkout surfaces |
| Q2 | Does Cart visibility depend on session state? | No. The control follows the answered Store capability; its activation follows `require-sign-in-from-nav-cart` | Hiding Cart from signed-out collectors or making the shared header own the session rule |
| Q3 | What does global mean? | The same Cart handler is available on Store, Checkout, Auction, and other answered non-Store surfaces | A separate Cart control or drawer host per surface |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
