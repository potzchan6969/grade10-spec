import { Alert } from "@grade10/design-system/components/display/alert";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { BookingConfirmation } from "@grade10/ui";
import { CalendarBlank } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  VAULT_MANAGE_VISIT_HREF,
  VAULT_MY_VISITS_STORY_ID,
  VISIT_CONFIRMATION_COPY,
  VISIT_FIXTURE,
  VISIT_RECORD,
} from "./vault-content";
import {
  AppointmentPageShell,
  PageHeader,
  ProposalBanner,
} from "./vault-shared";
import { navigateToStory, STORE_LOCATOR_HREF } from "./workbench-story-nav";

function AppointmentConfirmationPage() {
  const { visitId, email, phone, bringTips } = VISIT_FIXTURE;

  return (
    <AppointmentPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={STORE_LOCATOR_HREF}>Appointment</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Visit booked</BreadcrumbItem>
      </Breadcrumbs>

      <Alert
        dismissible={false}
        status="success"
        title="Visit booked"
        description={`${visitId} at ${VISIT_RECORD.location}. This is a diary visit — intake starts when staff register your items at the counter.`}
      />

      <PageHeader
        title="Visit booked"
        description={`${email} · ${phone}`}
        actions={
          <Button
            type="button"
            leading={<CalendarBlank aria-hidden size={18} />}
          >
            Add to calendar
          </Button>
        }
      />

      <Text as="p" size="sm" tone="secondary">
        Told the desk as a reference — not an intake record.
      </Text>

      <ProposalBanner title="Walk-in also fine">
        No booking required. You can go straight to the Hong Kong Grade10 Store
        in Causeway Bay and ask for vaulting — even without an account yet.
      </ProposalBanner>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <BookingConfirmation
          copy={VISIT_CONFIRMATION_COPY}
          record={VISIT_RECORD}
          manageHref={VAULT_MANAGE_VISIT_HREF}
          calendarHref="#calendar"
          timeZoneLabel="Hong Kong time"
        />

        <section
          className="flex flex-col gap-5 rounded-(--radius-2xl) border border-border bg-card p-5"
          aria-labelledby="prep-checklist"
        >
          <h2 className="font-heading text-xl font-medium" id="prep-checklist">
            What to prepare
          </h2>
          <ol className="grid gap-3">
            {bringTips.map((tip, index) => (
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
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={() => navigateToStory(VAULT_MY_VISITS_STORY_ID)}
      >
        Appointments
      </Button>
    </AppointmentPageShell>
  );
}

const meta = {
  title: "Pages/Appointment/Confirmation",
  component: AppointmentConfirmationPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppointmentConfirmationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Visit booked" }),
    ).toBeVisible();
    expect(canvas.getByText(/What to prepare/)).toBeVisible();
    expect(canvas.getByText("Move or cancel this visit")).toBeVisible();
    expect(
      canvas.getByText("Told the desk as a reference — not an intake record."),
    ).toBeVisible();
    expect(canvas.queryByText("Track this visit")).not.toBeInTheDocument();
  },
};
