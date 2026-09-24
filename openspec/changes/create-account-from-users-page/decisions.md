## Goals

- Production Users can create a passwordless Auth account with name, email, and
  roles from the closed set — including elevated roles such as `admin` — for
  someone who has never signed in
- Create simulates ordinary account creation plus a role grant, not Override's
  loyalty provision
- Create is offered only when the operator holds `user:create`; choosing a
  non-`user` role also requires `user:set-role`
- A duplicate email is refused, with a way to open the existing account
- After a successful create, the new account's panel opens

## Non-Goals

- Loyalty enroll or opening points
- Retiring Override's Create user and member
- Sending an invite or magic-link email on create
- A password field
- Wiring ZZZ in this change
- Impersonation (separate worktree)

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does create buy on Users — Auth + roles, or Override's full provision (Auth + Loyalty + points)? | Simulate ordinary account creation then an elevated grant. Verified: ordinary Auth create does not enroll Loyalty or set opening points, so Users create is Auth + roles only. | Override's Create user and member pipeline (enroll + opening points) on the access desk |
| Q2 | Who may create, and when is Create shown? | Clarified by Q10. | Gating Create on `user:set-role` alone, or offering it without `user:create` |
| Q3 | Roles at create time? | Pick roles in the create dialog from the closed set, including elevated roles such as `admin`, under the same refusals as set-role. | Create as plain `user` only, then set roles later in the panel |
| Q4 | Email already taken? | Refuse with a clear message and a way to open the existing account. Never a second Auth row. | Refuse and leave the operator to search alone |
| Q5 | After a successful create? | Open the new account's panel, same as picking a row. | Stay on the list with no panel open |
| Q6 | Override after this ships? | Leave Override's create-and-member flow as the non-prod loyalty tool. | Strip create from Override in this change |
| Q7 | Brand scope? | Grade10 Users page + shared Auth create rules; shared directory components grow if needed; ZZZ adopts when it chooses. | Wiring ZZZ in this change |
| Q8 | Confirm create shape given the code? | Auth account with name, email, and roles only — no Loyalty enroll, no opening points. Matches "user creates an account, then is granted elevated." Site use after magic link or Google is confirmed OK without loyalty enroll. | Full Override provision for admin creates |
| Q9 | Which dialog — Override's `CreateMemberDialog`, a mode flag on it, or a slim Auth-only dialog? | A separate slim create dialog: name, email, and role(s). Reuse field patterns and Auth `createUser`, not `ProvisionMember`. Do not add a mode flag to `CreateMemberDialog`. | A `mode` flag on Override's CreateMemberDialog that hides enroll and points |
| Q10 | Show Create on `user:create` or on `user:set-role`? | Offer Create only when the session holds `user:create`. Choosing a non-`user` role also requires `user:set-role`. Do not gate the button on `user:set-role` alone. (`user:create` is already in the roles vocabulary via `fix-roles-spec-divergence`; this change does not restate the full roles table.) | Show Create whenever the operator can set roles |
| Q11 | Tell the new person? | Silent create. No invite or magic-link email on create. They sign in later when they need to. | Send an invite or magic-link email when create succeeds |
| Q12 | Password? | Passwordless. No password field on Users create. | A password field at create |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
