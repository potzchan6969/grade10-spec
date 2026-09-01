import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FIXTURE_ORDER_PLACED_DAY,
  FIXTURE_ORDER_SHIPPED_DAY,
} from "@grade10/ui/lib/datetime-fixtures";
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
        description={FIXTURE_ORDER_PLACED_DAY}
        label="Order Placed"
        showLeadingConnector={false}
        state="completed"
      />
      <Step description={FIXTURE_ORDER_SHIPPED_DAY} label="Shipped" state="progress" />
      <Step label="Completed" showTrailingConnector={false} state="upcoming" />
    </Stepper>
  ),
};
