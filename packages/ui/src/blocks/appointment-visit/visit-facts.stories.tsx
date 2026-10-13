import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { STRUCK_FACTS, VISIT_FACTS } from "./fixtures";
import { VisitFacts } from "./visit-facts";

const meta = {
  title: "Appointment/Visit/Blocks/VisitFacts",
  component: VisitFacts,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: { title: "Your visit" }, facts: VISIT_FACTS },
} satisfies Meta<typeof VisitFacts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: "Your visit" })).toBeVisible();
    expect(canvas.getByText("Times in HKT")).toBeVisible();
  },
};

/** A visit that is off: its time struck. */
export const Off: Story = { args: { facts: STRUCK_FACTS } };
