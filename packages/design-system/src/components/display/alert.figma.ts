// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2176-3488
// source=packages/design-system/src/components/display/alert.tsx
// component=Alert
import figma from "figma";

const instance = figma.selectedInstance;

const status = instance.getEnum("status", {
  default: "default",
  error: "error",
  warning: "warning",
  success: "success",
});

const title = instance.getString("title");
const description = instance.getString("description");

const dismissible = instance.getBoolean("dismissable");
const hasActions = instance.getBoolean("action");

// Icon is an INSTANCE_SWAP on `status=default` only. Status variants draw
// their own icon; resolve the swap only for the default rung.
const iconInstance =
  status === "default" ? instance.getInstanceSwap("icon") : null;
const iconCode =
  iconInstance?.type === "INSTANCE" && iconInstance.hasCodeConnect()
    ? iconInstance.executeTemplate().example
    : null;

export default {
  example: figma.code`<Alert${status === "default" ? "" : figma.code` status="${status}"`}${iconCode ? figma.code` icon={${iconCode}}` : ""}${description ? figma.code` description="${description}"` : ""}${dismissible === false ? figma.code` dismissible={false}` : ""}${
    hasActions
      ? figma.code` actions={<>
  <Button size="sm" variant="outline">Button</Button>
  <Button size="sm">Button</Button>
</>}`
      : ""
  } title="${title}" />`,
  imports: ['import { Alert, Button } from "@grade10/design-system"'],
  id: "alert",
  metadata: { nestable: true },
};
