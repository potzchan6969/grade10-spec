import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CouponList } from "./coupon-list";
import { COUPONS } from "./fixtures";

const meta = {
  title: "Loyalty/Coupons/Blocks/CouponList",
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
      expired: "Expired",
    },
    state: {
      status: "ready",
      data: COUPONS,
    },
  },
} satisfies Meta<typeof CouponList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each coupon is a ticket: what it takes off, what it is for, its code in
 * the stub, and spent, void and expired each saying so. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("GRD-50-7Q2M")).toBeInTheDocument();
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    expect(canvas.getByText("Used")).toBeInTheDocument();
    expect(canvas.getByText("Void")).toBeInTheDocument();
    expect(canvas.getByText("Expired")).toBeInTheDocument();
    expect(canvas.getAllByRole("button", { name: "Use now" })).toHaveLength(1);
  },
};

/** The open coupon's Use now opens its scan card — a dialog from 640px up —
 * over the list, and closing hands the member back to it. */
export const ScanCard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Use now" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "HK$50 off any order" }),
    ).toBeInTheDocument();
    const qr = document.body.querySelector('[data-slot="promo-qr-card"]');
    await waitFor(() => expect(qr).toBeVisible());
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-slot="promo-qr-card"]'),
      ).not.toBeVisible(),
    );
  },
};

/** Under 640px the same press slides the scan card up as a sheet. */
export const ScanCardNarrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Use now" }));
    expect(
      document.body.querySelector('[data-sheet="coupon-scan"]'),
    ).toBeInTheDocument();
    const qr = document.body.querySelector('[data-slot="promo-qr-card"]');
    await waitFor(() => expect(qr).toBeVisible());
  },
};

/** A reward coupon carries no code: it is spent from the wallet by id, so
 * its stub reads its own expiry instead — the scan is still its way to the
 * till. */
export const Wallet: Story = {
  args: {
    state: {
      status: "ready",
      data: COUPONS.map(({ code: _code, ...coupon }) => coupon),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("GRD-50-7Q2M")).not.toBeInTheDocument();
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    expect(canvas.getByText("Used")).toBeInTheDocument();
    expect(canvas.getAllByRole("button", { name: "Use now" })).toHaveLength(1);
  },
};

/** A surface that must withhold codes masks every one with the same word —
 * and offers no scan, since the scan is the code. */
export const Masked: Story = {
  args: { masked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("GRD-50-7Q2M")).not.toBeInTheDocument();
    expect(canvas.queryByText("GRD-100-XK4P")).not.toBeInTheDocument();
    expect(canvas.getAllByText("••••••••")).toHaveLength(4);
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

export const Loading: Story = { args: { state: { status: "loading" } } };

export const Empty: Story = {
  args: {
    state: { status: "empty", message: "No coupons yet." },
  },
};
