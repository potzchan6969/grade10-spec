import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type FlowArgs,
  flowParameter,
  flowScreen,
  flowStory,
  walkFlow,
} from "../../flow-screens";

/**
 * The ticket buyer's journeys, and the door's, each a tree of the screens
 * that already draw its steps: the Canvas lays them out, and the Screen
 * control focuses one. No screen state sits in two flows; the return's
 * other outcomes, the order's later states and Your Tickets start where
 * buying stops.
 */
const meta = {
  title: "Ticketing/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta<FlowArgs>;

export default meta;
type Story = StoryObj<FlowArgs>;

const BUY_AS_GUEST = [
  flowScreen(
    "1",
    "The event, early bird",
    "event",
    "ticketing-buying-screens-event--early-bird",
  ),
  flowScreen(
    "2",
    "Passes chosen",
    "event-chosen",
    "ticketing-buying-screens-event--chosen",
  ),
  flowScreen(
    "2a",
    "Fast Pass for everyone",
    "event-fast-pass",
    "ticketing-buying-screens-event--fast-pass-for-everyone",
  ),
  flowScreen(
    "3",
    "Your Details, as a guest",
    "details",
    "ticketing-buying-screens-your-details--guest",
  ),
  flowScreen(
    "3a",
    "Field errors",
    "details-errors",
    "ticketing-buying-screens-your-details--field-errors",
  ),
  flowScreen(
    "4",
    "Check Your Order",
    "review",
    "ticketing-buying-screens-check-your-order--guest",
  ),
  flowScreen(
    "4a",
    "Pay pressed unticked",
    "review-unticked",
    "ticketing-buying-screens-check-your-order--not-agreed",
  ),
  flowScreen(
    "5",
    "Opening payment",
    "opening",
    "ticketing-buying-screens-check-your-order--opening-payment",
  ),
  flowScreen(
    "6",
    "Back from Stripe, confirming",
    "confirming",
    "ticketing-your-tickets-screens-return--confirming",
  ),
  flowScreen(
    "6a",
    "Safe to close",
    "safe-to-close",
    "ticketing-your-tickets-screens-return--safe-to-close",
  ),
  flowScreen(
    "7",
    "You’re Going",
    "paid",
    "ticketing-your-tickets-screens-order--paid",
  ),
];

const PROMO_CODE = [
  flowScreen(
    "1",
    "SPRING20 applied",
    "promo-applied",
    "ticketing-buying-screens-check-your-order-promo--promo-applied",
  ),
  flowScreen(
    "1a",
    "Code not found",
    "promo-not-found",
    "ticketing-buying-screens-check-your-order-promo--code-not-found",
  ),
  flowScreen(
    "1b",
    "Too many tries",
    "promo-too-many",
    "ticketing-buying-screens-check-your-order-promo--too-many-tries",
  ),
  flowScreen(
    "2",
    "Free with CREW4",
    "promo-free",
    "ticketing-buying-screens-check-your-order-promo--free-with-code",
  ),
  flowScreen(
    "3",
    "Code used up at Pay",
    "promo-used-up",
    "ticketing-buying-screens-check-your-order-promo--used-up-at-pay",
  ),
];

const RETURN_OUTCOMES = [
  flowScreen(
    "1",
    "Went back from Stripe",
    "went-back",
    "ticketing-your-tickets-screens-return--went-back",
  ),
  flowScreen(
    "1a",
    "Hold ran out",
    "hold-ran-out",
    "ticketing-your-tickets-screens-return--hold-ran-out",
  ),
  flowScreen(
    "1b",
    "Paid too late",
    "paid-too-late",
    "ticketing-your-tickets-screens-return--paid-too-late",
  ),
  flowScreen(
    "1c",
    "Another browser",
    "other-browser",
    "ticketing-your-tickets-screens-return--other-browser",
  ),
  flowScreen(
    "1d",
    "Signed in, not theirs",
    "not-theirs",
    "ticketing-your-tickets-screens-return--not-theirs",
  ),
];

const ORDER_PAGE = [
  flowScreen(
    "1",
    "Held, counting down",
    "held",
    "ticketing-your-tickets-screens-order--held",
  ),
  flowScreen(
    "1a",
    "Checking",
    "checking",
    "ticketing-your-tickets-screens-order--checking",
  ),
  flowScreen(
    "2",
    "Confirmed",
    "confirmed",
    "ticketing-your-tickets-screens-order--confirmed",
  ),
  flowScreen(
    "2a",
    "Free order",
    "free",
    "ticketing-your-tickets-screens-order--free-order",
  ),
  flowScreen(
    "2b",
    "Guest in the buying browser",
    "guest",
    "ticketing-your-tickets-screens-order--guest",
  ),
  flowScreen(
    "3",
    "After day 1",
    "after-day-one",
    "ticketing-your-tickets-screens-order--after-day-one",
  ),
  flowScreen(
    "3a",
    "One ticket refunded",
    "part-refunded",
    "ticketing-your-tickets-screens-order--one-ticket-refunded",
  ),
  flowScreen(
    "3b",
    "Fully refunded",
    "refunded",
    "ticketing-your-tickets-screens-order--fully-refunded",
  ),
  flowScreen(
    "3c",
    "Event cancelled",
    "event-cancelled",
    "ticketing-your-tickets-screens-order--event-cancelled",
  ),
];

const YOUR_TICKETS = [
  flowScreen(
    "1",
    "Signed out",
    "signed-out",
    "ticketing-your-tickets-screens-your-tickets--signed-out",
  ),
  flowScreen(
    "2",
    "Check your email",
    "check-email",
    "ticketing-your-tickets-screens-your-tickets--check-your-email",
  ),
  flowScreen(
    "3",
    "Back from the link",
    "back-from-link",
    "ticketing-your-tickets-screens-your-tickets--back-from-the-link",
  ),
  flowScreen(
    "4",
    "Every order",
    "list",
    "ticketing-your-tickets-screens-your-tickets--list",
  ),
  flowScreen(
    "4a",
    "No tickets yet",
    "empty",
    "ticketing-your-tickets-screens-your-tickets--empty",
  ),
  flowScreen(
    "4b",
    "Loading",
    "loading",
    "ticketing-your-tickets-screens-your-tickets--loading",
  ),
  flowScreen(
    "4c",
    "Load failed",
    "failed",
    "ticketing-your-tickets-screens-your-tickets--failed",
  ),
];

const SHARED_FREE_TICKET = [
  flowScreen(
    "1",
    "The ticket from its link",
    "shared",
    "ticketing-your-tickets-screens-shared-ticket--valid",
  ),
  flowScreen(
    "1a",
    "Cancelled",
    "shared-cancelled",
    "ticketing-your-tickets-screens-shared-ticket--cancelled",
  ),
  flowScreen(
    "1b",
    "Link replaced",
    "shared-replaced",
    "ticketing-your-tickets-screens-shared-ticket--replaced",
  ),
  flowScreen(
    "1c",
    "Event over",
    "shared-over",
    "ticketing-your-tickets-screens-shared-ticket--event-over",
  ),
  flowScreen(
    "1d",
    "Not found",
    "shared-not-found",
    "ticketing-your-tickets-screens-shared-ticket--not-found",
  ),
  flowScreen(
    "2",
    "Saved to My Tickets",
    "shared-saved",
    "ticketing-your-tickets-screens-shared-ticket--saved",
  ),
  flowScreen(
    "3",
    "In today",
    "shared-used-today",
    "ticketing-your-tickets-screens-shared-ticket--used-today",
  ),
];

const DOOR_PHONE = [
  flowScreen(
    "1",
    "Enter the passcode",
    "door-sign-in",
    "ticketing-door-screens-door-phone--enter-the-passcode",
  ),
  flowScreen(
    "1a",
    "Wrong passcode",
    "door-wrong",
    "ticketing-door-screens-door-phone--wrong-passcode",
  ),
  flowScreen(
    "1b",
    "Slowed",
    "door-slowed",
    "ticketing-door-screens-door-phone--slowed",
  ),
  flowScreen(
    "1c",
    "Not open yet",
    "door-not-open",
    "ticketing-door-screens-door-phone--not-open-yet",
  ),
  flowScreen(
    "2",
    "Scanning",
    "door-scanning",
    "ticketing-door-screens-door-phone--scanning",
  ),
  flowScreen(
    "2a",
    "Camera blocked",
    "door-camera-blocked",
    "ticketing-door-screens-door-phone--camera-blocked",
  ),
  flowScreen(
    "2b",
    "Find by reference",
    "door-find",
    "ticketing-door-screens-door-phone--find-by-reference",
  ),
  flowScreen(
    "3",
    "Admitted, Use Fast Pass",
    "door-admitted",
    "ticketing-door-screens-door-phone--admitted",
  ),
  flowScreen(
    "3a",
    "Already in today",
    "door-already-in",
    "ticketing-door-screens-door-phone--already-in",
  ),
  flowScreen(
    "3b",
    "Refunded or cancelled",
    "door-void",
    "ticketing-door-screens-door-phone--void",
  ),
  flowScreen(
    "3c",
    "Not checked",
    "door-not-checked",
    "ticketing-door-screens-door-phone--not-checked",
  ),
  flowScreen(
    "4",
    "Undone",
    "door-undone",
    "ticketing-door-screens-door-phone--undone",
  ),
  flowScreen(
    "5",
    "Passcode changed",
    "door-passcode-changed",
    "ticketing-door-screens-door-phone--passcode-changed",
  ),
];

/** A guest chooses passes and Fast Pass, gives a name and email, agrees,
 * pays on Stripe and lands on the tickets. */
export const BuyAsGuest: Story = {
  ...flowStory(BUY_AS_GUEST),
  parameters: {
    verification: { caseId: "vc_c94b0208-559b-425a-b912-92002d11a3cd" },
    journeys: [
      "grade10-site-ticketing-buying-US-01",
      "grade10-site-ticketing-buying-US-03",
    ],
    flow: flowParameter(BUY_AS_GUEST),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, BUY_AS_GUEST),
};

/** A buyer applies a promo code at Check Your Order. */
export const PromoCode: Story = {
  ...flowStory(PROMO_CODE),
  parameters: {
    verification: { caseId: "vc_daee9970-d403-4233-bf19-4f0f02af1958" },
    journeys: ["grade10-site-ticketing-buying-US-01"],
    flow: flowParameter(PROMO_CODE),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, PROMO_CODE),
};

/** Every way back from Stripe other than paid. */
export const ReturnOutcomes: Story = {
  ...flowStory(RETURN_OUTCOMES),
  parameters: {
    verification: { caseId: "vc_cbc77627-30c3-4297-99ff-3623ee6fb353" },
    journeys: ["grade10-site-ticketing-buying-US-01"],
    flow: flowParameter(RETURN_OUTCOMES),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, RETURN_OUTCOMES),
};

/** One order from the hold to after the show. */
export const OrderPage: Story = {
  ...flowStory(ORDER_PAGE),
  parameters: {
    verification: { caseId: "vc_51854c47-3f55-4bb6-9b97-110981c034be" },
    journeys: ["grade10-site-ticketing-your-tickets-US-01"],
    flow: flowParameter(ORDER_PAGE),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, ORDER_PAGE),
};

/** A guest signs in with the buying email and finds every order. */
export const YourTickets: Story = {
  ...flowStory(YOUR_TICKETS),
  parameters: {
    verification: { caseId: "vc_cb26e4cf-95aa-401d-a51d-747ab33f67fd" },
    journeys: ["grade10-site-ticketing-your-tickets-US-02"],
    flow: flowParameter(YOUR_TICKETS),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, YOUR_TICKETS),
};

/** A free ticket opened from its link and saved to My Tickets. */
export const SharedFreeTicket: Story = {
  ...flowStory(SHARED_FREE_TICKET),
  parameters: {
    verification: { caseId: "vc_042d4c83-f104-4722-bd45-1d2bd658ff12" },
    journeys: ["grade10-site-ticketing-your-tickets-US-01"],
    flow: flowParameter(SHARED_FREE_TICKET),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, SHARED_FREE_TICKET),
};

/** Door staff get in with the passcode, scan, admit, undo and use Fast
 * Pass. */
export const DoorPhone: Story = {
  ...flowStory(DOOR_PHONE),
  parameters: {
    verification: { caseId: "vc_5523c038-5184-444a-87b4-f82c33938888" },
    journeys: ["grade10-admin-ticketing-door-US-01"],
    flow: flowParameter(DOOR_PHONE),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, DOOR_PHONE),
};
