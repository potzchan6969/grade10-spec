import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { BookingRecord } from "@grade10/ui";
import { BookingManageCard, BookingSlotPicker } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import {
  APPOINTMENTS_COPY,
  COMPLETED_VISIT_RECORD,
  firstAvailableVisitDay,
  GRADING_VISIT_RECORD,
  MANAGE_CARD_COPY,
  SLOT_PICKER_COPY,
  slotsForVisitDay,
  VAULT_BOOK_VISIT_STORY_ID,
  VISIT_DAYS,
  VISIT_MAX_MONTH,
  VISIT_MIN_MONTH,
  VISIT_NOW_MS,
  VISIT_RECORD,
  VISIT_TIME_ZONE,
  VISIT_TODAY_DATE,
} from "./vault-content";
import {
  AppointmentPageShell,
  PageHeader,
  ProposalBanner,
} from "./vault-shared";
import { navigateToStory, STORE_LOCATOR_HREF } from "./workbench-story-nav";

function seedRecords(empty: boolean): BookingRecord[] {
  if (empty) {
    return [];
  }
  return [COMPLETED_VISIT_RECORD, GRADING_VISIT_RECORD, VISIT_RECORD];
}

function split(list: readonly BookingRecord[], now: number) {
  const upcoming = list
    .filter((record) => record.state === "booked" && record.end > now)
    .sort((a, b) => a.start - b.start);
  const past = list
    .filter((record) => !(record.state === "booked" && record.end > now))
    .sort((a, b) => b.start - a.start);
  return { upcoming, past };
}

function AppointmentsPage({ empty = false }: { empty?: boolean }) {
  const [records, setRecords] = useState(() => seedRecords(empty));
  const [movingId, setMovingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    "2026-09-03",
  );
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const { upcoming, past } = split(records, VISIT_NOW_MS);

  function updateRecord(id: string, patch: Partial<BookingRecord>) {
    setRecords((held) =>
      held.map((record) =>
        record.id === id ? { ...record, ...patch } : record,
      ),
    );
  }

  function handleMonthChange(month: string) {
    setSelectedMonth(month);
    setSelectedDate(firstAvailableVisitDay(month));
  }

  function renderCard(record: BookingRecord) {
    return (
      <VStack gap="lg" hAlign="stretch" key={record.id}>
        <BookingManageCard
          copy={MANAGE_CARD_COPY}
          record={record}
          timeZoneLabel="Hong Kong time"
          onMove={() => setMovingId(record.id)}
          onCancel={() => {
            updateRecord(record.id, { state: "cancelled" });
            setMovingId((id) => (id === record.id ? null : id));
          }}
        />
        {movingId === record.id && record.state === "booked" ? (
          <BookingSlotPicker
            copy={SLOT_PICKER_COPY}
            month={selectedMonth}
            minMonth={VISIT_MIN_MONTH}
            maxMonth={VISIT_MAX_MONTH}
            today={VISIT_TODAY_DATE}
            days={{ status: "ready", data: VISIT_DAYS }}
            selectedDate={selectedDate}
            slots={{
              status: "ready",
              data: selectedDate ? slotsForVisitDay(selectedDate) : [],
            }}
            selectedStart={record.start}
            timeZone={VISIT_TIME_ZONE}
            timeZoneLabel="Hong Kong time"
            onMonthChange={handleMonthChange}
            onSelectDay={setSelectedDate}
            onSelectSlot={(slot) => {
              updateRecord(record.id, {
                start: slot.start,
                end: slot.end,
              });
              setMovingId(null);
            }}
          />
        ) : null}
      </VStack>
    );
  }

  return (
    <AppointmentPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={STORE_LOCATOR_HREF}>Appointment</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Appointments</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title="Appointments"
        description="Book a Visit bookings for this email. Move or cancel on the card."
        actions={
          records.length === 0 ? (
            <Button
              type="button"
              onClick={() => navigateToStory(VAULT_BOOK_VISIT_STORY_ID)}
            >
              Book a visit
            </Button>
          ) : null
        }
      />

      <ProposalBanner title="One upcoming visit per service">
        A second upcoming booking of the same service under this email is
        refused. Incoming items in the portfolio do not count as a visit.
      </ProposalBanner>

      {records.length === 0 ? (
        <EmptyState
          description={APPOINTMENTS_COPY.emptyDescription}
          title={APPOINTMENTS_COPY.emptyTitle}
        />
      ) : (
        <>
          {upcoming.length > 0 ? (
            <VStack gap="md" hAlign="stretch">
              <Text as="h2" size="lg" weight="medium">
                {APPOINTMENTS_COPY.upcomingHeading}
              </Text>
              {upcoming.map(renderCard)}
            </VStack>
          ) : null}
          {past.length > 0 ? (
            <VStack gap="md" hAlign="stretch">
              <Text as="h2" size="lg" weight="medium">
                {APPOINTMENTS_COPY.pastHeading}
              </Text>
              {past.map(renderCard)}
            </VStack>
          ) : null}
        </>
      )}
    </AppointmentPageShell>
  );
}

const meta = {
  title: "Pages/Appointment/Appointments",
  component: AppointmentsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppointmentsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Appointments" }),
    ).toBeVisible();
    expect(canvas.getByText("Upcoming")).toBeVisible();
    expect(canvas.getAllByText("Vault Drop-Off").length).toBeGreaterThan(0);
    expect(canvas.getByText("Grading Submission")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Open" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Book a visit" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getAllByRole("button", { name: "Move the visit" }).length,
    ).toBeGreaterThan(0);
  },
};

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No appointments yet")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Book a visit" })).toBeVisible();
  },
};
