import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  BookingDetailsForm,
  BookingServicePicker,
  type BookingSlot,
  BookingSlotPicker,
  BookingSummary,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  ACCOUNT_EMAIL,
  BOOK_VISIT_NAV_COPY,
  BOOK_VISIT_SERVICES,
  CAUSEWAY_BAY,
  DETAILS_FORM_COPY,
  firstAvailableVisitDay,
  NEXT_AVAILABLE_VISIT_DATE,
  prepTipsForService,
  SERVICE_PICKER_COPY,
  SLOT_PICKER_COPY,
  SUMMARY_COPY,
  slotsForVisitDay,
  VAULT_CONFIRMATION_STORY_ID,
  VISIT_DAYS,
  VISIT_MAX_MONTH,
  VISIT_MIN_MONTH,
  VISIT_TIME_ZONE,
  VISIT_TODAY_DATE,
} from "./vault-content";
import { AppointmentPageShell, PageHeader } from "./vault-shared";
import { navigateToStory, STORE_LOCATOR_HREF } from "./workbench-story-nav";

const READY_SERVICES = {
  status: "ready" as const,
  data: BOOK_VISIT_SERVICES,
};

const CONTACT_SEED = {
  name: "Alex Chan",
  email: ACCOUNT_EMAIL,
  phone: "+85291234567",
};

const ACCOUNT_LINE_COPY = {
  signedIn: `Signed in as ${CONTACT_SEED.name}.`,
  notYou: "Not you?",
  signInLine: "Have an account? Sign in and we fill this in.",
  signIn: "Sign in",
};

type BookVisitView = "service" | "slot" | "details";

