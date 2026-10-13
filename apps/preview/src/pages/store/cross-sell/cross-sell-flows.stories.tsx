import { StoreProductRelatedRail } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  CHANGED_PICKS,
  CHOSEN_PICKS,
  CHOSEN_SOLD_OUT,
  CROSS_SELL_NO_RAIL_NOTE,
  CROSS_SELL_RAIL_COPY,
  SIMILAR_CARDS,
} from "./cross-sell-content";

const meta = {
  title: "Store/Cross Sell/Flows/You May Also Like",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const RAIL_REGION = CROSS_SELL_RAIL_COPY.heading;

/** The rail under a card at one step: the cards given, or nothing when none are to show. */
function RailStep({
  cards,
}: {
  cards: readonly (typeof SIMILAR_CARDS)[number][] | null;
}) {
  if (cards === null) {
    return (
      <p className="text-sm text-secondary-foreground">
        {CROSS_SELL_NO_RAIL_NOTE}
      </p>
    );
  }
  return (
    <StoreProductRelatedRail
      cards={cards}
      copy={CROSS_SELL_RAIL_COPY}
      onCardClick={fn()}
    />
  );
}

const CHOSEN_CASES: [
  string,
  "picks-and-similar" | "changed" | "sold-pick" | "similar-fallback",
][] = [
  ["Picks and similar cards", "picks-and-similar"],
  ["Changed picks", "changed"],
  ["A chosen pick sold out", "sold-pick"],
  ["Picks could not be read", "similar-fallback"],
];

const SIMILAR_CASES: [
  string,
  "similar-only" | "one" | "nothing" | "loading",
][] = [
  ["Similar cards only", "similar-only"],
  ["One card", "one"],
  ["Nothing to show", "nothing"],
  ["Rail loading", "loading"],
];

/** A collector opens a card the stock keeper chose for the one being read, including changed and sold-out picks. */
export const OpensChosenCards: Story = {
  parameters: {
    journeys: ["grade10-site-store-cross-sell-US-01"],
  },
  render: () => (
    <FlowContainer
      cases={CHOSEN_CASES}
      description={
        <p>
          The picks come first in the stock keeper&rsquo;s order, with similar
          cards after them, up to six. A pick that is sold out keeps its price
          and still opens its card. When the picks cannot be read the similar
          cards show alone, and the card&rsquo;s own page is unaffected.
        </p>
      }
    >
      {(step) => {
        if (step === "changed") {
          return (
            <RailStep
              cards={[...CHANGED_PICKS, ...SIMILAR_CARDS].slice(0, 6)}
            />
          );
        }
        if (step === "sold-pick") {
          return (
            <RailStep
              cards={[...CHOSEN_SOLD_OUT, ...SIMILAR_CARDS].slice(0, 6)}
            />
          );
        }
        if (step === "similar-fallback") {
          return <RailStep cards={SIMILAR_CARDS} />;
        }
        return (
          <RailStep cards={[...CHOSEN_PICKS, ...SIMILAR_CARDS].slice(0, 6)} />
        );
      }}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: RAIL_REGION })).toBeVisible();
    expect(
      canvas.getByText(CHOSEN_PICKS[0].name, { exact: false }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getByText(CHANGED_PICKS[0].name, { exact: false }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText("SOLD OUT")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("region", { name: RAIL_REGION })).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      CHOSEN_CASES.length,
    );
    // Several cards repeat the block's named landmark, so the run ends back
    // on one card for the accessibility check.
    await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
          1,
        ),
      { timeout: 3000 },
    );
  },
};

/** A collector opens a card like the one they are reading: similar cards, or no rail when there is nothing to show. */
export const OpensSimilarCards: Story = {
  parameters: {
    journeys: ["grade10-site-store-cross-sell-US-02"],
  },
  render: () => (
    <FlowContainer
      cases={SIMILAR_CASES}
      description={
        <p>
          Similar cards lead the reader on whether or not anyone chose picks for
          the card. A single card takes the width it needs. When there is
          nothing to show no heading and no rail appear. While the rail reads,
          its heading stays and no skeleton is drawn.
        </p>
      }
    >
      {(step) => {
        if (step === "one") {
          return <RailStep cards={SIMILAR_CARDS.slice(0, 1)} />;
        }
        if (step === "nothing") {
          return <RailStep cards={null} />;
        }
        if (step === "loading") {
          return <RailStep cards={[]} />;
        }
        return <RailStep cards={SIMILAR_CARDS} />;
      }}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: RAIL_REGION })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getByText(SIMILAR_CARDS[0].name, { exact: false }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.queryByRole("region", { name: RAIL_REGION })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("region", { name: RAIL_REGION })).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      SIMILAR_CASES.length,
    );
    // Several cards repeat the block's named landmark, so the run ends back
    // on one card for the accessibility check.
    await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
          1,
        ),
      { timeout: 3000 },
    );
  },
};
