// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2121-1331
// source=packages/design-system/src/components/display/tabs.tsx
// component=TabsList
//
// As on `tab.figma.ts`, the Figma name (`Tab List`) and the code name
// (`TabsList`, one export of `tabs.tsx`) differ, so the checker's set-to-file
// resolution keeps reporting `Tab List: no code component`.
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties — the Figma component is a bare slot of Tab instances.
//
// `tabsListVariants` does carry a `variant` axis (`default` | `line`) that
// Figma does not draw. That is a code-only rung, and resolving it is a
// contract question for an OpenSpec change, not something to invent a mapping
// for here: the template emits no `variant`, which lands on the cva default.
const tabs = instance.getSlot("Tab List");

export default {
  example: figma.code`<TabsList>${tabs}</TabsList>`,
  imports: ['import { TabsList } from "@grade10/design-system"'],
  id: "tab-list",
  metadata: { nestable: true },
};
