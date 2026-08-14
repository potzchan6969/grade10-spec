import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stepper } from "./stepper";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  args: { value: 3 },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Figma `isDisabled=true` — muted fill, both controls inert. */
export const Disabled: Story = { args: { disabled: true } };

function BoundedExample() {
  const [value, setValue] = useState(1);
  return <Stepper max={5} min={1} onValueChange={setValue} value={value} />;
}

/** Minus disables at `min`, plus at `max`. */
export const AtBounds: Story = {
  render: () => <BoundedExample />,
};
