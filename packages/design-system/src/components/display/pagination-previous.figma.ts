// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4181-1996
// source=packages/design-system/src/components/display/pagination.tsx
// component=PaginationPrevious
import figma from "figma";

const instance = figma.selectedInstance;

const disabled = instance.getEnum("state", {
  default: false,
  hover: false,
  pressed: false,
  disabled: true,
});

export default {
  example: figma.code`<PaginationPrevious${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { PaginationPrevious } from "@grade10/design-system"'],
  id: "pagination-previous",
  metadata: { nestable: true },
};
