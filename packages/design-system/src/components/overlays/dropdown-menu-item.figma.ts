// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2121-1385
// source=packages/design-system/src/components/overlays/dropdown-menu-item.tsx
// component=DropdownMenuItem
import figma from "figma";

const instance = figma.selectedInstance;

const selected = instance.getEnum("isSelected", {
  false: false,
  true: true,
});

instance.getEnum("state", {
  default: false,
  hover: false,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const size = instance.getEnum("size", {
  sm: "sm",
  md: "md",
});

const label = instance.getString("label");
const leading = instance.getBoolean("leading")
  ? instance.getInstanceSwap("leadingIcon")
  : null;
const leadingCode =
  leading?.type === "INSTANCE" && leading.hasCodeConnect()
    ? leading.executeTemplate().example
    : null;
const trailing = instance.getBoolean("trailing")
  ? instance.getSlot("trailingContent")
  : null;

export default {
  example: figma.code`<DropdownMenuItem${selected ? figma.code` selected` : ""}${disabled ? figma.code` disabled` : ""}${size === "sm" ? "" : figma.code` size="${size}"`}${leadingCode ? figma.code` leading={${leadingCode}}` : ""}${trailing ? figma.code` trailing={${trailing}}` : ""}>${label}</DropdownMenuItem>`,
  imports: ['import { DropdownMenuItem } from "@grade10/design-system"'],
  id: "dropdown-menu-item",
  metadata: { nestable: true },
};
