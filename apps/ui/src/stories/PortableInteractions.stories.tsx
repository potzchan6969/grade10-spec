import {
  Button,
  FeaturedAssetTabs,
  SegmentedControl,
  Skeleton,
  Surface,
} from "@acetrader/pred-spec-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

const onButtonAction = fn();
const onSurfaceAction = fn();
const onDisabledAction = fn();

function PrimitiveDemo() {
  const [value, setValue] = useState<"one" | "two">("one");
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Button onClick={onButtonAction}>Continue</Button>
      <Surface as="button" onClick={onSurfaceAction} variant="ghost">
        Choose plan
      </Surface>
      <Button disabled onClick={onDisabledAction}>
        Unavailable
      </Button>
      <SegmentedControl
        ariaLabel="Example choices"
        onValueChange={setValue}
        options={[
          { label: "One", value: "one" },
          { label: "Two", value: "two" },
          { disabled: true, label: "Locked", value: "locked" as "one" },
        ]}
        value={value}
      />
    </div>
  );
}

function MotionDemo({ paused = false }: { paused?: boolean }) {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Skeleton shape="line" />
      <FeaturedAssetTabs
        assets={[
          {
            id: "btc",
            label: "BTC",
            odds: { label: "61% Up", tone: "success" },
          },
        ]}
        isFading
        onAssetChange={() => undefined}
        selectedAssetId="btc"
      />
      {paused ? (
        <p>Motion is paused for deterministic visual capture.</p>
      ) : null}
    </div>
  );
}

const meta = {
  title: "Foundation/Portable interactions",
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const ControlledPrimitives: Story = {
  render: () => <PrimitiveDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(onButtonAction).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: "Choose plan" }));
    expect(onSurfaceAction).toHaveBeenCalledTimes(1);

    const two = canvas.getByRole("tab", { name: "Two" });
    two.focus();
    await userEvent.keyboard("[Space]");
    expect(two).toHaveAttribute("aria-selected", "true");

    const unavailable = canvas.getByRole("button", { name: "Unavailable" });
    expect(unavailable).toBeDisabled();
    expect(unavailable.getAnimations()).toHaveLength(0);
    await userEvent.click(unavailable);
    expect(onDisabledAction).not.toHaveBeenCalled();
    expect(canvas.getByRole("tab", { name: "Locked" })).toBeDisabled();
  },
};

export const CssMotion: Story = {
  render: () => <MotionDemo />,
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector(".at-skeleton");
    const badge = canvasElement.querySelector(".at-badge");
    expect(skeleton).not.toBeNull();
    expect(badge).not.toBeNull();
    const skeletonAnimation = skeleton?.getAnimations()[0];
    const badgeAnimation = badge?.getAnimations()[0];
    expect(skeletonAnimation?.playState).toBe("running");
    expect(badgeAnimation?.playState).toBe("running");
    const skeletonTime = Number(skeletonAnimation?.currentTime ?? 0);
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    expect(Number(skeletonAnimation?.currentTime ?? 0)).toBeGreaterThan(
      skeletonTime,
    );
  },
};

export const PausedMotion: Story = {
  parameters: { pauseMotion: true },
  render: () => <MotionDemo paused />,
  play: async ({ canvasElement }) => {
    const skeletonAnimation = canvasElement
      .querySelector(".at-skeleton")
      ?.getAnimations()[0];
    expect(skeletonAnimation?.playState).toBe("paused");
  },
};
