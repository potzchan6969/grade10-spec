import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MINE_LIST_COPY, MINE_SUMMARIES } from "./fixtures";
import { MyConsignmentList } from "./my-consignment-list";

const meta = {
  title: "Consignment Mine/MyConsignmentList",
  component: MyConsignmentList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: MINE_LIST_COPY,
    state: { status: "ready", data: MINE_SUMMARIES },
    onOpen: fn(),
    onRetry: fn(),
    onSignIn: fn(),
  },
} satisfies Meta<typeof MyConsignmentList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every consignment, a card each, in the order given. */
export const Ready: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelectorAll('[data-slot="consignment-mine-card"]'),
    ).toHaveLength(3);
    await userEvent.click(canvas.getAllByRole("button", { name: "Open" })[1]);
    expect(args.onOpen).toHaveBeenCalledWith("CN-2026-0031");
  },
};

export const Loading: Story = {
  args: { state: { status: "loading" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("status", { name: "Loading your consignments…" }),
    ).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { state: { status: "ready", data: [] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing consigned yet")).toBeInTheDocument();
  },
};

export const Failed: Story = {
  args: { state: { status: "error" } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

/** Signed out: the invitation alone, no list. */
export const SignedOut: Story = {
  args: { state: { status: "signedOut" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Sign in to see your consignments"),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="consignment-mine-list"]'),
    ).toBeNull();
  },
};
