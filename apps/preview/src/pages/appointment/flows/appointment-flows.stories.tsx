import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type FlowArgs,
  flowParameter,
  flowScreen,
  flowStory,
  walkFlow,
} from "../../flow-screens";

/**
 * The collector's visit journeys, each a tree of the screens that already
 * draw its steps: the Canvas lays them out, and the Screen control focuses
 * one. No screen state sits in two flows; managing a visit starts where
 * booking one stops.
 */
const meta = {
  title: "Appointment/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta<FlowArgs>;

export default meta;
type Story = StoryObj<FlowArgs>;

const BOOK_A_VISIT = [
  flowScreen(
    "1",
    "Your details, after a service, shop and time",
    "details",
    "appointment-booking-screens-book-visit--default",
  ),
  flowScreen(
    "2",
    "Booked",
    "confirmation",
    "appointment-booking-screens-confirmation--default",
  ),
];

const MANAGE_MY_VISIT = [
  flowScreen(
    "1",
    "My visits",
    "my-visits",
    "appointment-booking-screens-appointments--default",
  ),
  flowScreen(
    "2",
    "The visit, booked",
    "booked",
    "appointment-visit-screens-visit--booked",
  ),
  flowScreen(
    "2a",
    "Change time",
    "change-time",
    "appointment-visit-screens-visit--change-time",
  ),
  flowScreen(
    "2b",
    "Cancelled by you",
    "cancelled-by-you",
    "appointment-visit-screens-visit--cancelled-by-you",
  ),
];

/** A signed-in collector picks a service, a shop and a time, and is booked. */
export const BookAVisit: Story = {
  ...flowStory(BOOK_A_VISIT),
  parameters: {
    verification: { caseId: "vc_590c30f1-a365-4c52-9bb6-1509cb7fdcd2" },
    journeys: ["grade10-site-appointment-booking-US-01"],
    flow: flowParameter(BOOK_A_VISIT),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, BOOK_A_VISIT),
};

/** A collector opens a visit from their list, then moves or cancels it. */
export const ManageMyVisit: Story = {
  ...flowStory(MANAGE_MY_VISIT),
  parameters: {
    verification: { caseId: "vc_b968760e-8022-4d7d-9593-d7538c52d085" },
    journeys: ["grade10-site-appointment-booking-US-02"],
    flow: flowParameter(MANAGE_MY_VISIT),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, MANAGE_MY_VISIT),
};
