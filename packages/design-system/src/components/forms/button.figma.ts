// url=https://www.figma.com/design/xRzLvpBKtFAr1XrjxjnJNy/Sean---DS-POC?node-id=136-20
// source=packages/design-system/src/components/forms/button.tsx
// component=Button
import figma from "figma";

const instance = figma.selectedInstance;

// The Figma set exposes one VARIANT property, `variant`, whose options are
// named after the cva keys in button.tsx — so this maps 1:1. Every option must
// be listed: an unmapped one resolves to undefined and emits broken code.
const variant = instance.getEnum("variant", {
  default: "default",
  outline: "outline",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
  link: "link",
});

// Sizes are a second VARIANT axis. The Figma set carries default/sm/lg; the
// cva also defines xs and the icon-* sizes, which have no Figma variant yet.
const size = instance.getEnum("size", {
  md: "md",
  sm: "sm",
  lg: "lg",
});

// The label is a plain text layer, not a component property, so read it by
// layer name rather than with getString().
const labelNode = instance.findText("Button");
const label =
  labelNode && labelNode.type === "TEXT" ? labelNode.textContent : "Button";

export default {
  // Each axis has a cva defaultVariant — `default` for variant, `md` for size —
  // so omit the prop in that case and emit what someone would actually write.
  example: figma.code`<Button${variant === "default" ? "" : figma.code` variant="${variant}"`}${size === "md" ? "" : figma.code` size="${size}"`}>${label}</Button>`,
  imports: ['import { Button } from "@acetrader/design-system"'],
  id: "button",
  metadata: { nestable: true },
};
