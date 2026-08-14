// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2213-240
// source=packages/design-system/src/components/forms/checkbox-list.tsx
// component=CheckboxList
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("label");
const showLabel = instance.getBoolean("showLabel");
const items = instance.getSlot("list");

export default {
  example: figma.code`<CheckboxList${showLabel ? figma.code` label="${label}"` : ""}>${items}</CheckboxList>`,
  imports: ['import { CheckboxList } from "@grade10/design-system"'],
  id: "checkbox-list",
  metadata: { nestable: true },
};
