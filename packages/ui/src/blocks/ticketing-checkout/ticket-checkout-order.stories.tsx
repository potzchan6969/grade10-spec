import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { phone } from "./checkout.story-fixtures";
import { LINES, LINES_FREE, ORDER_COPY, PROMO_COPY } from "./fixtures";
import { TicketCheckoutOrder } from "./ticket-checkout-order";
import { TicketPointsAbout } from "./ticket-points-about";
import { TicketPromoCodeField } from "./ticket-promo-code-field";

const meta = {
  title: "Ticketing/Buying/Blocks/TicketCheckoutOrder",
  component: TicketCheckoutOrder,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
    phone,
  ],
  args: {
    copy: ORDER_COPY,
    lines: LINES,
    total: "HK$1,150.00",
    points: <TicketPointsAbout copy={{ line: "Earn about 115 points" }} />,
  },
} satisfies Meta<typeof TicketCheckoutOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each line at the price it was held at, the total and the points. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_4db9fa16-9b91-4315-a5da-f56c19cd812f" },
  },
  play: async ({ canvasElement }) => {
    const order = within(canvasElement).getByRole("region", {
      name: "Your Order",
    });
    expect(within(order).getAllByText(/General Pass/)).toHaveLength(3);
    expect(
      within(order).getByText("Fast Pass, 2 days: HK$200.00"),
    ).toBeVisible();
    expect(within(order).getByText("HK$1,150.00")).toBeVisible();
    expect(within(order).getByText("Earn about 115 points")).toBeVisible();
  },
};

/** On Check Your Order: the Promo code field under the lines. */
export const WithPromoCode: Story = {
  parameters: {
    verification: { caseId: "vc_02d71651-e8bd-4f13-adee-414292781ec2" },
  },
  args: {
    promo: <TicketPromoCodeField copy={PROMO_COPY} onApply={fn()} />,
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByRole("group", { name: "Promo code" }),
    ).toBeVisible();
  },
};

/** A pass that costs nothing: Free, and no points line. */
export const Free: Story = {
  parameters: {
    verification: { caseId: "vc_8bbfd0bf-2bf4-40cb-9cb4-2249b55590e9" },
  },
  args: { lines: LINES_FREE, total: "Free", points: undefined },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getAllByText("Free")).toHaveLength(2);
  },
};
