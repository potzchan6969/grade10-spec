## Context

`SignInCard` takes an `exitAction` and draws a ghost button for it under the
status line. `SignInFlow` builds that object from an `onExit` handler and an
`exitLabel` word. Nothing above `SignInFlow` supplies the handler: both sites
and the admin console render the flow without it, so no branch of the product
reaches the button. See `proposal.md` for why that is worth removing.

Two constraints shape the approach:

- The export set is **one requirement**, and `remove-sign-in-code` is already
  folding it. That change is complete, undeployed, and unarchived.
- `@grade10/ui` is consumed from source through a submodule, so the
  application sees a changed export set only when its pinned SHA moves.

## Goals / Non-Goals

**Goals:**

- Dismissal is the only way out the block offers, and the type that described
  the other one stops being published.
- The two clones can be merged in either order without breaking a build.

**Non-Goals:**

- A replacement way out for the console's full-screen sign-in.
- Any change to how dismissal behaves.

## Decisions

**The export-set line rides on `remove-sign-in-code`, not on this change.**
The spec governs the published set as a single requirement, so this change
carries only the behavioural one — `SignInCard` accepts no exit action. The
alternative, a second `## MODIFIED Requirements` block naming the same
requirement here, is what `pnpm check:manual` refuses: whichever change
archived second would revert the first. Sequencing this change's fold behind
the other's was also rejected — it holds a one-line edit hostage to a deploy
that has not happened. The cost of the decision on record: `remove-sign-in-code`
gains a line after being recorded 19/19 done.

**Remove rather than deprecate.** A deprecation cycle exists to give consumers
a window to migrate. `SignInCardAction` has no consumer to migrate, and
`public-exports.test.ts` fails the moment the name comes back, so the window
would protect nothing and the type would outlive its last caller by a release.

**The application group does not wait on a submodule bump.** Dropping a prop
that a component declares optional compiles against the pinned `@grade10/ui`
and against the one this change produces, so the `grade10` group is
independent of the `grade10-spec` group rather than sequenced behind it. The
bump is still carried, as its own group: until the pin moves, the application
builds against a package that still publishes the removed type.

**`common.backToHome` stays in the catalogs.** It was the exit's word, but
both brands' not-found pages answer from the same key, so removing it would
break a surface this change never touched.

## Risks / Trade-offs

- **[This change archives before `remove-sign-in-code`]** → the durable
  export requirement would name a type the package no longer exports.
  Mitigation: the line lives in the other change's delta, so the folds cannot
  cross; `pnpm run archive:preflight` is the gate either way.
- **[A consumer outside these two clones imports the type]** → `@grade10/ui`
  is consumed from source by this monorepo alone and by no published artifact,
  and the name is in no other clone's lockfile. Mitigation: the export
  contract test names the exact published set, so a re-added symbol fails in
  `grade10-spec` before any consumer sees it.
- **[The console later wants a way out]** → it inherits dismissal, which it
  currently swallows on purpose. Mitigation: none needed here; the proposal's
  follow-on names specifying it as behaviour rather than restoring a prop.
