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
      <div style={{ width: "420px" }}>
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
    const tableContainer = table?.parentElement;
    const product = canvas.getByText(LONG_PRODUCT_NAME);

    expect(table).not.toBeNull();
    expect(tableContainer).not.toHaveAttribute(
      "data-slot",
      "order-details-order-table-rail",
    );
    expect(table).toHaveClass("w-full");
    expect(table).not.toHaveClass("w-max");
    expect(product.getBoundingClientRect().height).toBeGreaterThan(20);
    expect(tableContainer?.scrollWidth).toBeLessThanOrEqual(
      tableContainer?.clientWidth ?? -1,
    );
  },
};
