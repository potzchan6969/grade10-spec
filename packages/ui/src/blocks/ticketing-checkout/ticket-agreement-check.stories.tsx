import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  AccountStatement,
  GuestStatement,
  phone,
} from "./checkout.story-fixtures";
import { ACCOUNT_AGREEMENT_DETAIL, REVIEW_COPY } from "./fixtures";
import { TicketAgreementCheck } from "./ticket-agreement-check";

const meta = {
  title: "Ticketing/Buying/Blocks/TicketAgreementCheck",
  component: TicketAgreementCheck,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
    phone,
  ],
  args: {
    copy: REVIEW_COPY.agreement,
    statement: <GuestStatement />,
    checked: false,
    onCheckedChange: fn(),
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <TicketAgreementCheck
        {...args}
        checked={checked}
        onCheckedChange={(next) => {
          setChecked(next);
          args.onCheckedChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof TicketAgreementCheck>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A guest: the Terms of Sale and Grade10's Terms and Privacy Policy, and
 * the account the purchase keeps for the email. The whole card ticks. */
export const Guest: Story = {
  parameters: {
    verification: { caseId: "vc_fea2a4d9-f764-4cd4-b6d6-b05921c6af59" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("checkbox", {
      name: "I agree to the Terms of Sale and Grade10’s Terms and Privacy Policy.",
    });
    expect(box).not.toBeChecked();
    await userEvent.click(canvas.getByText(/We keep your tickets/));
    expect(box).toBeChecked();
    expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

/** Signed in: the Terms of Sale only. */
export const SignedIn: Story = {
  parameters: {
    verification: { caseId: "vc_648f28a8-02eb-4896-b75c-5b0c78b53ea0" },
  },
  args: {
    statement: <AccountStatement />,
    copy: { ...REVIEW_COPY.agreement, detail: ACCOUNT_AGREEMENT_DETAIL },
    checked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("checkbox", { name: "I agree to the Terms of Sale." }),
    ).toBeChecked();
  },
};

/** Pay pressed unticked: the card turns the error tone and says so, until
 * ticked. */
export const Unticked: Story = {
  parameters: {
    verification: { caseId: "vc_76f35bca-ad5b-445e-a9dd-fc98286b8f39" },
  },
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Tick the box to agree before you pay.",
    );
    const box = canvas.getByRole("checkbox", { name: /Terms of Sale/ });
    expect(box).toHaveAttribute("aria-invalid", "true");
    await userEvent.click(box);
    expect(canvas.queryByRole("alert")).toBeNull();
  },
};
