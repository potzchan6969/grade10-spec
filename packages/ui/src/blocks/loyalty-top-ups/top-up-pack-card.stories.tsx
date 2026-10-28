import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import { TopUpPackCard, type TopUpPackCardProps } from "./top-up-pack-card";

/** A `RadioCard` needs a `RadioList` around it — the group owns the picked
 * value. */
function PackList({
  selected,
  children,
}: {
  selected?: string;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState(selected ?? "");
  return (
    <RadioList
      aria-label="Choose a pack"
      className="max-w-md"
      label="Choose a pack"
      onValueChange={(next) => setValue(String(next))}
      value={value}
    >
      {children}
    </RadioList>
  );
}

const meta = {
  title: "Loyalty/Top Ups/Blocks/TopUpPackCard",
  component: TopUpPackCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      unit: "points",
      save: "Save 5%",
      unavailable: "Over today’s limit",
    },
    value: "pack-10k",
    pointsLabel: "10,000",
    priceLabel: "HK$9,500",
    wasPriceLabel: "HK$10,000",
  },
} satisfies Meta<typeof TopUpPackCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A discounted pack, picked in the list: struck list price and a save badge. */
export const Pack: Story = {
  render: (args: TopUpPackCardProps) => (
    <PackList selected={args.value}>
      <TopUpPackCard {...args} />
      <TopUpPackCard
        {...args}
        priceLabel="HK$20,000"
        pointsLabel="20,000"
        value="pack-20k"
        wasPriceLabel={undefined}
      />
    </PackList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio", { name: /^10,000/ });
    expect(radio).toBeChecked();
    expect(canvas.getByText("HK$9,500")).toBeVisible();
    expect(canvas.getByText("HK$10,000")).toBeVisible();
    expect(canvas.getByText("Save 5%")).toBeVisible();
  },
};

/** Over the day's limit: dimmed, aria-disabled, and the reason is in the
 * radio's accessible name and behind the warning icon's tooltip. */
export const OverLimit: Story = {
  name: "Over Limit",
  args: { disabled: true },
  render: (args: TopUpPackCardProps) => (
    <PackList>
      <TopUpPackCard {...args} />
    </PackList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio", {
      name: /Over today’s limit/,
    });
    expect(radio).toHaveAttribute("aria-disabled", "true");
  },
};
