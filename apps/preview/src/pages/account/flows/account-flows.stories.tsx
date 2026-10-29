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

const MANAGE_MY_PROFILE = [
  flowScreen(
    "1",
    "First visit, never saved",
    "never-saved",
    "account-profile-screens-profile--never-saved",
  ),
  flowScreen(
    "2",
    "Edit name and bio",
    "editing",
    "account-profile-screens-profile-edit--editing",
  ),
  flowScreen(
    "3",
    "Saving",
    "saving",
    "account-profile-screens-profile-edit--saving",
  ),
  flowScreen(
    "4",
    "Saved, member since",
    "member-since",
    "account-profile-screens-profile--member-since",
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

/** A collector opens their profile for the first time, edits it and saves. */
export const ManageMyProfile: Story = {
  ...flowStory(MANAGE_MY_PROFILE),
  parameters: {
    verification: { caseId: "vc_aefd58b2-7d59-4f67-a3ee-f10e68112160" },
    journeys: [
      "grade10-site-store-account-profile-US-01",
      "grade10-site-store-account-profile-US-02",
      "grade10-site-store-account-profile-US-04",
      "grade10-site-site-page-shell-US-03",
    ],
    flow: flowParameter(MANAGE_MY_PROFILE),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, MANAGE_MY_PROFILE),
};
