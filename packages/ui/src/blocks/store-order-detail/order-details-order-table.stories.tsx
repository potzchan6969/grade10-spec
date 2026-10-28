import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FILLED_LINES, ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetailsOrderTable } from "./order-details-order-table";

const LONG_PRODUCT_NAME =
  "Pokémon Store Korea Magikarp – Wobbling Keyring, 5 Designs Random (Wave 2)";

const meta = {
  title: "Store/Order Detail/Blocks/OrderDetailsOrderTable",
  component: OrderDetailsOrderTable,
  tags: ["autodocs"],
  args: {
    copy: ORDER_DETAILS_COPY.table,
    lines: FILLED_LINES,
    statusLabels: ORDER_DETAILS_COPY.status,
  },
} satisfies Meta<typeof OrderDetailsOrderTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongProductNameWrapsWithinTheTable: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "640px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    lines: [{ ...FILLED_LINES[0], product: LONG_PRODUCT_NAME }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvasElement.querySelector<HTMLElement>(
      '[data-slot="order-details-order-table"]',
    );
    const rail = canvasElement.querySelector<HTMLElement>(
      '[data-slot="order-details-order-table-rail"]',
    );
    const product = canvas.getByText(LONG_PRODUCT_NAME);

    expect(table).not.toBeNull();
    expect(rail).not.toBeNull();
    if (!rail)
      throw new Error("order-details-order-table-rail is not rendered");
    expect(table).toHaveClass("w-full");
    expect(table).not.toHaveClass("w-max");
    expect(product.getBoundingClientRect().height).toBeGreaterThan(20);
    expect(rail.scrollWidth).toBeLessThanOrEqual(rail.clientWidth);
  },
};

/** Narrower than the table's smallest fitting width, the rail scrolls
 * sideways instead of crushing the money columns. */
export const ScrollsOnANarrowViewport: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector<HTMLElement>(
      '[data-slot="order-details-order-table-rail"]',
    );
    expect(rail).not.toBeNull();
    if (!rail)
      throw new Error("order-details-order-table-rail is not rendered");
    expect(rail).toHaveClass("overflow-x-auto");
    expect(rail.scrollWidth).toBeGreaterThan(rail.clientWidth);
  },
};
