// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1051
// source=packages/ui/src/blocks/store-home/store-collection-tile.tsx
// component=StoreCollectionTile
//
// Excluded from `code-connect:publish` in packages/ui/figma.config.json.
//
// `4195-1051` is a plain frame on the Store page, and Code Connect resolves
// only published components — validation rejects the whole file set over it,
// so leaving it in the glob blocked every other template in this package from
// publishing. The mapping below is kept because it is otherwise correct.
//
// There is nothing to repoint it at. `Collection Card` (4396-5759) is the
// closest published component by name and is a different thing: a 112x140
// portrait player card carrying a photo and a name, against this tile's
// landscape bento cell with a circular icon well. Design has to publish the
// tile as a component before this can ship.
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
