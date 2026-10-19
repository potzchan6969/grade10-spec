import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { BookVisitPage } from "./book-visit-page";

const meta = {
  title: "Appointment/Booking/Screens/Book Visit",
  component: BookVisitPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { scenario: "normal" },
} satisfies Meta<typeof BookVisitPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** At the first step: a pick only selects, Continue moves on, and Continue
 * with nothing picked says what is missing. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Book a visit" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Choose a service to continue.",
    );
    await userEvent.click(
      canvas.getByRole("radio", { name: /^Grading drop-off/ }),
    );
    expect(
      canvas.getByRole("heading", { level: 2, name: "What do you need?" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Pick a shop" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("radio", { name: /^Central/ }));
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Pick a time" }),
    ).toBeVisible();
    expect(canvas.queryByRole("button", { name: /Earliest/ })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: /^Thu 22 Oct/ }));
    await userEvent.click(canvas.getByRole("button", { name: "15:00" }));
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Your details" }),
    ).toBeVisible();
  },
};

export const TimeJustTaken: Story = {
  args: { scenario: "time just taken" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "15:00 on Thu 22 Oct was just taken.",
    );
    expect(canvas.queryByRole("button", { name: "15:00" })).toBeNull();
  },
};

export const FullDay: Story = {
  args: { scenario: "full day" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sat 17 Oct is full at Central.")).toBeVisible();
  },
};

/** Guest booking is off: signed out, the details step asks for a sign-in,
 * and the picks are kept through it. */
export const SignedOut: Story = {
  args: { scenario: "signed out" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("textbox", { name: "Name" })).toBeNull();
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign in to book" }),
    );
    expect(canvas.getByText(`Signed in as Alex Chan.`)).toBeVisible();
    expect(
      canvas.getByRole("button", { name: /^Book Thu 22 Oct, 15:00/ }),
    ).toBeVisible();
  },
};

export const TooManyTriesToday: Story = {
  args: { scenario: "too many tries today" },
};

export const SlowNetwork: Story = {
  args: { scenario: "slow network" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent(
      "Keep this page open. We won’t book you twice.",
    );
    expect(canvas.getByRole("button", { name: "Back" })).toBeDisabled();
  },
};

export const SignedInNoPhone: Story = {
  args: { scenario: "signed in, no phone on account" },
};

export const ServiceNeedsAPhone: Story = {
  args: { scenario: "service needs a phone" },
};

export const PaidService: Story = {
  args: { scenario: "paid service" },
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
    expect(canvas.queryByText(/We hold this time/)).toBeNull();
    expect(canvas.queryByText("I’m booking for someone else")).toBeNull();
  },
};

export const ConfirmingPayment: Story = {
  args: { scenario: "confirming payment" },
};

export const PaidAndBooked: Story = {
  args: { scenario: "paid and booked" },
};

export const PaymentNotCompleted: Story = {
  args: { scenario: "payment not completed" },
};

/** At 390px the summary folds into the bar and the month into a strip. */
export const Phone: Story = {
  args: { scenario: "full day" },
  globals: { viewport: { value: "mobile1" } },
};
