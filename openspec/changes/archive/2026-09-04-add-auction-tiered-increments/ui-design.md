# UI

## Screens

No new screen or layout is introduced. Existing listing-editor and bid-dialog
frames retain their layout; this change removes one editor control, narrows the
currency choice, and changes the values shown by existing bid shortcuts.

## Components

| Surface | Existing component contract | Change |
| --- | --- | --- |
| Auction listing editor | Existing currency selector and price fields | Offer USD, HKD, and JPY only; remove Minimum increment. |
| Collector bid dialog | Existing minimum-next-amount display and quick-bid actions | Continue to show the next valid amount; generate each additional quick amount from the preceding suggested amount. |

No design-system token, primitive, or `@grade10/ui` export changes are needed.

## States

| State | Spec scenario | UI behavior |
| --- | --- | --- |
| Supported currency | `grade10-admin-auction-listing-SC-06` | The editor permits the selected USD, HKD, or JPY value. |
| Unsupported currency | `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-09`, `grade10-site-auction-bid-increments-SC-06` | The form names currency as invalid; a direct API refusal preserves the form's stored listing state. |
| Tier boundary | `grade10-site-auction-bid-increments-SC-02` | The displayed next minimum and quick-bid suggestions use the higher tier. |
| Below minimum | `grade10-site-auction-bid-increments-SC-04` | Existing bid refusal presents the authoritative minimum next amount. |
