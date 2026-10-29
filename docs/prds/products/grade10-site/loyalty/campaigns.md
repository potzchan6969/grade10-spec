---
title: Campaigns
order: 8
---

## Values

| Rule | Value |
| --- | --- |
| Address | `/campaigns/<slug>` |
| Ways to take part | New member, social post |
| Proof a social post takes | A link to the post, or a picture of it — one per way |
| Gift | A grant-only reward that lands in the wallet as a coupon, or one collected in store; none on a win-only way |
| Picture size | Up to 10 MB; JPEG, PNG or WebP, any other the browser shows sent as JPEG |
| Gift count | One quota per way of taking part; empty is no limit |
| Points a gift costs or earns | None |

## Ways to Take Part

A campaign runs between its start and its end and holds one or more ways to
take part, each with its own gift and its own quota. A member takes part in
each way once.

| Way | Who wins | Decided by |
| --- | --- | --- |
| New member | The first accounts created while the campaign runs, up to the quota | Arrival order |
| Social post | A member who sends proof of their post, up to the quota | An operator, or arrival when the way approves itself |

The names say how a member qualifies, never which campaign they were first
written for, so any campaign can use either way again.

- **Every new account counts** — an account counts toward a new-member quota the
  moment it is created, however it was made: a member signing up, staff
  opening one for a walk-in at the counter, or a guest checkout given an
  account
- **Only new accounts** — an account created before the campaign started
  never takes a slot, even when it joins the programme during it
- **Signing up never fails over a campaign** — a slot that cannot be taken
  leaves the account and its membership as they are
- **Proof is a link or a picture** — each social post takes one: a link to
  an Instagram or Threads post, or a picture the member chooses from their
  phone, such as a screenshot of the post they shared. A picture loses its
  location and other metadata before it is kept
- **The operator judges proof** — whether a post counts (a public account,
  the car in frame, the mention) is the reviewer's call; nothing is checked
  on the way in
- **A way may approve itself** — with automatic approval on, every entry wins
  as it arrives while the quota lasts, and nobody reviews it; once the quota
  is gone the next entry is refused as sold out, not queued
- **The same picture twice is fine** — staff remember who showed them what,
  so nothing refuses a picture another member already sent

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
- **A win may be the whole prize** — a win-only way names no gift and issues
  nothing: the member's page says they are in and shows the picture they
  sent, and staff look at it on their phone. What happens at the store, such
  as a lucky draw, runs outside the campaign. Once a way has a winner,
  whether it is win-only no longer changes, as its kind does not

## Running a Campaign

An operator writes a campaign in the console, picks each gift and its count,
and reviews entries — one at a time, or many at once: the entries list shows
each picture at a glance, and approving or rejecting the ones ticked decides
each on its own, so one that changed meanwhile or found the quota gone is
reported and the rest still go through. A published campaign opens at its start time on its
own, and closes at its end.

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

- ❓ **Not yet designed** — the membership banner and the campaign page ship on
  two prototype blocks, the card's own look standing in, until the designer
  draws the banner, the page's hero and the way-of-taking-part card in each
  state it holds. Design's call.

::story{id="loyalty-campaigns-prototypes-campaign-page--default" title="The campaign page, prototype" height="900"}

:::detail{title="Product decisions" for="pm"}
Catch Me If You Can, the pre-store launch campaign, is the first to run on
it. Its confirmed shape has two parts:

- **Street promotion** — staff wait with the Pikachu car somewhere new each
  day; a person who joins and tops up their points there gets a gift on the
  spot. Staff check the top-up on the phone, so it is the page's words and
  nothing is tracked.
- **Share to social media** — a person catches the car with the site's
  camera scanner, shares the framed photo, and sends a screenshot of their
  post: a win-only social post that takes a picture and approves itself. They
  bring the screenshot to the store after it opens for a lucky draw run
  outside the campaign.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Accounts staff create | Decided | Every new account counts toward a signup quota, staff-made ones included. | Product |
| Revoking a win | Decided | Not before launch. Voiding the coupon takes the gift back; the operator raises the quota to free a slot. | Product |
| Quota during a campaign | Decided | An operator may change it while the campaign runs, never below the wins already taken. | Product |
| Protecting a named reward | Decided | No lock: the operator owns the reward a campaign names. | Product |
| The look | ❓ Open | Launch ships on the prototype blocks; they stand in until the banner and the page are designed. | Design |
| Proof for a social post | Decided | A link or a picture, chosen per way. The launch campaign's share takes a screenshot of the shared post. | Product |
| Names of the ways | Decided | New member and social post: named for how a member qualifies, not for the launch campaign. | Product |
| Reviewing a share | Decided | A way may approve every entry as it arrives; the launch share does. An operator can still review in bulk from the picture list. | Product |
| A share's prize | Decided | Win-only: no coupon. Staff look at the member's screenshot at the store, and a reused screenshot is no concern. | Product |
| Street promotion | Decided | Page text only; staff confirm the top-up on the phone and hand over the gift. | Product |
| An operator's grant | Decided | A gift like a campaign's: no points records, reversed only by voiding its coupon. | Product |
| A gift's point cost | Decided | Optional on a grant-only reward; the card-pack reward is created with none. | Product |
| When the card pack is attached | Decided | At launch, before the store opens: winners hold the coupon at once and collect it once the store opens. The reward's pickup window has to outlast the wait. | Product |
| What makes a submission valid | Decided | The reviewer decides, private accounts included; the product enforces no rule on the link. | Product |
:::
