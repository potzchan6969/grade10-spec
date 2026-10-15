import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionWinnerOrder } from "./auction-winner-order";
import { BASE_ARGS, SETUP_CONFIRM, STEPS, settled } from "./auction-winner-order.story-fixtures";

const meta = {
  title: "Auction/Post Bidding/Blocks/AuctionWinnerOrder/Setup",
  component: AuctionWinnerOrder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: BASE_ARGS,
} satisfies Meta<typeof AuctionWinnerOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AwaitingSetup: Story = {
  args: {
    badge: { label: "Awaiting Setup", variant: "warning" },
    progress: {
      current: "address",
      steps: {
        ...STEPS,
        address: { label: "Address", description: "Confirm by 26 Sep 2026" },
        invoice: { label: "Invoice" },
        payment: { label: "Payment" },
      },
    },
    summary: {
      lines: [
        { label: "Winning Bid", value: "HK$12,800.00" },
        { label: "Shipping & Handling", value: "TBD", muted: true },
      ],
      total: { label: "Order Total", value: "TBD", muted: true },
    },
    paymentMethod: undefined,
    delivery: {
      label: "Delivery address",
      confirm: {
        label: "Complete Order Setup",
        onPress: fn(),
        deadline: "Confirm by 26 Sep 2026, 15:12",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    await userEvent.click(
      sidebar.getByRole("button", { name: "Complete Order Setup" }),
    );
    expect(args.delivery?.confirm?.onPress).toHaveBeenCalledTimes(1);
  },
};

export const SetupOverdue: Story = {
  args: {
    badge: { label: "Setup Overdue", variant: "error" },
    progress: {
      current: "address",
      steps: {
        ...STEPS,
        address: { label: "Address", description: "26 Sep 2026" },
        invoice: { label: "Invoice" },
        payment: { label: "Payment" },
      },
    },
    summary: {
      lines: [{ label: "Winning Bid", value: "HK$12,800.00" }],
      total: { label: "Order Total", value: "TBD", muted: true },
    },
    paymentMethod: undefined,
    delivery: {
      label: "Delivery address",
      alert: {
        title: "Missed setup deadline: 26 Sep 2026",
        status: "warning",
        action: { label: "Contact Us", onPress: fn() },
      },
    },
  },
};

/** A press in flight draws busy on the button and a second press does nothing. */
export const SetupConfirmPending: Story = {
  args: {
    ...AwaitingSetup.args,
    delivery: {
      label: "Delivery address",
      confirm: { ...SETUP_CONFIRM, pending: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    const confirm = sidebar.getByRole("button", {
      name: "Complete Order Setup",
    });
    expect(confirm).toHaveAttribute("aria-busy", "true");
    confirm.click();
    expect(args.delivery?.confirm?.onPress).not.toHaveBeenCalled();
  },
};

/** A refused confirm says why under the button, which presses again. */
export const SetupConfirmRefused: Story = {
  args: {
    ...AwaitingSetup.args,
    delivery: {
      label: "Delivery address",
      confirm: {
        ...SETUP_CONFIRM,
        failed: "We couldn't start your order setup. Try again.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    expect(sidebar.getByRole("alert")).toHaveTextContent(
      "We couldn't start your order setup. Try again.",
    );
    await userEvent.click(
      sidebar.getByRole("button", { name: "Complete Order Setup" }),
    );
    expect(args.delivery?.confirm?.onPress).toHaveBeenCalledTimes(1);
  },
};
