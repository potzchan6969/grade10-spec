## Goals

- Every member owed an expiry reminder is told by email — the member, the
  day and the points the reminder already names.
- A member never receives a warning that has stopped being true.

## Non-Goals

- A second channel — push, the wallet card or the site can read the same
  owed reminder later; this change ships email alone.
- A member opt-out surface — whether members can decline reminders stays
  open on the capability page; nothing ships for it here.
- Changing who is owed a reminder, the lead time, or the smallest balance
  — the raising rules settled by `add-point-expiry-reminders` are
  untouched.
- Reminders for anything but points expiry — tier warnings are their own
  change, `add-tier-ending-reminders`.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which channel carries the owed reminder first? | Email - decided by the author, 2026-11-02; carried by the page's Carrying a Reminder and the delivery requirement | Push, the wallet card or the site first — email needs no app install, reaches every member with an address, and the letters are already drafted |
| Q2 | One send per owed reminder, or repeats? | One: the reminder is identified by member, day and lead time, and the send follows it exactly - decided by the author; carried by the delivery requirement | Resending while the reminder stands, which mails again for a grant or correction that only moved the count |
| Q3 | What happens to a send when the reminder stops being owed? | It is dropped unsent: the day moves, the balance empties or lapses, or the lead time is gone - decided by the author; carried by the delivery requirement | Sending anyway, which tells a member to fear a lapse that no longer exists |
| Q4 | Does the email let a member opt out? | Not in this change - the opt-out question stays open on the page, ❓ Product | Shipping a mute control before Product answers whether members may decline at all |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
