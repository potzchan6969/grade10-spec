# Design

The portable layer owns semantic dialog presentation and transient focus behavior only. `PaymentDialog` is controlled by `open` and `onOpenChange`; checkout, progress, and outcome composites receive normalized content and actions.

Price loading, promo entry/applied/error, token selection, transaction progress, and action availability are explicit prop states. A consumer computes balance/network eligibility, retry windows, hosted-checkout redirects, and payment result copy before rendering.

All visual hooks use `at-payment-*` classes and data attributes. The implementation has no application imports or side effects beyond local modal focus handling.
