import { formatWeekdayMoment } from "@grade10/date";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import {
  type BookingSlot,
  type BookingSlotPickerCopy,
  type VisitAct,
  VisitBody,
  type VisitBodyCopy,
  VisitBookedPass,
  VisitCancelPanel,
  type VisitCancelReason,
  type VisitCancelRefund,
  type VisitFact,
  VisitLinkOpensNothing,
  VisitMovePanel,
  type VisitTone,
} from "@grade10/ui";
import { type ReactNode, useState } from "react";
import {
  firstAvailableVisitDay,
  SLOT_PICKER_COPY,
  slotsForVisitDay,
  VISIT_CONFIRMATION_COPY,
  VISIT_DAYS,
  VISIT_MAX_MONTH,
  VISIT_MIN_MONTH,
  VISIT_RECORD,
  VISIT_TIME_ZONE,
} from "../../vault-content";
import { AppointmentPageShell } from "../../vault-shared";
import {
  BEFORE_NOTES,
  BOOK_AGAIN_ACT,
  BOOK_HREF,
  BOOKED_BEFORE,
  BOOKED_COPY,
  BOOKED_PASS_COPY,
  CANCEL_PANEL_COPY,
  CANCELLED_SHOP_COPY,
  CANCELLED_YOU_COPY,
  COMPLETED_COPY,
  DIRECTIONS_ACT,
  DIRECTIONS_HREF,
  EMAIL,
  endedFacts,
  GET_THERE_ROWS,
  LINK_OPENS_NOTHING_COPY,
  MINE_ACT,
  MINE_HREF,
  MISSED_COPY,
  MOVE_PANEL_COPY,
  PAID_BEFORE,
  PAID_FACTS,
  PICK_ANOTHER_ACT,
  paidOffFacts,
  RECONNECTING_COPY,
  REFUND_DUE,
  REFUND_KEPT,
  REFUNDED_COPY,
  REFUNDED_FACT,
  REFUNDING_COPY,
  REFUNDING_FACT,
  SERVICE,
  SHOP_CLOSED_COPY,
  TOLD_ROWS,
  VAULT_FACTS,
  VISIT_FACTS,
  VISIT_NAME,
  WITH_GRADING_COPY,
  WITH_VAULT_COPY,
} from "./appointment-visit-content";

export type VisitState =
  | "booked"
  | "justBooked"
  | "completed"
  | "missed"
  | "cancelledYou"
  | "cancelledShop"
  | "shopClosed"
  | "reconnecting"
  | "linkOpensNothing"
  | "paid"
  | "paidRefunded"
  | "withGrading"
  | "withVault";

type Panel = "move" | "cancel";

/** The strip and the grouped times, as the Change time sheet reads them. */
const MOVE_SLOT_COPY: BookingSlotPickerCopy = {
  ...SLOT_PICKER_COPY,
  timeTitle: "Pick a time",
  weekdays: {
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
  },
  full: "Full",
  closed: "Closed",
  stripTitle: "{from} to {to}",
  earlierDays: "Earlier days",
  laterDays: "Later days",
  parts: { morning: "Morning", afternoon: "Afternoon", evening: "Evening" },
};

function VisitShell({ children }: { children: ReactNode }) {
  return (
    <AppointmentPageShell>
      <div className="mx-auto w-full max-w-xl">{children}</div>
      <Toast position="bottom-center" />
    </AppointmentPageShell>
  );
}

const moment = (at: number) =>
  formatWeekdayMoment(at, { timeZone: VISIT_TIME_ZONE });

/**
 * A visit before the day, free or paid: Change time and Cancel open their
 * sheets, and what the collector did is toasted.
 */
