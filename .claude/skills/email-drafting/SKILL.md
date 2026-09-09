---
name: email-drafting
description: Draft or revise React Email templates and their copy in apps/auction-emails, including preheaders, CTAs, shared shells, and email-safe styling.
---

# Email drafting

Use this skill when composing or revising a Grade10 email template, shared email component, or email-facing copy. Do not use it for ordinary product copy that is not rendered as an email.

## Ground the draft

- **Read the shell** — follow `apps/auction-emails/README.md` and `emails/_components/auction-email-shell.tsx` for the shared preview, logo, theme, fonts, and layout
- **Reuse components** — compose existing emailcn components before adding markup; keep new components inside `apps/auction-emails/components/email/` or the owning email's `_components/` folder
- **Keep copy owned** — use the email's copy contract and the i18n catalog when one exists; do not invent product names, event facts, links, or promises to fill a missing requirement

## Shape the message

- **Lead with the event** — tell the recipient what happened and why the message matters in the first sentence
- **Use the preheader** — make `Preview` useful as the inbox summary; do not repeat a generic subject or leave it blank
- **Choose one next action** — give the primary CTA a specific verb and a real destination; expose a secondary action only when it serves a distinct fallback or lower-priority goal
- **Explain the relationship** — include why the recipient received the message and the relevant stop-watching or unsubscribe path when the product contract requires it
- **Write for scanning** — short paragraphs, meaningful headings, one idea per section, and no UI-only instructions that do not make sense in an inbox

## Preserve email safety

- **Render email-safe HTML** — use React Email primitives, the shared Tailwind configuration, table-friendly layout, explicit image `alt` text, and absolute or approved static asset URLs
- **Keep user data as children** — render recipient, listing, bid, and store values through escaped React children or approved component props; never concatenate them into HTML strings
- **Restrict raw HTML** — use `dangerouslySetInnerHTML` only for literal CSS or font declarations that must be emitted in `<Head>`; never pass user, catalog, or network content
- **Suppress narrowly** — place a line-level Biome suppression immediately above the exact static `dangerouslySetInnerHTML` prop and explain why it is safe; never use a file-wide security suppression for an email template

## Verify the result

- **Typecheck** — run `pnpm --dir apps/auction-emails run typecheck`
- **Lint** — run `pnpm run lint` and keep the security rule active outside the exact static-style exception
- **Preview** — run `pnpm email:dev` when layout, responsive behavior, asset loading, or copy hierarchy changed; inspect the inbox preview and the rendered letter
