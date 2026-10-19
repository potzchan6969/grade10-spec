import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import {
  ActivityList,
  CouponList,
  MemberPass,
  RewardMenu,
  SiteHeader,
  TierCard,
  WalletPassLinks,
  type WalletPassWallet,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  ACTIVITY_LIST_COPY,
  APPLE_HELD,
  APPLE_OFFERED,
  COUPON_LIST_COPY,
  GOOGLE_HELD,
  GOOGLE_OFFERED,
  ISSUED_COUPON,
  LOYALTY_PAY_PART_OF_BASKET_HREF,
  MEMBER,
  MEMBER_PASS_COPY,
  MEMBERSHIP_PAGE_COPY,
  MEMBERSHIP_STATE_VIEWS,
  MEMBERSHIP_VIEW,
  type MembershipView,
  REWARD_MENU_COPY,
  TIER_CARD_COPY,
  WALLET_PASS_COPY,
} from "../loyalty-content";

/** The member card's code, counting down from this many seconds. */
const CODE_SECONDS = 480;

/* The Tier & Benefits page is still being designed; until it has a workbench
   story the card's link points at a placeholder anchor. */
const TIER_AND_BENEFITS_HREF = "#tier-and-benefits";

/**
 * Membership as a store assembles it: `SiteHeader`, the membership blocks in
 * the order the manual gives them, and `Footer`. The page owns the balance,
 * the coupons a redemption issues, the wallets the member carries and the
 * codes the card has minted; the blocks only receive them as props.
 */
