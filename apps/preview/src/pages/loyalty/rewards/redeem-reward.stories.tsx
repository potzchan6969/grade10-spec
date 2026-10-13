import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  type AsyncState,
  type CouponItem,
  CouponList,
  RewardMenu,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  COUPON_LIST_COPY,
  ISSUED_COUPON,
  REWARD_MENU_COPY,
  REWARDS,
} from "../loyalty-content";
import { type Check, walkCases } from "../loyalty-flow-walk";

type RewardStep = {
  balance: number;
  /** Chosen quantity per per-unit reward. */
  quantities?: Readonly<Record<string, number>>;
  /** The coupons the member holds once a redemption has issued one. */
  coupons?: AsyncState<readonly CouponItem[]>;
};

const noop = () => undefined;

const REWARD_CASES: ReadonlyArray<readonly [string, RewardStep]> = [
  ["Reward shop with points to spend", { balance: 1250 }],
  [
    "Per-unit reward at its bound",
    { balance: 1250, quantities: { sleeves: 3 } },
  ],
  ["Reward the balance cannot pay for", { balance: 300 }],
  [
    "Redeemed into one coupon",
    {
      balance: 750,
      coupons: { status: "ready", data: [ISSUED_COUPON] },
    },
  ],
];

const CHECKS: readonly Check[] = [
  (canvas) => {
    expect(canvas.getByText("HK$50 off")).toBeInTheDocument();
    expect(canvas.getByText("Grade10 card sleeves")).toBeInTheDocument();
    expect(canvas.getByText("Acrylic slab stand")).toBeInTheDocument();
    expect(canvas.getAllByText("Not enough points")).toHaveLength(1);
  },
  (canvas) => {
    expect(canvas.getByText("Maximum per redemption")).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getAllByText("Not enough points")).toHaveLength(2);
    expect(canvas.getByText("Grade10 card sleeves")).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("HK$50 off any order")).toBeInTheDocument();
    expect(canvas.getByText("GRD-50-4HVD")).toBeInTheDocument();
  },
];

const meta = {
  title: "Loyalty/Rewards/Flows/Redeem a Reward",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function RewardStepCard({ balance, quantities, coupons }: RewardStep) {
  return (
    <VStack gap="lg">
      <RewardMenu
        balance={balance}
        copy={REWARD_MENU_COPY}
        onQuantityChange={noop}
        onRedeem={noop}
        quantities={quantities}
        state={{ status: "ready", data: REWARDS }}
      />
      {coupons ? <CouponList copy={COUPON_LIST_COPY} state={coupons} /> : null}
    </VStack>
  );
}

/**
 * A member redeems a reward from the shop, and it becomes one coupon they can
 * spend. Each case is one step: what the balance can buy, a bounded quantity,
 * a reward out of reach, and the coupon the redemption issued.
 */
export const RedeemIntoCoupon: Story = {
  parameters: {
    journeys: [
      "grade10-site-loyalty-programme-US-04",
      "grade10-site-loyalty-programme-US-07",
    ],
  },
  render: () => (
    <FlowContainer
      cases={REWARD_CASES}
      description={
        <p>
          Every reward is priced in points the member holds and states what its
          coupon cannot be spent without. A reward the balance cannot pay for
          stays visible and says why. A redemption spends its points and issues
          one open coupon, which the member sees on the same page.
        </p>
      }
    >
      {(value) => <RewardStepCard {...value} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, CHECKS, () => {
      expect(
        canvasElement.querySelectorAll('[data-slot="reward-menu"]'),
      ).toHaveLength(REWARD_CASES.length);
    });
  },
};
