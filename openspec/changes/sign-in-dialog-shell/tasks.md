# Tasks — sign-in-dialog-shell

## 1. Move the sign-in shell onto Dialog (grade10-spec) (owner: @sean)

- [ ] 1.1 Add required `open` and `onOpenChange` to `SignInCardProps` and add optional `legal` to `SignInCardCopy`, so a consumer that has not adapted fails to compile — satisfies *Visibility is the consumer's*
- [ ] 1.2 Rebuild `SignInCard` on `Dialog` + `DialogContent` + `DialogHeader` + `DialogBody`, replacing the `Card` composition and dropping `max-w-sm` in favour of `DialogContent`'s own 448px — satisfies *The triggering page stays mounted*
- [ ] 1.3 Set `gap-6` on the `DialogBody` instance, per the design decision to override the body gap locally rather than widening the primitive
- [ ] 1.4 Verify close control, Escape, and scrim activation each call `onOpenChange(false)` and leave the page beneath mounted — satisfies *Dismissing returns the collector to what they were doing*
- [ ] 1.5 Reorder the body to provider slot → divider → step → message, and render neither slot nor divider when `providerSlot` is absent — satisfies *A provider widget is supplied* and *No provider widget*
- [ ] 1.6 Render `copy.legal` as the body's last node when set and omit the node entirely when unset, supplying no wording from the block — satisfies *Legal copy is supplied* and *Legal copy is omitted*
- [ ] 1.7 Run `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test:stories:ui`

## 2. Cover the block against Figma (grade10-spec)

This group needs group 1's class strings to exist; claim it after 1.2 lands.

- [ ] 2.1 Add `packages/ui/src/blocks/auth-sign-in/audit.json` covering the body gap override against `4666:1462`. It is the only class this block writes literally, and `audit-freshness.test.ts` refuses an entry naming classes that live in another module — the shell's own values are audited by the design system's `overlays/audit.json`
- [ ] 2.2 Run `pnpm run design-sync:audit --all-blocks` and reconcile any value it reports, so `auth-sign-in` no longer lists as carrying no audit table
- [ ] 2.3 Update `sign-in-card.stories.tsx` for the controlled dialog: an open story, a story with a provider slot, one without, and one carrying `legal`

## 3. Adopt the new shell (grade10) (owner: @sean)

Needs the submodule bump that carries groups 1 and 2.

- [x] 3.1 Bump the `external/grade10-spec` submodule SHA
- [x] 3.2 Own `open` state at each place sign-in is triggered and pass `open` / `onOpenChange`, replacing the navigation to the sign-in route
- [x] 3.3 Delete the sign-in route and its page, and confirm a sign-in started from the cart returns to the cart with its state intact — satisfies *The triggering page stays mounted*
- [x] 3.4 Supply `copy.legal` from the message catalog if the surface shows the legal line design draws
- [x] 3.5 Run the application's lint, typecheck, and test suites
