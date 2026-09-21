---
title: Grading operations
icon: medal
---

The operator half of grading. A submission is picked up from a queue cut by
what it waits for, checked and signed at the counter, paid at the till,
batched to a grader, received against the grader's manifest and handed back
against a receipt; every default the counter runs on is a setting the console
reads.

The collector's half — the plan, the drop-off, the submission page, the paper
and the messages — is [Grading](/p/grade10-site/grading), and the two are
held to separate specs because they are held by separate people.

| Capability | What it governs | Where it is written up |
| --- | --- | --- |
| `grade10-admin/grading/counter` | The queue's views and badges, the hand-in runbook, refusing a card, the hand-back runbook, the settings, the grants | [Grading Console](/p/grade10-admin/grading/console) |
| `grade10-admin/grading/batches` | Batches out, one grader and one level each: shipping, re-estimating, receiving against the manifest and its exceptions, the safe's cap | [Grading Console](/p/grade10-admin/grading/console#batches) |
| `grade10-admin/grading/submission-record` | One submission's tabs — the cards after the grades, money, documents, timeline — a settlement, a waiver, withdrawing a card | [Grading Console](/p/grade10-admin/grading/console#one-submission) |

:::callout{kind="note"}
The console page is read beside the product's own pages, because a shop
works the console next to the product it serves. The specs are filed under
`grade10-admin` because that is the application held to them.
:::
