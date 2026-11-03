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
  parameters: {
    verification: { caseId: "vc_893a6c82-1d1e-4fea-9af1-876d24dc0d36" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: "Your visit" })).toBeVisible();
    expect(canvas.getByText("Times in HKT")).toBeVisible();
  },
};

/** A visit that is off: its time struck. */
export const Off: Story = {
  parameters: {
    verification: { caseId: "vc_0613dec7-a30a-4aa1-a0c5-21e171c41f3b" },
  },
  args: { facts: STRUCK_FACTS },
};
