// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2213-392
// source=packages/design-system/src/components/forms/radio-list.tsx
// component=RadioList
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties on this one — it is a plain component with a slot, a
// label and a boolean that gates the label.
const label = instance.getString("label");
const showLabel = instance.getBoolean("showLabel");
const items = instance.getSlot("list");

// `showLabel` is expressed as the absence of the prop, so there is no separate
// boolean to emit.
export default {
  example: figma.code`<RadioList${showLabel ? figma.code` label="${label}"` : ""}>${items}</RadioList>`,
  imports: ['import { RadioList } from "@grade10/design-system"'],
  id: "radio-list",
  metadata: { nestable: true },
};
