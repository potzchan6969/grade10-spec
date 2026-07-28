import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Button } from "../forms/button";
import { Toaster } from "./sonner";

const meta = {
  title: "Components/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every toast type, each with the icon wired up in `sonner.tsx`. */
export const Default: Story = {
  render: (args) => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Prediction placed")}>
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Round settled — you won 250")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Odds updated a moment ago")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Round closes in 30 seconds")}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Insufficient balance")}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.loading("Submitting prediction…")}
        >
          Loading
        </Button>
      </div>
      <Toaster {...args} />
    </>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Prediction placed", {
            description: "BTC / USD · up · 1,250 credits",
          })
        }
      >
        Show toast
      </Button>
      <Toaster {...args} />
    </>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast("Prediction placed", {
            action: { label: "Undo", onClick: () => toast("Undone") },
          })
        }
      >
        Show toast
      </Button>
      <Toaster {...args} />
    </>
  ),
};

/** `position` is forwarded straight to sonner. */
export const TopCenter: Story = {
  args: { position: "top-center" },
  render: (args) => (
    <>
      <Button variant="outline" onClick={() => toast("Prediction placed")}>
        Show toast
      </Button>
      <Toaster {...args} />
    </>
  ),
};
