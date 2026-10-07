# Tasks: Account profile with basic information

Group 1 lands in grade10-spec and is bumped as a submodule in grade10; group 5
is the first grade10 group that needs it. Groups 2, 3, and 4 depend on nothing
in group 1 and can run beside it.

## 1. Shared profile components (grade10-spec)

Built from the requirements with no frames, as decisions Q5 settles for this
change. Lands only after the person gives the Design Override yes for
`packages/ui/src/blocks/store-profile` and, for 1.10,
`packages/design-system/src/components/display/avatar.tsx` and
`packages/ui/src/blocks/site-chrome/site-header.tsx`.

- [ ] 1.1 Make `shared-ui-store-profile-SC-01` and `shared-ui-store-profile-SC-02` pass: `ProfileCard`, `ProfileDetails`, `ProfileForm`, `ProfileCardProps`, `ProfileCardCopy`, `ProfileDetailsProps`, `ProfileDetailsCopy`, `ProfileFormProps`, `ProfileFormCopy`, and `ProfileFormValues` exported from the package entry, and nothing else for this surface. No export is removed
- [ ] 1.2 Make `shared-ui-store-profile-SC-06`, `shared-ui-store-profile-SC-07`, `shared-ui-store-profile-SC-08` and the read view's half of `shared-ui-store-profile-SC-23` pass in `ProfileDetails`, which gains the avatar and the email row, shows the bio's line breaks as typed, and offers editing only when given both `copy.edit` and `onEdit`, where today `onEdit` alone shows an edit button with no label
- [ ] 1.3 Make `shared-ui-store-profile-SC-09`, `shared-ui-store-profile-SC-10` and `shared-ui-store-profile-SC-11` pass by rendering the supplied fallback and accessible name through `Avatar`, `AvatarImage`, and `AvatarFallback` from `@grade10/design-system`
- [ ] 1.4 Make `shared-ui-store-profile-SC-12`, `shared-ui-store-profile-SC-13`, `shared-ui-store-profile-SC-14`, `shared-ui-store-profile-SC-15`, `shared-ui-store-profile-SC-18` and `shared-ui-store-profile-SC-19` pass, with the form's half of `shared-ui-store-profile-SC-23`, in `ProfileForm` and the three avatar outcomes on `ProfileFormValues`: `displayNameMaxLength` and `bioMaxLength` become required props with no defaults, and the empty-name disable and the input's `required` attribute go, so the application's refusal reaches the collector through `error`; the bio moves from `TextInput` to the design system's `Textarea` (decisions Q14)
- [ ] 1.5 Make `shared-ui-store-profile-SC-16` and `shared-ui-store-profile-SC-17` pass, with the choose and remove labels on `ProfileFormCopy`, and `ProfileCardCopy`, `ProfileDetailsCopy`, and `ProfileFormCopy` all still exported from the package entry
- [ ] 1.6 Verify: every state in `ui-design.md` has a story, then `pnpm run lint`, `pnpm run typecheck` and `pnpm run test:stories:ui` in grade10-spec
- [ ] 1.7 Make `shared-ui-store-profile-SC-03`, `shared-ui-store-profile-SC-04`, `shared-ui-store-profile-SC-05` and `shared-ui-store-profile-SC-22` pass — `ProfileCard`'s recorded contract, which it already satisfies; verify rather than rebuild
- [ ] 1.8 Make `shared-ui-store-profile-SC-20`, `shared-ui-store-profile-SC-21` and `shared-ui-store-profile-SC-24` pass: `ProfileForm` shows the email it is given, read-only, a pending save cannot be sent again, and the cancel reports no values and shows only when given both `copy.cancel` and `onCancel`, where today `onCancel` alone shows a cancel button with no label
- [ ] 1.9 The tests this group's scenarios name, in their own commit before its code, ticked last: stories and a public-exports test under `packages/ui/src/blocks/store-profile/` for `shared-ui-store-profile-SC-01` to `shared-ui-store-profile-SC-24`
- [ ] 1.10 Widen the design system's `avatarInitial` (`packages/design-system/src/components/display/avatar.tsx`) to the first letter or digit in any script of the value read whole, upper-cased, so `陳大文` gives `陳`, `Ångström` gives `Å` and `@kitlam` gives `K` (decisions Q17). The site header's account menu passes the address before the `@`, the one caller holding an email; the bid history and the profile pass labels. Its stories gain those names and `🃏🃏`, which stays `?`, for `grade10-site-store-account-profile-SC-36`
- [ ] 1.11 In `@grade10/i18n`'s `profile` namespace, add the avatar's choose and remove labels, its accessible name, and one key per refusal reason — `displayNameRequired`, `displayNameTooLong`, `bioTooLong`, `nothingToSave`, `avatarType`, `avatarTooLarge` — and `saveFailed` for a save that fails, answered in every locale both brands speak, then `pnpm run test` in grade10-spec

