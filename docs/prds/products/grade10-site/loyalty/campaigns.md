---
title: Campaigns
order: 8
---

## Values

| Rule | Value |
| --- | --- |
| Address | `/campaigns/<slug>` |
| Ways to take part | Signup, submission |
| Gift | A grant-only reward that lands in the wallet as a coupon, or one collected in store |
| Gift count | One quota per way of taking part; empty is no limit |
| Points a gift costs or earns | None |

## Ways to Take Part

A campaign runs between its start and its end and holds one or more ways to
take part, each with its own gift and its own quota. A member takes part in
each way once.

| Way | Who wins | Decided by |
| --- | --- | --- |
| Signup | The first accounts created while the campaign runs, up to the quota | Arrival order |
| Submission | A member who sends an Instagram or Threads link an operator approves, up to the quota | An operator |

- **Every new account counts** — an account counts toward a signup quota the
  moment it is created, however it was made: a member signing up, staff
  opening one for a walk-in at the counter, or a guest checkout given an
  account
- **Only new accounts** — an account created before the campaign started
  never takes a slot, even when it joins the programme during it
- **Signing up never fails over a campaign** — a slot that cannot be taken
  leaves the account and its membership as they are
- **A link is the proof** — a submission is the link to the member's post;
  there is no screenshot or selfie upload

## Winning and Receiving

A win and the gift are two moments. A win takes a slot of the quota at once;
the gift follows when the campaign has one to give.

- **Held until stocked** — while a way of taking part names no gift, its
  winners see their gift reserved; once an operator attaches one and issues
  the held gifts, each lands in the wallet once, and its pickup window counts
  from that moment
- **A gift is no points** — it costs nothing, earns nothing, and moves no
  balance, tier or history — [Points](/p/grade10-site/loyalty/points)
- **A win stands** — there is no revoking one: voiding a gift's coupon takes
  the gift back but keeps the slot taken

## Running a Campaign

An operator writes a campaign in the console, picks each gift and its count,
and reviews submissions.

- **The quota moves while it runs** — raise it to make room after a bad win
  (a fraudulent signup, a link approved by mistake) whose coupon was voided,
  or lower it to close a way of taking part early
- **Never below the winners** — a count under the wins already taken is
  refused, naming how many have won
- **A gift is a grant-only reward** — never on the reward shop, never bought,
  and it needs no point cost — [Rewards](/p/grade10-site/loyalty/rewards#gifts-from-a-campaign)
- **The reward is the operator's** — a campaign naming a reward does not
  lock it: archiving or retemplating it changes what the held gifts become,
  and an archived gift stops issuing until another is attached

## Design

❓ **Not yet designed** — the membership banner and the campaign page ship on
two prototype blocks, the card's own look standing in, until the designer
draws the banner, the page's hero and the way-of-taking-part card in each
state it holds. Design's call.

::story{id="loyalty-campaigns-prototypes-campaign-page--default" title="The campaign page, prototype" height="900"}

:::detail{title="Product decisions" for="pm"}
Catch Me If You Can, the pre-store launch campaign, is the first to run on
it: the first fifty signups and the members who find the car win a card pack.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Accounts staff create | Decided | Every new account counts toward a signup quota, staff-made ones included. | Product |
| Revoking a win | Decided | Not before launch. Voiding the coupon takes the gift back; the operator raises the quota to free a slot. | Product |
| Quota during a campaign | Decided | An operator may change it while the campaign runs, never below the wins already taken. | Product |
| Protecting a named reward | Decided | No lock: the operator owns the reward a campaign names. | Product |
| The look | ❓ Open | Launch ships on the prototype blocks; they stand in until the banner and the page are designed. | Design |
| Proof for a submission | Decided | A link to the member's Instagram or Threads post; no screenshot or selfie upload for now. | Product |
| An operator's grant | Decided | A gift like a campaign's: no points records, reversed only by voiding its coupon. | Product |
| A gift's point cost | Decided | Optional on a grant-only reward; the card-pack reward is created with none. | Product |
:::
