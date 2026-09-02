# UI: Who may act

## Screens

No published Figma frames. This change does not add a frame.

### Users directory

Brand-owned admin view: list, email search, lookup by user id, ban/unban,
set-role, list and revoke that person's sessions. A banned account stays
listed. Session list does not show the session secret.

### Identity trail

Brand-owned admin view of the identity trail. Times use the event shape in
`shared/dates-and-times`. Other products' trails belong to those products. A
consistency check is yes or no.

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `Button` | `@grade10/design-system` | |
| `SearchInput` | `@grade10/design-system` | |
| `Dialog` | `@grade10/design-system` | |
| `TextInput` | `@grade10/design-system` | Optional ban reason. |
| `CheckboxButton` | `@grade10/design-system` | Role picks. |
| `Badge` | `@grade10/design-system` | Trail result. |

No new component, variant, or token.

## States

| State | Spec scenario |
| --- | --- |
| Users list | An operator with the grant lists accounts |
| List refused | A caller without the grant is refused |
| Email search | Search matches email without letter case |
| Open by user id | An account opens by user id |
| Banned still listed | A banned account stays in the directory |
| Ban / unban | A ban stops money-moving / An unban lets them sign in again |
| Banned cannot sign in | A banned person cannot sign in |
| Ban refused | A caller who cannot ban is refused |
| Self-ban refused | An operator cannot ban themselves |
| Support cannot ban admin | Support cannot ban an admin |
| Role editor | Admin changes another person's roles |
| Cleared to user | Clearing operator roles leaves a user |
| Set-role refused | Support cannot set roles |
| Own roles refused | An operator cannot change their own roles |
| Last admin kept | The last admin keeps admin |
| Session list | An operator with the grant lists one person's sessions |
| Session list refused | A caller without the grant is refused |
| Revoke session | A revoked session is not signed in |
| Revoke all | Every session of an account can be revoked |
| Revoke refused | A caller who cannot revoke is refused |
| Support cannot revoke admin | Support cannot revoke an admin's session |
| Trail | An auditor can read the trail |
| Trail refused | A caller without audit read is refused |
| Trail consistent | An auditor can check the trail is consistent |
