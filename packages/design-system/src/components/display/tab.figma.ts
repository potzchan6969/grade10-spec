// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2121-1139
// source=packages/design-system/src/components/display/tabs.tsx
// component=TabsTrigger
//
// The Figma set is named `Tab`, but the code it maps to is `TabsTrigger`, one
// of four exports of `tabs.tsx`. That basename mismatch is why the checker
// still reports `Tab: no code component` — it resolves a set to code by
// normalizing the set name and looking for `src/components/**/tab.tsx`, which
// does not exist. `List Item` sits in the same position against `list.tsx`.
// The `source=` header above is what the prop check actually reads.
import figma from "figma";

const instance = figma.selectedInstance;

// `selected` is a two-option VARIANT, but nothing on the trigger drives it:
// which tab is active is owned by `Tabs`, through `value` / `defaultValue`.
// Emitting a `selected` prop would print one `TabsTrigger` does not accept, so
// the map exists to account for the axis and produces no strings.
instance.getEnum("selected", {
  false: false,
  true: false,
});

// Interaction only, exactly as on Button and Dropdown Menu Item — hover is a
// CSS pseudo-state with no prop behind it.
instance.getEnum("state", {
  default: false,
  hover: false,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

// TEXT component property, addressed by its bare name: Figma suffixes
// non-VARIANT keys with `#id`, but the template runtime resolves the
// unsuffixed name and renders a red `Error` chip for the suffixed one.
const label = instance.getString("label");

// Both icons are INSTANCE_SWAPs gated by their own BOOLEAN. `TabsTrigger` has
// no leading/trailing slot props — it takes icons as children, and the
// `data-icon` attribute is what tightens the padding on that side (see the
// `has-data-[icon=inline-start]` rules in tabs.tsx). A resolved template
// returns a finished snippet that cannot have an attribute threaded into it,
// so the icon is emitted bare and `data-icon` stays a hand-added refinement;
// without it the tab renders correctly, just with untightened padding.
//
// `hasCodeConnect()` gates the call for the same reason it does on Badge: the
// Phosphor icon sets are not connected, and executing an unconnected
// instance's template emits an error section.
const leadingIcon = instance.getBoolean("leading")
  ? instance.getInstanceSwap("leadingContent")
  : null;
const leadingCode =
  leadingIcon?.type === "INSTANCE" && leadingIcon.hasCodeConnect()
    ? leadingIcon.executeTemplate().example
    : null;

const trailingIcon = instance.getBoolean("trailing")
  ? instance.getInstanceSwap("trailingContent")
  : null;
const trailingCode =
  trailingIcon?.type === "INSTANCE" && trailingIcon.hasCodeConnect()
    ? trailingIcon.executeTemplate().example
    : null;

export default {
  // No `value` is emitted: it is consumer-owned product state that the design
  // cannot carry, and Base UI falls back to the tab's index when it is absent,
  // so the snippet is valid as written.
  example: figma.code`<TabsTrigger${disabled ? figma.code` disabled` : ""}>${leadingCode ? figma.code`${leadingCode}` : ""}${label}${trailingCode ? figma.code`${trailingCode}` : ""}</TabsTrigger>`,
  imports: ['import { TabsTrigger } from "@grade10/design-system"'],
  id: "tab",
  metadata: { nestable: true },
};
