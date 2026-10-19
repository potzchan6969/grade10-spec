import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import type { BookingRecord } from "@grade10/ui";
import { BookingManageCard, BookingSlotPicker } from "@grade10/ui";
import { useState } from "react";
import {
  COMPLETED_VISIT_RECORD,
  firstAvailableVisitDay,
  MANAGE_CARD_COPY,
  SLOT_PICKER_COPY,
  slotsForVisitDay,
  VAULT_BOOK_VISIT_HREF,
  VISIT_DAYS,
  VISIT_MAX_MONTH,
  VISIT_MIN_MONTH,
  VISIT_NOW_MS,
  VISIT_RECORD,
  VISIT_TIME_ZONE,
  VISIT_TODAY,
} from "../../vault-content";
import { AppointmentPageShell, PageHeader } from "../../vault-shared";
import { STORE_LOCATOR_HREF } from "../../workbench-story-nav";
import { MANAGE_PAGE_COPY } from "./appointment-manage-content";

export type ManageState =
  | "live"
  | "moving"
  | "cancel"
  | "cancelled"
  | "closed"
  | "notFound"
  | "signedOut";

type BookedState = Exclude<ManageState, "notFound">;

function recordFor(state: BookedState): BookingRecord {
  if (state === "cancelled") return { ...VISIT_RECORD, state: "cancelled" };
  if (state === "closed") return COMPLETED_VISIT_RECORD;
  return VISIT_RECORD;
}

/** One booking from the link: the card, and the slot picker when it moves. */
function ManageBooking({
  state,
  moving: movingAtStart = state === "moving",
  signedOut = state === "signedOut",
}: {
  state: BookedState;
  moving?: boolean;
  signedOut?: boolean;
}) {
  const [record, setRecord] = useState<BookingRecord>(() => recordFor(state));
  const [moving, setMoving] = useState(movingAtStart);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    "2026-09-03",
  );
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  function handleMonthChange(month: string) {
    setSelectedMonth(month);
    setSelectedDate(firstAvailableVisitDay(month));
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <BookingManageCard
        copy={MANAGE_CARD_COPY}
        record={record}
        now={VISIT_NOW_MS}
        timeZoneLabel={MANAGE_PAGE_COPY.timeZoneLabel}
        onMove={() => setMoving(true)}
        onCancel={() => {
          setRecord((held) => ({ ...held, state: "cancelled" }));
          setMoving(false);
        }}
      />
      {moving && record.state === "booked" ? (
        <BookingSlotPicker
          copy={SLOT_PICKER_COPY}
          month={selectedMonth}
          minMonth={VISIT_MIN_MONTH}
          maxMonth={VISIT_MAX_MONTH}
          today={VISIT_TODAY}
          days={{ status: "ready", data: VISIT_DAYS }}
          selectedDate={selectedDate}
          slots={{
            status: "ready",
            data: selectedDate ? slotsForVisitDay(selectedDate) : [],
          }}
          selectedStart={record.start}
          timeZone={VISIT_TIME_ZONE}
          timeZoneLabel={MANAGE_PAGE_COPY.timeZoneLabel}
          onMonthChange={handleMonthChange}
          onSelectDay={setSelectedDate}
          onSelectSlot={(slot) => {
            setRecord((held) => ({
              ...held,
              start: slot.start,
              end: slot.end,
            }));
            setMoving(false);
          }}
        />
      ) : null}
      {signedOut ? (
        <Text as="p" size="sm" tone="secondary">
          {MANAGE_PAGE_COPY.signedOutLine}{" "}
          <Link href={MANAGE_PAGE_COPY.signInHref}>
            {MANAGE_PAGE_COPY.signIn}
          </Link>
        </Text>
      ) : null}
    </div>
  );
}

/** The page for one link; `moving` and `signedOut` default from `state`. */
export function ManageBookingPage({
  state,
  moving,
  signedOut,
}: {
  state: ManageState;
  moving?: boolean;
  signedOut?: boolean;
}) {
  return (
    <AppointmentPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={STORE_LOCATOR_HREF}>
          {MANAGE_PAGE_COPY.home}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{MANAGE_PAGE_COPY.current}</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title={MANAGE_PAGE_COPY.title}
        description={
          state === "notFound" ? undefined : MANAGE_PAGE_COPY.description
        }
      />

      {state === "notFound" ? (
        <div className="w-full max-w-2xl">
          <EmptyState
            actions={
              <Link href={VAULT_BOOK_VISIT_HREF}>
                {MANAGE_PAGE_COPY.bookVisit}
              </Link>
            }
            title={MANAGE_PAGE_COPY.notFoundTitle}
            description={MANAGE_PAGE_COPY.notFoundDescription}
            data-slot="manage-not-found"
          />
        </div>
      ) : (
        <ManageBooking
          key={state}
          moving={moving}
          signedOut={signedOut}
          state={state}
        />
      )}
    </AppointmentPageShell>
  );
}
