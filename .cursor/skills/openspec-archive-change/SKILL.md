---
name: openspec-archive-change
description: Finalize a completed OpenSpec change and preserve its decision history.
---

# Archive an OpenSpec change

1. Read `tasks.md` and confirm every required task is complete; call out any intentional exception.
2. Fold accepted delta requirements from `openspec/changes/<change>/specs/` into `openspec/specs/`, then re-read the capability spec and confirm it describes the shipped behavior. It is the only record consuming applications build from.
3. Run `openspec validate --specs`.
4. Confirm the linked PRD's decisions still match what shipped. Leave requirements out of it.
5. Move the change to `openspec/changes/archive/YYYY-MM-DD-<change-name>/` without dropping its proposal, design, or task history.
6. Summarize the archived path, the durable specs updated, and any follow-up work.
