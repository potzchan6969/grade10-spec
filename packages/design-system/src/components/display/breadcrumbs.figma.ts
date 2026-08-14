// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4180-1293
// source=packages/design-system/src/components/display/breadcrumbs.tsx
// component=Breadcrumbs
import figma from "figma";

export default {
  example: figma.code`<Breadcrumbs>
  <BreadcrumbItem href={href}>Home</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem href={href}>Shop</BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem current>Pokémon</BreadcrumbItem>
</Breadcrumbs>`,
  imports: [
    'import { BreadcrumbItem, BreadcrumbSeparator, Breadcrumbs } from "@grade10/design-system"',
  ],
  id: "breadcrumbs",
  metadata: { nestable: true },
};
