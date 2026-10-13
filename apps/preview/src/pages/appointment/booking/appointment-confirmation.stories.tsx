import { VisitBookedPass } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AppointmentPageShell } from "../../vault-shared";
import { BOARD_ZONE, hkSlot, ME } from "./book-visit-board";

const SLOT = hkSlot("2026-10-22", "15:00");

/** Booked: the pass with its acts, and beside it what to know. */
function AppointmentConfirmationPage({ paid = false }: { paid?: boolean }) {
  return (
    <AppointmentPageShell>
      <VisitBookedPass
        before={[
          "Bring the cards in sleeves.",
          "We hold your time until 15:15. Running late? Tell us from your visit page.",
          "Grading fees are paid at the counter",
        ]}
        confirmation={{
          answers: [
            { key: "cards", label: "How many cards?", answer: "12" },
            { key: "company", label: "Grading company", answer: "PSA" },
            { key: "phone", label: "Phone", answer: "+852 9123 4567" },
          ],
          calendarHref: "data:text/calendar,BEGIN:VCALENDAR",
          manageHref: "#manage",
          record: {
            id: "bk_board",
            service: paid ? "Bulk grading drop-off" : "Grading drop-off",
            location: "Central",
            address: "2/F, 18 Queen’s Road Central",
            timeZone: BOARD_ZONE,
            start: SLOT.start,
            end: SLOT.end,
            state: "booked",
          },
        }}
        copy={{
          confirmation: {
            title: "You are booked",
            body: `We emailed ${ME.email}.`,
            service: "Service",
            location: "Shop",
            when: "Time",
            beforeYouCome: "Before you come",
            answers: "What you told us",
            manage: "Change or cancel",
            calendar: "Add to calendar",
          },
          pass: {
            title: "Booked",
            nameLabel: "Booked for",
            note: "At the counter, give your phone or email.",
          },
          brand: "Grade10",
          directions: "Directions",
          until: "You can change or cancel until 15:00 on Thu 22 Oct.",
          before: "Before you come",
          getThere: "How to get there",
          another: "Book another visit",
          calendarSaved: "Calendar file saved",
        }}
        directionsHref="https://maps.google.com/?q=18+Queen%27s+Road+Central+Hong+Kong"
        getThere={[
          { label: "Shop", value: "Central" },
          { label: "Where", value: "2/F, 18 Queen’s Road Central" },
          { label: "Directions", value: "MTR Central exit D2" },
          { label: "Shop phone", value: "2345 6789" },
        ]}
        name={ME.name}
        onAgain={() => undefined}
        paid={
          paid
            ? {
                label: "Paid",
                value: "HK$100.00 deposit",
                refund:
                  "Refunded if you cancel at least 24 hours before, or if the shop cancels.",
              }
            : undefined
        }
        receipt={
          paid
            ? "Paid HK$100.00 deposit. Your receipt is in that email."
            : undefined
        }
        when="Thu 22 Oct, 15:00 to 15:30 HKT"
      />
    </AppointmentPageShell>
  );
}

const meta = {
  title: "Appointment/Booking/Screens/Confirmation",
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
      canvas.getByRole("heading", { level: 1, name: "You are booked" }),
    ).toBeVisible();
    expect(canvas.getByText("Thu 22 Oct, 15:00 to 15:30 HKT")).toBeVisible();
    expect(
      canvas.getByRole("link", { name: "Change or cancel" }),
    ).toBeVisible();
    expect(
      canvas.getByText("You can change or cancel until 15:00 on Thu 22 Oct."),
    ).toBeVisible();
  },
};

export const PaidAndBooked: Story = { args: { paid: true } };

export const Phone: Story = { globals: { viewport: { value: "mobile1" } } };
