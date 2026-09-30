import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EmptyPanel } from "./empty-panel";

const meta = {
  title: "Page Blocks/EmptyPanel",
  component: EmptyPanel,
  args: {
    copy: {
      title: "No requests yet",
      description: "Start one and it waits here until you send it.",
    },
  },
} satisfies Meta<typeof EmptyPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleAndDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No requests yet")).toBeInTheDocument();
    expect(
      canvas.getByText("Start one and it waits here until you send it."),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="empty-state"]'),
    ).not.toBeNull();
  },
};

const onStart = fn();

export const WithAction: Story = {
  args: {
    copy: { title: "No submissions yet" },
    actions: <Button onClick={onStart}>Start a submission</Button>,
    slot: "grading-home-submissions-empty",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Start a submission" }),
    );
    expect(onStart).toHaveBeenCalledOnce();
    expect(
      canvasElement.querySelector(
        '[data-slot="grading-home-submissions-empty"]',
      ),
    ).not.toBeNull();
  },
};
