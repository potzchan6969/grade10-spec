import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  ABOVE_CEILING_CARD,
  CAP_REACHED_LINE,
  CARD_LIST_COPY,
  CARD_MATCHES,
  LIST_CAP,
  MATCHED_CARD,
  MATCHED_NO_DETAIL_CARD,
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

/** Nothing listed: adding a card and pasting a list, and no card row. The
 * paste is drawn once, in the header, whether or not the list has cards
 * (shared-ui-grading-submission-SC-18). */
export const EmptyList: Story = {
  args: { cards: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("combobox", { name: CARD_LIST_COPY.searchLabel }),
    ).toBeInTheDocument();
    expect(
      canvas.getAllByRole("button", { name: CARD_LIST_COPY.paste }),
    ).toHaveLength(1);
    expect(
      canvasElement.querySelector('[data-slot="grading-card-list-card"]'),
    ).toBeNull();
  },
};

/** The reference's matches, a listbox the primitive draws, each added by the
 * callback of its own (shared-ui-grading-submission-SC-61). */
export const CardSearch: Story = {
  args: {
    query: "Blast",
    search: { status: "ready", data: CARD_MATCHES },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("combobox", { name: CARD_LIST_COPY.searchLabel }),
    );
    const popup = within(document.body);
    await userEvent.click(
      await popup.findByRole("option", { name: /Blastoise/ }),
    );
    expect(args.onAdd).toHaveBeenCalledWith({
      kind: "matched",
      match: CARD_MATCHES[0],
    });
  },
};

/** A matched card reads its set line, its declared value, its three sales
 * with the reference note under them, and its minimum grade; editing,
 * removing and pasting each report through a callback of their own, and the
 * list carries none of them out (shared-ui-grading-submission-SC-13,
 * shared-ui-grading-submission-SC-61, shared-ui-grading-submission-SC-76). */
export const Matched: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Base Set · 4/102 · matched in the catalogue"),
    ).toBeInTheDocument();
    expect(canvas.getByText("Declared value: HK$3,800")).toBeInTheDocument();
    expect(canvas.getByText("Sold 12 May: HK$3,650")).toBeInTheDocument();
    expect(canvas.getByText("Sold 3 May: HK$3,720")).toBeInTheDocument();
    expect(canvas.getByText("Sold 28 Apr: HK$3,580")).toBeInTheDocument();
    await step(
      "shared-ui-grading-submission-SC-76 - A matched card's sales read with the reference note",
      async () => {
        const reference = canvasElement.querySelector<HTMLElement>(
          '[data-slot="grading-card-list-reference"]',
        );
        expect(reference).not.toBeNull();
        const note = within(reference as HTMLElement).getByText(
          CARD_LIST_COPY.referenceNote,
        );
        expect(
          within(reference as HTMLElement)
            .getByText("Sold 28 Apr: HK$3,580")
            .compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
        expect(canvas.getAllByText(CARD_LIST_COPY.referenceNote)).toHaveLength(
          1,
        );
      },
    );
    expect(
      canvas.getByRole("checkbox", {
        name: "Only encapsulate at PSA 9 or above · the fee applies either way",
      }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Edit" }));
    expect(args.onEdit).toHaveBeenCalledWith("card_charizard");
    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    expect(args.onRemove).toHaveBeenCalledWith("card_charizard");
    expect(canvas.getByText("Charizard")).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: CARD_LIST_COPY.paste }),
    );
    expect(args.onPaste).toHaveBeenCalledOnce();
  },
};

/** The reference names no set or number of its own (`Q109`): a matched card
 * reads as matched from its name alone, never a card it cannot fill `{set}`
 * and `{number}` on. */
export const MatchedNoDetail: Story = {
  args: { cards: [MATCHED_NO_DETAIL_CARD] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Matched in the catalogue")).toBeInTheDocument();
    expect(canvas.getByText("Declared value: HK$900")).toBeInTheDocument();
  },
};

/** A name that matched nothing is added as typed, reported with that name,
 * and reads as kept as typed with no reference row
 * (shared-ui-grading-submission-SC-14). */
export const KeptAsTyped: Story = {
  args: {
    cards: [TYPED_CARD],
    query: "Umbreon holo, Japanese promo",
    search: { status: "empty", message: "No card by that name." },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: CARD_LIST_COPY.addTyped }),
    );
    expect(args.onAdd).toHaveBeenCalledWith({
      kind: "typed",
      name: "Umbreon holo, Japanese promo",
    });
    expect(canvas.getByText(CARD_LIST_COPY.keptAsTyped)).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-card-list-reference"]'),
    ).toBeNull();
  },
};

