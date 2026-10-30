import { Alert } from "@grade10/design-system/components/display/alert";
import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { type CouponItem, CouponList, SiteHeader } from "@grade10/ui";
import { Gift } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { storyHref } from "../../workbench-story-nav";
import { CouponTabs, isOpen } from "../coupon-tabs";
import {
  COUPON_LIST_COPY,
  COUPON_PROMO_COPY,
  COUPONS,
  COUPONS_PAGE_COPY,
} from "../loyalty-content";

const REWARDS_HREF = storyHref("loyalty-rewards-screens-rewards--default");

/** The upsell under Available: points still buy more coupons. */
const couponPromo = (
  <Alert
    actions={
      <Button render={<a href={REWARDS_HREF} />} size="sm" variant="secondary">
        {COUPON_PROMO_COPY.cta}
      </Button>
    }
    description={COUPON_PROMO_COPY.description}
    dismissible={false}
    icon={<Gift aria-hidden />}
    title={COUPON_PROMO_COPY.title}
  />
);

/**
 * The coupon wallet as a store assembles it: `SiteHeader`, the page's own
 * heading, the Available / Used & Expired tabs, and `CouponList`. The page
 * owns the coupons and the partition; the block owns its scan surface — a
 * Use now press opens the till-facing code on a sheet or dialog without the
 * page knowing.
 */
function CouponsPage({ coupons = COUPONS }: { coupons?: CouponItem[] }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-8">
          <h1 className="text-3xl font-semibold text-foreground">
            {COUPONS_PAGE_COPY.title}
          </h1>
          {coupons.length === 0 ? (
            /* Nothing to part — the wallet's own empty state stands for the
             * whole page, no tab bar. */
            <CouponList
              copy={COUPON_LIST_COPY}
              state={{
                status: "empty",
                message: COUPONS_PAGE_COPY.noCoupons,
                description: COUPONS_PAGE_COPY.noCouponsDescription,
              }}
            />
          ) : (
            <CouponTabs coupons={coupons} promo={couponPromo} />
          )}
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Loyalty/Coupons/Screens/Coupons",
  component: CouponsPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-loyalty-programme-US-11"],
  },
} satisfies Meta<typeof CouponsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The coupon wallet: Available holds what can still be spent, Used &
 * Expired holds the rest — each saying its own line. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Coupons" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    /* The upsell sits under Available, not on the history tab. */
    expect(canvas.getByText("Want more coupons?")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Browse Rewards" }),
    ).toBeInTheDocument();
    /* Inside its last 14 days the Use by line reads emphasised; an
     * unflagged coupon's reads plainly. */
    expect(canvas.getByText(/Use by 8 Nov 2026/)).toHaveClass(
      "text-accent-foreground",
      "font-medium",
    );
    expect(canvas.getByText(/Use by 15 Jan 2027/)).toHaveClass(
      "text-secondary-foreground",
    );
    expect(canvas.queryByText(/Used on/)).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Used & Expired" }));
    /* The upsell is Available's alone — history shows no promo. */
    expect(
      within(
        canvas.getByRole("tabpanel", { name: "Used & Expired" }),
      ).queryByText("Want more coupons?"),
    ).not.toBeInTheDocument();
    expect(await canvas.findByText(/Used on/)).toBeInTheDocument();
    expect(canvas.getByText(/Void/)).toBeInTheDocument();
    expect(canvas.getByText(/Expired 1 May 2026/)).toBeInTheDocument();
    expect(
      document.body.querySelector('[data-slot="promo-qr-card"]'),
    ).not.toBeInTheDocument();
    /* Settle back on the state this story is about. */
    await userEvent.click(canvas.getByRole("tab", { name: "Available" }));
  },
};

/** Presenting a coupon at the till: Use now opens the ticket and its scan
 * card on a dialog from 640px up. */
export const PresentAtTill: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Use now" }));
    const overlay = within(document.body);
    expect(await overlay.findByRole("dialog")).toBeInTheDocument();
    const qr = document.body.querySelector('[data-slot="promo-qr-card"]');
    await waitFor(() => expect(qr).toBeVisible());
    /* The surface's ticket carries no Use now of its own — the card is
     * already unfolded. */
    expect(
      overlay.queryByRole("button", { name: "Use now" }),
    ).not.toBeInTheDocument();
  },
};

/** A member with no coupons at all: no tabs to flip between, just the
 * wallet's empty state. */
export const NoCoupons: Story = {
  args: { coupons: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("tab")).not.toBeInTheDocument();
    expect(canvas.getByText("No coupons yet")).toBeInTheDocument();
  },
};

/** Everything spendable is spent or lapsed: Available falls back to its
 * own empty line — the upsell yields to it — while the history tab holds
 * the record. */
export const AvailableEmpty: Story = {
  args: { coupons: COUPONS.filter((coupon) => !isOpen(coupon)) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing to use yet")).toBeInTheDocument();
    /* `CouponList` draws the promo only when the list is ready; an empty
     * Available keeps its own surface. */
    expect(canvas.queryByText("Want more coupons?")).not.toBeInTheDocument();
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
  args: { coupons: COUPONS.filter(isOpen) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Used & Expired" }));
    expect(
      await canvas.findByText("No used or expired coupons"),
    ).toBeInTheDocument();
    /* The promo stays with Available, not with history's empty line. */
    expect(
      within(
        canvas.getByRole("tabpanel", { name: "Used & Expired" }),
      ).queryByText("Want more coupons?"),
    ).not.toBeInTheDocument();
  },
};

/** The same page at a phone width: Use now slides the scan card up as a
 * bottom sheet. */
export const Narrow: Story = {
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
