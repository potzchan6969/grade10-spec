// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=86-3459
// source=packages/design-system/src/components/forms/button.tsx
// component=Button
//
// The node ID is the component *set* (86-3459), not the page that holds it
// (86-3366). The set carries five VARIANT properties — `variant` (5 options),
// `state` (`default` | `hover`), `size` (`lg` | `md` | `sm`), and
// `isDisabled` / `isLoading` (both `false` | `true`) — all with lowercase
// property and option names, so every key below is lowercase; these are Figma's
// names, not the capitalised ones the pre-merge shape used.
//
// `isDisabled` and `isLoading` are VARIANT axes, not BOOLEAN component
// properties. That is why both are read with getEnum below rather than
// getBoolean, and it is what makes a loading Danger button drawable.
//
// The 60 drawn variants are a curated subset of the 5x2x3x2x2 grid, not a
// complete cross-product: `hover` is drawn only at `isDisabled=false,
// isLoading=false`, and each of `isDisabled` and `isLoading` only at
// `state=default`. Every option of every axis is still mapped below, which is
// what the template owes; the undrawn combinations are unreachable in Figma.
import figma from "figma";

const instance = figma.selectedInstance;

// Figma and the cva agree on the axis name (`variant`) and on four of the five
// options. They differ on the base one: Figma draws it as `primary`, the cva
// calls it `default` because it is the cva's defaultVariant. Every option must
// be listed — an unmapped one resolves to undefined and emits broken code.
const variant = instance.getEnum("variant", {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  destructive: "destructive",
  ghost: "ghost",
});

// `state` is interaction only — `default` and `hover`. Hover is a CSS
// pseudo-state with no prop behind it, so neither option emits anything, and
// the map exists so the axis is accounted for rather than reported unmapped.
instance.getEnum("state", {
  default: false,
  hover: false,
});

// Disabled and loading are their own two-option axes, so a loading Danger
// button is drawable — the whole reason they were lifted off `state`. Each map
// produces no strings and is recognised as a boolean gate, not an axis.
//
// `disabled` is deliberately not OR-ed with `loading`: the component derives
// that itself, so emitting both would print a redundant prop. Figma draws
// every loading variant with `isDisabled=true`, which is why the gate below
// suppresses `disabled` while `loading` is on.
const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});
const loading = instance.getEnum("isLoading", {
  false: false,
  true: true,
});

// Rung names match Figma's size options, which bind Size/size-12 (48),
// Size/size-10 (40) and Size/size-8 (32). `lg` is also the cva default, so the
// prop is omitted for it and emitted for the other two.
const size = instance.getEnum("size", {
  lg: "lg",
  md: "md",
  sm: "sm",
});

// The label is a TEXT component property, not a bare text layer. Address it by
// its bare name: Figma suffixes non-VARIANT property keys with `#id`, but the
// template runtime resolves the unsuffixed name — passing the suffixed key
// yields an unresolved value that Dev Mode renders as a red `Error` chip.
const label = instance.getString("label");

// Each icon is an INSTANCE_SWAP gated by its own BOOLEAN. Resolve the swapped
// instance rather than the placeholder layer name, so the mapping survives the
// icon being swapped for a different one.
//
// button.tsx exposes `leading` and `trailing` props mirroring these two
// properties, so each resolved snippet is emitted into its own slot rather than
// as a bare child. That makes the emitted order unrepresentable-if-wrong, which
// children could not guarantee.
//
// Neither is emitted while loading. The component gives the leading slot to the
// spinner and drops `trailing`, matching the Figma loading variants, which carry
// a spinner and a label and no trailing icon — so emitting either would print a
// prop the component ignores.
const leadingIcon =
  !loading && instance.getBoolean("leading")
    ? instance.getInstanceSwap("leadingContent")
    : null;
const leadingCode =
  leadingIcon?.type === "INSTANCE"
    ? leadingIcon.executeTemplate().example
    : null;

const trailingIcon =
  !loading && instance.getBoolean("trailing")
    ? instance.getInstanceSwap("trailingContent")
    : null;
const trailingCode =
  trailingIcon?.type === "INSTANCE"
    ? trailingIcon.executeTemplate().example
    : null;

export default {
  // `default` / `lg` are the cva defaultVariants, so omit each prop in that
  // case and emit what someone would actually write.
  example: figma.code`<Button${variant === "default" ? "" : figma.code` variant="${variant}"`}${size === "lg" ? "" : figma.code` size="${size}"`}${loading ? figma.code` loading` : ""}${!loading && disabled ? figma.code` disabled` : ""}${leadingCode ? figma.code` leading={${leadingCode}}` : ""}${trailingCode ? figma.code` trailing={${trailingCode}}` : ""}>${label}</Button>`,
  imports: ['import { Button } from "@grade10/design-system"'],
  id: "button",
  metadata: { nestable: true },
};
