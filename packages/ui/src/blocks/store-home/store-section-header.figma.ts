// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1048
// source=packages/ui/src/blocks/store-home/store-section-header.tsx
// component=StoreSectionHeader
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
