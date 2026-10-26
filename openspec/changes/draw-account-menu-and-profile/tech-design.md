# Design: Account menu avatar follows the profile

Capability delta:
[`grade10-site/site/page-shell`](specs/grade10-site/site/page-shell/spec.md).
The `SiteHeader` contract in `shared/ui/site-chrome` is specified by a
follow-up change, written after `restrict-auctions-by-region` lands.
Motivation: [proposal.md](proposal.md) - Why. Decisions:
[decisions.md](decisions.md).

## Context

The account menu's avatar is drawn by `SiteHeader` in `@grade10/ui`
(`packages/ui/src/blocks/site-chrome/site-header.tsx`). The grade10 site wraps
it in `SiteShell` (`apps/frontend/grade10/src/chrome/SiteShell.tsx`), which
`root.tsx` composes with the session. The profile feature
(`@grade10/store-frontend/profile`) already answers the collector's image as
`profile.avatarUrl` through `useProfile`.

Both halves are built. This design records how they are built and the contract between them; only the site's half is specified by this change.

## Contracts

| Where | Contract | Notes |
| --- | --- | --- |
| `SiteHeader` (`@grade10/ui`) | New optional prop `accountAvatarSrc?: string` | Read only when `session` is `"signed-in"` and `accountEmail` is supplied; no prop, no change for any other consumer |
| `SiteHeader` avatar | `Avatar size="xs"` holding `AvatarImage` when `accountAvatarSrc` is set, and `AvatarFallback` with the initial of `accountEmail` before the `@` | The design-system avatar swaps to the fallback when the image fails, so no broken image shows; the image has `alt=""` and the fallback is `aria-hidden`, as the initial was |
| `SiteHeader` without `accountEmail` | `copy.accountMenuLabel` alone, no `Avatar` | Unchanged; `accountAvatarSrc` is ignored here |
| `SiteShell` (grade10) | New optional prop `accountAvatarSrc?: string`, passed straight to `SiteHeader` | The shell reads no profile and holds no state for it |
| `root.tsx` (grade10) | `useProfile({ enabled: session === "signed-in" && config.gates.profile })`; passes `profile?.avatarUrl ?? undefined` as `accountAvatarSrc` when signed in, else `undefined` | `config.gates.profile` is the gate that already decides whether the Profile item and page exist, so a build without the account page makes no profile read |

## Decisions

- **The image is a prop, the read stays in the site** - `@grade10/ui` blocks
  take content through props and never fetch; the site already owns
  `useProfile`, so the header gains one string and no data dependency
- **One read, shared cache** - the header calls the same `useProfile` the
  account page uses, so the two show one image and a profile save is visible in
  the menu without a second request path
- **Fallback is the avatar's own** - no `onError` state in the header; the
  primitive's fallback is the single place an image that fails to load gives
  way to the initial
- **No profile yet is the initial** - while `useProfile` has not answered, or
  the collector has no image, `avatarUrl` is absent and the initial shows; the
  image appears when the read answers

## Risks / Trade-offs

- The header re-renders when the profile read answers or changes; `SiteShell`
  already redraws for session changes and the added prop is a string
- `useProfile` is enabled for every signed-in collector on a profile-carrying
  build, including pages that never show the profile; one cached read, the cost
  of an image in the chrome
