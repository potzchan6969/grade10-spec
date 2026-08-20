// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4181-1978
// source=packages/design-system/src/components/display/pagination.tsx
// component=PaginationLink
import figma from "figma";

const instance = figma.selectedInstance;

const isActive = instance.getEnum("active", {
  false: false,
  true: true,
});

const disabled = instance.getEnum("disabled", {
  false: false,
  true: true,
});

// Hover and pressed are CSS pseudo-states with no prop behind them. `state`
// is mapped so the axis is accounted for; disabled is the `disabled` axis.
instance.getEnum("state", {
  default: false,
  hover: false,
  pressed: false,
  disabled: false,
});

const label = instance.getString("label");

export default {
  example: figma.code`<PaginationLink${isActive ? figma.code` isActive` : ""}${disabled ? figma.code` disabled` : ""}>${label}</PaginationLink>`,
  imports: ['import { PaginationLink } from "@grade10/design-system"'],
  id: "pagination-link",
  metadata: { nestable: true },
};
