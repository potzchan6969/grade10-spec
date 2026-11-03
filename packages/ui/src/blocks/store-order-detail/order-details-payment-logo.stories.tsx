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
  parameters: {
    verification: { caseId: "vc_ed249cf7-5fbb-46be-b55a-8136f89f9ea6" },
  },
  args: { brand: "visa" },
};

export const Mastercard: Story = {
  parameters: {
    verification: { caseId: "vc_b7660ca2-8e7d-4795-8349-1507c9972426" },
  },
  args: { brand: "mastercard" },
};

export const Amex: Story = {
  parameters: {
    verification: { caseId: "vc_501a32b9-6773-46ae-9d07-e33497ac9e5d" },
  },
  args: { brand: "amex" },
};

export const Jcb: Story = {
  parameters: {
    verification: { caseId: "vc_f7a59213-56ab-4a54-88a0-38a74cac1451" },
  },
  name: "JCB",
  args: { brand: "jcb" },
};

export const UnionPay: Story = {
  parameters: {
    verification: { caseId: "vc_a0ab33b3-a74b-49dc-8853-5ba16daf5145" },
  },
  args: { brand: "unionpay" },
};

export const Discover: Story = {
  parameters: {
    verification: { caseId: "vc_469b7898-b1bb-4833-aaa3-f7e163c2437e" },
  },
  args: { brand: "discover" },
};

export const DinersClub: Story = {
  parameters: {
    verification: { caseId: "vc_bca617bf-eecc-444d-b5d2-caaf34e10495" },
  },
  args: { brand: "diners" },
};

export const ApplePay: Story = {
  parameters: {
    verification: { caseId: "vc_2bf4c465-661e-4d7b-b642-1a08fd71050e" },
  },
  args: { brand: "apple-pay" },
};

export const GooglePay: Story = {
  parameters: {
    verification: { caseId: "vc_72d03bb1-4be0-4326-ab4c-bc4b7f4db9c7" },
  },
  args: { brand: "google-pay" },
};

/** A card of no recognized brand: a plain card, named by its masked number. */
export const PlainCard: Story = {
  parameters: {
    verification: { caseId: "vc_d2643183-935a-4cbd-adce-e78434b91170" },
  },
  args: { brand: "card" },
};

export const AllBrands: Story = {
  parameters: {
    verification: { caseId: "vc_4d6192f7-568a-431c-8409-447d90f000cc" },
  },
  render: () => (
    <HStack className="items-center" gap="lg">
      {BRANDS.map((brand) => (
        <OrderDetailsPaymentLogo brand={brand} key={brand} />
      ))}
    </HStack>
  ),
};
