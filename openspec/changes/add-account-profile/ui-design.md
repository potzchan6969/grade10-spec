# UI: account profile with basic information

## Screens

No Figma frame draws this surface: the `store-profile` block has no published
frames and no `.figma.ts` mappings. Whether it is built from the requirements
alone is the designer's answer to decisions Q5, and group 1 of the tasks lands
only after it and the person's Design Override yes.

| Screen | Frame | What is new on it |
| --- | --- | --- |
| Account profile — read view | *none; decisions Q5* | The avatar, the read-only email row, and the member-since line. |
| Account profile — edit form | *none; decisions Q5* | The avatar control — choose a replacement, preview it, remove the current one — and the read-only email. |

Both brands render these screens through the same profile feature.

## Components

| Export | Change |
| --- | --- |
| `ProfileCard` | **No change.** Its contract — a titled card whose body is loading, empty, failed, or the element the application supplies — is recorded for the first time. |
| `ProfileCardCopy`, `ProfileCardProps` | **No change.** |
| `ProfileDetails` | Gains the avatar and the email row. Shows the way into the form only when given both an edit label and an edit handler. |
| `ProfileDetailsCopy` | **No change.** The email is a value, not a word. |
| `ProfileDetailsProps` | Gains the avatar image source, its accessible name, the fallback content, and the email. |
| `ProfileForm` | Gains the avatar control, its preview and the read-only email. Judges no file, holds no length limit of its own, and refuses no submission itself. |
| `ProfileFormCopy` | Gains the choose and remove labels. |
| `ProfileFormProps` | Gains the current avatar's source, accessible name and fallback content, and the email. The two length limits become required. |
| `ProfileFormValues` | Gains the avatar outcome: unchanged, removed, or a chosen file. |

Composed from `Avatar`, `AvatarImage`, and `AvatarFallback` in
`@grade10/design-system`, alongside the `Card`, `Text`, `TextInput`, and
`Button` the block already uses. No new primitive, variant, or token.

Bio stays a single-line `TextInput` at 500 characters, since the design system
publishes no textarea; whether that holds is the designer's answer to
decisions Q14.

Copy reaches every control through each component's `copy` prop; each brand's
catalog owns the words.

## States

### Card

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | A loading placeholder; no profile fields | `shared-ui-store-profile-SC-04` |
| Failed read | That the profile could not be read; no profile fields and no action | `grade10-site-store-account-profile-SC-31` |

### Read view

| State | Shows | Anchor |
| --- | --- | --- |
| Never saved | The defaulted name, its first letter as the avatar, and the empty-bio line; an edit control, never a create prompt | `grade10-site-store-account-profile-SC-03` |
| Nameless session | The address before the `@` as the name, and its first letter | `grade10-site-store-account-profile-SC-04` |
| No avatar | The display name's first letter | `grade10-site-store-account-profile-SC-25` |
| Avatar fails to load | The display name's first letter in the image's place; no broken image | `shared-ui-store-profile-SC-10` |
| No bio | The line that says what the bio is for | `grade10-site-store-account-profile-SC-19` |
| No member-since | No date, and no error | `grade10-site-store-account-profile-SC-09` |
| Read-only | No edit control | `shared-ui-store-profile-SC-08` |

### Edit form

| State | Shows | Anchor |
| --- | --- | --- |
| Avatar chosen | The chosen image previewed in the avatar's place | `shared-ui-store-profile-SC-12` |
| Avatar removed | The display name's first letter in the avatar's place | `shared-ui-store-profile-SC-13` |
| Saving | The save button busy; it cannot be sent again | `shared-ui-store-profile-SC-21` |
| Refused save | The application's reason; the entered values kept | `grade10-site-store-account-profile-SC-32` |
| Avatar kept, text refused | The new avatar, the reason the text was refused, the entered text kept | `grade10-site-store-account-profile-SC-30` |
| Cancelled | The read view with the stored profile | `grade10-site-store-account-profile-SC-28` |
| Email | The signed-in address, read-only | `grade10-site-store-account-profile-SC-11` |

The card's empty state survives as an export, but this surface never selects
it: the read always answers.
