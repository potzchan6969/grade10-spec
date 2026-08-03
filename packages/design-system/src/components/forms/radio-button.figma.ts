// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=2213-130
// source=packages/design-system/src/components/forms/radio-button.tsx
// component=RadioButton
import figma from "figma";

const instance = figma.selectedInstance;

// Both axes are two-option VARIANT properties standing in for booleans, so each
// map produces no strings and is recognised as a non-variant prop rather than a
// broken axis. Note the capitalised option names — this set uses `True`/`False`
// where `Radio List Item` uses lowercase; the keys must match Figma verbatim.
const checked = instance.getEnum("selected", {
  True: true,
  False: false,
});

const disabled = instance.getEnum("disabled", {
  False: false,
  True: true,
});

// `checked` is emitted rather than `defaultChecked` because a lone radio is a
// controlled leaf: the RadioGroup around it owns the value.
export default {
  example: figma.code`<RadioButton value={value}${checked ? figma.code` checked` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { RadioButton } from "@acetrader/design-system"'],
  id: "radio-button",
  metadata: { nestable: true },
};
