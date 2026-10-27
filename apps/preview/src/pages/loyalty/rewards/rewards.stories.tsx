import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import {
  RewardCheckout,
  RewardMenu,
  type RewardMenuItem,
  type RewardRedemption,
  SiteHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  BALANCE_DROPPED_REWARDS,
  DROPPED_BALANCE,
  FLAKY_REWARDS,
  MEMBERSHIP_VIEW,
  RETRY_COPY,
  REWARD_CHECKOUT_COPY,
  REWARD_MENU_COPY,
  REWARDS,
  SHORT_BALANCE_COPY,
  SOLD_OUT_COPY,
  SOLD_OUT_REWARDS,
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
  const [open, setOpen] = useState(false);
  const [redemption, setRedemption] = useState<RewardRedemption | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  /* Attempts already refused on the wire — a flaky reward redeems on retry. */
  const flaked = useRef<ReadonlySet<string>>(new Set());

  /* The surface stays mounted once opened — only `open` flips — so the
   * drawer and dialog can play their exit transitions. */
  const close = () => setOpen(false);

  const redeem = () => {
    if (!selected || selected.pointCost > balance || pending) return;
    const reward = selected;
    const left = balance - reward.pointCost;
    const cost = reward.pointCost;
    setPending(true);
    setTimeout(() => {
      if (SOLD_OUT_REWARDS.has(reward.id)) {
        /* The surface closes itself on a refusal; the page raises it. */
        setPending(false);
        setFailure(SOLD_OUT_COPY.title);
        toast.error(SOLD_OUT_COPY.title, {
          description: SOLD_OUT_COPY.description,
        });
        return;
      }
      if (BALANCE_DROPPED_REWARDS.has(reward.id)) {
        /* The balance fell short elsewhere since the sheet opened; the page
         * refetches and the deficit row re-reads it. */
        setPending(false);
        setBalance(DROPPED_BALANCE);
        toast.error(SHORT_BALANCE_COPY.title, {
          description: SHORT_BALANCE_COPY.description(
            reward.pointCost - DROPPED_BALANCE,
          ),
        });
        return;
      }
      if (FLAKY_REWARDS.has(reward.id) && !flaked.current.has(reward.id)) {
        /* A retryable refusal: the surface stays open and the press stays
         * live; the page raises it as a toast. */
        flaked.current = new Set([...flaked.current, reward.id]);
        setPending(false);
        toast.error(RETRY_COPY.title, {
          description: RETRY_COPY.description,
        });
        return;
      }
      setBalance(left);
      setRedemption(
        reward.kind === "coupon"
          ? {
              balanceAfter: left,
              summary: `${cost} pts redeemed`,
              deadline: "Use by 28 Oct 2026",
              code: "G10-50-7Q2M",
              qrCode: {
                value: `g10:redeem:${reward.id}:7Q2M`,
                altText: "Show this code to store staff",
                toggleLabel: "Use now",
                caption: "Staff scan this at the counter",
              },
            }
          : {
              balanceAfter: left,
              summary: `${cost} pts redeemed`,
              deadline: "Collect by 5 Nov 2026",
              note: "Collect at any Grade10 store",
              qrCode: {
                value: `g10:collect:${reward.id}:7Q2M`,
                altText: "Show this code to store staff",
                toggleLabel: "Use now",
                caption: "Staff scan this at the counter",
              },
            },
      );
      setPending(false);
    }, 700);
  };

  const select = (rewardId: string) => {
    const reward = REWARDS.find((item) => item.id === rewardId);
    if (reward) {
      setSelected(reward);
      setRedemption(null);
      setFailure(null);
      setPending(false);
      setOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-8">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-foreground">
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
      <Toast position="bottom-right" />
      {selected ? (
        <RewardCheckout
          balance={balance}
          copy={REWARD_CHECKOUT_COPY}
          failure={failure}
          onDone={close}
          onOpenChange={(next) => {
            if (!next) close();
          }}
          onRedeem={redeem}
          open={open}
          pending={pending}
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

/** The rewards shop page. The checkout opens only when a card is pressed —
 * each sheet state is drawn under `Loyalty/Rewards/Blocks/RewardCheckout`. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Rewards" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Halloween Potatoz")).toBeInTheDocument();
    expect(
      document.body.querySelector('[data-slot="reward-checkout"]'),
    ).not.toBeInTheDocument();
  },
};

/** The reward that ran out: the sheet refuses, closes itself, and the page
 * raises the run-out toast. */
export const SoldOut: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /UV slab sleeves/ }),
    );
    const overlay = within(document.body);
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 300 pts" }),
    );
    expect(
      await overlay.findByText("This reward just ran out"),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-sheet="reward-checkout"]'),
      ).not.toBeInTheDocument(),
    );
  },
};

/** A refusal the member can retry: the toast lands and the sheet stays
 * open with the press live — nothing proceeds until the member taps
 * Redeem again themselves. */
export const RetryableFailure: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Mystery foil pack/ }),
    );
    const overlay = within(document.body);
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 800 pts" }),
    );
    expect(
      await overlay.findByText("Couldn't redeem just now"),
    ).toBeInTheDocument();
    expect(
      document.body.querySelector('[data-slot="reward-checkout"]'),
    ).toBeInTheDocument();
    expect(
      overlay.getByRole("button", { name: "Redeem for 800 pts" }),
    ).toBeEnabled();
  },
};

/** The same flaky reward, retried: the member taps Redeem again after the
 * refusal and the redeemed phase lands. */
export const RetryableFailureRecovered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Mystery foil pack/ }),
    );
    const overlay = within(document.body);
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 800 pts" }),
    );
    await overlay.findByText("Couldn't redeem just now");
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 800 pts" }),
    );
    expect(await overlay.findByText("Ready to Collect")).toBeInTheDocument();
  },
};

/** The balance fell short elsewhere since the sheet opened: the page
 * refetches, the deficit row re-reads it, and the toast says so. */
export const BalanceDropped: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Express grading voucher/ }),
    );
    const overlay = within(document.body);
    await userEvent.click(
      await overlay.findByRole("button", { name: "Redeem for 1,100 pts" }),
    );
    expect(await overlay.findByText("Not enough points")).toBeInTheDocument();
    expect(await overlay.findByText("Need 500 more pts")).toBeInTheDocument();
    expect(
      overlay.getByRole("button", { name: "Redeem for 1,100 pts" }),
    ).toBeDisabled();
  },
};
