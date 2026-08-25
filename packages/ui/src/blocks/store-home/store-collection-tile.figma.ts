// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1051
// source=packages/ui/src/blocks/store-home/store-collection-tile.tsx
// component=StoreCollectionTile
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("label");
const featured = instance.getBoolean("featured");

export default {
  example: figma.code`<StoreCollectionTile label="${label}" icon={icon} href={href}${featured ? figma.code` featured` : ""} />`,
  imports: ['import { StoreCollectionTile } from "@grade10/ui"'],
  id: "store-collection-tile",
  metadata: { nestable: true },
};
