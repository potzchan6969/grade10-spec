import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxList } from "./checkbox-list";
import { CheckboxListInput } from "./checkbox-list-input";

const meta = {
  title: "Design System/Forms/CheckboxList",
  component: CheckboxList,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxList>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUIT = ["Apple", "Banana", "Orange"] as const;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_e836186c-7909-4b27-a687-e42469cd3031" },
  },
  render: () => (
    <CheckboxList className="w-40" label="Label">
      {FRUIT.map((fruit, index) => (
        <CheckboxListInput
          key={fruit}
          count="10"
          defaultChecked={index === 0}
          value={fruit}
        >
          {fruit}
        </CheckboxListInput>
      ))}
    </CheckboxList>
  ),
};

/** Omit `label` and the heading is not rendered — Figma's `showLabel`. */
export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_1aaf4a41-9ff5-4163-a9ff-f9fa00b2c026" },
  },
  render: () => (
    <CheckboxList className="w-40">
      {FRUIT.map((fruit) => (
        <CheckboxListInput key={fruit} count="10" value={fruit}>
          {fruit}
        </CheckboxListInput>
      ))}
    </CheckboxList>
  ),
};

/** The PLP filter lists use the `sm` rung. */
export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_3f3a4adc-448f-4327-a99f-819baaed6726" },
  },
  render: () => (
    <CheckboxList className="w-40" label="Label">
      {FRUIT.map((fruit, index) => (
        <CheckboxListInput
          key={fruit}
          count="10"
          defaultChecked={index === 0}
          size="sm"
          value={fruit}
        >
          {fruit}
        </CheckboxListInput>
      ))}
    </CheckboxList>
  ),
};

export const WithDisabledItem: Story = {
  parameters: {
    verification: { caseId: "vc_dda1d3e1-7bde-4b5b-84bf-9145907b6409" },
  },
  render: () => (
    <CheckboxList className="w-40" label="Label">
      <CheckboxListInput count="10" defaultChecked value="Apple">
        Apple
      </CheckboxListInput>
      <CheckboxListInput count="10" value="Banana">
        Banana
      </CheckboxListInput>
      <CheckboxListInput count="10" disabled value="Orange">
        Orange
      </CheckboxListInput>
    </CheckboxList>
  ),
};
