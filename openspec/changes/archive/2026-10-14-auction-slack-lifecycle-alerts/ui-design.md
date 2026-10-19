# UI design

Copy and warning mark on the existing daily reminder surfaces. No new screen
or Figma frame; layout stays Today's three columns and the daily dialog.

## Screens

### Today - Flagged or still waiting column

Existing Today page column that was Still waiting. Same `ReminderColumn` /
`ReminderGroups` composition as What's New.

- **Title** - Flagged or still waiting, with a warning mark beside the title
- **Caption** - Something wrong or waiting a while, needing your action
- **Empty** - Nothing flagged or waiting too long.
- **Tone** - keeps the existing warning count pill
- **Rows** - flagged rows first (flag reason + wait), then 48-hour waits; same
  row chrome as today

### Daily dialog - Flagged or still waiting list

Same dialog list that was Still waiting.

- **Heading** - Flagged or still waiting, with a warning mark
- **Empty** - Nothing flagged or waiting too long.
- **Rows** - same order and fields as the Today column

## Components

| Export / surface | Role |
| --- | --- |
| Today's `ReminderColumn` in `apps/admin/grade10` | Title, caption, empty copy, warning mark beside the title |
| `ReminderGroups` from `@grade10/frontend-console` | Product groups and rows; no new export |
| Daily dialog in `DailyReminder.tsx` | Matching heading, empty copy and warning mark |

No new design-system primitive, `@grade10/ui` export or i18n catalog key is
required for English operator copy already inlined on Today; catalogue work is
out of scope if the console already ships these strings as props.

## States

### Today - Flagged or still waiting column

| State | Shows | Anchor |
| --- | --- | --- |
| Empty | Column stays; empty copy Nothing flagged or waiting too long. | `grade10-admin-console-daily-reminder-SC-39` |
| Flagged only | Warning mark on the title; flagged rows only, reason and wait | `grade10-admin-console-daily-reminder-SC-103` |
| Flagged and waits | Flagged rows above 48-hour wait rows | `grade10-admin-console-daily-reminder-SC-99` |
| Failed read | Same failure notice and Retry as today | `grade10-admin-console-daily-reminder-SC-40` |

### Daily dialog - Flagged or still waiting list

| State | Shows | Anchor |
| --- | --- | --- |
| Empty list omitted | List left out when the operator has no row | `grade10-admin-console-daily-reminder-SC-27` |
| Flagged rows | Warning mark on the heading; flagged rows first | `grade10-admin-console-daily-reminder-SC-26` |
