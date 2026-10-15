import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ManageBookingPage, type ManageState } from "./manage-booking-page";

type ManageSettings = {
  booking: "live" | "cancelled" | "visited" | "notFound";
  opened: "nothing" | "move";
  shopper: "signedIn" | "signedOut";
};

const live = { if: { arg: "booking", eq: "live" } } as const;

const STATE: Record<ManageSettings["booking"], ManageState> = {
  live: "live",
  cancelled: "cancelled",
  visited: "closed",
  notFound: "notFound",
};

/**
 * The page a booking's private link opens to change or cancel it. The Screen
 * is the designer's; the settings decide what it is given.
 */
const meta = {
  title: "Appointment/Booking/Screens/Manage Booking/Scenario",
  tags: ["scenario"],
  args: { booking: "live", opened: "nothing", shopper: "signedIn" },
  argTypes: {
    booking: {
      name: "Booking",
      description:
        "The booking's state in the appointment admin, or a link that matches none",
      control: {
        type: "radio",
        labels: {
          live: "Booked",
          cancelled: "Cancelled",
          visited: "Visited",
          notFound: "The link matches nothing",
        },
      },
      options: ["live", "cancelled", "visited", "notFound"],
    },
    opened: {
      name: "Opened",
      description: "Whether the collector chose Change time",
      control: {
        type: "radio",
        labels: { nothing: "Nothing", move: "Change time" },
      },
      options: ["nothing", "move"],
      ...live,
    },
    shopper: {
      name: "Shopper",
      description: "Signed in on the site or not, when the link opens",
      control: {
        type: "radio",
        labels: { signedIn: "Signed in", signedOut: "Signed out" },
      },
      options: ["signedIn", "signedOut"],
      ...live,
    },
  },
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-appointment-booking-US-02"],
    rules: {
      booking:
        "grade10-site/appointment/booking: A private link manages the booking",
      opened: "shared/appointment/scheduling: A live booking moves in one step",
      shopper:
        "grade10-site/appointment/booking: A signed-in collector sees their own visits",
    },
  },
  render: (args) => {
    const settings = args as ManageSettings;
    const isLive = settings.booking === "live";
    return (
      <ManageBookingPage
        key={JSON.stringify(settings)}
        moving={isLive && settings.opened === "move"}
        signedOut={isLive && settings.shopper === "signedOut"}
        state={STATE[settings.booking]}
      />
    );
  },
  play: async ({ canvasElement }) => {
    expect(
      await within(canvasElement).findByRole("heading", {
        level: 1,
        name: "Manage your visit",
      }),
    ).toBeVisible();
  },
} satisfies Meta<ManageSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A booked visit, opened from its link while signed in. */
export const Scenario: Story = {};

/** Signed out, choosing a new time. */
export const SignedOutChangingTime: Story = {
  args: { opened: "move", shopper: "signedOut" },
};

/** The visit is over. */
export const Visited: Story = { args: { booking: "visited" } };

/** A link that matches no booking. */
export const NotFound: Story = { args: { booking: "notFound" } };
