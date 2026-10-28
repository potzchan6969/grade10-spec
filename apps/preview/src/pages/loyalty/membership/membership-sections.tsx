import { Button } from "@grade10/design-system/components/forms/button";
import {
  type AsyncState,
  type CouponItem,
  CouponList,
  HowPointsWork,
  MemberPass,
  PointHistory,
  RewardMenu,
  TierCard,
  TierInfoCard,
  TierLadder,
  WalletPassLinks,
} from "@grade10/ui";
import {
  Basket,
  ClockCountdown,
  HandCoins,
  Truck,
} from "@phosphor-icons/react";
import {
  COUPON_LIST_COPY,
  HOW_POINTS_WORK,
  MEMBER,
  MEMBER_PASS_COPY,
  MEMBERSHIP_PAGE_COPY,
  type MembershipView,
  POINT_HISTORY_COPY,
  REWARD_MENU_COPY,
  TIER_BENEFITS,
  TIER_BENEFITS_PAGE_COPY,
  TIER_CARD_COPY,
  TIER_LADDER_COPY,
  WALLET_PASS_COPY,
} from "../loyalty-content";

/** The membership page's sections, keyed for the sidebar's swap. */
type MembershipTab = "overview" | "rewards" | "coupons" | "points";

const MEMBERSHIP_TABS: readonly { id: MembershipTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "rewards", label: MEMBERSHIP_PAGE_COPY.rewardsHeading },
  { id: "coupons", label: "Coupons" },
  { id: "points", label: MEMBERSHIP_PAGE_COPY.pointHistoryHeading },
];

/** The mark each mechanic row wears, keyed to the content's row ids. */
const HOW_POINTS_WORK_ICONS = {
  earn: <Basket size={20} weight="regular" />,
  pending: <Truck size={20} weight="regular" />,
  spend: <HandCoins size={20} weight="regular" />,
  expiry: <ClockCountdown size={20} weight="regular" />,
} as const;

/** A pane's heading — the section name the nav item names. */
function PaneHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 className="text-xl font-semibold text-foreground" id={id}>
      {children}
    </h2>
  );
}

type WalletProps = {
  heldWallets: readonly string[];
  onAddWallet: (id: string) => void;
  onEndWallet: (id: string) => void;
};

/** The member pass's code counts down from this many seconds. */
const CODE_SECONDS = 480;

/**
 * Overview — the tier card, the spend-on-basket note with its top-up
 * entrance, and the Tiers & Benefits list.
 */
function OverviewPane({
  view,
  balance,
}: {
  view: MembershipView;
  balance: number;
}) {
  return (
    <>
      <TierCard
        balance={balance.toLocaleString("en-HK")}
        copy={TIER_CARD_COPY}
        earnLine={view.earnLine}
        href={TIERS_TAB_HREF}
        qualifyingPoints={view.qualifyingPoints}
        qualifyingThreshold={view.qualifyingThreshold}
        retentionLine={view.retentionLine}
        tier={view.tier}
        variant={view.tierVariant}
        worth={view.worth}
      />
      <div className="flex">
        <Button render={<a href="#top-up" />} size="sm" variant="outline">
          {MEMBERSHIP_PAGE_COPY.topUpAction}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <PaneHeading id="membership-tiers-heading">
          {TIER_BENEFITS_PAGE_COPY.title}
        </PaneHeading>
        <TiersBenefitsPane
          heldTier={view.tier}
          qualifyingPoints={view.qualifyingPoints}
          qualifyingTarget={view.qualifyingThreshold}
        />
      </div>
    </>
  );
}

/** The card's Benefits affordance scrolls to the Tiers & Benefits section. */
const TIERS_TAB_HREF = "#membership-tiers-heading";

/** Rewards — the catalog, with the second top-up entrance beside it. */
function RewardsPane({
  view,
  balance,
  onSelect,
}: {
  view: MembershipView;
  balance: number;
  onSelect: (rewardId: string) => void;
}) {
  return (
    <section
      aria-labelledby="membership-rewards-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-4">
        <PaneHeading id="membership-rewards-heading">
          {MEMBERSHIP_PAGE_COPY.rewardsHeading}
        </PaneHeading>
        <Button render={<a href="#top-up" />} size="sm" variant="outline">
          {MEMBERSHIP_PAGE_COPY.topUpAction}
        </Button>
      </div>
      <RewardMenu
        balance={balance}
        copy={REWARD_MENU_COPY}
        onSelect={onSelect}
        state={view.rewards}
      />
    </section>
  );
}

