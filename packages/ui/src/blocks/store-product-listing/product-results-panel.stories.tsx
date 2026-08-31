import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, waitFor } from "storybook/test";
import { LISTING_COPY, PRODUCTS } from "./fixtures";
import { ProductResultsPanel } from "./product-results-panel";

const meta = {
  title: "Store Product Listing/ProductResultsPanel",
  component: ProductResultsPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { copy: LISTING_COPY },
  decorators: [
    (Story) => (
      <div className="w-full max-w-6xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductResultsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    results: { status: "loading" },
  },
};

export const Ready: Story = {
  args: {
    results: { status: "ready", data: PRODUCTS },
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(revealedTiles(canvasElement)).toBe(true));
  },
};

export const Empty: Story = {
  args: {
    results: {
      status: "empty",
      message: "No products match these filters.",
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const empty = canvasElement.querySelector(
        '[data-slot="product-results-empty"]',
      );
      expect(empty?.getAttribute("data-revealed")).toBe("true");
      expect(
        Number(getComputedStyle(empty as HTMLElement).opacity),
      ).toBeGreaterThan(0.9);
    });
  },
};

/**
 * The surface above rebuilds `results` on every render, and something else on
 * the page resolving is enough to cause one. The tiles are still shown: the
 * entrance may not be waiting on anything a re-render can take away.
 */
export const RerenderDuringEntrance: Story = {
  args: { results: { status: "loading" } },
  render: function Rerendering(args) {
    const [ready, setReady] = useState(false);
    const [, rerender] = useState(0);

    useEffect(() => {
      const id = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(id);
    }, []);

    /* Sooner than the frames the entrance waits for — a timeout runs before
       the next animation frame. */
    useEffect(() => {
      if (!ready) return;
      const id = setTimeout(() => rerender((count) => count + 1), 0);
      return () => clearTimeout(id);
    }, [ready]);

    return (
      <ProductResultsPanel
        {...args}
        results={
          ready ? { status: "ready", data: PRODUCTS } : { status: "loading" }
        }
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(revealedTiles(canvasElement)).toBe(true));
  },
};

/** Whether the grid is showing its products rather than holding them at
 * opacity 0, read the way the page reads it. */
function revealedTiles(canvasElement: HTMLElement): boolean {
  const panel = canvasElement.querySelector(
    '[data-slot="product-results-panel"]',
  );
  const tile = canvasElement.querySelector('[data-slot="product-card"]');
  if (!panel || !tile) return false;
  return (
    panel.getAttribute("data-revealed") === "true" &&
    Number(getComputedStyle(tile.parentElement as HTMLElement).opacity) > 0.9
  );
}
