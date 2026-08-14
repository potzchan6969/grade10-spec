import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxList } from "./checkbox-list";
import { CheckboxListInput } from "./checkbox-list-input";

const meta = {
  title: "Components/CheckboxList",
  component: CheckboxList,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxList>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUIT = ["Apple", "Banana", "Orange"] as const;

export const Default: Story = {
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
