import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { GOOD_TO_KNOW, hkd, REVIEW_COPY, REVIEW_SCHEDULE } from "./fixtures";
import {
  GradingReview,
  type GradingReviewCopy,
  type GradingUpchargeWarning,
} from "./grading-review";

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

/** The items of the list a heading leads, in order. */
function itemsUnder(canvasElement: HTMLElement, heading: string) {
  const title = within(canvasElement).getByRole("heading", { name: heading });
  return within(title.parentElement as HTMLElement).getAllByRole("listitem");
}

/** One row per card with the minimum grade beside its card, the totals, the
 * lines to know in the order given, then the booking once the statement is
 * ticked (shared-ui-grading-submission-SC-24,
 * shared-ui-grading-submission-SC-27). */
export const Review: Story = {
  args: { consented: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = itemsUnder(canvasElement, REVIEW_COPY.scheduleTitle);
    expect(rows).toHaveLength(REVIEW_SCHEDULE.length);
    expect(within(rows[0] as HTMLElement).getByText("Charizard")).toBeVisible();
    expect(
      within(rows[0] as HTMLElement).getByText("Minimum grade: PSA 9"),
    ).toBeInTheDocument();
    expect(
      itemsUnder(canvasElement, REVIEW_COPY.goodToKnowTitle).map(
        (item) => item.textContent,
      ),
    ).toEqual(GOOD_TO_KNOW);
    expect(canvas.getByText("Declared in total: HK$8,000")).toBeInTheDocument();
    expect(canvas.getByText("Fee: HK$1,000")).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Book the drop-off" }),
    );
    expect(args.onBook).toHaveBeenCalled();
  },
};

/** The three totals read as given, the cover beside the fee
 * (shared-ui-grading-submission-SC-24). */
export const TotalsWithCover: Story = {
  args: {
    totals: { declared: hkd(800000), fee: hkd(100000), cover: hkd(12000) },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Declared in total: HK$8,000")).toBeInTheDocument();
    expect(canvas.getByText("Fee: HK$1,000")).toBeInTheDocument();
    expect(canvas.getByText("Cover: HK$120")).toBeInTheDocument();
  },
};

/** A minimum grade reads beside the card it belongs to
 * (shared-ui-grading-submission-SC-24). */
export const MinimumGradeOnTheSchedule: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Minimum grade: PSA 9")).toBeInTheDocument();
  },
};

/** A card that could move up names the level and both prices
 * (shared-ui-grading-submission-SC-25). */
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

/** No card above a ceiling, no warning anywhere on the review
 * (shared-ui-grading-submission-SC-26). */
export const NoWarning: Story = {
  args: { warnings: [] },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("heading", {
        name: REVIEW_COPY.warningTitle,
      }),
    ).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="grading-review-warnings"]'),
    ).toBeNull();
  },
};

/** The five lines read in the order they were given
 * (shared-ui-grading-submission-SC-24). */
export const GoodToKnow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lines = canvasElement.querySelectorAll(
      '[data-slot="grading-review-good-to-know"] [data-slot="list-item"]',
    );
    expect(lines).toHaveLength(5);
    expect(canvas.getByText(GOOD_TO_KNOW[0] ?? "")).toBeInTheDocument();
    expect(
      itemsUnder(canvasElement, REVIEW_COPY.goodToKnowTitle).map(
        (item) => item.textContent,
      ),
    ).toEqual(GOOD_TO_KNOW);
  },
};

/** Nothing is booked before the collection statement is ticked, and the tick
 * reports through its own callback (shared-ui-grading-submission-SC-27). */
export const ConsentUnticked: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Book the drop-off" }),
    ).toBeDisabled();
    expect(args.onBook).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("checkbox"));
    expect(args.onConsent).toHaveBeenCalledWith(true);
  },
};

/** While the shop answers, neither booking nor saving is offered
 * (shared-ui-grading-submission-SC-27). */
export const Booking: Story = {
  args: { consented: true, pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Book the drop-off" }),
    ).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "Save and book later" }),
    ).toBeDisabled();
  },
};

/** A refused booking reads the refusal it was given, and books nothing;
 * saving for later stays offered beside the withdrawn booking
 * (shared-ui-grading-submission-SC-28, shared-ui-grading-submission-SC-79). */
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
    const book = canvas.getByRole("button", { name: "Book the drop-off" });
    expect(book).toBeDisabled();
    await userEvent.click(book, { pointerEventsCheck: 0 });
    expect(args.onBook).not.toHaveBeenCalled();
    expect(
      canvas.getByRole("button", { name: "Save and book later" }),
    ).toBeEnabled();
  },
};

/** The editor's review: a kept list read for its totals and its warning,
 * neither booked nor ticked again, and saved in the words it is handed
 * (shared-ui-grading-submission-SC-74). */
