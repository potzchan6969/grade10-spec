import { useState } from "react";
import { EventGoodToKnow } from "./event-good-to-know";
import { EventHeader, type EventHeaderNotice } from "./event-header";
import { type EventOrderLine, EventOrderSummary } from "./event-order-summary";
import { EventPageBody } from "./event-page-body";
import { EventPassCard } from "./event-pass-card";
import { EventPassRow } from "./event-pass-row";
import { EventPhoneOrderBar } from "./event-phone-order-bar";
import {
  FastPassControl,
  type FastPassLine,
  type FastPassSelection,
} from "./fast-pass-control";
import {
  BAR_COPY,
  FAST_PASS_COPY,
  GOOD_TO_KNOW_COPY,
  LIMIT_NOTE,
  NOTES,
  ORDER_COPY,
  VIP_PERKS,
  WAS,
} from "./fixtures";

/* A stand-in for the page: it holds the choice and words every value the
 * way the Main board's logic does, so a story can be pressed through. The
 * real page takes its prices and totals from the service. */

export type EventMode =
  | "onSale"
  | "earlyBird"
  | "notStarted"
  | "eventDay2"
  | "eventOver"
  | "canceled";

type KindId = "vip" | "adult2" | "child2" | "adult1" | "child1" | "earlyAdult";

type Kind = {
  id: KindId;
  name: string;
  label: string;
  who: string;
  early: number;
  full: number;
  days: number;
};

const KINDS: readonly Kind[] = [
  {
    id: "vip",
    name: "VIP Pass",
    label: "VIP",
    who: "",
    early: 1280,
    full: 1580,
    days: 2,
  },
  {
    id: "adult2",
    name: "General Pass (Two-Day), Adult",
    label: "Adult",
    who: "Ages [Product] and up",
    early: 380,
    full: 480,
    days: 2,
  },
  {
    id: "child2",
    name: "General Pass (Two-Day), Child",
    label: "Child",
    who: "[Ages: Product]",
    early: 190,
    full: 240,
    days: 2,
  },
  {
    id: "adult1",
    name: "General Pass (One-Day), Adult",
    label: "Adult",
    who: "Ages [Product] and up",
    early: 220,
    full: 280,
    days: 1,
  },
  {
    id: "child1",
    name: "General Pass (One-Day), Child",
    label: "Child",
    who: "[Ages: Product]",
    early: 110,
    full: 140,
    days: 1,
  },
  {
    id: "earlyAdult",
    name: "Members’ Pass (Two-Day), Adult",
    label: "Adult",
    who: "Ages [Product] and up",
    early: 350,
    full: 350,
    days: 2,
  },
];

type GroupId = "two" | "one" | "members";
type Group = {
  id: GroupId;
  name: string;
  admits: string;
  days: number;
  kinds: readonly KindId[];
};

const GROUPS: readonly Group[] = [
  {
    id: "two",
    name: "General Pass (Two-Day)",
    admits: "Any 2 days of the event, once a day",
    days: 2,
    kinds: ["adult2", "child2"],
  },
  {
    id: "one",
    name: "General Pass (One-Day)",
    admits: "Any 1 day of the event",
    days: 1,
    kinds: ["adult1", "child1"],
  },
];

const MEMBERS: Group = {
  id: "members",
  name: "Members’ Pass (Two-Day)",
  admits: "Any 2 days of the event, once a day",
  days: 2,
  kinds: ["earlyAdult"],
};

const LIMIT = 8;
const FAST = 100;
/** What one early-access rule lets this email hold. */
const RULE_LIMIT = 4;

