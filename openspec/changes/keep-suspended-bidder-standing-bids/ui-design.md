# UI design

The admin Users panel is the layout source for auction standing. The shared
panel remains a controlled surface; the admin application owns the mutation,
copy, and moderation-dialog state.

## Screens

### Admin Users — account panel

The auction standing appears beside platform standing in the account panel.
Suspending and reinstating start from the panel and use the existing moderation
dialog for confirmation.

## Components

- **Existing shared block:** `UserAccountPanel` and `UserModerationDialog`
- **Consumer-owned:** standing data, grant gate, mutation handlers, reason
  copy, and confirmation state

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Not suspended | Suspend from auctions when the console supplies a handler and the session holds the grant | `grade10-admin-console-user-directory-SC-16` |
| Suspended | Auction standing, reason, actor, time, and Reinstate; the platform standing remains separate | `grade10-admin-console-user-directory-SC-16` |
| Missing grant or handler | Neither auction-standing move | `grade10-admin-console-user-directory-SC-19` |
| Suspend confirmation | Required reason in the moderation dialog | `grade10-admin-console-user-directory-SC-17` |
