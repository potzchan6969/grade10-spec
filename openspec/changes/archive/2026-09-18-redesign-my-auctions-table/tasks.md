## 1. Shared account-record interfaces (grade10)

- [x] 1.1 Extend the account-record contract and frontend model with shared listing identity/media, bid enrollment, and per-row alert data so a bid-only listing can render as a complete table row (`shared-ui-auction-record-SC-02`, `grade10-site-auction-account-record-SC-42`)
- [x] 1.2 Verify the account-record contract, schema decoding, and frontend model stay aligned with the account-record fixtures and focused contract tests

## 2. Account-record read and projection (grade10)

- [x] 2.1 Project watched and bid-backed listings with authoritative standing, close, current-bid, hold, winner-order, alert, and listing-media data while retaining distinct read failures and removal behavior (`grade10-site-auction-account-record-SC-06`, `SC-07`, `SC-18`, `SC-19`, `SC-25`–`SC-27`, `SC-33`, `SC-34`)
- [x] 2.2 Enroll a first bid in the existing My Auctions record and preserve the existing watch, bid, and alert persistence paths without adding a second history model (`grade10-site-auction-account-record-SC-13`, `SC-42`, `SC-43`)
- [x] 2.3 Verify account-record service, repository, and RPC behavior with the focused auction backend and contract test lanes

## 3. My Auctions table composition (grade10)

- [x] 3.1 Compose one deduplicated table from bid-backed and watch-only rows, with bid rows first, row-count badge, close/current-bid detail, watch-only `--`, empty catalogue entry, and retryable failed reads (`shared-ui-auction-record-SC-08`, `SC-11`, `SC-12`, `grade10-site-auction-account-record-SC-08`–`SC-12`, `SC-30`–`SC-34`, `SC-41`)
- [x] 3.2 Preserve Email alerts on every applicable row, winner-order navigation, hold-release states, and localized row feedback while keeping the shared UI consumer-owned (`grade10-site-auction-account-record-SC-25`–`SC-27`, `SC-43`)
- [x] 3.3 Ensure bid-backed rows never expose Unwatch, including when the same listing is present in the watched read; keep Unwatch only on watch-only rows (`shared-ui-auction-record-SC-13`, `grade10-site-auction-account-record-SC-13`, `SC-44`)
- [x] 3.4 Verify the focused account-record page tests, frontend typecheck, lint, and test lanes

