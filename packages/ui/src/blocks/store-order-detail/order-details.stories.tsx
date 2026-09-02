import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { FIXTURE_PLACED_ON_WITH_PERIOD } from "../../lib/datetime-fixtures";
import {
  FILLED_ADDRESS,
  FILLED_DELIVERY,
  FILLED_LINES,
  FILLED_LINES_ORDER_DISCOUNT,
  FILLED_PAYMENT,
  FILLED_PICKUP_ADDRESS,
  FILLED_SUMMARY,
  FILLED_SUMMARY_ORDER_DISCOUNT,
  ORDER_DETAILS_COPY,
  PICKUP_DELIVERY,
} from "./fixtures";
import { OrderDetails } from "./order-details";

const breadcrumbs = (
  <Breadcrumbs>
    <BreadcrumbItem href="#account">Account</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem href="#orders">Your Orders</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>Order Details</BreadcrumbItem>
  </Breadcrumbs>
);

const meta = {
  title: "Store Order Detail/OrderDetails",
  component: OrderDetails,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: ORDER_DETAILS_COPY,
    breadcrumbs,
    orderId: "Order #G10-10482",
    status: "shipped",
    placedOn: FIXTURE_PLACED_ON_WITH_PERIOD,
    placedOnDateTime: "2026-08-26",
    needHelp: { href: "#" },
    delivery: FILLED_DELIVERY,
    lines: FILLED_LINES,
    summary: FILLED_SUMMARY,
    payment: FILLED_PAYMENT,
    shippingAddress: FILLED_ADDRESS,
    loyaltyPoints: (
      <>
        <span className="font-semibold">+177</span>{" "}
        <span className="text-sm font-medium text-secondary-foreground">
          pts
        </span>
      </>
    ),
    onTrackOrder: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex w-full justify-center bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OrderDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

function orderDetailsRevealed(canvasElement: HTMLElement): boolean {
  const root = canvasElement.querySelector('[data-slot="order-details"]');
  if (root?.getAttribute("data-revealed") !== "true") return false;

  const header = canvasElement.querySelector(
    '[data-slot="order-details-header"]',
  );
  const headerWrapper = header?.parentElement;
  if (
    !headerWrapper ||
    Number(getComputedStyle(headerWrapper).opacity) <= 0.9
  ) {
    return false;
  }

  const sidebar = canvasElement.querySelector(
    '[data-slot="order-details-sidebar"]',
  );
  const sidebarWrapper = sidebar?.parentElement;
  if (!sidebarWrapper) return false;
  return Number(getComputedStyle(sidebarWrapper).opacity) > 0.9;
}

export const ItemCoupon: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderDetailsRevealed(canvasElement)).toBe(true));
    expect(
      canvas.getByRole("heading", { level: 1, name: "Order #G10-10482" }),
    ).toBeVisible();
    expect(canvas.getByText("Delivery Status")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Track Order" })).toBeVisible();
    expect(canvas.getByText("Order Summary")).toBeVisible();
    expect(canvas.getByText("SUMMER10")).toBeVisible();
    expect(canvas.queryByText("Discount (WELCOME10)")).not.toBeInTheDocument();
    expect(canvas.getByText("HK$1,704.50")).toBeVisible();
    expect(canvas.getByText("Refunded")).toBeVisible();
  },
};

/** Order-wide promo in the summary; lines stay at list price. */
export const OrderDiscount: Story = {
  args: {
    lines: FILLED_LINES_ORDER_DISCOUNT,
    summary: FILLED_SUMMARY_ORDER_DISCOUNT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderDetailsRevealed(canvasElement)).toBe(true));
    expect(canvas.getByText("Discount (WELCOME10)")).toBeVisible();
    expect(canvas.queryByText("SUMMER10")).not.toBeInTheDocument();
    expect(canvas.getByText("HK$1,538")).toBeVisible();
  },
};

export const Pickup: Story = {
  args: {
    status: "pickup",
    delivery: PICKUP_DELIVERY,
    summary: {
      ...FILLED_SUMMARY,
      shipping: undefined,
      total: { label: "Total", value: "HK$1,654.50" },
    },
    shippingAddress: undefined,
    pickupAddress: FILLED_PICKUP_ADDRESS,
  },
};

export const InStore: Story = {
  args: {
    status: "completed",
    delivery: undefined,
    summary: {
      ...FILLED_SUMMARY,
      shipping: undefined,
      total: { label: "Total", value: "HK$1,654.50" },
    },
    shippingAddress: undefined,
    pickupAddress: undefined,
    onTrackOrder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(orderDetailsRevealed(canvasElement)).toBe(true));
    expect(canvas.queryByText("Shipping Address")).not.toBeInTheDocument();
    expect(canvas.queryByText("Pickup Address")).not.toBeInTheDocument();
    expect(canvas.queryByText("Delivery Status")).not.toBeInTheDocument();
  },
};
