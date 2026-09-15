import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SignInLinkSent } from "./sign-in-link-sent";

const meta = {
  title: "Auth Sign In/SignInLinkSent",
  component: SignInLinkSent,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      message: "We've just sent a sign-in link to collector@example.com.",
      resend: "Resend",
      back: "Back",
    },
    onResend: fn(),
    onBack: fn(),
  },
} satisfies Meta<typeof SignInLinkSent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "We've just sent a sign-in link to collector@example.com.",
      ),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Resend" })).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Back" })).toBeInTheDocument();
  },
};

export const ResendReportsActivation: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Resend" }));
    expect(args.onResend).toHaveBeenCalledOnce();
  },
};

export const BackReportsActivation: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    expect(args.onBack).toHaveBeenCalledOnce();
  },
};

/** Resend looks busy while its request is in flight. */
export const Resending: Story = {
  args: { resending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const resend = canvas.getByRole("button", { name: "Resend" });
    expect(resend).toHaveAttribute("aria-busy", "true");
  },
};
