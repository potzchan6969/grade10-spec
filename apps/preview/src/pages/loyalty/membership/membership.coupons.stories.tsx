import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  COUPONS,
  MEMBERSHIP_STATE_VIEWS,
  MEMBERSHIP_VIEW,
} from "../loyalty-content";
import { MembershipPage } from "./membership-page";

const meta = {
  title: "Loyalty/Membership/Screens/Membership/Coupons",
  component: MembershipPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { view: MEMBERSHIP_VIEW, tab: "coupons" },
} satisfies Meta<typeof MembershipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The member's coupons under the same Available / Used & Expired ledger
 * the Coupons screen draws: open coupons with their amount, scope and
 * expiry, the record under the second tab. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Your Coupons" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    expect(canvas.getByText("Online only")).toBeInTheDocument();
    /* The upsell sits under Available, as on the Coupons screen. */
    expect(canvas.getByText("Want more coupons?")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Used & Expired" }));
    expect(await canvas.findByText(/Used on/)).toBeInTheDocument();
    expect(canvas.getByText(/Expired 1 May 2026/)).toBeInTheDocument();
    /* Settle back on the state this story is about. */
    await userEvent.click(canvas.getByRole("tab", { name: "Available" }));
  },
};

/** No coupon yet: no tabs to flip between, just the wallet's empty
 * state — the rest of the page still reads. */
export const NoCoupons: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.noCoupons },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("tab")).not.toBeInTheDocument();
    expect(canvas.getByText("No coupons yet")).toBeInTheDocument();
  },
};

/** Everything spendable is spent or lapsed: Available falls back to its
 * own empty line while the history tab holds the record. */
export const AvailableEmpty: Story = {
  args: {
    view: {
      ...MEMBERSHIP_VIEW,
      coupons: {
        status: "ready",
        data: COUPONS.filter((coupon) => coupon.status !== "open"),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing to use yet")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Used & Expired" }));
    expect(await canvas.findByText(/Used on/)).toBeInTheDocument();
    expect(
      canvas.queryByText("No used or expired coupons"),
    ).not.toBeInTheDocument();
    /* Settle back on the state this story is about. */
    await userEvent.click(canvas.getByRole("tab", { name: "Available" }));
  },
};

/** A fresh wallet with only live coupons: Used & Expired is offered and
 * answers with its own empty line. */
export const HistoryEmpty: Story = {
  args: {
    view: {
      ...MEMBERSHIP_VIEW,
      coupons: {
        status: "ready",
        data: COUPONS.filter((coupon) => coupon.status === "open"),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Used & Expired" }));
    expect(
      await canvas.findByText("No used or expired coupons"),
    ).toBeInTheDocument();
    expect(
      within(
        canvas.getByRole("tabpanel", { name: "Used & Expired" }),
      ).queryByText("Want more coupons?"),
    ).not.toBeInTheDocument();
  },
};
