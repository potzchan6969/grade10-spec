import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Step } from "./step";

const meta = {
  title: "Design System/Display/Step",
  component: Step,
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["upcoming", "progress", "completed"],
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    label: "Step",
    description: "Description",
    state: "progress",
    orientation: "horizontal",
    showLeadingConnector: true,
    showTrailingConnector: true,
  },
  decorators: [
    // A step is a list item; `Stepper` is that list everywhere but here.
    (Story) => (
      <ol className="m-0 w-64 list-none p-0">
        <Story />
      </ol>
    ),
  ],
} satisfies Meta<typeof Step>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The step in progress is the current one, and says so. */
export const Progress: Story = {
  parameters: {
    verification: { caseId: "vc_c16f6118-c123-493b-a47c-7288e7e1031d" },
  },
  play: async ({ canvasElement }) => {
    const step = within(canvasElement).getByRole("listitem");
    await expect(step).toHaveAttribute("aria-current", "step");
  },
};

export const Completed: Story = {
  parameters: {
    verification: { caseId: "vc_264700a0-24e9-431c-b95a-9bd255e72221" },
  },
  args: { state: "completed" },
  play: async ({ canvasElement }) => {
    const step = within(canvasElement).getByRole("listitem");
    await expect(step).not.toHaveAttribute("aria-current");
  },
};

/**
 * Connectors stay visible so the upcoming ring can be checked against the
 * horizontal `border-border` lines — same token, full strength (no
 * CheckboxButton `disabled` washout).
 */
export const Upcoming: Story = {
  parameters: {
    verification: { caseId: "vc_4a28c36b-e51b-47a3-8744-f948f43d2aa7" },
  },
  args: {
    state: "upcoming",
    showLeadingConnector: true,
    showTrailingConnector: true,
  },
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot="checkbox-button"]');
    await expect(ring).toBeInstanceOf(HTMLElement);
    await expect(ring).not.toBeDisabled();
    await expect(ring).not.toHaveAttribute("data-checked");
    await expect(
      within(canvasElement).getByRole("listitem"),
    ).not.toHaveAttribute("aria-current");
  },
};

export const WithoutDescription: Story = {
  parameters: {
    verification: { caseId: "vc_d562684d-8b58-4922-949b-618e01da44c8" },
  },
  args: { description: undefined },
};

export const FirstStep: Story = {
  parameters: {
    verification: { caseId: "vc_6c507589-c8f3-4e3d-926a-9d91e4a23a1b" },
  },
  args: { showLeadingConnector: false },
};

export const LastStep: Story = {
  parameters: {
    verification: { caseId: "vc_1c2244d4-21b0-4cc1-a193-14f85eda114e" },
  },
  args: { showTrailingConnector: false },
};

export const Vertical: Story = {
  parameters: {
    verification: { caseId: "vc_3a2457e1-f2fa-489d-babb-3b7af2031666" },
  },
  args: { orientation: "vertical" },
};
