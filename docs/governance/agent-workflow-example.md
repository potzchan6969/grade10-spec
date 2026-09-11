# A change from proposal to archive, with an agent

The other governance documents state the rules. This one walks one feature —
an account settings page — through both repositories, so the handoff is
visible in one place. Every command here is real; nothing is illustrative.

| Artifact | Written by | Where |
| --- | --- | --- |
| `proposal.md`, `specs/<capability>/spec.md`, `specs/<capability>/user-journeys.md` | PM — `/planning-pm` | this store |
| `specs/<capability>/feature-tcs.md` | PM — `/planning-pm`, reviewed by QA — `/tcs-review` | this store |
| `ui-design.md` | Designer — `/planning-design` | this store |
| `tech-design.md`, `tasks.md` | The engineer planning the delivery — `/planning-dev` | this store |
| Owner tags, checkmarks | The engineer doing the work | `grade10`, writing through to this store |

## Where you run this

Everyone works in `grade10`, including PM and design. That repository's
`openspec/` is config-only with `store: grade10-spec`, so every `openspec`
command run there resolves to this store — it prints
`Using OpenSpec root: grade10-spec (…)` and writes into your store clone at its
absolute path. `openspec new change`, `status`, `instructions`, and `validate`
all work from `grade10`; the files they create and the commits you make against
them belong to the store clone, not to `grade10`.

Most skills do not carry across: **they live in the store clone.** `grade10`
ships its own (`tdd`, `testing-lanes`, and others), so `/openspec-propose` and
`/openspec-archive-change` are not available there. The CLI is the substitute,
and it is not a lesser one — `openspec instructions <artifact> --change <name>`
returns the same project context, the same per-artifact rules (the grilling
interview among them), and the same template the skill would have applied. Ask
your agent to follow that output.

The role skills are the exception. `/planning-pm` and `/planning-dev` exist in
both repositories, and the two copies are not the same file: the store's
carries every artifact's rules, and `grade10`'s carries what is specific to
picking work up there — planning delivery on a change that has no `tasks.md`,
and the verification steps its own task groups end with. Each points at the
other for the half it does not hold, so neither is a second source of truth for
the same thing.
Nothing syncs skills between the repositories, so keep it that way: a rule
about what an artifact must contain belongs in the store's copy only.

There is never a second change to open in `grade10` — it has no planning shape
of its own to hold one.

### Give the agent the store clone, and only the store clone

The CLI writes its own files, so `openspec new change`, `status`, `validate`,
and `instructions` all run from `grade10` untouched. Drafting is different: the
agent writes `proposal.md` and the delta specs itself, into a path *outside*
`grade10`. Add the store clone to its working directories first — `/add-dir`
in-session, or `--add-dir` at launch — or every write stops for a prompt:

```bash
/add-dir <path-to-your-store-clone>    # the one you registered, e.g. ../grade10-spec
```

To stop doing that every session, put it in `grade10`'s
`.claude/settings.local.json` — local, not `settings.json`, because the path is
per-machine and that file is gitignored. `openspec store list` prints the path
to use, and it must be the clone you registered:

```json
{
  "permissions": {
    "additionalDirectories": ["/absolute/path/to/your/grade10-spec"],
    "deny": ["Edit(./external/grade10-spec/**)"]
  }
}
```

The `deny` entry is the belt to that braces: nobody should hand-edit a pinned
submodule checkout for any reason, so denying writes there costs nothing and
closes the trap below.

**Do not let it write to `external/grade10-spec/`.** That submodule is the same
upstream repository, checked out at the SHA this repo pins — today ten commits
behind — and it carries a complete `openspec/` tree: `changes/`, `specs/`,
`schemas/`, `config.yaml`. It sits inside the project root, so writing there
draws no permission prompt at all, and a proposal written into it will validate,
read correctly, and be invisible to the store, to `pnpm plan`, and to everyone
else. The store clone is the registered one, read at its own `main`; the
submodule is a pinned copy for building packages against. If your agent cannot
reach the store clone, fix the working directory rather than accepting the path
that happens to be writable.

One more asymmetry: an agent in `grade10` reads that repository's `AGENTS.md`,
not this store's. Everything this store expects of a proposal or a spec arrives
through `openspec instructions`, which is why step 2 comes before any drafting.

## Prompts that start each lane

Most of us drive this workflow through an agent rather than typing the CLI
commands ourselves, so the prompts come first; the lanes below are the
step-by-step reference for what the agent does with them. They are starting
points — swap the feature for yours — but each line in them exists because a
step below requires it.

**The PM lane.** The stop-point has to be said out loud: an agent that drafts
`tasks.md` unprompted erases the handoff signal in step 6.

```text
Draft an OpenSpec change proposal for a collector account settings page —
notification preferences and a shipping address.

Create it with `openspec new change account-setting-page`, then run
`openspec instructions proposal --change account-setting-page` and work from
what it returns, the grilling interview included.

I'm writing this as a PM: produce only proposal.md, the spec deltas, and the
user-journeys.md beside each. Do not write ui-design.md, tech-design.md, or
tasks.md — the engineer who picks this up writes those.

Before drafting, read the relevant capability in openspec/specs/, any active
change touching it, and the capability's page in `docs/prds/`. Identify affected component exports
and consumer apps in the proposal. Keep every requirement testable; rationale
that isn't testable belongs in the page's Product decisions block, not the spec.
```

