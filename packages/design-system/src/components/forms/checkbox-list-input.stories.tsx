import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxListInput } from "./checkbox-list-input";

const meta = {
  title: "Design System/Forms/CheckboxListInput",
  component: CheckboxListInput,
  tags: ["autodocs"],
  args: { children: "Label", count: "10", defaultChecked: true },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
} satisfies Meta<typeof CheckboxListInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_7074f4e9-a0a6-40bb-befb-154cdd4f4fb2" },
  },
};
export const Unchecked: Story = {
  parameters: {
    verification: { caseId: "vc_c8585c66-e6f5-420d-8fc5-823769f410ca" },
  },
  args: { defaultChecked: false },
};
export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_5bd31a50-90bb-4743-a81b-8ebd92157ad2" },
  },
  args: { size: "sm" },
};

/** `disabled` dims the label and count; the control keeps its own disabled drawing. */
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_dc82b909-fcad-4451-bc77-3a618e89a604" },
  },
  name: "Disabled checked",
  args: { disabled: true },
};

/** Cap-refuse pattern: dashed unchecked control beside a dimmed label. */
export const DisabledUnchecked: Story = {
  name: "Disabled unchecked",
  args: { disabled: true, defaultChecked: false },
  parameters: {
    verification: { caseId: "vc_35d31cd0-798b-4791-b1f7-5c8242f45376" },
    docs: {
      description: {
        story:
          "Matches Winner Order Save for future at the address-book cap: label dimmed, CheckboxButton dashed / background-subtle.",
      },
    },
  },
};

export const DisabledSmall: Story = {
  parameters: {
    verification: { caseId: "vc_de2830ac-c7dc-44eb-b467-da1d1c88f217" },
  },
  name: "Disabled small",
  args: { disabled: true, size: "sm" },
};

/** Omit `count` and the trailing number is not rendered — Figma's `showCount`. */
export const WithoutCount: Story = {
  parameters: {
    verification: { caseId: "vc_40f815e1-6058-47c5-ac4c-3ad71cae9b0f" },
  },
  args: { count: undefined },
};
