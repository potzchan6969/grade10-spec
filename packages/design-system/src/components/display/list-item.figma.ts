// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2176-4213
// source=packages/design-system/src/components/display/list.tsx
// component=ListItem
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("label");
const description = instance.getString("description");

// Both booleans are expressed in code as the presence of a value rather than as
// their own props, so `showDescription` gates whether `description` is emitted
// at all. `divider` defaults to true, so it is emitted only when switched off —
// which Figma does on the last item of a list.
const showDescription = instance.getBoolean("showDescription");
const divider = instance.getBoolean("divider");

export default {
  example: figma.code`<ListItem${showDescription ? figma.code` description="${description}"` : ""}${divider ? "" : figma.code` divider={false}`}>${label}</ListItem>`,
  imports: ['import { ListItem } from "@grade10/design-system"'],
  id: "list-item",
  metadata: { nestable: true },
};
