# zzz-site

The ZZZ site — one of the four applications Grade10 ships, and the ZZZ brand's
collector-facing one. Its operator surfaces belong to `zzz-admin`, which has no
capability specified yet. Capabilities are grouped by domain, the same way
`grade10-site` groups its own.

## `site` — the site itself

| Capability | What it governs |
| --- | --- |
| [`site/navigation`](site/navigation/spec.md) | Which surface an address resolves to, how the session corrects an address it decides, what a navigation preserves, and what code a surface costs. |

A capability's OpenSpec ID is `zzz-site/<domain>/<capability>`. Add one as a change
under `openspec/changes/` rather than directly.
