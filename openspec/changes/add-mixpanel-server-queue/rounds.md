# Rounds

One row per round: what it read, who read it, what stood and what it asked.
Written by the landing, in the landing's own commit.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 1 | proposal | backend, integration, operations, simpler, verifier | Order Paid follows the order_events drain and some sends have no stored fact, so Q10 names where each writes its record; the ZZZ store is a fifth database; erasure and the metric cover held records; a held profile write never overrides a later one; Q6, Q8 and Q9 fold into Q1; fallen to the tech design: response handling, batch limits, record fields, the owner of each profile property | `Q12` | - |
| 2 | decisions | backend, integration, operations, simpler, verifier | read with the proposal in round 1: Q10 names where each send writes its record, Q12 keeps a held profile write from overriding a later one, Q14 covers held records, Q6, Q8 and Q9 fold into Q1; the blind suite's five questions landed as Q16 to Q20 | - | - |
| 3 | user-journeys | backend, integration, operations, simpler, verifier | read with the proposal in round 1: walked by nobody stands, the capability path moved to grade10-site/analytics/analytics | - | - |
| 4 | tech-design | deterministic, simple, consistent, testable, simpler, verifier | a refused fold held later good writes, so it splits by seq; the withheld Order Paid arm could lose or double-count, so orders.order_paid_recorded_at marks it once under one identity, with a backfill; Checkout Started moved into the payment refs' transaction; one batch per claim and split refusals bound a transaction; an unnamed 400 splits; isSet decides the token; the tracker moved to an ingest subpath; loyalty's erased_at and remaining; monitors named; rollback risk stated; fallen: the event column and held indexes stay for engineers | - | - |
| 5 | specs | simpler, verifier | the one-writer rule had no decision behind it and moved to the tech design; a restated latest-write rule dropped; keep for stored records and held only for refused ones; fallen: frozen and counted once stay apart, the first a worker claim and the second the outcome in Mixpanel | - | - |
| 6 | test-cases | simpler, verifier | TC21 no longer compares a day's counts, which other traffic decides; fallen: its two step-two lines stay apart | - | - |
