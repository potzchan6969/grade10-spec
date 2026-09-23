import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Bank } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { OrderDetailsPaymentLogo } from "../store-order-detail/order-details-payment-logo";
import { PaymentMethodCard } from "./payment-method-card";

const meta = {
  title: "Payment Method/PaymentMethodCard",
  component: PaymentMethodCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared payment-method row: leading mark, divider, and label. Optional description under the label for a free-text bank name. Used on Store Order Details, Winner Order, and refund Transfer to.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PaymentMethodCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Card brand logo and masked number — Store Order Details / card refund. */
export const Visa: Story = {
  args: {
    leading: <OrderDetailsPaymentLogo brand="visa" />,
    label: "···· 4242",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText("Visa")).toBeVisible();
    expect(canvas.getByText("···· 4242")).toBeVisible();
  },
};

/** Mastercard mark. */
export const Mastercard: Story = {
  args: {
    leading: <OrderDetailsPaymentLogo brand="mastercard" />,
    label: "···· 0561",
  },
};

/** Bank transfer — masked account with bank name as subtext. */
export const BankTransfer: Story = {
  name: "Bank Transfer",
  args: {
    leading: <Bank aria-label="Bank" size={20} weight="regular" />,
    label: "···· 8891",
    description: "HSBC",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText("Bank")).toBeVisible();
    expect(canvas.getByText("···· 8891")).toBeVisible();
    expect(canvas.getByText("HSBC")).toBeVisible();
  },
};

/** Long free-text bank name wraps under the masked account. */
export const LongBankName: Story = {
  name: "Long Bank Name",
  args: {
    leading: <Bank aria-label="Bank" size={20} weight="regular" />,
    label: "···· 8891",
    description: "Hongkong and Shanghai Banking Corporation Limited",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("···· 8891")).toBeVisible();
    expect(
      canvas.getByText("Hongkong and Shanghai Banking Corporation Limited"),
    ).toBeVisible();
  },
};

/** With a trailing Change control — bid enrollment payment row. */
export const WithChange: Story = {
  name: "With Change",
  args: {
    leading: <OrderDetailsPaymentLogo brand="visa" />,
    label: "···· 4242",
    action: (
      <Link render={<button type="button" />} size="sm">
        Change
      </Link>
    ),
  },
};

/** Side-by-side card and bank for docs. */
export const CardAndBank: Story = {
  name: "Card And Bank",
  args: {
    leading: <OrderDetailsPaymentLogo brand="visa" />,
    label: "···· 4242",
  },
  render: () => (
    <VStack className="w-80" gap="md" hAlign="stretch">
      <PaymentMethodCard
        label="···· 4242"
        leading={<OrderDetailsPaymentLogo brand="visa" />}
      />
      <PaymentMethodCard
        description="Hongkong and Shanghai Banking Corporation Limited"
        label="···· 8891"
        leading={<Bank aria-label="Bank" size={20} weight="regular" />}
      />
    </VStack>
  ),
};