function BookedVisit({
  offline = false,
  paid = false,
  refund,
  opened = null,
}: {
  offline?: boolean;
  paid?: boolean;
  refund?: VisitCancelRefund;
  opened?: Panel | null;
}) {
  const [panel, setPanel] = useState<Panel | null>(opened);
  const [said, setSaid] = useState<string | undefined>();
  const [cancelled, setCancelled] = useState(false);
  const [reason, setReason] = useState<VisitCancelReason | null>(null);
  const [more, setMore] = useState("");
  const [month, setMonth] = useState(VISIT_MIN_MONTH);
  const [date, setDate] = useState<string | undefined>("2026-09-03");
  const [pick, setPick] = useState<BookingSlot | undefined>();

  if (cancelled) {
    return paid ? (
      <VisitBody
        acts={[BOOK_AGAIN_ACT, MINE_ACT]}
        copy={{ ...REFUNDING_COPY, said }}
        facts={paidOffFacts(REFUNDING_FACT)}
        onDismiss={() => setSaid(undefined)}
        tone="bad"
      />
    ) : (
      <VisitBody
        acts={[BOOK_AGAIN_ACT, MINE_ACT]}
        copy={{ ...CANCELLED_YOU_COPY, said }}
        facts={endedFacts(true)}
        onDismiss={() => setSaid(undefined)}
        tone="bad"
      />
    );
  }

  const acts: VisitAct[] = [
    { key: "move", label: "Change time", onClick: () => setPanel("move") },
    { key: "cancel", label: "Cancel visit", onClick: () => setPanel("cancel") },
    {
      key: "calendar",
      label: "Add to calendar",
      onClick: () => setSaid("Calendar file saved: Thu 3 Sep, 10:15 to 10:45"),
    },
    DIRECTIONS_ACT,
  ];
  const copy: VisitBodyCopy = { ...BOOKED_COPY, said };

  return (
    <VisitBody
      acts={acts}
      before={paid ? PAID_BEFORE : BEFORE_NOTES}
      copy={copy}
      facts={paid ? PAID_FACTS : VISIT_FACTS}
      name={VISIT_NAME}
      onDismiss={() => setSaid(undefined)}
      panel={
        panel === "cancel" ? (
          <VisitCancelPanel
            copy={CANCEL_PANEL_COPY}
            more={more}
            onClose={() => setPanel(null)}
            onConfirm={() => {
              setPanel(null);
              setCancelled(true);
              setSaid(
                paid && refund?.tone === "ok"
                  ? "Visit cancelled. HK$100.00 is on its way back to your card."
                  : `Visit cancelled. We emailed ${EMAIL}.`,
              );
            }}
            onMoreChange={setMore}
            onReasonChange={setReason}
            pending={false}
            reason={reason}
            refund={paid ? refund : undefined}
          />
        ) : panel === "move" ? (
          <VisitMovePanel
            copy={{
              ...MOVE_PANEL_COPY,
              confirm: pick
                ? `Move to ${moment(pick.start)}`
                : MOVE_PANEL_COPY.confirm,
            }}
            onClose={() => setPanel(null)}
            onConfirm={() => {
              if (!pick) return;
              setPanel(null);
              setSaid(`Moved to ${moment(pick.start)}. We emailed ${EMAIL}.`);
            }}
            pending={false}
            picked={!!pick}
            slotPicker={{
              copy: MOVE_SLOT_COPY,
              month,
              minMonth: VISIT_MIN_MONTH,
              maxMonth: VISIT_MAX_MONTH,
              days: { status: "ready", data: VISIT_DAYS },
              selectedDate: date,
              slots: date
                ? { status: "ready", data: slotsForVisitDay(date) }
                : { status: "ready", data: [] },
              selectedStart: pick?.start,
              timeZone: VISIT_TIME_ZONE,
              today: "2026-09-01",
              onMonthChange: (next) => {
                setMonth(next);
                setDate(firstAvailableVisitDay(next));
                setPick(undefined);
              },
              onSelectDay: (next) => {
                setDate(next);
                setPick(undefined);
              },
              onSelectSlot: setPick,
            }}
          />
        ) : null
      }
      reconnecting={
        offline
          ? { copy: RECONNECTING_COPY, busy: false, onRetry: () => {} }
          : undefined
      }
      told={TOLD_ROWS}
      tone="plain"
    />
  );
}

const ENDED: Record<
  "completed" | "missed" | "cancelledYou" | "cancelledShop" | "shopClosed",
  {
    copy: VisitBodyCopy;
    tone: VisitTone;
    facts: readonly VisitFact[];
    told: boolean;
    acts: readonly VisitAct[];
  }
