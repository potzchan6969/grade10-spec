import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, within } from "storybook/test";
import {
  BEFORE_NOTES,
  BOOKED_ACTS,
  BOOKED_BODY_COPY,
  CALLED_BODY_COPY,
  CANCEL_PANEL_COPY,
  CANCELLED_BODY_COPY,
  ENDED_ACTS,
  PAID_FACTS,
  PASSED_BODY_COPY,
  RECONNECTING_COPY,
  STRUCK_FACTS,
  TODAY_ACTS,
  TODAY_BODY_COPY,
  TOLD_ROWS,
  VISIT_FACTS,
  VISIT_NAME,
} from "./fixtures";
import { VisitBody } from "./visit-body";
import { VisitCancelPanel } from "./visit-cancel-panel";

const meta = {
  title: "Appointment/Visit/Blocks/VisitBody",
  component: VisitBody,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  /* A said toast must not outlive its story into the next file's frame. */
  beforeEach: () => () => {
    toast.dismiss();
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[390px]">
        <Story />
        <Toast position="bottom-center" />
      </div>
    ),
  ],
  args: {
    copy: BOOKED_BODY_COPY,
    tone: "plain",
    name: VISIT_NAME,
    acts: BOOKED_ACTS,
    facts: VISIT_FACTS,
    before: BEFORE_NOTES,
    told: TOLD_ROWS,
    onDismiss: fn(),
  },
} satisfies Meta<typeof VisitBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Before the day: the compact pass, Change time and Cancel, what to bring. */
export const Booked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Grading Submission" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Cancel visit" })).toBeVisible();
    expect(canvas.getByRole("region", { name: VISIT_NAME })).toBeVisible();
    expect(canvas.queryByText(/BK-/)).toBeNull();
    expect(
      canvas.getByRole("region", { name: "Before you come" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("region", { name: "What you told us" }),
    ).toBeVisible();
  },
};

/** On the day: the large pass, Running late first, the weather after the acts. */
export const Today: Story = {
  args: {
    copy: TODAY_BODY_COPY,
    tone: "ink",
    acts: TODAY_ACTS,
    passSize: "day",
    noticeAt: "afterActs",
  },
  play: async ({ canvasElement }) => {
    const order = [
      ...canvasElement.querySelectorAll(
        '[data-slot="act-row"], [data-slot="visit-notice"]',
      ),
    ].map((node) => node.getAttribute("data-slot"));
    expect(order).toEqual(["act-row", "visit-notice"]);
  },
};

/** Paid: the deposit and when it comes back, among the facts. */
export const Paid: Story = {
  args: { facts: PAID_FACTS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$100.00 deposit")).toBeVisible();
  },
};

/** Just moved: said as a toast, gone by itself. */
export const Said: Story = {
  args: {
    copy: {
      ...BOOKED_BODY_COPY,
      said: "Moved to Thu 3 Sep, 11:15. We emailed alex@example.com.",
    },
  },
  play: async () => {
    expect(
      await screen.findByText(
        "Moved to Thu 3 Sep, 11:15. We emailed alex@example.com.",
      ),
    ).toBeInTheDocument();
  },
};

/** A sheet open over the page: the acts stay behind the scrim. */
export const Cancelling: Story = {
  args: {
    panel: (
      <VisitCancelPanel
        copy={CANCEL_PANEL_COPY}
        more=""
        onClose={fn()}
        onConfirm={fn()}
        onMoreChange={fn()}
        onReasonChange={fn()}
        pending={false}
        reason={null}
      />
    ),
  },
  play: async () => {
    expect(
      await screen.findByRole("dialog", { name: "Cancel your visit?" }),
    ).toBeVisible();
  },
};

export const Called: Story = {
  args: {
    copy: CALLED_BODY_COPY,
    tone: "ink",
    acts: [],
    told: undefined,
    passSize: "day",
  },
};

/** Time passed: the held time is gone, so book another. */
export const TimePassed: Story = {
  args: { copy: PASSED_BODY_COPY, tone: "warn", before: undefined },
};

/** Called off: the time struck, the reason in a plain notice, and no pass. */
export const Cancelled: Story = {
  args: {
    copy: CANCELLED_BODY_COPY,
    tone: "bad",
    name: null,
    acts: ENDED_ACTS,
    facts: STRUCK_FACTS,
    before: undefined,
    told: undefined,
  },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement
        .querySelector('[data-slot="visit-notice"]')
        ?.getAttribute("data-tone"),
    ).toBe("plain");
  },
};

/** Lost signal: what it last knew, with Try now. */
export const Reconnecting: Story = {
  args: {
    reconnecting: { copy: RECONNECTING_COPY, busy: false, onRetry: fn() },
  },
};
