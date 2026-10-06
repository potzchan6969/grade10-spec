# Design: Account profile with basic information

Capability deltas:
[`grade10-site/store/account-profile`](specs/grade10-site/store/account-profile/spec.md),
[`shared/ui/store-profile`](specs/shared/ui/store-profile/spec.md),
[`grade10-site/store/membership`](specs/grade10-site/store/membership/spec.md),
[`grade10-site/store/wallet-member-card`](specs/grade10-site/store/wallet-member-card/spec.md).
Motivation: [proposal.md](proposal.md) — Why. Decisions:
[decisions.md](decisions.md).

## Context

The profile ships across three places. `@grade10/ui` exports the
`store-profile` block (`ProfileCard`, `ProfileDetails`, `ProfileForm`); both
brands' SPAs render the same `ProfileView` from `@grade10/store-frontend` at
`/profile`, each passing the session's email as a prop; and each brand's store
worker owns the data: `account_profile` (`user_id`, `display_name`, `bio`,
`phone`, timestamps) behind `profile.get`, `profile.update` and
`profile.setPhone`.

Part of this change already runs in grade10, built ahead of acceptance:

| What | Where |
| --- | --- |
| `display_name` nullable; `ensureAccount` writes no name | `0043_profile_name_optional.sql` in both brands, commit `5b086132d1` |
| One member-name rule, `memberName`, for the profile, the till and the pass | `packages/grade10-store/backend/src/services/memberName.ts`, commit `ea91833d32` |
| Auth's `AccountIdentity` carries a required `name` | `packages/grade10-auth/contracts/src/schemas.ts`, commit `ea91833d32` |
| `profile.get` answers for a member who never saved, and stores nothing | `packages/grade10-store/backend/src/trpc/routers/profile.ts` (`profileOf`), commit `07a7edd169` |
| A profile save kicks the member's wallet refresh, best effort | the same router's `update`, commit `66bce689a6` |
| The page asks a signed-out visitor to sign in | `apps/frontend/grade10/src/surfaces.ts`, the `profile` surface's `signedOut: "ask"` |

Member-since still reads `created_at`, the placeholder rows are not cleared,
and nothing about the avatar exists yet.

Three constraints shape the rest.

- **A read creates nothing** (`docs/prds/platform/account-data.md` rule 7). The
  row appears when a writer calls `ensureAccount`, which runs from webhooks
  and tasks with no session. Rows written before `5b086132d1` carry
  `Member <first 8 of user id>`, a name nobody chose.
- **Auth owns the account's name and picture** (grade10
  `docs/architecture/account-data.md`, Ownership). The name a member chose for
  the shop is the store's, beside it. The avatar is the same kind of fact: the
  image a member chose for the shop, held by the store, not auth's
  `users.image`.
- **Object storage is a shared package.** `@grade10/object-store` gives the
  bucket-owning workers content-addressed keys, an R2 port, an area registry
  and the cursor-resumed orphan sweep; the auction, the vault and e-kyc use
  it. The store worker binds no bucket yet.

## Goals / Non-Goals

