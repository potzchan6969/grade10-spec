// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2213-142
// source=packages/design-system/src/components/forms/radio-list-item.tsx
// component=RadioListItem
import figma from "figma";

const instance = figma.selectedInstance;

// `isDisabled` is this set's only axis, with lowercase options — the same shape
// `Radio Button` carries.
const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const label = instance.getString("label");

export default {
  example: figma.code`<RadioListItem value={value}${disabled ? figma.code` disabled` : ""}>${label}</RadioListItem>`,
  imports: ['import { RadioListItem } from "@grade10/design-system"'],
  id: "radio-list-item",
  metadata: { nestable: true },
};
