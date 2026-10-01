## Goals

- A product reading `shared/auth/roles` alone builds the authorization the code enforces
- Every role and every resource the code ships is named in the spec
- A reader can tell which vault grants run a case, which set its cost and which move its money

## Non-Goals

- Changing any grant: the code is the reference and the spec is what moves
- Refusing a person who holds both `staff` and `treasurer`
- Splitting `vault:operate` from `vault:approve`, which `add-hosted-identity-verification` asks
- Service principals: a till's grants sit outside the role vocabulary
- Grants no code ships yet, such as `inventory:transfer`, which `add-item-registry` adds

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which side moves where the spec and the code disagree on a grant? | The spec follows the code at the commit planning read (recommended) | Changing grants to match the spec, which would take access away from operators who use it today |
| Q2 | Is an identity document read through the product that collected it? | No: `kyc:read` is a resource of its own, and there is no `kyc:write` (recommended) | `vault:read` reaching the document, which lets anyone who reads a case read the person |
| Q3 | Does the role table name `finance` and the `grading` resource, which shipped after the proposal was written? | Yes: the change writes the set the code ships, whichever change shipped it (recommended) | Writing the set as the proposal first found it, which is out of date the day it is accepted |
| Q4 | Can a `treasurer` open the vault case it pays against? | Yes: `treasurer` holds `vault:read` and `vault:payout`, and none of `vault:operate`, `vault:approve` or `kyc:read` - settled by the role table the spec takes from the code (Q1) | Keeping the case from the treasurer, which the code does not do |
| Q5 | Does `admin` hold `kyc:read` and `vault:payout`? | Yes: `admin` holds every permission the vocabulary declares - settled by the role table (Q1) | An admin carved out of identity or money, which no code ships |
| Q6 | Is the signed document printed from an identity capture behind `kyc:read` too? | Yes: both documents sit behind `kyc:read`, and `vault:read` reaches neither - settled by the identity documents requirement (Q2) | The signed document behind `vault:read`, which lets reading a case read the person's printed identity |
| Q7 | Does `staff` hold `vault:approve` beside `vault:operate`? | Yes: staff run a vault case and set its cost, and only `treasurer` moves its money - settled by the role table (Q1) | A third role setting the vault cost, which no code ships; splitting `operate` from `approve` is a non-goal |
| Q8 | Is a refused read of an identity document recorded on an audit trail? | No trail is owed: `shared/auth/audit` records refusals of ban, unban, set-role and revoke only, and `grade10-admin/vault/operator-queue` files acts that change a case and reads that declare an entry - settled by those specs | A roles rule trailing every refused grant, which belongs to a trail's own capability rather than to the vocabulary |
| Q9 | May one person hold both `staff` and `treasurer`? | Yes; the grants stack, and no act that approves another is taken by the person who recorded it, so a step that needs two people still needs two - decided by the product owner, 2026-10-01 | Refusing the pair at provisioning, which a small shop cannot staff; allowing it with no further rule, which lets one person record and approve the same money |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/auth/roles` | Can a `treasurer` open the vault case it pays against? US-03 keeps case work and the identity document from the treasurer, and the input never says whether reading the case is case work or part of paying against it | Q4 |
| `shared/auth/roles` | Does `admin` hold `kyc:read` and the vault payout? The proposal says admin is not "every permission any role grants" and never says what it lacks | Q5 |
| `shared/auth/roles` | Is the agreement printed from an identity document behind `kyc:read` too? The proposal says the document and that agreement outlive the case, and gates only the document by name | Q6 |
| `shared/auth/roles` | Does `staff` hold `vault:approve` beside `vault:operate`? The split by cost names no role that agrees a vault cost | Q7 |
| `shared/auth/roles` | Is a refused read of an identity document recorded on the audit trail? The PRD's gate layers trail an action that runs, and the input is silent on a refusal of the document's own grant | Q8 |
