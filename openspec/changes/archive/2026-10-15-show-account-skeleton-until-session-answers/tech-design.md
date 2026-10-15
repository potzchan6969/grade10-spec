## Context

Source read at grade10-spec `bb4667b9b` and grade10 `1814311e0e` on 2026-10-14.

| Surface | Today |
| --- | --- |
| `packages/ui/src/blocks/site-chrome/site-header.tsx` | `SiteHeaderSession` is `"signed-out" \| "signed-in"`. Signed in passes `Nav` an `accountSlot` (the account icon, `IconButton` `md`, and its menu); signed out passes `onAccountClick` with `accountPresentation: "sign-in"` |
| `packages/design-system/src/components/layout/nav.tsx` | `AccountControl` renders a supplied `accountSlot` as it is. Locale, search, account and cart share one `justify-end` row, Cart last; below `@4xl` locale and search leave the row for the menu drawer |
| `packages/design-system/src/components/display/skeleton.tsx` | `role="status"`, `aria-busy`, `aria-label="Loading"`; shapes `text`, `line`, `block` (default `h-40 w-full rounded-md`); `className` merges through `tailwind-merge` 3 |
| `packages/design-system/src/components/forms/icon-button.tsx` | `md` is `size-10`, 40px, at every width; the compact Sign In button is `h-8` |
| grade10 `apps/frontend/grade10/src/root.tsx` | Passes `signedIn={!isPending && session?.user != null}` through `Composition` to `SiteShell` |
| grade10 `apps/frontend/grade10/src/chrome/SiteShell.tsx` | Passes `session={signedIn ? "signed-in" : "signed-out"}`; its comment says an unresolved session reads as signed out |
| grade10 `apps/frontend/grade10/src/clients/auth.ts` | `useSession` answers `isPending: true` with no data until the page is hydrated, so a written page and the render that adopts it agree |
| grade10 `packages/grade10-auth/contracts/src/browser.ts` | `createBrowserAuthClient` ends every call at `REQUEST_DEADLINE_MS`, 30 s, the session read included; the client holds one session atom |
| grade10 `packages/utils/src/deadline.ts` | `REQUEST_DEADLINE_MS` is how long a browser waits on a request a control draws as working; its comment sends a call that needs longer to a client of its own |
| better-auth 1.6.26 `dist/client/session-atom.mjs` | `fetchSession` aborts the read in flight when another starts, and the replaced read settles nothing; a tab coming back into view, `online`, another tab's broadcast and `refreshSession` each start a read |
| better-auth 1.6.26 `dist/client/query.mjs` (patch leaves it alone) | `onRequest` sets `isPending: data === null` and `isRefetching: true` on every read, the first included; `onSuccess`, `onError` and the fetch's `catch` set `isPending: false`; `onError` clears `data` on 401 and keeps it otherwise |

So a signed-out visitor's every re-read - a tab coming back into view, the session signal after a sign-in elsewhere - reads as pending again, while a signed-in collector's keeps `data` and stays answered.

## Goals / Non-Goals

**Goals:**

- One new value on the store block's session type; no new prop, no `Nav` change, no primitive change
- The site decides when the session has first answered from what `useSession` already returns, with no timer of its own and no storage

**Non-Goals:**

- Changing what `useSession`'s `isPending` means for its other readers
- Any header other than grade10's `SiteShell`

## Decisions

The [site-chrome delta](specs/shared/ui/site-chrome/spec.md) owns how `SiteHeader` draws a pending session; the [page-shell delta](specs/grade10-site/site/page-shell/spec.md) owns when the site passes it and what may move when it ends.

### A Third Session Value on SiteHeader

- **Type** - `SiteHeaderSession` becomes `"pending" | "signed-out" | "signed-in"`. Existing callers pass one of the first two and need no change
- **Slot** - pending, `SiteHeader` passes `Nav` the placeholder as `accountSlot` and no `onAccountClick`, so `Nav` renders it in the account position at both widths, beside Cart, with no change to `Nav`
- **Rejected** - a `pending` boolean beside `session`, two props that can disagree; a `Nav` `accountPresentation: "pending"`, which puts a session state into the session-agnostic primitive; a placeholder the site draws itself (`decisions.md` Q1)

### Skeleton, Sized and Silenced by the Block