const money = (n: number) =>
  `HK$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const whole = (n: number) => `HK$${n.toLocaleString("en-US")}`;
const dayWord = (n: number) => (n === 1 ? "1 day" : `${n} days`);
const peopleWord = (n: number) => (n === 1 ? "1 person" : `${n} people`);
const kindOf = (id: KindId) => KINDS.find((kind) => kind.id === id) as Kind;

type FastState = { each: boolean; all: number; per: Record<string, number> };
export type EventDemoChoice = {
  qty?: Partial<Record<KindId, number>>;
  fast?: Partial<Record<GroupId, Partial<FastState>>>;
};

export type EventPageDemoProps = {
  mode: EventMode;
  signedIn?: boolean;
  /** The buyer already holds tickets for this event. */
  holding?: boolean;
  /** A restricted event's preview, seen by its own audience. */
  preview?: boolean;
  /** Adds an early-access pass whose public sale opens later: `opens` to a
   * buyer no rule lets in, `forYou` to one a rule lets in now. */
  earlyAccess?: "opens" | "forYou";
  choice?: EventDemoChoice;
  onContinue?: () => void;
};

export function EventPageDemo({
  mode,
  signedIn = false,
  holding = false,
  preview = false,
  earlyAccess,
  choice,
  onContinue = () => {},
}: EventPageDemoProps) {
  const [qty, setQty] = useState<Partial<Record<KindId, number>>>(
    choice?.qty ?? {},
  );
  const [fast, setFast] = useState<Partial<Record<GroupId, FastState>>>(() => {
    const start: Partial<Record<GroupId, FastState>> = {};
    for (const [id, f] of Object.entries(choice?.fast ?? {})) {
      start[id as GroupId] = { each: false, all: 0, per: {}, ...f };
    }
    return start;
  });

  const isEarly = mode === "earlyBird" || mode === "notStarted";
  const day2 = mode === "eventDay2";
  const over = mode === "eventOver";
  const canceled = mode === "canceled";
  const selling = mode === "earlyBird" || mode === "onSale" || day2;
  const endedOf = (days: number) => over || (day2 && days === 2);
  const priceOf = (kind: Kind) => (isEarly ? kind.early : kind.full);
  const endedText = day2 ? "Sales ended when Sun 13 Dec began" : "Sales ended";
  const membersOpen = earlyAccess === "forYou";
  const sellsNow = (id: KindId) => {
    const kind = kindOf(id);
    if (id === "earlyAdult") return membersOpen && !endedOf(kind.days);
    return selling && !endedOf(kind.days);
  };
  const qtyOf = (id: KindId) => (sellsNow(id) ? (qty[id] ?? 0) : 0);
  const allIds: KindId[] = [
    "vip",
    ...GROUPS.flatMap((g) => g.kinds),
    ...(earlyAccess ? MEMBERS.kinds : []),
  ];
  const count = allIds.reduce((n, id) => n + qtyOf(id), 0);
  const room = LIMIT - count;
  const atLimit = (selling || membersOpen) && count >= LIMIT;

  const quantity = (id: KindId, extraMax = Number.POSITIVE_INFINITY) => {
    if (!sellsNow(id)) return undefined;
    const kind = kindOf(id);
    const value = qtyOf(id);
    return {
      value,
      max: Math.min(value + Math.max(0, room), extraMax),
      onValueChange: (next: number) =>
        setQty((prev) => ({ ...prev, [id]: next })),
      label: `How many tickets: ${kind.name}`,
      decrementLabel: `One fewer ${kind.name}`,
      incrementLabel: `One more ${kind.name}`,
    };
  };
  const priceView = (kind: Kind, ended: boolean) => ({
    price: money(priceOf(kind)),
    was:
      isEarly && !ended && kind.full > priceOf(kind)
        ? money(kind.full)
        : undefined,
    muted: ended,
  });

  const groups = [...GROUPS, ...(earlyAccess ? [MEMBERS] : [])];
  const groupView = groups.map((g) => {
    const ended = endedOf(g.days);
    const daysLeft = day2 ? 1 : g.days;
    const f = fast[g.id] ?? { each: false, all: 0, per: {} };
    const tickets: { key: string; label: string }[] = [];
    for (const id of g.kinds) {
      const n = qtyOf(id);
      for (let i = 0; i < n; i++)
        tickets.push({
          key: `${id}-${i}`,
          label: kindOf(id).label + (n > 1 ? ` ${i + 1}` : ""),
        });
    }
    const allDays = Math.min(f.all, daysLeft);
    const daysFor = (key: string) =>
      Math.min(f.each ? (f.per[key] ?? 0) : allDays, daysLeft);
    const slots = tickets.reduce((n, t) => n + daysFor(t.key), 0);
    const slotsAll = tickets.length * daysLeft;
    const setGroup = (next: (prev: FastState) => FastState) =>
      setFast((prev) => ({
        ...prev,
        [g.id]: next(prev[g.id] ?? { each: false, all: 0, per: {} }),
      }));
    const onDaysChange = (lineId: string, days: number) =>
      setGroup((prev) =>
        lineId === "everyone"
          ? { ...prev, each: false, all: days }
          : { ...prev, each: true, per: { ...prev.per, [lineId]: days } },
      );
    const onModeChange = (mode: FastPassSelection["mode"]) =>
      setGroup((prev) => {
        if (mode === "everyone") {
          const most = tickets.reduce(
            (m, t) => Math.max(m, Math.min(prev.per[t.key] ?? 0, daysLeft)),
            0,
          );
          return { ...prev, each: false, all: most };
        }
        const per: Record<string, number> = {};
        for (const t of tickets) per[t.key] = Math.min(prev.all, daysLeft);
        return { ...prev, each: true, per };
      });
    const onFillAll = () =>
      setGroup((prev) => {
        const per: Record<string, number> = {};
        for (const t of tickets) per[t.key] = daysLeft;
        return { ...prev, each: true, per };
      });
    const line = (
      id: string,
      label: string,
      days: number,
      people: number,
      who?: string,
    ): FastPassLine => ({
      id,
      label,
      who,
      days,
      daysText: dayWord(days),
      price: days ? `+${money(days * FAST * people)}` : undefined,
    });
    const missing = slotsAll - slots;
    const selection: FastPassSelection = f.each
      ? {
          mode: "each",
          people: tickets.map((t) => line(t.key, t.label, daysFor(t.key), 1)),
          tally: `${slots} of ${slotsAll} ${slotsAll === 1 ? "Fast Pass" : "Fast Passes"}: ${money(slots * FAST)}.`,
          nudge:
            missing > 0
              ? `${missing === 1 ? "1 more covers everyone" : `${missing} more cover everyone`}${daysLeft > 1 ? ", every day." : "."}`
              : "Everyone skips the queue.",
          fillLabel:
            missing > 0
              ? `Add for everyone (+${money(missing * FAST)})`
              : undefined,
        }
      : {
          mode: "everyone",
          everyone: line(
            "everyone",
            "Everyone",
            allDays,
            tickets.length,
            peopleWord(tickets.length),
          ),
        };
    return {
      g,
      ended,
      daysLeft,
      tickets,
      slots,
      selection,
      onDaysChange,
      onModeChange,
      onFillAll,
      sell: g.kinds.some(sellsNow),
    };
  });

  /* Your Order */
  const lines: EventOrderLine[] = [];
  let total = 0;
  let saving = 0;
  const addKind = (id: KindId) => {
    const q = qtyOf(id);
    if (q === 0) return;
    const kind = kindOf(id);
    const off = isEarly ? q * (kind.full - priceOf(kind)) : 0;
    saving += off;
    total += q * priceOf(kind);
    lines.push({
      id,
      label: `${q} × ${kind.name}`,
      amount: money(q * priceOf(kind)),
      was: off > 0 ? money(q * kind.full) : undefined,
    });
  };
  addKind("vip");
  for (const view of groupView) {
    for (const id of view.g.kinds) addKind(id);
    if (view.slots > 0) {
      total += view.slots * FAST;
      lines.push({
        id: `fast-${view.g.id}`,
        label: `Fast Pass × ${dayWord(view.slots)}`,
        amount: money(view.slots * FAST),
        onRemove: () =>
          setFast((prev) => ({
            ...prev,
            [view.g.id]: { each: false, all: 0, per: {} },
          })),
      });
    }
  }
  const general = groupView.filter((v) => v.sell && v.tickets.length > 0);
  const most = general.reduce((m, v) => Math.max(m, v.daysLeft), 0);
  const people = general.reduce((n, v) => n + v.tickets.length, 0);
  const addEveryone = (days: number) => () =>
    setFast((prev) => {
      const next = { ...prev };
      for (const v of general)
        next[v.g.id] = {
          each: false,
          all: Math.min(days, v.daysLeft),
          per: {},
        };
      return next;
    });
  const fastPassPrompt =
    general.length > 0 && !groupView.some((v) => v.slots > 0)
      ? {
          detail: `${whole(general.reduce((n, v) => n + v.tickets.length, 0) * FAST)} a day for ${peopleWord(people)}`,
          options:
            most > 1
              ? [
                  { id: "one", label: "Add 1 day", onAdd: addEveryone(1) },
                  {
                    id: "all",
                    label: most === 2 ? "Add both days" : "Add every day",
                    onAdd: addEveryone(most),
                  },
                ]
              : [
                  {
                    id: "all",
                    label: "Add for everyone",
                    onAdd: addEveryone(1),
                  },
                ],
        }
      : undefined;

  const countText = `${count} ${count === 1 ? "ticket" : "tickets"}`;
  const totalText = total === 0 && count > 0 ? "Free" : money(total);
  const points = signedIn
    ? count > 0
      ? `Earn about ${Math.floor(total).toLocaleString("en-US")} points on this order.`
      : "Paid tickets earn points."
    : "You will earn points in the Grade10 account for your email.";

  /* Header */
  const notices: EventHeaderNotice[] = [];
  if (signedIn && holding && !canceled)
    notices.push({
      kind: "holding",
      id: "holding",
      text: "You have tickets for this show.",
      actionLabel: "View Your Tickets",
      onAction: () => {},
    });
  if (preview)
    notices.push({
      kind: "alert",
      id: "preview",
      tone: "default",
      title: "Preview: only staff and allowed addresses can buy.",
      description:
        "The public sale hasn’t started. Orders placed now are real.",
    });
  if (canceled)
    notices.push({
      kind: "alert",
      id: "canceled",
      tone: "error",
      title: "This event is canceled.",
      description:
        "Every order is refunded in full to the card or WeChat Pay it was paid with. We’ve emailed everyone who bought tickets.",
    });
  if (over)
    notices.push({
      kind: "alert",
      id: "over",
      tone: "default",
      title: "This event has ended.",
      description:
        "Thanks to everyone who came. Your tickets stay in Your Tickets.",
    });

  const header = (
    <EventHeader
      about="[One line about the show: Product]"
      badges={[
        ...(day2 ? [{ label: "On Today", tone: "today" as const }] : []),
        ...(canceled ? [{ label: "Canceled", tone: "canceled" as const }] : []),
        ...(over ? [{ label: "Ended", tone: "ended" as const }] : []),
      ]}
      days={
        day2
          ? "Sat 12 Dec and Sun 13 Dec 2026 (today)"
          : "Sat 12 Dec and Sun 13 Dec 2026"
      }
      hours="10:00 to 19:00 each day"
      notices={notices}
      title="[Show Name]"
      venue="[Venue], Hong Kong"
    />
  );

  const vip = kindOf("vip");
  const vipEnded = endedOf(2);
  const opening =
    mode === "notStarted"
      ? {
          label: "On sale Mon 16 Nov, 12:00",
          countdown: "Opens in 1 day 21:42:10",
        }
      : undefined;

  const passes = canceled ? undefined : (
    <>
      <EventPassCard
        admits="Any 2 days of the event, once a day"
        badge={vipEnded ? { label: "Sales Ended", tone: "ended" } : undefined}
        copy={WAS}
        name="VIP Pass"
        opening={opening ? { label: opening.label } : undefined}
        perks={VIP_PERKS}
        price={priceView(vip, vipEnded)}
        quantity={quantity("vip")}
        variant="vip"
      />
      {groupView.map((view) => {
        const members = view.g.id === "members";
        const badge = view.ended
          ? { label: "Sales Ended", tone: "ended" as const }
          : members && membersOpen
            ? { label: "For you now", tone: "access" as const }
            : undefined;
        const note = view.ended
          ? endedText
          : members && membersOpen
            ? `Your early access lets this email hold ${RULE_LIMIT} before the public sale.`
            : undefined;
        return (
          <EventPassCard
            admits={
              day2 && view.g.days === 1 ? "Today, Sun 13 Dec" : view.g.admits
            }
            badge={badge}
            chosen={view.tickets.length > 0}
            copy={WAS}
            fastPass={
              view.tickets.length > 0 ? (
                <FastPassControl
                  copy={FAST_PASS_COPY}
                  maxDays={view.daysLeft}
                  maxDaysText={dayWord(view.daysLeft)}
                  onDaysChange={view.onDaysChange}
                  onFillAll={view.onFillAll}
                  onModeChange={
                    view.tickets.length > 1 ? view.onModeChange : undefined
                  }
                  selection={view.selection}
                />
              ) : undefined
            }
            key={view.g.id}
            name={view.g.name}
            note={note}
            opening={
              members && !membersOpen
                ? { label: "Opens Mon 16 Nov, 12:00" }
                : opening
            }
            variant="rows"
          >
            {view.g.kinds.map((id) => {
              const kind = kindOf(id);
              return (
                <EventPassRow
                  copy={WAS}
                  key={id}
                  label={kind.label}
                  note={
                    members && membersOpen
                      ? `Yours to buy: up to ${RULE_LIMIT}`
                      : undefined
                  }
                  price={priceView(kind, view.ended)}
                  quantity={quantity(id, members ? RULE_LIMIT : undefined)}
                  who={kind.who}
                />
              );
            })}
          </EventPassCard>
        );
      })}
    </>
  );

  const hint = (lead: string, link: string, tail = "") => (
    <>
      {lead} <a href="#sign-in">{link}</a>
      {tail}
    </>
  );

  return (
    <EventPageBody
      copy={{ passes: "Passes" }}
      goodToKnow={
        <EventGoodToKnow
          copy={GOOD_TO_KNOW_COPY}
          hints={
            !signedIn && !canceled && !over
              ? [
                  {
                    id: "access",
                    content: hint(
                      "Early access?",
                      "Sign in",
                      " to see your passes.",
                    ),
                  },
                  {
                    id: "lost",
                    content: hint(
                      "Lost your tickets?",
                      "Sign in with the email you bought with",
                      ".",
                    ),
                  },
                ]
              : undefined
          }
          notes={NOTES}
        />
      }
      header={header}
      limitNote={atLimit ? LIMIT_NOTE : undefined}
      order={
        selling || mode === "notStarted" || membersOpen ? (
          <EventOrderSummary
            copy={ORDER_COPY}
            count={countText}
            fastPassPrompt={fastPassPrompt}
            id="order"
            limitNote={atLimit ? LIMIT_NOTE : undefined}
            lines={lines}
            onContinue={onContinue}
            points={points}
            savingLine={
              saving > 0 ? (
                <>
                  <strong className="font-bold">
                    You save {money(saving)}
                  </strong>{" "}
                  with the early bird price.
                </>
              ) : undefined
            }
            total={totalText}
          />
        ) : undefined
      }
      passes={passes}
      phoneBar={
        count > 0 ? (
          <EventPhoneOrderBar
            copy={BAR_COPY}
            onContinue={onContinue}
            saving={saving > 0 ? money(saving) : undefined}
            seeOrder={`${countText}, see order`}
            total={totalText}
          />
        ) : undefined
      }
    />
  );
}
