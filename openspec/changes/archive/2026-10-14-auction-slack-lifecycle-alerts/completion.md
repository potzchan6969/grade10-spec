# Completion Evidence

- **Scope** - Flagged or still waiting on Today, the dialog and the 08:00 Slack list, and Auction's lifecycle Slack alerts for go-live, end, extension, Setup Overdue, Payment Overdue and flag.
- **Implementation** - [PR #1137](https://github.com/9gag/grade10/pull/1137) delivers groups 1 to 3. [PR #1168](https://github.com/9gag/grade10/pull/1168) delivers the walks. The application's `main` at `880f97efac828bbcc8636db315d37f69b96a0bc2` carries both.
- **Source** - Every real job passed on each head. The `gate` check failed only because `main`'s E2E workflow was red, which neither PR touches.
- **Task disposition** - All 25 tasks are checked. Group 5 walked part of its scope, below.

| Check | Result |
| --- | --- |
| `daily-reminder.spec.ts` on the isolated stack | 12 passed |
| `lifecycle-alerts.spec.ts` on the isolated stack | 8 passed, 3 skipped, one expected failure |
| Auction `test/db` suite | 131 files, 1447 tests passed |
| `check:manual`, `tcs:validate` | 0 failures |

- **Walked** - US5-TC1 and US7-TC2 are flipped to automated. Go-live, end, flag, Payment Overdue and a refused send ran against the in-process Slack.
- **Stays manual** - US6-TC1, US6-TC3, US6-TC5, US7-TC1, US7-TC3 and US7-TC4 are walked in part. US6-TC2 needs a bid inside the soft close, Setup Overdue has no fixture that crosses its deadline inside one pass, and US7-TC5 needs an operator to clear a flag. The morning post with the token or channel unset is covered by backend tests, not the stack, which posts to an in-process Slack.
- **Known defect** - The sweep window is seven minutes and the cron fires every five, so a go-live can post twice. `lifecycle-alerts.spec.ts` holds it as an expected failure and the page marks **Once** with ❓. The window needs a decision before that line runs unmarked.
- **CI repair outside the change** - The payment settings E2E helper found fields by an exact role name that no longer matches, so it now finds them by group. The daily reminder walk offers the USD card because the page is USD-only.
- **Availability** - Deployment and human QA remain separate from this implementation record.
