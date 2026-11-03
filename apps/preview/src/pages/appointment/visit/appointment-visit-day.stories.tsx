import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import {
  type VisitAct,
  VisitBody,
  type VisitBodyCopy,
  type VisitFact,
  VisitFullDay,
  VisitLatePanel,
  VisitRefusedBook,
  type VisitTone,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, screen, userEvent, within } from "storybook/test";
import { AppointmentPageShell } from "../../vault-shared";
import {
  BEFORE_NOTES,
  BOOK_AGAIN_ACT,
  BOOK_HREF,
  CALLED_COPY,
  CHECKED_IN_COPY,
  DIRECTIONS_ACT,
  endedFacts,
  HERE_COPY,
  LATE_CHOICES,
  LATE_PANEL_COPY,
  LATE_TOLD_COPY,
  MINE_ACT,
  MINE_HREF,
  MISSED_COPY,
  MISSED_PAID_COPY,
  MISSED_PAID_FACT,
  PAID_BEFORE,
  PAID_FACTS,
  PICK_ANOTHER_ACT,
  paidOffFacts,
  REFUNDING_FACT,
  SERVICE,
  SHOP,
  SHOP_CLOSED_REFUNDED_COPY,
  TIME_PASSED_COPY,
  TODAY_COPY,
  TODAY_PAID_COPY,
  TOLD_ROWS,
  VISIT_FACTS,
  VISIT_NAME,
  WAIT_HREF,
  WITH_GRADING_COPY,
} from "./appointment-visit-content";

type DayState =
  | "today"
  | "runningLate"
  | "lateTold"
  | "checkedIn"
  | "called"
  | "withGrading"
  | "timePassed"
  | "missed"
  | "todayPaid"
  | "shopClosedRefunded"
  | "missedPaid"
  | "fullToday"
  | "alreadyBooked";

const CHANGES: VisitAct[] = [
  { key: "move", label: "Change time", onClick: () => {} },
  { key: "cancel", label: "Cancel visit", onClick: () => {} },
];

function DayShell({ children }: { children: ReactNode }) {
  return (
    <AppointmentPageShell>
      <div className="mx-auto w-full max-w-xl">{children}</div>
      <Toast position="bottom-center" />
    </AppointmentPageShell>
  );
}

/** On the day: Running late opens its sheet, and sending it says so. */
function TodayVisit({
  paid = false,
  opened = false,
}: {
  paid?: boolean;
  opened?: boolean;
}) {
  const [open, setOpen] = useState(opened);
  const [told, setTold] = useState(false);
  const [minutes, setMinutes] = useState<number | null>(10);
  const [said, setSaid] = useState<string | undefined>();
  const base = told ? LATE_TOLD_COPY : paid ? TODAY_PAID_COPY : TODAY_COPY;
  const copy: VisitBodyCopy = { ...base, said };
  const late: VisitAct = {
    key: "late",
    label: told ? "Update running late" : "Running late",
    onClick: () => setOpen(true),
  };
  return (
    <VisitBody
      acts={told ? [late, DIRECTIONS_ACT] : [late, DIRECTIONS_ACT, ...CHANGES]}
      before={paid ? PAID_BEFORE : BEFORE_NOTES}
      copy={copy}
      facts={paid ? PAID_FACTS : VISIT_FACTS}
      name={VISIT_NAME}
      noticeAt="afterActs"
      onDismiss={() => setSaid(undefined)}
      panel={
        open ? (
          <VisitLatePanel
            choices={LATE_CHOICES}
            copy={{
              ...LATE_PANEL_COPY,
              send: `Tell ${SHOP}: about ${minutes ?? 0} min`,
            }}
            here={{
              copy: HERE_COPY,
              onHere: () => {
                setOpen(false);
                setSaid("We told the desk you’re here.");
              },
            }}
            onClose={() => setOpen(false)}
            onSend={() => {
              setOpen(false);
              setTold(true);
              setSaid(`${SHOP} knows: about ${minutes ?? 0} min late.`);
            }}
            onValueChange={setMinutes}
            pending={false}
            value={minutes}
          />
        ) : null
      }
      passSize="day"
      told={TOLD_ROWS}
      tone="ink"
    />
  );
}

type Later = {
  copy: VisitBodyCopy;
  tone: VisitTone;
  acts: readonly VisitAct[];
  facts?: readonly VisitFact[];
  pass: boolean;
  before?: boolean;
  told: boolean;
};

