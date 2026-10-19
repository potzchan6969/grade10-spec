## Goals

- Stop Order Progress from reading as already shipped while the lot is still packing.
- Make the paid, undispatched badge name what is happening.
- Keep five progress steps and the same derivation rules.
- Keep Shipping as the current progress step while Preparing Shipment.
- Match Shipped badge tone to Preparing Shipment (muted `default`).

## Non-Goals

- Adding a sixth progress step (Preparing → Shipped).
- Renaming Delivered vs Completed, or overdue badge drift on Winner Order preview.
- Changing step-indicator ping behaviour (animation).
- Leaving Shipping incomplete/upcoming while Preparing Shipment.
- Changing store Delivery Status or store Processing copy.
- Changing Shipped / Delivered letter CTAs or tracking-link chrome.
- Regenerating the order-status diagram SVG (tracked separately).

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What should progress step 4 read? | **Shipping** | Keep **Shipped** as the phase label |
| Q2 | What should the paid, undispatched badge read? | **Preparing Shipment** | Keep **Processing**; rename step only |
| Q3 | How many steps? | Stay at five; Preparing Shipment and Shipped share Shipping | Split into Preparing + Shipped |
| Q4 | Shipping indicator while Preparing Shipment? | **Current** (progress / ping) with Preparing to ship | Incomplete / upcoming Shipping after Payment |
| Q5 | Shipped badge tone on Winner Order and My Auctions? | Badge `default` (muted fill), same as Preparing Shipment | Keep `outline` |
| Q6 | Does Winner Order name the carrier anywhere? | No carrier name anywhere on Winner Order; the tracking number is the carrier link. `add-winner-order-tax-line` carries the edit to `Records the winner keeps` (its decision Q14), so this change does not modify that requirement | Keep a carrier name in the tracker; edit that requirement here |
| Q7 | Is the tracking number a link when the operator recorded no tracker link? | No: it is the external carrier link only when a tracker link was recorded, and plain text otherwise, matching `winner-order-tracking-link` Q6; `winner-order-SC-253` and its case carry the condition - the planning owner | Link a bare tracking number to a guessed carrier page |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/winner-order` | Does a ping on Shipped mean dispatched? | Q1 |
| `grade10-site/auction/order-status` | Is Processing clear on My Auctions? | Q2 |
| `grade10-site/auction/winner-order` | Current vs incomplete on Shipping while packing? | Q4 |
| `grade10-site/auction/winner-order` | Should Shipped badge match Preparing Shipment? | Q5 |
| `grade10-site/auction/winner-order` | Does the tracker still name the carrier? | Q6 |
