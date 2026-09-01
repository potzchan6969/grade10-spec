---
title: The identity trail
summary: Four operator moves recorded append-only, and an action that will not run if it cannot be recorded.
spec: shared-auth/audit
audience: operator
order: 7
---

Four identity actions land on the trail: ban, unban, set-role and revoke. Both
their successes and their refusals are recorded, and people are named by user
id. An entry keeps the operator's stated reason and never a secret.

The trail is append-only and fail-closed, which is one sentence with two teeth.
Nothing can rewrite an entry. And an action whose record cannot be written does
not happen — the write is not a side effect of the move, it is a condition of
it.

::spec{id="shared-auth/audit" scenario="audit-SC-11"}

An auditor holds the read grant and nothing else. They read the entries and run
the consistency check, without seeing the proof and without seeing names or
emails, which sit behind the directory grant everywhere else. Reads are not
recorded: listing the directory or listing sessions leaves no entry, because the
trail records what changed rather than what was looked at.

:::callout{kind="note"}
A passing consistency check says the chain is internally consistent. It does not
say the chain is intact — that is what the offsite copies are for. Store,
auction and loyalty each keep their own trail; this one is identity's.
:::

## What an operator and an auditor do

::journeys{id="shared-auth/audit"}

## The contract

::spec{id="shared-auth/audit"}
