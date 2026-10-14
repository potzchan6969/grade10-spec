import { hkSlot, ME } from "./book-visit-board";
import { type Moment, TAKEN } from "./book-visit-page";

/**
 * A booking on the Book Visit Screen, as the conditions staging can be set
 * to: the service, who is booking, how far they came and what the shop
 * answered. `momentOf` turns them into the moment the Screen opens at.
 */
type BookVisitSettings = {
  step: "service" | "location" | "time" | "details" | "after";
  service: "free" | "paid";
  phone: "optional" | "required";
  shopper: "signedOut" | "signedIn" | "signedInNoPhone";
  bookingFor: "self" | "someone";
  time: "open" | "taken" | "full";
  answer: "books" | "slow";
  gate: "passes" | "held" | "tries";
  payment: "booked" | "confirming" | "expired";
};

const DEFAULT_VISIT: BookVisitSettings = {
  step: "details",
  service: "free",
  phone: "optional",
  shopper: "signedIn",
  bookingFor: "self",
  time: "open",
  answer: "books",
  gate: "passes",
  payment: "booked",
};

const BOOKED_FOR = "Ben Chan";
const FULL_DAY = "2026-10-17";

function momentOf(settings: BookVisitSettings): Moment {
  const paid = settings.service === "paid";
  const signedIn = settings.shopper !== "signedOut";
  const booking: Moment = {
    step: "details",
    phase: "flow",
    service: paid ? "bulk" : "drop",
    shop: "central",
    date: "2026-10-22",
    slot: paid ? hkSlot("2026-10-22", "15:00", 45) : TAKEN,
    signedIn,
    accountPhone: settings.shopper === "signedInNoPhone" ? "" : ME.phone,
    phoneRequired: settings.phone === "required",
    refusal: null,
    busy: false,
    gone: [],
    ...(settings.bookingFor === "someone" ? { bookedFor: BOOKED_FOR } : {}),
  };
  switch (settings.step) {
    case "service":
      return {
        ...booking,
        step: "service",
        shop: undefined,
        date: undefined,
        slot: undefined,
      };
    case "location":
      return { ...booking, step: "location", date: undefined, slot: undefined };
    case "time":
      return settings.time === "taken"
        ? {
            ...booking,
            step: "time",
            slot: undefined,
            gone: [TAKEN.start],
            refusal: "taken",
          }
        : settings.time === "full"
          ? { ...booking, step: "time", date: FULL_DAY, slot: undefined }
          : { ...booking, step: "time" };
    case "details":
      return {
        ...booking,
        busy: settings.answer === "slow",
        // The gate answers a signed-out shopper only.
        refusal:
          signedIn || settings.gate === "passes"
            ? null
            : settings.gate === "held"
              ? "heldOut"
              : "tries",
      };
    case "after":
      return { ...booking, phase: paid ? settings.payment : "booked" };
  }
}

const atStep = (step: BookVisitSettings["step"]) =>
  ({ if: { arg: "step", eq: step } }) as const;

/** Controls for the booking's settings, each named where staging sets it up. */
const BOOK_VISIT_ARG_TYPES = {
  step: {
    name: "Step",
    description: "How far the collector has come on /book",
    control: {
      type: "radio",
      labels: {
        service: "Service",
        location: "Shop",
        time: "Time",
        details: "Details",
        after: "After booking",
      },
    },
    options: ["service", "location", "time", "details", "after"],
  },
  service: {
    name: "Service",
    description: "The service picked, set up in the appointment admin",
    control: {
      type: "radio",
      labels: {
        free: "Grading drop-off, free",
        paid: "Bulk grading, paid now",
      },
    },
    options: ["free", "paid"],
  },
  phone: {
    name: "Phone",
    description:
      "Whether the service asks for a phone, in the appointment admin",
    control: {
      type: "radio",
      labels: { optional: "Optional", required: "The shop calls first" },
    },
    options: ["optional", "required"],
  },
  shopper: {
    name: "Shopper",
    description: "Signed in on the site or not, and the phone on their account",
    control: {
      type: "radio",
      labels: {
        signedOut: "Signed out",
        signedIn: "Signed in",
        signedInNoPhone: "Signed in, no phone on the account",
      },
    },
    options: ["signedOut", "signedIn", "signedInNoPhone"],
  },
  bookingFor: {
    name: "Booking for",
    description: "Who the collector books for, on the details step",
    control: {
      type: "radio",
      labels: { self: "Themselves", someone: "Someone else" },
    },
    options: ["self", "someone"],
  },
  time: {
    name: "Time",
    description:
      "The shop's diary for the day picked, in the appointment admin",
    control: {
      type: "radio",
      labels: {
        open: "Times free",
        taken: "The time picked was just taken",
        full: "The day is full",
      },
    },
    options: ["open", "taken", "full"],
    ...atStep("time"),
  },
  answer: {
    name: "Shop's answer",
    description: "How fast the booking request comes back",
    control: {
      type: "radio",
      labels: { books: "Answers at once", slow: "Slow network" },
    },
    options: ["books", "slow"],
    ...atStep("details"),
  },
  gate: {
    name: "This email",
    description:
      "What the shop finds for the email a signed-out collector books with: a live visit of this service, or 10 tries today",
    control: {
      type: "radio",
      labels: {
        passes: "Passes",
        held: "Already has this service booked",
        tries: "Too many tries today",
      },
    },
    options: ["passes", "held", "tries"],
    if: { arg: "shopper", eq: "signedOut" },
  },
  payment: {
    name: "Payment",
    description: "How the payment ended, for a paid service after booking",
    control: {
      type: "radio",
      labels: {
        booked: "Paid and booked",
        confirming: "Still confirming",
        expired: "Not completed",
      },
    },
    options: ["booked", "confirming", "expired"],
    if: { arg: "service", eq: "paid" },
  },
} as const;

/** The requirement that decides each setting's outcome. */
const BOOK_VISIT_RULES = {
  step: "grade10-site/appointment/booking: A collector books a visit without an account",
  service:
    "shared/ui/appointment-booking: The service and shop pickers report a choice",
  phone:
    "shared/ui/appointment-booking: The details form validates before reporting",
  shopper:
    "grade10-site/appointment/booking: A signed-in collector sees their own visits",
  bookingFor:
    "shared/ui/appointment-booking: The details form validates before reporting",
  time: "shared/ui/appointment-booking: The slot picker shows the diary honestly",
  answer: "shared/ui/appointment-booking: Async regions state their condition",
  gate: "grade10-site/appointment/booking: The anonymous write passes a gate",
} as const;

export type { BookVisitSettings };
export { BOOK_VISIT_ARG_TYPES, BOOK_VISIT_RULES, DEFAULT_VISIT, momentOf };
