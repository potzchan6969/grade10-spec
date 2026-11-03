import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { LIST_COPY, PAST_ROWS, UPCOMING_ROWS } from "./fixtures";
import { VisitList } from "./visit-list";

const meta = {
  title: "Appointment/Visit/Blocks/VisitList",
  component: VisitList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LIST_COPY,
    upcoming: UPCOMING_ROWS,
    past: PAST_ROWS,
    onOpen: fn(),
  },
} satisfies Meta<typeof VisitList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Upcoming first, past after; each row opens its visit. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_6faf5196-9061-4ec9-b20f-a166dbfdc427" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Upcoming" })).toBeVisible();
    expect(canvas.getByRole("heading", { name: "Past" })).toBeVisible();
    await userEvent.click(
      canvas
        .getAllByRole("button", { name: /Grading Submission/ })
        .at(0) as HTMLElement,
    );
    expect(args.onOpen).toHaveBeenCalledWith("bk_live");
  },
};

/** A row with an address is a link to its visit. */
export const Linked: Story = {
  parameters: {
    verification: { caseId: "vc_40e1dd88-25c7-4189-954d-82292d169b4e" },
  },
  args: {
    upcoming: UPCOMING_ROWS.map((row) => ({
      ...row,
      href: `#/visit/${row.id}`,
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getAllByRole("link", { name: /Grading Submission/ }).at(0),
    ).toHaveAttribute("href", "#/visit/bk_live");
  },
};

/** Nothing past yet: the past heading is not drawn. */
export const UpcomingOnly: Story = {
  parameters: {
    verification: { caseId: "vc_fae2ecde-38fc-42a7-ac81-270af125a0d1" },
  },
  args: { past: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("heading", { name: "Past" })).toBeNull();
  },
};
