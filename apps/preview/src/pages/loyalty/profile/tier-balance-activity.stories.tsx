import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  type ActivityEntry,
  ActivityList,
  type AsyncState,
  MembershipSummary,
  type MembershipSummaryProps,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  ACTIVITY,
  ACTIVITY_LIST_COPY,
  BALANCE_EXPIRES_LATER,
  BALANCE_EXPIRES_SOON,
  balanceExpiryProp,
  MEMBERSHIP_SUMMARY_COPY,
  MEMBERSHIP_VIEW,
} from "../loyalty-content";
import { type Check, walkCases } from "../loyalty-flow-walk";

type ProfileStep = {
  summary: MembershipSummaryProps;
  activity: AsyncState<readonly ActivityEntry[]>;
};

const READY: AsyncState<readonly ActivityEntry[]> = {
  status: "ready",
  data: ACTIVITY,
};

const SUMMARY: MembershipSummaryProps = {
  copy: MEMBERSHIP_SUMMARY_COPY,
  tier: MEMBERSHIP_VIEW.tier,
  balance: MEMBERSHIP_VIEW.balance,
  qualifyingPoints: MEMBERSHIP_VIEW.qualifyingPoints,
  qualifyingThreshold: MEMBERSHIP_VIEW.qualifyingThreshold,
  renewalDate: MEMBERSHIP_VIEW.renewalDate,
  tierValidity: MEMBERSHIP_VIEW.tierValidity,
  balanceExpiry: balanceExpiryProp(1250, BALANCE_EXPIRES_LATER),
};

/** The Membership section and the activity list, one step per state. */
const PROFILE_CASES: ReadonlyArray<readonly [string, ProfileStep]> = [
  ["Two counts and activity", { summary: SUMMARY, activity: READY }],
  [
    "Expiry inside thirty days",
    {
      summary: {
        ...SUMMARY,
        balanceExpiry: balanceExpiryProp(1250, BALANCE_EXPIRES_SOON),
      },
      activity: READY,
    },
  ],
  [
    "Activity still loading",
    { summary: SUMMARY, activity: { status: "loading" } },
  ],
  [
    "No activity yet",
    {
      summary: {
        ...SUMMARY,
        balance: 0,
        qualifyingPoints: 0,
        balanceExpiry: undefined,
      },
      activity: {
        status: "empty",
        message:
          "No activity yet. Purchases appear here once they are recorded.",
      },
    },
  ],
];

const CHECKS: readonly Check[] = [
  (canvas) => {
    expect(canvas.getByText("Gold")).toBeInTheDocument();
    expect(canvas.getByText("1250")).toBeInTheDocument();
    expect(canvas.getByText("Purchase")).toBeInTheDocument();
    expect(canvas.getByText("Membership programme")).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText(/points expire on/).className).toContain(
      "text-warning",
    );
  },
  (canvas) => {
    expect(canvas.getByText("Gold")).toBeInTheDocument();
    expect(canvas.queryByText("Purchase")).not.toBeInTheDocument();
  },
  (canvas) => {
    expect(
      canvas.getByText(
        "No activity yet. Purchases appear here once they are recorded.",
      ),
    ).toBeInTheDocument();
  },
];

const meta = {
  title: "Loyalty/Profile/Flows/Tier, Balance and Activity",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ProfileStepCard({ summary, activity }: ProfileStep) {
  return (
    <VStack gap="lg">
      <MembershipSummary {...summary} />
      <ActivityList copy={ACTIVITY_LIST_COPY} state={activity} />
    </VStack>
  );
}

/**
 * The member's tier, both counts and what they did, on one surface. Each case
 * is one state of the page; a section that is still loading or empty never
 * hides the balance beside it.
 */
export const OneSurface: Story = {
  parameters: {
    journeys: [
      "grade10-site-loyalty-programme-US-01",
      "grade10-site-loyalty-programme-US-04",
      "grade10-site-loyalty-programme-US-08",
      "grade10-site-store-membership-US-03",
    ],
  },
  render: () => (
    <FlowContainer
      cases={PROFILE_CASES}
      description={
        <p>
          The member reads the tier, the points to spend and the points earned
          this year as two counts, never summed. The expiry line names the day
          the balance lapses, and warns inside thirty days. Each activity entry
          names where it came from. A loading or empty activity list leaves the
          balance on screen.
        </p>
      }
    >
      {(value) => <ProfileStepCard {...value} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, CHECKS, (canvas) => {
      expect(
        canvas.getAllByRole("progressbar", {
          name: "Points earned this year",
        }),
      ).toHaveLength(PROFILE_CASES.length);
    });
  },
};
