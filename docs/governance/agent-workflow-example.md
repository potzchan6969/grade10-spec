# A change from proposal to archive, with an agent

The other governance documents state the rules. This one walks one feature —
an account settings page — through both repositories, so the handoff is
visible in one place. Every command here is real; nothing is illustrative.

| Artifact | Written by | Where |
| --- | --- | --- |
| `proposal.md`, `specs/` | PM or designer | this store |
| `design.md`, `ui.md`, `tasks.md` | The engineer planning the delivery | this store |
| Owner tags, checkmarks | The engineer doing the work | `grade10`, writing through to this store |

Both roles run their agent against a clone of this store. The application
repository has no planning shape of its own — its `openspec/` is config-only
and resolves here — so there is never a second change to open over there.

## The PM lane

> "Collectors need an account settings page — notification preferences and a
> shipping address."

**1. Invoke the skill.** `/openspec-propose`. It reads the relevant capability
in `openspec/specs/`, any active change touching it, and the PRD before asking
anything: facts are the agent's job, decisions are yours.

**2. The schema follows the author.** A PM writing requirements takes
`pm-planning`, which ends at the specs.

```bash
openspec new change account-setting-page --schema pm-planning
```

This records `schema: pm-planning` in the change's `.openspec.yaml`. Creating
the directory by hand records nothing, and the change silently takes the
`full-planning` default from `openspec/config.yaml`.

**3. Expect to be interviewed.** The proposal rules require the `grilling`
skill, so the agent runs a round-based interview before drafting and does not
write until the frontier is empty. It asks for your `@handle` rather than
guessing the author line.

**4. The agent writes two things.** `proposal.md` — author line, the collector
problem and its evidence, a metric that would move, non-goals, the capabilities
touched — and `specs/grade10-store/account-settings/spec.md`, where every
requirement carries at least one `#### Scenario:` a test or a manual pass can
decide.

**5. Check and push.**

```bash
openspec validate account-setting-page --strict
openspec status --change account-setting-page   # 2/2 artifacts complete
```

The PM lane ends here. No `design.md`, no `tasks.md`, and nothing testable left
in the PRD.

## The engineer lane

**6. The board shows it waiting.** In `grade10`:

```bash
pnpm plan
# account-setting-page   no tasks.md yet — still being planned
```

That state is the promotion signal. It is also indistinguishable from a plan
the PM has not finished, which is why a finished `pm-planning` change has to be
promoted rather than noticed.

**7. Promote it, in the store clone.** Delivery is planned here, by the engineer
who will build it:

```bash
# in the store clone
# .openspec.yaml:  schema: pm-planning  ->  schema: full-planning
openspec status --change account-setting-page   # now lists design, ui, tasks
```

Then write `design.md` (decisions and the alternatives behind them), `ui.md`
(one subsection per screen, linking the Figma frame — `ui.md` stays blocked
until `design.md` exists), and `tasks.md`. Groups split by layer, no owner tags,
each task phrased as the spec scenario it makes pass. Validate and push.

**8. Claim and build.** Back in `grade10`:

```bash
pnpm plan sync
pnpm plan claim account-setting-page 2
openspec instructions apply --change account-setting-page
```

The instructions return the tasks plus this store's apply guidance, which sends
the agent to `grade10`'s own `tdd` skill: a failing test at a spec scenario
first, then only enough code to pass it.

**9. Check off after pushing, never before.**

```bash
pnpm plan done account-setting-page 2.1 2.2
```

Each of these lands as a commit to this store from the engineer's clone.

**10. Archive once deployed** — not when the code merges. Fold the accepted
deltas into `openspec/specs/`, confirm the PRD still describes the decision,
then `openspec archive account-setting-page`. The `openspec-archive-change`
skill covers the sequence.

## Where this goes wrong

- **Editing a live `tasks.md` from a stale clone.** Run
  `pnpm run plan:preflight account-setting-page` first; it refuses a stale or
  dirty copy and prints the owners and counts you are about to edit on top of.
- **Renumbering a claimed group.** A claim is recorded against a group number
  and a checkmark against a task id, so renumbering repoints someone's claim at
  different work while every id still validates. Append instead.
- **A testable statement in the proposal or the PRD.** It belongs in the spec;
  see [`prd-and-openspec.md`](prd-and-openspec.md).
- **Asking the PM for a task list.** Their part finished at the specs. Promote
  the change and write the tasks yourself.

## See also

- [`prd-and-openspec.md`](prd-and-openspec.md) — the lifecycle, and promotion in full
- [`task-ownership.md`](task-ownership.md) — the `tasks.md` format both tools parse
- [`ui-component-contracts.md`](ui-component-contracts.md) — before a public UI contract changes
