# grade10-site/vault/case-intake Specification

## Purpose

How a collector opens a vault request for one item: what they say about it,
what they photograph, the one question that decides whether the case carries a
loan, and the reference the case is known by afterwards.

Intake is where the case is born, so it is where the facts nothing later can
change are fixed — the item, the currency, the lane and the reference. What
happens to the case afterwards is `grade10-site/vault/case-lifecycle`; the
visit it offers on submission is `grade10-site/vault/visit-booking`.

## Feature set

- Opening a request
  - Draft cap: three unsent drafts per account, because a draft is what holds
    photographs
  - One item per case: several items are several requests, so one case never
    describes two things
  - Brand currency: the case is opened in the brand's own currency and in no
    other
- Describing the item
  - Item facts: category, title, description and an optional contact number
  - The lane question: a financing amount makes the financed lane and its
    absence makes storage
  - Canonical number: a number is stored one way however it was typed, so one
    person is found once
- Photographs
  - Photo limits: one to ten raster photographs, each within the size cap
  - Metadata stripped: a photograph reaches the bucket carrying no location
  - Read trail: a photograph is served to its owner and to staff, and every
    read is recorded
- Sending it in
  - A photograph required: staff prepare around what they can see
  - What follows: the case is submitted and the visit can be booked
  - Read back before it goes: the last step shows the request as it will be
    sent, each block editable where it was written
  - What happens next: the step says what the shop does with the request, so
    nobody waits on an answer nobody promised
  - The collection statement: the collector ticks that they have read it
    before the request sends, and the version they were shown is kept with
    the send
- The case reference
  - Six characters a person can read out: an alphabet without the characters
    that are read for one another at a counter
  - Issued with the case: drawn beside the id, so no case is ever without one
  - Unique per brand and never reused: unique across every case the brand has
    opened, and a clash is redrawn rather than shared
  - The id stays the key: the address, every link and every lookup keep the id,
    and the reference is what is spoken and typed
  - Where it is read: the case's own header, its card on the list, the step
    that sent it, every letter, and the counter's search
