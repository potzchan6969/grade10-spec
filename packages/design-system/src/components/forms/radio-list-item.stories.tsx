import { RadioGroup } from "@base-ui/react/radio-group";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioListItem } from "./radio-list-item";

const meta = {
  title: "Components/RadioListItem",
  component: RadioListItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <RadioGroup className="w-40" defaultValue="a">
        <Story />
      </RadioGroup>
    ),
  ],
  args: { children: "Label", value: "a" },
} satisfies Meta<typeof RadioListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Unchecked: Story = { args: { value: "b" } };

/** `disabled` is Figma's only axis here, and it dims the label too. */
export const Disabled: Story = { args: { disabled: true } };

/** The label is inside the `<label>`, so clicking the text selects the radio. */
export const LongLabel: Story = {
  args: {
    children: "A label long enough to wrap onto a second line beside the dot",
  },
};
