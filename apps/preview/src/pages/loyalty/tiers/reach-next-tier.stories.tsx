import { formatDay } from "@grade10/date";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { MembershipSummary, type MembershipSummaryProps } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  BALANCE_EXPIRES_LATER,
  balanceExpiryProp,
  MEMBERSHIP_SUMMARY_COPY,
  MEMBERSHIP_VIEW,
} from "../loyalty-content";
import { type Check, walkCases } from "../loyalty-flow-walk";

const GOLD_UNTIL = MEMBERSHIP_VIEW.renewalDate;
const SILVER_AFTER_GOLD_ENDED = formatDay(Date.UTC(2028, 2, 1));

const SUMMARY: MembershipSummaryProps = {
  copy: MEMBERSHIP_SUMMARY_COPY,
  tier: "Silver",
  balance: 800,
  qualifyingPoints: 300,
  qualifyingThreshold: 500,
  renewalDate: GOLD_UNTIL,
  tierValidity: "Silver. Earn 500 points in twelve months to reach Gold.",
  balanceExpiry: balanceExpiryProp(800, BALANCE_EXPIRES_LATER),
};

/** The earned tier as the Membership summary states it, one step at a time. */
const TIER_CASES: ReadonlyArray<readonly [string, MembershipSummaryProps]> = [
  ["Silver, progress toward Gold", SUMMARY],
  [
    "Gold reached at 500 points",
    {
      ...SUMMARY,
      tier: "Gold",
      balance: 1000,
      balanceExpiry: balanceExpiryProp(1000, BALANCE_EXPIRES_LATER),
      qualifyingPoints: 500,
      tierValidity: `Gold until ${GOLD_UNTIL}. Keep it with 500 points earned in that period.`,
    },
  ],
  [
    "Points spent, progress unchanged",
    {
      ...SUMMARY,
      tier: "Gold",
      balance: 500,
      balanceExpiry: balanceExpiryProp(500, BALANCE_EXPIRES_LATER),
      qualifyingPoints: 500,
      tierValidity: `Gold until ${GOLD_UNTIL}. Keep it with 500 points earned in that period.`,
    },
  ],
  [
    "Gold period ends short of 500",
    {
      ...SUMMARY,
      tier: "Silver",
      qualifyingPoints: 480,
      renewalDate: SILVER_AFTER_GOLD_ENDED,
      tierValidity: "Silver. Gold ended on 480 points, short of 500.",
    },
  ],
  [
    "Black by invitation",
    {
      ...SUMMARY,
      tier: "Black",
      balance: 1900,
      balanceExpiry: balanceExpiryProp(1900, BALANCE_EXPIRES_LATER),
      qualifyingPoints: 900,
      tierValidity:
        "Black by invitation, until it is revoked. Earns 1.7× points.",
    },
  ],
];

const CHECKS: readonly Check[] = [
  (canvas) => {
    expect(canvas.getByText("Silver")).toBeInTheDocument();
    expect(canvas.getByText("300 / 500")).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("Gold")).toBeInTheDocument();
    expect(canvas.getByText("500 / 500")).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("500")).toBeInTheDocument();
    expect(canvas.getByText("500 / 500")).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("Silver")).toBeInTheDocument();
    expect(canvas.getByText("480 / 500")).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("Black")).toBeInTheDocument();
    expect(canvas.getByText("900 / 500")).toBeInTheDocument();
  },
];

const meta = {
  title: "Loyalty/Tiers/Flows/Reach the Next Tier",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A member earns toward Gold, reaches it, spends points and keeps it, or lets
 * the period end short. Each case is the Membership summary in one of those
 * states; spending moves the balance and leaves the progress where it was.
 */
export const EarnToTier: Story = {
  parameters: {
    journeys: ["grade10-site-loyalty-programme-US-01"],
  },
  render: () => (
    <FlowContainer
      cases={TIER_CASES}
      description={
        <p>
          Tier progress is the points the member earned in the period, not the
          balance. Reaching 500 points holds Gold until the period ends.
          Spending takes from the balance and leaves progress alone. A period
          that ends short of 500 drops the member to the highest tier they still
          hold.
        </p>
      }
    >
      {(summary) => (
        <VStack gap="lg">
          <MembershipSummary {...summary} />
        </VStack>
      )}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, CHECKS, () => {
      expect(
        canvasElement.querySelectorAll('[data-slot="membership-summary"]'),
      ).toHaveLength(TIER_CASES.length);
    });
  },
};
