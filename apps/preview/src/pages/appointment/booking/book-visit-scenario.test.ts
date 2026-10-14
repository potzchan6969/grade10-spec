import { describe, expect, it } from "vitest";
import { preset, type Scenario } from "./book-visit-page";
import {
  type BookVisitSettings,
  DEFAULT_VISIT,
  momentOf,
} from "./book-visit-scenario";

/** Each Book Visit state story, as the settings that reach it. */
const REACHED: [Scenario, Partial<BookVisitSettings>][] = [
  ["time just taken", { step: "time", time: "taken" }],
  ["full day", { step: "time", time: "full" }],
  ["already booked signed out", { shopper: "signedOut", gate: "held" }],
  ["too many tries today", { shopper: "signedOut", gate: "tries" }],
  ["slow network", { answer: "slow" }],
  ["signed in, no phone on account", { shopper: "signedInNoPhone" }],
  ["service needs a phone", { shopper: "signedOut", phone: "required" }],
  ["paid service", { service: "paid" }],
  ["booking for someone else", { bookingFor: "someone" }],
  [
    "confirming payment",
    { service: "paid", step: "after", payment: "confirming" },
  ],
  ["paid and booked", { service: "paid", step: "after" }],
  [
    "payment not completed",
    { service: "paid", step: "after", payment: "expired" },
  ],
];

describe("momentOf", () => {
  it.each(REACHED)("reaches %s", (scenario, settings) => {
    expect(momentOf({ ...DEFAULT_VISIT, ...settings })).toEqual(
      preset(scenario),
    );
  });

  it("lets a signed-in collector past the gate", () => {
    expect(momentOf({ ...DEFAULT_VISIT, gate: "tries" }).refusal).toBeNull();
  });

  it("books a free service at once, whatever the payment says", () => {
    expect(
      momentOf({ ...DEFAULT_VISIT, step: "after", payment: "expired" }).phase,
    ).toBe("booked");
  });
});
