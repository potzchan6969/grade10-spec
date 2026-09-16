import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { Trash } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { RadioCard } from "./radio-card";

const meta = {
  title: "Components/RadioCard",
  parameters: {
    docs: {
      description: {
        component:
          "Selectable card chrome around a radio. Use inside `RadioList`. No Figma set yet — Storybook-first; do not add variant axes until design publishes Radio Card.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ADDRESSES = [
  {
    id: "wan-chai",
    title: "Wan Chai home",
    description:
      "Alex Chan\n12/F, Tower 1, Harbour Road\nWan Chai, Hong Kong\nHong Kong",
  },
  {
    id: "tst",
    title: "Tsim Sha Tsui",
    description:
      "Alex Chan\nFlat 8B, Harbour View, Canton Road\nTsim Sha Tsui, Hong Kong\nHong Kong",
  },
] as const;

export const Default: Story = {
  render: () => (
    <RadioList
      aria-label="Delivery address"
      className="max-w-md"
      defaultValue="wan-chai"
    >
      {ADDRESSES.map((address) => (
        <RadioCard
          description={address.description}
          key={address.id}
          title={address.title}
          value={address.id}
        />
      ))}
    </RadioList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Wan Chai home")).toBeVisible();
    expect(canvas.getByText("Tsim Sha Tsui")).toBeVisible();
    const selected = canvas
      .getByText("Wan Chai home")
      .closest('[data-slot="radio-card"]');
    expect(selected).toBeTruthy();
    expect(
      selected?.querySelector('[data-slot="radio-button"][data-checked]'),
    ).toBeTruthy();
  },
};

export const WithAction: Story = {
  name: "With action",
  render: () => {
    const onRemove = fn();
    return (
      <RadioList
        aria-label="Delivery address"
        className="max-w-md"
        defaultValue="wan-chai"
      >
        {ADDRESSES.map((address) => (
          <RadioCard
            action={
              <IconButton
                aria-label={`Remove ${address.title}`}
                onClick={() => onRemove(address.id)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Trash aria-hidden />
              </IconButton>
            }
            description={address.description}
            key={address.id}
            title={address.title}
            value={address.id}
          />
        ))}
      </RadioList>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove Wan Chai home" }),
    );
    const selected = canvas
      .getByText("Wan Chai home")
      .closest('[data-slot="radio-card"]');
    expect(
      selected?.querySelector('[data-slot="radio-button"][data-checked]'),
    ).toBeTruthy();
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioList aria-label="Options" className="max-w-md" defaultValue="a">
      <RadioCard description="Still available." title="Enabled" value="a" />
      <RadioCard
        description="Cannot select this option."
        disabled
        title="Disabled"
        value="b"
      />
    </RadioList>
  ),
};

export const DescriptionOnly: Story = {
  name: "Description only",
  render: () => (
    <RadioList aria-label="Options" className="max-w-md" defaultValue="one">
      <RadioCard description="First option body only." value="one" />
      <RadioCard description="Second option body only." value="two" />
    </RadioList>
  ),
};
