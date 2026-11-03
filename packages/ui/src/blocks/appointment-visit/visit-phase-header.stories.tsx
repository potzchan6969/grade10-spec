import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VisitPhaseHeader } from "./visit-phase-header";

const meta = {
  title: "Appointment/Visit/Blocks/VisitPhaseHeader",
  component: VisitPhaseHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    tone: "plain",
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
  parameters: {
    verification: { caseId: "vc_3e401dcb-74ec-45c2-9db7-13bd6602bee2" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Grading Submission" }),
    ).toBeVisible();
    expect(canvas.getByText("in 2 days")).toBeVisible();
  },
};

export const Called: Story = {
  parameters: {
    verification: { caseId: "vc_754a1e57-aed3-4be6-9a6c-6a7c513a2677" },
  },
  args: {
    tone: "ink",
    copy: {
      phase: "Counter 3",
      note: "ready at 10:15",
      title: "Counter 3 is ready for you",
      lede: "Go to Counter 3 now.",
    },
  },
};

/** Checked in: the live tone while the collector waits. */
export const CheckedIn: Story = {
  parameters: {
    verification: { caseId: "vc_fe078c79-45c4-4412-bb19-126d417cba71" },
  },
  args: {
    tone: "info",
    copy: { phase: "Checked in", note: "10:09", title: "We’ll call you" },
  },
};

export const Missed: Story = {
  parameters: {
    verification: { caseId: "vc_40fffb75-312d-4c51-8b3d-f04a83934be7" },
  },
  args: {
    tone: "warn",
    copy: { phase: "Missed", title: "We missed you" },
  },
};

export const Cancelled: Story = {
  parameters: {
    verification: { caseId: "vc_576a78d1-b962-4918-a041-c04a30023902" },
  },
  args: {
    tone: "bad",
    copy: {
      phase: "Cancelled by the shop",
      title: "Hong Kong Grade10 Store cancelled your visit",
    },
  },
};
