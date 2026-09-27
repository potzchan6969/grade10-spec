# UI design

Storybook workbench under `apps/preview` is the layout source for the
Contact Us dialog. No Figma frame for this pass.

Behaviour stays in the capability specs. This file maps surfaces and
states — it does not restate requirements.

## The design reference

| Leg | Where |
| --- | --- |
| Storybook | `My Auctions/Winner Order/Setup` → Expired Setup; `My Auctions/Winner Order/Payment` → Expired Invoice, Partially Paid |
| `packages/design-system` | `Dialog`, `DialogHeader`, `IconButton` (To / Subject copy), `Button`, `Alert`, `Textarea` |
| Preview page | `apps/preview/src/pages/winner-order-contact-dialog.tsx` |
| Letters | `apps/emails/emails/auction/_components/contact-mailto.ts` |

## Screens

### Winner Order — Contact Us

Storybook: Expired Setup, Expired Invoice, Partially Paid.

Contact Us on the inline Alert opens **Email Grade10**. The address is not
on the order until the dialog is open. To and Subject copy in place; Message
is an editable textarea (order facts prefilled, blank for their question).
**Copy Message** is the only full-email copy, in the footer; Open Mail App is
outline and a `mailto:` with the current subject and body.

### Order letters — Contact Us

Overdue, cancelled and delivered letters keep the existing Contact customer
support CTA. The href is the same ready `mailto:`; the letter body names
`support@grade10.com`.

## Components

- **Existing:** `Alert`, `Dialog`, `IconButton`, `Button` (`render` as `<a>`
  for Open Mail App)
- **New in this change:** `Textarea` — labelled multi-line field sharing
  TextInput's status / message / loading contract; box is
  `radius-2xl` / auto height (not the single-line pill). No Figma set yet —
  Code Connect waits on design
- **i18n:** sheet copy is catalog work at delivery; preview holds English
  drafts
- No new letter kind

## States

### Winner Order — Contact Us

| State | Shows | Anchor |
| --- | --- | --- |
| Setup overdue | Dialog; subject `Auction lot {lot title}: setup overdue`; no invoice id | `winner-order-SC-164` |
| Payment overdue | Dialog; subject `Auction order {invoice id}: payment overdue` | `winner-order-SC-165` |
| Partially paid | Dialog; subject `Auction order {invoice id}: partial payment`; receipt ids listed; no remaining balance | `winner-order-SC-166` |
| Address hidden until open | `support@grade10.com` is not on the order page before Contact Us | `winner-order-SC-161` |
| Message field | Editable `Textarea`; no icon copy beside it — Copy Message is footer-only | `winner-order-SC-162` |

### Order letters

| State | Shows | Anchor |
| --- | --- | --- |
| Letter Contact Us | `mailto:` with the matching subject and body; address named in the letter | `order-mail-SC-57` |
