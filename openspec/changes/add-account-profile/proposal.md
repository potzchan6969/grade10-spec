# Account profile with basic information

**Author:** @seankcw - 2026-08-18

## Why

A collector's account page shows a display name and a bio, and little else.
There is no avatar, because there is nowhere to put one. Member-since shows the
date the store first wrote a record for the account, which can come from a
webhook the collector never triggered. The till and the wallet pass name the
member by a rule the profile page states nowhere.

Nothing about the profile is written down either. The behaviour that ships —
the field limits, the defaults a collector who never saved sees, the save and
cancel states, and the `store-profile` block's exports — exists only in code,
so an engineer changing it has no contract to check against. Grade10 and ZZZ
both render this page.

**Metric:** share of signed-in collectors who save a display name and set an
avatar within 7 days of first sign-in.

## What Changes

- **One name everywhere.** The profile, the till and the wallet pass show one
  name: the name the member chose for the shop, else their account name, else
  the part of their email before the `@`. While the account service cannot be
  reached, a member with no name chosen for the shop shows as 會員 at the till,
  and their pass stays as it was.
- **Avatars.** A collector uploads an image, cropped square, and can remove it
  again; with none set, the profile shows the display name's first letter. The
  page takes any image the browser can read and sends it square at 512 px.
- **Email is shown, read-only,** in the read view and in the form alike.
- **Member-since is the first save.** The page shows the date the collector
  first saved their profile, and nothing before that.
- **A name nobody chose is no name.** The store holds no display name until the
  collector saves one, and the placeholder older records carry is cleared.
- **The shipped behaviour becomes a requirement.** Display name and bio, their
  limits and trimming, the defaults a collector who never saved sees, the save
  and cancel states, the card's loading and failed states, and what a
  signed-out or failed read does are recorded as scenarios.

Breaking changes, each named to the consumers it moves; every stored field
keeps its name, type and limits, the mobile number included:

- **`StoreProfile`** becomes the view the page reads — both brands' storefronts
  and the store demo decode it
- **`profile.update`** answers `saved` carrying the profile, or `refused`
  with its reason — the profile feature in `@grade10/store-frontend`
- **`ProfileView`** loses its `email` prop — both brands' `ProfilePage`
- **`ProfileFormProps`** makes its two length limits required — every
  `ProfileForm` consumer, which the compiler names
- **`avatarInitial`** reads a label whole, for its first letter or digit in
  any script — the account menu in `SiteHeader` passes the address before the
  `@`, and the bid history in `ListingBidHistoryList` changes with it
  (decisions Q17)

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities
- `grade10-site/store/account-profile`: what a signed-in collector's account
  profile holds in both brands' stores, how it is read and edited, and how the
  avatar is set and removed.
- `shared/ui/store-profile`: the profile components `@grade10/ui` exports and
  what each one is responsible for. The block ships today with no spec; this
  change alters its exports, so the contract is written down here.

### Modified Capabilities

- `grade10-site/store/wallet-member-card`: a pass shows the member's name by
  the store's one rule, a refresh that cannot reach the account service for a
  member with no name chosen for the shop leaves the pass as it was, a profile save is a fourth way a pass falls due, and a new name reaches
  the pass within the daily floor.
- `grade10-site/store/membership`: the till shows the member's name by the
  same rule, and 會員 for a member with no name chosen for the shop while the
  account service cannot be reached.

## Impact

- **grade10 SPA** — the `/profile` page and the profile feature it renders gain
  the avatar and the email from the profile read.
- **ZZZ SPA** — its `/profile` renders the same feature and gains the same
  fields; its `ProfilePage` stops passing the email.
- **Store service, both brands** — the profile read carries the email and the
  avatar's address. Avatar upload, storage, and serving are new, with a bucket
  bound to each brand's store worker; the auction service's lot-image handling
  is the precedent. The migrations land in both brands' store workers.
- **Shared UI (`@grade10/ui`)** — the `store-profile` block changes:
  `ProfileDetails` gains the avatar and email, `ProfileForm` gains the avatar
  control, the read-only email, required length limits and the two labels
  naming the avatar controls in `ProfileFormCopy`, and `ProfileFormValues`
  gains the avatar. No export is removed; `ProfileCard`, which ships today
  unspecified, has its contract recorded unchanged. This is work in the
  grade10-spec repository, and it lands before the grade10 side can consume
  it.
- **Design system** — no new component, variant, or token. `Avatar`,
  `AvatarImage`, `AvatarFallback` and `Textarea` already ship from
  `@grade10/design-system`. `avatarInitial` widens to any script and reads a
  label whole, which moves the account menu (`packages/ui/src/blocks/site-chrome/site-header.tsx`) and
  the bid history
  (`packages/ui/src/blocks/auction-listing/listing-bid-history-list.tsx`).
- **Figma** — the `store-profile` block has no published frames and no
  `.figma.ts` mappings, unlike `store-product-listing`; it is built from the
  requirements, and draw-account-menu-and-profile asks the designer to confirm
  or redraw it (decisions Q5).
- **Auth service** — its account lookups return the account name, so the till
  and the wallet sweep can name a member with no session. It deploys before
  the store.
- **Admin panels** — unaffected.

## References

- [Profile · Fields](../../../docs/prds/products/grade10-site/account/profile.md#fields)
- [Profile · Before the First Save](../../../docs/prds/products/grade10-site/account/profile.md#before-the-first-save)
- [Profile · Editing](../../../docs/prds/products/grade10-site/account/profile.md#editing)
- [Profile · Failures](../../../docs/prds/products/grade10-site/account/profile.md#failures)
- [Profile · Address](../../../docs/prds/products/grade10-site/account/profile.md#address)
- [Profile · Designs](../../../docs/prds/products/grade10-site/account/profile.md#designs)
- [Profile Blocks · Blocks](../../../docs/prds/products/shared/ui/store-profile.md#blocks)
- [Profile Blocks · Left to the Application](../../../docs/prds/products/shared/ui/store-profile.md#left-to-the-application)
- [Profile (loyalty) · Behind the Account](../../../docs/prds/products/grade10-site/loyalty/profile.md#behind-the-account)
- [Member Card in a Wallet · On the Pass](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#on-the-pass)
- [Member Card in a Wallet · Staying Current](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#staying-current)
- [Shopify Integration · Member Name](../../../docs/prds/products/grade10-site/loyalty/shopify-integration.md#member-name)
- [Account Data · Ownership](../../../docs/prds/platform/account-data.md#ownership)
- [Account Data · Examples (store)](../../../docs/prds/platform/account-data.md#examples-store)
