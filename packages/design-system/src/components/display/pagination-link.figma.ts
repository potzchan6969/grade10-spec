// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4181-1978
// source=packages/design-system/src/components/display/pagination.tsx
// component=PaginationLink
import figma from "figma";

const instance = figma.selectedInstance;

const isActive = instance.getEnum("isActive", {
  false: false,
  true: true,
});

const disabled = instance.getEnum("state", {
  default: false,
  hover: false,
  pressed: false,
  disabled: true,
});

const label = instance.getString("label");

export default {
  example: figma.code`<PaginationLink${isActive ? figma.code` isActive` : ""}${disabled ? figma.code` disabled` : ""}>${label}</PaginationLink>`,
  imports: ['import { PaginationLink } from "@grade10/design-system"'],
  id: "pagination-link",
  metadata: { nestable: true },
};
