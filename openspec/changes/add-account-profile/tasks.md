# Tasks: Account profile with basic information

Group 1 lands in grade10-spec and is bumped as a submodule in grade10; group 5
is the first grade10 group that needs it. Groups 2, 3, and 4 depend on nothing
in group 1 and can run beside it.

## 1. Shared profile components (grade10-spec)

- [ ] 1.1 Make `An application imports the surface` and `A part is reused alone` pass: `ProfileCard`, `ProfileDetails`, `ProfileForm`, `ProfileCardProps`, `ProfileCardCopy`, `ProfileDetailsProps`, `ProfileDetailsCopy`, `ProfileFormProps`, `ProfileFormCopy`, and `ProfileFormValues` exported from the package entry, and nothing else for this surface. No export is removed.
- [ ] 1.2 Make `Every supplied value is displayed`, `An omitted value is absent, not defaulted`, and `A read-only view offers no edit` pass in `ProfileDetails`, which gains the avatar and the email row.
- [ ] 1.3 Make `No image source`, `An image that fails to load`, and `The image is named by the application` pass by rendering the supplied fallback and accessible name through `Avatar`, `AvatarImage`, and `AvatarFallback` from `@grade10/design-system`.
- [ ] 1.4 Make `A chosen image is previewed and reported`, `A removal is reported`, `An untouched avatar is reported as unchanged`, and `The form judges no file` pass in `ProfileForm` and the three avatar outcomes on `ProfileFormValues`.
- [ ] 1.5 Make `A control has no copy of its own` and `The avatar controls are named by the form's copy` pass, with the choose and remove labels on `ProfileFormCopy` and `ProfileCardCopy`, `ProfileDetailsCopy`, and `ProfileFormCopy` all still exported from the package entry.
- [ ] 1.6 Cover every state above in the block's stories, then run `pnpm run lint` and `pnpm run typecheck` in grade10-spec.
- [ ] 1.7 Make `The ready body is the application's`, `A loading card shows no profile fields`, and `A failed card states what happened` pass — `ProfileCard`'s recorded contract, which it already satisfies; verify rather than rebuild.

## 2. Store contracts and transport (grade10)

- [ ] 2.1 Replace `StoreProfile` in `@grade10/store-contracts` with the view the page reads — display name, bio, avatar URL, email, nullable member-since — and update every consumer the compiler names.
- [ ] 2.2 Teach `StoreApiClient`'s route table to send a `Blob` body untouched with its own content type, in both `FetchStoreApiClient` and the fixture client, leaving the two verbs alone.
- [ ] 2.3 Add the avatar calls to the store client ports and their fixtures, so the frontend feature can be built and tested against fixtures alone.
- [ ] 2.4 Run `pnpm run typecheck` and the contracts lane.

## 3. Profile data migration (grade10)

- [ ] 3.1 Add `avatar_key` to `account_profile`, drop NOT NULL from `display_name`, and stop `ensureAccount` seeding a placeholder name.
- [ ] 3.2 Backfill `display_name` to NULL where it equals the exact string `defaultDisplayName` produced, and prove the migration leaves a chosen name untouched.
- [ ] 3.3 Add a nullable `first_saved_at` to `account_profile`, written by the first successful save and never rewritten, leaving existing rows NULL.
- [ ] 3.4 Run `pnpm run drizzle:generate` and commit the generated SQL.

## 4. Store backend: profile read, avatar upload and serving (grade10)

Depends on the contract in group 2 and the columns in group 3.

- [ ] 4.1 Make `A collector who has never saved sees a profile`, `A read stores nothing`, `Saved values win over session defaults`, `A display name the collector never chose is not shown as theirs`, `Every field is present`, and `The address shown is the one signed in with` pass by composing the read from the row and the session.
- [ ] 4.2 Make `A collector whose session carries no name` pass — the display name falls back to the session name, then to the local part of the session's email address, and never to a generated identifier.
- [ ] 4.3 Make `Member-since is absent before the first save` and `A record another part of the store created dates nothing` pass by reading member-since from `first_saved_at` and never from `created_at`.
- [ ] 4.4 Make `Signed-out request is refused` and `A collector cannot address another collector's profile` pass — the profile resolves from the session and from no input.
- [ ] 4.5 Make `Whitespace is trimmed before saving`, `An empty display name is refused`, `An over-length display name is refused`, `Two collectors may hold the same display name`, `A bio within the limit is saved`, `An over-length bio is refused`, `A bio is cleared`, `A save with no field is refused`, and `An edit carrying an email is refused` pass on the update procedure, writing the display name and bio together or not at all.
- [ ] 4.6 Bind an `AVATARS` R2 bucket per environment in the store worker's `wrangler.jsonc`, behind a storage port that fails by binding name when it is absent, and run `pnpm run cf-typegen`.
- [ ] 4.7 Make `An accepted upload becomes the avatar`, `An unsupported image type is refused`, `An oversized image is refused`, and `A new upload replaces the previous avatar` pass through byte routes that call the procedure, writing the key before the object, deleting the previous object last, and serving the replacement from a different path.
- [ ] 4.8 Make `Removing an avatar restores the initials` pass on the removal route, deleting the stored object, and serve a stored object from its unguessable path with a long immutable cache and no session check.
- [ ] 4.9 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:backend`.

## 5. The account page (grade10)

Depends on group 1 through the submodule, and on groups 2 and 4.

- [ ] 5.1 Bump the `external/grade10-spec` submodule to the commit carrying group 1.
- [ ] 5.2 Make `A collector who never uploaded sees initials` and `Initials follow the display name` pass by deriving the fallback in the profile feature from the display name it holds.
- [ ] 5.3 Add the avatar use cases and repository methods to `features/account/profile`, center-cropping and re-encoding to 512×512 in the browser before upload.
- [ ] 5.4 Make `A save persists and is reflected immediately`, `Cancelling discards edits`, and `A failed save keeps the collector's input` pass in `ProfileView`, sending the avatar outcome first and the text fields second.
- [ ] 5.5 Make `An accepted avatar stands when the text save is refused` pass — each request reports its own outcome, the accepted avatar is not rolled back, and the entered text survives for the retry.
- [ ] 5.6 Make `A failed read is reported` pass, and remove the create-a-profile empty state and its copy from the page — the read now always answers.
- [ ] 5.7 Supply the grade10 copy for the email row and the avatar controls, and check the surface against the store demo's profile use case.
- [ ] 5.8 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 6. Delivery and review

- [ ] 6.1 Create the `AVATARS` bucket in each Cloudflare account and confirm the binding resolves in staging before the worker deploys.
- [ ] 6.2 Verify every scenario in both deltas, then run `openspec validate add-account-profile` and `openspec validate --specs`.
- [ ] 6.3 Review the branch for convention drift and for delta coverage separately: requirements missing, partial, or implemented differently than specified.
- [ ] 6.4 After rollout is confirmed, fold both accepted deltas into grade10-spec's `openspec/specs/`, add the `store-profile` row to `openspec/specs/shared-ui/README.md`, and archive this change.
