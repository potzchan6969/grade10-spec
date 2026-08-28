import { HStack } from "@grade10/design-system/components/layout/hstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderDetailsPaymentLogo } from "./order-details-payment-logo";
import type { OrderDetailsPaymentBrand } from "./types";

const BRANDS: OrderDetailsPaymentBrand[] = [
  "visa",
  "mastercard",
  "amex",
  "apple-pay",
  "google-pay",
];

const meta = {
  title: "Store Order Detail/OrderDetailsPaymentLogo",
  component: OrderDetailsPaymentLogo,
  tags: ["autodocs"],
  args: {
    brand: "visa",
  },
} satisfies Meta<typeof OrderDetailsPaymentLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visa: Story = {
  args: { brand: "visa" },
};

export const Mastercard: Story = {
  args: { brand: "mastercard" },
};

export const Amex: Story = {
  args: { brand: "amex" },
};

export const ApplePay: Story = {
  args: { brand: "apple-pay" },
};

export const GooglePay: Story = {
  args: { brand: "google-pay" },
};

export const AllBrands: Story = {
  render: () => (
    <HStack className="items-center" gap="lg">
      {BRANDS.map((brand) => (
        <OrderDetailsPaymentLogo brand={brand} key={brand} />
      ))}
    </HStack>
  ),
};
