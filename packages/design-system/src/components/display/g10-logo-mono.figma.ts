// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4848-7543
// source=packages/design-system/src/components/display/g10-logo-mono.tsx
// component=G10LogoMono
import figma from "figma";

export default {
  // The set has no variant axes — size and tone come from the parent's
  // `className` (`h-* w-auto` and `text-*` for `currentColor`).
  example: figma.code`<G10LogoMono className="h-7 w-auto" />`,
  imports: ['import { G10LogoMono } from "@grade10/design-system"'],
  id: "g10-logo-mono",
  metadata: { nestable: true },
};
