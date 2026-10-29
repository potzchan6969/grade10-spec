import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CaseListPrototype } from "./case-list-prototype";

const meta = {
  title: "Finance/Collector Pages/Prototypes/Case List",
  component: CaseListPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CaseListPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two cases the collector holds, each with its status and an Open action. */
export const Cards: Story = {
  args: { state: "cards" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your cases" }),
    ).toBeVisible();
    expect(canvas.getByText("1999 Charizard")).toBeVisible();
    expect(canvas.getByText("Waiting on you")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Open 1999 Charizard" }),
    ).toBeVisible();
  },
};

/** A draft a collector has not sent: its photographs so far, and the next step. */
export const Draft: Story = {
  args: { state: "draft" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("2 of 10 photographs")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Resume Vintage booster box" }),
    ).toBeVisible();
  },
};

/** No cases yet: the empty panel with the one action that starts a request. */
export const Empty: Story = {
  args: { state: "empty" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing here yet")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Start a request" }),
    ).toBeVisible();
  },
};

/** The list is loading: placeholders in one busy status. */
export const Loading: Story = {
  args: { state: "loading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveAccessibleName(
      "Loading your cases…",
    );
  },
};
