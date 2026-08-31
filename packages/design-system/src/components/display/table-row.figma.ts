// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4969-4960
// source=packages/design-system/src/components/display/table-row.tsx
// component=TableRow
import figma from "figma";

const instance = figma.selectedInstance;
const cells = instance.getSlot("cells");

export default {
  example: figma.code`<TableRow>${cells}</TableRow>`,
  imports: ['import { TableRow } from "@grade10/design-system"'],
  id: "table-row",
  metadata: { nestable: true },
};
