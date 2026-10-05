import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  BookingDetailsForm,
  BookingServicePicker,
  type BookingSlot,
  BookingSlotPicker,
  BookingSummary,
} from "@grade10/ui";
import { MapPin } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  BOOK_VISIT_NAV_COPY,
  BOOK_VISIT_SERVICES,
  CAUSEWAY_BAY,
  DETAILS_FORM_COPY,
  prepTipsForService,
  SERVICE_PICKER_COPY,
  SLOT_PICKER_COPY,
  SUMMARY_COPY,
  VAULT_CONFIRMATION_STORY_ID,
  VISIT_DAYS,
  VISIT_MONTH,
  VISIT_SLOTS,
  VISIT_TIME_ZONE,
} from "./vault-content";
import {
  AppointmentPageShell,
  PageHeader,
  ProposalBanner,
} from "./vault-shared";
import { navigateToStory, STORE_LOCATOR_HREF } from "./workbench-story-nav";

const READY_SERVICES = {
  status: "ready" as const,
  data: BOOK_VISIT_SERVICES,
};

const CONTACT_SEED = {
  name: "Alex Chan",
  email: "collector@example.com",
};

type BookVisitView = "service" | "slot" | "details";

function BookVisitPage() {
  const [view, setView] = useState<BookVisitView>("service");
  const [serviceId, setServiceId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedStart, setSelectedStart] = useState<number | undefined>();
  const [selectedEnd, setSelectedEnd] = useState<number | undefined>();
  const service = BOOK_VISIT_SERVICES.find((row) => row.id === serviceId);
  const prepTips = prepTipsForService(service?.id ?? "");

  function clearSlot() {
    setSelectedDate(undefined);
    setSelectedStart(undefined);
    setSelectedEnd(undefined);
  }

  function selectService(id: string) {
    if (id !== serviceId) {
      clearSlot();
    }
    setServiceId(id);
  }

  function goBack() {
    if (view === "details") {
      setView("slot");
      return;
    }
    clearSlot();
    setView("service");
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
        <BreadcrumbItem current>Book a visit</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title="Book a visit"
        description="Optional diary at the Hong Kong Grade10 Store. Walk-in is fine. Answers help the desk prepare — they are not an intake record."
      />

      {view === "details" ? (
        <ProposalBanner title="Notes are for the desk">
          Name, email, questions and notes are a reference for the counter.
          Vault drop-off does not open an intake tracker. Incoming items do not
          block another booking.
        </ProposalBanner>
      ) : null}

      {view === "service" ? (
        <VStack gap="lg" hAlign="stretch">
          <BookingServicePicker
            copy={SERVICE_PICKER_COPY}
            services={READY_SERVICES}
            selectedId={serviceId}
            onSelect={selectService}
          />
          <HStack gap="sm" vAlign="start">
            <span className="mt-0.5 shrink-0 text-primary">
              <MapPin aria-hidden size={20} />
            </span>
            <VStack gap="none" hAlign="start">
              <Text as="span" weight="medium">
                {CAUSEWAY_BAY.name}
              </Text>
              <Text as="span" size="sm" tone="secondary">
                {CAUSEWAY_BAY.address}
              </Text>
            </VStack>
          </HStack>
          <div>
            <Button
              disabled={serviceId === undefined}
              onClick={() => setView("slot")}
              type="button"
            >
              {BOOK_VISIT_NAV_COPY.continue}
            </Button>
          </div>
        </VStack>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <VStack className="lg:sticky lg:top-8" gap="md" hAlign="stretch">
            <div>
              <Button onClick={goBack} type="button" variant="ghost">
                {BOOK_VISIT_NAV_COPY.back}
              </Button>
            </div>
            <BookingSummary
              copy={SUMMARY_COPY}
              service={service?.name}
              location={CAUSEWAY_BAY.name}
              address={CAUSEWAY_BAY.address}
              start={selectedStart}
              end={selectedEnd}
              timeZone={VISIT_TIME_ZONE}
              timeZoneLabel="Hong Kong time"
            />
          </VStack>

          {view === "slot" ? (
            <VStack gap="md" hAlign="stretch">
              <Text as="h2" size="lg" weight="medium">
                {BOOK_VISIT_NAV_COPY.slotTitle}
              </Text>
              <BookingSlotPicker
                copy={SLOT_PICKER_COPY}
                month={VISIT_MONTH}
                minMonth={VISIT_MONTH}
                maxMonth={VISIT_MONTH}
                days={{ status: "ready", data: VISIT_DAYS }}
                selectedDate={selectedDate}
                slots={{ status: "ready", data: VISIT_SLOTS }}
                selectedStart={selectedStart}
                timeZone={VISIT_TIME_ZONE}
                timeZoneLabel="Hong Kong time"
                onMonthChange={() => {}}
                onSelectDay={(date) => {
                  setSelectedDate(date);
                  setSelectedStart(undefined);
                  setSelectedEnd(undefined);
                }}
                onSelectSlot={selectSlot}
              />
            </VStack>
          ) : (
            <VStack gap="lg" hAlign="stretch">
              {service ? (
                <BookingDetailsForm
                  key={service.id}
                  copy={DETAILS_FORM_COPY}
                  questions={service.questions}
                  initialValues={CONTACT_SEED}
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
      )}
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
      canvas.getByRole("heading", { level: 1, name: "Book a visit" }),
    ).toBeVisible();
    expect(canvas.getByText("Card grading")).toBeVisible();
    expect(canvas.getByText("Vault drop-off")).toBeVisible();
    expect(canvas.getByText("Collection consultation")).toBeVisible();
    expect(
      canvas.getByText("13 Pak Sha Road, Causeway Bay, Hong Kong"),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: BOOK_VISIT_NAV_COPY.continue }),
    ).toBeDisabled();
    expect(
      canvasElement.querySelector('[data-slot="booking-steps"]'),
    ).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="booking-details-form"]'),
    ).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="booking-slot-picker"]'),
    ).toBeNull();

    const picker = canvas.getByRole("radiogroup", {
      name: SERVICE_PICKER_COPY.title,
    });
    await userEvent.click(
      within(picker).getByRole("radio", { name: /Card grading/ }),
    );
    const continueButton = await canvas.findByRole("button", {
      name: BOOK_VISIT_NAV_COPY.continue,
    });
    expect(continueButton).toBeEnabled();
    await userEvent.click(continueButton);
    expect(
      canvasElement.querySelector('[data-slot="booking-slot-picker"]'),
    ).not.toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="booking-details-form"]'),
    ).toBeNull();

    const dayTwo = canvasElement.querySelector(
      '[data-slot="booking-day"][data-available="true"]',
    );
    expect(dayTwo).not.toBeNull();
    expect(dayTwo).toHaveTextContent("2");
    await userEvent.click(dayTwo as HTMLElement);
    await userEvent.click(await canvas.findByRole("radio", { name: /^10:00/ }));
    expect(
      canvasElement.querySelector('[data-slot="booking-details-form"]'),
    ).not.toBeNull();
    expect(canvas.getByText("Is the card raw or slabbed?")).toBeVisible();
    expect(canvas.getByText(/Told the desk as a reference/)).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="booking-slot-picker"]'),
    ).toBeNull();
  },
};
