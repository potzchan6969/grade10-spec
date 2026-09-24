// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6951-8
// source=packages/design-system/src/components/display/carousel-progress.tsx
// component=CarouselProgress
//
// Figma draws one control (`CarouselProgressItem`) as the set. The `state`
// axis is documentation for the active fill — code drives it with `active`,
// `durationMs`, and `reduceMotion`, not a `state` prop. Map every option so
// the axis is accounted for; none emit a prop.
import figma from "figma";

const instance = figma.selectedInstance;

// Documentation axis only — timed fill is driven by `durationMs` /
// `reduceMotion` in code, not a `state` prop. Map every option so the axis is
// accounted for; none emit anything.
instance.getEnum("state", {
  inactive: false,
  active: false,
  filling: false,
  complete: false,
});

export default {
  example: figma.code`<CarouselProgress aria-label={ariaLabel}>
  <CarouselProgressItem active label={label} />
  <CarouselProgressItem label={label} />
</CarouselProgress>`,
  imports: [
    'import { CarouselProgress, CarouselProgressItem } from "@grade10/design-system"',
  ],
  id: "carousel-progress",
  metadata: { nestable: true },
};
