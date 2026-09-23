import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
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
  type GradingLevelPickerProps,
  type GradingPickerLevel,
} from "./grading-level-picker";

/** The level picked is the consumer's; the workbench plays that consumer. */
function Consumer({
  selectedLevelId,
  onSelectLevel,
  ...args
}: GradingLevelPickerProps) {
  const [picked, setPicked] = useState(selectedLevelId);

  return (
    <GradingLevelPicker
      {...args}
      onSelectLevel={(next) => {
        setPicked(next);
        onSelectLevel(next);
      }}
      selectedLevelId={picked}
    />
  );
}

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

/** The graders, the second selected, and the figure the levels are read
 * against (shared-ui-grading-submission-SC-60). */
export const Grader: Story = {
  args: { selectedGraderId: "cgc" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "PSA" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(canvas.getByRole("button", { name: "CGC" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(canvas.getAllByRole("radio")).toHaveLength(OPEN_LEVELS.length);
    expect(
      canvas.getByText("Your highest declared value is HK$3,800"),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "BGS" }));
    expect(args.onSelectGrader).toHaveBeenCalledWith("bgs");
  },
};

/** An open level carrying cover, picked by id and marked as the one radio of
 * the group; before the pick it read its cover line and no estimate
 * (shared-ui-grading-submission-SC-06). */
export const LevelOpen: Story = {
  render: (args) => <Consumer {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const express = canvas.getByRole("radio", {
      name: /Express.*Cover adds HK\$30 a card/,
    });
    expect(express).not.toBeChecked();
    expect(canvas.queryByText(LEVEL_PICKER_COPY.estimateTitle)).toBeNull();
    await userEvent.click(express);
    expect(args.onSelectLevel).toHaveBeenCalledWith("express");
    expect(express).toBeChecked();
  },
};

/** The cover line reads on the levels that carry cover
 * (shared-ui-grading-submission-SC-06). */
export const LevelOpenCover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cover adds HK$30 a card")).toBeInTheDocument();
  },
};

/** A level closed by a declared value names the card, and reports nothing
 * (shared-ui-grading-submission-SC-07). */
export const LevelClosedByAValue: Story = {
  args: { levels: [CLOSED_BY_VALUE, ...OPEN_LEVELS.slice(1)] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const closed = canvas.getByRole("radio", {
      name: /Not available.*Lugia first edition is declared at HK\$22,000/,
    });
    await userEvent.click(closed);
    expect(args.onSelectLevel).not.toHaveBeenCalled();
    expect(closed).toHaveAttribute("aria-disabled", "true");
  },
};

/** A level closed by a count names the count it needs and the count listed,
 * and reports nothing (shared-ui-grading-submission-SC-08). */
export const LevelClosedByACount: Story = {
  args: { levels: [...OPEN_LEVELS, CLOSED_BY_COUNT] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const bulk = canvas.getByRole("radio", {
      name: /Bulk.*Not available.*Bulk starts at 20 cards and you have listed 4\./,
    });
    expect(bulk).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(bulk);
    expect(args.onSelectLevel).not.toHaveBeenCalled();
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

/** Every level closed sends the collector to the counter, with no estimate
 * (shared-ui-grading-submission-SC-09). */
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
    expect(canvas.getByRole("radio", { name: /Regular/ })).toBeChecked();
    expect(canvas.getByText("HK$1,120")).toBeInTheDocument();
    expect(canvas.getByText("4 cards × HK$250")).toBeInTheDocument();
  },
};

/** The estimate the consumer gave, the cover line per card under the fee,
 * and no figure of the picker's own: 4 × HK$250 is not the HK$1,120 total
 * (shared-ui-grading-submission-SC-10). */
export const EstimateWithCover: Story = {
  args: {
    selectedLevelId: "express",
    estimate: { ...ESTIMATE, coverLine: "Cover HK$30 a card" },
  },
  play: async ({ canvasElement }) => {
    const title = within(canvasElement).getByText(
      LEVEL_PICKER_COPY.estimateTitle,
    );
    const estimate = within(title.parentElement as HTMLElement);
    expect(estimate.getByText("4 cards × HK$250")).toBeInTheDocument();
    expect(estimate.getByText("Cover HK$30 a card")).toBeInTheDocument();
    expect(estimate.getByText("HK$1,120")).toBeInTheDocument();
    expect(estimate.getByText("Back in about 6 weeks")).toBeInTheDocument();
    expect(estimate.queryByText("HK$1,000")).toBeNull();
  },
};

/** What a card moved up a level costs, said before anything is booked
 * (shared-ui-grading-submission-SC-11). */
export const UpchargeNotice: Story = {
  args: { selectedLevelId: "regular", upchargeNotice: UPCHARGE_NOTICE },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByText(UPCHARGE_NOTICE),
    ).toBeInTheDocument();
  },
};

/** A grader nobody has priced still lists its levels, with the line saying so
 * (shared-ui-grading-submission-SC-12). */
export const GraderWithExampleFigures: Story = {
  args: {
    selectedGraderId: "cgc",
    figuresLine: "These figures are examples until CGC confirms them.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("radio")).toHaveLength(OPEN_LEVELS.length);
    expect(
      canvas.getByText("These figures are examples until CGC confirms them."),
    ).toBeInTheDocument();
  },
};
