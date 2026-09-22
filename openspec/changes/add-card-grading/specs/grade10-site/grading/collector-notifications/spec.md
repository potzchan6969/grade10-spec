# grade10-site/grading/collector-notifications Specification

## Purpose

What grading tells a collector about their own submission, what it decides to
say nothing about, and what happens to a message that does not go out.

Every event either names a message or is decided silent, in writing, so
nothing reaches a collector by accident and nothing is dropped quietly. The
events themselves belong to the capability that writes them; this is what the
collector hears about them.

## Feature set

- What is sent
  - One decision per event: every event names a message or is decided silent,
    so a new event cannot ship unnoticed
  - One channel, one language: email, in English, to the address the
    submission was planned under
  - The action link: every message opens the submission at its own address,
    which needs no account
  - What each message carries: the facts the collector would otherwise have to
    ask for, and the documents where a document exists
- Silence on purpose
  - Told at the counter: a card refused in front of the collector sends no
    message
  - Told on the page: naming a collector is logged in the submission's history
    and sends none either
- The drop-off's messages
  - Sent by the submission: booked, moved, cancelled, missed and the day
    before, because the diary sends nothing for a product booking
  - What they carry: the visit, what to bring, the list and the fee, the day
    the cards leave, and a calendar file on a booking
- Reminders and the notice
  - While the cards sit ready: a reminder at each rung, costing nothing
  - The storage fee: told the day it starts, with what is due and the notice
    day
  - The written notice: sent the day staff post it, saying what is due, the
    days it gives and the clause behind it
  - Stopping at the notice: nothing stronger follows it in this release
- When a send fails
  - Owed, not lost: a failure is written down as still owed and never fails
    the thing it was about
  - One ladder: the vault's, for every message grading owes
  - Parked with a reason: the submission is flagged for staff, and an operator
    can send it again
- The footer
  - The submission's own line: its id and what it holds, under every message
  - Who is writing: the custodian's registered name trading as Grade10, the
    shop and its address, and the complaints contact
  - The clock: dates and times are the shop's
  - Nothing bracketed in production: a fact the footer prints is set before
    any message goes
