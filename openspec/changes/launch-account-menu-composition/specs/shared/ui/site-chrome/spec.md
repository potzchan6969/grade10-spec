## Feature set

- Header controls
  - Handler-gated: search, account, cart, My Orders, and Membership render
    only when a handler is supplied
  - No wishlist: the header does not offer a wishlist control
  - Account menu: signed in, the sign-in email with its small initial avatar
    above the items; My Orders joins ahead of My Auctions when its handler is
    supplied, Membership joins after My Auctions when its handler is
    supplied, Sign Out is always last and reads "Sign Out"; Profile stays out
    of Grade10's launch compositions though `onProfile` remains on the export
  - Compact menu: left drawer for navigation and utilities, with language in
    a nested drawer
  - Wide layout: primary navigation and language stay in the bar
