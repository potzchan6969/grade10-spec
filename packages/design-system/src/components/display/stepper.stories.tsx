import type { Meta, StoryObj } from "@storybook/react-vite";
import { Step } from "./step";
import { Stepper } from "./stepper";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeSteps: Story = {
  render: () => (
    <Stepper>
      <Step
        description="Aug 26, 2026"
        label="Order Placed"
        showLeadingConnector={false}
        state="completed"
      />
      <Step
        description="Aug 27, 2026"
        label="Shipped"
        state="progress"
      />
      <Step label="Completed" showTrailingConnector={false} state="upcoming" />
    </Stepper>
  ),
};
