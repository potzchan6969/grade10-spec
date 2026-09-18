## Goals

- A winner whose self-service has closed can email Grade10 with the invoice
  or the lot already in the subject, without needing a system mail client
- Overdue, cancelled and delivered letters produce the same ready email as
  Winner Order Contact Us

## Non-Goals

- A contact form, ticket, or in-app chat
- WhatsApp or any other inbound channel for the winner
- Opening a mail client as the default Contact Us action
- Showing the remaining balance on a partial-payment template
- Adding Contact Us to cancelled Winner Order — that control stays with
  `refine-auction-order-cancellation`
- Changing when Contact Us appears, or restoring Pay / Confirm

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does Contact Us do? | Copy-first ready email: To, Subject, Message, Copy Message first, Open Mail App second | Opening a mail client; a contact form; a toast that only names the address |
| Q2 | Why not open a mail client? | Many collectors send from Gmail or Outlook in the browser; on iPhone `mailto:` often opens Mail.app anyway | Silent `mailto:` as the only action |
| Q3 | What does the subject name? | The invoice id when one exists (`Auction order {invoice}: {reason}`); the lot title when setup is overdue and no invoice has been issued | A generic "Contact Grade10" subject, or an invented invoice id before send |
| Q4 | Does a partial-payment template name what remains owed? | No — receipts may be listed; the running balance stays off the mail, as it stays off Winner Order | Putting the remaining balance in the body so CS does not have to look it up |
| Q5 | Do letters share this destination? | Yes — the same subject and body, plus the address named in the letter, because a letter cannot offer the copy dialog | A bare `mailto:support@grade10.com` on letters; a different destination from Winner Order |
| Q6 | Is this the operator's outbound channel? | No — operator → winner stays the ❓ Contact channel on the PRD | Replacing WhatsApp outreach with this email |
| Q7 | How is Message entered? | Editable `Textarea` primitive (same label / status / message contract as TextInput); Copy Message stays footer-only | Icon copy beside a read-only body; a native textarea only in preview |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
