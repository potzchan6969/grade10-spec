import {
  EventGoodToKnow,
  EventHeader,
  type EventHeaderNotice,
  type EventOrderLine,
  EventOrderSummary,
  EventPageBody,
  EventPageState,
  EventPassCard,
  EventPassRow,
  EventPhoneOrderBar,
  FastPassControl,
  type FastPassLine,
  type FastPassSelection,
  TicketWaitingLineJoin,
  TicketWaitingLineOffer,
  TicketWaitingLinePlace,
} from "@grade10/ui";
import { type ReactNode, useState } from "react";
import { TicketingSite } from "../ticketing-site";
import { hkd, hkdWhole, rich, SHOW, T, t } from "../ticketing-words";
import {
  BAR_COPY,
  FAST_PASS_COPY,
  GOOD_TO_KNOW_NOTES,
  ORDER_COPY,
  PASS_COPY,
} from "./buying-content";

/* The event page as the site assembles it, holding the buyer's choice the
 * way the Main board's logic does so a story can be pressed through. Every
 * word is the catalog's; the site takes prices and totals from the
 * service. */

export type EventMode =
  | "onSale"
  | "earlyBird"
  | "notStarted"
  | "eventDay2"
  | "eventOver"
  | "cancelled";

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
  days: number;
  kinds: readonly KindId[];
};

const GROUPS: readonly Group[] = [
  {
    id: "two",
    name: "General Pass (Two-Day)",
    days: 2,
    kinds: ["adult2", "child2"],
  },
  {
    id: "one",
    name: "General Pass (One-Day)",
    days: 1,
    kinds: ["adult1", "child1"],
  },
];

const MEMBERS: Group = {
  id: "members",
  name: "Members’ Pass (Two-Day)",
  days: 2,
  kinds: ["earlyAdult"],
};

/** What one early-access rule lets this email hold. */
const RULE_LIMIT = 4;
const PUBLIC_SALE = "Mon 16 Nov, 12:00";

const kindOf = (id: KindId) => KINDS.find((kind) => kind.id === id) as Kind;
const dayCount = (count: number) => t(T.common.dayCount, { count });
const peopleCount = (count: number) => t(T.common.peopleCount, { count });
const ticketCount = (count: number) => t(T.common.ticketCount, { count });

type FastState = { each: boolean; all: number; per: Record<string, number> };
export type EventChoice = {
  qty?: Partial<Record<KindId, number>>;
  fast?: Partial<Record<GroupId, Partial<FastState>>>;
};

export type EventPageProps = {
  mode: EventMode;
  signedIn?: boolean;
  /** The buyer already holds tickets for this event. */
  holding?: boolean;
  /** A restricted event's preview, seen by its own audience. */
  preview?: boolean;
  /** An early-access pass whose public sale opens later: `opens` to a buyer
   * no rule lets in, `forYou` to one a rule lets in now. */
  earlyAccess?: "opens" | "forYou";
  choice?: EventChoice;
  /** The VIP pass sold out, and where this buyer stands in its waiting
   * line. */
  waitingLine?: WaitingLineState;
  /** The early bird says when it ends, on each pass. */
  earlyBirdEnds?: boolean;
  onContinue?: () => void;
  onViewYourTickets?: () => void;
};

export type WaitingLineState =
  | "join"
  | "joining"
  | "joinRefused"
  | "offerEnded"
  | "place"
  | "offer"
  | "accepting";

const OFFER_DEADLINE = "14:47, Sat 28 Nov";
const EARLY_BIRD_ENDS = "Sun 29 Nov, 23:59";

