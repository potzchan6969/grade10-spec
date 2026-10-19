import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MINE_HREF } from "./fixtures";
import { VisitRefusedBook } from "./visit-refused-book";

const meta = {
  title: "Appointment/Visit/Blocks/VisitRefusedBook",
  component: VisitRefusedBook,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    refusal: "held",
    copy: {
      title: "You already have a Grading drop-off.",
      body: "Thu 22 Oct, 15:00 at Central. To go at another time, change that visit.",
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
      title: "This email already has a Grading drop-off.",
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

/** Too many tries today, with the shop's phone: still a warning, not an error. */
export const Tries: Story = {
  args: {
    refusal: "tries",
    copy: {
      title: "Too many tries today",
      body: "This email has tried to book 10 times today. Try again tomorrow, or call Central on 2345 6789.",
      action: "Call 2345 6789",
    },
    actionHref: "tel:+85223456789",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent("Too many tries today");
    expect(
      canvas.getByRole("link", { name: "Call 2345 6789" }),
    ).toHaveAttribute("href", "tel:+85223456789");
  },
};

/** Pressed again: the same notice shakes. */
export const PressedAgain: Story = { args: { attempt: 1 } };
