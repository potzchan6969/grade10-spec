// url=https://www.figma.com/design/xRzLvpBKtFAr1XrjxjnJNy/Sean---DS-POC?node-id=138-15
// source=packages/design-system/src/components/display/card.tsx
// component=Card
import figma from "figma";

const instance = figma.selectedInstance;

// The Figma Card exposes three SLOT properties, one per sub-component. Property
// keys carry the `#id` suffix Figma generates and must be used verbatim.
const header = instance.getSlot("CardHeader#164:3");
const content = instance.getSlot("CardContent#164:1");
const footer = instance.getSlot("CardFooter#164:2");

// Slots are optional — a card may be header-only, or have no footer. Emit each
// wrapper only when its slot has content, so the snippet matches what was drawn.
export default {
  example: figma.code`<Card>
  ${header ? figma.code`<CardHeader>${header}</CardHeader>` : ""}
  ${content ? figma.code`<CardContent>${content}</CardContent>` : ""}
  ${footer ? figma.code`<CardFooter>${footer}</CardFooter>` : ""}
</Card>`,
  imports: [
    'import { Card, CardContent, CardFooter, CardHeader } from "@acetrader/design-system"',
  ],
  id: "card",
  metadata: { nestable: true },
};