/** The VIP pass's waiting line as this buyer meets it. */
function VipWaitingLine({ state }: { state: WaitingLineState }) {
  const [wanted, setWanted] = useState(2);
  const W = T.event.waitingLine;
  if (state === "place")
    return (
      <TicketWaitingLinePlace
        copy={{
          title: W.place.title,
          wanted: t(W.place.wanted, { count: wanted }),
          band: t(W.place.band, { band: "front" }),
          note: W.note,
          leave: W.place.leave,
        }}
        onLeave={() => {}}
      />
    );
  if (state === "offer" || state === "accepting")
    return (
      <TicketWaitingLineOffer
        accepting={state === "accepting"}
        copy={{
          title: W.offer.title,
          body: t(W.offer.body, { count: 2, deadline: OFFER_DEADLINE }),
          accept: W.offer.accept,
          decline: W.offer.decline,
        }}
        onAccept={() => {}}
        onDecline={() => {}}
      />
    );
  return (
    <TicketWaitingLineJoin
      copy={{ join: T.event.pass.joinWaitingLine, note: W.note }}
      ended={state === "offerEnded" ? W.offerEnded : undefined}
      onJoin={() => {}}
      pending={state === "joining"}
      quantity={{
        value: wanted,
        max: SHOW.limit,
        onValueChange: setWanted,
        label: t(W.quantityLabel, { pass: "VIP Pass" }),
        decrementLabel: t(W.decrement, { pass: "VIP Pass" }),
        incrementLabel: t(W.increment, { pass: "VIP Pass" }),
      }}
      refusal={
        state === "joinRefused"
          ? {
              title: t(T.refusals.ticketsLeft.title, { count: 2 }),
              body: T.refusals.ticketsLeft.body,
            }
          : undefined
      }
    />
  );
}

/** The page while there is no event to show: loading, not found, or a
 * restricted event closed to this account. */
export function EventPageMessage({
  kind,
  signedIn = false,
  onSeeShows = () => {},
  onSignIn = () => {},
}: {
  kind: "loading" | "missing" | "closed";
  signedIn?: boolean;
  onSeeShows?: () => void;
  onSignIn?: () => void;
}) {
  return (
    <TicketingSite session={signedIn ? "signed-in" : "signed-out"}>
      {kind === "loading" ? (
        <EventPageState copy={{ label: T.event.loading }} kind="loading" />
      ) : kind === "missing" ? (
        <EventPageState
          copy={{
            title: T.event.notFound.title,
            body: signedIn
              ? T.event.notFound.body
              : T.event.notFound.bodySignedOut,
            signIn: T.common.signIn,
            seeShows: T.common.seeTheShows,
          }}
          kind="missing"
          onSeeShows={onSeeShows}
          onSignIn={signedIn ? undefined : onSignIn}
        />
      ) : (
        <EventPageState
          copy={{
            title: T.event.notOpen.title,
            body: T.event.notOpen.body,
            seeShows: T.common.seeTheShows,
          }}
          kind="closed"
          onSeeShows={onSeeShows}
        />
      )}
    </TicketingSite>
  );
}

