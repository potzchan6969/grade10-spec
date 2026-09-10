// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2571-46
// source=packages/design-system/src/components/display/empty-state.tsx
// component=EmptyState
import figma from "figma";

const instance = figma.selectedInstance;

// Figma's VARIANT axes. `false` / `true` (hasFrame) are the cva defaults, so
// those props are omitted there and emitted only for the non-default rungs.
const compact = instance.getEnum("isCompact", {
  false: false,
  true: true,
});
const frameless = instance.getEnum("hasFrame", {
  true: false,
  false: true,
});

const title = instance.getString("title");
const description = instance.getBoolean("hasDescription")
  ? instance.getString("description")
  : null;

// Icon is an INSTANCE_SWAP gated by `hasIcon`. Resolve the swapped instance
// rather than the placeholder, and gate on hasCodeConnect so an unconnected
// Phosphor set does not emit a red Error chip in Dev Mode.
const iconInstance = instance.getBoolean("hasIcon")
  ? instance.getInstanceSwap("icon")
  : null;
const iconCode =
  iconInstance?.type === "INSTANCE" && iconInstance.hasCodeConnect()
    ? iconInstance.executeTemplate().example
    : null;

const hasActions = instance.getBoolean("hasActions");

export default {
  // Nested Button attrs use object-spread so the design-sync prop scanner does
  // not treat `variant` as an EmptyState prop (it only matches `name={` / `name="`).
  example: figma.code`<EmptyState${compact ? figma.code` compact` : ""}${frameless ? figma.code` frameless` : ""}${iconCode ? figma.code` icon={${iconCode}}` : ""}${description ? figma.code` description="${description}"` : ""}${
    hasActions
      ? figma.code` actions={<>
  <Button size="md" {...{ variant: "secondary" }}>Take action</Button>
  <Button size="md">Take action</Button>
</>}`
      : ""
  } title="${title}" />`,
  imports: ['import { Button, EmptyState } from "@grade10/design-system"'],
  id: "empty-state",
  metadata: { nestable: true },
};
