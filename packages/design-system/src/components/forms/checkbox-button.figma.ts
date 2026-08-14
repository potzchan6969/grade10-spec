// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2176-4089
// source=packages/design-system/src/components/forms/checkbox-button.tsx
// component=CheckboxButton
import figma from "figma";

const instance = figma.selectedInstance;

// Both axes are two-option VARIANT properties standing in for booleans, so each
// map produces no strings and is recognised as a non-variant prop.
const checked = instance.getEnum("checked", {
  true: true,
  false: false,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

export default {
  example: figma.code`<CheckboxButton${checked ? figma.code` checked` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { CheckboxButton } from "@grade10/design-system"'],
  id: "checkbox-button",
  metadata: { nestable: true },
};
