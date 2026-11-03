import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioList } from "./radio-list";
import { RadioListItem } from "./radio-list-item";

const meta = {
  title: "Design System/Forms/RadioList",
  component: RadioList,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioList>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUIT = ["Apple", "Banana", "Orange"];

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_a6dc666a-835e-4a47-9592-0de4009460ad" },
  },
  render: () => (
    <RadioList className="w-40" defaultValue="Apple" label="Label">
      {FRUIT.map((fruit) => (
        <RadioListItem key={fruit} value={fruit}>
          {fruit}
        </RadioListItem>
      ))}
    </RadioList>
  ),
};

/** Omit `label` and the heading is not rendered — Figma's `showLabel`. */
export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_9a86064c-f5c7-4e11-bd92-9c99192c2050" },
  },
  render: () => (
    <RadioList className="w-40" defaultValue="Apple">
      {FRUIT.map((fruit) => (
        <RadioListItem key={fruit} value={fruit}>
          {fruit}
        </RadioListItem>
      ))}
    </RadioList>
  ),
};

/** `disabled` dims the label as well as the control. */
export const WithDisabledItem: Story = {
  parameters: {
    verification: { caseId: "vc_9f5ff30e-f62e-413a-be73-eeafdc724b6a" },
  },
  render: () => (
    <RadioList className="w-40" defaultValue="Apple" label="Label">
      <RadioListItem value="Apple">Apple</RadioListItem>
      <RadioListItem value="Banana">Banana</RadioListItem>
      <RadioListItem disabled value="Orange">
        Orange
      </RadioListItem>
    </RadioList>
  ),
};

export const AllDisabled: Story = {
  parameters: {
    verification: { caseId: "vc_77f98dc2-3838-4ab2-91fe-3d1458f8b2e1" },
  },
  render: () => (
    <RadioList className="w-40" defaultValue="Apple" disabled label="Label">
      {FRUIT.map((fruit) => (
        <RadioListItem key={fruit} value={fruit}>
          {fruit}
        </RadioListItem>
      ))}
    </RadioList>
  ),
};
