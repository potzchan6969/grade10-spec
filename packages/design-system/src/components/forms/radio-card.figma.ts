// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7528-3385
// source=packages/design-system/src/components/forms/radio-card.tsx
// component=RadioCard
import figma from "figma";

const instance = figma.selectedInstance;

// `selected`, `state`, `disabled` and `withIcon` are the set's VARIANT axes.
// `state` (default | hover) is an interaction rung, not a prop. `selected`
// belongs to the surrounding RadioList's value, so it is not emitted either.
const disabled = instance.getEnum("disabled", {
  false: false,
  true: true,
});

const withIcon = instance.getEnum("withIcon", {
  false: false,
  true: true,
});

// The media circle's glyph is an INSTANCE_SWAP gated by `withIcon`. Resolve
// the swap only when the rung draws it; the Phosphor sets are not connected,
// so `hasCodeConnect()` keeps an unconnected swap from throwing.
const iconInstance = withIcon ? instance.getInstanceSwap("icon") : null;
const iconCode =
  iconInstance?.type === "INSTANCE" && iconInstance.hasCodeConnect()
    ? iconInstance.executeTemplate().example
    : null;

export default {
  example: figma.code`<RadioCard${disabled ? figma.code` disabled` : ""}${iconCode ? figma.code` icon={${iconCode}}` : ""} title="Radio Card Title" description="Description" value={value} />`,
  imports: ['import { RadioCard } from "@grade10/design-system"'],
  id: "radio-card",
  metadata: { nestable: true },
};
