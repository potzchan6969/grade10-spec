import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import {
  AUCTION_STORE_BASE_ARGS,
  cartBadge,
  STORE_LOCATOR_HREF,
  WIDE_MIN,
} from "./site-header.auction-store.story-shared";

const meta = {
  title: "Site Chrome/SiteHeader/Auction & Store/Surfaces",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: AUCTION_STORE_BASE_ARGS,
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cart stays on Auction (and every other surface) once Store answers, so
 * checkout stays one tap away. Auction is current; Store Locator then Help.
 */
export const CartOnAuction: Story = {
  name: "Cart on Auction",
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
    const body = within(canvasElement.ownerDocument.body);
    expect(
      canvas.getByRole("button", { name: "Cart (2)" }),
    ).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toHaveTextContent("2");
    const header =
      canvasElement.querySelector<HTMLElement>('[data-slot="nav"]');
    const wide =
      header != null && header.getBoundingClientRect().width >= WIDE_MIN;
    if (wide) {
      expect(canvas.queryByRole("button", { name: "Menu" })).toBeNull();
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
    } else {
      await userEvent.click(canvas.getByRole("button", { name: "Menu" }));
      const menu = within(await body.findByRole("dialog"));
      expect(menu.getByRole("link", { name: "Store" })).toBeInTheDocument();
      expect(menu.getByRole("link", { name: "Auction" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    }
  },
};
