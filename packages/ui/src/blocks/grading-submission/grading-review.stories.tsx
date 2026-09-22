import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { GOOD_TO_KNOW, hkd, REVIEW_COPY, REVIEW_SCHEDULE } from "./fixtures";
import { GradingReview, type GradingUpchargeWarning } from "./grading-review";

const WARNING: GradingUpchargeWarning = {
  cardId: "card_charizard",
  cardLine: "Charizard, Base Set 4/102, at PSA 10",
  level: "Express",
  difference: hkd(30000),
  higherLevelFee: hkd(55000),
};

const meta = {
  title: "Grading Submission/GradingReview",
  component: GradingReview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: REVIEW_COPY,
    summary: "4 cards to PSA, Regular, back in about 6 weeks",
    schedule: REVIEW_SCHEDULE,
    totals: { declared: hkd(800000), fee: hkd(100000) },
    goodToKnow: GOOD_TO_KNOW,
    consented: false,
    locale: "en",
    onEdit: fn(),
    onConsent: fn(),
    onBook: fn(),
    onSaveForLater: fn(),
  },
} satisfies Meta<typeof GradingReview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The schedule, the totals and the lines to know, then the booking. */
export const Review: Story = {
  args: { consented: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Declared in total: HK$8,000")).toBeInTheDocument();
    expect(canvas.getByText("Fee: HK$1,000")).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Book the Drop-off" }),
    );
    expect(args.onBook).toHaveBeenCalled();
  },
};

/** The cover reads under the fee, per card and in total. */
export const TotalsWithCover: Story = {
  args: {
    totals: { declared: hkd(800000), fee: hkd(100000), cover: hkd(12000) },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cover: HK$120")).toBeInTheDocument();
  },
};

/** A minimum grade reads beside the card it belongs to. */
export const MinimumGradeOnTheSchedule: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Minimum grade: PSA 9")).toBeInTheDocument();
  },
};

/** A card that could move up names the level and both prices. */
export const UpchargeWarning: Story = {
  args: { warnings: [WARNING] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("The grader would move it to: Express"),
    ).toBeInTheDocument();
    expect(
      canvas.getByText("Difference due before collection: HK$300"),
    ).toBeInTheDocument();
    expect(
      canvas.getByText("That level costs a card now: HK$550"),
    ).toBeInTheDocument();
  },
};

/** No card above a ceiling, no warning anywhere on the review. */
export const NoWarning: Story = {
  args: { warnings: [] },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="grading-review-warnings"]'),
    ).toBeNull();
  },
};

/** The five lines read in the order they were given. */
export const GoodToKnow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lines = canvasElement.querySelectorAll(
      '[data-slot="grading-review-good-to-know"] [data-slot="list-item"]',
    );
    expect(lines).toHaveLength(5);
    expect(canvas.getByText(GOOD_TO_KNOW[0] ?? "")).toBeInTheDocument();
  },
};

/** Nothing is booked before the collection statement is ticked. */
export const ConsentUnticked: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Book the Drop-off" }),
    ).toBeDisabled();
    expect(args.onBook).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("checkbox"));
    expect(args.onConsent).toHaveBeenCalledWith(true);
  },
};

/** While the shop answers, neither booking nor saving is offered. */
export const Booking: Story = {
  args: { consented: true, pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Book the Drop-off" }),
    ).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "Save and Book Later" }),
    ).toBeDisabled();
  },
};

/** A refused booking reads the refusal it was given, and books nothing. */
export const PlanExpiredMeanwhile: Story = {
  args: {
    consented: true,
    error: "This plan expired on 1 June. Start a submission again.",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "This plan expired on 1 June. Start a submission again.",
      ),
    ).toBeInTheDocument();
    expect(args.onBook).not.toHaveBeenCalled();
  },
};
