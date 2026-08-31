// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1048
// source=packages/ui/src/blocks/store-home/store-section-header.tsx
// component=StoreSectionHeader
//
// Excluded from `code-connect:publish` in packages/ui/figma.config.json.
//
// `4195-1048` is a layout frame — a heading text layer beside a Link instance
// — not a component. `Product / Product List Header` (4288-14117) is published
// and already spoken for by product-list-header.figma.ts, and is a different
// component. Held back until design publishes a section header.
import figma from "figma";

const instance = figma.selectedInstance;

const title = instance.getString("title");
const browseAll = instance.getString("browseAll");

export default {
  example: figma.code`<StoreSectionHeader copy={{ browseAll: "${browseAll}" }} title="${title}" browseAllHref={browseAllHref} />`,
  imports: ['import { StoreSectionHeader } from "@grade10/ui"'],
  id: "store-section-header",
  metadata: { nestable: true },
};
