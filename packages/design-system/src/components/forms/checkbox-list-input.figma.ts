// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2176-3979
// source=packages/design-system/src/components/forms/checkbox-list-input.tsx
// component=CheckboxListInput
import figma from "figma";

const instance = figma.selectedInstance;

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const size = instance.getEnum("size", {
  default: "default",
  sm: "sm",
});

const label = instance.getString("label");
const count = instance.getString("count");
const showCount = instance.getBoolean("showCount");

export default {
  example: figma.code`<CheckboxListInput${size === "default" ? "" : figma.code` size="${size}"`}${disabled ? figma.code` disabled` : ""}${showCount ? figma.code` count="${count}"` : ""}>${label}</CheckboxListInput>`,
  imports: ['import { CheckboxListInput } from "@grade10/design-system"'],
  id: "checkbox-list-input",
  metadata: { nestable: true },
};
