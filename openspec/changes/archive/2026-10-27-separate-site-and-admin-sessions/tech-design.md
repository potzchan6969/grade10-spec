## Context

[`proposal.md`](proposal.md) says why; the four capability deltas under
[`specs/shared/auth/`](specs/shared/auth/) say what each session is held to.
This page is how the auth worker, the backends and the two SPAs deliver it.
All code is in `grade10`; the store carries the PRDs and the suites.

What exists today, and what shapes the approach:

- **One cookie.** `createAuth` (`packages/grade10-auth/backend/src/createAuth.ts`)
  builds a request-scoped better-auth with `cookieDomain(brand, deployEnv)` as
  the `crossSubDomainCookies` domain and better-auth's default cookie prefix.
  The site, the console and every backend read `better-auth.session_token` and
  `better-auth.session_data` (the five-minute cookie cache), so one sign-in
  covers both.
- **Sessions live in KV, not Postgres.** `secondaryStorage.ts` keeps each
  session blob under its random token, a per-user `active-sessions-<userId>`
  list, an `id:<sessionId>` pointer for the operator list, and one
  `session-version:<userId>` token the cache `version` callback reads.
  `storeSessionInDatabase` is off, so the Postgres `sessions` table is unused.
- **The console talks to the `api` host.** The console is at `adminHost` and
  reaches the auth worker and every backend through `gatewayUrl`, a sibling
  host. A cookie scoped to the console host would never arrive, which is why
  [Q5](decisions.md#decisions) chose cookie name on the brand's shared domain.
- **Backends never read cookies themselves.** `withBrowsingSession`,
  `authedProcedure` mutations and `resolveElevatedSession` hand the browser's
  headers, `Cookie` and `Origin` included, to `AuthService.getSession` over the
  service binding (`packages/worker/src/session.ts`, `context.ts`,
  `contracts/src/service.ts`). The gateway is a verbatim forwarder.
- **Hosts.** `adminHost`/`adminUrl` in `packages/app-env/src/sites.ts` already
  yield `admin.<base>` and the flat `stg2-admin.<base>` / `uat-admin.<base>`
  through `envSubdomain`; `runningAdminUrl` returns `E2E_ADMIN_ORIGIN` on the
  isolated stack, which the auth worker already receives.
- **Isolated e2e and local dev.** With `crossSubDomainCookies` off, the
  session cookie is host-only on `127.0.0.1`, and cookies ignore ports, so the
  site, the console and the gateway share one jar. Only the cookie name can
  tell the two sessions apart there, which is a reason to prefer it.

No table, column or KV key is added. The session blob gains one field, and the
sign-in token gains a prefix.

## Goals / Non-Goals

**Goals:**

- Two sessions per brand, told apart by cookie name, on the brand's domain
- A surface is chosen by a signal the browser sets and a caller cannot use to
  gain anything, and a forged signal buys no authority
- Revoke, ban, cache version, recent sign-in and second factor each cover the
  right sessions with no new store
- Both brands, every environment lane, and the e2e and dev modes, on one code
  path
- A release that needs no SPA or backend redeploy to take effect, bar the one
  send that names the site, and that rolls back

**Non-Goals:**

- A second auth worker, a second KV namespace, a second user table
- Carrying a site session into the console, or the reverse
- Moving a brand's second customer site onto its own session; that is one new
  entry in the surface registry when a second site exists
- Changing roles, the second-factor policy, or any timing

## Decisions

The specs govern: [`session`](specs/shared/auth/session/spec.md) (two
sessions, console-only authority, release), [`sign-in`](specs/shared/auth/sign-in/spec.md)
(the surface a link or Google sign-in signs in),
[`sign-out`](specs/shared/auth/sign-out/spec.md) and
[`sessions`](specs/shared/auth/sessions/spec.md). The choices below are how.

### D1. Two surfaces, one registry, one cookie prefix each

A surface is `site` or `console`. `packages/grade10-auth/contracts/src/surface.ts`
(new) owns the type, the cookie prefix of each, and the origin test; the auth
worker, the e2e helpers and the tests import it.

| Surface | Cookie prefix | Session cookie | Cookie cache | Origin that selects it |
| --- | --- | --- | --- | --- |
| `site` | `better-auth` (unchanged) | `better-auth.session_token` | `better-auth.session_data` | any request that is not the console's, including none |
| `console` | `better-auth-console` | `better-auth-console.session_token` | `better-auth-console.session_data` | exactly `runningAdminUrl(brand, deployEnv, E2E_ADMIN_ORIGIN)` |

- better-auth's own `advanced.cookiePrefix` names every cookie it sets, so
  `session_token`, `session_data`, `dont_remember` and the two-factor cookies
  split together. `__Secure-` stays where it is today.
- The site keeps its name, so customer sessions are untouched. The console's
  name is new, so the console stops honouring the site's cookie on release.
  The e2e suffix match `better-auth.session_token` does not match
  `better-auth-console.session_token`, so it keeps meaning the site.
- Both cookies keep `Domain=<cookieDomain>`, because the console reaches the
  gateway on a sibling host. Each request therefore carries both cookies when
  both exist, and the surface alone decides which one the auth worker reads.
- Staging-2 and uat compose their hosts flat (`stg2-admin.grade10-stg.com`) and
  share the cookie domain `.grade10-stg.com` with staging. `adminUrl` already
  returns the flat host, so the origin test needs nothing special. The shared
  jar is an existing trait: each lane's worker signs with its own secret, so a
  sibling lane's cookie is ignored and a later sign-in overwrites it. The
  change doubles the names in that jar and does not widen the collision.

Rejected:

- **Cookie scoped to the console host.** Never reaches the gateway
  ([Q5](decisions.md#decisions)).
- **A per-lane or per-surface secret.** It would isolate by signature, but the
  two-factor plugin encrypts enrolled secrets with the context secret, so a
  console-only secret re-keys every operator's enrolment, and the site keeps
  the old one. The surface stamp in D3 gives the same isolation without it.
- **Rewriting `Cookie` and `Set-Cookie` names at the edge around one
  better-auth.** It leaves one prefix inside, so a cookie copied between names
  would verify. Fragile with `__Secure-` and chunked cookies too.
- **Two auth workers.** A non-goal; the user table and the KV namespace stay
  one.

### D2. The auth worker chooses the surface per request, and a forged choice gains nothing

`createAuth(env, headers, db, options, surface)` takes the surface as a required
argument, so no caller can forget it. It sets `advanced.cookiePrefix` from D1
and nothing else about the surface changes in better-auth's config. One
function, `surfaceOfRequest(headers, env)`, makes the choice:

| Caller | Surface | Signal |
| --- | --- | --- |
| Browser request to the auth worker's `/api/auth/*`, `/dev/*` | `console` if `Origin` is the console origin, else `site` | `Origin`, set by the browser and not by page script |
| `AuthService.getSession` from a backend, no `elevation` | the same function over the forwarded headers | `Origin` in the forwarded headers |
| `getSession` with `elevation: true`: the elevated ladder, `elevatedRoute`, the directory service, the auth worker's own elevated tRPC | `console`, whatever the headers say | the call itself |
| A magic-link follow, `GET /magic-link/verify` | the surface in the token (D5) | the token |
| A trusted product signing a verified address in (`signInVerifiedEmail`) | `site` | the call; a product of the brand is the site |
| `POST /api/auth/sign-in/magic-link` from the console that names `site` (an operator action's site link, Q16) | `site`, once the console session passes the elevated ladder | the name in the request, authorised by the console session |
| `POST /dev/login` | `console` if the body says so (dev only), else `surfaceOfRequest` | the dev body |

Why `Origin`:

- A browser sets it on every cross-origin `fetch`, including `GET`, and page
  script cannot override it. Every console call to the auth worker and the
  backends is cross-origin, since the console is not on the `api` host.
- It needs no change in any SPA client or tRPC link. Both auth clients and every
  `fetch` the SPAs make stay as they are.
- The e2e helpers already send it (`sendMagicLink` sets `origin: SITE_ORIGIN`).

Why the default is `site`, not "refuse": a request with no `Origin` is either a
same-origin navigation, a non-browser caller such as Playwright's
`APIRequestContext` or `curl`, or an `<img>`/`<iframe>` load. None may become
console authority, and all may keep reading the site as they do today. The
console needs a positive signal, and for the byte routes the console frames
(identity capture, sealed document, item photo), that signal is the ladder:
they mount through `elevatedRoute`, so `elevation: true` selects the console
without an `Origin`. A test enumerates the routes and procedures the console
calls and fails on one that is neither fetched with an `Origin` nor elevated
(see Risks).

Spoofing. `Origin` is spoofable by a non-browser client, so it chooses a cookie
and authorises nothing:

- A spoofed `Origin: console` reads the console cookie. Absent or forged
  there, the request is signed out. A site cookie renamed to the console name
  is refused by D3.
- A spoofed `Origin: site` reads the site cookie, and the site instance serves
  neither `/admin/*` nor `/two-factor/*` (D4).
- Elevated reads do not use `Origin` at all.
- A forged `surface: "site"` on a console send is refused unless the console
  session passes the ladder below. With the ladder passed it asks for what any
  site visitor may already ask, a site link for an address, so the gate keeps
  the exception to operators and does not defend against more.

An operator action's site link (Q16). The console's Email sign-in link sends a
customer account a link that must sign in the site, and its request carries the
console's `Origin`. Its one caller is `emailSignInLink` in `AuctionTestWinners`
(`apps/admin/grade10/src/pages/auction-test/AuctionTestPage.tsx`), the test
winners panel of `complete-auction-post-sale`, which calls
`signIn.magicLink({ email, callbackURL })` on the console client and names no
surface today. The send request may therefore name its surface, as a JSON
field `surface: "site"` that the better-auth endpoint does not use and the route
reads before it builds an instance. Only that name, on that endpoint, is read:

- The route accepts it only when `Origin` selects the console. A name on any
  other request, or any value other than `site`, is refused as a bad request.
- It reads the console session through the elevated read (`elevation: true`, so
  the console whatever the headers say) and walks the ladder the elevated
  procedures and the before-hook already share, `elevationRefusal`, for
  `user:create`, the grant that makes the account the link is for and the one
  the test-winner action in `complete-auction-post-sale` already needs
  alongside `auction:operate` (Q16). A missing console session, a site session
  presented as the console's, a role without the grant and a second factor not
  proved each refuse with the ladder's own code, logged through `logRefusal`:
  `UNAUTHORIZED` for the first two, `FORBIDDEN` for a role without the grant,
  and the ladder's second-factor refusal for a second factor not proved. No
  email is sent.
- Only then does it build the `site` instance and let it serve the send, so the
  token, the cap, the supersession, the callback and the follow all read `site`
  with no further code (D5).

Rejected:

- **An explicit `x-surface` header set by the SPAs.** Same trust as `Origin`
  from a script, and it touches every client. Origin is already the
  better-auth CSRF input, so the two cannot disagree. The one name above is
  not this: it is read on one endpoint and authorised by a session.
- **Inferring from the `Host` or a path prefix.** The surfaces share the `api`
  host and the same paths.
- **The `callbackURL`.** Attacker-supplied, and absent on most requests. It
  cannot name the site for an operator action either: a console link naming a
  site location lands on the console (`shared-auth-sign-in-SC-97`).

### D3. The session carries its surface, and each door refuses a foreign one

The cookie name chooses where to look; the stamp keeps a copied cookie out.
`session.additionalFields` gains `surface` (`input: false`, default the
instance's surface, `returned: true`), so every session minted by any path,
including the magic-link, Google One Tap, `mintSession` and impersonation
plugins, is stamped by the instance that created it with no per-path change.

- The blob in KV and the cookie cache payload both carry `surface`. A session
  with none, minted before release, reads as `site`.
- **Cache version.** `cookieCache.version` returns `<surface>.<current>` for
  the console and the unchanged token for the site. A cache cookie copied
  across names carries the other's version and falls through to a real read.
  Site cookies keep their current version, so release does not cost the site's
  cache a one-time miss.
- **Guard.** `createSecurityHooks` gets a `surface` and one step in `before`:
  when the request carries this surface's session cookie and
  `getSessionFromCtx` resolves a session whose stamp differs, refuse with
  `UNAUTHORIZED`. `readSession` makes the same comparison on the
  `auth.api.getSession` result and answers signed out. These are the two doors
  into better-auth: the HTTP route (`routes/betterAuth.ts`) and the RPC reads.
  The guard logs the refusal and counts it, so the proposal's metric,
  console requests accepted on a session the console did not create, is
  observable and expected to read zero. The refusal is defence in depth and
  adds no behaviour a requirement states: the cookie name already keeps a
  site session out of the console, and the outcome a requirement fixes, a
  foreign session presented as the console's own is no person
  (`shared-auth-session-SC-34`), is the same with or without the status code.
- An honest browser never reaches the guard, since it presents each cookie
  under its own name; it fires on tampering only. That is why a 401 on
  `get-session` is acceptable: no honest tab would read it as a definite
  sign-out of a session it holds.

Rejected:

- **Gating in `secondaryStorage.get`.** Listing sessions and revoking by
  token call the same `get` for every surface's tokens, so a gate there blinds
  the operator list that must name both.
- **A `surface` column on the Postgres `sessions` table.** The table is not
  written while sessions live in KV. A guard test compares better-auth's
  declared session fields with the schema so a move to
  `storeSessionInDatabase` fails loudly instead of dropping the stamp.

### D4. Console authority lives on the console instance only

- The `before` hook refuses every `/admin/*` and `/two-factor/*` request on
  the `site` instance with `FORBIDDEN`, before the permission and second-factor
  steps. `/two-factor/*` is console-only because enrolment and step-up are
  console acts, and `/admin/*` is how an operator acts on accounts.
  Both plugins stay installed on both instances, since the admin plugin's
  fields (`role`, `banned`) feed `SessionUser` and its ban check runs when any
  session is created.
- A site request refused here is counted with reason `admin-path`. The
  `FORBIDDEN` refusal is defence in depth with no new behaviour: no honest
  site client calls these paths, and a site session never passes an operator
  action either way (`shared-auth-session-SC-33`).
- Elevated reads (`elevation: true`) resolve the console instance, so
  `elevationRefusal` sees the console's own roles, its own step-up stamp
  (`step-up:<session token>`, unique per session) and its own `createdAt`
  for the 15-minute recent-sign-in rule in `assertMayEnrol`. No code in
  `stepUp.ts` or the second-factor policy changes: a site session is never the session
  those functions are handed, so a site sign-in cannot count (Q6).
- The elevated ladder in `packages/worker/src/trpc.ts` and
  `resolveElevatedSession` need no change in wire or code. Their doc comments
  say that elevation selects the console.

### D5. A sign-in link carries its surface in its token

- `magicLink({ generateToken })` returns `<surface>.<32 random characters>`
  (`site.` or `console.`). The token is also the key of the verification row,
  so a follow that edits the prefix finds no row, and the surface cannot differ
  from the one that sent the link. Nothing is stored beside it, so the
  five-minute life is untouched.
- `registerBetterAuthRoutes` reads the prefix on
  `/api/auth/magic-link/verify` to choose the instance, because a link follow
  is a top-level navigation with no `Origin`. A token with no known prefix is
  a link sent before release and reads as `site`.
- `brandCallbackTarget(value, env, surface)` and `brandMagicLinkUrl` take the
  surface and coerce a `callbackURL` that does not belong to it: the console
  lands on its own origin, the site never on the console's. It runs on send
  and again on follow, as the brand guard does today.
- `invalidateEarlierSignInMail`, `assertSignInSendAllowed` and the settled
  marks (`signInWatch.ts`) are keyed by address and surface (Q12, Q13): a
  console link right after a site link for the same address is sent and leaves
  the site link alive, and a sign-in on one surface ends only the waits that
  asked from that surface. The surface in the key is the one the token's prefix
  names.
- A follow that creates no session (expired, used, superseded, invalid, banned)
  or that meets a different account redirects by the token's surface (Q14): a
  `site` token to the brand home with the toast, a `console` token to the
  console origin's sign-in page, which shows the failure or the Switch and Stay
  choice inline because the console has no toasts. The failure code travels as
  it does for the site.
- The signed-in-mismatch check in `before` calls `getSessionFromCtx`, which
  reads the instance's own cookie, so "already signed in as someone else" is
  judged on the surface the link belongs to with no further code.
- A link follow on the `console` instance sets only the console cookies. The
  `site` session cookies stay on the response untouched.
- A send an operator action names for the site (D2, Q16) is served by the
  `site` instance, so its token reads `site.<random>`. It signs in the site,
  lands on the site's own location, counts against the site's cap, replaces
  earlier site links for that address, and a failed follow lands on the brand
  home with the site's toast. The console session of whoever opens it is not
  read or written, because the follow runs on the `site` instance.

### D6. Google One Tap and the other sign-in methods follow the instance

`/one-tap/callback` is a `fetch` from the page that showed the prompt, so its
`Origin` selects the instance and the new session is stamped and set under that
surface. The console's client already registers `oneTapClient` through
`createAdminAuthClient`, though no console page shows the prompt (below), and
the Google client id is one for the brand, so nothing in Google's console
changes.
`assertOneTapGoogleEmailVerified` runs unchanged. The browser's own
`preventSilentAccess()` on sign-out is per origin, so a console sign-out does
not touch the site's auto sign-in.

The auto-prompt is the site's and follows the session of the client it runs in.
Only the site SPAs mount `OneTapPrompt`, each with its own `useSession()` result,
and `useOneTapPrompt` shows the prompt only when that read says signed out; the
site's client reads the site's cookie. A console session therefore never
withholds the prompt (`shared-auth-sign-in-SC-86`, `shared-auth-sign-in-SC-114`)
and no code changes for it. The console does not mount `OneTapPrompt` and this
change adds no console mount, so a site session has no console prompt to
withhold; shared-auth-sign-in-SC-113, which described one, was retired and its
id is not reused.

`signInVerifiedEmail` and `ensureVerifiedAccount` serve products of the brand
(checkout, a trusted product), which are the site. They build the instance with
`site`. `/dev/login` and `/dev/prepare-user` take a `surface` in the body for
tests and the dev widget, defaulting through `Origin`, so the widget mounted in
either SPA signs in that SPA.

### D7. Revoke, ban and the cache version cover both surfaces by staying keyed by user

- `active-sessions-<userId>` is one list of tokens, whichever surface minted
  them. `/admin/revoke-user-sessions`, `/admin/ban-user` and account deletion
  walk it, so they end both. `revoke-user-session` resolves a token or listed id
  across surfaces, so an operator on the console can end a site session.
- `bumpSessionVersion(userId)` writes one `session-version:<userId>` token and
  both surfaces' `cookieCache.version` read it, so the 70-second bound in
  `shared/auth/sessions` holds for a cached read on either.
- `/admin/list-user-sessions` returns `surface` per row from the blob. The
  existing `after` step that indexes ids and strips tokens defaults a missing
  stamp to `site`, which is what a pre-release row is. `AdminSession` in
  `admin-frontend` gains `surface`; the console list shows it as a label
  (wording is the console's; `Site` and `Console` are the journeys' words).
- Sign-out is better-auth's `/sign-out` on the request's instance, so it deletes
  that surface's session and clears that surface's cookies only.

### D8. Tabs, the client and the browser

Nothing in the SPA clients changes for the separation. The cross-tab channel
(`better-auth.message` in `localStorage`) and the `announceSessionArrivals`
broadcast are same-origin, and the site and console are different origins, so
a console tab and a site tab never hear each other, which is the "own surface"
rule. Each surface's refetch on focus reads its own cookie.
`sessionCoversHost` in `contracts/src/session.ts` encodes the brand-wide rule
and has no caller outside its test; it is deleted with its test.

### D9. Tests

- **Backend, pglite** (`apps/backend/<brand>/auth/test/db/surfaces.spec.ts`,
  both brands through one shared suite in `@grade10/auth-backend/testing`):
  two sessions for one user are independent; a console cookie never reads as
  the site and the reverse; revoke-all and ban end both and bump the version;
  a copied cookie renamed across surfaces is refused at both doors; the site
  instance refuses `/admin/*` and `/two-factor/*`; a link's token prefix picks
  its surface and the other session is untouched; the list names the surface.
  `useAuthFixture().login` takes a `surface`. The named site send: an elevated
  console session's send names `site` and mints a `site.` token that signs in
  the site only and leaves the console session as it was; no console session, a
  site session that holds a role, a role without `user:create` and a console
  session whose second factor is not proved are refused with nothing sent; a
  name other than `site`, or `site` from an `Origin` that is not the console,
  is refused.
- **Contracts and worker units:** the origin test over production, flat
  staging-2/uat and e2e origins; `surfaceOfRequest` defaults; the ladder passes
  `elevation: true` and the auth worker answers it as the console.
- **E2E** (`apps/frontend/grade10/e2e`): the helpers learn the console. Isolated
  and hosted lanes share the surface-aware `loginViaMagicLink`
  (`surface: "console"` sends with `origin: ADMIN_ORIGIN`, a console
  `callbackURL`, and asserts the `better-auth-console.session_token` cookie).
  Every spec that signs in on the site and then opens `ADMIN_ORIGIN`
  (`auction/*`, `grading/*`, `admin/*`, `inventory/*`, `pos/*`, `vault/*`) is
  moved to a console login. The isolated jar shares `127.0.0.1`, so one context
  holding both cookies proves the separation without a second browser.

## Risks / Trade-offs

- **[Risk] A console request arrives with no `Origin` and reads the site's
  session.** A byte route or `<img>` the console frames, not mounted through
  `elevatedRoute`. → Every console-framed route is an `elevatedRoute` today; a
  test walks the backend routers and refuses a non-elevated route the console
  fetches, and the guard counter would show a console surface reading `site`.
- **[Risk] Origin spoofing by a non-browser client.** → It selects a cookie
  only; D3 refuses a foreign stamp, D4 refuses admin paths on `site`, and
  elevated reads ignore it.
- **[Risk] A missing stamp reads as `site`, so a console-minted session whose
  field was dropped would pass as a site session.** → The stamp is a default
  of the field, not per call site, and a test mints through each path (link,
  One Tap, `mintSession`, impersonation) and asserts it.
- **[Risk] better-auth upgrade drops `generateToken`, `additionalFields` in a
  KV-only session, or the `cookiePrefix` split.** → The version is pinned and
  patched (`patches/better-auth@1.6.26.patch`); the backend suite pins each of
  the three.
- **[Risk] Two cookie caches enlarge every request header.** → Each is a
  compact signed blob under the 4 KB cookie cap, and only the `api` host sees
  both; measured in the e2e run.
- **[Risk] The staging test door keys its mail and its wait per address, and
  this change keys them per address and surface.** `add-staging-auth-test-door`
  captures the last sign-in mail per address and clears the wait per address;
  with per-surface keys (D5) a console and a site link for one tester address
  hold two waits and two superseded chains. → The door must return the latest
  mail across surfaces and clear both surfaces' keys. Its delta says "the
  named tester address" and "the wait ... that `shared/auth/sign-in` sets" and
  names no surface, so it reads correctly as written; the door's
  implementation, not its spec, must follow the keys. Task 6.2 carries it.
- **[Risk] Hosted lanes share one tester address across surfaces.** The
  staging test door records one outbox row per address, so a site link and a
  console link requested for the same tester collide. → The outbox row carries
  its token, whose prefix names the surface, and the door returns the latest;
  specs sign in sequentially, one surface at a time.
- **[Risk] The console's Email sign-in link sends as the console and gets a
  console link unless it names the site.** That link is the test winners panel
  of `complete-auction-post-sale`, which signs the test account in on the site
  (Q16). The shipped `emailSignInLink` in `AuctionTestWinners`
  (`apps/admin/grade10/src/pages/auction-test/AuctionTestPage.tsx`) calls
  `signIn.magicLink({ email, callbackURL })` on the console client and names no
  surface, so once the auth worker reads `Origin` its emailed link signs in the
  console and the test account never reaches the order on the site. → The call
  names `surface: "site"` (tasks 4.12 and 4.13), a panel test asserts it and a
  backend test asserts the emailed token's prefix. Until the panel names it, the
  emailed link signs in the console. `complete-auction-post-sale` states the
  same call in its Test Winner step 5 and its task 7.7.
- **[Risk] Operators pre-release hold a live session that now reads as a site
  session.** → Expected: that is the site session they had. The console does
  not honour it (Q3).
- **[Trade-off] `site` is a single catch-all surface.** A second customer site
  of a brand shares the site session until it is given a registry entry and a
  prefix; the decision records signing in there on its own as a consequence,
  and the registry is where that is done.

## Migration Plan

1. Merge the grade10-spec groups (PRDs, suites), then bump the submodule in
   grade10.
2. Deploy the auth worker for both brands, staging first. Nothing else has to
   deploy with it: the SPAs and backends send what they send today, and the
   backends' elevated reads already pass `elevation: true`. The one send that
   changes is the test winners panel's Email sign-in link (`emailSignInLink` in
   `AuctionTestWinners`, tasks 4.12 and 4.13), which names the site. The
   current endpoint does not read the field, so that panel ships first, once a
   test confirms the endpoint accepts it, and the auth worker deploys after it.
   With the worker first, the panel's link would sign the test account in to the
   console until the panel shipped.
3. At the deploy, the console reads only its own cookie, so every operator is
   signed out of the console and signs in once more, with the second factor as
   usual. Site sessions, the site cookie name and its cache version are
   unchanged, so customers notice nothing. A sign-in link sent minutes before
   the deploy carries no prefix and signs in the site.
4. Update the hosted e2e lanes in the same release, since a spec that signs in
   on the site and opens the console now meets the console's sign-in.
5. Watch the guard counter and the refused-admin-path counter on the first
   day; both are expected to be zero from real traffic.

Rollback: redeploy the previous auth worker. The shared cookie name is read
again, so operators are signed in to the console by their site session; sessions
made on the console meanwhile carry a `surface` field the old code ignores, and
`better-auth-console.*` cookies are unread. No data is migrated either way.

## Open Questions

None. The three choices raised with the specs are answered (Q12 to Q14 in
`decisions.md`) and sit in D5: the send cap, supersession and the settled marks
are per address and surface, a wait ends only for a sign-in on its own surface,
and a failed or mismatched console-asked link lands on the console's sign-in
page with an inline message. Q16, which surface a link a console operator
sends for a customer account signs in, sits in D2 and D5.
