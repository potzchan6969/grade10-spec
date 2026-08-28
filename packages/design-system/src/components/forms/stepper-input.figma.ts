// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4623-395
// source=packages/design-system/src/components/forms/stepper-input.tsx
// component=StepperInput
import figma from "figma";

const instance = figma.selectedInstance;

const status = instance.getEnum("status", {
  default: "default",
  error: "error",
  success: "success",
});

const size = instance.getEnum("size", {
  md: "md",
  lg: "lg",
});

// Focus is a CSS pseudo-state with no prop behind it. `true` maps to true so
// the checker can treat `false` as the base; the result is discarded and
// nothing is emitted.
instance.getEnum("focus", {
  false: false,
  true: true,
});

const disabled = instance.getEnum("disabled", {
  false: false,
  true: true,
});

// `placeholder` is what an empty field looks like, not a prop. Both options
// still have to be mapped — an unmapped one resolves to undefined.
const isPlaceholder = instance.getEnum("placeholder", {
  false: false,
  true: true,
});

const label = instance.getString("label");
const value = instance.getString("value");
const message = instance.getString("message");
const placeholder = instance.getString("placeholder");

export default {
  example: figma.code`<StepperInput${label ? figma.code` label="${label}"` : ""}${placeholder ? figma.code` placeholder="${placeholder}"` : ""}${isPlaceholder || !value ? "" : figma.code` defaultValue={${value}}`}${status === "default" ? "" : figma.code` status="${status}"`}${size === "md" ? "" : figma.code` size="${size}"`}${message ? figma.code` message="${message}"` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { StepperInput } from "@grade10/design-system"'],
  id: "stepper-input",
  metadata: { nestable: true },
};
