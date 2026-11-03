import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";

const meta = {
  title: "Design System/Display/Text",
  component: Text,
  tags: ["autodocs"],
  args: { children: "The quick brown fox" },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "base", "lg", "xl", "display"],
    },
    weight: { control: "select", options: ["regular", "medium", "bold"] },
    tone: {
      control: "select",
      options: ["primary", "secondary", "muted", "success", "warning", "error"],
    },
    face: { control: "select", options: ["sans", "mono"] },
    as: { control: "select", options: ["span", "p", "div", "h2", "h3"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_2853e6a6-f398-4c45-9dd4-67ff863a79b4" },
  },
};

/** The type scale. `base` is the default, so it needs no story of its own. */
export const Sizes: Story = {
  parameters: {
    verification: { caseId: "vc_9cb02d17-4f93-408a-ac76-295546671167" },
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} size="xs" />
      <Text {...args} size="sm" />
      <Text {...args} size="lg" />
      <Text {...args} size="xl" />
      <Text {...args} size="display" />
    </div>
  ),
};

/** `display` is the rung a surface leads with: one code, one grade, one figure. */
export const Display: Story = {
  parameters: {
    verification: { caseId: "vc_18e05238-b94a-4ea2-b5bc-389a5cff4764" },
  },
  args: { size: "display", weight: "bold", children: "PSA 10" },
};

export const Weights: Story = {
  parameters: {
    verification: { caseId: "vc_5308c263-138a-4352-9ce0-6c18313c0617" },
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} weight="medium" />
      <Text {...args} weight="bold" />
    </div>
  ),
};

/** Tone carries meaning, not emphasis — `success` and `error` read as status. */
export const Tones: Story = {
  parameters: {
    verification: { caseId: "vc_ad7508d3-0c0c-4337-8254-06a2ce116c8c" },
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} tone="secondary" />
      <Text {...args} tone="muted" />
      <Text {...args} tone="success" />
      <Text {...args} tone="warning" />
      <Text {...args} tone="error" />
    </div>
  ),
};

/** `mono` binds `--font-mono`, so digits a collector reads back to a counter
 * line up: a pickup code, a certificate number. */
export const Mono: Story = {
  parameters: {
    verification: { caseId: "vc_246b6e0d-5a47-441c-9de7-4cd6ff97e299" },
  },
  args: { face: "mono", size: "display", children: "GR-4821-7730" },
};

/** `warning` binds `--warning-foreground`: a line that is due, not failed. */
export const Warning: Story = {
  parameters: {
    verification: { caseId: "vc_10195660-e902-4a85-a44c-eaeb54338b6b" },
  },
  args: {
    tone: "warning",
    weight: "medium",
    children: "HK$300.00 due at the counter",
  },
};

/** `error` binds `--destructive-foreground`, which every theme defines. */
export const ErrorTone: Story = {
  parameters: {
    verification: { caseId: "vc_6fb7bcfa-ea69-41a6-b055-e9a0a58e8474" },
  },
  args: {
    tone: "error",
    weight: "medium",
    children: "We could not reach the catalogue. Try again.",
  },
};

/** `mono` is for a figure read back aloud: a pickup code, a certificate. */
export const Faces: Story = {
  parameters: {
    verification: { caseId: "vc_15296bf5-f8d8-4d12-b962-3189917cd545" },
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} face="sans" />
      <Text {...args} face="mono" />
    </div>
  ),
  args: { children: "GR-4821-7730" },
};

/** `as` changes the tag only; the type scale still comes from `size`. */
export const AsHeading: Story = {
  parameters: {
    verification: { caseId: "vc_a0eb2b09-c7f4-4a11-838d-b68fcee6a1c3" },
  },
  args: { as: "h3", size: "lg", weight: "medium", children: "Section heading" },
};

/** `truncate` clamps to one line, so a long market label cannot break a row. */
export const Truncated: Story = {
  parameters: {
    verification: { caseId: "vc_bb69a17b-88f6-4933-8e55-d75ff7559e0c" },
  },
  args: {
    truncate: true,
    children: "Will the price of Bitcoin close above $100,000 this Friday?",
  },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
};