function MembershipPage({ view }: { view: MembershipView }) {
  const [balance, setBalance] = useState(view.balance);
  const [coupons, setCoupons] = useState(view.coupons);
  const [issued, setIssued] = useState(0);
  const [codes, setCodes] = useState(0);
  const [held, setHeld] = useState<readonly string[]>(view.heldWallets);

  const redeem = (rewardId: string, quantity: number) => {
    if (view.rewards.status !== "ready") return;
    const reward = view.rewards.data.find((item) => item.id === rewardId);
    if (!reward) return;
    const cost = reward.pointCost * quantity;
    if (cost > balance) return;
    const coupon = {
      ...ISSUED_COUPON,
      id: `coupon-issued-${issued + 1}`,
      amount: reward.name,
      description: reward.limits ?? reward.collectionWindow,
    };
    setBalance((value) => value - cost);
    setIssued((value) => value + 1);
    setCoupons((prev) => ({
      status: "ready",
      data: [...(prev.status === "ready" ? prev.data : []), coupon],
    }));
  };

  const addWallet = (id: string) =>
    setHeld((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const endWallet = (id: string) =>
    setHeld((prev) => prev.filter((walletId) => walletId !== id));

  const wallets: WalletPassWallet[] = [
    held.includes("google") ? GOOGLE_HELD : GOOGLE_OFFERED,
    held.includes("apple") ? APPLE_HELD : APPLE_OFFERED,
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-8">
          <Breadcrumbs>
            <BreadcrumbItem href="#account">
              {MEMBERSHIP_PAGE_COPY.breadcrumbAccount}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem current>
              {MEMBERSHIP_PAGE_COPY.title}
            </BreadcrumbItem>
          </Breadcrumbs>
          <h1 className="text-3xl font-bold text-foreground">
            {MEMBERSHIP_PAGE_COPY.title}
          </h1>

          <TierCard
            balance={balance.toLocaleString("en-HK")}
            copy={TIER_CARD_COPY}
            earnLine={view.earnLine}
            href={TIER_AND_BENEFITS_HREF}
            qualifyingPoints={view.qualifyingPoints}
            qualifyingThreshold={view.qualifyingThreshold}
            retentionLine={view.retentionLine}
            tier={view.tier}
            variant={view.tierVariant}
            worth={view.worth}
          />

          <section
            aria-labelledby="membership-card-heading"
            className="flex flex-col gap-4"
          >
            <h2
              className="text-xl font-semibold text-foreground"
              id="membership-card-heading"
            >
              {MEMBERSHIP_PAGE_COPY.cardHeading}
            </h2>
            <MemberPass
              copy={MEMBER_PASS_COPY}
              email={MEMBER.email}
              fallbackCode={MEMBER.fallbackCode}
              onRefresh={() => setCodes((value) => value + 1)}
              state={{ status: "live", remainingSeconds: CODE_SECONDS }}
              tier={view.tier}
              token={`${MEMBER.token}.${codes}`}
              variant={view.tierVariant}
            />
            <WalletPassLinks
              copy={WALLET_PASS_COPY}
              onAdd={addWallet}
              onEnd={endWallet}
              state={{ status: "read" }}
              wallets={wallets}
            />
          </section>

          <section
            aria-labelledby="membership-rewards-heading"
            className="flex flex-col gap-4"
          >
            <h2
              className="text-xl font-semibold text-foreground"
              id="membership-rewards-heading"
            >
              {MEMBERSHIP_PAGE_COPY.rewardsHeading}
            </h2>
            <RewardMenu
              balance={balance}
              copy={REWARD_MENU_COPY}
              onRedeem={redeem}
              state={view.rewards}
            />
          </section>

          <section
            aria-labelledby="membership-coupons-heading"
            className="flex flex-col gap-4"
          >
            <h2
              className="text-xl font-semibold text-foreground"
              id="membership-coupons-heading"
            >
              {MEMBERSHIP_PAGE_COPY.couponsHeading}
            </h2>
            <CouponList copy={COUPON_LIST_COPY} state={coupons} />
          </section>

          <section
            aria-labelledby="membership-spend-heading"
            className="flex flex-col gap-4"
          >
            <h2
              className="text-xl font-semibold text-foreground"
              id="membership-spend-heading"
            >
              {MEMBERSHIP_PAGE_COPY.spendHeading}
            </h2>
            <p className="text-sm text-secondary-foreground">
              {MEMBERSHIP_PAGE_COPY.spendBody}
            </p>
            <div>
              <Button
                render={<a href={LOYALTY_PAY_PART_OF_BASKET_HREF} />}
                size="sm"
                variant="outline"
              >
                {MEMBERSHIP_PAGE_COPY.spendAction}
              </Button>
            </div>
          </section>

          <section
            aria-labelledby="membership-activity-heading"
            className="flex flex-col gap-4"
          >
            <h2
              className="text-xl font-semibold text-foreground"
              id="membership-activity-heading"
            >
              {MEMBERSHIP_PAGE_COPY.activityHeading}
            </h2>
            <ActivityList copy={ACTIVITY_LIST_COPY} state={view.activity} />
          </section>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />
    </div>
  );
}

const meta = {
  title: "Loyalty/Membership/Screens/Membership",
  component: MembershipPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { view: MEMBERSHIP_VIEW },
} satisfies Meta<typeof MembershipPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tier, both counts, rewards, coupons and activity, on one page. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Membership" }),
    ).toBeInTheDocument();
    for (const name of [
      "Your member pass",
      "Rewards",
      "Your coupons",
      "Spend on your basket",
      "Activity",
    ]) {
      expect(
        canvas.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
    expect(canvas.getAllByText("Gold").length).toBeGreaterThan(0);
    expect(canvas.getByText("1,250")).toBeInTheDocument();
    expect(
      canvas.getByRole("progressbar", { name: "Keep Gold" }),
    ).toHaveAttribute("aria-valuenow", "320");
    expect(
      canvas.getByRole("button", { name: "Go to checkout" }),
    ).toHaveAttribute("href", LOYALTY_PAY_PART_OF_BASKET_HREF);

    await userEvent.click(canvas.getAllByRole("button", { name: "Redeem" })[0]);
    expect(canvas.getByText("750")).toBeInTheDocument();
  },
};

/** Nothing earned yet: an empty ledger, no coupons and nothing to redeem. */
export const NoPoints: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.noPoints },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("0")).toBeInTheDocument();
    expect(
      canvas.getByText(
        "No activity yet. Purchases appear here once they are recorded.",
      ),
    ).toBeInTheDocument();
    for (const control of canvas.getAllByRole("button", { name: "Redeem" })) {
      expect(control).toBeDisabled();
    }
  },
};

/** Past the threshold the bar caps at the threshold, and the count still reads true. */
export const ThresholdReached: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.thresholdReached },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("620 / 500 pts")).toBeInTheDocument();
    expect(
      canvas.getByRole("progressbar", { name: "Keep Gold" }),
    ).toHaveAttribute("aria-valuenow", "500");
  },
};

/** The rewards section holds its place while the catalog is read. */
export const RewardsLoading: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.rewardsLoading },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="reward-menu-loading"]'),
    ).not.toBeNull();
    expect(canvas.getAllByText("Gold").length).toBeGreaterThan(0);
  },
};

/** No coupon yet: the section says so and the rest of the page still reads. */
export const NoCoupons: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.noCoupons },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("You have no coupons yet. Redeem a reward to get one."),
    ).toBeInTheDocument();
    expect(canvas.getByText("1,250")).toBeInTheDocument();
  },
};

/** The card is carried in Google Wallet; the member can end that pass alone. */
export const PassAdded: Story = {
  args: { view: MEMBERSHIP_STATE_VIEWS.passAdded },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Carried in Google Wallet")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "End Google pass" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeInTheDocument();
  },
};

/** The default content at a phone width, with no horizontal page scroll. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Membership" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Go to checkout" }),
    ).toBeInTheDocument();
  },
};
