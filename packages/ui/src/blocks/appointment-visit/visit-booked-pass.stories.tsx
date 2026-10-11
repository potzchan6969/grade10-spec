import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  CONFIRMATION_COPY,
  LIVE_ANSWERS,
  LIVE_RECORD,
} from "../appointment-booking/fixtures";
import {
  BOOKED_BEFORE,
  BOOKED_PASS_COPY,
  DIRECTIONS_HREF,
  GET_THERE_ROWS,
  VISIT_CODE,
} from "./fixtures";
import { VisitBookedPass } from "./visit-booked-pass";

const meta = {
  title: "Appointment Visit/VisitBookedPass",
  component: VisitBookedPass,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      ...BOOKED_PASS_COPY,
      confirmation: {
        ...CONFIRMATION_COPY,
        title: "You are booked",
        body: "We emailed alex@example.com.",
        manage: "Change or cancel",
      },
    },
    confirmation: {
      record: LIVE_RECORD,
      answers: LIVE_ANSWERS,
      manageHref: "#/book/manage",
      calendarHref: "#/book/bk_live.ics",
    },
    code: VISIT_CODE,
    directionsHref: DIRECTIONS_HREF,
    before: BOOKED_BEFORE,
    getThere: GET_THERE_ROWS,
    onAgain: fn(),
  },
} satisfies Meta<typeof VisitBookedPass>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(VISIT_CODE)).toBeVisible();
    expect(
      canvas.getByRole("region", { name: "How to get there" }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Book another visit" }),
    );
    expect(args.onAgain).toHaveBeenCalledTimes(1);
  },
};

/** No visit code yet: no pass. */
export const NoCode: Story = {
  args: { code: null },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-slot="visit-pass"]')).toBeNull();
  },
};
