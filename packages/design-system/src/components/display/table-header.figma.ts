// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4969-4927
// source=packages/design-system/src/components/display/table-header.tsx
// component=TableHeader
import figma from "figma";

const instance = figma.selectedInstance;
const heads = instance.getSlot("heads");

export default {
  example: figma.code`<TableHeader>${heads}</TableHeader>`,
  imports: ['import { TableHeader } from "@grade10/design-system"'],
  id: "table-header",
  metadata: { nestable: true },
};
