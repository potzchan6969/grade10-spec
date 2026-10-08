import { describe, expect, it } from "vitest";
import { sharedEn, sharedZhHant } from "./catalogs.ts";

const KINDS = [
  "short_text",
  "long_text",
  "number",
  "select",
  "radio",
  "checkboxes",
];

const APPOINTMENT_KEYS = [
  "details.choose",
  "details.phoneIncomplete",
  "details.phonePlaceholder",
  ...KINDS.map((kind) => `details.kinds.${kind}`),
  "confirmation.beforeYouCome",
  "confirmation.answers",
  "state.checked_in",
  "state.completed",
  "state.no_show",
];

const EMAIL_KEYS = ["beforeYouCome", "cancelledReason"];

const read = (tree: unknown, path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      tree,
    );

describe.each([
  ["en", sharedEn],
  ["zh-Hant", sharedZhHant],
])("the visit words in %s", (_locale, catalog) => {
  it.each(APPOINTMENT_KEYS)("appointment.%s is worded", (key) => {
    expect(read(catalog.appointment, key)).toEqual(expect.any(String));
    expect(read(catalog.appointment, key)).not.toBe("");
  });

  it.each(EMAIL_KEYS)("email.appointment.%s is worded", (key) => {
    expect(read(catalog.email.appointment, key)).toEqual(expect.any(String));
    expect(read(catalog.email.appointment, key)).not.toBe("");
  });
});

it("names the customer's three closed states", () => {
  expect(sharedEn.appointment.state).toMatchObject({
    checked_in: "Checked in",
    completed: "Visited",
    no_show: "Missed",
  });
});
