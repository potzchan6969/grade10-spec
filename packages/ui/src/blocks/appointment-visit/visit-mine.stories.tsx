import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BOOK_HREF, LIST_COPY, PAST_ROWS, UPCOMING_ROWS } from "./fixtures";
import { VisitList } from "./visit-list";
import { VisitMine } from "./visit-mine";

const meta = {
  title: "Appointment/Visit/Blocks/VisitMine",
  component: VisitMine,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      title: "My visits",
      signedIn: "Signed in as alex@example.com",
      notYou: "Not you?",
      book: "Book a visit",
      note: "This lists every visit booked with alex@example.com.",
    },
    bookHref: BOOK_HREF,
    onNotYou: fn(),
    children: (
      <VisitList
        copy={LIST_COPY}
        onOpen={fn()}
        past={PAST_ROWS}
        upcoming={UPCOMING_ROWS}
      />
    ),
  },
} satisfies Meta<typeof VisitMine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Who is signed in, the visits, then Book a visit across the page. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_6a354e33-8aa3-45e9-a337-7c8ea87c293c" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "My visits" }),
    ).toBeVisible();
    expect(canvas.getByRole("link", { name: "Book a visit" })).toHaveAttribute(
      "href",
      BOOK_HREF,
    );
    await userEvent.click(canvas.getByRole("button", { name: "Not you?" }));
    expect(args.onNotYou).toHaveBeenCalledTimes(1);
  },
};

/** Not you? is signing out: it spins, keeps focus and takes no second press. */
export const NotYouPending: Story = {
  parameters: {
    verification: { caseId: "vc_cd84b0c0-8891-40ed-8a00-941ec255fa52" },
  },
  args: { notYouPending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const notYou = canvas.getByRole("button", { name: "Not you?" });
    expect(notYou).toHaveAttribute("aria-busy", "true");
    notYou.focus();
    expect(notYou).toHaveFocus();
    await userEvent.click(notYou);
    expect(args.onNotYou).not.toHaveBeenCalled();
  },
};

/** The sign-out was refused: the reason shows under Not you?, which works again. */
export const NotYouFailed: Story = {
  parameters: {
    verification: { caseId: "vc_f1e0ab9c-512a-400b-a06b-1745b7baf436" },
  },
  args: { notYouFailed: "We couldn’t sign you out. Try again." },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "We couldn’t sign you out. Try again.",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Not you?" }));
    expect(args.onNotYou).toHaveBeenCalledTimes(1);
  },
};
