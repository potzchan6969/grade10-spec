import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TopUpHistoryPrototype } from "./top-up-history-prototype";

const meta = {
  title: "Loyalty/Top Ups/Screens/Top Up History",
  component: TopUpHistoryPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopUpHistoryPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every pack bought or tried: credited, held, charged back and refused. */
export const Default: Story = {
  args: { state: "default" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Top-Up History" }),
    ).toBeInTheDocument();
    for (const status of [
      "Under review",
      "Added",
      "Charged back",
      "Not approved",
    ]) {
      expect(canvas.getByText(status)).toBeVisible();
    }
    expect(canvas.getByText("HK$45,000")).toBeVisible();
    expect(
      canvas.getByText("Your card is charged only if this is approved."),
    ).toBeVisible();
    expect(canvas.getAllByRole("link", { name: "View" }).length).toBe(2);
  },
};

/** Nothing bought yet: the empty state offers the picker. */
export const Empty: Story = {
  args: { state: "empty" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No top-ups yet")).toBeVisible();
    const action = canvas.getByText("Top up points").closest("a");
    expect(action).not.toBeNull();
    expect(action).toHaveAttribute(
      "href",
      "?path=/story/loyalty-top-ups-screens-top-up-dialog--default",
    );
  },
};

/** Rows stack as cards at a phone width. */
export const Narrow: Story = {
  args: { state: "default" },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Top-Up History" }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("table")).not.toBeInTheDocument();
    expect(canvas.getByText("Under review")).toBeVisible();
    expect(canvas.getByText("50,000 points")).toBeVisible();
  },
};
