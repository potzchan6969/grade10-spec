# Account profile with basic information

**Author:** @seankcw - 2026-08-18

## Why

A collector who signs in to Grade10 has no identity in the product. The account
page asks them to create a profile before it shows them anything: the store
worker only materializes a profile row when someone writes to it, so a first
visit reads null and renders "You have no profile yet." The collector is asked
to fill a blank form for a page only they can see, and almost nobody does — the
store holds a display name and a bio for a small fraction of signed-in users,
and no avatar at all, because there is nowhere to put one.

That empty account page is also the reason none of this is measurable today: a
profile that is absent and a profile that is deliberately left sparse look
identical in the data.

Nothing about the profile is written down either. `openspec/specs/` now carries
four `grade10-store` capabilities and seven under `shared-ui`, and the profile
is in neither: the behavior that already ships — the field limits, the null
read, the create/edit states, and the `store-profile` block's exports — exists
only in code. An engineer changing it has no contract to check against.

**Metric:** share of signed-in collectors whose profile is complete (display
name and avatar both set) within 7 days of first sign-in.

## What Changes

- **The account page is never empty.** A read with no stored row returns a
  profile defaulted from the signed-in session — display name from the auth
  name, an initials avatar — so the collector arrives at something to adjust
  rather than something to create. Reads still write nothing: the row appears
  the first time the collector saves.
- **A nameless session still gets a name.** Signing in by emailed link or code
  collects no name, so the session often carries none. The display name then
  defaults to the part of the signed-in address before the `@` — never a
  generated identifier, which is what the current placeholder is and what
  collectors were being shown as themselves.
- **Avatars.** A collector uploads a JPEG, PNG, or WebP up to 5 MB, cropped
  square, and can remove it again; with none set, the profile shows initials
  derived from the display name.
- **Email is shown, read-only.** The address the collector signed in with
  appears on the page. It is not editable here.
- **Member-since is the first save.** The page shows the date the collector
  first saved their profile, and shows nothing before that — not the date some
  other part of the store happened to create their record.
- **The shipped behavior becomes a requirement.** Display name and bio, their
  limits and trimming, the save and cancel states, the card's loading and
  failed states, and what a signed-out or failed read does are recorded as
  scenarios rather than left in code.

No breaking changes: every field that exists today keeps its name, type, and
limits.

## Non-Goals

- **A public collector profile.** Profiles stay visible to their owner only.
  Sharing one — a public URL, seller identity on a listing or a lot, follower
  counts — is a separate change with its own visibility, SEO, and
  discoverability decisions.
- **Avatar moderation.** With owner-only visibility the only person who sees an
  avatar is the person who uploaded it, so nothing reviews or takes down an
  image in this change. Public profiles cannot ship without it; that change
  owns the requirement.
- **Changing the email address.** That is an auth capability with its own
  verification and account-recovery requirements.
- **Display-name uniqueness.** A display name is a label on a private page, not
  a handle; two collectors may hold the same one.
- **Secret avatar URLs.** The image is served from an unguessable address that
  needs no session, so it is cacheable and survives into public profiles
  unchanged. Anyone who obtains the URL keeps a working link until the avatar
  is replaced or removed — and, because the address is cached and nothing
  purges it, for as long after that as a cached copy lives.
- **Collector identity beyond the basics** — location, social links, collection
  showcases, badges.
- **ZZZ.** `zzz` has no account surface and gains none here.

## Capabilities

### New Capabilities
- `grade10-store/account-profile`: what a signed-in collector's account profile
  holds, how it is read and edited, and how the avatar is set and removed.
- `shared-ui/store-profile`: the profile components `@grade10/ui` exports and
  what each one is responsible for. The block ships today with no spec; this
  change alters its exports, so the contract is written down here.

### Modified Capabilities

None. No existing capability's requirements change.

## Impact

- **grade10 SPA** — the `/profile` page and the profile feature it renders gain
  the avatar and email fields, and lose the empty state.
- **Store service** — the profile read composes session values into its
  response instead of returning null; the write path is unchanged. Avatar
  upload, storage, and serving are new; the auction service's lot-image
  handling is the precedent in that repository.
- **Shared UI (`@grade10/ui`)** — the `store-profile` block changes:
  `ProfileDetails` gains the avatar and email, `ProfileForm` gains the avatar
  control and the two labels naming it in `ProfileFormCopy`, and
  `ProfileFormValues` gains the avatar. No export is removed; `ProfileCard`,
  which ships today unspecified, has its contract recorded unchanged. This is
  work in the grade10-spec repository, and it lands before the grade10 side can
  consume it.
- **Design system** — no new component, variant, or token. `Avatar`,
  `AvatarImage`, and `AvatarFallback` already ship from
  `@grade10/design-system`.
- **Figma** — the `store-profile` block has no published frames and no
  `.figma.ts` mappings, unlike `store-product-listing`. It stays that way here:
  the components are built from the requirements below.
- **Auth service** — read-only consumer of the session's name and email. No
  change.
- **Admin panels** — unaffected.
