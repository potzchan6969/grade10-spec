import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { STATUS_LABELS } from "./fixtures";
import { OrderHistoryStatus } from "./order-history-status";
import type { OrderHistoryFulfillmentStatus } from "./types";

const STATUSES: OrderHistoryFulfillmentStatus[] = [
  "processing",
  "shipped",
  "pickup",
  "completed",
  "canceled",
  "refunded",
];

const meta = {
  title: "Store/Order History/Blocks/OrderHistoryStatus",
  component: OrderHistoryStatus,
  tags: ["autodocs"],
  args: {
    status: "shipped",
    children: STATUS_LABELS.shipped,
  },
} satisfies Meta<typeof OrderHistoryStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shipped: Story = {
  parameters: {
    verification: { caseId: "vc_d759f482-eacd-4309-bfad-24f10203aed6" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Shipped")).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="order-history-status"]'),
    ).toHaveAttribute("data-status", "shipped");
  },
};

export const Completed: Story = {
  parameters: {
    verification: { caseId: "vc_a5382f86-6d5a-4edb-8e42-a1a9b4d9f4fb" },
  },
  args: { status: "completed", children: STATUS_LABELS.completed },
};

export const Processing: Story = {
  parameters: {
    verification: { caseId: "vc_29fb2bc4-ddb6-487d-bc8f-67517b1a9107" },
  },
  args: { status: "processing", children: STATUS_LABELS.processing },
};

export const Pickup: Story = {
  parameters: {
    verification: { caseId: "vc_d73ebf74-f952-409b-b8d9-1dbc5c0d9aa0" },
  },
  args: { status: "pickup", children: STATUS_LABELS.pickup },
};

export const Canceled: Story = {
  parameters: {
    verification: { caseId: "vc_0f0414a5-5555-4db4-8872-c9117e6b4d85" },
  },
  args: { status: "canceled", children: STATUS_LABELS.canceled },
};

export const Refunded: Story = {
  parameters: {
    verification: { caseId: "vc_5acdbedb-a366-4373-9763-260484898cfe" },
  },
  args: { status: "refunded", children: STATUS_LABELS.refunded },
};

export const AllStatuses: Story = {
  parameters: {
    verification: { caseId: "vc_303a53d5-fe34-480a-b835-23a7748f5a7e" },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {STATUSES.map((status) => (
        <OrderHistoryStatus key={status} status={status}>
          {STATUS_LABELS[status]}
        </OrderHistoryStatus>
      ))}
    </div>
  ),
};
