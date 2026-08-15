// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653
// source=packages/design-system/src/components/layout/footer.tsx
// component=Footer
import figma from "figma";

export default {
  // The set has no variant axes, so nothing here is read from the instance.
  // Every content prop is required and store-owned, so the snippet names the
  // values the consumer supplies rather than emitting one store's content.
  example: figma.code`<Footer
  logo={logo}
  description={description}
  attribution={attribution}
  socialLinks={socialLinks}
  columns={columns}
  copyright={copyright}
  legalLinks={legalLinks}
  locale={locale}
/>`,
  imports: ['import { Footer } from "@grade10/design-system"'],
  id: "footer",
  metadata: { nestable: true },
};