Design-level only; [decisions.md](decisions.md#non-goals) owns product scope.

- **Goal:** one source for what the account page shows, read by both brands'
  `ProfileView` and the store demo, so neither composes session values again.
- **Goal:** the avatar stored the way every other bucket-owning worker stores
  bytes — no second storage pattern.
- **Non-goal:** image transformation in the worker, thumbnails, or a CDN
  product. One stored object per avatar.
- **Non-goal:** an interactive cropper.

## Decisions

### The backend composes the profile the page shows

`profile.get` returns a view — display name, bio, avatar URL, email,
member-since, and the `phone` it carries today — composed from the row and the
session: display name by `memberName`; member-since null before the first save.
`profile.update` and the avatar upload answer `saved` carrying the same view,
or `refused` with its reason; the avatar removal answers `saved` with the
view. The row shape
stays internal to the worker; `StoreProfile` in `@grade10/store-contracts`
becomes that view. `ProfileView` reads the email from the view, and both
brands' `ProfilePage` stop passing it, so the page has one source for it.

`profile.update`'s input refuses an excess key, so an edit carrying `email` is
refused rather than stripped.

*Alternatives:* compose in the frontend feature — rejected, the session's name
and email live behind the auth service and every consumer would repeat the
merge. Create the row on read — rejected, it breaks account-data rule 7.

Makes pass: `grade10-site-store-account-profile-SC-03`, `grade10-site-store-account-profile-SC-04`, `grade10-site-store-account-profile-SC-05`,
`grade10-site-store-account-profile-SC-07`, `grade10-site-store-account-profile-SC-08`, `grade10-site-store-account-profile-SC-11`, `grade10-site-store-account-profile-SC-12`.

### A name nobody chose is NULL, and the placeholder is cleared after the deploy

A name the collector never chose has to be told apart from one they did
(decisions Q2). The column is nullable and `ensureAccount` writes no name
(`5b086132d1`); every surface fills a NULL name by `memberName`. Whether a save
that leaves the prefilled name untouched stores it is decisions Q12.

The rows written before that commit are cleared by their own migration in
each brand, `UPDATE store.account_profile SET display_name = NULL WHERE
display_name = 'Member ' || left(user_id, 8)`, the exact string the old
`ensureAccount` wrote. Migrate applies every pending file at once and deploys
never migrate, so the file lands only once the worker that reads a NULL name
is live in that environment. Until it runs, `memberName` reads the placeholder
as a shop name.

*Alternatives:* a `display_name_set` boolean — rejected, a second source for a
fact the column already carries. Compare the placeholder at read time —
rejected, it hides a collector who typed that string, and the comparison would
live forever.

Makes pass: `grade10-site-store-account-profile-SC-06`.

### One member name, resolved by one store rule

The profile, the till and the wallet pass show one name, resolved by
`memberName`:

1. The name the member chose for the shop.
2. The account name, auth's `users.name`.
3. The part of the email before the `@`.

`profile.get` and `profile.update` read the account name from the session. The
POS directory's `displayNames` and the wallet sweep have no session, so they
ask auth's `accountsByUserIds` in one uncached batch, and only for members
with no shop name. The till session and the customer-details badge both read
their name through `displayNames`, so they cannot disagree.

A store that gets no name fails loudly rather than guessing: the till and the
badge show 會員, and a pass the lap cannot name is retried, so no pass is
blanked. A member with a shop name needs no account service, so the till names
them through an outage.

The wallet lap resolves names per member, not per batch. Its facts reader
takes the shop names from the store first and asks auth only for the rest; when
auth cannot answer, each member it was asked about is a failed read for that
row alone, which keeps the rung its claim spent and records why, and the lap
refreshes everyone else. `displayNames` keeps throwing when auth cannot answer,
since adding a pass and the till need a name or a loud failure, never a blank. Today one
member with no shop name fails the whole claimed batch, so through a long
outage a pass with a shop name waits on its neighbours every lap; per member,
it waits on nobody. The programme's own read still fails the whole lap, as it
does today.

`memberName` only trims, so the till, the badge and both pass builders
(`packages/wallet-pass/src/google.ts:158`,
`packages/wallet-pass/src/apple/pkpass.ts:110`) carry the name whole; the
wallet app and the till lay it out.

A profile save kicks the wallet refresh after the response, best effort, so a
saved name reaches the pass on the next lap: a fourth way a pass falls due,
beside its own next-change instant, the daily floor and the change-log kick. A
lost kick and an account-name change are caught by the daily floor.

Makes pass: `grade10-site-store-membership-SC-78`, `grade10-site-store-membership-SC-87`, `grade10-site-store-membership-SC-88`, `grade10-site-store-membership-SC-89`,
`grade10-site-store-membership-SC-90`,
`grade10-site-store-wallet-member-card-SC-13`, `grade10-site-store-wallet-member-card-SC-18`, `grade10-site-store-wallet-member-card-SC-39`, `grade10-site-store-wallet-member-card-SC-56`,
`grade10-site-store-wallet-member-card-SC-57`, `grade10-site-store-wallet-member-card-SC-58`,
`grade10-site-store-wallet-member-card-SC-59`, `grade10-site-store-wallet-member-card-SC-60`.

### Member-since is a timestamp the first save writes

`account_profile.created_at` records when the row appeared, and a row can
appear from a webhook the collector never triggered (decisions Q4). A nullable
`first_saved_at` is written as `COALESCE(first_saved_at, now())` by every write
the collector makes to their profile — `profile.update` and both avatar routes,
a save that repeats the stored values included — and by nothing else: `ensureAccount`, `setPhone` and joining at a counter
leave it alone. The view reads it, and null means the page shows no date. Rows
saved before the column existed are decisions Q11: answered (a), they stay
NULL; answered (b), one backfill copies `created_at` where `display_name` is
not NULL after the placeholder is cleared.

*Alternatives:* read `created_at` — rejected, it dates the store's bookkeeping
rather than the collector. Infer the first save from `display_name IS NOT
NULL` — rejected, it carries no date.

Makes pass: `grade10-site-store-account-profile-SC-08`, `grade10-site-store-account-profile-SC-09`, `grade10-site-store-account-profile-SC-10`,
`grade10-site-store-account-profile-SC-35`, `grade10-site-store-account-profile-SC-37`.

### Avatars are content-addressed objects reclaimed by the orphan sweep

Each brand's store worker binds an `AVATARS` bucket through
`createR2ObjectStorePort` and registers one `avatars` area. A key is
`contentKey("avatars", digest, ext)`, where `digest` is the SHA-256 of the
user id followed by the bytes. Each profile owns its object, the address
cannot be worked out from the image alone, and the same collector uploading
the same image again writes the same key. `account_profile.avatar_key` holds
it, never a URL, and the view derives the path, as the auction's
`lotImagePath` does.

1. The upload puts the object, then writes the row: one statement sets
   `avatar_key` and `first_saved_at`.
2. A removal sets `avatar_key` to NULL.
3. The store's cron runs `deleteOrphanedObjects` over the `avatars` area, whose
   `referenced` answers which keys their profile's row still holds. A
   replaced or removed image, and an object whose row write failed, is deleted
   once it is a day old and unreferenced; the port re-reads an object's age
   before deleting it, so a re-uploaded key saves itself.

The area's `referenced` is also the serving check: `GET` on an avatar path
answers 404 for a key no row holds, so a replaced or removed image stops
answering at the worker at once. The route needs no session and publishes
through `edgeCache()` with `cacheTag("avatar", key)`; replacing or removing an
avatar purges the old key's tag in `waitUntil`, best effort, since a lost purge
leaves a copy only until its `max-age` runs out. A new image has a new key, so
the address changes with the image.

`storage_cursors`, the sweep's resume table, comes from
`@grade10/object-store/schema` into the store schema.

*Alternatives:* the digest of the bytes alone — rejected, two collectors with
one image would share an object, so a replaced image would keep answering for
the other profile, and anyone holding the image could work out its address. An
HMAC of the bytes under a store secret — rejected, a secret to provision and
rotate for what the user id already gives. A random key per upload and a due
row per replaced object, claimed by a cron pass of its own — rejected, it
rebuilds what the shared sweep already does, and still leaves the orphan of a
failed row write.
Authenticated streaming per render, like the auction's proof documents —
rejected under decisions Q1's recommendation, which product has not yet
answered: every render becomes a worker invocation no cache
can absorb, and a public profile would undo it. Cloudflare Images — rejected,
a new paid dependency for one square image.

Makes pass: `grade10-site-store-account-profile-SC-20`, `grade10-site-store-account-profile-SC-23`, `grade10-site-store-account-profile-SC-24`,
`grade10-site-store-account-profile-SC-38`.

### Byte routes go through a tRPC caller, and the transport learns one body type

`POST /api/profile/avatar` (image bytes as the body) and
`POST /api/profile/avatar/remove` are Hono routes that build a tRPC caller and
invoke a procedure, as the auction's `routes/uploads.ts` does, so the session
check, the refusal vocabulary and the audit entry are the ones every other
store mutation uses. The type is checked against the three accepted types in
the procedure. The size cap is `MAX_AVATAR_BYTES = 5 * 1024 * 1024` in
`@grade10/store-contracts`, the same reading of a megabyte as the grading
service's `MAX_CARD_PHOTO_BYTES`; a declared length over it is refused before
the body is read, and the cap that counts is measured on what arrived, as
grading's `routes/photos.ts` does. A refusal the route makes before the
procedure runs answers the procedure's own `avatarTooLarge` outcome, so the
feature reads one shape.

On the frontend, `StoreApiClient` keeps its two verbs; the route table learns
to pass a `Blob` body through untouched with its own content type instead of
JSON-serializing it. Both the fetch and fixture clients get the same rule.

*Alternatives:* a dedicated upload port — rejected, one route does not justify
a second client and a second fixture. Presigned direct-to-R2 — rejected, it
needs S3-API credentials nothing else here uses and moves the check after the
write.

Makes pass: `grade10-site-store-account-profile-SC-21`, `grade10-site-store-account-profile-SC-22`.

### The avatar and the text fields are two requests, avatar first

`ProfileForm` reports one set of values, but the avatar leaves on the byte
route and the text on `profile.update`. The feature sends the avatar first and
the text second:

- **Avatar refused or failed** — the text is not sent; the form stays open
  with the entered text and the chosen image, and shows why, so one retry
  sends both
- **Avatar accepted, text refused** — the avatar stands; the form shows why
  the text was refused and keeps it for the retry, with the new avatar as its
  current one
- **Both accepted** — the page shows the read view with the returned profile

The text pair is all-or-nothing, since one procedure writes both.

*Alternatives:* one multipart request carrying both — rejected, it puts image
bytes through the mutation every text-only save would carry. Send the text
after a refused avatar — rejected, it leaves the collector with half a save
and a form that has to say which half. Roll the avatar back when the text save
fails — rejected, it deletes an image the collector chose.

Makes pass: `grade10-site-store-account-profile-SC-27`, `grade10-site-store-account-profile-SC-28`, `grade10-site-store-account-profile-SC-30`,
`grade10-site-store-account-profile-SC-32`, `grade10-site-store-account-profile-SC-33`.

### The browser makes the image square; the worker only judges it

Before upload the SPA center-crops to a square and re-encodes at 512×512. The
worker holds the three accepted types and `MAX_AVATAR_BYTES` for any caller.
Whether the feature also judges the picked file before re-encoding it is
decisions Q10; answered (a), the same constant and type list are checked on
the picked file in the feature.

*Alternatives:* an interactive cropper — deferred; center-crop plus
`AvatarImage`'s `object-cover` is square either way. Resize in the worker —
rejected, image decoding in a Worker for no gain.

### A refusal is a typed outcome, and the page words it

The spec asks the page to say why a save was refused: a display name is
required, the 80 or 500 limit, the accepted types, the 5 MB limit. The store
answers expected refusals as outcomes, as `setPhone` and the cart already do,
never as an error message the page would have to parse or show raw.

- **One judge** — `@grade10/store-contracts` holds the limits
  (`PROFILE_DISPLAY_NAME_MAX = 80`, `PROFILE_BIO_MAX = 500`,
  `MAX_AVATAR_BYTES`, the three types) and `profileEditRefusal(input)`, which
  names the first refusal or none. The update procedure calls it; the input
  schema keeps only shape — optional fields, no excess key
- **Outcomes** — `profile.update` answers `{ outcome: "saved", profile }` or
  `{ outcome: "refused", reason }`, with `reason` one of `displayNameRequired`,
  `displayNameTooLong`, `bioTooLong`, `nothingToSave`; the avatar procedure
  answers `{ outcome: "saved", profile }` or `refused` with `avatarType` or
  `avatarTooLarge`
- **Words** — the feature maps each reason to a key in the `profile` namespace
  of `@grade10/i18n`, answered in every locale; it never renders the store's
  text. A failure that is no refusal — network, server, sign-in — is worded by
  the same namespace: `loadFailed` for the read, which ships today, and
  `saveFailed` for a save; the transport's message is never shown
- **Retry** — the failed read gives `ProfileCard`'s error state an action,
  labelled by `common.retry`, that refetches the read

*Alternatives:* judge in the feature before sending — rejected, a second judge
that drifts from the store's. Keep schema refusals and map the tRPC error —
rejected, the page would parse a validation message to choose its words.

Makes pass: `grade10-site-store-account-profile-SC-14`, `grade10-site-store-account-profile-SC-15`, `grade10-site-store-account-profile-SC-18`,
`grade10-site-store-account-profile-SC-21`, `grade10-site-store-account-profile-SC-22`, `grade10-site-store-account-profile-SC-29`,
`grade10-site-store-account-profile-SC-31`, `grade10-site-store-account-profile-SC-32`.

### The application owns validity; the form owns none

`ProfileForm` takes the two length limits as required props and refuses no
submission: the empty-name disable and the 80 and 500 defaults go, and
`ProfileView` passes the limits from `@grade10/store-contracts` and reports
the worded refusal through `error`. Making the limits required lets the compiler name every consumer.
The bio moves from `TextInput` to the design system's `Textarea` (decisions
Q14), and `ProfileDetails` renders it with its line breaks kept. Both fields' `maxLength` and the store's schema count UTF-16 code units,
so the form never accepts a length the store refuses.