> = {
  completed: {
    copy: COMPLETED_COPY,
    tone: "ok",
    facts: VISIT_FACTS,
    told: false,
    acts: [BOOK_AGAIN_ACT, MINE_ACT],
  },
  missed: {
    copy: MISSED_COPY,
    tone: "warn",
    facts: VISIT_FACTS,
    told: true,
    acts: [BOOK_AGAIN_ACT, MINE_ACT],
  },
  cancelledYou: {
    copy: CANCELLED_YOU_COPY,
    tone: "bad",
    facts: endedFacts(true),
    told: false,
    acts: [BOOK_AGAIN_ACT, MINE_ACT],
  },
  cancelledShop: {
    copy: CANCELLED_SHOP_COPY,
    tone: "bad",
    facts: endedFacts(true),
    told: false,
    acts: [
      PICK_ANOTHER_ACT,
      {
        key: "call",
        label: "Call Hong Kong Grade10 Store",
        href: "tel:+85223456789",
        external: true,
        wide: true,
      },
    ],
  },
  shopClosed: {
    copy: SHOP_CLOSED_COPY,
    tone: "warn",
    facts: endedFacts(true),
    told: false,
    acts: [PICK_ANOTHER_ACT, MINE_ACT],
  },
};

/** Phases past the pass: the cards or item went on, or the shop shut for the day. */
const PHASE_PAGES: Record<
  "withGrading" | "withVault",
  {
    copy: VisitBodyCopy;
    tone: VisitTone;
    acts: readonly VisitAct[];
    facts: readonly VisitFact[];
  }
> = {
  withGrading: {
    copy: WITH_GRADING_COPY,
    tone: "ink",
    acts: [MINE_ACT],
    facts: VISIT_FACTS,
  },
  withVault: {
    copy: WITH_VAULT_COPY,
    tone: "ink",
    acts: [MINE_ACT],
    facts: VAULT_FACTS,
  },
};

export function AppointmentVisitPage({
  state,
  opened = null,
  refund = "due",
}: {
  state: VisitState;
  /** The sheet open when the story starts. */
  opened?: Panel | null;
  /** Whether a paid cancel gives the deposit back. */
  refund?: "due" | "kept";
}) {
  if (state === "linkOpensNothing") {
    return (
      <VisitShell>
        <VisitLinkOpensNothing
          bookHref={BOOK_HREF}
          copy={LINK_OPENS_NOTHING_COPY}
          mineHref={MINE_HREF}
        />
      </VisitShell>
    );
  }
  if (state === "withGrading" || state === "withVault") {
    const phase = PHASE_PAGES[state];
    return (
      <VisitShell>
        <VisitBody
          acts={phase.acts}
          copy={phase.copy}
          facts={phase.facts}
          onDismiss={() => {}}
          tone={phase.tone}
        />
      </VisitShell>
    );
  }
  if (state === "justBooked") {
    return (
      <VisitShell>
        <VisitBookedPass
          before={BOOKED_BEFORE}
          name={VISIT_NAME}
          confirmation={{
            record: { ...VISIT_RECORD, id: "bk_grading", service: SERVICE },
            manageHref: "#/book/manage",
            calendarHref: "#/book/bk_vault.ics",
          }}
          copy={{
            confirmation: {
              ...VISIT_CONFIRMATION_COPY,
              title: "You are booked",
              body: `We emailed ${EMAIL}.`,
              manage: "Change or cancel",
            },
            pass: BOOKED_PASS_COPY,
            directions: "Directions",
            until: "You can change or cancel until 10:15 on Thu 3 Sep.",
            before: "Before you come",
            getThere: "How to get there",
            another: "Book another visit",
          }}
          directionsHref={DIRECTIONS_HREF}
          getThere={GET_THERE_ROWS}
          onAgain={() => {}}
        />
      </VisitShell>
    );
  }
  if (state === "booked" || state === "reconnecting" || state === "paid") {
    return (
      <VisitShell>
        <BookedVisit
          offline={state === "reconnecting"}
          opened={opened}
          paid={state === "paid"}
          refund={refund === "due" ? REFUND_DUE : REFUND_KEPT}
        />
      </VisitShell>
    );
  }
  if (state === "paidRefunded") {
    return (
      <VisitShell>
        <VisitBody
          acts={[BOOK_AGAIN_ACT, MINE_ACT]}
          copy={REFUNDED_COPY}
          facts={paidOffFacts(REFUNDED_FACT)}
          onDismiss={() => {}}
          tone="bad"
        />
      </VisitShell>
    );
  }
  const ended = ENDED[state];
  return (
    <VisitShell>
      <VisitBody
        acts={ended.acts}
        copy={ended.copy}
        facts={ended.facts}
        onDismiss={() => {}}
        told={ended.told ? TOLD_ROWS : undefined}
        tone={ended.tone}
      />
    </VisitShell>
  );
}