export function EventPage({
  mode,
  signedIn = false,
  holding = false,
  preview = false,
  earlyAccess,
  choice,
  waitingLine,
  earlyBirdEnds = false,
  onContinue = () => {},
  onViewYourTickets = () => {},
}: EventPageProps) {
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
  const cancelled = mode === "cancelled";
  const selling = mode === "earlyBird" || mode === "onSale" || day2;
  const endedOf = (days: number) => over || (day2 && days === 2);
  const priceOf = (kind: Kind) => (isEarly ? kind.early : kind.full);
  const endedText = day2
    ? t(T.event.pass.salesEndedWhen, { day: "Sun 13 Dec" })
    : T.event.pass.salesEndedNote;
  const membersOpen = earlyAccess === "forYou";
  const sellsNow = (id: KindId) => {
    const kind = kindOf(id);
    if (id === "vip" && waitingLine) return false;
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
  const room = SHOW.limit - count;
  const atLimit = (selling || membersOpen) && count >= SHOW.limit;
  const limitNote = atLimit
    ? t(T.event.limit, { count: SHOW.limit })
    : undefined;

  const quantity = (id: KindId, extraMax = Number.POSITIVE_INFINITY) => {
    if (!sellsNow(id)) return undefined;
    const kind = kindOf(id);
    const value = qtyOf(id);
    return {
      value,
      max: Math.min(value + Math.max(0, room), extraMax),
      onValueChange: (next: number) =>
        setQty((prev) => ({ ...prev, [id]: next })),
      label: t(T.event.pass.quantityLabel, { pass: kind.name }),
      decrementLabel: t(T.event.pass.decrement, { pass: kind.name }),
      incrementLabel: t(T.event.pass.increment, { pass: kind.name }),
    };
  };
  const priceView = (kind: Kind, ended: boolean) => ({
    price: hkd(priceOf(kind)),
    was:
      isEarly && !ended && kind.full > priceOf(kind)
        ? hkd(kind.full)
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
          label:
            n > 1
              ? t(T.event.fastPass.person, {
                  label: kindOf(id).label,
                  ordinal: i + 1,
                })
              : kindOf(id).label,
        });
    }
    const allDays = Math.min(f.all, daysLeft);
    const daysFor = (key: string) =>
      Math.min(f.each ? (f.per[key] ?? 0) : allDays, daysLeft);
    const slots = tickets.reduce((n, ticket) => n + daysFor(ticket.key), 0);
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
    const onModeChange = (next: FastPassSelection["mode"]) =>
      setGroup((prev) => {
        if (next === "everyone") {
          const most = tickets.reduce(
            (m, ticket) =>
              Math.max(m, Math.min(prev.per[ticket.key] ?? 0, daysLeft)),
            0,
          );
          return { ...prev, each: false, all: most };
        }
        const per: Record<string, number> = {};
        for (const ticket of tickets)
          per[ticket.key] = Math.min(prev.all, daysLeft);
        return { ...prev, each: true, per };
      });
    const onFillAll = () =>
      setGroup((prev) => {
        const per: Record<string, number> = {};
        for (const ticket of tickets) per[ticket.key] = daysLeft;
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
      daysText: dayCount(days),
      price: days
        ? t(T.event.fastPass.price, {
            amount: hkd(days * SHOW.fastPassPrice * people),
          })
        : undefined,
    });
    const missing = slotsAll - slots;
    const selection: FastPassSelection = f.each
      ? {
          mode: "each",
          people: tickets.map((ticket) =>
            line(ticket.key, ticket.label, daysFor(ticket.key), 1),
          ),
          tally: t(T.event.fastPass.summary, {
            on: slots,
            all: slotsAll,
            amount: hkd(slots * SHOW.fastPassPrice),
          }),
          nudge:
            missing > 0
              ? t(T.event.fastPass.nudge, {
                  missing,
                  everyDay: daysLeft > 1 ? "yes" : "no",
                })
              : T.event.fastPass.covered,
          fillLabel:
            missing > 0
              ? t(T.event.fastPass.fillAll, {
                  amount: hkd(missing * SHOW.fastPassPrice),
                })
              : undefined,
        }
      : {
          mode: "everyone",
          everyone: line(
            "everyone",
            T.event.fastPass.everyone,
            allDays,
            tickets.length,
            peopleCount(tickets.length),
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
      label: t(T.common.lineQuantity, { quantity: q, pass: kind.name }),
      amount: hkd(q * priceOf(kind)),
      was: off > 0 ? hkd(q * kind.full) : undefined,
    });
  };
  addKind("vip");
  for (const view of groupView) {
    for (const id of view.g.kinds) addKind(id);
    if (view.slots > 0) {
      total += view.slots * SHOW.fastPassPrice;
      lines.push({
        id: `fast-${view.g.id}`,
        label: t(T.event.order.fastPassLine, { count: view.slots }),
        amount: hkd(view.slots * SHOW.fastPassPrice),
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
          detail: t(T.event.order.upsellSub, {
            amount: hkdWhole(people * SHOW.fastPassPrice),
            people,
          }),
          options:
            most > 1
              ? [
                  {
                    id: "one",
                    label: T.event.order.addOneDay,
                    onAdd: addEveryone(1),
                  },
                  {
                    id: "all",
                    label:
                      most === 2
                        ? T.event.order.addBothDays
                        : T.event.order.addEveryDay,
                    onAdd: addEveryone(most),
                  },
                ]
              : [
                  {
                    id: "all",
                    label: T.event.order.addForEveryone,
                    onAdd: addEveryone(1),
                  },
                ],
        }
      : undefined;

  const countText = ticketCount(count);
  const totalText = total === 0 && count > 0 ? T.summary.free : hkd(total);
  const points = signedIn
    ? count > 0
      ? t(T.event.order.pointsAbout, {
          points: Math.floor(total / 10).toLocaleString("en-US"),
        })
      : T.event.order.pointsPaidOnly
    : T.event.order.pointsSignedOut;

  /* Header */
  const notices: EventHeaderNotice[] = [];
  if (signedIn && holding && !cancelled)
    notices.push({
      kind: "holding",
      id: "holding",
      text: T.event.youHaveTickets,
      actionLabel: T.event.viewYourTickets,
      onAction: onViewYourTickets,
    });
  if (preview)
    notices.push({
      kind: "alert",
      id: "preview",
      tone: "default",
      title: T.event.restricted.title,
      description: T.event.restricted.body,
    });
  if (cancelled)
    notices.push({
      kind: "alert",
      id: "cancelled",
      tone: "error",
      title: T.event.cancelledNotice.title,
      description: T.event.cancelledNotice.body,
    });
  if (over)
    notices.push({
      kind: "alert",
      id: "over",
      tone: "default",
      title: T.event.endedNotice.title,
      description: T.event.endedNotice.body,
    });

  const header = (
    <EventHeader
      about={SHOW.about}
      badges={[
        ...(day2
          ? [{ label: T.event.badge.onToday, tone: "today" as const }]
          : []),
        ...(cancelled
          ? [{ label: T.event.badge.cancelled, tone: "canceled" as const }]
          : []),
        ...(over
          ? [{ label: T.event.badge.ended, tone: "ended" as const }]
          : []),
      ]}
      days={day2 ? `${SHOW.days} (today)` : SHOW.days}
      hours={t(T.event.timesEachDay, { start: SHOW.start, end: SHOW.end })}
      notices={notices}
      title={SHOW.name}
      venue={SHOW.venue}
    />
  );

  const vip = kindOf("vip");
  const vipEnded = endedOf(2);
  const opening =
    mode === "notStarted"
      ? {
          label: t(T.event.pass.onSaleAt, { date: PUBLIC_SALE }),
          countdown: t(T.event.pass.opensIn, { countdown: "1 day 21:42:10" }),
        }
      : undefined;
  const salesEnded = { label: T.event.pass.salesEnded, tone: "ended" as const };
  const endsLine =
    earlyBirdEnds && mode === "earlyBird"
      ? t(T.event.pass.earlyBirdEnds, { date: EARLY_BIRD_ENDS })
      : undefined;
  const vipLine: ReactNode =
    waitingLine && !vipEnded ? <VipWaitingLine state={waitingLine} /> : null;

  const passes = cancelled ? undefined : (
    <>
      <EventPassCard
        admits={t(T.event.pass.admitsAnyDays, { count: 2 })}
        badge={
          vipEnded
            ? salesEnded
            : waitingLine
              ? { label: T.event.pass.soldOut, tone: "ended" as const }
              : undefined
        }
        copy={PASS_COPY}
        earlyBirdEnds={waitingLine ? undefined : endsLine}
        name="VIP Pass"
        opening={opening ? { label: opening.label } : undefined}
        perks={[
          {
            id: "fast",
            kind: "fastPass",
            lead: T.event.vip.fastPassEveryDay,
            text: t(T.event.vip.skipQueue, { days: 2 }),
          },
          {
            id: "days",
            kind: "check",
            text: t(T.event.vip.everyDay, {
              days: 2,
              dates: "Sat 12 and Sun 13 Dec",
            }),
          },
          {
            id: "more",
            kind: "check",
            text: "[More VIP perks, if any: Product]",
          },
        ]}
        price={priceView(vip, vipEnded)}
        quantity={quantity("vip")}
        variant="vip"
        waitingLine={vipLine}
      />
      {groupView.map((view) => {
        const members = view.g.id === "members";
        const badge = view.ended
          ? salesEnded
          : members && membersOpen
            ? { label: T.event.earlyAccess.forYouNow, tone: "access" as const }
            : undefined;
        const note = view.ended
          ? endedText
          : members && membersOpen
            ? t(T.event.earlyAccess.limitNote, { count: RULE_LIMIT })
            : undefined;
        return (
          <EventPassCard
            admits={
              day2 && view.g.days === 1
                ? t(T.event.pass.today, { date: "Sun 13 Dec" })
                : t(T.event.pass.admitsAnyDays, { count: view.g.days })
            }
            badge={badge}
            chosen={view.tickets.length > 0}
            copy={PASS_COPY}
            earlyBirdEnds={
              view.ended || view.g.id === "members" ? undefined : endsLine
            }
            fastPass={
              view.tickets.length > 0 ? (
                <FastPassControl
                  copy={FAST_PASS_COPY}
                  maxDays={view.daysLeft}
                  maxDaysText={dayCount(view.daysLeft)}
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
                ? { label: t(T.event.earlyAccess.opens, { date: PUBLIC_SALE }) }
                : opening
            }
            variant="rows"
          >
            {view.g.kinds.map((id) => {
              const kind = kindOf(id);
              return (
                <EventPassRow
                  copy={PASS_COPY}
                  key={id}
                  label={kind.label}
                  note={
                    members && membersOpen
                      ? t(T.event.earlyAccess.yoursToBuy, { count: RULE_LIMIT })
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

  const signInLink = (chunk: string) => <a href="#sign-in">{chunk}</a>;

  return (
    <TicketingSite session={signedIn ? "signed-in" : "signed-out"}>
      <EventPageBody
        copy={{ passes: T.event.passesLabel }}
        goodToKnow={
          <EventGoodToKnow
            copy={{ label: T.event.goodToKnow.title }}
            hints={
              !signedIn && !cancelled && !over
                ? [
                    {
                      id: "access",
                      content: rich(
                        T.event.signInPrompt,
                        {},
                        { signin: signInLink },
                      ),
                    },
                    {
                      id: "lost",
                      content: rich(
                        T.event.lostTickets,
                        {},
                        { signin: signInLink },
                      ),
                    },
                  ]
                : undefined
            }
            notes={GOOD_TO_KNOW_NOTES}
          />
        }
        header={header}
        limitNote={limitNote}
        order={
          selling || mode === "notStarted" || membersOpen ? (
            <EventOrderSummary
              copy={ORDER_COPY}
              count={countText}
              fastPassPrompt={fastPassPrompt}
              id="order"
              limitNote={limitNote}
              lines={lines}
              onContinue={onContinue}
              points={points}
              savingLine={
                saving > 0
                  ? rich(
                      T.event.order.youSaveEarlyBird,
                      { amount: hkd(saving) },
                      {
                        strong: (chunk) => (
                          <strong className="font-bold">{chunk}</strong>
                        ),
                      },
                    )
                  : undefined
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
              saving={saving > 0 ? hkd(saving) : undefined}
              seeOrder={t(T.event.order.seeOrder, { count })}
              total={totalText}
            />
          ) : undefined
        }
      />
    </TicketingSite>
  );
}
