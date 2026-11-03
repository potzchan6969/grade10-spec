import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRightIcon, PlusIcon } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button";

const meta = {
  title: "Design System/Forms/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_141852dc-e286-4e31-9767-ae0a5e82603c" },
  },
};
export const Secondary: Story = {
  parameters: {
    verification: { caseId: "vc_8d5437b2-8c51-43e2-962a-b44bcfb47cd4" },
  },
  args: { variant: "secondary" },
};
export const Outline: Story = {
  parameters: {
    verification: { caseId: "vc_4ba7557f-91fc-404d-8f3a-d77477bc839a" },
  },
  args: { variant: "outline" },
};
export const Ghost: Story = {
  parameters: {
    verification: { caseId: "vc_0d505c25-ad9d-48c2-b612-74b075938f53" },
  },
  args: { variant: "ghost" },
};
export const Destructive: Story = {
  parameters: {
    verification: { caseId: "vc_3a7b4620-708b-45e7-a9db-a92914dc655a" },
  },
  args: { variant: "destructive" },
};
export const Medium: Story = {
  parameters: {
    verification: { caseId: "vc_3b9ad284-d3d9-4476-bfbb-3e105b6dd691" },
  },
  args: { size: "md" },
};
export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_a7a32f82-00f5-4eca-8a4e-8c61625211da" },
  },
  args: { size: "sm" },
};
export const Large: Story = {
  parameters: {
    verification: { caseId: "vc_d2378a5f-6d0d-4d92-a118-f2bea522ca39" },
  },
  args: { size: "lg" },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_c1778d90-3195-46e0-b77a-c4ad05b22fdf" },
  },
  args: { disabled: true },
};
/** `loading` shows a spinner and ignores presses, and the button keeps its focus. */
export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_b1fc47a5-a565-40da-9cd7-670d948a0f8a" },
  },
  args: { loading: true, children: "Loading", onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", {
      name: "Loading",
    });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    button.click();
    expect(args.onClick).not.toHaveBeenCalled();
  },
};
export const DisabledOutline: Story = {
  parameters: {
    verification: { caseId: "vc_2c05d4e5-aefd-4e04-abe6-207eea66821f" },
  },
  args: { variant: "outline", disabled: true },
};

/** `leading` and `trailing` mirror Figma's two icon properties, which show by default. */
export const WithIcons: Story = {
  parameters: {
    verification: { caseId: "vc_ae8501de-a4ba-4b5e-b673-672060e7ffc2" },
  },
  args: { leading: <PlusIcon />, trailing: <ChevronRightIcon /> },
};

/** Icons scale with the rung: 16px at `lg`, 14px at `md`, 12px at `sm`. */
export const WithIconsMedium: Story = {
  parameters: {
    verification: { caseId: "vc_1d9ef8ea-f12c-4f8f-8444-aeaeb5ccef60" },
  },
  args: { size: "md", leading: <PlusIcon />, trailing: <ChevronRightIcon /> },
};
export const WithIconsSmall: Story = {
  parameters: {
    verification: { caseId: "vc_fe9e1a00-9f0a-491b-95fa-89c8fedd0fca" },
  },
  args: { size: "sm", leading: <PlusIcon />, trailing: <ChevronRightIcon /> },
};

/** `loading` takes the leading slot and suppresses `trailing`, as Figma draws it. */
export const LoadingWithIcons: Story = {
  parameters: {
    verification: { caseId: "vc_8df3523c-6dfb-47d4-90cb-3a8702eacf27" },
  },
  args: {
    loading: true,
    children: "Loading",
    leading: <PlusIcon />,
    trailing: <ChevronRightIcon />,
  },
};

/** Icons passed as children still work; the slots are additive. */
export const IconsAsChildren: Story = {
  parameters: {
    verification: { caseId: "vc_bfee0d48-877d-41b9-8e59-652ff8973967" },
  },
  args: {
    children: (
      <>
        <PlusIcon />
        Button
        <ChevronRightIcon />
      </>
    ),
  },
};

/** A call to action that navigates is an anchor wearing the button's clothes.
 * `render` says so and the component reads it, so the element gets the button
 * semantics Base UI applies to a non-button — and not the `type="button"` an
 * anchor has no use for. */
export const AsALink: Story = {
  parameters: {
    verification: { caseId: "vc_6deffb81-ac60-419a-82d8-1cdb38312c71" },
  },
  args: {
    // biome-ignore lint/a11y/useAnchorContent: Base UI merges the story's `children` into this element; the rule reads the JSX alone.
    render: <a href="#store" />,
    children: "Browse the store",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cta = canvas.getByRole("button", { name: "Browse the store" });
    expect(cta.tagName).toBe("A");
    expect(cta).not.toHaveAttribute("type");
  },
};

/** An element that really is a button keeps its native semantics. */
export const RenderingAButton: Story = {
  parameters: {
    verification: { caseId: "vc_9289b15a-6e0b-4c24-9131-822085eed64d" },
  },
  args: { render: <button type="submit" />, children: "Save" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "submit",
    );
  },
};
