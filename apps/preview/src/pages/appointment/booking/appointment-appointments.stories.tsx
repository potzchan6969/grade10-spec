import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { VisitList, type VisitListRow, VisitMine } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { APPOINTMENTS_COPY } from "../../vault-content";
import { AppointmentPageShell } from "../../vault-shared";

const EMAIL = "alex@example.com";
const VISIT_HREF = "#/book/manage";

const UPCOMING: readonly VisitListRow[] = [
  {
    id: "bk_grading",
    service: "Grading Submission",
    status: "Booked",
    tone: "plain",
    location: "Causeway Bay",
    when: "Thu 3 Sep, 10:15",
    href: VISIT_HREF,
  },
];

const PAST: readonly VisitListRow[] = [
  {
    id: "bk_vault",
    service: "Vault Drop-Off",
    status: "Missed",
    tone: "warn",
    location: "Central",
    when: "Sat 22 Aug, 11:30",
    href: VISIT_HREF,
  },
  {
    id: "bk_done",
    service: "Grading Submission",
    status: "Your cards are with grading",
    tone: "ok",
    location: "Causeway Bay",
    when: "Fri 7 Aug, 17:00",
    href: VISIT_HREF,
  },
];

function AppointmentsPage({ empty = false }: { empty?: boolean }) {
  return (
    <AppointmentPageShell>
      <div className="mx-auto w-full max-w-xl">
        <VisitMine
          bookHref="#/book"
          copy={{
            title: "My visits",
            signedIn: `Signed in as ${EMAIL}`,
            notYou: "Not you?",
            book: "Book a visit",
            note: `This lists every visit booked with ${EMAIL}.`,
          }}
          onNotYou={() => {}}
        >
          {empty ? (
            <EmptyState
              description={APPOINTMENTS_COPY.emptyDescription}
              title={APPOINTMENTS_COPY.emptyTitle}
            />
          ) : (
            <VisitList
              copy={{ upcoming: "Upcoming", past: "Past" }}
              onOpen={() => {}}
              past={PAST}
              upcoming={UPCOMING}
            />
          )}
        </VisitMine>
      </div>
    </AppointmentPageShell>
  );
}

const meta = {
  title: "Appointment/Booking/Screens/Appointments",
  component: AppointmentsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppointmentsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** My visits: upcoming first, past after, each row opening its visit. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "My visits" }),
    ).toBeVisible();
    expect(canvas.getByText(`Signed in as ${EMAIL}`)).toBeVisible();
    expect(canvas.getByRole("heading", { name: "Upcoming" })).toBeVisible();
    expect(canvas.getByRole("heading", { name: "Past" })).toBeVisible();
    expect(
      canvas.getAllByRole("link", { name: /Grading Submission/ }).at(0),
    ).toHaveAttribute("href", VISIT_HREF);
    expect(
      within(
        canvasElement.querySelector('[data-slot="visit-mine"]') as HTMLElement,
      ).getByRole("link", { name: "Book a visit" }),
    ).toBeVisible();
  },
};

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(APPOINTMENTS_COPY.emptyTitle)).toBeVisible();
    expect(
      within(
        canvasElement.querySelector('[data-slot="visit-mine"]') as HTMLElement,
      ).getByRole("link", { name: "Book a visit" }),
    ).toBeVisible();
  },
};