/** Coupons — every coupon the member holds; spent ones leave the list. */
function CouponsPane({
  coupons,
}: {
  coupons: AsyncState<readonly CouponItem[]>;
}) {
  return (
    <section
      aria-labelledby="membership-coupons-heading"
      className="flex flex-col gap-4"
    >
      <PaneHeading id="membership-coupons-heading">
        {MEMBERSHIP_PAGE_COPY.couponsHeading}
      </PaneHeading>
      {/* Spent coupons leave the section — there is nothing left to
       * spend; history lives elsewhere. */}
      <CouponList
        copy={COUPON_LIST_COPY}
        state={
          coupons.status === "ready"
            ? {
                status: "ready",
                data: coupons.data.filter(
                  (coupon) => coupon.status !== "spent",
                ),
              }
            : coupons
        }
      />
    </section>
  );
}

/** Points history — the member's own ledger with its totals. */
function PointHistoryPane({ view }: { view: MembershipView }) {
  return (
    <section
      aria-labelledby="membership-point-history-heading"
      className="flex flex-col gap-4"
    >
      <PaneHeading id="membership-point-history-heading">
        {MEMBERSHIP_PAGE_COPY.pointHistoryHeading}
      </PaneHeading>
      <PointHistory
        copy={POINT_HISTORY_COPY}
        state={view.ledger}
        summary={view.ledgerTotals}
      />
    </section>
  );
}

/**
 * Tiers & benefits — the ladder, one card per rung and How Points Work. The
 * same composition the standalone Tiers & Benefits screen draws.
 */
function TiersBenefitsPane({
  heldTier,
  qualifyingPoints,
  qualifyingTarget,
}: {
  heldTier: string;
  qualifyingPoints: number;
  qualifyingTarget: number;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section
        aria-label={TIER_BENEFITS_PAGE_COPY.title}
        className="flex flex-col gap-4"
      >
        <TierLadder
          copy={TIER_LADDER_COPY}
          currentTier={heldTier}
          qualifyingPoints={qualifyingPoints}
          qualifyingTarget={qualifyingTarget}
          rungs={TIER_BENEFITS.map((row) => ({
            tier: row.tier,
            caption: row.ladderCaption,
            invitationOnly: row.invitationOnly,
          }))}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          {TIER_BENEFITS.map((row) => (
            <TierInfoCard
              benefits={[...row.benefits]}
              caption={row.caption}
              currentTier={row.tier === heldTier}
              key={row.id}
              tier={row.tier}
            />
          ))}
        </div>
      </section>
      <section
        aria-labelledby="how-points-work-heading"
        className="flex flex-col gap-3"
      >
        <h2
          className="text-sm font-semibold uppercase text-secondary-foreground"
          id="how-points-work-heading"
        >
          {HOW_POINTS_WORK.heading}
        </h2>
        <HowPointsWork
          items={HOW_POINTS_WORK.rows.map((row) => ({
            icon: HOW_POINTS_WORK_ICONS[row.id],
            title: row.title,
            body: row.body,
          }))}
        />
      </section>
    </div>
  );
}

/** The pass presented on its own — the Google and Apple wallet links ride
 * inside it. This is what the Member pass button's overlay carries. */
function MemberPassOverlay({
  view,
  codeGeneration,
  onRefreshCode,
  walletProps,
}: {
  view: MembershipView;
  codeGeneration: number;
  onRefreshCode: () => void;
  walletProps: WalletProps;
}) {
  return (
    <MemberPass
      className="max-w-(--container-sm)"
      copy={MEMBER_PASS_COPY}
      email={MEMBER.email}
      onRefresh={onRefreshCode}
      state={{ remainingSeconds: CODE_SECONDS }}
      tier={view.tier}
      token={`${MEMBER.token}.${codeGeneration}`}
      variant={view.tierVariant}
    >
      <WalletPassLinks
        copy={WALLET_PASS_COPY}
        onAdd={walletProps.onAddWallet}
        onEnd={walletProps.onEndWallet}
        state={{ status: "read" }}
        /* The wallets stay hidden until the Apple and Google issuers are
         * registered — the PRD carries the rule, no launch date is set. */
        wallets={[]}
      />
    </MemberPass>
  );
}

export {
  CouponsPane,
  MEMBERSHIP_TABS,
  MemberPassOverlay,
  type MembershipTab,
  OverviewPane,
  PointHistoryPane,
  RewardsPane,
  TiersBenefitsPane,
};
