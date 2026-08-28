import type { Meta, StoryObj } from "@storybook/react-vite";
import { FILLED_LINES, ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetailsOrderTable } from "./order-details-order-table";

const meta = {
  title: "Store Order Detail/OrderDetailsOrderTable",
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
