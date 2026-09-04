---
title: Roles and Permissions
spec: shared/auth/roles
audience: operator
order: 4
---

A person's roles come from one closed set — `user`, `staff`, `support`,
`treasurer`, `auditor`, `admin` — and a name outside it is dropped rather than
honoured.

The rule that matters most is how a grant is checked. A product asks whether the
caller holds a *permission*, never whether their role string matches something.
Roles stack when a person holds several, and no operator can widen what a role
grants, because who holds a role is data in the database while what a role
grants lives in reviewed code.

That split is what makes a compromised operator account a limited problem: it
can hold roles it should not, but it cannot invent a permission for one.

:::detail{title="How the gate is walked" for="operator"}
Permissions are only the first of three layers, all fail-closed. An elevated
call re-reads the session straight from the auth worker with no cookie cache,
so a ban or a role change acts immediately; then it checks every named
permission; then it requires a live second-factor stamp where the environment
enforces one; then it appends to the audit trail, without which the action
refuses to run. A raw byte route — an identity capture, a sealed document, an
item photo — climbs the same ladder.
:::

`treasurer` exists because a payout takes two people: whoever agrees what a loan
costs is not whoever moves the money, so `staff` and `treasurer` share no action
that pays. A treasurer reads the case they are paying against and nothing of the
person in it — an identity document is reached by a grant of its own, never by
running a flow.

A machine is not a person. A till's grants sit outside the role vocabulary
entirely, so no role holds them, `admin` included: a shopkeeper's till can spend
a member's points at the counter and nobody signed into an admin panel can.

:::callout{kind="warning"}
Two-factor is the second of the three gates and no capability covers it at all,
although the UI blocks and stories for it ship. The written policy disagrees
with the code as well: the security doc says a second factor is required in
staging and production, a QA doc says it is optional in every environment
deliberately, and the environment package currently sets staging to optional and
production to required. Two of the three are stale.
:::

## What a collector and an operator hold

::journeys{id="shared/auth/roles"}
