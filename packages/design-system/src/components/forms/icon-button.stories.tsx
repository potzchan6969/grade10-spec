import type { Meta, StoryObj } from "@storybook/react-vite";
import { XIcon } from "lucide-react";
import { IconButton } from "./icon-button";

const meta = {
  title: "Design System/Forms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { children: <XIcon />, "aria-label": "Close" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["outline", "ghost", "secondary", "primary"],
    },
    size: { control: "inline-radio", options: ["lg", "md", "sm", "xs"] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_48bcb448-c4ba-4ba9-ae0a-2da43f291ba9" },
  },
};
export const Ghost: Story = {
  parameters: {
    verification: { caseId: "vc_317e579d-e9e6-480c-bb02-bd0e8faaeee6" },
  },
  args: { variant: "ghost" },
};
export const Secondary: Story = {
  parameters: {
    verification: { caseId: "vc_f86f09fc-9fbd-48d7-ae99-0a93da7e819a" },
  },
  args: { variant: "secondary" },
};
export const Primary: Story = {
  parameters: {
    verification: { caseId: "vc_8dbb4c3f-2e42-44a3-8f08-cea4ac8b9ab1" },
  },
  args: { variant: "primary" },
};

/** `sm` is the design's default rung, so the others are shown explicitly. */
export const Large: Story = {
  parameters: {
    verification: { caseId: "vc_96b67f86-9eb5-4361-ac40-80b81e9232d1" },
  },
  args: { size: "lg" },
};
export const Medium: Story = {
  parameters: {
    verification: { caseId: "vc_83085e27-4764-4e58-a5d3-29a6061ac3ea" },
  },
  args: { size: "md" },
};
export const ExtraSmall: Story = {
  parameters: {
    verification: { caseId: "vc_6e8d5450-229e-4e0b-9b9d-5d5e3e904968" },
  },
  args: { size: "xs" },
};

export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_08b34350-407e-430a-b59e-a76cdf26588d" },
  },
  args: { disabled: true },
};

/** Its work is out: Button's spinner in the glyph's place, still focusable. */
export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_7f301032-c27c-4103-b8f9-88134c6f0488" },
  },
  args: { loading: true },
};

export const Variants: Story = {
  parameters: {
    verification: { caseId: "vc_a99b10be-8c84-4d94-854b-de5ae000c3b6" },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["outline", "ghost", "secondary", "primary"] as const).map(
        (variant) => (
          <IconButton key={variant} {...args} variant={variant} />
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    verification: { caseId: "vc_ca10b999-c815-4d12-bea1-aaade960e755" },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["lg", "md", "sm", "xs"] as const).map((size) => (
        <IconButton key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** With no visible label, the accessible name has to come from somewhere —
 * either `aria-label` as above, or a visually hidden child. */
export const WithHiddenLabel: Story = {
  parameters: {
    verification: { caseId: "vc_4498cff6-4137-4bf4-8a25-57862d34ce55" },
  },
  args: {
    "aria-label": undefined,
    children: (
      <>
        <XIcon />
        <span className="sr-only">Close</span>
      </>
    ),
  },
};
