import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ActiveIntakeAlert } from "./active-intake-alert";
import {
  INTAKE_TRACKER_HREF,
  INTAKE_TRACKER_STORY_ID,
  VAULT_PORTFOLIO_HREF,
} from "./vault-content";
import { navigateToStory } from "./workbench-story-nav";

/**
 * Banner beneath portfolio summary stats when intake still has open
 * submissions. Track Progress opens the intake tracker.
 */
const meta = {
  title: "Pages/Vault/Active Intake Alert",
  component: ActiveIntakeAlert,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActiveIntakeAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

function LinkedAlert({ submissionCount }: { submissionCount: number }) {
  return (
    <>
      <ActiveIntakeAlert
        submissionCount={submissionCount}
        onTrackProgress={() => navigateToStory(INTAKE_TRACKER_STORY_ID)}
      />
      <Text className="text-secondary-foreground" size="xs">
        Related:{" "}
        <Link href={VAULT_PORTFOLIO_HREF} size="xs">
          Vault Portfolio
        </Link>
        {" · "}
        <Link href={INTAKE_TRACKER_HREF} size="xs">
          Intake Tracker
        </Link>
      </Text>
    </>
  );
}

/** Two open submissions — the filled portfolio case. */
export const WithSubmissions: Story = {
  args: {
    submissionCount: 2,
    onTrackProgress: () => {},
  },
  render: () => <LinkedAlert submissionCount={2} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("2 submissions currently in intake")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Track Progress" }),
    ).toBeVisible();
    expect(canvas.getByRole("link", { name: "Vault Portfolio" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Intake Tracker" })).toBeVisible();
  },
};

/** One open submission — singular copy. */
export const SingleSubmission: Story = {
  args: {
    submissionCount: 1,
    onTrackProgress: () => {},
  },
  render: () => <LinkedAlert submissionCount={1} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1 submission currently in intake")).toBeVisible();
  },
};

/** No open intake — the alert does not render. */
export const None: Story = {
  args: {
    submissionCount: 0,
    onTrackProgress: () => {},
  },
  render: () => (
    <>
      <ActiveIntakeAlert
        submissionCount={0}
        onTrackProgress={() => navigateToStory(INTAKE_TRACKER_STORY_ID)}
      />
      <Text className="text-secondary-foreground" size="xs">
        No alert when intake is clear. Related:{" "}
        <Link href={VAULT_PORTFOLIO_HREF} size="xs">
          Vault Portfolio
        </Link>
      </Text>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("alert")).toBeNull();
    expect(canvas.queryByText(/currently in intake/)).toBeNull();
  },
};
