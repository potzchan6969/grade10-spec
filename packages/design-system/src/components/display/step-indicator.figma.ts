// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=5010-5570
// source=packages/design-system/src/components/display/step-indicator.tsx
// component=StepIndicator
import figma from "figma";

const instance = figma.selectedInstance;

const state = instance.getEnum("states", {
  upcoming: "upcoming",
  progress: "progress",
  completed: "completed",
});

export default {
  example: figma.code`<StepIndicator${state === "upcoming" ? "" : figma.code` state="${state}"`} />`,
  imports: ['import { StepIndicator } from "@grade10/design-system"'],
  id: "step-indicator",
  metadata: { nestable: true },
};
