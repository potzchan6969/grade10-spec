// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6332-3599
// source=packages/design-system/src/components/overlays/toast-close.tsx
// component=ToastClose
import figma from "figma";

const instance = figma.selectedInstance;

// Hover is a CSS pseudo-state with no prop behind it, so `state` emits nothing
// and is mapped only so the axis is accounted for.
instance.getEnum("state", {
  default: false,
  hover: false,
});

export default {
  example: figma.code`<ToastClose />`,
  imports: ['import { ToastClose } from "@grade10/design-system"'],
  id: "toast-close",
  metadata: { nestable: true },
};
