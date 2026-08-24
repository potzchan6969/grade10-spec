// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2159-3169
// source=packages/design-system/src/components/overlays/dialog.tsx
// component=DialogContent
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties — Dialog is a single published component. The body is
// a SLOT; the header is a nested Dialog Header instance with its own template;
// the footer buttons are nested Button instances, not a published footer set.
const body = instance.getSlot("body");

const header = instance.findInstance("Dialog Header");
const headerCode =
  header?.type === "INSTANCE" ? header.executeTemplate().example : null;

const secondary = instance.findInstance("Secondary Button");
const secondaryCode =
  secondary?.type === "INSTANCE" ? secondary.executeTemplate().example : null;

const primary = instance.findInstance("Primary Button");
const primaryCode =
  primary?.type === "INSTANCE" ? primary.executeTemplate().example : null;

export default {
  example: figma.code`<DialogContent>
  ${headerCode}
  <DialogBody>${body}</DialogBody>
  <DialogFooter>${secondaryCode}${primaryCode}</DialogFooter>
</DialogContent>`,
  imports: [
    'import { DialogBody, DialogContent, DialogFooter } from "@grade10/design-system"',
  ],
  id: "dialog",
  metadata: { nestable: true },
};
