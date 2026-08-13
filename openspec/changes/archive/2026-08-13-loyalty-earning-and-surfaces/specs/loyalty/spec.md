# Loyalty — delta

## ADDED Requirements

### Requirement: A purchase earns its points exactly once, even when loyalty is unreachable

A product that sells to a member SHALL record every completed purchase and every
refund against the programme, exactly once per money event, and SHALL keep
trying until the programme accepts it.

Selling SHALL NOT depend on the programme being reachable: a purchase SHALL
complete whether or not points can be recorded at that moment.

The product's selling currency SHALL match the programme's currency, and a
mismatch SHALL be detected when the product starts, not when a member buys
something.

#### Scenario: Points survive an outage

- **WHEN** a purchase completes while the programme is unreachable
- **THEN** the purchase still completes for the buyer
- **AND** the points are granted once the programme is reachable again, without anyone re-entering them

#### Scenario: A repeated delivery grants nothing twice

- **WHEN** the same money event is delivered to the programme more than once
- **THEN** the points are granted once

#### Scenario: One money event, one identity

- **WHEN** a purchase reaches its completed state through any path — a payment
  notification, a scheduled reconciliation, or a read that repairs it
- **THEN** exactly one money event is recorded for it, carrying an identity stable across retries

#### Scenario: A partial refund claws back only its own part

- **WHEN** part of a purchase is refunded, and later another part
- **THEN** each refund claws back only the points its own amount earned

#### Scenario: A currency mismatch stops the product from starting

- **WHEN** a product sells in a currency the programme does not run in
- **THEN** the product fails to start, naming both currencies

#### Scenario: A refused recording is reported, not swallowed

- **WHEN** the programme refuses a recording
- **THEN** the refusal is logged and counted by its reason
- **AND** it is never reported as success

### Requirement: Operator point grants distinguish correction from reward

An operator SHALL be able both to correct a balance without affecting tier
progress, and to grant points that count toward tier progress. Each SHALL carry
a reason and SHALL be recorded in the operator log.

#### Scenario: A correction does not move a member up

- **WHEN** an operator corrects a balance
- **THEN** the points are spendable
- **AND** the member's progress toward the next tier is unchanged

#### Scenario: A campaign grant moves a member up

- **WHEN** an operator grants campaign or sign-up points
- **THEN** those points count toward the next tier

### Requirement: A member runs their own membership from one surface

A signed-in member SHALL be able to see their tier, balance, progress to the
next earned tier and points expiring soon; join if they have not; read their
activity; browse the reward menu; redeem; and see what they have redeemed.

Redeeming twice by accident SHALL cost nothing, including when the member
reloads between attempts.

#### Scenario: A member who never joined is invited to

- **WHEN** a member with recorded activity but no join date opens the surface
- **THEN** they are shown how to join, and their existing points

#### Scenario: A double redemption costs one

- **WHEN** a member submits the same redemption twice, with or without a reload in between
- **THEN** exactly one redemption is recorded

#### Scenario: Dates read in the programme's time zone

- **WHEN** a member reads a date the programme computed
- **THEN** it reads the same wherever the member is, in the programme's time zone

### Requirement: An operator runs the programme from one console

An operator SHALL be able, subject to their own permissions, to: find a member
and read their loyalty state and activity; correct a balance and grant campaign
points; grant and revoke an invitation-only tier and list live grants; create,
edit and archive rewards and see archived and scheduled ones; find a redemption
and reverse it; and read the operator log and verify it has not been tampered
with.

The console SHALL show an operator only the sections their permissions allow,
using the same permission the action itself requires, so that what is shown and
what is allowed cannot disagree.

Where a second factor is required and missing, the console SHALL take the
operator to enrol or verify rather than reporting a refusal.

#### Scenario: Sections match permissions

- **WHEN** an operator holding only the loyalty read permission opens the console
- **THEN** they can find and read members
- **AND** no section offering point movement, invitations, rewards or the operator log is shown

#### Scenario: A missing second factor opens the gate

- **WHEN** an operator attempts an action their role allows but their session has no verified second factor
- **THEN** the console takes them to verify, and the action completes afterwards

#### Scenario: A stale console reports what broke

- **WHEN** the console reads a response whose shape it does not recognise
- **THEN** it reports which call failed to decode, rather than showing missing values

#### Scenario: A member can be found again later