Makes pass: `shared-ui-store-profile-SC-18`, `shared-ui-store-profile-SC-19`, `shared-ui-store-profile-SC-23`;
`grade10-site-store-account-profile-SC-14`, `grade10-site-store-account-profile-SC-15`, `grade10-site-store-account-profile-SC-18`.

### The fallback letter is the application's, from one helper

`ProfileDetails` and `ProfileForm` display the fallback content they are
given. The feature derives it from the display name it holds with the design
system's `avatarInitial`, the helper the site header's account menu already
uses, so the menu and the profile follow one rule and the fallback tracks a
name change with no extra state. The helper reads only Latin letters and
digits today, so `陳大文` gives `?`, and reads only the part before an `@`
whenever its input holds one, so the label `@kitlam` gives `?`. Decisions Q17
widens it to the first `\p{L}` or `\p{N}` code point of the value read whole,
and the site header passes the address before the `@`, the one caller that
holds an email; the bid history's pseudonym and the profile's display name are
labels. It upper-cases that code point only where the result stays one
character, so `ß` stays `ß`, and answers `?` for a value with neither, as it
does today.

*Alternatives:* a reading flag on the helper — rejected, one caller holds an
email and slicing it there is one expression.

Makes pass: `grade10-site-store-account-profile-SC-25`, `grade10-site-store-account-profile-SC-26`, `grade10-site-store-account-profile-SC-36`;
`shared-ui-store-profile-SC-09`, `shared-ui-store-profile-SC-10`.

