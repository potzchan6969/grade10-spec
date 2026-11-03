import { RadioGroup } from "@base-ui/react/radio-group";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioButton } from "./radio-button";

const meta = {
  title: "Design System/Forms/RadioButton",
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

export const Checked: Story = {
  parameters: {
    verification: { caseId: "vc_7d0ea12d-a9e2-4901-998d-489eb3b78ffa" },
  },
};
export const Unchecked: Story = {
  parameters: {
    verification: { caseId: "vc_55f1bd43-652a-4047-92e1-013d9da37d7a" },
  },
  args: { value: "b", "aria-label": "Option B" },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_d02303b9-91d2-43ec-9700-cc837cf97343" },
  },
  args: { disabled: true },
};
export const DisabledUnchecked: Story = {
  parameters: {
    verification: { caseId: "vc_06ec626d-3ab1-4750-90dd-9ad61e6c7348" },
  },
  args: { disabled: true, value: "b", "aria-label": "Option B" },
};

/** The four states Figma draws, as a 2x2. */
export const States: Story = {
  parameters: {
    verification: { caseId: "vc_2a77ea60-f8dc-4035-a66e-26141cf2f8b1" },
  },
  render: () => (
    <div className="flex gap-3">
      <RadioButton aria-label="Option A" value="a" />
      <RadioButton aria-label="Option B" value="b" />
      <RadioButton aria-label="Option A, disabled" disabled value="a" />
      <RadioButton aria-label="Option B, disabled" disabled value="b" />
    </div>
  ),
};
