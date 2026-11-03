import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { cn } from "@grade10/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import { TopUpPackCard, type TopUpPackCardProps } from "./top-up-pack-card";

/** A `RadioCard` needs a `RadioList` around it — the group owns the picked
 * value. */
function PackList({
  className,
  selected,
  children,
}: {
  className?: string;
  selected?: string;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState(selected ?? "");
  return (
    <RadioList
      aria-label="Choose a pack"
      className={cn("max-w-md", className)}
      label="Choose a pack"
      onValueChange={(next) => setValue(String(next))}
      value={value}
    >
      {children}
    </RadioList>
  );
}

/* The dialog's three-across tile grid — Figma's 160px columns. */
const GRID =
  "max-w-none [&_[data-slot=radio-list-items]]:grid [&_[data-slot=radio-list-items]]:grid-cols-[repeat(3,160px)] [&_[data-slot=radio-list-items]]:items-stretch";

const meta = {
  title: "Loyalty/Top Ups/Blocks/TopUpPackCard",
  component: TopUpPackCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      unit: "pt",
      unavailable: "Over today’s limit",
    },
    value: "pack-5k",
    pointsLabel: "5,000",
    priceLabel: "HK$4,850",
    paidPointsLabel: "4,850",
    bonusLabel: "150",
  },
} satisfies Meta<typeof TopUpPackCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The dialog's tiles: an undiscounted pack, a discounted one, and a
 * discounted one picked — media box, count, bonus line, price, no ring. */
export const Pack: Story = {
  parameters: {
    verification: { caseId: "vc_9fcbed58-c2c1-454b-8324-3ae806681540" },
  },
  render: (args: TopUpPackCardProps) => (
    <PackList className={GRID} selected={args.value}>
      <TopUpPackCard
        {...args}
        bonusLabel={undefined}
        paidPointsLabel={undefined}
        pointsLabel="1,000"
        priceLabel="HK$1,000"
        value="pack-1k"
      />
      <TopUpPackCard
        {...args}
        bonusLabel="500"
        paidPointsLabel="9,500"
        pointsLabel="10,000"
        priceLabel="HK$9,500"
        value="pack-10k"
      />
      <TopUpPackCard {...args} />
    </PackList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio", { name: /5,000 pt/ });
    expect(radio).toBeChecked();
    expect(canvas.getByText("HK$4,850")).toBeVisible();
    expect(canvas.getByText("4,850")).toBeVisible();
    expect(canvas.getByText("150 pt")).toBeVisible();
    expect(
      canvasElement.querySelector("[data-slot=radio-button-ring]"),
    ).not.toBeVisible();
  },
};

/** Over the day's limit: dimmed, aria-disabled, and the reason is in the
 * radio's accessible name and behind the warning icon's tooltip. */
export const OverLimit: Story = {
  parameters: {
    verification: { caseId: "vc_937a4f30-66e9-4c65-b2d8-5b55c4d984d9" },
  },
  name: "Over Limit",
  args: { disabled: true },
  render: (args: TopUpPackCardProps) => (
    <PackList className={GRID}>
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

/** The drawer's rows: points and bonus lead, the price and the ring trail. */
export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_79a6b640-c302-48e5-a251-663a9c1b5c83" },
  },
  args: { viewport: "small" },
  render: (args: TopUpPackCardProps) => (
    <PackList selected={args.value}>
      <TopUpPackCard
        {...args}
        bonusLabel="500"
        paidPointsLabel="9,500"
        pointsLabel="10,000"
        priceLabel="HK$9,500"
        value="pack-10k"
      />
      <TopUpPackCard {...args} />
      <TopUpPackCard
        {...args}
        bonusLabel={undefined}
        paidPointsLabel={undefined}
        pointsLabel="1,000"
        priceLabel="HK$1,000"
        value="pack-1k"
      />
    </PackList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio", { name: /5,000 pt/ });
    expect(radio).toBeChecked();
    expect(canvas.getByText("150 pt")).toBeVisible();
    expect(canvas.getByText("HK$4,850")).toBeVisible();
    expect(
      canvasElement.querySelector("[data-slot=top-up-pack-card-media]"),
    ).not.toBeInTheDocument();
    const rings = canvasElement.querySelectorAll(
      "[data-slot=radio-button-ring]",
    );
    expect(rings).toHaveLength(3);
    for (const ring of rings) {
      expect(ring).toBeVisible();
    }
  },
};

/** The drawer's row over the day's limit: same dimming, same reason. */
export const OverLimitSmall: Story = {
  parameters: {
    verification: { caseId: "vc_e8266146-ab4c-4e63-8c47-550d8c8180a8" },
  },
  name: "Over Limit Small",
  args: { disabled: true, viewport: "small" },
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
