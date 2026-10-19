---
title: Backups
order: 2
---

No data loss even when something is compromised — a provider account, a CI runner, an operator laptop, or an admin credential. Availability incidents are Neon's and Cloudflare's built-in recovery; the offsite layer exists for compromise.

## Coverage

### Every source of truth has two lines of defense

| Data | Store | First line | Second line |
| --- | --- | --- | --- |
| Identity (users, sessions meta, audit) | Neon Postgres, the auth wall of each brand's database | Neon point-in-time restore | Nightly encrypted offsite dump |
| App data (store, audit) | Neon Postgres, the app's schema in its wall | Neon point-in-time restore | Nightly encrypted offsite dump |
| Auction data (catalog, bids, holds, settlement, fulfillment, audit) | Neon Postgres (`auction` schema in the commerce wall of `grade10`) | Neon point-in-time restore | Nightly encrypted offsite dump |
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
- `neondb/scripts/backup.sh` dumps each brand's database whole, every wall in one file (`pg_dump`, custom format), and proves the dump readable (`pg_restore --list`)
- Dumps are encrypted with [age](https://age-encryption.org) to the public keys in `neondb/backup-recipients.txt`, then uploaded to S3-compatible storage
- A brand project not yet provisioned is skipped with a log line

### The runner can read nothing

- Only public keys live in the repository and CI
- Private keys stay offline with at least two named owners
- A leaked runner or bucket yields ciphertext

### The runner can destroy nothing

- Upload credentials are PUT-only; the script never deletes or overwrites
- Retention is the bucket's lifecycle policy, with object lock or versioning where the provider offers it

### The runner can forge nothing quietly

- Each upload carries its SHA-256
- The audit chain in each service's schema makes a restored-and-doctored history provable against any earlier dump ([Admin Access Control](/platform/admin-access))

## Recovery

### RPO 24 hours, RTO one wall restore

- The offsite layer alone bounds loss at 24 hours
- Neon point-in-time restore covers the gap down to minutes inside the history window: 7 days on production, 1 day elsewhere
- ❓ Account owner - whether the Neon plan allows 7 days on production
- A restore replaces one wall and leaves the others as they are - the runbook below. Walls are [Account Data](/platform/account-data#postgres-by-default)

### Restore runbook

1. Pick the source branch: a Neon point-in-time branch inside the history window, or a fresh branch that `restore.sh` fills from the newest `<target>/<stamp>.dump.age` after its `.sha256` checks; the script refuses a non-empty target
2. `restore-wall --env=<env> --wall=<wall> --from-branch <branch>` stops the wall's runtime role signing in, replaces only that wall's schemas in one transaction, and lets the role sign in again
3. `pnpm db:provision <env> <wall>`, then `db:status`, then delete the branch
4. Verify: row counts on the core tables, then `verifyAuditChain` via the store's `audit.verify`. The audit head witness reports a shorter chain, which is expected
5. After a KYC service or product restore, run the binding reconciliation

### Drill quarterly against staging

- A backup that has never been restored may not exist
- The cheap rehearsal is the local flow: `backup.sh local <db>` then `restore.sh` against the docker Postgres

## Setup once per environment

- Generate age keys (`age-keygen`); put the public keys in `neondb/backup-recipients.txt`; store the private keys offline with two owners
- Create the bucket, its lifecycle retention (e.g. 35 daily + 12 monthly), and a PUT-only access key
- Fill the GitHub Environment: secrets `NEON_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`; variables `BACKUP_S3_BUCKET`, `BACKUP_S3_ENDPOINT` (for R2)
