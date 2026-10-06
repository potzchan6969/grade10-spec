import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { BookingDetailsForm } from "./booking-details-form";
import {
  CONSULTATION_SERVICE,
  DETAILS_FORM_COPY,
  GRADING_SERVICE,
  VAULTING_SERVICE,
} from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingDetailsForm",
  component: BookingDetailsForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: DETAILS_FORM_COPY,
    questions: GRADING_SERVICE.questions,
    description: GRADING_SERVICE.description,
    onSubmit: fn(),
  },
} satisfies Meta<typeof BookingDetailsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VaultDropOff: Story = {
  args: {
    questions: VAULTING_SERVICE.questions,
    description: VAULTING_SERVICE.description,
  },
};

export const CollectionConsultation: Story = {
  args: {
    questions: CONSULTATION_SERVICE.questions,
    description: CONSULTATION_SERVICE.description,
  },
};

/** A missing address is named, and nothing is reported. */
export const MissingDetails: Story = {
  args: { questions: [], description: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ada");
    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm Appointment" }),
    );
    expect(
      canvas.getByText("Tell us where to send the confirmation."),
    ).toBeVisible();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** Values come back trimmed and the address lowercased. */
export const ReportsTrimmedValues: Story = {
  args: { questions: [], description: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Name" }),
      "  Ada  ",
    );
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Email" }),
      "Ada@Example.com",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm Appointment" }),
    );
    expect(args.onSubmit).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      phone: "",
      notes: "",
      answers: {},
    });
  },
};

/** Required service answers are keyed by question id. */
export const ReportsGradingAnswers: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ada");
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Email" }),
      "ada@example.com",
    );
    await userEvent.click(canvas.getByLabelText("Estimated Quantity"));
    await waitFor(() => {
      expect(page.getByRole("option", { name: "1–5 cards" })).toBeVisible();
    });
    await userEvent.click(page.getByRole("option", { name: "1–5 cards" }));
    await waitFor(() => {
      expect(page.queryByRole("listbox")).toBeNull();
    });
    await userEvent.click(canvas.getByRole("radio", { name: "PSA" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm Appointment" }),
    );
    expect(args.onSubmit).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      phone: "",
      notes: "",
      answers: { quantity: "1–5 cards", company: "PSA" },
    });
  },
};

/** The account email is shown and submitted, and cannot be typed over. */
export const LockedEmail: Story = {
  args: {
    questions: [],
    description: undefined,
    emailReadOnly: true,
    initialValues: { email: "collector@example.com" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Email" });
    expect(field).toHaveValue("collector@example.com");
    expect(field).toHaveProperty("readOnly", true);
    expect(field).not.toBeDisabled();
  },
};

/** While the booking is in flight the submit is held, and the consumer's
 * error — a time taken meanwhile — is shown beneath the fields. */
export const PendingWithError: Story = {
  args: {
    questions: [],
    description: undefined,
    initialValues: { name: "Ada", email: "ada@example.com" },
    pending: true,
    error: "That time was just taken. Pick another.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: /Confirm Appointment/ }),
    ).toBeDisabled();
    expect(
      canvas.getByText("That time was just taken. Pick another."),
    ).toBeVisible();
    expect(canvas.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
  },
};
