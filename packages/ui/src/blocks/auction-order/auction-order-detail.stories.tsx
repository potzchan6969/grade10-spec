import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionOrderDetail } from "./auction-order-detail";

const COPY = {
  orderInformation: "Order Information",
  collectionMethod: "Collection Method",
  orderStatus: "Order Status",
  lots: "Lots",
  orderNumber: "Order No.",
  auction: "Auction",
  currency: "Currency",
  date: "Date",
  invoiceStatus: "Invoice Status",
  winningBid: "Winning bid",
  payNow: "Pay Now",
  contactUs: "Contact Us",
};

const meta = {
  title: "Auction Order/AuctionOrderDetail",
  component: AuctionOrderDetail,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: COPY,
    orderNumber: "AO-10001",
    auction: "September Collectors Auction",
    currency: "HKD",
    date: "17 Sep 2026, 21:30 HKT",
    orderStatus: "Preparing Invoice",
    invoiceStatus: "Not issued",
    collectionMethod: (
      <dl>
        <dt>Delivery</dt>
        <dd>Alex Chen · +852 1234 · alex@example.com</dd>
      </dl>
    ),
    statusTimeline: [
      { status: "Awaiting Setup", reachedAt: "17 Sep 2026, 21:30 HKT" },
      { status: "Preparing Invoice", reachedAt: "18 Sep 2026, 09:15 HKT" },
    ],
    lot: {
      title: "1999 Base Set Charizard PSA 9",
      winningBid: "HK$12,800",
      href: "#lot-charizard",
    },
  },
} satisfies Meta<typeof AuctionOrderDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutInvoice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Order Status" })).toBeVisible();
    expect(canvas.getByText("Collection Method")).toBeVisible();
    expect(canvas.getByText("Lots")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Pay Now" }),
    ).not.toBeInTheDocument();
  },
};

export const WithInvoice: Story = {
  args: {
    invoice: {
      lines: [
        { label: "Winning Bid", value: "HK$12,800" },
        { label: "Order Total", value: "HK$15,660" },
      ],
      onPayNow: fn(),
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Pay Now" }));
    expect(args.invoice?.onPayNow).toHaveBeenCalledTimes(1);
    expect(canvas.getByText("HK$15,660")).toBeVisible();
  },
};

export const ExpiredInvoice: Story = {
  name: "Expired invoice with Contact Us",
  args: {
    invoice: {
      lines: [
        { label: "Invoice Status", value: "Expired" },
        { label: "Order Total", value: "HK$15,660" },
      ],
      onContact: fn(),
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Contact Us" }));
    expect(args.invoice?.onContact).toHaveBeenCalledTimes(1);
    expect(
      canvas.queryByRole("button", { name: "Pay Now" }),
    ).not.toBeInTheDocument();
  },
};
