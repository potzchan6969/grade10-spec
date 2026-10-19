import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingActionBar } from "./booking-action-bar";

const meta = {
  title: "Appointment/Booking/Blocks/BookingActionBar",
  component: BookingActionBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    back: { label: "Back", onClick: fn() },
    primary: { label: "Continue", onClick: fn() },
  },
} satisfies Meta<typeof BookingActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(args.primary.onClick).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    expect(args.back?.onClick).toHaveBeenCalledTimes(1);
  },
};

/** The first step has no Back. */
export const FirstStep: Story = { args: { back: undefined } };

/** Continue with nothing picked says what is missing. */
export const NeedsAPick: Story = {
  args: { error: "Pick a time to continue." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Pick a time to continue.",
    );
  },
};

/** Fields to fix, counted over the press. */
export const ErrorCount: Story = {
  args: {
    error: "Check the 2 fields marked above.",
    primary: { label: "Book Thu 22 Oct, 15:00", onClick: fn() },
  },
};

/** A paid service: the press names the deposit, and the refund rule and
 * where it is paid sit under the presses as footnotes. */
export const Deposit: Story = {
  args: {
    primary: { label: "Confirm booking with HK$100 deposit", onClick: fn() },
    footnotes: [
      "Refunded if you cancel at least 24 hours before, or if the shop cancels.",
      "You pay on a secure Stripe page. Nothing is charged until you finish there.",
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", {
        name: "Confirm booking with HK$100 deposit",
      }),
    ).toBeVisible();
    expect(
      canvas.getByText(
        "Refunded if you cancel at least 24 hours before, or if the shop cancels.",
      ),
    ).toBeVisible();
  },
};

/** A slow write: the press spins, Back stays put, and the note says why. */
export const Slow: Story = {
  args: {
    busy: true,
    noteLive: true,
    primary: { label: "Booking… still trying", onClick: fn() },
    note: "Keep this page open. We won’t book you twice.",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Back" })).toBeDisabled();
    expect(canvas.getByRole("status")).toHaveTextContent(
      "Keep this page open. We won’t book you twice.",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: /Booking… still trying/ }),
    );
    expect(args.primary.onClick).not.toHaveBeenCalled();
  },
};

/** On a phone Back keeps its width and the press takes the rest. */
export const Phone: Story = {
  globals: { viewport: { value: "mobile1" } },
};
