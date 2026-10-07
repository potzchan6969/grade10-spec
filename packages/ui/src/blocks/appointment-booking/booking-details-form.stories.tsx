import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { BookingDetailsForm } from "./booking-details-form";
import {
  ALL_KINDS_QUESTIONS,
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
      phoneCountry: "HK",
      notes: "",
      answers: {},
    });
  },
};

/** Required service answers are keyed by question key. */
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
      phoneCountry: "HK",
      notes: "",
      answers: { quantity: "1–5 cards", company: "PSA" },
    });
  },
};

/** Each of the six kinds draws its own control, with its placeholder where it
 * has one, and reports its answer: a list for checkboxes, text otherwise. */
export const SixKinds: Story = {
  args: { questions: ALL_KINDS_QUESTIONS, description: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    expect(canvas.getByPlaceholderText("Collector tag")).toBeVisible();
    expect(canvas.getByPlaceholderText("Tell us more")).toBeVisible();
    expect(canvas.getByPlaceholderText("10,000")).toBeVisible();
    expect(canvas.getByText("Pick a size")).toBeVisible();
    expect(canvas.getAllByRole("radio")).toHaveLength(2);
    expect(canvas.getAllByRole("checkbox")).toHaveLength(3);

    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ada");
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Email" }),
      "ada@example.com",
    );
    await userEvent.type(canvas.getByPlaceholderText("Collector tag"), "ada9");
    await userEvent.type(canvas.getByPlaceholderText("Tell us more"), "Hello");
    await userEvent.type(canvas.getByPlaceholderText("10,000"), "500");
    await userEvent.click(canvas.getByLabelText("Size"));
    await userEvent.click(await page.findByRole("option", { name: "Large" }));
    await userEvent.click(canvas.getByRole("radio", { name: "Pickup" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "Sleeves" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "Binder" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm Appointment" }),
    );
    expect(args.onSubmit).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      phone: "",
      phoneCountry: "HK",
      notes: "",
      answers: {
        tag: "ada9",
        story: "Hello",
        value: "500",
        size: "large",
        handover: "pickup",
        bring: ["sleeves", "binder"],
      },
    });
  },
};

/** An unticked required checkbox list is named, and nothing is reported. */
export const RequiredCheckboxes: Story = {
  args: {
    questions: [
      {
        key: "bring",
        label: "What are you bringing",
        kind: "checkboxes",
        options: ["Sleeves"],
        required: true,
      },
    ],
    description: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ada");
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Email" }),
      "ada@example.com",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm Appointment" }),
    );
    expect(canvas.getByText("This is needed to continue.")).toBeVisible();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** The notes field is the site's to ask for: absent unless copy names it. */
export const WithoutNotes: Story = {
  args: { questions: [], description: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("textbox", { name: /Notes/ })).toBeNull();
  },
};

export const WithNotes: Story = {
  args: {
    questions: [],
    description: undefined,
    copy: { ...DETAILS_FORM_COPY, notes: "Notes" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ada");
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Email" }),
      "ada@example.com",
    );
    await userEvent.type(
      canvas.getByRole("textbox", { name: /Notes/ }),
      "  Ring the bell ",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm Appointment" }),
    );
    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ notes: "Ring the bell" }),
    );
  },
};

/** The account email is shown and submitted, and cannot be typed over. */
export const LockedEmail: Story = {
  args: {
    questions: [],
    description: undefined,
    emailDisabled: true,
    initialValues: { email: "collector@example.com", phoneCountry: "HK" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Email" });
    expect(field).toHaveValue("collector@example.com");
    expect(field).toBeDisabled();
    expect(field).not.toHaveProperty("readOnly", true);
  },
};

/** While the booking is in flight the submit is held, and the consumer's
 * error — a time taken meanwhile — is shown beneath the fields. */
export const PendingWithError: Story = {
  args: {
    questions: [],
    description: undefined,
    initialValues: {
      name: "Ada",
      email: "ada@example.com",
      phoneCountry: "HK",
    },
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
