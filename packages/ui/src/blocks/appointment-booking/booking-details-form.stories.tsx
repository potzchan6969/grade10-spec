import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingDetailsForm } from "./booking-details-form";
import { DETAILS_FORM_COPY, GRADING_SERVICE } from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingDetailsForm",
  component: BookingDetailsForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: DETAILS_FORM_COPY,
    questions: GRADING_SERVICE.questions,
    onSubmit: fn(),
  },
} satisfies Meta<typeof BookingDetailsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A missing address and an unanswered required question are named, and
 * nothing is reported. */
export const MissingDetails: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ada");
    await userEvent.click(
      canvas.getByRole("button", { name: "Book the visit" }),
    );
    expect(
      canvas.getByText("Tell us where to send the confirmation."),
    ).toBeVisible();
    expect(canvas.getByText("Pick one to continue.")).toBeVisible();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** Values come back trimmed, the address lowercased, and answers keyed by
 * question id — an optional question left blank is absent. */
export const ReportsTrimmedValues: Story = {
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
    await userEvent.click(canvas.getByRole("radio", { name: "Slabbed" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "Book the visit" }),
    );
    expect(args.onSubmit).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      phone: "",
      notes: "",
      answers: { format: "Slabbed" },
    });
  },
};

/** While the booking is in flight the submit is held, and the consumer's
 * error — a time taken meanwhile — is shown beneath the fields. */
export const PendingWithError: Story = {
  args: {
    initialValues: { name: "Ada", email: "ada@example.com" },
    pending: true,
    error: "That time was just taken. Pick another.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: /Book the visit/ }),
    ).toBeDisabled();
    expect(
      canvas.getByText("That time was just taken. Pick another."),
    ).toBeVisible();
    expect(canvas.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
  },
};
