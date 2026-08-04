import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./search-input";

/**
 * The Figma set (`Search Input`, `2132:2782`) draws no status, message or
 * loading state, so this component offers none. Whether a search field should
 * be able to show an error is an open question on `add-input-components`.
 */
const meta = {
  title: "Components/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: { label: "Search Field", placeholder: "Search..." },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultValue: "Search query" } };
export const Placeholder: Story = {};
export const Disabled: Story = {
  args: { disabled: true, value: "Search query" },
};
export const WithoutLabel: Story = { args: { label: undefined } };
export const WithClear: Story = {
  args: { defaultValue: "Search query", onClear: () => {} },
};
