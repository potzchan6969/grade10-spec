# Email templates

React Email letters for Grade10 — site-wide messages (magic link) and
`grade10-site/auction/notifications` — built with
[emailcn](https://www.emailcn.run/) on the shadcn registry.

## Setup

`components.json` registers `@emailcn`. Add or refresh registry items:

```bash
pnpm --dir apps/emails dlx shadcn@latest add @emailcn/react-email/<item> --overwrite
```

Installed so far: `theme-default`, `default-fonts`, `button`, `header-with-logo`,
`divider`, `call-to-action`, `container`, `content`, `block-notification-default`.

Letters compose Grade10’s `grade10Theme` through emailcn’s
`createEmailTailwindConfig` (see `emails/_components/grade10-email-shell.tsx`).

## Preview

```bash
pnpm email:dev
```

http://localhost:3333 — shared pieces under `emails/_components/` (hidden from
the sidebar). Auction kinds live under `emails/auction/`. Site-wide letters sit
beside that folder.

## Structure

```
components.json
components/email/     emailcn registry output + theme-grade10.ts
emails/
  _components/        Grade10EmailShell, PrimaryCta, EmailFooter
  magic-link.tsx      site-wide sign-in letter
  auction/            auction notification kinds + AuctionLetter
  static/             preview assets
```

Production send still goes through the application’s `@grade10/email` lane;
these templates are the design/preview source for the letter markup.
