---
title: Store Main Page Blocks
spec: shared/ui/store-home
order: 3
---

Three blocks make a store's main page, between the site chrome and a row of
products. A **hero** shows an eyebrow, title, description and image, with two
actions it reports. A **section header** shows a title and, only when an address
is given, a browse-all link. A **collection grid** lays one tile per supplied
collection out in a bento arrangement, with the featured collection in the large
cell.

None of the three invents a word or an image. Give the section header no browse
address and it renders a title alone; give the grid three collections and it
lays out three tiles.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051" title="Hero Section"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1050" title="Collection Cards — the bento grid"}

::story{id="store-home-storehomehero--default" title="The hero with both actions"}

::story{id="store-home-storesectionheader--no-browse-link" title="A section header with no browse address"}

::story{id="store-home-storecollectiongrid--default" title="The bento collection grid"}
