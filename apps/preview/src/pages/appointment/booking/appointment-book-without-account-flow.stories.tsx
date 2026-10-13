import {
  BookingConfirmation,
  BookingDetailsForm,
  BookingLocationPicker,
  BookingServicePicker,
  BookingSlotPicker,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  BOOK_VISIT_SERVICES,
  CAUSEWAY_BAY,
  DETAILS_FORM_COPY,
  SERVICE_PICKER_COPY,
  SLOT_PICKER_COPY,
  slotsForVisitDay,
  VAULT_MANAGE_VISIT_HREF,
  VISIT_CONFIRMATION_COPY,
  VISIT_DAYS,
  VISIT_MAX_MONTH,
  VISIT_MIN_MONTH,
  VISIT_TIME_ZONE,
  VISIT_TODAY_DATE,
} from "../../vault-content";
import {
  BOOK_WITHOUT_ACCOUNT_CASES,
  BOOK_WITHOUT_ACCOUNT_DESCRIPTION,
  BOOKED_GRADING_RECORD,
  LOCATION_PICKER_COPY,
} from "./appointment-booking-flow-content";

const meta = {
  title: "Appointment/Booking/Flows/Book Without An Account",
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-appointment-booking-US-01"],
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const GRADING_ID = "svc_grading";
const GRADING = BOOK_VISIT_SERVICES.find(
  (service) => service.id === GRADING_ID,
);
const TIME_ZONE_LABEL = "Asia/Hong Kong time";

type BookStep = keyof typeof BOOK_WITHOUT_ACCOUNT_CASES;

const CASES: ReadonlyArray<readonly [string, BookStep]> = [
  [BOOK_WITHOUT_ACCOUNT_CASES.service, "service"],
  [BOOK_WITHOUT_ACCOUNT_CASES.shop, "shop"],
  [BOOK_WITHOUT_ACCOUNT_CASES.slot, "slot"],
  [BOOK_WITHOUT_ACCOUNT_CASES.details, "details"],
  [BOOK_WITHOUT_ACCOUNT_CASES.booked, "booked"],
];

/** The collector's step, drawn as the booking flow shows it at that point. */
function BookStepBody({ step }: { step: BookStep }) {
  if (step === "service") {
    return (
      <BookingServicePicker
        copy={SERVICE_PICKER_COPY}
        onSelect={() => {}}
        selectedId={GRADING_ID}
        services={{ status: "ready", data: BOOK_VISIT_SERVICES }}
      />
    );
  }
  if (step === "shop") {
    return (
      <BookingLocationPicker
        copy={LOCATION_PICKER_COPY}
        locations={{ status: "ready", data: [CAUSEWAY_BAY] }}
        onSelect={() => {}}
        selectedId={CAUSEWAY_BAY.id}
      />
    );
  }
  if (step === "slot") {
    return (
      <BookingSlotPicker
        copy={SLOT_PICKER_COPY}
        days={{ status: "ready", data: VISIT_DAYS }}
        month="2026-09"
        minMonth={VISIT_MIN_MONTH}
        maxMonth={VISIT_MAX_MONTH}
        onMonthChange={() => {}}
        onSelectDay={() => {}}
        onSelectSlot={() => {}}
        selectedDate="2026-09-03"
        slots={{ status: "ready", data: slotsForVisitDay("2026-09-03") }}
        timeZone={VISIT_TIME_ZONE}
        timeZoneLabel={TIME_ZONE_LABEL}
        today={VISIT_TODAY_DATE}
      />
    );
  }
  if (step === "details") {
    return (
      <BookingDetailsForm
        copy={DETAILS_FORM_COPY}
        description={GRADING?.description}
        onSubmit={() => {}}
        questions={GRADING?.questions ?? []}
      />
    );
  }
  return (
    <BookingConfirmation
      calendarHref="#/book/bk_grading_new.ics"
      copy={VISIT_CONFIRMATION_COPY}
      manageHref={VAULT_MANAGE_VISIT_HREF}
      record={BOOKED_GRADING_RECORD}
      timeZoneLabel={TIME_ZONE_LABEL}
    />
  );
}

/** A grading visit booked without an account, from the service to the link. */
export const BookWithoutAnAccount: Story = {
  render: () => (
    <FlowContainer
      cases={CASES}
      description={<p>{BOOK_WITHOUT_ACCOUNT_DESCRIPTION}</p>}
    >
      {(step) => <BookStepBody step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [index, [title]] of CASES.entries()) {
      if (index > 0) {
        await userEvent.click(canvas.getByRole("button", { name: "Next" }));
      }
      expect(canvas.getByText(title)).toBeVisible();
    }
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    for (const [title] of CASES) {
      expect(canvas.getByText(title)).toBeInTheDocument();
    }
  },
};
