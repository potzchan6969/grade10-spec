import { RadioGroup } from "@base-ui/react/radio-group";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioButton } from "./radio-button";

const meta = {
  title: "Components/RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
  // The control is a leaf: a RadioGroup owns the selected value, so every story
  // renders inside one. A consumer wraps it in a label (RadioListItem,
  // RadioCard); bare, it takes its name from `aria-label`.
  decorators: [
    (Story) => (
      <RadioGroup defaultValue="a">
        <Story />
      </RadioGroup>
    ),
  ],
  args: { value: "a", "aria-label": "Option A" },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {};
export const Unchecked: Story = {
  args: { value: "b", "aria-label": "Option B" },
};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledUnchecked: Story = {
  args: { disabled: true, value: "b", "aria-label": "Option B" },
};

/** The four states Figma draws, as a 2x2. */
export const States: Story = {
  render: () => (
    <div className="flex gap-3">
      <RadioButton aria-label="Option A" value="a" />
      <RadioButton aria-label="Option B" value="b" />
      <RadioButton aria-label="Option A, disabled" disabled value="a" />
      <RadioButton aria-label="Option B, disabled" disabled value="b" />
    </div>
  ),
};
