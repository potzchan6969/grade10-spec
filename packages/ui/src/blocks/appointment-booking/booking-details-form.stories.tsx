import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { BookingDetailsForm } from "./booking-details-form";
import {
  ALL_KINDS_QUESTIONS,
  BOARD_GRADING_QUESTIONS,
  CONSULTATION_SERVICE,
  DETAILS_FORM_COPY,
  GRADING_SERVICE,
  VAULTING_SERVICE,
} from "./fixtures";

const meta = {
  title: "Appointment/Booking/Blocks/BookingDetailsForm",
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
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(
      canvas.getByText("Enter an email like name@example.com."),
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
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
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
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
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
    // Three options, and booking for someone else.
    expect(canvas.getAllByRole("checkbox")).toHaveLength(4);

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
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
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
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(canvas.getByText("Choose at least one.")).toBeVisible();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** The notes field is the site's to ask for: absent unless copy names it. */
export const WithoutNotes: Story = {
  args: {
    copy: { ...DETAILS_FORM_COPY, notes: undefined },
    questions: [],
    description: undefined,
  },
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
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
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
    expect(canvas.getByRole("button", { name: /^Book/ })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(
      canvas.getByText("That time was just taken. Pick another."),
    ).toBeVisible();
    expect(canvas.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
  },
};

/** A signed-in collector's name and email read as one summary; the
 * reported values are the seeded ones. */
export const Summarized: Story = {
  args: {
    questions: [],
    description: undefined,
    summarized: true,
    initialValues: {
      name: "Ada Lau",
      email: "ada@example.com",
      phone: "+85291234567",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Booking as")).toBeVisible();
    expect(canvas.getByText("ada@example.com")).toBeVisible();
    expect(canvas.queryByRole("textbox", { name: "Name" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ada Lau",
        email: "ada@example.com",
        phone: "+85291234567",
      }),
    );
  },
};

/** A signed-in collector with no phone on the account is asked for one,
 * still optional. */
export const SummarizedWithoutPhone: Story = {
  args: {
    questions: [],
    description: undefined,
    summarized: true,
    initialValues: { name: "Ada Lau", email: "ada@example.com" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Booking as")).toBeVisible();
    expect(
      canvas.getByRole("textbox", { name: "Phone (optional)" }),
    ).toBeVisible();
  },
};

/** A service that needs a phone refuses an empty one and drops the
 * Optional mark; a summary without a phone keeps the phone field. */
export const PhoneRequired: Story = {
  args: {
    questions: [],
    description: undefined,
    phoneRequired: true,
    summarized: true,
    initialValues: { name: "Ada Lau", email: "ada@example.com" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Booking as")).toBeVisible();
    expect(canvas.getByRole("textbox", { name: "Phone" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(
      canvas.getByText("Add a phone number. The shop calls before this visit."),
    ).toBeVisible();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

const SIGNED_IN = (
  <p className="m-0 flex flex-wrap items-center gap-x-2 text-sm">
    <span>Signed in as Alex Chan.</span>
    <button className="min-h-11 font-semibold underline" type="button">
      Not you?
    </button>
  </p>
);

/** The board's grading questions under their heading, each hint in view;
 * an answer out of bounds is told what fits. */
export const AboutYourCards: Story = {
  args: {
    questions: BOARD_GRADING_QUESTIONS,
    questionsTitle: "About your cards",
    description: undefined,
    account: SIGNED_IN,
    summarized: true,
    initialValues: {
      name: "Alex Chan",
      email: "alex.chan@example.com",
      phone: "+85291234567",
    },
    onInvalid: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 3, name: "About your cards" }),
    ).toBeVisible();
    expect(canvas.getByText("1 to 19 cards.")).toBeVisible();
    await userEvent.type(
      canvas.getByRole("spinbutton", { name: "How many cards?" }),
      "40",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(
      canvas.getByText(
        "Enter 1 to 19. For 20 or more, go back and choose Bulk grading drop-off.",
      ),
    ).toBeVisible();
    expect(canvas.getByText("Choose a grading company.")).toBeVisible();
    expect(args.onInvalid).toHaveBeenLastCalledWith(2);
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** A hint and an error on one field leave the control beside it in line:
 * the label, hint, control and error of each field share the grid's rows. */
export const AlignedBesideAHint: Story = {
  args: {
    questions: BOARD_GRADING_QUESTIONS.slice(0, 2),
    questionsTitle: "About your cards",
    description: undefined,
    className: "max-w-[600px]",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const top = (element: HTMLElement) =>
      Math.round(element.getBoundingClientRect().top);
    const count = canvas.getByRole("spinbutton", { name: "How many cards?" });
    const box = count.closest<HTMLElement>('[data-slot="input-box"]') ?? count;
    const company = canvas.getByRole("combobox", { name: "Grading company" });
    expect(top(box)).toBe(top(company));
    await userEvent.type(count, "40");
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(top(box)).toBe(top(company));
  },
};

/** Signed out: each contact field with the line under its label. */
export const SignedOutHints: Story = {
  args: { questions: [], description: undefined, phoneRequired: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("We send the confirmation here.")).toBeVisible();
    expect(canvas.getByText("The shop calls before this visit.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(canvas.getByText("Enter your name.")).toBeVisible();
  },
};

/** Booking for someone else asks their name, and reports it. */
export const ForSomeoneElse: Story = {
  args: {
    questions: [],
    description: undefined,
    summarized: true,
    initialValues: {
      name: "Alex Chan",
      email: "alex.chan@example.com",
      phone: "+85291234567",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "I’m booking for someone else" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(canvas.getByText("Enter their name.")).toBeVisible();
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Their name" }),
      " Ben Chan ",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Book" }));
    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ bookedFor: "Ben Chan", name: "Alex Chan" }),
    );
  },
};

/** A paid service: the consent line closes the form, and the action bar
 * outside it sends it, naming the deposit. */
export const PaidWithBar: Story = {
  args: {
    questions: [],
    description: undefined,
    formId: "booking-details",
    hideSubmit: true,
    summarized: true,
    initialValues: {
      name: "Alex Chan",
      email: "alex.chan@example.com",
      phone: "+85291234567",
    },
    footer: (
      <>
        <p className="m-0 text-[13px] leading-[18px]">
          We use these details to run your visit and email you about it.{" "}
          <a className="font-semibold underline" href="#privacy">
            Privacy policy
          </a>
        </p>
      </>
    ),
  },
  render: (args) => (
    <div>
      <BookingDetailsForm {...args} />
      <button form="booking-details" type="submit">
        Confirm booking with HK$100 deposit
      </button>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Book" })).toBeNull();
    await userEvent.click(
      canvas.getByRole("button", {
        name: "Confirm booking with HK$100 deposit",
      }),
    );
    expect(args.onSubmit).toHaveBeenCalledTimes(1);
  },
};

/** A slow write: every field reads only. */
export const Pending: Story = {
  args: { questions: [], description: undefined, pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "readonly",
    );
  },
};
