import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ENDED_LINE, STATUS_RAIL_COPY } from "./fixtures";
import { GradingStatusRail } from "./grading-status-rail";

const meta = {
  title: "Grading Submission/GradingStatusRail",
  component: GradingStatusRail,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: STATUS_RAIL_COPY, stage: "planned" },
} satisfies Meta<typeof GradingStatusRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Planned: Story = {};

export const Booked: Story = { args: { stage: "booked" } };

export const HandedIn: Story = { args: { stage: "handedIn" } };

/** The stage reached is marked, the earlier ones done, the later ones not
 * (shared-ui-grading-submission-SC-32). */
export const Sent: Story = {
  args: { stage: "sent" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const steps = canvas.getAllByRole("listitem");
    expect(steps.length).toBe(7);
    expect(canvas.getAllByRole("listitem", { current: "step" })).toEqual([
      steps[3],
    ]);
    expect(steps.map((step) => step.getAttribute("data-state"))).toEqual([
      "completed",
      "completed",
      "completed",
      "progress",
      "upcoming",
      "upcoming",
      "upcoming",
    ]);
    expect(canvas.getByText("Home")).toBeInTheDocument();
  },
};

export const Graded: Story = { args: { stage: "graded" } };

export const Back: Story = { args: { stage: "back" } };

export const Home: Story = { args: { stage: "home" } };

/** A submission that ended stays at the stage it ended on, says so, and no
 * later stage reads as reached (shared-ui-grading-submission-SC-33). */
export const Ended: Story = {
  args: { stage: "planned", ended: ENDED_LINE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const steps = canvas.getAllByRole("listitem");
    expect(canvas.getAllByRole("listitem", { current: "step" })).toEqual([
      steps[0],
    ]);
    expect(canvas.getByText(ENDED_LINE)).toBeInTheDocument();
    for (const later of steps.slice(1)) {
      expect(later.getAttribute("data-state")).toBe("upcoming");
    }
  },
};
