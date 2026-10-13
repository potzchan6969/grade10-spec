import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { AUTH_COPY } from "../auth-content";
import { SignOutPanel, type SignOutStatus } from "./sign-out-panel";

const meta = {
  title: "Auth/Sign Out/Flows/Sign Out",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS: ReadonlyArray<readonly [string, SignOutStatus]> = [
  ["Signed in", "signed-in"],
  ["Sign-out pending", "pending"],
  ["Sign-out refused", "refused"],
  ["Retry in flight", "pending"],
  ["Signed out", "signed-out"],
];

/**
 * A collector presses Sign Out and the press is held until it settles. A
 * refused sign-out says so and offers to try again; a success returns the
 * panel to its signed-out presentation.
 */
export const Default: Story = {
  parameters: {
    journeys: ["shared-auth-sign-out-US-01", "shared-auth-sign-out-US-02"],
  },
  render: () => (
    <FlowContainer
      cases={STEPS}
      description={
        <p>
          The Sign Out press is refused again while it is running. A refused
          sign-out keeps the message until a retry clears it. Signed out, the
          panel offers to sign in and nothing else.
        </p>
      }
    >
      {(status) => <SignOutPanel email="kit@example.com" status={status} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: AUTH_COPY.signOut }),
    ).toBeEnabled();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    expect(canvas.getByRole("button", { name: "Signing out…" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    expect(canvas.getByText(AUTH_COPY.signOutFailed)).toBeVisible();
    expect(canvas.getByRole("button", { name: AUTH_COPY.retry })).toBeEnabled();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    expect(canvas.queryByText(AUTH_COPY.signOutFailed)).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    expect(canvas.getByText("You are signed out.")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: AUTH_COPY.signIn }),
    ).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByText("Your account")).toHaveLength(STEPS.length);
  },
};
