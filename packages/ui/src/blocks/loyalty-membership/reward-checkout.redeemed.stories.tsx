import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { REWARDS } from "./fixtures";
import { RewardCheckout, type RewardCheckoutProps } from "./reward-checkout";
import { checkoutMeta, sheet } from "./reward-checkout.story-fixtures";
import type { RewardRedemption } from "./types";

const [ITEM, COUPON] = REWARDS;

/** The redeemed phase: the ticket, the folded scan QR, the out actions. */
const meta = {
  title: "Loyalty/Rewards/Blocks/RewardCheckout/Redeemed",
  component: RewardCheckout,
  ...checkoutMeta,
} satisfies Meta<typeof RewardCheckout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The redeemed coupon ticket carries the unique code the redemption minted
 * and folds its scan QR behind Use now; no Apply — that belongs to the
 * cart. */
export const RedeemedCoupon: Story = {
  args: {
    reward: COUPON,
    redemption: {
      balanceAfter: 750,
      summary: "500 pts redeemed. 750 pts left",
      deadline: "Use by 28 Oct 2026",
      code: "G10-50-7Q2M",
      qrCode: {
        value: "g10:redeem:reward-voucher-50:7Q2M",
        altText: "Show this code to store staff",
        toggleLabel: "Use now",
      },
    },
  },
  play: async ({ args }) => {
    const canvas = sheet();
    expect(canvas.getByText("Added to your coupons")).toBeInTheDocument();
    expect(
      canvas.getByText("500 pts redeemed. 750 pts left"),
    ).toBeInTheDocument();
    expect(canvas.getByText("G10-50-7Q2M")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();

    // The QR stays folded until the member asks.
    const qr = document.body.querySelector('[data-slot="promo-ticket-qr"]');
    expect(qr).not.toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Use now" }));
    await waitFor(() => expect(qr).toBeVisible());

    await userEvent.click(canvas.getByRole("button", { name: "Done" }));
    expect(args.onDone).toHaveBeenCalled();
    expect(
      canvas.getByRole("button", { name: "View Coupons" }),
    ).toHaveAttribute("href", "#coupons");
  },
};

/** The redeemed good's ticket names the collection under a storefront mark
 * — no code — and folds its collection QR behind Use now. */
export const RedeemedItem: Story = {
  args: {
    reward: ITEM,
    redemption: {
      balanceAfter: 1150,
      summary: "100 pts redeemed. 1,150 pts left",
      deadline: "Collect by 5 Nov 2026",
      note: "Collect at any Grade10 store",
      qrCode: {
        value: "g10:collect:reward-halloween-potatoz:7Q2M",
        altText: "Show this code to store staff",
        toggleLabel: "Use now",
      },
    },
  },
  play: async () => {
    const canvas = sheet();
    expect(canvas.getByText("Ready to Collect")).toBeInTheDocument();
    expect(canvas.getByText("Collect by 5 Nov 2026")).toBeInTheDocument();
    expect(
      canvas.getByText("Collect at any Grade10 store"),
    ).toBeInTheDocument();
    expect(canvas.queryByText("G10-50-7Q2M")).not.toBeInTheDocument();

    const qr = document.body.querySelector('[data-slot="promo-ticket-qr"]');
    expect(qr).not.toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Use now" }));
    await waitFor(() => expect(qr).toBeVisible());
  },
};

/** The whole spend: press Redeem, the ticket lands with its folded QR;
 * unfold it, and when the till settles the ticket mutes to used — the QR
 * is gone because there is nothing left to scan. */
export const UsedAfterScan: Story = {
  args: { reward: COUPON },
  render: function ScanToUsed(args: RewardCheckoutProps) {
    const [pending, setPending] = useState(false);
    const [redemption, setRedemption] = useState<RewardRedemption | null>(null);
    const timer = useRef<number | null>(null);

    useEffect(
      () => () => {
        if (timer.current != null) window.clearTimeout(timer.current);
      },
      [],
    );

    /* The member redeems; a beat after the ticket lands the till settles
     * the scan, and the redemption the surface holds turns used. */
    const redeem = () => {
      setPending(true);
      timer.current = window.setTimeout(() => {
        setPending(false);
        setRedemption({
          balanceAfter: 750,
          summary: "500 pts redeemed. 750 pts left",
          deadline: "Use by 28 Oct 2026",
          code: "G10-50-7Q2M",
          qrCode: {
            value: "g10:redeem:reward-voucher-50:7Q2M",
            altText: "Show this code to store staff",
            toggleLabel: "Use now",
          },
        });
        timer.current = window.setTimeout(
          () =>
            setRedemption({
              balanceAfter: 750,
              summary: "500 pts redeemed. 750 pts left",
              deadline: "Use by 28 Oct 2026",
              code: "G10-50-7Q2M",
              usedLabel: "Used on 12 Oct 2026",
            }),
          4000,
        );
      }, 700);
    };

    return (
      <RewardCheckout
        {...args}
        onRedeem={redeem}
        pending={pending}
        redemption={redemption ?? undefined}
      />
    );
  },
  play: async () => {
    const canvas = sheet();
    await userEvent.click(
      canvas.getByRole("button", { name: "Redeem for 500 pts" }),
    );
    await waitFor(() =>
      expect(canvas.getByText("Added to your coupons")).toBeInTheDocument(),
    );

    // Fresh ticket: the code shows, the QR waits folded behind Use now.
    expect(canvas.getByText("G10-50-7Q2M")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Use now" }));
    const qr = document.body.querySelector('[data-slot="promo-ticket-qr"]');
    await waitFor(() => expect(qr).toBeVisible());

    // The till settles: the ticket mutes to used and the scan is gone.
    await waitFor(
      () => expect(canvas.getByText("Used on 12 Oct 2026")).toBeInTheDocument(),
      { timeout: 5000 },
    );
    // The use-by line goes with it — a spent coupon has nothing left to time.
    expect(canvas.queryByText("Use by 28 Oct 2026")).not.toBeInTheDocument();
    const ticket = document.body.querySelector('[data-slot="promo-ticket"]');
    expect(ticket).toHaveAttribute("aria-disabled", "true");
    expect(canvas.getByText("G10-50-7Q2M")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Use now" }),
    ).not.toBeInTheDocument();
  },
};
