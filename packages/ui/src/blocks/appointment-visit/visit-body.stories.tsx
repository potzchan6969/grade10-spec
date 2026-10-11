import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  BEFORE_NOTES,
  BOOKED_ACTS,
  BOOKED_BODY_COPY,
  CALLED_BODY_COPY,
  CANCEL_PANEL_COPY,
  CANCELLED_BODY_COPY,
  ENDED_ACTS,
  PASSED_BODY_COPY,
  RECONNECTING_COPY,
  STRUCK_FACTS,
  TODAY_ACTS,
  TODAY_BODY_COPY,
  TOLD_ROWS,
  VISIT_CODE,
  VISIT_FACTS,
  WAIT_HREF,
} from "./fixtures";
import { VisitBody } from "./visit-body";
import { VisitCancelPanel } from "./visit-cancel-panel";

const meta = {
  title: "Appointment Visit/VisitBody",
  component: VisitBody,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: BOOKED_BODY_COPY,
    tone: "info",
    code: VISIT_CODE,
    acts: BOOKED_ACTS,
    facts: VISIT_FACTS,
    before: BEFORE_NOTES,
    told: TOLD_ROWS,
    onDismiss: fn(),
  },
} satisfies Meta<typeof VisitBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Before the day: the pass, Change time and Cancel, what to bring. */
export const Booked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Grading Submission" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Cancel visit" })).toBeVisible();
    expect(
      canvas.getByRole("region", { name: "Before you come" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("region", { name: "What you told us" }),
    ).toBeVisible();
  },
};

/** On the day: the typhoon notice and Running late first. */
export const Today: Story = {
  args: { copy: TODAY_BODY_COPY, tone: "ink", acts: TODAY_ACTS },
};

/** Just moved: said until dismissed. */
export const Said: Story = {
  args: {
    copy: {
      ...BOOKED_BODY_COPY,
      said: "Moved to Thu 3 Sep, 11:15. We emailed alex@example.com.",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};

/** A panel open: the acts give way to it. */
export const Cancelling: Story = {
  args: {
    acts: [],
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
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-slot="act-row"]')).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="visit-cancel"]'),
    ).not.toBeNull();
  },
};

export const Called: Story = {
  args: { copy: CALLED_BODY_COPY, tone: "ink", acts: [], told: undefined },
};

/** Time passed: walk in now, with the wait one link away. */
export const TimePassed: Story = {
  args: {
    copy: PASSED_BODY_COPY,
    tone: "warn",
    noticeHref: WAIT_HREF,
    before: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "See the wait" })).toHaveAttribute(
      "href",
      WAIT_HREF,
    );
  },
};

/** Called off: the time struck, no pass, the code kept as a fact. */
export const Cancelled: Story = {
  args: {
    copy: CANCELLED_BODY_COPY,
    tone: "bad",
    acts: ENDED_ACTS,
    facts: STRUCK_FACTS,
    before: undefined,
    told: undefined,
  },
};

/** Lost signal: what it last knew, with Try now. */
export const Reconnecting: Story = {
  args: {
    reconnecting: { copy: RECONNECTING_COPY, busy: false, onRetry: fn() },
  },
};
