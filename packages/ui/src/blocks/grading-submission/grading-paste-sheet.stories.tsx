import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  BULK_NOTICE,
  PASTE_RESULT,
  PASTE_SHEET_COPY,
  SECOND_SUBMISSION_LINE,
} from "./fixtures";
import { GradingPasteSheet } from "./grading-paste-sheet";

const PASTED_TEXT = [
  "Charizard Base Set 4/102",
  "Blastoise Base Set 2/102",
  "Umbreon holo Japanese promo",
].join("\n");

const meta = {
  title: "Grading Submission/GradingPasteSheet",
  component: GradingPasteSheet,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: PASTE_SHEET_COPY,
    open: true,
    text: PASTED_TEXT,
    linesRead: 20,
    result: { status: "ready", result: PASTE_RESULT },
    onChange: fn(),
    onApply: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof GradingPasteSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The sheet over the cards step: the list, the counter, the two acts. */
export const Open: Story = {
  play: async ({ args }) => {
    const sheet = within(document.body);
    expect(sheet.getByText("Lines read: 20")).toBeInTheDocument();
    await userEvent.click(sheet.getByRole("button", { name: "Go Back" }));
    expect(args.onClose).toHaveBeenCalled();
  },
};

/** Nothing read, nothing added. */
export const NothingRead: Story = {
  args: { text: "", linesRead: 0, result: undefined },
  play: async ({ args }) => {
    const sheet = within(document.body);
    expect(sheet.getByText("Lines read: 0")).toBeInTheDocument();
    expect(
      sheet.getByRole("button", { name: "Add These Cards" }),
    ).toBeDisabled();
    expect(args.onApply).not.toHaveBeenCalled();
  },
};

/** While the paste is being matched the add reports nothing either. */
export const Matching: Story = {
  args: { result: { status: "loading" } },
  play: async ({ args }) => {
    const sheet = within(document.body);
    expect(
      sheet.getByRole("button", { name: "Add These Cards" }),
    ).toBeDisabled();
    expect(args.onApply).not.toHaveBeenCalled();
  },
};

/** Every matched line is counted, and the add carries the cards it made. */
export const Matched: Story = {
  play: async ({ args }) => {
    const sheet = within(document.body);
    expect(sheet.getByText("Matched: 12")).toBeInTheDocument();
    await userEvent.click(
      sheet.getByRole("button", { name: "Add These Cards" }),
    );
    expect(args.onApply).toHaveBeenCalledWith([
      ...(PASTE_RESULT.matched.cards ?? []),
      ...(PASTE_RESULT.keptAsTyped.cards ?? []),
      ...(PASTE_RESULT.withoutValue.cards ?? []),
      ...(PASTE_RESULT.aboveCeiling.cards ?? []),
    ]);
  },
};

/** The lines kept as typed are named by their own row. */
export const KeptAsTyped: Story = {
  play: async () => {
    const sheet = within(document.body);
    expect(sheet.getByText("Kept as typed: 3")).toBeInTheDocument();
  },
};

/** The lines still needing a declared value are named. */
export const WithoutAValue: Story = {
  play: async () => {
    const sheet = within(document.body);
    expect(sheet.getByText("Without a value: 2")).toBeInTheDocument();
  },
};

/** A line above the ceiling names the card, its value and what follows. */
export const AboveTheCeiling: Story = {
  args: { secondSubmissionLine: SECOND_SUBMISSION_LINE },
  play: async () => {
    const sheet = within(document.body);
    expect(sheet.getByText("Above the ceiling: 1")).toBeInTheDocument();
    expect(
      sheet.getByText("Lugia first edition at HK$22,000 is above the ceiling."),
    ).toBeInTheDocument();
    expect(sheet.getByText(SECOND_SUBMISSION_LINE)).toBeInTheDocument();
  },
};

/** A card already listed is skipped, and counted as skipped. */
export const Skipped: Story = {
  play: async () => {
    const sheet = within(document.body);
    expect(sheet.getByText("Skipped, already listed: 2")).toBeInTheDocument();
  },
};

/** A long list reads the Bulk line it was given. */
export const BulkNotice: Story = {
  args: { linesRead: 34, bulkNotice: BULK_NOTICE },
  play: async () => {
    const sheet = within(document.body);
    expect(sheet.getByText(BULK_NOTICE)).toBeInTheDocument();
  },
};

/** The catalogue out of reach: the lines carry that line, and Add stays on. */
export const ReferenceUnavailable: Story = {
  args: {
    result: {
      status: "error",
      message: "Our catalogue could not be asked just now.",
      result: PASTE_RESULT,
    },
  },
  play: async () => {
    const sheet = within(document.body);
    expect(
      sheet.getByText("Our catalogue could not be asked just now."),
    ).toBeInTheDocument();
    expect(
      sheet.getByText(PASTE_SHEET_COPY.catalogueUnavailable),
    ).toBeInTheDocument();
    expect(
      sheet.getByRole("button", { name: "Add These Cards" }),
    ).toBeEnabled();
  },
};
