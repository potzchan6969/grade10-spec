## ADDED User journeys

### grade10-admin-grading-counter-US-01: Operator opens the shop and sees what every submission waits for

**As a** member of shop staff starting a shift,
**I want** the queue cut by what each submission waits for, today's drop-offs in a strip, and a badge naming why a row needs me,
**so that** I work the counter without being emailed anything.

### grade10-admin-grading-counter-US-02: Operator hands a booked list in at the counter

**As a** member of shop staff with a collector at the desk,
**I want** to find the booking, or write a walk-in's list with them, check each card and photograph it, confirm the level fits every declared value, show the agreement on the iPad, take the fee and any cover line at the till only once it is sealed, and print the labels and hand in with the intake receipt going out, the submission staying booked and the cards going home if no line was paid,
**so that** the cards are sealed in the bag with a receipt in one visit and nothing was paid for a card nobody checked.

### grade10-admin-grading-counter-US-03: Operator refuses one card and the rest go on

**As a** member of shop staff checking a card the grader would not take,
**I want** to refuse it with one of three reasons and a line in the collector's words that shows on their page and the receipt, the list and the fee dropping to the cards that go on and a line already paid refunded at the till,
**so that** one card never charges the collector or holds the others.

### grade10-admin-grading-counter-US-04: Operator hands the cards back against the code and the receipt

**As a** member of shop staff with a collector at the desk,
**I want** to take the pickup code and the name, glance at an ID above the threshold and keep nothing, settle the upcharge and the storage accrued at the till, tick each item as it is handed over and inspected, photograph each slab, and show the receipt on the iPad, a second hand-back closing a submission whose card the grader held,
**so that** the submission closes on a sealed receipt with nothing outstanding.

### grade10-admin-grading-counter-US-05: Operator releases the cards to the named person or turns anyone else away

**As a** member of shop staff,
**I want** the hand-back step to read the person named on the submission page and the receipt to record that they collected, and the counter to refuse anyone who is neither the collector nor that person, code or no code, with no override to press,
**so that** a named person leaves with the cards and a forwarded email never walks out with somebody's slabs while the collector can name them from their phone.

### grade10-admin-grading-counter-US-06: Operator moves a slab into a vault case at hand-back

**As a** member of shop staff asked to keep a slab,
**I want** to open a vault case for it from the hand-back step once the balance is settled, the receipt saying the card went to the vault,
**so that** the collector leaves with the case open and no second visit.

### grade10-admin-grading-counter-US-07: Operator withdraws a card the collector asked back

**As a** member of shop staff at Handed in,
**I want** to withdraw one card until the batch closes, refunding its POS line and releasing it against a hand-back receipt,
**so that** the card leaves the intake bag with a record and the rest go on.

### grade10-admin-grading-counter-US-08: Approver waives an upcharge with a second person

**As a** member of shop staff holding `grading:approve`,
**I want** to waive the difference the sheet charged with a reason and a second approve holder who is not me, once the cards are back,
**so that** nobody can write off money alone and the collector's due drops to nothing before they collect.

### grade10-admin-grading-counter-US-09: Approver records a payout for a card that did not come back

**As a** member of shop staff holding `grading:approve`,
**I want** to record a payout at the declared value, with the fee refunded, for a card not returned or damaged, on its own record with a second approve holder, at the till or by transfer, inside the window, and to reverse it on that record if the card turns up,
**so that** the collector is paid without waiting on the shop's claim and the money book shows what went out and why.

### grade10-admin-grading-counter-US-10: Operator answers a collector from one submission's tabs

**As a** member of shop staff opening a submission,
**I want** per card the intake id, the declared value, the level and the one it was moved to, the grade and cert in the grader's words and the outcome, the money as paid, due, refunded and paid out with the till's references, and the timeline with the grader's stages in its words,
**so that** the till and the record say the same figure and I can answer a collector on the phone from one screen.

### grade10-admin-grading-counter-US-11: Operator hands a document over only when the counter is ready for it

**As a** member of shop staff,
**I want** the agreement to be mintable only once every card is checked and the receipt only once the balance is settled and every item is ticked, one document each time on a 30-minute link, and to show any sealed document on the iPad, copy its link or send it or the grades email again,
**so that** nothing is handed over to sign that the shop could not be held to, and a collector who lost an email gets the same sealed copy.

### grade10-admin-grading-counter-US-12: Operator posts the written notice from the Notice due rung

**As a** member of shop staff working the Ready view,
**I want** a submission uncollected past the notice day to ask me for the notice, and to record the posting date and the tracking once it is in the post, the email going the same day and the 30 days counting from that date,
**so that** the notice is a fact with a date on it and nothing after it runs off a guess.

### grade10-admin-grading-counter-US-13: Admin reconstructs one submission's history on the audit chain

**As an** admin holding a submission in a dispute,
**I want** every event on the timeline with the figures it carried and the grader's stages in its words, staff-only entries kept from the collector, and every action filed under the submission on the audit chain,
**so that** the record can be tested rather than believed.

### grade10-admin-grading-counter-US-14: Operator's acts follow the grant they hold and the status in front of them

**As a** member of shop staff,
**I want** each tab to offer exactly the acts my grant and the submission's status allow, cancel only on the collector's word and never once the visit starts or a card is checked or refused, refused independently when the submission has moved under me,
**so that** I am never shown a button that will only be refused, and two of us at one counter cannot leave a submission where neither meant.

### grade10-admin-grading-counter-US-15: Operations changes a default without a deploy

**As an** admin answerable for how the counter runs,
**I want** every clock, cap, fee sheet and threshold the pages run on to be a setting I read and change in the console under `grading:approve`, a money setting taking a second person, filed under its own audit subject, and reaching only submissions not yet booked,
**so that** confirming a default is a decision I record and not a release I wait for, and no signed paper changes under a collector.

## MODIFIED User journeys

## REMOVED User journeys
