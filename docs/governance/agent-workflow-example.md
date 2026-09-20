# A change from proposal to archive, with an agent

One feature — cross-sell on a card's page — walked through both repositories
with an agent. Every command here is real. What each hand says, and where they
say it, is under
[What to say to the agent](../prds/guides/working-a-change.md#what-to-say-to-the-agent).

## Where You Run This

Everyone works in `grade10`, including PM and design. Its `openspec/` is
config-only with `store: grade10-spec`, so every `openspec` command run there —
`new change`, `status`, `instructions`, `validate` — prints
`Using OpenSpec root: grade10-spec (…)` and writes into your store clone at its
absolute path; the files it creates and the commits against them are the store clone's.

- **The line commands live in the store clone.** A terminal run from `grade10`
  reads `/plan`, `/design`, `/tech`, `/specify`, `/tasks`, `/build` and `/land`,
  the `round` skill, the schema's perspectives and the reader definitions under
  `.claude/agents/` from the clone you add with `/add-dir` — never from the
  submodule directory pinned to an older sha, because a round read from a pin is
  held to last month's rules. `grade10` ships its own skills (`tdd`,
  `testing-lanes`, and others), and those stay its own
- **`openspec instructions <artifact> --change <name>` substitutes for the
  per-artifact rules, and for nothing else** — the same project context, that
  artifact's rules and its template. The round, its readers and the landing are
  the store clone's, so a session without it can draft an artifact and cannot
  land one
- **The rules are not commands.** `planning-pm` and `planning-dev`, which
  `/plan`, `/tech` and `/tasks` load, carry every artifact's rules;
  `planning-design` and `planning-qa` are `/design`'s and `/specify`'s. Nobody
  types them
- **An agent in `grade10` reads that repository's `AGENTS.md`**, not this
  store's — what this store expects arrives with the skills and the
  instructions read from the clone
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

**1. Say what is wanted.** One message to the app in the planning channel, or
the same sentence after `/plan` in a terminal:

```text
/plan cross-sell on a card's page: the products we pick per card in Shopify
first, then similar cards by the tags and the facets they share, up to six.
Customers-also-bought from orders is phase two, once this ships.
```

The run opens the change: `add-store-cross-sell`, `schema: grade10-planning`,
the branch `claude/add-store-cross-sell`, `hands: pm: @ecchochan`, and the
thread that message started. The capability is
`grade10-site/store/cross-sell`, new, beside a delta on
`grade10-site/store/product-page` for the rail's place on the page. Nobody
creates the change by hand; a directory made by hand records nothing at all.

**2. Read what it drafted, and the two rows it held.** The run marks
`docs/prds/products/grade10-site/store/cross-sell.md` first — one line per
outcome, ❓ on what is open — links that section from the proposal's
`## References`, and drafts every artifact after it on the branch, each read by
its own perspectives, landing nothing. The interview is the questions it asks
you, and two rows wait for your answer:

| Row | The question | Recommended | Instead of |
| --- | --- | --- | --- |
| `Q1` | Where the per-card picks live | The complementary products Shopify's Search & Discovery app keeps on the card, set in Shopify admin | An editor in `grade10-admin` — the manual's Site Content page rules product-linked editorial to Shopify, and admin has no store domain |
| `Q2` | Does the rail sell? | It opens a card's page and offers no cart, as the merchandised row on the front door does | The listing tile's cart control |

Everything else the round decided, and says so: six cards; similar is the same
world, then the same type, then the most tags shared, latest first on a tie,
never the card itself; a card nobody can buy stays out of the similar picks,
and a chosen pick stays and shows its status; the heading is "You may also
like"; customers-also-bought is a non-goal of this change, and would be the
store's first behavioural signal. One reply overturns any of them.

**3. Answer, then land.** `Q1: Shopify`, `Q2: no cart`, then `land`. The
page's marks, `proposal.md`, `decisions.md` and
`specs/grade10-site/store/cross-sell/user-journeys.md` reach `main` in that
order with your handle on each — US-01 the picks the shop chose, US-02 similar
cards where a card has none, US-03 a stock keeper's picks in Shopify admin.
The designer and the tech PIC are told in the same thread, and everything
after the journeys is read again. A change with nothing to settle writes
`decisions_waived: <why>` in place of `decisions.md`; an empty `## Decisions`
table is a different claim, that nothing had to be chosen.

