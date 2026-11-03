import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  FastPassControl,
  type FastPassLine,
  type FastPassSelection,
} from "./fast-pass-control";
import { FAST_PASS_COPY } from "./fixtures";

const money = (n: number) => `HK$${n.toFixed(2)}`;
const dayWord = (n: number) => (n === 1 ? "1 day" : `${n} days`);

const PEOPLE = ["Adult 1", "Adult 2", "Child"];

/** A stand-in page: one pass of three people at HK$100 a Fast Pass day. */
function Demo({
  maxDays = 2,
  start = { mode: "everyone", all: 0, per: {} },
  people = PEOPLE,
}: {
  maxDays?: number;
  start?: {
    mode: "everyone" | "each";
    all: number;
    per: Record<string, number>;
  };
  people?: readonly string[];
}) {
  const [state, setState] = useState(start);
  const line = (
    id: string,
    label: string,
    days: number,
    count: number,
    who?: string,
  ): FastPassLine => ({
    id,
    label,
    who,
    days,
    daysText: dayWord(days),
    price: days ? `+${money(days * 100 * count)}` : undefined,
  });
  const per = (name: string) => state.per[name] ?? 0;
  const slots = people.reduce((n, name) => n + per(name), 0);
  const all = people.length * maxDays;
  const missing = all - slots;
  const selection: FastPassSelection =
    state.mode === "everyone"
      ? {
          mode: "everyone",
          everyone: line(
            "everyone",
            "Everyone",
            state.all,
            people.length,
            people.length === 1 ? "1 person" : `${people.length} people`,
          ),
        }
      : {
          mode: "each",
          people: people.map((name) => line(name, name, per(name), 1)),
          tally: `${slots} of ${all} Fast Passes: ${money(slots * 100)}.`,
          nudge:
            missing > 0
              ? `${missing === 1 ? "1 more covers everyone" : `${missing} more cover everyone`}${maxDays > 1 ? ", every day." : "."}`
              : "Everyone skips the queue.",
          fillLabel:
            missing > 0
              ? `Add for everyone (+${money(missing * 100)})`
              : undefined,
        };
  return (
    <FastPassControl
      copy={FAST_PASS_COPY}
      maxDays={maxDays}
      maxDaysText={dayWord(maxDays)}
      onDaysChange={(id, days) =>
        setState((prev) =>
          id === "everyone"
            ? { ...prev, all: days }
            : { ...prev, per: { ...prev.per, [id]: days } },
        )
      }
      onFillAll={() =>
        setState((prev) => ({
          ...prev,
          per: Object.fromEntries(people.map((name) => [name, maxDays])),
        }))
      }
      onModeChange={
        people.length > 1
          ? (mode) =>
              setState((prev) =>
                mode === "each"
                  ? {
                      mode,
                      all: prev.all,
                      per: Object.fromEntries(
                        people.map((name) => [name, prev.all]),
                      ),
                    }
                  : {
                      mode,
                      per: prev.per,
                      all: Math.max(
                        0,
                        ...people.map((name) => prev.per[name] ?? 0),
                      ),
                    },
              )
          : undefined
      }
      selection={selection}
    />
  );
}

const meta = {
  title: "Ticketing/Buying/Blocks/FastPassControl",
  component: FastPassControl,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[740px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: FAST_PASS_COPY,
    maxDays: 2,
    maxDaysText: "2 days",
    onDaysChange: () => {},
    selection: {
      mode: "everyone",
      everyone: {
        id: "everyone",
        label: "Everyone",
        who: "3 people",
        days: 0,
        daysText: "0 days",
      },
    },
  },
} satisfies Meta<typeof FastPassControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One `+ Fast Pass` for everyone on the pass; pressing it adds both days
 * and it grows into the pill with a dot per day. */
export const Everyone: Story = {
  parameters: {
    verification: { caseId: "vc_a7e230f2-c035-4c50-adbb-82deff4e3c25" },
  },
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", {
        name: "Add Fast Pass for Everyone, 2 days",
      }),
    );
    const pill = canvas.getByRole("group", {
      name: "Fast Pass days for Everyone",
    });
    await expect(within(pill).getByText("2 days")).toBeVisible();
    await expect(canvas.getAllByText("+HK$600.00")[0]).toBeInTheDocument();
    await userEvent.click(
      within(pill).getByRole("button", {
        name: "One fewer Fast Pass day for Everyone",
      }),
    );
    await expect(within(pill).getByText("1 day")).toBeVisible();
    await userEvent.click(
      within(pill).getByRole("button", {
        name: "Remove Fast Pass for Everyone",
      }),
    );
    await expect(
      canvas.getByRole("button", {
        name: "Add Fast Pass for Everyone, 2 days",
      }),
    ).toBeVisible();
  },
};

/** At 390 px: the price moves under the label. */
export const EveryonePhone: Story = {
  parameters: {
    verification: { caseId: "vc_be3d6de4-9cd1-4f48-98e9-8695ca210ed6" },
  },
  name: "Everyone Phone",
  decorators: [
    (Story) => (
      <div className="w-[326px]">
        <Story />
      </div>
    ),
  ],
  render: () => <Demo start={{ mode: "everyone", all: 2, per: {} }} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText("+HK$600.00")[0]).toBeVisible();
  },
};

/** Choose per person: a pill per ticket, the tally, the nudge and Add for
 * everyone. */
export const PerPerson: Story = {
  parameters: {
    verification: { caseId: "vc_70a92047-69f9-4483-a187-a5910275c41b" },
  },
  name: "Per Person",
  render: () => (
    <Demo
      start={{ mode: "each", all: 0, per: { "Adult 1": 2, "Adult 2": 1 } }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("3 of 6 Fast Passes: HK$300.00."),
    ).toBeVisible();
    await expect(
      canvas.getByText("3 more cover everyone, every day."),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Add for everyone (+HK$300.00)" }),
    );
    await expect(canvas.getByText("Everyone skips the queue.")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Same for everyone" }),
    );
    await expect(
      canvas.getByRole("group", { name: "Fast Pass days for Everyone" }),
    ).toBeVisible();
  },
};

/** A one-day pass: one day at most, so the pill has no + and no dots. */
export const OneDay: Story = {
  parameters: {
    verification: { caseId: "vc_9421b451-da55-4baf-a73b-45d8c23c2097" },
  },
  name: "One Day",
  render: () => (
    <Demo maxDays={1} start={{ mode: "everyone", all: 1, per: {} }} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("button", { name: /^One more Fast Pass day/ }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Remove Fast Pass for Everyone" }),
    ).toBeVisible();
  },
};

/** One ticket: nobody to split from, so no Choose per person. */
export const OnePerson: Story = {
  parameters: {
    verification: { caseId: "vc_0a30cc27-acb9-41a0-a3ee-7c1173cbaa27" },
  },
  name: "One Person",
  render: () => <Demo people={["Adult"]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("button", { name: "Choose per person" }),
    ).not.toBeInTheDocument();
  },
};
