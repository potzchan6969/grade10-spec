import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MINE_HREF } from "./fixtures";
import { VisitRefusedBook } from "./visit-refused-book";

const meta = {
  title: "Appointment Visit/VisitRefusedBook",
  component: VisitRefusedBook,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    refusal: "held",
    copy: {
      title: "You already have a Grading Submission.",
      body: "Thu 3 Sep, 10:15 at Hong Kong Grade10 Store. To go at another time, change that visit.",
      action: "Open it",
    },
    actionHref: MINE_HREF,
  },
} satisfies Meta<typeof VisitRefusedBook>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed in: the held visit, and the way to it. */
export const Held: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Open it" })).toHaveAttribute(
      "href",
      MINE_HREF,
    );
  },
};

/** Signed out: only that the link went to the inbox, and Sign in. */
export const HeldSignedOut: Story = {
  args: {
    refusal: "heldOut",
    copy: {
      title: "This email already has a Grading Submission.",
      body: "We’ve sent its link there. Sign in to see it here.",
      action: "Sign in",
    },
    actionHref: undefined,
    onAction: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    expect(args.onAction).toHaveBeenCalledTimes(1);
  },
};

/** Too many tries today, with the shop's phone. */
export const Tries: Story = {
  args: {
    refusal: "tries",
    copy: {
      title: "Too many tries today",
      body: "This email has tried to book 10 times today. Try again tomorrow, or call Hong Kong Grade10 Store on +852 2345 6789.",
      action: "Call +852 2345 6789",
    },
    actionHref: "tel:+85223456789",
  },
};
