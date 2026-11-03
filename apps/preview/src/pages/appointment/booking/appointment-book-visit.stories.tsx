import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { BookVisitPage } from "./book-visit-page";

const meta = {
  title: "Appointment/Booking/Screens/Book Visit",
  component: BookVisitPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { scenario: "normal" },
} satisfies Meta<typeof BookVisitPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** At the first step: a pick only selects, Continue moves on, and Continue
 * with nothing picked says what is missing. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_1898581b-4c29-46f4-943b-f2c7e62d8842" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Book a visit" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Choose a service to continue.",
    );
    await userEvent.click(
      canvas.getByRole("radio", { name: /^Grading drop-off/ }),
    );
    expect(
      canvas.getByRole("heading", { level: 2, name: "What do you need?" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Pick a shop" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("radio", { name: /^Central/ }));
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Pick a time" }),
    ).toBeVisible();
    expect(canvas.queryByRole("button", { name: /Earliest/ })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: /^Thu 22 Oct/ }));
    await userEvent.click(canvas.getByRole("button", { name: "15:00" }));
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(
      canvas.getByRole("heading", { level: 2, name: "Your details" }),
    ).toBeVisible();
  },
};

export const TimeJustTaken: Story = {
  parameters: {
    verification: { caseId: "vc_95fd555a-ea8a-4082-a6a3-b70a42a8a937" },
  },
  args: { scenario: "time just taken" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "15:00 on Thu 22 Oct was just taken.",
    );
    expect(canvas.queryByRole("button", { name: "15:00" })).toBeNull();
  },
};

export const FullDay: Story = {
  parameters: {
    verification: { caseId: "vc_71a965e5-2d28-4805-a98e-cadda528d634" },
  },
  args: { scenario: "full day" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sat 17 Oct is full at Central.")).toBeVisible();
  },
};

/** Guest booking is off: signed out, the details step asks for a sign-in,
 * and the picks are kept through it. */
export const SignedOut: Story = {
  parameters: {
    verification: { caseId: "vc_c71d10d4-ec94-465e-a4dd-e96949323c8b" },
  },
  args: { scenario: "signed out" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("textbox", { name: "Name" })).toBeNull();
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign in to book" }),
    );
    expect(canvas.getByText(`Signed in as Alex Chan.`)).toBeVisible();
    expect(
      canvas.getByRole("button", { name: /^Book Thu 22 Oct, 15:00/ }),
    ).toBeVisible();
  },
};

export const TooManyTriesToday: Story = {
  parameters: {
    verification: { caseId: "vc_f42b7dff-c181-4f76-b2c2-3b371dbed6ea" },
  },
  args: { scenario: "too many tries today" },
};

export const SlowNetwork: Story = {
  parameters: {
    verification: { caseId: "vc_7e3e6ace-6267-454f-9503-fc31f5751011" },
  },
  args: { scenario: "slow network" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent(
      "Keep this page open. We won’t book you twice.",
    );
    expect(canvas.getByRole("button", { name: "Back" })).toBeDisabled();
  },
};

export const SignedInNoPhone: Story = {
  parameters: {
    verification: { caseId: "vc_054e5969-c6a4-4a33-b082-dcdb5b34a639" },
  },
  args: { scenario: "signed in, no phone on account" },
};

export const ServiceNeedsAPhone: Story = {
  parameters: {
    verification: { caseId: "vc_4c7e0dbe-af47-4314-945b-51478ce09fe9" },
  },
  args: { scenario: "service needs a phone" },
};

export const PaidService: Story = {
  parameters: {
    verification: { caseId: "vc_6db0bde1-d354-4b17-afc6-946087254512" },
  },
  args: { scenario: "paid service" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", {
        name: "Confirm booking with HK$100 deposit",
      }),
    ).toBeVisible();
    expect(
      canvas.getByText(
        "Refunded if you cancel at least 24 hours before, or if the shop cancels.",
      ),
    ).toBeVisible();
    expect(canvas.queryByText(/We hold this time/)).toBeNull();
    expect(canvas.queryByText("I’m booking for someone else")).toBeNull();
  },
};

export const ConfirmingPayment: Story = {
  parameters: {
    verification: { caseId: "vc_6d21f7d5-d982-4930-a72b-c6c8ee64ee53" },
  },
  args: { scenario: "confirming payment" },
};

export const PaidAndBooked: Story = {
  parameters: {
    verification: { caseId: "vc_80f978cb-011c-481c-9a48-c62a93a9d77e" },
  },
  args: { scenario: "paid and booked" },
};

export const PaymentNotCompleted: Story = {
  parameters: {
    verification: { caseId: "vc_4ce472ef-57b7-4653-8c6c-0661de28224a" },
  },
  args: { scenario: "payment not completed" },
};

/** At 390px the summary folds into the bar and the month into a strip. */
export const Phone: Story = {
  parameters: {
    verification: { caseId: "vc_e88d0442-8375-42d1-903d-2654d126c3cc" },
  },
  args: { scenario: "full day" },
  globals: { viewport: { value: "mobile1" } },
};
