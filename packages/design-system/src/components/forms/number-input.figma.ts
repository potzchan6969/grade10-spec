// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2176-4273
// source=packages/design-system/src/components/forms/number-input.tsx
// component=NumberInput
import figma from "figma";

const instance = figma.selectedInstance;

// Same four axes as Text Input; see text-input.figma.ts for why `placeholder`
// collapses onto `default` and why `state` emits nothing.
const status = instance.getEnum("status", {
  default: "default",
  placeholder: "default",
  error: "error",
  success: "success",
});

instance.getEnum("state", {
  default: false,
  focus: false,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});
const loading = instance.getEnum("isLoading", {
  false: false,
  true: true,
});

const label = instance.getString("label#2132:71");
const value = instance.getString("value#2132:77");
const message = instance.getString("message#2132:93");
const placeholder = instance.getString("placeholder#2159:124");
const unit = instance.getString("unit#2176:189");
const showLabel = instance.getBoolean("showLabel#2159:108");

// Figma's `clear` is a boolean, which on its own cannot clear anything, so it
// gates an `onClear` handler the consumer supplies — the same shape the design
// draws, expressed as the prop that makes it work.
const clear = instance.getBoolean("clear#2176:199");

export default {
  example: figma.code`<NumberInput${showLabel ? figma.code` label="${label}"` : ""} placeholder="${placeholder}" defaultValue="${value}" unit="${unit}"${status === "default" ? "" : figma.code` status="${status}"`}${message ? figma.code` message="${message}"` : ""}${clear ? figma.code` onClear={onClear}` : ""}${loading ? figma.code` loading` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { NumberInput } from "@grade10/design-system"'],
  id: "number-input",
  metadata: { nestable: true },
};
