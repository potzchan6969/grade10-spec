import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FIXTURE_CANCELED_MESSAGE,
  FIXTURE_REFUND_MESSAGE,
} from "../../lib/datetime-fixtures";
import { IMAGE, ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetailsOrderItem } from "./order-details-order-item";

const meta = {
  title: "Store/Order Detail/Blocks/OrderDetailsOrderItem",
  component: OrderDetailsOrderItem,
  tags: ["autodocs"],
  // A row only has its table semantics inside the table that owns it.
  decorators: [
    (Story) => (
      <Table className="w-fit">
        <TableBody>
          <Story />
        </TableBody>
      </Table>
    ),
  ],
  args: {
    product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    subtotal: "HK$105",
    quantity: "1",
    total: "HK$105",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  },
} satisfies Meta<typeof OrderDetailsOrderItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_55572002-37dc-4153-bc83-7b292732e24b" },
  },
};

export const WithItemCoupon: Story = {
  parameters: {
    verification: { caseId: "vc_417cff93-13d5-4a82-b238-0fbc9a727bee" },
  },
  args: {
    subtotal: "HK$94.50",
    total: "HK$94.50",
    couponCode: "SUMMER10",
  },
};

/** Line item flagged with a status issue (refund, cancel, or other problem). */
export const WithLineIssue: Story = {
  parameters: {
    verification: { caseId: "vc_1645d2c8-8a37-4dc7-93ab-ea29650788d6" },
  },
  args: {
    lineStatus: "refunded",
    statusLabel: ORDER_DETAILS_COPY.status.refunded,
    statusMessage: FIXTURE_REFUND_MESSAGE,
    struckThrough: true,
  },
};

export const Canceled: Story = {
  parameters: {
    verification: { caseId: "vc_fc6d1af5-39b3-47b2-8a61-f2d94bada63e" },
  },
  args: {
    lineStatus: "canceled",
    statusLabel: ORDER_DETAILS_COPY.status.canceled,
    statusMessage: FIXTURE_CANCELED_MESSAGE,
    struckThrough: true,
  },
};
