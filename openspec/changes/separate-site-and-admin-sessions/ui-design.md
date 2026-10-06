## Screens

No Figma or Pencil frame exists, and none is drawn here: the admin console has
no Figma frames by decision ([Admin Console](../../../docs/prds/products/shared/console/index.md)),
and the three surfaces below are one notice, one choice and one label on
screens the console already ships. The console's sign-in page and its two
session lists stand as the layout until a designer supplies a frame; this file
names no frame URL for that reason. Behavior is owned by the
[sign-in spec](specs/shared/auth/sign-in/spec.md), the
[sessions spec](specs/shared/auth/sessions/spec.md) and, for how both session
lists show the surface, the
[user directory spec](specs/shared/console/user-directory/spec.md); the link
landing by [decisions.md](decisions.md) Q14.

### Console sign-in page

The operator's sign-in, filling the window: `SignInPanel`, an internal view of
`@grade10/auth-admin-frontend` that `OperatorGate` renders around
`AdminSignInFlow`. It carries the failure notice (a failed, expired, banned
console-asked link) and the Switch and Stay choice (a different-account link),
both inline in the page. The site's own toasts are unchanged
([Link follow toasts](../../../docs/prds/products/shared/auth/sign-in.md#following-the-link)).

### Console session list

Two views in `@grade10/frontend-console` render the same `UserSessionRow`, as
[the user directory](specs/shared/console/user-directory/spec.md) holds
them to: `UserSessionsDialog`, which the package ships and the users desk does
not render, and the sessions area of `UserAccountPanel`, beside the list, which
the desk does. Each gains the surface label on each row.

## Components

Console surfaces compose `@grade10/frontend-console`, not `@grade10/ui` or the
store's design system ([Console Blocks](../../../docs/prds/products/shared/console/blocks.md)).

Existing exports, named exactly:

| Export | Package | Used for |
| --- | --- | --- |
| `AdminSignInFlow` | `@grade10/auth-admin-frontend/sign-in` | The sign-in the inline messages render in |
| `SignInFlow`, `SignInFlowCopy` | `@grade10/auth-frontend/sign-in` | The flow `AdminSignInFlow` wraps |
| `Notice` (`tone: "error"`, `"warning"`; `message`, `detail`, `actions`) | `@grade10/frontend-console` | The failure message, and the different-account message with its actions |
| `Button`, `Stack`, `Text` | `@grade10/frontend-console` | Switch and Stay, and the notice's placement |
| `UserSessionsDialog`, `UserAccountPanel`, `UserSessionRow` | `@grade10/frontend-console` | The two session lists and their shared row |
| `Table`, `Row`, `Cell`, `Badge`, `StatusBadge` | `@grade10/frontend-console` | The row's cells and the surface label |

Nothing is needed from `packages/design-system` or `packages/ui`: no variant,
size or token is missing, so no work lands in this store. The site's toasts
reuse `LinkFollowToasts` stories (`auth-sign-in-link-follow-toasts--*`) as they
are.

Missing, all in grade10 and flagged for `tasks.md` (groups 4 and 5):

| Missing | Where it lands |
| --- | --- |
| `SignInFlowCopy` has no words for a failed, expired, banned or different-account link, nor for Switch and Stay | `@grade10/auth-frontend/sign-in`, answered by `consoleCopy` in `@grade10/auth-admin-frontend` |
| `AdminSignInFlow` has no inline slot that renders a `Notice` above the card, nor Switch and Stay as the notice's `actions` | `@grade10/auth-admin-frontend` |
| `UserSessionRow` has no `surface`, and neither `UserSessionsDialog`'s `copy.headings` nor `UserAccountPanel`'s `copy.sessions.headings` has a surface heading | `@grade10/frontend-console` |
| Stories for the five console sign-in states and the four session-list states, the last on both session views | grade10 console Storybook, beside each view |

## Copy

The console sits outside the localization scope: its words are English
literals inline in `consoleCopy` and the session views' `copy`, so no key is
owed in `packages/i18n`. The
site's `shared/<locale>/signIn.json` already answers `linkExpired`,
`linkInvalid`, `linkBanned`, `differentAccount`, `differentAccountDescription`,
`switch` and `stay` for the site toasts; the console reuses their wording as
literals rather than importing them. New words, all console literals:

- the surface heading and its two values, the site and the console, on both
  session lists;
- no other word: expired, no longer works, cannot sign in, different account,
  Switch and Stay take the wording above.

## States

### Console sign-in page

| State | Shows | Anchor |
| --- | --- | --- |
| Link expired | Error `Notice` above the email step stating the link has expired; no toast; the email step stays usable | `shared-auth-sign-in-SC-103` |
| Link no longer works | Error `Notice` stating the link no longer works, for a used, replaced or invalid link; no toast | `shared-auth-sign-in-SC-103` |
| Account banned | Error `Notice` stating they cannot sign in; no invitation to ask for another link | `shared-auth-sign-in-SC-104` |
| Different account | Warning `Notice` stating they are signed in with a different account and naming the link's email, with Switch and Stay in its actions; no toast | `shared-auth-sign-in-SC-105` |
| Stay chosen | The notice is dismissed and the console's current session continues | `shared-auth-sign-in-SC-107` |

### Console session list

Both views, `UserSessionsDialog` and `UserAccountPanel`, show each state the
same way.

| State | Shows | Anchor |
| --- | --- | --- |
| Site session | The row's surface label reads the site | `shared-auth-sessions-SC-10`, `shared-console-user-directory-SC-40` |
| Console session | The row's surface label reads the console | `shared-auth-sessions-SC-10`, `shared-console-user-directory-SC-40` |
| Session without a stamp | A session made before release shows the site's label | `shared-auth-sessions-SC-14` |
| Session supplied no surface | The row shows no surface label, neither the site's nor the console's, beside whatever else it was supplied | `shared-console-user-directory-SC-42` |
