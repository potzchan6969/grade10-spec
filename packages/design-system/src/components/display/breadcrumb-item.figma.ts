// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4180-1290
// source=packages/design-system/src/components/display/breadcrumbs.tsx
// component=BreadcrumbItem
import figma from "figma";

const instance = figma.selectedInstance;

const current = instance.getEnum("isCurrent", {
  false: false,
  true: true,
});

const disabled = instance.getEnum("state", {
  default: false,
  hover: false,
  focus: false,
  disabled: true,
});

export default {
  example: figma.code`<BreadcrumbItem${current ? figma.code` current` : figma.code` href={href}`}${disabled ? figma.code` disabled` : ""}>${current ? "Current Page" : "Link"}</BreadcrumbItem>`,
  imports: ['import { BreadcrumbItem } from "@grade10/design-system"'],
  id: "breadcrumb-item",
  metadata: { nestable: true },
};
