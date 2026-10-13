import type { ReactNode } from "react";

/** How a visit or a ticket stands, as its badge colours it. */
type VisitTone = "plain" | "ink" | "info" | "ok" | "warn" | "bad";

/** One act a page offers: a link leaves the page, a press runs here; a link
 * with a press runs it as it leaves (a calendar file saved, then said). */
type VisitAct = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  /** The page's one main act, across the whole row. */
  primary?: boolean;
  /** A secondary act across the whole row. */
  wide?: boolean;
  /** Opens outside the site: maps, the phone's dialler. */
  external?: boolean;
};

/** One line of the visit's facts, as the consumer worded it. */
type VisitFact = {
  label: string;
  value: string;
  sub?: string;
  /** Struck through: the time of a visit that is off. */
  struck?: boolean;
  mono?: boolean;
};

/** One visit in the collector's list, every value display-ready. */
type VisitListRow = {
  id: string;
  service: ReactNode;
  /** The word for where the visit stands. */
  status: string;
  location: ReactNode;
  /** The visit's day and times, formatted. */
  when: string;
  /** The status badge's colour; plain when omitted. */
  tone?: VisitTone;
  /** Where the row leads; without it the row is a press that opens it. */
  href?: string;
};

/** A notice's tint: a live update, a plain word, or a warning. */
type VisitNoticeTone = "info" | "plain" | "warn";

/** The glyph a notice leads with. */
type VisitNoticeIcon = "info" | "message" | "weather";

/** One way a collector may say why they cancel. */
type VisitCancelReason = "cant" | "wrong" | "other";

/** One pick of how late the collector runs, worded by the consumer. */
type VisitLateChoice = {
  minutes: number;
  label: string;
  /** Whether the counter is still held then, in words. */
  detail: string;
};

/** One shop's earliest free time when today offers nothing. */
type VisitFullDayShop = {
  id: string;
  name: string;
  /** The earliest time, worded; absent when the shop has none yet. */
  earliest?: string;
};

/** One service on the walk-in wait page. */
type VisitWaitService = {
  id: string;
  name: string;
  /** The line under the name: what it fits, or why walk-ins are off. */
  sub: string;
  /** The wait now, when walk-ins run. */
  wait?: { estimate: string; waiting: string };
  /** Book a time for this service, when it is booked rather than walked. */
  book?: { href: string; label: string };
};

/** One other shop open today, with its hours worded. */
type VisitWaitShop = { id: string; name: string; hours: string };

export type {
  VisitAct,
  VisitCancelReason,
  VisitFact,
  VisitFullDayShop,
  VisitLateChoice,
  VisitListRow,
  VisitNoticeIcon,
  VisitNoticeTone,
  VisitTone,
  VisitWaitService,
  VisitWaitShop,
};
