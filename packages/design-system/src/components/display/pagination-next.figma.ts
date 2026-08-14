// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4181-2009
// source=packages/design-system/src/components/display/pagination.tsx
// component=PaginationNext
import figma from "figma";

const instance = figma.selectedInstance;

const disabled = instance.getEnum("state", {
  default: false,
  hover: false,
  pressed: false,
  disabled: true,
});

export default {
  example: figma.code`<PaginationNext${disabled ? figma.code` disabled` : ""} />`,
  imports: ['import { PaginationNext } from "@grade10/design-system"'],
  id: "pagination-next",
  metadata: { nestable: true },
};
