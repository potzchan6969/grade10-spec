# Auction email templates

React Email letters for `grade10-site/auction/notifications`, built with
[emailcn](https://www.emailcn.run/) on the shadcn registry.

## Setup

`components.json` registers `@emailcn`. Add or refresh registry items:

```bash
pnpm --dir apps/auction-emails dlx shadcn@latest add @emailcn/react-email/<item> --overwrite
```

Installed so far: `theme-default`, `default-fonts`, `button`, `header-with-logo`,
`divider`, `call-to-action`, `container`, `content`, `block-notification-default`.

Auction kinds compose Grade10’s `grade10Theme` through emailcn’s
`createEmailTailwindConfig` (see `emails/_components/auction-email-shell.tsx`).

## Preview

```bash
pnpm email:dev
```

http://localhost:3333 — shared pieces under `emails/_components/` (hidden from
the sidebar). Copy matches
`openspec/changes/add-auction-notifications/ui-design.md`.

## Structure

```
components.json
components/email/     emailcn registry output + theme-grade10.ts
emails/
  _components/        Grade10 auction letter composition
  *.tsx               one default-export letter per kind
```

Production send still goes through the application’s `@grade10/email` lane;
these templates are the design/preview source for the letter markup.
