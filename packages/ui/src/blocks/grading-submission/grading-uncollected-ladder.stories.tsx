import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_TIME_ZONE,
  LADDER_COPY,
  LADDER_RUNGS,
  NOTICE_POSTED_ON,
  READY_ON,
  VAULT_LINE,
} from "./fixtures";
import { GradingUncollectedLadder } from "./grading-uncollected-ladder";

const meta = {
  title: "Grading Submission/GradingUncollectedLadder",
  component: GradingUncollectedLadder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LADDER_COPY,
    rungs: LADDER_RUNGS,
    readyOn: READY_ON,
    cardsHeld: 4,
    vaultLine: VAULT_LINE,
    locale: "en",
    timeZone: FIXTURE_TIME_ZONE,
  },
} satisfies Meta<typeof GradingUncollectedLadder>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The day each rung falls on, in the shop's zone. */
const RUNG_DAYS = ["20 Jun 2026", "15 Jul 2026", "14 Aug 2026", "13 Sep 2026"];

/** Every rung with its day, none of them reached, and the ready day and the
 * cards held as given (shared-ui-grading-submission-SC-51). */
export const NoneReached: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ready since 1 Jun 2026")).toBeInTheDocument();
    expect(canvas.getByText("Cards we hold: 4")).toBeInTheDocument();
    const rungs = canvas.getAllByRole("listitem");
    expect(rungs).toHaveLength(LADDER_RUNGS.length);
    rungs.forEach((rung, index) => {
      expect(
        within(rung).getByText(LADDER_RUNGS[index]?.label ?? ""),
      ).toBeInTheDocument();
      expect(
        within(rung).getByText(RUNG_DAYS[index] ?? ""),
      ).toBeInTheDocument();
    });
    expect(canvas.queryByText("Passed")).toBeNull();
    expect(canvas.getByText(VAULT_LINE)).toBeInTheDocument();
  },
};

/** A reminder already sent reads as passed; the rungs after it do not
 * (shared-ui-grading-submission-SC-52). */
export const Reminded: Story = {
  args: {
    rungs: LADDER_RUNGS.map((rung, index) =>
      index === 0 ? { ...rung, passed: true } : rung,
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Passed")).toHaveLength(1);
  },
};

/** The reminders and storage reached read as passed, the notice does not; the
 * fee accrues a card a month from that day
 * (shared-ui-grading-submission-SC-52). */
export const Storage: Story = {
  args: {
    rungs: LADDER_RUNGS.map((rung, index) =>
      index <= 2 ? { ...rung, passed: true } : rung,
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Passed")).toHaveLength(3);
    const notice = canvas
      .getAllByRole("listitem")
      .find((rung) => within(rung).queryByText("Written notice, day 180"));
    expect(within(notice as HTMLElement).queryByText("Passed")).toBeNull();
    expect(canvas.getByText("HK$30")).toBeInTheDocument();
  },
};

/** The posted notice reads its posting day and the days it gives
 * (shared-ui-grading-submission-SC-53). */
export const Notice: Story = {
  args: {
    rungs: LADDER_RUNGS.map((rung) =>
      rung.id === "notice-180"
        ? {
            ...rung,
            passed: true,
            postedOn: NOTICE_POSTED_ON,
            noticeLine: "30 days from the posting day.",
          }
        : { ...rung, passed: true },
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Notice posted 20 Sep 2026")).toBeInTheDocument();
    expect(
      canvas.getByText("30 days from the posting day."),
    ).toBeInTheDocument();
  },
};

/** A card withdrawn, paid out or vaulted is out of the count before it
 * arrives (shared-ui-grading-submission-SC-51). */
export const CardsExcluded: Story = {
  args: { cardsHeld: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cards we hold: 2")).toBeInTheDocument();
  },
};
