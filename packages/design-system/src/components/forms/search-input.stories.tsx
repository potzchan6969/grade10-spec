import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./search-input";

/**
 * The Figma set (`Search Input`, `2132:2782`) draws no status, message or
 * loading state, so this component offers none. Whether a search field should
 * be able to show an error is an open question on `add-input-components`.
 */
const meta = {
  title: "Design System/Forms/SearchInput",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_97b7c74e-6119-4a4f-98c1-62a9dd1cec0d" },
  },
  args: { defaultValue: "Search query" },
};
export const Placeholder: Story = {
  parameters: {
    verification: { caseId: "vc_0e721acb-70f8-489b-81b3-2be2395ee4dd" },
  },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_048b3644-b949-4521-a90c-8ae00f736d04" },
  },
  args: { disabled: true, value: "Search query" },
};
export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_fa1ed88d-c724-4406-8b7b-67eee11b2f4a" },
  },
  args: { label: undefined },
};
export const WithClear: Story = {
  parameters: {
    verification: { caseId: "vc_681055d8-59ee-4bcd-9619-d2481f4285b8" },
  },
  args: { defaultValue: "Search query", onClear: () => {} },
};
