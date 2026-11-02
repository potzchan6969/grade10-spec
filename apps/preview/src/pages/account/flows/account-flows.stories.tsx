import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type FlowArgs,
  flowParameter,
  flowScreen,
  flowStory,
  walkFlow,
} from "../../flow-screens";

/**
 * A collector's own account journeys, each a tree of the screens that already
 * draw its steps: the Canvas lays them out, and the Screen control focuses
 * one. No screen state sits in two flows.
 */
const meta = {
  title: "Account/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta<FlowArgs>;

export default meta;
type Story = StoryObj<FlowArgs>;

const SIGN_IN_WITH_AN_EMAIL_LINK = [
  flowScreen(
    "1",
    "Asked to sign in",
    "email-step",
    "account-sign-in-screens-sign-in--email-step",
  ),
  flowScreen(
    "2",
    "Sending the link",
    "sending",
    "account-sign-in-screens-sign-in--sending",
  ),
  flowScreen(
    "3",
    "Resend waits",
    "resend-countdown",
    "account-sign-in-screens-sign-in--resend-countdown",
  ),
  flowScreen(
    "4",
    "Check your email, resend open",
    "check-your-email",
    "account-sign-in-screens-sign-in--check-your-email",
  ),
];

/** A signed-out collector asks for a sign-in link, is sent it, and may resend. */
export const SignInWithAnEmailLink: Story = {
  ...flowStory(SIGN_IN_WITH_AN_EMAIL_LINK),
  parameters: {
    verification: { caseId: "vc_de16c185-d622-43ac-88c4-dad0c59cc6cb" },
    journeys: [
      "shared-auth-sign-in-US-01",
      "shared-auth-sign-in-US-07",
      "grade10-site-site-navigation-US-06",
      "grade10-site-site-navigation-US-07",
    ],
    flow: flowParameter(SIGN_IN_WITH_AN_EMAIL_LINK),
  },
  play: ({ canvasElement }) =>
    walkFlow(canvasElement, SIGN_IN_WITH_AN_EMAIL_LINK),
};
