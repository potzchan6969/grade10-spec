// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=2213-142
// source=packages/design-system/src/components/forms/radio-list-item.tsx
// component=RadioListItem
import figma from "figma";

const instance = figma.selectedInstance;

// `disabled` is this set's only axis. Its options are lowercase here and
// capitalised on `Radio Button` — an inconsistency in the file, not a typo
// below. Both spellings have to match whichever set the template reads.
const disabled = instance.getEnum("disabled", {
  false: false,
  true: true,
});

const label = instance.getString("label#2176:172");

export default {
  example: figma.code`<RadioListItem value={value}${disabled ? figma.code` disabled` : ""}>${label}</RadioListItem>`,
  imports: ['import { RadioListItem } from "@acetrader/design-system"'],
  id: "radio-list-item",
  metadata: { nestable: true },
};
