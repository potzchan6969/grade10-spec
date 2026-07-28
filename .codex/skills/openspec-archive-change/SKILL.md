---
name: openspec-archive-change
description: Finalize a completed OpenSpec change and preserve its decision history.
---

# Archive an OpenSpec change

1. Read `tasks.md` and confirm every required task is complete; call out any intentional exception.
2. Sync accepted delta requirements from `openspec/changes/<change>/specs/` into `openspec/specs/`.
3. Confirm linked PRD decisions still match the delivered behavior.
4. Move the change to `openspec/changes/archive/YYYY-MM-DD-<change-name>/` without dropping its proposal, design, or task history.
5. Summarize the archived path, durable specs updated, and any follow-up work.
