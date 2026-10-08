---
title: Services and Hand-offs
order: 6
---

## Values

| Service | Its mark | Opens | Closes |
| --- | --- | --- | --- |
| Vault | a vault case | when the valuation starts | at release, unwind or forfeit |
| Grading | a grading card on a submission | at hand-in | at hand-back, or a hand-off |
| Consignment | a consignment | when its agreement is signed | when the item is sold and paid out, or goes back |
| Auction | a lot | when the listing takes the item | when the lot is unsold or called off, or its buyer takes the item |
| Store | a store listing | when the item goes on sale | when it sells or comes off sale |

## Marks That Share an Item

A mark is a service acting on an item. Three kinds share one item; every
other mark stands alone.

- **A consignment with its sale** - a consignment and its auction lot, or a
  consignment and its store listing
- **The vault under an auction** - a storage-lane vault case stays while the
  item is consigned to auction, so it sells from the vault
- **One sale at a time** - an auction lot or a store listing, never both
- **Someone else's item sells under a consignment** - an auction lot or a
  store listing on an item the house does not own needs the owner's live
  consignment
- **Standing alone** - a card at grading takes no other mark; any other pair
  waits for one mark to close, or passes the item by a hand-off
- ❓ Owner, Legal - **A live loan** - an item securing a live loan takes no
  sale until the loan is repaid; whether a sale may repay it first is open

## Applying an Item

- **From the item page** - staff apply an item to a service, each service
  offered or withheld with the reason in words -
  [Inventory Console](/p/grade10-admin/inventory/console#the-item-page)
- **Ask first** - a service asks before it marks, and a refusal names the
  rule and the mark in the way, such as `With PSA on submission 5TW8HN`
- **What a service does is mirrored** - inventory records what a service did
  under its mark and never refuses it, as the register does for the vault -
  [Items](/p/grade10-admin/inventory/items#marks)
- **Paper behind every mark** - an item the house holds for someone else is
  always under a signed agreement of a service holding it

## Hand-offs

A hand-off passes an item from one service to the next in one act: one mark
closes and the next opens, and the item stays in custody with no release, no
new intake and no new label.

- **Paper first** - the next service's agreement is signed before the first
  mark closes
- **The owner decides** - or staff, for an item the house owns

| From | To | When |
| --- | --- | --- |
| Grading, ready | Vault | at hand-back - [Grading Console](/p/grade10-admin/grading/console#hand-back) |
| Grading, ready | Consignment to the store or the auction | at hand-back |
| Auction, won and paid | The winner's vault case | the winner picks keep in the vault at setup |
| Auction, unsold or cancelled | Consignment to the store, or the vault | the consignor picks |
| Store, ended unsold | Consignment to the auction, or the vault | the consignor picks |
| Vault, storage lane | The store, or grading | the owner asks; the vault case ends |

- **Keep in the vault** - the winner passes the identity check and signs the
  custody agreement on their own phone; the auction's mark holds the item
  until then, and the vault case opens on the item where it sits
- **Collect at a shop** - a winner may collect the item in person instead of
  a delivery - [Intake and Release](/p/grade10-admin/inventory/intake#release)
- ❓ Legal - **A forfeited item** - who sells an item the lender owns

## A Sale

- **The owner moves** - when an item leaves to its buyer, or is kept in the
  vault for them, the service that sold it moves the owner and closes its
  mark; nobody records the sale by hand
- **House stock settles** - a paid order sells the lot's stock hold -
  [Products and Stock](/p/grade10-admin/inventory/catalog#intake)

:::detail{title="Product decisions" for="pm"}
Only the vault marks the items it acts on. Nothing stops a card at the
grader from being listed, or one card from going on sale twice; the one
passage between services, grading into the vault, rests on a typed case
reference nobody checks; and a sale moves no owner. The owner asks that any
item can go to any service, and from one service to the next. The design is
[Inventory and Services Design](/references/inventory-and-services-design).

**Users.** Staff applying an item and passing it on; the services that mark
items; owners, who decide where their item goes next.

**Not in scope.** A collector applying their own item online, which waits
for a collector's page of their items; selling an item that secures a live
loan.

**Measurement.** Items held for someone else with no live mark, held at
zero; marks refused by name; hand-offs completed in one visit.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Every service marks | Decided | Grading, consignment, the auction and the store mark the items they act on, as the vault does - decided under the owner's delegation, 2026-10-08 | Product |
| Ask before marking | Decided | A service asks before it marks and is refused by name; what it then does under its mark is mirrored and never refused - decided under the owner's delegation, 2026-10-08 | Engineering |
| Which marks share an item | Decided | A consignment with its sale, and a storage-lane vault case under an auction; one sale at a time - decided under the owner's delegation, 2026-10-08 | Product |
| A hand-off is one act | Decided | Paper first, the owner decides, and the item never leaves custody - decided under the owner's delegation, 2026-10-08 | Product |
| A sale settles itself | Decided | The selling service moves the owner and closes its mark; nobody records a sale by hand - decided under the owner's delegation, 2026-10-08 | Product |
| Selling from the vault | ❓ Open | A storage-lane item sells from the vault and its vault case passes to the buyer; this replaces the register's refusal of a vaulted item changing owner | Owner |
| A live loan and a sale | ❓ Open | No sale until the loan is repaid is proposed | Owner, Legal |
| A forfeited item for sale | ❓ Open | Who sells an item the lender owns | Legal |
:::
