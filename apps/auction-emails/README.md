# Auction email templates

React Email templates for `grade10-site/auction/notifications`, composed with
the [emailcn](https://www.emailcn.run/) theme shape and Grade10 token values.

## Preview

```bash
pnpm --dir apps/auction-emails dev
```

Opens React Email’s preview at http://localhost:3333. Shared pieces live under
`emails/_components/` (hidden from the sidebar). Copy matches
`openspec/changes/add-auction-notifications/ui-design.md`.

## Structure

```
components/email/     emailcn EmailTheme + Grade10 theme values
emails/
  _components/        shell, lot block, CTA, footer, stop watching
  *.tsx               one default-export letter per kind
```

Production send still goes through the application’s `@grade10/email` lane;
these templates are the design/preview source for the letter markup.
