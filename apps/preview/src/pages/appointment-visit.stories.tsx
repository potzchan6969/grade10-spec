import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import {
  type BookingSlot,
  VisitBody,
  type VisitBodyCopy,
  VisitBookedPass,
  VisitCancelPanel,
  type VisitCancelReason,
  VisitLinkOpensNothing,
  VisitMovePanel,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
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
  PICK_ANOTHER_ACT,
  RECONNECTING_COPY,
  SERVICE,
  TOLD_ROWS,
  VISIT_FACTS,
  VISIT_NAME,
} from "./appointment-visit-content";
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
} from "./vault-content";
import { AppointmentPageShell } from "./vault-shared";
import { STORE_LOCATOR_HREF } from "./workbench-story-nav";

type VisitState =
  | "booked"
  | "justBooked"
  | "completed"
  | "missed"
  | "cancelledYou"
  | "cancelledShop"
  | "reconnecting"
  | "linkOpensNothing";

type Panel = "move" | "cancel";

const TIME_WORDS = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: VISIT_TIME_ZONE,
});

function VisitShell({ children }: { children: ReactNode }) {
  return (
    <AppointmentPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={STORE_LOCATOR_HREF}>Appointment</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem href={MINE_HREF}>My visits</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Visit</BreadcrumbItem>
      </Breadcrumbs>
      <div className="w-full max-w-2xl">{children}</div>
    </AppointmentPageShell>
  );
}

/** The booked visit, with Change time and Cancel opening their panels. */
function BookedVisit({ offline }: { offline: boolean }) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [said, setSaid] = useState<string | undefined>();
  const [reason, setReason] = useState<VisitCancelReason | null>(null);
  const [more, setMore] = useState("");
  const [month, setMonth] = useState(VISIT_MIN_MONTH);
  const [date, setDate] = useState<string | undefined>("2026-09-03");
  const [pick, setPick] = useState<BookingSlot | undefined>();
  const open = (next: Panel) => {
    setSaid(undefined);
    setPanel(next);
  };
  const copy: VisitBodyCopy = { ...BOOKED_COPY, said };

  return (
    <VisitBody
      acts={
        panel === null
          ? [
              {
                key: "move",
                label: "Change time",
                onClick: () => open("move"),
              },
              {
                key: "cancel",
                label: "Cancel visit",
                onClick: () => open("cancel"),
              },
              {
                key: "calendar",
                label: "Add to calendar",
                href: "#/book/bk_vault.ics",
              },
              DIRECTIONS_ACT,
            ]
          : []
      }
      before={BEFORE_NOTES}
      name={VISIT_NAME}
      copy={copy}
      facts={VISIT_FACTS}
      onDismiss={() => setSaid(undefined)}
      panel={
        panel === "cancel" ? (
          <VisitCancelPanel
            copy={CANCEL_PANEL_COPY}
            more={more}
            onClose={() => setPanel(null)}
            onConfirm={() => {
              setPanel(null);
              setSaid(`Visit cancelled. We emailed ${EMAIL}.`);
            }}
            onMoreChange={setMore}
            onReasonChange={setReason}
            pending={false}
            reason={reason}
          />
        ) : panel === "move" ? (
          <VisitMovePanel
            copy={{
              ...MOVE_PANEL_COPY,
              confirm: pick
                ? `Move to ${TIME_WORDS.format(pick.start)}`
                : MOVE_PANEL_COPY.confirm,
            }}
            onClose={() => setPanel(null)}
            onConfirm={() => {
              if (!pick) return;
              setPanel(null);
              setSaid(
                `Moved to ${TIME_WORDS.format(pick.start)}. We emailed ${EMAIL}.`,
              );
            }}
            pending={false}
            picked={!!pick}
            slotPicker={{
              copy: SLOT_PICKER_COPY,
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
      tone="info"
    />
  );
}

const ENDED: Record<
  "completed" | "missed" | "cancelledYou" | "cancelledShop",
  {
    copy: VisitBodyCopy;
    tone: "ok" | "warn" | "plain" | "bad";
    struck: boolean;
    told: boolean;
  }
> = {
  completed: { copy: COMPLETED_COPY, tone: "ok", struck: false, told: false },
  missed: { copy: MISSED_COPY, tone: "warn", struck: false, told: false },
  cancelledYou: {
    copy: CANCELLED_YOU_COPY,
    tone: "plain",
    struck: true,
    told: false,
  },
  cancelledShop: {
    copy: CANCELLED_SHOP_COPY,
    tone: "bad",
    struck: true,
    told: false,
  },
};

function AppointmentVisitPage({ state }: { state: VisitState }) {
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
            until: "You can change or cancel until 10:45 on Thu 3 Sep.",
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
  if (state === "booked" || state === "reconnecting") {
    return (
      <VisitShell>
        <BookedVisit offline={state === "reconnecting"} />
      </VisitShell>
    );
  }
  const ended = ENDED[state];
  const acts =
    state === "cancelledShop"
      ? [
          PICK_ANOTHER_ACT,
          {
            key: "call",
            label: "Call Hong Kong Grade10 Store",
            href: "tel:+85223456789",
            external: true,
          },
        ]
      : [BOOK_AGAIN_ACT, MINE_ACT];
  return (
    <VisitShell>
      <VisitBody
        acts={acts}
        name={VISIT_NAME}
        copy={ended.copy}
        facts={endedFacts(ended.struck)}
        onDismiss={() => {}}
        told={ended.told ? TOLD_ROWS : undefined}
        tone={ended.tone}
      />
    </VisitShell>
  );
}

const meta = {
  title: "Pages/Appointment/Visit",
  component: AppointmentVisitPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "booked" },
} satisfies Meta<typeof AppointmentVisitPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Before the day: the pass, Change time and Cancel open their panels in place. */
export const Booked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Grading Submission" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Cancel visit" }));
    expect(
      canvas.getByRole("region", { name: "Cancel your visit?" }),
    ).toBeVisible();
    expect(canvas.queryByRole("link", { name: "Directions" })).toBeNull();
    await userEvent.click(
      canvas.getByRole("button", { name: "Keep my visit" }),
    );
    expect(canvas.getByRole("link", { name: "Directions" })).toBeVisible();
  },
};

/** Just booked: what was booked, the pass and how to get there. */
export const JustBooked: Story = { args: { state: "justBooked" } };

export const Completed: Story = { args: { state: "completed" } };

export const Missed: Story = { args: { state: "missed" } };

/** Cancelled by the collector: the time struck, the reason they gave. */
export const CancelledByYou: Story = {
  args: { state: "cancelledYou" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("I booked the wrong time")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Book again" })).toBeVisible();
  },
};

export const CancelledByShop: Story = { args: { state: "cancelledShop" } };

/** Lost signal: what it last knew, with Try now. */
export const Reconnecting: Story = { args: { state: "reconnecting" } };

/** A link that names no visit says why, and never guesses one. */
export const LinkOpensNothing: Story = {
  args: { state: "linkOpensNothing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "This link doesn’t open a visit" }),
    ).toBeVisible();
  },
};
