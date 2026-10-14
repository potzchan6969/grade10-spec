import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { SignInEmailForm, SignInLinkSent } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { AUTH_COPY as signIn } from "../auth-content";
import {
  EMAIL_FORM_COPY,
  LINK_SENT_COPY,
  RESEND_WAIT_SECONDS,
  SIGN_IN_EMAIL,
  SIGN_IN_TITLE,
} from "./sign-in-content";

const meta = {
  title: "Auth/Sign In/Flows/Sign In With Email",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type SignInStep = "email" | "sending" | "wait" | "sent";

const STEPS: ReadonlyArray<readonly [string, SignInStep]> = [
  ["Email step", "email"],
  ["Sending", "sending"],
  ["Check your email", "wait"],
  ["Resend", "sent"],
];

/**
 * One step of the sign-in dialog's body. The dialog itself is a stand-in
 * here: the card shows the step the dialog would hold.
 */
function SignInStepCard({ step }: { step: SignInStep }) {
  const sent = step === "sent" || step === "wait";
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{sent ? signIn.linkSentTitle : SIGN_IN_TITLE}</CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? (
          <SignInLinkSent
            copy={{
              ...LINK_SENT_COPY,
              resendCountdown: signIn.resendCountdown.replace(
                "{seconds}",
                String(step === "wait" ? RESEND_WAIT_SECONDS : 0),
              ),
            }}
            email={SIGN_IN_EMAIL}
            onResend={() => undefined}
            resendCooldownRemaining={step === "wait" ? RESEND_WAIT_SECONDS : 0}
          />
        ) : (
          <SignInEmailForm
            copy={EMAIL_FORM_COPY}
            email={step === "email" ? "" : SIGN_IN_EMAIL}
            onEmailChange={() => undefined}
            onSubmit={() => undefined}
            submitting={step === "sending"}
          />
        )}
      </CardContent>
    </Card>
  );
}

/**
 * A collector asks for a sign-in link once, sees the confirmation with the
 * address it went to, and waits out the resend before asking again. The link
 * itself is followed in its own tab, not walked here.
 */
export const Default: Story = {
  parameters: {
    journeys: ["shared-auth-sign-in-US-01", "shared-auth-sign-in-US-07"],
  },
  render: () => (
    <FlowContainer
      cases={STEPS}
      description={
        <p>
          The send action stays disabled until an address is typed. A send shows
          the request running, then the confirmation with the address, Resend
          off and counting down for sixty seconds, then Resend ready to ask
          again.
        </p>
      }
    >
      {(step) => <SignInStepCard step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Next" });

    expect(
      canvas.getByRole("button", { name: signIn.sendLinkLabel }),
    ).toBeDisabled();

    await userEvent.click(next);
    expect(
      canvas.getByRole("textbox", { name: signIn.emailLabel }),
    ).toHaveValue(SIGN_IN_EMAIL);
    expect(
      canvas.getByRole("button", { name: signIn.sendLinkLabel }),
    ).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(next);
    expect(canvas.getByText(SIGN_IN_EMAIL)).toBeVisible();
    expect(
      canvas.getByRole("button", { name: `Resend (${RESEND_WAIT_SECONDS})` }),
    ).toBeDisabled();

    await userEvent.click(next);
    expect(
      canvas.getByRole("button", { name: signIn.resendLabel }),
    ).toBeEnabled();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByText(SIGN_IN_TITLE)).toHaveLength(2);
    expect(canvas.getAllByText(signIn.linkSentTitle)).toHaveLength(2);
  },
};
