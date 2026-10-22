import { Footer } from "@grade10/design-system/components/layout/footer";
import {
  RewardCheckout,
  RewardMenu,
  type RewardMenuItem,
  type RewardRedemption,
  SiteHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  MEMBERSHIP_VIEW,
  REWARD_CHECKOUT_COPY,
  REWARD_MENU_COPY,
  REWARDS,
} from "../loyalty-content";

const REWARDS_PAGE_COPY = {
  title: "Rewards",
  subtitle: "Swap points for coupons, collecting supplies and vault services.",
};

/**
 * The rewards shop as a store assembles it: `SiteHeader`, the page's own
 * heading, `RewardMenu`, and `RewardCheckout` over whichever card is
 * pressed. The page owns the balance, the open reward and the redemption it
 * settled; the blocks only receive them as props.
 */
function RewardsPage() {
  const [balance, setBalance] = useState(MEMBERSHIP_VIEW.balance);
  const [selected, setSelected] = useState<RewardMenuItem | null>(null);
  const [redemption, setRedemption] = useState<RewardRedemption | null>(null);

  const close = () => {
    setSelected(null);
    setRedemption(null);
  };

  const redeem = () => {
    if (!selected || selected.pointCost > balance) return;
    const left = balance - selected.pointCost;
    const cost = selected.pointCost;
    setBalance(left);
    setRedemption(
      selected.kind === "coupon"
        ? {
            balanceAfter: left,
            summary: `${cost} pts redeemed. ${left.toLocaleString("en-HK")} pts left`,
            deadline: "Use by 28 Oct 2026",
            code: "G10-50-7Q2M",
          }
        : {
            balanceAfter: left,
            summary: `${cost} pts redeemed. ${left.toLocaleString("en-HK")} pts left`,
            deadline: "Collect by 5 Nov 2026",
            note: "Collect at any Grade10 store",
          },
    );
  };

  const select = (rewardId: string) => {
    const reward = REWARDS.find((item) => item.id === rewardId);
    if (reward) setSelected(reward);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-8">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              {REWARDS_PAGE_COPY.title}
            </h1>
            <p className="text-sm text-secondary-foreground">
              {REWARDS_PAGE_COPY.subtitle}
            </p>
          </header>
          <RewardMenu
            balance={balance}
            copy={REWARD_MENU_COPY}
            onSelect={select}
            state={{ status: "ready", data: REWARDS }}
          />
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
      {selected ? (
        <RewardCheckout
          balance={balance}
          copy={REWARD_CHECKOUT_COPY}
          onDone={close}
          onOpenChange={(next) => {
            if (!next) close();
          }}
          onRedeem={redeem}
          open
          redemption={redemption ?? undefined}
          reward={selected}
          viewCouponsHref="#"
        />
      ) : null}
    </div>
  );
}

const meta = {
  title: "Loyalty/Rewards/Screens/Rewards",
  component: RewardsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RewardsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The whole walk: a card opens the sheet, the balance reads before→after,
 * the redeemed ticket carries the code, and Done returns to the shop. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Rewards" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Halloween Potatoz")).toBeInTheDocument();

    const overlay = within(document.body);
    await userEvent.click(
      canvas.getByRole("button", { name: /HK\$50 off coupon/ }),
    );
    expect(await overlay.findByText("750 pts")).toBeInTheDocument();
    await userEvent.click(
      overlay.getByRole("button", { name: "Redeem for 500 pts" }),
    );
    expect(
      await overlay.findByText("Added to your coupons"),
    ).toBeInTheDocument();
    expect(overlay.getByText("G10-50-7Q2M")).toBeInTheDocument();
    expect(
      overlay.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();
    await userEvent.click(overlay.getByRole("button", { name: "Done" }));
  },
};

/** A short balance is refused before the points go — the row reads
 * have-over-cost in the warning tone and the button disables. */
export const InsufficientBalance: Story = {
  render: () => <RewardsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Acrylic slab stand/ }),
    );
    const overlay = within(document.body);
    expect(await overlay.findByText("1,250 / 4,000 pts")).toBeInTheDocument();
    expect(
      overlay.getByRole("button", { name: "Redeem for 4,000 pts" }),
    ).toBeDisabled();
  },
};