## 2. Store contracts and transport (grade10)

- [ ] 2.1 Replace `StoreProfile` in `@grade10/store-contracts` with the view the page reads — display name, bio, avatar URL, email, nullable member-since, and `phone` unchanged — and update every consumer the compiler names
- [ ] 2.2 Teach `StoreApiClient`'s route table to send a `Blob` body untouched with its own content type, in both `FetchStoreApiClient` and the fixture client, leaving the two verbs alone
- [ ] 2.3 Add the avatar calls to the store client ports and their fixtures, so the frontend feature can be built and tested against fixtures alone
- [ ] 2.4 Verify: `pnpm run typecheck` and the contracts lane
- [ ] 2.5 The contract tests for the view's decoding and the `Blob` body, in their own commit before the code, ticked last
- [ ] 2.6 Add `PROFILE_DISPLAY_NAME_MAX` (80), `PROFILE_BIO_MAX` (500), `MAX_AVATAR_BYTES` (`5 * 1024 * 1024`), the three accepted avatar types and `profileEditRefusal` to `@grade10/store-contracts`, with the `saved` and `refused` outcomes of `profile.update` and the avatar procedure, read by the worker and by the feature

## 3. Profile data migration (grade10) (owner: @ecchochan)

- [x] 3.1 Drop NOT NULL from `display_name` and stop `ensureAccount` seeding a placeholder name, so a name nobody chose is stored as NULL
- [ ] 3.2 Make `grade10-site-store-account-profile-SC-06`, `grade10-site-store-membership-SC-90` and `grade10-site-store-wallet-member-card-SC-60` pass for old rows: clear the placeholder in its own migration in both brands, `UPDATE store.account_profile SET display_name = NULL WHERE display_name = 'Member ' || left(user_id, 8)`, leaving a chosen name untouched. It runs in an environment only once the worker that reads a NULL name is live there; Migrate applies every pending file at once, so the file is not pending before that deploy
- [ ] 3.3 In both brands, add nullable `avatar_key` and `first_saved_at` to `account_profile`, and the `storage_cursors` table from `@grade10/object-store/schema`; existing rows keep `first_saved_at` NULL
- [ ] 3.4 Verify: `pnpm run drizzle:generate` for both brands, with the generated SQL committed
- [ ] 3.5 The tests this group's scenarios name, in their own commit before its code, ticked last: a migration test proving the clear leaves a chosen name, for `grade10-site-store-account-profile-SC-06`, `grade10-site-store-membership-SC-90` and `grade10-site-store-wallet-member-card-SC-60`

## 4. Store backend: profile read, avatar upload and serving (grade10) (owner: @ecchochan)

Depends on the contract in group 2 and the columns in group 3.

