import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BookVisitPage } from "./book-visit-page";
import {
  BOOK_VISIT_ARG_TYPES,
  BOOK_VISIT_RULES,
  type BookVisitSettings,
  DEFAULT_VISIT,
  momentOf,
} from "./book-visit-scenario";

/** The heading each step shows, so a preset proves it opened where it says. */
function headingOf(settings: BookVisitSettings) {
  if (settings.step === "after")
    return settings.service === "free" || settings.payment === "booked"
      ? "You are booked"
      : undefined;
  return {
    service: "What do you need?",
    location: "Pick a shop",
    time: "Pick a time",
    details: "Your details",
  }[settings.step];
}

/**
 * Book Visit for any booking staging can hold: the service, who is booking,
 * how far they came and what the shop answered. The Screen is the
 * designer's; the settings decide the moment it opens at.
 */
const meta = {
  title: "Appointment/Booking/Screens/Book Visit/Scenario",
  tags: ["scenario"],
  args: DEFAULT_VISIT,
  argTypes: BOOK_VISIT_ARG_TYPES,
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-appointment-booking-US-01",
      "grade10-site-appointment-booking-US-03",
    ],
    rules: BOOK_VISIT_RULES,
  },
  render: (args) => {
    const settings = args as BookVisitSettings;
    return (
      <BookVisitPage
        // New settings open a new booking, so the Screen's own state starts over.
        key={JSON.stringify(settings)}
        moment={momentOf(settings)}
      />
    );
  },
  play: async ({ args, canvasElement }) => {
    const heading = headingOf(args as BookVisitSettings);
    if (!heading) return;
    expect(
      await within(canvasElement).findAllByRole("heading", { name: heading }),
    ).not.toHaveLength(0);
  },
} satisfies Meta<BookVisitSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A signed-in collector on the details step of a free drop-off. */
export const Scenario: Story = {};

/** The time picked went to somebody else; the day's times come back without it. */
export const TimeJustTaken: Story = {
  args: { step: "time", time: "taken" },
};

/** The day is full, so each shop's earliest free time is offered. */
export const FullDay: Story = { args: { step: "time", time: "full" } };

/** A signed-out email that already holds this service is told so. */
export const AlreadyBooked: Story = {
  args: { shopper: "signedOut", gate: "held" },
};

/** A signed-out email past 10 tries today is turned away until tomorrow. */
export const TooManyTries: Story = {
  args: { shopper: "signedOut", gate: "tries" },
};

/** A service the shop calls about asks a signed-out collector for a phone. */
export const NeedsAPhone: Story = {
  args: { shopper: "signedOut", phone: "required" },
};

/** Paid now, and the payment still confirming. */
export const PaymentConfirming: Story = {
  args: { service: "paid", step: "after", payment: "confirming" },
};

/** Paid and booked, for someone else. */
export const PaidForSomeoneElse: Story = {
  args: { service: "paid", step: "after", bookingFor: "someone" },
};
