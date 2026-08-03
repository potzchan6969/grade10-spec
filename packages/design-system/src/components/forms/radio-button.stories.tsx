import { RadioGroup } from "@base-ui/react/radio-group";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioButton } from "./radio-button";

const meta = {
  title: "Components/RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
  // The control is a leaf: a RadioGroup owns the selected value, so every story
  // renders inside one.
  decorators: [
    (Story) => (
      <RadioGroup defaultValue="a">
        <Story />
      </RadioGroup>
    ),
  ],
  args: { value: "a" },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {};
export const Unchecked: Story = { args: { value: "b" } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledUnchecked: Story = {
  args: { disabled: true, value: "b" },
};

/** The four states Figma draws, as a 2x2. */
export const States: Story = {
  render: () => (
    <div className="flex gap-3">
      <RadioButton value="a" />
      <RadioButton value="b" />
      <RadioButton disabled value="a" />
      <RadioButton disabled value="b" />
    </div>
  ),
};
