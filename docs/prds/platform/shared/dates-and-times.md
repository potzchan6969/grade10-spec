---
title: Dates and Times
spec: shared/dates-and-times
order: 2
---

Every date the platform holds is an instant — a single point in time with no
zone of its own. Everything interesting happens on the way from that instant to
the words a person reads: which of four shapes it takes (a day, a moment, an
event, a deadline), which language words it, and which zone it names.

Operator tables, admin surfaces, and sent messages state Coordinated Universal
Time, because a deadline or audit fact that means one thing on a laptop in Hong
Kong and another on one in Seoul is a support ticket in waiting. Collector
activity is the reader-facing exception: recent activity uses a short relative
label, and older activity uses the reader's stated time zone without a zone
suffix. The ordering and punctuation remain the platform's rather than the
browser's, and a date that is not a valid instant stops the render instead of
printing a dash nobody can debug.

Traffic runs the other way in exactly one place: a calendar day an operator
types into a filter. It carries no time and no zone, so it becomes the instants
that day opens and closes — which is what makes a window cover both of its end
days whole, and read back as the day that was typed from any machine.
