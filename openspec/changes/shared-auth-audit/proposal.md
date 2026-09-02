**Author:** @rita-liu - 2026-08-31

## Why

An auditor who holds `audit:read` cannot answer how a `users.id` appeared when
checkout created the account, or whether recovery codes were replaced after a
stolen session already had a step-up stamp. `shared-auth/audit` only requires
ban, unban, set-role, and revoke on the identity trail. A trusted product
creating an account or flipping one to verified is a write, not a directory
read, and is not on that trail. Regenerating recovery codes overwrites them
and is also off the trail.

**Metric:** share of new `users.id` values from a trusted-product create that
have a matching identity-trail entry in the same request (checkout-created
accounts included). Collector first-visit sign-in is not in the denominator.

Even when the row exists, the Audit section cannot isolate it. It is a
newest-first merge of every product, with no subject column, no filter, and
no sort. An auditor who holds a user id still pages past unrelated chains.
A view cannot be shared.

**Metric:** an auditor given a user id can show that person's writes in one
filter, without paging past other products.

## What Changes

- A trusted product creating a new user id appends to the identity trail
  with outcome `created`. A verify that flips unverified to verified
  appends. Finding an account that already existed with no data change
  (`already-unverified` / `already-verified`) does not. Actor is the
  system. Subject is the user id, never the email. If the trail cannot
  accept the entry, the write does not take effect.
- Regenerating second-factor recovery codes appends. The codes themselves
  are not kept. Enabling (the factor first going live) and disabling
  append; starting enrollment is not enable.
- Account deletion appends.
- The Audit section on both brands' consoles: combinable filters (product,
  action, actor id, subject id, result, date range), newest/oldest sort,
  subject on every row, expand for roles and details, copy user id, a
  readable action name, directory links when the operator can open Users,
  the location restoring filters and sort, and a jump from a chain broken
  at a position to that row. No email filter; the trail never holds email.

## Non-Goals

- Mixpanel Signed In / Signed Out / Account Created / `/engage` / Page Viewed
  (a later, store-owned change; auth must not talk to Mixpanel).
- Datadog counts (sibling `shared-auth-datadog`).
- Scheduling the audit-chain walk (that is `shared-auth/datadog`).
- Collector sign-in or sign-out on the identity trail.
- Inventing `grade10-store/analytics`.
- Export or CSV of the trail.
- Live tail or auto-refresh.
- Searching the trail by email, or showing email on a row.
- Putting hashes on the wire or in the table.

## Capabilities

### New Capabilities

- `admin-console/audit`: the auditor's merged trail on both brands' consoles
  — filters, sort, row inspection, and jump to a chain break.

### Modified Capabilities

- `shared-auth/audit`: trusted-product create that creates a new user id,
  verify that flips, delete, and second-factor enable/disable/regen;
  fail-closed and no-email still apply; already-existed finds, collector
  sign-in, and product reads stay off the trail.

## Impact

Identity workers of both brands, and every product that creates or verifies
an account (store checkout today). Admin second-factor surfaces for
regenerate, enable, and disable. Both brands' admin Audit section and the
trail list those consoles read. No new `@grade10/ui` export. No Figma,
design-system, or Astryx change.
