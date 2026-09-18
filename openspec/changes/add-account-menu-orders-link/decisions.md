## Goals

- A signed-in collector reaches `/profile/orders` from the global account
  menu, not only from a direct address or a link buried on another page.
- `shared/ui/site-chrome` and `grade10-site/site/page-shell` state honestly
  what the account menu offers, now that Store order history has shipped.

## Non-Goals

- Widening the menu for KYC, or any other surface not already in scope.
- Changing My Auctions, Profile, or Sign out's existing position, copy, or
  behavior beyond inserting the new item.
- Reconciling this change's menu order and copy with `add-my-auction-orders`'s
  own account-menu addition; that change owns its own delta against these
  same two capabilities.
- Changing what `/profile/orders` shows; the page itself is owned by
  `add-grade10-customer-order-pages`.
- Separate work for the compact-viewport drawer. The account control stays in
  the header bar at every width under the existing `page-shell` contract, so
  the new entry reaches a narrow viewport through the same menu, with no
  drawer-specific change.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Edit the "SHALL NOT include Orders" wording in `shared/ui/site-chrome` and `grade10-site/site/page-shell`, or add the handler without touching the text? | Edit both requirements directly, so the durable spec states what ships (recommended) | Leaving the wording as-is — rejected: the spec would state something false the moment the code merges, the same drift `add-my-auction-orders` already left unresolved on its own entry. |
| Q2 | `add-my-auction-orders` is also about to add a new account-menu entry to the same component, and is unclaimed with no start date — should this change wait for it? | Proceed independently; record the overlap so whoever picks up `add-my-auction-orders` reconciles menu order and copy against whatever has already landed (recommended) | Blocking on a coordination conversation first — rejected for now: that change has no owner, and holding a small, independently valuable change on it trades a real delay for a coordination cost either change can absorb later. |
| Q3 | What label and position does the new entry take? | "My Orders", between Profile and My Auctions, shown only when signed in (recommended) | "Your Orders", matching the page's own title — rejected: parallels My Auctions and Profile's naming instead of the page. Appended after My Auctions, before Sign out — rejected: the ask was for it to sit directly under Profile. |
| Q4 | Is My Orders independently handler-gated — rendered only when its own handler is supplied, like search and cart — or a required, always-present item like Profile, My Auctions, and Sign out? | Required and always-present: the app always wires it to the already-shipped `/profile/orders` route, the same way it always wires Profile and My Auctions | Handler-gated like search/cart — rejected: the durable requirement already renders Profile, My Auctions, and Sign out unconditionally once signed in; only search, account, and cart are described as handler-gated, and those are controls that genuinely vary across products, not items inside an already-committed signed-in menu. |
| Q5 | Does adding My Orders change how the account menu opens, closes, or otherwise behaves as a control? | No — only the list of items and their order changes; open/close mechanics are the existing menu control's, untouched here | Stating new open/close behavior in this delta — rejected: out of scope per the Non-Goals above, and not owned by either capability this change touches. |
| Q6 | Does this change need to define what happens if navigating to `/profile/orders` fails, or if the collector's session lapses between opening the menu and activating My Orders? | No — activating a menu item is a client-side route change with no failure mode of its own; a session lapse is already handled by `/profile/orders`'s own sign-in gate | Adding a menu-level failure or session-race requirement — rejected: that behavior belongs to `grade10-site/store/order-history` (already specifies a signed-out redirect, `grade10-site-store-order-history-SC-02`) or to session handling generally, not to the menu control. |
| Q7 | Does `spec.md` need to state the exact `zh-Hant`/`zh-Hans` label text for My Orders? | No — copy is implementation (i18n catalog) work; the proposal's Impact section already names the catalog to update | Writing the literal translated strings into the requirement — rejected: not a testable spec-level fact, and `shared/ui/site-chrome`'s own "no defaulted content" principle keeps all copy application-owned. |
| Q8 | Should My Orders stay required and always-present per Q4, or hide until Store answers — `/profile/orders` is itself gated on Store (`gate: "store"` in `surfaces.ts`), so a build with no Store surface would open the item onto a page with nothing behind it? | Handler-gated like Cart and search, supplied by the application only once Store answers — the same gate `/profile/orders` and Cart already use (recommended); supersedes Q4's "required" answer | Keeping My Orders required and unconditional per Q4 — superseded: that leaves a menu item pointing at a page gated shut on any build where Store has not answered, the same dead-link problem Q1 exists to fix for the account menu's own wording. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/ui/site-chrome` | Is My Orders independently handler-gated, or always present like Profile/My Auctions/Sign out? | Q4 |
| `grade10-site/site/page-shell` | Does activating a menu item close the account menu? | Q5 |
| `grade10-site/site/page-shell` | What happens if My Orders navigation fails, or the session lapses before it is activated? | Q6 |
| `shared/ui/site-chrome` | What is the exact `zh-Hant`/`zh-Hans` label text for My Orders? | Q7 |
