import { HStack } from "@grade10/design-system/components/layout/hstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderDetailsPaymentLogo } from "./order-details-payment-logo";
import type { OrderDetailsPaymentBrand } from "./types";

const BRANDS: OrderDetailsPaymentBrand[] = [
  "visa",
  "mastercard",
  "amex",
  "jcb",
  "unionpay",
  "discover",
  "diners",
  "apple-pay",
  "google-pay",
  "card",
];

const meta = {
  title: "Store/Order Detail/Blocks/OrderDetailsPaymentLogo",
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

export const Jcb: Story = {
  name: "JCB",
  args: { brand: "jcb" },
};

export const UnionPay: Story = {
  args: { brand: "unionpay" },
};

export const Discover: Story = {
  args: { brand: "discover" },
};

export const DinersClub: Story = {
  args: { brand: "diners" },
};

export const ApplePay: Story = {
  args: { brand: "apple-pay" },
};

export const GooglePay: Story = {
  args: { brand: "google-pay" },
};

/** A card of no recognized brand: a plain card, named by its masked number. */
export const PlainCard: Story = {
  args: { brand: "card" },
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
