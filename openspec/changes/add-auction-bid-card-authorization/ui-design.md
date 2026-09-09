## Screens

### Listing bid — payment authorization

The Storybook story
`auction-listing-bid-panel--payment-authorization` is the source of truth for
the linked-card authorization state on the listing bid panel. A collector enters
the maximum in the panel and authorization starts on commit without reopening
card-link setup or asking for a separate confirmation. Pending and refused live
on the bid surface as
`auction-listing-bid-panel-dialogs--payment-authorization-pending` and
`auction-listing-bid-panel-dialogs--payment-authorization-refused`.

## Components

From `@grade10/design-system`, all existing: `Dialog`, `DialogContent`,
`DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`,
`DialogFooter`, `Button`, `Text`, `Card`, and `VStack`.

`ListingAuctionBidCard` remains an application-owned Auction component. Card
linking stays in the enrollment setup surface; authorization status and failure
copy are application-owned bid-panel state. No new shared component, variant,
or token is needed.

## Story map

| Contract state | Scenarios | Storybook source | State shown |
| --- | --- | --- | --- |
| Card required before a first bid | `grade10-site-auction-bid-payment-method-SC-01` | `auction-listing-bid-panel--need-card`, `auction-listing-bid-panel-dialogs--setup-modal` | Amount controls are disabled; Link a card to bid opens enrollment setup. |
| Linked method authorizes a committed maximum | `grade10-site-auction-bid-payment-method-SC-02`, `grade10-site-auction-bid-payment-method-SC-10` | `auction-listing-bid-panel--payment-authorization` | The linked card stays on the panel while authorization starts on commit. |
| Authorization pending or requiring authentication | `grade10-site-auction-bid-payment-method-SC-03` | `auction-listing-bid-panel-dialogs--payment-authorization-pending` | The bid action is busy; enrollment setup does not open. |
| Authorization refused or provider failure | `grade10-site-auction-bid-payment-method-SC-04`, `grade10-site-auction-bid-payment-method-SC-09`, `grade10-site-auction-bid-payment-method-SC-12`, `grade10-site-auction-bid-payment-method-SC-13` | `auction-listing-bid-panel-dialogs--payment-authorization-refused`, `auction-listing-bid-panel--payment-authorization` | The exact failure copy appears on or near the bid action; the collector can change the card before retrying when the listing is still editable. |
| Later bid reuses the listing method | `grade10-site-auction-bid-payment-method-SC-05`, `grade10-site-auction-bid-payment-method-SC-06`, `grade10-site-auction-bid-payment-method-SC-11` | `auction-listing-bid-panel--linked-card`, `auction-listing-bid-panel--ready` | The committed card remains selected while a raise succeeds or preserves the prior maximum after refusal. |
| Outbid release and idempotent provider outcome | `grade10-site-auction-bid-payment-method-SC-07`, `grade10-site-auction-bid-payment-method-SC-08` | No dedicated visual state; contract and backend evidence | The panel's standing changes through the existing auction states; cancellation and replay remain non-visual lifecycle behavior. |
