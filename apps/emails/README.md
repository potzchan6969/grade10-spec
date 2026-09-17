# Email templates

React Email letters for Grade10 — auth (magic link) and
`grade10-site/auction/notifications` (+ post-close order letters) — built with
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

http://localhost:3333 — `_components/` folders are hidden from the sidebar.
Restart the preview server after pulling so discovery refreshes.

| Folder | Preview path example |
| --- | --- |
| Auth | `/preview/auth/magic-link` |
| Auction progress | `/preview/auction/progress/bidding-opens-in-24h` |
| Auction activity | `/preview/auction/activity/outbid` |
| Auction close | `/preview/auction/close/lot-closed-didnt-win` |
| Auction order | `/preview/auction/order/auction-won` |

This same preview app — sidebar, linter, spam/compatibility checks — is
published as a static site on every push to `main` (and on demand) to
**https://email.grade10-stg.com** (`scripts/build-preview.mjs` lifts
`email build`'s prerendered pages out instead of running it as a live
server — no "Send" support there, since that needs a Resend key). Locally:

```bash
pnpm run email:deploy:staging   # needs CLOUDFLARE_API_TOKEN
```

## Structure

```
components.json
components/email/          emailcn registry output + theme-grade10.ts
emails/
  _components/             Grade10EmailShell, PrimaryCta, EmailFooter
  static/                  preview assets
  auth/
    magic-link.tsx         site-wide sign-in letter
  auction/
    _components/           AuctionLetter, LotBlock, LotWatchedEmail,
                           campaign tags, preview fixture
    progress/              opens / closes-in-24h / extended (before & during)
    activity/              new-bid / outbid (while bidding is open)
    close/                 lot ended for watchers & non-winners
                           (watcher previews: lot-watched-sold /
                           lot-watched-ended = no-bids Ended-only)
    order/                 winner success, setup reminder (first / second),
                           payment reminder (send / day-three / day-six /
                           final), setup overdue, payment overdue, payment
                           received (+ draft partial), shipped, delivered,
                           order cancelled (post-sale)
```

Production send still goes through the application’s `@grade10/email` lane;
these templates are the design/preview source for the letter markup.
