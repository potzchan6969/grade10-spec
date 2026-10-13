// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7035-268
// source=packages/design-system/src/components/display/detail-row.tsx
// component=DetailRow
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("Label");
const value = instance.getSlot("Value");

export default {
  example: figma.code`<DetailRow label="${label}">${value}</DetailRow>`,
  imports: ['import { DetailRow } from "@grade10/design-system"'],
  id: "detail-row",
  metadata: { nestable: true },
};
