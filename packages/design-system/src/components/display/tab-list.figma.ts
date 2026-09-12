// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6586-6340
// source=packages/design-system/src/components/display/tabs.tsx
// component=TabsList
//
// As on `tab.figma.ts`, the Figma name (`Tab List`) and the code name
// (`TabsList`, one export of `tabs.tsx`) differ, so the checker's set-to-file
// resolution keeps reporting `Tab List: no code component`.
import figma from "figma";

const instance = figma.selectedInstance;

const variant = instance.getEnum("variant", {
  pill: "pill",
  list: "list",
});

const tabs = instance.getSlot("Tab List");

export default {
  example: figma.code`<TabsList${variant === "pill" ? "" : figma.code` variant="${variant}"`}>${tabs}</TabsList>`,
  imports: ['import { TabsList } from "@grade10/design-system"'],
  id: "tab-list",
  metadata: { nestable: true },
};