- **Size** - `Skeleton` with `className="size-10 shrink-0 rounded-full"`: `size-10` replaces the default shape's `h-40 w-full`, `rounded-full` its `rounded-md`. That is `IconButton` `md`, the account icon's footprint, at every width (Q2)
- **Silent** - `aria-hidden` on the `Skeleton` removes it, its `status` role and its `Loading` name from the accessibility tree in one attribute (Q5). It is a `div` with no `tabIndex` and no handler, so nothing can focus or press it
- **Drift** - the store story compares the placeholder's box with the signed-in account icon's in the same browser run, so a change to `IconButton` `md` fails a test rather than shifting the bar
- **Rejected** - a `circle` or `icon` shape on `Skeleton`, a primitive variant that is the designer's to draw (`ui-design.md` sizes it in the block); overriding `role` and `aria-label` one by one, which leaves a node in the tree; a disabled `IconButton`, which a screen reader still announces

### The Site Holds the First Answer

- **Hook** - grade10 `src/chrome/useHeaderSession.ts` reads `useSession()` and returns a `SiteHeaderSession`: `"pending"` until `isPending` is first `false`, then `"signed-in"` when `data?.user` is present and `"signed-out"` otherwise
- **Hold** - the first answer is held in React state, set during render the way `useHeldAddress` (`@grade10/frontend-di/hydration`) holds the opened address. A later re-read cannot bring `"pending"` back (Q3): a signed-out visitor's re-read keeps `"signed-out"`, a signed-in collector's keeps `data` and with it `"signed-in"`, and the entry changes only when the read answers otherwise
- **Lifetime** - `Root` calls the hook at its top, above the bare-surface branch, because `Root` lives as long as the document: moving between surfaces, bare ones included, keeps the held answer, and a reload starts over
- **Wiring** - `Composition.signedIn` and `SiteShell`'s `signedIn: boolean` become `session: SiteHeaderSession`, passed straight to `SiteHeader`; `accountEmail` still comes from `useSession` in `Root`. The shell's line that an unresolved session reads as signed out goes
- **Rejected** - changing `isPending` inside `useSession`, which `SessionDecided`, `SignInBeforeNavigating` and `OneTapPrompt` also read for their own waits; a module-level nanostores latch, which outlives the React tree and leaks between tests that share modules; telling the first read from a re-read by `isRefetching`, which better-auth sets on the first read too

### The Transport Ends the Session Read

- **Deadline** - `SESSION_READ_DEADLINE_MS`, two minutes, in `@grade10/utils/deadline`. `createBrowserAuthClient` takes `sessionReadDeadlineMs` and bounds `/get-session` by it; every other call keeps `REQUEST_DEADLINE_MS`. `clients/auth.ts` passes it (Q4)
- **Per read** - better-auth starts a new read, and a new two minutes, each time it aborts the one in flight, so a collector who keeps returning to the tab on a stalled network keeps the placeholder
- **Reach** - every wait on `isPending` ends by the same deadline: `SessionDecided`, `SignInBeforeNavigating`, `OneTapPrompt`, `BookMinePage` and `LatestOrderPage` wait up to two minutes on a hung read, where the request deadline gave them 30 s. `refreshSession` keeps its own 30 s `beforeDeadline`, because checkout's press is drawn as working; the read it started runs on to two minutes
- **An option, not a second client** - better-auth keeps one session atom per client, so a second client for the longer wait would hold a second session. `REQUEST_DEADLINE_MS`'s comment names the option in place of "a client of its own"
- **Rejected** - the request deadline for the read, which ends it at 30 s, inside SC-73's minute, and shows a slow healthy read Sign In; no deadline, which leaves the placeholder and every other wait open for ever; a limit at each wait; a site timer

### Failures, Slow Reads and Written Pages Need No Hook Code

- **Failed read** - `onError` and the fetch's `catch` end the pending state with no `data` on a first read, so the hook answers `"signed-out"` and the header shows Sign In (Q4)
- **Failed re-read** - after the first answer, a 401 clears `data` and the header shows Sign In, and any other failure keeps `data` and the entry already shown; the hook adds nothing, since no decision asks for more
- **Slow read** - the hook holds no timer: the placeholder stays until better-auth ends the read, which the transport ends after `SESSION_READ_DEADLINE_MS`, two minutes, as a failed read (Q4)
- **Written page** - `useSession` already answers pending until hydration, so the prerender and the server write the placeholder and hydration renders the same markup (Q6)

