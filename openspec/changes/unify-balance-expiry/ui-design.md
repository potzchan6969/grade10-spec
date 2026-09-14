# UI design

The shipped blocks and their stories are the design record; no Figma frame is
drawn for this change. Every surface below reads one date.

## Membership Summary

`MembershipSummary` in `@grade10/ui` loses two props — the expiring-soon line
and the "points active until" row — and gains one:

```ts
balanceExpiry?: { line: string; tone: "normal" | "warning" }
```

Absent renders nothing. The block never holds a clock or a threshold: the
consumer decides which tone to send, from the same time it already threads
through the page. A day inside the last thirty warns.

| State | Line |
| --- | --- |
| Points, more than 30 days left | `1,250 points expire on 3 Jan 2027` |
| Points, 30 days or fewer | `1,250 points expire on 3 Jan 2027. Buy or redeem before then to keep them.` |
| Points, the day itself | `1,250 points expire today. Buy or redeem today to keep them.` |
| No points | no line |
| Never active | no line |
| Not joined | no line; the page already says the member has not joined |

Stories to add beside the block: `ExpiresLater`, `ExpiresSoon`, `ExpiresToday`,
`NoPoints`.

## Adding Points

The console's form for a campaign grant or a correction states, under the
points field, the date the points it is about to write will carry:

| State | Line |
| --- | --- |
| The member holds live points | `These points expire on 3 Jan 2027, with the rest of the balance.` |
| The member holds none | `The member holds no live points. These points start a new expiry date: 14 Sep 2027.` |

The line is read at submit, not at open: an operator can leave the form open
across the day a balance lapses, and a line written at open would promise a
date the write does not keep.

## Restarting the Expiry

Its own small dialog on the member's standing, not on the points form — it
moves no points and shares none of that form's checks.

- **Asks** — a reason, and nothing else
- **Says** — the day the window will land on, before the operator confirms
- **Refuses** — a member holding no live points, by name, with what to do
  instead: add the points first, and they start the date themselves
- **Afterwards** — the card's date moves and no ledger row appears, which the
  dialog says out loud so nobody reads it as a failure

## Member Standing, in the Console

The expiring-soon figure comes off — it renders `0 points by …` today for every
member who has none. The expiry row keeps its value and takes a note: how long
is left inside the last thirty days, and when the expiry was last restarted.
The shared figure has no tone of its own, and the note carries the urgency in
words, which is what an operator reads anyway.

## The Till

One date already, and it stays one. Only its label changes, to say that this is
when the member's points go.
