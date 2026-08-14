// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4208-2122
// source=packages/design-system/src/components/forms/stepper.tsx
// component=Stepper
import figma from "figma";

const instance = figma.selectedInstance;

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const value = instance.getString("value");

export default {
  example: figma.code`<Stepper value={${value}}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { Stepper } from "@grade10/design-system"'],
  id: "stepper",
  metadata: { nestable: true },
};
