// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2595-295
// source=packages/design-system/src/components/forms/otp-input.tsx
// component=OtpInput
import figma from "figma";

const instance = figma.selectedInstance;

const status = instance.getEnum("status", {
  default: "default",
  error: "error",
  success: "success",
});

// Figma's `state=focus` pins the ring on slot 3 — index 2 in code.
const state = instance.getEnum("state", {
  default: "default",
  focus: "focus",
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const label = instance.getString("label#2595:91");
const message = instance.getString("message#2595:100");
const showLabel = instance.getBoolean("showLabel#2595:109");

export default {
  example: figma.code`<OtpInput${showLabel ? figma.code` label="${label}"` : ""} defaultValue="128450"${status === "default" ? "" : figma.code` status="${status}"`}${message ? figma.code` message="${message}"` : ""}${state === "focus" ? figma.code` focusedIndex={2}` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { OtpInput } from "@grade10/design-system"'],
  id: "otp-input",
  metadata: { nestable: true },
};
