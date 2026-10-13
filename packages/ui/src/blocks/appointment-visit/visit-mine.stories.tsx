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