**Planning the whole change yourself.** When the author is the engineer who
will also plan the delivery, one change carries everything:

```text
Draft an OpenSpec change for adding a "report listing" action to the
ListingCard component in @grade10/ui.

This change carries its implementation plan end to end — proposal, spec
deltas, user-journeys.md, tech-design.md, ui-design.md, tasks.md. Run
`openspec instructions <artifact> --change report-listing` before each
artifact and work from what it returns.

Before writing:
- Read the ListingCard capability spec in openspec/specs/ and confirm which
  exports the contract names today.
- Read docs/governance/ui-component-contracts.md — this is a
  component-contract change, so the delta must name the exact exports
  affected and the consuming applications that must adapt.
- Read docs/governance/task-ownership.md so tasks.md uses the parseable
  group/owner format.

In tech-design.md, record how the report flow reaches the application (callback
prop vs. a new compound part) as a choice with alternatives, not as an
objective improvement. Keep the change to this one component capability.
```

**Picking one up.** The engineer lane's step 7, as a prompt:

```text
Plan delivery for the account-setting-page change. Leave the proposal, the
spec deltas and the journeys untouched; add promoted_by: @my-handle to its
.openspec.yaml, then write tech-design.md, ui-design.md, and tasks.md.
Run `openspec instructions <artifact> --change account-setting-page` for
each, and follow docs/governance/task-ownership.md for the tasks format.
```

The proposal rules run the grilling interview by default (step 3 below). Say
"skip the interview, draft from what I've given you" when the prompt already
carries the decisions — otherwise expect to be questioned before anything is
written.

## The PM lane

> "Collectors need an account settings page — notification preferences and a
> shipping address."

**1. Create the change.** There is one lane, and a PM writing requirements
walks the first three artifacts of it. From `grade10`:

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

This is what stands in for `/openspec-propose`, which is not installed in
`grade10` — though `/planning-pm` there will run it for you and read the
store's own copy of the lane instructions. It returns the store's project context, the
proposal rules, and the template. Before writing anything, the agent should read the relevant capability
in `openspec/specs/`, any active change touching it, and the PRD — facts are the
agent's job, decisions are yours.

**3. Expect to be interviewed.** Those rules require the `grilling` skill, so
the agent runs a round-based interview before drafting and does not write until
the frontier is empty. It asks for your `@handle` rather than guessing the
author line. The skill itself lives in the store clone at
`.claude/skills/grilling/SKILL.md`, and the rule names that path — point your
agent at it if it cannot find the skill by name.

**4. The agent writes three things.** `proposal.md` — author line, the
collector problem and its evidence, a metric that would move, non-goals, the
capabilities touched — `specs/grade10-site/store-account-settings/spec.md`,
where every requirement carries at least one `#### Scenario:` a test or a
manual pass can decide, and
`specs/grade10-site/store-account-settings/user-journeys.md`, where each story
lists the scenario ids that accept it.

**5. Check and push.**

```bash
openspec validate account-setting-page --strict
openspec status --change account-setting-page   # proposal, specs, journeys written
```

The PM lane ends here. No `tech-design.md`, no `tasks.md`, and nothing testable
left in the PRD.

## The engineer lane

**6. The board shows it waiting.** In `grade10`:

```bash
pnpm plan
# account-setting-page   no tasks.md yet — still being planned
```

That state is the handoff signal. It is also indistinguishable from a plan the
PM has not finished, which is why a change whose requirements are done has to
be picked up rather than noticed.

**7. Pick it up.** Delivery is planned here, by the engineer who will build it,
on the same change. The file being edited lives in the store clone; the command
still runs from `grade10`:

```bash
# <store-clone>/openspec/changes/account-setting-page/.openspec.yaml
#   add:  promoted_by: @my-handle
openspec status --change account-setting-page   # lists what is still to write
```

Then write `tech-design.md` (decisions and the alternatives behind them),
`ui-design.md` (one subsection per screen, linking the Figma frame), and
`tasks.md`. Groups split by layer, no owner tags,
each task phrased as the spec scenario it makes pass. Validate and push.

**8. Claim and build.**

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

**10. Archive once deployed** — not when the code merges.

```bash
openspec instructions archive --change account-setting-page
```

Same substitution as step 2: `/openspec-archive-change` is not in `grade10`, and
this returns the store's archive guidance instead. Fold the accepted deltas into
`openspec/specs/`, confirm the PRD still describes the decision, then
`openspec archive account-setting-page`.

## Where this goes wrong

- **Editing a live `tasks.md` from a stale clone.** Run
  `pnpm run plan:preflight account-setting-page` first; it refuses a stale or
  dirty copy and prints the owners and counts you are about to edit on top of.
  This one is a script in the store clone, not a `pnpm plan` subcommand — run it
  from there, not from `grade10`.
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
