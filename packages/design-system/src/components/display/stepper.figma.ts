// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7046-5420
// source=packages/design-system/src/components/display/stepper.tsx
// component=Stepper
import figma from "figma";

const instance = figma.selectedInstance;
const orientation = instance.getEnum("orientation", {
  horizontal: "horizontal",
  vertical: "vertical",
});
const content = instance.getSlot("Slot");

export default {
  example: figma.code`<Stepper${orientation === "horizontal" ? "" : figma.code` orientation="${orientation}"`}>${content}</Stepper>`,
  imports: ['import { Stepper } from "@grade10/design-system"'],
  id: "stepper",
  metadata: { nestable: true },
};
