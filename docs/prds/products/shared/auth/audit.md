---
title: Audit Log
spec: shared/auth/audit
audience: operator
order: 7
---

## What Lands on the Trail

- **Identity writes** — ban, unban, set-role, revoke, a trusted product creating a new user id or flipping one to verified, account deletion, and second-factor enable, disable and recovery regenerate
- **Refusals too** — a refused action is recorded, as a success is
- **Entries keep the reason** — an entry keeps the operator's stated reason
- **Named by user id** — an entry names the account by user id. It never carries a secret, a recovery code or an email
- **Not on the trail** — collector sign-in and sign-out. A trusted product that finds an account already there, with no data change, does not write

## Second-Factor Enable

Starting enrolment is not the enable entry. The enable is the factor first going live. If that entry cannot be written, the factor stays active, and a later successful proof writes the missing entry.

## When a Write Fails

The trail is append-only. Nothing can rewrite an entry. An action whose record cannot be written does not happen, except the enable above.

## Reading the Trail

An auditor holds the read grant and nothing else. They read the entries and run the consistency check. They do not see the proof, and they do not see names or emails. Reads are not recorded. Listing the directory or sessions leaves no entry, because the trail records what changed, not what was looked at.

:::callout{kind="note"}
A passing consistency check says the chain is internally consistent. It does not say the chain is intact, which is what the offsite copies are for. Store, auction and loyalty each keep their own trail. This one is identity's. The merged Audit section that reads every product's chain is [Audit Trail](/p/grade10-admin/audit/).
:::
