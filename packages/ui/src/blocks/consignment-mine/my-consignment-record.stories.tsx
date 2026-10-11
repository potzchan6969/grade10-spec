import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MINE_DETAIL, MINE_RECORD_COPY } from "./fixtures";
import { MyConsignmentRecord } from "./my-consignment-record";

const meta = {
  title: "Consignment Mine/MyConsignmentRecord",
  component: MyConsignmentRecord,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: MINE_RECORD_COPY,
    state: { status: "ready", data: MINE_DETAIL },
    onRetry: fn(),
    onBack: fn(),
    onSignIn: fn(),
  },
} satisfies Meta<typeof MyConsignmentRecord>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The way back, then the consignment. */
export const Ready: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Your consignments" }),
    );
    expect(args.onBack).toHaveBeenCalledTimes(1);
    expect(canvas.getByText("Charizard Base Set")).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: { state: { status: "loading" } },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="consignment-mine-loading"]'),
    ).not.toBeNull();
  },
};

/** A reference that is not the consignor's. */
export const NotFound: Story = {
  args: { state: { status: "notFound" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("We could not find that consignment"),
    ).toBeInTheDocument();
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

/** Signed out: the invitation alone, with no way back. */
export const SignedOut: Story = {
  args: { state: { status: "signedOut" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("button", { name: "Your consignments" }),
    ).toBeNull();
    expect(canvas.getByRole("button", { name: "Sign in" })).toBeVisible();
  },
};

/** Without a way back none is drawn. */
export const WithoutBack: Story = {
  args: { onBack: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("button", { name: "Your consignments" }),
    ).toBeNull();
  },
};
