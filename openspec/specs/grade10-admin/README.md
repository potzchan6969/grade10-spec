# grade10-admin

The grade10 admin site — the operator-facing application behind the grade10
site. What an operator is *allowed* to do across brands is `shared/auth/*`; what
every console looks like and is built from is `shared/console/*`. This directory
holds only the operator surfaces specific to Grade10, grouped by domain.

## `auction`

| Capability | What it governs |
| --- | --- |
| [`auction/listing`](auction/listing/spec.md) | How an authorized operator drafts, creates, publishes, and calls off an auction listing, with its ordered media gallery. |

A capability's OpenSpec ID is `grade10-admin/<domain>/<capability>`. Add one as
a change under `openspec/changes/` rather than directly.
