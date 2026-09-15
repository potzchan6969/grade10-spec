# Task ownership in `tasks.md`

A change's `tasks.md` is written here and checked off from the application repository. When several engineers implement one change at once, the file also has to record who is on which group. This document is the single definition of how it does that; the tools on both sides implement this text and must not extend it privately.

## Where it applies

`openspec/changes/<change-id>/tasks.md` in this store. Nothing else reads the convention, and no other file in this repository carries owners.

A change has no `tasks.md` until it is planned that far, and both boards render that state as "still being planned". A change whose author finished at the requirements stays in it by design until an engineer picks it up and writes the plan — see [`prd-and-openspec.md`](prd-and-openspec.md) — so someone picking it up, not a message, is what puts the work in front of an engineer.

## The format

A group is a level-two heading numbered with a single integer. Its tasks are checkbox list items whose first token is the task id.

```markdown
## 1. Spec the contract (owner: @alice)

- [x] 1.1 Draft the requirement
- [ ] 1.2 Review with design

## 2. Build the primitive

- [ ] 2.1 Component skeleton
- [ ] 2.2 Stories
```

| Element | Form | Notes |
| --- | --- | --- |
| Group heading | `## <n>. <title>` | `<n>` is one integer. `##` exactly — `###` is not a group. |
| Owner tag | `(owner: @<handle>)` | Optional, and **last on the line**. The `@` is optional; handles may hold letters, digits, `.`, `-`, `_`, and match case-insensitively. |
| No owner | Omit the tag, or write `(owner: unassigned)` | The two are equivalent everywhere. |
| Task | `- [ ] <id> <text>` | `- [x]` or `- [X]` when done. `<id>` is the first whitespace-delimited token; `<text>` is required. |

A group title that names a repository names it by clone name — `(grade10-spec)`, `(grade10)` — never "this repo" or "here": `tasks.md` is written in this store and read from the application repository, so a deictic reference flips meaning between the two.

The trailing parenthetical is read as a repository, whatever it says. A product or domain name — `grade10-site`, `auction` — goes in the title before it, never in the tag: `## 1. Vault (grade10-spec)`, not `## 1. Vault (grade10-site)`. A group tagged with a product, or not tagged at all, reads as work outside this store, and `pnpm check:manual` then asks the change for a `tech-design.md` it does not owe.

Task ids are conventionally `<group>.<n>`, and they must be unique within a change — the tooling indexes tasks by id, so a duplicate makes one of them unreachable.

Group headings are free for us to use because OpenSpec parses only the checkbox lines. `openspec validate --changes --strict` and the task counts are unaffected by an owner tag; both remain the check that this convention has not broken anything.

## What the tools rely on

- **A number is an address.** An owner is recorded against a group number and a checkmark against a task id, and `pnpm plan done <change> 3.1` names that id. Renumbering a group or a task that is claimed or has checkmarks silently points someone's claim at different work, and every id still validates. Append to the end of a group, or add a new group; to split one, say so in the commit.
- **Owners are claimed at pickup, not assigned at planning time.** A name on a group therefore always means someone is on it now. Author groups without owners and let engineers claim them.
- **Completed work never sits with nobody's name against it.** Checking off a task in an unclaimed group claims that group, and a group with checkmarks cannot be handed back — it keeps its owner as the record of who did the work.
- **A checkmark is a claim that the work is real.** It goes in after the code is pushed, not when it is written.

## Who writes what

| Field | Written by | How |
| --- | --- | --- |
| Groups, task ids, task text | The engineer planning the delivery, in this repository | Directly, after `pnpm run plan:preflight <change-id>` |
| Owner tag | The engineer taking the group | `pnpm plan claim` / `pnpm plan unclaim` in the application repository |
| Checkbox state | The engineer who did the work | `pnpm plan done` / `pnpm plan undone` in the application repository |

A PM or designer writes the proposal, the specs and the journeys, and nothing else: a change of theirs carries no `tasks.md` until an engineer plans the delivery, whether by picking their change up or by writing the whole thing themselves. Whoever writes the task text is therefore the person who will implement it, which is why groups carry no owner tags at that point — an engineer claims a group at pickup, and may be claiming their own.

`pnpm plan` records claims and checkmarks as commits on this store's `main` and never touches a clone, so nobody syncs or pushes for them. A hand edit to `tasks.md` is made in a clone: merge it soon, because every claim and checkmark that lands on `main` meanwhile can conflict with it.

## What the parser does not forgive

These are silent — the line is skipped or misread, and nothing reports an error.

| Written | Result |
| --- | --- |
| `## 1. Build it (owner: @alice) — WIP` | Owner is read, but the tag is only stripped from the end, so the title keeps it |
| `## 1. Vault (grade10-site)` | Read as a repository named `grade10-site`; the manual's `design` rule demands a `tech-design.md` |
| `## 3. Admin` | No repository; read as work outside this store, the same demand |
| `## 1.2 Build it` | Group number is `1`; the title becomes `2 Build it` |
| `### 1. Build it` | Not a group at all; its tasks attach to the previous group |
| `- [ ] 1.1` | Not a task — the text after the id is required, so the task is invisible to every count |
| `- [ ] Draft the requirement` | Parses as id `Draft` with text `the requirement` |
| `* [ ] 1.1 Draft it` | Not a task; the bullet must be `-` |
| `- [] 1.1 Draft it` | Not a task; the box must contain a space or an `x` |

A task line before the first group heading is ignored.

## The tools

| Tool | Repository | Purpose |
| --- | --- | --- |
| `scripts/openspec/plan-preflight.mjs` | this one | Before anyone edits a `tasks.md` engineering is implementing: refuses a dirty copy, or one behind this store's `main`, then prints the owners and counts being edited on top of |
| `scripts/openspec/plan.mjs` | `grade10` | The engineer's board, plus `claim`, `unclaim`, `done`, and `undone`, each pushing one commit to this store's `main` |

Both parse this format independently — the application repository consumes this repository as a submodule and an OpenSpec store, not as a library, so there is no shared module to import. Change this document first when the convention changes, then both implementations, and check the table above for anything a change would silently invalidate.
