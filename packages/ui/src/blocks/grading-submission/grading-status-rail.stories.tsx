import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { STATUS_RAIL_COPY } from "./fixtures";
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

export const HandedIn: Story = { args: { stage: "handed-in" } };

/** The stage reached is marked, the earlier ones done, the later ones not. */
export const Sent: Story = {
  args: { stage: "sent" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rail = canvasElement.querySelector(
      '[data-slot="grading-status-rail"]',
    );
    const steps = rail?.querySelectorAll('[data-slot="step"]') ?? [];
    expect(steps.length).toBe(7);
    expect(steps[0]?.getAttribute("data-state")).toBe("completed");
    expect(steps[2]?.getAttribute("data-state")).toBe("completed");
    expect(steps[3]?.getAttribute("data-state")).toBe("progress");
    expect(steps[4]?.getAttribute("data-state")).toBe("upcoming");
    expect(canvas.getByText("Home")).toBeInTheDocument();
  },
};

export const Graded: Story = { args: { stage: "graded" } };

export const Back: Story = { args: { stage: "back" } };

export const Home: Story = { args: { stage: "home" } };

/** A submission that ended stays at the stage it ended on. */
export const Ended: Story = {
  args: { stage: "planned", ended: true },
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector(
      '[data-slot="grading-status-rail"]',
    );
    const steps = rail?.querySelectorAll('[data-slot="step"]') ?? [];
    expect(rail?.getAttribute("data-ended")).toBe("true");
    expect(steps[0]?.getAttribute("data-state")).toBe("progress");
    expect(steps[1]?.getAttribute("data-state")).toBe("upcoming");
  },
};
