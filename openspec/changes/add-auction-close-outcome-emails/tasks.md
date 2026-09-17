## 1. Preview letters and product record (grade10-spec) (owner: @tangconst)

- [x] 1.1 Keep close-outcome React Email previews on campaigns `lot_closed_didnt_win` and `lot_ended_watched` only (sold and Ended-only watched previews); ensure `lot_ended` is absent from campaign tags and previews (`grade10-site-auction-notifications-SC-37`…`SC-40`).
- [x] 1.2 Keep the Notifications Close Outcome page aligned with this change's 🚧 outcomes and the decided no-bids campaign (`lot_ended_watched` Ended-only; `lot_ended` retired), without restating scenarios; verify with `pnpm check:manual`.
- [x] 1.3 Verify: `pnpm check:manual` and `openspec validate add-auction-close-outcome-emails --strict`.

## 2. Kinds, contracts, and migration (grade10) (owner: @mason5991)

- [x] 2.1 Add wire kinds `listing_closed_didnt_win` and `listing_ended_watched` on the shared auction email / push vocabulary, map them to send-log types `closed_didnt_win` / `ended_watched`, and map UTM `utm_campaign` to the same `listing_*` slugs for now; retire `listing_ended`, campaign `lot_ended`, and mail-log type `ended` (`grade10-site-auction-notifications-SC-36`, `SC-40`). Aligning UTM to capability `lot_*` names is deferred.
- [x] 2.2 Migrate `bidder_watches.closed_notified_at`, its due partial index, and the `mail_logs` type checks for `closed_didnt_win` / `ended_watched` (no `ended`) so operators can filter the live types (`grade10-site-auction-notifications-SC-24`…`SC-26`).
- [x] 2.3 Verify: focused contracts and schema tests, plus `pnpm run typecheck` for `@grade10/auction-contracts` and the auction backend package.

## 3. Close-outcome send paths (grade10) (owner: @htonyl)

Depends on group 2.

- [x] 3.1 Make `grade10-site-auction-notifications-SC-37` and `SC-42` pass: when a listing closes with a winner, enrolled losing bidders get one `listing_closed_didnt_win` letter (winning + own bid when supplied) via the bid-notification priority lists and `lost_at_close_notified_at`; the winner gets none from this capability.
- [x] 3.2 Make `grade10-site-auction-notifications-SC-38`, `SC-39`, `SC-40`, `SC-41`, and `SC-43` pass: `closeOutcomeReminders` fans out only `listing_ended_watched` to enrolled watch-only collectors (Sold for when there is a winner; Ended-only with banned phrases omitted when nobody bid), excludes anyone who also bid, skips muted / account-master-off watches, stamps `closed_notified_at`, and never sends `listing_ended` / `lot_ended`.
- [x] 3.3 Make `grade10-site-auction-notifications-SC-18`, `SC-19`, `SC-29`, `SC-30`, and `SC-35` hold for the new kinds: shared letter shape, Manage alerts, one primary image or none, brand mark home, and render copy aligned with the preview letters.
- [x] 3.4 Verify: auction DB / sweep tests covering did-not-win and watcher close fanout (including mute, bid/watch dedup, and no-bids never using `lot_ended`), `packages/grade10-auction/backend` render close-outcome tests, `pnpm run test:backend` for the auction worker lane that owns these specs, and `pnpm run typecheck`.

## 4. Admin send-log labels (grade10) (owner: @mason5991)

Depends on group 2.

- [x] 4.1 Surface human labels for `closed_didnt_win` and `ended_watched` on the auction admin mail-sends table, and drop any `ended` close-outcome label (`grade10-site-auction-notifications-SC-25`).
- [x] 4.2 Verify: admin-frontend typecheck for the mail-sends feature and `git diff --check`.
