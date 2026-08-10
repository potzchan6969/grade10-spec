// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=2213-392
// source=packages/design-system/src/components/forms/radio-list.tsx
// component=RadioList
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties on this one — it is a plain component with a slot, a
// label and a boolean that gates the label.
const label = instance.getString("label#2213:9");
const showLabel = instance.getBoolean("showLabel#2213:10");
const items = instance.getSlot("list#2213:8");

// `showLabel` is expressed as the absence of the prop, so there is no separate
// boolean to emit.
export default {
  example: figma.code`<RadioList${showLabel ? figma.code` label="${label}"` : ""}>${items}</RadioList>`,
  imports: ['import { RadioList } from "@grade10/design-system"'],
  id: "radio-list",
  metadata: { nestable: true },
};
