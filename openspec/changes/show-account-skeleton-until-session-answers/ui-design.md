## Screens

### Site header before the session answers

The header's layout source of truth is Storybook, as `Nav`'s doc comment says, and the page documents it through its SiteHeader stories rather than a Figma frame. The reference for this state is the pending SiteHeader stories, wide and at 375px, beside `SignedIn`, which `tasks.md` 1.1 adds and 1.3 cards on both pages.

## Components

- **`SiteHeader`** (`packages/ui`, `blocks/site-chrome`) - takes a pending
  session and draws the placeholder in the account entry's place. Work in this
  store: a new value of `SiteHeaderSession`
- **`Skeleton`** (`packages/design-system`, `display/skeleton`) - the
  placeholder. No `shape` is a 40px circle, so the block sizes it to the
  account icon's footprint rather than adding a primitive variant. It
  announces itself as a busy status by default, which the header keeps silent
  (`decisions.md` Q5)
- **`IconButton`** (`packages/design-system`, `forms/icon-button`), size `md`
  - the account icon's 40px footprint the placeholder matches
- **Messages** - none new

## States

### Site header

| State | Shows | Anchor |
| --- | --- | --- |
| Session not yet answered | A 40px round placeholder in the account entry's place, with nothing to press and nothing read aloud | `grade10-site-site-page-shell-SC-68`, `grade10-site-site-page-shell-SC-75`, `grade10-site-site-page-shell-SC-76`, `shared-ui-site-chrome-SC-45`, `shared-ui-site-chrome-SC-46`, `shared-ui-site-chrome-SC-47`, `shared-ui-site-chrome-SC-48` |
| Session not yet answered, compact bar | The same placeholder beside Cart in the compact bar | `grade10-site-site-page-shell-SC-68`, `shared-ui-site-chrome-SC-45`, `shared-ui-site-chrome-SC-47` |
| Page written before any session is read | The placeholder | `grade10-site-site-page-shell-SC-69`, `grade10-site-site-page-shell-SC-77` |
| Answered signed in | The account icon, in the placeholder's place | `grade10-site-site-page-shell-SC-70` |
| Answered signed out | Sign In; on the wide header, the language and search controls move left by its extra width | `grade10-site-site-page-shell-SC-05` |
| Session read failed | Sign In | `grade10-site-site-page-shell-SC-71` |
| Re-read after the first answer | The entry already shown, unchanged | `grade10-site-site-page-shell-SC-72`, `grade10-site-site-page-shell-SC-74`, `grade10-site-site-page-shell-SC-78` |
