// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4344-508
// source=packages/design-system/src/components/layout/navigation-link.tsx
// component=NavigationLink
import figma from "figma";

const instance = figma.selectedInstance;

const active = instance.getEnum("active", {
  true: true,
  false: false,
});

const disabled = instance.getEnum("disabled", {
  false: false,
  true: true,
});

// Hover is a CSS pseudo-state with no prop behind it, so `state` emits
// nothing and is mapped only so the axis is accounted for.
instance.getEnum("state", {
  default: false,
  hover: false,
});

const label = instance.getString("label");

export default {
  example: figma.code`<NavigationLink${active ? figma.code` active` : ""}${disabled ? figma.code` disabled` : ""}>${label}</NavigationLink>`,
  imports: ['import { NavigationLink } from "@grade10/design-system"'],
  id: "navigation-link",
  metadata: { nestable: true },
};
