# Reconciliation: omit-profile-account-menu × remove-my-auction-orders

## Ownership

- `grade10-site/auction/auction-orders` — `The list holds one row per won
  order`: `omit-profile-account-menu` modifies the entry-points line;
  `remove-my-auction-orders` removes the requirement whole, which makes the
  edit moot once it lands.
- `grade10-site/site/page-shell` — `Signed-in collectors open what the build
  carries from the account menu`: both fold the requirement; its final text
  is `remove-my-auction-orders`'s (the not-offered list drops My Auction
  Orders), applied after `omit-profile-account-menu`'s version.

## Decisions

None open — removal is decided in `remove-my-auction-orders` Q1.

## Order

1. `omit-profile-account-menu` — its MODIFIED target must still exist at fold.
2. `remove-my-auction-orders` — removes what the first left of the capability.
