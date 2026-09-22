import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { GradingOwnershipChip } from "./grading-ownership-chip";

const meta = {
  title: "Grading Submission/GradingOwnershipChip",
  component: GradingOwnershipChip,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: { status: "Not handed in yet", chip: "Waiting on you" },
    statusTone: "default",
    chipTone: "outline",
  },
} satisfies Meta<typeof GradingOwnershipChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The collector's move: the pair reads as it was given. */
export const WaitingOnYou: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Not handed in yet")).toBeInTheDocument();
    expect(canvas.getByText("Waiting on you")).toBeInTheDocument();
  },
};

export const DropOff: Story = {
  args: {
    copy: { status: "Drop-off booked", chip: "Drop-off 15 Jun, 14:30" },
    statusTone: "info",
    chipTone: "outline",
  },
};

export const WithUs: Story = {
  args: {
    copy: { status: "Handed in", chip: "With us" },
    statusTone: "info",
    chipTone: "info",
  },
};

/** The grader is named, so waiting on it never reads as waiting on the shop. */
export const WithTheGrader: Story = {
  args: {
    copy: { status: "With the grader", chip: "With PSA" },
    statusTone: "info",
    chipTone: "info",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("With PSA")).toBeInTheDocument();
  },
};

/** Running late is the words and the tone it was given, from no date. */
export const RunningLate: Story = {
  args: {
    copy: { status: "With the grader", chip: "Running late, with PSA" },
    statusTone: "info",
    chipTone: "warning",
  },
};

export const OnTheirWayBack: Story = {
  args: {
    copy: { status: "Grades are in", chip: "On their way back" },
    statusTone: "success",
    chipTone: "info",
  },
};

export const Collected: Story = {
  args: {
    copy: { status: "Back with you", chip: "Collected 20 Sep" },
    statusTone: "success",
    chipTone: "outline",
  },
};

/** A closed submission shows the status word alone. */
export const None: Story = {
  args: { copy: { status: "Cancelled" }, statusTone: "default" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cancelled")).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-ownership-move"]'),
    ).toBeNull();
  },
};
