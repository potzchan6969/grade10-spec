// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9937
// source=packages/design-system/src/components/layout/nav.tsx
// component=Nav
import figma from "figma";

export default {
  // The set has no variant axes, so nothing here is read from the instance.
  // Every content prop is required and store-owned, so the snippet names the
  // values the consumer supplies rather than emitting one store's content.
  example: figma.code`<Nav
  promo={promo}
  logo={logo}
  utilityLinks={utilityLinks}
  navItems={navItems}
  localeLabel={localeLabel}
/>`,
  imports: ['import { Nav } from "@grade10/design-system"'],
  id: "nav",
  metadata: { nestable: true },
};
