// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=2159-3275
// source=packages/design-system/src/components/display/avatar.tsx
// component=Avatar
import figma from "figma";

const instance = figma.selectedInstance;

// `size` is the set's only axis. The rung names are Figma's own — `default` is
// the middle rung (48px), not the smallest. `default` is also the cva
// defaultVariant, so the prop is omitted for it.
const size = instance.getEnum("size", {
  lg: "lg",
  default: "default",
  sm: "sm",
});

// Figma's Avatar is a single image fill with no component property behind it,
// so there is no src to read. Emit the composition a consumer actually writes
// and leave the source to them.
export default {
  example: figma.code`<Avatar${size === "default" ? "" : figma.code` size="${size}"`}>
  <AvatarImage src={src} alt={alt} />
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>`,
  imports: [
    'import { Avatar, AvatarFallback, AvatarImage } from "@acetrader/design-system"',
  ],
  id: "avatar",
  metadata: { nestable: true },
};