export const KeptPlanEditor: Story = {
  args: {
    copy: { ...REVIEW_COPY, saveForLater: "Save changes" },
    schedule: REVIEW_SCHEDULE.slice(0, 2),
    warnings: [WARNING],
  },
  render: ({ consented, onConsent, onBook, ...review }) => (
    <GradingReview {...review} />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step(
      "shared-ui-grading-submission-SC-74 - A review given no booking offers neither the booking nor the statement",
      async () => {
        expect(canvas.queryByRole("checkbox")).toBeNull();
        expect(
          canvas.queryByRole("button", { name: "Book the drop-off" }),
        ).toBeNull();
        expect(
          itemsUnder(canvasElement, REVIEW_COPY.scheduleTitle),
        ).toHaveLength(2);
        expect(
          canvas.getByText("Declared in total: HK$8,000"),
        ).toBeInTheDocument();
        expect(canvas.getByText("Fee: HK$1,000")).toBeInTheDocument();
        expect(
          canvas.getByText("Difference due before collection: HK$300"),
        ).toBeInTheDocument();
        await userEvent.click(
          canvas.getByRole("button", { name: "Save changes" }),
        );
        expect(args.onSaveForLater).toHaveBeenCalled();
      },
    );
  },
};

/** The editor's save refused by name: the refusal reads, and Save changes is
 * withdrawn beside it, since saving is the act it refused
 * (shared-ui-grading-submission-SC-79). */
export const KeptPlanEditorRefused: Story = {
  args: {
    copy: { ...REVIEW_COPY, saveForLater: "Save changes" },
    schedule: REVIEW_SCHEDULE.slice(0, 2),
    error:
      "Our staff have started checking your cards, so this can no longer be changed here. Ask at the counter.",
  },
  render: ({ consented, onConsent, onBook, ...review }) => (
    <GradingReview {...review} />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step(
      "shared-ui-grading-submission-SC-79 - A refusal withdraws the act it refused",
      async () => {
        expect(
          canvas.getByText(
            "Our staff have started checking your cards, so this can no longer be changed here. Ask at the counter.",
          ),
        ).toBeInTheDocument();
        const save = canvas.getByRole("button", { name: "Save changes" });
        expect(save).toBeDisabled();
        await userEvent.click(save, { pointerEventsCheck: 0 });
        expect(args.onSaveForLater).not.toHaveBeenCalled();
      },
    );
  },
};

/** The review's words in Traditional Chinese, as a second brand hands them over. */
const REVIEW_COPY_ZH_HANT: GradingReviewCopy = {
  title: "核對後預約交卡",
  scheduleTitle: "你列出的卡牌",
  declaredTotalLabel: "申報價值總額",
  feeLabel: "櫃檯應付費用",
  coverLabel: "保額",
  minimumGradeLabel: "最低評分",
  warningTitle: "有一張卡可能要補差額",
  warningLevelLabel: "評級公司會升至",
  warningDifferenceLabel: "領回前須補付",
  warningHigherFeeLabel: "該級別現在每張卡",
  goodToKnowTitle: "預約前請留意",
  consent: "我同意卡牌的領回方式。",
  book: "預約交卡",
  saveForLater: "儲存，稍後再約",
  edit: "修改",
};

/** Every label, line and control reads the consumer's Traditional Chinese
 * copy and nothing else (shared-ui-grading-submission-SC-54). */
export const TraditionalChinese: Story = {
  args: {
    copy: REVIEW_COPY_ZH_HANT,
    locale: "zh-Hant",
    summary: "4 張卡 · PSA Regular，約 6 星期回來",
    schedule: [
      {
        id: "card_charizard",
        name: "噴火龍",
        setLine: "基本系列 · 4/102",
        declaredValue: hkd(380000),
        minimumGrade: "PSA 9",
        cover: hkd(3800),
      },
    ],
    totals: { declared: hkd(800000), fee: hkd(100000), cover: hkd(12000) },
    warnings: [{ ...WARNING, cardLine: "噴火龍，基本系列 4/102，評到 PSA 10" }],
    goodToKnow: [
      "即使卡牌未獲評級，費用一樣要收",
      "卡牌可能被升上一級",
      "回來日期只是預計",
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const exactly = (words: string) =>
      new RegExp(words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    for (const words of Object.values(REVIEW_COPY_ZH_HANT)) {
      expect(canvas.getAllByText(exactly(words)).length).toBeGreaterThan(0);
    }
    for (const words of Object.values(REVIEW_COPY)) {
      expect(canvas.queryByText(exactly(words))).toBeNull();
    }
    expect(canvas.getByRole("button", { name: "預約交卡" })).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "儲存，稍後再約" }),
    ).toBeEnabled();
    expect(canvas.getByRole("button", { name: "修改" })).toBeEnabled();
    expect(
      canvas.getByRole("checkbox", { name: "我同意卡牌的領回方式。" }),
    ).not.toBeChecked();
  },
};
