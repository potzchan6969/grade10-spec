// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2159-3379
// source=packages/design-system/src/components/overlays/tooltip.tsx
// component=TooltipContent
//
// The set's description reads "Deprecated. Suggest using the inline tooltip.
// 4px from the target." — design has retired the component, and the JSDoc on
// `Tooltip` in tooltip.tsx already carries that.
//
// It is connected anyway, deliberately. The component is still drawn, still
// instanced, and still consumed by three files under
// `packages/ui/src/blocks/auction-listing`; leaving it unmapped means Dev Mode
// shows nothing at all for a node someone is looking at today, which reads as
// "no code exists" rather than "do not reach for this". Retiring the export is
// a contract change and needs an OpenSpec delta naming the replacement and the
// consuming applications — see the JSDoc for why it is not tagged
// `@deprecated` in the meantime.
//
// The `4px from the target` half of the description is the positioner offset,
// which `TooltipContent` already defaults to (`sideOffset = 4`), so nothing is
// emitted for it.
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties — one published component with a single TEXT property.
// The Figma node draws the popup alone, so the template emits the popup alone;
// `Tooltip`, `TooltipTrigger` and the app-root `TooltipProvider` are composed
// around it by the consumer, exactly as `dialog.figma.ts` emits only
// `DialogContent`.
const content = instance.getString("content");

export default {
  example: figma.code`<TooltipContent>${content}</TooltipContent>`,
  imports: ['import { TooltipContent } from "@grade10/design-system"'],
  id: "tooltip",
  metadata: { nestable: true },
};
