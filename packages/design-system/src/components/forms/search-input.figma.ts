// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=2132-2782
// source=packages/design-system/src/components/forms/search-input.tsx
// component=SearchInput
import figma from "figma";

const instance = figma.selectedInstance;

// This set calls its tonal axis `type`, not `status`, and has only the two
// options — there is no error or success search field in the design, so the
// component offers no status prop and this map emits nothing. Both options are
// still listed: an unmapped one resolves to undefined.
instance.getEnum("type", {
  default: false,
  placeholder: false,
});

instance.getEnum("state", {
  default: false,
  focus: false,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const label = instance.getString("label#2132:85");
const value = instance.getString("value#2132:86");
const placeholder = instance.getString("placeholder#2159:134");
const showLabel = instance.getBoolean("showLabel#2159:117");
const clear = instance.getBoolean("clear#2132:87");

export default {
  example: figma.code`<SearchInput${showLabel ? figma.code` label="${label}"` : ""} placeholder="${placeholder}" defaultValue="${value}"${clear ? figma.code` onClear={onClear}` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { SearchInput } from "@acetrader/design-system"'],
  id: "search-input",
  metadata: { nestable: true },
};
