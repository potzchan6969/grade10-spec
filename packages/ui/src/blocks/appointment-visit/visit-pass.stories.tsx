import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VISIT_CODE, VISIT_PASS_COPY } from "./fixtures";
import { VisitPass } from "./visit-pass";

const meta = {
  title: "Appointment Visit/VisitPass",
  component: VisitPass,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: VISIT_PASS_COPY, code: VISIT_CODE },
} satisfies Meta<typeof VisitPass>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Before the day: the code as large text, and no QR. */
export const Booked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: "Visit code" })).toBeVisible();
    expect(canvas.getByText(VISIT_CODE)).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="authenticator-qr"]'),
    ).toBeNull();
  },
};

/** Called: the counter heads the pass and the hold sits under the code. */
export const Called: Story = {
  args: {
    copy: {
      ...VISIT_PASS_COPY,
      title: "Counter 3",
      line: "Grading Submission · Hong Kong Grade10 Store · 10:15",
      note: "We hold the counter for you until 10:25.",
    },
  },
};
