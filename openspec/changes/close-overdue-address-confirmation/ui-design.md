## Winner Order

- **Setup Overdue** (anchors: `auction-status-US-05`, `winner-order-US-23`) - Hide Confirm delivery address. Show a
  missed-deadline alert with Contact Us. Keep the order's normal shell and
  progress presentation.
- **Reopened** (anchor: `winner-order-US-23`) - Show Confirm delivery address and the fresh absolute deadline.
- **Recorded by operator** (anchor: `auction-status-US-06`) - Show the locked confirmed address. Do not restore
  winner address controls.

## Post-Sale

The controls are `complete-auction-post-sale`'s: Reopen setup and Record setup.
This change draws their states on an order whose address deadline has passed.

- **Setup Overdue order** (anchor: `auction-status-US-06`) - Reopen setup is the primary action, per
  `complete-auction-post-sale`. Record setup is listed with the order's other
  actions. Both are visible to every operator.
- **Without payment processing** (anchor: `auction-status-US-06`) - Both controls stay visible and disabled, with
  text naming the access, `Needs payment processing`. The server refuses the
  action.
- **Reopen setup dialog** (anchor: `auction-status-US-06`) - Requires a reason before it commits.
- **Record setup dialog** (anchor: `auction-status-US-06`) - Takes the winner's setup and requires a reason before it commits.
- **After invoice send** (anchor: `auction-status-US-06`) - Both controls are disabled with the reason
  stated: setup was confirmed before the send, and the confirmed address is locked.
- **Audit** (anchor: `auction-status-US-06`) - Show the named operator, time and reason for every Reopen
  setup or Record setup in the existing invoice log.
