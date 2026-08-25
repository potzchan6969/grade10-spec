import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CartDrawerHeader } from "./cart-drawer";
import { DEFAULT_CART_COPY } from "./fixtures";

const container: Decorator[] = [
  (Story) => (
    <div className="w-(--container-md) overflow-hidden rounded-2xl border border-border bg-sidebar">
      <Story />
    </div>
  ),
];

/**
 * Header section of the cart drawer (`4735:6260`).
 *
 * Displays the drawer title ("Cart"), active item count badge (excluding sold-out items),
 * and a dismiss/close icon button. Loading bones for the badge are covered here;
 * composed fetch-on-open lives on [`CartDrawer`](?path=/docs/store-cart-cartdrawer--docs).
 */
const meta = {
  title: "Store Cart/CartDrawerHeader",
  component: CartDrawerHeader,
  tags: ["autodocs"],
  decorators: container,
  args: {
    itemCount: 2,
    copy: DEFAULT_CART_COPY.header,
    onClose: fn(),
  },
} satisfies Meta<typeof CartDrawerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default header with multiple active items showing count badge */
export const Default: Story = {
  args: {
    itemCount: 2,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
    expect(canvas.getByText("2")).toBeInTheDocument();
    const closeBtn = canvas.getByRole("button", { name: "Close cart" });
    await userEvent.click(closeBtn);
    expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

/** Header with 0 items (count badge is hidden when count is 0) */
export const ZeroItems: Story = {
  args: {
    itemCount: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
    expect(canvas.queryByText("0")).not.toBeInTheDocument();
  },
};

/** Boneyard skeleton on the item-count badge while status/price are fetching */
export const Loading: Story = {
  args: {
    loading: true,
    itemCount: 2,
  },
};