const LATER: Record<
  | "lateTold"
  | "checkedIn"
  | "called"
  | "withGrading"
  | "timePassed"
  | "missed"
  | "shopClosedRefunded"
  | "missedPaid",
  Later
> = {
  lateTold: {
    copy: LATE_TOLD_COPY,
    tone: "ink",
    acts: [
      { key: "late", label: "Update running late", onClick: () => {} },
      DIRECTIONS_ACT,
    ],
    pass: true,
    before: true,
    told: true,
  },
  checkedIn: {
    copy: CHECKED_IN_COPY,
    tone: "info",
    acts: [],
    pass: true,
    told: true,
  },
  called: { copy: CALLED_COPY, tone: "ink", acts: [], pass: true, told: false },
  withGrading: {
    copy: WITH_GRADING_COPY,
    tone: "ok",
    acts: [
      { key: "mine", label: "My visits", href: MINE_HREF },
      { key: "book", label: "Book a visit", href: BOOK_HREF },
    ],
    pass: false,
    told: true,
  },
  timePassed: {
    copy: TIME_PASSED_COPY,
    tone: "warn",
    acts: [
      ...CHANGES,
      {
        key: "another",
        label: "Book another time",
        href: BOOK_HREF,
        primary: true,
      },
      { ...DIRECTIONS_ACT, wide: true },
    ],
    pass: true,
    told: true,
  },
  missed: {
    copy: MISSED_COPY,
    tone: "warn",
    acts: [BOOK_AGAIN_ACT, MINE_ACT],
    pass: false,
    told: true,
  },
  shopClosedRefunded: {
    copy: SHOP_CLOSED_REFUNDED_COPY,
    tone: "warn",
    acts: [PICK_ANOTHER_ACT, MINE_ACT],
    facts: paidOffFacts(REFUNDING_FACT),
    pass: false,
    told: false,
  },
  missedPaid: {
    copy: MISSED_PAID_COPY,
    tone: "warn",
    acts: [BOOK_AGAIN_ACT, MINE_ACT],
    facts: [...endedFacts(false), MISSED_PAID_FACT],
    pass: false,
    told: false,
  },
};

function AppointmentVisitDayPage({ state }: { state: DayState }) {
  if (state === "fullToday") {
    return (
      <DayShell>
        <VisitFullDay
          copy={{
            title: `Today is full at ${SHOP}.`,
            earliestEach: "Earliest at each shop",
            noFreeYet: "No free times yet",
            walkIn: {
              title: "Walk in today: about 15 to 25 min",
              body: `No booking needed. Come to ${SHOP} and we call you when a counter is free.`,
              seeWait: "See the wait now",
            },
          }}
          onPick={() => {}}
          shops={[
            { id: "loc_causeway_bay", name: SHOP, earliest: "Tomorrow, 10:00" },
            { id: "loc_central", name: "Central", earliest: "Today, 16:30" },
            { id: "loc_mong_kok", name: "Mong Kok" },
          ]}
          waitHref={WAIT_HREF}
        />
      </DayShell>
    );
  }
  if (state === "alreadyBooked") {
    return (
      <DayShell>
        <VStack gap="md" hAlign="stretch">
          <VisitRefusedBook
            actionHref={MINE_HREF}
            copy={{
              title: `You already have a ${SERVICE}.`,
              body: `Thu 3 Sep, 10:15 at ${SHOP}. To go at another time, change that visit.`,
              action: "Open it",
            }}
            refusal="held"
          />
          <VisitRefusedBook
            copy={{
              title: "Too many tries today",
              body: `This email has tried to book 10 times today. Try again tomorrow, or call ${SHOP} on +852 2345 6789.`,
              action: "Call +852 2345 6789",
            }}
            actionHref="tel:+85223456789"
            refusal="tries"
          />
        </VStack>
      </DayShell>
    );
  }
  if (state === "today" || state === "runningLate" || state === "todayPaid") {
    return (
      <DayShell>
        <TodayVisit
          opened={state === "runningLate"}
          paid={state === "todayPaid"}
        />
      </DayShell>
    );
  }
  const later = LATER[state];
  return (
    <DayShell>
      <VisitBody
        acts={later.acts}
        before={later.before ? BEFORE_NOTES : undefined}
        copy={later.copy}
        facts={later.facts ?? VISIT_FACTS}
        name={later.pass ? VISIT_NAME : null}
        noticeAt={state === "shopClosedRefunded" ? "afterActs" : "top"}
        onDismiss={() => {}}
        passSize="day"
        told={later.told ? TOLD_ROWS : undefined}
        tone={later.tone}
      />
    </DayShell>
  );
}

