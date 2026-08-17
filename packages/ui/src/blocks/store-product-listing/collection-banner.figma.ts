// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4248-5104
// source=packages/ui/src/blocks/store-product-listing/collection-banner.tsx
// component=CollectionBanner
import figma from "figma";

const instance = figma.selectedInstance;

const collection = instance.getString("collection");
const description = instance.getString("description");

export default {
  // Breadcrumbs are a nested instance the consumer assembles, not a TEXT
  // property, so the snippet names the slot rather than emitting one store's
  // trail. Image is optional and not a component property.
  example: figma.code`<CollectionBanner
  breadcrumbs={breadcrumbs}
  collection="${collection}"
  description="${description}"
/>`,
  imports: ['import { CollectionBanner } from "@grade10/ui"'],
  id: "collection-banner",
  metadata: { nestable: true },
};
