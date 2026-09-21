# A change from proposal to archive, with an agent

The commands one feature takes in `grade10`, from the first sentence to the
archive: cross-sell on a card's page. Every command here is real. The feature
itself, and what each hand says, is
[Working a change](../prds/guides/working-a-change.md).

## Where You Run This

Everyone works in `grade10`, including PM and design. Its `openspec/` is
config-only with `store: grade10-spec`, so every `openspec` command run there —
`new change`, `status`, `instructions`, `validate` — prints
`Using OpenSpec root: grade10-spec (…)` and writes into your store clone at its
absolute path; the files it creates and the commits against them are the store clone's.

- **The line commands live in the store clone.** A terminal run from `grade10`
  reads `/workflow-plan`, `/workflow-design`, `/workflow-tech`,
  `/workflow-specify`, `/workflow-tasks`, `/workflow-build` and
  `/workflow-land`, the `workflow-round` skill, the schema's perspectives and
  the reader definitions under `.claude/agents/` from the clone you add with
  `/add-dir` — never from the submodule directory pinned to an older sha,
  because a round read from a pin is held to last month's rules. `grade10`
  ships its own skills (`tdd`, `testing-lanes`, and others), and those stay
  its own
- **`openspec instructions <artifact> --change <name>` substitutes for the
  per-artifact rules, and for nothing else** — the same project context, that
  artifact's rules and its template. The round, its readers and the landing are
  the store clone's, so a session without it can draft an artifact and cannot
  land one
- **The rules are not commands.** `planning-pm` and `planning-dev`, which
  `/workflow-plan`, `/workflow-tech` and `/workflow-tasks` load, carry every
  artifact's rules; `planning-design` and `planning-qa` are
  `/workflow-design`'s and `/workflow-specify`'s. Nobody types them
- **An agent in `grade10` reads that repository's `AGENTS.md`**, not this
  store's — what this store expects arrives with the skills and the
  instructions read from the clone
- **There is never a second change to open in `grade10`** — it has no
  planning shape of its own to hold one
- **Without Slack, the terminal is the whole line.** Every command below runs
  the same round and lands the same way whether or not the Slack app, the
  relay and the Routine are up: `/workflow-land` pushes `main` from your
  terminal on the handle the team map gives your git e-mail, and the push
  workflow posts the landing in the channel as it does for every push. What
  Slack adds is the thread to answer in and the message that says it is your
  turn — [Each Way In](../prds/guides/working-a-change.md#each-way-in)

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

**1. Say what is wanted.** One message to the app in the planning channel, or
the same sentence after `/workflow-plan` in a terminal:

```text
/workflow-plan cross-sell on a card's page: the products we pick per card in Shopify
first, then similar cards by the tags and the facets they share, up to six.
Customers-also-bought from orders is phase two, once this ships.
```

The run opens the change: `add-store-cross-sell`, `schema: grade10-planning`,
the branch `claude/add-store-cross-sell`, `hands: pm: @ecchochan`, and the
thread that message started. The capability is
`grade10-site/store/cross-sell`, new, beside a delta on
`grade10-site/store/product-page` for the rail's place on the page. Nobody
creates the change by hand; a directory made by hand records nothing at all.

**2. Read what it drafted.** The summary and the numbered questions are replies
in that thread, and nothing has landed —
[the sentence](../prds/guides/working-a-change.md#pm--the-sentence).

**3. Answer, then land.** `Q1: Shopify`, `Q2: no cart`, then `land`, which puts
the three files on `main` in order and tells the designer and the tech PIC —
[the first word](../prds/guides/working-a-change.md#pm--the-first-word).

## The Engineer Lane

**4. Pick it up, and plan the delivery.** The board in `grade10` shows it
waiting, and `/workflow-tasks add-store-cross-sell` picks it up as @your-handle so
`promoted_by` lands in the change's `.openspec.yaml` —
[the plan, then the build](../prds/guides/working-a-change.md#engineer--the-plan-then-the-build).

```bash
pnpm plan
# add-store-cross-sell   no tasks.md yet — still being planned
```

**5. Claim and build.** A group can be claimed only once its `tasks.md` is on
`main`, and `sync` refuses a store clone on any branch but `main`; then
`/workflow-build add-store-cross-sell 1`, once per group —
[the plan, then the build](../prds/guides/working-a-change.md#engineer--the-plan-then-the-build).

```bash
pnpm plan claim add-store-cross-sell 1
pnpm plan sync
```

**6. Tick off after pushing, never before.** Each lands as a commit on this store's `main`, and the engineer's store clone is left untouched.

```bash
pnpm plan done add-store-cross-sell 1.1 1.2
```

**7. Archive once deployed**, not when the code merges.
`pnpm run archive:preflight add-store-cross-sell` prints what still refuses and
names `openspec archive add-store-cross-sell` as the step after it —
[staging, the cut, the fold](../prds/guides/working-a-change.md#qa--release-hand--staging-the-cut-the-fold).

## Where This Goes Wrong

- **Editing a live `tasks.md` from a stale clone.** Run
  `pnpm run plan:preflight add-store-cross-sell` first; it refuses a stale or dirty
  copy and prints the owners and counts you are about to edit on top of. It is a script in the store clone, not a `pnpm plan` subcommand — run it there
- **Renumbering a claimed group.** A claim is recorded against a group number
  and a checkmark against a task id, so renumbering repoints someone's claim
  while every id still validates. Append instead
- **A testable statement in the proposal or the PRD.** It belongs in the spec;
  see [`prd-and-openspec.md`](prd-and-openspec.md)
- **Asking the PM for a task list.** Their part finished at the journeys; pick
  the change up and let `/workflow-tasks` draft the plan for your word

## See Also

- [Working a change](../prds/guides/working-a-change.md) — the feature end to end, the hand that lands each file, and how you know it is your turn
- [`prd-and-openspec.md`](prd-and-openspec.md) — the lifecycle, and promotion in full
- [`task-ownership.md`](task-ownership.md) — the `tasks.md` format both tools parse
- [`ui-component-contracts.md`](ui-component-contracts.md) — before a public UI contract changes