## Risks / Trade-offs

- **The avatar URL is a bearer handle** → its key is the digest of the user
  id and a re-encoded image, and the route answers only while the profile's
  row holds it (decisions Q1).
- **A replaced image outlives its replacement in browsers** → the edge copy is
  purged by tag, but a browser that cached the old address keeps its copy until
  its `max-age` runs out. The requirement is deletion from storage.
- **`StoreProfile` changes shape, and both storefronts plus the store demo
  decode it** → the contract group lands first and the compiler names every
  consumer; `phone` stays on the view.
- **A backfill that under-matches leaves a placeholder visible** → the
  migration matches the exact string the old `ensureAccount` wrote, and the
  read falls back only on NULL, so a miss shows a stale name rather than
  corrupting one.
- **An account name longer than 80 characters** is shown whole as the default,
  and the store refuses it if it is sent back → under decisions Q12 answered
  (b), an untouched default is never sent; answered (a), the collector meets
  the 80-character refusal on their first save.

## Migration Plan

1. Shared components land in grade10-spec and the submodule is bumped in
   grade10 — the components tolerate an absent avatar, so the bump is safe
   before the backend ships.
2. `drizzle:generate` adds `avatar_key`, `first_saved_at` and `storage_cursors`
   in both brands; the running worker ignores them.
3. The `AVATARS` bucket is created for both brands' store workers in every
   environment and bound in each `wrangler.jsonc` before the worker deploys;
   the storage port fails loudly by binding name when it is missing.
4. The store workers, then the SPAs.
5. The placeholder-clearing migration, in each environment once the worker
   from step 4 is live there.

*Rollback:* reverting the worker to one before `5b086132d1` breaks the
profile read for every row with a NULL name; reverting to any later worker is
safe. The added columns are inert for an older worker, and stored avatars are
reclaimed by the sweep only once a worker that runs it is back.

## Open Questions

Decisions Q1, Q5, Q9 to Q12, Q15 and Q16 are held for their owners. Four change this
design. Q1 decides who can open the avatar, which the account-profile delta
does not yet state: answered as recommended, the delta gains a requirement
excepting the image from the owner-only rule, and the serving route above
stands; answered otherwise, the avatar `GET` takes the session and streams the
image on every view, with no edge cache or purge (task 4.9). Q10 answered (a) adds the type and size check on the picked file in
the feature; Q11 answered (b) adds one backfill of `first_saved_at`; Q12
answered (b), as recommended, makes `ProfileView` send the display name only
when it differs from the one shown by default.
