import {
  FeaturedAssetTabs,
  FeaturedDurationList,
  FeaturedMarketStatus,
  FeaturedSourceTabs,
} from "@acetrader/pred-spec-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

const onRetry = fn();
const onDurationChange = fn();
const onDisabledDuration = fn();

/**
 * The primitives now come from `@acetrader/design-system` and are covered by
 * that package's Storybook. What stays portable — and what this story asserts —
 * is the controlled behaviour the composites put on top of them.
 */
function CompositeDemo() {
  const [source, setSource] = useState<"pyth" | "chainlink">("pyth");
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <FeaturedMarketStatus
        state={{
          message: "Market feed unavailable.",
          onRetry,
          status: "error",
        }}
      />
      <FeaturedDurationList
        durations={[
          { id: "1h", label: "1 hour" },
          { disabled: true, id: "1d", label: "1 day" },
        ]}
        onDurationChange={(id) =>
          id === "1d" ? onDisabledDuration() : onDurationChange(id)
        }
        selectedDurationId="1h"
      />
      <FeaturedSourceTabs
        onValueChange={setSource}
        sources={[
          { id: "pyth", label: "Pyth" },
          { id: "chainlink", label: "Chainlink" },
        ]}
        value={source}
      />
    </div>
  );
}

function MotionDemo({ paused = false }: { paused?: boolean }) {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <FeaturedMarketStatus state={{ status: "loading" }} />
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

export const ControlledComposites: Story = {
  render: () => <CompositeDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole("button", { name: "1 hour" }));
    expect(onDurationChange).toHaveBeenCalledTimes(1);

    const unavailable = canvas.getByRole("button", { name: "1 day" });
    expect(unavailable).toBeDisabled();
    await userEvent.click(unavailable);
    expect(onDisabledDuration).not.toHaveBeenCalled();

    const chainlink = canvas.getByRole("tab", { name: "Chainlink" });
    await userEvent.click(chainlink);
    expect(chainlink).toHaveAttribute("aria-selected", "true");
  },
};

export const CssMotion: Story = {
  render: () => <MotionDemo />,
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[data-slot="skeleton"]');
    const badge = canvasElement.querySelector('[data-slot="badge"]');
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
      .querySelector('[data-slot="skeleton"]')
      ?.getAnimations()[0];
    expect(skeletonAnimation?.playState).toBe("paused");
  },
};
