import type { StoryObj } from "@storybook/react-vite";
import { fn, within } from "storybook/test";
import type { SiteHeaderProps } from "./site-header";
import { SITE_HEADER_BASE_ARGS } from "./site-header.story-shared";

/** Workbench Store Locator page — keep in sync with preview `STORE_LOCATOR_HREF`. */
export const STORE_LOCATOR_HREF =
  "?path=/story/pages-store-locator-page--default";

export const STORE_NAV_ITEMS = [
  { label: "Store", href: "#store", current: true },
  { label: "Auction", href: "#auction" },
  { label: "Store Locator", href: STORE_LOCATOR_HREF },
  {
    label: "Help",
    href: "https://grade10.mintlify.io/",
    external: true,
  },
] as const satisfies SiteHeaderProps["navItems"];

/** Nav's `@4xl` (896px) — only compact stories pin a width; others fill the canvas. */
export const COMPACT_WIDTH = 375;
export const WIDE_MIN = 896;

export const compactContainer: NonNullable<StoryObj["decorators"]> = [
  (Story) => (
    <div style={{ width: COMPACT_WIDTH }}>
      <Story />
    </div>
  ),
];

export const AUCTION_STORE_BASE_ARGS = {
  ...SITE_HEADER_BASE_ARGS,
  copy: { ...SITE_HEADER_BASE_ARGS.copy, cart: "Cart" },
  navItems: [...STORE_NAV_ITEMS],
  session: "signed-out" as const,
  onLocaleChange: fn(),
  onCartClick: fn(),
  onSignIn: fn(),
  onMyOrders: fn(),
  onMyAuctions: fn(),
  onMembership: fn(),
  onSignOut: fn(),
};

export function cartBadge(canvasElement: HTMLElement) {
  const cart = within(canvasElement).getByRole("button", {
    name: /Cart/,
  });
  return cart.parentElement?.querySelector(
    '[data-slot="status-indicator"][data-type="count"]',
  );
}