function BookVisitPage({ signedIn: signedInAtStart = true }) {
  const [signedIn, setSignedIn] = useState(signedInAtStart);
  const [view, setView] = useState<BookVisitView>("service");
  const [serviceId, setServiceId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedStart, setSelectedStart] = useState<number | undefined>();
  const [selectedEnd, setSelectedEnd] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<string>(VISIT_MIN_MONTH);
  const service = BOOK_VISIT_SERVICES.find((row) => row.id === serviceId);
  const prepTips = prepTipsForService(service?.id ?? "");

  function clearSlot() {
    setSelectedDate(undefined);
    setSelectedStart(undefined);
    setSelectedEnd(undefined);
  }

  function handleMonthChange(month: string) {
    setSelectedMonth(month);
    setSelectedDate(firstAvailableVisitDay(month));
    setSelectedStart(undefined);
    setSelectedEnd(undefined);
  }

  function selectService(id: string) {
    if (id !== serviceId) {
      clearSlot();
    }
    setServiceId(id);
  }

  function changeService() {
    clearSlot();
    setView("service");
  }

  function changeDate() {
    setView("slot");
  }

  function openSlotStep() {
    setSelectedDate(NEXT_AVAILABLE_VISIT_DATE);
    setView("slot");
  }

  function selectSlot(slot: BookingSlot) {
    setSelectedStart(slot.start);
    setSelectedEnd(slot.end);
    setView("details");
  }

  return (
    <AppointmentPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={STORE_LOCATOR_HREF}>Appointment</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Book a Visit</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader title="Book a Visit" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-b border-border p-5 lg:border-r lg:border-b-0">
          <BookingSummary
            className="rounded-none border-0 bg-transparent p-0"
            copy={SUMMARY_COPY}
            service={
              view !== "service" && service ? (
                <VStack gap="none" hAlign="start">
                  <span>{service.name}</span>
                  {service.durationLabel ? (
                    <span className="font-normal text-sm text-secondary-foreground">
                      {service.durationLabel}
                    </span>
                  ) : null}
                </VStack>
              ) : undefined
            }
            serviceAction={
              view !== "service" ? (
                <Link
                  aria-label={BOOK_VISIT_NAV_COPY.changeService}
                  className="p-0"
                  onClick={changeService}
                  render={<button type="button" />}
                  size="sm"
                  variant="secondary"
                >
                  {BOOK_VISIT_NAV_COPY.change}
                </Link>
              ) : undefined
            }
            location={CAUSEWAY_BAY.name}
            address={CAUSEWAY_BAY.address}
            start={view === "details" ? selectedStart : undefined}
            end={view === "details" ? selectedEnd : undefined}
            whenAction={
              view === "details" ? (
                <Link
                  aria-label={BOOK_VISIT_NAV_COPY.changeDate}
                  className="p-0"
                  onClick={changeDate}
                  render={<button type="button" />}
                  size="sm"
                  variant="secondary"
                >
                  {BOOK_VISIT_NAV_COPY.change}
                </Link>
              ) : undefined
            }
            timeZone={VISIT_TIME_ZONE}
            timeZoneLabel="Asia/Hong Kong time"
          />
        </aside>

        {view === "service" ? (
          <VStack className="p-5 md:p-6" gap="lg" hAlign="stretch">
            <BookingServicePicker
              copy={SERVICE_PICKER_COPY}
              services={READY_SERVICES}
              selectedId={serviceId}
              onSelect={selectService}
            />
            <div>
              <Button
                disabled={serviceId === undefined}
                onClick={openSlotStep}
                type="button"
              >
                {BOOK_VISIT_NAV_COPY.continue}
              </Button>
            </div>
          </VStack>
        ) : view === "slot" ? (
          <div className="p-5 md:p-6">
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
              selectedStart={selectedStart}
              timeZone={VISIT_TIME_ZONE}
              timeZoneLabel="Asia/Hong Kong time"
              onMonthChange={handleMonthChange}
              onSelectDay={(date) => {
                setSelectedDate(date);
                setSelectedStart(undefined);
                setSelectedEnd(undefined);
              }}
              onSelectSlot={selectSlot}
            />
          </div>
        ) : (
          <VStack className="p-5 md:p-6" gap="lg" hAlign="stretch">
            <HStack gap="sm" vAlign="center" wrap>
              <Text as="span" size="sm">
                {signedIn
                  ? ACCOUNT_LINE_COPY.signedIn
                  : ACCOUNT_LINE_COPY.signInLine}
              </Text>
              <Button
                onClick={() => setSignedIn(!signedIn)}
                size="sm"
                type="button"
                variant="ghost"
              >
                {signedIn ? ACCOUNT_LINE_COPY.notYou : ACCOUNT_LINE_COPY.signIn}
              </Button>
            </HStack>
            {service ? (
              <BookingDetailsForm
                key={`${service.id}:${signedIn}`}
                copy={DETAILS_FORM_COPY}
                questions={service.questions}
                description={service.description}
                initialValues={signedIn ? CONTACT_SEED : undefined}
                summarized={signedIn}
                onSubmit={() => navigateToStory(VAULT_CONFIRMATION_STORY_ID)}
              />
            ) : null}
            {prepTips.length > 0 ? (
              <section
                aria-labelledby="prep-checklist"
                className="flex flex-col gap-4"
              >
                <h2
                  className="font-heading text-xl font-medium"
                  id="prep-checklist"
                >
                  {BOOK_VISIT_NAV_COPY.prepTitle}
                </h2>
                <ol className="grid gap-3 sm:grid-cols-2">
                  {prepTips.map((tip, index) => (
                    <li
                      key={tip}
                      className="flex gap-3 rounded-(--radius-lg) border border-border p-3"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium tabular-nums">
                        {index + 1}
                      </span>
                      <Text className="self-center" size="sm">
                        {tip}
                      </Text>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </VStack>
        )}
      </div>
    </AppointmentPageShell>
  );
}

const meta = {
  title: "Pages/Appointment/Book Visit",
  component: BookVisitPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BookVisitPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Book a Visit" }),
    ).toBeVisible();
    expect(canvas.getByText("Grading Submission")).toBeVisible();
    expect(canvas.getByText("Vault Drop-Off")).toBeVisible();
    expect(canvas.getByText("Store/Auction Listing")).toBeVisible();
    expect(
      canvas.getByText("13 Pak Sha Road, Causeway Bay, Hong Kong"),
    ).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="booking-summary"]'),
    ).not.toBeNull();
    expect(
      canvas.getByRole("button", { name: BOOK_VISIT_NAV_COPY.continue }),
    ).toBeDisabled();
    expect(
      canvas.queryByRole("button", {
        name: BOOK_VISIT_NAV_COPY.changeService,
      }),
    ).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="booking-steps"]'),
    ).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="booking-details-form"]'),
    ).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="booking-slot-picker"]'),
    ).toBeNull();
    for (const name of [
      /Grading Submission/,
      /Vault Drop-Off/,
      /Store\/Auction Listing/,
    ]) {
      expect(canvas.getByRole("radio", { name })).not.toBeChecked();
    }
  },
};

