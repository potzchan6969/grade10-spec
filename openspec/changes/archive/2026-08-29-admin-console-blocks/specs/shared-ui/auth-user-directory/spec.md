# shared/console/user-directory Delta

## REMOVED Requirements

### Requirement: The user directory exports

**Reason:** Admin console UI leaves the shared UI package; the console
package in the application repository is its one home. The directory's
contract and behavior carry over unchanged as
`shared/console/user-directory`.

**Migration:** Import `UserTable`, `UserRolesDialog`, `UserModerationDialog`,
`UserSessionsDialog`, and their types from the console package's public entry
instead of the shared UI package. The application repository re-points its
imports before this package deletes the block.

### Requirement: The directory carries no identity vocabulary of its own

**Reason:** Moved to `shared/console/user-directory`, unchanged.

**Migration:** None beyond the import move — the behavior is identical.

### Requirement: The table offers only the moves the console permits

**Reason:** Moved to `shared/console/user-directory`, unchanged.

**Migration:** None beyond the import move — the behavior is identical.

### Requirement: A session is named without its secret

**Reason:** Moved to `shared/console/user-directory`, unchanged.

**Migration:** None beyond the import move — the behavior is identical.

### Requirement: One confirmation serves every moderation move

**Reason:** Moved to `shared/console/user-directory`, unchanged.

**Migration:** None beyond the import move — the behavior is identical.
