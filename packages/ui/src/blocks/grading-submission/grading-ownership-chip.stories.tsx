import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  GradingOwnershipChip,
  type GradingOwnershipChipProps,
} from "./grading-ownership-chip";

/** The status word and the chip read as one pair, each in the tone given. */
function expectPair(
  canvasElement: HTMLElement,
  { copy, statusTone, chipTone }: GradingOwnershipChipProps,
) {
  const canvas = within(canvasElement);
  expect(canvas.getByText(copy.status)).toHaveAttribute(
    "data-variant",
    statusTone,
  );
  expect(canvas.getByText(copy.chip ?? "")).toHaveAttribute(
    "data-variant",
    chipTone,
  );
}

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

/** The collector's move: the pair reads as it was given
 * (shared-ui-grading-submission-SC-29). */
export const WaitingOnYou: Story = {
  play: async ({ args, canvasElement }) => {
    expectPair(canvasElement, args);
  },
};

/** Booked for a drop-off: the pair reads as it was given
 * (shared-ui-grading-submission-SC-29). */
export const DropOff: Story = {
  args: {
    copy: { status: "Drop-off booked", chip: "Drop-off 15 Jun, 14:30" },
    statusTone: "info",
    chipTone: "outline",
  },
  play: async ({ args, canvasElement }) => {
    expectPair(canvasElement, args);
  },
};

/** With the shop: the pair reads as it was given
 * (shared-ui-grading-submission-SC-29). */
export const WithUs: Story = {
  args: {
    copy: { status: "Handed in", chip: "With us" },
    statusTone: "info",
    chipTone: "info",
  },
  play: async ({ args, canvasElement }) => {
    expectPair(canvasElement, args);
  },
};

/** The grader is named, so waiting on it never reads as waiting on the shop
 * (shared-ui-grading-submission-SC-29). */
export const WithTheGrader: Story = {
  args: {
    copy: { status: "With the grader", chip: "With PSA" },
    statusTone: "info",
    chipTone: "info",
  },
  play: async ({ args, canvasElement }) => {
    expectPair(canvasElement, args);
    expect(within(canvasElement).queryByText("With us")).toBeNull();
  },
};

/** Running late is the words and the tone it was given, from no date
 * (shared-ui-grading-submission-SC-31). */
export const RunningLate: Story = {
  args: {
    copy: { status: "With the grader", chip: "Running late, with PSA" },
    statusTone: "info",
    chipTone: "warning",
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByText("Running late, with PSA"),
    ).toHaveAttribute("data-variant", "warning");
  },
};

/** On their way back: the pair reads as it was given
 * (shared-ui-grading-submission-SC-29). */
export const OnTheirWayBack: Story = {
  args: {
    copy: { status: "Grades are in", chip: "On their way back" },
    statusTone: "success",
    chipTone: "info",
  },
  play: async ({ args, canvasElement }) => {
    expectPair(canvasElement, args);
  },
};

/** Collected: the pair reads as it was given
 * (shared-ui-grading-submission-SC-29). */
export const Collected: Story = {
  args: {
    copy: { status: "Back with you", chip: "Collected 20 Sep" },
    statusTone: "success",
    chipTone: "outline",
  },
  play: async ({ args, canvasElement }) => {
    expectPair(canvasElement, args);
  },
};

/** A closed submission shows the status word alone
 * (shared-ui-grading-submission-SC-30). */
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
