import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AppointmentVisitPage, type VisitState } from "./visit-page";

type VisitSettings = {
  visit: Exclude<VisitState, "paid" | "paidRefunded"> | "refunded";
  paid: "no" | "yes";
  opened: "nothing" | "move" | "cancel";
  refund: "due" | "kept";
};

const beforeTheDay = { if: { arg: "visit", eq: "booked" } } as const;

function stateOf(settings: VisitSettings): VisitState {
  if (settings.visit === "refunded") return "paidRefunded";
  if (settings.visit === "booked" && settings.paid === "yes") return "paid";
  return settings.visit;
}

/**
 * The visit page a booking's link opens, for any state the booking can be
 * in. The Screen is the designer's; the settings decide what it is given.
 */
const meta = {
  title: "Appointment/Visit/Screens/Visit/Scenario",
  tags: ["scenario"],
  args: { visit: "booked", paid: "no", opened: "nothing", refund: "due" },
  argTypes: {
    visit: {
      name: "Visit",
      description:
        "The booking's state in the appointment admin, or what the link finds",
      control: {
        type: "radio",
        labels: {
          booked: "Booked, before the day",
          justBooked: "Just booked",
          reconnecting: "Booked, connection lost",
          withGrading: "Cards with grading",
          withVault: "Items with the vault",
          completed: "Visited",
          missed: "Missed",
          cancelledYou: "Cancelled by the collector",
          cancelledShop: "Cancelled by the shop",
          shopClosed: "The shop closed that day",
          refunded: "Paid, cancelled and refunded",
          linkOpensNothing: "The link opens nothing",
        },
      },
      options: [
        "booked",
        "justBooked",
        "reconnecting",
        "withGrading",
        "withVault",
        "completed",
        "missed",
        "cancelledYou",
        "cancelledShop",
        "shopClosed",
        "refunded",
        "linkOpensNothing",
      ],
    },
    paid: {
      name: "Paid",
      description: "Whether the service was paid when booked",
      control: { type: "radio", labels: { no: "Free", yes: "Paid" } },
      options: ["no", "yes"],
      ...beforeTheDay,
    },
    opened: {
      name: "Opened",
      description: "The sheet the collector opened from the visit page",
      control: {
        type: "radio",
        labels: { nothing: "Nothing", move: "Change time", cancel: "Cancel" },
      },
      options: ["nothing", "move", "cancel"],
      ...beforeTheDay,
    },
    refund: {
      name: "Refund",
      description:
        "For a paid visit, whether cancelling now is early enough to give the money back",
      control: {
        type: "radio",
        labels: { due: "Early enough, refunded", kept: "Too late, kept" },
      },
      options: ["due", "kept"],
      if: { arg: "opened", eq: "cancel" },
    },
  },
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-appointment-booking-US-02"],
    rules: {
      visit: "shared/appointment/scheduling: A booking has one live state",
      opened:
        "grade10-site/appointment/booking: A private link manages the booking",
    },
  },
  render: (args) => {
    const settings = args as VisitSettings;
    return (
      <AppointmentVisitPage
        key={JSON.stringify(settings)}
        opened={
          settings.visit === "booked" && settings.opened !== "nothing"
            ? settings.opened
            : null
        }
        refund={settings.refund}
        state={stateOf(settings)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    expect(
      await within(canvasElement).findAllByRole("heading"),
    ).not.toHaveLength(0);
  },
} satisfies Meta<VisitSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A free visit, booked, before the day. */
export const Scenario: Story = {};

/** A paid visit cancelled early enough to get the money back. */
export const PaidCancelRefunded: Story = {
  args: { paid: "yes", opened: "cancel", refund: "due" },
};

/** A paid visit cancelled too late to get the money back. */
export const PaidCancelTooLate: Story = {
  args: { paid: "yes", opened: "cancel", refund: "kept" },
};

/** The collector changes the time. */
export const ChangeTime: Story = { args: { opened: "move" } };

/** The shop cancelled the visit. */
export const CancelledByTheShop: Story = { args: { visit: "cancelledShop" } };

/** A link that matches no booking. */
export const LinkOpensNothing: Story = { args: { visit: "linkOpensNothing" } };
