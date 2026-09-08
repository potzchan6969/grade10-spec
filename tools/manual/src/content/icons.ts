/** The icons a page may wear in the rail, named after the glyph rather than
 * the domain, so two domains can share one and neither owns it. Plain data:
 * the grammar validates against it, `check:manual` runs it under node, and
 * `blocks/page-icon.tsx` is the only place that pulls the components in. */
export const PAGE_ICONS = [
  "arrows-clockwise",
  "bank",
  "browsers",
  "calendar-check",
  "gavel",
  "identification-card",
  "key",
  "list-magnifying-glass",
  "medal",
  "moon",
  "package",
  "palette",
  "shopping-bag",
  "signature",
  "sliders",
  "squares-four",
  "storefront",
  "user-circle",
  "vault",
] as const;

export type PageIcon = (typeof PAGE_ICONS)[number];

export function isPageIcon(value: unknown): value is PageIcon {
  return (PAGE_ICONS as readonly unknown[]).includes(value);
}
