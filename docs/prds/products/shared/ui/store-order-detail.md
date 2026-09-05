---
title: Order Details Blocks
spec: shared/ui/store-order-detail
order: 8
---

Order Details is one shared page body with reusable header, delivery, item,
summary, payment, and address parts. Applications supply the facts, formatted
values, copy, and actions; the blocks fetch nothing and navigate nowhere.

An application may know only part of an order. Delivery, payment, address,
loyalty, and optional money rows therefore disappear independently when no fact
is supplied. The block never fills a designed space with a value the application
does not know.

## In flight

::changes{spec="shared/ui/store-order-detail"}
