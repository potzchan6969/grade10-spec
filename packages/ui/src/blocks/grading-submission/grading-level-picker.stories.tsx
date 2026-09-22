import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  COUNTER_LINE,
  ESTIMATE,
  GRADERS,
  hkd,
  LEVEL_PICKER_COPY,
  OPEN_LEVELS,
  UPCHARGE_NOTICE,
} from "./fixtures";
import {
  GradingLevelPicker,
  type GradingPickerLevel,
} from "./grading-level-picker";

const CLOSED_BY_VALUE: GradingPickerLevel = {
  id: "value",
  name: "Value",
  state: "closed",
  closedLine:
    "Lugia first edition is declared at HK$22,000, above this level’s HK$1,500 ceiling.",
};

const CLOSED_BY_COUNT: GradingPickerLevel = {
  id: "bulk",
  name: "Bulk",
  state: "closed",
  closedLine: "Bulk starts at 20 cards and you have listed 4.",
};

const BULK_OPEN: GradingPickerLevel = {
  id: "bulk",
  name: "Bulk",
  state: "open",
  ceiling: hkd(150000),
  feePerCard: hkd(12000),
  weeks: "Back in about 12 weeks",
};

const meta = {
  title: "Grading Submission/GradingLevelPicker",
  component: GradingLevelPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LEVEL_PICKER_COPY,
    graders: GRADERS,
    selectedGraderId: "psa",
    levels: OPEN_LEVELS,
    highestDeclared: hkd(380000),
    locale: "en",
    onSelectGrader: fn(),
    onSelectLevel: fn(),
  },
} satisfies Meta<typeof GradingLevelPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The graders, the one selected, and the figure the levels are read against. */
export const Grader: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Your highest declared value is HK$3,800"),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "BGS" }));
    expect(args.onSelectGrader).toHaveBeenCalledWith("bgs");
  },
};

/** An open level reports its pick by id. */
export const LevelOpen: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Regular/ }));
    expect(args.onSelectLevel).toHaveBeenCalledWith("regular");
  },
};

/** The cover line reads on the levels that carry cover. */
export const LevelOpenCover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cover adds HK$30 a card")).toBeInTheDocument();
  },
};

/** A level closed by a declared value names the card, and reports nothing. */
export const LevelClosedByAValue: Story = {
  args: { levels: [CLOSED_BY_VALUE, ...OPEN_LEVELS.slice(1)] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const closed = canvas.getByRole("button", { name: /Not available/ });
    await userEvent.click(closed);
    expect(args.onSelectLevel).not.toHaveBeenCalled();
    expect(closed).toBeDisabled();
  },
};

/** A level closed by a count names the count it needs and the count listed. */
export const LevelClosedByACount: Story = {
  args: { levels: [...OPEN_LEVELS, CLOSED_BY_COUNT] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Bulk starts at 20 cards and you have listed 4."),
    ).toBeInTheDocument();
  },
};

/** Past 20 cards every other level is closed by the count. */
export const BulkOnly: Story = {
  args: {
    levels: [
      { ...CLOSED_BY_COUNT, id: "value", name: "Value" },
      { ...CLOSED_BY_COUNT, id: "regular", name: "Regular" },
      BULK_OPEN,
    ],
    highestDeclared: hkd(90000),
  },
};

/** Every level closed sends the collector to the counter, with no estimate. */
export const EveryLevelClosed: Story = {
  args: {
    levels: [
      CLOSED_BY_VALUE,
      { ...CLOSED_BY_VALUE, id: "regular", name: "Regular" },
    ],
    counterLine: COUNTER_LINE,
    highestDeclared: hkd(6000000),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(COUNTER_LINE)).toBeInTheDocument();
    expect(
      canvasElement.querySelector(
        '[data-slot="grading-level-picker-estimate"]',
      ),
    ).toBeNull();
  },
};

/** No level picked, no estimate. */
export const NoLevelPicked: Story = {
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector(
        '[data-slot="grading-level-picker-estimate"]',
      ),
    ).toBeNull();
  },
};

/** The estimate is the consumer's: the fee line, the total and the weeks. */
export const Estimate: Story = {
  args: { selectedLevelId: "regular", estimate: ESTIMATE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$1,120")).toBeInTheDocument();
    expect(canvas.getByText("4 cards × HK$250")).toBeInTheDocument();
  },
};

/** The cover line reads per card, under the fee. */
export const EstimateWithCover: Story = {
  args: {
    selectedLevelId: "express",
    estimate: { ...ESTIMATE, coverLine: "Cover HK$30 a card" },
  },
};

/** What a card moved up a level costs, said before anything is booked. */
export const UpchargeNotice: Story = {
  args: { selectedLevelId: "regular", upchargeNotice: UPCHARGE_NOTICE },
};

/** A grader nobody has priced still lists its levels, with the line saying so. */
export const GraderWithExampleFigures: Story = {
  args: {
    selectedGraderId: "cgc",
    figuresLine: "These figures are examples until CGC confirms them.",
  },
};