- [x] 4.1 Make `grade10-site-store-account-profile-SC-03`, `grade10-site-store-account-profile-SC-04`, `grade10-site-store-account-profile-SC-05` and `grade10-site-store-account-profile-SC-07` pass by composing the read from the row and the session, so `profile.get` never returns null
- [x] 4.2 Make `grade10-site-store-account-profile-SC-04` pass: fill a display name the collector never wrote from the session on `profile.get` and `profile.update` — the session name, else the part of the session's email before the `@`, never a generated identifier
- [ ] 4.3 Make `grade10-site-store-membership-SC-78`, `grade10-site-store-membership-SC-87`, `grade10-site-store-membership-SC-88`, `grade10-site-store-membership-SC-89`, `grade10-site-store-membership-SC-90`, `grade10-site-store-wallet-member-card-SC-13`, `grade10-site-store-wallet-member-card-SC-18`, `grade10-site-store-wallet-member-card-SC-59` and `grade10-site-store-wallet-member-card-SC-60` pass: every member name resolves through `memberName` — the shop name, else the account name, else the part of the email before the `@` — for the profile, the POS directory's `displayNames`, the customer-details badge and the wallet sweep, with a required `name` on auth's `AccountIdentity`, looked up in one uncached batch only for members with no shop name. Built in `ea91833d32`; this task cites the ids in its tests
- [ ] 4.4 Make `grade10-site-store-account-profile-SC-08`, `grade10-site-store-account-profile-SC-09`, `grade10-site-store-account-profile-SC-10` and `grade10-site-store-account-profile-SC-40` pass by reading member-since from `first_saved_at` and never from `created_at`; a row saved before the column existed stays NULL until its next save, with no backfill (decisions Q11)
- [ ] 4.5 Make `grade10-site-store-account-profile-SC-01` and `grade10-site-store-account-profile-SC-02` pass — the profile resolves from the session and from no input
- [ ] 4.6 Make `grade10-site-store-account-profile-SC-12`, `grade10-site-store-account-profile-SC-13`, `grade10-site-store-account-profile-SC-14`, `grade10-site-store-account-profile-SC-15`, `grade10-site-store-account-profile-SC-16`, `grade10-site-store-account-profile-SC-17`, `grade10-site-store-account-profile-SC-18`, `grade10-site-store-account-profile-SC-19` and `grade10-site-store-account-profile-SC-29` pass on the update procedure, whose input refuses an excess key, writing the display name and bio together or not at all
- [ ] 4.7 Bind an `AVATARS` R2 bucket per environment in both brands' store `wrangler.jsonc` through `createR2ObjectStorePort` from `@grade10/object-store`, which fails by binding name when it is absent, register the `avatars` storage area, and run `pnpm run cf-typegen`
- [ ] 4.8 Make `grade10-site-store-account-profile-SC-20`, `grade10-site-store-account-profile-SC-21`, `grade10-site-store-account-profile-SC-22` and `grade10-site-store-account-profile-SC-23` pass through byte routes that call the procedure: refuse a declared length over `MAX_AVATAR_BYTES` before reading the body and measure the cap on what arrived, check the type, put the object under `contentKey("avatars", digest, ext)`, where `digest` is the SHA-256 of the user id followed by the bytes, so each profile owns its object, then set `avatar_key` and `COALESCE(first_saved_at, now())` in one statement
- [ ] 4.9 Make `grade10-site-store-account-profile-SC-24`, `grade10-site-store-account-profile-SC-38` and `grade10-site-store-account-profile-SC-44` pass: the removal route clears `avatar_key`; the store cron runs `deleteOrphanedObjects` over the `avatars` area, whose `referenced` is the key its profile's row still holds; the avatar `GET` answers 404 for a key no row holds. it needs no session and publishes through `edgeCache()` with `cacheTag("avatar", key)`, purged in `waitUntil` on replace and remove (decisions Q1)
- [ ] 4.10 Verify: `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`
- [ ] 4.11 Make `grade10-site-store-account-profile-SC-08` and `grade10-site-store-account-profile-SC-11` pass: the read carries the session's email and the avatar URL beside the name, bio, member-since and phone
- [ ] 4.12 Make `grade10-site-store-wallet-member-card-SC-56` and `grade10-site-store-wallet-member-card-SC-57` pass — the profile save's wallet kick and the daily floor already carry them; verify rather than rebuild
- [ ] 4.13 Add the row for the avatar a member chose for the shop — store schema and the `AVATARS` bucket — to the Examples table of `docs/architecture/account-data.md`
- [ ] 4.14 The tests this group's scenarios name, in their own commit before its code, ticked last: the backend lane for every id 4.1 to 4.17 names
- [ ] 4.15 Write `first_saved_at` as `COALESCE(first_saved_at, now())` in `profile.update`, and in nothing else but the avatar routes — not `ensureAccount`, `setPhone` or joining — so `grade10-site-store-account-profile-SC-09`, `grade10-site-store-account-profile-SC-10`, `grade10-site-store-account-profile-SC-35` and `grade10-site-store-account-profile-SC-37` hold for a row a counter or a webhook wrote, for an avatar saved on its own, and for a save that repeats the stored values
- [ ] 4.16 Make `grade10-site-store-account-profile-SC-14`, `grade10-site-store-account-profile-SC-15`, `grade10-site-store-account-profile-SC-18`, `grade10-site-store-account-profile-SC-21`, `grade10-site-store-account-profile-SC-22` and `grade10-site-store-account-profile-SC-29` answer typed refusals: `profile.update` judges with `profileEditRefusal` and answers `refused` with its reason, the input schema keeps only shape, and the avatar route answers `avatarType` or `avatarTooLarge`, the length refused before the body is read included
- [ ] 4.17 Make `grade10-site-store-wallet-member-card-SC-39` and `grade10-site-store-wallet-member-card-SC-58` hold per member: the wallet's facts reader takes shop names from the store before asking auth for the rest, an auth failure fails only the rows it could not name, keeping each one's rung and recording why, and the lap refreshes every other member, so a pass with a shop name never waits on another member; `displayNames` keeps throwing for adding a pass and the till

## 5. The account page (grade10)

Depends on group 1 through the submodule, and on groups 2 and 4.

