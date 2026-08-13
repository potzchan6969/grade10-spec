// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2176-3946
// source=packages/design-system/src/components/display/card.tsx
// component=Card
import figma from "figma";

const instance = figma.selectedInstance;

// Figma models `padding` as a two-option VARIANT axis rather than a BOOLEAN
// property, so it is read with getEnum and mapped to the boolean prop. A map
// producing no strings is recognised as a non-variant prop, not a broken axis.
const padding = instance.getEnum("padding", {
  true: true,
  false: false,
});

// The body is a SLOT property, so read it with getSlot rather than walking the
// children — that keeps whatever a consumer dropped in, including nested
// instances that have their own Code Connect templates.
const content = instance.getSlot("Slot");

// `true` is the component's default, so the prop is emitted only when off.
export default {
  example: figma.code`<Card${padding ? "" : figma.code` padding={false}`}>${content}</Card>`,
  imports: ['import { Card } from "@grade10/design-system"'],
  id: "card",
  metadata: { nestable: true },
};
