import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AUTH_COPY as signIn } from "../../auth/auth-content";
import {
  SIGN_IN_EMAIL,
  SIGN_IN_FROM_CART_TITLE,
  SIGN_IN_TITLE,
} from "./sign-in-content";
import { SignInPage } from "./sign-in-page";

const meta = {
  title: "Account/Sign In/Screens/Sign In",
  component: SignInPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SignInPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed out over a product: the address step, the send disabled until an address is typed. */
export const EmailStep: Story = {
  parameters: {
    verification: { caseId: "vc_9f42739f-5a63-4057-91e2-43d24bb16147" },
  },
  name: "Email step",
  play: async () => {
    const body = within(document.body);
    expect(
      body.getByRole("heading", { name: SIGN_IN_TITLE }),
    ).toBeInTheDocument();
    expect(
      body.getByRole("button", { name: signIn.sendLinkLabel }),
    ).toBeDisabled();
  },
};

/** The send in flight: the address stays, and the send action is busy. */
export const Sending: Story = {
  parameters: {
    verification: { caseId: "vc_79720811-8574-4473-9cd7-25aac5a5be4e" },
  },
  args: { step: "sending", email: SIGN_IN_EMAIL },
  play: async () => {
    const body = within(document.body);
    expect(body.getByRole("textbox", { name: signIn.emailLabel })).toHaveValue(
      SIGN_IN_EMAIL,
    );
  },
};

/** The link is sent: the confirmation with the address, and Resend waiting. */
export const CheckYourEmail: Story = {
  parameters: {
    verification: { caseId: "vc_eb7a8e62-b405-4a7e-b73f-91c85b1728be" },
  },
  name: "Check your email",
  args: { step: "sent", email: SIGN_IN_EMAIL, cooldown: 0 },
  play: async () => {
    const body = within(document.body);
    expect(
      body.getByRole("heading", { name: signIn.linkSentTitle }),
    ).toBeInTheDocument();
    expect(body.getByText(SIGN_IN_EMAIL)).toBeInTheDocument();
    expect(
      body.getByRole("button", { name: signIn.resendLabel }),
    ).toBeEnabled();
  },
};

/** Resend is off for the wait after a send, and counts down in seconds. */
export const ResendCountdown: Story = {
  parameters: {
    verification: { caseId: "vc_e390e08f-1855-4e0f-910a-704b3dbd9ed0" },
  },
  name: "Resend countdown",
  args: { step: "sent", email: SIGN_IN_EMAIL, cooldown: 45 },
  play: async () => {
    const body = within(document.body);
    expect(body.getByRole("button", { name: "Resend (45)" })).toBeDisabled();
  },
};

/** Opened from Add to Cart: the same dialog, titled for the action that asked. */
export const FromAddToCart: Story = {
  parameters: {
    verification: { caseId: "vc_b5197c11-0416-49b8-aa37-561b17a588b9" },
  },
  name: "From add to cart",
  args: { fromCart: true },
  play: async () => {
    const body = within(document.body);
    expect(
      body.getByRole("heading", { name: SIGN_IN_FROM_CART_TITLE }),
    ).toBeInTheDocument();
  },
};
