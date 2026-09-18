## Context

Winner Order Contact Us today sets a toast that names help, and order letters
share one bare `mailto:support@grade10.com` from
`packages/grade10-auction/backend/src/email/messages.ts`. The store already
holds the ready-email builders (`apps/emails/.../contact-mailto.ts`), the
preview dialog (`apps/preview/.../winner-order-contact-dialog.tsx`), and a
`Textarea` export — this change lands that behaviour in the live storefront
and in production letter renders.

See [proposal.md](./proposal.md) for why.

## Goals / Non-Goals

**Goals:**

- One pure ready-email shape (To, Subject, Message, mailto, copy text)
  recomputed from the order's current facts at render time
- Winner Order opens the copy-first dialog; letters carry the matching mailto
  and name the address in the body
- No new persistence for subject or body

**Non-Goals:**

- A shared npm package for the builder between `apps/emails` and grade10
- Changing when Contact Us appears, or cancelled Winner Order Contact Us
- Operator → winner contact channel

## Decisions

The specs own the ready-email fields, subject forms, footer order, and letter
coverage. Implementation choices:

| Topic | Choice | Rejected |
| --- | --- | --- |
| Where the builder lives | Pure helpers: keep `contact-mailto.ts` for email previews; add a twin under `packages/grade10-auction/backend/src/email/` (and a small frontend twin or shared import from that package) so production letters and the SPA recompute the same strings from order facts | Publishing a new shared package; importing `apps/emails` from the worker; storing subject/body on the order row |
| Letter `contactUrl` | Build per letter at render in `emailPort` / message assembly from lot title, current invoice id, receipt ids, and reason — drop the storefront-wide bare `CONTACT_URL` constant for these kinds | Keeping one constant mailto and only changing the SPA |
| Winner Order UI | Local dialog state on Contact Us; `navigator.clipboard.writeText` for Copy Message; Open Mail App as `<a href={mailto}>` via Button `render` | Toast with address; silent `mailto:` as the only action; server round-trip to build the mail |
| Textarea | Consume the existing `@grade10/design-system` `Textarea` export via the submodule bump | A native `<textarea>` only in the SPA; a new `@grade10/ui` compound |
| i18n | Dialog chrome (title, labels, footer) in `@grade10/i18n` `auctionOrders` (or a sibling namespace); subject/body stay English product strings matching the letter helpers until catalogs own them | Hard-coding dialog chrome only in preview |

## Risks / Trade-offs

- **[Risk]** SPA and letter builders drift → **Mitigation:** same reason → subject/body table in both helpers; backend unit tests assert the four letter kinds and the three Winner Order reasons against fixed fixtures.
- **[Risk]** Clipboard permission fails → **Mitigation:** Copy Message still attempts write; failure surfaces through the control's existing error/pressed path — no alternate toast required until the PRD ❓ on confirmation lands.
- **[Risk]** Partial-payment letter kind not yet sent in production → **Mitigation:** ship the mailto helper and template wiring anyway; render path is idle until that letter fires.

## Open Questions

- Copy Message confirmation chrome — already ❓ on Post-Bidding; does not change the task split.
