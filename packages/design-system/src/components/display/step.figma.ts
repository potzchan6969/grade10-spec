// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=5010-5711
// source=packages/design-system/src/components/display/step.tsx
// component=Step
import figma from "figma";

const instance = figma.selectedInstance;

const upcoming = instance.getBoolean("upcoming");
const showDescription = instance.getBoolean("showDescription");
const label = instance.getString("label");
const description = instance.getString("description");

export default {
  example: figma.code`<Step label="${label}"${showDescription ? figma.code` description="${description}"` : ""}${upcoming ? figma.code` state="upcoming"` : figma.code` state="progress"`} />`,
  imports: ['import { Step } from "@grade10/design-system"'],
  id: "step",
  metadata: { nestable: true },
};
