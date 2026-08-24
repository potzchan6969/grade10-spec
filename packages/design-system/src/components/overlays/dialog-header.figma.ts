// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2159-3156
// source=packages/design-system/src/components/overlays/dialog.tsx
// component=DialogHeader
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties. The title is a TEXT property; the close IconButton is
// chrome the code component always renders, so it is not emitted as a child.
const title = instance.getString("title");

export default {
  example: figma.code`<DialogHeader>
  <DialogTitle>${title}</DialogTitle>
</DialogHeader>`,
  imports: [
    'import { DialogHeader, DialogTitle } from "@grade10/design-system"',
  ],
  id: "dialog-header",
  metadata: { nestable: true },
};
