import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioList } from "./radio-list";
import { RadioListItem } from "./radio-list-item";

const meta = {
  title: "Components/RadioList",
  component: RadioList,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioList>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUIT = ["Apple", "Banana", "Orange"];

export const Default: Story = {
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
