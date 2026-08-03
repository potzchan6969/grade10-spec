// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=2176-4213
// source=packages/design-system/src/components/display/list.tsx
// component=ListItem
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("label#2176:184");
const description = instance.getString("description#2176:185");

// Both booleans are expressed in code as the presence of a value rather than as
// their own props, so `showDescription` gates whether `description` is emitted
// at all. `divider` defaults to true, so it is emitted only when switched off —
// which Figma does on the last item of a list.
const showDescription = instance.getBoolean("showDescription#2176:186");
const divider = instance.getBoolean("divider#2176:188");

export default {
  example: figma.code`<ListItem${showDescription ? figma.code` description="${description}"` : ""}${divider ? "" : figma.code` divider={false}`}>${label}</ListItem>`,
  imports: ['import { ListItem } from "@acetrader/design-system"'],
  id: "list-item",
  metadata: { nestable: true },
};
