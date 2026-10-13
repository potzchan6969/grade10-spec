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
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
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

type ManageState =
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
function ManageBooking({ state }: { state: BookedState }) {
  const [record, setRecord] = useState<BookingRecord>(() => recordFor(state));
  const [moving, setMoving] = useState(state === "moving");
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
      {state === "signedOut" ? (
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

function ManageBookingPage({ state }: { state: ManageState }) {
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
        <ManageBooking key={state} state={state} />
      )}
    </AppointmentPageShell>
  );
}

const meta = {
  title: "Appointment/Booking/Screens/Manage Booking",
  component: ManageBookingPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "live" },
} satisfies Meta<typeof ManageBookingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The link opens the booking: its time and place, with Move and Cancel. */
export const Live: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Manage your visit" }),
    ).toBeVisible();
    expect(canvas.getByText("Vault Drop-Off")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: MANAGE_CARD_COPY.move }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: MANAGE_CARD_COPY.cancel }),
    ).toBeVisible();
  },
};

/** Move the visit: the booking flow's slot picker opens under the card. */
export const Moving: Story = {
  args: { state: "moving" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="booking-slot-picker"]'),
    ).not.toBeNull();
    expect(canvas.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "3",
    );
  },
};

/** Cancel asks first in a dialog; the visit is cancelled only when confirmed. */
export const CancelConfirmation: Story = {
  args: { state: "live" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: MANAGE_CARD_COPY.cancel }),
    );
    const dialog = await within(document.body).findByRole("dialog", {
      name: MANAGE_CARD_COPY.cancelTitle,
    });
    await waitFor(() => expect(dialog).toBeVisible());
    expect(
      within(document.body).getByRole("button", {
        name: MANAGE_CARD_COPY.cancelConfirm,
      }),
    ).toBeVisible();
  },
};

/** Once cancelled the card says so and offers nothing more. */
export const Cancelled: Story = {
  args: { state: "cancelled" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cancelled")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: MANAGE_CARD_COPY.move }),
    ).toBeNull();
    expect(
      canvas.queryByRole("button", { name: MANAGE_CARD_COPY.cancel }),
    ).toBeNull();
  },
};

/** A visit that has ended is closed: its state shows and the link offers nothing. */
export const Closed: Story = {
  args: { state: "closed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Visited")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: MANAGE_CARD_COPY.move }),
    ).toBeNull();
    expect(
      canvas.queryByRole("button", { name: MANAGE_CARD_COPY.cancel }),
    ).toBeNull();
  },
};

/** A link that names no booking says so, and offers to book one. */
export const NotFound: Story = {
  args: { state: "notFound" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(MANAGE_PAGE_COPY.notFoundTitle)).toBeVisible();
    expect(
      within(canvas.getByRole("main")).getByRole("link", {
        name: MANAGE_PAGE_COPY.bookVisit,
      }),
    ).toBeVisible();
  },
};

/** Signed out, the link still opens the booking and invites a sign-in. */
export const SignedOut: Story = {
  args: { state: "signedOut" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: MANAGE_CARD_COPY.move }),
    ).toBeVisible();
    expect(canvas.getByText(MANAGE_PAGE_COPY.signedOutLine)).toBeVisible();
    expect(
      canvas.getByRole("link", { name: MANAGE_PAGE_COPY.signIn }),
    ).toBeVisible();
  },
};
