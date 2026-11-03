import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_PLACED_ON } from "../../lib/datetime-fixtures";
import { ORDER_HISTORY_COPY } from "./fixtures";
import { OrderHistoryCardHeader } from "./order-history-card-header";

const meta = {
  title: "Store/Order History/Blocks/OrderHistoryCardHeader",
  component: OrderHistoryCardHeader,
  tags: ["autodocs"],
  args: {
    copy: ORDER_HISTORY_COPY.cardHeader,
    orderId: "Order #G10-10391",
    status: "shipped",
    statusLabel: "Shipped",
    date: FIXTURE_PLACED_ON,
    total: "Total: HK$1,770",
    trackOrder: true,
    onTrackOrder: fn(),
    onViewDetails: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OrderHistoryCardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTrackOrder: Story = {
  parameters: {
    verification: { caseId: "vc_5f5d7231-1bf1-49aa-a62b-e32f735f5aab" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Track Order" }));
    expect(args.onTrackOrder).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "View Details" }));
    expect(args.onViewDetails).toHaveBeenCalled();
  },
};

export const WithoutTrackOrder: Story = {
  parameters: {
    verification: { caseId: "vc_9fec79f7-9dc0-4cc4-bc68-d0d6dcc08c30" },
  },
  args: { trackOrder: false, onTrackOrder: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("button", { name: "Track Order" }),
    ).not.toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "View Details" })).toBeVisible();
  },
};