### Layout Beside the Account Entry

`Nav`'s controls row is `justify-end` with Cart last, so the account entry's change in width moves only locale and search to its left, and Cart stays (Q7). The placeholder and the account icon share one 40px box, so a signed-in collector sees nothing move. No width is reserved for Sign In.

### Verification Lanes

| Scenario | Lane |
| --- | --- |
| `shared-ui-site-chrome-SC-45`, `shared-ui-site-chrome-SC-46`, `shared-ui-site-chrome-SC-47`, `shared-ui-site-chrome-SC-48` | Store Storybook Vitest browser lane: a `Pending` story in `site-header.auction-store.surfaces.stories.tsx` (wide) and `site-header.layout.stories.tsx` (375px, with a cart handler); box measured against the account icon, accessibility-tree queries, keyboard focus walk, handler spies |
| `grade10-site-site-page-shell-SC-68`, `grade10-site-site-page-shell-SC-70` to `grade10-site-site-page-shell-SC-74`, `grade10-site-site-page-shell-SC-78` | grade10 unit lane: the hook against a stubbed auth client stepped through pending, answered, a re-read with `isPending` true, a 401, a network error and a minute of fake time; after the first answer, a later 500 or network error keeps `signed-in` and a later 401 gives `signed-out`, and signing in or out moves straight between the two; `SiteShell.test.tsx` for the pass-through |
| `grade10-site-site-page-shell-SC-71`, `grade10-site-site-page-shell-SC-73` | `@grade10/auth-contracts` `test/sessionReadDeadline.test.ts`: the session read is bounded by the session-read deadline and every other call by the request deadline, and a read that runs out rejects with a deadline error; grade10 `src/clients/auth.test.ts`: the site passes a deadline longer than a minute |
| `grade10-site-site-page-shell-SC-69`, `grade10-site-site-page-shell-SC-77` | grade10 `src/serving/hydration.test.tsx`: the served markup holds the placeholder and no Sign In, and hydration recovers no error |
| `grade10-site-site-page-shell-SC-05`, `grade10-site-site-page-shell-SC-68` to `grade10-site-site-page-shell-SC-76`, `grade10-site-site-page-shell-SC-78` | grade10 Playwright walk: `page.route` holds the auth service's session read so the placeholder is on screen, an init script records every account entry the banner shows from first paint, and bounding boxes are read before and after the answer at wide and 375px widths; a keyboard pass and an accessibility snapshot while the read is held; a read held for a minute on `page.clock` keeps the placeholder, then shows the account icon; a later read the route fails keeps the account icon, and a later read with no session shows Sign In |

## Risks / Trade-offs

- **[Risk] A read the network neither answers nor fails leaves the placeholder** → the transport ends every read two minutes after it starts, so a first read that runs out shows Sign In (Q4); the walk proves a slow read still lands on the account icon
- **[Risk] A later `IconButton` resize leaves the placeholder a different size** → the store story asserts the two boxes are equal in the same run
- **[Risk] The `Skeleton`'s status role reaches a screen reader** → `aria-hidden` on the node; the story queries the accessibility tree for any status, busy state or `Loading` name in the header
- **[Risk] Hydration redraws the header from blank** → the hook holds nothing before hydration and `useSession` answers pending on both sides; `hydration.test.tsx` fails on any recoverable error
- **[Risk] A future reader of `useSession` copies the header's held answer for a surface that must wait** → the hold lives in the chrome's own hook, not in `clients/auth.ts`, and its name says whose it is
- **[Trade-off] A healthy read slower than two minutes shows Sign In, and every wait on `isPending` lasts up to two minutes where it lasted 30 s** → Q4 chose a bounded wait over one open for ever, and two minutes is far past a healthy read
- **[Trade-off] On the wide header a signed-out visitor sees language and search move left once** → Q7 chose this over reserving Sign In's width

## Migration Plan

1. Land the store group and publish its main SHA; the new value is additive, so the pinned grade10 keeps building.
2. Move grade10's `external/grade10-spec` pin to that SHA, then land the site group. No backend, wire or data change.
3. Roll back by reverting the grade10 commits together: the hook (#1164) and the read's deadline (#1193). The hook alone leaves every wait on the session read at two minutes with no placeholder to justify it, and the deadline alone brings back an unbounded read; both return the read to `REQUEST_DEADLINE_MS`. The store value can stay unused.
