import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  ACTIVE_ORDER,
  ORDER_HISTORY_COPY,
  PAST_CANCELED,
  PAST_COMPLETED,
} from "./fixtures";
import { OrderHistory } from "./order-history";

const breadcrumbs = (
  <Breadcrumbs>
    <BreadcrumbItem href="#account">Account</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>Your Orders</BreadcrumbItem>
  </Breadcrumbs>
);

const meta = {
  title: "Store Order History/OrderHistory",
  component: OrderHistory,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: ORDER_HISTORY_COPY,
    breadcrumbs,
    activeOrders: [ACTIVE_ORDER],
    pastOrders: [PAST_COMPLETED, PAST_CANCELED],
    onTrackOrder: fn(),
    onViewDetails: fn(),
    onShopNow: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex w-full justify-center bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OrderHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

function orderHistoryRevealed(canvasElement: HTMLElement): boolean {
  const root = canvasElement.querySelector('[data-slot="order-history"]');
  if (root?.getAttribute("data-revealed") !== "true") return false;

  const empty = canvasElement.querySelector(
    '[data-slot="order-history-empty"]',
  );
  if (empty) {
    return Number(getComputedStyle(empty).opacity) > 0.9;
  }

  const card = canvasElement.querySelector('[data-slot="order-history-card"]');
  const wrapper = card?.parentElement;
  if (!wrapper) return false;
  return Number(getComputedStyle(wrapper).opacity) > 0.9;
}

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderHistoryRevealed(canvasElement)).toBe(true));
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your Orders" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("heading", { level: 2, name: "Active Orders" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("heading", { level: 2, name: "Past Orders" }),
    ).toBeVisible();
    expect(canvas.queryByText("No orders yet")).not.toBeInTheDocument();
  },
};

export const ActiveOnly: Story = {
  args: { pastOrders: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderHistoryRevealed(canvasElement)).toBe(true));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Active Orders" }),
    ).toBeVisible();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Past Orders" }),
    ).not.toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { activeOrders: [], pastOrders: [] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderHistoryRevealed(canvasElement)).toBe(true));
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your Orders" }),
    ).toBeVisible();
    expect(canvas.getByText("No orders yet")).toBeVisible();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Active Orders" }),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Shop Now" }));
    expect(args.onShopNow).toHaveBeenCalled();
  },
};
