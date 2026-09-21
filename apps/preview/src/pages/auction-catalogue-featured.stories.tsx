import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { FeaturedAuctions } from "./auction-catalogue-card";
import { COLLECTION_LOTS } from "./auction-catalogue-content";

/**
 * The featured row on its own. Site chrome and the rest of the list live on
 * the page story. The four lots are the soonest closes from the collection.
 */
const meta = {
  title: "Auction List/Featured",
  component: FeaturedAuctions,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeaturedAuctions>;

export default meta;
type Story = StoryObj<typeof meta>;

const featuredLots = COLLECTION_LOTS.slice(0, 4);

function FeaturedRow() {
  const [watched, setWatched] = useState<ReadonlySet<string>>(new Set());
  return (
    <FeaturedAuctions
      lots={featuredLots}
      onToggle={(id) => {
        setWatched((current) => {
          const next = new Set(current);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }}
      watched={watched}
    />
  );
}

/** The four soonest lots, in one scrolling row. The next card peeks past the edge. */
export const Scrolling: Story = {
  name: "Scrolling row",
  args: {
    lots: featuredLots,
    watched: new Set<string>(),
    onToggle: () => {},
  },
  render: () => <FeaturedRow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Featured auctions" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: featuredLots[0].title }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("heading", { level: 3 })).toBeNull();

    const scroller = canvasElement.querySelector("ul");
    expect(scroller).not.toBeNull();
    const next = canvas.getByRole("button", {
      name: "Next featured auctions",
    });
    await userEvent.click(next);
    await waitFor(() => {
      expect(scroller?.scrollLeft ?? 0).toBeGreaterThan(0);
    });
  },
};
