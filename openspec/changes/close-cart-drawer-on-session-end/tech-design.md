## Context

The [cart drawer requirements](specs/grade10-site/store/cart-drawer/spec.md) gain one ADDED requirement, "An open drawer closes when its member's session ends" (`g10.store-cart-drawer.SC46` to `g10.store-cart-drawer.SC54`). The proposal holds the motivation.

The behaviour is already built. Commit `699cafe14` on `bugfix/cart-drawer-closes-on-session-end` in grade10 (9gag/grade10#1233) carries one hook, its one call in the site root and two tests. Delivery is verifying that commit against the nine scenarios and closing the gaps the scenarios expose, not new construction. Every claim below was read from that commit.

| What | Where in grade10 at `699cafe14` |
| --- | --- |
| The hook reads the session status, remembers whether the last settled reading was a signed-in member, and closes when the next settled reading is nobody | `apps/frontend/grade10/src/chrome/useCartClosedOnSessionEnd.ts:10`, `:13`, `:16-19` |
| A pending reading returns before the memory moves, so it decides nobody | `useCartClosedOnSessionEnd.ts:16` before `:18` |
| The effect depends on the status alone, so a change of user id never runs it | `useCartClosedOnSessionEnd.ts:20`; the id sits beside the status in `packages/grade10-store/frontend/src/core/session/SessionState.ts:6-9` |
| The hook runs in the site's cart composition and takes the root's close | `apps/frontend/grade10/src/root.tsx:181` inside `SiteWithCart` (`:166-212`); the composition is chosen on the store gate (`:243`); surfaces drawn outside the site chrome carry no drawer and return before it (`:356-371`) |
| The close is the root's own, the one the host's Close, backdrop and Escape end in; the open state is the root's | `root.tsx:287`, `:400-401`; passed to the host at `:205`; reached from the host at `CartDrawerHost.tsx:619`, `:1320` |
| The session is published once, only when it changes, from the auth client's session atom, which the checkout refresh re-reads | `SessionState.ts:43-47`, `:67-81`; `apps/frontend/grade10/src/clients/session.ts:23-31`; `apps/frontend/grade10/src/clients/auth.ts:53-71` |
| A failed re-read that is not a 401 keeps the data, as the header's tests model the auth client, so it publishes no change; a 401 clears the data and reads as nobody | `apps/frontend/grade10/src/chrome/useHeaderSession.test.tsx:8-14`, `:147-160`; `apps/frontend/grade10/src/chrome/useHeaderSession.ts:13-17`; `SessionState.ts:72-78` |
| The drawer's cart scope reads the same published session and counts anything but a signed-in member as a guest | `packages/grade10-store/frontend/src/features/orders/cart/presentation/hooks/useCartScope.ts:12-21` |
| An expired session at checkout refreshes the session, then opens the sign-in dialog with no way back to the drawer | `apps/frontend/grade10/src/chrome/CartDrawerHost.tsx:1077-1085`; the dialog returns to the current address (`apps/frontend/grade10/src/chrome/SignInOverlay.tsx:76`); a guest's own sign-in passes a resume and a return address (`CartDrawerHost.tsx:1293-1296`) |
| The two tests: the member's drawer closes, a guest's stays open | `apps/frontend/grade10/src/chrome/SessionEndsElsewhere.test.tsx:123-139`, `:141-154` |
| The existing expired-checkout test mocks the refresh and never publishes nobody into the session | `apps/frontend/grade10/src/chrome/CartDrawer.test.tsx:2586-2616`, `:2595-2598` |

## Goals / Non-Goals

**Goals:**

- Show each scenario passing against the built hook, with a test that cites its id.
- Close what reading found: no test drives a first answer of nobody for a guest, a session being read, a switch of member, a sign-in again, or the expired checkout with the real session wiring.
- Leave one place that decides the close.

**Non-Goals:**

- Emptying this browser's cart on sign-out, or closing anything else a tab holds open when its session ends.
- A message, a toast, a prompt or a timer.
- A backend, schema, wire contract or copy change. None is touched.

## Decisions

The [cart drawer requirements](specs/grade10-site/store/cart-drawer/spec.md) govern when the drawer closes. These decisions govern where the rule lives.

### The close is a transition of the published session

The hook acts on the step from a signed-in member to nobody, not on a level.

| Last settled reading | Next reading | Drawer | Scenario |
| --- | --- | --- | --- |
| Member | Nobody | Closes | `g10.store-cart-drawer.SC46`, `g10.store-cart-drawer.SC47` |
| Member | Being read, then the same member | Stays open | `g10.store-cart-drawer.SC50` |
| Member | A different member | Stays open | `g10.store-cart-drawer.SC51` |
| Member | A read that fails | Stays open | `g10.store-cart-drawer.SC54` |
| None yet, or nobody | Nobody | Stays open | `g10.store-cart-drawer.SC49` |
| Member, closed by the rule | The member signs in again | Stays closed | `g10.store-cart-drawer.SC53` |

Rejected: closing on every reading of nobody, which shuts a guest's drawer on the session's first answer (Q2); closing on any change of user id (Q4); closing on a reading in flight (Q3).

### The root owns the close and does not read whether the drawer is open

The hook calls the root's close, which sets the open state to false and does nothing when it is already false. The hook holds no copy of the open state, and `g10.store-cart-drawer.SC53` holds by construction: no step of the session-end path opens the drawer. The openers are the Cart control (`root.tsx:400`), an address carrying `cart=open` (`apps/frontend/grade10/src/chrome/cartReturn.ts:25-43`) and a guest's resume (`CartDrawerHost.tsx:1295`); none runs on a session end.

Rejected: closing inside the drawer host, whose `open` is a prop the root owns and whose file is already 1,377 lines; a session subscriber outside React, which has no handle on the open state.

### The session is read where the drawer already reads it

The hook reads the published session the cart scope and the host's checkout guard read (`useCartScope.ts:12-21`, `CartDrawerHost.tsx:138`, `:984-1002`), so the drawer and its close agree on who the session is within one render. Rejected: the header's session hook (`useHeaderSession.ts:19-29`), which holds the header's entry and answers pending until the first read; two readings of one session can disagree for a render.

### Checkout's expired session takes the same path (Q5)

Checkout answers 401, the host refreshes the session, the refresh publishes nobody, and the hook closes the drawer; the host opens the sign-in dialog with no resume and no return address, so signing in reopens nothing. No branch special-cases it. Delivery here is a test with the real wiring, and a repair only if that test is red.

### Where each scenario is proven

| Scenario | Test | At `699cafe14` |
| --- | --- | --- |
| `g10.store-cart-drawer.SC46` | `SessionEndsElsewhere.test.tsx:123-139` | Built; cite the id |
| `g10.store-cart-drawer.SC47` | The same file, a read that answers nobody on return | To add; the walk expires a real session |
| `g10.store-cart-drawer.SC48` | The same file; assert no toast and no dialog on a surface that needs no session | To add |
| `g10.store-cart-drawer.SC49` | `SessionEndsElsewhere.test.tsx:141-154` starts as nobody and never moves | Built in part; add the first answer of nobody after a pending start |
| `g10.store-cart-drawer.SC50` | The same file, member to pending to the same member | To add |
| `g10.store-cart-drawer.SC51` | The same file, member to a different member, new lines only | To add |
| `g10.store-cart-drawer.SC52` | `CartDrawer.test.tsx` beside `:2586`, the refresh publishing nobody into the session | To add |
| `g10.store-cart-drawer.SC53` | The same file as `g10.store-cart-drawer.SC46`, signing in again after the close | To add |
| `g10.store-cart-drawer.SC54` | The same file, a session read that fails | To add; the header's tests model the auth client keeping its data on a failed re-read, so the walk or a test on the real client confirms it |

The walk is `apps/frontend/grade10/e2e/tests/store/cart-drawer-session-end.spec.ts`, built on the two-tab pattern of `apps/frontend/grade10/e2e/tests/auth/session/across-tabs.spec.ts` and the drawer helpers of `apps/frontend/grade10/e2e/tests/store/cart-drawer-pending.spec.ts`.

## Risks / Trade-offs

- **[Risk] The sign-in dialog of `g10.store-cart-drawer.SC52` depends on an ordering the code does not settle** → After the refresh the host opens the dialog only while the drawer is open (`CartDrawerHost.tsx:1080` reads `drawerOpenRef`, set from `open` at `:232-233`), and the session-end close sets `open` to false. Which runs first is not fixed by the code. Task 3.1 drives the real wiring; if the dialog is skipped, the host decides the ask on whether the collector dismissed the drawer (recorded in `handleClose`, `:615-620`) and not on whether it is open.
- **[Risk] The close skips the host's own close routine** → `handleClose` (`CartDrawerHost.tsx:615-620`) resets three things, and each is derived from `open` on the next render: `drawerOpenRef` (`:232-233`), `wasOpen` (`:622-626`) and the operation epoch through the context key (`:241-244`). Task 2.1 asserts that Cart opened again after a session-end close starts a fresh review on the browser's cart.
- **[Risk] The drawer paints once on the browser's cart before it closes** → The render that carries nobody already reads the guest scope (`useCartScope.ts:16-18`) and the close is an effect of that render. The walk looks at the exit; if a frame of the browser's cart shows, derive the drawer's open state from the same session reading in the same render instead of closing in an effect.
- **[Risk] A published pending reading puts the open drawer on the browser's cart for its length** → The cart scope counts anything but a signed-in member as a guest (`useCartScope.ts:12-21`), so the drawer stays open but reads the guest scope while the session is pending. In the live app a member's re-read keeps its data and publishes no pending (`useHeaderSession.test.tsx:8-14`, `:137`), so the case needs a session that was cleared and is read again. `g10.store-cart-drawer.SC50` asserts the drawer stays open and nothing more; what it shows in between is the cart scope's own rule, which this change leaves alone (Q13).
- **[Risk] A switch seen as two readings, member then nobody then the other member, closes the drawer** → That is the first member's session ending as the tab saw it, and no timer is added: it would delay the close for every collector and settle by clock what the session contract settles by answer. `g10.store-cart-drawer.SC51` drives the direct reading.
- **[Risk] An answer for a checkout in flight arrives after the close** → The existing request guard compares the session at the start with the session at the answer and drops the answer (`CartDrawerHost.tsx:998-1013`). This change touches neither.

## Migration Plan

1. Merge 9gag/grade10#1233 with the verification commits. The change is frontend only: no flag, no data, no backend.
2. Roll back by reverting the commits. Nothing is stored.

## Open Questions

None.
