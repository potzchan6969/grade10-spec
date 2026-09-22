import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  ABOVE_CEILING_CARD,
  CAP_REACHED_LINE,
  CARD_LIST_COPY,
  CARD_MATCHES,
  LIST_CAP,
  MATCHED_CARD,
  NO_VALUE_CARD,
  TYPED_CARD,
} from "./fixtures";
import { GradingCardList } from "./grading-card-list";

const meta = {
  title: "Grading Submission/GradingCardList",
  component: GradingCardList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: CARD_LIST_COPY,
    cards: [MATCHED_CARD],
    cap: LIST_CAP,
    capReachedLine: CAP_REACHED_LINE,
    query: "",
    search: { status: "empty", message: "Type a card name to search." },
    locale: "en",
    onSearch: fn(),
    onAdd: fn(),
    onEdit: fn(),
    onRemove: fn(),
    onDeclare: fn(),
    onMinimumGrade: fn(),
    onPaste: fn(),
  },
} satisfies Meta<typeof GradingCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing listed: adding a card and pasting a list, and no card row. */
export const EmptyList: Story = {
  args: { cards: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText("Add a Card")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Paste a List" }),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-card-list-card"]'),
    ).toBeNull();
  },
};

/** The reference's matches, each added by the callback of its own. */
export const CardSearch: Story = {
  args: {
    query: "Blast",
    search: { status: "ready", data: CARD_MATCHES },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Blastoise/ }));
    expect(args.onAdd).toHaveBeenCalledWith({
      kind: "matched",
      match: CARD_MATCHES[0],
    });
  },
};

/** A matched card reads its set line, its declared value and its sales. */
export const Matched: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Matched in our reference")).toBeInTheDocument();
    expect(canvas.getByText("Sold 12 May: HK$3,650")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Edit" }));
    expect(args.onEdit).toHaveBeenCalledWith("card_charizard");
    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    expect(args.onRemove).toHaveBeenCalledWith("card_charizard");
  },
};

/** A name that matched nothing is kept as typed, with no reference row. */
export const KeptAsTyped: Story = {
  args: { cards: [TYPED_CARD] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Kept as you typed it")).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-card-list-reference"]'),
    ).toBeNull();
  },
};

/** A card with no declared value is named, and asked for one. */
export const NoValue: Story = {
  args: { cards: [MATCHED_CARD, NO_VALUE_CARD, TYPED_CARD] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("This card still needs a declared value."),
    ).toBeInTheDocument();
    await userEvent.type(canvas.getByLabelText("Declared value"), "5");
    expect(args.onDeclare).toHaveBeenCalledWith("card_pikachu", "5");
  },
};

/** The minimum grade reads on the card, with the line that the fee applies. */
export const MinimumGrade: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("The fee applies either way."),
    ).toBeInTheDocument();
    expect(
      canvas.getByText("Only encapsulate at PSA 9 or above: PSA 9"),
    ).toBeInTheDocument();
  },
};

/** A card above the level's ceiling is named, with the second-submission line. */
export const AboveBulksCeiling: Story = {
  args: { cards: [MATCHED_CARD, ABOVE_CEILING_CARD] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(ABOVE_CEILING_CARD.aboveCeilingLine ?? ""),
    ).toBeInTheDocument();
  },
};

/** The catalogue out of reach: every card reads that line, not kept as typed. */
export const ReferenceUnavailable: Story = {
  args: {
    cards: [NO_VALUE_CARD, { ...TYPED_CARD, declaredValue: undefined }],
    search: {
      status: "error",
      message: "Our catalogue could not be asked just now.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText(CARD_LIST_COPY.catalogueUnavailable)).toHaveLength(
      2,
    );
    expect(canvas.queryByText("Kept as you typed it")).toBeNull();
    expect(canvas.getAllByLabelText("Declared value")).toHaveLength(2);
  },
};

/** The cap it was given, and the level the count closes. */
export const CapNotice: Story = {
  args: {
    cap: {
      count: 20,
      line: "Up to 20 cards in one submission from Value to Super Express.",
      closesLevelLine: "Bulk takes up to 100 cards in one submission.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "Up to 20 cards in one submission from Value to Super Express.",
      ),
    ).toBeInTheDocument();
    expect(
      canvas.getByText("Bulk takes up to 100 cards in one submission."),
    ).toBeInTheDocument();
  },
};

/** Past 20 cards the notice reads that Bulk is the only level left open. */
export const MoreThan20: Story = {
  args: {
    cap: {
      count: 100,
      line: "22 cards listed.",
      closesLevelLine: "Bulk is the only level open at the next step.",
    },
  },
};

/** At the cap, the card past it is refused and nothing is reported. */
export const OverTheCap: Story = {
  args: {
    cards: [MATCHED_CARD, TYPED_CARD],
    cap: { count: 2, line: "Up to 2 cards in this submission." },
    query: "Lugia",
    search: { status: "ready", data: CARD_MATCHES },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const add = canvas.getByRole("button", { name: "Add as Typed" });
    expect(add).toBeDisabled();
    expect(canvas.getByRole("button", { name: /Blastoise/ })).toBeDisabled();
    expect(canvas.getByText(CAP_REACHED_LINE)).toBeInTheDocument();
    expect(args.onAdd).not.toHaveBeenCalled();
  },
};