- [ ] 5.1 Bump the `external/grade10-spec` submodule to the commit carrying group 1
- [ ] 5.2 Make `grade10-site-store-account-profile-SC-25`, `grade10-site-store-account-profile-SC-26`, `grade10-site-store-account-profile-SC-36` and `grade10-site-store-account-profile-SC-42` pass by deriving the fallback in the profile feature from the display name it holds, with the design system's `avatarInitial`, never from the account's own picture (decisions Q16)
- [ ] 5.3 Make `grade10-site-store-account-profile-SC-41` and `grade10-site-store-account-profile-SC-43` pass: add the avatar use cases and repository methods to `features/account/profile`, center-cropping and re-encoding to 512×512 in the browser before upload, so any image the browser decodes is sent whatever its type or size; a file it cannot decode is refused as `avatarType` before anything is sent, and the feature judges the picked file by nothing else (decisions Q10)
- [ ] 5.4 Make `grade10-site-store-account-profile-SC-14`, `grade10-site-store-account-profile-SC-15`, `grade10-site-store-account-profile-SC-18`, `grade10-site-store-account-profile-SC-27`, `grade10-site-store-account-profile-SC-28` and `grade10-site-store-account-profile-SC-32` pass in `ProfileView`, passing the two limits from `@grade10/store-contracts` to the form, wording each refusal reason, and a failed save as `saveFailed`, from the `profile` catalog through `error`, never the store's text, and sending the avatar outcome first and the text fields second
- [ ] 5.5 Make `grade10-site-store-account-profile-SC-30` and `grade10-site-store-account-profile-SC-33` pass — each request reports its own outcome; an accepted avatar is not rolled back and the entered text survives for the retry; a refused avatar sends no text and keeps both the text and the chosen image
- [ ] 5.6 Make `grade10-site-store-account-profile-SC-31` pass: the failed read says `loadFailed`, never the transport's message, and gives `ProfileCard`'s error state a `common.retry` action that refetches the read. The create-a-profile empty state and its copy are already gone
- [ ] 5.7 Read the avatar's choose and remove labels, its accessible name and the refusal words from the `profile` catalog that 1.11 adds, and check the surface against the store demo's profile use case
- [ ] 5.8 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`
- [ ] 5.9 Make `grade10-site-store-account-profile-SC-03`, `grade10-site-store-account-profile-SC-11` and `grade10-site-store-account-profile-SC-19` pass on the page: `ProfileView` reads the email from the view and shows it in the read view and the form, both brands' `ProfilePage` stop passing it, and an empty bio shows the line that says what it is for
- [ ] 5.10 The tests this group's scenarios name, in their own commit before its code, ticked last: the frontend lane for every id 5.2 to 5.12 names
- [ ] 5.11 Make `grade10-site-store-account-profile-SC-34` pass in both brands — the `profile` surface asks a signed-out visitor to sign in and shows their own profile after; grade10 already declares `signedOut: "ask"`, so verify rather than rebuild
- [ ] 5.12 Make `grade10-site-store-account-profile-SC-39` pass: `ProfileView` sends the display name only when it differs from the one shown by default, so a save that leaves the default as shown stores no name (decisions Q12)

## 6. Delivery and review (grade10)

The `profile` gate stays shut in this change; it opens by its own reviewed line once this change ships, as Carried Surfaces records.

- [ ] 6.1 Create the `AVATARS` bucket for both brands' store workers in each Cloudflare account, and confirm the binding resolves in staging before the workers deploy
- [ ] 6.2 Verify every scenario in the four deltas, then run `openspec validate add-account-profile` and `openspec validate --specs`
- [ ] 6.3 Review the branch for convention drift and for delta coverage separately: requirements missing, partial, or implemented differently than specified
- [ ] 6.4 In grade10-spec, add the `ui/store-profile` row to `openspec/specs/shared/README.md`, and to `openspec/specs/grade10-site/README.md` the `store/account-profile` row with the store rows its table lacks - `account-identity`, `checkout`, `discounts`, `membership`, `site-discounts` and `wallet-member-card` - then archive this change; acceptance already published the deltas, so there is no fold

## 7. The walk (grade10)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review add-account-profile`), and `/tcs-run-sheet` executes manual cases when needed.

- [ ] 7.1 One walk per journey, end to end through the account page, the till and the wallet pass, kept as the change's end-to-end suite: `grade10-site-store-account-profile-US-01` to `grade10-site-store-account-profile-US-05`, `grade10-site-store-membership-US-02`, `grade10-site-store-wallet-member-card-US-06`
- [ ] 7.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>`, a walk in grade10 named `grade10:<path>`, in the walks' own commit; the ones that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 7.3 Verify: the walks pass against staging, and `pnpm run tcs:validate` in grade10-spec
