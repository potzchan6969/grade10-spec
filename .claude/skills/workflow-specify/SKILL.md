---
name: workflow-specify
description: Run a round on a change's requirements and cases - spec.md's outline, the two blind readings, the reconciliation and the requirements - and land both files on the product manager's word. Use when a change's proposal, decisions and journeys are on main. Invoke as /workflow-specify <change>.
---

# The Requirements' Round

**The artifacts:** `specs/<capability>/spec.md` and
`specs/<capability>/feature-tcs.md`, together. Neither names a teammate: the
product manager is the hand, and reads them side by side.

**The rules:** `planning-qa` - the outline, the isolated input the blind pass
reads, the dispositions and the reconciliation, all governed by
[`docs/governance/specs-to-test-cases.md`](../../../docs/governance/specs-to-test-cases.md) -
plus:

```bash
openspec instructions specs --change <change>
openspec instructions test-cases --change <change>
```

Then follow `workflow-round`. Its challenge and verify steps are different here, and
nothing else is.

## The Blind Readings Are the Challenge

- **Challenge** — the two independent readings of the change's anchors: the
  scenarios and the blind suite, neither reader seeing the other's output
- **Verify** — their reconciliation, taken by the run that took both readings.
  No verifier agent reads them, and no agent decides between them
- **Stops on the product manager** — a disagreement or a question neither
  reading can settle is a numbered `Q<n>` row for them; the blind pass's own
  findings go to `decisions.md`'s `## Raised` table as `planning-qa` says
- **One word, both files** — the product manager's word at the reconciliation
  lands `spec.md` and `feature-tcs.md` together

## The Tech Design Is What Is Before Them

- **Read it** — the requirements pass reads `tech-design.md` beside
  `ui-design.md`; a requirement contradicting either is not written
- **A requirement that reaches the design** — write a dated wait on the tech
  PIC rather than writing over them:
  `awaiting: tech-design: "<date>, <requirement> re-read - @<tech>"`. It is
  cleared by the tech PIC's edit or by that artifact's `reviewed:` line, and
  it holds no stage
- **Delete the wait you answered** — the change's `awaiting: specs:` line
  named this pass; it goes as the requirements land
