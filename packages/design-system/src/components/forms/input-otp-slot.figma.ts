// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2595-158
// source=packages/design-system/src/components/forms/input-otp-slot.tsx
// component=InputOtpSlot
import figma from "figma";

const instance = figma.selectedInstance;

const status = instance.getEnum("status", {
  default: "default",
  error: "error",
  success: "success",
});

const focused = instance.getEnum("state", {
  default: false,
  focus: true,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const digit = instance.getString("digit#2595:81");
const filled = digit !== "0";

export default {
  example: figma.code`<InputOtpSlot${filled ? figma.code` digit="${digit}"` : ""}${status === "default" ? "" : figma.code` status="${status}"`}${focused ? figma.code` focused` : ""}${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { InputOtpSlot } from "@grade10/design-system"'],
  id: "input-otp-slot",
  metadata: { nestable: true },
};
