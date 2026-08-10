// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=2213-130
// source=packages/design-system/src/components/forms/radio-button.tsx
// component=RadioButton
import figma from "figma";

const instance = figma.selectedInstance;

// Both axes are two-option VARIANT properties standing in for booleans, so each
// map produces no strings and is recognised as a non-variant prop rather than a
// broken axis. Option names are lowercase and the disabled axis is `isDisabled`
// — the file's convention across every set, which this template used to miss on
// both counts.
const checked = instance.getEnum("selected", {
  true: true,
  false: false,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

// `checked` is emitted rather than `defaultChecked` because a lone radio is a
// controlled leaf: the RadioGroup around it owns the value.
export default {
  example: figma.code`<RadioButton value={value}${checked ? figma.code` checked` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { RadioButton } from "@grade10/design-system"'],
  id: "radio-button",
  metadata: { nestable: true },
};
