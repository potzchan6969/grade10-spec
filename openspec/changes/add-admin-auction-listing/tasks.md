## 1. Share listing lifecycle and media contracts (grade10)

- [ ] 1.1 Make the admin/public contract scenarios for draft, created, and published listings pass: publish the nullable authoring shape, `created` status, slug/public address, publish-at value, and ordered image-or-video media codecs.
- [ ] 1.2 Make the admin procedure-client and fixture scenarios for draft save, create, editable updates, publication, cancellation, and gallery mutation pass, decoding every expanded procedure through the contract.
- [ ] 1.3 Verify the contracts and admin frontend packages with `pnpm run typecheck`, `pnpm run lint`, and their focused test scripts.

## 2. Migrate the auction listing and gallery model (grade10)

- [ ] 2.1 Make the existing-listing migration scenario pass: expand the listing row for the draft/created lifecycle, slug, scheduled publication, and nullable draft fields while backfilling complete live rows without breaking their auction identities.
- [ ] 2.2 Make the gallery migration scenario pass: replace physical-side image rows with ordered media rows, preserve each existing image in deterministic order, and enforce one-to-eight items, positions, and supported stored metadata structurally.
- [ ] 2.3 Generate the auction migration artifacts and verify the migration/schema suites with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, and `pnpm run test:backend`.

## 3. Implement the authoritative listing lifecycle and public surface (grade10)

- [ ] 3.1 Make the draft-save scenarios pass: authorized operators can save empty and partial drafts, while malformed field values and unauthorized price/window writes are refused without changing the row or public catalogue.
- [ ] 3.2 Make the create and editable-update scenarios pass: create validates every required field and defaults optional fields, created/published edits preserve the lifecycle invariants, and closed/settled/canceled listings reject rewrites.
- [ ] 3.3 Make the slug lookup and cancellation scenarios pass: protect held slugs transactionally, expose only public states at `/auction/listings/<slug>`, and rewrite a canceled slug atomically while preserving existing authorization-release behaviour.
- [ ] 3.4 Make the immediate and scheduled publication scenarios pass: validate a future publish time, publish a created listing now, and add an idempotent bounded due-publish sweep that locks and rechecks each candidate before it becomes public.
- [ ] 3.5 Make the ordered media scenarios pass: accept supported image and video originals up to 100 MiB, enforce gallery cardinality and ordering, reject unsupported or closed-listing writes, and serve the first item as the catalogue card without processing it.
- [ ] 3.6 Verify the worker and API surface with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and `pnpm run build`.

## 4. Extend the auction admin feature slice (grade10)

- [ ] 4.1 Make the admin repository and fixture scenarios for saving a draft, creating it, editing it, publishing it, and calling it off pass through the existing DI-backed `catalog/listings` feature.
- [ ] 4.2 Make the admin repository and fixture scenarios for upload, reorder, and removal of ordered image/video media pass, including query invalidation after every successful listing mutation.
- [ ] 4.3 Verify the auction admin frontend package with its focused module/hook tests, `pnpm run typecheck`, and `pnpm run lint`.

## 5. Compose the Grade10 admin and collector-facing listing screens (grade10)

- [ ] 5.1 Make the admin form scenarios for empty-draft save, required-field create feedback, editable-field updates, publish-now/schedule, and permission-gated call-off pass using the contract-backed listing feature and the UI source recorded in `ui.md`.
- [ ] 5.2 Make the gallery form scenarios for mixed ordered image/video uploads, eighth-item acceptance, ninth-item refusal, reorder/removal, and closed-listing refusal pass without reaching the worker transport from the app.
- [ ] 5.3 Make the collector listing-page scenarios for slug routing, not-found private states, and ordered image/video gallery rendering pass using the public listing contract.
- [ ] 5.4 Verify the admin and storefront integration with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.
