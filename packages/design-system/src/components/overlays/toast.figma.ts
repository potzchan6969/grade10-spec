// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6332-3644
// source=packages/design-system/src/components/overlays/toast.tsx
// component=toast
//
// A toast is not rendered as JSX in this design system: `toast.tsx` mounts one
// `<Toast />` once, at the app root, and every toast after that is produced
// imperatively by `toast()` / `toast.success()` and the rest. So the snippet a
// designer's node should hand a developer is the call, and `nestable` is false
// — there is no JSX position this belongs in.
import figma from "figma";

const instance = figma.selectedInstance;

const type = instance.getEnum("type", {
  default: "default",
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
});

const title = instance.getString("title");
const description = instance.getString("description");
const actionable = instance.getBoolean("actionable");
const dismissible = instance.getBoolean("dismissible");
const showIcon = instance.getBoolean("showIcon");

// The drawn action is a nested secondary Button whose label is fixed in the
// design rather than exposed as a component property, and its handler is
// consumer-owned either way. Both are emitted as placeholders — sonner takes
// the action as `{ label, onClick }`, never as a Button element.
const descriptionLine = description
  ? figma.code`\n  description: "${description}",`
  : "";
const actionLine = actionable
  ? figma.code`\n  action: { label: "Action", onClick: () => {} },`
  : "";
const closeLine =
  dismissible === false ? figma.code`\n  closeButton: false,` : "";
const iconLine =
  type === "default" && showIcon === false ? figma.code`\n  icon: null,` : "";

const options = figma.code` {${descriptionLine}${actionLine}${closeLine}${iconLine}\n}`;

const call =
  type === "success"
    ? figma.code`toast.success("${title}",${options})`
    : type === "error"
      ? figma.code`toast.error("${title}",${options})`
      : type === "warning"
        ? figma.code`toast.warning("${title}",${options})`
        : type === "info"
          ? figma.code`toast.info("${title}",${options})`
          : figma.code`toast("${title}",${options})`;

export default {
  example: call,
  imports: ['import { toast } from "@grade10/design-system"'],
  id: "toast",
  metadata: { nestable: false },
};
