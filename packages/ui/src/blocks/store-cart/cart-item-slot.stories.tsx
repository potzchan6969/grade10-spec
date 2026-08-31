import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CartItemSlot } from "./cart-drawer";

const container: Decorator[] = [
  (Story) => (
    // Match drawer body inset (`px-6`) so the slot fills the content column.
    <div className="w-(--container-md) overflow-hidden rounded-2xl border border-border bg-sidebar px-6 py-4">
      <Story />
    </div>
  ),
];

/**
 * Empty item placeholder slot (`4735:5944`).
 *
 * An interactive dashed placeholder row filling the baseline grid up to 5 slots.
 * Features a regular-weight plus icon and navigates to browse more items on click.
 *
 * Part of the scrollable list in [`CartDrawerBody`](?path=/docs/store-cart-cartdrawerbody--docs)
 * and [`CartDrawer`](?path=/docs/store-cart-cartdrawer--docs).
 */
const meta = {
  title: "Store Cart/CartItemSlot",
  component: CartItemSlot,
  tags: ["autodocs"],
  decorators: container,
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof CartItemSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default empty placeholder slot */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const slot = canvas.getByRole("button", {
      name: "Add more items to cart",
    });
    expect(slot).toBeInTheDocument();
    await userEvent.click(slot);
    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
