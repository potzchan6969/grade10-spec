import type { Meta, StoryObj } from "@storybook/react-vite";
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
  title: "Components/Toast",
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
