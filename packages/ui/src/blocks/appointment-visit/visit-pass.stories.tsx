import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VISIT_NAME, VISIT_PASS_COPY } from "./fixtures";
import { VisitPass } from "./visit-pass";

const meta = {
  title: "Appointment/Visit/Blocks/VisitPass",
  component: VisitPass,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: VISIT_PASS_COPY, name: VISIT_NAME },
} satisfies Meta<typeof VisitPass>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Before the day: a compact card, who the visit is for, no code and no QR. */
export const Booked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: VISIT_NAME })).toBeVisible();
    expect(canvas.getByText(VISIT_NAME)).toBeVisible();
    expect(canvas.queryByText(/BK-/)).toBeNull();
    expect(canvas.queryByText(/visit code/i)).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="authenticator-qr"]'),
    ).toBeNull();
  },
};

/** On the day: centred and large, held up at the counter. */
export const Today: Story = {
  args: {
    size: "day",
    copy: {
      ...VISIT_PASS_COPY,
      line: "Grading Submission · Hong Kong Grade10 Store · 10:15 to 10:45",
    },
  },
};

/** Called: the counter sits under the name, and the hold under the visit. */
export const Called: Story = {
  args: {
    size: "day",
    copy: {
      ...VISIT_PASS_COPY,
      title: "Counter 3",
      line: "Grading Submission · Hong Kong Grade10 Store · 10:15",
      note: "We hold the counter for you until 10:25.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("region", { name: `${VISIT_NAME}, Counter 3` }),
    ).toBeVisible();
    expect(canvas.getByText(VISIT_NAME)).toBeVisible();
    expect(canvas.queryByText(/BK-/)).toBeNull();
  },
};
