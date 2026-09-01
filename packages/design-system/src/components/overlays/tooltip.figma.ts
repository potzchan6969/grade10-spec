// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2159-3379
// source=packages/design-system/src/components/overlays/tooltip.tsx
// component=TooltipContent
//
// The Figma node draws the popup alone, so the template emits the popup alone;
// `Tooltip`, `TooltipTrigger` and the app-root `TooltipProvider` are composed
// around it by the consumer, exactly as `dialog.figma.ts` emits only
// `DialogContent`.
//
// The set's description notes a 4px offset from the target, which
// `TooltipContent` already defaults to (`sideOffset = 4`), so nothing is
// emitted for it.
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties — one published component with a single TEXT property.
const content = instance.getString("content");

export default {
  example: figma.code`<TooltipContent>${content}</TooltipContent>`,
  imports: ['import { TooltipContent } from "@grade10/design-system"'],
  id: "tooltip",
  metadata: { nestable: true },
};
