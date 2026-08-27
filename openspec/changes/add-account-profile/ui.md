# UI: account profile with basic information

## Screens

**No Figma frame exists for this surface, and none is produced here.** The
`store-profile` block has no published frames and no `.figma.ts` mappings, so a
screen below names its frame as absent; the layout is built from the
requirements in the two deltas.

| Screen | Frame | What is new on it |
| --- | --- | --- |
| Account profile — read view | *none; built from `shared-ui/store-profile`* | The avatar, the read-only email row, and the member-since line. The create-a-profile empty state is gone. |
| Account profile — edit form | *none; built from `shared-ui/store-profile`* | The avatar control: choose a replacement, preview it, remove the current one. |

## Components

| Export | Change |
| --- | --- |
| `ProfileCard` | **No change.** Its contract — a titled card whose body is loading, empty, failed, or the element the application supplies — is recorded for the first time. |
| `ProfileCardCopy`, `ProfileCardProps` | **No change.** |
| `ProfileDetails` | Gains the avatar and the email row. Shows the way into the form only when given both an edit label and an edit handler. |
| `ProfileDetailsCopy` | **No change.** The email is a value, not a word. |
| `ProfileDetailsProps` | Gains the avatar image source, its accessible name, the fallback content, and the email. |
| `ProfileForm` | Gains the avatar control and its preview. Judges no file. |
| `ProfileFormCopy` | Gains the choose and remove labels. |
| `ProfileFormProps` | Gains the current avatar's source, accessible name, and fallback content. |
| `ProfileFormValues` | Gains the avatar outcome: unchanged, removed, or a chosen file. |

Composed from `Avatar`, `AvatarImage`, and `AvatarFallback` in
`@grade10/design-system`, alongside the `Card`, `Text`, `TextInput`, and
`Button` the block already uses. No new primitive, variant, or token.

Bio stays a single-line `TextInput` at 500 characters: the design system
publishes no textarea, and a hand-rolled one is out of bounds. Recorded in
`design.md` as a trade-off, not fixed here.

Copy reaches every control through each component's `copy` prop; the grade10
catalog owns the words.

## States

Each tied to the scenario that defines it.

| Screen | State | Scenario |
| --- | --- | --- |
| Card | Loading | `A loading card shows no profile fields` |
| Card | Failed read | `A failed read is reported`, `A failed card states what happened` |
| Read view | Never saved | `A collector who has never saved sees a profile` — editing, never creation |
| Read view | Nameless session | `A collector whose session carries no name` |
| Read view | No avatar | `A collector who never uploaded sees initials`, `No image source` |
| Read view | Avatar fails to load | `An image that fails to load` |
| Read view | No bio | `A bio is cleared`, `An omitted value is absent, not defaulted` |
| Read view | No member-since | `Member-since is absent before the first save` |
| Read view | Read-only | `A read-only view offers no edit` |
| Form | Avatar chosen | `A chosen image is previewed and reported` |
| Form | Avatar removed | `A removal is reported` |
| Form | Saving | `A save persists and is reflected immediately` |
| Form | Refused save | `A failed save keeps the collector's input`, `The form judges no file` |
| Form | Avatar kept, text refused | `An accepted avatar stands when the text save is refused` |
| Form | Cancelled | `Cancelling discards edits` |

The card's empty state survives as an export but this surface never selects it:
the read always answers, per `A collector who has never saved sees a profile`.
