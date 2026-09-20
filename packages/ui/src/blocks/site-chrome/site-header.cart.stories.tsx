import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CartDrawerHeader } from "../store-cart/cart-drawer";
import { DEFAULT_CART_COPY } from "../store-cart/fixtures";
import { SiteHeader } from "./site-header";
import { SITE_HEADER_BASE_ARGS } from "./site-header.story-shared";

/** Workbench Store Locator page — keep in sync with preview `STORE_LOCATOR_HREF`. */
const STORE_LOCATOR_HREF = "?path=/story/pages-store-locator-page--default";

const STORE_NAV_ITEMS = [
  { label: "Store", href: "#store", current: true },
  { label: "Auction", href: "#auction" },
  { label: "Store Locator", href: STORE_LOCATOR_HREF },
  {
    label: "Help",
    href: "https://grade10.mintlify.io/",
    external: true,
  },
];

const meta = {
  title: "Site Chrome/SiteHeader/Cart",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...SITE_HEADER_BASE_ARGS,
    copy: { ...SITE_HEADER_BASE_ARGS.copy, cart: "Cart" },
    navItems: STORE_NAV_ITEMS,
    session: "signed-out",
    onLocaleChange: fn(),
    onCartClick: fn(),
    onSignIn: fn(),
    onProfile: fn(),
    onMyOrders: fn(),
    onMyAuctions: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function cartBadge(canvasElement: HTMLElement) {
  const cart = within(canvasElement).getByRole("button", {
    name: /Cart/,
  });
  return cart.parentElement?.querySelector(
    '[data-slot="status-indicator"][data-type="count"]',
  );
}

const wideContainer: NonNullable<Story["decorators"]> = [
  (Story) => (
    <div style={{ width: 1200 }}>
      <Story />
    </div>
  ),
];
const compactContainer: NonNullable<Story["decorators"]> = [
  (Story) => (
    <div style={{ width: 375 }}>
      <Story />
    </div>
  ),
];

function countPlay(
  count: number,
  scenario: string,
  compact = false,
): NonNullable<Story["play"]> {
  return async ({ canvasElement, args, step }) => {
    await step(
      `${scenario} - Full count ${count} at ${compact ? 375 : 1200}px`,
      async () => {
        const canvas = within(canvasElement);
        const cart = canvas.getByRole("button", { name: `Cart (${count})` });
        const account = canvas.getByRole("button", { name: "Account" });
        const badge = cartBadge(canvasElement) as HTMLElement;
        expect(cart).toBeVisible();
        expect(account).toBeVisible();
        expect(badge).toBeVisible();
        expect(badge).toHaveAttribute("data-variant", "brand");
        expect(badge).toHaveAttribute("data-type", "count");
        expect(badge.textContent).toBe(String(count));
        expect(badge.scrollWidth).toBeLessThanOrEqual(badge.clientWidth);
        const header =
          canvasElement.querySelector<HTMLElement>('[data-slot="nav"]');
        expect(header).not.toBeNull();
        if (header === null) throw new Error("Nav must render");
        const bounds = header.getBoundingClientRect();
        const badgeBounds = badge.getBoundingClientRect();
        expect(bounds.width).toBe(compact ? 375 : 1200);
        expect(badgeBounds.left).toBeGreaterThanOrEqual(bounds.left);
        expect(badgeBounds.right).toBeLessThanOrEqual(bounds.right);
        expect(badgeBounds.top).toBeGreaterThanOrEqual(bounds.top);
        expect(badgeBounds.bottom).toBeLessThanOrEqual(bounds.bottom);
        const text = document.createRange();
        text.selectNodeContents(badge);
        const digits = text.getBoundingClientRect();
        expect(digits.left).toBeGreaterThanOrEqual(badgeBounds.left);
        expect(digits.right).toBeLessThanOrEqual(badgeBounds.right);
        const controls = compact
          ? [account, canvas.getByRole("button", { name: "Menu" })]
          : [account];
        const cartBounds = cart.getBoundingClientRect();
        for (const control of controls) {
          expect(control).toBeVisible();
          const rect = control.getBoundingClientRect();
          expect(
            rect.right <= cartBounds.left || rect.left >= cartBounds.right,
          ).toBe(true);
          expect(
            rect.right <= badgeBounds.left || rect.left >= badgeBounds.right,
          ).toBe(true);
        }
        await userEvent.click(cart);
        expect(args.onCartClick).toHaveBeenCalledTimes(1);
      },
    );
  };
}

/**
 * Empty cart — cart control present, count badge hidden.
 * Signed-out is valid here: Grade10 has no guest checkout, so a signed-out
 * shopper never has lines; an empty cart control may still show.
 */
export const EmptyCart: Story = {
  name: "Empty cart — no badge",
  args: { cartItemCount: 0 },
  play: async ({ canvasElement, step }) => {
    await step("shared-ui-site-chrome-SC-23 - EmptyCart", async () => {
      const canvas = within(canvasElement);
      expect(
        canvas.getByRole("button", { name: "Sign In" }),
      ).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
      expect(cartBadge(canvasElement)).toBeNull();
    });
  },
};

/**
 * One active line — brand count indicator shows `1`.
 * Signed in: cart lines require a session (no guest checkout).
 */
export const OneItem: Story = {
  name: "One item",
  args: { session: "signed-in", cartItemCount: 1 },
  decorators: wideContainer,
  play: countPlay(1, "shared-ui-site-chrome-SC-24"),
};

/**
 * Several active lines — same full count the drawer title badge would show.
 * Signed in: cart lines require a session (no guest checkout).
 */
export const MultiItem: Story = {
  name: "Multi-item",
  args: { session: "signed-in", cartItemCount: 3 },
  decorators: wideContainer,
  play: countPlay(3, "shared-ui-site-chrome-SC-25"),
};

/**
 * Large count — StatusIndicator grows with the digits; SiteHeader does not
 * truncate (matches the cart drawer title badge).
 * Signed in: cart lines require a session (no guest checkout).
 */
export const LargeCount: Story = {
  name: "Large count",
  args: { session: "signed-in", cartItemCount: 12 },
  decorators: wideContainer,
  play: countPlay(12, "shared-ui-site-chrome-SC-26"),
};

/** A positive count is ignored when the host omits the cart handler. */
export const CountWithoutHandler: Story = {
  name: "Positive count without cart handler — no cart",
  args: {
    session: "signed-in",
    onCartClick: undefined,
    cartItemCount: 3,
  },
  play: async ({ canvasElement, step }) => {
    await step(
      "shared-ui-site-chrome-SC-04 - CountWithoutHandler",
      async () => {
        const canvas = within(canvasElement);
        expect(canvas.queryByRole("button", { name: /Cart/ })).toBeNull();
        expect(
          canvasElement.querySelector('[data-slot="status-indicator"]'),
        ).toBeNull();
      },
    );
  },
};

/** Counts above two digits stay complete instead of changing to `99+`. */
export const Above99Count: Story = {
  name: "Count above 99",
  args: { session: "signed-in", cartItemCount: 123 },
  decorators: wideContainer,
  play: countPlay(123, "shared-ui-site-chrome-SC-26"),
};

/**
 * Count omitted — same as empty: no badge.
 * Signed-out is valid: no lines, so no badge.
 */
export const CountOmitted: Story = {
  name: "Count omitted — no badge",
  args: { cartItemCount: undefined },
  play: async ({ canvasElement, step }) => {
    await step("shared-ui-site-chrome-SC-23 - CountOmitted", async () => {
      const canvas = within(canvasElement);
      expect(
        canvas.getByRole("button", { name: "Sign In" }),
      ).toBeInTheDocument();
      expect(cartBadge(canvasElement)).toBeNull();
    });
  },
};

/** The header and drawer title use the same supplied active-line count. */
export const CountMatchesDrawer: Story = {
  name: "Count matches drawer title",
  args: { session: "signed-in", cartItemCount: 3 },
  render: (args) => (
    <div className="space-y-4">
      <SiteHeader {...args} />
      <CartDrawerHeader
        itemCount={args.cartItemCount ?? 0}
        copy={DEFAULT_CART_COPY.header}
        onClose={fn()}
      />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    await step("shared-ui-site-chrome-SC-25 - CountMatchesDrawer", async () => {
      const canvas = within(canvasElement);
      expect(
        canvas.getByRole("button", { name: "Cart (3)" }),
      ).toBeInTheDocument();
      expect(cartBadge(canvasElement)).toHaveTextContent("3");
      expect(canvas.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
      expect(
        canvasElement.querySelector('[data-slot="badge"]'),
      ).toHaveTextContent("3");
    });
  },
};

export const CompactOneItem: Story = {
  ...OneItem,
  name: "Compact one item (375px)",
  decorators: compactContainer,
  play: countPlay(1, "shared-ui-site-chrome-SC-24", true),
};

export const CompactMultiItem: Story = {
  ...MultiItem,
  name: "Compact multi-item (375px)",
  decorators: compactContainer,
  play: countPlay(3, "shared-ui-site-chrome-SC-25", true),
};

export const CompactLargeCount: Story = {
  ...LargeCount,
  name: "Compact large count (375px)",
  decorators: compactContainer,
  play: countPlay(12, "shared-ui-site-chrome-SC-26", true),
};

export const CompactAbove99Count: Story = {
  ...Above99Count,
  name: "Compact count above 99 (375px)",
  decorators: compactContainer,
  play: countPlay(123, "shared-ui-site-chrome-SC-26", true),
};

/**
 * Post-store: Cart stays on Auction (and every other surface) so checkout
 * stays one tap away. Same primary-nav order as Store surfaces (Store,
 * Auction, Store Locator, Help); Auction is current. Auction-first stories
 * omit the cart handler until Store answers the cart drawer.
 */
export const OnAuctionSurface: Story = {
  name: "On auction surface (post-store)",
  args: {
    session: "signed-in",
    cartItemCount: 2,
    navItems: [
      { label: "Store", href: "#store" },
      { label: "Auction", href: "#auction", current: true },
      { label: "Store Locator", href: STORE_LOCATOR_HREF },
      {
        label: "Help",
        href: "https://grade10.mintlify.io/",
        external: true,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Store" })).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Auction" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const storeLocator = canvas.getByRole("link", { name: "Store Locator" });
    const help = canvas.getByRole("link", { name: "Help" });
    expect(
      storeLocator.compareDocumentPosition(help) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      canvas.getByRole("button", { name: "Cart (2)" }),
    ).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toHaveTextContent("2");
  },
};

/**
 * Post-store: My Orders joins the menu once its handler is supplied, between
 * Profile and My Auctions. Activating it invokes exactly its own handler.
 */
export const AccountMenu: Story = {
  name: "Account menu open (post-store)",
  args: { session: "signed-in", accountMenuDefaultOpen: true },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Profile",
      "My Orders",
      "My Auctions",
      "Sign out",
    ]);

    await userEvent.click(body.getByRole("menuitem", { name: "My Orders" }));

    expect(args.onMyOrders).toHaveBeenCalledTimes(1);
    expect(args.onProfile).not.toHaveBeenCalled();
    expect(args.onMyAuctions).not.toHaveBeenCalled();
    expect(args.onSignOut).not.toHaveBeenCalled();
  },
};
