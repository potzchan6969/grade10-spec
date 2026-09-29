import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  ABOVE_TOP_LINE,
  FEE_SHEET_COPY,
  GRADERS,
  hkd,
  LEVEL_PICKER_COPY,
  PSA_SHEET,
  THREE_SHEETS,
  UNPRICED_SHEET,
} from "./fixtures";
import {
  GradingFeeSheet,
  type GradingFeeSheetProps,
} from "./grading-fee-sheet";
import {
  GradingLevelPicker,
  type GradingPickerLevel,
} from "./grading-level-picker";

/** The grader picked is the consumer's; the workbench plays that consumer. */
function Consumer({
  selectedGraderId,
  onSelectGrader,
  ...args
}: GradingFeeSheetProps) {
  const [picked, setPicked] = useState(selectedGraderId);

  return (
    <GradingFeeSheet
      {...args}
      onSelectGrader={(next) => {
        setPicked(next);
        onSelectGrader(next);
      }}
      selectedGraderId={picked}
    />
  );
}

/** One row of the sheet, found by the level's name in its first cell. */
function levelRow(canvasElement: HTMLElement, level: string): HTMLElement {
  const row = within(canvasElement)
    .getAllByRole("row")
    .find((candidate) =>
      within(candidate).queryByRole("cell", { name: level }),
    );
  if (row == null) throw new Error(`no fee sheet row for ${level}`);
  return row;
}

const meta = {
  title: "Grading Submission/GradingFeeSheet",
  component: GradingFeeSheet,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: FEE_SHEET_COPY,
    graders: [PSA_SHEET],
    selectedGraderId: "psa",
    aboveTopLine: ABOVE_TOP_LINE,
    locale: "en",
    onSelectGrader: fn(),
  },
} satisfies Meta<typeof GradingFeeSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One grader reads in full, and draws no grader control
 * (shared-ui-grading-submission-SC-03). */
export const OneGrader: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [level, ceiling, fee] of [
      ["Value", "HK$1,500", "HK$250"],
      ["Regular", "HK$4,000", "HK$400"],
      ["Express", "HK$15,000", "HK$550"],
      ["Super Express", "HK$40,000", "HK$1,200"],
    ] as const) {
      const row = within(levelRow(canvasElement, level));
      expect(row.getByRole("cell", { name: ceiling })).toBeInTheDocument();
      expect(
        row.getByRole("cell", { name: "1 to 20 cards" }),
      ).toBeInTheDocument();
      expect(row.getByRole("cell", { name: fee })).toBeInTheDocument();
    }
    expect(
      within(levelRow(canvasElement, "Value")).getByRole("cell", {
        name: "About 8 weeks",
      }),
    ).toBeInTheDocument();
    expect(
      within(levelRow(canvasElement, "Super Express")).getByRole("cell", {
        name: "About 2 weeks",
      }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** Cover reads only on the levels that carry a rate
 * (shared-ui-grading-submission-SC-04). */
export const CoverColumn: Story = {
  play: async ({ canvasElement }) => {
    expect(
      within(levelRow(canvasElement, "Express")).getByRole("cell", {
        name: "1.5% of declared value",
      }),
    ).toBeInTheDocument();
    expect(
      within(levelRow(canvasElement, "Super Express")).getByRole("cell", {
        name: "2% of declared value",
      }),
    ).toBeInTheDocument();
    expect(
      within(levelRow(canvasElement, "Value")).getByRole("cell", {
        name: FEE_SHEET_COPY.noCover,
      }),
    ).toBeInTheDocument();
  },
};

/** Three graders, one sheet each, picked by id and marked selected
 * (shared-ui-grading-submission-SC-05). */
export const ThreeGraders: Story = {
  args: { graders: THREE_SHEETS },
  render: (args) => <Consumer {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cgc = canvas.getByRole("button", { name: "CGC" });
    expect(cgc).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(cgc);
    expect(args.onSelectGrader).toHaveBeenCalledWith("cgc");
    expect(cgc).toHaveAttribute("aria-pressed", "true");
    expect(canvas.getByRole("button", { name: "PSA" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      canvas.getByText("These figures are examples until CGC confirms them."),
    ).toBeInTheDocument();
  },
};

/** The picker's levels as a consumer reads them off the one PSA record. */
const PSA_PICKER_LEVELS: readonly GradingPickerLevel[] = PSA_SHEET.levels.map(
  (level) => {
    if (!level.ceiling || !level.feePerCard) {
      throw new Error(`PSA_SHEET: ${level.id} carries no figures`);
    }
    return {
      id: level.id,
      name: level.name,
      state: "open",
      ceiling: level.ceiling,
      feePerCard: level.feePerCard,
      weeks: level.weeks,
    };
  },
);

/** The sheet and the picker each draw the one record they were given, and
 * neither reports on the other (shared-ui-grading-submission-SC-59). */
export const OneRecordTwoDrawings: Story = {
  render: (args) => (
    <>
      <GradingFeeSheet {...args} />
      <GradingLevelPicker
        copy={LEVEL_PICKER_COPY}
        graders={GRADERS}
        highestDeclared={hkd(380000)}
        levels={PSA_PICKER_LEVELS}
        locale="en"
        onSelectGrader={args.onSelectGrader}
        onSelectLevel={fn()}
        selectedGraderId="psa"
      />
    </>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [level, fee, picked] of [
      ["Value", "HK$250", /^Value .*HK\$250/],
      ["Regular", "HK$400", /^Regular .*HK\$400/],
      ["Express", "HK$550", /^Express .*HK\$550/],
      ["Super Express", "HK$1,200", /^Super Express .*HK\$1,200/],
    ] as const) {
      expect(
        within(levelRow(canvasElement, level)).getByRole("cell", {
          name: fee,
        }),
      ).toBeInTheDocument();
      expect(canvas.getByRole("radio", { name: picked })).toBeInTheDocument();
    }
    expect(args.onSelectGrader).not.toHaveBeenCalled();
  },
};

/** A grader nobody has priced lists its levels, each carrying no figure
 * where a price would be, and says why (the capability's Levels as data,
 * shared-ui-grading-submission-SC-68). */
export const UnpricedGrader: Story = {
  args: { graders: [UNPRICED_SHEET], selectedGraderId: "bgs" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(UNPRICED_SHEET.figuresLine ?? ""),
    ).toBeInTheDocument();
    const row = levelRow(canvasElement, "Value");
    expect(
      within(row).getAllByRole("cell", { name: "—" }).length,
    ).toBeGreaterThanOrEqual(2);
    expect(row.textContent).not.toMatch(/HK\$/);
  },
};

/** The title takes the rung the page gives it under its own headings
 * (shared-ui-grading-submission-SC-69). */
export const TitleUnderASection: Story = {
  args: { titleAs: "h3" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByRole("heading", {
        level: 3,
        name: FEE_SHEET_COPY.title,
      }),
    ).toBeInTheDocument();
  },
};
