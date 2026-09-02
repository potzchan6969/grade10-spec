---
title: Backups
order: 2
---

No data loss even when something is compromised — a provider account, a CI runner, an operator laptop, or an admin credential. Availability incidents are Neon's and Cloudflare's built-in recovery; the offsite layer exists for compromise.

## Coverage

### Every source of truth has two lines of defense

| Data | Store | First line | Second line |
| --- | --- | --- | --- |
| Identity (users, sessions meta, audit) | Neon Postgres per product | Neon point-in-time restore | Nightly encrypted offsite dump |
| App data (store, audit) | Neon Postgres per app | Neon point-in-time restore | Nightly encrypted offsite dump |
| Auction data (catalog, bids, holds, settlement, fulfillment, audit) | Neon Postgres (`grade10_auction` in `stg-/prd-grade10`) | Neon point-in-time restore | Nightly encrypted offsite dump |
| Stripe customers and payment intents (one account per storefront) | Stripe | Stripe retains; our rows carry the ids to re-query | — (external source of truth) |
| Sealed documents (vault ceremonies) | Cloudflare R2 (`grade10-vault-documents-<env>`) | R2's own replicated durability | Hourly archive sweep: digest-checked copy of every sealed document, plus the exported audit heads, into `grade10-vault-documents-archive-<env>` under an R2 bucket lock |
| Item photos (vault) | Cloudflare R2 (`grade10-vault-item-photos-<env>`) | R2's own replicated durability | — (deliberate: erasable customer media, and an undeletable second copy would make erasure impossible; a loss costs a photo, never evidence) |
| Durable Object state (tracking queues, counters) | DO SQLite | Cloudflare 30-day point-in-time recovery | — (re-derivable operational state) |
| Sessions | Workers KV | — | — (users sign in again) |
| Edge caches | Workers Cache | — | — (rebuilt from origin) |

- Anything new that is a source of truth must land in this table with a second line
- Derivable state deliberately has none

## Offsite layer

### Nightly encrypted dumps

- `.github/workflows/backup.yml` runs nightly per environment
- `neondb/scripts/backup.sh` dumps every app database whose project is provisioned — discovered from the backends' `src/db/targets.sh` declarations (`pg_dump`, custom format) — and proves the dump readable (`pg_restore --list`)
- Dumps are encrypted with [age](https://age-encryption.org) to the public keys in `neondb/backup-recipients.txt`, then uploaded to S3-compatible storage
- Databases in unprovisioned projects are skipped with a log line

### The runner can read nothing

- Only public keys live in the repository and CI
- Private keys stay offline with at least two named owners
- A leaked runner or bucket yields ciphertext

### The runner can destroy nothing

- Upload credentials are PUT-only; the script never deletes or overwrites
- Retention is the bucket's lifecycle policy, with object lock or versioning where the provider offers it

### The runner can forge nothing quietly

- Each upload carries its SHA-256
- The audit chain in each database makes a restored-and-doctored history provable against any earlier dump ([Admin Access Control](/platform/admin-access))

## Recovery

### RPO 24 hours, RTO one restore plus a repoint

- The offsite layer alone bounds loss at 24 hours
- Neon point-in-time restore covers the gap down to minutes for provider-side incidents
- Recovery is one restore run plus a Hyperdrive repoint — the runbook below

### Restore runbook

1. Fetch the newest `<target>/<stamp>.dump.age` from the bucket and check its `.sha256`
2. Create a fresh database — a new Neon project/branch, never the live one
3. `BACKUP_AGE_KEY_FILE=... bash neondb/scripts/restore.sh <file> <connection-string>` — the script refuses a non-empty target
4. Verify: row counts on the core tables, then `verifyAuditChain` via the store's `audit.verify`
5. Point the app's Hyperdrive config at the restored database; the old one stays untouched as evidence

### Drill quarterly against staging

- A backup that has never been restored may not exist
- The cheap rehearsal is the local flow: `backup.sh local <db>` then `restore.sh` against the docker Postgres

## Setup once per environment

- Generate age keys (`age-keygen`); put the public keys in `neondb/backup-recipients.txt`; store the private keys offline with two owners
- Create the bucket, its lifecycle retention (e.g. 35 daily + 12 monthly), and a PUT-only access key
- Fill the GitHub Environment: secrets `NEON_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`; variables `BACKUP_S3_BUCKET`, `BACKUP_S3_ENDPOINT` (for R2)
