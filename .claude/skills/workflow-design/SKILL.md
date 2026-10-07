---
name: workflow-design
description: Run a round on a change's ui-design.md - the screens, the exports each composes and the states each carries - from the journeys. Use when a change alters something a user sees. Invoke as /workflow-design <change>.
---

# The Designer's Round

- **Scope** - Draft `ui-design.md` for the named change from its linked PRD sections, proposal, decisions and journeys. A change with no user-facing surface records `ui_waived: <why>` instead.
- **Artifact Rules** - Use [planning-design](../planning-design/SKILL.md) for the design reference, screens, components and States table. Read the enriched artifact instructions:

```bash
openspec instructions ui-design --change <change>
```

- **Round** - Follow `workflow-round` ([skill](../workflow-round/SKILL.md)) with the change and `ui-design` artifact for its readers, summary and landing.
- **The frames come from the designer** - The ask carries the frame links. A screen no frame in the ask covers writes a dated `awaiting: ui-design: "<date>, <screen> - @<handle>"` line in the change's record, and the draft describes no screen of its own in its place.
- **New Change** - Route a designer specifying a new change through [workflow-plan](../workflow-plan/SKILL.md) first, passing the requested outcome and design reference.
- **Completion** - Return the design draft and round outcome, or the recorded wait for missing design input.
