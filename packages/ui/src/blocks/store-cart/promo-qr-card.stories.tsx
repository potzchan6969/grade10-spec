import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PromoQrCard } from "./promo-qr-card";

const meta = {
  title: "Store/Cart/Blocks/PromoQrCard",
  component: PromoQrCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md bg-sidebar p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    qrCode: {
      value: "g10:redeem:voucher-50:7Q2M",
      altText: "Show this code to store staff",
      toggleLabel: "Use now",
    },
    caption: "Staff scan this at the counter",
    open: true,
  },
} satisfies Meta<typeof PromoQrCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The card unfolded — QR plate over the staff-facing caption. A surface
 * mounts it wherever the till reads it; the ticket only carries the Use
 * now control that opens it. */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="promo-qr-card"]'),
    ).toBeVisible();
    expect(canvasElement.querySelector("svg")).toBeInTheDocument();
    expect(
      canvas.getByText("Staff scan this at the counter"),
    ).toBeInTheDocument();
  },
};

/** No caption — the plate alone where the surface says nothing under it. */
export const WithoutCaption: Story = {
  args: {
    qrCode: {
      value: "g10:collect:reward-slab-sleeves:7Q2M",
      altText: "Show this code to store staff",
      toggleLabel: "Use now",
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).toBeInTheDocument();
  },
};
