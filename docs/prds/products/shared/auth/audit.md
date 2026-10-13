---
title: Audit Log
spec: shared/auth/audit
audience: operator
order: 7
---

Identity writes land on the trail: ban, unban, set-role, revoke, a trusted
product creating a new user id or flipping one to verified, account deletion,
and second-factor enable, disable, and recovery regenerate. Both successes and
refusals are recorded where the action is refused on the trail, and people are
named by user id. An entry keeps the operator's stated reason and never a
secret, recovery code, or email.

A trusted product that finds an account already there with no data change does
not write. Collector sign-in and sign-out stay off the trail. Starting
second-factor enrollment is not the enable entry; the enable is the factor
first going live. If that enable cannot be recorded, the factor stays active
and a later successful proof writes the missing enable.

The trail is append-only and fail-closed. Nothing can rewrite an entry. An
action whose record cannot be written does not happen — except that enable
exception above.

An auditor holds the read grant and nothing else. They read the entries and run
the consistency check, without seeing the proof and without seeing names or
emails, which sit behind the directory grant everywhere else. Reads are not
recorded: listing the directory or listing sessions leaves no entry, because the
trail records what changed rather than what was looked at.

:::callout{kind="note"}
A passing consistency check says the chain is internally consistent. It does not
say the chain is intact — that is what the offsite copies are for. Store,
auction and loyalty each keep their own trail; this one is identity's. The
merged Audit section that reads every product's chain is
[Audit Trail](/p/grade10-admin/audit/).
:::
