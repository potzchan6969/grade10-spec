# Design: Account profile with basic information

Capability deltas:
[`grade10-site/store/account-profile`](specs/grade10-site/store/account-profile/spec.md),
[`shared/ui/store-profile`](specs/shared/ui/store-profile/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

The profile ships today across three places. `@grade10/ui` exports the
`store-profile` block (`ProfileCard`, `ProfileDetails`, `ProfileForm`), the
grade10 SPA's `/profile` page supplies its copy, and the store worker owns the
data: `account_profile` (`user_id`, `display_name`, `bio`, timestamps) behind
`profile.get` and `profile.update`.

Three existing constraints shape everything below.

- **A read creates nothing** (`docs/prds/platform/account-data.md` rule 7). The
  row appears when a *writer* calls `ensureAccount`, which is session-free by
  contract — it runs from webhooks and tasks — so it seeds
  `display_name` with `Member <first 8 of user id>`. A collector can therefore
  already have a row carrying a name they never chose.
- **The transport port has two verbs.** `StoreApiClient` is `get`/`post` and
  JSON-serializes every body; `StoreProcedureClient` addresses tRPC procedures
  by name. Neither can carry image bytes today.
- **The store worker has no object storage.** The auction worker is the
  precedent: R2 buckets bound per environment, a storage port, and byte routes
  that go through a tRPC caller so authorization and audit are not
  reimplemented per route.

## Goals / Non-Goals

Design-level only; the proposal owns product scope.

- **Goal:** one source for what the account page shows, so a second consumer
  of `StoreProfile` inherits it rather than composing session values again.
  None exists today — `zzz` has no account surface and the admin panels are
  untouched, per the proposal — which is the point: the merge is settled before
  there is a second place to get it wrong.
- **Goal:** the smallest transport change that carries bytes — not a second
  HTTP client.
- **Non-goal:** image transformation, thumbnails, or a CDN product. One stored
  object per collector.
- **Non-goal:** an interactive cropper.
- **Non-goal:** Figma frames for this surface. `ui-design.md` records the states and
  the components, and names the frames as absent; the layout is built from the
  requirements.

## Decisions

### The backend composes the profile the page shows

`profile.get` stops returning null. It returns a view — display name, bio,
avatar URL, email, member-since — composed from the row and the session:
display name falls back to the session name and, when the session carries none,
to the local part of its email address; member-since is null before the first
save. `profile.update` returns the same view. The row shape stays internal to
the worker; `StoreProfile` in `@grade10/store-contracts` becomes that view.

The email fallback is not a nicety. Sign-in by emailed link or code collects no
name (`shared/auth/sign-in`), so a large share of sessions carry none — which
is why `ensureAccount` seeded `Member <first 8 of user id>` in the first place.
Falling back to the session name alone would replace a generated identifier
with an empty page heading and an empty initials circle.

*Alternatives:* compose in the frontend feature — rejected, the session's name
and email live behind the auth service and every consumer would repeat the
merge. Create the row on read — rejected, it breaks account-data rule 7 and
materializes an account from traffic alone. For the nameless session: a
generated identifier — rejected, that is the placeholder this change removes;
an empty heading — rejected, it fails `The profile page is never empty` in
substance while passing it in form.

Makes pass: `A collector who has never saved sees a profile`, `A collector
whose session carries no name`, `A read stores nothing`, `Saved values win over
session defaults`, `The address shown is the one signed in with`.

### `display_name` becomes nullable, and the placeholder is backfilled away

A name the collector never chose has to be distinguishable from one they did.
`account_profile.display_name` drops its NOT NULL, `ensureAccount` inserts no
name, and the read falls back to the session. The migration backfills existing
rows to NULL where the value equals `Member <first 8 of user id>` — the exact
string `defaultDisplayName` produced.

*Alternatives:* a `display_name_set` boolean — rejected, a second source of
truth for a fact the column already carries. Compare the placeholder pattern at
read time — rejected, it makes a collector who genuinely typed that string
invisible to themselves, and the comparison would live forever.

Makes pass: `A display name the collector never chose is not shown as theirs`.

### Member-since is a timestamp the first save writes

`account_profile.created_at` records when the row appeared, and a row can
appear from a webhook the collector never triggered, so it cannot answer "member
since". A nullable `first_saved_at` is set by the first `profile.update` that
succeeds and never rewritten; the view reads it, and null means the page shows
no date.

*Alternatives:* read `created_at` — rejected, it dates the store's bookkeeping
rather than the collector, and it contradicts `Member-since is absent before the
first save`. Infer the first save from `display_name IS NOT NULL` — rejected,
it is true from the first save but carries no date, so the page would know that
they joined and not when.

Makes pass: `Member-since is absent before the first save`, `A record another
part of the store created dates nothing`, `Every field is present`.

### Avatars are R2 objects served from an unguessable public path

A new `AVATARS` bucket on the store worker, keyed
`avatars/<user id>/<random>.<ext>`; `account_profile.avatar_key` holds the key,
never a URL, and the API derives the path — the auction's `lotImagePath` is the
precedent. The route serves the bytes with a long immutable cache and no
session check. An upload writes a new key and deletes the old, so the URL
changes with the image and no cache needs purging.

*Alternatives:* authenticated streaming per render, like the auction's proof
documents — rejected under Q15: every avatar render becomes a worker
invocation no CDN can absorb, and it would be dismantled the day public
collector profiles ship. Cloudflare Images — rejected, a new paid dependency
for one square image. Bytes in Postgres — rejected outright.

*Consequence, recorded in the proposal's Non-Goals:* the URL is a bearer
handle. Anyone holding it keeps a working link until the avatar is replaced.

### Byte routes go through a tRPC caller, and the transport learns one body type

`POST /api/profile/avatar` (image bytes as the body) and
`POST /api/profile/avatar/remove` are Hono routes that build a tRPC caller and
invoke a procedure, so the session check, the refusal vocabulary, and the audit
entry are the ones every other store mutation uses. Type and size are checked
in the procedure — that is where the refusal scenarios are checkable.

On the frontend, `StoreApiClient` keeps its two verbs; the route table learns
to pass a `Blob` body through untouched with its own content type instead of
JSON-serializing it. Both the fetch and fixture clients get the same rule.

*Alternatives:* a dedicated upload port — rejected, one route does not justify
a second client and a second fixture. Presigned direct-to-R2 — rejected, it
needs S3-API credentials nothing else here uses and moves validation after the
write. `PUT`/`DELETE` verbs like the auction's admin routes — rejected, those
sit outside this port; widening it for one feature costs more than two POSTs.

Makes pass: `An accepted upload becomes the avatar`, `An unsupported image type
is refused`, `An oversized image is refused`, `A new upload replaces the
previous avatar`, `Removing an avatar restores the initials`.

### The avatar and the text fields are two requests, and the page says so

`ProfileForm` reports one set of values, but the avatar leaves on the byte
route and the text on `profile.update`. The feature sends the avatar first and
the text second, and reports each outcome on its own: an accepted avatar stands
even when the text save is refused, and the form keeps the entered text for the
retry. The text pair is still all-or-nothing — one procedure writes both.

*Alternatives:* one multipart request carrying both — rejected, it puts image
bytes through the mutation path every text-only save would then also carry, and
the transport change in the previous decision exists precisely to avoid a second
body format on `profile.update`. Roll the avatar back when the text save fails
— rejected, it deletes an image the collector successfully chose to make a
failed text edit look atomic.

Makes pass: `An accepted avatar stands when the text save is refused`, `A save
persists and is reflected immediately`, `A failed save keeps the collector's
input`.

### The browser normalizes the image; the worker only judges it

Before upload the SPA center-crops to a square and re-encodes at 512×512. The
worker still enforces the three accepted types and the 5 MB ceiling — a
non-browser caller reaches the same route.

*Alternatives:* an interactive cropper — deferred; center-crop plus
`AvatarImage`'s existing `object-cover` is square either way, and the cropper
is UI with no requirement behind it. Server-side resize — rejected, image
decoding in a Worker for no gain.

### Initials are the application's to compute

`ProfileDetails` and `ProfileForm` display fallback content they are given.
The feature derives initials from the display name it already holds, so the
components stay copy-free and the fallback tracks a name change for free.

Makes pass: `A collector who never uploaded sees initials`, `Initials follow
the display name`, `No image source`, `An image that fails to load`.

## Risks / Trade-offs

- **The avatar URL is a bearer handle** → an unguessable key, and replacement
  invalidates the old URL by changing it. Accepted under Q15.
- **A replaced image outlives its replacement in caches** → the object is
  deleted from R2 immediately, but the route serves it immutable and nothing
  purges, so a cached copy answers the old address until its TTL expires. The
  requirement is written as deletion from storage, and the proposal's Non-Goals
  record the cached window. Shortening the TTL is the lever if that window ever
  matters.
- **`StoreProfile` changes shape, and both storefronts plus the store demo
  decode it** → the contract group lands first and the compiler names every
  consumer; nothing decodes the row shape after it.
- **An upload that succeeds in R2 and then fails to record its key leaves an
  orphan object** → the row is written first and the object second under a key
  the row already names, so a failed write leaves nothing referenced; the
  previous object is deleted only after the new key is recorded.
- **A backfill that under-matches leaves a placeholder visible** → the
  migration matches the exact string `defaultDisplayName` produced, and the
  read falls back only on NULL, so a miss shows a stale name rather than
  corrupting one.
- **Bio is a single-line input** — the design system publishes no textarea, so
  500 characters are edited in one line. Not this change's to fix; flagged
  because the field limit is now specified.

## Migration Plan

1. Shared components land in grade10-spec and the submodule is bumped in
   grade10 — the components tolerate an absent avatar and email, so the bump is
   safe before the backend ships.
2. `drizzle:generate` produces the migration: `avatar_key` and
   `first_saved_at` added, `display_name` nullable, placeholder backfilled to
   NULL. Additive and backward-compatible — the current worker ignores both new
   columns, and it never reads a NULL name because it only reads rows it wrote.
   Existing rows carry a NULL `first_saved_at`: a collector who saved before
   this ships shows no member-since date until their next save. The alternative
   — backfilling from `created_at` — would date them by the bookkeeping this
   decision rejects.
3. The `AVATARS` bucket is created per environment and bound in
   `wrangler.jsonc` before the worker deploys; the storage port fails loudly by
   binding name when it is missing.
4. Worker, then SPA.

*Rollback:* revert the worker; the added column and the NULL names are inert
for the previous version, which reads `display_name` only for rows it wrote
itself. Stored objects are orphaned, not broken.

## Open Questions

None. The avatar's serving model, the display-name placeholder, and the
`ui-design.md` decision were settled before this document.
