## Context

Google sign-in already reaches the browser as a rendered button: `packages/grade10-auth/frontend/src/features/session/sign-in/domain/usecases/MountGoogleSignInButton.ts` calls `BetterAuthSignInRepository`'s `oneTap({ button: { container, config } })`, which better-auth's client (`node_modules/better-auth/dist/plugins/one-tap/client.mjs`) turns into `google.accounts.id.renderButton(...)`. Omitting `button` drives the other branch instead — `google.accounts.id.prompt(...)`, Google's own auto-popping corner UI — with built-in retry/backoff on a dismissed or skipped moment. Nothing in the repository calls it that way today.

The button mounts inside `SignInCard`, itself inside `SignInOverlayProvider` (`packages/grade10-auth/frontend/src/features/session/sign-in/presentation/overlay/signInOverlay.tsx`), which both `apps/frontend/grade10/src/root.tsx` and `apps/frontend/zzz/src/root.tsx` wrap around their whole tree and expose through `useSignInOverlay()` (`{ open, openSignIn, closeSignIn, signedIn }`). Both apps already gate on `useSession()` and the same brand check (`packages/app-env`'s Google-offered lookup) that the button uses.

## Goals / Non-Goals

**Goals:**
- Drive `google.accounts.id.prompt()` for a signed-out visitor, gated the same way the button already is, on both apps that share `SignInOverlayProvider`.
- Never let the prompt and the sign-in dialog be visible at once, in either direction.
- Suppress the prompt for the rest of the visit once a visitor has actively engaged with sign-in and walked away.

**Non-Goals:**
- zzz's Google client id, admin/operator apps, staged rollout, per-page exclusions — all out of scope per `decisions.md`.
- A design-system component: the prompt is Google's own chrome, nothing under `packages/ui` or `packages/design-system` changes.

## Decisions

**A new use case beside the existing one, not a modification of it.** `MountGoogleSignInButton` stays exactly as it is. A new `PromptOneTap` use case is added to the same `domain/usecases/` directory, bound in `domain/domainModule.ts` the same way, with a new `SIGN_IN_TOKENS` entry in `tokens.ts`. `SignInRepository` (the domain port) gains two methods — `promptOneTap(options): Promise<void>` and `cancelOneTapPrompt(): void` — implemented on `BetterAuthSignInRepository` beside `mountGoogleSignInButton`. Rejected: extending `MountGoogleSignInButton` with a mode flag — the two are different Google entry points with different lifecycles (a mounted DOM node vs. a fire-and-forget prompt with its own retry loop), and a flag would make the button's simple case carry the prompt's state machine.

**Dismissal reaches past better-auth's wrapper.** better-auth's `oneTapClient` exposes exactly one action, `oneTap(opts) => Promise<void>` (`client.d.mts:167`) — no cancel handle, no cleanup function. The only way to interrupt an in-flight prompt is Google's own global, `window.google.accounts.id.cancel()`, reachable once better-auth's `loadGoogleScript()` has injected the GSI script (it sets `window.googleScriptInitialized`, not a wrapper around `window.google` itself). `cancelOneTapPrompt()` calls that global directly, guarded by `typeof window.google?.accounts?.id?.cancel === "function"` so a call before the script loads is a no-op rather than a throw. This is a deliberate, isolated escape past the library boundary, kept to this one method on `BetterAuthSignInRepository` — the same file that already reaches `window.google` indirectly through better-auth's client — rather than spreading a raw global reference through the domain or presentation layers.

**Suppression is a module-scope flag, not `sessionStorage`.** The suppression is same-SPA-navigation only (`root.tsx` never hard-reloads between pages), so a flag on `BetterAuthSignInRepository`'s module (reset only by a real page reload, which is a legitimately fresh visit) is enough. No cross-tab or cross-reload persistence is asked for, so `sessionStorage` (the one precedent in the repo, `packages/grade10-store/frontend/src/core/analytics/trackProductAddedOnce.ts`, built for cross-reload dedup) would be reaching for more durability than the requirement calls for.

**One hook coordinates prompt, dialog and decline**, `useOneTapPrompt()` in `presentation/hooks/`, mounted once per app:
- Reads `useSession()` and `useSignInOverlay().open`.
- Calls `promptOneTap()` when: the brand offers Google, the visitor has no session, the dialog is not open, and the suppression flag is not set. Every one of these is re-checked before each call, including the library's own internal retries, so a retry firing after the flag flips is a no-op rather than a race.
- Watches `open` transition `false → true` and calls `cancelOneTapPrompt()` the same render.
- Passes `promptOptions.onPromptNotification` through to `promptOneTap()` (a documented better-auth option, not a new one) to detect a `dismissed` or `skipped` moment and set the suppression flag from there — not from the awaited promise's resolution, which better-auth's client does not shape into a distinct "declined" value.

**Library defaults stand.** `promptOptions.fedCM` stays on and `cancelOnTapOutside` is left unset — better-auth's own note says the two conflict. FedCM's own account chooser is browser-owned UI no page can recolor or brand, which the shipped prompt's dark chrome on this light-only product surfaced immediately; `decisions.md` Q6 is the author's word that this is an accepted limit, not a gap to code around.

**Mount point.** A new sibling component wrapping the hook (or the hook called directly from an existing chrome component, engineer's choice at implementation) sits inside `SignInOverlayProvider` beside `SignInDialog`: `apps/frontend/grade10/src/root.tsx` near `SignInBeforeNavigating` (~line 334) and `apps/frontend/zzz/src/root.tsx` near `SignInDialog` (~line 76). Each app's own `useSession()` and brand check are what it reads — no new context, no new provider.

## Risks / Trade-offs

- **[Risk]** A better-auth upgrade changes how the GSI script is loaded or shapes `window.google` differently → `cancelOneTapPrompt()`'s direct global call breaks silently. **Mitigation:** the guarded existence check makes a missing API a no-op, not a crash, and the call is isolated to one method for a future upgrade to update.
- **[Risk]** better-auth's built-in retry/backoff re-invokes `prompt()` after a decline, racing the suppression flag. **Mitigation:** the flag is checked at every call site the hook has, not only at mount, and is set the moment `onPromptNotification` reports a decline — before the library's own next attempt could fire.
- **[Risk]** FedCM's account chooser cannot be recolored — a visitor on a dark browser sees dark chrome even on this light-only product. **Mitigation:** `color_scheme: light` styles the classic-iframe fallback for a browser without FedCM; the FedCM path itself is an accepted limit (`decisions.md` Q6), not a gap this change codes around.

## Open Questions

None — every choice above follows from `decisions.md` or an existing pattern in the repository; nothing here would change the specs, the approach, or the task breakdown.