/** A card with no declared value is named, and asked for one through the
 * callback of its own: the whole figure, once the field is left, never a
 * keystroke of it (shared-ui-grading-submission-SC-15,
 * shared-ui-grading-submission-SC-61). */
export const NoValue: Story = {
  args: { cards: [MATCHED_CARD, NO_VALUE_CARD, TYPED_CARD] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(CARD_LIST_COPY.noValue)).toBeInTheDocument();
    const field = canvas.getByLabelText("Declared value");
    await userEvent.type(field, "8500");
    expect(field).toHaveValue(8500);
    expect(args.onDeclare).not.toHaveBeenCalled();
    await userEvent.tab();
    expect(args.onDeclare).toHaveBeenCalledOnce();
    expect(args.onDeclare).toHaveBeenCalledWith("card_pikachu", "8500");
  },
};

/** A value the consumer reopens reads as a field again, the kept figure
 * shown in it until something is typed; Enter reports what was typed, and
 * leaving it untouched reports nothing (shared-ui-grading-submission-SC-61,
 * shared-ui-grading-submission-SC-66). */
export const EditingValue: Story = {
  args: { cards: [{ ...MATCHED_CARD, editing: true }] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText("Declared value");
    expect(field).toHaveAttribute("placeholder", "HK$3,800");
    expect(canvas.queryByText(CARD_LIST_COPY.noValue)).toBeNull();
    await userEvent.click(field);
    await userEvent.tab();
    expect(args.onDeclare).not.toHaveBeenCalled();
    await userEvent.type(field, "4200{Enter}");
    expect(args.onDeclare).toHaveBeenCalledOnce();
    expect(args.onDeclare).toHaveBeenCalledWith("card_charizard", "4200");
  },
};

/** The minimum grade reads on the card in one line, the catalog's, and is set
 * through the callback of its own (shared-ui-grading-submission-SC-13,
 * shared-ui-grading-submission-SC-61). */
export const MinimumGrade: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const option = canvas.getByRole("checkbox", {
      name: "Only encapsulate at PSA 9 or above · the fee applies either way",
    });
    expect(option).toBeChecked();
    await userEvent.click(option);
    expect(args.onMinimumGrade).toHaveBeenCalledWith("card_charizard", false);
  },
};

/** A card above the level's ceiling is named, with the second-submission line
 * (shared-ui-grading-submission-SC-19). */
export const AboveBulksCeiling: Story = {
  args: { cards: [MATCHED_CARD, ABOVE_CEILING_CARD] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Lugia first edition")).toBeInTheDocument();
    expect(
      canvas.getByText(ABOVE_CEILING_CARD.aboveCeilingLine ?? ""),
    ).toBeInTheDocument();
  },
};

/** The catalogue out of reach: every card reads that line, not kept as typed,
 * and the value is still asked for (shared-ui-grading-submission-SC-17). */
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
    expect(
      canvas.getAllByText(CARD_LIST_COPY.catalogueUnavailable),
    ).toHaveLength(2);
    expect(canvas.queryByText(CARD_LIST_COPY.keptAsTyped)).toBeNull();
    expect(canvas.getAllByLabelText("Declared value")).toHaveLength(2);
  },
};

/** The cap it was given, and the level the count closes
 * (shared-ui-grading-submission-SC-62). */
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

/** At the cap, the card past it is refused, nothing is reported, and the
 * second-submission line reads (shared-ui-grading-submission-SC-16). */
export const OverTheCap: Story = {
  args: {
    cards: [MATCHED_CARD, TYPED_CARD],
    cap: { count: 2, line: "Up to 2 cards in this submission." },
    query: "Lugia",
    search: { status: "ready", data: CARD_MATCHES },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: CARD_LIST_COPY.addTyped }),
    ).toBeDisabled();
    expect(
      canvas.getByRole("combobox", { name: CARD_LIST_COPY.searchLabel }),
    ).toBeDisabled();
    expect(canvas.getByText(CAP_REACHED_LINE)).toBeInTheDocument();
    expect(args.onAdd).not.toHaveBeenCalled();
  },
};

/** A sheet that sets no most takes a card however long the list is
 * (shared-ui-grading-submission-SC-67). */
export const NoCap: Story = {
  args: {
    cards: [MATCHED_CARD, TYPED_CARD],
    cap: { count: null, line: "One grader at one level." },
    query: "Lugia",
    search: { status: "ready", data: [] },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: CARD_LIST_COPY.addTyped }),
    );
    expect(args.onAdd).toHaveBeenCalledWith({ kind: "typed", name: "Lugia" });
    expect(canvas.queryByText(CAP_REACHED_LINE)).toBeNull();
  },
};
