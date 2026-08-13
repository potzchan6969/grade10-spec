// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2132-2715
// source=packages/design-system/src/components/forms/text-input.tsx
// component=TextInput
import figma from "figma";

const instance = figma.selectedInstance;

// `placeholder` collapses onto `default`: the two differ only by whether the
// field has a value, so emitting `status="placeholder"` would print a prop the
// component does not have. Every option still has to be mapped — an unmapped
// one resolves to undefined and emits broken code.
const status = instance.getEnum("status", {
  default: "default",
  placeholder: "default",
  error: "error",
  success: "success",
});

// Interaction only. Focus is a CSS pseudo-state with no prop behind it, so
// neither option emits anything; the map exists so the axis is accounted for
// rather than reported unmapped.
instance.getEnum("state", {
  default: false,
  focus: false,
});

// Disabled and loading are their own axes, which is what makes a loading error
// field drawable. Each map produces no strings and is read as a boolean gate.
const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});
const loading = instance.getEnum("isLoading", {
  false: false,
  true: true,
});

const label = instance.getString("label");
const value = instance.getString("value");
const message = instance.getString("message");
const placeholder = instance.getString("placeholder");
const showLabel = instance.getBoolean("showLabel");

export default {
  // `default` is the cva defaultVariant for `status`, so the prop is omitted
  // there. `showLabel` is expressed as the presence of `label`.
  example: figma.code`<TextInput${showLabel ? figma.code` label="${label}"` : ""} placeholder="${placeholder}" defaultValue="${value}"${status === "default" ? "" : figma.code` status="${status}"`}${message ? figma.code` message="${message}"` : ""}${loading ? figma.code` loading` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { TextInput } from "@grade10/design-system"'],
  id: "text-input",
  metadata: { nestable: true },
};
