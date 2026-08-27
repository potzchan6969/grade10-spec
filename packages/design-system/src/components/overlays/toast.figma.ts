// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2159-3352
// source=packages/design-system/src/components/overlays/sonner.tsx
// component=toast
//
// The only template here that emits a call rather than an element. A toast is
// not rendered as JSX in this design system: `sonner.tsx` mounts one `Toaster`
// once, at the app root, and every toast after that is produced imperatively
// by `toast()`. So the snippet a designer's node should hand a developer is
// the call, and `nestable` is false — there is no JSX position this belongs in.
//
// The checker resolves a set to code by name and will keep reporting
// `Toast: no code component`: the file is `sonner.tsx`, after the upstream
// library, not `toast.tsx`. The `source=` header is what the prop check reads.
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties — Toast is a single published component whose five
// properties are all TEXT or BOOLEAN.
const title = instance.getString("title");

// `body` is gated by `showBody`, so the description key is emitted only when
// the design draws a second line.
const body = instance.getBoolean("showBody")
  ? instance.getString("body")
  : null;

// The drawn action is a nested secondary Button whose label is fixed in the
// design rather than exposed as a component property, and its handler is
// consumer-owned either way. Both are emitted as placeholders — sonner takes
// the action as `{ label, onClick }`, never as a Button element, so executing
// the nested Button's own template here would emit the wrong shape.
const action = instance.getBoolean("button");

// Sonner's per-toast close affordance. The design draws it as a ghost Icon
// Button; in code it is one boolean on the toast, not a composed child.
const close = instance.getBoolean("close");

// Each option is built on its own line rather than inline in the example,
// because the emitted call is multi-line and inlining the conditionals put a
// formatter disagreement inside the template literals.
const descriptionLine = body ? figma.code`\n  description: "${body}",` : "";
const actionLine = action
  ? figma.code`\n  action: { label: "Action", onClick: () => {} },`
  : "";
const closeLine = close ? figma.code`\n  closeButton: true,` : "";

export default {
  example: figma.code`toast("${title}", {${descriptionLine}${actionLine}${closeLine}\n})`,
  imports: ['import { toast } from "@grade10/design-system"'],
  id: "toast",
  metadata: { nestable: false },
};
