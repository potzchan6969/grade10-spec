import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MINE_SIGN_IN_COPY } from "./fixtures";
import { MyConsignmentsSignIn } from "./my-consignments-sign-in";

const meta = {
  title: "Consignment Mine/MyConsignmentsSignIn",
  component: MyConsignmentsSignIn,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: MINE_SIGN_IN_COPY, onSignIn: fn() },
} satisfies Meta<typeof MyConsignmentsSignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The invitation, pressing it reported once. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Sign in to see your consignments"),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    expect(args.onSignIn).toHaveBeenCalledTimes(1);
  },
};

/** No way to sign in from here: the invitation only says so. */
export const WithoutAction: Story = {
  args: { onSignIn: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Sign in" })).toBeNull();
  },
};
