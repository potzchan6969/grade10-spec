import { RadioGroup } from "@base-ui/react/radio-group";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioListItem } from "./radio-list-item";

const meta = {
  title: "Design System/Forms/RadioListItem",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_2b807d1d-4e1a-4229-a301-6ed67a21667f" },
  },
};
export const Unchecked: Story = {
  parameters: {
    verification: { caseId: "vc_f749b74a-1f69-4620-a52a-ce8499dc2162" },
  },
  args: { value: "b" },
};

/** `disabled` is Figma's only axis here, and it dims the label too. */
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_e03e15fe-c876-432c-9e13-dd11bf9745fa" },
  },
  args: { disabled: true },
};

/** The label is inside the `<label>`, so clicking the text selects the radio. */
export const LongLabel: Story = {
  parameters: {
    verification: { caseId: "vc_159f1300-8be6-4865-a526-14b7e3ec24b6" },
  },
  args: {
    children: "A label long enough to wrap onto a second line beside the dot",
  },
};
