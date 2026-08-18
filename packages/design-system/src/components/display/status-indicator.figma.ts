// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4174-37
// source=packages/design-system/src/components/display/status-indicator.tsx
// component=StatusIndicator
import figma from "figma";

const instance = figma.selectedInstance;

const type = instance.getEnum("type", {
  dot: "dot",
  count: "count",
});

const variant = instance.getEnum("variant", {
  default: "default",
  error: "error",
});

const label = instance.getString("label");

export default {
  example: figma.code`<StatusIndicator${type === "dot" ? "" : figma.code` type="${type}"`}${variant === "default" ? "" : figma.code` variant="${variant}"`}>${type === "count" ? label : ""}</StatusIndicator>`,
  imports: ['import { StatusIndicator } from "@grade10/design-system"'],
  id: "status-indicator",
  metadata: { nestable: true },
};
