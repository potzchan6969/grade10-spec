import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
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
      spent: "Used",
      void: "Void",
      scanTitle: "Use Coupon",
    },
    state: {
      status: "ready",
      data: COUPONS,
    },
  },
} satisfies Meta<typeof CouponList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each coupon is a ticket: an open one carries its code and a Use by line,
 * an online-only one names its scope and offers no scan, a spent or void
 * one says its own line in the detail's place, and an expired one reads
 * its expiry — which already says so. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("GRD-50-7Q2M")).toBeInTheDocument();
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    expect(canvas.getAllByText(/Use by/).length).toBeGreaterThan(0);
    /* Online only: names its scope, never a Use now — no member holds out a
     * code the sale refuses. */
    expect(canvas.getByText("Online only")).toBeInTheDocument();
    expect(canvas.getByText(/Used on/)).toBeInTheDocument();
    expect(
      canvas.getByText(/Void 30 Jun 2026\. Points returned/),
    ).toBeInTheDocument();
    expect(canvas.getByText(/Expired 1 May/)).toBeInTheDocument();
    expect(canvas.getAllByRole("button", { name: "Use now" })).toHaveLength(1);
  },
};

/** The open coupon's Use now opens its scan card — a dialog from 640px up —
 * over the list, and closing hands the member back to it. */
export const ScanCoupon: Story = {
  /* The consumer's cue to refetch: open reports the coupon, close reports
   * it again — by then a scanned one may have been spent at the till. */
  args: { onScanOpenChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Use now" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(args.onScanOpenChange).toHaveBeenLastCalledWith(
      true,
      expect.objectContaining({ id: "coupon-open" }),
    );
    const overlay = within(document.body);
    /* The dialog's header reads "Use Coupon" — the ticket inside already
     * names the coupon itself. */
    const dialog = await overlay.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Use Coupon" }),
    ).toBeInTheDocument();
    const qr = document.body.querySelector('[data-slot="promo-qr-card"]');
    await waitFor(() => expect(qr).toBeVisible());
    expect(
      overlay.queryByRole("button", { name: "Use now" }),
    ).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-slot="promo-qr-card"]'),
      ).not.toBeVisible(),
    );
    expect(args.onScanOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ id: "coupon-open" }),
    );
  },
};

/** Under 640px the same press slides the scan card up as a sheet. */
export const ScanCouponNarrow: Story = {
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

/** A coupon whose consumer never passes a code — a reward coupon spends
 * from the wallet by id — reads its stub as its amount, and its scan is
 * still its way to the till. */
export const Codeless: Story = {
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
    expect(canvas.getByText(/Used on/)).toBeInTheDocument();
    expect(canvas.getAllByRole("button", { name: "Use now" })).toHaveLength(1);
  },
};

/** Three skeleton tickets while the wallet resolves. */
export const Loading: Story = {
  args: { state: { status: "loading" } },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelectorAll("[data-slot='coupon-list-loading']")
        .length,
    ).toBe(1);
  },
};

/** The empty wallet names itself and says how to fill it. */
export const Empty: Story = {
  args: {
    state: {
      status: "empty",
      message: "No coupons yet",
      description: "Coupons you earn or get from the shop appear here.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No coupons yet")).toBeInTheDocument();
    expect(
      canvas.getByText("Coupons you earn or get from the shop appear here."),
    ).toBeInTheDocument();
  },
};
