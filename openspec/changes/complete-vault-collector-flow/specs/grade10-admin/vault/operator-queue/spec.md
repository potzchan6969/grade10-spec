# grade10-admin/vault/operator-queue Specification

## Feature set

- The queue
  - Cut by what waits: every status belongs to exactly one status view, and
    the rest are queries
  - Today, cut where the rows are: the shop's own day decides it, in the read
    rather than in the browser
  - Rows that explain themselves: the badge names why a case is waiting on a
    person
  - Keyset paging: a page, a backlog count and a control that says whether
    there is more
  - A count on every cut: each view says how many it holds before it is
    opened
  - The landing view is the Today cut: today's visits in slot order, from
    that cut's own query rather than a second one
  - The collector's word: a row prints the word the collector reads for the
    status, never the raw one
- Finding one case
  - Exact or prefix: exact on a contact, prefix on a case id, and never a
    substring over a contact column
  - Canonical number: a number is matched however the operator typed it
  - A read that leaves a trail: who searched, when, what kind of term and how
    many matched — never the term
  - Prefix on the reference: the six characters a customer reads out find
    the case, on the same trail as any other search
- One case
  - Tabs by job: the case, the documents, the custody, the money
  - Buttons follow the machine: an act shows only where its move may run, and
    the worker refuses independently
  - The visit in order: the counter's steps for today's visit, ticked as
    each act lands
  - Why an act is not offered: a withheld act says what it is waiting for in
    words, the forfeiture's cure date among them
  - The identity in six words: what the record says, never the provider's
    finer states
- Who may act
  - Four grants: read, operate, approve, payout — and the identity read
    beside them
  - Two people on money: staff and treasurer share no money grant
  - A verified session: a second factor, and one verification lasting twelve
    hours
  - Filed under the case: every act, and every read that declares one, is on
    the case's audit trail
- The physical vault
  - The shop is required: an item's custody row names where it is
  - Movements: in at vaulting, moved on a move, out at every exit
  - What is held: everything in a locker, with its shop, oldest first
  - Counted at a glance: how much is held, per shop, how much carries a live
    loan and how much waits on a pickup
- No intake of its own
  - Every case is the collector's: the console opens none, and no identity is
    keyed to a case
