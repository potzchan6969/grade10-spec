import { Footer } from "@grade10/design-system/components/layout/footer";
import { CouponList, SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  COUPON_LIST_COPY,
  COUPONS,
  COUPONS_PAGE_COPY,
} from "../loyalty-content";

/**
 * The coupon wallet as a store assembles it: `SiteHeader`, the page's own
 * heading, and `CouponList`. The page owns the coupons; the block owns its
 * scan surface — a Use now press opens the till-facing code on a sheet or
 * dialog without the page knowing.
 */
function CouponsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-8">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              {COUPONS_PAGE_COPY.title}
            </h1>
            <p className="text-sm text-secondary-foreground">
              {COUPONS_PAGE_COPY.subtitle}
            </p>
          </header>
          <CouponList
            copy={COUPON_LIST_COPY}
            state={{ status: "ready", data: COUPONS }}
          />
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

/** The coupon wallet page. The scan surface opens only on a Use now press —
 * each of its states is drawn under `Loyalty/Coupons/Blocks/CouponList`. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your coupons" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    expect(
      document.body.querySelector('[data-slot="promo-qr-card"]'),
    ).not.toBeInTheDocument();
  },
};

/** Presenting a coupon at the till: Use now opens the ticket and its scan
 * card on a dialog from 640px up. */
export const PresentAtTill: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Use now" }));
    const overlay = within(document.body);
    expect(
      await overlay.findByRole("dialog", { name: "HK$50 off any order" }),
    ).toBeInTheDocument();
    const qr = document.body.querySelector('[data-slot="promo-qr-card"]');
    await waitFor(() => expect(qr).toBeVisible());
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
