import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { AuctionWinnerOrder } from "./auction-winner-order";
import {
  BASE_ARGS,
  LINE_TOOLTIPS,
  SETUP_CONFIRM,
  STEPS,
  settled,
} from "./auction-winner-order.story-fixtures";
import type { AuctionWinnerOrderProps } from "./types";

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
        { label: "Winning Bid", value: "US$12,800.00" },
        {
          label: "Buyer’s Premium",
          value: "US$2,560.00",
          tooltip: LINE_TOOLTIPS.buyersPremium,
        },
        { label: "Shipping & Handling", value: "TBD", muted: true },
      ],
      total: {
        label: "Order Total",
        value: "US$15,360.00",
        footnote: "Shipping, insurance and fees are added at invoice.",
      },
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
      lines: [
        { label: "Winning Bid", value: "US$12,800.00" },
        {
          label: "Buyer’s Premium",
          value: "US$2,560.00",
          tooltip: LINE_TOOLTIPS.buyersPremium,
        },
      ],
      total: {
        label: "Order Total",
        value: "US$15,360.00",
        footnote: "Shipping, insurance and fees are added at invoice.",
      },
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

const SETUP_CONFIRM_FAILED = "We couldn’t start order setup. Try again.";

function RefusedSetupConfirm({ delivery, ...args }: AuctionWinnerOrderProps) {
  const [failed, setFailed] = useState<string>();
  return (
    <AuctionWinnerOrder
      {...args}
      delivery={
        delivery && {
          ...delivery,
          confirm: delivery.confirm && {
            ...delivery.confirm,
            failed,
            onPress: () => {
              delivery.confirm?.onPress();
              setFailed(SETUP_CONFIRM_FAILED);
            },
          },
        }
      }
    />
  );
}

/** A refused press toasts the reason; the button stays ready for another press. */
export const SetupConfirmRefused: Story = {
  args: {
    ...AwaitingSetup.args,
    delivery: {
      label: "Delivery address",
      confirm: { ...SETUP_CONFIRM },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Toast position="bottom-right" />
        <Story />
      </>
    ),
  ],
  render: (args) => <RefusedSetupConfirm {...args} />,
  play: async ({ args, canvasElement }) => {
    await settled(canvasElement);
    const sidebar = within(within(canvasElement).getByRole("complementary"));
    expect(sidebar.queryByRole("alert")).toBeNull();
    await userEvent.click(
      sidebar.getByRole("button", { name: "Complete Order Setup" }),
    );
    expect(args.delivery?.confirm?.onPress).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(
        within(document.body).getByText(SETUP_CONFIRM_FAILED),
      ).toBeInTheDocument(),
    );
    expect(sidebar.queryByRole("alert")).toBeNull();
  },
};
