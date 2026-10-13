import { GRADING_VISIT_RECORD, VISIT_RECORD } from "../../vault-content";

/** The grading visit as the collector books it: Thu 3 Sep 10:00 to 10:30. */
export const BOOKED_GRADING_RECORD = {
  ...GRADING_VISIT_RECORD,
  id: "bk_grading_new",
  start: Date.UTC(2026, 8, 3, 2, 0),
  end: Date.UTC(2026, 8, 3, 2, 30),
};

/** The vault visit the collector moves from the link: Thu 3 Sep 10:15. */
export const MANAGED_VISIT_RECORD = VISIT_RECORD;

export const BOOK_WITHOUT_ACCOUNT_CASES = {
  service: "Collector chooses Grading Submission",
  shop: "Collector picks a shop",
  slot: "Collector picks a day and a time",
  details: "Collector gives a name and an email",
  booked: "Collector sees the visit booked",
} as const;

/** The shop step's heading in the booking flow. */
export const LOCATION_PICKER_COPY = { title: "Pick a shop" } as const;

export const MANAGE_AND_SEE_MINE_CASES = {
  live: "Collector opens the link and sees the visit",
  moving: "Collector moves the visit to another time",
  cancelled: "Collector sees the visit cancelled",
  mine: "Collector sees every visit under their email",
} as const;

export const BOOK_WITHOUT_ACCOUNT_DESCRIPTION =
  "A collector books a grading visit with a name and an email and no account. The steps are the service, then the shop, then a day and a time, then the details, and the confirmation ends the flow with the manage link. Booking is refused when the time is taken meanwhile.";

export const MANAGE_AND_SEE_MINE_DESCRIPTION =
  "The collector opens the link from the mail and sees one visit: its time, its place and Move or Cancel. Moving opens the same day and time picks as the booking, and a cancel is reported only after confirmation. Signed in, every visit under the address is listed.";
