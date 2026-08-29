---
title: Audit trail
summary: A tamper-evident record of every operator action, read as one list.
---

Every operator action across every product is written to a tamper-evident log,
and the Audit section of the admin console reads all of them as one list. An
auditor — somebody holding that role and nothing else — pages back through what
operators did and can run a verification that walks each product's chain and
names the exact row where it breaks.

It is not one log. Each service owns its own table in its own database, because
each service owns its own data. What makes them one surface is a shared table
shape, a shared read contract, and a console that merges seven chains in the
browser and sorts them by time.

The trail is load-bearing rather than observational. An elevated action in a
service with nowhere to record it **does not run**, and a failed write fails the
request rather than letting the action pass unrecorded. Wiring the sink is part
of adding a service's first operator action, not a follow-up.

Prevention and proof are separate mechanisms. Prevention is database triggers
that reject update, delete and truncate while leaving insert open — appending is
the table's job — and every guard is armed in the mode that survives a session
pretending to be a replica. Proof is a hash chain: each row links to the one
before it, and verification answers with one of four reasons when it stops
linking. Every chain opens on a genesis row its migration wrote, so an emptied
table reads as broken rather than as a clean start.

:::flow{title="An auditor's pass"}
## Sign in and clear the second factor
The auditor role holds exactly one permission, so the Audit section is the only
thing visible.
## Read the chain strip
Every one of the seven products is named on every render, with its state. A
product that has gone quiet looks exactly like a product where nothing happened,
which is why silence is shown rather than omitted.
## Page back through the merged list
Fifty rows at a time, newest first, sorted by time across chains. While any
chain is silent the table refuses to page, because moving on would skip whatever
that chain held in the window.
## Verify a chain
The walk answers either a count of linked rows or the sequence number where it
broke, and why: no genesis, a gap, a broken link, or a hash that does not match.
## Read the verdict honestly
A passing verification says the chain is internally consistent. It never says
the chain is intact — the outside witnesses are what say that.
:::

:::callout{kind="warning"}
The honest limit, stated in the code's own comments: the digest is unkeyed and
nothing signs it, so an owner who drops the triggers can rewrite the table *and*
recompute every hash after it, and the chain will then verify against itself.
What convicts is a copy of an earlier head taken somewhere that owner cannot
reach. Three exist — the head emitted on every append and forwarded to
monitoring, the verified heads a scheduled sweep writes to a locked bucket, and
the offsite backups. All three are best-effort in their own way, and not every
worker runs the sweep.
:::

:::callout{kind="note"}
There is no audit spec. The only requirement touching it lives inside the
loyalty spec — operators act through named permissions, with a second factor and
a tamper-evident record — which covers the guarantee as loyalty depends on it
and nothing about the mechanism. The chain's columns, the four break reasons,
the verify cursor and its sweep, the archive witness, the merged console and the
signing anchor are all unspecified.
:::

:::detail{title="For engineers" for="engineer"}
The table and the chain live in `packages/postgres`, shared by every service
that carries one. A row holds a dense sequence number, the actor and the roles
they held at the time, the action, its subject, canonical JSON details stored as
text so the hash covers the bytes, whether it succeeded, and the two hashes.

**Hashes never go on the wire.** Recomputing an unkeyed digest in a browser
proves nothing a forger could not also satisfy, and shipping them would
advertise a guarantee this does not give — so the read contract carries
everything but the hashes.

Appends are not serialized by a lock. The sequence number is the primary key, so
two writers that read one head compute the same number and only one lands; the
loser re-reads and appends behind the winner, five attempts in all. Past that it
throws — over a mutation that has already committed — and emits a lost-append
metric first, because a row never written breaks no chain and is invisible to
verification. An advisory lock was the alternative, and is unsupported over the
connection pooler.

The console merges chains client-side. A chain's cursor is the row's own time
and sequence rather than a count, so rows beyond the cut keep their place on the
next page. Silence is told apart three ways by what the server did: refused,
never answered, or answered a shape this console cannot decode — a deploy skew,
not an outage.

Background: the audit trail in
[security](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md),
the sweep register in
[operations](https://github.com/9gag/grade10/blob/main/docs/operations.md), and
[backups](https://github.com/9gag/grade10/blob/main/docs/architecture/backup.md).
:::
