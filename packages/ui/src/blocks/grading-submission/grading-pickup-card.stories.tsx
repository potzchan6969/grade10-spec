import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FIXTURE_TIME_ZONE, hkd, PICKUP_COPY } from "./fixtures";
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
    timeZone: FIXTURE_TIME_ZONE,
  },
} satisfies Meta<typeof GradingPickupCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Above the threshold: the identity line names the collector. */
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
      canvas.getByText("An ID in your own name, Chan Tai Man"),
    ).toBeInTheDocument();
  },
};

/** Below the threshold: nothing beyond the code is needed. */
export const BelowTheThreshold: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(PICKUP_COPY.bringNothing)).toBeInTheDocument();
  },
};

/** Somebody named: the line names them instead. */
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

/** Nothing due reads as nothing due. */
export const NothingDue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing")).toBeInTheDocument();
  },
};

/** One figure to settle, with the clause that dresses it. */
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
