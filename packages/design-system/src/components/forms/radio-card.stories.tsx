import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { Bank, DeviceMobile, Trash } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { RadioCard } from "./radio-card";

const meta = {
  title: "Design System/Forms/RadioCard",
  parameters: {
    docs: {
      description: {
        component:
          "Selectable card chrome around a radio. Use inside `RadioList`. `icon` draws the Figma `withIcon` variant — a leading muted media circle with the radio trailing.",
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
  parameters: {
    verification: { caseId: "vc_e3593926-cc71-4147-9476-81c6eec04b81" },
  },
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
    const next = canvas
      .getByText("Tsim Sha Tsui")
      .closest('[data-slot="radio-card"]');
    if (!(next instanceof HTMLElement)) {
      throw new Error("Tsim Sha Tsui card is missing");
    }
    const control = next.querySelector('[data-slot="radio-button"]');
    if (!(control instanceof HTMLElement)) {
      throw new Error("Tsim Sha Tsui radio is missing");
    }
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: control,
      coords: {
        x: control.offsetWidth - 8,
        y: control.offsetHeight - 8,
      },
    });
    expect(
      next.querySelector('[data-slot="radio-button"][data-checked]'),
    ).toBeTruthy();
  },
};

export const WithAction: Story = {
  parameters: {
    verification: { caseId: "vc_e3ea85fb-3a03-48be-93fd-0cd2fd94a668" },
  },
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

export const WithIcon: Story = {
  name: "With icon",
  render: () => (
    <RadioList
      aria-label="Withdrawal destination"
      className="max-w-md"
      defaultValue="hsbc"
    >
      <RadioCard
        description="Chan Tai Man · HK$"
        icon={<Bank aria-hidden />}
        title="HSBC ••• 8304"
        value="hsbc"
      />
      <RadioCard
        description="Chan Tai Man · HK$"
        icon={<DeviceMobile aria-hidden />}
        title="FPS · +852 9123 ••45"
        value="fps"
      />
    </RadioList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selected = canvas
      .getByText("HSBC ••• 8304")
      .closest('[data-slot="radio-card"]');
    expect(
      selected?.querySelector('[data-slot="radio-card-icon"]'),
    ).toBeTruthy();
    expect(
      selected?.querySelector('[data-slot="radio-button"][data-checked]'),
    ).toBeTruthy();
  },
};

export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_1d2f6594-14be-45a6-9a14-6b7749d91871" },
  },
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
  parameters: {
    verification: { caseId: "vc_d2b512a3-b557-4d62-b4d6-af77ed6f2d91" },
  },
  name: "Description only",
  render: () => (
    <RadioList aria-label="Options" className="max-w-md" defaultValue="one">
      <RadioCard description="First option body only." value="one" />
      <RadioCard description="Second option body only." value="two" />
    </RadioList>
  ),
};
