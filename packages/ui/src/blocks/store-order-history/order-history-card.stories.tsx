import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import {
  ACTIVE_ORDER,
  ORDER_HISTORY_COPY,
  PAST_COMPLETED,
  STATUS_LABELS,
} from "./fixtures";
import { OrderHistoryCard } from "./order-history-card";
import { OrderHistoryLineItem } from "./order-history-line-item";

/** Figma order card frame width — shared so every story paints the same width. */
const CARD_FRAME = "w-[960px] max-w-full";

const meta = {
  title: "Store Order History/OrderHistoryCard",
  component: OrderHistoryCard,
  tags: ["autodocs"],
  args: {
    copy: ORDER_HISTORY_COPY.cardHeader,
    orderId: ACTIVE_ORDER.orderId,
    status: ACTIVE_ORDER.status,
    statusLabel: STATUS_LABELS[ACTIVE_ORDER.status],
    date: ACTIVE_ORDER.date,
    total: ACTIVE_ORDER.total,
    trackOrder: ACTIVE_ORDER.trackOrder,
    onTrackOrder: fn(),
    onViewDetails: fn(),
  },
  render: (args) => (
    <OrderHistoryCard {...args}>
      {ACTIVE_ORDER.lines.map((line) => (
        <OrderHistoryLineItem
          key={line.id}
          imageAlt={line.imageAlt}
          imageSrc={line.imageSrc}
          product={line.product}
          total={line.total}
        />
      ))}
    </OrderHistoryCard>
  ),
  decorators: [
    (Story) => (
      <div className={CARD_FRAME}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OrderHistoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShippedWithLines: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Order #G10-10391")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Track Order" })).toBeVisible();
    expect(
      canvasElement.querySelectorAll('[data-slot="order-history-line-item"]'),
    ).toHaveLength(3);
    expect(
      canvasElement.querySelector('[data-slot="order-history-card-body"]'),
    ).toHaveClass("scroll-fade-x");
  },
};

/** Three 320px line items overflow the shared 960px frame (minus body padding). */
export const OverflowingLines: Story = {
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector(
      '[data-slot="order-history-card-body"]',
    );
    expect(body).toHaveClass("scroll-fade-x", "overflow-x-auto");
    expect(body!.scrollWidth).toBeGreaterThan(body!.clientWidth);
  },
};

export const CompletedWithoutTrack: Story = {
  args: {
    orderId: PAST_COMPLETED.orderId,
    status: PAST_COMPLETED.status,
    statusLabel: STATUS_LABELS[PAST_COMPLETED.status],
    date: PAST_COMPLETED.date,
    total: PAST_COMPLETED.total,
    trackOrder: false,
    onTrackOrder: undefined,
  },
  render: (args) => (
    <OrderHistoryCard {...args}>
      {PAST_COMPLETED.lines.map((line) => (
        <OrderHistoryLineItem
          key={line.id}
          imageAlt={line.imageAlt}
          imageSrc={line.imageSrc}
          product={line.product}
          total={line.total}
        />
      ))}
    </OrderHistoryCard>
  ),
};