const meta = {
  title: "Appointment/Visit/Screens/Visit Day",
  component: AppointmentVisitDayPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "today" },
} satisfies Meta<typeof AppointmentVisitDayPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On the day: Running late tells the shop, and the page says it did. */
export const Today: Story = {
  parameters: {
    verification: { caseId: "vc_c5ff5f1f-5dbb-4d6e-b9a8-a6f9b89c5d11" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "See you at 10:15" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Running late" }));
    const sheet = within(await screen.findByRole("dialog"));
    await userEvent.click(
      sheet.getByRole("button", { name: `Tell ${SHOP}: about 10 min` }),
    );
    expect(
      await screen.findByText(`${SHOP} knows: about 10 min late.`),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Change time" }),
    ).not.toBeInTheDocument();
  },
};

/** The Running late sheet, with I’m here for a collector already outside. */
export const RunningLateSheet: Story = {
  parameters: {
    verification: { caseId: "vc_f6e0d584-0290-422e-90ff-1308b9315cfb" },
  },
  args: { state: "runningLate" },
  play: async () => {
    const sheet = within(await screen.findByRole("dialog"));
    expect(sheet.getByRole("button", { name: "I’m here" })).toBeVisible();
  },
};

/** Running late sent: only Update running late and Directions. */
export const RunningLate: Story = {
  parameters: {
    verification: { caseId: "vc_005afa29-777e-4e5a-89f9-ba932b4a8aa3" },
  },
  args: { state: "lateTold" },
};

export const CheckedIn: Story = {
  parameters: {
    verification: { caseId: "vc_8557b16a-e877-44b3-9664-d67f9dbea1f1" },
  },
  args: { state: "checkedIn" },
};

export const Called: Story = {
  parameters: {
    verification: { caseId: "vc_ebce5152-0aa7-4ced-aca6-7920d50b9e80" },
  },
  args: { state: "called" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Counter 3 is ready for you" }),
    ).toBeVisible();
  },
};

/** Handed to grading: the cards are with grading now. */
export const WithGrading: Story = {
  parameters: {
    verification: { caseId: "vc_bb616755-0726-4401-a2d9-53e533ca95ff" },
  },
  args: { state: "withGrading" },
};

/** Past the hold: come anyway, change, cancel or book another time. */
export const TimePassed: Story = {
  parameters: {
    verification: { caseId: "vc_7305daed-7597-4fd1-9bd3-e99c3f5fe850" },
  },
  args: { state: "timePassed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("link", { name: "Book another time" }),
    ).toHaveAttribute("href", BOOK_HREF);
    expect(canvas.queryByText(/walk/i)).toBeNull();
  },
};

/** Missed: what you told us is kept for Book again. */
export const Missed: Story = {
  parameters: {
    verification: { caseId: "vc_ae258c23-9aa8-4909-9ba6-82647f097819" },
  },
  args: { state: "missed" },
};

/** On the day, paid: cancelling now keeps the deposit. */
export const TodayPaid: Story = {
  parameters: {
    verification: { caseId: "vc_0693c3c7-2419-44da-b8b5-8ee948cd2ae1" },
  },
  args: { state: "todayPaid" },
};

/** The shop closed for the weather, the deposit on its way back. */
export const ShopClosedRefunded: Story = {
  parameters: {
    verification: { caseId: "vc_868fa099-f910-4058-8e8f-ad18edd980dc" },
  },
  args: { state: "shopClosedRefunded" },
};

/** Missed, paid: the deposit is kept. */
export const MissedPaid: Story = {
  parameters: {
    verification: { caseId: "vc_e37d717b-ad3e-4309-a24b-83820b789e1e" },
  },
  args: { state: "missedPaid" },
};

/** Today offers nothing at this shop: the earliest at each, and walking in. */
export const FullToday: Story = {
  parameters: {
    verification: { caseId: "vc_65f78de4-29d6-485e-a3ca-d3147065003a" },
  },
  args: { state: "fullToday" },
};

/** A Book press refused: a visit already held, or too many tries. */
export const AlreadyBooked: Story = {
  parameters: {
    verification: { caseId: "vc_d217577d-b0b9-49b0-90de-d9cd9b8794e2" },
  },
  args: { state: "alreadyBooked" },
};
