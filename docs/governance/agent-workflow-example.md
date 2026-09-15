# A change from proposal to archive, with an agent

One feature — an account settings page — walked through both repositories with
an agent. Every command here is real. Who writes which artifact, and the prompt
each teammate types, is one prompt per teammate under
[What to say to the agent](../prds/guides/working-a-change.md#what-to-say-to-the-agent).

## Where You Run This

Everyone works in `grade10`, including PM and design. Its `openspec/` is
config-only with `store: grade10-spec`, so every `openspec` command run there —
`new change`, `status`, `instructions`, `validate` — prints
`Using OpenSpec root: grade10-spec (…)` and writes into your store clone at its
absolute path; the files it creates and the commits against them are the store clone's.

- **Most skills live in the store clone.** `grade10` ships its own (`tdd`,
  `testing-lanes`, and others); `/openspec-propose` and `/openspec-archive-change`
  are not there. The substitute is `openspec instructions <artifact> --change <name>`
  — the same project context, per-artifact rules (the grilling interview among them) and template
- **The role skills exist in both, and are not the same file.** The store's
  `/planning-pm` and `/planning-dev` carry every artifact's rules; `grade10`'s carry
  only picking work up there. Nothing syncs them: a rule about what an artifact must contain belongs in the store's copy only
- **An agent in `grade10` reads that repository's `AGENTS.md`**, not this
  store's — what this store expects arrives through `openspec instructions`,
  which is why step 2 comes before drafting
- **There is never a second change to open in `grade10`** — it has no
  planning shape of its own to hold one

### Give the Agent the Store Clone, and Only the Store Clone

The CLI writes its own files from `grade10` untouched. Drafting is different: the
agent writes `proposal.md` and the delta specs itself, into a path *outside*
`grade10`. Add the store clone to its working directories first, or every write stops for a prompt:

```bash
/add-dir <path-to-your-store-clone>    # the one you registered, e.g. ../grade10-spec
```

To stop doing that every session, put it in `grade10`'s `.claude/settings.local.json`
— local, because the path is per-machine and that file is gitignored. `openspec store list` prints the path to use:

```json
{
  "permissions": {
    "additionalDirectories": ["/absolute/path/to/your/grade10-spec"],
    "deny": ["Edit(./external/grade10-spec/**)"]
  }
}
```

**Do not let it write to `external/grade10-spec/`.** That submodule is the same
upstream repository at the SHA this repo pins, with a complete `openspec/` tree,
inside the project root, so writing there draws no permission prompt — and a
proposal written into it validates, reads correctly, and is invisible to the store,
to `pnpm plan`, and to everyone else. If your agent cannot reach the store clone, fix the working directory; the `deny` entry above closes the trap.

## The PM Lane

**1. Create the change.** From `grade10`:

```bash
openspec new change account-setting-page
# Created change 'account-setting-page' at <store-clone>/openspec/changes/account-setting-page/
```

This records `schema: grade10-planning` in the change's `.openspec.yaml`.
Creating the directory by hand records nothing at all.

**2. Pull the instructions, and have the agent work from them.**

```bash
openspec instructions proposal --change account-setting-page
```

`/planning-pm` in `grade10` runs this for you and reads the store's own copy of
the lane instructions. What the agent reads first is `/planning-pm`'s — facts are the agent's job, decisions are yours.

**3. Expect to be interviewed.** The rules require the `grilling` skill, which
lives in the store clone at `.claude/skills/grilling/SKILL.md`; the rule names
that path, so point your agent at it if it cannot find the skill by name.

**4. The agent writes four files.** `proposal.md`, then
`specs/grade10-site/store-account-settings/spec.md`, `user-journeys.md` and
`feature-tcs.md` beside it — after the PRD carries a 🚧 line per outcome
and the proposal links that section; `pnpm check:manual` refuses a change with neither the mark nor `page_waived`.

**5. Check and push.**

```bash
openspec validate account-setting-page --strict
openspec status --change account-setting-page   # proposal, specs, journeys written
```

## The Engineer Lane

**6. The board shows it waiting.** In `grade10`:

```bash
pnpm plan
# account-setting-page   no tasks.md yet — still being planned
```

That state is the handoff signal, and it is indistinguishable from a plan the PM has not finished — a finished change has to be picked up, not noticed.

**7. Pick it up.** On the same change. The file lives in the store clone; the command still runs from `grade10`:

```bash
# <store-clone>/openspec/changes/account-setting-page/.openspec.yaml
#   add:  promoted_by: @my-handle
openspec status --change account-setting-page   # lists what is still to write
```

Then `tech-design.md` and `tasks.md` as `/planning-dev` says, with
`openspec instructions <artifact> --change account-setting-page` before each; a
designer adds `ui-design.md` with `/planning-design`. Validate and push.

**8. Claim and build.**

```bash
pnpm plan sync
pnpm plan claim account-setting-page 2
openspec instructions apply --change account-setting-page
```

The instructions return the tasks plus this store's apply guidance, which sends the agent to `grade10`'s own `tdd` skill: a failing test at a spec scenario first.

**9. Check off after pushing, never before.** Each lands as a commit to this store from the engineer's clone.

```bash
pnpm plan done account-setting-page 2.1 2.2
```

**10. Archive once deployed** — not when the code merges.

```bash
openspec instructions archive --change account-setting-page
```

Same substitution as step 2. Fold the accepted deltas into `openspec/specs/`,
confirm the PRD still describes the decision, then `openspec archive account-setting-page`.

## Where This Goes Wrong

- **Editing a live `tasks.md` from a stale clone.** Run
  `pnpm run plan:preflight account-setting-page` first; it refuses a stale or dirty
  copy and prints the owners and counts you are about to edit on top of. It is a script in the store clone, not a `pnpm plan` subcommand — run it there
- **Renumbering a claimed group.** A claim is recorded against a group number
  and a checkmark against a task id, so renumbering repoints someone's claim
  while every id still validates. Append instead
- **A testable statement in the proposal or the PRD.** It belongs in the spec;
  see [`prd-and-openspec.md`](prd-and-openspec.md)
- **Asking the PM for a task list.** Their part finished at the specs; promote the change and write the tasks yourself

## See Also

- [Working a change](../prds/guides/working-a-change.md) — who writes what, the prompt per teammate, and how you know it is your turn
- [`prd-and-openspec.md`](prd-and-openspec.md) — the lifecycle, and promotion in full
- [`task-ownership.md`](task-ownership.md) — the `tasks.md` format both tools parse
- [`ui-component-contracts.md`](ui-component-contracts.md) — before a public UI contract changes
