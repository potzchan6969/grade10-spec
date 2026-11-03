import {
  FIXTURE_ORDER_PLACED_DAY,
  FIXTURE_ORDER_SHIPPED_DAY,
} from "@grade10/ui/lib/datetime-fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Step } from "./step";
import { Stepper } from "./stepper";

const meta = {
  title: "Design System/Display/Stepper",
  component: Stepper,
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Last step upcoming: empty ring matches connector `border-border` at full strength. */
export const ThreeSteps: Story = {
  parameters: {
    verification: { caseId: "vc_2225b8a5-cc4c-462e-aa4f-4235d3552ea0" },
  },
  render: () => (
    <Stepper>
      <Step
        description={FIXTURE_ORDER_PLACED_DAY}
        label="Order Placed"
        showLeadingConnector={false}
        state="completed"
      />
      <Step
        description={FIXTURE_ORDER_SHIPPED_DAY}
        label="Shipped"
        state="progress"
      />
      <Step label="Completed" showTrailingConnector={false} state="upcoming" />
    </Stepper>
  ),
};

export const Vertical: Story = {
  parameters: {
    verification: { caseId: "vc_0ac548d2-f1b1-421b-a856-389aaac014a5" },
  },
  render: () => (
    <Stepper orientation="vertical">
      <Step
        description={FIXTURE_ORDER_PLACED_DAY}
        label="Order Placed"
        orientation="vertical"
        showLeadingConnector={false}
        state="completed"
      />
      <Step
        description={FIXTURE_ORDER_SHIPPED_DAY}
        label="Shipped"
        orientation="vertical"
        state="progress"
      />
      <Step
        description="Arrives soon"
        label="Completed"
        orientation="vertical"
        showTrailingConnector={false}
        state="upcoming"
      />
    </Stepper>
  ),
};
