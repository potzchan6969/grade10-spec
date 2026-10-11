import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VisitPhaseHeader } from "./visit-phase-header";

const meta = {
  title: "Appointment Visit/VisitPhaseHeader",
  component: VisitPhaseHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    tone: "info",
    copy: {
      phase: "Booked",
      note: "in 2 days",
      title: "Grading Submission",
      lede: "Thu 3 Sep, 10:15 to 10:45 HKT at Hong Kong Grade10 Store.",
    },
  },
} satisfies Meta<typeof VisitPhaseHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Booked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Grading Submission" }),
    ).toBeVisible();
    expect(canvas.getByText("in 2 days")).toBeVisible();
  },
};

export const Called: Story = {
  args: {
    tone: "ink",
    copy: {
      phase: "Counter 3",
      note: "ready at 10:15",
      title: "Counter 3 is ready for you",
      lede: "Go to Counter 3 now and show your pass.",
    },
  },
};

export const Missed: Story = {
  args: {
    tone: "warn",
    copy: { phase: "Missed", title: "We missed you" },
  },
};

export const Cancelled: Story = {
  args: {
    tone: "bad",
    copy: {
      phase: "Cancelled by the shop",
      title: "Hong Kong Grade10 Store cancelled your visit",
    },
  },
};
