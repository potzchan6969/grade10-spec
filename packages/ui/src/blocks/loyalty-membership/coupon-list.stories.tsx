import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { CouponList } from "./coupon-list";
import { COUPONS } from "./fixtures";

const meta = {
  title: "Loyalty Membership/CouponList",
  component: CouponList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: {
      label: "My coupons",
      maskedCode: "••••••••",
      spent: "Used",
      void: "Void",
    },
    state: {
      status: "ready",
      data: COUPONS.map((coupon) =>
        coupon.status === "open"
          ? {
              ...coupon,
              action: (
                <Button onClick={fn()} size="sm" variant="outline">
                  Copy code
                </Button>
              ),
            }
          : coupon,
      ),
    },
  },
} satisfies Meta<typeof CouponList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open, spent, and void each say so; the action slot rides only where the
 * consumer put one. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("GRD-50-7Q2M")).toBeInTheDocument();
    expect(canvas.getByText("Used")).toBeInTheDocument();
    expect(canvas.getByText("Void")).toBeInTheDocument();
    expect(canvas.getAllByRole("button", { name: "Copy code" })).toHaveLength(
      1,
    );
  },
};

/** A surface that must withhold codes masks every one with the same word. */
export const Masked: Story = {
  args: { masked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("GRD-50-7Q2M")).not.toBeInTheDocument();
    expect(canvas.queryByText("GRD-100-XK4P")).not.toBeInTheDocument();
    expect(canvas.getAllByText("••••••••")).toHaveLength(3);
  },
};

export const Loading: Story = { args: { state: { status: "loading" } } };

export const Empty: Story = {
  args: {
    state: { status: "empty", message: "No coupons yet." },
  },
};