## The Engineer Lane

**4. The designer's turn.** In the thread, or `/design add-store-cross-sell`
from a terminal. Nobody has drawn the rail, so the draft writes
`awaiting: ui-design: "2026-09-22, frame for the rail - @kinisworking"` and
describes no screen of its own. The frame arrives as a remark, the rail is one
screen composed from `StoreSectionHeader` and `ProductCard` with five states,
and the designer's word lands `ui-design.md`.

**5. The tech PIC's turn.** `/tech add-store-cross-sell`. The catalogue mirror
gains the card's complementary references and its tags, and the similar rule
runs when the card's page is served, in the response before any script runs.
Every decision names what it was chosen over: Storefront's
`productRecommendations`, Shopify's own ranking rather than the store's facets
and not deterministic, and a nightly precompute, stale inside the window the
mirror already closes. A challenge is a remark, applied as written, and the
tech PIC's word lands `tech-design.md`.

**6. The requirements and the cases.** `/specify add-store-cross-sell` takes
the two readings — `feature-tcs.md` blind of the scenarios, then `spec.md`'s
requirements reconciled against it — and stops on the product manager, who
reads the two side by side and lands both on one word. A contradiction neither
reading settles is a numbered row for them, never an agent's call.
`/tcs-review add-store-cross-sell` walks the drafts one journey at a time and
records each case as `actual`, `deprecated`, or still `draft`.

**7. The board shows it waiting.** In `grade10`:

```bash
pnpm plan
# add-store-cross-sell   no tasks.md yet — still being planned
```

That state is the handoff signal, and it is indistinguishable from a plan the PM has not finished — a finished change has to be picked up, not noticed.

**8. Pick it up, and plan the delivery.** `/tasks add-store-cross-sell`,
picking it up as @your-handle so `promoted_by` lands in the change's
`.openspec.yaml`. Four groups, each with its test task first: the mirror's tags
and picks in `grade10`, the rule and the page response in `grade10`, the rail
block in `packages/ui` in this store, and the walk of US-01 to US-03 end to
end. The engineer reads the summary, and their word lands `tasks.md`.

**9. Claim and build.** A group can be claimed only once its `tasks.md` is on
`main`:

```bash
pnpm plan claim add-store-cross-sell 2
pnpm plan sync
```

The claim lands on this store's `main`, whatever branch the store clone is on, so it needs no sync first. `sync` is for reading: it fast-forwards a store clone on `main`, so what the agent reads is the merged artifacts. On any other branch it refuses — switch the clone to `main` first. Then `/build add-store-cross-sell 2`: the tests the group's scenario ids name, in their own commit, then the code, then the group's readers, then the group's row in `rounds.md`.

**10. Tick off after pushing, never before.** Each lands as a commit on this store's `main`, and the engineer's store clone is left untouched.

```bash
pnpm plan done add-store-cross-sell 2.1 2.2
```

**11. Archive once deployed** — not when the code merges. Fold the accepted
deltas into `openspec/specs/grade10-site/store/cross-sell/spec.md`, take the
marks off the page's lines, and confirm the page still describes the decision.
`pnpm run archive:preflight add-store-cross-sell` prints what still refuses —
proof of deploy, every task ticked, nothing behind what it was drawn from, the
feature set and `user-journeys.md` carried across, and `--decisions-carried`
naming the decision rows that outlived the change — and names
`openspec archive add-store-cross-sell` as the step after it. None of those
could be ticked before the deploy, so the plan carries no task for them.

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
  the change up and let `/tasks` draft the plan for your word

## See Also

- [Working a change](../prds/guides/working-a-change.md) — who writes what, what each hand says, and how you know it is your turn
- [`prd-and-openspec.md`](prd-and-openspec.md) — the lifecycle, and promotion in full
- [`task-ownership.md`](task-ownership.md) — the `tasks.md` format both tools parse
- [`ui-component-contracts.md`](ui-component-contracts.md) — before a public UI contract changes
