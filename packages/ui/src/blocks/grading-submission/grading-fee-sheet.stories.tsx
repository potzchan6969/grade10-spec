import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  ABOVE_TOP_LINE,
  FEE_SHEET_COPY,
  PSA_SHEET,
  THREE_SHEETS,
} from "./fixtures";
import { GradingFeeSheet } from "./grading-fee-sheet";

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

/** One grader reads in full, and draws no grader control. */
export const OneGrader: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Value")).toBeInTheDocument();
    expect(canvas.getByText("About 8 weeks")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "PSA" })).toBeNull();
  },
};

/** Cover reads only on the levels that carry a rate. */
export const CoverColumn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1.5% of declared value")).toBeInTheDocument();
    expect(canvas.getByText("No cover")).toBeInTheDocument();
  },
};

/** Three graders, one sheet each, picked by id. */
export const ThreeGraders: Story = {
  args: { graders: THREE_SHEETS },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "CGC" }));
    expect(args.onSelectGrader).toHaveBeenCalledWith("cgc");
  },
};
