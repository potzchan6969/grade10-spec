# Durable specifications

Specs are grouped by product, one capability directory per durable product contract:

```text
openspec/specs/<product>/<capability>/spec.md
```

The products are:

- `grade10-store` — the Grade10 prediction-market surfaces (all pre-existing capabilities live here).
- `zzz-store` — no capabilities yet; create `openspec/specs/zzz-store/<capability>/` with its first spec.

A capability's OpenSpec ID is `<product>/<capability>` (for example `grade10-store/loyalty`); use that ID with `openspec show` and `openspec validate`. Adding a product is a new top-level directory here plus a bullet in this list.

These specs hold current requirements. An active change may contain a focused delta spec under `openspec/changes/<change>/specs/<product>/<capability>/`; sync the accepted delta into this directory before archiving the change.
