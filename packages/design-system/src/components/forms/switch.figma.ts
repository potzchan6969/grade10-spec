// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2548-237
// source=packages/design-system/src/components/forms/switch.tsx
// component=Switch
import figma from "figma";

const instance = figma.selectedInstance;

const checked = instance.getEnum("checked", {
  true: true,
  false: false,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const size = instance.getEnum("size", {
  lg: "lg",
  md: "md",
});

export default {
  example: figma.code`<Switch${checked ? figma.code` defaultChecked` : ""}${disabled ? figma.code` disabled` : ""}${size === "lg" ? "" : figma.code` size="${size}"`} />`,
  imports: ['import { Switch } from "@grade10/design-system"'],
  id: "switch",
  metadata: { nestable: true },
};