- **WHEN** an operator opens a member and shares the address of that view
- **THEN** the same member opens for the recipient

### Requirement: Reading a member's identity requires the identity permission

The programme holds no names or email addresses. Where a console shows them,
they SHALL be read from the identity system under the same permission the
identity administration surface requires, and SHALL NOT be obtainable through a
loyalty permission alone.

An identity read SHALL be possible only for an operator whose own session
carries that permission and a verified second factor; holding a connection
between services SHALL NOT by itself grant it.

Identity read SHALL NOT be stored in the programme, cached by any shared cache,
or written into the operator log; the log SHALL record which records were read,
by whom, and how many.

#### Scenario: A loyalty permission alone shows no identities

- **WHEN** an operator holding loyalty permissions but not the identity permission finds a member
- **THEN** the member's loyalty state is shown
- **AND** no name or email address is shown

#### Scenario: A service connection is not an authorisation

- **WHEN** a service holding a connection to the identity system requests identities without an operator session carrying the identity permission
- **THEN** the request is refused

#### Scenario: Identity is never served from a shared cache

- **WHEN** a response carrying identity is returned
- **THEN** it is marked as belonging to that caller alone and is not stored in a shared cache

#### Scenario: An identity read is recorded without copying the identities

- **WHEN** an operator reads member identities
- **THEN** the log records who read, which records, and how many
- **AND** it does not record the names or email addresses themselves

#### Scenario: A failed identity read does not degrade to blanks

- **WHEN** the identity system cannot be reached
- **THEN** the console reports the failure
- **AND** no member is shown with a blank identity

## MODIFIED Requirements

### Requirement: An invitation-only tier is granted and revoked by an operator

A tier the programme marks as invitation-only SHALL be held only through an
explicit grant, which names who granted it and why, may carry an end date, and
may be revoked. A member SHALL hold at most one live invitation per tier.

An operator SHALL be able to list live invitations, so a grant can be found and
revoked, and SHALL be able to read which tiers the programme defines rather than
naming one from memory.

#### Scenario: A grant names an unknown tier

- **WHEN** a grant names a tier the programme does not define
- **THEN** it is refused as not found and nothing is recorded

#### Scenario: A grant names the entry tier

- **WHEN** a grant names the tier every member starts on
- **THEN** it is refused as invalid

#### Scenario: Live grants can be found

- **WHEN** an operator lists invitations
- **THEN** every live grant is listed with its member, tier, reason and end date

### Requirement: A reward menu priced in points, and a redemption that remembers its price

The programme SHALL hold a menu of rewards, each priced in points, optionally
limited in stock, and optionally live only within a date window. Redeeming SHALL
record what the member paid at that moment, so repricing a reward never changes
what an earlier redemption cost.

A member SHALL be able to list what they have redeemed and the state of each.

#### Scenario: Repricing does not rewrite history

- **WHEN** a reward's point cost changes after a member redeemed it
- **THEN** the earlier redemption still records the price the member paid

#### Scenario: Stock is not oversold

- **WHEN** two members redeem the last unit of a limited reward at once
- **THEN** exactly one succeeds and the other is refused as out of stock

#### Scenario: A reward outside its window cannot be redeemed

- **WHEN** a member redeems a reward that is archived, or outside its live window
- **THEN** the redemption is refused

#### Scenario: The public menu shows only what a member can buy

- **WHEN** the reward menu is read without signing in
- **THEN** it lists only live, unarchived rewards
- **AND** it does not disclose stock counts or edit history

### Requirement: A member sees their own state and never the operating record behind it

What a member reads about themselves SHALL carry their tier, balance, progress
to the next earned tier, and points expiring soon. Their own activity list SHALL
NOT disclose operator reasons, retry keys, or the internal pricing of an entry.

Each activity entry SHALL name what it was for in terms the member can read.

#### Scenario: An operator's reason stays out of a member's view

- **WHEN** an operator corrects a member's balance with a written reason
- **THEN** that reason does not appear anywhere in what the member can read

#### Scenario: Retry keys and internal pricing stay out of a member's view

- **WHEN** a member reads their activity
- **THEN** no entry carries a retry key, a request record, or the tier and
  money arithmetic the entry was priced from

#### Scenario: A retired reward is still readable in history

- **WHEN** a member reads an activity entry for a reward that has since been archived
- **THEN** the entry still names that reward
