import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  BookingDetailsForm,
  BookingServicePicker,
  BookingSlotPicker,
  BookingSummary,
} from "@grade10/ui";
import { MapPin } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import {
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

function BookVisitPage() {
  const [serviceId, setServiceId] = useState(BOOK_VISIT_SERVICES[0]?.id);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedStart, setSelectedStart] = useState<number | undefined>();
  const [selectedEnd, setSelectedEnd] = useState<number | undefined>();
  const service =
    BOOK_VISIT_SERVICES.find((row) => row.id === serviceId) ??
    BOOK_VISIT_SERVICES[0];
  const prepTips = prepTipsForService(service?.id ?? "");

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

      <ProposalBanner title="Notes are for the desk">
        Name, email, questions and notes are a reference for the counter. Vault
        drop-off does not open an intake tracker. Incoming items do not block
        another booking.
      </ProposalBanner>

      <BookingServicePicker
        copy={SERVICE_PICKER_COPY}
        services={READY_SERVICES}
        selectedId={service?.id}
        onSelect={(id) => setServiceId(id)}
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

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
          onSelectSlot={(slot) => {
            setSelectedStart(slot.start);
            setSelectedEnd(slot.end);
          }}
        />

        <VStack className="lg:sticky lg:top-8" gap="lg" hAlign="stretch">
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
          <BookingDetailsForm
            copy={DETAILS_FORM_COPY}
            questions={service?.questions ?? []}
            initialValues={{
              name: "Alex Chan",
              email: "collector@example.com",
            }}
            onSubmit={() => navigateToStory(VAULT_CONFIRMATION_STORY_ID)}
          />
        </VStack>
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="prep-checklist">
        <h2 className="font-heading text-xl font-medium" id="prep-checklist">
          What to prepare
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
    expect(canvas.getAllByText("Card grading").length).toBeGreaterThan(0);
    expect(canvas.getByText("Vault drop-off")).toBeVisible();
    expect(canvas.getByText("Collection consultation")).toBeVisible();
    expect(
      canvas.getAllByText("13 Pak Sha Road, Causeway Bay, Hong Kong").length,
    ).toBeGreaterThan(0);
    expect(canvas.getByText(/Told the desk as a reference/)).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="booking-steps"]'),
    ).toBeNull();
  },
};
