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
    const settings = args as BookVisitSettings;
    if (settings.step === "details" && settings.shopper === "signedOut") {
      expect(
        await within(canvasElement).findAllByText("Sign in to book"),
      ).not.toHaveLength(0);
      return;
    }
    const heading = headingOf(settings);
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