export const Slot: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("radio", { name: /Grading Submission/ }),
    );
    await userEvent.click(
      canvas.getByRole("button", { name: BOOK_VISIT_NAV_COPY.continue }),
    );
    expect(canvas.queryByRole("button", { name: "Back" })).toBeNull();
    expect(
      canvas.getByRole("button", {
        name: BOOK_VISIT_NAV_COPY.changeService,
      }),
    ).toBeVisible();
    expect(canvas.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "2",
    );
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Sep",
    );
    expect(canvas.queryByRole("combobox", { name: /year/i })).toBeNull();
    expect(canvas.getByText("2026")).toBeVisible();
    expect(canvas.getByRole("button", { name: "10:00" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next month" }));
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Oct",
    );
    expect(canvas.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "1",
    );
    expect(canvas.getByRole("button", { name: "10:00" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next month" }));
    await userEvent.click(canvas.getByRole("button", { name: "Next month" }));
    expect(canvas.getByRole("combobox", { name: /month/i })).toHaveTextContent(
      "Dec",
    );
    expect(canvas.getByRole("button", { name: "Next month" })).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: /December 1st, 2026/ }),
    ).toBeEnabled();
    expect(canvas.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "1",
    );
    expect(canvas.getByRole("button", { name: "10:00" })).toBeVisible();
    expect(
      canvas.getByRole("button", { name: /December 2nd, 2026/ }),
    ).toBeDisabled();
  },
};

/** The details step books under the account: its name, email and phone read
 * as a summary, and only the service's questions and notes are asked. */
export const Details: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("radio", { name: /Grading Submission/ }),
    );
    await userEvent.click(
      canvas.getByRole("button", { name: BOOK_VISIT_NAV_COPY.continue }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "10:00" }));
    expect(canvas.getByText(ACCOUNT_LINE_COPY.signedIn)).toBeVisible();
    expect(canvas.getByText("Alex Chan")).toBeVisible();
    expect(canvas.getByText(ACCOUNT_EMAIL)).toBeVisible();
    expect(canvas.queryByRole("textbox", { name: "Name" })).toBeNull();
    expect(canvas.queryByRole("textbox", { name: /Email/ })).toBeNull();
  },
};

/** A guest books without an account: the details step asks for a name and an
 * email, and offers a sign-in that fills them in. */
export const Guest: Story = {
  args: { signedIn: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("radio", { name: /Grading Submission/ }),
    );
    await userEvent.click(
      canvas.getByRole("button", { name: BOOK_VISIT_NAV_COPY.continue }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "10:00" }));
    expect(canvas.getByText(ACCOUNT_LINE_COPY.signInLine)).toBeVisible();
    expect(canvas.getByRole("textbox", { name: "Name" })).toHaveValue("");
    await userEvent.click(
      canvas.getByRole("button", { name: ACCOUNT_LINE_COPY.signIn }),
    );
    expect(canvas.getByText("Alex Chan")).toBeVisible();
    expect(canvas.queryByRole("textbox", { name: "Name" })).toBeNull();
  },
};
