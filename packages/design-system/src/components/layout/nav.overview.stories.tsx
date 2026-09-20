import { ShoppingBag } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { IconButton } from "../forms/icon-button";
import { Nav } from "./nav";
import { NAV_BASE_ARGS, NAV_ITEMS } from "./nav.story-shared";

const cartSlotClick = fn();

const meta = {
  title: "Components/Nav/Overview",
  component: Nav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...NAV_BASE_ARGS,
    onLocaleChange: fn(),
    onAccountClick: fn(),
    onCartClick: fn(),
  },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Store chrome with language, account, and cart. */
export const AllControls: Story = {
  name: "All controls",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const control of ["Account", "Cart"]) {
      expect(canvas.getByRole("button", { name: control })).toBeInTheDocument();
    }
    expect(canvas.queryByRole("button", { name: "Search" })).toBeNull();
    expect(canvas.queryByRole("button", { name: "Wishlist" })).toBeNull();
    expect(canvas.getByRole("button", { name: "English" })).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Store" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      canvas.getByRole("link", { name: "Store Locator" }),
    ).not.toHaveAttribute("aria-current");
    const storeLocator = canvas.getByRole("link", { name: "Store Locator" });
    const help = canvas.getByRole("link", { name: "Help" });
    expect(
      storeLocator.compareDocumentPosition(help) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(help).toHaveAttribute("target", "_blank");
    expect(help).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      canvasElement.querySelector('[data-slot="nav-logo"]'),
    ).toHaveAttribute("href", "/");
  },
};

/** A compound header can replace the built-in cart control with its own slot. */
export const CartSlot: Story = {
  name: "Cart slot",
  args: {
    cartSlot: (
      <IconButton
        aria-label="Cart (3)"
        onClick={cartSlotClick}
        size="md"
        variant="ghost"
      >
        <ShoppingBag aria-hidden size={14} />
      </IconButton>
    ),
  },
  play: async ({ canvasElement, args, step }) => {
    await step(
      "shared-ui-site-chrome-SC-22 - Cart slot replaces the built-in cart",
      async () => {
        const canvas = within(canvasElement);
        const cart = canvas.getByRole("button", { name: "Cart (3)" });

        expect(cart).toBeInTheDocument();
        expect(canvas.queryByRole("button", { name: "Cart" })).toBeNull();

        await userEvent.click(cart);

        expect(cartSlotClick).toHaveBeenCalledTimes(1);
        expect(args.onCartClick).not.toHaveBeenCalled();
      },
    );
  },
};

/** Promo bar omitted — utility row or main bar is the top edge. */
export const NoPromo: Story = {
  name: "No promo bar",
  args: { promo: null },
};

/** Same shell wearing another brand's copy — nothing inherited. */
export const AnotherBrand: Story = {
  name: "Another brand",
  args: {
    promo: null,
    logo: "ZZZ",
    utilityLinks: [
      { label: "Support", href: "#support" },
      { label: "Returns", href: "#returns" },
    ],
    navItems: [
      { label: "NEW", href: "#new", current: true },
      { label: "BRANDS", href: "#brands" },
    ],
    copy: { locale: "한국어" },
    locales: [{ value: "ko", label: "한국어" }],
    locale: "ko",
  },
};

/** No navigation item is current. */
export const NoCurrentItem: Story = {
  name: "No current item",
  args: { navItems: NAV_ITEMS.map(({ label, href }) => ({ label, href })) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const item of NAV_ITEMS) {
      expect(
        canvas.getByRole("link", { name: item.label }),
      ).not.toHaveAttribute("aria-current");
    }
  },
};

/** Every visible string was supplied — the shell invents none. */
export const NoDefaultCopy: Story = {
  name: "No default copy",
  args: {
    promo: null,
    logo: "ZZZ",
    utilityLinks: [],
    navItems: [],
    copy: { locale: "한국어" },
    locales: [],
    onLocaleChange: undefined,
    onSearchClick: undefined,
    onAccountClick: undefined,
    onCartClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('[data-slot="nav"]')?.textContent;
    expect(text).toContain("ZZZ");
    expect(text).toContain("한국어");
    const leftover = (text ?? "")
      .replace("ZZZ", "")
      .replace("한국어", "")
      .trim();
    expect(leftover).toBe("");
  },
};
