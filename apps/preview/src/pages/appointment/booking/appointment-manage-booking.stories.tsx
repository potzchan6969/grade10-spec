import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { MANAGE_CARD_COPY } from "../../vault-content";
import { MANAGE_PAGE_COPY } from "./appointment-manage-content";
import { ManageBookingPage } from "./manage-booking-page";

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
    expect(
      canvasElement.querySelector('[data-slot="booking-slot-picker"]'),
    ).not.toBeNull();
    const picked = canvasElement.querySelectorAll(
      '[data-slot="booking-slot-picker"] [data-selected][data-day]',
    );
    expect(picked.length).toBeGreaterThan(0);
    for (const day of picked) {
      expect(day).toHaveAttribute("data-day", "2026-09-03");
    }
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
