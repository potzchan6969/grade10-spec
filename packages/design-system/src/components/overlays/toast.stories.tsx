import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../forms/button";
import { Toast, type ToastProps, toast } from "./toast";

type ToastType = "default" | "success" | "error" | "warning" | "info";

type ToastStoryArgs = {
  title: string;
  description: string;
  showIcon: boolean;
  actionable: boolean;
  dismissible: boolean;
  type: ToastType;
  position: NonNullable<ToastProps["position"]>;
};

const TYPES: ToastType[] = ["default", "success", "error", "warning", "info"];

function toastOptions(args: ToastStoryArgs) {
  return {
    description: args.description.trim() ? args.description : undefined,
    closeButton: args.dismissible,
    ...(args.type === "default" && !args.showIcon ? { icon: null } : {}),
    ...(args.actionable
      ? { action: { label: "Button", onClick: () => undefined } }
      : {}),
  };
}

function showToast(args: ToastStoryArgs) {
  const options = toastOptions(args);
  switch (args.type) {
    case "success":
      return toast.success(args.title, options);
    case "error":
      return toast.error(args.title, options);
    case "warning":
      return toast.warning(args.title, options);
    case "info":
      return toast.info(args.title, options);
    default:
      return toast(args.title, options);
  }
}

const meta = {
  title: "Design System/Overlays/Toast",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    title: "Title",
    description: "Description",
    showIcon: true,
    actionable: true,
    dismissible: true,
    type: "default" as ToastType,
    position: "bottom-right" as const,
  },
  argTypes: {
    title: { control: "text" },
    description: {
      control: "text",
      description: "Leave empty to hide the description line.",
    },
    showIcon: {
      control: "boolean",
      description: "Default type only — status types always draw their icon.",
    },
    actionable: { control: "boolean" },
    dismissible: { control: "boolean" },
    type: {
      control: "select",
      options: TYPES,
    },
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
  },
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<ToastStoryArgs>;

/** Trigger one toast from the controls — Figma copy: Title / Description / Button. */
export const Default: Story = {
  render: (args) => (
    <>
      <Button variant="outline" size="sm" onClick={() => showToast(args)}>
        Show toast
      </Button>
      <Toast position={args.position} closeButton={args.dismissible} />
    </>
  ),
};

/** Every Figma `type` rung, same title / description / action from the controls. */
export const Types: Story = {
  render: (args) => (
    <>
      <div className="flex flex-wrap gap-2">
        {TYPES.map((type) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => showToast({ ...args, type })}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>
      <Toast position={args.position} closeButton={args.dismissible} />
    </>
  ),
};

function HeldActionExample() {
  const finish = useRef<() => void>(() => undefined);
  const [runs, setRuns] = useState(0);
  const undo = () => {
    setRuns((count) => count + 1);
    return new Promise<void>((resolve) => {
      finish.current = resolve;
    }).then(() => {
      toast.success("Restored");
    });
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast("Archived", { action: { label: "Undo", onClick: undo } })
          }
        >
          Archive
        </Button>
        <Button variant="outline" size="sm" onClick={() => finish.current()}>
          Finish undo
        </Button>
      </div>
      <p className="text-sm">Undo runs: {runs}</p>
      <Toast duration={300} />
    </>
  );
}

/**
 * An action whose `onClick` returns a promise holds the toast: it turns
 * loading under the same id, outlives its timeout, ignores a second press,
 * and closes when the work settles; the caller draws the outcome.
 */
export const HeldAction: Story = {
  render: () => <HeldActionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "Archive" }));
    const undo = await page.findByRole("button", { name: "Undo" });
    const held = undo.closest("[data-sonner-toast]");
    await userEvent.click(undo);
    await waitFor(() => expect(held).toHaveAttribute("data-type", "loading"));
    await userEvent.click(undo);
    await new Promise((wait) => setTimeout(wait, 600));
    expect(held).toBeInTheDocument();
    expect(canvas.getByText("Undo runs: 1")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Finish undo" }));
    await page.findByText("Restored");
    await waitFor(() => expect(page.queryByText("Archived")).toBeNull());
  },
};
