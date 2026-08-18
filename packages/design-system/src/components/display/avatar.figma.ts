// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2159-3275
// source=packages/design-system/src/components/display/avatar.tsx
// component=Avatar
import figma from "figma";

const instance = figma.selectedInstance;

// `size` is the set's only axis, and it now draws four rungs: sm (32), md (40),
// lg (48) and xl (64). Every option must be listed — an unmapped one resolves
// to `undefined`, which Dev Mode emits as `size=""`.
//
// `lg` is the 48px rung and the component's default, so the prop is omitted for
// it. Note the scale was renamed one step down when `md` arrived: the rung this
// template used to call `default` is `lg`, and the one it called `lg` is `xl`.
const size = instance.getEnum("size", {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
});

// Figma's Avatar is a single image fill with no component property behind it,
// so there is no src to read. Emit the composition a consumer actually writes
// and leave the source to them.
export default {
  example: figma.code`<Avatar${size === "lg" ? "" : figma.code` size="${size}"`}>
  <AvatarImage src={src} alt={alt} />
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>`,
  imports: [
    'import { Avatar, AvatarFallback, AvatarImage } from "@grade10/design-system"',
  ],
  id: "avatar",
  metadata: { nestable: true },
};
