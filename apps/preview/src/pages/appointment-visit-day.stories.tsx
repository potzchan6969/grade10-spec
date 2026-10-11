import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  VisitBody,
  type VisitBodyCopy,
  VisitFullDay,
  VisitLatePanel,
  VisitRefusedBook,
  type VisitTone,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  BEFORE_NOTES,
  BOOK_HREF,
  CALLED_COPY,
  CHECKED_IN_COPY,
  DIRECTIONS_ACT,
  LATE_CHOICES,
  LATE_PANEL_COPY,
  LATE_TOLD_COPY,
  MINE_HREF,
  SERVICE,
  SHOP,
  TIME_PASSED_COPY,
  TODAY_COPY,
  TOLD_ROWS,
  VISIT_FACTS,
  VISIT_NAME,
  WAIT_HREF,
} from "./appointment-visit-content";
import { AppointmentPageShell } from "./vault-shared";
import { STORE_LOCATOR_HREF } from "./workbench-story-nav";

type DayState =
  | "today"
  | "lateTold"
  | "checkedIn"
  | "called"
  | "timePassed"
  | "fullToday"
  | "alreadyBooked";

const CHANGES = [
  { key: "move", label: "Change time", onClick: () => {} },
  { key: "cancel", label: "Cancel visit", onClick: () => {} },
];

function DayShell({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <AppointmentPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={STORE_LOCATOR_HREF}>Appointment</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{current}</BreadcrumbItem>
      </Breadcrumbs>
      <div className="w-full max-w-2xl">{children}</div>
    </AppointmentPageShell>
  );
}

/** On the day: Running late opens its panel, and sending it says so. */
function TodayVisit({ told }: { told: boolean }) {
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState<number | null>(10);
  const [said, setSaid] = useState<string | undefined>();
  const copy: VisitBodyCopy = { ...(told ? LATE_TOLD_COPY : TODAY_COPY), said };
  return (
    <VisitBody
      acts={
        open
          ? []
          : [
              {
                key: "late",
                label: told ? "Update running late" : "Running late",
                onClick: () => {
                  setSaid(undefined);
                  setOpen(true);
                },
              },
              DIRECTIONS_ACT,
              ...CHANGES,
            ]
      }
      before={BEFORE_NOTES}
      name={VISIT_NAME}
      copy={copy}
      facts={VISIT_FACTS}
      onDismiss={() => setSaid(undefined)}
      panel={
        open ? (
          <VisitLatePanel
            choices={LATE_CHOICES}
            copy={{
              ...LATE_PANEL_COPY,
              send: `Tell ${SHOP}: about ${minutes ?? 0} min`,
            }}
            onClose={() => setOpen(false)}
            onSend={() => {
              setOpen(false);
              setSaid(`${SHOP} knows: about ${minutes ?? 0} min late.`);
            }}
            onValueChange={setMinutes}
            pending={false}
            value={minutes}
          />
        ) : null
      }
      told={TOLD_ROWS}
      tone="ink"
    />
  );
}

const LATER: Record<
  "checkedIn" | "called" | "timePassed",
  { copy: VisitBodyCopy; tone: VisitTone }
> = {
  checkedIn: { copy: CHECKED_IN_COPY, tone: "info" },
  called: { copy: CALLED_COPY, tone: "ink" },
  timePassed: { copy: TIME_PASSED_COPY, tone: "warn" },
};

function AppointmentVisitDayPage({ state }: { state: DayState }) {
  if (state === "fullToday") {
    return (
      <DayShell current="Book a Visit">
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
      <DayShell current="Book a Visit">
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
  if (state === "today" || state === "lateTold") {
    return (
      <DayShell current="Visit">
        <TodayVisit told={state === "lateTold"} />
      </DayShell>
    );
  }
  const later = LATER[state];
  return (
    <DayShell current="Visit">
      <VisitBody
        acts={
          state === "timePassed"
            ? [
                {
                  key: "another",
                  label: "Book another time",
                  href: BOOK_HREF,
                  primary: true,
                },
                ...CHANGES,
                DIRECTIONS_ACT,
              ]
            : []
        }
        name={VISIT_NAME}
        copy={later.copy}
        facts={VISIT_FACTS}
        noticeHref={state === "timePassed" ? WAIT_HREF : undefined}
        onDismiss={() => {}}
        told={state === "called" ? undefined : TOLD_ROWS}
        tone={later.tone}
      />
    </DayShell>
  );
}

const meta = {
  title: "Pages/Appointment/Visit Day",
  component: AppointmentVisitDayPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "today" },
} satisfies Meta<typeof AppointmentVisitDayPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On the day: Running late tells the shop, and the page says it did. */
export const Today: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "See you at 10:15" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Running late" }));
    await userEvent.click(
      canvas.getByRole("button", { name: `Tell ${SHOP}: about 10 min` }),
    );
    expect(canvas.getByText(`${SHOP} knows: about 10 min late.`)).toBeVisible();
  },
};

export const RunningLate: Story = { args: { state: "lateTold" } };

export const CheckedIn: Story = { args: { state: "checkedIn" } };

export const Called: Story = {
  args: { state: "called" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Counter 3 is ready for you" }),
    ).toBeVisible();
  },
};

/** Past the hold: walk in now, the wait one link away. */
export const TimePassed: Story = {
  args: { state: "timePassed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "See the wait" })).toHaveAttribute(
      "href",
      WAIT_HREF,
    );
  },
};

/** Today offers nothing at this shop: the earliest at each, and walking in. */
export const FullToday: Story = { args: { state: "fullToday" } };

/** A Book press refused: a visit already held, or too many tries. */
export const AlreadyBooked: Story = { args: { state: "alreadyBooked" } };
