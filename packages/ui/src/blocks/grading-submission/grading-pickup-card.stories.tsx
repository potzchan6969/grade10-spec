import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { hkd, PICKUP_COPY } from "./fixtures";
import { GradingPickupCard } from "./grading-pickup-card";

const meta = {
  title: "Grading Submission/GradingPickupCard",
  component: GradingPickupCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: PICKUP_COPY,
    code: "GR-4821-7730",
    items: "3 slabs and 1 raw card",
    where: { shop: "Grade10 Central", address: "12/F, 8 Queen’s Road Central" },
    open: "Monday to Saturday, 11:00 to 20:00, Hong Kong time",
    locale: "en",
  },
} satisfies Meta<typeof GradingPickupCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Above the threshold: the code, the items, the shop and its hours, the one
 * figure to settle with its line, and the identity line naming the collector
 * (shared-ui-grading-submission-SC-40, shared-ui-grading-submission-SC-42). */
export const AboveTheThreshold: Story = {
  args: {
    bring: "An ID in your own name, Chan Tai Man",
    due: {
      total: hkd(33000),
      line: "Paid at the counter when you collect.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("GR-4821-7730")).toBeInTheDocument();
    expect(canvas.getByText("3 slabs and 1 raw card")).toBeInTheDocument();
    expect(
      canvas.getByText("Grade10 Central, 12/F, 8 Queen’s Road Central"),
    ).toBeInTheDocument();
    expect(
      canvas.getByText("Monday to Saturday, 11:00 to 20:00, Hong Kong time"),
    ).toBeInTheDocument();
    expect(canvas.getByText(PICKUP_COPY.noBooking)).toBeInTheDocument();
    expect(canvas.getByText("HK$330")).toBeInTheDocument();
    expect(
      canvas.getByText("Paid at the counter when you collect."),
    ).toBeInTheDocument();
    expect(
      canvas.getByText("An ID in your own name, Chan Tai Man"),
    ).toBeInTheDocument();
  },
};

/** Below the threshold: nothing beyond the code is needed
 * (shared-ui-grading-submission-SC-41). */
export const BelowTheThreshold: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(PICKUP_COPY.bringNothing)).toBeInTheDocument();
  },
};

/** Somebody named: the line names them instead
 * (shared-ui-grading-submission-SC-40). */
export const SomeoneNamed: Story = {
  args: {
    bring: "An ID in the name you gave us, Wong Siu Ming",
    due: { total: hkd(33000), line: "Paid at the counter when you collect." },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("An ID in the name you gave us, Wong Siu Ming"),
    ).toBeInTheDocument();
  },
};

/** Nothing due reads as nothing due (shared-ui-grading-submission-SC-42). */
export const NothingDue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing")).toBeInTheDocument();
  },
};

/** A shop naming no rule shows no Open row, rather than one with nothing
 * after it. */
export const NoOpeningHours: Story = {
  args: { open: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText(PICKUP_COPY.openLabel)).not.toBeInTheDocument();
  },
};

/** One figure to settle, with the clause that dresses it
 * (shared-ui-grading-submission-SC-42). */
export const StorageDue: Story = {
  args: {
    due: {
      total: hkd(63000),
      line: "The upcharge and storage to today, paid at the counter.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$630")).toBeInTheDocument();
    expect(
      canvas.getByText(
        "The upcharge and storage to today, paid at the counter.",
      ),
    ).toBeInTheDocument();
  },
};
